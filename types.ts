// Defines the user roles within the application.
export enum UserRole {
  PILGRIM = 'Pilgrim',
  ADMIN = 'Admin',
  AUTHORITY = 'Authority',
  VOLUNTEER = 'Volunteer',
}

// Represents a single SOS alert in the user's history.
export interface SosAlert {
  id: number;
  timestamp: string;
  status: 'Broadcasted' | 'Responded' | 'Resolved';
  message?: string; // Optional user message included in the broadcast/SOS.
  userId?: number;
  userName?: string;
  locationCoords?: { lat: number; lng: number };
}

// Represents a user's pre-registered valuable item.
export interface RegisteredItem {
    id: string;
    name: string;
    category: 'Item';
    subCategory?: 'Bags & Luggage' | 'Electronics' | 'Documents & Cards' | 'Jewelry & Accessories' | 'Other';
    brand?: string;
    color?: string;
    identifyingMarks?: string;
    images: string[]; // Array of base64 encoded images
    status: 'Safe' | 'Lost';
}


// Represents a user object.
export interface User {
  id: number;
  name: string;
  role: UserRole;
  avatar: string;
  status: 'Active' | 'Suspended';
  locationCoords?: { lat: number; lng: number }; // For map view of personnel
  emergencyContacts?: EmergencyContact[]; // For SOS calls
  sosHistory?: SosAlert[]; // For SOS history tracking
  registeredItems?: RegisteredItem[]; // For the "My Items" feature
  settings?: {
    notifications: boolean;
    powerButtonSos: boolean;
    voiceNav: boolean;
    theme?: 'light' | 'dark';
    locationAccess?: boolean;
    cameraAccess?: boolean;
    microphoneAccess?: boolean;
    // Admin settings
    adminNotifications?: {
        highPriority: boolean;
        sosAlerts: boolean;
        systemHealth: boolean;
    };
    systemSettings?: {
        aiAutofill: boolean;
        aiImageAnalysis: boolean;
        maintenanceMode: boolean;
    };
    // Authority settings
    sosZoneAlerts?: boolean;
    highPriorityAlertsOnly?: boolean;
    patrolMode?: boolean;
    // Volunteer settings
    availabilityStatus?: 'Active' | 'On Break';
    nearbyAlertsNotifications?: boolean;
    workingRadius?: number; // in kilometers
  }
}

// Represents a family member in the Family Hub.
export interface FamilyMember {
  id: number;
  name:string;
  avatar: string;
  location: { lat: number; lng: number };
  status: 'Safe' | 'Alert' | 'Lost';
}

// Represents a lost or found report.
export interface LostFoundReport {
    id: string;
    type: 'Lost' | 'Found';
    category: 'Person' | 'Item';
    subCategory?: 'Bags & Luggage' | 'Electronics' | 'Documents & Cards' | 'Jewelry & Accessories' | 'Other';
    description: string;
    lastSeen: string;
    locationCoords?: { lat: number; lng: number }; // For map view
    imageUrl?: string; // For single-image reports, can be the primary image from RegisteredItem
    imageUrls?: string[]; // For multi-image reports
    reportedBy: string;
    reportedById: number;
    timestamp: string;
    status: 'Open' | 'In Progress' | 'Resolved';
    originalItemId?: string; // Link back to the RegisteredItem
    assignedToId?: number;
    assignedToName?: string;

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
    itemMaterial?: string; // e.g., Leather, Plastic, Cotton
    itemSize?: string; // e.g., Small, Medium, 24 inches
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

// Represents an emergency contact.
export interface EmergencyContact {
  id: number;
  name: string;
  phone: string;
}

// Represents a Point of Interest on the map
export interface MapPointOfInterest {
    id: string;
    name: string;
    type: 'Help Center' | 'Medical' | 'Lost/Found Center' | 'Police Station';
    locationCoords: { lat: number; lng: number };
}

// A generic type for any object that can be a navigation destination
export type Navigatable = {
    name: string;
    locationCoords: { lat: number; lng: number };
}


// Props for the IntelligentNav component
export interface IntelligentNavProps {
  destination?: Navigatable;
}


// Add global declaration for jsPDF loaded from CDN
// FIX: Changed to jsPDF and wrapped in declare global for proper module-scoped global type.
declare global {
  const jspdf: any;
}