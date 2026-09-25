import {
  User,
  CaseFile,
  CaseDeadline,
  ClientDocument,
  TimeEntry,
  Invoice,
  EncryptedMessage,
  MessageThread,
  ProductivityMetrics,
  SecurityAuditLog,
  RolePermission,
  DeviceSyncStatus,
  ClientRepresentationRequest
} from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'u-1',
    name: 'Eleanor Vance, Esq.',
    email: 'e.vance@juris-pulse.law',
    role: 'admin',
    title: 'Managing Partner',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    hourlyRate: 650,
    twoFactorEnabled: true,
    status: 'active',
    department: 'Executive Management / Corporate'
  },
  {
    id: 'u-2',
    name: 'Marcus Sterling',
    email: 'm.sterling@juris-pulse.law',
    role: 'partner',
    title: 'Senior Partner',
    avatarUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
    hourlyRate: 580,
    twoFactorEnabled: true,
    status: 'active',
    department: 'Litigation & Trial Practice'
  },
  {
    id: 'u-3',
    name: 'Sophia Chen',
    email: 's.chen@juris-pulse.law',
    role: 'associate',
    title: 'Senior Associate',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    hourlyRate: 420,
    twoFactorEnabled: true,
    status: 'active',
    department: 'Intellectual Property'
  },
  {
    id: 'u-4',
    name: 'David Ross',
    email: 'd.ross@juris-pulse.law',
    role: 'paralegal',
    title: 'Senior Legal Assistant',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    hourlyRate: 195,
    twoFactorEnabled: false,
    status: 'active',
    department: 'Litigation Support'
  },
  {
    id: 'u-5',
    name: 'Rachel Adams',
    email: 'r.adams@juris-pulse.law',
    role: 'billing_specialist',
    title: 'Firm Controller & Billing Mgr',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    hourlyRate: 220,
    twoFactorEnabled: true,
    status: 'active',
    department: 'Finance & Compliance'
  }
];

export const ROLE_PERMISSIONS: Record<string, RolePermission> = {
  admin: {
    role: 'admin',
    roleName: 'Admin / Managing Partner',
    canViewAllCases: true,
    canEditCases: true,
    canDeleteCases: true,
    canManageBilling: true,
    canApproveInvoices: true,
    canViewAnalytics: true,
    canManageUsers: true,
    canManageSecurity2FA: true,
    canAccessEncryptedVault: true
  },
  partner: {
    role: 'partner',
    roleName: 'Senior Partner',
    canViewAllCases: true,
    canEditCases: true,
    canDeleteCases: true,
    canManageBilling: true,
    canApproveInvoices: true,
    canViewAnalytics: true,
    canManageUsers: false,
    canManageSecurity2FA: false,
    canAccessEncryptedVault: true
  },
  associate: {
    role: 'associate',
    roleName: 'Associate Attorney',
    canViewAllCases: true,
    canEditCases: true,
    canDeleteCases: false,
    canManageBilling: true,
    canApproveInvoices: false,
    canViewAnalytics: true,
    canManageUsers: false,
    canManageSecurity2FA: false,
    canAccessEncryptedVault: true
  },
  paralegal: {
    role: 'paralegal',
    roleName: 'Paralegal / Staff Assistant',
    canViewAllCases: true,
    canEditCases: false,
    canDeleteCases: false,
    canManageBilling: false,
    canApproveInvoices: false,
    canViewAnalytics: false,
    canManageUsers: false,
    canManageSecurity2FA: false,
    canAccessEncryptedVault: false
  },
  billing_specialist: {
    role: 'billing_specialist',
    roleName: 'Billing & Accounting Specialist',
    canViewAllCases: true,
    canEditCases: false,
    canDeleteCases: false,
    canManageBilling: true,
    canApproveInvoices: true,
    canViewAnalytics: true,
    canManageUsers: false,
    canManageSecurity2FA: false,
    canAccessEncryptedVault: false
  }
};

export const INITIAL_CASES: CaseFile[] = [
  {
    id: 'case-101',
    caseNumber: 'JP-2026-0891',
    title: 'AeroTech Dynamics v. Quantum Systems Inc.',
    clientName: 'AeroTech Dynamics Global',
    clientEmail: 'legal@aerotech-global.com',
    practiceArea: 'Intellectual Property',
    assignedLawyerId: 'u-3',
    assignedLawyerName: 'Sophia Chen',
    status: 'discovery',
    openedDate: '2026-02-14',
    expectedClosureDate: '2026-11-30',
    retainerAmount: 45000,
    retainerRemaining: 28400,
    hourlyRate: 420,
    totalBilled: 38200,
    description: 'Patent infringement suit involving semiconductor propulsion algorithms and proprietary firmware patents.',
    tags: ['Patent', 'High Stakes', 'Federal Court', 'Tech']
  },
  {
    id: 'case-102',
    caseNumber: 'JP-2026-0422',
    title: 'Merger Agreement: Vantage Energy & Solar Grid',
    clientName: 'Vantage Energy Corporation',
    clientEmail: 'corp@vantage-energy.org',
    practiceArea: 'Corporate',
    assignedLawyerId: 'u-1',
    assignedLawyerName: 'Eleanor Vance, Esq.',
    status: 'pre_trial',
    openedDate: '2026-04-01',
    expectedClosureDate: '2026-09-15',
    retainerAmount: 120000,
    retainerRemaining: 64500,
    hourlyRate: 650,
    totalBilled: 85200,
    description: '$420M cross-border clean energy corporate acquisition and regulatory antitrust compliance filing.',
    tags: ['M&A', 'Antitrust', 'Regulatory', 'Corporate']
  },
  {
    id: 'case-103',
    caseNumber: 'JP-2026-0118',
    title: 'Harrison Family Trust Settlement & Distribution',
    clientName: 'Julian & Claire Harrison',
    clientEmail: 'harrison.trust@estate.net',
    practiceArea: 'Family Law',
    assignedLawyerId: 'u-2',
    assignedLawyerName: 'Marcus Sterling',
    status: 'settlement',
    openedDate: '2026-01-10',
    expectedClosureDate: '2026-08-31',
    retainerAmount: 25000,
    retainerRemaining: 8100,
    hourlyRate: 580,
    totalBilled: 21400,
    description: 'Complex multi-jurisdictional estate settlement, real estate asset division, and trust escrow distribution.',
    tags: ['Estate', 'Trust', 'Settlement']
  },
  {
    id: 'case-104',
    caseNumber: 'JP-2026-0955',
    title: 'City of Metroport v. Skyline Towers Commercial Real Estate',
    clientName: 'Skyline Properties Group LLC',
    clientEmail: 'legal@skylinedev.com',
    practiceArea: 'Real Estate',
    assignedLawyerId: 'u-2',
    assignedLawyerName: 'Marcus Sterling',
    status: 'discovery',
    openedDate: '2026-05-19',
    expectedClosureDate: '2026-12-20',
    retainerAmount: 35000,
    retainerRemaining: 22000,
    hourlyRate: 580,
    totalBilled: 16800,
    description: 'Zoning ordinance dispute and municipal eminent domain challenge for commercial tower expansion.',
    tags: ['Zoning', 'Municipal', 'Commercial']
  },
  {
    id: 'case-105',
    caseNumber: 'JP-2026-0304',
    title: 'BioGenX Pharmaceuticals SEC Compliance & Audit',
    clientName: 'BioGenX Corp',
    clientEmail: 'sec-compliance@biogenx.io',
    practiceArea: 'Tax Law',
    assignedLawyerId: 'u-1',
    assignedLawyerName: 'Eleanor Vance, Esq.',
    status: 'intake',
    openedDate: '2026-07-02',
    expectedClosureDate: '2027-01-15',
    retainerAmount: 60000,
    retainerRemaining: 55000,
    hourlyRate: 650,
    totalBilled: 8200,
    description: 'Federal tax compliance audit and internal financial governance review for biotech SEC filings.',
    tags: ['SEC', 'Tax Audit', 'Biotech']
  }
];

export const INITIAL_DEADLINES: CaseDeadline[] = [
  {
    id: 'dl-0',
    caseId: 'case-101',
    caseTitle: 'AeroTech Dynamics v. Quantum Systems Inc.',
    title: 'Initial Case Management Conference',
    dueDate: '2026-08-04 10:00',
    type: 'court_appearance',
    priority: 'medium',
    assignedTo: 'Sophia Chen',
    completed: true,
    notes: 'Initial scheduling order established with Magistrate Judge.'
  },
  {
    id: 'dl-1',
    caseId: 'case-101',
    caseTitle: 'AeroTech Dynamics v. Quantum Systems Inc.',
    title: 'Expert Discovery Depositions Response Deadline',
    dueDate: '2026-08-12 17:00',
    type: 'discovery_response',
    priority: 'critical',
    assignedTo: 'Sophia Chen',
    completed: true,
    notes: 'Must submit technical expert interrogatories and firmware source code audit logs.'
  },
  {
    id: 'dl-2',
    caseId: 'case-102',
    caseTitle: 'Merger Agreement: Vantage Energy & Solar Grid',
    title: 'FTC Antitrust Pre-Merger Notification Filing',
    dueDate: '2026-08-15 12:00',
    type: 'filing',
    priority: 'critical',
    assignedTo: 'Eleanor Vance, Esq.',
    completed: false,
    notes: 'Hart-Scott-Rodino filing package must be delivered to antitrust review board.'
  },
  {
    id: 'dl-3a',
    caseId: 'case-105',
    caseTitle: 'BioGenX Pharmaceuticals SEC Compliance & Audit',
    title: 'Client Financial Officer Audit Strategy Conference',
    dueDate: '2026-08-19 14:00',
    type: 'client_meeting',
    priority: 'medium',
    assignedTo: 'Eleanor Vance, Esq.',
    completed: true,
    notes: 'Review Q2 SEC disclosure discrepancies and independent auditor notes.'
  },
  {
    id: 'dl-3',
    caseId: 'case-103',
    caseTitle: 'Harrison Family Trust Settlement & Distribution',
    title: 'Final Probate Court Hearing Appearance',
    dueDate: '2026-08-20 09:30',
    type: 'court_appearance',
    priority: 'high',
    assignedTo: 'Marcus Sterling',
    completed: false,
    notes: 'Courtroom 402, Dept 12. Bring executed settlement agreement copy.'
  },
  {
    id: 'dl-3b',
    caseId: 'case-101',
    caseTitle: 'AeroTech Dynamics v. Quantum Systems Inc.',
    title: 'Motion to Compel Source Code Production',
    dueDate: '2026-08-22 16:30',
    type: 'filing',
    priority: 'high',
    assignedTo: 'Sophia Chen',
    completed: false,
    notes: 'Formal motion under FRCP Rule 37 for unredacted repository logs.'
  },
  {
    id: 'dl-3c',
    caseId: 'case-101',
    caseTitle: 'AeroTech Dynamics v. Quantum Systems Inc.',
    title: 'Markman Patent Claim Construction Joint Brief Due',
    dueDate: '2026-08-25 17:00',
    type: 'filing',
    priority: 'critical',
    assignedTo: 'Sophia Chen',
    completed: false,
    notes: 'Joint claim construction chart and disputed term definitions.'
  },
  {
    id: 'dl-4',
    caseId: 'case-104',
    caseTitle: 'City of Metroport v. Skyline Towers Commercial Real Estate',
    title: 'Statute of Limitations Expiration for Special Assessment Appeal',
    dueDate: '2026-08-28 23:59',
    type: 'statute_of_limitations',
    priority: 'critical',
    assignedTo: 'David Ross',
    completed: false,
    notes: 'Mandatory statutory deadline to challenge municipal valuation.'
  },
  {
    id: 'dl-5',
    caseId: 'case-101',
    caseTitle: 'AeroTech Dynamics v. Quantum Systems Inc.',
    title: 'Preliminary Motion for Injunction Hearing',
    dueDate: '2026-09-02 10:00',
    type: 'court_appearance',
    priority: 'high',
    assignedTo: 'Sophia Chen',
    completed: false,
    notes: 'US District Court Federal Judge presiding.'
  },
  {
    id: 'dl-6',
    caseId: 'case-102',
    caseTitle: 'Merger Agreement: Vantage Energy & Solar Grid',
    title: 'Second Request Antitrust Document Production Cutoff',
    dueDate: '2026-09-09 17:00',
    type: 'discovery_response',
    priority: 'critical',
    assignedTo: 'Eleanor Vance, Esq.',
    completed: false,
    notes: 'Complete production of executive communications and economic modeling datasets.'
  },
  {
    id: 'dl-7',
    caseId: 'case-103',
    caseTitle: 'Harrison Family Trust Settlement & Distribution',
    title: 'Trust Escrow Disbursement & Tax Filing Deadline',
    dueDate: '2026-09-15 15:00',
    type: 'filing',
    priority: 'medium',
    assignedTo: 'Marcus Sterling',
    completed: false,
    notes: 'File IRS Form 706 estate tax return and record escrow deeds.'
  },
  {
    id: 'dl-8',
    caseId: 'case-104',
    caseTitle: 'City of Metroport v. Skyline Towers Commercial Real Estate',
    title: 'Municipal Board of Zoning Appeals Public Hearing',
    dueDate: '2026-09-22 18:30',
    type: 'court_appearance',
    priority: 'high',
    assignedTo: 'Marcus Sterling',
    completed: false,
    notes: 'City Hall Chamber Room 3B. Expert acoustic and structural witnesses present.'
  },
  {
    id: 'dl-9',
    caseId: 'case-101',
    caseTitle: 'AeroTech Dynamics v. Quantum Systems Inc.',
    title: 'Summary Judgment Motion Filing & Briefing',
    dueDate: '2026-09-29 17:00',
    type: 'filing',
    priority: 'critical',
    assignedTo: 'Sophia Chen',
    completed: false,
    notes: 'File comprehensive statement of undisputed material facts and expert declarations.'
  },
  {
    id: 'dl-10',
    caseId: 'case-101',
    caseTitle: 'AeroTech Dynamics v. Quantum Systems Inc.',
    title: 'Final Pre-Trial Evidentiary Conference',
    dueDate: '2026-10-06 09:00',
    type: 'court_appearance',
    priority: 'critical',
    assignedTo: 'Sophia Chen',
    completed: false,
    notes: 'Final pretrial order, motions in limine, and exhibit list submission.'
  },
  {
    id: 'dl-11',
    caseId: 'case-105',
    caseTitle: 'BioGenX Pharmaceuticals SEC Compliance & Audit',
    title: 'Statutory 10-Q SEC Filing Extension Expiration',
    dueDate: '2026-10-15 17:30',
    type: 'statute_of_limitations',
    priority: 'critical',
    assignedTo: 'Eleanor Vance, Esq.',
    completed: false,
    notes: 'Hard statutory SEC cut-off under Rule 12b-25.'
  }
];

export const INITIAL_DOCUMENTS: ClientDocument[] = [
  {
    id: 'doc-1',
    caseId: 'case-101',
    caseTitle: 'AeroTech Dynamics v. Quantum Systems Inc.',
    clientName: 'AeroTech Dynamics Global',
    fileName: 'Patent_Claim_Construction_Brief_v3.pdf',
    fileSize: '4.2 MB',
    fileType: 'pdf',
    category: 'Pleadings',
    uploadedAt: '2026-08-01 14:20',
    uploadedBy: 'Sophia Chen',
    version: '3.1',
    isConfidential: true,
    verificationStatus: 'Verified',
    verifiedBy: 'Sophia Chen',
    verifiedAt: '2026-08-02 10:15',
    custodyHash: 'SHA256: 8f3c7a912e5d944bc0891d21e89b41a3',
    chainOfCustody: [
      {
        id: 'cust-1',
        action: 'Uploaded',
        performedBy: 'Sophia Chen (Lead Counsel)',
        timestamp: '2026-08-01 14:20',
        note: 'Initial filing brief draft uploaded to matter vault'
      },
      {
        id: 'cust-2',
        action: 'Marked Verified',
        performedBy: 'Sophia Chen',
        timestamp: '2026-08-02 10:15',
        note: 'Cryptographic hash generated & verified against federal e-filing receipt'
      }
    ],
    aiSummary: 'Comprehensive construction brief detailing 14 core patent claims regarding semiconductor propulsion telemetry.',
    aiRiskLevel: 'Moderate',
    aiKeyClauses: [
      'Prior art defense raised by opposing counsel under 35 U.S.C. § 102.',
      'Explicit royalty capping clause in 2021 licensing agreement.',
      'Mandatory arbitration clause triggered if claim damages exceed $10M.'
    ]
  },
  {
    id: 'doc-ev-1',
    caseId: 'case-101',
    caseTitle: 'AeroTech Dynamics v. Quantum Systems Inc.',
    clientName: 'AeroTech Dynamics Global',
    fileName: 'Firmware_Source_Binary_Diff_Audit_Exhibit_A.pdf',
    fileSize: '6.4 MB',
    fileType: 'pdf',
    category: 'Evidence',
    uploadedAt: '2026-08-03 16:45',
    uploadedBy: 'AeroTech Dynamics (Client Intake)',
    version: '1.0',
    isConfidential: true,
    verificationStatus: 'Verified',
    verifiedBy: 'Eleanor Vance, Esq.',
    verifiedAt: '2026-08-04 11:30',
    custodyHash: 'SHA256: d49c3b88e1a7428f5bc6198f7e21a009',
    chainOfCustody: [
      {
        id: 'cust-ev1-1',
        action: 'Uploaded',
        performedBy: 'AeroTech Dynamics Engineering Forensics',
        timestamp: '2026-08-03 16:45',
        note: 'Transferred via encrypted intake exhibit uploader'
      },
      {
        id: 'cust-ev1-2',
        action: 'Transferred',
        performedBy: 'Intake Automation Protocol',
        timestamp: '2026-08-03 16:46',
        note: 'Ingested into AES-256 case vault'
      },
      {
        id: 'cust-ev1-3',
        action: 'Marked Verified',
        performedBy: 'Eleanor Vance, Esq.',
        timestamp: '2026-08-04 11:30',
        note: 'Source code diff hashes validated against git commit tag v4.9.2'
      }
    ],
    aiSummary: 'Digital forensic audit report comparing Quantum Systems binary assembly with AeroTech copyrighted microcode.',
    aiRiskLevel: 'High',
    aiKeyClauses: [
      'Identical 94.2% block-level similarity detected in telemetry compression module.',
      'Timestamp of reverse engineering artifact dated 14 days prior to patent filing.'
    ]
  },
  {
    id: 'doc-ev-2',
    caseId: 'case-101',
    caseTitle: 'AeroTech Dynamics v. Quantum Systems Inc.',
    clientName: 'AeroTech Dynamics Global',
    fileName: 'Exclusivity_Breach_Internal_Slack_Logs_Exhibit_B.pdf',
    fileSize: '3.1 MB',
    fileType: 'pdf',
    category: 'Evidence',
    uploadedAt: '2026-08-05 09:12',
    uploadedBy: 'AeroTech Dynamics (Client Intake)',
    version: '1.0',
    isConfidential: true,
    verificationStatus: 'Needs Review',
    custodyHash: 'SHA256: e82f109bc47da15320875cbe61937dfa',
    chainOfCustody: [
      {
        id: 'cust-ev2-1',
        action: 'Uploaded',
        performedBy: 'Client Legal Liaison',
        timestamp: '2026-08-05 09:12',
        note: 'Raw Slack export JSON/PDF attached during intake proof submission'
      },
      {
        id: 'cust-ev2-2',
        action: 'Flagged for Review',
        performedBy: 'Intake Review Filter',
        timestamp: '2026-08-05 09:13',
        note: 'Pending attorney authentication & chain of custody notarization'
      }
    ],
    aiSummary: 'Internal messaging transcript between former lead engineer and competitor regarding proprietary algorithm.',
    aiRiskLevel: 'High',
    aiKeyClauses: [
      'Discussion referencing non-disclosure covenant bypass.',
      'Attachment references to confidential telemetry schematic.'
    ]
  },
  {
    id: 'doc-2',
    caseId: 'case-102',
    caseTitle: 'Merger Agreement: Vantage Energy & Solar Grid',
    clientName: 'Vantage Energy Corporation',
    fileName: 'Definitive_Merger_Agreement_EXECUTED.docx',
    fileSize: '8.7 MB',
    fileType: 'docx',
    category: 'Contracts',
    uploadedAt: '2026-07-28 09:15',
    uploadedBy: 'Eleanor Vance, Esq.',
    version: 'Final',
    isConfidential: true,
    verificationStatus: 'Verified',
    verifiedBy: 'Eleanor Vance, Esq.',
    verifiedAt: '2026-07-29 14:00',
    custodyHash: 'SHA256: 7a1d59b20e14cb78912efc00843194be',
    chainOfCustody: [
      {
        id: 'cust-2-1',
        action: 'Uploaded',
        performedBy: 'Eleanor Vance, Esq.',
        timestamp: '2026-07-28 09:15',
        note: 'Executed closing document package ingested'
      },
      {
        id: 'cust-2-2',
        action: 'Marked Verified',
        performedBy: 'Eleanor Vance, Esq.',
        timestamp: '2026-07-29 14:00',
        note: 'Board signatory digital certificates verified'
      }
    ],
    aiSummary: 'Primary purchase agreement governing $420M asset acquisition with escrow indemnification terms.',
    aiRiskLevel: 'Low',
    aiKeyClauses: [
      'Breakup fee set at 3.5% ($14.7M) upon regulatory disapproval.',
      'Material Adverse Effect (MAE) clause explicitly excludes green subsidy regulatory shifts.',
      'Closing conditions mandate FTC approval prior to Oct 1, 2026.'
    ]
  },
  {
    id: 'doc-3',
    caseId: 'case-103',
    caseTitle: 'Harrison Family Trust Settlement & Distribution',
    clientName: 'Julian & Claire Harrison',
    fileName: 'Escrow_Account_Ledger_Q2_2026.xlsx',
    fileSize: '1.8 MB',
    fileType: 'xlsx',
    category: 'Discovery',
    uploadedAt: '2026-07-15 11:40',
    uploadedBy: 'David Ross',
    version: '1.0',
    isConfidential: false,
    verificationStatus: 'Needs Review',
    custodyHash: 'SHA256: b51e94110ca84df72914619ef0018a4d',
    chainOfCustody: [
      {
        id: 'cust-3-1',
        action: 'Uploaded',
        performedBy: 'David Ross (Paralegal)',
        timestamp: '2026-07-15 11:40',
        note: 'Financial discovery schedule received from fiduciary accountant'
      }
    ],
    aiSummary: 'Itemized bank balance and estate disbursement schedule for secondary beneficiaries.',
    aiRiskLevel: 'Low',
    aiKeyClauses: [
      'Equal split of commercial real estate rental income.',
      'Trustee fee capped at 1.25% annually.'
    ]
  }
];

export const INITIAL_TIME_ENTRIES: TimeEntry[] = [
  {
    id: 'te-1',
    caseId: 'case-101',
    caseTitle: 'AeroTech Dynamics v. Quantum Systems Inc.',
    lawyerId: 'u-3',
    lawyerName: 'Sophia Chen',
    date: '2026-08-05',
    hours: 4.5,
    rate: 420,
    amount: 1890,
    description: 'Drafted responses to opposing party interrogatories and reviewed firmware source code logs.',
    isBilled: false
  },
  {
    id: 'te-2',
    caseId: 'case-102',
    caseTitle: 'Merger Agreement: Vantage Energy & Solar Grid',
    lawyerId: 'u-1',
    lawyerName: 'Eleanor Vance, Esq.',
    date: '2026-08-04',
    hours: 3.0,
    rate: 650,
    amount: 1950,
    description: 'Negotiated indemnification escrow provisions with buyer counsel via telephone conference.',
    isBilled: true,
    invoiceId: 'inv-1001'
  },
  {
    id: 'te-3',
    caseId: 'case-103',
    caseTitle: 'Harrison Family Trust Settlement & Distribution',
    lawyerId: 'u-2',
    lawyerName: 'Marcus Sterling',
    date: '2026-08-03',
    hours: 2.2,
    rate: 580,
    amount: 1276,
    description: 'Prepared court petition for approval of family trust distribution and settlement agreement.',
    isBilled: true,
    invoiceId: 'inv-1002'
  },
  {
    id: 'te-4',
    caseId: 'case-104',
    caseTitle: 'City of Metroport v. Skyline Towers Commercial Real Estate',
    lawyerId: 'u-4',
    lawyerName: 'David Ross',
    date: '2026-08-06',
    hours: 5.0,
    rate: 195,
    amount: 975,
    description: 'Indexed municipal planning board meeting minutes and compiled zoning parcel map exhibits.',
    isBilled: false
  },
  {
    id: 'te-5',
    caseId: 'case-105',
    caseTitle: 'BioGenX Pharmaceuticals SEC Compliance & Audit',
    lawyerId: 'u-1',
    lawyerName: 'Eleanor Vance, Esq.',
    date: '2026-08-08',
    hours: 3.5,
    rate: 650,
    amount: 2275,
    description: 'Conducted audit committee review on clinical trial capitalization policies with outside CPAs.',
    isBilled: false
  },
  {
    id: 'te-6',
    caseId: 'case-101',
    caseTitle: 'AeroTech Dynamics v. Quantum Systems Inc.',
    lawyerId: 'u-3',
    lawyerName: 'Sophia Chen',
    date: '2026-08-11',
    hours: 6.0,
    rate: 420,
    amount: 2520,
    description: 'Prepared Markman hearing claim construction joint brief and disputed terms table.',
    isBilled: false
  },
  // July 2026 Entries
  {
    id: 'te-7',
    caseId: 'case-101',
    caseTitle: 'AeroTech Dynamics v. Quantum Systems Inc.',
    lawyerId: 'u-3',
    lawyerName: 'Sophia Chen',
    date: '2026-07-28',
    hours: 5.5,
    rate: 420,
    amount: 2310,
    description: 'Reviewed preliminary expert telemetry reverse-engineering report and prepared declaration.',
    isBilled: true,
    invoiceId: 'inv-0997'
  },
  {
    id: 'te-8',
    caseId: 'case-102',
    caseTitle: 'Merger Agreement: Vantage Energy & Solar Grid',
    lawyerId: 'u-1',
    lawyerName: 'Eleanor Vance, Esq.',
    date: '2026-07-22',
    hours: 7.0,
    rate: 650,
    amount: 4550,
    description: 'Antitrust Second Request document review and structured disclosure schedules.',
    isBilled: true,
    invoiceId: 'inv-0998'
  },
  {
    id: 'te-9',
    caseId: 'case-103',
    caseTitle: 'Harrison Family Trust Settlement & Distribution',
    lawyerId: 'u-2',
    lawyerName: 'Marcus Sterling',
    date: '2026-07-18',
    hours: 4.0,
    rate: 580,
    amount: 2320,
    description: 'Drafted fiduciary accounting reconciliation and beneficiary release waivers.',
    isBilled: true,
    invoiceId: 'inv-0999'
  },
  {
    id: 'te-10',
    caseId: 'case-104',
    caseTitle: 'City of Metroport v. Skyline Towers Commercial Real Estate',
    lawyerId: 'u-2',
    lawyerName: 'Marcus Sterling',
    date: '2026-07-12',
    hours: 3.5,
    rate: 580,
    amount: 2030,
    description: 'Strategy session with municipal real estate appraisal consultants regarding tax assessment.',
    isBilled: true,
    invoiceId: 'inv-0996'
  },
  // June 2026 Entries
  {
    id: 'te-11',
    caseId: 'case-102',
    caseTitle: 'Merger Agreement: Vantage Energy & Solar Grid',
    lawyerId: 'u-1',
    lawyerName: 'Eleanor Vance, Esq.',
    date: '2026-06-25',
    hours: 8.0,
    rate: 650,
    amount: 5200,
    description: 'Cross-border regulatory filings with FERC and preliminary shareholder disclosure draft.',
    isBilled: true,
    invoiceId: 'inv-0985'
  },
  {
    id: 'te-12',
    caseId: 'case-101',
    caseTitle: 'AeroTech Dynamics v. Quantum Systems Inc.',
    lawyerId: 'u-3',
    lawyerName: 'Sophia Chen',
    date: '2026-06-14',
    hours: 4.0,
    rate: 420,
    amount: 1680,
    description: 'Federal Rule 26(f) discovery planning conference and initial disclosures draft.',
    isBilled: true,
    invoiceId: 'inv-0986'
  }
];

export const INITIAL_INVOICES: Invoice[] = [
  {
    id: 'inv-1001',
    invoiceNumber: 'INV-2026-088',
    caseId: 'case-102',
    caseTitle: 'Merger Agreement: Vantage Energy & Solar Grid',
    clientName: 'Vantage Energy Corporation',
    clientEmail: 'corp@vantage-energy.org',
    issueDate: '2026-08-01',
    dueDate: '2026-08-31',
    subtotal: 24500,
    tax: 0,
    totalAmount: 24500,
    amountPaid: 24500,
    status: 'paid',
    items: [
      { description: 'M&A Contract Negotiating & FTC Filing Prep (38 hrs @ $650/hr)', hours: 38, rate: 650, amount: 24700 },
      { description: 'Courtesy Retainer Discount', hours: 1, rate: -200, amount: -200 }
    ]
  },
  {
    id: 'inv-1002',
    invoiceNumber: 'INV-2026-089',
    caseId: 'case-103',
    caseTitle: 'Harrison Family Trust Settlement & Distribution',
    clientName: 'Julian & Claire Harrison',
    clientEmail: 'harrison.trust@estate.net',
    issueDate: '2026-08-02',
    dueDate: '2026-09-01',
    subtotal: 12800,
    tax: 0,
    totalAmount: 12800,
    amountPaid: 5000,
    status: 'sent',
    items: [
      { description: 'Probate Settlement Petition & Trustee Negotiations', hours: 22.0, rate: 580, amount: 12760 },
      { description: 'Court Filing & Express Courier Disbursement', hours: 1, rate: 40, amount: 40 }
    ]
  },
  {
    id: 'inv-1003',
    invoiceNumber: 'INV-2026-090',
    caseId: 'case-101',
    caseTitle: 'AeroTech Dynamics v. Quantum Systems Inc.',
    clientName: 'AeroTech Dynamics Global',
    clientEmail: 'legal@aerotech-global.com',
    issueDate: '2026-08-06',
    dueDate: '2026-09-05',
    subtotal: 18900,
    tax: 0,
    totalAmount: 18900,
    amountPaid: 0,
    status: 'pending_approval',
    items: [
      { description: 'Patent Claim Construction Brief & Expert Interrogatories', hours: 45, rate: 420, amount: 18900 }
    ]
  },
  {
    id: 'inv-1004',
    invoiceNumber: 'INV-2026-074',
    caseId: 'case-104',
    caseTitle: 'City of Metroport v. Skyline Towers Commercial Real Estate',
    clientName: 'Skyline Properties Group LLC',
    clientEmail: 'legal@skylinedev.com',
    issueDate: '2026-07-06',
    dueDate: '2026-08-05',
    subtotal: 14200,
    tax: 0,
    totalAmount: 14200,
    amountPaid: 0,
    status: 'overdue',
    items: [
      { description: 'Municipal Zoning Valuation Assessment and Expert Witness Prep', hours: 20.0, rate: 580, amount: 11600 },
      { description: 'Commercial Property Appraisal Expert Witness Retainer', hours: 1, rate: 2600, amount: 2600 }
    ]
  },
  {
    id: 'inv-1005',
    invoiceNumber: 'INV-2026-068',
    caseId: 'case-105',
    caseTitle: 'BioGen Therapeutics SEC Regulatory Investigation',
    clientName: 'BioGen Innovations Inc.',
    clientEmail: 'legal@biogen-innovations.com',
    issueDate: '2026-06-28',
    dueDate: '2026-07-28',
    subtotal: 22800,
    tax: 0,
    totalAmount: 22800,
    amountPaid: 5000,
    status: 'overdue',
    items: [
      { description: 'SEC Wells Notice Formal Defense Brief & Audit Committee Interviews', hours: 32.0, rate: 650, amount: 20800 },
      { description: 'Forensic Accounting Subpoena Processing', hours: 1, rate: 2000, amount: 2000 }
    ],
    lastReminderSent: {
      sentAt: '2026-08-10 11:20',
      sentBy: 'Eleanor Vance, Esq.',
      tone: 'courteous_first',
      recipientEmail: 'legal@biogen-innovations.com',
      subject: 'Courtesy Reminder: Invoice INV-2026-068 for BioGen Therapeutics SEC Regulatory Investigation'
    },
    reminderHistory: [
      {
        id: 'rem-101',
        invoiceId: 'inv-1005',
        invoiceNumber: 'INV-2026-068',
        sentAt: '2026-08-10 11:20',
        sentBy: 'Eleanor Vance, Esq.',
        recipientEmail: 'legal@biogen-innovations.com',
        recipientName: 'BioGen Innovations Inc.',
        subject: 'Courtesy Reminder: Invoice INV-2026-068 for BioGen Therapeutics SEC Regulatory Investigation',
        tone: 'courteous_first',
        body: 'Courtesy check-in regarding past-due statement...',
        balanceDue: 17800,
        deliveryMethod: 'in_app_dispatch',
        noticeLevel: '1st Courtesy Notice'
      }
    ]
  },
  {
    id: 'inv-1006',
    invoiceNumber: 'INV-2026-083',
    caseId: 'case-106',
    caseTitle: 'Nexus FinTech Cross-Border Payment Licensing',
    clientName: 'Nexus FinTech Global',
    clientEmail: 'compliance@nexusfintech.io',
    issueDate: '2026-07-16',
    dueDate: '2026-08-15',
    subtotal: 9650,
    tax: 0,
    totalAmount: 9650,
    amountPaid: 0,
    status: 'overdue',
    items: [
      { description: 'FinCEN Money Transmitter License Regulatory Advisory', hours: 15.5, rate: 580, amount: 8990 },
      { description: 'State Multi-Jurisdictional Licensing Disbursement Fees', hours: 1, rate: 660, amount: 660 }
    ]
  },
  // July 2026 Invoices
  {
    id: 'inv-0997',
    invoiceNumber: 'INV-2026-077',
    caseId: 'case-101',
    caseTitle: 'AeroTech Dynamics v. Quantum Systems Inc.',
    clientName: 'AeroTech Dynamics Global',
    clientEmail: 'legal@aerotech-global.com',
    issueDate: '2026-07-31',
    dueDate: '2026-08-30',
    subtotal: 14500,
    tax: 0,
    totalAmount: 14500,
    amountPaid: 14500,
    status: 'paid',
    items: [
      { description: 'Patent Forensic Analysis & Source Code Deposition Preparation', hours: 34.5, rate: 420, amount: 14500 }
    ]
  },
  {
    id: 'inv-0998',
    invoiceNumber: 'INV-2026-078',
    caseId: 'case-102',
    caseTitle: 'Merger Agreement: Vantage Energy & Solar Grid',
    clientName: 'Vantage Energy Corporation',
    clientEmail: 'corp@vantage-energy.org',
    issueDate: '2026-07-28',
    dueDate: '2026-08-27',
    subtotal: 31200,
    tax: 0,
    totalAmount: 31200,
    amountPaid: 31200,
    status: 'paid',
    items: [
      { description: 'Antitrust Second Request & FTC Document Submissions', hours: 48.0, rate: 650, amount: 31200 }
    ]
  },
  {
    id: 'inv-0999',
    invoiceNumber: 'INV-2026-079',
    caseId: 'case-103',
    caseTitle: 'Harrison Family Trust Settlement & Distribution',
    clientName: 'Julian & Claire Harrison',
    clientEmail: 'harrison.trust@estate.net',
    issueDate: '2026-07-20',
    dueDate: '2026-08-19',
    subtotal: 8600,
    tax: 0,
    totalAmount: 8600,
    amountPaid: 8600,
    status: 'paid',
    items: [
      { description: 'Fiduciary Accounting Audit & Beneficiary Distribution Conferences', hours: 14.8, rate: 580, amount: 8600 }
    ]
  },
  {
    id: 'inv-0996',
    invoiceNumber: 'INV-2026-076',
    caseId: 'case-104',
    caseTitle: 'City of Metroport v. Skyline Towers Commercial Real Estate',
    clientName: 'Skyline Properties Group LLC',
    clientEmail: 'legal@skylinedev.com',
    issueDate: '2026-07-15',
    dueDate: '2026-08-14',
    subtotal: 9200,
    tax: 0,
    totalAmount: 9200,
    amountPaid: 9200,
    status: 'paid',
    items: [
      { description: 'Municipal Zoning Valuation Assessment and Expert Witness Prep', hours: 15.8, rate: 580, amount: 9200 }
    ]
  },
  // June 2026 Invoices
  {
    id: 'inv-0985',
    invoiceNumber: 'INV-2026-061',
    caseId: 'case-102',
    caseTitle: 'Merger Agreement: Vantage Energy & Solar Grid',
    clientName: 'Vantage Energy Corporation',
    clientEmail: 'corp@vantage-energy.org',
    issueDate: '2026-06-30',
    dueDate: '2026-07-30',
    subtotal: 29500,
    tax: 0,
    totalAmount: 29500,
    amountPaid: 29500,
    status: 'paid',
    items: [
      { description: 'Initial Hart-Scott-Rodino Premerger Notification & Regulatory Drafting', hours: 45.4, rate: 650, amount: 29500 }
    ]
  }
];

export const INITIAL_PRODUCTIVITY: ProductivityMetrics = {
  totalBillableHoursMonth: 482,
  billableHoursTarget: 520,
  totalRevenueMonth: 218500,
  revenueTarget: 240000,
  realizationRatePercent: 96.4,
  deadlineCompliancePercent: 98.2,
  activeCasesCount: 28,
  casesClosedThisQuarter: 12,
  monthlyRevenueHistory: [
    { month: 'Mar', revenue: 195000, billedHours: 420 },
    { month: 'Apr', revenue: 210000, billedHours: 460 },
    { month: 'May', revenue: 228000, billedHours: 495 },
    { month: 'Jun', revenue: 205000, billedHours: 450 },
    { month: 'Jul', revenue: 242000, billedHours: 510 },
    { month: 'Aug', revenue: 218500, billedHours: 482 }
  ],
  practiceAreaBreakdown: [
    { name: 'Corporate & M&A', count: 9, revenue: 88000 },
    { name: 'Intellectual Property', count: 7, revenue: 62000 },
    { name: 'Litigation', count: 6, revenue: 42000 },
    { name: 'Family & Estate', count: 4, revenue: 18500 },
    { name: 'Real Estate & Zoning', count: 2, revenue: 8000 }
  ],
  staffProductivity: [
    { lawyerName: 'Eleanor Vance, Esq.', role: 'Managing Partner', targetHours: 120, actualHours: 128, billedAmount: 83200, utilizationRate: 106.6 },
    { lawyerName: 'Marcus Sterling', role: 'Senior Partner', targetHours: 130, actualHours: 122, billedAmount: 70760, utilizationRate: 93.8 },
    { lawyerName: 'Sophia Chen', role: 'Senior Associate', targetHours: 150, actualHours: 142, billedAmount: 59640, utilizationRate: 94.6 },
    { lawyerName: 'David Ross', role: 'Senior Paralegal', targetHours: 160, actualHours: 154, billedAmount: 30030, utilizationRate: 96.2 }
  ]
};

export const INITIAL_THREADS: MessageThread[] = [
  {
    id: 'th-1',
    caseId: 'case-101',
    caseTitle: 'AeroTech Dynamics v. Quantum Systems Inc.',
    participantName: 'Dr. Aris Thorne (AeroTech GC)',
    participantRole: 'General Counsel',
    lastMessage: 'Let us confirm the preliminary injunction filing before Friday 5:00 PM EST.',
    lastMessageTime: '11:20 AM',
    unreadCount: 1,
    keyFingerprint: '4A:8E:91:0F:C2:5D:88:B1'
  },
  {
    id: 'th-2',
    caseId: 'case-102',
    caseTitle: 'Merger Agreement: Vantage Energy & Solar Grid',
    participantName: 'Sarah Jenkins (VP Corporate Finance)',
    participantRole: 'Client Executive',
    lastMessage: 'Approved the revised indemnity schedule. Proceed with FTC submission.',
    lastMessageTime: 'Yesterday',
    unreadCount: 0,
    keyFingerprint: '9C:12:44:B7:FE:33:10:E6'
  },
  {
    id: 'th-3',
    caseId: 'case-103',
    caseTitle: 'Harrison Family Trust Settlement & Distribution',
    participantName: 'Julian & Claire Harrison',
    participantRole: 'Trust Beneficiaries',
    lastMessage: 'We agree with the 50/50 commercial real estate split outlined in draft 4.',
    lastMessageTime: 'Aug 04',
    unreadCount: 0,
    keyFingerprint: '7F:3D:11:0A:88:EC:52:19'
  }
];

export const INITIAL_MESSAGES: EncryptedMessage[] = [
  {
    id: 'm-1',
    threadId: 'th-1',
    caseId: 'case-101',
    senderId: 'client-1',
    senderName: 'Dr. Aris Thorne',
    senderRole: 'client',
    recipientId: 'u-3',
    recipientName: 'Sophia Chen',
    encryptedContent: 'U2FsdGVkX189xK8F2a9Lk1mNpQ==',
    decryptedContent: 'Hello Sophia, we have uploaded the revised firmware reverse-engineering technical logs to the encrypted document vault. We need to evaluate whether Quantum Systems misappropriated our telemetry compression microcode under Patent US-9,884,120.',
    timestamp: '09:15 AM',
    isEncrypted: true,
    keyFingerprint: '4A:8E:91:0F:C2:5D:88:B1'
  },
  {
    id: 'm-2',
    threadId: 'th-1',
    caseId: 'case-101',
    senderId: 'u-3',
    senderName: 'Sophia Chen',
    senderRole: 'associate',
    recipientId: 'client-1',
    recipientName: 'Dr. Aris Thorne',
    encryptedContent: 'U2FsdGVkX195B8vK74MmN==',
    decryptedContent: 'Thank you, Dr. Thorne. I verified the cryptographic SHA-256 hash in the evidence vault. The telemetry compression module exhibits a 94.2% block-level similarity with our client repository tag v4.9.2.',
    timestamp: '09:42 AM',
    isEncrypted: true,
    keyFingerprint: '4A:8E:91:0F:C2:5D:88:B1'
  },
  {
    id: 'm-3',
    threadId: 'th-1',
    caseId: 'case-101',
    senderId: 'client-1',
    senderName: 'Dr. Aris Thorne',
    senderRole: 'client',
    recipientId: 'u-3',
    recipientName: 'Sophia Chen',
    encryptedContent: 'U2FsdGVkX1967aKkL091bB==',
    decryptedContent: 'That is conclusive evidence. Opposing counsel (Vance & Montgomery LLP) reached out yesterday proposing an informal mediation settlement for $14.5M. Our Board believes our statutory damages under 35 U.S.C. § 284 exceed $38M.',
    timestamp: '10:05 AM',
    isEncrypted: true,
    keyFingerprint: '4A:8E:91:0F:C2:5D:88:B1'
  },
  {
    id: 'm-4',
    threadId: 'th-1',
    caseId: 'case-101',
    senderId: 'u-3',
    senderName: 'Sophia Chen',
    senderRole: 'associate',
    recipientId: 'client-1',
    recipientName: 'Dr. Aris Thorne',
    encryptedContent: 'U2FsdGVkX1+0091LqPxXz==',
    decryptedContent: 'I strongly recommend rejecting the $14.5M lowball offer while leaving room for structured mediation after our Preliminary Injunction hearing. I am finalizing the emergency PI motion and our Rule 26(f) discovery requests today.',
    timestamp: '10:38 AM',
    isEncrypted: true,
    keyFingerprint: '4A:8E:91:0F:C2:5D:88:B1'
  },
  {
    id: 'm-5',
    threadId: 'th-1',
    caseId: 'case-101',
    senderId: 'client-1',
    senderName: 'Dr. Aris Thorne',
    senderRole: 'client',
    recipientId: 'u-3',
    recipientName: 'Sophia Chen',
    encryptedContent: 'U2FsdGVkX1948xLmQ782==',
    decryptedContent: 'Agreed. Please ensure the technical expert affidavit from Dr. Elena Rostova is attached under seal to protect trade secret parameters. Let us confirm the preliminary injunction filing before Friday 5:00 PM EST.',
    timestamp: '11:20 AM',
    isEncrypted: true,
    keyFingerprint: '4A:8E:91:0F:C2:5D:88:B1'
  },
  {
    id: 'm-6',
    threadId: 'th-2',
    caseId: 'case-102',
    senderId: 'client-2',
    senderName: 'Sarah Jenkins',
    senderRole: 'client',
    recipientId: 'u-1',
    recipientName: 'Eleanor Vance, Esq.',
    encryptedContent: 'U2FsdGVkX187bNzP112Q==',
    decryptedContent: 'Eleanor, the FTC Bureau of Competition requested supplemental disclosure regarding regional grid battery capacity market shares in Texas and California before issuing early termination approval.',
    timestamp: 'Yesterday 02:15 PM',
    isEncrypted: true,
    keyFingerprint: '9C:12:44:B7:FE:33:10:E6'
  },
  {
    id: 'm-7',
    threadId: 'th-2',
    caseId: 'case-102',
    senderId: 'u-1',
    senderName: 'Eleanor Vance, Esq.',
    senderRole: 'admin',
    recipientId: 'client-2',
    recipientName: 'Sarah Jenkins',
    encryptedContent: 'U2FsdGVkX1938bHq781==',
    decryptedContent: 'Understood Sarah. We drafted the antitrust response demonstrating that combined market share remains under the 22% HHI threshold. Also revised the breakup fee indemnification schedule to cap liability at $14.7M (3.5%).',
    timestamp: 'Yesterday 03:30 PM',
    isEncrypted: true,
    keyFingerprint: '9C:12:44:B7:FE:33:10:E6'
  },
  {
    id: 'm-8',
    threadId: 'th-2',
    caseId: 'case-102',
    senderId: 'client-2',
    senderName: 'Sarah Jenkins',
    senderRole: 'client',
    recipientId: 'u-1',
    recipientName: 'Eleanor Vance, Esq.',
    encryptedContent: 'U2FsdGVkX1+399120Bb==',
    decryptedContent: 'Approved the revised indemnity schedule. Proceed with FTC submission.',
    timestamp: 'Yesterday 04:45 PM',
    isEncrypted: true,
    keyFingerprint: '9C:12:44:B7:FE:33:10:E6'
  }
];

export const INITIAL_AUDIT_LOGS: SecurityAuditLog[] = [
  {
    id: 'log-101',
    timestamp: '2026-08-07 08:14:22',
    userId: 'u-1',
    userName: 'Eleanor Vance, Esq.',
    action: '2FA_VERIFICATION_SUCCESS',
    details: 'User authenticated via TOTP 2FA code from iOS mobile app.',
    ipAddress: '192.168.1.104',
    severity: 'info'
  },
  {
    id: 'log-102',
    timestamp: '2026-08-07 08:30:10',
    userId: 'u-3',
    userName: 'Sophia Chen',
    action: 'ENCRYPTED_DOC_ACCESS',
    details: 'Accessed confidential file Patent_Claim_Construction_Brief_v3.pdf in Case JP-2026-0891.',
    ipAddress: '192.168.1.112',
    severity: 'info'
  },
  {
    id: 'log-103',
    timestamp: '2026-08-06 17:45:00',
    userId: 'u-5',
    userName: 'Rachel Adams',
    action: 'INVOICE_GENERATED',
    details: 'Generated invoice INV-2026-090 for AeroTech Dynamics ($18,900.00).',
    ipAddress: '192.168.1.108',
    severity: 'info'
  },
  {
    id: 'log-104',
    timestamp: '2026-08-06 14:12:00',
    userId: 'u-4',
    userName: 'David Ross',
    action: 'ROLE_PERMISSION_CHECK',
    details: 'Paralegal account restricted from accessing partner billing metrics.',
    ipAddress: '192.168.1.115',
    severity: 'warning'
  }
];

export const INITIAL_DEVICE_SYNC: DeviceSyncStatus = {
  isOnline: true,
  lastSyncedAt: 'Just now (Live WebSocket)',
  pendingSyncCount: 0,
  devices: [
    { id: 'dev-1', deviceName: 'MacBook Pro 16" (Office Desk)', platform: 'Desktop (macOS)', lastActive: 'Active Now', isCurrentDevice: true },
    { id: 'dev-2', deviceName: 'iPhone 15 Pro (Court Mobile)', platform: 'Mobile (iOS)', lastActive: '2 mins ago', isCurrentDevice: false },
    { id: 'dev-3', deviceName: 'iPad Air 5th Gen (Chambers)', platform: 'Mobile (iOS)', lastActive: '1 hour ago', isCurrentDevice: false }
  ]
};

export const INITIAL_CLIENT_REQUESTS: ClientRepresentationRequest[] = [
  {
    id: 'req-101',
    clientName: 'AeroTech Dynamics Inc',
    clientEmail: 'legal@aerotech.com',
    clientPhone: '+1 (555) 392-8104',
    practiceArea: 'Intellectual Property',
    preferredLawyerId: 'u-3',
    preferredLawyerName: 'Sophia Chen',
    targetLawyerIds: ['u-3', 'u-1'],
    targetLawyerNames: ['Sophia Chen (Lead)', 'Eleanor Vance, Esq. (Co-Counsel)'],
    requestTitle: 'Patent Infringement Defense - Quantum Sensor Array',
    caseSummary:
      'Seeking counsel for IP defense against formal cease-and-desist regarding quantum lidar patent claims from competitor OptiPulse Systems. We have attached the cease and desist letter, initial patent specifications, and lab firmware architecture notes.',
    opposingParty: 'OptiPulse Systems LLC',
    incidentDate: '2026-08-01',
    urgencyLevel: 'Urgent (Within 48h)',
    estimatedBudget: 45000,
    evidenceList: [
      {
        id: 'ev-101',
        title: 'Formal Cease & Desist Letter from OptiPulse Legal Counsel',
        category: 'Official / Police Report',
        fileName: 'OptiPulse_Cease_Desist_Notice_Signed.pdf',
        fileSize: '2.4 MB',
        fileType: 'pdf',
        description: 'Demand letter alleging violation of USPTO Patent #9,482,104 Section 3b with 14-day injunction threat.',
        dateOfEvidence: '2026-08-01',
        confidential: true,
        uploadedAt: '2026-08-06 14:15'
      },
      {
        id: 'ev-102',
        title: 'Quantum Lidar Sensor Firmware Schematics & Git Commit Logs',
        category: 'Patent / IP Filing',
        fileName: 'AeroTech_Firmware_Git_Audit_2025.zip',
        fileSize: '14.8 MB',
        fileType: 'zip',
        description: 'Cryptographic commit history demonstrating prior art development in Q1 2025 before competitor priority filing.',
        dateOfEvidence: '2025-03-14',
        confidential: true,
        uploadedAt: '2026-08-06 14:18'
      },
      {
        id: 'ev-103',
        title: 'Vendor Component Purchase Invoices & Proof of Assembly',
        category: 'Financial & Bank Record',
        fileName: 'Sensor_Diode_Invoices_Q1_2025.pdf',
        fileSize: '3.1 MB',
        fileType: 'pdf',
        description: 'Commercial invoices for raw diode components establishing earliest reduction to practice.',
        dateOfEvidence: '2025-04-10',
        confidential: false,
        uploadedAt: '2026-08-06 14:19'
      }
    ],
    digitalConsent: {
      agreed: true,
      consentedAt: '2026-08-06 14:19:42',
      consentedBy: 'Jonathan Vance (General Counsel, AeroTech Dynamics)',
      signerEmail: 'legal@aerotech.com',
      signerIp: '198.51.100.42 (Encrypted Client Portal)',
      consentVersion: 'v2026.4 - ESIGN & UETA Uniform Legal Intake Disclosure',
      consentHash: 'SHA256: 4e9a8f21bc07d1248a31e8f49b6c8201a719ef10',
      acknowledgedTerms: [
        'Preliminary Attorney-Client Communication & Conflict Clearance Consent',
        'Electronic Signature & Digital Records Acceptance under ESIGN Act & UETA',
        'Confidential & Privileged Transmission of Attached Evidentiary Exhibits',
        'Acknowledgement that formal legal representation begins only upon written attorney acceptance'
      ],
      signatureType: 'electronic_consent_toggle'
    },
    conflictCheckReport: {
      id: 'conf-rep-101',
      status: 'potential_conflict',
      riskLevel: 'medium',
      overallScore: 92,
      scannedAt: '2026-08-06 14:20:05',
      scannedClientName: 'AeroTech Dynamics Global',
      scannedOpposingParty: 'OptiPulse Systems LLC',
      totalCasesScanned: 5,
      totalEntitiesScanned: 12,
      matches: [
        {
          id: 'cm-101-1',
          matchedCaseId: 'case-101',
          matchedCaseNumber: 'JP-2026-0891',
          matchedCaseTitle: 'AeroTech Dynamics v. Quantum Systems Inc.',
          matchedEntityName: 'AeroTech Dynamics Global',
          matchedEntityType: 'current_client',
          queryTerm: 'AeroTech Dynamics Global',
          querySource: 'client_name',
          similarityScore: 100,
          algorithmBreakdown: { levenshtein: 100, jaroWinkler: 100, tokenOverlap: 100, ngramDice: 100 },
          conflictRisk: 'medium',
          ethicalRule: 'ABA Model Rule 1.7(a)(2) - Concurrent Representation / Retained Client Expansion',
          description: 'Client is an existing active client of the firm with ongoing patent litigation JP-2026-0891. Verification required to ensure matter is within authorized scope.',
          casePracticeArea: 'Intellectual Property',
          assignedLawyerName: 'Sophia Chen',
          caseStatus: 'discovery'
        }
      ],
      summary: 'POTENTIAL CONFLICT IDENTIFIED (100% Match). Prospective client is already an active retained firm client in JP-2026-0891.',
      ethicalGuidance: 'Concurrent Client Expansion: No adverse collision detected. Confirm matter scope is complementary to existing engagement.',
      waiverStatus: 'not_required'
    },
    submittedAt: '2026-08-06 14:20',
    status: 'pending'
  },
  {
    id: 'req-102',
    clientName: 'BioHealth Solutions',
    clientEmail: 'contact@biohealth-sol.com',
    clientPhone: '+1 (555) 912-4021',
    practiceArea: 'Corporate',
    preferredLawyerId: 'u-1',
    preferredLawyerName: 'Eleanor Vance, Esq.',
    targetLawyerIds: ['u-1', 'u-2'],
    targetLawyerNames: ['Eleanor Vance, Esq.', 'Marcus Sterling'],
    requestTitle: 'Series B Venture Financing & SEC Regulatory Review',
    caseSummary:
      'Structuring $30M Series B equity financing round with SEC compliance, investor rights & shareholder agreements. Lead VC term sheet received and signed subject to definitive documentation.',
    opposingParty: 'NorthStar Capital Ventures (Lead Investor)',
    incidentDate: '2026-07-28',
    urgencyLevel: 'Standard',
    estimatedBudget: 60000,
    evidenceList: [
      {
        id: 'ev-201',
        title: 'Executed Series B Term Sheet ($30M Valuation Cap)',
        category: 'Contract & Agreement',
        fileName: 'BioHealth_SeriesB_TermSheet_Executed.pdf',
        fileSize: '4.2 MB',
        fileType: 'pdf',
        description: 'Signed binding term sheet with NorthStar Capital detailing liquidation preference and board governance seats.',
        dateOfEvidence: '2026-07-28',
        confidential: true,
        uploadedAt: '2026-08-05 09:40'
      },
      {
        id: 'ev-202',
        title: 'Cap Table & Fully Diluted Ownership Ledger',
        category: 'Financial & Bank Record',
        fileName: 'BioHealth_CapTable_Aug2026_Audited.xlsx',
        fileSize: '1.9 MB',
        fileType: 'xlsx',
        description: 'Audited capitalization table including founder shares, Series A preferred stock, and employee stock option pool (ESOP).',
        dateOfEvidence: '2026-08-01',
        confidential: true,
        uploadedAt: '2026-08-05 09:42'
      }
    ],
    digitalConsent: {
      agreed: false,
      notes: 'Pending client digital signature on intake disclosure agreement.'
    },
    conflictCheckReport: {
      id: 'conf-rep-102',
      status: 'clear',
      riskLevel: 'clear',
      overallScore: 18,
      scannedAt: '2026-08-05 09:45:12',
      scannedClientName: 'BioHealth Solutions',
      scannedOpposingParty: 'NorthStar Capital Ventures (Lead Investor)',
      totalCasesScanned: 5,
      totalEntitiesScanned: 12,
      matches: [],
      summary: 'CONFLICT CLEARANCE PASSED (0 Matches). Scanned 5 active case files and 12 indexed entities.',
      ethicalGuidance: 'Clear for Intake: No matching adverse parties or conflicted corporate entities found.',
      waiverStatus: 'not_required'
    },
    submittedAt: '2026-08-05 09:45',
    status: 'pending'
  },
  {
    id: 'req-103',
    clientName: 'Quantum Systems Americas Corp',
    clientEmail: 'counsel@quantum-sys-usa.com',
    clientPhone: '+1 (555) 782-9011',
    practiceArea: 'Intellectual Property',
    preferredLawyerId: 'u-3',
    preferredLawyerName: 'Sophia Chen',
    targetLawyerIds: ['u-3'],
    targetLawyerNames: ['Sophia Chen (Lead)'],
    requestTitle: 'Cross-Licensing Agreement & Counterclaim Defense',
    caseSummary:
      'Seeking legal representation to draft cross-licensing agreement and assess counterclaim exposure in federal patent litigation involving sensor array algorithms.',
    opposingParty: 'AeroTech Dynamics Global',
    incidentDate: '2026-08-10',
    urgencyLevel: 'Critical / Immediate Court Filing',
    estimatedBudget: 85000,
    evidenceList: [
      {
        id: 'ev-301',
        title: 'Draft Cross-License Counter-Proposal',
        category: 'Contract & Agreement',
        fileName: 'Quantum_Licensing_Proposal_Aug2026.pdf',
        fileSize: '3.8 MB',
        fileType: 'pdf',
        description: 'Commercial patent licensing terms and proposed royalty distribution matrix.',
        dateOfEvidence: '2026-08-10',
        confidential: true,
        uploadedAt: '2026-08-11 11:15'
      }
    ],
    digitalConsent: {
      agreed: true,
      consentedAt: '2026-08-11 11:20:00',
      consentedBy: 'Rachel Vance-Kovacs (Chief IP Officer, Quantum Systems)',
      signerRole: 'Chief IP Officer',
      signerEmail: 'counsel@quantum-sys-usa.com',
      signerIp: '203.0.113.88 (Corporate Legal VPN)',
      consentVersion: 'v2026.4 - ESIGN & UETA Uniform Legal Intake Disclosure',
      consentHash: 'SHA256: 8b1f930e42a967f01c87d21e03',
      acknowledgedTerms: [
        'Preliminary Attorney-Client Communication & Conflict Clearance Consent',
        'Electronic Signature & Digital Records Acceptance under ESIGN Act & UETA'
      ],
      signatureType: 'electronic_consent_toggle'
    },
    conflictCheckReport: {
      id: 'conf-rep-103',
      status: 'high_risk_conflict',
      riskLevel: 'critical',
      overallScore: 96,
      scannedAt: '2026-08-11 11:20:10',
      scannedClientName: 'Quantum Systems Americas Corp',
      scannedOpposingParty: 'AeroTech Dynamics Global',
      totalCasesScanned: 5,
      totalEntitiesScanned: 12,
      matches: [
        {
          id: 'cm-103-1',
          matchedCaseId: 'case-101',
          matchedCaseNumber: 'JP-2026-0891',
          matchedCaseTitle: 'AeroTech Dynamics v. Quantum Systems Inc.',
          matchedEntityName: 'Quantum Systems Inc.',
          matchedEntityType: 'opposing_party',
          queryTerm: 'Quantum Systems Americas Corp',
          querySource: 'client_name',
          similarityScore: 94,
          algorithmBreakdown: { levenshtein: 91, jaroWinkler: 96, tokenOverlap: 95, ngramDice: 93 },
          conflictRisk: 'critical',
          ethicalRule: 'ABA Model Rule 1.7(a)(1) - Direct Adversity (Client Collision with Active Adversary)',
          description: 'CRITICAL ETHICAL CONFLICT: Prospective client "Quantum Systems Americas Corp" is the named opposing party / defendant currently being sued by our firm in Matter JP-2026-0891 (AeroTech Dynamics v. Quantum Systems Inc.). Firm cannot represent defendant against our existing client.',
          casePracticeArea: 'Intellectual Property',
          assignedLawyerName: 'Sophia Chen',
          caseStatus: 'discovery'
        },
        {
          id: 'cm-103-2',
          matchedCaseId: 'case-101',
          matchedCaseNumber: 'JP-2026-0891',
          matchedCaseTitle: 'AeroTech Dynamics v. Quantum Systems Inc.',
          matchedEntityName: 'AeroTech Dynamics Global',
          matchedEntityType: 'current_client',
          queryTerm: 'AeroTech Dynamics Global',
          querySource: 'opposing_party',
          similarityScore: 100,
          algorithmBreakdown: { levenshtein: 100, jaroWinkler: 100, tokenOverlap: 100, ngramDice: 100 },
          conflictRisk: 'critical',
          ethicalRule: 'ABA Model Rule 1.7(a)(1) - Direct Adversity (Adverse Action against Retained Client)',
          description: 'CRITICAL ETHICAL CONFLICT: Prospective request names "AeroTech Dynamics Global" as an adversary, which is an active client of the firm in JP-2026-0891. Immediate Disqualification required.',
          casePracticeArea: 'Intellectual Property',
          assignedLawyerName: 'Sophia Chen',
          caseStatus: 'discovery'
        }
      ],
      summary: 'CRITICAL CONFLICT DETECTED (96% Match). Direct adversity with active litigation JP-2026-0891 (AeroTech Dynamics v. Quantum Systems Inc.).',
      ethicalGuidance: 'Immediate Disqualification Required: Do not accept representation. ABA Model Rule 1.7 strictly prohibits representing adverse interests in active ongoing litigation.',
      waiverStatus: 'pending_waiver'
    },
    submittedAt: '2026-08-11 11:20',
    status: 'pending'
  }
];

