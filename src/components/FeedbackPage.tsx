import React, { useMemo, useState } from 'react';
import {
  Star,
  Send,
  CheckCircle2,
  ThumbsUp,
  MessageSquareHeart,
  Sparkles,
} from 'lucide-react';
import { FeedbackEntry, FeedbackModule } from '../types/eco';

interface FeedbackPageProps {
  feedbackList: FeedbackEntry[];
  onSubmitFeedback: (entry: {
    authorRole: string;
    module: FeedbackModule;
    rating: number;
    comment: string;
  }) => void;
  onToggleHelpful: (id: string) => void;
  helpfulIds: Record<string, boolean>;
}

const FEEDBACK_MODULES: FeedbackModule[] = [
  'General Experience',
  'WasteVision AI',
  'EcoReport',
  'Green Dashboard',
  'GreenScore',
  'EcoAdvisor',
  'Other',
];

const CAMPUS_ROLES = [
  'BSSRV Student',
  'Applied Science (Physics) Student',
  'Applied Science (Chemistry) Student',
  'BSSRV Faculty / Staff',
  'Campus Visitor',
  'Other',
];

const RATING_LABELS: Record<number, string> = {
  1: 'Needs work',
  2: 'Fair',
  3: 'Good',
  4: 'Very good',
  5: 'Excellent',
};

export function FeedbackPage({
  feedbackList,
  onSubmitFeedback,
  onToggleHelpful,
  helpfulIds,
}: FeedbackPageProps) {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number | null>(null);
  const [module, setModule] = useState<FeedbackModule>('General Experience');
  const [authorRole, setAuthorRole] = useState<string>(CAMPUS_ROLES[0]);
  const [customRole, setCustomRole] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const [formError, setFormError] = useState<string | null>(null);
  const [submittedNotice, setSubmittedNotice] = useState<string | null>(null);
  const [moduleFilter, setModuleFilter] = useState<'All' | FeedbackModule>('All');

  const activeRating = hoverRating ?? rating;

  const stats = useMemo(() => {
    const total = feedbackList.length;
    const sum = feedbackList.reduce((acc, item) => acc + item.rating, 0);
    const average = total > 0 ? (sum / total).toFixed(1) : '0.0';
    const fiveStarCount = feedbackList.filter((item) => item.rating === 5).length;
    const fiveStarPct = total > 0 ? Math.round((fiveStarCount / total) * 100) : 0;
    const totalHelpful = feedbackList.reduce((acc, item) => acc + item.helpfulCount, 0);
    return { total, average, fiveStarPct, totalHelpful };
  }, [feedbackList]);

  const filteredFeedback = useMemo(() => {
    if (moduleFilter === 'All') return feedbackList;
    return feedbackList.filter((item) => item.module === moduleFilter);
  }, [feedbackList, moduleFilter]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (comment.trim().length < 8) {
      setFormError('Please share at least a short sentence (8+ characters) of feedback.');
      return;
    }

    const finalRole =
      authorRole === 'Other' && customRole.trim()
        ? customRole.trim()
        : authorRole === 'Other'
        ? 'BSSRV Campus Contributor'
        : authorRole;

    onSubmitFeedback({
      authorRole: finalRole,
      module,
      rating,
      comment: comment.trim(),
    });

    setComment('');
    setCustomRole('');
    setRating(5);
    setSubmittedNotice(
      'Thank you for sharing feedback with Team Neuro Nova. +15 GreenScore points credited.'
    );
    setTimeout(() => setSubmittedNotice(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Top KPI Summary Row */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Average Campus Rating</span>
            <Star className="w-4 h-4 text-[#059669] fill-[#059669]" />
          </div>
          <p className="font-display text-3xl font-bold text-[#064E3B] tabular-nums">
            {stats.average} <span className="text-base font-medium text-slate-400">/ 5.0</span>
          </p>
          <p className="text-xs text-[#059669] font-medium mt-1 tabular-nums">
            {stats.fiveStarPct}% five-star satisfaction
          </p>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Feedback Responses</span>
            <MessageSquareHeart className="w-4 h-4 text-[#059669]" />
          </div>
          <p className="font-display text-3xl font-bold text-[#064E3B] tabular-nums">
            {stats.total}
          </p>
          <p className="text-xs text-slate-500 mt-1">Across BSSRV sustainability modules</p>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-2xl p-5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500">Community Upvotes</span>
            <ThumbsUp className="w-4 h-4 text-[#059669]" />
          </div>
          <p className="font-display text-3xl font-bold text-[#064E3B] tabular-nums">
            {stats.totalHelpful}
          </p>
          <p className="text-xs text-slate-500 mt-1">Helpful peer endorsements logged</p>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Feedback Form */}
        <section className="lg:col-span-5 bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6">
          <div className="mb-5">
            <h2 className="font-display font-bold text-lg text-[#064E3B]">
              Share Campus Feedback
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Help Team Neuro Nova improve EcoCampus AI across Birangana Sati Sadhani Rajyik
              Vishwavidyalaya (BSSRV).
            </p>
          </div>

          {submittedNotice && (
            <div className="mb-5 p-3.5 rounded-xl bg-[#ECFDF5] border border-emerald-200 text-xs font-medium text-[#064E3B] flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
              <span>{submittedNotice}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Star Rating */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-700">Overall Experience</span>
                <span className="text-xs font-semibold text-[#059669] tabular-nums">
                  {activeRating}/5 · {RATING_LABELS[activeRating]}
                </span>
              </div>
              <div
                className="flex items-center gap-2 p-2.5 rounded-xl border border-slate-200 bg-slate-50/70"
                onMouseLeave={() => setHoverRating(null)}
              >
                {[1, 2, 3, 4, 5].map((value) => {
                  const filled = value <= activeRating;
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRating(value)}
                      onMouseEnter={() => setHoverRating(value)}
                      aria-label={`Rate ${value} out of 5 stars`}
                      className="p-1.5 rounded-lg hover:bg-white transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#059669]"
                    >
                      <Star
                        className={`w-6 h-6 transition-colors ${
                          filled
                            ? 'text-[#059669] fill-[#059669]'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Module & Campus Role */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="fb-module"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Feature / Area
                </label>
                <select
                  id="fb-module"
                  value={module}
                  onChange={(e) => setModule(e.target.value as FeedbackModule)}
                  className="w-full px-3 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669]/30 focus:border-[#059669]"
                >
                  {FEEDBACK_MODULES.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label
                  htmlFor="fb-role"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Campus Role
                </label>
                <select
                  id="fb-role"
                  value={authorRole}
                  onChange={(e) => setAuthorRole(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669]/30 focus:border-[#059669]"
                >
                  {CAMPUS_ROLES.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {authorRole === 'Other' && (
              <div>
                <label
                  htmlFor="fb-custom-role"
                  className="block text-xs font-semibold text-slate-700 mb-1.5"
                >
                  Specify Campus Role (optional)
                </label>
                <input
                  id="fb-custom-role"
                  type="text"
                  value={customRole}
                  onChange={(e) => setCustomRole(e.target.value)}
                  placeholder="e.g., Life Sciences Dept. Student"
                  className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669]/30 focus:border-[#059669]"
                />
              </div>
            )}

            <div>
              <label
                htmlFor="fb-comment"
                className="block text-xs font-semibold text-slate-700 mb-1.5"
              >
                Your Feedback or Suggestion
              </label>
              <textarea
                id="fb-comment"
                rows={4}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell us what worked well, what could be faster, or any new campus bin/sustainability feature you'd like..."
                className="w-full px-3 py-2.5 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#059669]/30 focus:border-[#059669] resize-none"
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
              <span>Submit Feedback</span>
            </button>

            <p className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
              <Sparkles className="w-3.5 h-3.5 text-[#059669] shrink-0" />
              <span>Every submitted campus feedback credits +15 GreenScore points.</span>
            </p>
          </form>
        </section>

        {/* Right Column: Community Feedback Feed */}
        <section className="lg:col-span-7 bg-white border border-slate-200/90 rounded-2xl overflow-hidden">
          <div className="p-5 sm:px-6 border-b border-slate-200/80 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="font-display font-bold text-lg text-[#064E3B]">
                  BSSRV Community Feedback
                </h2>
                <p className="text-xs text-slate-500 tabular-nums">
                  Showing {filteredFeedback.length} of {feedbackList.length} responses
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5">
              {(
                [
                  'All',
                  'WasteVision AI',
                  'EcoReport',
                  'Green Dashboard',
                  'EcoAdvisor',
                  'General Experience',
                  'Other',
                ] as const
              ).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setModuleFilter(tab)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                    moduleFilter === tab
                      ? 'bg-[#ECFDF5] text-[#064E3B] font-semibold'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-[#1F2937]'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {filteredFeedback.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-sm font-semibold text-[#1F2937] mb-1">
                No feedback entries in this category yet
              </p>
              <p className="text-xs text-slate-500">
                Be the first on campus to submit feedback for {moduleFilter}.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200/80">
              {filteredFeedback.map((entry) => {
                const isHelpful = Boolean(helpfulIds[entry.id]);
                return (
                  <article key={entry.id} className="p-5 sm:px-6 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500">
                        <span className="font-semibold text-[#1F2937]">{entry.authorRole}</span>
                        <span aria-hidden="true">·</span>
                        <span className="text-[#059669] font-medium">{entry.module}</span>
                        <span aria-hidden="true">·</span>
                        <span>{entry.timestamp}</span>
                      </div>

                      <div
                        className="flex items-center gap-0.5"
                        aria-label={`Rated ${entry.rating} out of 5 stars`}
                      >
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3.5 h-3.5 ${
                              star <= entry.rating
                                ? 'text-[#059669] fill-[#059669]'
                                : 'text-slate-200'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <p className="text-sm text-[#1F2937] leading-relaxed">{entry.comment}</p>

                    <div className="flex items-center justify-between pt-1">
                      <span className="font-mono text-[11px] text-slate-400">{entry.id}</span>
                      <button
                        type="button"
                        onClick={() => onToggleHelpful(entry.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
                          isHelpful
                            ? 'bg-[#ECFDF5] border-emerald-200 text-[#064E3B]'
                            : 'bg-white border-slate-200 text-slate-600 hover:border-[#059669]/40 hover:text-[#064E3B]'
                        }`}
                      >
                        <ThumbsUp
                          className={`w-3.5 h-3.5 ${
                            isHelpful ? 'text-[#059669]' : 'text-slate-400'
                          }`}
                        />
                        <span className="tabular-nums">Helpful ({entry.helpfulCount})</span>
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
