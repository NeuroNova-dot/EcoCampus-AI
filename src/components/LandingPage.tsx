import React from 'react';
import {
  ArrowRight,
  Camera,
  FileWarning,
  BarChart3,
  Award,
  MessageSquareText,
  CheckCircle2,
  Building2,
} from 'lucide-react';
import { AppPage } from '../types/eco';
import { CAMPUS_IMAGES } from '../data/campusData';
import { EcoLogoMark } from './EcoLogo';

interface LandingPageProps {
  onNavigate: (page: AppPage) => void;
  totalReports: number;
  resolvedReports: number;
}

export function LandingPage({
  onNavigate,
  totalReports,
  resolvedReports,
}: LandingPageProps) {
  return (
    <div className="min-h-screen bg-white text-[#1F2937] flex flex-col">
      {/* Top Bar Contract: 3 zones separated by gap-8 */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200/80">
        <div className="max-w-[1240px] mx-auto px-6 h-16 flex items-center justify-between gap-8">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2.5 whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#059669] rounded-lg"
          >
            <EcoLogoMark className="w-8 h-8 shrink-0" />
            <span className="font-display font-bold text-lg tracking-tight text-[#064E3B]">
              EcoCampus AI
            </span>
          </a>

          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
            <a
              href="#capabilities"
              className="hover:text-[#064E3B] transition-colors whitespace-nowrap shrink-0"
            >
              Capabilities
            </a>
            <a
              href="#workflow"
              className="hover:text-[#064E3B] transition-colors whitespace-nowrap shrink-0"
            >
              Workflow
            </a>
            <a
              href="#impact"
              className="hover:text-[#064E3B] transition-colors whitespace-nowrap shrink-0"
            >
              Campus Impact
            </a>
            <button
              type="button"
              onClick={() => onNavigate('wastevision')}
              className="hover:text-[#064E3B] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              WasteVision AI
            </button>
            <button
              type="button"
              onClick={() => onNavigate('feedback')}
              className="hover:text-[#064E3B] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              Feedback
            </button>
            <button
              type="button"
              onClick={() => onNavigate('about')}
              className="hover:text-[#064E3B] transition-colors whitespace-nowrap shrink-0 cursor-pointer"
            >
              About
            </button>
          </nav>

          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={() => onNavigate('overview')}
              className="px-4 py-2 text-sm font-semibold text-white bg-[#059669] hover:bg-[#064E3B] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#059669] focus-visible:ring-offset-2"
            >
              Explore Dashboard
            </button>
          </div>
        </div>
      </header>

      <main id="top" className="flex-1">
        {/* Hero Split Section */}
        <section className="max-w-[1240px] mx-auto px-6 pt-12 pb-16 lg:pt-16 lg:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-stretch">
            <div className="lg:col-span-6 flex flex-col justify-center">
              <p className="text-sm font-semibold text-[#059669] tracking-tight mb-3">
                Making Every Campus Greener Through Artificial Intelligence
              </p>

              <h1
                className="font-display font-bold text-[#064E3B] tracking-tight leading-[1.08] mb-5"
                style={{
                  fontSize: 'clamp(2.25rem, 4vw, 3.5rem)',
                  textWrap: 'balance',
                }}
              >
                Building a Greener Campus, One Action at a Time
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl mb-8">
                EcoCampus AI equips university students and sustainability teams with instant
                computer-vision waste sorting, geotagged issue reporting, and real-time diversion
                analytics across every academic building.
              </p>

              <div className="flex flex-wrap items-center gap-3.5">
                <button
                  type="button"
                  onClick={() => onNavigate('overview')}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#059669] hover:bg-[#064E3B] rounded-xl shadow-[0_1px_2px_rgba(6,78,59,0.12)] transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#059669] focus-visible:ring-offset-2"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => onNavigate('green-dashboard')}
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-[#064E3B] bg-white hover:bg-[#ECFDF5] border border-slate-200 hover:border-[#059669]/40 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#059669] focus-visible:ring-offset-2"
                >
                  <span>Explore Dashboard</span>
                </button>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-200/80 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500">
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                  Real-time Gemini Vision Waste Audit
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-[#059669]" />
                  Birangana Sati Sadhani Rajyik Vishwavidyalaya (BSSRV)
                </span>
              </div>
            </div>

            <div className="lg:col-span-6 flex">
              <div className="w-full rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-[0_8px_30px_rgba(6,78,59,0.08)] flex flex-col">
                <div className="relative flex-1 min-h-[280px] lg:min-h-[360px] bg-[#ECFDF5] overflow-hidden">
                  <img
                    src={CAMPUS_IMAGES.bssrvCampus}
                    alt="Birangana Sati Sadhani Rajyik Vishwavidyalaya (BSSRV) university building and campus"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="px-6 py-4 bg-white border-t border-slate-200/90">
                  <p className="font-university text-xl sm:text-2xl font-bold text-[#064E3B] tracking-tight leading-snug">
                    Birangana Sati Sadhani Rajyik Vishwavidyalaya (BSSRV)
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Campus Sustainability Initiative · Built by Team Neuro Nova
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Full-width 4-column Campus KPI Strip below Hero Split */}
          <div className="mt-10 grid grid-cols-2 lg:grid-cols-4 border border-slate-200 rounded-2xl bg-white divide-y lg:divide-y-0 lg:divide-x divide-slate-200">
            <div className="p-5 sm:p-6">
              <p className="text-xs font-medium text-slate-500 mb-1">Campus Diversion Rate</p>
              <p className="font-display text-2xl sm:text-3xl font-bold text-[#064E3B] tabular-nums">
                68.4%
              </p>
              <p className="text-xs text-[#059669] mt-1 font-medium">+11.2% vs. last semester</p>
            </div>
            <div className="p-5 sm:p-6">
              <p className="text-xs font-medium text-slate-500 mb-1">AI Waste Scans Logged</p>
              <p className="font-display text-2xl sm:text-3xl font-bold text-[#064E3B] tabular-nums">
                14,280
              </p>
              <p className="text-xs text-slate-500 mt-1">Across 5 campus waste streams</p>
            </div>
            <div className="p-5 sm:p-6">
              <p className="text-xs font-medium text-slate-500 mb-1">Active Issue Resolution</p>
              <p className="font-display text-2xl sm:text-3xl font-bold text-[#064E3B] tabular-nums">
                {resolvedReports} / {totalReports}
              </p>
              <p className="text-xs text-slate-500 mt-1">4.2 hr average crew turnaround</p>
            </div>
            <div className="p-5 sm:p-6">
              <p className="text-xs font-medium text-slate-500 mb-1">Participating Students</p>
              <p className="font-display text-2xl sm:text-3xl font-bold text-[#064E3B] tabular-nums">
                1,840
              </p>
              <p className="text-xs text-[#059669] mt-1 font-medium">14 residence halls ranked</p>
            </div>
          </div>
        </section>

        {/* Feature Highlights: Asymmetric Bento Grid */}
        <section id="capabilities" className="bg-[#ECFDF5]/45 border-y border-slate-200/80 py-16 lg:py-20">
          <div className="max-w-[1240px] mx-auto px-6">
            <div className="max-w-2xl mb-10">
              <p className="text-sm font-semibold text-[#059669] mb-2">Platform Architecture</p>
              <h2
                className="font-display text-2xl sm:text-3xl font-bold text-[#064E3B] tracking-tight mb-3"
                style={{ textWrap: 'balance' }}
              >
                Six integrated modules connecting daily student habits with campus operations
              </h2>
              <p className="text-slate-600 text-base leading-relaxed">
                Designed for speed at the bin and clarity in the facilities office. Click any module
                below to launch it directly.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-6 gap-5">
              {/* Marquee Card: WasteVision AI */}
              <div className="md:col-span-4 bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-[#059669]/50 transition-colors">
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
                  <div className="sm:col-span-7">
                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#ECFDF5] text-[#059669] mb-4">
                      <Camera className="w-5 h-5" />
                    </div>
                    <h3 className="font-display text-xl font-bold text-[#064E3B] mb-2">
                      01. WasteVision AI
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed mb-5">
                      Snap or upload a photo of any cafeteria tray or desk item. Our multimodal vision
                      pipeline identifies individual materials, flags contamination risk or uncertainty,
                      and tells you the exact campus bin in seconds.
                    </p>
                    <button
                      type="button"
                      onClick={() => onNavigate('wastevision')}
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#059669] hover:text-[#064E3B] transition-colors cursor-pointer"
                    >
                      <span>Launch WasteVision AI</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="sm:col-span-5">
                    <div className="rounded-xl overflow-hidden border border-slate-200 aspect-[3/2] bg-slate-950">
                      <img
                        src={CAMPUS_IMAGES.wasteVisionBanner}
                        alt="WasteVision AI — See, Sort, Make a Greener Tomorrow detecting Plastic, Paper, and Metal"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2: EcoReport */}
              <div className="md:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 flex flex-col justify-between hover:border-[#059669]/50 transition-colors">
                <div>
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#ECFDF5] text-[#059669] mb-4">
                    <FileWarning className="w-5 h-5" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-[#064E3B] mb-2">
                    02. EcoReport Triage
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-5">
                    Log overflowing bins, water leaks, or overnight HVAC waste with photos and
                    building locations. Track live Pending, Under Review, and Resolved progress.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('ecoreport')}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#059669] hover:text-[#064E3B] transition-colors cursor-pointer"
                >
                  <span>Submit a report</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Card 3: Green Dashboard */}
              <div className="md:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 flex flex-col justify-between hover:border-[#059669]/50 transition-colors">
                <div>
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#ECFDF5] text-[#059669] mb-4">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-[#064E3B] mb-2">
                    03. Green Dashboard
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-5">
                    Administrative command view with category distribution charts, building hotspot
                    breakdowns, crew dispatch, and instant status management controls.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('green-dashboard')}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#059669] hover:text-[#064E3B] transition-colors cursor-pointer"
                >
                  <span>Open admin analytics</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Card 4: GreenScore */}
              <div className="md:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 sm:p-7 flex flex-col justify-between hover:border-[#059669]/50 transition-colors">
                <div>
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-[#ECFDF5] text-[#059669] mb-4">
                    <Award className="w-5 h-5" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-[#064E3B] mb-2">
                    04. GreenScore
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-5">
                    Every verified scan and environmental report earns measurable points, milestone
                    achievements, and residence hall leaderboard standings.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('greenscore')}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#059669] hover:text-[#064E3B] transition-colors cursor-pointer"
                >
                  <span>View leaderboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Card 5: EcoAdvisor */}
              <div className="md:col-span-2 bg-[#064E3B] text-white rounded-2xl p-6 sm:p-7 flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/10 text-emerald-300 mb-4">
                    <MessageSquareText className="w-5 h-5" />
                  </div>
                  <h3 className="font-display text-lg font-bold text-white mb-2">
                    05. EcoAdvisor AI
                  </h3>
                  <p className="text-sm text-emerald-100/90 leading-relaxed mb-5">
                    Ask practical questions about tricky lab plastics, dining compost rules, dorm
                    energy savings, or campus zero-waste policies anytime.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('ecoadvisor')}
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-300 hover:text-white transition-colors cursor-pointer"
                >
                  <span>Chat with EcoAdvisor</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Mechanism-to-Outcome Workflow Strip */}
        <section id="workflow" className="max-w-[1240px] mx-auto px-6 py-16 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5">
              <div className="rounded-2xl overflow-hidden border border-slate-200 aspect-[4/3] bg-slate-50">
                <img
                  src={CAMPUS_IMAGES.issueOverflowBin}
                  alt="Overflowing campus recycling bin reported via EcoReport"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="lg:col-span-7">
              <p className="text-sm font-semibold text-[#059669] mb-2">Closed-Loop Operations</p>
              <h2
                className="font-display text-2xl sm:text-3xl font-bold text-[#064E3B] tracking-tight mb-6"
                style={{ textWrap: 'balance' }}
              >
                From student observation to facilities resolution in minutes
              </h2>
              <div className="space-y-5">
                <div className="pb-5 border-b border-slate-200/80">
                  <h3 className="font-display font-semibold text-base text-[#1F2937] mb-1">
                    1. Capture at the source
                  </h3>
                  <p className="text-sm text-slate-600">
                    Students scan confusing items with WasteVision AI before tossing them, cutting
                    blue-bin recycling contamination at high-traffic dining halls.
                  </p>
                </div>
                <div className="pb-5 border-b border-slate-200/80">
                  <h3 className="font-display font-semibold text-base text-[#1F2937] mb-1">
                    2. Route directly to campus crews
                  </h3>
                  <p className="text-sm text-slate-600">
                    EcoReport captures building zone, issue category, and photo evidence—moving
                    seamlessly from Pending to Under Review to Resolved.
                  </p>
                </div>
                <div>
                  <h3 className="font-display font-semibold text-base text-[#1F2937] mb-1">
                    3. Measure campus-wide impact
                  </h3>
                  <p className="text-sm text-slate-600">
                    Administrators monitor category trends on the Green Dashboard while students earn
                    verified GreenScore milestones for sustainable participation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Banner CTA */}
        <section id="impact" className="max-w-[1240px] mx-auto px-6 pb-16">
          <div className="rounded-2xl bg-[#064E3B] text-white p-8 sm:p-12 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="max-w-2xl">
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight mb-2">
                Ready to inspect the live EcoCampus AI workspace?
              </h2>
              <p className="text-emerald-100 text-sm sm:text-base">
                Jump into the Student Overview, test WasteVision AI on real campus waste photos, or
                triage issues inside the Administrator Green Dashboard.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => onNavigate('overview')}
                className="px-5 py-3 text-sm font-semibold text-[#064E3B] bg-white hover:bg-[#ECFDF5] rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Open Student Overview
              </button>
              <button
                type="button"
                onClick={() => onNavigate('green-dashboard')}
                className="px-5 py-3 text-sm font-semibold text-white bg-[#059669] hover:bg-emerald-500 rounded-xl transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                Admin Green Dashboard
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Quiet Footer */}
      <footer className="border-t border-slate-200 bg-white py-10">
        <div className="max-w-[1240px] mx-auto px-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <EcoLogoMark className="w-7 h-7" />
            <div>
              <p className="font-display font-bold text-sm text-[#064E3B]">EcoCampus AI</p>
              <p className="text-xs text-slate-500">
                Birangana Sati Sadhani Rajyik Vishwavidyalaya (BSSRV) · Team Neuro Nova
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-5 text-xs font-medium text-slate-600">
            <button
              type="button"
              onClick={() => onNavigate('overview')}
              className="hover:text-[#059669] cursor-pointer"
            >
              Overview
            </button>
            <button
              type="button"
              onClick={() => onNavigate('wastevision')}
              className="hover:text-[#059669] cursor-pointer"
            >
              WasteVision AI
            </button>
            <button
              type="button"
              onClick={() => onNavigate('ecoreport')}
              className="hover:text-[#059669] cursor-pointer"
            >
              EcoReport
            </button>
            <button
              type="button"
              onClick={() => onNavigate('green-dashboard')}
              className="hover:text-[#059669] cursor-pointer"
            >
              Green Dashboard
            </button>
            <button
              type="button"
              onClick={() => onNavigate('greenscore')}
              className="hover:text-[#059669] cursor-pointer"
            >
              GreenScore
            </button>
            <button
              type="button"
              onClick={() => onNavigate('ecoadvisor')}
              className="hover:text-[#059669] cursor-pointer"
            >
              EcoAdvisor
            </button>
            <button
              type="button"
              onClick={() => onNavigate('feedback')}
              className="hover:text-[#059669] cursor-pointer"
            >
              Feedback
            </button>
            <button
              type="button"
              onClick={() => onNavigate('about')}
              className="hover:text-[#059669] cursor-pointer"
            >
              About
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
