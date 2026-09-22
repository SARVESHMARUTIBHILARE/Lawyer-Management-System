import React, { useState } from 'react';
import {
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import {
  Appointment,
  LegalCase,
  Client,
  LawyerProfile,
  DashboardNotification,
  LegalDocument,
  Invoice,
  MessageThread,
  ChatMessage,
  AuthUser,
  PersonProfile
} from './types/dashboard';
import {
  initialLawyerProfile,
  initialTodayAppointments,
  initialUpcomingAppointments,
  initialRecentCases,
  initialClients,
  initialNotifications,
  initialDocuments,
  initialInvoices,
  initialMessageThreads
} from './data/lawyerDashboardData';
import {
  getAllPersonProfiles,
  getPersonProfileById,
  saveIndividualPersonProfile,
  convertPersonToLawyerProfile,
  convertPersonToClient,
  defaultPersonsList
} from './data/personProfiles';

import { Navbar } from './components/dashboard/Navbar';
import { Sidebar, NavItemKey } from './components/dashboard/Sidebar';
import { DashboardSection } from './components/dashboard/sections/DashboardSection';
import { AppointmentsSection } from './components/dashboard/sections/AppointmentsSection';
import { ClientsSection } from './components/dashboard/sections/ClientsSection';
import { CasesSection } from './components/dashboard/sections/CasesSection';
import { MessagesSection } from './components/dashboard/sections/MessagesSection';
import { DocumentsSection } from './components/dashboard/sections/DocumentsSection';
import { PaymentsSection } from './components/dashboard/sections/PaymentsSection';
import { AnalyticsSection } from './components/dashboard/sections/AnalyticsSection';
import { ProfileSection } from './components/dashboard/sections/ProfileSection';
import { TeamSection } from './components/dashboard/sections/TeamSection';
import { DatabaseSection, DatabaseCollection } from './components/dashboard/sections/DatabaseSection';
import { LoginPage } from './components/auth/LoginPage';

import {
  AddAppointmentModal,
  AddClientModal,
  CreateCaseModal,
  UploadDocumentModal,
  ViewAppointmentModal,
  SettingsModal,
  LogoutModal
} from './components/dashboard/Modals';
import { AddLawyerModal } from './components/dashboard/AddLawyerModal';

export default function App() {
  // --- AUTHENTICATION & USER STATE ---
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem('jurispulse_auth_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading stored user:', e);
    }
    return null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    try {
      return !!localStorage.getItem('jurispulse_auth_user');
    } catch (e) {
      return false;
    }
  });

  // --- DEFAULT LAWYERS ROSTER ---
  const defaultLawyersRoster: LawyerProfile[] = [
    initialLawyerProfile,
    {
      name: 'Marcus Sterling, Esq.',
      title: 'Senior Partner, Complex Trial Practice',
      firmName: 'JurisPulse Legal Partners LLP',
      barNumber: 'NY-BAR #3819024',
      specialization: ['Federal Trial Litigation', 'Antitrust & Cartel Defense', 'Class Actions'],
      avatarUrl:
        'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256&h=256',
      email: 'm.sterling@jurispulselegal.com',
      phone: '+1 (212) 555-0182',
      hourlyRate: 850,
      officeAddress: 'Suite 4400, 350 5th Avenue, New York, NY 10118',
      bio: 'Veteran trial attorney with over 22 years of courtroom experience in federal civil and criminal trials across the Southern District of New York.'
    },
    {
      name: 'Elena Rostova, Esq.',
      title: 'Partner, Intellectual Property & Patent Law',
      firmName: 'JurisPulse Legal Partners LLP',
      barNumber: 'CA-BAR #4928104',
      specialization: ['Patent Prosecution', 'Trade Secrets Litigation', 'AI Licensing'],
      avatarUrl:
        'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=256&h=256',
      email: 'e.rostova@jurispulselegal.com',
      phone: '+1 (415) 555-0194',
      hourlyRate: 720,
      officeAddress: 'Floor 18, 555 California St, San Francisco, CA 94104',
      bio: 'Lead IP counsel advising tier-1 tech founders and biotech enterprises on patents, trademarks, and federal copyright defense.'
    },
    {
      name: 'David Kim, Esq.',
      title: 'Managing Partner, Corporate M&A & Securities',
      firmName: 'JurisPulse Legal Partners LLP',
      barNumber: 'IL-BAR #7104928',
      specialization: ['Cross-Border Mergers', 'SEC Compliance', 'Venture Financings'],
      avatarUrl:
        'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=256&h=256',
      email: 'd.kim@jurispulselegal.com',
      phone: '+1 (312) 555-0145',
      hourlyRate: 790,
      officeAddress: 'Wacker Drive, Suite 2900, Chicago, IL 60606',
      bio: 'Cross-border transactional specialist orchestrating over $4.2B in acquisitions and regulatory approvals.'
    }
  ];

  // --- ISOLATED PERSON PROFILES STATE ---
  const [allPersons, setAllPersons] = useState<PersonProfile[]>(() => {
    return getAllPersonProfiles();
  });

  const [activePerson, setActivePerson] = useState<PersonProfile>(() => {
    try {
      const activePersonId = localStorage.getItem('jurispulse_active_person_id');
      if (activePersonId) {
        const found = getPersonProfileById(activePersonId);
        if (found) return found;
      }
      const authUserStr = localStorage.getItem('jurispulse_auth_user');
      if (authUserStr) {
        const authUser: AuthUser = JSON.parse(authUserStr);
        const found = getPersonProfileById(authUser.profileId || authUser.id || authUser.email);
        if (found) return found;
      }
    } catch (e) {
      console.error('Error loading active person profile:', e);
    }
    return defaultPersonsList[0];
  });

  // --- STATE ---
  const [lawyers, setLawyers] = useState<LawyerProfile[]>(() => {
    try {
      const saved = localStorage.getItem('jurispulse_lawyers_roster');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading stored lawyers roster:', e);
    }
    return defaultLawyersRoster;
  });

  const [lawyer, setLawyer] = useState<LawyerProfile>(() => {
    try {
      const saved = localStorage.getItem('jurispulse_lawyer_profile');
      if (saved) return { ...initialLawyerProfile, ...JSON.parse(saved) };
    } catch (e) {
      console.error('Error loading stored lawyer profile:', e);
    }
    return initialLawyerProfile;
  });
  const [activeNav, setActiveNav] = useState<NavItemKey>('Dashboard');
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);

  // Appointments & Dockets Data State
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>(
    initialTodayAppointments
  );
  const [upcomingAppointments, setUpcomingAppointments] = useState<Appointment[]>(
    initialUpcomingAppointments
  );
  const [recentCases, setRecentCases] = useState<LegalCase[]>(initialRecentCases);
  const [clients, setClients] = useState<Client[]>(() => {
    try {
      const saved = localStorage.getItem('jurispulse_clients_roster');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading stored clients roster:', e);
    }
    return initialClients;
  });
  const [selectedClientIdForProfile, setSelectedClientIdForProfile] = useState<string | undefined>(undefined);
  const [notifications, setNotifications] = useState<DashboardNotification[]>(
    initialNotifications
  );
  const [documents, setDocuments] = useState<LegalDocument[]>(initialDocuments);
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices);
  const [messageThreads, setMessageThreads] = useState<MessageThread[]>(initialMessageThreads);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');

  // Modals State
  const [isAddAppointmentOpen, setIsAddAppointmentOpen] = useState(false);
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [isCreateCaseOpen, setIsCreateCaseOpen] = useState(false);
  const [isUploadDocOpen, setIsUploadDocOpen] = useState(false);
  const [isAddLawyerOpen, setIsAddLawyerOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const [selectedAppointmentForView, setSelectedAppointmentForView] =
    useState<Appointment | null>(null);

  // Toast Feedback State
  const [toastMessage, setToastMessage] = useState<{
    text: string;
    type: 'success' | 'info' | 'warning';
  } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // --- ACTIONS ---
  const handleAcceptAppointment = (id: string) => {
    setTodayAppointments((prev) =>
      prev.map((apt) =>
        apt.id === id ? { ...apt, status: 'Confirmed' as const } : apt
      )
    );
    setUpcomingAppointments((prev) =>
      prev.map((apt) =>
        apt.id === id ? { ...apt, status: 'Confirmed' as const } : apt
      )
    );
    showToast('Appointment accepted & confirmed on your court docket.', 'success');
  };

  const handleRejectAppointment = (id: string) => {
    setTodayAppointments((prev) =>
      prev.map((apt) =>
        apt.id === id ? { ...apt, status: 'Rejected' as const } : apt
      )
    );
    setUpcomingAppointments((prev) =>
      prev.map((apt) =>
        apt.id === id ? { ...apt, status: 'Rejected' as const } : apt
      )
    );
    showToast('Appointment declined. Client has been notified.', 'warning');
  };

  const handleAddAppointment = (newApt: Partial<Appointment>) => {
    const fullApt: Appointment = {
      id: `apt-${Date.now()}`,
      clientName: newApt.clientName || 'Private Client',
      clientEmail: newApt.clientEmail || 'client@firm.com',
      clientPhone: newApt.clientPhone || '+1 (212) 555-0100',
      date: newApt.date || 'Today',
      time: newApt.time || '10:00 AM',
      caseType: newApt.caseType || 'General Counsel',
      appointmentType: newApt.appointmentType || 'In-person Consultation',
      status: 'Confirmed',
      duration: newApt.duration || '45 mins',
      roomOrLink: newApt.roomOrLink || 'Conference Room 4B',
      notes: newApt.notes || ''
    };

    if (fullApt.date === 'Today') {
      setTodayAppointments((prev) => [fullApt, ...prev]);
    } else {
      setUpcomingAppointments((prev) => [fullApt, ...prev]);
    }

    showToast(`Appointment scheduled for ${fullApt.clientName}.`, 'success');
  };

  const handleAddClient = (newClient: Client) => {
    setClients((prev) => {
      const updated = [newClient, ...prev.filter((c) => c.id !== newClient.id)];
      try {
        localStorage.setItem('jurispulse_clients_roster', JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to persist clients roster:', err);
      }
      return updated;
    });
    showToast(`Client profile for "${newClient.name}" saved in database.`, 'success');
  };

  const handleSaveClientProfile = (updatedClient: Client) => {
    setClients((prev) => {
      const updated = prev.map((c) => (c.id === updatedClient.id ? updatedClient : c));
      try {
        localStorage.setItem('jurispulse_clients_roster', JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to persist client profile:', err);
      }
      return updated;
    });
    showToast(`Client profile for "${updatedClient.name}" updated & saved in database!`, 'success');
  };

  const handleDeleteClient = (clientId: string) => {
    setClients((prev) => {
      const updated = prev.filter((c) => c.id !== clientId);
      try {
        localStorage.setItem('jurispulse_clients_roster', JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to persist clients roster:', err);
      }
      return updated;
    });
    showToast('Client profile removed from database', 'info');
  };

  const handleViewClientProfile = (client: Client) => {
    setSelectedClientIdForProfile(client.id);
    const matching = allPersons.find(
      (p) => p.id === client.id || p.email.toLowerCase() === client.email.toLowerCase()
    );
    if (matching) {
      setActivePerson(matching);
      try {
        localStorage.setItem('jurispulse_active_person_id', matching.id);
      } catch (err) {
        console.error(err);
      }
    }
    setActiveNav('Profile');
  };

  const handleViewLawyerProfile = (lawyerProf: LawyerProfile) => {
    handleSelectActiveLawyer(lawyerProf);
    setActiveNav('Profile');
  };

  const handleCreateCase = (newCase: LegalCase) => {
    setRecentCases((prev) => [newCase, ...prev]);
    showToast(`Legal case ${newCase.id} created successfully.`, 'success');
  };

  const handleUploadDocumentSuccess = (filename: string) => {
    const newDoc: LegalDocument = {
      id: `doc-${Date.now()}`,
      title: filename,
      caseId: recentCases[0]?.id || '#CAS-2026-881',
      clientName: clients[0]?.name || 'Arthur Pendelton',
      fileSize: '2.4 MB',
      uploadDate: 'Sep 21, 2026',
      category: 'Pleadings'
    };
    setDocuments((prev) => [newDoc, ...prev]);
    showToast(`Document "${filename}" securely uploaded to evidentiary vault.`, 'success');
  };

  const handleAddLawyer = (newLawyer: LawyerProfile) => {
    setLawyers((prev) => {
      const updated = [newLawyer, ...prev.filter((l) => l.barNumber !== newLawyer.barNumber)];
      try {
        localStorage.setItem('jurispulse_lawyers_roster', JSON.stringify(updated));
      } catch (err) {
        console.error('Failed to persist lawyers roster:', err);
      }
      return updated;
    });

    // Set as currently active counsel
    setLawyer(newLawyer);
    try {
      localStorage.setItem('jurispulse_lawyer_profile', JSON.stringify(newLawyer));
    } catch (err) {
      console.error(err);
    }

    showToast(`Attorney ${newLawyer.name} successfully registered to firm roster and database.`, 'success');
  };

  const handleSelectActiveLawyer = (selectedLawyer: LawyerProfile) => {
    setLawyer(selectedLawyer);
    try {
      localStorage.setItem('jurispulse_lawyer_profile', JSON.stringify(selectedLawyer));
    } catch (err) {
      console.error(err);
    }
    const matching = allPersons.find(
      (p) => p.email.toLowerCase() === selectedLawyer.email.toLowerCase() || p.barNumber === selectedLawyer.barNumber
    );
    if (matching) {
      setActivePerson(matching);
      try {
        localStorage.setItem('jurispulse_active_person_id', matching.id);
      } catch (err) {
        console.error(err);
      }
    }
    showToast(`Active counsel switched to ${selectedLawyer.name}.`, 'info');
  };

  const handleSwitchPerson = (person: PersonProfile) => {
    setActivePerson(person);
    try {
      localStorage.setItem('jurispulse_active_person_id', person.id);
    } catch (e) {
      console.error(e);
    }

    const updatedUser: AuthUser = {
      id: person.id,
      name: person.name,
      email: person.email,
      avatarUrl: person.avatarUrl,
      role: person.role,
      provider: 'email',
      personType: person.personType,
      profileId: person.id,
      firmName: person.firmName,
      barNumber: person.barNumber,
      clientId: person.personType === 'client' ? person.id : undefined,
      loggedInAt: 'Active Session'
    };
    setCurrentUser(updatedUser);
    try {
      localStorage.setItem('jurispulse_auth_user', JSON.stringify(updatedUser));
    } catch (e) {
      console.error(e);
    }

    if (person.personType === 'lawyer') {
      const lawyerObj = convertPersonToLawyerProfile(person);
      setLawyer(lawyerObj);
      try {
        localStorage.setItem('jurispulse_lawyer_profile', JSON.stringify(lawyerObj));
      } catch (err) {
        console.error(err);
      }
    } else if (person.personType === 'client') {
      setSelectedClientIdForProfile(person.id);
    }

    showToast(`Switched active profile view to ${person.name} (${person.role})`, 'info');
  };

  const handleSavePersonalProfile = (updatedPerson: PersonProfile) => {
    setActivePerson(updatedPerson);
    saveIndividualPersonProfile(updatedPerson);

    setAllPersons((prev) =>
      prev.map((p) => (p.id === updatedPerson.id ? updatedPerson : p))
    );

    if (updatedPerson.personType === 'lawyer') {
      const lawyerObj = convertPersonToLawyerProfile(updatedPerson);
      setLawyer(lawyerObj);
      setLawyers((prev) => {
        const updated = prev.map((l) =>
          l.email.toLowerCase() === updatedPerson.email.toLowerCase() ? lawyerObj : l
        );
        try {
          localStorage.setItem('jurispulse_lawyers_roster', JSON.stringify(updated));
        } catch (e) {
          console.error(e);
        }
        return updated;
      });
    }

    if (updatedPerson.personType === 'client') {
      const clientObj = convertPersonToClient(updatedPerson);
      setClients((prev) => {
        const updated = prev.map((c) =>
          c.id === updatedPerson.id || c.email.toLowerCase() === updatedPerson.email.toLowerCase()
            ? clientObj
            : c
        );
        try {
          localStorage.setItem('jurispulse_clients_roster', JSON.stringify(updated));
        } catch (e) {
          console.error(e);
        }
        return updated;
      });
    }

    setCurrentUser((prev) =>
      prev
        ? {
            ...prev,
            name: updatedPerson.name,
            email: updatedPerson.email,
            role: updatedPerson.role,
            avatarUrl: updatedPerson.avatarUrl,
            firmName: updatedPerson.firmName,
            barNumber: updatedPerson.barNumber
          }
        : null
    );

    showToast(`Personal profile for ${updatedPerson.name} saved in isolated storage.`, 'success');
  };

  const handleDeleteRecord = (collection: DatabaseCollection, idOrKey: string) => {
    if (collection === 'lawyers') {
      if (lawyers.length <= 1) {
        showToast('Cannot delete the sole practicing attorney in the firm roster.', 'warning');
        return;
      }
      setLawyers((prev) => {
        const next = prev.filter((l) => l.barNumber !== idOrKey);
        try {
          localStorage.setItem('jurispulse_lawyers_roster', JSON.stringify(next));
        } catch (err) {
          console.error(err);
        }
        if (lawyer.barNumber === idOrKey && next.length > 0) {
          setLawyer(next[0]);
          localStorage.setItem('jurispulse_lawyer_profile', JSON.stringify(next[0]));
        }
        return next;
      });
      showToast('Attorney record removed from chambers database.', 'info');
    } else if (collection === 'appointments') {
      setTodayAppointments((prev) => prev.filter((a) => a.id !== idOrKey));
      setUpcomingAppointments((prev) => prev.filter((a) => a.id !== idOrKey));
      showToast('Appointment docket record removed from database.', 'info');
    } else if (collection === 'clients') {
      setClients((prev) => {
        const next = prev.filter((c) => c.id !== idOrKey);
        try {
          localStorage.setItem('jurispulse_clients_roster', JSON.stringify(next));
        } catch (err) {
          console.error(err);
        }
        return next;
      });
      showToast('Client entity record removed from database.', 'info');
    } else if (collection === 'cases') {
      setRecentCases((prev) => prev.filter((cs) => cs.id !== idOrKey));
      showToast('Litigation docket record removed from database.', 'info');
    } else if (collection === 'documents') {
      setDocuments((prev) => prev.filter((d) => d.id !== idOrKey));
      showToast('Evidentiary document removed from database.', 'info');
    } else if (collection === 'invoices') {
      setInvoices((prev) => prev.filter((i) => i.id !== idOrKey));
      showToast('Financial ledger invoice removed from database.', 'info');
    }
  };

  const handleSaveProfile = (updated: LawyerProfile) => {
    setLawyer(updated);
    try {
      localStorage.setItem('jurispulse_lawyer_profile', JSON.stringify(updated));
    } catch (err) {
      console.error('Failed to persist lawyer profile:', err);
    }

    // Update in lawyers roster
    setLawyers((prev) => {
      const updatedList = prev.map((l) =>
        l.barNumber === updated.barNumber ? updated : l
      );
      try {
        localStorage.setItem('jurispulse_lawyers_roster', JSON.stringify(updatedList));
      } catch (err) {
        console.error(err);
      }
      return updatedList;
    });

    // Keep currentUser aligned if present
    if (currentUser) {
      const updatedUser: AuthUser = {
        ...currentUser,
        name: updated.name,
        email: updated.email,
        avatarUrl: updated.avatarUrl || currentUser.avatarUrl,
        role: updated.title || currentUser.role,
        firmName: updated.firmName || currentUser.firmName,
        barNumber: updated.barNumber || currentUser.barNumber
      };
      setCurrentUser(updatedUser);
      try {
        localStorage.setItem('jurispulse_auth_user', JSON.stringify(updatedUser));
      } catch (err) {
        console.error('Failed to persist auth user:', err);
      }
    }

    showToast('Lawyer credentials & chambers bio saved successfully.', 'success');
  };

  const handleSaveUser = (updatedUser: AuthUser) => {
    setCurrentUser(updatedUser);
    try {
      localStorage.setItem('jurispulse_auth_user', JSON.stringify(updatedUser));
    } catch (err) {
      console.error('Failed to persist auth user:', err);
    }

    // Keep lawyer profile in sync
    setLawyer((prev) => {
      const nextLawyer: LawyerProfile = {
        ...prev,
        name: updatedUser.name,
        email: updatedUser.email,
        avatarUrl: updatedUser.avatarUrl || prev.avatarUrl,
        title: updatedUser.role || prev.title,
        firmName: updatedUser.firmName || prev.firmName,
        barNumber: updatedUser.barNumber || prev.barNumber
      };
      try {
        localStorage.setItem('jurispulse_lawyer_profile', JSON.stringify(nextLawyer));
      } catch (err) {
        console.error('Failed to persist lawyer profile:', err);
      }
      return nextLawyer;
    });

    showToast('Chambers user account credentials saved successfully.', 'success');
  };

  const handleSaveSettings = (updated: LawyerProfile) => {
    handleSaveProfile(updated);
  };

  const handleMarkNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read.', 'info');
  };

  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    try {
      localStorage.setItem('jurispulse_auth_user', JSON.stringify(user));
    } catch (e) {
      console.error(e);
    }

    // Retrieve or establish this user's isolated PersonProfile
    const person =
      getPersonProfileById(user.profileId || user.id || user.email) ||
      allPersons.find((p) => p.email.toLowerCase() === user.email.toLowerCase()) || {
        id: user.profileId || user.id,
        name: user.name,
        email: user.email,
        avatarUrl: user.avatarUrl,
        role: user.role,
        personType: user.personType || 'lawyer',
        firmName: user.firmName || 'JurisPulse Legal Partners LLP',
        barNumber: user.barNumber || 'NY-BAR #8291045'
      };

    setActivePerson(person);
    saveIndividualPersonProfile(person);
    setAllPersons(getAllPersonProfiles());
    try {
      localStorage.setItem('jurispulse_active_person_id', person.id);
    } catch (err) {
      console.error(err);
    }

    if (person.personType === 'lawyer') {
      const lawyerObj = convertPersonToLawyerProfile(person);
      setLawyer(lawyerObj);
      try {
        localStorage.setItem('jurispulse_lawyer_profile', JSON.stringify(lawyerObj));
      } catch (err) {
        console.error(err);
      }
    }

    showToast(`Chambers access authorized. Welcome, ${user.name}!`, 'success');
  };

  const handleConfirmLogout = () => {
    setIsLogoutOpen(false);
    setIsAuthenticated(false);
    setCurrentUser(null);
    try {
      localStorage.removeItem('jurispulse_auth_user');
    } catch (e) {
      console.error(e);
    }
    showToast('Signed out of Chambers. Return anytime via the Login Portal.', 'info');
  };

  const handleSendMessage = (threadId: string, text: string) => {
    setMessageThreads((prev) =>
      prev.map((t) => {
        if (t.id === threadId) {
          const newMsg: ChatMessage = {
            id: `msg-${Date.now()}`,
            sender: 'lawyer',
            text,
            timestamp: 'Just now',
            read: true
          };
          return {
            ...t,
            lastMessage: text,
            lastTimestamp: 'Just now',
            unreadCount: 0,
            messages: [...t.messages, newMsg]
          };
        }
        return t;
      })
    );
    showToast('Privileged legal communication transmitted.', 'success');
  };

  const handleCreateInvoice = () => {
    const newInv: Invoice = {
      id: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
      clientName: clients[0]?.name || 'Arthur Pendelton',
      caseId: recentCases[0]?.id || '#CAS-2026-881',
      amount: 7500,
      issueDate: 'Sep 21, 2026',
      dueDate: 'Oct 21, 2026',
      status: 'Pending',
      type: 'Hourly Billing',
      paymentMethod: 'IOLTA Escrow Wire'
    };
    setInvoices((prev) => [newInv, ...prev]);
    showToast(`Invoice ${newInv.id} for $${newInv.amount.toLocaleString()} generated.`, 'success');
  };

  const handleDownloadDoc = (doc: LegalDocument) => {
    showToast(`Downloading verified copy: ${doc.title}`, 'info');
  };

  const handlePreviewDoc = (doc: LegalDocument) => {
    showToast(`Viewing vault record: ${doc.title} (${doc.category})`, 'info');
  };

  const handleDownloadReceipt = (inv: Invoice) => {
    showToast(`Generating statement receipt for ${inv.id}`, 'info');
  };

  const handleSendReminder = (inv: Invoice) => {
    showToast(`Retainer payment reminder dispatched to ${inv.clientName}.`, 'success');
  };

  // --- STAT METRICS ---
  const pendingRequestsCount = todayAppointments.filter(
    (apt) => apt.status === 'Pending'
  ).length + upcomingAppointments.filter((apt) => apt.status === 'Pending').length;

  const totalAppointmentsCount =
    144 + todayAppointments.length + upcomingAppointments.length;

  const totalDatabaseRecords =
    lawyers.length +
    todayAppointments.length +
    upcomingAppointments.length +
    clients.length +
    recentCases.length +
    documents.length +
    invoices.length +
    3;

  // If not authenticated, display the requested Login Page (Email ID, Google, Twitter, Instagram)
  if (!isAuthenticated) {
    return (
      <>
        {toastMessage && (
          <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
            <div
              className={`px-4 py-3 rounded-xl shadow-lg border flex items-center gap-3 text-xs font-semibold ${
                toastMessage.type === 'success'
                  ? 'bg-slate-900 text-white border-slate-800'
                  : toastMessage.type === 'warning'
                  ? 'bg-amber-900 text-white border-amber-800'
                  : 'bg-blue-900 text-white border-blue-800'
              }`}
            >
              {toastMessage.type === 'success' ? (
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-300 shrink-0" />
              )}
              <span>{toastMessage.text}</span>
            </div>
          </div>
        )}
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased flex flex-col selection:bg-blue-900 selection:text-white">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 animate-in fade-in slide-in-from-bottom-3 duration-200">
          <div
            className={`px-4 py-3 rounded-xl shadow-lg border flex items-center gap-3 text-xs font-semibold ${
              toastMessage.type === 'success'
                ? 'bg-slate-900 text-white border-slate-800'
                : toastMessage.type === 'warning'
                ? 'bg-amber-900 text-white border-amber-800'
                : 'bg-blue-900 text-white border-blue-800'
            }`}
          >
            {toastMessage.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-300 shrink-0" />
            )}
            <span>{toastMessage.text}</span>
          </div>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        lawyer={lawyer}
        currentUser={currentUser}
        activePerson={activePerson}
        allPersons={allPersons}
        onSwitchPerson={handleSwitchPerson}
        notifications={notifications}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onLogoutClick={() => setIsLogoutOpen(true)}
        onToggleSidebar={() => setIsSidebarOpenMobile(!isSidebarOpenMobile)}
        isSidebarOpen={isSidebarOpenMobile}
        onMarkNotificationsRead={handleMarkNotificationsRead}
        onSelectNav={(key) => setActiveNav(key)}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Sidebar Navigation */}
        <Sidebar
          activeNav={activeNav}
          onSelectNav={(key) => {
            setActiveNav(key);
            setIsSidebarOpenMobile(false);
          }}
          isOpenMobile={isSidebarOpenMobile}
          onCloseMobile={() => setIsSidebarOpenMobile(false)}
          pendingAppointmentsCount={pendingRequestsCount}
          activeCasesCount={recentCases.length}
          totalClientsCount={clients.length}
          databaseRecordsCount={totalDatabaseRecords}
        />

        {/* Main Content Area: Renders the Dedicated Section corresponding to activeNav */}
        <main className="flex-1 lg:pl-64 w-full p-4 sm:p-6 lg:p-8">
          {activeNav === 'Dashboard' && (
            <DashboardSection
              lawyer={lawyer}
              currentUser={currentUser}
              activePerson={activePerson}
              todayAppointments={todayAppointments}
              upcomingAppointments={upcomingAppointments}
              recentCases={recentCases}
              clients={clients}
              pendingRequestsCount={pendingRequestsCount}
              totalAppointmentsCount={totalAppointmentsCount}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              onViewAppointment={(apt) => setSelectedAppointmentForView(apt)}
              onAcceptAppointment={handleAcceptAppointment}
              onRejectAppointment={handleRejectAppointment}
              onViewCase={(c) => {
                showToast(`Viewing docket for ${c.id}: ${c.title}`, 'info');
              }}
              onAddAppointmentClick={() => setIsAddAppointmentOpen(true)}
              onAddClientClick={() => setIsAddClientOpen(true)}
              onCreateCaseClick={() => setIsCreateCaseOpen(true)}
              onUploadDocClick={() => setIsUploadDocOpen(true)}
              onAddLawyerClick={() => setIsAddLawyerOpen(true)}
              onNavigateToSection={(key) => setActiveNav(key)}
            />
          )}

          {activeNav === 'Appointments' && (
            <AppointmentsSection
              todayAppointments={todayAppointments}
              upcomingAppointments={upcomingAppointments}
              onAccept={handleAcceptAppointment}
              onReject={handleRejectAppointment}
              onViewDetails={(apt) => setSelectedAppointmentForView(apt)}
              onAddNew={() => setIsAddAppointmentOpen(true)}
            />
          )}

          {activeNav === 'Clients' && (
            <ClientsSection
              clients={clients}
              onAddNewClient={() => setIsAddClientOpen(true)}
              onScheduleWithClient={(client) => {
                setIsAddAppointmentOpen(true);
              }}
              onMessageClient={(client) => {
                setActiveNav('Messages');
              }}
              onViewClientCases={(client) => {
                setActiveNav('Cases');
              }}
              onViewClientProfile={handleViewClientProfile}
            />
          )}

          {activeNav === 'Cases' && (
            <CasesSection
              cases={recentCases}
              onCreateCase={() => setIsCreateCaseOpen(true)}
              onViewCase={(c) => {
                showToast(`Docket details for ${c.id}: ${c.title}`, 'info');
              }}
              onScheduleHearingPrep={(c) => {
                setIsAddAppointmentOpen(true);
              }}
              onUploadFiling={(c) => {
                setIsUploadDocOpen(true);
              }}
            />
          )}

          {activeNav === 'Messages' && (
            <MessagesSection
              threads={messageThreads}
              onSendMessage={handleSendMessage}
              onScheduleFromChat={(clientName, caseType) => {
                setIsAddAppointmentOpen(true);
              }}
            />
          )}

          {activeNav === 'Documents' && (
            <DocumentsSection
              documents={documents}
              onUploadClick={() => setIsUploadDocOpen(true)}
              onDownloadDoc={handleDownloadDoc}
              onPreviewDoc={handlePreviewDoc}
            />
          )}

          {activeNav === 'Payments' && (
            <PaymentsSection
              invoices={invoices}
              onCreateInvoice={handleCreateInvoice}
              onDownloadReceipt={handleDownloadReceipt}
              onSendReminder={handleSendReminder}
            />
          )}

          {activeNav === 'Analytics' && (
            <AnalyticsSection
              lawyers={lawyers}
              currentLawyer={lawyer}
              cases={recentCases}
              appointments={[...todayAppointments, ...upcomingAppointments]}
              clients={clients}
              invoices={invoices}
              documents={documents}
              onNavigateToSection={(section) => setActiveNav(section as NavItemKey)}
              onShowToast={showToast}
            />
          )}

          {activeNav === 'Profile' && (
            <ProfileSection
              lawyer={lawyer}
              currentUser={currentUser}
              activePerson={activePerson}
              allPersons={allPersons}
              onSwitchPerson={handleSwitchPerson}
              onSavePersonalProfile={handleSavePersonalProfile}
              lawyersList={lawyers}
              clientsList={clients}
              selectedClientId={selectedClientIdForProfile}
              onSaveClientProfile={handleSaveClientProfile}
              onAddNewClientClick={() => setIsAddClientOpen(true)}
              onDeleteClient={handleDeleteClient}
              onScheduleWithClient={(client) => {
                setIsAddAppointmentOpen(true);
              }}
              onMessageClient={(client) => {
                setActiveNav('Messages');
              }}
              onViewClientCases={(client) => {
                setActiveNav('Cases');
              }}
              onSelectLawyer={handleSelectActiveLawyer}
              onAddNewLawyerClick={() => setIsAddLawyerOpen(true)}
              onSaveProfile={handleSaveProfile}
              onSaveUser={handleSaveUser}
              onEditProfile={() => setIsSettingsOpen(true)}
            />
          )}

          {activeNav === 'Team' && (
            <TeamSection
              activePerson={activePerson}
              onSwitchPerson={handleSwitchPerson}
              onShowToast={showToast}
            />
          )}

          {activeNav === 'Database' && (
            <DatabaseSection
              lawyers={lawyers}
              currentLawyer={lawyer}
              currentUser={currentUser}
              appointments={[...todayAppointments, ...upcomingAppointments]}
              clients={clients}
              cases={recentCases}
              documents={documents}
              invoices={invoices}
              onSelectActiveLawyer={handleSelectActiveLawyer}
              onAddNewLawyerClick={() => setIsAddLawyerOpen(true)}
              onAddNewClientClick={() => setIsAddClientOpen(true)}
              onAddNewAppointmentClick={() => setIsAddAppointmentOpen(true)}
              onAddNewCaseClick={() => setIsCreateCaseOpen(true)}
              onUploadDocClick={() => setIsUploadDocOpen(true)}
              onDeleteRecord={handleDeleteRecord}
              onViewClientProfile={handleViewClientProfile}
              onViewLawyerProfile={handleViewLawyerProfile}
            />
          )}
        </main>
      </div>

      {/* --- ALL INTERACTIVE MODALS --- */}
      <AddLawyerModal
        isOpen={isAddLawyerOpen}
        onClose={() => setIsAddLawyerOpen(false)}
        onAddLawyer={handleAddLawyer}
      />

      <AddAppointmentModal
        isOpen={isAddAppointmentOpen}
        onClose={() => setIsAddAppointmentOpen(false)}
        onAdd={handleAddAppointment}
        clients={clients}
      />

      <AddClientModal
        isOpen={isAddClientOpen}
        onClose={() => setIsAddClientOpen(false)}
        onAdd={handleAddClient}
      />

      <CreateCaseModal
        isOpen={isCreateCaseOpen}
        onClose={() => setIsCreateCaseOpen(false)}
        onCreate={handleCreateCase}
        clients={clients}
      />

      <UploadDocumentModal
        isOpen={isUploadDocOpen}
        onClose={() => setIsUploadDocOpen(false)}
        onUploadSuccess={handleUploadDocumentSuccess}
        cases={recentCases}
      />

      <ViewAppointmentModal
        appointment={selectedAppointmentForView}
        onClose={() => setSelectedAppointmentForView(null)}
        onAccept={handleAcceptAppointment}
        onReject={handleRejectAppointment}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        lawyer={lawyer}
        onSave={handleSaveSettings}
      />

      <LogoutModal
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        onConfirm={handleConfirmLogout}
      />
    </div>
  );
}
