import React, { useEffect, useRef, useState } from 'react';
import {
  Send,
  Sparkles,
  RotateCcw,
  AlertCircle,
  Leaf,
  ArrowUpRight,
  User,
} from 'lucide-react';
import { ChatMessage } from '../types/eco';

interface EcoAdvisorPageProps {
  greenScore: number;
  totalReports: number;
  totalScans: number;
}

const SUGGESTED_QUESTIONS = [
  'Are coated paper coffee cups from the campus canteen recyclable or landfill?',
  'How should BSSRV students dispose of spent lithium batteries or broken lab electronics?',
  'What are the top 3 ways to reduce electricity waste across academic buildings?',
  'Why does food residue ruin an entire batch of blue-bin paper recycling?',
  'What items belong in green organic compost bins on campus?',
  'How can our department organize a zero-waste seminar or campus event?',
];

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-welcome',
    role: 'model',
    text: 'Hello! I am **EcoAdvisor**, your sustainability assistant for **Birangana Sati Sadhani Rajyik Vishwavidyalaya (BSSRV)**. Ask me anything about recycling contamination, composting guidelines, e-waste drop-offs, or reducing water and energy footprint across campus.',
    timestamp: 'Just now',
  },
];

function renderFormattedText(text: string) {
  const lines = text.split('\n');
  return lines.map((line, index) => {
    const trimmed = line.trim();
    if (!trimmed) {
      return <div key={index} className="h-2" />;
    }

    const formatInlineBold = (segment: string) => {
      const parts = segment.split(/(\*\*[^*]+\*\*)/g);
      return parts.map((part, pIdx) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return (
            <strong key={pIdx} className="font-semibold text-[#064E3B]">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return part;
      });
    };

    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      return (
        <div key={index} className="flex items-start gap-2 pl-1 my-1">
          <span className="w-1.5 h-1.5 rounded-full bg-[#059669] mt-2 shrink-0" />
          <p className="leading-relaxed">{formatInlineBold(trimmed.slice(2))}</p>
        </div>
      );
    }

    return (
      <p key={index} className="leading-relaxed my-1">
        {formatInlineBold(trimmed)}
      </p>
    );
  });
}

export function EcoAdvisorPage({
  greenScore,
  totalReports,
  totalScans,
}: EcoAdvisorPageProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [includeContext, setIncludeContext] = useState(true);
  const scrollEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const sendMessage = async (textToSend?: string) => {
    const content = (textToSend ?? input).trim();
    if (!content || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      text: content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    if (!textToSend) setInput('');
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const apiHistory = messages
        .filter((m) => m.id !== 'msg-welcome')
        .map((m) => ({ role: m.role, text: m.text }));

      const studentSummary = includeContext
        ? `BSSRV Student (Birangana Sati Sadhani Rajyik Vishwavidyalaya), GreenScore: ${greenScore} pts, EcoReports submitted: ${totalReports}, WasteVision scans logged: ${totalScans}.`
        : undefined;

      const response = await fetch('/api/ecoadvisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          history: apiHistory,
          message: content,
          studentSummary,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'EcoAdvisor could not reply right now.');
      }

      const replyMsg: ChatMessage = {
        id: `model-${Date.now()}`,
        role: 'model',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, replyMsg]);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Unable to reach EcoAdvisor.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetChat = () => {
    setMessages(INITIAL_MESSAGES);
    setErrorMsg(null);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left Rail: Suggested Questions & Context */}
      <aside className="lg:col-span-4 space-y-5">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-lg bg-[#ECFDF5] text-[#059669] flex items-center justify-center">
              <Leaf className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display font-bold text-base text-[#064E3B]">
                Suggested Questions
              </h2>
            </div>
          </div>
          <p className="text-xs text-slate-500 mb-4">
            Select a campus sustainability topic to start immediately.
          </p>

          <div className="space-y-2">
            {SUGGESTED_QUESTIONS.map((q) => (
              <button
                key={q}
                type="button"
                disabled={isLoading}
                onClick={() => sendMessage(q)}
                className="w-full text-left p-3 rounded-xl border border-slate-200/90 hover:border-[#059669] hover:bg-[#ECFDF5]/40 transition-colors text-xs text-[#1F2937] flex items-start justify-between gap-2 cursor-pointer disabled:opacity-50"
              >
                <span className="leading-relaxed">{q}</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#059669] shrink-0 mt-0.5" />
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-[#064E3B]">Campus Profile Context</p>
              <p className="text-[11px] text-slate-500">
                Share GreenScore & report stats for tailored advice
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={includeContext}
              onClick={() => setIncludeContext((prev) => !prev)}
              className={`w-10 h-6 rounded-full transition-colors p-0.5 cursor-pointer shrink-0 ${
                includeContext ? 'bg-[#059669]' : 'bg-slate-300'
              }`}
            >
              <span
                className={`block w-5 h-5 rounded-full bg-white shadow-xs transition-transform ${
                  includeContext ? 'translate-x-4' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Chat Container */}
      <section className="lg:col-span-8 bg-white border border-slate-200/90 rounded-2xl flex flex-col h-[calc(100vh-11rem)] min-h-[540px] max-h-[760px] overflow-hidden">
        {/* Chat Header */}
        <div className="px-5 py-4 border-b border-slate-200/80 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#064E3B] text-emerald-300 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-display font-bold text-base text-[#064E3B]">EcoAdvisor</h2>
              <p className="text-xs text-slate-500">
                Campus Environmental Guidance & Zero-Waste Advisor
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={resetChat}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 hover:text-[#064E3B] hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>New Chat</span>
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                msg.role === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              {msg.role === 'user' ? (
                <div className="w-8 h-8 rounded-full bg-[#064E3B] text-white flex items-center justify-center shrink-0">
                  <User className="w-4 h-4" />
                </div>
              ) : (
                <div className="w-8 h-8 rounded-xl bg-[#ECFDF5] text-[#059669] border border-emerald-200/70 flex items-center justify-center shrink-0">
                  <Leaf className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[82%] rounded-2xl px-4 py-3 text-sm ${
                  msg.role === 'user'
                    ? 'bg-[#064E3B] text-white'
                    : 'bg-slate-50 border border-slate-200/80 text-[#1F2937]'
                }`}
              >
                {msg.role === 'user' ? (
                  <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                ) : (
                  <div className="text-sm">{renderFormattedText(msg.text)}</div>
                )}
                <p
                  className={`text-[10px] mt-1.5 ${
                    msg.role === 'user' ? 'text-emerald-200 text-right' : 'text-slate-400'
                  }`}
                >
                  {msg.timestamp}
                </p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-xl bg-[#ECFDF5] text-[#059669] border border-emerald-200/70 flex items-center justify-center shrink-0">
                <Leaf className="w-4 h-4" />
              </div>
              <div className="bg-slate-50 border border-slate-200/80 rounded-2xl px-4 py-3 text-xs text-slate-500">
                EcoAdvisor is reviewing campus sustainability guidelines...
              </div>
            </div>
          )}

          {errorMsg && (
            <div className="flex items-start gap-2.5 p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div ref={scrollEndRef} />
        </div>

        {/* Composer */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
          className="p-4 border-t border-slate-200/80 bg-white shrink-0"
        >
          <div className="flex items-end gap-2.5">
            <textarea
              rows={2}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Ask about recycling rules, dorm energy tips, or e-waste locations..."
              className="flex-1 px-3.5 py-2.5 text-sm bg-slate-50/70 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#059669]/30 focus:border-[#059669] resize-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              aria-label="Send message"
              className="px-4 py-3 bg-[#059669] hover:bg-[#064E3B] disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-xl transition-colors cursor-pointer shrink-0 inline-flex items-center gap-1.5 text-sm font-semibold"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
