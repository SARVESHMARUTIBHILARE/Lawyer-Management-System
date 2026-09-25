import React, { useState, useEffect, useMemo } from 'react';
import {
  User,
  CaseFile,
  CaseStatus,
  CaseDeadline,
  ClientDocument,
  TimeEntry,
  Invoice,
  EncryptedMessage,
  ClientRepresentationRequest,
  UserRole,
  PracticeArea
} from '../../../types';
import {
  INITIAL_USERS,
  INITIAL_CASES,
  INITIAL_DEADLINES,
  INITIAL_DOCUMENTS,
  INITIAL_TIME_ENTRIES,
  INITIAL_INVOICES,
  INITIAL_MESSAGES,
  INITIAL_CLIENT_REQUESTS
} from '../../../data/mockData';
import { FIFTY_LAWYERS, SAMPLE_CASES } from '../../../data/extendedLawyersAndClients';
import { LawyerProfile, AuthUser, PersonProfile, NavItemKey } from '../../../types/dashboard';
import { LawyerPortalView } from '../../LawyerPortalView';

interface LawyersPortalSectionProps {
  currentLawyer: LawyerProfile;
  currentUser?: AuthUser | null;
  activePerson?: PersonProfile | null;
  onNavigateToSection: (key: NavItemKey) => void;
  onShowToast: (message: string, type: 'success' | 'info' | 'warning' | 'error') => void;
  initialSelectedLawyerId?: string;
}

const STORAGE_PORTAL_CASES = 'jurispulse_portal_cases_v2';
const STORAGE_PORTAL_REQUESTS = 'jurispulse_portal_requests_v2';
const STORAGE_PORTAL_DEADLINES = 'jurispulse_portal_deadlines_v2';
const STORAGE_PORTAL_DOCS = 'jurispulse_portal_docs_v2';
const STORAGE_PORTAL_TIME_ENTRIES = 'jurispulse_portal_time_entries_v2';
const STORAGE_PORTAL_MESSAGES = 'jurispulse_portal_messages_v2';

export const LawyersPortalSection: React.FC<LawyersPortalSectionProps> = ({
  currentLawyer,
  currentUser,
  activePerson,
  onNavigateToSection,
  onShowToast,
  initialSelectedLawyerId
}) => {
  // Convert 50 realistic demo lawyers into User objects for the portal
  const combinedUsers = useMemo<User[]>(() => {
    const list: User[] = [];

    // 1. Add active lawyer / current user
    if (currentLawyer) {
      list.push({
        id: 'lawyer-active-1',
        name: currentLawyer.name,
        email: currentLawyer.email,
        role: 'admin',
        title: currentLawyer.title || 'Managing Partner',
        avatarUrl: currentLawyer.avatarUrl,
        hourlyRate: currentLawyer.hourlyRate || 650,
        twoFactorEnabled: true,
        status: 'active',
        department: 'Executive Legal Counsel & Litigation'
      });
    }

    // 2. Add INITIAL_USERS from mockData
    for (const u of INITIAL_USERS) {
      if (!list.some((existing) => existing.email.toLowerCase() === u.email.toLowerCase())) {
        list.push(u);
      }
    }

    // 3. Add all 50 Lawyers from extended dataset
    FIFTY_LAWYERS.forEach((dl, idx) => {
      if (!list.some((existing) => existing.email.toLowerCase() === dl.email.toLowerCase())) {
        list.push({
          id: dl.id,
          name: dl.name,
          email: dl.email,
          role: idx < 10 ? 'partner' : 'associate',
          title: `${Array.isArray(dl.specialization) ? dl.specialization[0] : dl.specialization} • ${dl.qualification}`,
          avatarUrl: dl.avatarUrl,
          hourlyRate: dl.hourlyRate || 550,
          twoFactorEnabled: true,
          status: dl.accountStatus === 'On Leave' ? 'inactive' : 'active',
          department: `${Array.isArray(dl.specialization) ? dl.specialization[0] : dl.specialization} Division (${dl.city}, ${dl.state})`
        });
      }
    });

    return list;
  }, [currentLawyer]);

  // Initial Cases combined from INITIAL_CASES and SAMPLE_CASES mapped to 50 lawyers
  const defaultCases = useMemo<CaseFile[]>(() => {
    const casesList: CaseFile[] = [...INITIAL_CASES];

    SAMPLE_CASES.forEach((sc, i) => {
      const assignedLawyer =
        FIFTY_LAWYERS.find((l) => l.name === sc.leadCounsel) ||
        FIFTY_LAWYERS[i % FIFTY_LAWYERS.length];

      const cleanId = `case-sample-${sc.id.replace(/[^a-zA-Z0-9]/g, '')}`;
      if (!casesList.some((c) => c.id === cleanId || c.caseNumber === sc.id)) {
        casesList.push({
          id: cleanId,
          caseNumber: sc.id.startsWith('#') ? sc.id.substring(1) : sc.id,
          title: sc.title,
          clientName: sc.clientName,
          clientEmail: `${sc.clientName.toLowerCase().replace(/[^a-z0-9]/g, '.')}@client.legal`,
          practiceArea: (['Corporate', 'Intellectual Property', 'Litigation', 'Family Law', 'Real Estate', 'Criminal Defense', 'Tax Law'].includes(sc.caseType)
            ? sc.caseType
            : 'Litigation') as PracticeArea,
          assignedLawyerId: assignedLawyer.id,
          assignedLawyerName: assignedLawyer.name,
          status: sc.caseStatus === 'Active'
            ? 'discovery'
            : sc.caseStatus === 'Pre-Trial'
            ? 'pre_trial'
            : sc.caseStatus === 'In Review'
            ? 'intake'
            : 'discovery',
          openedDate: '2026-02-01',
          expectedClosureDate: sc.hearingDate || '2026-10-30',
          retainerAmount: 30000,
          retainerRemaining: 18500,
          hourlyRate: assignedLawyer.hourlyRate || 500,
          totalBilled: 11500,
          description: `Federal matter docketed in ${sc.courtJurisdiction || 'U.S. District Court'}. Lead Counsel: ${assignedLawyer.name}.`,
          tags: [sc.caseType, 'Federal Court', assignedLawyer.city]
        });
      }
    });

    return casesList;
  }, []);

  // Cases State
  const [cases, setCases] = useState<CaseFile[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_PORTAL_CASES);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return defaultCases;
  });

  // Client Representation Requests State
  const [clientRequests, setClientRequests] = useState<ClientRepresentationRequest[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_PORTAL_REQUESTS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_CLIENT_REQUESTS;
  });

  // Deadlines State
  const [deadlines, setDeadlines] = useState<CaseDeadline[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_PORTAL_DEADLINES);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_DEADLINES;
  });

  // Documents State
  const [documents, setDocuments] = useState<ClientDocument[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_PORTAL_DOCS);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_DOCUMENTS;
  });

  // Time Entries State
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_PORTAL_TIME_ENTRIES);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_TIME_ENTRIES;
  });

  // Messages State
  const [messages, setMessages] = useState<EncryptedMessage[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_PORTAL_MESSAGES);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return INITIAL_MESSAGES;
  });

  // Invoices (read-only for billing tab in portal)
  const invoices = useMemo<Invoice[]>(() => INITIAL_INVOICES, []);

  // Live Stopwatch Timer
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning]);

  const handleToggleTimer = () => {
    setIsTimerRunning((prev) => !prev);
    if (!isTimerRunning) {
      onShowToast('Billable timer active. Tracking billable counsel minutes.', 'info');
    } else {
      onShowToast(`Timer paused at ${Math.floor(timerSeconds / 60)}m ${timerSeconds % 60}s.`, 'info');
    }
  };

  // Accept Client Intake Request
  const handleAcceptClientRequest = (requestId: string, reviewerLawyerName: string) => {
    setClientRequests((prev) => {
      const updated = prev.map((req) =>
        req.id === requestId
          ? {
              ...req,
              status: 'accepted' as const,
              reviewedByLawyerName: reviewerLawyerName
            }
          : req
      );
      try {
        localStorage.setItem(STORAGE_PORTAL_REQUESTS, JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
      return updated;
    });

    // Auto-create active case file for this accepted client representation
    const req = clientRequests.find((r) => r.id === requestId);
    if (req) {
      const newCase: CaseFile = {
        id: `case-acc-${Date.now()}`,
        caseNumber: `JP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        title: req.requestTitle,
        clientName: req.clientName,
        clientEmail: req.clientEmail,
        practiceArea: req.practiceArea,
        assignedLawyerId: req.targetLawyerId || 'lawyer-active-1',
        assignedLawyerName: reviewerLawyerName,
        status: 'discovery',
        openedDate: new Date().toISOString().slice(0, 10),
        expectedClosureDate: new Date(Date.now() + 180 * 86400000).toISOString().slice(0, 10),
        retainerAmount: 25000,
        retainerRemaining: 25000,
        hourlyRate: 550,
        totalBilled: 0,
        description: req.caseSummary,
        tags: [req.practiceArea, 'Accepted Intake', 'Active Retainer']
      };

      setCases((prev) => {
        const next = [newCase, ...prev];
        try {
          localStorage.setItem(STORAGE_PORTAL_CASES, JSON.stringify(next));
        } catch (err) {
          console.error(err);
        }
        return next;
      });

      onShowToast(`Accepted representation for ${req.clientName}! New litigation matter initialized.`, 'success');
    }
  };

  // Decline Client Intake Request
  const handleDeclineClientRequest = (requestId: string, reviewerLawyerName: string) => {
    setClientRequests((prev) => {
      const updated = prev.map((req) =>
        req.id === requestId
          ? {
              ...req,
              status: 'declined' as const,
              reviewedByLawyerName: reviewerLawyerName
            }
          : req
      );
      try {
        localStorage.setItem(STORAGE_PORTAL_REQUESTS, JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
      return updated;
    });
    onShowToast(`Client representation request declined and logged for chambers compliance.`, 'warning');
  };

  // Add Case
  const handleAddCase = (newCase: CaseFile) => {
    setCases((prev) => {
      const next = [newCase, ...prev];
      try {
        localStorage.setItem(STORAGE_PORTAL_CASES, JSON.stringify(next));
      } catch (err) {
        console.error(err);
      }
      return next;
    });
    onShowToast(`Matter ${newCase.caseNumber} opened in Chambers docket.`, 'success');
  };

  // Update Case Status
  const handleUpdateCaseStatus = (caseId: string, newStatus: CaseStatus) => {
    setCases((prev) => {
      const next = prev.map((c) => (c.id === caseId ? { ...c, status: newStatus } : c));
      try {
        localStorage.setItem(STORAGE_PORTAL_CASES, JSON.stringify(next));
      } catch (err) {
        console.error(err);
      }
      return next;
    });
    onShowToast(`Docket status updated to ${newStatus.replace('_', ' ').toUpperCase()}.`, 'info');
  };

  // Add Time Entry
  const handleAddTimeEntry = (entry: TimeEntry) => {
    setTimeEntries((prev) => {
      const next = [entry, ...prev];
      try {
        localStorage.setItem(STORAGE_PORTAL_TIME_ENTRIES, JSON.stringify(next));
      } catch (err) {
        console.error(err);
      }
      return next;
    });
    onShowToast(`Logged ${entry.hours}h for ${entry.description || 'Counsel Services'}. WIP balance updated.`, 'success');
  };

  // Add Deadline
  const handleAddDeadline = (deadline: CaseDeadline) => {
    setDeadlines((prev) => {
      const next = [deadline, ...prev];
      try {
        localStorage.setItem(STORAGE_PORTAL_DEADLINES, JSON.stringify(next));
      } catch (err) {
        console.error(err);
      }
      return next;
    });
    onShowToast(`Hearing/Filing deadline scheduled for ${deadline.dueDate}.`, 'success');
  };

  // Toggle Deadline
  const handleToggleDeadline = (deadlineId: string) => {
    setDeadlines((prev) => {
      const next = prev.map((d) => (d.id === deadlineId ? { ...d, completed: !d.completed } : d));
      try {
        localStorage.setItem(STORAGE_PORTAL_DEADLINES, JSON.stringify(next));
      } catch (err) {
        console.error(err);
      }
      return next;
    });
    onShowToast(`Court docket milestone status updated.`, 'info');
  };

  // Add Document
  const handleAddDocument = (doc: ClientDocument) => {
    setDocuments((prev) => {
      const next = [doc, ...prev];
      try {
        localStorage.setItem(STORAGE_PORTAL_DOCS, JSON.stringify(next));
      } catch (err) {
        console.error(err);
      }
      return next;
    });
    onShowToast(`Evidence file "${doc.fileName}" securely uploaded to vault.`, 'success');
  };

  // Toggle Document Verification
  const handleToggleDocumentVerification = (docId: string, note?: string) => {
    setDocuments((prev) => {
      const next = prev.map((doc) => {
        if (doc.id === docId) {
          const isNowVerified = !doc.verifiedByLawyer;
          return {
            ...doc,
            verifiedByLawyer: isNowVerified,
            verifiedAt: isNowVerified ? new Date().toISOString() : undefined,
            verificationNote: note || doc.verificationNote
          };
        }
        return doc;
      });
      try {
        localStorage.setItem(STORAGE_PORTAL_DOCS, JSON.stringify(next));
      } catch (err) {
        console.error(err);
      }
      return next;
    });
    onShowToast(`Evidentiary document certification updated.`, 'info');
  };

  // Send Encrypted Message
  const handleSendMessage = (msg: EncryptedMessage) => {
    setMessages((prev) => {
      const next = [...prev, msg];
      try {
        localStorage.setItem(STORAGE_PORTAL_MESSAGES, JSON.stringify(next));
      } catch (err) {
        console.error(err);
      }
      return next;
    });
    onShowToast(`Encrypted dispatch transmitted to matter thread.`, 'success');
  };

  // Subtab navigation within dashboard
  const handleNavigateTab = (tab: string) => {
    if (tab === 'dashboard') onNavigateToSection('Dashboard');
    else if (tab === 'cases') onNavigateToSection('Cases');
    else if (tab === 'appointments') onNavigateToSection('Appointments');
    else if (tab === 'clients') onNavigateToSection('Clients');
    else if (tab === 'documents') onNavigateToSection('Documents');
    else if (tab === 'messages') onNavigateToSection('Messages');
    else if (tab === 'billing') onNavigateToSection('Payments');
    else if (tab === 'analytics') onNavigateToSection('Analytics');
  };

  return (
    <div className="space-y-6">
      <LawyerPortalView
        users={combinedUsers}
        cases={cases}
        documents={documents}
        deadlines={deadlines}
        invoices={invoices}
        timeEntries={timeEntries}
        messages={messages}
        clientRequests={clientRequests}
        userRole="admin"
        isTimerRunning={isTimerRunning}
        timerSeconds={timerSeconds}
        initialLawyerId={initialSelectedLawyerId || combinedUsers[0]?.id}
        onToggleTimer={handleToggleTimer}
        onAcceptClientRequest={handleAcceptClientRequest}
        onDeclineClientRequest={handleDeclineClientRequest}
        onAddCase={handleAddCase}
        onUpdateCaseStatus={handleUpdateCaseStatus}
        onAddTimeEntry={handleAddTimeEntry}
        onAddDeadline={handleAddDeadline}
        onToggleDeadline={handleToggleDeadline}
        onAddDocument={handleAddDocument}
        onToggleDocumentVerification={handleToggleDocumentVerification}
        onSendMessage={handleSendMessage}
        onNavigateTab={handleNavigateTab}
      />
    </div>
  );
};
