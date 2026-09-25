import { TeamMemberProfile } from '../types/dashboard';
import { safeLocalStorageSetItem } from '../utils/imageOptimizer';

export const INITIAL_TEAM_MEMBERS: TeamMemberProfile[] = [
  {
    id: 'dev-sarvesh-bhilare',
    name: 'Bhilare Sarvesh',
    enrollmentNo: '240860131012',
    role: 'Developer / Project Developer',
    isLeadDeveloper: true,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300&h=300',
    email: 'sarvesh.bhilare@student.institute.edu',
    phone: '+91 98201 44102',
    department: 'Computer Engineering & Information Technology',
    institution: 'Engineering Institute of Technology',
    bio: 'Developer of this project and responsible for the development and implementation of the system.',
    contributions: [
      'Project Software Architecture & Core Engine Design',
      'Interactive Dashboard & Practice Metrics State Management',
      'Lawyer & Client Practice Management Module Implementation',
      'Real-Time AI Assistant Integration & Docket Pipelines'
    ],
    skills: ['React 18', 'TypeScript', 'Tailwind CSS', 'Vite', 'Node.js', 'System Architecture', 'PBL Project Lead'],
    githubUrl: 'https://github.com/sarvesh-bhilare',
    linkedinUrl: 'https://linkedin.com/in/sarvesh-bhilare',
    joinedDate: 'Project Inception'
  },
  {
    id: 'dev-ritesh-bitode',
    name: 'Ritesh Bitode',
    enrollmentNo: '240860131013',
    role: 'Team Member',
    isLeadDeveloper: false,
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300&h=300',
    email: 'riteshbitode06@gmail.com',
    phone: '+91 98332 55913',
    department: 'Computer Engineering & Information Technology',
    institution: 'Engineering Institute of Technology',
    bio: 'Full-stack developer and UI/UX specialist responsible for responsive component architecture, interactive dashboards, and client CRM workflows.',
    contributions: [
      'Client Management Directory & CRM Interface',
      'Profile Photo Upload with Client-Side Canvas Compression',
      'High-Contrast Modern Color Palette & UI Guidelines',
      'Client-to-Lawyer Messaging Interface & Status Indicators'
    ],
    skills: ['TypeScript', 'React.js', 'Tailwind CSS', 'UI/UX Prototyping', 'Component Architecture', 'Local Storage DB'],
    githubUrl: 'https://github.com/riteshbitode',
    linkedinUrl: 'https://linkedin.com/in/ritesh-bitode',
    joinedDate: 'Project Inception'
  },
  {
    id: 'dev-taufeek-khan',
    name: 'Taufeek Khan',
    enrollmentNo: '240860131058',
    role: 'Team Member',
    isLeadDeveloper: false,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=300',
    email: 'taufeek.khan@student.institute.edu',
    phone: '+91 97680 11058',
    department: 'Computer Engineering & Information Technology',
    institution: 'Engineering Institute of Technology',
    bio: 'Backend developer and database engineer responsible for litigation case schemas, evidence vault pipelines, and encrypted messaging protocols.',
    contributions: [
      'Litigation Case Schema & Legal Taxonomy Modeling',
      'Evidence Chain-of-Custody & Document Vault Engine',
      'Secure Messaging Thread Structure & Delivery Status',
      'Report Export Utilities for PBL Submission'
    ],
    skills: ['Node.js', 'Express', 'TypeScript', 'Database Modeling', 'REST API Architecture', 'Data Security'],
    githubUrl: 'https://github.com/taufeek-khan',
    linkedinUrl: 'https://linkedin.com/in/taufeek-khan',
    joinedDate: 'Project Inception'
  },
  {
    id: 'dev-paswan-abhishek',
    name: 'PASWAN ABHISHEK',
    enrollmentNo: '250860131004',
    role: 'Team Member',
    isLeadDeveloper: false,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300&h=300',
    email: 'abhishek.paswan@student.institute.edu',
    phone: '+91 91520 88004',
    department: 'Computer Engineering & Information Technology',
    institution: 'Engineering Institute of Technology',
    bio: 'Frontend developer and quality assurance engineer responsible for cross-browser responsive layouts, form validation, and testing.',
    contributions: [
      'Comprehensive Form Validation & Sanitization Logic',
      'Cross-Device Mobile & Tablet Viewport Verification',
      'Client & Lawyer Role-Restricted View Validations',
      'System Testing Across Edge Cases & Modal Workflows'
    ],
    skills: ['React.js', 'TypeScript', 'Tailwind CSS', 'Quality Assurance', 'Unit Testing', 'Web Performance'],
    githubUrl: 'https://github.com/abhishek-paswan',
    linkedinUrl: 'https://linkedin.com/in/abhishek-paswan',
    joinedDate: 'Project Inception'
  }
];

const LOCAL_STORAGE_KEY = 'jurispulse_team_members_roster';

export function getStoredTeamMembers(): TeamMemberProfile[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      let parsed: TeamMemberProfile[] = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        // Filter out BINDESHWARI if present from previous sessions
        parsed = parsed.filter(
          (m) =>
            m.id !== 'dev-bindeshwari' &&
            m.enrollmentNo !== '250860131005' &&
            !m.name.toUpperCase().includes('BINDESHWARI')
        );

        // Ensure all 4 project members are present
        let changed = false;
        for (const defaultMember of INITIAL_TEAM_MEMBERS) {
          const exists = parsed.some(
            (m) =>
              m.id === defaultMember.id ||
              m.enrollmentNo === defaultMember.enrollmentNo ||
              m.name.toLowerCase() === defaultMember.name.toLowerCase()
          );
          if (!exists) {
            parsed.push(defaultMember);
            changed = true;
          }
        }
        safeLocalStorageSetItem(LOCAL_STORAGE_KEY, JSON.stringify(parsed));
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to load team members from localStorage:', e);
  }
  return INITIAL_TEAM_MEMBERS;
}

export function saveTeamMembersRoster(members: TeamMemberProfile[]): void {
  try {
    // Sanitize any huge base64 strings before storing
    const sanitized = members.map((m) => {
      if (m.avatarUrl && m.avatarUrl.startsWith('data:image/') && m.avatarUrl.length > 80000) {
        // Find default or keep shorter thumbnail
        const defaultMember = INITIAL_TEAM_MEMBERS.find((init) => init.id === m.id);
        return { ...m, avatarUrl: defaultMember?.avatarUrl || m.avatarUrl.slice(0, 1000) };
      }
      return m;
    });

    safeLocalStorageSetItem(LOCAL_STORAGE_KEY, JSON.stringify(sanitized));
  } catch (e) {
    console.error('Failed to save team members to localStorage:', e);
  }
}

export function updateTeamMemberProfile(
  id: string,
  updates: Partial<TeamMemberProfile>
): TeamMemberProfile[] {
  const current = getStoredTeamMembers();
  const updated = current.map((member) => {
    if (member.id === id) {
      return { ...member, ...updates };
    }
    return member;
  });
  saveTeamMembersRoster(updated);
  return updated;
}

export function resetTeamMembersToDefault(): TeamMemberProfile[] {
  saveTeamMembersRoster(INITIAL_TEAM_MEMBERS);
  return INITIAL_TEAM_MEMBERS;
}
