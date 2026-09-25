import React, { useState, useMemo } from 'react';
import {
  Briefcase,
  Plus,
  Search,
  Filter,
  DollarSign,
  UserCheck,
  Calendar,
  Tag,
  ChevronRight,
  Shield,
  FileSpreadsheet,
  FileType,
  X,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  ArrowLeft,
  CheckSquare,
  Square,
  MinusSquare,
  Check,
  SlidersHorizontal,
  Send,
  Sparkles,
  Info,
  Lock,
  Layers,
  FileText,
  UserPlus,
  XCircle,
  Inbox,
  Paperclip,
  Eye,
  Download,
  ShieldCheck
} from 'lucide-react';
import { CaseFile, CaseStatus, PracticeArea, UserRole, ClientRepresentationRequest, User, EvidenceProof } from '../types';
import { exportCaseListPDF, exportBatchCasesDetailedReportPDF } from '../utils/pdfExport';
import { exportCasesExcel } from '../utils/excelExport';

export interface CaseLifecycleStage {
  key: CaseStatus;
  label: string;
  stepNumber: number;
  shortDesc: string;
  fullDesc: string;
  keyDeliverables: string[];
}

export const CASE_LIFECYCLE_STAGES: CaseLifecycleStage[] = [
  {
    key: 'intake',
    label: 'Consultation',
    stepNumber: 1,
    shortDesc: 'Initial intake & conflict clearance',
    fullDesc: 'Initial consultation, retainer agreement execution, retainer deposit verification, conflict check clearance, and file initialization.',
    keyDeliverables: [
      'Executed Retainer Agreement',
      'Retainer Deposit Cleared ($25,000)',
      'Conflict Check & KYC Cleared'
    ]
  },
  {
    key: 'discovery',
    label: 'Discovery',
    stepNumber: 2,
    shortDesc: 'Document production & depositions',
    fullDesc: 'Evidentiary exchanges, written interrogatories, electronic discovery, subpoenas, and witness depositions.',
    keyDeliverables: [
      'Response to Interrogatories Served',
      'Document Production Disclosures',
      'Key Witness Deposition Transcripts'
    ]
  },
  {
    key: 'pre_trial',
    label: 'Pre-Trial',
    stepNumber: 3,
    shortDesc: 'Pre-trial motions & expert reports',
    fullDesc: 'Pre-trial status conferences, motions in limine, expert witness disclosures, summary judgment arguments, and exhibit lists.',
    keyDeliverables: [
      'Joint Pre-Trial Statement Filed',
      'Expert Witness Disclosures',
      'Motions in Limine Briefs'
    ]
  },
  {
    key: 'trial',
    label: 'Trial',
    stepNumber: 4,
    shortDesc: 'Courtroom proceedings & verdict',
    fullDesc: 'Courtroom litigation, jury empanelement, opening arguments, witness cross-examinations, evidence presentation, and judicial ruling.',
    keyDeliverables: [
      'Trial Brief & Binder Submitted',
      'Witness Examination Schedules',
      'Jury Instructions & Court Ruling'
    ]
  },
  {
    key: 'settlement',
    label: 'Settlement',
    stepNumber: 5,
    shortDesc: 'Mediation & release execution',
    fullDesc: 'Alternative dispute resolution, court-ordered mediation, settlement agreement drafting, mutual release of claims, and escrow release.',
    keyDeliverables: [
      'Executed Settlement Agreement',
      'Settlement Escrow Disbursement Notice',
      'Stipulation of Dismissal with Prejudice'
    ]
  },
  {
    key: 'closed',
    label: 'Closed',
    stepNumber: 6,
    shortDesc: 'Final statement & archiving',
    fullDesc: 'Final client accounting statement, unbilled trust fund return, case closing memorandum, and secure digital vault archiving.',
    keyDeliverables: [
      'Final Accounting Ledger Rendered',
      'Unbilled Retainer Refund Disbursed',
      'Archived Vault Record Certified'
    ]
  }
];

export function getStageIndex(status: CaseStatus): number {
  return CASE_LIFECYCLE_STAGES.findIndex((s) => s.key === status);
}

interface CasesViewProps {
  cases: CaseFile[];
  userRole: UserRole;
  clientRequests?: ClientRepresentationRequest[];
  users?: User[];
  onAddCase: (newCase: CaseFile) => void;
  onUpdateCaseStatus?: (caseId: string, newStatus: CaseStatus) => void;
  onAcceptClientRequest?: (requestId: string, reviewerName: string) => void;
  onDeclineClientRequest?: (requestId: string, reviewerName: string) => void;
  onSelectCase: (c: CaseFile) => void;
}

export const CasesView: React.FC<CasesViewProps> = ({
  cases,
  userRole,
  clientRequests = [],
  users = [],
  onAddCase,
  onUpdateCaseStatus,
  onAcceptClientRequest,
  onDeclineClientRequest,
  onSelectCase
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPracticeArea, setSelectedPracticeArea] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showRequestsPanel, setShowRequestsPanel] = useState(true);
  const [reviewingLawyerName, setReviewingLawyerName] = useState('Sophia Chen, Esq.');

  // Detail Modal for process stepper inspection
  const [selectedCaseForDetail, setSelectedCaseForDetail] = useState<CaseFile | null>(null);

  // Evidence inspection modal for reviewing lawyer
  const [selectedEvidenceForLawyer, setSelectedEvidenceForLawyer] = useState<{
    evidence: EvidenceProof;
    requestTitle: string;
    clientName: string;
  } | null>(null);

  // Deliverables completion tracking local state
  const [completedDeliverables, setCompletedDeliverables] = useState<Record<string, boolean>>({
    'Executed Retainer Agreement': true,
    'Retainer Deposit Cleared ($25,000)': true,
    'Conflict Check & KYC Cleared': true
  });

  // Client status notes tracking
  const [statusNotes, setStatusNotes] = useState<Record<string, { id: string; author: string; note: string; timestamp: string }[]>>({
    'case-1': [
      {
        id: 'n-1',
        author: 'Sophia Chen, Esq.',
        note: 'Initial pleadings and interrogatory requests served on opposing counsel.',
        timestamp: 'Aug 04, 2026 • 10:15 AM'
      },
      {
        id: 'n-2',
        author: 'Marcus Vance, Esq.',
        note: 'Discovery document production package uploaded to client vault.',
        timestamp: 'Aug 06, 2026 • 02:40 PM'
      }
    ]
  });

  const [newNoteText, setNewNoteText] = useState('');

  // New case form state
  const [title, setTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [practiceArea, setPracticeArea] = useState<PracticeArea>('Corporate');
  const [assignedLawyerName, setAssignedLawyerName] = useState('Sophia Chen');
  const [retainerAmount, setRetainerAmount] = useState('25000');
  const [hourlyRate, setHourlyRate] = useState('450');
  const [description, setDescription] = useState('');

  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      const matchesSearch =
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.clientName.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = selectedStatus === 'all' || c.status === selectedStatus;
      const matchesPA = selectedPracticeArea === 'all' || c.practiceArea === selectedPracticeArea;

      return matchesSearch && matchesStatus && matchesPA;
    });
  }, [cases, searchTerm, selectedStatus, selectedPracticeArea]);

  // Multi-select state for batch operations
  const [selectedCaseIds, setSelectedCaseIds] = useState<string[]>([]);
  const [isBatchStatusModalOpen, setIsBatchStatusModalOpen] = useState(false);
  const [batchTargetStatus, setBatchTargetStatus] = useState<CaseStatus>('discovery');
  const [batchStatusNote, setBatchStatusNote] = useState('');
  const [batchFeedback, setBatchFeedback] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  const selectedCases = useMemo(() => {
    return cases.filter((c) => selectedCaseIds.includes(c.id));
  }, [cases, selectedCaseIds]);

  const isAllFilteredSelected = useMemo(() => {
    return filteredCases.length > 0 && filteredCases.every((c) => selectedCaseIds.includes(c.id));
  }, [filteredCases, selectedCaseIds]);

  const isSomeFilteredSelected = useMemo(() => {
    return filteredCases.some((c) => selectedCaseIds.includes(c.id)) && !isAllFilteredSelected;
  }, [filteredCases, selectedCaseIds, isAllFilteredSelected]);

  const handleToggleSelectCase = (caseId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedCaseIds((prev) =>
      prev.includes(caseId) ? prev.filter((id) => id !== caseId) : [...prev, caseId]
    );
  };

  const handleToggleSelectAll = () => {
    if (isAllFilteredSelected) {
      const filteredIdSet = new Set(filteredCases.map((c) => c.id));
      setSelectedCaseIds((prev) => prev.filter((id) => !filteredIdSet.has(id)));
    } else {
      const filteredIds = filteredCases.map((c) => c.id);
      setSelectedCaseIds((prev) => Array.from(new Set([...prev, ...filteredIds])));
    }
  };

  const handleClearSelection = () => {
    setSelectedCaseIds([]);
  };

  const handleBatchStatusApply = () => {
    if (selectedCases.length === 0 || !onUpdateCaseStatus) return;

    selectedCases.forEach((c) => {
      onUpdateCaseStatus(c.id, batchTargetStatus);

      if (batchStatusNote.trim()) {
        const newNote = {
          id: `n-${Date.now()}-${c.id}`,
          author: userRole === 'admin' ? 'Sophia Chen, Esq. (Admin)' : 'Legal Team',
          note: `[Batch Status Update → ${batchTargetStatus.toUpperCase().replace('_', ' ')}] ${batchStatusNote.trim()}`,
          timestamp: `${new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })} • ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
        };
        setStatusNotes((prev) => ({
          ...prev,
          [c.id]: [newNote, ...(prev[c.id] || [])]
        }));
      }
    });

    const updatedCount = selectedCases.length;
    setIsBatchStatusModalOpen(false);
    setBatchStatusNote('');
    setBatchFeedback({
      message: `Successfully updated status of ${updatedCount} matter${updatedCount > 1 ? 's' : ''} to "${batchTargetStatus.toUpperCase().replace('_', ' ')}".`,
      type: 'success'
    });

    setTimeout(() => {
      setBatchFeedback(null);
    }, 4000);
  };

  const handleBatchExportPDF = (format: 'dossier' | 'directory') => {
    if (selectedCases.length === 0) return;
    if (format === 'dossier') {
      exportBatchCasesDetailedReportPDF(selectedCases);
    } else {
      exportCaseListPDF(selectedCases, `SELECTED MATTERS REPORT (${selectedCases.length} CASES)`);
    }
    setBatchFeedback({
      message: `Generated ${format === 'dossier' ? 'Detailed Case Dossier PDF' : 'Directory PDF'} for ${selectedCases.length} matter${selectedCases.length > 1 ? 's' : ''}.`,
      type: 'info'
    });
    setTimeout(() => {
      setBatchFeedback(null);
    }, 3500);
  };

  const handleBatchExportExcel = () => {
    if (selectedCases.length === 0) return;
    exportCasesExcel(selectedCases);
    setBatchFeedback({
      message: `Exported ${selectedCases.length} matter${selectedCases.length > 1 ? 's' : ''} to Excel spreadsheet (XLSX).`,
      type: 'info'
    });
    setTimeout(() => {
      setBatchFeedback(null);
    }, 3500);
  };

  const handleCreateCaseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !clientName) return;

    const newC: CaseFile = {
      id: `case-${Date.now()}`,
      caseNumber: `JP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      title,
      clientName,
      clientEmail: clientEmail || `${clientName.toLowerCase().replace(/\s+/g, '')}@client.org`,
      practiceArea,
      assignedLawyerId: 'u-3',
      assignedLawyerName,
      status: 'intake',
      openedDate: new Date().toISOString().slice(0, 10),
      expectedClosureDate: new Date(Date.now() + 180 * 86400000).toISOString().slice(0, 10),
      retainerAmount: Number(retainerAmount) || 25000,
      retainerRemaining: Number(retainerAmount) || 25000,
      hourlyRate: Number(hourlyRate) || 450,
      totalBilled: 0,
      description,
      tags: [practiceArea, 'Active Matter']
    };

    onAddCase(newC);
    setIsModalOpen(false);
    setTitle('');
    setClientName('');
    setClientEmail('');
    setDescription('');
  };

  const handleStepChange = (caseId: string, targetStatus: CaseStatus) => {
    if (onUpdateCaseStatus) {
      onUpdateCaseStatus(caseId, targetStatus);
    }
    // Update local modal view if active
    if (selectedCaseForDetail && selectedCaseForDetail.id === caseId) {
      setSelectedCaseForDetail({ ...selectedCaseForDetail, status: targetStatus });
    }
  };

  const handleToggleDeliverable = (delivKey: string) => {
    setCompletedDeliverables((prev) => ({
      ...prev,
      [delivKey]: !prev[delivKey]
    }));
  };

  const handlePostNoteSubmit = (e: React.FormEvent, caseId: string) => {
    e.preventDefault();
    if (!newNoteText.trim()) return;

    const newNote = {
      id: `n-${Date.now()}`,
      author: userRole === 'admin' ? 'Sophia Chen, Esq. (Admin)' : 'Legal Team',
      note: newNoteText,
      timestamp: `${new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })} • ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
    };

    setStatusNotes((prev) => ({
      ...prev,
      [caseId]: [newNote, ...(prev[caseId] || [])]
    }));

    setNewNoteText('');
  };

  const pendingRequests = useMemo(() => {
    return clientRequests.filter((r) => r.status === 'pending');
  }, [clientRequests]);

  const reviewedRequests = useMemo(() => {
    return clientRequests.filter((r) => r.status !== 'pending');
  }, [clientRequests]);

  const statusBadgeColors: Record<CaseStatus, string> = {
    intake: 'bg-blue-50 text-blue-700 border-blue-200 font-bold',
    discovery: 'bg-indigo-50 text-indigo-700 border-indigo-200 font-bold',
    pre_trial: 'bg-amber-50 text-amber-700 border-amber-200 font-bold',
    trial: 'bg-rose-50 text-rose-700 border-rose-200 font-bold',
    settlement: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-bold',
    closed: 'bg-slate-100 text-slate-600 border-slate-200 font-bold'
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-4 rounded-lg shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-slate-900">Cases & Practice Matters</h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 flex items-center gap-1 font-mono uppercase">
              <Layers className="w-3.5 h-3.5 text-blue-600" />
              Process Stepper Active
            </span>
            {pendingRequests.length > 0 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500 text-white shadow-sm flex items-center gap-1 font-mono uppercase animate-pulse">
                <UserPlus className="w-3 h-3 text-white" />
                {pendingRequests.length} Pending Representation Request{pendingRequests.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Track matter lifecycles from Consultation to Closed with visual stage steppers, deliverables checklists, and client status updates.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setShowRequestsPanel((prev) => !prev)}
            className={`px-3 py-1.5 font-bold text-xs rounded-md flex items-center gap-1.5 border shadow-sm transition ${
              showRequestsPanel
                ? 'bg-blue-50 text-blue-700 border-blue-300'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <UserPlus className="w-4 h-4 text-blue-600" />
            <span>Incoming Requests ({pendingRequests.length})</span>
          </button>

          <button
            onClick={() => exportCaseListPDF(filteredCases)}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-md flex items-center gap-1.5 border border-slate-200 shadow-sm transition"
          >
            <FileType className="w-4 h-4 text-blue-600" />
            <span>PDF</span>
          </button>
          <button
            onClick={() => exportCasesExcel(filteredCases)}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-md flex items-center gap-1.5 border border-slate-200 shadow-sm transition"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>XLSX</span>
          </button>

          {(userRole === 'admin' || userRole === 'partner' || userRole === 'associate') && (
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-md flex items-center gap-2 shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Matter</span>
            </button>
          )}
        </div>
      </div>

      {/* INCOMING CLIENT REPRESENTATION REQUESTS REVIEW PANEL */}
      {showRequestsPanel && (
        <div className="bg-slate-900 text-white border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-500/40 flex items-center justify-center shrink-0">
                <UserPlus className="w-4 h-4 text-blue-400" />
              </div>
              <div>
                <h2 className="font-bold text-sm text-white flex items-center gap-2">
                  <span>Incoming Client Representation Requests</span>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                    {pendingRequests.length} Pending Approval
                  </span>
                </h2>
                <p className="text-[11px] text-slate-400">
                  Review incoming representation requests from clients. Accepting a request automatically initializes a formal case file in Intake status.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-slate-400 font-medium">Reviewing As:</span>
              <select
                value={reviewingLawyerName}
                onChange={(e) => setReviewingLawyerName(e.target.value)}
                className="bg-slate-800 border border-slate-700 text-slate-200 text-xs font-bold rounded-lg px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Sophia Chen, Esq.">Sophia Chen, Esq. (Senior Associate)</option>
                <option value="Eleanor Vance, Esq.">Eleanor Vance, Esq. (Managing Partner)</option>
                <option value="Marcus Sterling">Marcus Sterling (Senior Partner)</option>
              </select>
            </div>
          </div>

          {pendingRequests.length === 0 ? (
            <div className="p-6 text-center bg-slate-800/50 rounded-lg border border-slate-800 text-slate-400 text-xs space-y-1">
              <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto opacity-80" />
              <p className="font-bold text-slate-200">No Pending Client Requests</p>
              <p className="text-[11px] text-slate-400">All incoming representation requests have been reviewed and processed by counsel.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {pendingRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-slate-800/90 border border-slate-700 hover:border-blue-500/60 transition rounded-xl p-4 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                          {req.practiceArea}
                        </span>
                        <h3 className="font-bold text-white text-sm mt-1.5">{req.requestTitle}</h3>
                      </div>
                      <span className="text-[11px] font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-1 rounded-md shrink-0">
                        ${(req.estimatedBudget || 0).toLocaleString()} Retainer
                      </span>
                    </div>

                    <div className="text-xs text-slate-300 bg-slate-900/80 border border-slate-800 p-2.5 rounded-lg space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Case Summary & Legal Need:</span>
                      <p className="leading-relaxed text-slate-200">{req.caseSummary}</p>
                    </div>

                    {/* Opposing Party & Incident Date & Urgency info */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px] bg-slate-900/50 p-2 rounded-lg border border-slate-800">
                      <div>
                        <span className="text-slate-500 block text-[10px]">Opposing Party:</span>
                        <span className="font-bold text-rose-300 truncate block">
                          {req.opposingParty || 'Not Specified'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Incident Date:</span>
                        <span className="font-mono text-slate-300 block">
                          {req.incidentDate || 'Recent'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px]">Urgency Level:</span>
                        <span className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-bold uppercase ${
                          req.urgencyLevel === 'critical'
                            ? 'bg-rose-950 text-rose-400 border border-rose-800'
                            : req.urgencyLevel === 'urgent'
                            ? 'bg-amber-950 text-amber-400 border border-amber-800'
                            : 'bg-slate-800 text-slate-300'
                        }`}>
                          {req.urgencyLevel ? req.urgencyLevel.toUpperCase() : 'STANDARD'}
                        </span>
                      </div>
                    </div>

                    {/* Targeted Lawyers */}
                    {req.targetLawyerNames && req.targetLawyerNames.length > 0 && (
                      <div className="text-[11px] bg-blue-950/40 border border-blue-800/50 rounded-lg p-2 flex items-center gap-2">
                        <span className="text-blue-400 font-bold text-[10px] uppercase shrink-0">Targeted Counsel:</span>
                        <div className="flex flex-wrap gap-1">
                          {req.targetLawyerNames.map((name, i) => (
                            <span key={i} className="px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-200 text-[10px] font-medium border border-blue-700/50">
                              {name}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Evidence & Proof Exhibit Attachments */}
                    {req.evidenceList && req.evidenceList.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-emerald-400 font-bold flex items-center gap-1">
                            <Paperclip className="w-3.5 h-3.5" />
                            <span>Attached Evidence & Proof ({req.evidenceList.length})</span>
                          </span>
                          <span className="text-[10px] text-slate-400">Transfers to Vault on Accept</span>
                        </div>
                        <div className="space-y-1">
                          {req.evidenceList.map((ev) => (
                            <div
                              key={ev.id}
                              className="p-1.5 bg-slate-900 border border-slate-700/80 rounded flex items-center justify-between gap-2 text-[11px]"
                            >
                              <div className="flex items-center gap-1.5 min-w-0">
                                <FileText className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                                <span className="font-bold text-slate-200 truncate">{ev.title}</span>
                                <span className="text-[9px] font-mono text-slate-400 hidden sm:inline">({ev.fileName})</span>
                              </div>
                              <div className="flex items-center gap-1.5 shrink-0">
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-semibold bg-blue-950 text-blue-300 border border-blue-800">
                                  {ev.category}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => setSelectedEvidenceForLawyer({
                                    evidence: ev,
                                    requestTitle: req.requestTitle,
                                    clientName: req.clientName
                                  })}
                                  className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-blue-300 hover:text-white rounded text-[10px] font-bold flex items-center gap-1 transition"
                                >
                                  <Eye className="w-3 h-3" />
                                  <span>Inspect</span>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1">
                      <div>
                        <span className="text-slate-500 block">Client Entity:</span>
                        <span className="font-bold text-slate-200">{req.clientName}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Contact Email:</span>
                        <span className="font-mono text-slate-200">{req.clientEmail}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Preferred Counsel:</span>
                        <span className="font-semibold text-blue-300">{req.preferredLawyerName || 'Any Lead Attorney'}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Submitted:</span>
                        <span className="font-mono text-slate-200">{req.submittedAt}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-700/80 flex items-center justify-end gap-2">
                    <button
                      onClick={() => onDeclineClientRequest && onDeclineClientRequest(req.id, reviewingLawyerName)}
                      className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-200 font-semibold text-xs rounded-lg transition flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5 text-red-400" />
                      <span>Decline</span>
                    </button>
                    <button
                      onClick={() => onAcceptClientRequest && onAcceptClientRequest(req.id, reviewingLawyerName)}
                      className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg shadow-md transition flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-white" />
                      <span>Accept Request & Open Matter</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {reviewedRequests.length > 0 && (
            <div className="pt-2 border-t border-slate-800 text-xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-2">
                Processed Requests Log ({reviewedRequests.length})
              </span>
              <div className="space-y-1.5 max-h-28 overflow-y-auto pr-1">
                {reviewedRequests.map((r) => (
                  <div key={r.id} className="p-2 bg-slate-800/40 rounded border border-slate-800 flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-2 truncate">
                      <span className={`px-1.5 py-0.2 rounded text-[10px] font-bold uppercase ${r.status === 'accepted' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-red-950 text-red-400 border border-red-800'}`}>
                        {r.status}
                      </span>
                      <span className="font-bold text-slate-200 truncate">{r.clientName}:</span>
                      <span className="text-slate-400 truncate">"{r.requestTitle}"</span>
                    </div>
                    <span className="text-[10px] text-slate-500 shrink-0 font-mono">
                      Reviewed by {r.reviewedBy || 'Counsel'} on {r.reviewedAt}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Filter, Search & Batch Selection Bar */}
      <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-sm flex flex-col md:flex-row items-center gap-3">
        {/* Select All Toggle Button */}
        <button
          type="button"
          onClick={handleToggleSelectAll}
          title={isAllFilteredSelected ? "Deselect all filtered cases" : "Select all filtered cases"}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold border flex items-center gap-1.5 transition shrink-0 ${
            isAllFilteredSelected
              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
              : isSomeFilteredSelected
              ? 'bg-blue-50 text-blue-800 border-blue-300'
              : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
          }`}
        >
          {isAllFilteredSelected ? (
            <CheckSquare className="w-4 h-4 text-white" />
          ) : isSomeFilteredSelected ? (
            <MinusSquare className="w-4 h-4 text-blue-600" />
          ) : (
            <Square className="w-4 h-4 text-slate-400" />
          )}
          <span>
            {isAllFilteredSelected
              ? `All Selected (${filteredCases.length})`
              : isSomeFilteredSelected
              ? `${selectedCaseIds.length} Selected`
              : `Select All (${filteredCases.length})`}
          </span>
        </button>

        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by case title, court docket number, client name..."
            className="w-full bg-slate-50 border border-slate-200 rounded-md pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Status Dropdown */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          >
            <option value="all">All Stages (Consultation → Closed)</option>
            <option value="intake">Consultation</option>
            <option value="discovery">Discovery</option>
            <option value="pre_trial">Pre-Trial</option>
            <option value="trial">Trial</option>
            <option value="settlement">Settlement</option>
            <option value="closed">Closed</option>
          </select>

          {/* Practice Area Dropdown */}
          <select
            value={selectedPracticeArea}
            onChange={(e) => setSelectedPracticeArea(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
          >
            <option value="all">All Practice Areas</option>
            <option value="Corporate">Corporate</option>
            <option value="Intellectual Property">Intellectual Property</option>
            <option value="Litigation">Litigation</option>
            <option value="Family Law">Family Law</option>
            <option value="Real Estate">Real Estate</option>
            <option value="Tax Law">Tax Law</option>
          </select>
        </div>
      </div>

      {/* Batch Operation Notification Toast */}
      {batchFeedback && (
        <div
          className={`p-3 rounded-lg border flex items-center justify-between text-xs font-semibold animate-in fade-in ${
            batchFeedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
              : 'bg-blue-50 text-blue-900 border-blue-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{batchFeedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setBatchFeedback(null)}
            className="text-slate-400 hover:text-slate-700 transition"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* BATCH OPERATIONS TOOLBAR */}
      {selectedCaseIds.length > 0 && (
        <div className="p-3.5 bg-slate-900 text-white border border-slate-700 rounded-xl shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center text-xs font-bold font-mono shadow-sm">
                {selectedCases.length}
              </span>
              <span className="font-bold text-xs text-white">
                Matter{selectedCases.length > 1 ? 's' : ''} Selected
              </span>
            </div>

            <div className="h-4 w-px bg-slate-700 hidden sm:block" />

            {/* Financial Pool Metrics */}
            <div className="flex flex-wrap items-center gap-2 text-[11px]">
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                Retainer Pool: <strong className="text-emerald-400">${selectedCases.reduce((acc, c) => acc + c.retainerRemaining, 0).toLocaleString()}</strong>
              </span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">
                Total Accrued Billed: <strong className="text-blue-400">${selectedCases.reduce((acc, c) => acc + c.totalBilled, 0).toLocaleString()}</strong>
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Batch Status Update */}
            {(userRole === 'admin' || userRole === 'partner' || userRole === 'associate') && (
              <button
                type="button"
                onClick={() => {
                  setBatchTargetStatus('discovery');
                  setIsBatchStatusModalOpen(true);
                }}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-lg shadow-sm transition flex items-center gap-1.5"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Batch Update Status</span>
              </button>
            )}

            {/* Export Multi-Case PDF Dossier */}
            <button
              type="button"
              onClick={() => handleBatchExportPDF('dossier')}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-600 font-semibold text-xs rounded-lg shadow-sm transition flex items-center gap-1.5"
              title="Export comprehensive multi-page legal dossier PDF for all selected cases"
            >
              <FileText className="w-3.5 h-3.5 text-blue-400" />
              <span>Export PDF Dossier</span>
            </button>

            {/* Export Summary Table PDF */}
            <button
              type="button"
              onClick={() => handleBatchExportPDF('directory')}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-600 font-semibold text-xs rounded-lg shadow-sm transition flex items-center gap-1.5"
              title="Export tabular directory PDF report for selected cases"
            >
              <FileType className="w-3.5 h-3.5 text-rose-400" />
              <span>PDF Table</span>
            </button>

            {/* Export Excel */}
            <button
              type="button"
              onClick={handleBatchExportExcel}
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-600 font-semibold text-xs rounded-lg shadow-sm transition flex items-center gap-1.5"
              title="Export selected matters to Excel (XLSX)"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
              <span>XLSX</span>
            </button>

            {/* Clear Selection */}
            <button
              type="button"
              onClick={handleClearSelection}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
              title="Clear selection"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Case File Cards Grid with Visual Process Steppers */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredCases.map((c) => {
          const currentStageIdx = getStageIndex(c.status);
          const currentStageInfo = CASE_LIFECYCLE_STAGES[currentStageIdx] || CASE_LIFECYCLE_STAGES[0];
          const isSelected = selectedCaseIds.includes(c.id);

          return (
            <div
              key={c.id}
              className={`p-5 bg-white rounded-xl shadow-sm flex flex-col justify-between group transition duration-200 text-slate-900 space-y-4 border ${
                isSelected
                  ? 'ring-2 ring-blue-500 border-blue-500 bg-blue-50/20'
                  : 'border-slate-200 hover:border-blue-300'
              }`}
            >
              <div className="space-y-3">
                {/* Header with Multi-Select Checkbox */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <button
                      type="button"
                      onClick={(e) => handleToggleSelectCase(c.id, e)}
                      className={`mt-0.5 w-5 h-5 rounded flex items-center justify-center transition shrink-0 border ${
                        isSelected
                          ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                          : 'bg-slate-50 border-slate-300 hover:border-blue-400 text-transparent'
                      }`}
                      title={isSelected ? 'Deselect matter' : 'Select matter for batch operations'}
                      aria-label={`Select ${c.title}`}
                    >
                      <Check className={`w-3.5 h-3.5 stroke-[3] ${isSelected ? 'opacity-100' : 'opacity-0'}`} />
                    </button>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          {c.caseNumber}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                          {c.practiceArea}
                        </span>
                      </div>
                      <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition mt-1 truncate">
                        {c.title}
                      </h3>
                    </div>
                  </div>

                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-md border capitalize shrink-0 ${statusBadgeColors[c.status]}`}>
                    {currentStageInfo.label}
                  </span>
                </div>

                <p className="text-xs text-slate-500">
                  Client: <strong className="text-slate-800">{c.clientName}</strong> • Lead Counsel: <strong className="text-slate-800">{c.assignedLawyerName}</strong>
                </p>

                {/* Description */}
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed bg-slate-50 p-2.5 rounded-md border border-slate-100">
                  {c.description || 'No detailed case summary provided.'}
                </p>

                {/* Visual Process Stepper Bar directly on Card */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      <span>Matter Lifecycle Progress:</span>
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200 uppercase font-bold">
                      Step {currentStageIdx + 1} of 6: {currentStageInfo.label}
                    </span>
                  </div>

                  {/* Visual Stepper Grid */}
                  <div className="grid grid-cols-6 gap-1 pt-1">
                    {CASE_LIFECYCLE_STAGES.map((stg, idx) => {
                      const isCompleted = idx < currentStageIdx;
                      const isCurrent = idx === currentStageIdx;

                      return (
                        <div
                          key={stg.key}
                          title={`${stg.stepNumber}. ${stg.label}: ${stg.shortDesc}`}
                          className={`p-1.5 rounded text-center transition flex flex-col items-center justify-center min-h-[40px] border ${
                            isCurrent
                              ? 'bg-blue-600 text-white border-blue-600 shadow-sm font-bold'
                              : isCompleted
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold'
                              : 'bg-white text-slate-400 border-slate-200'
                          }`}
                        >
                          <div className="text-[9px] uppercase font-mono tracking-tighter flex items-center justify-center gap-0.5 w-full truncate">
                            {isCompleted && <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />}
                            {isCurrent && <Clock className="w-3 h-3 text-white animate-pulse shrink-0" />}
                            <span className="truncate">{stg.label}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions & Meta */}
              <div className="space-y-2 pt-3 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-slate-500">
                    <span>Retainer Remaining:</span>
                    <span className={`font-mono font-bold ${c.retainerRemaining < 10000 ? 'text-rose-600' : 'text-emerald-700'}`}>
                      ${c.retainerRemaining.toLocaleString()}
                    </span>
                  </div>

                  <button
                    onClick={() => setSelectedCaseForDetail(c)}
                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-md font-semibold text-xs flex items-center gap-1.5 shadow-sm transition"
                  >
                    <span>Inspect Lifecycle & Stepper</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* DETAILED MATTER PROCESS STEPPER MODAL */}
      {selectedCaseForDetail && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-4xl bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden my-8 text-slate-900 animate-in fade-in">
            {/* Modal Header */}
            <div className="p-5 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-800">
                    {selectedCaseForDetail.caseNumber}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                    {selectedCaseForDetail.practiceArea}
                  </span>
                  <span className="text-xs text-slate-500">Opened: {selectedCaseForDetail.openedDate}</span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 mt-1">{selectedCaseForDetail.title}</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Client: <strong className="text-slate-800">{selectedCaseForDetail.clientName}</strong> ({selectedCaseForDetail.clientEmail})
                </p>
              </div>

              <button
                onClick={() => setSelectedCaseForDetail(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-200 shrink-0 self-start md:self-auto"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto text-xs">
              {/* FULL INTERACTIVE PROCESS STEPPER BAR */}
              <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-3">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <Layers className="w-4 h-4 text-blue-600" />
                      <span>Legal Matter Lifecycle Process Stepper</span>
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Visual progression tracking for attorney staff and external client transparency.
                    </p>
                  </div>

                  {/* Stage Advance / Regress Controls */}
                  <div className="flex items-center gap-2">
                    {getStageIndex(selectedCaseForDetail.status) > 0 && (
                      <button
                        onClick={() => {
                          const currentIdx = getStageIndex(selectedCaseForDetail.status);
                          if (currentIdx > 0) {
                            handleStepChange(selectedCaseForDetail.id, CASE_LIFECYCLE_STAGES[currentIdx - 1].key);
                          }
                        }}
                        className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-md font-semibold text-xs flex items-center gap-1 shadow-sm transition"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Previous Stage</span>
                      </button>
                    )}

                    {getStageIndex(selectedCaseForDetail.status) < CASE_LIFECYCLE_STAGES.length - 1 && (
                      <button
                        onClick={() => {
                          const currentIdx = getStageIndex(selectedCaseForDetail.status);
                          if (currentIdx < CASE_LIFECYCLE_STAGES.length - 1) {
                            handleStepChange(selectedCaseForDetail.id, CASE_LIFECYCLE_STAGES[currentIdx + 1].key);
                          }
                        }}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold text-xs flex items-center gap-1 shadow-sm transition"
                      >
                        <span>Advance to Next Stage</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* 6 Stage Horizontal Stepper Nodes */}
                <div className="grid grid-cols-2 sm:grid-cols-6 gap-2">
                  {CASE_LIFECYCLE_STAGES.map((stg, idx) => {
                    const currentIdx = getStageIndex(selectedCaseForDetail.status);
                    const isCompleted = idx < currentIdx;
                    const isCurrent = idx === currentIdx;

                    return (
                      <button
                        key={stg.key}
                        onClick={() => handleStepChange(selectedCaseForDetail.id, stg.key)}
                        className={`p-3 rounded-lg border text-left transition flex flex-col justify-between space-y-1.5 ${
                          isCurrent
                            ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-300'
                            : isCompleted
                            ? 'bg-emerald-50 text-emerald-900 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] font-bold ${
                              isCurrent
                                ? 'bg-white text-blue-700'
                                : isCompleted
                                ? 'bg-emerald-600 text-white'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {stg.stepNumber}
                          </span>
                          {isCompleted && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                          {isCurrent && <Clock className="w-4 h-4 text-white animate-pulse" />}
                        </div>

                        <div>
                          <p className={`font-bold text-xs ${isCurrent ? 'text-white' : 'text-slate-900'}`}>
                            {stg.label}
                          </p>
                          <p
                            className={`text-[10px] leading-tight line-clamp-1 mt-0.5 ${
                              isCurrent ? 'text-blue-100' : 'text-slate-500'
                            }`}
                          >
                            {stg.shortDesc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* CURRENT STAGE DETAILS & DELIVERABLES CHECKLIST */}
              {(() => {
                const activeIdx = getStageIndex(selectedCaseForDetail.status);
                const activeStageInfo = CASE_LIFECYCLE_STAGES[activeIdx] || CASE_LIFECYCLE_STAGES[0];

                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Stage Overview & Required Deliverables */}
                    <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3">
                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold font-mono text-xs flex items-center justify-center">
                            {activeStageInfo.stepNumber}
                          </span>
                          <h4 className="font-bold text-slate-900 text-sm">
                            {activeStageInfo.label} Stage Overview
                          </h4>
                        </div>
                        <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Active Phase
                        </span>
                      </div>

                      <p className="text-slate-600 leading-relaxed">{activeStageInfo.fullDesc}</p>

                      <div className="pt-2 border-t border-slate-100 space-y-2">
                        <span className="font-bold text-slate-900 block">Required Milestone Deliverables:</span>
                        <div className="space-y-1.5">
                          {activeStageInfo.keyDeliverables.map((deliv) => {
                            const isChecked = !!completedDeliverables[deliv];
                            return (
                              <button
                                key={deliv}
                                onClick={() => handleToggleDeliverable(deliv)}
                                className="w-full p-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md flex items-center gap-2 text-left transition"
                              >
                                {isChecked ? (
                                  <CheckSquare className="w-4 h-4 text-emerald-600 shrink-0" />
                                ) : (
                                  <Square className="w-4 h-4 text-slate-400 shrink-0" />
                                )}
                                <span
                                  className={`text-xs ${
                                    isChecked ? 'line-through text-slate-400 font-medium' : 'text-slate-800 font-semibold'
                                  }`}
                                >
                                  {deliv}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Client Status Notes Feed */}
                    <div className="p-4 bg-white border border-slate-200 rounded-xl space-y-3 flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <h4 className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-blue-600" />
                            <span>Client Progress Updates Feed</span>
                          </h4>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {(statusNotes[selectedCaseForDetail.id] || []).length} Updates
                          </span>
                        </div>

                        {/* Notes List */}
                        <div className="space-y-2.5 max-h-[180px] overflow-y-auto">
                          {(statusNotes[selectedCaseForDetail.id] || []).length === 0 ? (
                            <p className="text-slate-400 text-center py-4">
                              No status notes recorded yet for this matter.
                            </p>
                          ) : (
                            (statusNotes[selectedCaseForDetail.id] || []).map((noteItem) => (
                              <div
                                key={noteItem.id}
                                className="p-2.5 bg-slate-50 border border-slate-200 rounded-md space-y-1"
                              >
                                <div className="flex items-center justify-between text-[10px] text-slate-500">
                                  <strong className="text-slate-800">{noteItem.author}</strong>
                                  <span className="font-mono">{noteItem.timestamp}</span>
                                </div>
                                <p className="text-slate-700 leading-relaxed">{noteItem.note}</p>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                      {/* Post Status Note Form */}
                      <form
                        onSubmit={(e) => handlePostNoteSubmit(e, selectedCaseForDetail.id)}
                        className="pt-3 border-t border-slate-100 flex items-center gap-2"
                      >
                        <input
                          type="text"
                          value={newNoteText}
                          onChange={(e) => setNewNoteText(e.target.value)}
                          placeholder="Post status update for client & staff..."
                          className="flex-1 bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          type="submit"
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-semibold text-xs flex items-center gap-1 shadow-sm transition shrink-0"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Post Note</span>
                        </button>
                      </form>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* NEW CASE MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden animate-in fade-in text-slate-900">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">Open New Client Case File</h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCaseSubmit} className="p-5 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Case Title / Caption *</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Apex Logistics v. Port Authority"
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Client Name *</label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g., Apex Logistics Inc"
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Client Email</label>
                  <input
                    type="email"
                    value={clientEmail}
                    onChange={(e) => setClientEmail(e.target.value)}
                    placeholder="legal@apex.com"
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Practice Area</label>
                  <select
                    value={practiceArea}
                    onChange={(e) => setPracticeArea(e.target.value as PracticeArea)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-slate-900 focus:outline-none"
                  >
                    <option value="Corporate">Corporate</option>
                    <option value="Intellectual Property">Intellectual Property</option>
                    <option value="Litigation">Litigation</option>
                    <option value="Family Law">Family Law</option>
                    <option value="Real Estate">Real Estate</option>
                    <option value="Tax Law">Tax Law</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Assigned Counsel</label>
                  <input
                    type="text"
                    value={assignedLawyerName}
                    onChange={(e) => setAssignedLawyerName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Retainer Deposit ($)</label>
                  <input
                    type="number"
                    value={retainerAmount}
                    onChange={(e) => setRetainerAmount(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-slate-900 focus:outline-none font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Hourly Billing Rate ($/hr)</label>
                  <input
                    type="number"
                    value={hourlyRate}
                    onChange={(e) => setHourlyRate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-slate-900 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Initial Matter Description</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Summary of legal issue, cause of action, or contract scope..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-sm"
                >
                  Open Matter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BATCH STATUS UPDATE MODAL */}
      {isBatchStatusModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden my-8 text-slate-900 animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-600 rounded-lg text-white">
                  <SlidersHorizontal className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Batch Matter Status Transition</h3>
                  <p className="text-xs text-slate-400">
                    Advancing lifecycle stages for {selectedCases.length} selected legal matter{selectedCases.length > 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsBatchStatusModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Selected Matters Preview */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>Selected Matters ({selectedCases.length})</span>
                  <span className="text-slate-400 font-normal">All will be shifted to target stage</span>
                </div>
                <div className="max-h-32 overflow-y-auto p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5 divide-y divide-slate-100">
                  {selectedCases.map((c) => (
                    <div key={c.id} className="pt-1.5 first:pt-0 flex items-center justify-between gap-2 text-xs">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="font-mono font-bold text-[10px] px-1.5 py-0.5 rounded bg-white text-slate-700 border border-slate-200">
                          {c.caseNumber}
                        </span>
                        <span className="font-semibold text-slate-900 truncate">{c.title}</span>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded font-bold capitalize border shrink-0 ${statusBadgeColors[c.status]}`}>
                        Current: {c.status.replace('_', ' ')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Target Status Selection Grid */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  Select Target Lifecycle Stage <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {CASE_LIFECYCLE_STAGES.map((stg) => {
                    const isSelected = batchTargetStatus === stg.key;
                    return (
                      <button
                        key={stg.key}
                        type="button"
                        onClick={() => setBatchTargetStatus(stg.key)}
                        className={`p-3 rounded-xl border text-left transition flex flex-col justify-between space-y-1.5 ${
                          isSelected
                            ? 'bg-blue-50/70 border-blue-600 ring-2 ring-blue-500/20 text-slate-900 shadow-sm'
                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                            Step {stg.stepNumber}
                          </span>
                          {isSelected && <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />}
                        </div>
                        <div>
                          <div className="font-bold text-xs text-slate-900">{stg.label}</div>
                          <div className="text-[10px] text-slate-500 line-clamp-1">{stg.shortDesc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Status Update Note */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">
                  Batch Activity Log / Counsel Note (Optional)
                </label>
                <textarea
                  value={batchStatusNote}
                  onChange={(e) => setBatchStatusNote(e.target.value)}
                  placeholder="e.g., Joint scheduling order entered across all docket matters; advancing to Discovery..."
                  rows={3}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-[10px] text-slate-400">
                  This note will be automatically recorded in the activity log of every selected matter.
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsBatchStatusModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleBatchStatusApply}
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md transition flex items-center gap-2"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>
                    Apply Status to {selectedCases.length} Matter{selectedCases.length > 1 ? 's' : ''}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LAWYER EVIDENCE PROOF INSPECTOR MODAL */}
      {selectedEvidenceForLawyer && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden text-slate-900 animate-in fade-in">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-blue-400" />
                <div>
                  <h3 className="font-bold text-white text-sm">Client Evidence & Exhibit Inspector</h3>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {selectedEvidenceForLawyer.requestTitle}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedEvidenceForLawyer(null)}
                className="p-1 text-slate-400 hover:text-white rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wide">
                      {selectedEvidenceForLawyer.evidence.category}
                    </span>
                    <h4 className="font-bold text-slate-900 text-sm">{selectedEvidenceForLawyer.evidence.title}</h4>
                  </div>
                  {selectedEvidenceForLawyer.evidence.confidential && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      Privileged
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 pt-2 border-t border-slate-200">
                  <div>
                    <span className="text-slate-400 block font-bold text-[10px]">Client Provider:</span>
                    <span className="font-bold text-slate-800">{selectedEvidenceForLawyer.clientName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-bold text-[10px]">File Attachment:</span>
                    <span className="font-mono text-slate-800 font-bold">{selectedEvidenceForLawyer.evidence.fileName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-bold text-[10px]">Date of Record:</span>
                    <span className="font-mono text-slate-800">{selectedEvidenceForLawyer.evidence.dateOfEvidence || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-bold text-[10px]">File Size:</span>
                    <span className="font-mono text-slate-800">{selectedEvidenceForLawyer.evidence.fileSize || '2.4 MB'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Evidentiary Description / Client Statement:
                </span>
                <div className="p-3 bg-white border border-slate-200 rounded-xl text-slate-700 leading-relaxed font-normal">
                  {selectedEvidenceForLawyer.evidence.description || 'No specific description notes provided.'}
                </div>
              </div>

              <div className="p-3.5 bg-blue-50/60 border border-blue-200 rounded-xl text-slate-700 text-[11px] flex items-center gap-2.5">
                <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
                <span>
                  <strong>Legal Vault Ingestion Ready:</strong> Accepting this intake request will automatically ingest this proof artifact into the firm's confidential document repository under the new matter.
                </span>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">JurisPulse Evidence Management</span>
                <button
                  type="button"
                  onClick={() => setSelectedEvidenceForLawyer(null)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-xs transition"
                >
                  Close Inspection
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
