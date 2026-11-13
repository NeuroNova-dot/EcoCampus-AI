import React, { useState } from 'react';
import {
  ScanLine,
  FileWarning,
  MessageSquareText,
  ArrowRight,
  MapPin,
  CheckCircle2,
  Award,
  Layers,
} from 'lucide-react';
import { AppPage, EcoReport, ReportStatus, WasteScanRecord } from '../types/eco';
import { StatusIndicator } from './EcoLogo';

interface OverviewPageProps {
  onNavigate: (page: AppPage) => void;
  reports: EcoReport[];
  scans: WasteScanRecord[];
  greenScore: number;
  totalContributions: number;
}

export function OverviewPage({
  onNavigate,
  reports,
  scans,
  greenScore,
  totalContributions,
}: OverviewPageProps) {
  const [statusFilter, setStatusFilter] = useState<'All' | ReportStatus>('All');

  const userReports = reports;
  const resolvedCount = userReports.filter((r) => r.status === 'Resolved').length;
  const filteredReports =
    statusFilter === 'All'
      ? userReports.slice(0, 5)
      : userReports.filter((r) => r.status === statusFilter).slice(0, 5);

  return (
    <div className="space-y-8">
      {/* Personalised Welcome Banner */}
      <section className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <p className="text-xs font-semibold text-[#059669] mb-1.5">
            Birangana Sati Sadhani Rajyik Vishwavidyalaya (BSSRV) · Fall Semester
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-[#064E3B] tracking-tight mb-2">
            Campus Sustainability Overview
          </h2>
          <p className="text-sm sm:text-base text-slate-600 max-w-2xl">
            Your campus actions helped divert an estimated 112 kg of recyclables and compostables
            this term. You are 80 points away from reaching Campus Steward tier.
          </p>
        </div>

        <div className="flex items-center gap-4 shrink-0 border-t lg:border-t-0 lg:border-l border-slate-200 pt-4 lg:pt-0 lg:pl-8">
          <div>
            <p className="text-xs font-medium text-slate-500">Campus Standing</p>
            <p className="font-display text-2xl font-bold text-[#064E3B] tabular-nums">
              #4 <span className="text-sm font-normal text-slate-500">of 1,840</span>
            </p>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('greenscore')}
            className="px-4 py-2 text-xs font-semibold text-[#064E3B] bg-[#ECFDF5] hover:bg-emerald-100 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            View GreenScore
          </button>
        </div>
      </section>

      {/* 4 Key Metrics */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500">Total Contributions</span>
            <Layers className="w-4 h-4 text-[#059669]" />
          </div>
          <p className="font-display text-3xl font-bold text-[#1F2937] tabular-nums">
            {totalContributions}
          </p>
          <p className="text-xs text-slate-500 mt-1">Scans, verified reports & audits</p>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500">Reports Submitted</span>
            <FileWarning className="w-4 h-4 text-[#059669]" />
          </div>
          <p className="font-display text-3xl font-bold text-[#1F2937] tabular-nums">
            {userReports.length}
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {userReports.filter((r) => r.status === 'Pending').length} awaiting crew dispatch
          </p>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-500">Resolved Issues</span>
            <CheckCircle2 className="w-4 h-4 text-[#059669]" />
          </div>
          <p className="font-display text-3xl font-bold text-[#1F2937] tabular-nums">
            {resolvedCount}
          </p>
          <p className="text-xs text-[#059669] font-medium mt-1 tabular-nums">
            {Math.round((resolvedCount / Math.max(userReports.length, 1)) * 100)}% completion rate
          </p>
        </div>

        <div className="bg-[#064E3B] text-white rounded-2xl p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-emerald-200">GreenScore</span>
            <Award className="w-4 h-4 text-emerald-300" />
          </div>
          <p className="font-display text-3xl font-bold text-white tabular-nums">
            {greenScore.toLocaleString()}
          </p>
          <p className="text-xs text-emerald-200 mt-1">12-day active streak</p>
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <h3 className="font-display text-base font-bold text-[#064E3B] mb-3">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            type="button"
            onClick={() => onNavigate('wastevision')}
            className="group text-left bg-white border border-slate-200/90 hover:border-[#059669] rounded-2xl p-5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#059669]"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center">
                <ScanLine className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#059669] transition-colors" />
            </div>
            <p className="font-display font-bold text-base text-[#1F2937] mb-1">Scan Waste</p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Upload or photograph an item to identify its recycling, compost, or landfill stream.
            </p>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('ecoreport')}
            className="group text-left bg-white border border-slate-200/90 hover:border-[#059669] rounded-2xl p-5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#059669]"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center">
                <FileWarning className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#059669] transition-colors" />
            </div>
            <p className="font-display font-bold text-base text-[#1F2937] mb-1">Report an Issue</p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Flag overflowing bins, broken water refillers, or energy waste on campus.
            </p>
          </button>

          <button
            type="button"
            onClick={() => onNavigate('ecoadvisor')}
            className="group text-left bg-white border border-slate-200/90 hover:border-[#059669] rounded-2xl p-5 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#059669]"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl bg-[#ECFDF5] text-[#059669] flex items-center justify-center">
                <MessageSquareText className="w-5 h-5" />
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#059669] transition-colors" />
            </div>
            <p className="font-display font-bold text-base text-[#1F2937] mb-1">Ask EcoAdvisor</p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Get immediate answers on tricky packaging, lab disposal rules, and dorm energy tips.
            </p>
          </button>
        </div>
      </section>

      {/* Recent Reports & Latest WasteVision Scan */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Recent Reports */}
        <div className="lg:col-span-8 bg-white border border-slate-200/90 rounded-2xl overflow-hidden">
          <div className="p-5 sm:px-6 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h3 className="font-display font-bold text-base text-[#064E3B]">Recent Reports</h3>
              <p className="text-xs text-slate-500">Live status updates from Campus Facilities</p>
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg self-start sm:self-auto">
              {(['All', 'Pending', 'Under Review', 'Resolved'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setStatusFilter(tab)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    statusFilter === tab
                      ? 'bg-white text-[#064E3B] shadow-xs'
                      : 'text-slate-600 hover:text-[#1F2937]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {filteredReports.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-sm font-medium text-slate-700 mb-1">
                No reports with status "{statusFilter}"
              </p>
              <p className="text-xs text-slate-500 mb-4">
                Try another filter or submit a new campus observation.
              </p>
              <button
                type="button"
                onClick={() => onNavigate('ecoreport')}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#059669] hover:bg-[#064E3B] rounded-lg cursor-pointer"
              >
                New EcoReport
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-200/80">
              {filteredReports.map((report) => (
                <div
                  key={report.id}
                  className="p-4 sm:px-6 hover:bg-slate-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
                      <span className="font-mono font-medium text-slate-600">{report.id}</span>
                      <span aria-hidden="true">·</span>
                      <span>{report.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{report.submittedAt}</span>
                    </div>
                    <p className="text-sm font-semibold text-[#1F2937] truncate">{report.title}</p>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{report.location}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-4 shrink-0">
                    <StatusIndicator status={report.status} />
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="px-6 py-3.5 bg-slate-50/70 border-t border-slate-200/80 flex justify-end">
            <button
              type="button"
              onClick={() => onNavigate('ecoreport')}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#059669] hover:text-[#064E3B] cursor-pointer"
            >
              <span>View all reports</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Latest WasteVision Scan */}
        <div className="lg:col-span-4 bg-white border border-slate-200/90 rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-slate-200/80 flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-base text-[#064E3B]">Latest Waste Scan</h3>
              <p className="text-xs text-slate-500">
                {scans[0] ? scans[0].timestamp : 'No scans logged yet'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('wastevision')}
              className="text-xs font-semibold text-[#059669] hover:text-[#064E3B] cursor-pointer"
            >
              New Scan
            </button>
          </div>

          {scans[0] ? (
            <div className="p-5 space-y-4">
              <div className="rounded-xl overflow-hidden border border-slate-200 aspect-[4/3] bg-slate-50">
                <img
                  src={scans[0].imageUrl}
                  alt="Latest analyzed waste scan"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
                  <span>{scans[0].location}</span>
                  <span className="font-mono font-semibold text-[#059669]">
                    +{scans[0].result.pointsAwarded} pts
                  </span>
                </div>
                <p className="text-sm text-[#1F2937] leading-relaxed">{scans[0].result.summary}</p>
              </div>
              <div className="pt-3 border-t border-slate-200/80 space-y-1.5">
                {scans[0].result.detectedItems.slice(0, 3).map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between text-xs py-1"
                  >
                    <span className="font-medium text-[#1F2937] truncate pr-2">{item.name}</span>
                    <span className="text-slate-600 whitespace-nowrap shrink-0">{item.bin}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="p-8 text-center">
              <p className="text-sm text-slate-600 mb-3">Scan your first campus item to begin.</p>
              <button
                type="button"
                onClick={() => onNavigate('wastevision')}
                className="px-4 py-2 text-xs font-semibold text-white bg-[#059669] rounded-lg cursor-pointer"
              >
                Open WasteVision AI
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
