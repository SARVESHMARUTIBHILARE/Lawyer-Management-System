export type UserRole = 'admin' | 'partner' | 'associate' | 'paralegal' | 'billing_specialist' | 'client';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title: string;
  avatarUrl?: string;
  hourlyRate: number;
  twoFactorEnabled: boolean;
  status: 'active' | 'inactive';
  department: string;
  authProvider?: 'email' | 'google' | 'twitter' | 'instagram';
  socialHandle?: string;
  lastLoginAt?: string;
}

export type CaseStatus = 'intake' | 'discovery' | 'pre_trial' | 'trial' | 'settlement' | 'closed';
export type PracticeArea = 'Corporate' | 'Intellectual Property' | 'Litigation' | 'Family Law' | 'Real Estate' | 'Criminal Defense' | 'Tax Law';

export interface CaseFile {
  id: string;
  caseNumber: string;
  title: string;
  clientName: string;
  clientEmail: string;
  practiceArea: PracticeArea;
  assignedLawyerId: string;
  assignedLawyerName: string;
  status: CaseStatus;
  openedDate: string;
  expectedClosureDate: string;
  retainerAmount: number;
  retainerRemaining: number;
  hourlyRate: number;
  totalBilled: number;
  description: string;
  tags: string[];
}

export interface CaseDeadline {
  id: string;
  caseId: string;
  caseTitle: string;
  title: string;
  dueDate: string; // YYYY-MM-DD HH:mm
  type: 'court_appearance' | 'filing' | 'statute_of_limitations' | 'discovery_response' | 'client_meeting';
  priority: 'critical' | 'high' | 'medium' | 'low';
  assignedTo: string; // User Name
  completed: boolean;
  notes?: string;
}

export interface SmartDeadlineSuggestion {
  id: string;
  title: string;
  suggestedDate: string; // YYYY-MM-DDTHH:mm
  type: 'court_appearance' | 'filing' | 'statute_of_limitations' | 'discovery_response' | 'client_meeting';
  priority: 'critical' | 'high' | 'medium' | 'low';
  assignedTo: string;
  rationale: string;
  statutoryReference?: string;
  derivedFromDocs?: string[];
  daysFromNow?: number;
  stage?: 'Intake' | 'Pleadings' | 'Discovery' | 'Motions' | 'Trial' | 'Post-Trial';
}

export interface CaseMilestonePlan {
  caseId: string;
  caseTitle: string;
  analyzedAt: string;
  documentCount: number;
  caseHealthInsight: string;
  proceduralPhase: string;
  statutoryJurisdiction: string;
  suggestedMilestones: SmartDeadlineSuggestion[];
  riskAlerts: string[];
}

export interface DocumentCustodyEvent {
  id: string;
  action: 'Uploaded' | 'Marked Verified' | 'Flagged for Review' | 'Transferred' | 'Modified';
  performedBy: string;
  timestamp: string;
  note?: string;
}

export interface ClientDocument {
  id: string;
  caseId: string;
  caseTitle: string;
  clientName: string;
  fileName: string;
  fileSize: string;
  fileType: 'pdf' | 'docx' | 'xlsx' | 'scanned_img';
  category: 'Pleadings' | 'Contracts' | 'Discovery' | 'Evidence' | 'Correspondence' | 'Invoices';
  uploadedAt: string;
  uploadedBy: string;
  version: string;
  isConfidential: boolean;
  verificationStatus?: 'Verified' | 'Needs Review';
  verifiedBy?: string;
  verifiedAt?: string;
  custodyHash?: string;
  chainOfCustody?: DocumentCustodyEvent[];
  aiSummary?: string;
  aiRiskLevel?: 'Low' | 'Moderate' | 'High';
  aiKeyClauses?: string[];
}

export interface TimeEntry {
  id: string;
  caseId: string;
  caseTitle: string;
  lawyerId: string;
  lawyerName: string;
  date: string;
  hours: number;
  rate: number;
  amount: number;
  description: string;
  isBilled: boolean;
  invoiceId?: string;
}

export type ReminderTone =
  | 'courteous_first'
  | 'formal_standard'
  | 'urgent_final'
  | 'retainer_depletion'
  | 'custom';

export interface InvoiceReminderLog {
  id: string;
  invoiceId: string;
  invoiceNumber: string;
  sentAt: string;
  sentBy: string;
  recipientEmail: string;
  recipientName: string;
  subject: string;
  tone: ReminderTone;
  body: string;
  balanceDue: number;
  deliveryMethod: 'in_app_dispatch' | 'email_client_mailto';
  noticeLevel?: '1st Courtesy Notice' | '2nd Formal Demand' | '3rd Final Notice' | 'Retainer Depletion';
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  caseId: string;
  caseTitle: string;
  clientName: string;
  clientEmail: string;
  issueDate: string;
  dueDate: string;
  subtotal: number;
  tax: number;
  totalAmount: number;
  amountPaid: number;
  status: 'draft' | 'pending_approval' | 'sent' | 'paid' | 'overdue';
  items: {
    description: string;
    hours: number;
    rate: number;
    amount: number;
  }[];
  lastReminderSent?: {
    sentAt: string;
    sentBy: string;
    tone: ReminderTone;
    recipientEmail: string;
    subject?: string;
  };
  reminderHistory?: InvoiceReminderLog[];
}

export interface EncryptedMessage {
  id: string;
  threadId: string;
  caseId?: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  recipientId: string;
  recipientName: string;
  encryptedContent: string; // Base64 simulated encrypted payload
  decryptedContent: string;
  timestamp: string;
  isEncrypted: boolean;
  keyFingerprint: string;
  attachments?: string[];
}

export interface MessageThread {
  id: string;
  caseId?: string;
  caseTitle?: string;
  participantName: string;
  participantRole: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  keyFingerprint: string;
}

export interface ThreadAISummary {
  threadId: string;
  threadTitle: string;
  participantName: string;
  generatedAt: string;
  messageCount: number;
  executiveSummary: string;
  keyDiscussionPoints: string[];
  actionItems: {
    task: string;
    assignee?: string;
    priority?: 'High' | 'Medium' | 'Low';
    dueDate?: string;
  }[];
  legalRisksAndPrivilege: {
    privilegeStatus: string;
    riskFlags: string[];
    sensitiveExhibitsMentioned?: string[];
  };
  keyDeadlinesMentioned: {
    title: string;
    date: string;
    context: string;
  }[];
  clientSentimentOrPosture: string;
  recommendedNextSteps: string[];
}

export interface ProductivityMetrics {
  totalBillableHoursMonth: number;
  billableHoursTarget: number;
  totalRevenueMonth: number;
  revenueTarget: number;
  realizationRatePercent: number;
  deadlineCompliancePercent: number;
  activeCasesCount: number;
  casesClosedThisQuarter: number;
  monthlyRevenueHistory: { month: string; revenue: number; billedHours: number }[];
  practiceAreaBreakdown: { name: string; count: number; revenue: number }[];
  staffProductivity: {
    lawyerName: string;
    role: string;
    targetHours: number;
    actualHours: number;
    billedAmount: number;
    utilizationRate: number;
  }[];
}

export interface SecurityAuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  details: string;
  ipAddress: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface RolePermission {
  role: UserRole;
  roleName: string;
  canViewAllCases: boolean;
  canEditCases: boolean;
  canDeleteCases: boolean;
  canManageBilling: boolean;
  canApproveInvoices: boolean;
  canViewAnalytics: boolean;
  canManageUsers: boolean;
  canManageSecurity2FA: boolean;
  canAccessEncryptedVault: boolean;
}

export interface DeviceSyncStatus {
  isOnline: boolean;
  lastSyncedAt: string;
  pendingSyncCount: number;
  devices: {
    id: string;
    deviceName: string;
    platform: 'Desktop (macOS)' | 'Desktop (Windows)' | 'Mobile (iOS)' | 'Mobile (Android)' | 'Web App';
    lastActive: string;
    isCurrentDevice: boolean;
  }[];
}

export interface EvidenceProof {
  id: string;
  title: string;
  category:
    | 'Contract & Agreement'
    | 'Financial & Bank Record'
    | 'Photo & Visual Proof'
    | 'Email & Correspondence'
    | 'Official / Police Report'
    | 'Witness Statement'
    | 'Patent / IP Filing'
    | 'Expert Testimony / Other';
  fileName: string;
  fileSize?: string;
  fileType?: string;
  description: string;
  dateOfEvidence?: string;
  confidential: boolean;
  uploadedAt: string;
}

export interface DigitalConsentRecord {
  agreed: boolean;
  consentedAt?: string; // Timestamp of acceptance (e.g. '2026-08-06 14:19:42')
  consentedBy?: string; // Full name of signer / authorized client officer
  signerRole?: string; // e.g. 'Chief Legal Officer', 'Managing Director'
  signerEmail?: string; // Authorized email
  signerIp?: string; // Network IP / Client session address
  consentVersion?: string; // Legal disclosure terms version
  termsVersion?: string; // Alternate alias for version
  consentHash?: string; // SHA-256 cryptographic verification checksum
  acknowledgedTerms?: string[]; // Array of acknowledged legal disclosure terms
  acknowledgedClauses?: string[]; // Array of acknowledged legal clauses
  signatureType?: 'electronic_consent_toggle' | 'digital_signature' | 'attorney_certified_override';
  notes?: string;
}

export type ConflictRiskLevel = 'clear' | 'low' | 'medium' | 'high' | 'critical';
export type ConflictEntityType =
  | 'current_client'
  | 'opposing_party'
  | 'case_title_party'
  | 'related_party'
  | 'former_client'
  | 'intake_applicant';

export interface ConflictMatchItem {
  id: string;
  matchedCaseId: string;
  matchedCaseNumber: string;
  matchedCaseTitle: string;
  matchedEntityName: string;
  matchedEntityType: ConflictEntityType;
  queryTerm: string;
  querySource: 'client_name' | 'opposing_party' | 'related_party' | 'summary_entity';
  similarityScore: number; // 0 - 100
  algorithmBreakdown: {
    levenshtein: number; // 0 - 100
    jaroWinkler: number; // 0 - 100
    tokenOverlap: number; // 0 - 100
    ngramDice: number; // 0 - 100
  };
  conflictRisk: ConflictRiskLevel;
  ethicalRule: string; // e.g. 'ABA Model Rule 1.7(a)(1) - Direct Adversity'
  description: string;
  casePracticeArea: PracticeArea;
  assignedLawyerName: string;
  caseStatus: CaseStatus;
}

export interface ConflictCheckReport {
  id: string;
  status: 'clear' | 'potential_conflict' | 'high_risk_conflict';
  riskLevel: ConflictRiskLevel;
  overallScore: number; // 0 - 100
  scannedAt: string;
  scannedClientName: string;
  scannedOpposingParty?: string;
  scannedRelatedParties?: string[];
  totalCasesScanned: number;
  totalEntitiesScanned: number;
  matches: ConflictMatchItem[];
  summary: string;
  ethicalGuidance: string;
  clearedBy?: string;
  clearedAt?: string;
  clearanceNotes?: string;
  waiverStatus?: 'not_required' | 'pending_waiver' | 'waiver_executed' | 'declined_due_to_conflict';
}

export interface ClientRepresentationRequest {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  practiceArea: PracticeArea;
  preferredLawyerId?: string;
  preferredLawyerName?: string;
  targetLawyerIds?: string[];
  targetLawyerNames?: string[];
  requestTitle: string;
  caseSummary: string;
  opposingParty?: string;
  relatedParties?: string[];
  incidentDate?: string;
  urgencyLevel?: 'Standard' | 'Urgent (Within 48h)' | 'Critical / Immediate Court Filing';
  estimatedBudget?: number;
  evidenceList?: EvidenceProof[];
  digitalConsent?: DigitalConsentRecord;
  conflictCheckReport?: ConflictCheckReport;
  submittedAt: string;
  status: 'pending' | 'accepted' | 'declined';
  reviewedBy?: string;
  reviewedAt?: string;
  reviewNotes?: string;
  assignedCaseId?: string;
}

