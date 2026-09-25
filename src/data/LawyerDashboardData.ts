import {
  Appointment,
  LegalCase,
  Client,
  LawyerProfile,
  DashboardNotification,
  LegalDocument,
  Invoice,
  MessageThread
} from '../types/dashboard';

export const initialLawyerProfile: LawyerProfile = {
  name: 'Sarah Vance, Esq.',
  title: 'Lead Counsel & Senior Litigation Partner',
  barNumber: 'NY-BAR #4982103',
  email: 's.vance@vancelawpartners.com',
  phone: '+1 (212) 555-0198',
  firmName: 'Vance & Sterling LLP',
  avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256&h=256',
  specialization: ['Commercial Litigation', 'Intellectual Property', 'Corporate Arbitration', 'Mergers & Acquisitions'],
  bio: 'Specializing in complex commercial litigation, multi-jurisdictional disputes, and intellectual property defense with over 14 years of federal and state trial practice.',
  officeAddress: '30 Rockefeller Plaza, Suite 4400, New York, NY 10112',
  hourlyRate: 650,
  courtAdmissions: [
    'New York State Bar (Admitted 2012)',
    'U.S. District Court (S.D.N.Y. & E.D.N.Y.)',
    'U.S. Court of Appeals for the Second Circuit',
    'Delaware Court of Chancery (Pro Hac Vice)'
  ],
  education: [
    { degree: 'Juris Doctor (J.D.), Magna Cum Laude', school: 'Columbia Law School', honors: 'Executive Articles Editor, Columbia Law Review' },
    { degree: 'Bachelor of Arts (B.A.), Political Philosophy', school: 'Harvard University', honors: 'Phi Beta Kappa Honors' }
  ],
  chambersHours: 'Mon - Fri • 09:00 AM - 05:30 PM EST',
  consultationSlot: '45 Minutes (15 Min Buffer)',
  trialExperience: '42 Federal & State Jury Verdicts',
  arbitrationForums: 'AAA, JAMS, ICC Paris',
  peerRecognition: 'Super Lawyers Top 100 Metro (2024–2026)'
};

export const initialTodayAppointments: Appointment[] = [
  {
    id: 'apt-today-1',
    clientName: 'Arthur Pendelton',
    clientEmail: 'a.pendelton@apexglobal.com',
    clientPhone: '+1 (212) 432-8819',
    clientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    date: 'Today',
    time: '09:30 AM',
    caseType: 'Corporate M&A Due Diligence',
    caseId: '#CAS-2026-881',
    appointmentType: 'In-person Consultation',
    status: 'Confirmed',
    duration: '45 mins',
    roomOrLink: 'Conference Room 4B',
    notes: 'Review amended asset acquisition schedules and FTC regulatory disclosure waivers.'
  },
  {
    id: 'apt-today-2',
    clientName: 'Dr. Helena Rostova',
    clientEmail: 'h.rostova@bioventurelabs.org',
    clientPhone: '+1 (415) 890-4321',
    clientAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
    date: 'Today',
    time: '11:15 AM',
    caseType: 'Patent Infringement Defense',
    caseId: '#CAS-2026-904',
    appointmentType: 'Video Consultation',
    status: 'Pending',
    duration: '60 mins',
    roomOrLink: 'https://vancelaw.secure/meet/rostova-pat',
    notes: 'Review claim construction brief and prior art citations before pre-trial Markman hearing.'
  },
  {
    id: 'apt-today-3',
    clientName: 'Marcus Sterling Jr.',
    clientEmail: 'm.sterling@sterlingestate.com',
    clientPhone: '+1 (203) 771-0029',
    clientAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    date: 'Today',
    time: '02:00 PM',
    caseType: 'Estate Trust Restructuring',
    caseId: '#CAS-2026-773',
    appointmentType: 'In-person Consultation',
    status: 'Confirmed',
    duration: '30 mins',
    roomOrLink: 'Executive Suite 12',
    notes: 'Sign notarized irrevocable generation-skipping trust documents and distribution schedules.'
  },
  {
    id: 'apt-today-4',
    clientName: 'Claire Beauchamp',
    clientEmail: 'c.beauchamp@caldwelltech.io',
    clientPhone: '+1 (646) 302-9988',
    clientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    date: 'Today',
    time: '04:30 PM',
    caseType: 'Executive Employment Separation',
    caseId: '#CAS-2026-928',
    appointmentType: 'Settlement Conference',
    status: 'Pending',
    duration: '45 mins',
    roomOrLink: 'Private Counsel Room 2',
    notes: 'Evaluate non-compete enforceability in Delaware jurisdiction and non-solicitation covenants.'
  }
];

export const initialUpcomingAppointments: Appointment[] = [
  {
    id: 'apt-up-1',
    clientName: 'Gregory Finch',
    clientEmail: 'g.finch@finchlogistics.com',
    clientPhone: '+1 (312) 883-2940',
    clientAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
    date: 'Tomorrow, Sep 22',
    time: '10:00 AM',
    caseType: 'Commercial Contract Breach',
    appointmentType: 'Court Hearing Prep',
    status: 'Confirmed',
    duration: '60 mins',
    roomOrLink: 'Deposition Chamber A',
    notes: 'Witness prep for upcoming federal bench trial in Southern District of New York.'
  },
  {
    id: 'apt-up-2',
    clientName: 'Sophia Lin-Chen',
    clientEmail: 'sophia@chenventures.com',
    clientPhone: '+1 (415) 302-8812',
    clientAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=150',
    date: 'Wed, Sep 23',
    time: '01:30 PM',
    caseType: 'Cross-Border Licensing Venture',
    appointmentType: 'Video Consultation',
    status: 'Confirmed',
    duration: '45 mins',
    roomOrLink: 'https://vancelaw.secure/meet/chen-licensing',
    notes: 'Drafting international arbitration clause under ICC Paris rules.'
  },
  {
    id: 'apt-up-3',
    clientName: 'Damian Thorne',
    clientEmail: 'd.thorne@thornemedical.com',
    clientPhone: '+1 (617) 492-3001',
    clientAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=150',
    date: 'Thu, Sep 24',
    time: '11:00 AM',
    caseType: 'Regulatory Compliance Audit',
    appointmentType: 'Deposition Review',
    status: 'Pending',
    duration: '90 mins',
    roomOrLink: 'Conference Room 4B',
    notes: 'Review FDA clinical trial records and expert witness disclosures.'
  },
  {
    id: 'apt-up-4',
    clientName: 'Evelyn Montgomery',
    clientEmail: 'evelyn@montgomeryfamily.org',
    clientPhone: '+1 (202) 555-0144',
    clientAvatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=150',
    date: 'Fri, Sep 25',
    time: '03:15 PM',
    caseType: 'Commercial Real Estate Title',
    appointmentType: 'In-person Consultation',
    status: 'Confirmed',
    duration: '45 mins',
    roomOrLink: 'Executive Suite 12',
    notes: 'Review closing affidavits and escrow holdback covenants for Manhattan tower.'
  }
];

export const initialRecentCases: LegalCase[] = [
  {
    id: '#CAS-2026-881',
    title: 'Apex Global vs. Sentinel Horizon Ltd.',
    clientName: 'Arthur Pendelton',
    caseType: 'Corporate M&A Litigation',
    caseStatus: 'Active',
    lastUpdated: '2 hours ago',
    courtJurisdiction: 'U.S. District Court, S.D.N.Y.',
    leadCounsel: 'Sarah Vance, Esq.',
    hearingDate: 'Oct 14, 2026'
  },
  {
    id: '#CAS-2026-904',
    title: 'BioVenture Labs vs. NexaGen Pharma',
    clientName: 'Dr. Helena Rostova',
    caseType: 'Patent Infringement',
    caseStatus: 'Discovery',
    lastUpdated: 'Yesterday',
    courtJurisdiction: 'Federal Circuit / D. Del.',
    leadCounsel: 'Sarah Vance, Esq.',
    hearingDate: 'Nov 02, 2026'
  },
  {
    id: '#CAS-2026-773',
    title: 'In re Sterling Heritage Dynasty Trust',
    clientName: 'Marcus Sterling Jr.',
    caseType: 'Trust & Estate Probate',
    caseStatus: 'In Review',
    lastUpdated: 'Sep 19, 2026',
    courtJurisdiction: 'New York Surrogate Court',
    leadCounsel: 'Sarah Vance, Esq.',
    hearingDate: 'Oct 28, 2026'
  },
  {
    id: '#CAS-2026-928',
    title: 'Beauchamp vs. Caldwell Tech Holdings',
    clientName: 'Claire Beauchamp',
    caseType: 'Employment Restrictive Covenant',
    caseStatus: 'Pre-Trial',
    lastUpdated: 'Sep 18, 2026',
    courtJurisdiction: 'Delaware Court of Chancery',
    leadCounsel: 'Sarah Vance, Esq.',
    hearingDate: 'Nov 17, 2026'
  },
  {
    id: '#CAS-2026-654',
    title: 'Finch Logistics Fleet Modernization Arbitration',
    clientName: 'Gregory Finch',
    caseType: 'Commercial Contract Arbitration',
    caseStatus: 'Active',
    lastUpdated: 'Sep 16, 2026',
    courtJurisdiction: 'American Arbitration Association',
    leadCounsel: 'Sarah Vance, Esq.',
    hearingDate: 'Oct 20, 2026'
  }
];

export const initialClients: Client[] = [
  {
    id: 'cli-1',
    name: 'Arthur Pendelton',
    email: 'a.pendelton@apexglobal.com',
    phone: '+1 (212) 432-8819',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    company: 'Apex Global Industries',
    caseType: 'Corporate M&A Litigation',
    status: 'Active',
    totalMatters: 3,
    joinedDate: 'Jan 2024',
    address: 'One Financial Center, 38th Floor, New York, NY 10005',
    retainerBalance: 45000,
    billingRate: 650,
    contactPerson: 'Arthur Pendelton (Chief Legal Officer)',
    leadCounsel: 'Sarah Vance, Esq.',
    conflictStatus: 'Cleared',
    notes: 'Primary corporate client. Retainer replenished quarterly; active in Delaware Chancery Court and SDNY cross-border asset dispute.',
    emergencyContact: 'Eleanor Vance (General Counsel Desk) - +1 (212) 432-8800',
    taxOrEntityId: 'EIN #13-9847291',
    preferredChannel: 'Secure Portal'
  },
  {
    id: 'cli-2',
    name: 'Dr. Helena Rostova',
    email: 'h.rostova@bioventurelabs.org',
    phone: '+1 (415) 890-4321',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
    company: 'BioVenture Therapeutics Inc.',
    caseType: 'Patent Infringement',
    status: 'Active',
    totalMatters: 2,
    joinedDate: 'Mar 2025',
    address: '400 Mission Bay Blvd South, San Francisco, CA 94158',
    retainerBalance: 32000,
    billingRate: 720,
    contactPerson: 'Dr. Helena Rostova (VP Research & IP)',
    leadCounsel: 'Elena Rostova, Esq.',
    conflictStatus: 'Cleared',
    notes: 'Federal Circuit patent validity challenge regarding CRISPR delivery mechanism. Regular bi-weekly deposition prep.',
    emergencyContact: 'Dr. Sergei Rostova - +1 (415) 890-4399',
    taxOrEntityId: 'EIN #94-3329104',
    preferredChannel: 'Email'
  },
  {
    id: 'cli-3',
    name: 'Marcus Sterling Jr.',
    email: 'm.sterling@sterlingestate.com',
    phone: '+1 (203) 771-0029',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    company: 'Sterling Family Holdings',
    caseType: 'Trust & Estate Probate',
    status: 'Active',
    totalMatters: 1,
    joinedDate: 'Jul 2023',
    address: '25 Round Hill Road, Greenwich, CT 06831',
    retainerBalance: 20000,
    billingRate: 650,
    contactPerson: 'Marcus Sterling Jr. (Trustee)',
    leadCounsel: 'Sarah Vance, Esq.',
    conflictStatus: 'Cleared',
    notes: 'Surrogate Court probate proceedings and dynasty trust restructuring. Confidential family asset allocation.',
    emergencyContact: 'Victoria Sterling - +1 (203) 771-0030',
    taxOrEntityId: 'TIN #06-5829103',
    preferredChannel: 'Encrypted Signal'
  },
  {
    id: 'cli-4',
    name: 'Claire Beauchamp',
    email: 'c.beauchamp@caldwelltech.io',
    phone: '+1 (646) 302-9988',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    company: 'Caldwell Tech Alumni',
    caseType: 'Employment Dispute',
    status: 'Prospective',
    totalMatters: 1,
    joinedDate: 'Sep 2026',
    address: '142 Mercer Street, Soho, New York, NY 10012',
    retainerBalance: 5000,
    billingRate: 550,
    contactPerson: 'Claire Beauchamp',
    leadCounsel: 'Marcus Sterling, Esq.',
    conflictStatus: 'Pending Review',
    notes: 'Non-compete covenant and equity vest disputes post-exit. Conflict clearance check underway against former employer.',
    emergencyContact: 'Julian Beauchamp - +1 (646) 302-9900',
    taxOrEntityId: 'SSN (Masked): ***-**-4491',
    preferredChannel: 'Email'
  },
  {
    id: 'cli-5',
    name: 'Gregory Finch',
    email: 'g.finch@finchlogistics.com',
    phone: '+1 (312) 883-2940',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150',
    company: 'Finch Freight Lines',
    caseType: 'Contract Breach',
    status: 'Active',
    totalMatters: 4,
    joinedDate: 'Nov 2022',
    address: '750 South Michigan Ave, Suite 1200, Chicago, IL 60605',
    retainerBalance: 18500,
    billingRate: 600,
    contactPerson: 'Gregory Finch (President)',
    leadCounsel: 'David Kim, Esq.',
    conflictStatus: 'Cleared',
    notes: 'Arbitration hearing prep with AAA regarding supply chain vessel lease defaults. Witness depositions scheduled.',
    emergencyContact: 'Margaret Finch - +1 (312) 883-2955',
    taxOrEntityId: 'EIN #36-2918402',
    preferredChannel: 'Phone'
  }
];

export const initialNotifications: DashboardNotification[] = [
  {
    id: 'notif-1',
    title: 'New Consultation Requested',
    message: 'Dr. Helena Rostova requested a video consultation for today at 11:15 AM regarding Patent Defense.',
    timeAgo: '15 mins ago',
    read: false,
    type: 'appointment'
  },
  {
    id: 'notif-2',
    title: 'Motion Hearing Scheduled',
    message: 'Southern District of NY docket updated for Apex Global vs. Sentinel (#CAS-2026-881).',
    timeAgo: '1 hour ago',
    read: false,
    type: 'case'
  },
  {
    id: 'notif-3',
    title: 'Retainer Deposit Received',
    message: '$15,000 escrow retainer credited from Sterling Family Holdings for Q4 trust counsel.',
    timeAgo: '3 hours ago',
    read: true,
    type: 'payment'
  },
  {
    id: 'notif-4',
    title: 'Document Filed by Clerk',
    message: 'Signed discovery waiver entered in Beauchamp vs Caldwell Delaware Chancery docket.',
    timeAgo: 'Yesterday',
    read: true,
    type: 'system'
  }
];

export const initialDocuments: LegalDocument[] = [
  {
    id: 'doc-1',
    title: 'Amended Asset Purchase Agreement & Schedules v4.pdf',
    caseId: '#CAS-2026-881',
    clientName: 'Arthur Pendelton',
    fileSize: '4.8 MB',
    uploadDate: 'Sep 21, 2026',
    category: 'Retainer Agreement'
  },
  {
    id: 'doc-2',
    title: 'Preliminary Claim Construction Brief (Markman Hearing).docx',
    caseId: '#CAS-2026-904',
    clientName: 'Dr. Helena Rostova',
    fileSize: '2.1 MB',
    uploadDate: 'Sep 20, 2026',
    category: 'Brief'
  },
  {
    id: 'doc-3',
    title: 'Certified Irrevocable Family Trust Restructuring Instrument.pdf',
    caseId: '#CAS-2026-773',
    clientName: 'Marcus Sterling Jr.',
    fileSize: '1.4 MB',
    uploadDate: 'Sep 19, 2026',
    category: 'Evidence'
  },
  {
    id: 'doc-4',
    title: 'Chancery Court Scheduling Order & Discovery Deadlines.pdf',
    caseId: '#CAS-2026-928',
    clientName: 'Claire Beauchamp',
    fileSize: '820 KB',
    uploadDate: 'Sep 18, 2026',
    category: 'Court Order'
  },
  {
    id: 'doc-5',
    title: 'Arbitration Demand & Statement of Claims (AAA Rules).pdf',
    caseId: '#CAS-2026-654',
    clientName: 'Gregory Finch',
    fileSize: '3.6 MB',
    uploadDate: 'Sep 16, 2026',
    category: 'Pleadings'
  },
  {
    id: 'doc-6',
    title: 'Expert Witness Technical Deposition Transcript - Ex. C.pdf',
    caseId: '#CAS-2026-904',
    clientName: 'Dr. Helena Rostova',
    fileSize: '6.2 MB',
    uploadDate: 'Sep 15, 2026',
    category: 'Evidence'
  }
];

export const initialInvoices: Invoice[] = [
  {
    id: 'INV-2026-889',
    clientName: 'Arthur Pendelton',
    caseId: '#CAS-2026-881',
    amount: 18500,
    issueDate: 'Sep 01, 2026',
    dueDate: 'Sep 30, 2026',
    status: 'Paid',
    type: 'Hourly Billing',
    paymentMethod: 'Fedwire Transfer #8829'
  },
  {
    id: 'INV-2026-904',
    clientName: 'Dr. Helena Rostova',
    caseId: '#CAS-2026-904',
    amount: 24000,
    issueDate: 'Sep 10, 2026',
    dueDate: 'Oct 10, 2026',
    status: 'Pending',
    type: 'Retainer Escrow',
    paymentMethod: 'IOLTA Trust Account'
  },
  {
    id: 'INV-2026-912',
    clientName: 'Marcus Sterling Jr.',
    caseId: '#CAS-2026-773',
    amount: 15000,
    issueDate: 'Sep 15, 2026',
    dueDate: 'Oct 15, 2026',
    status: 'Paid',
    type: 'Retainer Escrow',
    paymentMethod: 'Bank Wire #4491'
  },
  {
    id: 'INV-2026-928',
    clientName: 'Claire Beauchamp',
    caseId: '#CAS-2026-928',
    amount: 6800,
    issueDate: 'Sep 05, 2026',
    dueDate: 'Sep 20, 2026',
    status: 'Overdue',
    type: 'Court Filing Fee',
    paymentMethod: 'Credit Card (Stripe Lex)'
  },
  {
    id: 'INV-2026-935',
    clientName: 'Gregory Finch',
    caseId: '#CAS-2026-654',
    amount: 12400,
    issueDate: 'Sep 18, 2026',
    dueDate: 'Oct 18, 2026',
    status: 'Pending',
    type: 'Deposition Service',
    paymentMethod: 'ACH Direct Debit'
  }
];

export const initialMessageThreads: MessageThread[] = [
  {
    id: 'thread-1',
    clientId: 'cli-2',
    clientName: 'Dr. Helena Rostova',
    clientAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
    company: 'BioVenture Therapeutics Inc.',
    caseId: '#CAS-2026-904',
    caseType: 'Patent Infringement Defense',
    lastMessage: 'Good morning Sarah, I have uploaded the Markman claim charts for our video call at 11:15 AM.',
    lastTimestamp: '10:14 AM',
    unreadCount: 1,
    messages: [
      {
        id: 'm-1',
        sender: 'lawyer',
        text: 'Hello Dr. Rostova, please verify if the prior art citations from the European patent office were included in Exhibit D.',
        timestamp: 'Yesterday 04:30 PM',
        read: true
      },
      {
        id: 'm-2',
        sender: 'client',
        text: 'Good morning Sarah, I have uploaded the Markman claim charts and verified the EPO citations for our video call at 11:15 AM.',
        timestamp: 'Today 10:14 AM',
        read: false
      }
    ]
  },
  {
    id: 'thread-2',
    clientId: 'cli-1',
    clientName: 'Arthur Pendelton',
    clientAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150',
    company: 'Apex Global Industries',
    caseId: '#CAS-2026-881',
    caseType: 'Corporate M&A Litigation',
    lastMessage: 'Looking forward to our in-person 9:30 AM review in Conference Room 4B.',
    lastTimestamp: '08:45 AM',
    unreadCount: 0,
    messages: [
      {
        id: 'm-3',
        sender: 'lawyer',
        text: 'Arthur, the disclosure schedule amendments have been printed and staged in Conference Room 4B.',
        timestamp: 'Yesterday 06:10 PM',
        read: true
      },
      {
        id: 'm-4',
        sender: 'client',
        text: 'Looking forward to our in-person 9:30 AM review in Conference Room 4B.',
        timestamp: 'Today 08:45 AM',
        read: true
      }
    ]
  },
  {
    id: 'thread-3',
    clientId: 'cli-4',
    clientName: 'Claire Beauchamp',
    clientAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    company: 'Caldwell Tech Alumni',
    caseId: '#CAS-2026-928',
    caseType: 'Employment Dispute',
    lastMessage: 'Could we confirm if the settlement conference today covers the Delaware restrictive covenant?',
    lastTimestamp: 'Yesterday',
    unreadCount: 1,
    messages: [
      {
        id: 'm-5',
        sender: 'client',
        text: 'Could we confirm if the settlement conference today covers the Delaware restrictive covenant?',
        timestamp: 'Yesterday 05:22 PM',
        read: false
      }
    ]
  },
  {
    id: 'thread-4',
    clientId: 'cli-3',
    clientName: 'Marcus Sterling Jr.',
    clientAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    company: 'Sterling Family Holdings',
    caseId: '#CAS-2026-773',
    caseType: 'Trust & Estate Probate',
    lastMessage: 'The escrow deposit of $15,000 has been initiated from our primary account.',
    lastTimestamp: 'Sep 19',
    unreadCount: 0,
    messages: [
      {
        id: 'm-6',
        sender: 'client',
        text: 'The escrow deposit of $15,000 has been initiated from our primary account.',
        timestamp: 'Sep 19 02:15 PM',
        read: true
      },
      {
        id: 'm-7',
        sender: 'lawyer',
        text: 'Received and credited to the trust ledger, Marcus. We will execute the notarized instruments today at 2:00 PM.',
        timestamp: 'Sep 19 03:00 PM',
        read: true
      }
    ]
  }
];
