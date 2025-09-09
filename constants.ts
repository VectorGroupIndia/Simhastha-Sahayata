
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
        { name: 'About Us', path: '/about' },
        { name: 'Contact Us', path: '/contact' },
        { name: 'FAQ', path: '/faq' },
    ],
    hi: [
        { name: 'होम', path: '/' },
        { name: 'हमारे बारे में', path: '/about' },
        { name: 'संपर्क करें', path: '/contact' },
        { name: 'अक्सर पूछे जाने वाले प्रश्न', path: '/faq' },
    ]
    // Add other languages as needed
};

// Demo users for login simulation. This allows easy testing for different roles.
export const DEMO_USERS: User[] = [
  { id: 1, name: 'Ravi Kumar (Pilgrim)', role: UserRole.PILGRIM, avatar: 'https://picsum.photos/seed/ravi/100/100', emergencyContacts: [{ id: 1, name: 'Priya (Wife)', phone: '9876543210' }, { id: 2, name: 'Amit (Brother)', phone: '9876543211' }], sosHistory: [{ id: 1, timestamp: '2024-07-28T14:30:00Z', status: 'Resolved' }, { id: 2, timestamp: '2024-07-26T09:00:00Z', status: 'Broadcasted' }], registeredItems: MOCK_REGISTERED_ITEMS },
  { id: 2, name: 'Priya Sharma (Pilgrim)', role: UserRole.PILGRIM, avatar: 'https://picsum.photos/seed/priya/100/100', emergencyContacts: [], sosHistory: [] },
  { id: 3, name: 'Admin User', role: UserRole.ADMIN, avatar: 'https://picsum.photos/seed/admin/100/100', emergencyContacts: [] },
  { id: 4, name: 'Officer Singh (Authority)', role: UserRole.AUTHORITY, avatar: 'https://picsum.photos/seed/officer/100/100', emergencyContacts: [] },
  { id: 5, name: 'Sunita Devi (Volunteer)', role: UserRole.VOLUNTEER, avatar: 'https://picsum.photos/seed/sunita/100/100', emergencyContacts: [] },
];
