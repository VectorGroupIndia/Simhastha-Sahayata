/*********************************************************************************
 * Author: Sujit Babar
 * Company: Transfigure Technologies Pvt. Ltd.
 *
 * Copyright Note: All rights reserved.
 * The code, design, process, logic, thinking, and overall layout structure
 * of this application are the intellectual property of Transfigure Technologies Pvt. Ltd.
 * This notice is for informational purposes only and does not grant any rights
 * to copy, modify, or distribute this code without explicit written permission.
 * This code is provided as-is and is intended for read-only inspection. It cannot be edited.
 *********************************************************************************/
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
  { id: 5, name: 'Sunita Devi (Volunteer)', role: UserRole.VOLUNTEER, avatar: 'https://picsum.photos/seed/sunita/100/100', status: 'Active', lastLogin: '2024-07-29T10:50:00Z', locationCoords: { lat: 60, lng: 75 }, emergencyContacts: [], sosHistory: [{ id: 101, timestamp: '2024-07-28T10:00:00Z', status: 'Resolved', message: 'Reported unattended bag near Sector C entrance. Required authority attention.' }, { id: 102, timestamp: '2024-07-29T08:15:00Z', status: 'Broadcasted', message: 'Large crowd surge near Datta Akhara Ghat. Requesting backup.' }], settings: { notifications: true, powerButtonSos: false, voiceNav: true, theme: 'light', availabilityStatus: 'Active', nearbyAlertsNotifications: true, workingRadius: 2, locationAccess: true, cameraAccess: true, microphoneAccess: true } },
  { id: 4, name: 'Officer Singh (Authority)', role: UserRole.AUTHORITY, avatar: 'https://picsum.photos/seed/officer/100/100', status: 'Active', lastLogin: '2024-07-29T10:45:00Z', locationCoords: { lat: 40, lng: 40 }, emergencyContacts: [], settings: { notifications: true, powerButtonSos: false, voiceNav: false, theme: 'light', sosZoneAlerts: true, highPriorityAlertsOnly: false, patrolMode: false, locationAccess: true, cameraAccess: true, microphoneAccess: true } },
  { id: 3, name: 'Admin User', role: UserRole.ADMIN, avatar: 'https://picsum.photos/seed/admin/100/100', status: 'Active', lastLogin: '2024-07-29T11:00:00Z', emergencyContacts: [], settings: { notifications: true, powerButtonSos: false, voiceNav: false, theme: 'light', adminNotifications: { highPriority: true, sosAlerts: true, systemHealth: false }, systemSettings: { aiAutofill: true, aiImageAnalysis: true, maintenanceMode: false, aiSemanticSearch: true }, locationAccess: true, cameraAccess: true, microphoneAccess: true } },
];