export type AppointmentStatus = 'Confirmed' | 'Pending' | 'In Progress' | 'Completed' | 'Rejected' | 'Rescheduled';

export type AppointmentType = 'In-person Consultation' | 'Video Consultation' | 'Court Hearing Prep' | 'Deposition Review' | 'Settlement Conference';

export interface Appointment {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  clientAvatar?: string;
  date: string; // e.g. 'Today', 'Tomorrow', '2026-09-23'
  time: string; // e.g. '09:30 AM'
  caseType: string; // e.g. 'Corporate Merger', 'Intellectual Property', 'Family Law'
  caseId?: string;
  appointmentType: AppointmentType;
  status: AppointmentStatus;
  duration: string; // e.g. '45 mins'
  roomOrLink?: string;
  notes?: string;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  company?: string;
  caseType: string;
  status: 'Active' | 'Prospective' | 'Closed';
  totalMatters: number;
  joinedDate: string;
  // Extended Client Profile fields saved in database
  address?: string;
  retainerBalance?: number;
  billingRate?: number;
  contactPerson?: string;
  leadCounsel?: string;
  conflictStatus?: 'Cleared' | 'Pending Review' | 'Waived';
  notes?: string;
  emergencyContact?: string;
  taxOrEntityId?: string;
  preferredChannel?: 'Email' | 'Phone' | 'Secure Portal' | 'Encrypted Signal';
}

export interface LegalCase {
  id: string; // e.g. '#CAS-2026-881'
  title: string;
  clientName: string;
  caseType: string;
  caseStatus: 'Active' | 'Discovery' | 'Pre-Trial' | 'In Review' | 'Closed';
  lastUpdated: string;
  courtJurisdiction?: string;
  leadCounsel?: string;
  hearingDate?: string;
}

export interface LegalDocument {
  id: string;
  title: string;
  caseId: string;
  clientName: string;
  fileSize: string;
  uploadDate: string;
  category: 'Pleadings' | 'Evidence' | 'Retainer Agreement' | 'Court Order' | 'Brief';
}

export interface LawyerProfile {
  name: string;
  title: string;
  barNumber: string;
  email: string;
  phone: string;
  firmName: string;
  avatarUrl: string;
  specialization: string[];
  bio?: string;
  officeAddress?: string;
  hourlyRate?: number;
  courtAdmissions?: string[];
  education?: { degree: string; school: string; honors?: string }[];
  chambersHours?: string;
  consultationSlot?: string;
  trialExperience?: string;
  arbitrationForums?: string;
  peerRecognition?: string;
}

export interface DashboardNotification {
  id: string;
  title: string;
  message: string;
  timeAgo: string;
  read: boolean;
  type: 'appointment' | 'case' | 'payment' | 'system';
}

export interface Invoice {
  id: string;
  clientName: string;
  caseId: string;
  amount: number;
  issueDate: string;
  dueDate: string;
  status: 'Paid' | 'Pending' | 'Overdue';
  type: 'Retainer Escrow' | 'Hourly Billing' | 'Court Filing Fee' | 'Deposition Service';
  paymentMethod?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'lawyer' | 'client';
  text: string;
  timestamp: string;
  read: boolean;
}

export interface MessageThread {
  id: string;
  clientId: string;
  clientName: string;
  clientAvatar: string;
  company: string;
  caseId: string;
  caseType: string;
  lastMessage: string;
  lastTimestamp: string;
  unreadCount: number;
  messages: ChatMessage[];
}

export type AuthProvider = 'email' | 'google' | 'twitter' | 'instagram';

export type PersonType = 'lawyer' | 'client' | 'staff';

export interface PersonProfile {
  id: string; // Unique ID
  name: string;
  email: string;
  phone: string;
  avatarUrl: string;
  role: string;
  personType: PersonType;
  firmName?: string;
  bio?: string;
  officeAddress?: string;

  // Lawyer specific
  barNumber?: string;
  specialization?: string[];
  hourlyRate?: number;
  courtAdmissions?: string[];
  education?: { degree: string; school: string; honors?: string }[];
  chambersHours?: string;
  consultationSlot?: string;
  trialExperience?: string;
  arbitrationForums?: string;
  peerRecognition?: string;

  // Client specific
  company?: string;
  caseType?: string;
  status?: 'Active' | 'Prospective' | 'Closed';
  totalMatters?: number;
  retainerBalance?: number;
  billingRate?: number;
  contactPerson?: string;
  leadCounsel?: string;
  conflictStatus?: 'Cleared' | 'Pending Review' | 'Waived';
  notes?: string;
  emergencyContact?: string;
  taxOrEntityId?: string;
  preferredChannel?: 'Email' | 'Phone' | 'Secure Portal' | 'Encrypted Signal';
  joinedDate?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  avatarUrl: string;
  provider: AuthProvider;
  role: string;
  personType?: PersonType;
  profileId?: string;
  firmName?: string;
  barNumber?: string;
  clientId?: string;
  loggedInAt: string;
}

export interface TeamMemberProfile {
  id: string;
  name: string;
  enrollmentNo: string;
  role: string;
  isLeadDeveloper?: boolean;
  avatarUrl: string;
  email: string;
  phone?: string;
  department?: string;
  institution?: string;
  bio: string;
  contributions: string[];
  skills: string[];
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  joinedDate?: string;
}

export type NavItemKey =
  | 'Dashboard'
  | 'LawyersPortal'
  | 'Appointments'
  | 'Clients'
  | 'Cases'
  | 'Messages'
  | 'Documents'
  | 'Payments'
  | 'Analytics'
  | 'Profile'
  | 'Database'
  | 'Team'
  | 'PblReport';


