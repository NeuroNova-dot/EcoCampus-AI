import React, { useMemo, useState } from 'react';
import {
  INITIAL_ACHIEVEMENTS,
  INITIAL_CONTRIBUTIONS,
  INITIAL_LEADERBOARD,
  INITIAL_REPORTS,
  INITIAL_SCANS,
} from './data/campusData';
import {
  AchievementBadge,
  AppPage,
  ContributionEntry,
  EcoReport,
  LeaderboardEntry,
  ReportStatus,
  WasteScanRecord,
} from './types/eco';
import { LandingPage } from './components/LandingPage';
import { SidebarShell } from './components/SidebarShell';
import { OverviewPage } from './components/OverviewPage';
import { WasteVisionPage } from './components/WasteVisionPage';
import { EcoReportPage } from './components/EcoReportPage';
import { GreenDashboardPage } from './components/GreenDashboardPage';
import { GreenScorePage } from './components/GreenScorePage';
import { EcoAdvisorPage } from './components/EcoAdvisorPage';

export default function App() {
  const [activePage, setActivePage] = useState<AppPage>('landing');
  const [reports, setReports] = useState<EcoReport[]>(INITIAL_REPORTS);
  const [scans, setScans] = useState<WasteScanRecord[]>(INITIAL_SCANS);
  const [contributions, setContributions] =
    useState<ContributionEntry[]>(INITIAL_CONTRIBUTIONS);
  const [greenScore, setGreenScore] = useState<number>(1420);
  const [totalContributions, setTotalContributions] = useState<number>(48);

  const handleNavigate = (page: AppPage) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleScanComplete = (record: WasteScanRecord) => {
    setScans((prev) => [record, ...prev]);
    const pts = record.result.pointsAwarded || 25;
    setGreenScore((prev) => prev + pts);
    setTotalContributions((prev) => prev + 1);
    setContributions((prev) => [
      {
        id: `CTR-${Math.floor(402 + Math.random() * 500)}`,
        type: 'WasteVision Scan',
        title: `Analyzed ${record.result.detectedItems.length} items (${record.result.primaryStream})`,
        location: record.location,
        timestamp: 'Just now',
        points: pts,
      },
      ...prev,
    ]);
  };

  const handleSubmitReport = (
    newReport: Omit<EcoReport, 'id' | 'submittedAt' | 'status' | 'submittedBy'>
  ) => {
    const id = `ECO-${2049 + reports.length}`;
    const report: EcoReport = {
      ...newReport,
      id,
      status: 'Pending',
      submittedBy: 'Liam Mercer',
      submittedAt: 'Just now',
    };
    setReports((prev) => [report, ...prev]);
    setGreenScore((prev) => prev + 30);
    setTotalContributions((prev) => prev + 1);
    setContributions((prev) => [
      {
        id: `CTR-${Math.floor(402 + Math.random() * 500)}`,
        type: 'EcoReport Verified',
        title: `Submitted ${newReport.category} report at ${newReport.location}`,
        location: newReport.location,
        timestamp: 'Just now',
        points: 30,
      },
      ...prev,
    ]);
  };

  const handleUpdateReportStatus = (id: string, status: ReportStatus) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  };

  const handleAssignCrew = (id: string, assignedCrew: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, assignedCrew } : r))
    );
  };

  const dynamicAchievements: AchievementBadge[] = useMemo(() => {
    return INITIAL_ACHIEVEMENTS.map((ach) => {
      if (ach.id === 'ach-4') {
        return {
          ...ach,
          progress: greenScore,
          unlocked: greenScore >= ach.target,
        };
      }
      return ach;
    });
  }, [greenScore]);

  const dynamicLeaderboard: LeaderboardEntry[] = useMemo(() => {
    return INITIAL_LEADERBOARD.map((entry) =>
      entry.isCurrentUser
        ? { ...entry, score: greenScore, contributions: totalContributions }
        : entry
    )
      .sort((a, b) => b.score - a.score)
      .map((entry, idx) => ({ ...entry, rank: idx + 1 }));
  }, [greenScore, totalContributions]);

  const pendingCount = reports.filter((r) => r.status === 'Pending').length;
  const resolvedCount = reports.filter((r) => r.status === 'Resolved').length;

  if (activePage === 'landing') {
    return (
      <LandingPage
        onNavigate={handleNavigate}
        totalReports={reports.length}
        resolvedReports={resolvedCount}
      />
    );
  }

  return (
    <SidebarShell
      activePage={activePage}
      onNavigate={handleNavigate}
      greenScore={greenScore}
      pendingCount={pendingCount}
    >
      {activePage === 'overview' && (
        <OverviewPage
          onNavigate={handleNavigate}
          reports={reports}
          scans={scans}
          greenScore={greenScore}
          totalContributions={totalContributions}
        />
      )}

      {activePage === 'wastevision' && (
        <WasteVisionPage
          onScanComplete={handleScanComplete}
          onNavigate={handleNavigate}
          recentScans={scans}
        />
      )}

      {activePage === 'ecoreport' && (
        <EcoReportPage
          reports={reports}
          onSubmitReport={handleSubmitReport}
        />
      )}

      {activePage === 'green-dashboard' && (
        <GreenDashboardPage
          reports={reports}
          onUpdateReportStatus={handleUpdateReportStatus}
          onAssignCrew={handleAssignCrew}
        />
      )}

      {activePage === 'greenscore' && (
        <GreenScorePage
          greenScore={greenScore}
          contributions={contributions}
          achievements={dynamicAchievements}
          leaderboard={dynamicLeaderboard}
        />
      )}

      {activePage === 'ecoadvisor' && (
        <EcoAdvisorPage
          greenScore={greenScore}
          totalReports={reports.length}
          totalScans={scans.length}
        />
      )}
    </SidebarShell>
  );
}
