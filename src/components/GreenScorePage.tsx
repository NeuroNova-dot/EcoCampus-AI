import React, { useState } from 'react';
import {
  Award,
  ScanLine,
  ShieldCheck,
  Leaf,
  Droplets,
  Zap,
  CheckCircle2,
  Flame,
} from 'lucide-react';
import { AchievementBadge, ContributionEntry, LeaderboardEntry } from '../types/eco';

interface GreenScorePageProps {
  greenScore: number;
  contributions: ContributionEntry[];
  achievements: AchievementBadge[];
  leaderboard: LeaderboardEntry[];
}

export function GreenScorePage({
  greenScore,
  contributions,
  achievements,
  leaderboard,
}: GreenScorePageProps) {
  const [typeFilter, setTypeFilter] = useState<'All' | ContributionEntry['type']>('All');

  const nextMilestone = 1500;
  const progressPct = Math.min(100, Math.round((greenScore / nextMilestone) * 100));
  const pointsRemaining = Math.max(0, nextMilestone - greenScore);

  const filteredContributions =
    typeFilter === 'All'
      ? contributions
      : contributions.filter((c) => c.type === typeFilter);

  const renderBadgeIcon = (iconName: AchievementBadge['iconName'], unlocked: boolean) => {
    const cls = `w-5 h-5 ${unlocked ? 'text-[#059669]' : 'text-slate-400'}`;
    switch (iconName) {
      case 'scan':
        return <ScanLine className={cls} />;
      case 'shield':
        return <ShieldCheck className={cls} />;
      case 'leaf':
        return <Leaf className={cls} />;
      case 'droplet':
        return <Droplets className={cls} />;
      case 'zap':
        return <Zap className={cls} />;
      default:
        return <Award className={cls} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero GreenScore Summary */}
      <section className="bg-[#064E3B] text-white rounded-2xl p-6 sm:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7">
            <p className="text-xs font-semibold text-emerald-200 mb-1.5">
              Personal Sustainability Standing · Birangana Sati Sadhani Rajyik Vishwavidyalaya (BSSRV)
            </p>
            <div className="flex items-baseline gap-3 mb-3">
              <span className="font-display text-4xl sm:text-5xl font-bold tracking-tight tabular-nums">
                {greenScore.toLocaleString()}
              </span>
              <span className="text-sm font-medium text-emerald-200">GreenScore Points</span>
            </div>
            <p className="text-sm text-emerald-100/90 max-w-xl">
              {pointsRemaining > 0
                ? `${pointsRemaining} points needed to unlock Campus Steward Tier and earn double hall-cup credit.`
                : 'Campus Steward Tier unlocked. Your residence hall receives bonus sustainability credit this semester.'}
            </p>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/10 rounded-xl p-4">
                <p className="text-xs text-emerald-200 mb-1">Campus Rank</p>
                <p className="font-display text-2xl font-bold tabular-nums">
                  #4 <span className="text-xs font-normal text-emerald-200">/ 1,840</span>
                </p>
              </div>
              <div className="bg-white/10 rounded-xl p-4">
                <p className="text-xs text-emerald-200 mb-1">Active Streak</p>
                <p className="font-display text-2xl font-bold tabular-nums flex items-center gap-1.5">
                  <Flame className="w-5 h-5 text-emerald-300" />
                  <span>12 days</span>
                </p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs text-emerald-100 mb-1.5 tabular-nums">
                <span>Progress to Campus Steward</span>
                <span className="font-mono font-semibold">
                  {greenScore.toLocaleString()} / {nextMilestone.toLocaleString()}
                </span>
              </div>
              <div className="h-2 bg-white/15 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-300 rounded-full transition-all duration-300"
                  style={{ width: `${progressPct}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contribution History & Leaderboard */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Contribution History */}
        <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-2xl overflow-hidden">
          <div className="p-5 sm:px-6 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="font-display font-bold text-base text-[#064E3B]">
                Contribution History
              </h2>
              <p className="text-xs text-slate-500">Verified waste scans, reports & audits</p>
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg overflow-x-auto">
              {(['All', 'WasteVision Scan', 'EcoReport Verified'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setTypeFilter(tab)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    typeFilter === tab
                      ? 'bg-white text-[#064E3B] shadow-xs'
                      : 'text-slate-600 hover:text-[#1F2937]'
                  }`}
                >
                  {tab === 'All' ? 'All' : tab === 'WasteVision Scan' ? 'Scans' : 'Reports'}
                </button>
              ))}
            </div>
          </div>

          <div className="divide-y divide-slate-200/80">
            {filteredContributions.map((entry) => (
              <div
                key={entry.id}
                className="p-4 sm:px-6 flex items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-xs text-slate-500 mb-0.5">
                    <span className="font-medium text-[#064E3B]">{entry.type}</span>
                    <span aria-hidden="true">·</span>
                    <span>{entry.location}</span>
                    <span aria-hidden="true">·</span>
                    <span>{entry.timestamp}</span>
                  </div>
                  <p className="text-sm font-semibold text-[#1F2937] truncate">{entry.title}</p>
                </div>
                <span className="font-mono text-sm font-bold text-[#059669] whitespace-nowrap shrink-0 tabular-nums">
                  +{entry.points}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Campus Leaderboard */}
        <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-2xl overflow-hidden">
          <div className="p-5 sm:px-6 border-b border-slate-200/80">
            <h2 className="font-display font-bold text-base text-[#064E3B]">
              Campus Leaderboard
            </h2>
            <p className="text-xs text-slate-500">Top student contributors this semester</p>
          </div>

          <div className="divide-y divide-slate-200/80">
            {leaderboard.map((row) => (
              <div
                key={row.name}
                className={`p-4 sm:px-5 flex items-center justify-between gap-3 ${
                  row.isCurrentUser ? 'bg-[#ECFDF5]/60' : ''
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className={`w-7 h-7 rounded-lg font-mono text-xs font-bold flex items-center justify-center shrink-0 tabular-nums ${
                      row.rank <= 3
                        ? 'bg-[#064E3B] text-white'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {row.rank}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#1F2937] truncate">
                      {row.name}{' '}
                      {row.isCurrentUser && (
                        <span className="text-xs font-medium text-[#059669]">(You)</span>
                      )}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {row.hall} · <span className="tabular-nums">{row.contributions} actions</span>
                    </p>
                  </div>
                </div>

                <span className="font-mono text-sm font-bold text-[#064E3B] tabular-nums shrink-0">
                  {row.score.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Grid */}
      <section className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6">
        <div className="mb-5">
          <h2 className="font-display font-bold text-base text-[#064E3B]">
            Sustainability Achievements
          </h2>
          <p className="text-xs text-slate-500">
            {achievements.filter((a) => a.unlocked).length} of {achievements.length} milestones
            unlocked
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {achievements.map((ach) => {
            const pct = Math.min(100, Math.round((ach.progress / ach.target) * 100));
            return (
              <div
                key={ach.id}
                className={`p-4 rounded-xl border ${
                  ach.unlocked
                    ? 'border-emerald-200/80 bg-[#ECFDF5]/35'
                    : 'border-slate-200/90 bg-white'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      ach.unlocked ? 'bg-[#ECFDF5]' : 'bg-slate-100'
                    }`}
                  >
                    {renderBadgeIcon(ach.iconName, ach.unlocked)}
                  </div>

                  {ach.unlocked ? (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-[#059669]">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Unlocked
                    </span>
                  ) : (
                    <span className="font-mono text-xs font-medium text-slate-500 tabular-nums">
                      {ach.progress.toLocaleString()} / {ach.target.toLocaleString()}
                    </span>
                  )}
                </div>

                <h3 className="font-display font-bold text-sm text-[#1F2937] mb-1">
                  {ach.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-3">{ach.description}</p>

                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      ach.unlocked ? 'bg-[#059669]' : 'bg-slate-400'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
