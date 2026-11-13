export type AppPage =
  | 'landing'
  | 'overview'
  | 'wastevision'
  | 'ecoreport'
  | 'green-dashboard'
  | 'greenscore'
  | 'ecoadvisor'
  | 'about'
  | 'feedback';

export type ReportStatus = 'Pending' | 'Under Review' | 'Resolved';

export type ReportCategory =
  | 'Overflowing Bin'
  | 'Contaminated Recycling'
  | 'Water Leak'
  | 'Energy Waste'
  | 'Litter / Illegal Dumping'
  | 'Broken Station'
  | 'Other';

export interface EcoReport {
  id: string;
  title: string;
  category: ReportCategory;
  location: string;
  description: string;
  status: ReportStatus;
  submittedBy: string;
  submittedAt: string;
  priority: 'Low' | 'Medium' | 'High';
  photoUrl?: string;
  assignedCrew?: string;
}

export interface DetectedWasteItem {
  name: string;
  category: 'Recyclable' | 'Compostable' | 'Landfill' | 'E-Waste' | 'Hazardous' | string;
  material: string;
  bin: string;
  confidence: number;
}

export interface DisposalRecommendation {
  stepTitle: string;
  instruction: string;
  targetBin: string;
}

export interface WasteAnalysisResult {
  summary: string;
  primaryStream: string;
  detectedItems: DetectedWasteItem[];
  observations: string[];
  uncertainty: {
    level: 'Low' | 'Moderate' | 'High' | string;
    explanation: string;
  };
  disposalRecommendations: DisposalRecommendation[];
  pointsAwarded: number;
}

export interface WasteScanRecord {
  id: string;
  timestamp: string;
  location: string;
  imageUrl: string;
  result: WasteAnalysisResult;
}

export interface ContributionEntry {
  id: string;
  type: 'WasteVision Scan' | 'EcoReport Verified' | 'Zero-Waste Challenge' | 'Energy Audit';
  title: string;
  location: string;
  timestamp: string;
  points: number;
}

export interface AchievementBadge {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  unlocked: boolean;
  iconName: 'scan' | 'shield' | 'leaf' | 'droplet' | 'zap' | 'award';
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  hall: string;
  contributions: number;
  score: number;
  isCurrentUser?: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export type FeedbackModule =
  | 'General Experience'
  | 'WasteVision AI'
  | 'EcoReport'
  | 'Green Dashboard'
  | 'GreenScore'
  | 'EcoAdvisor'
  | 'Other';

export interface FeedbackEntry {
  id: string;
  authorRole: string;
  module: FeedbackModule;
  rating: number;
  comment: string;
  timestamp: string;
  helpfulCount: number;
}
