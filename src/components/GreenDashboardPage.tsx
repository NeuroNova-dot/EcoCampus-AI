import React, { useMemo, useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Eye,
  FileWarning,
  Search,
  X,
  TrendingUp,
  MapPin,
} from 'lucide-react';
import { EcoReport, ReportStatus } from '../types/eco';
import { WEEKLY_TREND_DATA } from '../data/campusData';
import { PriorityIndicator, StatusIndicator } from './EcoLogo';

interface GreenDashboardPageProps {
  reports: EcoReport[];
  onUpdateReportStatus: (id: string, status: ReportStatus) => void;
  onAssignCrew: (id: string, crew: string) => void;
}

const CREW_OPTIONS = [
  'Unassigned',
  'Zero-Waste Crew A',
  'Zero-Waste Crew B',
  'Facilities Plumbing',
  'Building Automation',
  'Campus Grounds',
];

export function GreenDashboardPage({
  reports,
  onUpdateReportStatus,
  onAssignCrew,
}: GreenDashboardPageProps) {
  const [statusFilter, setStatusFilter] = useState<'All' | ReportStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredWeek, setHoveredWeek] = useState<number | null>(null);
  const [selectedReport, setSelectedReport] = useState<EcoReport | null>(null);

  const totalCount = reports.length;
  const pendingCount = reports.filter((r) => r.status === 'Pending').length;
  const reviewCount = reports.filter((r) => r.status === 'Under Review').length;
  const resolvedCount = reports.filter((r) => r.status === 'Resolved').length;

  const categoryCounts = useMemo(() => {
    const map = new Map<string, number>();
    reports.forEach((r) => {
      map.set(r.category, (map.get(r.category) ?? 0) + 1);
    });
    return Array.from(map.entries())
      .map(([category, count]) => ({
        category,
        count,
        percent: Math.round((count / Math.max(totalCount, 1)) * 100),
      }))
      .sort((a, b) => b.count - a.count);
  }, [reports, totalCount]);

  const locationCounts = useMemo(() => {
    const map = new Map<string, { total: number; resolved: number; pending: number }>();
    reports.forEach((r) => {
      const current = map.get(r.location) ?? { total: 0, resolved: 0, pending: 0 };
      current.total += 1;
      if (r.status === 'Resolved') current.resolved += 1;
      if (r.status === 'Pending') current.pending += 1;
      map.set(r.location, current);
    });
    return Array.from(map.entries())
      .map(([location, stats]) => ({ location, ...stats }))
      .sort((a, b) => b.total - a.total);
  }, [reports]);

  const filteredReports = reports.filter((r) => {
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    const q = searchQuery.trim().toLowerCase();
    const matchesQuery =
      !q ||
      r.id.toLowerCase().includes(q) ||
      r.title.toLowerCase().includes(q) ||
      r.location.toLowerCase().includes(q) ||
      r.submittedBy.toLowerCase().includes(q);
    return matchesStatus && matchesQuery;
  });

  // SVG chart dimensions for Weekly Trend
  const chartW = 540;
  const chartH = 190;
  const padL = 32;
  const padR = 16;
  const padT = 18;
  const padB = 28;
  const innerW = chartW - padL - padR;
  const innerH = chartH - padT - padB;
  const maxVal = 35;

  const pointsSubmitted = WEEKLY_TREND_DATA.map((d, i) => {
    const x = padL + (i / (WEEKLY_TREND_DATA.length - 1)) * innerW;
    const y = padT + innerH - (d.reports / maxVal) * innerH;
    return { x, y, ...d };
  });

  const pointsResolved = WEEKLY_TREND_DATA.map((d, i) => {
    const x = padL + (i / (WEEKLY_TREND_DATA.length - 1)) * innerW;
    const y = padT + innerH - (d.resolved / maxVal) * innerH;
    return { x, y, ...d };
  });

  const linePath = (pts: Array<{ x: number; y: number }>) =>
    pts.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');

  const areaPath = (pts: Array<{ x: number; y: number }>) =>
    `${linePath(pts)} L ${pts[pts.length - 1].x.toFixed(1)} ${(padT + innerH).toFixed(1)} L ${pts[0].x.toFixed(1)} ${(padT + innerH).toFixed(1)} Z`;

  return (
    <div className="space-y-6">
      {/* Top KPI Row */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Total Reports</span>
            <FileWarning className="w-4 h-4 text-[#064E3B]" />
          </div>
          <p className="font-display text-3xl font-bold text-[#064E3B] tabular-nums">
            {totalCount}
          </p>
          <p className="text-xs text-slate-500 mt-1">All campus zones · Fall 2026</p>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Pending Triage</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="font-display text-3xl font-bold text-amber-700 tabular-nums">
            {pendingCount}
          </p>
          <p className="text-xs text-slate-500 mt-1">Awaiting assignment or review</p>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Under Review</span>
            <Eye className="w-4 h-4 text-sky-600" />
          </div>
          <p className="font-display text-3xl font-bold text-sky-700 tabular-nums">
            {reviewCount}
          </p>
          <p className="text-xs text-slate-500 mt-1">Active facilities crew dispatch</p>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Resolved Reports</span>
            <CheckCircle2 className="w-4 h-4 text-[#059669]" />
          </div>
          <p className="font-display text-3xl font-bold text-[#059669] tabular-nums">
            {resolvedCount}
          </p>
          <p className="text-xs text-[#059669] font-medium mt-1 tabular-nums">
            {Math.round((resolvedCount / Math.max(totalCount, 1)) * 100)}% campus resolution
          </p>
        </div>
      </section>

      {/* Analytics Charts Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Resolution Trend SVG Chart */}
        <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
            <div>
              <h2 className="font-display font-bold text-base text-[#064E3B]">
                Weekly Report Volume & Resolution
              </h2>
              <p className="text-xs text-slate-500">
                8-week intake vs. closed work orders across campus
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-600">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#064E3B]" />
                Submitted
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-[#059669]" />
                Resolved
              </span>
            </div>
          </div>

          <div className="relative">
            <svg
              viewBox={`0 0 ${chartW} ${chartH}`}
              className="w-full h-auto overflow-visible"
              role="img"
              aria-label="Weekly report volume and resolution trend chart"
            >
              <defs>
                <linearGradient id="ecoAreaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#059669" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="#059669" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Horizontal grid lines */}
              {[0, 10, 20, 30].map((val) => {
                const y = padT + innerH - (val / maxVal) * innerH;
                return (
                  <g key={val}>
                    <line
                      x1={padL}
                      y1={y}
                      x2={chartW - padR}
                      y2={y}
                      stroke="#E2E8F0"
                      strokeDasharray={val === 0 ? undefined : '3 3'}
                    />
                    <text
                      x={padL - 8}
                      y={y + 3.5}
                      textAnchor="end"
                      className="fill-slate-400 text-[10px] font-mono"
                    >
                      {val}
                    </text>
                  </g>
                );
              })}

              {/* Resolved Area */}
              <path d={areaPath(pointsResolved)} fill="url(#ecoAreaGrad)" />

              {/* Submitted Line */}
              <path
                d={linePath(pointsSubmitted)}
                fill="none"
                stroke="#064E3B"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Resolved Line */}
              <path
                d={linePath(pointsResolved)}
                fill="none"
                stroke="#059669"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Interactive Data Points */}
              {pointsSubmitted.map((pt, i) => {
                const resPt = pointsResolved[i];
                const isHovered = hoveredWeek === i;
                return (
                  <g key={pt.week}>
                    <text
                      x={pt.x}
                      y={chartH - 6}
                      textAnchor="middle"
                      className="fill-slate-500 text-[10px] font-mono"
                    >
                      {pt.week}
                    </text>

                    {isHovered && (
                      <line
                        x1={pt.x}
                        y1={padT}
                        x2={pt.x}
                        y2={padT + innerH}
                        stroke="#CBD5E1"
                        strokeWidth="1"
                      />
                    )}

                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r={isHovered ? 4.5 : 3}
                      fill="#064E3B"
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                    />
                    <circle
                      cx={resPt.x}
                      cy={resPt.y}
                      r={isHovered ? 4.5 : 3}
                      fill="#059669"
                      stroke="#FFFFFF"
                      strokeWidth="1.5"
                    />

                    {/* Invisible hover hit column */}
                    <rect
                      x={pt.x - innerW / 16}
                      y={padT}
                      width={innerW / 8}
                      height={innerH}
                      fill="transparent"
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredWeek(i)}
                      onMouseLeave={() => setHoveredWeek(null)}
                    />
                  </g>
                );
              })}
            </svg>

            {hoveredWeek !== null && (
              <div className="mt-2 px-3 py-2 rounded-lg bg-[#ECFDF5] border border-emerald-200 flex items-center justify-between text-xs text-[#064E3B]">
                <span className="font-mono font-semibold">
                  Week {WEEKLY_TREND_DATA[hoveredWeek].week}
                </span>
                <span className="tabular-nums">
                  Submitted: <strong>{WEEKLY_TREND_DATA[hoveredWeek].reports}</strong> · Resolved:{' '}
                  <strong>{WEEKLY_TREND_DATA[hoveredWeek].resolved}</strong> · Diversion:{' '}
                  <strong>{WEEKLY_TREND_DATA[hoveredWeek].diversion}%</strong>
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Category Breakdown Chart */}
        <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="font-display font-bold text-base text-[#064E3B]">
                Reports by Category
              </h2>
              <p className="text-xs text-slate-500">Live distribution across issue types</p>
            </div>
            <TrendingUp className="w-4 h-4 text-[#059669]" />
          </div>

          <div className="space-y-3.5">
            {categoryCounts.map((item, idx) => (
              <div key={item.category} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-[#1F2937]">{item.category}</span>
                  <span className="font-mono text-slate-600 tabular-nums">
                    {item.count} ({item.percent}%)
                  </span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      idx === 0
                        ? 'bg-[#064E3B]'
                        : idx === 1
                        ? 'bg-[#059669]'
                        : 'bg-emerald-400'
                    }`}
                    style={{ width: `${Math.max(8, item.percent)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Location Breakdown + Report Management Controls */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Campus Location Breakdown */}
        <div className="lg:col-span-4 bg-white border border-slate-200/90 rounded-2xl overflow-hidden">
          <div className="p-5 border-b border-slate-200/80">
            <h2 className="font-display font-bold text-base text-[#064E3B]">
              Location Breakdown
            </h2>
            <p className="text-xs text-slate-500">Zones ranked by submitted volume</p>
          </div>
          <div className="divide-y divide-slate-200/80">
            {locationCounts.map((loc) => (
              <div key={loc.location} className="p-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[#1F2937] truncate flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#059669] shrink-0" />
                    <span className="truncate">{loc.location}</span>
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5 tabular-nums">
                    {loc.resolved} resolved · {loc.pending} pending
                  </p>
                </div>
                <span className="font-mono text-sm font-bold text-[#064E3B] tabular-nums shrink-0">
                  {loc.total}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Admin Report Management Table */}
        <div className="lg:col-span-8 bg-white border border-slate-200/90 rounded-2xl overflow-hidden">
          <div className="p-5 sm:px-6 border-b border-slate-200/80 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-display font-bold text-base text-[#064E3B]">
                  Recent Submissions & Triage Controls
                </h2>
                <p className="text-xs text-slate-500">
                  Update status or dispatch grounds crews directly
                </p>
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

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter submissions by ID, location, or reporter..."
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50/70 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#059669]/30 focus:border-[#059669]"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-[11px] font-semibold text-slate-500">
                  <th className="py-3 px-4">ID & Issue</th>
                  <th className="py-3 px-3">Priority</th>
                  <th className="py-3 px-3">Assigned Crew</th>
                  <th className="py-3 px-4">Status Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200/80 text-xs">
                {filteredReports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="py-3.5 px-4 max-w-[280px]">
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-0.5">
                        <span className="font-mono font-semibold text-slate-600">{report.id}</span>
                        <span>·</span>
                        <span>{report.location}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedReport(report)}
                        className="text-left font-semibold text-[#1F2937] hover:text-[#059669] truncate block w-full cursor-pointer"
                      >
                        {report.title}
                      </button>
                    </td>

                    <td className="py-3.5 px-3">
                      <PriorityIndicator priority={report.priority} />
                    </td>

                    <td className="py-3.5 px-3">
                      <select
                        aria-label={`Assign crew for ${report.id}`}
                        value={report.assignedCrew || 'Unassigned'}
                        onChange={(e) => onAssignCrew(report.id, e.target.value)}
                        className="px-2 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#059669]"
                      >
                        {CREW_OPTIONS.map((crew) => (
                          <option key={crew} value={crew}>
                            {crew}
                          </option>
                        ))}
                      </select>
                    </td>

                    <td className="py-3.5 px-4">
                      <select
                        aria-label={`Update status for ${report.id}`}
                        value={report.status}
                        onChange={(e) =>
                          onUpdateReportStatus(report.id, e.target.value as ReportStatus)
                        }
                        className={`px-2.5 py-1.5 text-xs font-semibold rounded-lg border focus:outline-none focus:border-[#059669] cursor-pointer ${
                          report.status === 'Resolved'
                            ? 'bg-[#ECFDF5] border-emerald-200 text-[#064E3B]'
                            : report.status === 'Under Review'
                            ? 'bg-sky-50 border-sky-200 text-sky-800'
                            : 'bg-amber-50 border-amber-200 text-amber-800'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Under Review">Under Review</option>
                        <option value="Resolved">Resolved</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredReports.length === 0 && (
              <div className="p-8 text-center text-xs text-slate-500">
                No submissions match the selected filters.
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Inspection Modal for Selected Report */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/45 backdrop-blur-[1px]">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full overflow-hidden shadow-xl">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <span className="font-mono font-semibold text-[#064E3B]">{selectedReport.id}</span>
                <span>·</span>
                <span>{selectedReport.category}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                aria-label="Close report detail"
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 space-y-4">
              {selectedReport.photoUrl && (
                <div className="rounded-xl overflow-hidden border border-slate-200 aspect-[16/10] bg-slate-50">
                  <img
                    src={selectedReport.photoUrl}
                    alt={selectedReport.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div>
                <div className="flex items-center justify-between gap-3 mb-2">
                  <h3 className="font-display font-bold text-base text-[#1F2937]">
                    {selectedReport.title}
                  </h3>
                  <StatusIndicator status={selectedReport.status} />
                </div>
                <p className="text-sm text-slate-600 leading-relaxed mb-3">
                  {selectedReport.description}
                </p>
                <p className="text-xs text-slate-500">
                  Location: <strong className="text-slate-700">{selectedReport.location}</strong> ·
                  Reported by {selectedReport.submittedBy} ({selectedReport.submittedAt})
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
