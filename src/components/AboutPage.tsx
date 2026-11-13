import React, { useState } from 'react';
import {
  Mail,
  Copy,
  Check,
  GraduationCap,
  Users,
  ArrowRight,
  ScanLine,
  FileWarning,
  BarChart3,
  MessageSquareText,
} from 'lucide-react';
import { AppPage } from '../types/eco';

interface AboutPageProps {
  onNavigate: (page: AppPage) => void;
}

interface CreatorProfile {
  name: string;
  initials: string;
  department: string;
  institution: string;
  team: string;
  email: string;
  focus: string;
}

const CREATORS: CreatorProfile[] = [
  {
    name: 'Gautam Das',
    initials: 'GD',
    department: 'Applied Science Department',
    institution: 'BSSRV',
    team: 'Neuro Nova',
    email: 'dasgautam36928@gmail.com',
    focus: 'Environmental Monitoring Architecture, Waste Classification & Campus Systems',
  },
  {
    name: 'Akashnil Hazarika',
    initials: 'AH',
    department: 'Applied Science Department',
    institution: 'BSSRV',
    team: 'Neuro Nova',
    email: 'akashnilhazarika00@gmail.com',
    focus: 'AI Integration, Full-Stack Interface Engineering & Sustainability Analytics',
  },
];

export function AboutPage({ onNavigate }: AboutPageProps) {
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const handleCopyEmail = async (email: string) => {
    try {
      await navigator.clipboard.writeText(email);
      setCopiedEmail(email);
      setTimeout(() => {
        setCopiedEmail((curr) => (curr === email ? null : curr));
      }, 2200);
    } catch {
      // Fallback if clipboard API is restricted
      setCopiedEmail(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Team Hero Card */}
      <section className="bg-[#064E3B] text-white rounded-2xl p-6 sm:p-8 lg:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8">
            <p className="text-xs font-semibold text-emerald-200 mb-2">
              Team Neuro Nova · Applied Science Department (BSSRV)
            </p>
            <h2
              className="font-display text-2xl sm:text-4xl font-bold tracking-tight leading-tight mb-3"
              style={{ textWrap: 'balance' }}
            >
              Meet the Creators Behind EcoCampus AI
            </h2>
            <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed max-w-2xl">
              EcoCampus AI was designed and built by <strong className="text-white">Team Neuro Nova</strong>{' '}
              from the Applied Science Department at BSSRV with one goal: making every campus greener
              through practical artificial intelligence, faster waste identification, and transparent
              environmental reporting.
            </p>
          </div>

          <div className="lg:col-span-4 grid grid-cols-2 gap-3">
            <div className="bg-white/10 rounded-xl p-4">
              <div className="w-8 h-8 rounded-lg bg-white/10 text-emerald-300 flex items-center justify-center mb-2.5">
                <Users className="w-4 h-4" />
              </div>
              <p className="text-xs text-emerald-200 mb-0.5">Team Name</p>
              <p className="font-display font-bold text-base text-white">Neuro Nova</p>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <div className="w-8 h-8 rounded-lg bg-white/10 text-emerald-300 flex items-center justify-center mb-2.5">
                <GraduationCap className="w-4 h-4" />
              </div>
              <p className="text-xs text-emerald-200 mb-0.5">Department</p>
              <p className="font-display font-bold text-base text-white">Applied Science</p>
              <p className="text-[11px] text-emerald-200/90">BSSRV</p>
            </div>
          </div>
        </div>
      </section>

      {/* Creator Cards */}
      <section>
        <div className="mb-4">
          <h3 className="font-display text-lg font-bold text-[#064E3B]">
            Team Neuro Nova Members
          </h3>
          <p className="text-xs text-slate-500">
            Applied Science Department (BSSRV) · Direct contact & project contributions
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {CREATORS.map((creator) => {
            const isCopied = copiedEmail === creator.email;
            return (
              <article
                key={creator.email}
                className="bg-white border border-slate-200/90 rounded-2xl p-6 flex flex-col justify-between gap-6"
              >
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-[#ECFDF5] border border-emerald-200/80 text-[#064E3B] font-display font-bold text-lg flex items-center justify-center shrink-0">
                      {creator.initials}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-display text-xl font-bold text-[#1F2937] leading-snug">
                        {creator.name}
                      </h4>
                      <p className="text-xs font-medium text-[#059669] mt-0.5">
                        {creator.department} · {creator.institution}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Team {creator.team}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200/80">
                    <p className="text-xs font-semibold text-slate-500 mb-1">Focus Areas</p>
                    <p className="text-sm text-[#1F2937] leading-relaxed">{creator.focus}</p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <a
                    href={`mailto:${creator.email}`}
                    className="inline-flex items-center gap-2 text-sm font-medium text-[#064E3B] hover:text-[#059669] transition-colors min-w-0"
                  >
                    <Mail className="w-4 h-4 text-[#059669] shrink-0" />
                    <span className="truncate">{creator.email}</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => handleCopyEmail(creator.email)}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#064E3B] bg-[#ECFDF5] hover:bg-emerald-100 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-[#059669]" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-[#059669]" />
                        <span>Copy Email</span>
                      </>
                    )}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* Platform Mission & Quick Explore */}
      <section className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-slate-200/80">
          <div>
            <h3 className="font-display font-bold text-base text-[#064E3B]">
              About EcoCampus AI
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Built by Team Neuro Nova to bridge campus sustainability awareness and facilities action
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('overview')}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#059669] hover:bg-[#064E3B] rounded-lg transition-colors whitespace-nowrap shrink-0 self-start lg:self-auto cursor-pointer"
          >
            <span>Open Student Overview</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 pt-5">
          <button
            type="button"
            onClick={() => onNavigate('wastevision')}
            className="text-left group cursor-pointer"
          >
            <div className="flex items-center gap-2 text-sm font-bold text-[#1F2937] group-hover:text-[#059669] transition-colors mb-1">
              <ScanLine className="w-4 h-4 text-[#059669]" />
              <span>WasteVision AI</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Multimodal waste inspection for instant bin sorting and contamination checks.
            </p>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('ecoreport')}
            className="text-left group cursor-pointer"
          >
            <div className="flex items-center gap-2 text-sm font-bold text-[#1F2937] group-hover:text-[#059669] transition-colors mb-1">
              <FileWarning className="w-4 h-4 text-[#059669]" />
              <span>EcoReport</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Photo-backed campus issue logging with Pending, Under Review, and Resolved tracking.
            </p>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('green-dashboard')}
            className="text-left group cursor-pointer"
          >
            <div className="flex items-center gap-2 text-sm font-bold text-[#1F2937] group-hover:text-[#059669] transition-colors mb-1">
              <BarChart3 className="w-4 h-4 text-[#059669]" />
              <span>Green Dashboard</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Administrative analytics, hotspot locations, and crew dispatch controls.
            </p>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('ecoadvisor')}
            className="text-left group cursor-pointer"
          >
            <div className="flex items-center gap-2 text-sm font-bold text-[#1F2937] group-hover:text-[#059669] transition-colors mb-1">
              <MessageSquareText className="w-4 h-4 text-[#059669]" />
              <span>EcoAdvisor</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Conversational sustainability assistant for daily campus questions.
            </p>
          </button>
        </div>
      </section>
    </div>
  );
}
