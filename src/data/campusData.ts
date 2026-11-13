import {
  AchievementBadge,
  ContributionEntry,
  EcoReport,
  LeaderboardEntry,
  WasteScanRecord,
} from '../types/eco';

export const CAMPUS_IMAGES = {
  heroCampus: '/src/assets/images/hero_sustainable_campus_1794556180955.jpg',
  bssrvCampus: '/assets/aistudio/WhatsApp_Image_2026-11-13_at_7.38.30_PM_81f6450a.jpeg',
  wasteVisionBanner: '/assets/aistudio/WhatsApp_Image_2026-11-13_at_8.08.17_PM_584f106e.jpeg',
  sampleDiningCompostables:
    '/assets/aistudio/WhatsApp_Image_2026-11-13_at_8.43.06_PM__1__407534e9.jpeg',
  sampleCafeteriaCups: '/assets/aistudio/WhatsApp_Image_2026-11-13_at_8.43.06_PM_5faee51e.jpeg',
  wasteRecyclables: '/src/assets/images/waste_sample_recyclables_1794556180539.jpg',
  wasteCompost: '/src/assets/images/waste_sample_compost_1794556181070.jpg',
  issueOverflowBin: '/assets/aistudio/WhatsApp_Image_2026-11-13_at_9.05.43_PM_6b684725.jpeg',
};

export const CAMPUS_LOCATIONS = [
  'BSSRV Main Academic Building',
  'Applied Science Wing',
  'BSSRV Central Courtyard',
  'BSSRV Library & Reading Hall',
  'BSSRV Administrative Block',
  'BSSRV Student Commons',
  'BSSRV Campus Perimeter & Parking',
];

export const INITIAL_REPORTS: EcoReport[] = [
  {
    id: 'ECO-2048',
    title: 'Overflowing cardboard & PET bottles at Library Walkway triple-bin station',
    category: 'Overflowing Bin',
    location: 'BSSRV Library & Reading Hall',
    description:
      'Cardboard boxes and plastic beverage bottles have spilled onto the walkway beside the paper recycling compartment after afternoon deliveries.',
    status: 'Pending',
    submittedBy: 'Applied Science Dept.',
    submittedAt: '24 mins ago',
    priority: 'High',
    photoUrl: CAMPUS_IMAGES.issueOverflowBin,
    assignedCrew: 'Unassigned',
  },
  {
    id: 'ECO-2047',
    title: 'Food waste contamination inside blue recycling bin',
    category: 'Contaminated Recycling',
    location: 'BSSRV Student Commons',
    description:
      'Unrinsed food containers and beverage cups were placed in the dry paper & plastics bin near the main entrance.',
    status: 'Under Review',
    submittedBy: 'BSSRV Student',
    submittedAt: '2 hours ago',
    priority: 'Medium',
    assignedCrew: 'Zero-Waste Crew B',
  },
  {
    id: 'ECO-2045',
    title: 'Continuous water drip from courtyard hydration refill station',
    category: 'Water Leak',
    location: 'Applied Science Wing',
    description:
      'Water tap valve is sticking open, wasting roughly 1–2 liters per minute into the courtyard drain.',
    status: 'Under Review',
    submittedBy: 'Physics Eco Monitor',
    submittedAt: '5 hours ago',
    priority: 'High',
    assignedCrew: 'Facilities Plumbing',
  },
  {
    id: 'ECO-2041',
    title: 'Lecture Hall lighting & ventilation running overnight',
    category: 'Energy Waste',
    location: 'BSSRV Main Academic Building',
    description:
      'Classroom lights and ceiling fans remained powered after evening academic sessions ended.',
    status: 'Resolved',
    submittedBy: 'BSSRV Student',
    submittedAt: 'Yesterday',
    priority: 'Medium',
    assignedCrew: 'Building Automation',
  },
  {
    id: 'ECO-2039',
    title: 'Damaged compost bin hinge blocking lid closure',
    category: 'Broken Station',
    location: 'BSSRV Central Courtyard',
    description:
      'Green organic bin lid cannot latch cleanly, causing odor near outdoor seating.',
    status: 'Resolved',
    submittedBy: 'Chemistry Green Unit',
    submittedAt: '2 days ago',
    priority: 'Low',
    assignedCrew: 'Campus Grounds',
  },
  {
    id: 'ECO-2036',
    title: 'Packaging foam & cartons left behind service road',
    category: 'Litter / Illegal Dumping',
    location: 'BSSRV Campus Perimeter & Parking',
    description:
      'Expanded polystyrene sheets stacked outdoors near the boundary wall after equipment delivery.',
    status: 'Resolved',
    submittedBy: 'BSSRV Green Cell',
    submittedAt: '3 days ago',
    priority: 'Medium',
    assignedCrew: 'Campus Grounds',
  },
  {
    id: 'ECO-2033',
    title: 'Battery e-waste drop box intake flap jammed',
    category: 'Broken Station',
    location: 'BSSRV Administrative Block',
    description:
      'Intake slot on the dry-cell battery collection unit is stuck shut.',
    status: 'Pending',
    submittedBy: 'Applied Science Dept.',
    submittedAt: '4 days ago',
    priority: 'Low',
    assignedCrew: 'Unassigned',
  },
];

export const INITIAL_SCANS: WasteScanRecord[] = [
  {
    id: 'SCN-912',
    timestamp: 'Today, 11:18 AM',
    location: 'BSSRV Student Commons',
    imageUrl: CAMPUS_IMAGES.wasteRecyclables,
    result: {
      summary:
        'Mixed cafeteria tray containing two high-value recyclables (PET bottle, aluminum can) alongside a poly-lined paper cup and soiled napkin.',
      primaryStream: 'Mixed Stream',
      detectedItems: [
        {
          name: 'Crushed PET Water Bottle',
          category: 'Recyclable',
          material: 'Clear PET #1 Plastic',
          bin: 'Blue (Recycling)',
          confidence: 97,
        },
        {
          name: 'Aluminum Beverage Can',
          category: 'Recyclable',
          material: 'Aluminum Alloy',
          bin: 'Blue (Recycling)',
          confidence: 98,
        },
        {
          name: 'Disposable Paper Coffee Cup + Lid',
          category: 'Landfill',
          material: 'PE-Lined Paper & #6 PS Lid',
          bin: 'Black (Landfill)',
          confidence: 86,
        },
        {
          name: 'Coffee-Stained Paper Napkin',
          category: 'Compostable',
          material: 'Uncoated Cellulose Fiber',
          bin: 'Green (Compost)',
          confidence: 91,
        },
      ],
      observations: [
        'Water bottle is empty and crushed, preventing liquid contamination of nearby paper.',
        'Coffee cup shows a kraft cardboard sleeve (recyclable) over a poly-lined cup body.',
        'Napkin is visibly soiled with organic residue, making it unsuitable for paper recycling.',
      ],
      uncertainty: {
        level: 'Moderate',
        explanation:
          'Cup interior lining cannot be visually verified as PLA compostable vs. standard polyethylene; check bottom stamp before placing in Green Compost.',
      },
      disposalRecommendations: [
        {
          stepTitle: 'Recycle Bottle & Can',
          instruction: 'Place the empty PET bottle and aluminum can directly into Blue Recycling.',
          targetBin: 'Blue (Recycling)',
        },
        {
          stepTitle: 'Separate Cup Components',
          instruction:
            'Slide off the dry kraft sleeve for Blue Recycling; discard plastic lid and lined cup in Landfill unless certified BPI compostable.',
          targetBin: 'Black (Landfill)',
        },
        {
          stepTitle: 'Compost Soiled Napkin',
          instruction: 'Drop the coffee-stained napkin into Green Compost.',
          targetBin: 'Green (Compost)',
        },
      ],
      pointsAwarded: 25,
    },
  },
];

export const INITIAL_CONTRIBUTIONS: ContributionEntry[] = [
  {
    id: 'CTR-401',
    type: 'EcoReport Verified',
    title: 'Submitted overflowing bin report at Library & Reading Hall',
    location: 'BSSRV Library & Reading Hall',
    timestamp: '24 mins ago',
    points: 30,
  },
  {
    id: 'CTR-400',
    type: 'WasteVision Scan',
    title: 'Sorted 4 cafeteria items (PET, aluminum, cup, napkin)',
    location: 'BSSRV Student Commons',
    timestamp: 'Today, 11:18 AM',
    points: 25,
  },
  {
    id: 'CTR-399',
    type: 'EcoReport Verified',
    title: 'Flagged contaminated recycling stream at Student Commons',
    location: 'BSSRV Student Commons',
    timestamp: 'Today, 9:05 AM',
    points: 25,
  },
  {
    id: 'CTR-398',
    type: 'Zero-Waste Challenge',
    title: 'Completed 5 consecutive reusable-bottle check-ins',
    location: 'Applied Science Wing',
    timestamp: 'Yesterday',
    points: 50,
  },
  {
    id: 'CTR-397',
    type: 'Energy Audit',
    title: 'Reported overnight Main Academic Building lighting waste',
    location: 'BSSRV Main Academic Building',
    timestamp: 'Yesterday',
    points: 40,
  },
  {
    id: 'CTR-396',
    type: 'WasteVision Scan',
    title: 'Verified compostable dining tray & wooden cutlery',
    location: 'BSSRV Student Commons',
    timestamp: '2 days ago',
    points: 20,
  },
];

export const INITIAL_ACHIEVEMENTS: AchievementBadge[] = [
  {
    id: 'ach-1',
    title: 'Zero-Contamination Scout',
    description: 'Complete 25 WasteVision scans with high sorting accuracy.',
    progress: 25,
    target: 25,
    unlocked: true,
    iconName: 'scan',
  },
  {
    id: 'ach-2',
    title: 'Campus Watchdog',
    description: 'Submit 10 verified EcoReports across BSSRV zones.',
    progress: 12,
    target: 10,
    unlocked: true,
    iconName: 'shield',
  },
  {
    id: 'ach-3',
    title: '100 kg Diverted',
    description: 'Help divert an estimated 100 kg of waste from campus landfill.',
    progress: 100,
    target: 100,
    unlocked: true,
    iconName: 'leaf',
  },
  {
    id: 'ach-4',
    title: 'Campus Steward Tier',
    description: 'Reach 1,500 GreenScore points in the semester.',
    progress: 1420,
    target: 1500,
    unlocked: false,
    iconName: 'award',
  },
  {
    id: 'ach-5',
    title: 'Hydro Guardian',
    description: 'Report 3 water conservation or leak issues on campus.',
    progress: 2,
    target: 3,
    unlocked: false,
    iconName: 'droplet',
  },
  {
    id: 'ach-6',
    title: 'Grid Saver',
    description: 'Log 5 after-hours energy waste observations.',
    progress: 3,
    target: 5,
    unlocked: false,
    iconName: 'zap',
  },
];

export const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  {
    rank: 1,
    name: 'Applied Science — Physics Unit',
    hall: 'BSSRV Academic Wing',
    contributions: 64,
    score: 1890,
  },
  {
    rank: 2,
    name: 'Applied Science — Chemistry Unit',
    hall: 'BSSRV Lab Block',
    contributions: 57,
    score: 1715,
  },
  {
    rank: 3,
    name: 'Life Sciences Eco Cell',
    hall: 'BSSRV Courtyard Zone',
    contributions: 51,
    score: 1540,
  },
  {
    rank: 4,
    name: 'BSSRV Student (You)',
    hall: 'Applied Science Dept.',
    contributions: 48,
    score: 1420,
    isCurrentUser: true,
  },
  {
    rank: 5,
    name: 'Computing & IT Green Team',
    hall: 'Main Academic Building',
    contributions: 42,
    score: 1285,
  },
  {
    rank: 6,
    name: 'Humanities Sustainability Group',
    hall: 'Library & Reading Hall',
    contributions: 38,
    score: 1140,
  },
];

export const WEEKLY_TREND_DATA = [
  { week: 'W1', reports: 14, resolved: 11, diversion: 58 },
  { week: 'W2', reports: 19, resolved: 16, diversion: 60 },
  { week: 'W3', reports: 17, resolved: 15, diversion: 62 },
  { week: 'W4', reports: 24, resolved: 21, diversion: 63 },
  { week: 'W5', reports: 22, resolved: 20, diversion: 65 },
  { week: 'W6', reports: 28, resolved: 24, diversion: 66 },
  { week: 'W7', reports: 25, resolved: 23, diversion: 67 },
  { week: 'W8', reports: 31, resolved: 27, diversion: 69 },
];
