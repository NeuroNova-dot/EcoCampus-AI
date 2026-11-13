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
  Instagram,
} from 'lucide-react';
import { AppPage } from '../types/eco';
import { CAMPUS_IMAGES } from '../data/campusData';

interface AboutPageProps {
  onNavigate: (page: AppPage) => void;
}

interface CreatorProfile {
  name: string;
  initials: string;
  photoUrl: string;
  department: string;
  institution: string;
  team: string;
  email: string;
  instagram: string;
  focus: string;
}

const CREATORS: CreatorProfile[] = [
  {
    name: 'Gautam Das',
    initials: 'GD',
    photoUrl: '/assets/aistudio/WhatsApp_Image_2026-11-13_at_7.05.04_PM_4ee53a7d.jpeg',
    department: 'Applied Science (Physics)',
    institution: 'Birangana Sati Sadhani Rajyik Vishwavidyalaya (BSSRV)',
    team: 'Neuro Nova',
    email: 'dasgautam36928@gmail.com',
    instagram: 'luzifer._.666',
    focus: 'Environmental Monitoring Architecture, Waste Classification & Campus Systems',
  },
  {
    name: 'Akashnil Hazarika',
    initials: 'AH',
    photoUrl: '/assets/aistudio/WhatsApp_Image_2026-11-13_at_7.09.57_PM_5b3bf28b.jpeg',
    department: 'Applied Science (Chemistry)',
    institution: 'Birangana Sati Sadhani Rajyik Vishwavidyalaya (BSSRV)',
    team: 'Neuro Nova',
    email: 'akashnilhazarika00@gmail.com',
    instagram: 'akashnil._',
    focus: 'AI Integration, Full-Stack Interface Engineering & Sustainability Analytics',
  },
];

export function AboutPage({ onNavigate }: AboutPageProps) {
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);
  const [failedPhotos, setFailedPhotos] = useState<Record<string, boolean>>({});

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
          <div className="lg:col-span-7">
            <p className="text-xs font-semibold text-emerald-200 mb-2">
              Team Neuro Nova · Birangana Sati Sadhani Rajyik Vishwavidyalaya (BSSRV)
            </p>
            <h2
              className="font-display text-2xl sm:text-4xl font-bold tracking-tight leading-tight mb-3"
              style={{ textWrap: 'balance' }}
            >
              Meet the Creators Behind EcoCampus AI
            </h2>
            <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed max-w-2xl">
              EcoCampus AI was designed and built by <strong className="text-white">Team Neuro Nova</strong>{' '}
              from the Applied Science Department at{' '}
              <strong className="text-white">Birangana Sati Sadhani Rajyik Vishwavidyalaya (BSSRV)</strong>{' '}
              with one goal: making our university campus greener through practical artificial
              intelligence, faster waste identification, and transparent environmental reporting.
            </p>
          </div>

          <div className="lg:col-span-5 flex flex-col sm:flex-row items-center lg:justify-end gap-4">
            <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-2xl overflow-hidden bg-black border border-white/20 shadow-[0_8px_24px_rgba(0,0,0,0.3)] shrink-0">
              <img
                src={CAMPUS_IMAGES.neuroNovaLogo}
                alt="Team Neuro Nova official logo"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-1 gap-3 w-full sm:w-44">
              <div className="bg-white/10 rounded-xl p-3.5">
                <div className="flex items-center gap-2 mb-1">
                  <Users className="w-4 h-4 text-emerald-300" />
                  <p className="text-xs text-emerald-200">Team Name</p>
                </div>
                <p className="font-display font-bold text-base text-white">Neuro Nova</p>
              </div>
              <div className="bg-white/10 rounded-xl p-3.5">
                <div className="flex items-center gap-2 mb-1">
                  <GraduationCap className="w-4 h-4 text-emerald-300" />
                  <p className="text-xs text-emerald-200">University</p>
                </div>
                <p className="font-display font-bold text-base text-white">BSSRV</p>
                <p className="text-[11px] text-emerald-200/90">Applied Science</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* University Campus Showcase */}
      <section className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden">
        <div className="aspect-[16/9] sm:aspect-[21/9] w-full bg-slate-100 overflow-hidden">
          <img
            src={CAMPUS_IMAGES.bssrvCampus}
            alt="Birangana Sati Sadhani Rajyik Vishwavidyalaya (BSSRV) campus building"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className="px-6 py-5 sm:px-8 sm:py-6 border-t border-slate-200/80 text-center bg-white">
          <h3 className="font-university text-2xl sm:text-4xl font-bold text-[#064E3B] tracking-tight">
            Birangana Sati Sadhani Rajyik Vishwavidyalaya (BSSRV)
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1.5">
            Official Campus & Academic Building · EcoCampus AI Built by Team Neuro Nova
          </p>
        </div>
      </section>

      {/* Creator Cards */}
      <section>
        <div className="mb-4">
          <h3 className="font-display text-lg font-bold text-[#064E3B]">
            Team Neuro Nova Members
          </h3>
          <p className="text-xs text-slate-500">
            Birangana Sati Sadhani Rajyik Vishwavidyalaya (BSSRV) · Applied Science Department
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
                  <div className="flex items-center gap-4">
                    {failedPhotos[creator.email] ? (
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-[#ECFDF5] border border-emerald-200/80 text-[#064E3B] font-display font-bold text-xl flex items-center justify-center shrink-0">
                        {creator.initials}
                      </div>
                    ) : (
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                        <img
                          src={creator.photoUrl}
                          alt={`${creator.name} — Team ${creator.team}`}
                          referrerPolicy="no-referrer"
                          onError={() =>
                            setFailedPhotos((prev) => ({ ...prev, [creator.email]: true }))
                          }
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                    )}
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

                <div className="pt-4 border-t border-slate-200/80 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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

                  <div className="flex items-center justify-between">
                    <a
                      href={`https://www.instagram.com/${creator.instagram}/`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-[#059669] transition-colors"
                    >
                      <Instagram className="w-4 h-4 text-[#059669] shrink-0" />
                      <span>@{creator.instagram}</span>
                    </a>
                  </div>
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
