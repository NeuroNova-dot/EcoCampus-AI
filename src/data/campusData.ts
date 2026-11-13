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
  wasteRecyclables: '/src/assets/images/waste_sample_recyclables_1794556180539.jpg',
  wasteCompost: '/src/assets/images/waste_sample_compost_1794556181070.jpg',
  issueOverflowBin: '/src/assets/images/ecoreport_overflow_bin_1794556182341.jpg',
  studentAvatar: '/src/assets/images/avatar_student_maya_1794556182292.jpg',
};

export const CAMPUS_LOCATIONS = [
  'Main Library Walkway',
  'Student Union Atrium',
  'Science & Engineering Quad',
  'North Dining Commons',
  'Sustainability Research Hub',
  'North Quad Residence Hall',
  'Athletic & Recreation Center',
];

export const INITIAL_REPORTS: EcoReport[] = [
  {
    id: 'ECO-2048',
    title: 'Overflowing cardboard & PET bottles at Main Library triple-bin station',
    category: 'Overflowing Bin',
    location: 'Main Library Walkway',
    description:
      'Cardboard boxes and plastic beverage bottles have spilled onto the brick walkway beside the paper recycling compartment after afternoon move-in deliveries.',
    status: 'Pending',
    submittedBy: 'Liam Mercer',
    submittedAt: '24 mins ago',
    priority: 'High',
    photoUrl: CAMPUS_IMAGES.issueOverflowBin,
    assignedCrew: 'Unassigned',
  },
  {
    id: 'ECO-2047',
    title: 'Food waste contamination inside blue recycling bin',
    category: 'Contaminated Recycling',
    location: 'North Dining Commons',
    description:
      'Unrinsed takeout containers and half-full smoothies were placed in the dry paper & plastics bin near the west exit.',
    status: 'Under Review',
    submittedBy: 'Liam Mercer',
    submittedAt: '2 hours ago',
    priority: 'Medium',
    assignedCrew: 'Zero-Waste Crew B',
  },
  {
    id: 'ECO-2045',
    title: 'Continuous water drip from courtyard hydration refill station',
    category: 'Water Leak',
    location: 'Science & Engineering Quad',
    description:
      'Bottle filler valve is sticking open, wasting roughly 1–2 liters per minute into the storm drain.',
    status: 'Under Review',
    submittedBy: 'Priya Nair',
    submittedAt: '5 hours ago',
    priority: 'High',
    assignedCrew: 'Facilities Plumbing',
  },
  {
    id: 'ECO-2041',
    title: 'Lecture Hall 3B HVAC & projector running overnight',
    category: 'Energy Waste',
    location: 'Sustainability Research Hub',
    description:
      'Occupancy sensors failed to switch off overhead lighting and ventilation after the 9 PM seminar ended.',
    status: 'Resolved',
    submittedBy: 'Liam Mercer',
    submittedAt: 'Yesterday',
    priority: 'Medium',
    assignedCrew: 'Building Automation',
  },
  {
    id: 'ECO-2039',
    title: 'Damaged compost bin hinge blocking lid closure',
    category: 'Broken Station',
    location: 'Student Union Atrium',
    description:
      'Green organic bin lid cannot latch cleanly, causing odor and attracting pests near seating area.',
    status: 'Resolved',
    submittedBy: 'Elena Rostova',
    submittedAt: '2 days ago',
    priority: 'Low',
    assignedCrew: 'Campus Grounds',
  },
  {
    id: 'ECO-2036',
    title: 'Packaging foam & pallets left behind loading bay',
    category: 'Litter / Illegal Dumping',
    location: 'Athletic & Recreation Center',
    description:
      'Expanded polystyrene sheets stacked outdoors near storm culvert after equipment delivery.',
    status: 'Resolved',
    submittedBy: 'Marcus Vance',
    submittedAt: '3 days ago',
    priority: 'Medium',
    assignedCrew: 'Campus Grounds',
  },
  {
    id: 'ECO-2033',
    title: 'Empty battery e-waste drop tube jammed near bookstore',
    category: 'Broken Station',
    location: 'Student Union Atrium',
    description:
      'Intake flap on the lithium-ion cell collection kiosk is stuck shut.',
    status: 'Pending',
    submittedBy: 'Sora Takahashi',
    submittedAt: '4 days ago',
    priority: 'Low',
    assignedCrew: 'Unassigned',
  },
];

export const INITIAL_SCANS: WasteScanRecord[] = [
  {
    id: 'SCN-912',
    timestamp: 'Today, 11:18 AM',
    location: 'Student Union Atrium',
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
          instruction: 'Slide off the dry kraft sleeve for Blue Recycling; discard plastic lid and lined cup in Landfill unless certified BPI compostable.',
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
    title: 'Submitted overflowing bin report at Main Library Walkway',
    location: 'Main Library Walkway',
    timestamp: '24 mins ago',
    points: 30,
  },
  {
    id: 'CTR-400',
    type: 'WasteVision Scan',
    title: 'Sorted 4 cafeteria items (PET, aluminum, cup, napkin)',
    location: 'Student Union Atrium',
    timestamp: 'Today, 11:18 AM',
    points: 25,
  },
  {
    id: 'CTR-399',
    type: 'EcoReport Verified',
    title: 'Flagged contaminated recycling stream at Dining Commons',
    location: 'North Dining Commons',
    timestamp: 'Today, 9:05 AM',
    points: 25,
  },
  {
    id: 'CTR-398',
    type: 'Zero-Waste Challenge',
    title: 'Completed 5 consecutive reusable-mug check-ins',
    location: 'Campus Cafe',
    timestamp: 'Yesterday',
    points: 50,
  },
  {
    id: 'CTR-397',
    type: 'Energy Audit',
    title: 'Reported overnight Lecture Hall 3B lighting & HVAC waste',
    location: 'Sustainability Research Hub',
    timestamp: 'Yesterday',
    points: 40,
  },
  {
    id: 'CTR-396',
    type: 'WasteVision Scan',
    title: 'Verified compostable dining tray & wooden cutlery',
    location: 'North Dining Commons',
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
    description: 'Submit 10 verified EcoReports across campus zones.',
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
    description: 'Reach 1,500 GreenScore points in the Fall semester.',
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
  { rank: 1, name: 'Elena Rostova', hall: 'Sustainability Hub', contributions: 64, score: 1890 },
  { rank: 2, name: 'Priya Nair', hall: 'East Engineering', contributions: 57, score: 1715 },
  { rank: 3, name: 'Marcus Vance', hall: 'West Commons', contributions: 51, score: 1540 },
  {
    rank: 4,
    name: 'Liam Mercer',
    hall: 'North Quad Residence',
    contributions: 48,
    score: 1420,
    isCurrentUser: true,
  },
  { rank: 5, name: 'Sora Takahashi', hall: 'South Towers', contributions: 42, score: 1285 },
  { rank: 6, name: 'Amara Okafor', hall: 'Cedar Hall', contributions: 38, score: 1140 },
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
