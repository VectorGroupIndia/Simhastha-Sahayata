import { RegisteredItem, FamilyMember, LostFoundReport, UserRole, SosAlert, MapPointOfInterest, BroadcastMessage, AIInsight, AnalyticsData } from '../types';

export const MOCK_REGISTERED_ITEMS: RegisteredItem[] = [
  {
    id: 'item-1627364',
    name: 'Red American Tourister Backpack',
    category: 'Item',
    subCategory: 'Bags & Luggage',
    brand: 'American Tourister',
    color: 'Red',
    identifyingMarks: 'University logo sticker on the front pocket',
    images: ['https://i.imgur.com/example-backpack.png', 'https://i.imgur.com/example-backpack-2.png'],
    status: 'Safe',
  },
  {
    id: 'item-2736475',
    name: 'Samsung Galaxy S22',
    category: 'Item',
    subCategory: 'Electronics',
    brand: 'Samsung',
    color: 'Black',
    identifyingMarks: 'Small crack on the top-left corner of the screen',
    images: ['https://i.imgur.com/example-phone.png'],
    status: 'Lost',
  },
    {
    id: 'item-3847564',
    name: 'Gold Wedding Ring',
    category: 'Item',
    subCategory: 'Jewelry & Accessories',
    color: 'Gold',
    identifyingMarks: 'Engraved with "R&P 20.01.2018"',
    images: ['https://i.imgur.com/example-ring.png'],
    status: 'Safe',
  },
];


export const MOCK_FAMILY_MEMBERS: FamilyMember[] = [
  { id: 1, name: 'Grandma Sita', avatar: 'https://picsum.photos/seed/sita/100/100', location: { lat: 30, lng: 65 }, status: 'Safe' },
  { id: 2, name: 'Uncle Mohan', avatar: 'https://picsum.photos/seed/mohan/100/100', location: { lat: 80, lng: 60 }, status: 'Alert' },
  { id: 3, name: 'Little Anjali', avatar: 'https://picsum.photos/seed/anjali/100/100', location: { lat: 20, lng: 75 }, status: 'Lost' },
  { id: 4, name: 'Me (Ravi)', avatar: 'https://picsum.photos/seed/ravi/100/100', location: { lat: 85, lng: 50 }, status: 'Safe' },
];

export const MOCK_LOST_FOUND_REPORTS: LostFoundReport[] = [
    {
        id: 'RPT-1672837462',
        type: 'Lost',
        category: 'Person',
        personName: 'Ramesh Gupta',
        personAge: '72',
        personGender: 'Male',
        clothingAppearance: 'Wearing a white kurta and blue dhoti. Has a white beard.',
        description: 'My father, Ramesh, got separated from us near the main temple entrance. He is hard of hearing.',
        lastSeen: 'Near Mahakal Temple, Gate 3',
        locationCoords: { lat: 55, lng: 45 },
        reportedBy: 'Sunil Gupta',
        reportedById: 7,
        timestamp: '2024-07-29T10:00:00Z',
        status: 'Open',
        priority: 'Critical',
        assignedToId: 4,
        assignedToName: 'Officer Singh (Authority)'
    },
    {
        id: 'RPT-1672837198',
        type: 'Found',
        category: 'Item',
        subCategory: 'Bags & Luggage',
        itemName: 'Blue Backpack',
        itemBrand: 'Skybags',
        itemColor: 'Blue',
        identifyingMarks: 'Contains a water bottle and some books. No ID found.',
        description: 'Found a blue Skybags backpack left on a bench near the food court.',
        lastSeen: 'Sector 5 Food Court',
        locationCoords: { lat: 70, lng: 60 },
        imageUrl: 'https://i.imgur.com/found-backpack.png',
        reportedBy: 'Sunita Devi (Volunteer)',
        reportedById: 5,
        timestamp: '2024-07-29T09:30:00Z',
        status: 'In Progress',
        priority: 'Medium',
        assignedToId: 5,
        assignedToName: 'Sunita Devi (Volunteer)'
    },
    {
        id: 'RPT-2736475',
        type: 'Lost',
        category: 'Item',
        subCategory: 'Electronics',
        itemName: 'Samsung Galaxy S22',
        description: "My black Samsung phone. The lock screen is a picture of my family.",
        lastSeen: 'Near the shoe stand at Ram Ghat',
        locationCoords: { lat: 88, lng: 25 },
        imageUrl: MOCK_REGISTERED_ITEMS[1].images[0],
        reportedBy: 'Ravi Kumar (Pilgrim)',
        reportedById: 1,
        timestamp: '2024-07-28T18:00:00Z',
        status: 'Resolved',
        priority: 'Medium',
        originalItemId: 'item-2736475',
        assignedToId: 4,
        assignedToName: 'Officer Singh (Authority)'
    },
     {
        id: 'RPT-1672836598',
        type: 'Found',
        category: 'Person',
        personName: 'Unknown Child',
        personAge: '4-5',
        personGender: 'Female',
        clothingAppearance: 'Pink frock with cartoon characters, and a single anklet on her right foot.',
        description: 'Found a little girl crying alone near the river bank. She only says "Mama".',
        lastSeen: 'Datta Akhara Ghat',
        locationCoords: { lat: 22, lng: 78 },
        imageUrl: 'https://i.imgur.com/found-child.png',
        reportedBy: 'Priya Sharma (Pilgrim)',
        reportedById: 2,
        timestamp: '2024-07-29T08:45:00Z',
        status: 'Open',
        priority: 'Critical',
    },
    {
        id: 'RPT-3847564',
        type: 'Lost',
        category: 'Item',
        subCategory: 'Jewelry & Accessories',
        itemName: 'Gold Wedding Ring',
        description: "My gold wedding ring, engraved with 'R&P 20.01.2018'. Slipped off my finger during Snan.",
        lastSeen: 'Ram Ghat',
        locationCoords: { lat: 90, lng: 28 },
        reportedBy: 'Ravi Kumar (Pilgrim)',
        reportedById: 1,
        timestamp: '2024-07-29T06:00:00Z',
        status: 'Open',
        priority: 'High',
    },
    {
        id: 'RPT-4958673',
        type: 'Lost',
        category: 'Person',
        personName: 'Sita Devi',
        personAge: '68',
        personGender: 'Female',
        clothingAppearance: 'Yellow saree with a red border.',
        description: 'My grandmother went to get water and did not return. She walks with a limp.',
        lastSeen: 'Water station near Sector B',
        locationCoords: { lat: 25, lng: 40 },
        reportedBy: 'Vikram Patel (Pilgrim)',
        reportedById: 8,
        timestamp: '2024-07-29T11:00:00Z',
        status: 'In Progress',
        priority: 'Critical',
        assignedToId: 10,
        assignedToName: 'Inspector Verma (Authority)',
    },
    {
        id: 'RPT-5069784',
        type: 'Found',
        category: 'Item',
        subCategory: 'Documents & Cards',
        itemName: 'Aadhar Card',
        description: 'Found an Aadhar card on the ground. Name: Suresh Kumar.',
        lastSeen: 'Near Harsiddhi Temple',
        locationCoords: { lat: 50, lng: 55 },
        reportedBy: 'Meera Singh (Volunteer)',
        reportedById: 9,
        timestamp: '2024-07-29T10:15:00Z',
        status: 'Resolved',
        priority: 'Medium',
    },
    {
        id: 'RPT-6170895',
        type: 'Lost',
        category: 'Item',
        subCategory: 'Electronics',
        itemName: 'Apple iPhone 14',
        itemBrand: 'Apple',
        itemColor: 'Purple',
        description: 'Lost my purple iPhone 14. Has a picture of a dog as the wallpaper.',
        lastSeen: 'Market area',
        locationCoords: { lat: 80, lng: 60 },
        reportedBy: 'Anjali Desai (Pilgrim)',
        reportedById: 7,
        timestamp: '2024-07-28T14:00:00Z',
        status: 'Open',
        priority: 'High',
    },
    {
        id: 'RPT-7281906',
        type: 'Found',
        category: 'Person',
        personName: 'Unknown Man',
        personAge: 'approx. 60',
        personGender: 'Male',
        clothingAppearance: 'Blue shirt, grey trousers. Appears confused.',
        description: 'Found a man who seems disoriented and cannot remember his name or where he is from. He is safe with me at the help center.',
        lastSeen: 'Help Center - Sector A',
        locationCoords: { lat: 10, lng: 15 },
        reportedBy: 'Deepak Chopra (Volunteer)',
        reportedById: 12,
        timestamp: '2024-07-29T11:30:00Z',
        status: 'In Progress',
        priority: 'High',
        assignedToId: 12,
        assignedToName: 'Deepak Chopra (Volunteer)',
    },
    {
        id: 'RPT-8392017',
        type: 'Lost',
        category: 'Item',
        subCategory: 'Bags & Luggage',
        itemName: 'Black purse',
        description: 'A small black leather purse containing cash and ID.',
        lastSeen: 'Trilok Hotel',
        reportedBy: 'Kavita Joshi (Pilgrim)',
        reportedById: 13,
        timestamp: '2024-07-27T20:00:00Z',
        status: 'Resolved',
        priority: 'Medium',
    },
    {
        id: 'RPT-9403128',
        type: 'Found',
        category: 'Item',
        subCategory: 'Other',
        itemName: 'Single shoe',
        description: 'Found a single child\'s shoe, blue color with a superhero sticker.',
        lastSeen: 'Play area near food court',
        locationCoords: { lat: 72, lng: 63 },
        reportedBy: 'Geeta Devi (Pilgrim)',
        reportedById: 15,
        timestamp: '2024-07-29T09:00:00Z',
        status: 'Open',
        priority: 'Low',
    },
    {
        id: 'RPT-10514239',
        type: 'Lost',
        category: 'Person',
        personName: 'Arun',
        personAge: '8',
        personGender: 'Male',
        clothingAppearance: 'Red t-shirt and blue shorts.',
        description: 'My son Arun was with me, and I lost him in the crowd.',
        lastSeen: 'Bridge near Ram Ghat',
        locationCoords: { lat: 85, lng: 35 },
        reportedBy: 'Rajesh Singh (Pilgrim)',
        reportedById: 18,
        timestamp: '2024-07-29T11:45:00Z',
        status: 'Open',
        priority: 'Critical',
    }
];

export const MOCK_SOS_ALERTS: SosAlert[] = [
    {
        id: 1,
        userId: 2,
        userName: 'Priya Sharma (Pilgrim)',
        userRole: UserRole.PILGRIM,
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(), // 5 mins ago
        status: 'Broadcasted',
        locationCoords: { lat: 45, lng: 55 }
    },
    {
        id: 2,
        userId: 6,
        userName: 'Rohan Mehra (Pilgrim)',
        userRole: UserRole.PILGRIM,
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 mins ago
        status: 'Accepted',
        locationCoords: { lat: 80, lng: 70 },
        assignedToId: 5,
        assignedToName: 'Sunita Devi (Volunteer)',
    },
    {
        id: 3,
        userId: 1,
        userName: 'Ravi Kumar (Pilgrim)',
        userRole: UserRole.PILGRIM,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        status: 'Resolved',
        locationCoords: { lat: 15, lng: 25 }
    },
    {
        id: 4,
        userId: 5,
        userName: 'Sunita Devi (Volunteer)',
        userRole: UserRole.VOLUNTEER,
        timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(), // 10 mins ago
        status: 'Broadcasted',
        locationCoords: { lat: 35, lng: 40 },
        message: 'Unattended bag found near Sector C entrance. Requires immediate attention.'
    },
    {
        id: 5,
        userId: 16,
        userName: 'Harishankar Pandey (Pilgrim)',
        userRole: UserRole.PILGRIM,
        timestamp: new Date(Date.now() - 1 * 60 * 1000).toISOString(), // 1 min ago
        status: 'Broadcasted',
        locationCoords: { lat: 50, lng: 50 },
        message: 'Feeling chest pain. Need medical help urgently.'
    },
    {
        id: 6,
        userId: 8,
        userName: 'Vikram Patel (Pilgrim)',
        userRole: UserRole.PILGRIM,
        timestamp: '2024-07-28T22:00:00Z',
        status: 'Resolved',
        locationCoords: { lat: 65, lng: 15 }
    },
    {
        id: 7,
        userId: 11,
        userName: 'Suresh Gupta (Pilgrim)',
        userRole: UserRole.PILGRIM,
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        status: 'Responded',
        locationCoords: { lat: 90, lng: 90 },
        assignedToId: 5,
        assignedToName: 'Sunita Devi (Volunteer)',
    },
    {
        id: 8,
        userId: 9,
        userName: 'Meera Singh (Volunteer)',
        userRole: UserRole.VOLUNTEER,
        timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
        status: 'Accepted',
        locationCoords: { lat: 25, lng: 75 },
        message: 'Large crowd surge near Datta Akhara Ghat. Requesting backup.',
        assignedToId: 4,
        assignedToName: 'Officer Singh (Authority)',
    },
    {
        id: 9,
        userId: 15,
        userName: 'Geeta Devi (Pilgrim)',
        userRole: UserRole.PILGRIM,
        timestamp: '2024-07-27T10:00:00Z',
        status: 'Resolved',
        locationCoords: { lat: 10, lng: 80 }
    }
];

export const MOCK_BROADCASTS: BroadcastMessage[] = [
    {
        id: 'BC-1',
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        message: 'Weather update: Light rain expected in the next hour. Please advise pilgrims near open ghats to seek shelter.',
        sentBy: 'Admin User',
        recipients: [UserRole.VOLUNTEER, UserRole.AUTHORITY]
    },
    {
        id: 'BC-2',
        timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        message: 'Reminder: The evening Aarti will begin at 7:00 PM at Ram Ghat. Expect heavy footfall in Zone A.',
        sentBy: 'Admin User',
        recipients: ['All']
    },
    {
        id: 'BC-3',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        message: 'All medical staff, please be advised that a central medical supply restock is available at the Sector C main camp.',
        sentBy: 'Inspector Verma (Authority)',
        recipients: [UserRole.AUTHORITY]
    }
];

export const MOCK_POINTS_OF_INTEREST: MapPointOfInterest[] = [
    // Help Centers
    { id: 'hc1', name: 'Help Center - Sector A', type: 'Help Center', locationCoords: { lat: 10, lng: 15 } },
    { id: 'hc2', name: 'Help Center - Ram Ghat', type: 'Help Center', locationCoords: { lat: 90, lng: 30 } },
    { id: 'hc3', name: 'Help Center - Harsiddhi', type: 'Help Center', locationCoords: { lat: 50, lng: 55 } },
    
    // Medical
    { id: 'med1', name: 'First Aid - Sector C', type: 'Medical', locationCoords: { lat: 50, lng: 80 } },
    { id: 'med2', name: 'Ambulance Point', type: 'Medical', locationCoords: { lat: 15, lng: 90 } },
    { id: 'med3', name: 'Emergency Medical - Gate 4', type: 'Medical', locationCoords: { lat: 75, lng: 20 } },

    // Lost/Found
    { id: 'lf1', name: 'Lost & Found - Main Gate', type: 'Lost/Found Center', locationCoords: { lat: 48, lng: 18 } },
    { id: 'lf2', name: 'Lost & Found - Near Bridge', type: 'Lost/Found Center', locationCoords: { lat: 65, lng: 70 } },
    
    // Police Stations
    { id: 'ps1', name: 'Police Chowki - Sector B', type: 'Police Station', locationCoords: { lat: 25, lng: 40 } },
    { id: 'ps2', name: 'Police Station - Mahakal', type: 'Police Station', locationCoords: { lat: 55, lng: 40 } },
    { id: 'ps3', name: 'Women\'s Help Desk & Police', type: 'Police Station', locationCoords: { lat: 80, lng: 85 } },
];

export const MOCK_OPERATIONAL_ZONES = [
  { id: 'zone_a', name: 'Zone A (Ram Ghat)', path: 'M 70 0 H 100 V 50 H 70 Z', color: '#3b82f6' }, 
  { id: 'zone_b', name: 'Zone B (Mahakal)', path: 'M 30 30 H 70 V 70 H 30 Z', color: '#22c55e' },
  { id: 'zone_c', name: 'Zone C (Harsiddhi)', path: 'M 0 50 H 30 V 100 H 0 Z', color: '#f97316' },
  { id: 'zone_d', name: 'Zone D (Datta Akhara)', path: 'M 30 70 H 70 V 100 H 30 Z', color: '#a855f7' },
];

export const MOCK_PREDICTIVE_HOTSPOTS = [
  { id: 'ph1', name: 'Ram Ghat Approach', locationCoords: { lat: 80, lng: 30 }, risk: 0.9 }, // High risk
  { id: 'ph2', name: 'Mahakal Temple Exit', locationCoords: { lat: 58, lng: 48 }, risk: 0.7 }, // Medium risk
  { id: 'ph3', name: 'Market Intersection', locationCoords: { lat: 75, lng: 65 }, risk: 0.8 }, // High risk
  { id: 'ph4', name: 'Bridge Crossing', locationCoords: { lat: 68, lng: 40 }, risk: 0.6 }, // Medium risk
];

export const MOCK_AI_INSIGHTS: AIInsight[] = [
    {
        id: 'ai-1',
        timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
        type: 'Crowd',
        severity: 'Critical',
        message: "Anomaly Detected: Crowd density in Zone A (Ram Ghat) is increasing 30% faster than predicted. High risk of congestion in the next 15 minutes.",
        zone: 'Zone A (Ram Ghat)'
    },
    {
        id: 'ai-2',
        timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        type: 'Reports',
        severity: 'Warning',
        message: "Spike in 'Lost Item' reports (Electronics) near Mahakal Temple. Possible theft activity.",
        zone: 'Zone B (Mahakal)'
    },
    {
        id: 'ai-3',
        timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
        type: 'SOS',
        severity: 'Warning',
        message: "Pattern Detected: Multiple SOS alerts triggered from the same 50m radius near Datta Akhara Ghat. Investigate potential issue.",
        zone: 'Zone D (Datta Akhara)'
    },
    {
        id: 'ai-4',
        timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        type: 'Logistics',
        severity: 'Info',
        message: "Predictive analysis suggests Help Center in Zone C (Harsiddhi) will be over capacity in 1 hour. Recommend dispatching 2 additional volunteers.",
        zone: 'Zone C (Harsiddhi)'
    }
];

export const MOCK_ANALYTICS_DATA: AnalyticsData = {
    reportsOverTime: [
        { hour: '06:00', count: 5 }, { hour: '07:00', count: 12 }, { hour: '08:00', count: 18 },
        { hour: '09:00', count: 25 }, { hour: '10:00', count: 32 }, { hour: '11:00', count: 28 },
        { hour: '12:00', count: 22 },
    ],
    reportsByCategory: [
        { category: 'Person', count: 42 },
        { category: 'Item', count: 100 }
    ],
    reportsByZone: [
        { zone: 'Zone A', count: 68 },
        { zone: 'Zone B', count: 45 },
        { zone: 'Zone C', count: 18 },
        { zone: 'Zone D', count: 11 },
    ]
};


export const translations: { [key: string]: any } = {
  en: {
    home: {
      welcome: 'Simhastha Sahayata',
      tagline: 'Your AI-powered companion for a safe and seamless pilgrimage.',
      reportButton: 'Report Lost or Found',
      otherWays: 'Other Ways to Connect',
    },
    auth: {
      loginTitle: 'Welcome Back',
      loginSubtitle: 'For this demo, please select a user profile below to log in.',
      loginRegister: 'Login / Register',
      loginTab: 'Login',
      registerTab: 'Register',
      emailLabel: 'Email Address',
      passwordLabel: 'Password',
      nameLabel: 'Full Name',
      loginButton: 'Login',
      registerButton: 'Register',
      logout: 'Logout',
      demoLoginSeparator: 'OR CONTINUE WITH DEMO',
      loginAs: 'Login as',
    },
    header: {
        sosButton: 'SOS',
        settings: 'Settings',
        sosConfirmTitle: 'Confirm SOS Alert',
        sosConfirmText: 'This will immediately alert your family, nearby volunteers, and authorities. Are you sure you are in an emergency?',
    },
    dashboard: {
      title: 'Dashboard',
      greeting: 'Hello',
      broadcastModal: {
          title: 'Broadcast Alert',
          description: 'This sends an alert with your location to authorities. An optional message helps them understand the situation better, but you can send an alert without one in an emergency.',
          placeholder: 'Optional: e.g., "Large unattended bag near Gate 4."',
          cancel: 'Cancel',
          confirm: 'Send Alert',
          success: 'Alert broadcasted successfully to authorities!',
      },
      crowdDensity: {
          title: 'Current Crowd Density',
          low: 'Low',
          moderate: 'Moderate',
          high: 'High',
          extreme: 'Extreme',
      },
      aiAlerts: {
          title: 'AI Live Alerts',
          alerts: {
              crowd: 'Unusual crowd forming near Sector B. Potential congestion risk.',
              item: 'Multiple reports of lost wallets logged in the last 15 minutes around Mahakal Temple.',
              child: 'A child matching a missing person report was potentially sighted on Camera 4 near the food court.',
              weather: 'Light showers expected in the next hour. Advise pilgrims to seek shelter.',
          }
      },
      pilgrim: {
          welcome: 'Here is your central hub for a safe pilgrimage.',
          familyHub: 'Family Hub',
          liveMap: 'Live Map',
          guide: 'AI Guide',
          myItems: 'My Items',
          myReports: 'My Reports',
      },
      admin: {
          title: 'Admin Command Center',
          kpis: {
            highPriority: 'High-Priority Alerts',
            unassigned: 'Unassigned Cases',
            activePersonnel: 'Active Personnel',
            resolvedToday: 'Resolved Today',
          },
          highPriorityAlerts: 'High Priority Alerts',
          noHighPriority: 'No high-priority alerts at this time.',
          liveOpsMap: 'Live Operations Map',
          teamStatus: 'Team Status',
          available: 'Available',
          onTask: 'On Task',
          onBreak: 'On Break',
          viewAll: 'View All',
          allReports: 'All Lost & Found Reports',
          searchPlaceholder: 'Search reports by ID, name, description...',
          aiSearchTooltip: 'Use AI Semantic Search',
          aiSearchResults: 'Showing AI-powered search results for',
          clearAiSearch: 'Clear AI Search',
          activityLogTitle: 'My Recent Activity',
          userManagement: {
              title: 'User Management',
              role: 'Role',
              status: 'Status',
              actions: 'Actions',
              userUpdated: 'User updated successfully',
              statusFilterAll: 'All Statuses',
              statusFilterActive: 'Active',
              statusFilterSuspended: 'Suspended',
              lastLogin: 'Last Login',
          },
          aiDashboard: {
            title: "AI Implementation & Monitoring",
            controlsTitle: "AI Feature Controls",
            semanticSearch: "Enable AI Semantic Search",
            semanticSearchDesc: "Allow admins to use natural language for complex report searches.",
            statusTitle: "AI Model Status",
            geminiFlash: "gemini-2.5-flash (Core)",
            geminiVision: "gemini-2.5-flash-image-preview (Vision)",
            operational: "Operational",
            metricsTitle: "Performance Metrics (Last 24h)",
            autofills: "Reports Autofilled",
            analyses: "Images Analyzed",
            searches: "Semantic Searches",
            logTitle: "Live AI Activity Log",
            log: {
                autofill: "AI autofilled report based on user prompt.",
                analysis: "AI analyzed image for report {id}.",
                search: "AI search performed for query: \"{query}\".",
                summary: "AI summary generated for report {id}."
            },
            aiControlCenter: {
                title: "AI Control Center",
                description: "Monitor performance, manage AI features, and view live activity logs.",
                button: "Go to AI Dashboard"
            }
          }
      },
      authorities: {
          title: 'Authorities Command Center',
          analyticsButton: 'Analytics Dashboard',
          kpis: {
              activeReports: 'Active Reports',
              missingPersons: 'Missing Persons',
              sosAlerts: 'Active SOS Alerts',
              personnel: 'Active Personnel',
          },
          map: {
              title: 'Live Operations Map',
              operationalZones: 'Operational Zones',
              personnel: 'Personnel',
              report: 'Report',
              sos: 'SOS',
              crowdDensity: 'Crowd Density',
              densityLevels: {
                low: 'Low',
                moderate: 'Moderate',
                high: 'High',
                extreme: 'Extreme'
              },
              heatmapToggle: 'Predictive Heatmap'
          },
          panel: {
              tasks: 'Tasks Feed',
              aiInsights: 'AI Insights',
              personnel: 'Personnel Roster',
              broadcasts: 'Broadcast Log',
              broadcastMessage: 'Broadcast Message',
              filterBy: 'Filter by',
              sortBy: 'Sort by',
              priority: 'Priority',
              date: 'Date',
              status: 'Status',
              zone: 'Zone',
              noTasks: 'No active tasks match the current filters.',
              acknowledge: 'Acknowledge',
              viewDetails: 'View Details',
              assign: 'Assign',
              statusLabels: {
                  available: 'Available',
                  onTask: 'On Task',
                  onBreak: 'On Break'
              },
              noPersonnel: 'No active personnel found.',
              noBroadcasts: 'No recent broadcasts.',
              report: 'REPORT',
              missingPerson: 'MISSING PERSON',
              sos: 'SOS',
              broadcastFrom: 'Broadcast from',
              to: 'To',
          },
          advancedBroadcast: {
              title: 'Send Broadcast Message',
              recipients: 'Recipients',
              message: 'Message',
              send: 'Send Broadcast',
              success: 'Broadcast sent successfully!',
              groups: {
                  all: 'All Users',
                  pilgrims: 'All Pilgrims',
                  staff: 'All Staff & Volunteers',
              }
          },
          analyticsModal: {
            title: 'Operations Analytics Dashboard',
            reportsOverTime: 'Report Volume (Last 6 Hours)',
            reportsByCategory: 'Incident Breakdown',
            reportsByZone: 'Report Hotspot Zones',
            close: 'Close'
          },
          aiResourceSuggestion: {
              getSuggestion: 'Get AI Resource Suggestion',
              suggestion: 'AI Suggestion',
              suggesting: 'Generating suggestion...',
          }
      },
      volunteer: {
          title: 'Volunteer Action Board',
          broadcastAlert: 'Broadcast Alert',
          availabilityLabel: "My Status:",
          onBreakTitle: "You are currently on break.",
          onBreakText: "Set your status to 'Active' to see new nearby alerts.",
          kpis: {
              myAssignments: 'My Active Assignments',
              nearbyAlerts: 'Nearby Alerts',
              resolvedToday: 'Resolved Today',
              active: "Active",
              onBreak: "On Break"
          },
          tabs: {
              assignments: 'My Assignments',
              liveAlerts: 'Live Alerts',
          },
          alertTypes: {
              nearby: 'Nearby Alert',
              broadcast: 'Broadcast'
          },
          mapView: 'Map View',
          listView: 'List View',
          yourLocation: 'Your Location',
          workingRadius: 'Working Radius',
          noAssignments: 'You have no active assignments. Check the "Live Alerts" tab to find cases to help with.',
          noNearby: 'No unassigned high-priority alerts nearby. Thank you for your service!',
          acceptTask: 'Accept Task',
          taskAccepted: 'Task accepted and added to your assignments!',
          statusUpdated: 'Report status updated.',
          viewDetails: 'View Details',
          updateStatus: 'Update Status',
          broadcastModal: {
            success: "Alert broadcasted to authorities.",
          }
      },
    },
    familyHub: {
        title: 'Family Hub',
        members: 'Family Members',
        addGroup: 'Invite Member',
        liveLocation: 'Live Location',
        sosButton: 'TRIGGER SOS',
        sosActive: 'SOS ACTIVE',
        sosActiveText: 'Your location has been shared with family, volunteers, and authorities.',
        sosConfirmTitle: 'Confirm SOS?',
        sosConfirmText: 'Are you sure you want to send an emergency alert? This action cannot be undone.',
        sosConfirmButton: 'Yes, I Need Help',
        sosCancelButton: 'Cancel',
        getDirections: 'Get Directions',
        status: {
            safe: 'Safe',
            alert: 'Alert',
            lost: 'Lost'
        },
        inviteModal: {
            title: 'Invite Family Member',
            description: 'Share this link with your family members to add them to your group.',
            copyLink: 'Copy',
            linkCopied: 'Invitation link copied!'
        }
    },
    liveMap: {
        title: 'Live Event Map',
        layers: 'Map Layers',
        layerFamily: 'Family',
        layerSos: 'Family SOS',
        layerHelp: 'Help Centers',
        layerMedical: 'Medical Aid',
        layerReports: 'My Reports',
        navigationModalTitle: 'Route to {name}',
        filterStatus: 'Filter Status',
        allStatuses: 'All Statuses',
        statuses: {
            safe: 'Safe',
            alert: 'Alert',
            lost: 'Lost',
            broadcasted: 'Broadcasted',
            responded: 'Responded',
            open: 'Open',
            inProgress: 'In Progress',
            resolved: 'Resolved'
        }
    },
    navigation: {
        title: 'Intelligent Navigation',
        placeholder: 'Where to? e.g., "nearest water station"',
        search: 'Find Route',
        routeFound: 'Route Found!',
        error: 'Sorry, I could not find a route. Please try a different query.',
        routeTo: 'Route to {name}'
    },
    guide: {
        title: 'AI Pilgrim Guide',
        welcomeMessage: 'Hello! I am your AI guide for the Simhastha Kumbh. How can I assist you today?',
        placeholder: 'Ask me anything about Kumbh...',
        error: 'I am sorry, I am having trouble connecting right now. Please try again later.'
    },
    myReports: {
        title: 'My Reported Cases',
        reportedOn: 'Reported On',
        viewDetails: 'View Details',
        noReports: "You haven't filed any reports yet.",
        noFilteredReports: "No reports match your current filters.",
        id: 'Report ID',
    },
    myItems: {
        title: 'My Registered Items',
        addItem: 'Add New Item',
        viewDetails: 'Edit Details',
        markAsLost: 'Mark as Lost',
        itemLost: 'Reported Lost',
        noItems: 'Register your valuables to easily report them if lost.',
        safe: 'Safe',
        lost: 'Lost',
        addModal: {
            title: 'Register a New Item',
            editTitle: 'Edit Item Details',
            uploadMultiple: 'Upload Images (optional)',
            save: 'Save Item',
            success: 'Item registered successfully!',
            updateSuccess: 'Item updated successfully!'
        },
        markAsLostModal: {
            title: 'Report Item as Lost',
            description: 'This will create a "Lost Item" report using the details of this item. Please provide the location where it was last seen.',
            confirmButton: 'Confirm & Report Lost',
            success: 'Item successfully reported as lost.'
        }
    },
    report: {
        title: 'File a New Report',
        instructions: 'Please read before proceeding:',
        accept: 'I understand and agree to provide accurate information.',
        next: 'Start Report',
        aiPromptLabel: 'Describe what happened in your own words (optional)',
        aiPromptPlaceholder: 'e.g., "I lost my red backpack near the main temple around 2 PM. It has a laptop inside." and let our AI fill the form for you!',
        aiFillButton: 'Autofill',
        type: 'Report Type',
        lost: 'I Lost Something',
        found: 'I Found Something',
        category: 'Category',
        person: 'Person',
        item: 'Item',
        subCategory: 'Item Category',
        selectSubCategory: 'Select a category...',
        subCategories: {
            bags: 'Bags & Luggage',
            electronics: 'Electronics',
            documents: 'Documents & Cards',
            jewelry: 'Jewelry & Accessories',
            other: 'Other'
        },
        upload: 'Upload a Photo to Begin',
        uploadPrompt: 'Upload a file',
        takePhoto: 'Take Photo',
        uploadOrDrag: 'or drag and drop',
        uploadHint: 'PNG, JPG, GIF up to 10MB',
        removeImage: 'Remove',
        aiAnalyzeButton: 'Analyze Photo & Continue',
        aiAnalyzing: 'Analyzing...',
        personName: "Person's Name",
        personNamePlaceholder: "e.g., Suresh Kumar",
        personAge: "Approximate Age",
        personAgePlaceholder: "e.g., 65",
        personGender: "Gender",
        selectGender: "Select gender...",
        male: "Male",
        female: "Female",
        other: "Other",
        clothingAppearance: "Clothing & Appearance",
        clothingAppearancePlaceholder: "e.g., Blue saree, red shawl, has a mole on the left cheek",
        itemName: "Item Name",
        itemNamePlaceholder: "e.g., Red Backpack",
        itemBrand: "Brand (optional)",
        itemBrandPlaceholder: "e.g., American Tourister",
        itemColor: "Color (optional)",
        itemColorPlaceholder: "e.g., Red",
        itemMaterial: "Material (optional)",
        itemMaterialPlaceholder: "e.g., Leather, Plastic, Cotton",
        itemSize: "Size (optional)",
        itemSizePlaceholder: "e.g., Small, Medium, 24 inches",
        identifyingMarks: "Identifying Marks (optional)",
        identifyingMarksPlaceholder: "e.g., University sticker on front pocket",
        description: "Detailed Description",
        descriptionPlaceholder: "Provide as much detail as possible...",
        lastSeen: "Last Seen Location",
        lastSeenPlaceholder: "e.g., Near Mahakal Temple, Gate 3",
        reviewButton: "Review & Submit",
        reviewTitle: "Review Your Report",
        reviewSubtitle: "Please confirm the details below are correct before submitting.",
        reportSummary: "Report Summary",
        editButton: "Edit",
        confirmSubmitButton: "Confirm & Submit",
        confirmationSuccessTitle: "Report Submitted Successfully!",
        confirmationSuccessText: "Your report has been received. You can track its status in your dashboard.",
        whatHappensNext: {
            title: "What Happens Next?",
            step1: "Your report is instantly shared with our on-ground team of volunteers and authorities.",
            step2: "Our AI system will search for potential matches with other reports in real-time.",
            step3: "You will receive a notification as soon as there is an update on your case."
        },
        viewOnMapButton: "View Report on Dashboard",
        downloadButton: "Download PDF Copy",
        newReport: "File Another Report",
        analyze: "Analyze Photo with AI"
    },
    reportDetails: {
        title: "Report Details",
        reportedBy: "Reported By",
        assignTo: "Assigned To",
        updateStatus: "Update Case",
        saveStatus: "Save Changes",
        statusUpdated: "Report updated successfully!",
        viewOnMap: "View on Map",
        viewImage: "View Full Image",
        downloadPdf: "Download PDF",
        unassigned: "Unassigned",
        close: "Close",
        aiSummaryTitle: "AI Generated Summary",
        generateSummary: "Generate AI Summary",
        summarizing: "Summarizing..."
    },
    filterBar: {
        statusLabel: "Status",
        categoryLabel: "Category",
        typeLabel: "Type",
        assignmentLabel: "Assigned To",
        sortLabel: "Sort by",
        all: "All",
        open: "Open",
        inProgress: "In Progress",
        resolved: "Resolved",
        person: "Person",
        item: "Item",
        lost: "Lost",
        found: "Found",
        unassigned: "Unassigned",
        dateNewest: "Date (Newest)",
        dateOldest: "Date (Oldest)",
        statusSort: "Status",
        categorySort: "Category",
        typeSort: "Type",
        assignmentSort: "Assignment"
    },
    cookieBanner: {
        message: "We use cookies to enhance your experience, analyze site traffic, and personalize content. By clicking 'Accept', you consent to our use of cookies.",
        accept: "Accept",
        reject: "Reject",
        modify: "Modify"
    },
    cookieModal: {
        title: "Cookie Preferences",
        save: "Save Preferences",
        necessary: {
            title: "Strictly Necessary Cookies",
            description: "These cookies are essential for the application to function and cannot be switched off. They are usually set in response to actions made by you, such as logging in or filling in forms."
        },
        performance: {
            title: "Performance Cookies",
            description: "These cookies allow us to count visits and traffic sources so we can measure and improve the performance of our site. They help us to know which pages are the most and least popular."
        },
        targeting: {
            title: "Targeting Cookies",
            description: "These cookies may be set through our site by our advertising partners. They may be used by those companies to build a profile of your interests and show you relevant adverts on other sites."
        }
    },
    userGuide: {
        title: "Welcome to Simhastha Sahayata!",
        intro: "Here are some key features to help you get started:",
        button: "User Guide",
        close: "Got it!",
        familyHub: {
            title: "Family Hub",
            description: "Keep your loved ones close. Invite family members to a private group to see their live location on the map and receive SOS alerts."
        },
        navigation: {
            title: "Intelligent Navigation",
            description: "Ask for directions in your language, like 'find the nearest water station', and get the safest, least crowded route on a custom event map."
        },
        reporting: {
            title: "Effortless Reporting",
            description: "Report lost items or people in seconds using your voice, text, or by simply uploading a photo and letting our AI handle the details."
        },
        guide: {
            title: "AI Pilgrim Guide",
            description: "Have a question about the Kumbh? Ask our AI assistant anything, from event schedules to the spiritual significance of rituals."
        }
    },
    sosCallModal: {
        title: "SOS Alert Confirmed",
        description: "Help is on the way. Your location has been broadcasted to the nearest authorities and your emergency contacts have been notified.",
        notifiedContacts: "While you wait, you can directly call emergency services or your contacts below.",
        callPolice: "Call Police (100)",
        callAmbulance: "Call Ambulance (108)",
        callContactLabel: "Or call a personal contact:",
        call: "Call",
        close: "Close"
    },
    sosDetailsModal: {
        title: "SOS Alert Details",
        alertId: "Alert ID",
        triggeredBy: "Triggered By",
        timestamp: "Timestamp",
        message: "User Message",
        location: "Last Known Location",
        updateAlert: "Update Alert",
        assignTo: "Assign to Volunteer",
        unassigned: "Unassigned",
        saveChanges: "Save Changes",
    },
    profile: {
        changeAvatar: 'Change Avatar',
        dashboardSettings: 'Dashboard Settings',
        theme: 'Appearance',
        themeDesc: 'Choose your preferred interface theme.',
        light: 'Light',
        dark: 'Dark',
        maintenanceModeBanner: 'The app is currently in maintenance mode. Some features may be unavailable.',
        myAssignments: 'My Assignments',
        viewReport: 'View Report',
        noAssignments: 'You have no open assignments.',
        settings: 'General Settings',
        permissions: 'App Permissions',
        permissionsDesc: 'Manage access for key app features to protect your privacy.',
        location: 'Location Access',
        locationDesc: 'Required for Family Hub, SOS, and navigation features.',
        camera: 'Camera Access',
        cameraDesc: 'Required for photo uploads in reports and updating your avatar.',
        microphone: 'Microphone Access',
        microphoneDesc: 'Required for voice commands in navigation and AI guide.',
        powerButtonSos: 'Power Button SOS',
        powerButtonSosDesc: 'Press the power button 3 times quickly to trigger an SOS alert.',
        voiceNav: 'Voice Navigation',
        voiceNavDesc: 'Enable turn-by-turn voice instructions during navigation.',
        pushNotifications: 'Push Notifications',
        pushNotificationsDesc: 'Receive alerts for SOS, report updates, and system messages.',
        adminSettings: {
            title: 'Administrator Settings',
            notificationSettingsAdmin: 'Notification Settings',
            notificationSettingsAdminDesc: 'Control which system-wide alerts you receive.',
            highPriority: 'High-Priority Case Alerts',
            highPriorityDesc: 'Get notified for new critical reports (e.g., missing child).',
            sosAlerts: 'All SOS Alerts',
            sosAlertsDesc: 'Receive notifications for every SOS triggered across the event.',
            systemHealth: 'System Health Alerts',
            systemHealthDesc: 'Get notified about system performance issues or high server load.',
            systemConfig: 'System Configuration',
            systemConfigDesc: 'Manage global AI features and system status.',
            aiAutofill: 'AI Report Autofill',
            aiAutofillDesc: 'Allow users to generate reports from natural language text prompts.',
            aiImageAnalysis: 'AI Image Analysis',
            aiImageAnalysisDesc: 'Enable AI to analyze user-uploaded images to pre-fill report details.',
            maintenanceMode: 'Maintenance Mode',
            maintenanceModeDesc: 'Temporarily restrict app access for non-admin users for system updates.'
        },
        authority: {
            settingsTitle: 'Operational Settings',
            openCases: 'My Open Cases',
            resolvedCases: 'My Resolved Cases',
            operationalZone: 'My Operational Zone',
            operationalZoneDesc: 'Set your primary patrol and alert zone.',
            alertThreshold: 'Alert Priority Threshold',
            alertThresholdDesc: 'Filter the alerts you receive based on priority level.',
            sosZoneAlerts: 'Zonal SOS Alerts Only',
            sosZoneAlertsDesc: 'Only receive SOS alerts originating from within your assigned zone.',
            patrolMode: 'Patrol Mode',
            patrolModeDesc: 'Optimizes the app for low-light conditions and reduced battery usage.'
        },
        volunteer: {
            statsTitle: 'My Performance',
            totalAssigned: 'Total Cases',
            openCases: 'Open Cases',
            resolvedThisWeek: 'Resolved This Week',
            settingsTitle: 'My Volunteer Settings',
            availability: 'My Availability',
            availabilityDesc: 'Set your status to receive new nearby alerts.',
            active: 'Active',
            onBreak: 'On Break',
            workingRadius: 'Working Radius',
            workingRadiusDesc: 'Set the distance for receiving nearby alerts.',
            km: 'km',
            assignmentNotifications: 'Assignment Notifications',
            assignmentNotificationsDesc: 'Get notified when a new case is assigned to you directly.',
            nearbyAlerts: 'Nearby Alerts Notifications',
            nearbyAlertsDesc: 'Get notified about new, unassigned high-priority cases within your radius.'
        },
        emergencyContacts: {
            title: "Emergency Contacts",
            description: "These contacts will be notified when you trigger an SOS alert.",
            addContact: "Add New Contact",
            remove: "Remove",
            noContacts: "No emergency contacts added yet.",
            addModalTitle: "Add Emergency Contact",
            nameLabel: "Name",
            phoneLabel: "Phone Number",
            cancel: "Cancel",
            save: "Save Contact"
        },
        sosHistory: {
            title: "My SOS History",
            description: "A log of your past SOS alerts.",
            triggeredOn: "Triggered on",
            filterByStatus: "Filter by Status:",
            allStatuses: "All Statuses",
            sortBy: "Sort by:",
            sortNewest: "Newest First",
            sortOldest: "Oldest First",
            noHistory: "You have no history of SOS alerts.",
            statuses: {
                broadcasted: "Broadcasted",
                accepted: "Accepted",
                responded: "Responded",
                resolved: "Resolved"
            }
        }
    },
    contact: {
        title: 'Contact Us & Help Centers',
        description: 'We\'re here to help. Whether you have a question, need support, or want to locate a help center, find the resources you need below.',
        getInTouch: 'Get in Touch',
        email: 'Email',
        helpline: '24/7 Helpline',
        address: 'Main Office Address',
        sendMessage: 'Send a Message',
        nameLabel: 'Your Name',
        emailLabel: 'Your Email',
        messageLabel: 'Your Message',
        sendButton: 'Send Message',
        messageSent: 'Your message has been sent successfully!',
    },
    faq: {
      title: 'Help & Policies Center'
    }
  },
  hi: {
    // This would be populated with Hindi translations
  }
};