import 'dotenv/config';
import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type, GenerateContentResponse, ThinkingLevel } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;

function getAiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    throw new Error(
      'GEMINI_API_KEY is not configured. Please add your API key in Settings > Secrets.'
    );
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

function extractReadableError(error: unknown): string {
  const raw = error instanceof Error ? error.message : String(error);
  try {
    const parsed = JSON.parse(raw);
    if (parsed?.error?.message) return parsed.error.message;
  } catch {
    // Ignore non-JSON messages
  }
  return raw || 'AI request failed. Please try again.';
}

async function runWithModelFallback<T>(
  operation: (model: string) => Promise<T>
): Promise<T> {
  const models = ['gemini-4-hydrogen', 'gemini-3.1-flash-lite'];
  let lastError: unknown;

  for (let i = 0; i < models.length; i++) {
    const model = models[i];
    const isPrimary = i === 0 && models.length > 1;
    try {
      if (isPrimary) {
        return await Promise.race([
          operation(model),
          new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('503 Primary model timeout')), 5500)
          ),
        ]);
      }
      return await operation(model);
    } catch (err) {
      lastError = err;
      const msg = err instanceof Error ? err.message : String(err);
      const isTransient =
        msg.includes('503') ||
        msg.includes('UNAVAILABLE') ||
        msg.includes('429') ||
        msg.includes('high demand') ||
        msg.includes('timeout');
      if (!isTransient) {
        throw err;
      }
    }
  }

  throw lastError;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '15mb' }));

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ ok: true, service: 'ecocampus-ai' });
  });

  // 1. WasteVision AI: Multimodal waste item detection & sorting
  app.post('/api/wastevision', async (req: Request, res: Response) => {
    try {
      const { imageBase64, mimeType, notes } = req.body as {
        imageBase64?: string;
        mimeType?: string;
        notes?: string;
      };

      if (!imageBase64 || !mimeType) {
        res.status(400).json({ error: 'Image data and MIME type are required.' });
        return;
      }

      const ai = getAiClient();
      const cleanBase64 = imageBase64.includes(',')
        ? imageBase64.split(',')[1]
        : imageBase64;

      const promptText = [
        'Analyze this photograph of campus waste for EcoCampus AI at Birangana Sati Sadhani Rajyik Vishwavidyalaya (BSSRV).',
        'Identify every distinct waste item visible, classify each into the proper university waste stream (Recyclable, Compostable, Landfill, E-Waste, or Hazardous), evaluate material composition, note contamination or ambiguity, and give clear step-by-step campus disposal recommendations.',
        notes ? `Additional campus context: ${notes}` : '',
      ]
        .filter(Boolean)
        .join('\n');

      const response: GenerateContentResponse = await runWithModelFallback((model) =>
        ai.models.generateContent({
          model,
          contents: {
            parts: [
              {
                inlineData: {
                  mimeType,
                  data: cleanBase64,
                },
              },
              {
                text: promptText,
              },
            ],
          },
          config: {
            systemInstruction:
              'You are WasteVision AI, an accurate university campus waste sorting and contamination auditor. Be candid about uncertainty when items have mixed materials, hidden linings (like poly-coated coffee cups), or obscured labels.',
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                summary: {
                  type: Type.STRING,
                  description:
                    'Concise 1-2 sentence overview of the scanned waste items and sorting priority.',
                },
                primaryStream: {
                  type: Type.STRING,
                  description:
                    'One of: Recyclable, Compostable, Landfill, E-Waste, Hazardous, or Mixed Stream.',
                },
                detectedItems: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      name: { type: Type.STRING },
                      category: {
                        type: Type.STRING,
                        description:
                          'Recyclable, Compostable, Landfill, E-Waste, or Hazardous',
                      },
                      material: { type: Type.STRING },
                      bin: {
                        type: Type.STRING,
                        description:
                          'Blue (Recycling), Green (Compost), Black (Landfill), Purple (E-Waste), or Red (Hazardous)',
                      },
                      confidence: {
                        type: Type.NUMBER,
                        description: 'Confidence score between 0 and 100.',
                      },
                    },
                    required: ['name', 'category', 'material', 'bin', 'confidence'],
                  },
                },
                observations: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description:
                    '3 to 4 crisp visual observations regarding material state, moisture, residue, or lids.',
                },
                uncertainty: {
                  type: Type.OBJECT,
                  properties: {
                    level: {
                      type: Type.STRING,
                      description: 'Low, Moderate, or High',
                    },
                    explanation: {
                      type: Type.STRING,
                      description:
                        'Why ambiguity exists or confirmation that items are clearly identifiable.',
                    },
                  },
                  required: ['level', 'explanation'],
                },
                disposalRecommendations: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      stepTitle: { type: Type.STRING },
                      instruction: { type: Type.STRING },
                      targetBin: { type: Type.STRING },
                    },
                    required: ['stepTitle', 'instruction', 'targetBin'],
                  },
                },
                pointsAwarded: {
                  type: Type.INTEGER,
                  description: 'Recommended GreenScore points between 15 and 35.',
                },
              },
              required: [
                'summary',
                'primaryStream',
                'detectedItems',
                'observations',
                'uncertainty',
                'disposalRecommendations',
                'pointsAwarded',
              ],
            },
          },
        })
      );

      const rawText = (response.text ?? '').trim();
      if (!rawText) {
        res.status(502).json({ error: 'WasteVision AI returned an empty analysis.' });
        return;
      }

      res.json(JSON.parse(rawText));
    } catch (error) {
      console.error('WasteVision API error:', error);
      res.status(500).json({ error: extractReadableError(error) });
    }
  });

  // 2. EcoReport AI Photo Triage: Auto-classify & draft environmental issue from a photo
  app.post('/api/ecoreport-analyze', async (req: Request, res: Response) => {
    try {
      const { imageBase64, mimeType, location } = req.body as {
        imageBase64?: string;
        mimeType?: string;
        location?: string;
      };

      if (!imageBase64 || !mimeType) {
        res.status(400).json({ error: 'Photograph data is required for AI issue triage.' });
        return;
      }

      const ai = getAiClient();
      const cleanBase64 = imageBase64.includes(',')
        ? imageBase64.split(',')[1]
        : imageBase64;

      const response: GenerateContentResponse = await runWithModelFallback((model) =>
        ai.models.generateContent({
          model,
          contents: {
            parts: [
              {
                inlineData: {
                  mimeType,
                  data: cleanBase64,
                },
              },
              {
                text: `Inspect this campus environmental issue photo${
                  location ? ` taken near ${location}` : ''
                } at Birangana Sati Sadhani Rajyik Vishwavidyalaya (BSSRV). Classify the issue category, urgency priority, concise headline, and actionable description for campus facilities crews.`,
              },
            ],
          },
          config: {
            ...(model === 'gemini-4-hydrogen'
              ? { thinkingConfig: { thinkingLevel: ThinkingLevel.LOW } }
              : {}),
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                category: {
                  type: Type.STRING,
                  description:
                    'Must be exactly one of: Overflowing Bin, Contaminated Recycling, Water Leak, Energy Waste, Litter / Illegal Dumping, Broken Station',
                },
                priority: {
                  type: Type.STRING,
                  description: 'Must be exactly one of: Low, Medium, High',
                },
                title: {
                  type: Type.STRING,
                  description: 'Concise 8-12 word issue headline.',
                },
                description: {
                  type: Type.STRING,
                  description:
                    'Clear 2-sentence description of what is visible and what facilities action is required.',
                },
              },
              required: ['category', 'priority', 'title', 'description'],
            },
          },
        })
      );

      const rawText = (response.text ?? '').trim();
      if (!rawText) {
        res.status(502).json({ error: 'EcoReport AI returned an empty triage response.' });
        return;
      }

      res.json(JSON.parse(rawText));
    } catch (error) {
      console.error('EcoReport AI triage error:', error);
      res.status(500).json({ error: extractReadableError(error) });
    }
  });

  // 3. Green Dashboard AI Brief: Executive facilities analysis of live campus reports
  app.post('/api/green-brief', async (req: Request, res: Response) => {
    try {
      const { reports } = req.body as {
        reports?: Array<{
          id: string;
          category: string;
          location: string;
          status: string;
          priority: string;
          title: string;
        }>;
      };

      if (!reports || reports.length === 0) {
        res.status(400).json({ error: 'No campus reports available to summarize.' });
        return;
      }

      const ai = getAiClient();
      const compactReports = reports
        .slice(0, 20)
        .map(
          (r) =>
            `${r.id} | ${r.status} | ${r.priority} | ${r.category} | ${r.location} | ${r.title}`
        )
        .join('\n');

      const response: GenerateContentResponse = await runWithModelFallback((model) =>
        ai.models.generateContent({
          model,
          contents: `Analyze these current campus environmental reports for Birangana Sati Sadhani Rajyik Vishwavidyalaya (BSSRV) and produce an actionable facilities operations brief:\n\n${compactReports}`,
          config: {
            systemInstruction:
              'You are an environmental operations analyst supporting campus facilities administrators at Birangana Sati Sadhani Rajyik Vishwavidyalaya (BSSRV). Be concise, concrete, and reference actual report IDs and campus locations from the list.',
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                executiveSummary: {
                  type: Type.STRING,
                  description: '2-sentence summary of current campus workload and resolution posture.',
                },
                topPriorityAction: {
                  type: Type.STRING,
                  description: 'Specific immediate crew dispatch recommendation citing report IDs.',
                },
                hotspotInsight: {
                  type: Type.STRING,
                  description: 'Which campus location or category needs preventive attention.',
                },
              },
              required: ['executiveSummary', 'topPriorityAction', 'hotspotInsight'],
            },
          },
        })
      );

      const rawText = (response.text ?? '').trim();
      if (!rawText) {
        res.status(502).json({ error: 'Green Dashboard AI returned an empty brief.' });
        return;
      }

      res.json(JSON.parse(rawText));
    } catch (error) {
      console.error('Green Dashboard AI brief error:', error);
      res.status(500).json({ error: extractReadableError(error) });
    }
  });

  // 4. EcoAdvisor: Multi-turn campus sustainability advisor chat
  app.post('/api/ecoadvisor', async (req: Request, res: Response) => {
    try {
      const { history, message, studentSummary } = req.body as {
        history?: Array<{ role: 'user' | 'model'; text: string }>;
        message?: string;
        studentSummary?: string;
      };

      if (!message || !message.trim()) {
        res.status(400).json({ error: 'Message cannot be empty.' });
        return;
      }

      const ai = getAiClient();

      const formattedHistory = (history ?? []).map((item) => ({
        role: item.role,
        parts: [{ text: item.text }],
      }));

      const systemInstruction = [
        'You are EcoAdvisor, the official AI sustainability advisor for EcoCampus AI, developed by Team Neuro Nova for Birangana Sati Sadhani Rajyik Vishwavidyalaya (BSSRV).',
        'Give concise, practical, science-backed guidance on university waste sorting (Blue Recycling, Green Compost, Black Landfill, Purple E-Waste, Lab Hazardous), campus energy conservation, sustainable commuting, water conservation, and GreenScore participation.',
        'Format answers cleanly with short paragraphs and bullet points so students can act quickly. Never invent campus phone numbers or fake policy URLs.',
        studentSummary ? `Current campus user context: ${studentSummary}` : '',
      ]
        .filter(Boolean)
        .join('\n\n');

      const response: GenerateContentResponse = await runWithModelFallback(async (model) => {
        const chat = ai.chats.create({
          model,
          history: formattedHistory,
          config: {
            ...(model === 'gemini-4-hydrogen'
              ? { thinkingConfig: { thinkingLevel: ThinkingLevel.LOW } }
              : {}),
            systemInstruction,
          },
        });
        return chat.sendMessage({
          message: message.trim(),
        });
      });

      res.json({
        reply: response.text ?? 'I could not generate a response right now. Please try again.',
      });
    } catch (error) {
      console.error('EcoAdvisor API error:', error);
      res.status(500).json({ error: extractReadableError(error) });
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`EcoCampus AI server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start EcoCampus AI server:', err);
  process.exit(1);
});
