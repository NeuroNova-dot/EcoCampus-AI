import React, { useRef, useState } from 'react';
import {
  Upload,
  MapPin,
  CheckCircle2,
  Search,
  Image as ImageIcon,
  Trash2,
  Send,
} from 'lucide-react';
import { EcoReport, ReportCategory, ReportStatus } from '../types/eco';
import { CAMPUS_IMAGES, CAMPUS_LOCATIONS } from '../data/campusData';
import { PriorityIndicator, StatusIndicator } from './EcoLogo';

interface EcoReportPageProps {
  reports: EcoReport[];
  onSubmitReport: (newReport: Omit<EcoReport, 'id' | 'submittedAt' | 'status' | 'submittedBy'>) => void;
}

const CATEGORIES: ReportCategory[] = [
  'Overflowing Bin',
  'Contaminated Recycling',
  'Water Leak',
  'Energy Waste',
  'Litter / Illegal Dumping',
  'Broken Station',
];

export function EcoReportPage({ reports, onSubmitReport }: EcoReportPageProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ReportCategory>('Overflowing Bin');
  const [location, setLocation] = useState<string>(CAMPUS_LOCATIONS[0]);
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High'>('Medium');
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState<string | undefined>(undefined);

  const [formError, setFormError] = useState<string | null>(null);
  const [submittedNotice, setSubmittedNotice] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<'All' | ReportStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handlePhotoUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setFormError('Please upload a valid image file (PNG, JPG, WEBP).');
      return;
    }
    setFormError(null);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPhotoUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!description.trim() || description.trim().length < 10) {
      setFormError('Please provide a clear description (at least 10 characters) so crews can locate and resolve the issue.');
      return;
    }

    const derivedTitle =
      title.trim() || `${category} reported at ${location}`;

    onSubmitReport({
      title: derivedTitle,
      category,
      location,
      description: description.trim(),
      priority,
      photoUrl,
      assignedCrew: 'Unassigned',
    });

    setTitle('');
    setDescription('');
    setPhotoUrl(undefined);
    setSubmittedNotice(`Report submitted for ${location}. +30 GreenScore points credited.`);
    setTimeout(() => setSubmittedNotice(null), 5000);
  };

  const filteredReports = reports.filter((r) => {
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    const q = searchQuery.trim().toLowerCase();
    const matchesQuery =
      !q ||
      r.title.toLowerCase().includes(q) ||
      r.location.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q) ||
      r.id.toLowerCase().includes(q);
    return matchesStatus && matchesQuery;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left: Issue Reporting Form */}
      <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6">
        <div className="mb-5">
          <h2 className="font-display font-bold text-lg text-[#064E3B]">
            Submit Environmental Issue
          </h2>
          <p className="text-xs text-slate-500">
            Route campus sustainability problems directly to grounds and facilities teams.
          </p>
        </div>

        {submittedNotice && (
          <div className="mb-5 p-3.5 rounded-xl bg-[#ECFDF5] border border-emerald-200 text-xs font-medium text-[#064E3B] flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
            <span>{submittedNotice}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="er-category" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Issue Category
            </label>
            <select
              id="er-category"
              value={category}
              onChange={(e) => setCategory(e.target.value as ReportCategory)}
              className="w-full px-3 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669]/30 focus:border-[#059669]"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label htmlFor="er-location" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Campus Location
              </label>
              <select
                id="er-location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669]/30 focus:border-[#059669]"
              >
                {CAMPUS_LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="er-priority" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Urgency
              </label>
              <select
                id="er-priority"
                value={priority}
                onChange={(e) => setPriority(e.target.value as 'Low' | 'Medium' | 'High')}
                className="w-full px-3 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669]/30 focus:border-[#059669]"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="er-title" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Short Headline (optional)
            </label>
            <input
              id="er-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., East entrance recycling bin overflowing"
              className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669]/30 focus:border-[#059669]"
            />
          </div>

          <div>
            <label htmlFor="er-desc" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Description
            </label>
            <textarea
              id="er-desc"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe exact floor, entrance, bin condition, or safety impact..."
              className="w-full px-3 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669]/30 focus:border-[#059669] resize-none"
            />
          </div>

          {/* Photograph Upload */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-semibold text-slate-700">Photograph Evidence</span>
              {!photoUrl && (
                <button
                  type="button"
                  onClick={() => setPhotoUrl(CAMPUS_IMAGES.issueOverflowBin)}
                  className="text-xs font-medium text-[#059669] hover:text-[#064E3B] cursor-pointer"
                >
                  Use sample campus photo
                </button>
              )}
            </div>

            {photoUrl ? (
              <div className="relative rounded-xl overflow-hidden border border-slate-200 aspect-[16/10] bg-slate-50">
                <img
                  src={photoUrl}
                  alt="Attached environmental issue"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setPhotoUrl(undefined)}
                  aria-label="Remove attached photo"
                  className="absolute top-2.5 right-2.5 p-1.5 bg-white/95 text-slate-700 hover:text-red-600 rounded-lg border border-slate-200 cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-5 px-4 rounded-xl border border-dashed border-slate-300 hover:border-[#059669] hover:bg-slate-50/70 transition-colors flex flex-col items-center justify-center gap-1.5 text-slate-500 cursor-pointer"
              >
                <Upload className="w-4 h-4 text-[#059669]" />
                <span className="text-xs font-medium text-[#1F2937]">
                  Attach campus photo (optional)
                </span>
                <span className="text-[11px] text-slate-400">JPG, PNG, or WEBP</span>
              </button>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handlePhotoUpload(file);
              }}
            />
          </div>

          {formError && (
            <p className="text-xs font-medium text-red-600">{formError}</p>
          )}

          <button
            type="submit"
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-[#059669] hover:bg-[#064E3B] rounded-xl transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Submit Report</span>
          </button>
        </form>
      </div>

      {/* Right: Campus Issue Tracker */}
      <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-2xl overflow-hidden">
        <div className="p-5 sm:px-6 border-b border-slate-200/80 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-display font-bold text-lg text-[#064E3B]">
                Campus EcoReport Feed
              </h2>
              <p className="text-xs text-slate-500 tabular-nums">
                Showing {filteredReports.length} of {reports.length} campus reports
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
              placeholder="Search by ID, building location, or category..."
              className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50/70 border border-slate-200 rounded-xl focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#059669]/30 focus:border-[#059669]"
            />
          </div>
        </div>

        {filteredReports.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm font-semibold text-[#1F2937] mb-1">
              No matching campus reports
            </p>
            <p className="text-xs text-slate-500">
              Adjust your search terms or status filter to view other reports.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200/80">
            {filteredReports.map((report) => (
              <article key={report.id} className="p-5 sm:px-6 hover:bg-slate-50/60 transition-colors">
                <div className="flex flex-col sm:flex-row gap-4">
                  {report.photoUrl ? (
                    <div className="w-full sm:w-28 h-24 rounded-xl overflow-hidden border border-slate-200 shrink-0 bg-slate-100">
                      <img
                        src={report.photoUrl}
                        alt={report.title}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="hidden sm:flex w-28 h-24 rounded-xl border border-slate-200/80 bg-slate-50 shrink-0 items-center justify-center text-slate-300">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-2 text-xs text-slate-500">
                        <span className="font-mono font-medium text-slate-600">{report.id}</span>
                        <span aria-hidden="true">·</span>
                        <span>{report.category}</span>
                        <span aria-hidden="true">·</span>
                        <PriorityIndicator priority={report.priority} />
                      </div>
                      <StatusIndicator status={report.status} />
                    </div>

                    <h3 className="text-sm font-bold text-[#1F2937] mb-1">{report.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-2.5">
                      {report.description}
                    </p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {report.location}
                      </span>
                      <span>Reported by {report.submittedBy}</span>
                      <span>{report.submittedAt}</span>
                      {report.assignedCrew && report.assignedCrew !== 'Unassigned' && (
                        <span className="font-medium text-[#064E3B]">
                          Crew: {report.assignedCrew}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
