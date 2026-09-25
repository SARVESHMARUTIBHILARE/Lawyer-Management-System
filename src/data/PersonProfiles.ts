import { PersonProfile, LawyerProfile, Client } from '../types/dashboard';
import { initialLawyerProfile, initialClients } from './lawyerDashboardData';
import { safeLocalStorageSetItem } from '../utils/imageOptimizer';

export const defaultPersonsList: PersonProfile[] = [
  // 1. Bhilare Sarvesh (Developer / Project Developer)
  {
    id: 'usr-sarvesh-bhilare',
    name: 'Bhilare Sarvesh',
    email: 'sarvesh.bhilare@student.institute.edu',
    phone: '+91 98201 44102',
    avatarUrl:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300&h=300',
    role: 'Developer / Project Developer (Roll: 240860131012)',
    personType: 'lawyer',
    firmName: 'JurisPulse Engineering Chambers LLP',
    barNumber: 'STUDENT-ID #240860131012',
    specialization: [
      'Project Software Architecture',
      'Full-Stack System Engineering',
      'State Management & Persistence',
      'AI Legal Intelligence'
    ],
    bio: 'Developer of this project and responsible for the development and implementation of the system.',
    officeAddress: 'Chambers Engineering Lab, Tech Campus, Mumbai',
    hourlyRate: 850,
    chambersHours: 'Mon - Fri • 08:30 AM - 07:00 PM',
    consultationSlot: '45 Minutes',
    trialExperience: 'Lead Architect: JurisPulse Platform',
    peerRecognition: 'Project Lead Developer',
    joinedDate: 'Project Inception'
  },

  // 2. Ritesh Bitode (Team Member) - matches user's active session email
  {
    id: 'usr-ritesh-bitode',
    name: 'Ritesh Bitode',
    email: 'riteshbitode06@gmail.com',
    phone: '+91 98332 55913',
    avatarUrl:
      'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300&h=300',
    role: 'Team Member (Roll: 240860131013)',
    personType: 'lawyer',
    firmName: 'JurisPulse Engineering Chambers LLP',
    barNumber: 'STUDENT-ID #240860131013',
    specialization: [
      'UI/UX Engineering & Design Systems',
      'Photo Upload & Image Persistence',
      'Client Relationship Management',
      'Responsive Web Architecture'
    ],
    bio: 'Full-stack developer and UI/UX specialist responsible for responsive component architecture, interactive dashboards, and client CRM workflows.',
    officeAddress: 'Design & Engineering Lab, Tech Campus',
    hourlyRate: 750,
    chambersHours: 'Mon - Fri • 09:00 AM - 06:00 PM',
    consultationSlot: '45 Minutes',
    trialExperience: 'UI/UX Developer: JurisPulse Platform',
    peerRecognition: 'Core Project Contributor',
    joinedDate: 'Project Inception'
  },

  // 3. Taufeek Khan (Team Member)
  {
    id: 'usr-taufeek-khan',
    name: 'Taufeek Khan',
    email: 'taufeek.khan@student.institute.edu',
    phone: '+91 97680 11058',
    avatarUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=300',
    role: 'Team Member (Roll: 240860131058)',
    personType: 'lawyer',
    firmName: 'JurisPulse Engineering Chambers LLP',
    barNumber: 'STUDENT-ID #240860131058',
    specialization: [
      'Database Modeling & Schemas',
      'Litigation Case Records',
      'Evidence Chain-of-Custody',
      'Encrypted Messaging Protocols'
    ],
    bio: 'Backend developer and database engineer responsible for litigation case schemas, evidence vault pipelines, and encrypted messaging protocols.',
    officeAddress: 'Data Engineering Wing, Tech Campus',
    hourlyRate: 720,
    chambersHours: 'Mon - Fri • 09:30 AM - 06:30 PM',
    consultationSlot: '45 Minutes',
    trialExperience: 'Database & Backend: JurisPulse Platform',
    peerRecognition: 'Core Project Contributor',
    joinedDate: 'Project Inception'
  },

  // 4. PASWAN ABHISHEK (Team Member)
  {
    id: 'usr-paswan-abhishek',
    name: 'PASWAN ABHISHEK',
    email: 'abhishek.paswan@student.institute.edu',
    phone: '+91 91520 88004',
    avatarUrl:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300&h=300',
    role: 'Team Member (Roll: 250860131004)',
    personType: 'lawyer',
    firmName: 'JurisPulse Engineering Chambers LLP',
    barNumber: 'STUDENT-ID #250860131004',
    specialization: [
      'Frontend Testing & Quality Assurance',
      'Form Validation & Input Sanitization',
      'Web Accessibility (WCAG AA)',
      'Cross-Device Compatibility'
    ],
    bio: 'Frontend developer and quality assurance engineer responsible for cross-browser responsive layouts, form validation, and testing.',
    officeAddress: 'Quality & Testing Lab, Tech Campus',
    hourlyRate: 700,
    chambersHours: 'Mon - Fri • 09:00 AM - 05:30 PM',
    consultationSlot: '45 Minutes',
    trialExperience: 'QA & Testing Lead: JurisPulse Platform',
    peerRecognition: 'Core Project Contributor',
    joinedDate: 'Project Inception'
  },

  // 2. Sarah Vance, Esq.
  {
    id: 'usr-sarah-vance',
    name: initialLawyerProfile.name,
    email: initialLawyerProfile.email,
    phone: initialLawyerProfile.phone,
    avatarUrl: initialLawyerProfile.avatarUrl,
    role: initialLawyerProfile.title,
    personType: 'lawyer',
    firmName: initialLawyerProfile.firmName,
    barNumber: initialLawyerProfile.barNumber,
    specialization: initialLawyerProfile.specialization,
    bio: initialLawyerProfile.bio,
    officeAddress: initialLawyerProfile.officeAddress,
    hourlyRate: initialLawyerProfile.hourlyRate,
    courtAdmissions: initialLawyerProfile.courtAdmissions,
    education: initialLawyerProfile.education,
    chambersHours: initialLawyerProfile.chambersHours,
    consultationSlot: initialLawyerProfile.consultationSlot,
    trialExperience: initialLawyerProfile.trialExperience,
    arbitrationForums: initialLawyerProfile.arbitrationForums,
    peerRecognition: initialLawyerProfile.peerRecognition,
    joinedDate: 'Oct 2021'
  },

  // 3. Marcus Sterling, Esq.
  {
    id: 'usr-marcus-sterling',
    name: 'Marcus Sterling, Esq.',
    email: 'm.sterling@jurispulselegal.com',
    phone: '+1 (212) 555-0182',
    avatarUrl:
      'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256&h=256',
    role: 'Senior Partner, Complex Trial Practice',
    personType: 'lawyer',
    firmName: 'JurisPulse Legal Partners LLP',
    barNumber: 'NY-BAR #3819024',
    specialization: [
      'Federal Trial Litigation',
      'Antitrust & Cartel Defense',
      'Class Actions',
      'Securities Enforcement'
    ],
    bio: 'Veteran trial attorney with over 22 years of courtroom experience in federal civil and criminal trials across the Southern District of New York.',
    officeAddress: 'Suite 4400, 350 5th Avenue, New York, NY 10118',
    hourlyRate: 850,
    courtAdmissions: [
      'New York State Bar (Admitted 2004)',
      'U.S. District Court (S.D.N.Y. & E.D.N.Y.)',
      'Second Circuit Court of Appeals'
    ],
    chambersHours: 'Mon - Fri • 09:00 AM - 05:00 PM EST',
    consultationSlot: '60 Minutes',
    trialExperience: '65 Federal Jury Trials',
    arbitrationForums: 'AAA Commercial, JAMS New York',
    peerRecognition: 'Best Lawyers in America - Bet-the-Company Litigation',
    joinedDate: 'Mar 2020'
  },

  // 4. Elena Rostova, Esq.
  {
    id: 'usr-elena-rostova',
    name: 'Elena Rostova, Esq.',
    email: 'e.rostova@jurispulselegal.com',
    phone: '+1 (415) 555-0194',
    avatarUrl:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=256&h=256',
    role: 'Partner, Intellectual Property & Patent Law',
    personType: 'lawyer',
    firmName: 'JurisPulse Legal Partners LLP',
    barNumber: 'CA-BAR #4928104',
    specialization: ['Patent Prosecution', 'Trade Secrets Litigation', 'AI Licensing'],
    bio: 'Lead IP counsel advising tier-1 tech founders and biotech enterprises on patents, trademarks, and federal copyright defense.',
    officeAddress: 'Floor 18, 555 California St, San Francisco, CA 94104',
    hourlyRate: 720,
    courtAdmissions: [
      'California State Bar',
      'USPTO Registered Patent Attorney',
      'N.D. Cal. & Federal Circuit'
    ],
    chambersHours: 'Mon - Thu • 09:00 AM - 05:00 PM PST',
    consultationSlot: '45 Minutes',
    trialExperience: '28 Patent Infringement Bench Verdicts',
    peerRecognition: 'Chambers USA Band 1 - Intellectual Property',
    joinedDate: 'Aug 2022'
  },

  // 5. David Kim, Esq.
  {
    id: 'usr-david-kim',
    name: 'David Kim, Esq.',
    email: 'd.kim@jurispulselegal.com',
    phone: '+1 (312) 555-0145',
    avatarUrl:
      'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=256&h=256',
    role: 'Managing Partner, Corporate M&A & Securities',
    personType: 'lawyer',
    firmName: 'JurisPulse Legal Partners LLP',
    barNumber: 'IL-BAR #7104928',
    specialization: ['Cross-Border Mergers', 'SEC Compliance', 'Venture Financings'],
    bio: 'Cross-border transactional specialist orchestrating over $4.2B in acquisitions and regulatory approvals.',
    officeAddress: 'Wacker Drive, Suite 2900, Chicago, IL 60606',
    hourlyRate: 790,
    courtAdmissions: ['Illinois Bar', 'Delaware Court of Chancery', 'Seventh Circuit'],
    chambersHours: 'Mon - Fri • 08:30 AM - 05:30 PM CST',
    consultationSlot: '45 Minutes',
    trialExperience: '14 M&A Appraisal Hearings',
    peerRecognition: 'Legal 500 Leading M&A Counsel',
    joinedDate: 'Nov 2021'
  },

  // 6. Client: Arthur Pendelton
  {
    id: 'cli-1',
    name: 'Arthur Pendelton',
    email: 'a.pendelton@apexglobal.com',
    phone: '+1 (212) 432-8819',
    avatarUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256&h=256',
    role: 'Corporate Client (CLO)',
    personType: 'client',
    company: 'Apex Global Industries',
    caseType: 'Corporate M&A Litigation',
    status: 'Active',
    totalMatters: 3,
    retainerBalance: 45000,
    billingRate: 650,
    contactPerson: 'Arthur Pendelton (Chief Legal Officer)',
    leadCounsel: 'Sarah Vance, Esq.',
    conflictStatus: 'Cleared',
    notes: 'Primary corporate client. Retainer replenished quarterly.',
    emergencyContact: 'Eleanor Vance (Desk) - +1 (212) 432-8800',
    taxOrEntityId: 'EIN #13-9847291',
    preferredChannel: 'Secure Portal',
    joinedDate: 'Jan 2024'
  },

  // 7. Client: Dr. Helena Rostova
  {
    id: 'cli-2',
    name: 'Dr. Helena Rostova',
    email: 'h.rostova@bioventurelabs.org',
    phone: '+1 (415) 890-4321',
    avatarUrl:
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256&h=256',
    role: 'Corporate Client (VP IP)',
    personType: 'client',
    company: 'BioVenture Therapeutics Inc.',
    caseType: 'Patent Infringement',
    status: 'Active',
    totalMatters: 2,
    retainerBalance: 32000,
    billingRate: 720,
    contactPerson: 'Dr. Helena Rostova (VP Research)',
    leadCounsel: 'Elena Rostova, Esq.',
    conflictStatus: 'Cleared',
    notes: 'Federal Circuit patent validity challenge regarding CRISPR delivery mechanism.',
    emergencyContact: 'Dr. Sergei Rostova - +1 (415) 890-4399',
    taxOrEntityId: 'EIN #94-3329104',
    preferredChannel: 'Email',
    joinedDate: 'Mar 2025'
  },

  // 8. Client: Marcus Sterling Jr.
  {
    id: 'cli-3',
    name: 'Marcus Sterling Jr.',
    email: 'm.sterling@sterlingestate.com',
    phone: '+1 (203) 771-0029',
    avatarUrl:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256&h=256',
    role: 'Private Client (Trustee)',
    personType: 'client',
    company: 'Sterling Family Holdings',
    caseType: 'Trust & Estate Probate',
    status: 'Active',
    totalMatters: 1,
    retainerBalance: 18500,
    billingRate: 650,
    contactPerson: 'Marcus Sterling Jr. (Trustee)',
    leadCounsel: 'Sarah Vance, Esq.',
    conflictStatus: 'Cleared',
    notes: 'Multigenerational irrevocable asset protection trust in New York Surrogate Court.',
    emergencyContact: 'Juliana Sterling - +1 (203) 771-0030',
    taxOrEntityId: 'SSN/TIN Encrypted',
    preferredChannel: 'Phone',
    joinedDate: 'Jun 2024'
  }
];

const STORAGE_KEY_REGISTRY = 'jurispulse_persons_registry';

/**
 * Loads all person profiles from persistent storage or returns defaults
 */
export function getAllPersonProfiles(): PersonProfile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_REGISTRY);
    if (raw) {
      let parsed: PersonProfile[] = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // Filter out BINDESHWARI
        parsed = parsed.filter(
          (p) =>
            p.id !== 'usr-bindeshwari' &&
            p.id !== 'dev-bindeshwari' &&
            !p.name.toUpperCase().includes('BINDESHWARI')
        );

        // Ensure all remaining team members exist in registry
        const teamMemberProfiles = defaultPersonsList.filter((p) => p.id.startsWith('usr-'));
        for (const tm of teamMemberProfiles) {
          const exists = parsed.some(
            (p) => p.id === tm.id || p.name.toLowerCase() === tm.name.toLowerCase()
          );
          if (!exists) {
            parsed.push(tm);
          }
        }
        safeLocalStorageSetItem(STORAGE_KEY_REGISTRY, JSON.stringify(parsed));
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to read person profiles from storage:', err);
  }
  return defaultPersonsList;
}

/**
 * Finds a person's exact isolated profile by ID or email
 */
export function getPersonProfileById(idOrEmail: string): PersonProfile | null {
  const all = getAllPersonProfiles();
  const needle = idOrEmail.trim().toLowerCase();
  return (
    all.find(
      (p) => p.id.toLowerCase() === needle || p.email.toLowerCase() === needle
    ) || null
  );
}

/**
 * Saves or updates a specific person's profile in their own isolated storage
 */
export function saveIndividualPersonProfile(profile: PersonProfile): void {
  try {
    // 1. Save directly under person's unique profile key
    safeLocalStorageSetItem(`jurispulse_person_${profile.id}`, JSON.stringify(profile));

    // 2. Update person in the main persons registry
    const all = getAllPersonProfiles();
    const updatedAll = [
      profile,
      ...all.filter((p) => p.id !== profile.id && p.email.toLowerCase() !== profile.email.toLowerCase())
    ];
    safeLocalStorageSetItem(STORAGE_KEY_REGISTRY, JSON.stringify(updatedAll));

    // 3. If lawyer, sync with lawyers roster
    if (profile.personType === 'lawyer') {
      const lawyerObj = convertPersonToLawyerProfile(profile);
      const rawLawyers = localStorage.getItem('jurispulse_lawyers_roster');
      const lawyersList: LawyerProfile[] = rawLawyers ? JSON.parse(rawLawyers) : [];
      const updatedLawyers = [
        lawyerObj,
        ...lawyersList.filter((l) => l.email.toLowerCase() !== profile.email.toLowerCase())
      ];
      safeLocalStorageSetItem('jurispulse_lawyers_roster', JSON.stringify(updatedLawyers));
    }

    // 4. If client, sync with clients roster
    if (profile.personType === 'client') {
      const clientObj = convertPersonToClient(profile);
      const rawClients = localStorage.getItem('jurispulse_clients_roster');
      const clientsList: Client[] = rawClients ? JSON.parse(rawClients) : [];
      const updatedClients = [
        clientObj,
        ...clientsList.filter((c) => c.id !== profile.id && c.email.toLowerCase() !== profile.email.toLowerCase())
      ];
      safeLocalStorageSetItem('jurispulse_clients_roster', JSON.stringify(updatedClients));
    }
  } catch (err) {
    console.error('Error saving person profile:', err);
  }
}

/**
 * Creates or retrieves a dedicated profile for any person by email.
 * Guarantees that ANY person gets their OWN profile, never another person's!
 */
export function createOrGetPersonForEmail(
  email: string,
  enteredName?: string,
  personType: 'lawyer' | 'client' = 'lawyer'
): PersonProfile {
  const cleanEmail = email.trim().toLowerCase();
  const existing = getPersonProfileById(cleanEmail);
  if (existing) {
    // If name was provided and changed, update only their name
    if (enteredName && enteredName.trim() && enteredName.trim() !== existing.name) {
      const updated = { ...existing, name: enteredName.trim() };
      saveIndividualPersonProfile(updated);
      return updated;
    }
    return existing;
  }

  // Derive a pleasant name from email if not provided (e.g. riteshbitode06@gmail.com -> Ritesh Bitode)
  const derivedName =
    enteredName?.trim() ||
    cleanEmail
      .split('@')[0]
      .replace(/[._\d]+/g, ' ')
      .trim()
      .split(' ')
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(' ') ||
    'Legal Member';

  const newId = `usr-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;

  const newProfile: PersonProfile = {
    id: newId,
    name: derivedName,
    email: cleanEmail,
    phone: '+1 (212) 555-0150',
    avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(derivedName)}&backgroundColor=1e3a8a&textColor=ffffff`,
    role: personType === 'lawyer' ? 'Practicing Legal Counsel' : 'Corporate Representative',
    personType,
    firmName: 'JurisPulse Legal Practice Group',
    barNumber: personType === 'lawyer' ? `BAR #${Math.floor(1000000 + Math.random() * 9000000)}` : undefined,
    specialization:
      personType === 'lawyer'
        ? ['General Practice', 'Civil Litigation', 'Regulatory Advisory']
        : undefined,
    bio:
      personType === 'lawyer'
        ? `Admitted attorney managing legal dockets, client consultations, and dispute proceedings.`
        : `Authorized corporate contact and client representative managing matter reviews and invoices.`,
    officeAddress: 'Chambers Plaza, Suite 400, New York, NY 10001',
    hourlyRate: personType === 'lawyer' ? 650 : undefined,
    retainerBalance: personType === 'client' ? 25000 : undefined,
    billingRate: personType === 'client' ? 650 : undefined,
    status: 'Active',
    totalMatters: 1,
    conflictStatus: 'Cleared',
    joinedDate: 'Just now'
  };

  saveIndividualPersonProfile(newProfile);
  return newProfile;
}

/**
 * Conversion helpers
 */
export function convertPersonToLawyerProfile(person: PersonProfile): LawyerProfile {
  return {
    name: person.name,
    title: person.role,
    barNumber: person.barNumber || 'BAR #000000',
    email: person.email,
    phone: person.phone,
    firmName: person.firmName || 'JurisPulse Legal Partners LLP',
    avatarUrl: person.avatarUrl,
    specialization: person.specialization || ['General Practice Litigation'],
    bio: person.bio,
    officeAddress: person.officeAddress,
    hourlyRate: person.hourlyRate || 650,
    courtAdmissions: person.courtAdmissions,
    education: person.education,
    chambersHours: person.chambersHours,
    consultationSlot: person.consultationSlot,
    trialExperience: person.trialExperience,
    arbitrationForums: person.arbitrationForums,
    peerRecognition: person.peerRecognition
  };
}

export function convertPersonToClient(person: PersonProfile): Client {
  return {
    id: person.id,
    name: person.name,
    email: person.email,
    phone: person.phone,
    avatar: person.avatarUrl,
    company: person.company || 'Private Entity',
    caseType: person.caseType || 'General Legal Advisory',
    status: person.status || 'Active',
    totalMatters: person.totalMatters || 1,
    joinedDate: person.joinedDate || 'Recently Joined',
    address: person.officeAddress,
    retainerBalance: person.retainerBalance || 15000,
    billingRate: person.billingRate || 650,
    contactPerson: person.contactPerson || person.name,
    leadCounsel: person.leadCounsel || 'Sarah Vance, Esq.',
    conflictStatus: person.conflictStatus || 'Cleared',
    notes: person.notes || 'Client record registered in chambers system.',
    emergencyContact: person.emergencyContact,
    taxOrEntityId: person.taxOrEntityId,
    preferredChannel: person.preferredChannel || 'Secure Portal'
  };
}
