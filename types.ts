// Defines the user roles within the application.
export enum UserRole {
  PILGRIM = 'Pilgrim',
  ADMIN = 'Admin',
  AUTHORITY = 'Authority',
  VOLUNTEER = 'Volunteer',
}

// Represents a user object.
export interface User {
  id: number;
  name: string;
  role: UserRole;
  avatar: string;
}

// Represents a family member in the Family Hub.
export interface FamilyMember {
  id: number;
  name: string;
  avatar: string;
  location: { lat: number; lng: number };
  status: 'Safe' | 'Alert' | 'Lost';
}

// Represents a lost or found report.
export interface LostFoundReport {
    id: string;
    type: 'Lost' | 'Found';
    category: 'Person' | 'Item';
    description: string;
    lastSeen: string;
    locationCoords?: { lat: number; lng: number }; // For map view
    imageUrl?: string;
    reportedBy: string;
    reportedById: number;
    timestamp: string;
    status: 'Open' | 'In Progress' | 'Resolved';

    // Details for a person
    personName?: string;
    personAge?: string;
    personGender?: string;
    clothingAppearance?: string;

    // Details for an item
    itemName?: string;
    itemBrand?: string;
    itemColor?: string;
    identifyingMarks?: string;
}

// Represents a single message in the AI Pilgrim Guide chat.
export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

// Represents a toast notification message.
export interface ToastMessage {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}