import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Briefcase,
  FileText,
  MessageSquareLock,
  Receipt,
  ShieldCheck,
  Lock,
  Search,
  UserCheck,
  Calendar,
  Download,
  Eye,
  CheckCircle2,
  Clock,
  Send,
  FileType,
  AlertCircle,
  Paperclip,
  ChevronRight,
  ShieldAlert,
  Sparkles,
  Info,
  Bell,
  X,
  PlusCircle,
  UserPlus,
  Scale,
  XCircle,
  DollarSign,
  Printer,
  UploadCloud,
  Trash2,
  Users,
  CheckSquare,
  FilePlus,
  ExternalLink,
  Plus,
  LogOut,
  CreditCard,
  Wallet,
  Building,
  Check,
  RotateCcw,
  Landmark,
  Loader2,
  FileSignature,
  Fingerprint,
  ChevronDown,
  ChevronUp,
  AlertTriangle
} from 'lucide-react';
import {
  CaseFile,
  ClientDocument,
  CaseDeadline,
  Invoice,
  EncryptedMessage,
  MessageThread,
  UserRole,
  ClientRepresentationRequest,
  PracticeArea,
  User,
  EvidenceProof,
  DigitalConsentRecord
} from '../types';
import { exportInvoicePDF, exportClientStatusReceiptPDF } from '../utils/pdfExport';

interface ClientPortalViewProps {
  cases: CaseFile[];
  documents: ClientDocument[];
  deadlines: CaseDeadline[];
  invoices: Invoice[];
  messages: EncryptedMessage[];
  threads: MessageThread[];
  userRole: UserRole;
  clientRequests?: ClientRepresentationRequest[];
  users?: User[];
  initialSubTab?: 'cases' | 'documents' | 'messaging' | 'statements' | 'requests';
  onSendMessage: (msg: EncryptedMessage) => void;
  onAddClientRequest?: (req: ClientRepresentationRequest) => void;
  onUpdateClientConsent?: (requestId: string, consent: DigitalConsentRecord) => void;
  onAddDocument?: (doc: ClientDocument) => void;
  onUpdateInvoiceStatus?: (id: string, status: Invoice['status']) => void;
  onNavigateTab?: (tab: string) => void;
  onSwitchToFirmRole?: () => void;
}

export const ClientPortalView: React.FC<ClientPortalViewProps> = ({
  cases,
  documents,
  deadlines,
  invoices,
  messages,
  threads,
  userRole,
  clientRequests = [],
  users = [],
  initialSubTab,
  onSendMessage,
  onAddClientRequest,
  onUpdateClientConsent,
  onAddDocument,
  onUpdateInvoiceStatus,
  onNavigateTab,
  onSwitchToFirmRole
}) => {
  // Client selection (consolidates from cases, documents, invoices, and requests)
  const clientNamesList = useMemo(() => {
    const fromCases = cases.map((c) => c.clientName);
    const fromDocs = documents.map((d) => d.clientName);
    const fromInvoices = invoices.map((i) => i.clientName);
    const fromRequests = clientRequests.map((r) => r.clientName);
    const names = Array.from(new Set([...fromCases, ...fromDocs, ...fromInvoices, ...fromRequests].filter(Boolean)));
    return names.length > 0 ? names : ['AeroTech Dynamics Global', 'Helios Energy Group', 'Apex BioVentures Corp'];
  }, [cases, documents, invoices, clientRequests]);

  const [selectedClientName, setSelectedClientName] = useState<string>(clientNamesList[0] || 'AeroTech Dynamics Global');
  const [activePortalTab, setActivePortalTab] = useState<'cases' | 'documents' | 'messaging' | 'statements' | 'requests'>('cases');

  // Sync initialSubTab if provided externally from sidebar or navigation
  useEffect(() => {
    if (initialSubTab) {
      setActivePortalTab(initialSubTab);
    }
  }, [initialSubTab]);

  const handleSwitchTab = (tab: 'cases' | 'documents' | 'messaging' | 'statements' | 'requests') => {
    setActivePortalTab(tab);
    if (onNavigateTab) {
      if (tab === 'documents') onNavigateTab('documents');
      else if (tab === 'messaging') onNavigateTab('messaging');
      else if (tab === 'statements') onNavigateTab('billing');
      else onNavigateTab('client_portal');
    }
  };

  // Direct Document Upload Modal State for Client
  const [isDocUploadModalOpen, setIsDocUploadModalOpen] = useState(false);
  const [uploadDocCaseId, setUploadDocCaseId] = useState('');
  const [uploadDocTitle, setUploadDocTitle] = useState('');
  const [uploadDocFileName, setUploadDocFileName] = useState('');
  const [uploadDocCategory, setUploadDocCategory] = useState<ClientDocument['category']>('Evidence');
  const [uploadDocConfidential, setUploadDocConfidential] = useState(true);
  const [uploadDocNotes, setUploadDocNotes] = useState('');

  // Invoice Payment Modal State
  const [selectedInvoiceForPayment, setSelectedInvoiceForPayment] = useState<Invoice | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'wire' | 'trust'>('card');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [paymentReceiptNumber, setPaymentReceiptNumber] = useState('');

  // Request Modal State
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [reqTitle, setReqTitle] = useState('');
  const [reqPracticeArea, setReqPracticeArea] = useState<PracticeArea>('Intellectual Property');
  const [reqPreferredLawyerId, setReqPreferredLawyerId] = useState<string>('');
  const [reqTargetLawyerIds, setReqTargetLawyerIds] = useState<string[]>([]);
  const [reqSummary, setReqSummary] = useState('');
  const [reqBudget, setReqBudget] = useState<string>('30000');
  const [reqEmail, setReqEmail] = useState('client@enterprise.com');
  const [reqPhone, setReqPhone] = useState('+1 (555) 438-9900');
  const [reqOpposingParty, setReqOpposingParty] = useState('');
  const [reqIncidentDate, setReqIncidentDate] = useState('');
  const [reqUrgencyLevel, setReqUrgencyLevel] = useState<'Standard' | 'Urgent (Within 48h)' | 'Critical / Immediate Court Filing'>('Standard');
  
  // Attached Evidence & Proofs during request submission
  const [reqEvidenceList, setReqEvidenceList] = useState<EvidenceProof[]>([]);

  // Digital Consent State in Request Modal
  const [reqDigitalConsentAgreed, setReqDigitalConsentAgreed] = useState(true);
  const [reqSignerName, setReqSignerName] = useState('Alexander Wright (Authorized Officer)');
  const [reqSignerTitle, setReqSignerTitle] = useState('General Counsel / Executive Director');
  const [reqShowConsentTerms, setReqShowConsentTerms] = useState(false);

  // Digital Consent Certificate Inspection Modal State
  const [selectedConsentCertReq, setSelectedConsentCertReq] = useState<ClientRepresentationRequest | null>(null);

  // Standalone Digital Consent Signing Modal (for signing on pending requests)
  const [signingConsentForReq, setSigningConsentForReq] = useState<ClientRepresentationRequest | null>(null);
  const [quickSignerName, setQuickSignerName] = useState('Authorized Client Representative');
  const [quickSignerTitle, setQuickSignerTitle] = useState('Corporate Officer');

  // Draft Evidence Form state inside request modal
  const [isAddingEvidenceForm, setIsAddingEvidenceForm] = useState(false);
  const [draftEvTitle, setDraftEvTitle] = useState('');
  const [draftEvCategory, setDraftEvCategory] = useState<EvidenceProof['category']>('Contract & Agreement');
  const [draftEvFileName, setDraftEvFileName] = useState('');
  const [draftEvDesc, setDraftEvDesc] = useState('');
  const [draftEvDate, setDraftEvDate] = useState(new Date().toISOString().slice(0, 10));
  const [draftEvConfidential, setDraftEvConfidential] = useState(true);

  // Evidence Inspection Modal state
  const [selectedEvidenceModal, setSelectedEvidenceModal] = useState<{
    evidence: EvidenceProof;
    requestTitle: string;
    clientName: string;
  } | null>(null);

  // Supplemental Evidence Upload to existing request modal
  const [supplementalReqId, setSupplementalReqId] = useState<string | null>(null);

  // Search & Filters
  const [caseSearch, setCaseSearch] = useState('');
  const [docSearch, setDocSearch] = useState('');
  const [docCategory, setDocCategory] = useState('all');

  // Document Modal state
  const [selectedDocModal, setSelectedDocModal] = useState<ClientDocument | null>(null);

  // Message Input state
  const [messageInput, setMessageInput] = useState('');

  // Attorneys List for preferred selection
  const attorneysList = useMemo(() => {
    return users.filter((u) => u.role === 'admin' || u.role === 'partner' || u.role === 'associate');
  }, [users]);

  // Client Specific Data
  const clientCases = useMemo(() => {
    return cases.filter(
      (c) =>
        c.clientName.toLowerCase() === selectedClientName.toLowerCase() ||
        c.clientEmail.toLowerCase().includes(selectedClientName.toLowerCase().split(' ')[0])
    );
  }, [cases, selectedClientName]);

  const clientCaseIds = useMemo(() => clientCases.map((c) => c.id), [clientCases]);

  const clientDocs = useMemo(() => {
    return documents.filter((d) => clientCaseIds.includes(d.caseId) || d.clientName.toLowerCase() === selectedClientName.toLowerCase());
  }, [documents, clientCaseIds, selectedClientName]);

  const clientDeadlines = useMemo(() => {
    return deadlines.filter((d) => clientCaseIds.includes(d.caseId));
  }, [deadlines, clientCaseIds]);

  const clientInvoices = useMemo(() => {
    return invoices.filter((inv) => clientCaseIds.includes(inv.caseId) || inv.clientName.toLowerCase() === selectedClientName.toLowerCase());
  }, [invoices, clientCaseIds, selectedClientName]);

  const myRequests = useMemo(() => {
    return clientRequests.filter(
      (r) =>
        r.clientName.toLowerCase().includes(selectedClientName.toLowerCase()) ||
        selectedClientName.toLowerCase().includes(r.clientName.toLowerCase())
    );
  }, [clientRequests, selectedClientName]);

  // Add evidence draft to request
  const handleAddEvidenceDraft = () => {
    if (!draftEvTitle.trim()) return;

    const newEvidence: EvidenceProof = {
      id: `ev-${Date.now()}`,
      title: draftEvTitle.trim(),
      category: draftEvCategory,
      fileName: draftEvFileName.trim() || `${draftEvTitle.trim().replace(/\s+/g, '_')}_Exhibit.pdf`,
      fileSize: `${(Math.random() * 4 + 1.2).toFixed(1)} MB`,
      fileType: draftEvFileName.endsWith('.xlsx') ? 'xlsx' : draftEvFileName.endsWith('.docx') ? 'docx' : 'pdf',
      description: draftEvDesc.trim() || `Evidentiary proof submitted by client for review.`,
      dateOfEvidence: draftEvDate || new Date().toISOString().slice(0, 10),
      confidential: draftEvConfidential,
      uploadedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };

    setReqEvidenceList((prev) => [...prev, newEvidence]);

    // Reset draft fields
    setDraftEvTitle('');
    setDraftEvFileName('');
    setDraftEvDesc('');
    setIsAddingEvidenceForm(false);

    const toast: ToastNotification = {
      id: `toast-ev-${Date.now()}`,
      title: 'Evidence Proof Attached',
      message: `Attached "${newEvidence.title}" to request package.`,
      timestamp: 'Just now',
      type: 'document'
    };
    setToasts((prev) => [toast, ...prev]);
  };

  const handleRemoveEvidence = (id: string) => {
    setReqEvidenceList((prev) => prev.filter((ev) => ev.id !== id));
  };

  // Quick preset sample evidence helper
  const handleAddSampleEvidence = (sampleType: 'contract' | 'bank' | 'incident' | 'witness') => {
    let sample: EvidenceProof;
    if (sampleType === 'contract') {
      sample = {
        id: `ev-sample-${Date.now()}`,
        title: 'Master Service Agreement & Non-Compete Covenant',
        category: 'Contract & Agreement',
        fileName: 'Executed_Master_Agreement_Exhibit_A.pdf',
        fileSize: '3.4 MB',
        fileType: 'pdf',
        description: 'Signed commercial agreement with Section 9 non-solicitation & exclusivity clauses.',
        dateOfEvidence: '2026-03-15',
        confidential: true,
        uploadedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
      };
    } else if (sampleType === 'bank') {
      sample = {
        id: `ev-sample-${Date.now()}`,
        title: 'Wire Transfer Confirmation & Escrow Audit Ledger',
        category: 'Financial & Bank Record',
        fileName: 'JPMorgan_Escrow_Wire_Receipt_7749.pdf',
        fileSize: '1.6 MB',
        fileType: 'pdf',
        description: 'Certified bank transaction statement showing wire transfer confirmation of $1,250,000.',
        dateOfEvidence: '2026-06-20',
        confidential: true,
        uploadedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
      };
    } else if (sampleType === 'incident') {
      sample = {
        id: `ev-sample-${Date.now()}`,
        title: 'Photographic Inspection & Municipal Police Incident Report',
        category: 'Photo & Visual Proof',
        fileName: 'Police_Report_Inspection_Photos_Exhibit.pdf',
        fileSize: '8.2 MB',
        fileType: 'pdf',
        description: 'High-resolution site inspection photographs and stamped police report incident log.',
        dateOfEvidence: '2026-07-12',
        confidential: false,
        uploadedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
      };
    } else {
      sample = {
        id: `ev-sample-${Date.now()}`,
        title: 'Sworn Witness Affidavit & Notarized Deposition Statement',
        category: 'Witness Statement',
        fileName: 'Affidavit_Witness_Eyewitness_Notarized.pdf',
        fileSize: '2.1 MB',
        fileType: 'pdf',
        description: 'Notarized sworn statement from direct eyewitness verifying chronological event sequence.',
        dateOfEvidence: '2026-07-25',
        confidential: true,
        uploadedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
      };
    }

    setReqEvidenceList((prev) => [...prev, sample]);
    const toast: ToastNotification = {
      id: `toast-ev-${Date.now()}`,
      title: 'Sample Evidence Attached',
      message: `Added sample proof: "${sample.title}"`,
      timestamp: 'Just now',
      type: 'document'
    };
    setToasts((prev) => [toast, ...prev]);
  };

  const handleToggleTargetLawyer = (lawyerId: string) => {
    setReqTargetLawyerIds((prev) =>
      prev.includes(lawyerId) ? prev.filter((id) => id !== lawyerId) : [...prev, lawyerId]
    );
  };

  const handleSubmitRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reqTitle.trim() || !reqSummary.trim()) return;

    const selectedLawyerObj = attorneysList.find((a) => a.id === reqPreferredLawyerId);
    
    // Resolve all targeted lawyer names
    const targetNames = reqTargetLawyerIds.map((id) => {
      const found = attorneysList.find((a) => a.id === id);
      return found ? `${found.name} (${found.title})` : id;
    });

    const consentTimestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
    const rawConsentHash = `SHA256:CON-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const consentRecord: DigitalConsentRecord = {
      agreed: reqDigitalConsentAgreed,
      consentedAt: reqDigitalConsentAgreed ? consentTimestamp : '',
      consentedBy: reqDigitalConsentAgreed ? (reqSignerName.trim() || `${selectedClientName} Authorized Representative`) : '',
      signerRole: reqSignerTitle.trim() || 'Designated Client Representative',
      signerEmail: reqEmail,
      signerIp: '192.168.1.188 (SSL Encrypted)',
      termsVersion: 'v2026.4-ETHICS-ESIGN',
      consentHash: reqDigitalConsentAgreed ? rawConsentHash : undefined,
      acknowledgedClauses: reqDigitalConsentAgreed
        ? [
            'Authorization for conflict check & electronic database record creation',
            'Acknowledgment of preliminary non-engagement until formal retainer executed',
            'Confidentiality & Attorney-Client Privilege safeguards under Rule 1.6',
            'Consent to secure electronic encrypted communications & audit trail retention'
          ]
        : []
    };

    const newReq: ClientRepresentationRequest = {
      id: `req-${Date.now()}`,
      clientName: selectedClientName,
      clientEmail: reqEmail,
      clientPhone: reqPhone,
      practiceArea: reqPracticeArea,
      preferredLawyerId: reqPreferredLawyerId || undefined,
      preferredLawyerName: selectedLawyerObj ? selectedLawyerObj.name : 'Any Available Senior Counsel',
      targetLawyerIds: reqTargetLawyerIds.length > 0 ? reqTargetLawyerIds : (reqPreferredLawyerId ? [reqPreferredLawyerId] : undefined),
      targetLawyerNames: targetNames.length > 0 ? targetNames : (selectedLawyerObj ? [selectedLawyerObj.name] : ['Senior Partner Review Panel']),
      requestTitle: reqTitle,
      caseSummary: reqSummary,
      opposingParty: reqOpposingParty.trim() || undefined,
      incidentDate: reqIncidentDate || undefined,
      urgencyLevel: reqUrgencyLevel,
      estimatedBudget: parseFloat(reqBudget) || 25000,
      evidenceList: reqEvidenceList.length > 0 ? [...reqEvidenceList] : undefined,
      digitalConsent: consentRecord,
      submittedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'pending'
    };

    if (onAddClientRequest) {
      onAddClientRequest(newReq);
    }

    // Add toast notification
    const successToast: ToastNotification = {
      id: `toast-req-${Date.now()}`,
      title: reqDigitalConsentAgreed
        ? 'Request Submitted with Digital Consent'
        : 'Request Submitted (Digital Consent Pending)',
      message: reqDigitalConsentAgreed
        ? `Your request "${reqTitle}" with verified digital consent and ${reqEvidenceList.length} proof item(s) was sent to counsel.`
        : `Your request "${reqTitle}" was sent, but formal representation acceptance requires executing digital consent.`,
      timestamp: 'Just now',
      type: reqDigitalConsentAgreed ? 'info' : 'status'
    };
    setToasts((prev) => [successToast, ...prev]);

    // Reset form & close modal
    setReqTitle('');
    setReqSummary('');
    setReqOpposingParty('');
    setReqIncidentDate('');
    setReqEvidenceList([]);
    setReqTargetLawyerIds([]);
    setReqDigitalConsentAgreed(true);
    setIsRequestModalOpen(false);
    setActivePortalTab('requests');
  };

  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  const handleDownloadReceipt = () => {
    exportClientStatusReceiptPDF(selectedClientName, clientCases, clientDocs, clientInvoices);
    const toast: ToastNotification = {
      id: `toast-rcpt-${Date.now()}`,
      title: 'Status Receipt PDF Downloaded',
      message: `Generated official status statement receipt for ${selectedClientName}.`,
      timestamp: 'Just now',
      type: 'info'
    };
    setToasts((prev) => [toast, ...prev]);
  };

  const handlePrintStatus = () => {
    setIsPrintModalOpen(true);
  };

  const activeThread = useMemo(() => {
    return (
      threads.find((th) => th.participantName.toLowerCase().includes(selectedClientName.toLowerCase())) ||
      threads[0]
    );
  }, [threads, selectedClientName]);

  const threadMessages = useMemo(() => {
    if (!activeThread) return messages;
    return messages.filter((m) => m.threadId === activeThread.id);
  }, [messages, activeThread]);

  // Case Status Stages List for visual stepper
  const caseStages: { key: CaseFile['status']; label: string }[] = [
    { key: 'intake', label: 'Intake' },
    { key: 'discovery', label: 'Discovery' },
    { key: 'pre_trial', label: 'Pre-Trial' },
    { key: 'trial', label: 'Trial' },
    { key: 'settlement', label: 'Settlement' },
    { key: 'closed', label: 'Closed' }
  ];

  const getStageIndex = (status: CaseFile['status']) => {
    return caseStages.findIndex((s) => s.key === status);
  };

  // Toast Notifications System for Case Status Updates
  interface ToastNotification {
    id: string;
    title: string;
    message: string;
    caseNumber?: string;
    timestamp: string;
    type?: 'status' | 'document' | 'info';
  }

  const [toasts, setToasts] = useState<ToastNotification[]>([
    {
      id: 'toast-initial-1',
      title: 'Case Status Update Alert',
      message: 'Matter JP-2026-8942 status was updated to DISCOVERY stage by lead counsel.',
      caseNumber: 'JP-2026-8942',
      timestamp: 'Just now',
      type: 'status'
    }
  ]);

  const prevStatusesRef = useRef<Record<string, CaseFile['status']>>({});

  useEffect(() => {
    const prevMap = prevStatusesRef.current;
    cases.forEach((c) => {
      const prevStatus = prevMap[c.id];
      if (prevStatus && prevStatus !== c.status) {
        const stageLabel = caseStages.find((s) => s.key === c.status)?.label || c.status;
        const newToast: ToastNotification = {
          id: `toast-${Date.now()}-${Math.random()}`,
          title: 'Case Status Updated by Firm',
          message: `Case "${c.title}" (${c.caseNumber}) status changed to ${stageLabel.toUpperCase()}`,
          caseNumber: c.caseNumber,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'status'
        };
        setToasts((prev) => [newToast, ...prev]);
      }
      prevMap[c.id] = c.status;
    });
  }, [cases]);

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const handleTriggerTestStatusToast = () => {
    const randomCase = clientCases[0] || cases[0];
    const stages: CaseFile['status'][] = ['intake', 'discovery', 'pre_trial', 'trial', 'settlement', 'closed'];
    const currentIdx = caseStages.findIndex((s) => s.key === (randomCase?.status || 'intake'));
    const nextStageKey = stages[(currentIdx + 1) % stages.length];
    const nextStageLabel = caseStages.find((s) => s.key === nextStageKey)?.label || nextStageKey;

    const testToast: ToastNotification = {
      id: `toast-sim-${Date.now()}`,
      title: 'Firm Status Update Alert',
      message: `Attorney Sophia Chen updated matter ${randomCase?.caseNumber || 'JP-2026-8942'} status to ${nextStageLabel.toUpperCase()} stage.`,
      caseNumber: randomCase?.caseNumber || 'JP-2026-8942',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'status'
    };

    setToasts((prev) => [testToast, ...prev]);
  };

  const handleSendMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageInput.trim()) return;

    const newMsg: EncryptedMessage = {
      id: `msg-${Date.now()}`,
      threadId: activeThread?.id || 'th-1',
      senderId: 'client-user',
      senderName: `${selectedClientName} (Client)`,
      senderRole: 'client',
      recipientId: 'u-3',
      recipientName: activeThread?.participantName || 'Sophia Chen',
      encryptedContent: `[AES-256] ${messageInput}`,
      decryptedContent: messageInput,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isEncrypted: true,
      keyFingerprint: activeThread?.keyFingerprint || 'rsa-4096-88a1'
    };

    onSendMessage(newMsg);
    setMessageInput('');
  };

  // Direct Document Upload for Client
  const handleUploadDocumentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadDocTitle.trim()) return;

    const targetCaseId = uploadDocCaseId || (clientCases[0] ? clientCases[0].id : cases[0]?.id || 'case-1');
    const targetCase = cases.find((c) => c.id === targetCaseId);
    const targetCaseTitle = targetCase ? targetCase.title : 'Active Litigation Matter';
    const finalFileName = uploadDocFileName.trim() || `${uploadDocTitle.trim().replace(/\s+/g, '_')}.pdf`;

    const newDoc: ClientDocument = {
      id: `doc-client-${Date.now()}`,
      caseId: targetCaseId,
      caseTitle: targetCaseTitle,
      clientName: selectedClientName,
      fileName: finalFileName,
      fileSize: `${(Math.random() * 3 + 1.2).toFixed(1)} MB`,
      fileType: finalFileName.endsWith('.xlsx') ? 'xlsx' : finalFileName.endsWith('.docx') ? 'docx' : 'pdf',
      category: uploadDocCategory,
      uploadedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      uploadedBy: `${selectedClientName} (Client Vault Upload)`,
      version: '1.0',
      isConfidential: uploadDocConfidential,
      verificationStatus: 'Needs Review',
      custodyHash: `SHA256: ${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`,
      chainOfCustody: [
        {
          id: `cust-${Date.now()}-1`,
          action: 'Uploaded',
          performedBy: `${selectedClientName} (Client Portal Vault)`,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
          note: uploadDocNotes.trim() || `Client uploaded document "${finalFileName}" to matter vault.`
        }
      ],
      aiSummary: uploadDocNotes.trim() || `Client submitted file for ${uploadDocCategory} in ${targetCaseTitle}. Pending attorney cryptographic audit.`,
      aiRiskLevel: uploadDocConfidential ? 'Moderate' : 'Low',
      aiKeyClauses: [
        `Category: ${uploadDocCategory}`,
        `Client Uploaded: ${new Date().toISOString().slice(0, 10)}`,
        'Uploaded via JurisPulse Client Vault with SHA-256 custody logging.'
      ]
    };

    if (onAddDocument) {
      onAddDocument(newDoc);
    }

    const toast: ToastNotification = {
      id: `toast-doc-up-${Date.now()}`,
      title: 'Document Uploaded to Vault',
      message: `"${finalFileName}" submitted to matter "${targetCaseTitle}". Counsel has been notified.`,
      timestamp: 'Just now',
      type: 'document'
    };
    setToasts((prev) => [toast, ...prev]);

    // Reset form & close
    setUploadDocTitle('');
    setUploadDocFileName('');
    setUploadDocNotes('');
    setIsDocUploadModalOpen(false);
  };

  // Process Online Payment
  const handleProcessInvoicePayment = () => {
    if (!selectedInvoiceForPayment) return;

    setIsProcessingPayment(true);
    setTimeout(() => {
      if (onUpdateInvoiceStatus) {
        onUpdateInvoiceStatus(selectedInvoiceForPayment.id, 'paid');
      }

      const receiptNum = `RCPT-${Math.floor(100000 + Math.random() * 900000)}`;
      setPaymentReceiptNumber(receiptNum);
      setIsProcessingPayment(false);

      const toast: ToastNotification = {
        id: `toast-pay-${Date.now()}`,
        title: 'Invoice Payment Settled',
        message: `Successfully processed $${selectedInvoiceForPayment.totalAmount.toLocaleString()} for Invoice ${selectedInvoiceForPayment.invoiceNumber} via ${paymentMethod === 'card' ? 'Corporate Credit Card' : paymentMethod === 'wire' ? 'Escrow Trust Wire' : 'ACH Direct'}.`,
        timestamp: 'Just now',
        type: 'info'
      };
      setToasts((prev) => [toast, ...prev]);
      setSelectedInvoiceForPayment(null);
    }, 800);
  };

  // Filtered cases & docs
  const filteredClientCases = useMemo(() => {
    return clientCases.filter(
      (c) =>
        c.title.toLowerCase().includes(caseSearch.toLowerCase()) ||
        c.caseNumber.toLowerCase().includes(caseSearch.toLowerCase()) ||
        c.practiceArea.toLowerCase().includes(caseSearch.toLowerCase())
    );
  }, [clientCases, caseSearch]);

  const filteredClientDocs = useMemo(() => {
    return clientDocs.filter((d) => {
      const matchesSearch =
        d.fileName.toLowerCase().includes(docSearch.toLowerCase()) ||
        d.caseTitle.toLowerCase().includes(docSearch.toLowerCase());
      const matchesCat = docCategory === 'all' || d.category === docCategory;
      return matchesSearch && matchesCat;
    });
  }, [clientDocs, docSearch, docCategory]);

  // Primary attorney contact info for selected client
  const primaryAttorney = clientCases[0]?.assignedLawyerName || 'Sophia Chen (Senior Associate)';

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Client Header & Scope Notification */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
        {/* Main Header Row */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold text-slate-900 font-sans whitespace-nowrap">External Client Portal</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wide flex items-center gap-1 shrink-0 whitespace-nowrap">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Read-Only Vault</span>
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wide flex items-center gap-1 shrink-0 whitespace-nowrap">
                <Lock className="w-3 h-3 text-emerald-600 shrink-0" />
                <span>AES-256 E2EE</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-3xl">
              Secure access for corporate clients and individual parties to monitor active litigation status, review shared discovery pleadings, upload evidence, and communicate with counsel.
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            {onSwitchToFirmRole && (
              <button
                onClick={onSwitchToFirmRole}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-md font-bold text-xs flex items-center gap-1.5 shadow-sm transition whitespace-nowrap"
                title="Switch back to Attorney / Partner workspace"
              >
                <LogOut className="w-3.5 h-3.5 text-slate-600" />
                <span>Lawyer View</span>
              </button>
            )}

            <button
              onClick={() => setIsRequestModalOpen(true)}
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-bold text-xs flex items-center gap-1.5 shadow-sm transition whitespace-nowrap"
            >
              <UserPlus className="w-3.5 h-3.5 text-white" />
              <span>Request Representation</span>
            </button>

            <button
              onClick={handleTriggerTestStatusToast}
              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-md font-semibold text-xs flex items-center gap-1.5 shadow-sm transition whitespace-nowrap"
            >
              <Bell className="w-3.5 h-3.5 text-blue-600" />
              <span>Test Alert</span>
            </button>
          </div>
        </div>

        {/* Client Account Selector & Quick Switch Row */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-1 bg-slate-50/70 p-3 rounded-xl border border-slate-200/80">
          <div className="flex flex-wrap items-center gap-2 min-w-0">
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-2.5 py-1 shadow-xs">
              <span className="text-xs font-semibold text-slate-600 shrink-0 whitespace-nowrap">Viewing Client:</span>
              <select
                value={selectedClientName}
                onChange={(e) => setSelectedClientName(e.target.value)}
                className="bg-transparent text-slate-900 font-bold text-xs focus:outline-none cursor-pointer pr-1"
              >
                {clientNamesList.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Client Selection Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              {clientNamesList.map((cName) => (
                <button
                  key={cName}
                  onClick={() => setSelectedClientName(cName)}
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold transition whitespace-nowrap ${
                    selectedClientName === cName
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {cName}
                </button>
              ))}
            </div>
          </div>

          {/* Download and Print Utilities */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleDownloadReceipt}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md font-bold text-xs flex items-center gap-1.5 shadow-sm transition whitespace-nowrap"
              title="Download PDF Receipt of Active Cases & Listed Documents"
            >
              <Download className="w-3.5 h-3.5 text-blue-400" />
              <span>Download Receipt</span>
            </button>

            <button
              onClick={handlePrintStatus}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md font-bold text-xs flex items-center gap-1.5 shadow-sm transition whitespace-nowrap"
              title="Print Summary Report of Active Cases & Documents"
            >
              <Printer className="w-3.5 h-3.5 text-white" />
              <span>Print Status</span>
            </button>
          </div>
        </div>

        {/* Security & Access Isolation Banner */}
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start sm:items-center justify-between gap-3 text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              <strong>Client Data Isolation Active:</strong> Internal attorney hourly billing rates, unbilled time entry sheets, law firm margin ledgers, and employee administration controls are strictly hidden.
            </span>
          </div>
          <span className="hidden md:inline-flex text-[10px] font-mono font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded border border-amber-300">
            SOC2 Restricted
          </span>
        </div>

        {/* High Level KPI Summary Cards for Client */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-1">
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Active Matters</span>
            <div className="text-lg font-bold text-slate-900 mt-0.5">{clientCases.length} Cases</div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Shared Documents</span>
            <div className="text-lg font-bold text-slate-900 mt-0.5">{clientDocs.length} Files</div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Lead Attorney</span>
            <div className="text-xs font-bold text-blue-700 truncate mt-1">{primaryAttorney}</div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Upcoming Milestones</span>
            <div className="text-lg font-bold text-amber-700 mt-0.5">{clientDeadlines.length} Events</div>
          </div>
        </div>
      </div>

      {/* Main Tab Navigation */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => handleSwitchTab('cases')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
            activePortalTab === 'cases'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Briefcase className="w-4 h-4" />
          <span>Case Status & Progression ({clientCases.length})</span>
        </button>

        <button
          onClick={() => handleSwitchTab('documents')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
            activePortalTab === 'documents'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Shared Documents Vault ({clientDocs.length})</span>
        </button>

        <button
          onClick={() => handleSwitchTab('messaging')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
            activePortalTab === 'messaging'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <MessageSquareLock className="w-4 h-4 text-emerald-500" />
          <span>Secure Attorney Chat</span>
        </button>

        <button
          onClick={() => handleSwitchTab('statements')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
            activePortalTab === 'statements'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <Receipt className="w-4 h-4" />
          <span>Client Invoices & Statements ({clientInvoices.length})</span>
        </button>

        <button
          onClick={() => handleSwitchTab('requests')}
          className={`px-4 py-2 rounded-lg text-xs font-bold transition flex items-center gap-2 ${
            activePortalTab === 'requests'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          <span>Representation Requests ({myRequests.length})</span>
        </button>
      </div>

      {/* TAB 1: CASES STATUS & PROGRESSION */}
      {activePortalTab === 'cases' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-lg border border-slate-200">
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={caseSearch}
                onChange={(e) => setCaseSearch(e.target.value)}
                placeholder="Search matter title or case #..."
                className="w-full bg-slate-50 border border-slate-200 rounded-md pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium hidden md:inline">
                Client: <strong className="text-slate-800">{selectedClientName}</strong>
              </span>
              <button
                onClick={handleDownloadReceipt}
                className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded flex items-center gap-1 transition shadow-sm"
                title="Download Receipt PDF"
              >
                <Download className="w-3.5 h-3.5 text-blue-400" />
                <span>Receipt</span>
              </button>
              <button
                onClick={handlePrintStatus}
                className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded flex items-center gap-1 transition shadow-sm"
                title="Print Status Summary"
              >
                <Printer className="w-3.5 h-3.5 text-white" />
                <span>Print Status</span>
              </button>
            </div>
          </div>

          {filteredClientCases.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-500">
              <Briefcase className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold">No active case files found for this client account.</p>
              <p className="text-xs text-slate-400 mt-1">Select a different client from the top dropdown or contact your legal team.</p>
            </div>
          ) : (
            filteredClientCases.map((c) => {
              const currentStageIdx = getStageIndex(c.status);
              const caseDocsCount = documents.filter((d) => d.caseId === c.id).length;
              const caseEvents = clientDeadlines.filter((d) => d.caseId === c.id);

              return (
                <div
                  key={c.id}
                  className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4 hover:border-blue-300 transition"
                >
                  {/* Card Top Info */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                          {c.caseNumber}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                          {c.practiceArea}
                        </span>
                        <span className="text-xs text-slate-400">Opened: {c.openedDate}</span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mt-1">{c.title}</h3>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setDocSearch(c.caseNumber);
                          setActivePortalTab('documents');
                        }}
                        className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-md text-xs font-semibold flex items-center gap-1.5 transition"
                      >
                        <FileText className="w-3.5 h-3.5 text-blue-600" />
                        <span>View Docs ({caseDocsCount})</span>
                      </button>

                      <button
                        onClick={() => setActivePortalTab('messaging')}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
                      >
                        <MessageSquareLock className="w-3.5 h-3.5" />
                        <span>Contact Team</span>
                      </button>
                    </div>
                  </div>

                  {/* Case Progress Stage Stepper */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                      <span>Case Stage Status Progression:</span>
                      <span className="text-blue-700 uppercase bg-blue-100 px-2.5 py-0.5 rounded font-mono text-[11px]">
                        Current Stage: {c.status.replace('_', ' ')}
                      </span>
                    </div>

                    {/* Progress Bar / Stepper */}
                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-2 pt-2">
                      {caseStages.map((stg, idx) => {
                        const isCompleted = idx < currentStageIdx;
                        const isCurrent = idx === currentStageIdx;

                        return (
                          <div
                            key={stg.key}
                            className={`p-2 rounded-md border text-center transition ${
                              isCurrent
                                ? 'bg-blue-600 text-white border-blue-600 shadow-sm font-bold'
                                : isCompleted
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200 font-semibold'
                                : 'bg-white text-slate-400 border-slate-200'
                            }`}
                          >
                            <div className="text-[10px] uppercase font-mono tracking-tight flex items-center justify-center gap-1">
                              {isCompleted && <CheckCircle2 className="w-3 h-3 text-emerald-600" />}
                              {isCurrent && <Clock className="w-3 h-3 text-white animate-pulse" />}
                              <span>{stg.label}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Description & Assigned Counsel */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div className="md:col-span-2 space-y-1">
                      <span className="font-semibold text-slate-700">Matter Summary & Scope:</span>
                      <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-md border border-slate-100">
                        {c.description}
                      </p>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {c.tags.map((tg) => (
                          <span key={tg} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                            #{tg}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2 bg-slate-50 p-3 rounded-md border border-slate-200">
                      <span className="font-semibold text-slate-800 block">Assigned Legal Lead:</span>
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs">
                          {c.assignedLawyerName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{c.assignedLawyerName}</p>
                          <p className="text-[10px] text-slate-500">Lead Counsel / Attorney</p>
                        </div>
                      </div>
                      <div className="pt-1 border-t border-slate-200 text-[11px] text-slate-600 flex items-center justify-between">
                        <span>Expected Resolution:</span>
                        <span className="font-mono font-bold text-slate-800">{c.expectedClosureDate}</span>
                      </div>
                    </div>
                  </div>

                  {/* Upcoming Key Events / Milestones for this case */}
                  {caseEvents.length > 0 && (
                    <div className="pt-2 border-t border-slate-100">
                      <span className="text-xs font-bold text-slate-700 block mb-2">Upcoming Court Filings & Deadlines:</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {caseEvents.map((dl) => (
                          <div
                            key={dl.id}
                            className="p-2.5 bg-slate-50 border border-slate-200 rounded-md flex items-start justify-between text-xs"
                          >
                            <div className="space-y-0.5">
                              <p className="font-semibold text-slate-900">{dl.title}</p>
                              <p className="text-[10px] text-slate-500 font-mono">Due: {dl.dueDate}</p>
                            </div>
                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                                dl.priority === 'critical'
                                  ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                  : 'bg-amber-100 text-amber-800 border border-amber-200'
                              }`}
                            >
                              {dl.priority}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* TAB 2: SHARED DOCUMENTS VAULT */}
      {activePortalTab === 'documents' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-lg border border-slate-200">
            <div className="relative flex-1 max-w-md w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={docSearch}
                onChange={(e) => setDocSearch(e.target.value)}
                placeholder="Search file name or case..."
                className="w-full bg-slate-50 border border-slate-200 rounded-md pl-9 pr-3 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={docCategory}
                onChange={(e) => setDocCategory(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Document Categories</option>
                <option value="Pleadings">Pleadings</option>
                <option value="Contracts">Contracts</option>
                <option value="Discovery">Discovery</option>
                <option value="Evidence">Evidence</option>
                <option value="Correspondence">Correspondence</option>
              </select>

              <button
                onClick={() => {
                  setUploadDocCaseId(clientCases[0]?.id || cases[0]?.id || 'case-1');
                  setIsDocUploadModalOpen(true);
                }}
                className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-bold flex items-center gap-1.5 shadow-sm transition shrink-0"
              >
                <UploadCloud className="w-3.5 h-3.5" />
                <span>Upload to Vault</span>
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm">Client Document Repository</h3>
              <span className="text-xs text-slate-500 font-mono">
                {filteredClientDocs.length} Verified Files Shared
              </span>
            </div>

            <div className="divide-y divide-slate-100">
              {filteredClientDocs.length === 0 ? (
                <div className="p-8 text-center text-slate-500">
                  <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="text-xs font-semibold">No documents found matching the search criteria.</p>
                </div>
              ) : (
                filteredClientDocs.map((doc) => (
                  <div
                    key={doc.id}
                    className="p-4 hover:bg-slate-50 transition flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-slate-900 text-sm">{doc.fileName}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 uppercase">
                          {doc.category}
                        </span>
                        {doc.verificationStatus === 'Verified' ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" /> Verified Exhibit
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1">
                            <AlertCircle className="w-2.5 h-2.5 text-amber-600" /> In Review
                          </span>
                        )}
                        {doc.isConfidential && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 flex items-center gap-1">
                            <Lock className="w-2.5 h-2.5" /> Confidential
                          </span>
                        )}
                      </div>

                      <p className="text-slate-500">
                        Matter: <strong className="text-slate-800">{doc.caseTitle}</strong> • Uploaded: {doc.uploadedAt} ({doc.fileSize})
                      </p>

                      {/* AI Clause Summary Preview */}
                      {doc.aiSummary && (
                        <div className="mt-2 p-2.5 bg-blue-50/60 border border-blue-100 rounded-md text-[11px] text-slate-700 flex items-start gap-2">
                          <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-semibold text-blue-900">Plain-Language Executive Summary:</span>
                            <p className="text-slate-600 mt-0.5">{doc.aiSummary}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                      <button
                        onClick={() => setSelectedDocModal(doc)}
                        className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-md font-semibold text-xs flex items-center gap-1.5 shadow-sm transition"
                      >
                        <Eye className="w-3.5 h-3.5 text-blue-600" />
                        <span>Inspect & Download</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SECURE ATTORNEY CHAT */}
      {activePortalTab === 'messaging' && (
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden min-h-[500px] flex flex-col justify-between text-slate-900">
          {/* Header */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-sm">Client Direct Communication Channel</h3>
                <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 font-mono font-semibold">
                  E2EE Authenticated
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Recipient Counsel: {primaryAttorney}</p>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-slate-600 bg-white px-2.5 py-1 rounded-md border border-slate-200 shadow-sm">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>Key: rsa-4096-88a1</span>
            </div>
          </div>

          {/* Messages Feed */}
          <div className="p-5 space-y-4 max-h-[380px] overflow-y-auto bg-slate-50/50">
            {threadMessages.map((msg) => {
              const isClient = msg.senderId === 'client-user' || msg.senderName.includes('Client');
              return (
                <div
                  key={msg.id}
                  className={`flex flex-col ${isClient ? 'items-end' : 'items-start'} space-y-1`}
                >
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                    <span>{msg.senderName}</span>
                    <span>•</span>
                    <span>{msg.timestamp}</span>
                  </div>

                  <div
                    className={`p-3 rounded-xl max-w-md text-xs leading-relaxed shadow-sm ${
                      isClient
                        ? 'bg-blue-600 text-white rounded-tr-none font-medium'
                        : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                    }`}
                  >
                    {msg.decryptedContent || msg.encryptedContent}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Prompt Suggestions */}
          <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className="text-slate-400 font-semibold mr-1">Quick Inquiries:</span>
            <button
              type="button"
              onClick={() => setMessageInput('Could you please provide a status update on the latest discovery disclosures and deposition timeline?')}
              className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-full transition"
            >
              Discovery Status Update
            </button>
            <button
              type="button"
              onClick={() => setMessageInput('I have uploaded the requested signed agreement exhibits to the vault. Please verify receipt.')}
              className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-full transition"
            >
              Executed Agreement Confirmation
            </button>
            <button
              type="button"
              onClick={() => setMessageInput('What are our upcoming court appearance and hearing dates for this quarter?')}
              className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-full transition"
            >
              Upcoming Hearing Dates
            </button>
            <button
              type="button"
              onClick={() => setMessageInput('Please send an updated retainer balance accounting and fee schedule breakdown.')}
              className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-full transition"
            >
              Retainer Balance Inquiry
            </button>
          </div>

          {/* Input Box */}
          <form onSubmit={handleSendMessageSubmit} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              placeholder="Send an encrypted message or document request to your legal team..."
              className="flex-1 bg-slate-50 border border-slate-200 rounded-md px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-md flex items-center gap-1.5 shadow-sm transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Send Message</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: CLIENT STATEMENTS & INVOICES */}
      {activePortalTab === 'statements' && (
        <div className="space-y-4">
          {/* Financial Overview Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Total Invoiced</span>
              <div className="text-xl font-bold font-mono text-slate-900 mt-1">
                ${clientInvoices.reduce((acc, inv) => acc + inv.totalAmount, 0).toLocaleString()}
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">{clientInvoices.length} Official Invoices</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Settled / Paid</span>
              <div className="text-xl font-bold font-mono text-emerald-700 mt-1">
                ${clientInvoices.reduce((acc, inv) => acc + inv.amountPaid, 0).toLocaleString()}
              </div>
              <span className="text-[10px] text-emerald-600 mt-0.5 block font-semibold">Cleared Payments</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Trust Retainer Balance</span>
              <div className="text-xl font-bold font-mono text-blue-700 mt-1">
                ${clientCases.reduce((acc, c) => acc + c.retainerRemaining, 0).toLocaleString()}
              </div>
              <span className="text-[10px] text-blue-600 mt-0.5 block font-semibold">Held in Trust Account</span>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Outstanding Balance</span>
              <div className="text-xl font-bold font-mono text-amber-700 mt-1">
                ${clientInvoices.filter((i) => i.status !== 'paid').reduce((acc, inv) => acc + (inv.totalAmount - inv.amountPaid), 0).toLocaleString()}
              </div>
              <span className="text-[10px] text-amber-600 mt-0.5 block font-semibold">Pending Payment</span>
            </div>
          </div>

          <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-sm space-y-3 text-slate-900">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 text-sm">Client Billing & Fee Statements</h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Official invoices, fee receipts, and retainer summaries for {selectedClientName}.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadReceipt}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-md font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
                >
                  <Download className="w-3.5 h-3.5 text-blue-400" />
                  <span>Download Statement PDF</span>
                </button>
                <div className="p-1.5 bg-blue-50 rounded-md border border-blue-200 text-blue-700 text-xs font-semibold">
                  Read-Only Accounting Ledger
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-800">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200 font-bold">
                  <tr>
                    <th className="px-3 py-2.5">Invoice #</th>
                    <th className="px-3 py-2.5">Matter File</th>
                    <th className="px-3 py-2.5">Issue Date</th>
                    <th className="px-3 py-2.5">Due Date</th>
                    <th className="px-3 py-2.5">Total Amount</th>
                    <th className="px-3 py-2.5">Paid Amount</th>
                    <th className="px-3 py-2.5">Status</th>
                    <th className="px-3 py-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {clientInvoices.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-3 py-6 text-center text-slate-400">
                        No invoices found for this client account.
                      </td>
                    </tr>
                  ) : (
                    clientInvoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-50 transition">
                        <td className="px-3 py-2.5 font-mono font-bold text-slate-900">{inv.invoiceNumber}</td>
                        <td className="px-3 py-2.5 font-semibold text-slate-800">{inv.caseTitle}</td>
                        <td className="px-3 py-2.5 text-slate-500 font-mono">{inv.issueDate}</td>
                        <td className="px-3 py-2.5 text-slate-500 font-mono">{inv.dueDate}</td>
                        <td className="px-3 py-2.5 font-mono font-bold text-slate-900">${inv.totalAmount.toLocaleString()}</td>
                        <td className="px-3 py-2.5 font-mono text-emerald-700 font-bold">${inv.amountPaid.toLocaleString()}</td>
                        <td className="px-3 py-2.5">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${
                              inv.status === 'paid'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : inv.status === 'overdue'
                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : 'bg-blue-50 text-blue-700 border-blue-200'
                            }`}
                          >
                            {inv.status}
                          </span>
                        </td>
                        <td className="px-3 py-2.5 text-right space-x-2">
                          {inv.status !== 'paid' && (
                            <button
                              onClick={() => setSelectedInvoiceForPayment(inv)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-xs font-bold inline-flex items-center gap-1 shadow-sm transition"
                            >
                              <CreditCard className="w-3.5 h-3.5" />
                              <span>Pay Online</span>
                            </button>
                          )}
                          <button
                            onClick={() => {
                              exportInvoicePDF(inv);
                              const toast: ToastNotification = {
                                id: `toast-inv-${Date.now()}`,
                                title: 'Invoice PDF Downloaded',
                                message: `Generated invoice PDF ${inv.invoiceNumber}.`,
                                timestamp: 'Just now',
                                type: 'info'
                              };
                              setToasts((prev) => [toast, ...prev]);
                            }}
                            className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-md text-xs font-semibold inline-flex items-center gap-1 shadow-sm transition"
                          >
                            <Download className="w-3.5 h-3.5 text-blue-600" />
                            <span>PDF</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: REPRESENTATION & CONSULTATION REQUESTS */}
      {activePortalTab === 'requests' && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-blue-600" />
                  <span>Representation & Consultation Requests</span>
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Submit new legal representation inquiries directly to firm partners, select co-counsel, and upload evidentiary proof and exhibits for formal review.
                </p>
              </div>
              <button
                onClick={() => {
                  setReqEvidenceList([]);
                  setReqTargetLawyerIds([]);
                  setReqPreferredLawyerId('');
                  setIsRequestModalOpen(true);
                }}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-2 shadow-sm transition shrink-0"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Send Request to Lawyers</span>
              </button>
            </div>

            {/* Meet Firm Counsel & Send Direct Request Banner */}
            <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 p-4 rounded-xl text-white space-y-3 shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/20 px-2 py-0.5 rounded border border-blue-400/30 inline-block mb-1">
                    Direct Partner & Associate Counsel Intake
                  </span>
                  <h3 className="text-sm font-bold text-white">Choose Your Designated Attorney or Senior Panel</h3>
                </div>
                <span className="text-xs text-slate-300">Avg. Response Time: &lt; 24h</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                {attorneysList.map((atty) => (
                  <div
                    key={atty.id}
                    className="p-3 bg-white/10 hover:bg-white/15 border border-white/10 rounded-xl flex flex-col justify-between gap-2.5 transition"
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={atty.avatarUrl}
                        alt={atty.name}
                        className="w-10 h-10 rounded-full object-cover border border-white/20 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-bold text-white text-xs truncate">{atty.name}</p>
                        <p className="text-[11px] text-blue-300 truncate">{atty.title}</p>
                        <p className="text-[10px] text-slate-400 truncate">{atty.department} • ${atty.hourlyRate}/hr</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setReqPreferredLawyerId(atty.id);
                        setReqTargetLawyerIds([atty.id]);
                        setReqEvidenceList([]);
                        setIsRequestModalOpen(true);
                      }}
                      className="w-full py-1.5 px-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-[11px] flex items-center justify-center gap-1.5 shadow-xs transition"
                    >
                      <UserPlus className="w-3 h-3" />
                      <span>Send Request to {atty.name.split(' ')[0]}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {myRequests.length === 0 ? (
              <div className="p-8 text-center bg-slate-50 rounded-lg border border-dashed border-slate-200 space-y-3">
                <Scale className="w-10 h-10 text-slate-400 mx-auto" />
                <h3 className="text-sm font-bold text-slate-800">No Representation Requests Found</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  You haven't submitted any representation or consultation requests for {selectedClientName} yet.
                </p>
                <button
                  onClick={() => setIsRequestModalOpen(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-bold hover:bg-blue-700 transition"
                >
                  Submit Representation Request
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {myRequests.map((req) => (
                  <div
                    key={req.id}
                    className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-4 hover:border-blue-300 transition flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-800 border border-blue-200">
                              {req.practiceArea}
                            </span>
                            {req.urgencyLevel && (
                              <span
                                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                                  req.urgencyLevel.includes('Critical')
                                    ? 'bg-rose-100 text-rose-800 border-rose-200'
                                    : req.urgencyLevel.includes('Urgent')
                                    ? 'bg-amber-100 text-amber-800 border-amber-200'
                                    : 'bg-slate-100 text-slate-700 border-slate-200'
                                }`}
                              >
                                {req.urgencyLevel}
                              </span>
                            )}
                          </div>
                          <h3 className="font-bold text-slate-900 text-sm mt-1.5">{req.requestTitle}</h3>
                        </div>
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wider flex items-center gap-1 shrink-0 ${
                            req.status === 'accepted'
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : req.status === 'declined'
                              ? 'bg-red-100 text-red-800 border border-red-300'
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}
                        >
                          {req.status === 'accepted' && <CheckCircle2 className="w-3.5 h-3.5" />}
                          {req.status === 'declined' && <XCircle className="w-3.5 h-3.5" />}
                          {req.status === 'pending' && <Clock className="w-3.5 h-3.5" />}
                          <span>{req.status}</span>
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 bg-white p-3 rounded-lg border border-slate-200 leading-relaxed">
                        {req.caseSummary}
                      </p>

                      <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-white/60 p-2.5 rounded-lg border border-slate-200">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-bold uppercase">Recipient / Target Counsel:</span>
                          <span className="font-semibold text-slate-800 block truncate">
                            {req.targetLawyerNames && req.targetLawyerNames.length > 0
                              ? req.targetLawyerNames.join(', ')
                              : req.preferredLawyerName || 'Senior Partner Review Panel'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block font-bold uppercase">Est. Retainer:</span>
                          <span className="font-semibold text-emerald-700">${(req.estimatedBudget || 0).toLocaleString()}</span>
                        </div>
                        {req.opposingParty && (
                          <div>
                            <span className="text-[10px] text-slate-400 block font-bold uppercase">Opposing Party:</span>
                            <span className="font-semibold text-slate-800">{req.opposingParty}</span>
                          </div>
                        )}
                        {req.incidentDate && (
                          <div>
                            <span className="text-[10px] text-slate-400 block font-bold uppercase">Date of Incident:</span>
                            <span className="font-mono text-slate-800">{req.incidentDate}</span>
                          </div>
                        )}
                        <div>
                          <span className="text-[10px] text-slate-400 block font-bold uppercase">Submitted Date:</span>
                          <span className="font-mono text-slate-700">{req.submittedAt}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 block font-bold uppercase">Review Status:</span>
                          <span className="font-bold text-slate-800">
                            {req.status === 'accepted'
                              ? `Accepted by ${req.reviewedBy || 'Counsel'}`
                              : req.status === 'declined'
                              ? `Declined by ${req.reviewedBy || 'Counsel'}`
                              : 'Pending Lawyer Review'}
                          </span>
                        </div>
                      </div>

                      {/* ATTACHED PROOF & EVIDENCE SECTION */}
                      <div className="pt-2 border-t border-slate-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                            <Paperclip className="w-3.5 h-3.5 text-blue-600" />
                            <span>Attached Proof & Evidence ({req.evidenceList?.length || 0})</span>
                          </span>
                          <button
                            onClick={() => setSupplementalReqId(req.id)}
                            className="text-[11px] font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add Proof</span>
                          </button>
                        </div>

                        {(!req.evidenceList || req.evidenceList.length === 0) ? (
                          <div className="p-2.5 bg-slate-100/70 rounded-lg text-center text-[11px] text-slate-400 italic">
                            No evidence files attached to this request yet.
                          </div>
                        ) : (
                          <div className="space-y-1.5">
                            {req.evidenceList.map((ev) => (
                              <div
                                key={ev.id}
                                onClick={() =>
                                  setSelectedEvidenceModal({
                                    evidence: ev,
                                    requestTitle: req.requestTitle,
                                    clientName: req.clientName
                                  })
                                }
                                className="p-2 bg-white hover:bg-blue-50/60 border border-slate-200 hover:border-blue-300 rounded-lg flex items-center justify-between gap-2 cursor-pointer transition group"
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <div className="w-7 h-7 rounded bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                                    <FileText className="w-3.5 h-3.5" />
                                  </div>
                                  <div className="min-w-0">
                                    <div className="text-xs font-bold text-slate-800 truncate group-hover:text-blue-700">
                                      {ev.title}
                                    </div>
                                    <div className="text-[10px] text-slate-400 flex items-center gap-2">
                                      <span className="text-blue-600 font-semibold">{ev.category}</span>
                                      <span>•</span>
                                      <span className="font-mono">{ev.fileName}</span>
                                      {ev.fileSize && <span>({ev.fileSize})</span>}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1.5 shrink-0">
                                  {ev.confidential && (
                                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                                      Privileged
                                    </span>
                                  )}
                                  <span className="p-1 text-slate-400 group-hover:text-blue-600">
                                    <Eye className="w-3.5 h-3.5" />
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* DIGITAL CONSENT & INTAKE RECORD BADGE */}
                      <div className="pt-2 border-t border-slate-200">
                        {req.digitalConsent && req.digitalConsent.agreed && req.digitalConsent.consentedAt ? (
                          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between gap-2 text-xs">
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                                <Fingerprint className="w-3.5 h-3.5" />
                              </div>
                              <div className="min-w-0">
                                <div className="text-[11px] font-bold text-emerald-900 flex items-center gap-1.5 flex-wrap">
                                  <span>Digital Consent Verified</span>
                                  <span className="font-mono text-[10px] text-emerald-700 font-normal">
                                    • {req.digitalConsent.consentedAt}
                                  </span>
                                </div>
                                <div className="text-[10px] text-emerald-700 truncate">
                                  Signed by: <span className="font-semibold">{req.digitalConsent.consentedBy}</span> ({req.digitalConsent.signerRole || 'Authorized Signatory'})
                                </div>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => setSelectedConsentCertReq(req)}
                              className="px-2.5 py-1 bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded text-[10px] font-bold shadow-xs transition shrink-0 flex items-center gap-1"
                            >
                              <ShieldCheck className="w-3 h-3 text-emerald-600" />
                              <span>Audit Cert</span>
                            </button>
                          </div>
                        ) : (
                          <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg flex items-center justify-between gap-2 text-xs">
                            <div className="flex items-center gap-2 min-w-0">
                              <div className="w-6 h-6 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                                <AlertTriangle className="w-3.5 h-3.5" />
                              </div>
                              <div className="min-w-0">
                                <div className="text-[11px] font-bold text-amber-900">
                                  Digital Consent Incomplete
                                </div>
                                <div className="text-[10px] text-amber-700 truncate">
                                  Attorneys cannot formally accept representation until consent is executed.
                                </div>
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setSigningConsentForReq(req);
                                setQuickSignerName(`${req.clientName} Authorized Officer`);
                              }}
                              className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-[10px] font-bold shadow-xs transition shrink-0 flex items-center gap-1"
                            >
                              <FileSignature className="w-3 h-3" />
                              <span>Sign Consent</span>
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {req.status === 'accepted' && req.assignedCaseId && (
                      <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-xs mt-2">
                        <span className="text-emerald-900 font-medium">
                          Active Matter Case File Initialized (Evidence Transferred to Vault)!
                        </span>
                        <button
                          onClick={() => setActivePortalTab('cases')}
                          className="px-2.5 py-1 bg-emerald-600 text-white font-bold rounded text-[11px] hover:bg-emerald-700 transition"
                        >
                          View Matter
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* NEW REPRESENTATION REQUEST & EVIDENCE MODAL */}
      {isRequestModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden text-slate-900 animate-in fade-in max-h-[92vh] flex flex-col">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-400" />
                <div>
                  <h3 className="font-bold text-white text-base">Submit Representation & Consultation Request</h3>
                  <p className="text-[11px] text-slate-400">Select target lawyers and provide evidentiary proof for case review</p>
                </div>
              </div>
              <button
                onClick={() => setIsRequestModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitRequest} className="p-5 space-y-5 overflow-y-auto text-xs flex-1">
              {/* SECTION 1: CLIENT IDENTITY */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                  1. Client Entity & Contact Info
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1 text-[11px]">Client Entity / Name</label>
                    <input
                      type="text"
                      value={selectedClientName}
                      disabled
                      className="w-full bg-slate-100 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-600 font-semibold cursor-not-allowed text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1 text-[11px]">Contact Email</label>
                    <input
                      type="email"
                      required
                      value={reqEmail}
                      onChange={(e) => setReqEmail(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1 text-[11px]">Contact Phone</label>
                    <input
                      type="tel"
                      value={reqPhone}
                      onChange={(e) => setReqPhone(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 2: TARGET LAWYERS & CO-COUNSEL */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                    2. Select Recipient Lawyers & Co-Counsel
                  </span>
                  <span className="text-[10px] text-blue-600 font-semibold">
                    Send to multiple lawyers or entire committee
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1 text-[11px]">Primary Lead Counsel</label>
                    <select
                      value={reqPreferredLawyerId}
                      onChange={(e) => {
                        const newId = e.target.value;
                        setReqPreferredLawyerId(newId);
                        if (newId && !reqTargetLawyerIds.includes(newId)) {
                          setReqTargetLawyerIds((prev) => [...prev, newId]);
                        }
                      }}
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-xs"
                    >
                      <option value="">Any Available Senior Partner</option>
                      {attorneysList.map((att) => (
                        <option key={att.id} value={att.id}>
                          {att.name} ({att.title}) - ${att.hourlyRate}/hr
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1 text-[11px]">Practice Area</label>
                    <select
                      value={reqPracticeArea}
                      onChange={(e) => setReqPracticeArea(e.target.value as PracticeArea)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-xs"
                    >
                      <option value="Corporate">Corporate & Governance</option>
                      <option value="Intellectual Property">Intellectual Property & Patents</option>
                      <option value="Litigation">Litigation & Arbitration</option>
                      <option value="Real Estate">Real Estate & Property</option>
                      <option value="Employment">Employment & Labor Law</option>
                      <option value="Tax Law">Tax Law & Wealth Advisory</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 font-semibold mb-1 text-[10px]">
                    Also Notify & Send Request to Co-Counsel / Other Lawyers:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {attorneysList.map((att) => {
                      const isSelected = reqTargetLawyerIds.includes(att.id);
                      return (
                        <div
                          key={att.id}
                          onClick={() => handleToggleTargetLawyer(att.id)}
                          className={`p-2 rounded-lg border cursor-pointer transition flex items-center gap-2 ${
                            isSelected
                              ? 'bg-blue-50 border-blue-400 text-blue-900 shadow-xs'
                              : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded border flex items-center justify-center ${
                              isSelected ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'
                            }`}
                          >
                            {isSelected && <CheckSquare className="w-3 h-3" />}
                          </div>
                          <div className="min-w-0">
                            <div className="text-[11px] font-bold truncate">{att.name}</div>
                            <div className="text-[9px] text-slate-400 truncate">{att.title}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* SECTION 3: MATTER SCOPE & CASE DETAILS */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                  3. Matter Details & Facts
                </span>

                <div>
                  <label className="block text-slate-700 font-bold mb-1 text-[11px]">Matter Subject / Request Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Patent Infringement Defense or Commercial Lease Breach"
                    value={reqTitle}
                    onChange={(e) => setReqTitle(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-xs"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1 text-[11px]">Opposing Party / Adversary</label>
                    <input
                      type="text"
                      placeholder="e.g., OptiPulse Systems LLC"
                      value={reqOpposingParty}
                      onChange={(e) => setReqOpposingParty(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1 text-[11px]">Date of Incident / Dispute</label>
                    <input
                      type="date"
                      value={reqIncidentDate}
                      onChange={(e) => setReqIncidentDate(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-xs"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-bold mb-1 text-[11px]">Urgency Level</label>
                    <select
                      value={reqUrgencyLevel}
                      onChange={(e) => setReqUrgencyLevel(e.target.value as any)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-xs font-semibold"
                    >
                      <option value="Standard">Standard Intake</option>
                      <option value="Urgent (Within 48h)">Urgent (Within 48 Hours)</option>
                      <option value="Critical / Immediate Court Filing">Critical (Immediate Court Filing)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1 text-[11px]">Legal Need & Case Summary</label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Describe the legal situation, timeline, opposing parties, and required outcomes..."
                    value={reqSummary}
                    onChange={(e) => setReqSummary(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-xs leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1 text-[11px]">Estimated Retainer Budget ($ USD)</label>
                  <div className="relative">
                    <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      value={reqBudget}
                      onChange={(e) => setReqBudget(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg pl-9 pr-3 py-1.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* SECTION 4: PROOF & EVIDENCE VAULT UPLOADER */}
              <div className="bg-blue-50/50 border border-blue-200 rounded-xl p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-blue-100 pb-2.5">
                  <div>
                    <span className="text-[11px] font-bold text-blue-950 uppercase tracking-wider flex items-center gap-1.5">
                      <Paperclip className="w-4 h-4 text-blue-600" />
                      <span>4. Evidentiary Proof & Document Exhibits ({reqEvidenceList.length})</span>
                    </span>
                    <p className="text-[10px] text-slate-500 mt-0.5">
                      Attach contracts, records, photos, or witness statements for lawyers to review under Attorney-Client privilege.
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => handleAddSampleEvidence('contract')}
                      className="px-2 py-1 bg-white hover:bg-blue-50 border border-blue-200 text-blue-700 rounded text-[10px] font-bold shadow-xs transition"
                    >
                      + Contract Proof
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddSampleEvidence('bank')}
                      className="px-2 py-1 bg-white hover:bg-blue-50 border border-blue-200 text-blue-700 rounded text-[10px] font-bold shadow-xs transition"
                    >
                      + Bank Proof
                    </button>
                    <button
                      type="button"
                      onClick={() => handleAddSampleEvidence('incident')}
                      className="px-2 py-1 bg-white hover:bg-blue-50 border border-blue-200 text-blue-700 rounded text-[10px] font-bold shadow-xs transition"
                    >
                      + Photo/Report
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsAddingEvidenceForm(!isAddingEvidenceForm)}
                      className="px-2.5 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-[10px] font-bold shadow-xs transition flex items-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      <span>{isAddingEvidenceForm ? 'Close Form' : 'Custom Upload'}</span>
                    </button>
                  </div>
                </div>

                {/* DRAFT EVIDENCE FORM */}
                {isAddingEvidenceForm && (
                  <div className="p-3.5 bg-white border border-blue-300 rounded-xl space-y-3 shadow-xs">
                    <span className="text-[11px] font-bold text-slate-800 block">Add New Evidence Proof Record</span>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-slate-700 font-bold mb-0.5 text-[10px]">Evidence Title / Description</label>
                        <input
                          type="text"
                          placeholder="e.g., Executed Non-Disclosure Agreement or Lab Log"
                          value={draftEvTitle}
                          onChange={(e) => setDraftEvTitle(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 focus:ring-1 focus:ring-blue-500 text-xs font-medium"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 font-bold mb-0.5 text-[10px]">Evidence Category</label>
                        <select
                          value={draftEvCategory}
                          onChange={(e) => setDraftEvCategory(e.target.value as any)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 focus:ring-1 focus:ring-blue-500 text-xs font-medium"
                        >
                          <option value="Contract & Agreement">Contract & Agreement</option>
                          <option value="Financial & Bank Record">Financial & Bank Record</option>
                          <option value="Photo & Visual Proof">Photo & Visual Proof</option>
                          <option value="Email & Correspondence">Email & Correspondence</option>
                          <option value="Official / Police Report">Official / Police Report</option>
                          <option value="Witness Statement">Witness Statement</option>
                          <option value="Patent / IP Filing">Patent / IP Filing</option>
                          <option value="Expert Testimony / Other">Expert Testimony / Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-slate-700 font-bold mb-0.5 text-[10px]">File Attachment Name</label>
                        <input
                          type="text"
                          placeholder="e.g., Signed_Agreement_2026.pdf"
                          value={draftEvFileName}
                          onChange={(e) => setDraftEvFileName(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 focus:ring-1 focus:ring-blue-500 text-xs font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-700 font-bold mb-0.5 text-[10px]">Date of Evidence / Proof</label>
                        <input
                          type="date"
                          value={draftEvDate}
                          onChange={(e) => setDraftEvDate(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 focus:ring-1 focus:ring-blue-500 text-xs"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-700 font-bold mb-0.5 text-[10px]">Evidentiary Notes / What this proves</label>
                      <textarea
                        rows={2}
                        placeholder="Explain why this proof is critical to your claim or defense..."
                        value={draftEvDesc}
                        onChange={(e) => setDraftEvDesc(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-slate-900 focus:ring-1 focus:ring-blue-500 text-xs"
                      />
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={draftEvConfidential}
                          onChange={(e) => setDraftEvConfidential(e.target.checked)}
                          className="rounded text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-[11px] font-semibold text-slate-700">Attorney-Client Privileged & Confidential</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleAddEvidenceDraft}
                        disabled={!draftEvTitle.trim()}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Attach Evidence</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* LIST OF CURRENTLY ATTACHED EVIDENCE */}
                {reqEvidenceList.length === 0 ? (
                  <div className="p-4 bg-white/70 border border-dashed border-blue-200 rounded-xl text-center space-y-1">
                    <UploadCloud className="w-6 h-6 text-blue-400 mx-auto" />
                    <p className="text-xs font-bold text-slate-700">No Evidence Attached Yet</p>
                    <p className="text-[10px] text-slate-400">
                      Use the quick preset buttons above or click "Custom Upload" to attach supporting proof files.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {reqEvidenceList.map((ev, index) => (
                      <div
                        key={ev.id}
                        className="p-2.5 bg-white border border-blue-200 rounded-lg flex items-center justify-between gap-3 shadow-xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 font-bold text-[10px] flex items-center justify-center shrink-0">
                            {index + 1}
                          </span>
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-900 truncate">{ev.title}</div>
                            <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
                              <span className="text-blue-600 font-semibold">{ev.category}</span>
                              <span>•</span>
                              <span className="font-mono">{ev.fileName}</span>
                              {ev.fileSize && <span>({ev.fileSize})</span>}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          {ev.confidential && (
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              Privileged
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveEvidence(ev.id)}
                            className="p-1 text-slate-400 hover:text-rose-600 rounded transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SECTION 5: DIGITAL CONSENT & ESIGN INTAKE AUTHORIZATION */}
              <div className={`p-4 rounded-xl border transition ${
                reqDigitalConsentAgreed
                  ? 'bg-emerald-50/70 border-emerald-300'
                  : 'bg-amber-50/70 border-amber-300'
              }`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <div className={`p-2 rounded-lg ${
                      reqDigitalConsentAgreed
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}>
                      <FileSignature className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold text-slate-900 uppercase tracking-wider">
                          5. Digital Consent & Electronic Intake Authorization
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          reqDigitalConsentAgreed
                            ? 'bg-emerald-200/80 text-emerald-900 border border-emerald-300'
                            : 'bg-amber-200/80 text-amber-900 border border-amber-300'
                        }`}>
                          {reqDigitalConsentAgreed ? 'Consent Active' : 'Consent Incomplete'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 mt-0.5">
                        State bar ethics & firm policy require a timestamped digital consent record before attorneys can formally accept representation.
                      </p>
                    </div>
                  </div>

                  {/* Toggle Switch */}
                  <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-0.5">
                    <input
                      type="checkbox"
                      checked={reqDigitalConsentAgreed}
                      onChange={(e) => setReqDigitalConsentAgreed(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>

                {reqDigitalConsentAgreed ? (
                  <div className="mt-3.5 pt-3 border-t border-emerald-200/80 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                          Authorized Signatory Full Name
                        </label>
                        <input
                          type="text"
                          value={reqSignerName}
                          onChange={(e) => setReqSignerName(e.target.value)}
                          placeholder="e.g. Jane Doe"
                          className="w-full bg-white border border-emerald-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                          Signatory Title / Corporate Role
                        </label>
                        <input
                          type="text"
                          value={reqSignerTitle}
                          onChange={(e) => setReqSignerTitle(e.target.value)}
                          placeholder="e.g. Managing Director / Client"
                          className="w-full bg-white border border-emerald-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                    </div>

                    <div className="p-2.5 bg-white/90 rounded-lg border border-emerald-200 text-[11px] space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono">
                        <span className="flex items-center gap-1 text-emerald-800 font-bold">
                          <Fingerprint className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Audit Trail Preview: Generated on Submission</span>
                        </span>
                        <span>ESIGN & UETA Compliant</span>
                      </div>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 text-[10px] text-slate-600">
                        <div>
                          <span className="text-slate-400 block">Signer Email:</span>
                          <span className="font-semibold text-slate-800 truncate block">{reqEmail}</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Network Origin:</span>
                          <span className="font-mono text-slate-700">192.168.1.188 (SSL)</span>
                        </div>
                        <div>
                          <span className="text-slate-400 block">Standard:</span>
                          <span className="font-bold text-emerald-700">v2026.4-ETHICS-ESIGN</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <button
                        type="button"
                        onClick={() => setReqShowConsentTerms(!reqShowConsentTerms)}
                        className="text-[11px] font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1 transition"
                      >
                        {reqShowConsentTerms ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        <span>{reqShowConsentTerms ? 'Hide Acknowledged Clauses' : 'View Acknowledged Representation Clauses (4 clauses)'}</span>
                      </button>

                      {reqShowConsentTerms && (
                        <div className="mt-2 p-3 bg-white rounded-lg border border-emerald-200 text-[11px] text-slate-700 space-y-1.5 animate-in fade-in">
                          <p className="font-bold text-slate-900 text-xs">By submitting with Digital Consent enabled, you certify & agree that:</p>
                          <ul className="list-disc pl-4 space-y-1 text-slate-600">
                            <li>You authorize JurisPulse attorneys to perform formal conflict-of-interest database clearance.</li>
                            <li>This intake inquiry establishes an attorney-client communication privilege under Rule 1.6, but formal representation begins upon mutual retainer execution.</li>
                            <li>You consent to secure electronic record transmission, encrypted vault storage, and audit log generation.</li>
                            <li>You represent and warrant that you are authorized to bind {selectedClientName}.</li>
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="mt-3 p-3 bg-white/90 rounded-lg border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">Consent is currently disabled.</span>
                      <p className="text-slate-600 text-[10px] mt-0.5">
                        Attorneys will be able to review your preliminary inquiry, but will not be permitted to formally accept representation or issue active retainer agreements until digital consent is provided.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* MODAL FOOTER */}
              <div className="pt-3 border-t border-slate-200 flex items-center justify-between gap-2">
                <span className="text-[10px] text-slate-400">
                  {reqEvidenceList.length} evidence file(s) attached • AES-256 Vault Encrypted
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsRequestModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition"
                  >
                    <Send className="w-4 h-4" />
                    <span>Submit Request & Proof to Counsel</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EVIDENCE PROOF INSPECTION MODAL */}
      {selectedEvidenceModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden text-slate-900 animate-in fade-in">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                <div>
                  <h3 className="font-bold text-white text-sm">Evidentiary Proof Exhibit Details</h3>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {selectedEvidenceModal.evidence.category}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedEvidenceModal(null)}
                className="p-1 text-slate-400 hover:text-white rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h4 className="font-bold text-slate-900 text-sm">{selectedEvidenceModal.evidence.title}</h4>
                  {selectedEvidenceModal.evidence.confidential && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                      Attorney-Client Privileged
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 pt-2 border-t border-slate-200">
                  <div>
                    <span className="text-slate-400 block font-bold text-[10px]">File Attachment:</span>
                    <span className="font-mono text-slate-800 font-bold">{selectedEvidenceModal.evidence.fileName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-bold text-[10px]">File Size:</span>
                    <span className="font-mono text-slate-800">{selectedEvidenceModal.evidence.fileSize || '2.4 MB'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-bold text-[10px]">Date of Record:</span>
                    <span className="font-mono text-slate-800">{selectedEvidenceModal.evidence.dateOfEvidence || '2026-08-01'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-bold text-[10px]">Uploaded At:</span>
                    <span className="font-mono text-slate-800">{selectedEvidenceModal.evidence.uploadedAt}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                  Evidentiary Description & Proof Significance:
                </span>
                <div className="p-3 bg-white border border-slate-200 rounded-xl text-slate-700 leading-relaxed">
                  {selectedEvidenceModal.evidence.description}
                </div>
              </div>

              {/* SIMULATED DOCUMENT PREVIEW BOX */}
              <div className="p-4 bg-slate-900 text-slate-300 rounded-xl border border-slate-800 space-y-2 text-center">
                <ShieldCheck className="w-8 h-8 text-blue-400 mx-auto" />
                <span className="text-xs font-bold text-white block">Digital Chain of Custody Verified</span>
                <p className="text-[10px] text-slate-400 max-w-sm mx-auto">
                  SHA-256 Checksum: 8f9b2...e4a71 • Stored in AES-256 Legal Vault for Matter Review
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">JurisPulse Client Vault Evidence Inspector</span>
                <button
                  onClick={() => {
                    const toast: ToastNotification = {
                      id: `toast-ev-dl-${Date.now()}`,
                      title: 'Evidence Downloaded',
                      message: `Downloaded proof file "${selectedEvidenceModal.evidence.fileName}".`,
                      timestamp: 'Just now',
                      type: 'document'
                    };
                    setToasts((prev) => [toast, ...prev]);
                    setSelectedEvidenceModal(null);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-sm transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Evidence File</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUPPLEMENTAL EVIDENCE UPLOAD MODAL */}
      {supplementalReqId && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden text-slate-900 animate-in fade-in">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FilePlus className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-white text-sm">Attach Supplemental Proof & Evidence</h3>
              </div>
              <button
                onClick={() => setSupplementalReqId(null)}
                className="p-1 text-slate-400 hover:text-white rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <p className="text-slate-600">
                Provide additional documents, contracts, or records for counsel to consider with your pending representation request.
              </p>

              <div className="space-y-3 bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Evidence Title</label>
                  <input
                    type="text"
                    placeholder="e.g., Supplementary Email Thread or Bank Statement"
                    value={draftEvTitle}
                    onChange={(e) => setDraftEvTitle(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 text-xs font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Category</label>
                    <select
                      value={draftEvCategory}
                      onChange={(e) => setDraftEvCategory(e.target.value as any)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 text-xs"
                    >
                      <option value="Contract & Agreement">Contract & Agreement</option>
                      <option value="Financial & Bank Record">Financial & Bank Record</option>
                      <option value="Photo & Visual Proof">Photo & Visual Proof</option>
                      <option value="Email & Correspondence">Email & Correspondence</option>
                      <option value="Official / Police Report">Official / Police Report</option>
                      <option value="Witness Statement">Witness Statement</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">File Name</label>
                    <input
                      type="text"
                      placeholder="e.g., Email_Thread_Export.pdf"
                      value={draftEvFileName}
                      onChange={(e) => setDraftEvFileName(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Evidentiary Value / Description</label>
                  <textarea
                    rows={2}
                    placeholder="Describe how this record supports your case..."
                    value={draftEvDesc}
                    onChange={(e) => setDraftEvDesc(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 text-xs"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSupplementalReqId(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (!draftEvTitle.trim()) return;
                    const newEv: EvidenceProof = {
                      id: `ev-supp-${Date.now()}`,
                      title: draftEvTitle.trim(),
                      category: draftEvCategory,
                      fileName: draftEvFileName.trim() || `${draftEvTitle.trim().replace(/\s+/g, '_')}.pdf`,
                      fileSize: '2.8 MB',
                      fileType: 'pdf',
                      description: draftEvDesc.trim() || 'Supplemental proof provided by client.',
                      dateOfEvidence: new Date().toISOString().slice(0, 10),
                      confidential: true,
                      uploadedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
                    };

                    // Update the request in clientRequests if possible
                    const targetReq = clientRequests.find((r) => r.id === supplementalReqId);
                    if (targetReq) {
                      const updatedEvList = [...(targetReq.evidenceList || []), newEv];
                      targetReq.evidenceList = updatedEvList;
                    }

                    const toast: ToastNotification = {
                      id: `toast-supp-${Date.now()}`,
                      title: 'Supplemental Proof Submitted',
                      message: `Transmitted "${newEv.title}" to reviewing counsel.`,
                      timestamp: 'Just now',
                      type: 'document'
                    };
                    setToasts((prev) => [toast, ...prev]);

                    setDraftEvTitle('');
                    setDraftEvFileName('');
                    setDraftEvDesc('');
                    setSupplementalReqId(null);
                  }}
                  disabled={!draftEvTitle.trim()}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-lg shadow-sm transition"
                >
                  Submit Supplemental Evidence
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DOCUMENT PREVIEW & INSPECT MODAL */}
      {selectedDocModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xl bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden text-slate-900 animate-in fade-in">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">Document Vault File Details</h3>
              </div>
              <button
                onClick={() => setSelectedDocModal(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">File Name</span>
                <p className="text-sm font-bold text-slate-900">{selectedDocModal.fileName}</p>
                <p className="text-slate-500">Matter: {selectedDocModal.caseTitle}</p>
              </div>

              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <div>
                  <span className="text-slate-500 block">Category:</span>
                  <span className="font-bold text-slate-800">{selectedDocModal.category}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">File Size:</span>
                  <span className="font-mono font-bold text-slate-800">{selectedDocModal.fileSize}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Shared Date:</span>
                  <span className="font-mono text-slate-800">{selectedDocModal.uploadedAt}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Confidentiality:</span>
                  <span className="font-bold text-emerald-700">Client Access Granted</span>
                </div>
              </div>

              {selectedDocModal.aiSummary && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg space-y-1 text-slate-800">
                  <div className="flex items-center gap-1.5 font-bold text-blue-900">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span>AI Document Analysis & Clause Breakdown</span>
                  </div>
                  <p className="text-slate-700 leading-relaxed pt-1">{selectedDocModal.aiSummary}</p>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">Read-Only Document View • JurisPulse Client Vault</span>
                <button
                  onClick={() => {
                    const toast: ToastNotification = {
                      id: `toast-doc-${Date.now()}`,
                      title: 'Document Downloaded',
                      message: `Downloaded "${selectedDocModal.fileName}" from client secure vault.`,
                      timestamp: 'Just now',
                      type: 'document'
                    };
                    setToasts((prev) => [toast, ...prev]);
                    setSelectedDocModal(null);
                  }}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-md shadow-sm flex items-center gap-1.5 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Document File</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PRINT STATUS REPORT PREVIEW MODAL */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-3xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden text-slate-900 my-8">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between no-print">
              <div className="flex items-center gap-2">
                <Printer className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-base">Client Active Status Report & Document Receipt</h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDownloadReceipt}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow-sm"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Report Now</span>
                </button>
                <button
                  onClick={() => setIsPrintModalOpen(false)}
                  className="p-1 text-slate-400 hover:text-white rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-6 text-xs max-h-[80vh] overflow-y-auto bg-white" id="printable-status-report">
              {/* Report Header */}
              <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">JURISPULSE LAW PARTNERS LLP</h1>
                  <p className="text-xs font-semibold text-slate-500">100 Legal Plaza, Suite 2400 • New York, NY 10005</p>
                  <p className="text-[11px] text-slate-400">Official E2EE Client Portal Vault Status & Document Receipt</p>
                </div>
                <div className="sm:text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-emerald-100 text-emerald-800 border border-emerald-300 rounded">
                    Certified Client Report
                  </span>
                  <p className="text-xs font-mono text-slate-600 mt-1">
                    Generated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>

              {/* Client Info Banner */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide block">Client Account Entity:</span>
                  <strong className="text-sm text-slate-900">{selectedClientName}</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide block">Active Litigation Matters:</span>
                  <strong className="text-sm text-blue-700">{clientCases.length} Active Files</strong>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide block">Listed Vault Documents:</span>
                  <strong className="text-sm text-emerald-700">{clientDocs.length} Pleadings & Evidentiary Files</strong>
                </div>
              </div>

              {/* Active Cases Table */}
              <div className="space-y-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5 border-b border-slate-200 pb-1">
                  <Briefcase className="w-4 h-4 text-blue-600" />
                  <span>Active Cases & Progression Status</span>
                </h2>
                {clientCases.length === 0 ? (
                  <p className="text-slate-500 italic py-2">No active cases associated with this client account.</p>
                ) : (
                  <div className="overflow-x-auto border border-slate-200 rounded-lg">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-900 text-white text-[11px]">
                          <th className="p-2 font-bold">Case #</th>
                          <th className="p-2 font-bold">Matter Title</th>
                          <th className="p-2 font-bold">Practice Area</th>
                          <th className="p-2 font-bold">Lead Counsel</th>
                          <th className="p-2 font-bold">Status Stage</th>
                          <th className="p-2 font-bold text-right">Retainer Balance</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 text-[11px]">
                        {clientCases.map((c) => (
                          <tr key={c.id} className="hover:bg-slate-50">
                            <td className="p-2 font-mono font-bold text-slate-700">{c.caseNumber}</td>
                            <td className="p-2 font-bold text-slate-900">{c.title}</td>
                            <td className="p-2 text-slate-600">{c.practiceArea}</td>
                            <td className="p-2 text-slate-700">{c.assignedLawyerName}</td>
                            <td className="p-2">
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 text-blue-800 border border-blue-200">
                                {c.status.toUpperCase().replace('_', ' ')}
                              </span>
                            </td>
                            <td className="p-2 font-mono font-bold text-right text-emerald-700">${c.retainerRemaining.toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Listed Documents Table */}
              <div className="space-y-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5 border-b border-slate-200 pb-1">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Listed Vault Documents & Pleadings Registry</span>
                </h2>
                {clientDocs.length === 0 ? (
                  <p className="text-slate-500 italic py-2">No documents currently registered in vault.</p>
                ) : (
                  <div className="overflow-x-auto border border-slate-200 rounded-lg">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-800 text-white text-[11px]">
                          <th className="p-2 font-bold">Document Title</th>
                          <th className="p-2 font-bold">Category</th>
                          <th className="p-2 font-bold">Case Matter</th>
                          <th className="p-2 font-bold">Upload Date</th>
                          <th className="p-2 font-bold">Security Level</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 text-[11px]">
                        {clientDocs.map((d) => (
                          <tr key={d.id} className="hover:bg-slate-50">
                            <td className="p-2 font-bold text-slate-900">{d.fileName}</td>
                            <td className="p-2 text-slate-600">{d.category}</td>
                            <td className="p-2 font-mono text-slate-700">{d.caseTitle}</td>
                            <td className="p-2 font-mono text-slate-600">{d.uploadedAt}</td>
                            <td className="p-2">
                              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-slate-100 text-slate-800 border border-slate-200">
                                {d.isConfidential ? 'Confidential' : 'Standard'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              {/* Financial & Invoice Statement Summary */}
              <div className="space-y-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5 border-b border-slate-200 pb-1">
                  <Receipt className="w-4 h-4 text-blue-600" />
                  <span>Financial Statement & Retainer Summary</span>
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg text-center">
                  <div>
                    <span className="text-[10px] text-slate-500 font-semibold uppercase block">Total Retainer Rem.</span>
                    <strong className="text-sm font-mono text-emerald-700">
                      ${clientCases.reduce((acc, c) => acc + c.retainerRemaining, 0).toLocaleString()}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-semibold uppercase block">Lifetime Billed</span>
                    <strong className="text-sm font-mono text-slate-900">
                      ${clientCases.reduce((acc, c) => acc + c.totalBilled, 0).toLocaleString()}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-semibold uppercase block">Invoices Issued</span>
                    <strong className="text-sm font-mono text-blue-700">
                      ${clientInvoices.reduce((acc, inv) => acc + inv.totalAmount, 0).toLocaleString()}
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-semibold uppercase block">Settled Payments</span>
                    <strong className="text-sm font-mono text-emerald-700">
                      ${clientInvoices.reduce((acc, inv) => acc + inv.amountPaid, 0).toLocaleString()}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Report Footer */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] text-slate-400">
                <span>Certified Official Receipt • JurisPulse Law Practice Suite</span>
                <span>Confidential Attorney-Client Privileged Communication</span>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-2 no-print">
              <button
                onClick={() => setIsPrintModalOpen(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg text-xs transition"
              >
                Close Preview
              </button>
              <button
                onClick={handleDownloadReceipt}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-sm transition"
              >
                <Download className="w-3.5 h-3.5 text-blue-400" />
                <span>Download Receipt PDF</span>
              </button>
              <button
                onClick={() => window.print()}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-sm transition"
              >
                <Printer className="w-3.5 h-3.5 text-white" />
                <span>Print Status Report</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CLIENT DOCUMENT UPLOAD MODAL */}
      {isDocUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden text-slate-900 my-8 animate-in fade-in">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UploadCloud className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-white text-sm">Upload Document to Vault</h3>
              </div>
              <button
                onClick={() => setIsDocUploadModalOpen(false)}
                className="p-1 text-slate-400 hover:text-white rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadDocumentSubmit} className="p-5 space-y-4 text-xs">
              <p className="text-slate-600">
                Securely upload contracts, tax forms, evidence records, or correspondence directly into your attorney's case file with SHA-256 chain-of-custody tracking.
              </p>

              <div className="space-y-3 bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Target Matter / Case</label>
                  <select
                    value={uploadDocCaseId}
                    onChange={(e) => setUploadDocCaseId(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 text-xs font-semibold"
                  >
                    {clientCases.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.caseNumber} - {c.title}
                      </option>
                    ))}
                    {clientCases.length === 0 && (
                      <option value="case-general">General Client File</option>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Document Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Executed Supply Agreement 2026 or Bank Settlement Draft"
                    value={uploadDocTitle}
                    onChange={(e) => setUploadDocTitle(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 text-xs font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">Category</label>
                    <select
                      value={uploadDocCategory}
                      onChange={(e) => setUploadDocCategory(e.target.value as any)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 text-xs"
                    >
                      <option value="Pleadings">Pleadings</option>
                      <option value="Contracts">Contracts</option>
                      <option value="Discovery">Discovery</option>
                      <option value="Evidence">Evidence</option>
                      <option value="Correspondence">Correspondence</option>
                      <option value="Corporate Governance">Corporate Governance</option>
                      <option value="Tax & Financial">Tax & Financial</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1">File Name (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g., Agreement_Final_Signed.pdf"
                      value={uploadDocFileName}
                      onChange={(e) => setUploadDocFileName(e.target.value)}
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-900 text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Notes / Description for Legal Team</label>
                  <textarea
                    rows={2}
                    placeholder="Provide context on this upload or specific instructions for counsel..."
                    value={uploadDocNotes}
                    onChange={(e) => setUploadDocNotes(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-lg p-2 text-slate-900 text-xs"
                  />
                </div>

                <label className="flex items-center gap-2 text-slate-700 font-semibold cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={uploadDocConfidential}
                    onChange={(e) => setUploadDocConfidential(e.target.checked)}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Mark as Highly Confidential / Attorney-Client Privileged</span>
                </label>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsDocUploadModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold flex items-center gap-1.5 shadow-sm transition"
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>Upload Document</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CLIENT INVOICE ONLINE PAYMENT MODAL */}
      {selectedInvoiceForPayment && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden text-slate-900 my-8 animate-in fade-in">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-white text-sm">Settle Invoice Online</h3>
              </div>
              <button
                onClick={() => setSelectedInvoiceForPayment(null)}
                className="p-1 text-slate-400 hover:text-white rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-semibold">Invoice Number:</span>
                  <span className="font-mono font-bold text-slate-900">{selectedInvoiceForPayment.invoiceNumber}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-semibold">Matter:</span>
                  <span className="font-semibold text-slate-800 text-right truncate max-w-[200px]">{selectedInvoiceForPayment.caseTitle}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 font-semibold">Due Date:</span>
                  <span className="font-mono text-slate-700">{selectedInvoiceForPayment.dueDate}</span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                  <span className="text-slate-700 font-bold">Total Amount Due:</span>
                  <span className="text-lg font-mono font-bold text-emerald-700">
                    ${selectedInvoiceForPayment.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-2">Select Payment Method</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
                      paymentMethod === 'card'
                        ? 'border-blue-600 bg-blue-50/50 text-blue-800 font-bold shadow-xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    <span className="text-[11px]">Credit Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('ach')}
                    className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
                      paymentMethod === 'ach'
                        ? 'border-blue-600 bg-blue-50/50 text-blue-800 font-bold shadow-xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium'
                    }`}
                  >
                    <Landmark className="w-4 h-4 text-emerald-600" />
                    <span className="text-[11px]">ACH Direct</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('wire')}
                    className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center gap-1.5 ${
                      paymentMethod === 'wire'
                        ? 'border-blue-600 bg-blue-50/50 text-blue-800 font-bold shadow-xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-medium'
                    }`}
                  >
                    <Receipt className="w-4 h-4 text-purple-600" />
                    <span className="text-[11px]">Trust Wire</span>
                  </button>
                </div>
              </div>

              {paymentMethod === 'card' && (
                <div className="space-y-2 bg-slate-50 border border-slate-200 rounded-xl p-3">
                  <div>
                    <label className="block text-[11px] text-slate-600 font-semibold mb-1">Card Number</label>
                    <input
                      type="text"
                      readOnly
                      value="•••• •••• •••• 4242"
                      className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-mono text-slate-700 text-xs"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[11px] text-slate-600 font-semibold mb-1">Expiry</label>
                      <input
                        type="text"
                        readOnly
                        value="12/28"
                        className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-mono text-slate-700 text-xs"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-slate-600 font-semibold mb-1">CVC</label>
                      <input
                        type="text"
                        readOnly
                        value="•••"
                        className="w-full bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 font-mono text-slate-700 text-xs"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'ach' && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 text-[11px] space-y-1">
                  <p className="font-semibold text-slate-800">Linked Commercial Checking Account:</p>
                  <p className="font-mono text-slate-700">JPMorgan Chase •••• 9812 (Routing 021000021)</p>
                  <p className="text-slate-400">Zero-fee settlement via Nacha Secure ACH network.</p>
                </div>
              )}

              {paymentMethod === 'wire' && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-600 text-[11px] space-y-1">
                  <p className="font-semibold text-slate-800">Escrow Trust Account Wire Details:</p>
                  <p className="font-mono text-slate-700">JurisPulse Trust Escrow • Bank of America</p>
                  <p className="text-slate-400">Direct wire confirmation will be automatically generated upon release.</p>
                </div>
              )}

              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-2 text-[11px] text-emerald-800">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>256-bit Encrypted Payment Gateway • IOLTA Compliant</span>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedInvoiceForPayment(null)}
                  disabled={isProcessingPayment}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleProcessInvoicePayment}
                  disabled={isProcessingPayment}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center gap-1.5 shadow-sm transition disabled:opacity-50"
                >
                  {isProcessingPayment ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Processing Payment...</span>
                    </>
                  ) : (
                    <>
                      <DollarSign className="w-4 h-4" />
                      <span>Pay ${selectedInvoiceForPayment.totalAmount.toLocaleString()} Now</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DIGITAL CONSENT AUDIT CERTIFICATE MODAL */}
      {selectedConsentCertReq && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden text-slate-900 animate-in fade-in">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <div>
                  <h3 className="font-bold text-white text-sm">Official Digital Consent Certificate</h3>
                  <span className="text-[10px] text-slate-400 font-mono">
                    ESIGN & UETA Cryptographic Intake Audit Log
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedConsentCertReq(null)}
                className="p-1 text-slate-400 hover:text-white rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                    Certificate Verification Status
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>VALID & CRYPTOGRAPHICALLY STAMPED</span>
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">
                  {selectedConsentCertReq.requestTitle}
                </h4>
                <p className="text-[11px] text-slate-600">
                  Representation inquiry submitted by <span className="font-semibold text-slate-800">{selectedConsentCertReq.clientName}</span>.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-2 text-[11px]">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Signatory & Identity Audit Trail
                </span>
                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Consented By:</span>
                    <span className="font-bold text-slate-900">{selectedConsentCertReq.digitalConsent?.consentedBy || 'Authorized Officer'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Signatory Role:</span>
                    <span className="font-semibold text-slate-800">{selectedConsentCertReq.digitalConsent?.signerRole || 'Corporate Representative'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Timestamp:</span>
                    <span className="font-mono text-emerald-700 font-bold">{selectedConsentCertReq.digitalConsent?.consentedAt}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Network IP:</span>
                    <span className="font-mono text-slate-700">{selectedConsentCertReq.digitalConsent?.signerIp || '192.168.1.188 (SSL)'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Signer Email:</span>
                    <span className="font-mono text-slate-700 truncate block">{selectedConsentCertReq.digitalConsent?.signerEmail || selectedConsentCertReq.clientEmail}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Standard Version:</span>
                    <span className="font-bold text-slate-800">{selectedConsentCertReq.digitalConsent?.termsVersion || 'v2026.4-ETHICS-ESIGN'}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Audit Integrity Hash:</span>
                  <span className="font-mono text-[10px] text-slate-600 bg-white p-1.5 rounded border border-slate-200 block truncate select-all">
                    {selectedConsentCertReq.digitalConsent?.consentHash || 'SHA256:CON-M893F8A-9382F9'}
                  </span>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-700 uppercase tracking-wider block">
                  Acknowledged Ethics & Legal Provisions ({selectedConsentCertReq.digitalConsent?.acknowledgedClauses?.length || 4})
                </span>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-[11px] space-y-1.5 text-slate-600">
                  {(selectedConsentCertReq.digitalConsent?.acknowledgedClauses || [
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

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedConsentCertReq(null)}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-xs shadow-sm transition"
                >
                  Close Certificate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STANDALONE QUICK SIGNING MODAL FOR INCOMPLETE CONSENT REQUESTS */}
      {signingConsentForReq && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden text-slate-900 animate-in fade-in">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileSignature className="w-5 h-5 text-amber-400" />
                <div>
                  <h3 className="font-bold text-white text-sm">Execute Digital Intake Consent</h3>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Required for Formal Lawyer Acceptance
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSigningConsentForReq(null)}
                className="p-1 text-slate-400 hover:text-white rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-900 text-[11px] space-y-1">
                <p className="font-bold text-amber-950">Executing Consent for Request:</p>
                <p className="font-semibold text-slate-800">"{signingConsentForReq.requestTitle}"</p>
                <p className="text-slate-600 text-[10px]">
                  State Bar ethics rules require authorized client consent before counsel can accept representation.
                </p>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                    Signatory Full Legal Name
                  </label>
                  <input
                    type="text"
                    value={quickSignerName}
                    onChange={(e) => setQuickSignerName(e.target.value)}
                    placeholder="e.g. Jane Doe"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-slate-700 uppercase mb-1">
                    Signatory Role / Capacity
                  </label>
                  <input
                    type="text"
                    value={quickSignerTitle}
                    onChange={(e) => setQuickSignerTitle(e.target.value)}
                    placeholder="e.g. Managing Director / Client Representative"
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-[11px] text-slate-600 space-y-1">
                <span className="font-bold text-slate-800 block">Electronic Execution Terms:</span>
                <p className="text-[10px]">
                  By clicking "Sign & Execute Consent", you electronically sign this intake authorization under the U.S. Electronic Signatures in Global and National Commerce Act (ESIGN) and state ethics rules.
                </p>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSigningConsentForReq(null)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 19);
                    const hash = `SHA256:CON-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
                    const newConsent: DigitalConsentRecord = {
                      agreed: true,
                      consentedAt: timestamp,
                      consentedBy: quickSignerName.trim() || `${signingConsentForReq.clientName} Authorized Officer`,
                      signerRole: quickSignerTitle.trim() || 'Corporate Representative',
                      signerEmail: signingConsentForReq.clientEmail,
                      signerIp: '192.168.1.188 (SSL)',
                      termsVersion: 'v2026.4-ETHICS-ESIGN',
                      consentHash: hash,
                      acknowledgedClauses: [
                        'Authorization for conflict check & electronic database record creation',
                        'Acknowledgment of preliminary non-engagement until formal retainer executed',
                        'Confidentiality & Attorney-Client Privilege safeguards under Rule 1.6',
                        'Consent to secure electronic encrypted communications & audit trail retention'
                      ]
                    };

                    if (onUpdateClientConsent) {
                      onUpdateClientConsent(signingConsentForReq.id, newConsent);
                    }

                    const toast: ToastNotification = {
                      id: `toast-consent-${Date.now()}`,
                      title: 'Digital Consent Executed',
                      message: `Timestamped consent recorded for "${signingConsentForReq.requestTitle}". Representation can now be accepted by counsel.`,
                      timestamp: 'Just now',
                      type: 'info'
                    };
                    setToasts((prev) => [toast, ...prev]);
                    setSigningConsentForReq(null);
                  }}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center gap-1.5 shadow-sm transition"
                >
                  <FileSignature className="w-4 h-4" />
                  <span>Sign & Execute Consent</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Floating Toast Notification Container */}
      {toasts.length > 0 && (
        <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className="pointer-events-auto p-4 bg-slate-900/95 text-white border border-blue-500/50 rounded-xl shadow-2xl backdrop-blur-md flex items-start justify-between gap-3 animate-in slide-in-from-bottom-5 duration-300"
            >
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600/30 border border-blue-400/40 flex items-center justify-center shrink-0 mt-0.5">
                  <Bell className="w-4 h-4 text-blue-400" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-blue-300">{toast.title}</span>
                    {toast.caseNumber && (
                      <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700 font-bold">
                        {toast.caseNumber}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-200 leading-snug">{toast.message}</p>
                  <span className="text-[10px] text-slate-400 block font-mono">{toast.timestamp}</span>
                </div>
              </div>

              <button
                onClick={() => handleDismissToast(toast.id)}
                className="p-1 text-slate-400 hover:text-white rounded-md hover:bg-slate-800 transition shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
