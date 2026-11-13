import 'dotenv/config';
import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type, GenerateContentResponse } from '@google/genai';

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

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '15mb' }));

  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ ok: true, service: 'ecocampus-ai' });
  });

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
        'Analyze this photograph of campus waste for EcoCampus AI (a university sustainability platform).',
        'Identify every distinct waste item visible, classify each into the proper university waste stream (Recyclable, Compostable, Landfill, E-Waste, or Hazardous), evaluate material composition, note contamination or ambiguity, and give clear step-by-step campus disposal recommendations.',
        notes ? `Additional campus context from student: ${notes}` : '',
      ]
        .filter(Boolean)
        .join('\n');

      const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-4-hydrogen',
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
                description: 'Concise 1-2 sentence overview of the scanned waste items and sorting priority.',
              },
              primaryStream: {
                type: Type.STRING,
                description: 'One of: Recyclable, Compostable, Landfill, E-Waste, Hazardous, or Mixed Stream.',
              },
              detectedItems: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    category: {
                      type: Type.STRING,
                      description: 'Recyclable, Compostable, Landfill, E-Waste, or Hazardous',
                    },
                    material: { type: Type.STRING },
                    bin: {
                      type: Type.STRING,
                      description: 'Blue (Recycling), Green (Compost), Black (Landfill), Purple (E-Waste), or Red (Hazardous)',
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
                description: '3 to 4 crisp visual observations regarding material state, moisture, residue, or lids.',
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
                    description: 'Why ambiguity exists or confirmation that items are clearly identifiable.',
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
      });

      const rawText = (response.text ?? '').trim();
      if (!rawText) {
        res.status(502).json({ error: 'WasteVision AI returned an empty analysis.' });
        return;
      }

      const parsed = JSON.parse(rawText);
      res.json(parsed);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to analyze waste image.';
      console.error('WasteVision API error:', error);
      res.status(500).json({ error: message });
    }
  });

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
        'Give concise, practical, science-backed guidance on university waste sorting (Blue Recycling, Green Compost, Black Landfill, Purple E-Waste, Lab Hazardous), dorm energy conservation, sustainable commuting, water conservation, and campus GreenScore participation.',
        'Format answers cleanly with short paragraphs and bullet points so students can act quickly. Never invent campus phone numbers or fake policy URLs.',
        studentSummary ? `Current student context: ${studentSummary}` : '',
      ]
        .filter(Boolean)
        .join('\n\n');

      const chat = ai.chats.create({
        model: 'gemini-4-hydrogen',
        history: formattedHistory,
        config: {
          systemInstruction,
        },
      });

      const response: GenerateContentResponse = await chat.sendMessage({
        message: message.trim(),
      });

      res.json({
        reply: response.text ?? 'I could not generate a response right now. Please try again.',
      });
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'Unable to reach EcoAdvisor.';
      console.error('EcoAdvisor API error:', error);
      res.status(500).json({ error: message });
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
