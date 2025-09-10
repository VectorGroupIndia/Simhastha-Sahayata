

import { User, UserRole } from './types';
import { MOCK_REGISTERED_ITEMS } from './data/mockData';

// Defines the available languages for the language selector.
export const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिन्दी' },
  { code: 'mr', name: 'मराठी' },
  { code: 'gu', name: 'ગુજરાતી' },
  { code: 'bn', name: 'বাংলা' },
  { code: 'ta', name: 'தமிழ்' },
  { code: 'te', name: 'తెలుగు' },
];

// Defines the main navigation links shown in the header.
export const NAV_LINKS = {
    en: [
        { name: 'Home', path: '/' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
        { name: 'FAQ', path: '/faq' },
    ],
    hi: [
        { name: 'होम', path: '/' },
        { name: 'बारे में', path: '/about' },
        { name: 'संपर्क', path: '/contact' },
        { name: 'अक्सर पूछे जाने वाले प्रश्न', path: '/faq' },
    ]
    // Add other languages as needed
};

// Demo users for login simulation. This allows easy testing for different roles.
export const DEMO_USERS: User[] = [
  { id: 1, name: 'Ravi Kumar (Pilgrim)', role: UserRole.PILGRIM, avatar: 'https://picsum.photos/seed/ravi/100/100', status: 'Active', lastLogin: '2024-07-29T10:00:00Z', emergencyContacts: [{ id: 1, name: 'Priya (Wife)', phone: '9876543210' }, { id: 2, name: 'Amit (Brother)', phone: '9876543211' }], sosHistory: [{ id: 1, timestamp: '2024-07-28T14:30:00Z', status: 'Resolved' }, { id: 2, timestamp: '2024-07-26T09:00:00Z', status: 'Broadcasted' }, { id: 3, timestamp: '2024-07-25T11:00:00Z', status: 'Responded', message: 'Felt unwell near the food court.'}, { id: 4, timestamp: '2024-07-22T18:15:00Z', status: 'Resolved' }], registeredItems: MOCK_REGISTERED_ITEMS, settings: { notifications: true, powerButtonSos: false, voiceNav: true, theme: 'light', locationAccess: true, cameraAccess: true, microphoneAccess: true } },
  { id: 2, name: 'Priya Sharma (Pilgrim)', role: UserRole.PILGRIM, avatar: 'https://picsum.photos/seed/priya/100/100', status: 'Active', lastLogin: '2024-07-29T08:30:00Z', emergencyContacts: [], sosHistory: [], settings: { notifications: true, powerButtonSos: true, voiceNav: false, theme: 'light', locationAccess: true, cameraAccess: false, microphoneAccess: false } },
  { id: 3, name: 'Admin User', role: UserRole.ADMIN, avatar: 'https://picsum.photos/seed/admin/100/100', status: 'Active', lastLogin: '2024-07-29T11:00:00Z', emergencyContacts: [], settings: { notifications: true, powerButtonSos: false, voiceNav: false, theme: 'light', adminNotifications: { highPriority: true, sosAlerts: true, systemHealth: false }, systemSettings: { aiAutofill: true, aiImageAnalysis: true, maintenanceMode: false, aiSemanticSearch: true }, locationAccess: true, cameraAccess: true, microphoneAccess: true } },
  { id: 4, name: 'Officer Singh', role: UserRole.SECURITY_PERSONNEL, avatar: 'https://picsum.photos/seed/officer/100/100', status: 'Active', lastLogin: '2024-07-29T10:45:00Z', locationCoords: { lat: 40, lng: 40 }, emergencyContacts: [], settings: { notifications: true, powerButtonSos: false, voiceNav: false, theme: 'light', sosZoneAlerts: true, highPriorityAlertsOnly: false, patrolMode: false, locationAccess: true, cameraAccess: true, microphoneAccess: true } },
  { id: 5, name: 'Sunita Devi', role: UserRole.INFO_DESK_STAFF, avatar: 'https://picsum.photos/seed/sunita/100/100', status: 'Active', lastLogin: '2024-07-29T10:50:00Z', locationCoords: { lat: 60, lng: 75 }, emergencyContacts: [], settings: { notifications: true, powerButtonSos: false, voiceNav: true, theme: 'light', availabilityStatus: 'Active', nearbyAlertsNotifications: true, workingRadius: 2, locationAccess: true, cameraAccess: true, microphoneAccess: true } },
  { id: 6, name: 'Rohan Mehra (Pilgrim)', role: UserRole.PILGRIM, avatar: 'https://picsum.photos/seed/rohan/100/100', status: 'Suspended', lastLogin: '2024-07-25T18:00:00Z', emergencyContacts: [], sosHistory: [], settings: { notifications: true, powerButtonSos: false, voiceNav: true, theme: 'light', locationAccess: false, cameraAccess: false, microphoneAccess: false } },
  { id: 7, name: 'Anjali Desai (Pilgrim)', role: UserRole.PILGRIM, avatar: 'https://picsum.photos/seed/anjali/100/100', status: 'Active', lastLogin: '2024-07-29T09:15:00Z', settings: { notifications: true, powerButtonSos: false, voiceNav: false, theme: 'dark', locationAccess: true, cameraAccess: true, microphoneAccess: false } },
  { id: 8, name: 'Vikram Patel (Pilgrim)', role: UserRole.PILGRIM, avatar: 'https://picsum.photos/seed/vikram/100/100', status: 'Active', lastLogin: '2024-07-28T20:00:00Z', settings: { notifications: false, powerButtonSos: false, voiceNav: true, theme: 'light', locationAccess: true, cameraAccess: true, microphoneAccess: true } },
  { id: 9, name: 'Meera Singh (Volunteer)', role: UserRole.VOLUNTEER, avatar: 'https://picsum.photos/seed/meera/100/100', status: 'Active', lastLogin: '2024-07-29T10:30:00Z', locationCoords: { lat: 20, lng: 30 }, settings: { notifications: true, powerButtonSos: false, voiceNav: true, theme: 'light', availabilityStatus: 'On Break', nearbyAlertsNotifications: true, workingRadius: 3, locationAccess: true, cameraAccess: true, microphoneAccess: false } },
  { id: 10, name: 'Inspector Verma', role: UserRole.AUTHORITY, avatar: 'https://picsum.photos/seed/verma/100/100', status: 'Active', lastLogin: '2024-07-29T10:55:00Z', locationCoords: { lat: 80, lng: 80 }, settings: { notifications: true, powerButtonSos: false, voiceNav: false, theme: 'dark', sosZoneAlerts: true, highPriorityAlertsOnly: true, patrolMode: true, locationAccess: true, cameraAccess: true, microphoneAccess: true } },
  { id: 11, name: 'Suresh Gupta (Pilgrim)', role: UserRole.PILGRIM, avatar: 'https://picsum.photos/seed/suresh/100/100', status: 'Active', lastLogin: '2024-07-29T07:00:00Z', registeredItems: [{ id: 'item-99', name: 'Silver Kada', category: 'Item', subCategory: 'Jewelry & Accessories', images: [], status: 'Safe' }], sosHistory: [], settings: { notifications: true, powerButtonSos: true, voiceNav: true, theme: 'light', locationAccess: true, cameraAccess: true, microphoneAccess: true } },
  { id: 12, name: 'Deepak Chopra (Volunteer)', role: UserRole.VOLUNTEER, avatar: 'https://picsum.photos/seed/deepak/100/100', status: 'Active', lastLogin: '2024-07-29T09:45:00Z', locationCoords: { lat: 5, lng: 65 }, settings: { notifications: true, powerButtonSos: false, voiceNav: true, theme: 'dark', availabilityStatus: 'Active', nearbyAlertsNotifications: true, workingRadius: 1, locationAccess: true, cameraAccess: true, microphoneAccess: true } },
  { id: 13, name: 'Kavita Joshi (Pilgrim)', role: UserRole.PILGRIM, avatar: 'https://picsum.photos/seed/kavita/100/100', status: 'Active', lastLogin: '2024-07-28T15:00:00Z', settings: { notifications: true, powerButtonSos: false, voiceNav: false, theme: 'light', locationAccess: false, cameraAccess: false, microphoneAccess: false } },
  { id: 14, name: 'Amit Sharma (Volunteer)', role: UserRole.VOLUNTEER, avatar: 'https://picsum.photos/seed/amit/100/100', status: 'Suspended', lastLogin: '2024-07-27T12:00:00Z', locationCoords: { lat: 90, lng: 10 }, settings: { notifications: true, powerButtonSos: false, voiceNav: true, theme: 'light', availabilityStatus: 'On Break', nearbyAlertsNotifications: false, workingRadius: 5, locationAccess: true, cameraAccess: true, microphoneAccess: true } },
  { id: 15, name: 'Geeta Devi (Pilgrim)', role: UserRole.PILGRIM, avatar: 'https://picsum.photos/seed/geeta/100/100', status: 'Active', lastLogin: '2024-07-29T11:05:00Z', settings: { notifications: true, powerButtonSos: true, voiceNav: true, theme: 'light', locationAccess: true, cameraAccess: false, microphoneAccess: false } },
  { id: 16, name: 'Harishankar Pandey (Pilgrim)', role: UserRole.PILGRIM, avatar: 'https://picsum.photos/seed/harishankar/100/100', status: 'Active', lastLogin: '2024-07-29T06:30:00Z', emergencyContacts: [{ id: 3, name: 'Sanjay (Son)', phone: '9988776655' }], settings: { notifications: true, powerButtonSos: true, voiceNav: true, theme: 'light', locationAccess: true, cameraAccess: true, microphoneAccess: true } },
  { id: 17, name: 'Nisha Kumari (Volunteer)', role: UserRole.VOLUNTEER, avatar: 'https://picsum.photos/seed/nisha/100/100', status: 'Active', lastLogin: '2024-07-29T10:10:00Z', locationCoords: { lat: 75, lng: 50 }, settings: { notifications: true, powerButtonSos: false, voiceNav: true, theme: 'light', availabilityStatus: 'Active', nearbyAlertsNotifications: true, workingRadius: 2, locationAccess: true, cameraAccess: true, microphoneAccess: true } },
  { id: 18, name: 'Rajesh Singh (Pilgrim)', role: UserRole.PILGRIM, avatar: 'https://picsum.photos/seed/rajesh/100/100', status: 'Active', lastLogin: '2024-07-29T08:00:00Z', settings: { notifications: true, powerButtonSos: false, voiceNav: true, theme: 'dark', locationAccess: true, cameraAccess: true, microphoneAccess: true } },
  { id: 19, name: 'Dr. Ananya Sharma', role: UserRole.MEDICAL_STAFF, avatar: 'https://picsum.photos/seed/ananya/100/100', status: 'Active', lastLogin: '2024-07-29T11:15:00Z', locationCoords: { lat: 50, lng: 80 }, settings: { notifications: true, powerButtonSos: false, voiceNav: false, theme: 'light', availabilityStatus: 'Active', nearbyAlertsNotifications: true } },
  { id: 20, name: 'Guard Ramesh Patil', role: UserRole.SECURITY_PERSONNEL, avatar: 'https://picsum.photos/seed/ramesh/100/100', status: 'Active', lastLogin: '2024-07-29T11:20:00Z', locationCoords: { lat: 85, lng: 35 }, settings: { notifications: true, powerButtonSos: false, voiceNav: false, theme: 'light', patrolMode: true } }
];