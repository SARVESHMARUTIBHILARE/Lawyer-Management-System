import React, { useState, useMemo } from 'react';
import {
  Briefcase,
  UserCheck,
  Clock,
  Calendar,
  FileText,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Send,
  Plus,
  Search,
  Filter,
  DollarSign,
  TrendingUp,
  Scale,
  Eye,
  Lock,
  Download,
  Printer,
  ChevronRight,
  UserPlus,
  ArrowRight,
  ExternalLink,
  Award,
  Sparkles,
  BookOpen,
  CalendarClock,
  Layers,
  History,
  FileCheck,
  Check,
  HelpCircle,
  SlidersHorizontal,
  FolderPlus,
  Fingerprint,
  FileSignature,
  FileSearch,
  Cpu
} from 'lucide-react';
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
  EvidenceProof,
  UserRole,
  ConflictCheckReport,
  ConflictRiskLevel,
  ConflictMatchItem
} from '../types';
import { performAutomatedConflictCheck } from '../utils/conflictCheck';

interface LawyerPortalViewProps {
  users: User[];
  cases: CaseFile[];
  documents: ClientDocument[];
  deadlines: CaseDeadline[];
  invoices: Invoice[];
  timeEntries: TimeEntry[];
  messages: EncryptedMessage[];
  clientRequests: ClientRepresentationRequest[];
  userRole: UserRole;
  isTimerRunning: boolean;
  timerSeconds: number;
  initialLawyerId?: string;
  onSelectLawyer?: (lawyerId: string) => void;
  onToggleTimer: () => void;
  onAcceptClientRequest: (requestId: string, reviewerLawyerName: string) => void;
  onDeclineClientRequest: (requestId: string, reviewerLawyerName: string) => void;
  onAddCase: (newCase: CaseFile) => void;
  onUpdateCaseStatus: (caseId: string, newStatus: CaseStatus) => void;
  onAddTimeEntry: (entry: TimeEntry) => void;
  onAddDeadline: (deadline: CaseDeadline) => void;
  onToggleDeadline: (deadlineId: string) => void;
  onAddDocument: (doc: ClientDocument) => void;
  onToggleDocumentVerification: (docId: string, note?: string) => void;
  onSendMessage: (msg: EncryptedMessage) => void;
  onNavigateTab: (tab: string) => void;
}

export const LawyerPortalView: React.FC<LawyerPortalViewProps> = ({
  users,
  cases,
  documents,
  deadlines,
  invoices,
  timeEntries,
  messages,
  clientRequests,
  userRole,
  isTimerRunning,
  timerSeconds,
  initialLawyerId,
  onSelectLawyer,
  onToggleTimer,
  onAcceptClientRequest,
  onDeclineClientRequest,
  onAddCase,
  onUpdateCaseStatus,
  onAddTimeEntry,
  onAddDeadline,
  onToggleDeadline,
  onAddDocument,
  onToggleDocumentVerification,
  onSendMessage,
  onNavigateTab
}) => {
  // Available firm lawyers
  const lawyerUsers = useMemo(() => {
    return users.filter((u) => u.role === 'admin' || u.role === 'partner' || u.role === 'associate' || u.role === 'paralegal');
  }, [users]);

  // Selected active lawyer persona (defaults to initialLawyerId or first lawyer)
  const [selectedLawyerId, setSelectedLawyerId] = useState<string>(
    initialLawyerId || lawyerUsers[0]?.id || 'u-1'
  );

  React.useEffect(() => {
    if (initialLawyerId) {
      setSelectedLawyerId(initialLawyerId);
    }
  }, [initialLawyerId]);

  const handleSelectLawyer = (id: string) => {
    setSelectedLawyerId(id);
    if (onSelectLawyer) {
      onSelectLawyer(id);
    }
  };

  const selectedLawyer = useMemo(() => {
    return lawyerUsers.find((u) => u.id === selectedLawyerId) || lawyerUsers[0] || users[0];
  }, [lawyerUsers, selectedLawyerId]);

  // Sub-tabs in Lawyer Portal
  const [activeTab, setActiveTab] = useState<'requests' | 'cases' | 'timesheet' | 'deadlines' | 'documents' | 'messaging'>('requests');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [requestFilter, setRequestFilter] = useState<'all' | 'pending' | 'accepted' | 'declined'>('pending');
  const [conflictRiskFilter, setConflictRiskFilter] = useState<'all' | 'flagged' | 'cleared'>('all');

  // Modals state
  const [inspectRequest, setInspectRequest] = useState<ClientRepresentationRequest | null>(null);
  const [declineTargetRequest, setDeclineTargetRequest] = useState<ClientRepresentationRequest | null>(null);
  const [declineReason, setDeclineReason] = useState('Conflict of Interest (Opposing Party Retained)');
  const [acceptModalRequest, setAcceptModalRequest] = useState<ClientRepresentationRequest | null>(null);
  const [viewConsentCertRequest, setViewConsentCertRequest] = useState<ClientRepresentationRequest | null>(null);
  const [viewConflictAuditRequest, setViewConflictAuditRequest] = useState<ClientRepresentationRequest | null>(null);

  // Time logging modal / state
  const [isTimeLogModalOpen, setIsTimeLogModalOpen] = useState(false);
  const [timeLogCaseId, setTimeLogCaseId] = useState('');
  const [timeLogHours, setTimeLogHours] = useState('1.5');
  const [timeLogTaskType, setTimeLogTaskType] = useState('Legal Research & Case Law Analysis');
  const [timeLogDescription, setTimeLogDescription] = useState('');

  // Quick message state
  const [quickMsgCaseId, setQuickMsgCaseId] = useState('');
  const [quickMsgText, setQuickMsgText] = useState('');
  const [isPrivilegedDisclaimer, setIsPrivilegedDisclaimer] = useState(true);

  // New Deadline Modal state
  const [isDeadlineModalOpen, setIsDeadlineModalOpen] = useState(false);
  const [newDeadlineCaseId, setNewDeadlineCaseId] = useState('');
  const [newDeadlineTitle, setNewDeadlineTitle] = useState('');
  const [newDeadlineDate, setNewDeadlineDate] = useState(new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 10));
  const [newDeadlinePriority, setNewDeadlinePriority] = useState<CaseDeadline['priority']>('high');
  const [newDeadlineType, setNewDeadlineType] = useState<CaseDeadline['type']>('court_appearance');

  // Toast feedback
  const [bannerAlert, setBannerAlert] = useState<{ title: string; desc: string; type: 'success' | 'info' | 'warning' } | null>(null);

  const showToast = (title: string, desc: string, type: 'success' | 'info' | 'warning' = 'success') => {
    setBannerAlert({ title, desc, type });
    setTimeout(() => {
      setBannerAlert(null);
    }, 4500);
  };

  // Filtered assigned cases for the selected lawyer
  const lawyerCases = useMemo(() => {
    return cases.filter((c) => {
      const matchLawyer =
        selectedLawyerId === 'all'
          ? true
          : c.assignedLawyerId === selectedLawyer.id ||
            c.assignedLawyerName?.toLowerCase().includes(selectedLawyer.name.toLowerCase()) ||
            selectedLawyer.name.toLowerCase().includes(c.assignedLawyerName?.toLowerCase());
      const matchStatus = statusFilter === 'all' || c.status === statusFilter;
      const matchSearch =
        searchQuery === '' ||
        c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.caseNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.clientName.toLowerCase().includes(searchQuery.toLowerCase());
      return matchLawyer && matchStatus && matchSearch;
    });
  }, [cases, selectedLawyerId, selectedLawyer, statusFilter, searchQuery]);

  // Conflict Check Helper using Automated Fuzzy Engine
  const getConflictReport = (req: ClientRepresentationRequest): ConflictCheckReport => {
    if (req.conflictCheckReport) {
      return req.conflictCheckReport;
    }
    return performAutomatedConflictCheck({
      clientName: req.clientName,
      opposingParty: req.opposingParty,
      relatedParties: req.relatedParties,
      caseSummary: req.caseSummary,
      requestTitle: req.requestTitle,
      cases,
      existingRequests: clientRequests
    });
  };

  // Representation requests targeted to or general for this lawyer
  const filteredRequests = useMemo(() => {
    return clientRequests.filter((r) => {
      const matchStatus = requestFilter === 'all' || r.status === requestFilter;
      const report = getConflictReport(r);
      const matchConflict =
        conflictRiskFilter === 'all'
          ? true
          : conflictRiskFilter === 'flagged'
          ? report.riskLevel === 'critical' || report.riskLevel === 'high' || report.riskLevel === 'medium'
          : report.riskLevel === 'clear' || report.riskLevel === 'low';
      const matchSearch =
        searchQuery === '' ||
        r.requestTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.practiceArea.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (r.opposingParty && r.opposingParty.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchStatus && matchConflict && matchSearch;
    });
  }, [clientRequests, requestFilter, conflictRiskFilter, searchQuery, cases]);

  const pendingRequestsCount = useMemo(() => {
    return clientRequests.filter((r) => r.status === 'pending').length;
  }, [clientRequests]);

  // Flagged conflicts count
  const flaggedConflictsCount = useMemo(() => {
    return clientRequests.filter((r) => {
      const report = getConflictReport(r);
      return report.riskLevel === 'critical' || report.riskLevel === 'high' || report.riskLevel === 'medium';
    }).length;
  }, [clientRequests, cases]);

  // Lawyer time entries
  const lawyerTimeEntries = useMemo(() => {
    return timeEntries.filter((t) => {
      return (
        selectedLawyerId === 'all' ||
        t.lawyerId === selectedLawyer.id ||
        t.lawyerName?.toLowerCase().includes(selectedLawyer.name.toLowerCase())
      );
    });
  }, [timeEntries, selectedLawyerId, selectedLawyer]);

  const totalBillableHoursLogged = useMemo(() => {
    return lawyerTimeEntries.reduce((sum, t) => sum + t.hours, 0);
  }, [lawyerTimeEntries]);

  const totalBilledValue = useMemo(() => {
    return lawyerTimeEntries.reduce((sum, t) => sum + t.amount, 0);
  }, [lawyerTimeEntries]);

  // Lawyer Deadlines
  const lawyerDeadlines = useMemo(() => {
    return deadlines.filter((d) => {
      return (
        selectedLawyerId === 'all' ||
        d.assignedTo?.toLowerCase().includes(selectedLawyer.name.toLowerCase()) ||
        lawyerCases.some((c) => c.id === d.caseId)
      );
    });
  }, [deadlines, selectedLawyer, lawyerCases, selectedLawyerId]);

  const upcomingCriticalCount = useMemo(() => {
    return lawyerDeadlines.filter((d) => !d.completed && (d.priority === 'critical' || d.priority === 'high')).length;
  }, [lawyerDeadlines]);

  // Lawyer documents
  const lawyerDocuments = useMemo(() => {
    const caseIds = new Set(lawyerCases.map((c) => c.id));
    return documents.filter((d) => caseIds.has(d.caseId) || selectedLawyerId === 'all');
  }, [documents, lawyerCases, selectedLawyerId]);

  const pendingDocsCount = useMemo(() => {
    return lawyerDocuments.filter((d) => d.verificationStatus === 'Needs Review').length;
  }, [lawyerDocuments]);

  // Format stopwatch
  const formatTimer = (totalSec: number) => {
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Handle Log Time Submit
  const handleSaveTimeEntry = (e: React.FormEvent) => {
    e.preventDefault();
    const targetCaseId = timeLogCaseId || (lawyerCases[0] ? lawyerCases[0].id : cases[0]?.id || 'case-1');
    const targetCase = cases.find((c) => c.id === targetCaseId);
    const hoursNum = parseFloat(timeLogHours) || 1.0;
    const rate = selectedLawyer.hourlyRate || 450;

    const newEntry: TimeEntry = {
      id: `time-${Date.now()}`,
      caseId: targetCaseId,
      caseTitle: targetCase ? targetCase.title : 'Active Matter Consultation',
      lawyerId: selectedLawyer.id,
      lawyerName: selectedLawyer.name,
      date: new Date().toISOString().slice(0, 10),
      hours: hoursNum,
      rate,
      amount: hoursNum * rate,
      description: `${timeLogTaskType}: ${timeLogDescription || 'Counsel engagement & trial preparation.'}`,
      isBilled: false
    };

    onAddTimeEntry(newEntry);
    showToast(
      'Billable Time Recorded',
      `Logged ${hoursNum}h ($${(hoursNum * rate).toLocaleString()}) to ${targetCase?.caseNumber || 'Matter'} for ${selectedLawyer.name}.`,
      'success'
    );
    setIsTimeLogModalOpen(false);
    setTimeLogDescription('');
  };

  // Handle Add Deadline Submit
  const handleCreateDeadlineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeadlineTitle.trim()) return;

    const targetCaseId = newDeadlineCaseId || (lawyerCases[0] ? lawyerCases[0].id : cases[0]?.id || 'case-1');
    const targetCase = cases.find((c) => c.id === targetCaseId);

    const newD: CaseDeadline = {
      id: `d-${Date.now()}`,
      caseId: targetCaseId,
      caseTitle: targetCase ? targetCase.title : 'Litigation Matter',
      title: newDeadlineTitle.trim(),
      dueDate: newDeadlineDate,
      type: newDeadlineType,
      priority: newDeadlinePriority,
      assignedTo: selectedLawyer.name,
      completed: false,
      notes: `Docketed by ${selectedLawyer.name} via Lawyer Portal`
    };

    onAddDeadline(newD);
    showToast('Court Deadline Docketed', `"${newDeadlineTitle}" scheduled for ${newDeadlineDate}.`, 'success');
    setIsDeadlineModalOpen(false);
    setNewDeadlineTitle('');
  };

  // Handle Quick Privileged Message Submit
  const handleSendQuickMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickMsgText.trim()) return;

    const targetCaseId = quickMsgCaseId || (lawyerCases[0] ? lawyerCases[0].id : cases[0]?.id || 'case-1');
    const targetCase = cases.find((c) => c.id === targetCaseId);

    const msg: EncryptedMessage = {
      id: `msg-${Date.now()}`,
      threadId: `thread-${targetCaseId}`,
      caseId: targetCaseId,
      senderId: selectedLawyer.id,
      senderName: `${selectedLawyer.name} (${selectedLawyer.title})`,
      senderRole: 'associate',
      recipientId: targetCase ? targetCase.clientName : 'Client Representative',
      recipientName: targetCase ? targetCase.clientName : 'Client',
      encryptedContent: btoa(quickMsgText.trim()),
      decryptedContent: quickMsgText.trim(),
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      isEncrypted: true,
      keyFingerprint: 'SHA256: 7F4A:9C2E:3D11:A4B8',
      attachments: []
    };

    onSendMessage(msg);
    showToast('Privileged Message Dispatched', `Sent confidential counsel notice to ${targetCase?.clientName || 'Client'}.`, 'success');
    setQuickMsgText('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner Alert Feedback */}
      {bannerAlert && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between shadow-sm animate-in slide-in-from-top-2 ${
            bannerAlert.type === 'success'
              ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
              : bannerAlert.type === 'warning'
              ? 'bg-amber-50 border-amber-200 text-amber-900'
              : 'bg-blue-50 border-blue-200 text-blue-900'
          }`}
        >
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold text-xs">{bannerAlert.title}</p>
              <p className="text-xs opacity-90">{bannerAlert.desc}</p>
            </div>
          </div>
          <button onClick={() => setBannerAlert(null)} className="text-xs font-bold px-2 py-1 hover:underline">
            Dismiss
          </button>
        </div>
      )}

      {/* Main Lawyer Header & Active Counsel Profile Switcher */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        {/* Top Header Tag */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Main Lawyer Dashboard & Counsel Cockpit
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
              Live Workstation
            </span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono hidden sm:inline">
            Active Docket Q3 2026
          </span>
        </div>

        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <img
                src={selectedLawyer.avatarUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'}
                alt={selectedLawyer.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-blue-600 shadow-sm"
              />
              <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full" title="Active Bar Counsel" />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold text-slate-900 font-sans tracking-tight">{selectedLawyer.name}</h1>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wide flex items-center gap-1">
                  <Scale className="w-3 h-3 text-blue-600" />
                  <span>{selectedLawyer.title}</span>
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                  Rate: ${selectedLawyer.hourlyRate}/hr
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-emerald-600" />
                  Bar Certified
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {selectedLawyer.department} • Bar ID #BAR-2026-098 • E2EE Digital Signature Key Active
              </p>
            </div>
          </div>

          {/* Quick Action Buttons for Lawyers */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => setIsTimeLogModalOpen(true)}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
            >
              <Clock className="w-3.5 h-3.5 text-blue-200" />
              <span>Log Billable Time</span>
            </button>

            <button
              onClick={() => setIsDeadlineModalOpen(true)}
              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
            >
              <CalendarClock className="w-3.5 h-3.5 text-purple-300" />
              <span>Docket Hearing</span>
            </button>

            <button
              onClick={onToggleTimer}
              className={`px-3 py-1.5 rounded-md font-bold text-xs flex items-center gap-1.5 shadow-sm transition border ${
                isTimerRunning
                  ? 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100 animate-pulse'
                  : 'bg-slate-100 border-slate-300 text-slate-700 hover:bg-slate-200'
              }`}
              title="Stopwatch billable timer"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{isTimerRunning ? `Timer: ${formatTimer(timerSeconds)} (Pause)` : 'Start Stopwatch'}</span>
            </button>
          </div>
        </div>

        {/* Lawyer Selector & Persona Switcher Row */}
        <div className="bg-slate-50 p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
          {/* Row 1: Workstation Selector & System Badges */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2.5 flex-1 min-w-0">
              <div className="flex items-center gap-2 shrink-0">
                <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700">
                  <UserCheck className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-800 tracking-tight whitespace-nowrap">
                  Select Lawyer Workstation:
                </span>
              </div>

              {/* Quick dropdown for all 50+ lawyers */}
              <div className="relative flex-1 max-w-lg min-w-0">
                <select
                  aria-label="Select Chambers Attorney Persona"
                  value={selectedLawyerId}
                  onChange={(e) => handleSelectLawyer(e.target.value)}
                  className="w-full text-xs font-semibold py-2 pl-3 pr-8 rounded-xl bg-white border border-slate-300 text-slate-900 shadow-2xs focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition truncate cursor-pointer"
                >
                  <option value="all">★ All Firm Matters (Consolidated Chambers View)</option>
                  <optgroup label="Firm Lawyers & Partners (50 Attorneys)">
                    {lawyerUsers.map((lawyer) => (
                      <option key={lawyer.id} value={lawyer.id}>
                        {lawyer.name} • {lawyer.title || lawyer.department} (${lawyer.hourlyRate}/hr)
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>
            </div>

            {/* Right Status Badges */}
            <div className="flex items-center gap-2 text-xs shrink-0 self-start lg:self-auto">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>50 Lawyers Integrated</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 font-medium text-[11px]">
                <Lock className="w-3 h-3 text-blue-600 shrink-0" />
                <span>Privileged Workstation</span>
              </span>
            </div>
          </div>

          {/* Row 2: Quick Chambers Switch Pills - Clean horizontal scroll with no vertical stacking */}
          <div className="flex items-center gap-2 pt-2 border-t border-slate-200/70">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider shrink-0 hidden sm:flex items-center gap-1">
              <span>Quick Switch:</span>
            </span>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5 flex-1 min-w-0">
              <button
                type="button"
                onClick={() => handleSelectLawyer('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition shrink-0 whitespace-nowrap flex items-center gap-1.5 ${
                  selectedLawyerId === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
                }`}
              >
                <span>★ All Matters</span>
              </button>

              {lawyerUsers.slice(0, 6).map((lawyer) => {
                const isSelected = selectedLawyerId === lawyer.id;
                const cleanName = lawyer.name.replace(', Esq.', '').trim();
                return (
                  <button
                    type="button"
                    key={lawyer.id}
                    onClick={() => handleSelectLawyer(lawyer.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition shrink-0 whitespace-nowrap flex items-center gap-1.5 ${
                      isSelected
                        ? 'bg-blue-600 text-white font-bold shadow-xs'
                        : 'bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
                    }`}
                  >
                    <span>{cleanName}</span>
                    <span
                      className={`text-[10px] font-mono px-1 py-0.2 rounded ${
                        isSelected
                          ? 'bg-blue-700 text-blue-100'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      ${lawyer.hourlyRate}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Top Metric Cards for Active Lawyer */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 pt-2">
          {/* Pending Inquiries */}
          <div
            onClick={() => setActiveTab('requests')}
            className={`p-3.5 rounded-xl border transition cursor-pointer ${
              activeTab === 'requests'
                ? 'bg-amber-50/80 border-amber-300 ring-2 ring-amber-400/30'
                : 'bg-white border-slate-200 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span className="font-semibold">Incoming Requests</span>
              <UserPlus className="w-4 h-4 text-amber-500" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-xl font-bold font-mono text-slate-900">{pendingRequestsCount}</span>
              <span className="text-[11px] font-semibold text-amber-600 bg-amber-100 px-1.5 py-0.5 rounded">Action Req</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 truncate">Triage & conflict check</p>
          </div>

          {/* Assigned Active Cases */}
          <div
            onClick={() => setActiveTab('cases')}
            className={`p-3.5 rounded-xl border transition cursor-pointer ${
              activeTab === 'cases'
                ? 'bg-blue-50/80 border-blue-300 ring-2 ring-blue-400/30'
                : 'bg-white border-slate-200 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span className="font-semibold">Assigned Docket</span>
              <Briefcase className="w-4 h-4 text-blue-600" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-xl font-bold font-mono text-slate-900">{lawyerCases.length}</span>
              <span className="text-[11px] font-semibold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">Active</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 truncate">Active litigation matters</p>
          </div>

          {/* Billable Hours */}
          <div
            onClick={() => setActiveTab('timesheet')}
            className={`p-3.5 rounded-xl border transition cursor-pointer ${
              activeTab === 'timesheet'
                ? 'bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-400/30'
                : 'bg-white border-slate-200 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span className="font-semibold">Billable Time</span>
              <DollarSign className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-xl font-bold font-mono text-emerald-700">{totalBillableHoursLogged.toFixed(1)}h</span>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                ${(totalBilledValue / 1000).toFixed(0)}k
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1 truncate">Logged timesheet WIP</p>
          </div>

          {/* Critical Deadlines */}
          <div
            onClick={() => setActiveTab('deadlines')}
            className={`p-3.5 rounded-xl border transition cursor-pointer ${
              activeTab === 'deadlines'
                ? 'bg-purple-50/80 border-purple-300 ring-2 ring-purple-400/30'
                : 'bg-white border-slate-200 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span className="font-semibold">Court Deadlines</span>
              <CalendarClock className="w-4 h-4 text-purple-600" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-xl font-bold font-mono text-purple-900">{lawyerDeadlines.filter((d) => !d.completed).length}</span>
              {upcomingCriticalCount > 0 && (
                <span className="text-[11px] font-semibold text-rose-700 bg-rose-100 px-1.5 py-0.5 rounded">
                  {upcomingCriticalCount} Critical
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-1 truncate">Hearings & statutory dates</p>
          </div>

          {/* Evidence Verification */}
          <div
            onClick={() => setActiveTab('documents')}
            className={`p-3.5 rounded-xl border transition cursor-pointer ${
              activeTab === 'documents'
                ? 'bg-slate-100 border-slate-300 ring-2 ring-slate-400/30'
                : 'bg-white border-slate-200 hover:bg-slate-50'
            }`}
          >
            <div className="flex items-center justify-between text-slate-500 text-xs">
              <span className="font-semibold">Evidence Vault</span>
              <FileCheck className="w-4 h-4 text-slate-700" />
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-xl font-bold font-mono text-slate-900">{lawyerDocuments.length}</span>
              {pendingDocsCount > 0 && (
                <span className="text-[11px] font-semibold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">
                  {pendingDocsCount} Review
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 mt-1 truncate">SHA-256 custody pleadings</p>
          </div>
        </div>
      </div>

      {/* Main Tab Navigation for Lawyers */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-2">
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setActiveTab('requests')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'requests'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Incoming Client Requests</span>
            {pendingRequestsCount > 0 && (
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${activeTab === 'requests' ? 'bg-white text-blue-600' : 'bg-amber-500 text-white'}`}>
                {pendingRequestsCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('cases')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'cases'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Briefcase className="w-4 h-4" />
            <span>Assigned Cases Docket ({lawyerCases.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('timesheet')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'timesheet'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>Timesheet & Billing ({totalBillableHoursLogged.toFixed(1)}h)</span>
          </button>

          <button
            onClick={() => setActiveTab('deadlines')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'deadlines'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <CalendarClock className="w-4 h-4" />
            <span>Court Calendar ({lawyerDeadlines.filter((d) => !d.completed).length})</span>
          </button>

          <button
            onClick={() => setActiveTab('documents')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'documents'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Evidence & Pleadings Vault</span>
          </button>

          <button
            onClick={() => setActiveTab('messaging')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'messaging'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>Client Communications</span>
          </button>
        </div>

        {/* Global Search & Filter Bar */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search docket, clients, matters..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-48 sm:w-64"
            />
          </div>
        </div>
      </div>

      {/* TAB 1: INCOMING REPRESENTATION REQUESTS & CONFLICT CLEARANCE */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <UserPlus className="w-4 h-4 text-blue-600" />
                <span>Client Representation Requests & Triage Queue</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Review prospective client submissions, evaluate case merits, perform automated conflict checks, and accept matters into your active docket.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-500">Status:</span>
                <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                  {(['pending', 'accepted', 'declined', 'all'] as const).map((tabKey) => (
                    <button
                      key={tabKey}
                      onClick={() => setRequestFilter(tabKey)}
                      className={`px-3 py-1 rounded text-xs font-bold capitalize transition ${
                        requestFilter === tabKey ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {tabKey}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-500">Conflict Risk:</span>
                <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                  <button
                    onClick={() => setConflictRiskFilter('all')}
                    className={`px-2.5 py-1 rounded text-xs font-bold transition ${
                      conflictRiskFilter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setConflictRiskFilter('cleared')}
                    className={`px-2.5 py-1 rounded text-xs font-bold transition ${
                      conflictRiskFilter === 'cleared' ? 'bg-white text-emerald-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Clean
                  </button>
                  <button
                    onClick={() => setConflictRiskFilter('flagged')}
                    className={`px-2.5 py-1 rounded text-xs font-bold transition flex items-center gap-1 ${
                      conflictRiskFilter === 'flagged' ? 'bg-white text-rose-800 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <span>Flagged</span>
                    {flaggedConflictsCount > 0 && (
                      <span className="px-1.5 py-0.2 bg-rose-600 text-white rounded-full text-[10px] font-mono">
                        {flaggedConflictsCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          {filteredRequests.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="font-bold text-slate-800 text-sm">No Representation Requests in Queue</h3>
              <p className="text-xs max-w-md mx-auto text-slate-500">
                There are currently no requests matching the filter criteria. New prospective client inquiries will appear here in real-time.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredRequests.map((req) => {
                const report = getConflictReport(req);
                const isHighRisk = report.riskLevel === 'critical' || report.riskLevel === 'high';
                const isMediumRisk = report.riskLevel === 'medium';
                return (
                  <div
                    key={req.id}
                    className={`bg-white border rounded-xl p-5 shadow-sm transition space-y-4 ${
                      isHighRisk
                        ? 'border-rose-300 ring-1 ring-rose-200'
                        : req.status === 'pending'
                        ? 'border-amber-200 hover:border-blue-300'
                        : req.status === 'accepted'
                        ? 'border-emerald-200 bg-emerald-50/20'
                        : 'border-slate-200 opacity-75'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              req.status === 'pending'
                                ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                : req.status === 'accepted'
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-slate-100 text-slate-700 border border-slate-300'
                            }`}
                          >
                            {req.status}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                            {req.practiceArea}
                          </span>
                          {req.urgencyLevel && req.urgencyLevel.includes('Urgent') && (
                            <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 text-[11px] font-bold border border-rose-200 flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3 text-rose-600" />
                              {req.urgencyLevel}
                            </span>
                          )}
                          <span className="text-xs text-slate-400">Submitted: {req.submittedAt}</span>
                        </div>

                        <h3 className="text-base font-bold text-slate-900 mt-1">{req.requestTitle}</h3>
                        <p className="text-xs text-slate-600 font-semibold">
                          Client: <span className="text-blue-700">{req.clientName}</span> ({req.clientEmail}
                          {req.clientPhone ? ` • ${req.clientPhone}` : ''})
                        </p>
                      </div>

                      {/* Estimated Retainer Budget */}
                      <div className="text-right sm:text-right shrink-0 bg-slate-50 border border-slate-200 p-2.5 rounded-lg">
                        <span className="text-[11px] font-semibold text-slate-500 block">Proposed Retainer Budget</span>
                        <span className="text-base font-mono font-bold text-emerald-700">
                          ${(req.estimatedBudget || 25000).toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Case Summary */}
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-700 space-y-1.5">
                      <span className="font-bold text-slate-900 block">Matter Brief & Incident Facts:</span>
                      <p className="leading-relaxed">{req.caseSummary}</p>
                      <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-500 pt-1 border-t border-slate-200 mt-2">
                        {req.opposingParty && (
                          <span>
                            Opposing Party: <strong className="text-slate-800">{req.opposingParty}</strong>
                          </span>
                        )}
                        {req.incidentDate && (
                          <span>
                            Incident / Filing Date: <strong className="text-slate-800">{req.incidentDate}</strong>
                          </span>
                        )}
                        {req.preferredLawyerName && (
                          <span>
                            Requested Counsel: <strong className="text-blue-700">{req.preferredLawyerName}</strong>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Automated Conflict of Interest Clearance Banner */}
                    <div
                      className={`p-3 rounded-xl border text-xs space-y-2 ${
                        isHighRisk
                          ? 'bg-rose-50/90 border-rose-200 text-rose-950'
                          : isMediumRisk
                          ? 'bg-amber-50/90 border-amber-200 text-amber-950'
                          : 'bg-emerald-50/90 border-emerald-200 text-emerald-950'
                      }`}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          {isHighRisk ? (
                            <div className="w-6 h-6 rounded-md bg-rose-600 text-white flex items-center justify-center shrink-0">
                              <AlertTriangle className="w-3.5 h-3.5" />
                            </div>
                          ) : isMediumRisk ? (
                            <div className="w-6 h-6 rounded-md bg-amber-500 text-white flex items-center justify-center shrink-0">
                              <AlertTriangle className="w-3.5 h-3.5" />
                            </div>
                          ) : (
                            <div className="w-6 h-6 rounded-md bg-emerald-600 text-white flex items-center justify-center shrink-0">
                              <ShieldCheck className="w-3.5 h-3.5" />
                            </div>
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold uppercase tracking-wider text-[11px]">
                                Automated Conflict Check: {report.riskLevel.toUpperCase()} RISK
                              </span>
                              <span
                                className={`px-2 py-0.2 rounded-full font-mono text-[10px] font-bold border ${
                                  isHighRisk
                                    ? 'bg-rose-100 text-rose-800 border-rose-300'
                                    : isMediumRisk
                                    ? 'bg-amber-100 text-amber-800 border-amber-300'
                                    : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                }`}
                              >
                                Match Score: {report.overallScore}%
                              </span>
                            </div>
                            <p className="text-[11px] font-medium opacity-90">{report.summary}</p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => setViewConflictAuditRequest(req)}
                          className={`px-2.5 py-1 rounded text-[11px] font-bold border flex items-center gap-1.5 shadow-2xs transition ${
                            isHighRisk
                              ? 'bg-white hover:bg-rose-100 text-rose-800 border-rose-300'
                              : isMediumRisk
                              ? 'bg-white hover:bg-amber-100 text-amber-800 border-amber-300'
                              : 'bg-white hover:bg-emerald-100 text-emerald-800 border-emerald-300'
                          }`}
                        >
                          <Cpu className="w-3.5 h-3.5" />
                          <span>Audit Fuzzy Metrics</span>
                        </button>
                      </div>

                      {/* Top matched item quick preview if high or medium risk */}
                      {report.matches && report.matches.length > 0 && (
                        <div className="pt-2 border-t border-black/5 flex flex-wrap items-center gap-2 text-[11px]">
                          <span className="font-semibold">Top Conflict Hit:</span>
                          <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200">
                            {report.matches[0].queryTerm} ➔ {report.matches[0].matchedEntityName}
                          </span>
                          <span className="font-mono text-xs font-bold text-slate-700">
                            ({report.matches[0].similarityScore}% Fuzzy Match in {report.matches[0].matchedCaseNumber})
                          </span>
                          <span className="text-slate-600 truncate max-w-xs">{report.matches[0].matchedCaseTitle}</span>
                        </div>
                      )}
                    </div>

                    {/* Evidence Exhibits Attached */}
                    {req.evidenceList && req.evidenceList.length > 0 && (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-slate-700 flex items-center gap-1.5">
                            <FileText className="w-3.5 h-3.5 text-blue-600" />
                            <span>Client Attached Evidence Exhibits ({req.evidenceList.length})</span>
                          </span>
                          <button
                            onClick={() => setInspectRequest(req)}
                            className="text-blue-600 hover:text-blue-800 font-bold text-xs flex items-center gap-1"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Inspect All Exhibits</span>
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {req.evidenceList.map((ev) => (
                            <div
                              key={ev.id}
                              className="px-2.5 py-1.5 bg-slate-100 border border-slate-200 rounded-md text-xs flex items-center gap-2"
                            >
                              <FileCheck className="w-3.5 h-3.5 text-slate-600" />
                              <span className="font-semibold text-slate-800 max-w-[180px] truncate">{ev.title}</span>
                              <span className="text-[10px] text-slate-400 font-mono">({ev.fileSize || '1.8 MB'})</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Digital Consent Intake Status Strip */}
                    <div className="pt-1">
                      {req.digitalConsent && req.digitalConsent.agreed && req.digitalConsent.consentedAt ? (
                        <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg flex flex-wrap items-center justify-between gap-2 text-xs">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-6 h-6 rounded bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                              <Fingerprint className="w-3.5 h-3.5" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-[11px] font-bold text-emerald-900 flex items-center gap-1.5 flex-wrap">
                                <span>Digital Client Consent Stamped</span>
                                <span className="font-mono text-[10px] text-emerald-700 font-normal">
                                  • {req.digitalConsent.consentedAt}
                                </span>
                              </div>
                              <div className="text-[10px] text-emerald-700 truncate">
                                Authorized by: <span className="font-semibold text-slate-800">{req.digitalConsent.consentedBy}</span> ({req.digitalConsent.signerRole || 'Authorized Officer'}) • Hash: <span className="font-mono">{req.digitalConsent.consentHash?.slice(0, 18)}...</span>
                              </div>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setViewConsentCertRequest(req)}
                            className="px-2.5 py-1 bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded text-[10px] font-bold shadow-xs transition flex items-center gap-1 shrink-0"
                          >
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                            <span>Audit Certificate</span>
                          </button>
                        </div>
                      ) : (
                        <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg flex flex-wrap items-center justify-between gap-2 text-xs">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className="w-6 h-6 rounded bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                              <AlertTriangle className="w-3.5 h-3.5" />
                            </div>
                            <div className="min-w-0">
                              <div className="text-[11px] font-bold text-amber-900">
                                Digital Consent Missing / Pending Client Execution
                              </div>
                              <p className="text-[10px] text-amber-700">
                                State Bar ethics mandate a verified timestamped digital consent record before formal engagement acceptance.
                              </p>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-200/80 text-amber-900 border border-amber-300 shrink-0">
                            Acceptance Locked
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Lawyer Actions */}
                    <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                      <div className="text-xs text-slate-500">
                        {req.status === 'accepted' && (
                          <span className="text-emerald-700 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Accepted by {req.reviewedBy || 'Counsel'} on {req.reviewedAt || 'Recently'}. Matter Active in Docket.
                          </span>
                        )}
                        {req.status === 'declined' && (
                          <span className="text-rose-700 font-semibold flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5 text-rose-600" />
                            Declined by {req.reviewedBy || 'Counsel'} on {req.reviewedAt || 'Recently'}.
                          </span>
                        )}
                        {req.status === 'pending' && (
                          <span className="text-amber-700 font-semibold">
                            {req.digitalConsent && req.digitalConsent.agreed && req.digitalConsent.consentedAt
                              ? 'Consent verified • Ready for Immediate Acceptance'
                              : 'Pending client digital consent signature'}
                          </span>
                        )}
                      </div>

                      {req.status === 'pending' && (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setInspectRequest(req)}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-semibold text-xs transition"
                          >
                            Inspect Details
                          </button>

                          <button
                            onClick={() => setDeclineTargetRequest(req)}
                            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-md font-semibold text-xs transition"
                          >
                            Decline Request
                          </button>

                          {req.digitalConsent && req.digitalConsent.agreed && req.digitalConsent.consentedAt ? (
                            <button
                              onClick={() => {
                                onAcceptClientRequest(req.id, selectedLawyer.name);
                                showToast(
                                  'Representation Accepted!',
                                  `Successfully opened matter for ${req.clientName} and assigned to ${selectedLawyer.name}.`,
                                  'success'
                                );
                              }}
                              className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
                            >
                              <Check className="w-4 h-4" />
                              <span>Accept & Open Matter</span>
                            </button>
                          ) : (
                            <button
                              disabled
                              title="Client must execute timestamped digital consent before representation can be formally accepted."
                              className="px-4 py-1.5 bg-slate-200 text-slate-400 rounded-md font-bold text-xs flex items-center gap-1.5 cursor-not-allowed opacity-75"
                            >
                              <Lock className="w-3.5 h-3.5" />
                              <span>Consent Required to Accept</span>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ASSIGNED CASES DOCKET */}
      {activeTab === 'cases' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-blue-600" />
                <span>Active Assigned Practice Docket</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Litigation and transactional matters managed by <strong>{selectedLawyer.name}</strong>.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-xs text-slate-800 font-semibold"
              >
                <option value="all">All Statuses</option>
                <option value="intake">Intake</option>
                <option value="discovery">Discovery</option>
                <option value="pre_trial">Pre-Trial</option>
                <option value="trial">Trial</option>
                <option value="settlement">Settlement</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lawyerCases.map((c) => {
              const retainerPct = Math.round((c.retainerRemaining / (c.retainerAmount || 1)) * 100);
              return (
                <div
                  key={c.id}
                  className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm hover:border-blue-300 transition space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {c.caseNumber}
                      </span>
                      <select
                        value={c.status}
                        onChange={(e) => {
                          onUpdateCaseStatus(c.id, e.target.value as CaseStatus);
                          showToast('Matter Status Updated', `Case ${c.caseNumber} moved to ${e.target.value.toUpperCase()}.`, 'info');
                        }}
                        className={`text-xs font-bold rounded px-2 py-0.5 border cursor-pointer ${
                          c.status === 'trial'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : c.status === 'discovery'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : c.status === 'settlement'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-slate-100 text-slate-800 border-slate-200'
                        }`}
                      >
                        <option value="intake">Intake</option>
                        <option value="discovery">Discovery</option>
                        <option value="pre_trial">Pre-Trial</option>
                        <option value="trial">Trial</option>
                        <option value="settlement">Settlement</option>
                        <option value="closed">Closed</option>
                      </select>
                    </div>

                    <h3 className="font-bold text-slate-900 text-sm">{c.title}</h3>
                    <p className="text-xs text-slate-500 line-clamp-2">{c.description}</p>

                    <div className="pt-2 flex items-center justify-between text-xs text-slate-600">
                      <span>
                        Client: <strong className="text-slate-800">{c.clientName}</strong>
                      </span>
                      <span className="font-semibold text-slate-500">{c.practiceArea}</span>
                    </div>

                    {/* Retainer Progress */}
                    <div className="space-y-1 pt-1">
                      <div className="flex justify-between text-[11px]">
                        <span className="text-slate-500 font-semibold">Retainer Balance</span>
                        <span className="font-mono font-bold text-slate-800">
                          ${c.retainerRemaining.toLocaleString()} / ${c.retainerAmount.toLocaleString()} ({retainerPct}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            retainerPct < 25 ? 'bg-rose-500' : retainerPct < 50 ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(100, Math.max(0, retainerPct))}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Case Action Row */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        setTimeLogCaseId(c.id);
                        setIsTimeLogModalOpen(true);
                      }}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-semibold flex items-center gap-1 transition"
                    >
                      <Clock className="w-3 h-3 text-blue-600" />
                      <span>Log Time</span>
                    </button>

                    <button
                      onClick={() => {
                        setQuickMsgCaseId(c.id);
                        setActiveTab('messaging');
                      }}
                      className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-xs font-semibold flex items-center gap-1 transition"
                    >
                      <MessageSquare className="w-3 h-3 text-emerald-600" />
                      <span>Message Client</span>
                    </button>

                    <button
                      onClick={() => {
                        setNewDeadlineCaseId(c.id);
                        setIsDeadlineModalOpen(true);
                      }}
                      className="px-2.5 py-1 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md text-xs font-semibold flex items-center gap-1 transition"
                    >
                      <CalendarClock className="w-3 h-3 text-blue-600" />
                      <span>Docket</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: TIMESHEET & BILLABLE WORKLOG */}
      {activeTab === 'timesheet' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Timesheet & Hourly Billables ({selectedLawyer.name})</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Record contemporaneous billable entries, track hourly realization, and submit entries to firm accounting.
              </p>
            </div>

            <button
              onClick={() => setIsTimeLogModalOpen(true)}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              <span>Record New Time Entry</span>
            </button>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Matter / Case</th>
                  <th className="px-4 py-3">Activity Description</th>
                  <th className="px-4 py-3 text-right">Hours</th>
                  <th className="px-4 py-3 text-right">Rate</th>
                  <th className="px-4 py-3 text-right">Amount</th>
                  <th className="px-4 py-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {lawyerTimeEntries.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-4 py-3 font-mono text-slate-600 whitespace-nowrap">{t.date}</td>
                    <td className="px-4 py-3 font-semibold text-slate-900 max-w-[200px] truncate">{t.caseTitle}</td>
                    <td className="px-4 py-3 text-slate-600 max-w-[320px] truncate">{t.description}</td>
                    <td className="px-4 py-3 text-right font-mono font-bold">{t.hours}h</td>
                    <td className="px-4 py-3 text-right font-mono text-slate-500">${t.rate}/hr</td>
                    <td className="px-4 py-3 text-right font-mono font-bold text-emerald-700">${t.amount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          t.isBilled
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {t.isBilled ? 'Billed' : 'Unbilled WIP'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: COURT APPEARANCES & DEADLINES CALENDAR */}
      {activeTab === 'deadlines' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <CalendarClock className="w-4 h-4 text-purple-600" />
                <span>Court Docket & Critical Deadlines</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Filing cut-offs, motion hearings, depositions, and discovery responses assigned to <strong>{selectedLawyer.name}</strong>.
              </p>
            </div>

            <button
              onClick={() => setIsDeadlineModalOpen(true)}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              <span>Docket New Hearing / Deadline</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {lawyerDeadlines.map((d) => (
              <div
                key={d.id}
                className={`p-4 rounded-xl border transition flex items-start justify-between gap-3 ${
                  d.completed
                    ? 'bg-slate-50 border-slate-200 opacity-60'
                    : d.priority === 'critical'
                    ? 'bg-rose-50/40 border-rose-200'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        d.priority === 'critical'
                          ? 'bg-rose-100 text-rose-800'
                          : d.priority === 'high'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {d.priority}
                    </span>
                    <span className="text-xs font-mono font-bold text-slate-700">{d.dueDate}</span>
                  </div>

                  <h3 className={`font-bold text-xs text-slate-900 ${d.completed ? 'line-through' : ''}`}>{d.title}</h3>
                  <p className="text-[11px] text-slate-500 truncate">{d.caseTitle}</p>
                </div>

                <button
                  onClick={() => onToggleDeadline(d.id)}
                  className={`p-2 rounded-lg border text-xs font-bold transition flex items-center gap-1 shrink-0 ${
                    d.completed
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-white hover:bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{d.completed ? 'Completed' : 'Mark Done'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: EVIDENCE & PLEADINGS VAULT */}
      {activeTab === 'documents' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-blue-600" />
                <span>Forensic Evidence & Pleadings Review Vault</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Audit and cryptographically sign client-submitted discovery, witness statements, and contracts with SHA-256 chain of custody.
              </p>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold">
                  <th className="px-4 py-3">Document / Exhibit</th>
                  <th className="px-4 py-3">Matter</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Uploaded By</th>
                  <th className="px-4 py-3">Custody Hash</th>
                  <th className="px-4 py-3 text-center">Verification Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {lawyerDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-50/80 transition">
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900">{doc.fileName}</div>
                      <div className="text-[11px] text-slate-400 font-mono">{doc.fileSize}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-600 max-w-[180px] truncate">{doc.caseTitle}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-semibold text-[10px]">
                        {doc.category}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{doc.uploadedBy}</td>
                    <td className="px-4 py-3 font-mono text-[10px] text-slate-500 max-w-[140px] truncate">
                      {doc.custodyHash || 'SHA256: e3b0c44298fc1c149afbf4c8'}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          doc.verificationStatus === 'Verified'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {doc.verificationStatus || 'Needs Review'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => {
                          onToggleDocumentVerification(doc.id, `Verified by counsel ${selectedLawyer.name}`);
                          showToast('Document Custody Signed', `Updated verification status for "${doc.fileName}".`, 'success');
                        }}
                        className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-bold text-xs transition"
                      >
                        {doc.verificationStatus === 'Verified' ? 'Re-Flag' : 'Verify & Sign'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: PRIVILEGED CLIENT COMMUNICATIONS */}
      {activeTab === 'messaging' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-emerald-600" />
                <span>Privileged Client Communications Vault</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Send confidential, end-to-end encrypted legal notices and updates directly to client corporate portals.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Quick Composer */}
            <div className="lg:col-span-1 bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
              <h3 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5 text-blue-600" />
                <span>Draft Privileged Notice</span>
              </h3>

              <form onSubmit={handleSendQuickMessage} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-600 font-bold mb-1">Target Matter</label>
                  <select
                    value={quickMsgCaseId}
                    onChange={(e) => setQuickMsgCaseId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 font-semibold"
                  >
                    {lawyerCases.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.caseNumber} - {c.clientName}
                      </option>
                    ))}
                    {lawyerCases.length === 0 && <option value="general">General Client Matters</option>}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-600 font-bold mb-1">Confidential Notice Text</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Enter attorney case update, hearing notice, or disclosure request..."
                    value={quickMsgText}
                    onChange={(e) => setQuickMsgText(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 text-xs"
                  />
                </div>

                <label className="flex items-center gap-2 text-slate-700 font-semibold cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isPrivilegedDisclaimer}
                    onChange={(e) => setIsPrivilegedDisclaimer(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600"
                  />
                  <span>Attach Attorney-Client Privilege Notice</span>
                </label>

                <button
                  type="submit"
                  className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Encrypted Notice</span>
                </button>
              </form>
            </div>

            {/* Recent Messages */}
            <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-4 shadow-sm space-y-3">
              <h3 className="font-bold text-slate-900 text-xs">Recent Privileged Message Threads</h3>
              <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                {messages.slice(0, 8).map((m) => (
                  <div key={m.id} className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{m.senderName}</span>
                      <span className="text-[10px] text-slate-400 font-mono">{m.timestamp}</span>
                    </div>
                    <p className="text-slate-700">{m.decryptedContent}</p>
                    <span className="text-[10px] font-semibold text-blue-600 flex items-center gap-1 pt-1">
                      <Lock className="w-2.5 h-2.5" />
                      <span>Attorney-Client Privileged & Work Product</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* INSPECT REQUEST EVIDENCE MODAL */}
      {inspectRequest && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden text-slate-900 my-8 animate-in fade-in">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Scale className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-white text-sm">Case Representation Inquest</h3>
              </div>
              <button onClick={() => setInspectRequest(null)} className="p-1 text-slate-400 hover:text-white rounded">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <span className="text-[11px] font-bold text-blue-600 uppercase">{inspectRequest.practiceArea}</span>
                <h2 className="text-base font-bold text-slate-900">{inspectRequest.requestTitle}</h2>
                <p className="text-slate-600 font-semibold">
                  Client: {inspectRequest.clientName} ({inspectRequest.clientEmail})
                </p>
                <p className="text-slate-700 pt-2 leading-relaxed">{inspectRequest.caseSummary}</p>
              </div>

              {/* Digital Consent Record Inspection */}
              <div className="p-3.5 rounded-xl border text-xs space-y-2 bg-slate-50 border-slate-200">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center gap-1.5">
                    <FileSignature className="w-4 h-4 text-blue-600" />
                    <span>Digital Intake Consent Record:</span>
                  </span>
                  {inspectRequest.digitalConsent?.agreed && inspectRequest.digitalConsent?.consentedAt ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>CONSENT VERIFIED & ACTIVE</span>
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3 text-amber-600" />
                      <span>CONSENT INCOMPLETE</span>
                    </span>
                  )}
                </div>

                {inspectRequest.digitalConsent?.agreed && inspectRequest.digitalConsent?.consentedAt ? (
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-600 pt-1">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Signer Legal Name:</span>
                      <span className="font-bold text-slate-800">{inspectRequest.digitalConsent.consentedBy}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Capacity / Title:</span>
                      <span className="font-semibold text-slate-700">{inspectRequest.digitalConsent.signerRole || 'Corporate Representative'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Timestamped Date:</span>
                      <span className="font-mono text-emerald-700 font-bold">{inspectRequest.digitalConsent.consentedAt}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Standard / Version:</span>
                      <span className="font-semibold text-slate-700">{inspectRequest.digitalConsent.termsVersion || 'v2026.4-ETHICS-ESIGN'}</span>
                    </div>
                    <div className="col-span-2 pt-1 border-t border-slate-200">
                      <span className="text-slate-400 block text-[10px]">Cryptographic Audit Hash:</span>
                      <span className="font-mono text-[10px] text-slate-600 bg-white p-1 rounded border border-slate-200 block truncate">
                        {inspectRequest.digitalConsent.consentHash || 'SHA256:CON-AUDIT-VERIFIED'}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-[11px] text-amber-800 bg-amber-50/80 p-2.5 rounded-lg border border-amber-200">
                    Client has not executed digital consent terms for this inquiry. Acceptance is locked until the prospective client completes electronic verification.
                  </div>
                )}
              </div>

              {/* Automated Conflict Check Section */}
              {(() => {
                const report = getConflictReport(inspectRequest);
                const isHighRisk = report.riskLevel === 'critical' || report.riskLevel === 'high';
                const isMediumRisk = report.riskLevel === 'medium';
                return (
                  <div className="p-3.5 rounded-xl border text-xs space-y-2 bg-slate-50 border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800 flex items-center gap-1.5">
                        <Cpu className="w-4 h-4 text-blue-600" />
                        <span>Automated Conflict of Interest Engine:</span>
                      </span>
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${
                            isHighRisk
                              ? 'bg-rose-100 text-rose-800 border-rose-300'
                              : isMediumRisk
                              ? 'bg-amber-100 text-amber-800 border-amber-300'
                              : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          }`}
                        >
                          {isHighRisk ? (
                            <AlertTriangle className="w-3 h-3 text-rose-600" />
                          ) : (
                            <ShieldCheck className="w-3 h-3 text-emerald-600" />
                          )}
                          <span>{report.riskLevel.toUpperCase()} RISK ({report.overallScore}% MATCH)</span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setViewConflictAuditRequest(inspectRequest)}
                          className="px-2 py-0.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 rounded text-[10px] font-bold transition"
                        >
                          Audit Math
                        </button>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600">{report.summary}</p>

                    {report.matches && report.matches.length > 0 && (
                      <div className="pt-2 border-t border-slate-200 space-y-1.5">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                          Adverse Entity Matches ({report.matches.length})
                        </span>
                        <div className="space-y-1">
                          {report.matches.slice(0, 3).map((match, idx) => (
                            <div
                              key={idx}
                              className="p-2 bg-white rounded border border-slate-200 flex items-center justify-between text-[11px]"
                            >
                              <div>
                                <span className="font-bold text-slate-900">{match.queryTerm}</span>
                                <span className="text-slate-400 mx-1.5">➔</span>
                                <span className="font-semibold text-slate-700">{match.matchedEntityName}</span>
                                <span className="text-[10px] text-slate-400 block font-mono">
                                  Matter {match.matchedCaseNumber} ({match.matchedCaseTitle}) • {match.matchedEntityType}
                                </span>
                              </div>
                              <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200 shrink-0">
                                {match.similarityScore}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Exhibits Breakdown */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 text-xs">Attached Evidentiary Exhibits & Proof Documents:</h4>
                {(!inspectRequest.evidenceList || inspectRequest.evidenceList.length === 0) ? (
                  <p className="text-slate-400 italic">No direct file exhibits attached by client.</p>
                ) : (
                  <div className="space-y-2">
                    {inspectRequest.evidenceList.map((ev) => (
                      <div key={ev.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{ev.title}</span>
                          <span className="text-[10px] font-mono text-slate-500 bg-white px-2 py-0.5 rounded border">
                            {ev.category}
                          </span>
                        </div>
                        <p className="text-slate-600">{ev.description}</p>
                        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 font-mono">
                          <span>File: {ev.fileName}</span>
                          <span>Size: {ev.fileSize || '1.5 MB'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setInspectRequest(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition"
                >
                  Close
                </button>
                {inspectRequest.status === 'pending' && (
                  inspectRequest.digitalConsent?.agreed && inspectRequest.digitalConsent?.consentedAt ? (
                    <button
                      type="button"
                      onClick={() => {
                        onAcceptClientRequest(inspectRequest.id, selectedLawyer.name);
                        setInspectRequest(null);
                        showToast('Representation Accepted', `Opened matter file for ${inspectRequest.clientName}.`, 'success');
                      }}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center gap-1.5 shadow-sm transition"
                    >
                      <Check className="w-4 h-4" />
                      <span>Accept Representation</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      disabled
                      title="Consent required"
                      className="px-4 py-2 bg-slate-200 text-slate-400 rounded-lg font-bold flex items-center gap-1.5 cursor-not-allowed opacity-75"
                    >
                      <Lock className="w-4 h-4" />
                      <span>Consent Required to Accept</span>
                    </button>
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DETAILED CONFLICT OF INTEREST FUZZY MATCH AUDIT MODAL */}
      {viewConflictAuditRequest && (() => {
        const auditReport = getConflictReport(viewConflictAuditRequest);
        const isHigh = auditReport.riskLevel === 'critical' || auditReport.riskLevel === 'high';
        const isMed = auditReport.riskLevel === 'medium';
        return (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <div className="w-full max-w-3xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden text-slate-900 my-8 animate-in fade-in">
              <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-sm">Automated Conflict of Interest Audit</h3>
                    <p className="text-[10px] text-slate-400 font-mono">
                      Multi-Vector Fuzzy String Engine • Jaro-Winkler • Levenshtein • Token Overlap • N-Gram Dice
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setViewConflictAuditRequest(null)}
                  className="p-1 text-slate-400 hover:text-white rounded"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 space-y-4 text-xs max-h-[80vh] overflow-y-auto">
                {/* Risk Level Banner */}
                <div
                  className={`p-4 rounded-xl border space-y-2 ${
                    isHigh
                      ? 'bg-rose-50 border-rose-200 text-rose-950'
                      : isMed
                      ? 'bg-amber-50 border-amber-200 text-amber-950'
                      : 'bg-emerald-50 border-emerald-200 text-emerald-950'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {isHigh ? (
                        <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                      ) : isMed ? (
                        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                      ) : (
                        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                      )}
                      <span className="font-bold text-sm uppercase tracking-wider">
                        Conflict Status: {auditReport.riskLevel} Risk
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold">Max Entity Match:</span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full font-mono text-xs font-bold border ${
                          isHigh
                            ? 'bg-rose-100 text-rose-900 border-rose-300'
                            : isMed
                            ? 'bg-amber-100 text-amber-900 border-amber-300'
                            : 'bg-emerald-100 text-emerald-900 border-emerald-300'
                        }`}
                      >
                        {auditReport.overallScore}% Similarity
                      </span>
                    </div>
                  </div>

                  <p className="text-xs leading-relaxed">{auditReport.summary}</p>

                  <div className="text-[11px] opacity-80 pt-1 border-t border-black/5 flex flex-wrap items-center gap-4">
                    <span>Scanned at: <strong>{auditReport.scannedAt}</strong></span>
                    <span>Scanned Entities: <strong>{auditReport.totalEntitiesScanned}</strong></span>
                    <span>Existing Matters Scanned: <strong>{auditReport.totalCasesScanned}</strong></span>
                  </div>
                </div>

                {/* Scanned Matter Entity Profile */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 text-[11px]">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                    Inquiry Entity Profile
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Prospective Client:</span>
                      <span className="font-bold text-slate-900">{viewConflictAuditRequest.clientName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Opposing / Adverse Entity:</span>
                      <span className="font-bold text-slate-900">{viewConflictAuditRequest.opposingParty || 'None Declared'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Related Affiliates / Co-Parties:</span>
                      <span className="font-semibold text-slate-800">
                        {viewConflictAuditRequest.relatedParties?.length
                          ? viewConflictAuditRequest.relatedParties.join(', ')
                          : 'None'}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Practice Area / Title:</span>
                      <span className="font-semibold text-slate-800">
                        {viewConflictAuditRequest.practiceArea} • {viewConflictAuditRequest.requestTitle}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Fuzzy Match Results Matrix */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 text-xs">
                      Algorithmic Fuzzy Match Matrix ({auditReport.matches?.length || 0} Matches)
                    </span>
                    <span className="text-[10px] text-slate-500">Threshold: Composite Score ≥ 60%</span>
                  </div>

                  {(!auditReport.matches || auditReport.matches.length === 0) ? (
                    <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl text-center text-emerald-800 text-xs">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                      <strong>Clean Scan Complete</strong>: Zero adverse matches or phonetic similarities found across firm archives.
                    </div>
                  ) : (
                    <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
                      <div className="overflow-x-auto">
                        <table className="w-full text-[11px] text-left">
                          <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[10px] uppercase">
                            <tr>
                              <th className="p-2.5">Scanned Entity</th>
                              <th className="p-2.5">Existing Record Hit</th>
                              <th className="p-2.5">Matter Reference</th>
                              <th className="p-2.5 text-center">Jaro-Winkler</th>
                              <th className="p-2.5 text-center">Levenshtein</th>
                              <th className="p-2.5 text-center">Tokens</th>
                              <th className="p-2.5 text-center">N-Gram</th>
                              <th className="p-2.5 text-center font-black text-blue-800">Composite</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {auditReport.matches.map((item, idx) => (
                              <tr key={idx} className="hover:bg-slate-50 transition">
                                <td className="p-2.5 font-bold text-slate-900 whitespace-nowrap">
                                  {item.queryTerm}
                                </td>
                                <td className="p-2.5">
                                  <span className="font-bold text-blue-700">{item.matchedEntityName}</span>
                                  <span className="text-[10px] text-slate-500 block">
                                    Role: {item.matchedEntityType}
                                  </span>
                                </td>
                                <td className="p-2.5">
                                  <span className="font-mono font-bold text-slate-800">{item.matchedCaseNumber}</span>
                                  <span className="text-[10px] text-slate-500 block truncate max-w-[140px]">
                                    {item.matchedCaseTitle}
                                  </span>
                                </td>
                                <td className="p-2.5 text-center font-mono">{item.algorithmBreakdown.jaroWinkler}%</td>
                                <td className="p-2.5 text-center font-mono">{item.algorithmBreakdown.levenshtein}%</td>
                                <td className="p-2.5 text-center font-mono">{item.algorithmBreakdown.tokenOverlap}%</td>
                                <td className="p-2.5 text-center font-mono">{item.algorithmBreakdown.ngramDice}%</td>
                                <td className="p-2.5 text-center">
                                  <span
                                    className={`px-2 py-0.5 rounded font-mono font-bold ${
                                      item.similarityScore >= 80
                                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                                        : item.similarityScore >= 65
                                        ? 'bg-amber-100 text-amber-800 border border-amber-300'
                                        : 'bg-slate-100 text-slate-700'
                                    }`}
                                  >
                                    {item.similarityScore}%
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>

                {/* Algorithmic Weighting Legend */}
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-[10px] text-slate-600 space-y-1">
                  <span className="font-bold text-slate-800 block">Algorithm Architecture & Weighting:</span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <div>• Jaro-Winkler: <strong>30%</strong> (Prefix match)</div>
                    <div>• Levenshtein: <strong>25%</strong> (Edit distance)</div>
                    <div>• Token Overlap: <strong>30%</strong> (Jaccard bag)</div>
                    <div>• N-Gram Dice: <strong>15%</strong> (Bigram overlap)</div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {isHigh && (
                      <button
                        type="button"
                        onClick={() => {
                          setViewConflictAuditRequest(null);
                          setDeclineTargetRequest(viewConflictAuditRequest);
                          setDeclineReason('Conflict of Interest (Opposing Party Retained)');
                        }}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
                      >
                        <XCircle className="w-4 h-4" />
                        <span>Decline Due to Conflict</span>
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        showToast(
                          'Ethics Screen Logged',
                          `Conflict check audit exported and ethical screen record created for ${viewConflictAuditRequest.clientName}.`,
                          'info'
                        );
                        setViewConflictAuditRequest(null);
                      }}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-bold text-xs transition"
                    >
                      Export Audit Log
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setViewConflictAuditRequest(null)}
                    className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-xs transition"
                  >
                    Close Audit
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* DIGITAL CONSENT AUDIT CERTIFICATE MODAL */}
      {viewConsentCertRequest && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden text-slate-900 my-8 animate-in fade-in">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="font-bold text-white text-sm">Client Intake Consent Audit Certificate</h3>
                  <p className="text-[10px] text-slate-400 font-mono">
                    State Bar Ethics & ESIGN Cryptographic Verification
                  </p>
                </div>
              </div>
              <button
                onClick={() => setViewConsentCertRequest(null)}
                className="p-1 text-slate-400 hover:text-white rounded"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                    Execution Status
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>AUTHENTIC & VERIFIED</span>
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">
                  {viewConsentCertRequest.requestTitle}
                </h4>
                <p className="text-[11px] text-slate-600">
                  Prospective Client: <strong className="text-slate-800">{viewConsentCertRequest.clientName}</strong> ({viewConsentCertRequest.clientEmail})
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 text-[11px]">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Signatory Identity & Network Metadata
                </span>
                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Authorized Signer:</span>
                    <span className="font-bold text-slate-900">{viewConsentCertRequest.digitalConsent?.consentedBy || 'Authorized Officer'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Corporate Role:</span>
                    <span className="font-semibold text-slate-800">{viewConsentCertRequest.digitalConsent?.signerRole || 'Client Representative'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Consent Timestamp:</span>
                    <span className="font-mono text-emerald-700 font-bold">{viewConsentCertRequest.digitalConsent?.consentedAt}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">IP Origin:</span>
                    <span className="font-mono text-slate-700">{viewConsentCertRequest.digitalConsent?.signerIp || '192.168.1.188 (TLS 1.3)'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Signer Email:</span>
                    <span className="font-mono text-slate-700 truncate block">{viewConsentCertRequest.digitalConsent?.signerEmail || viewConsentCertRequest.clientEmail}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Compliance Protocol:</span>
                    <span className="font-bold text-slate-800">{viewConsentCertRequest.digitalConsent?.termsVersion || 'v2026.4-ETHICS-ESIGN'}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Cryptographic SHA-256 Digest:</span>
                  <span className="font-mono text-[10px] text-slate-700 bg-white p-1.5 rounded border border-slate-200 block truncate select-all">
                    {viewConsentCertRequest.digitalConsent?.consentHash || 'SHA256:CON-F892A028-BC73918'}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
                  Acknowledged Ethics & Legal Clauses ({viewConsentCertRequest.digitalConsent?.acknowledgedClauses?.length || 4})
                </span>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-[11px] space-y-1.5 text-slate-600">
                  {(viewConsentCertRequest.digitalConsent?.acknowledgedClauses || [
                    'Authorization for conflict check & electronic database record creation',
                    'Acknowledgment of preliminary non-engagement until formal retainer executed',
                    'Confidentiality & Attorney-Client Privilege safeguards under Rule 1.6',
                    'Consent to secure electronic encrypted communications & audit trail retention'
                  ]).map((clause, idx) => (
                    <div key={idx} className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{clause}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setViewConsentCertRequest(null)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-xs shadow-sm transition"
                >
                  Dismiss Certificate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DECLINE REQUEST REASON MODAL */}
      {declineTargetRequest && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden text-slate-900 my-8 animate-in fade-in">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <h3 className="font-bold text-white text-sm">Decline Prospective Matter</h3>
              <button onClick={() => setDeclineTargetRequest(null)} className="p-1 text-slate-400 hover:text-white rounded">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <p className="text-slate-600">
                Please select the ethical or operational basis for declining representation for{' '}
                <strong>{declineTargetRequest.clientName}</strong>:
              </p>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Reason for Declination</label>
                <select
                  value={declineReason}
                  onChange={(e) => setDeclineReason(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 text-xs font-semibold"
                >
                  <option value="Conflict of Interest (Adverse Party Retained)">Conflict of Interest (Adverse Party Retained)</option>
                  <option value="Subject Matter Outside Firm Jurisdiction / Expertise">
                    Subject Matter Outside Firm Jurisdiction / Expertise
                  </option>
                  <option value="Counsel Trial Bandwidth & Capacity Constraints">
                    Counsel Trial Bandwidth & Capacity Constraints
                  </option>
                  <option value="Statute of Limitations Expiry Risk">Statute of Limitations Expiry Risk</option>
                  <option value="Insufficient Evidence / Unviable Cause of Action">
                    Insufficient Evidence / Unviable Cause of Action
                  </option>
                </select>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setDeclineTargetRequest(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onDeclineClientRequest(declineTargetRequest.id, selectedLawyer.name);
                    showToast('Request Declined', `Declined request due to: ${declineReason}`, 'warning');
                    setDeclineTargetRequest(null);
                  }}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold transition"
                >
                  Confirm Declination
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* RECORD BILLABLE TIME MODAL */}
      {isTimeLogModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden text-slate-900 my-8 animate-in fade-in">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-white text-sm">Log Billable Time</h3>
              </div>
              <button onClick={() => setIsTimeLogModalOpen(false)} className="p-1 text-slate-400 hover:text-white rounded">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveTimeEntry} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Target Matter</label>
                <select
                  value={timeLogCaseId}
                  onChange={(e) => setTimeLogCaseId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 text-xs font-semibold"
                >
                  {lawyerCases.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.caseNumber} - {c.title}
                    </option>
                  ))}
                  {lawyerCases.length === 0 && <option value="case-general">General Litigation Practice</option>}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Hours Spent</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    max="24"
                    required
                    value={timeLogHours}
                    onChange={(e) => setTimeLogHours(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 font-mono text-slate-900 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Hourly Billing Rate</label>
                  <input
                    type="text"
                    disabled
                    value={`$${selectedLawyer.hourlyRate}/hr`}
                    className="w-full bg-slate-100 border border-slate-300 rounded-lg p-2 font-mono text-slate-600 text-xs font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Task Classification</label>
                <select
                  value={timeLogTaskType}
                  onChange={(e) => setTimeLogTaskType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 text-xs"
                >
                  <option value="Legal Research & Case Law Analysis">Legal Research & Case Law Analysis</option>
                  <option value="Deposition & Witness Examination">Deposition & Witness Examination</option>
                  <option value="Motion & Brief Drafting">Motion & Brief Drafting</option>
                  <option value="Court Hearing / Trial Appearance">Court Hearing / Trial Appearance</option>
                  <option value="Client Consultation & Strategy">Client Consultation & Strategy</option>
                  <option value="Discovery Document Review">Discovery Document Review</option>
                  <option value="Settlement Negotiations">Settlement Negotiations</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Activity Narrative / Timesheet Notes</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detailed breakdown of work completed for client billing statement..."
                  value={timeLogDescription}
                  onChange={(e) => setTimeLogDescription(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 text-xs"
                />
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsTimeLogModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center gap-1.5 shadow-sm transition"
                >
                  <Clock className="w-4 h-4" />
                  <span>Log ${(parseFloat(timeLogHours) * selectedLawyer.hourlyRate || 0).toLocaleString()} Time</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DOCKET HEARING / DEADLINE MODAL */}
      {isDeadlineModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden text-slate-900 my-8 animate-in fade-in">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CalendarClock className="w-5 h-5 text-purple-400" />
                <h3 className="font-bold text-white text-sm">Docket Hearing or Filing Deadline</h3>
              </div>
              <button onClick={() => setIsDeadlineModalOpen(false)} className="p-1 text-slate-400 hover:text-white rounded">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateDeadlineSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Target Matter</label>
                <select
                  value={newDeadlineCaseId}
                  onChange={(e) => setNewDeadlineCaseId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 text-xs font-semibold"
                >
                  {lawyerCases.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.caseNumber} - {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Event / Deadline Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Preliminary Injunction Hearing (Dept 42)"
                  value={newDeadlineTitle}
                  onChange={(e) => setNewDeadlineTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Due Date</label>
                  <input
                    type="date"
                    required
                    value={newDeadlineDate}
                    onChange={(e) => setNewDeadlineDate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Priority</label>
                  <select
                    value={newDeadlinePriority}
                    onChange={(e) => setNewDeadlinePriority(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 text-xs font-semibold"
                  >
                    <option value="critical">Critical (Court Mandated)</option>
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Event Classification</label>
                <select
                  value={newDeadlineType}
                  onChange={(e) => setNewDeadlineType(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 text-xs"
                >
                  <option value="court_appearance">Court Appearance / Trial Date</option>
                  <option value="filing">Pleading / Brief Filing</option>
                  <option value="discovery_response">Discovery Response Due</option>
                  <option value="statute_of_limitations">Statute of Limitations</option>
                  <option value="client_meeting">Client Deposition / Meeting</option>
                </select>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsDeadlineModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold flex items-center gap-1.5 shadow-sm transition"
                >
                  <CalendarClock className="w-4 h-4" />
                  <span>Docket Event</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
