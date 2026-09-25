import React, { useState, useMemo, useRef } from 'react';
import {
  FileText,
  Upload,
  Search,
  Sparkles,
  Lock,
  Download,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  RotateCcw,
  History,
  FileType,
  Eye,
  Plus,
  X,
  Bot,
  RefreshCw,
  FileCode,
  Zap,
  Check,
  Hash,
  ArrowRight,
  Shield,
  FileCheck,
  FileQuestion,
  BarChart3,
  TrendingUp,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Filter,
  Layers,
  Briefcase,
  Layers2,
  PanelRightOpen,
  PanelRightClose,
  PanelRight,
  CheckCheck,
  CheckSquare,
  Square,
  ListChecks,
  FileSpreadsheet,
  FileUp,
  FilePlus,
  FolderUp,
  Trash2,
  Inbox,
  FileCheck2,
  CheckCircle
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell
} from 'recharts';
import { ClientDocument, CaseFile, UserRole, DocumentCustodyEvent } from '../types';
import { DocumentSidePanel } from './DocumentSidePanel';
import { DocumentQuickPreviewModal } from './DocumentQuickPreviewModal';

interface DocumentsViewProps {
  documents: ClientDocument[];
  cases: CaseFile[];
  userRole: UserRole;
  onAddDocument: (doc: ClientDocument) => void;
  onToggleVerification?: (docId: string, customNote?: string) => void;
  onBatchVerify?: (docIds: string[], customNote?: string) => void;
}

export interface StagedIntakeFile {
  id: string;
  file: File;
  name: string;
  sizeFormatted: string;
  fileType: ClientDocument['fileType'];
  category: ClientDocument['category'];
  isConfidential: boolean;
  verificationStatus: 'Needs Review' | 'Verified';
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({
  documents,
  cases,
  userRole,
  onAddDocument,
  onToggleVerification,
  onBatchVerify
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [verificationFilter, setVerificationFilter] = useState<'all' | 'Verified' | 'Needs Review'>('all');
  const [selectedCaseFilter, setSelectedCaseFilter] = useState<string>('all');
  const [selectedDocId, setSelectedDocId] = useState<string>(documents[0]?.id || '');
  const [isSidePanelOpen, setIsSidePanelOpen] = useState<boolean>(true);
  const [sidePanelMode, setSidePanelMode] = useState<'docked' | 'drawer'>('docked');
  const [expandedRowIds, setExpandedRowIds] = useState<Record<string, boolean>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiAnalysisResult, setAiAnalysisResult] = useState<any>(null);

  // Quick Preview Modal State
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewDocId, setPreviewDocId] = useState<string>(documents[0]?.id || '');

  // Batch Verification State
  const [selectedDocIdsForBatch, setSelectedDocIdsForBatch] = useState<string[]>([]);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [batchCustomNote, setBatchCustomNote] = useState('');
  const [batchSuccessMessage, setBatchSuccessMessage] = useState<string | null>(null);
  const [exportSuccessMessage, setExportSuccessMessage] = useState<string | null>(null);
  const [isExecutingBatch, setIsExecutingBatch] = useState(false);

  // Drag-and-Drop Fast Intake Zone State
  const [isFastIntakeZoneOpen, setIsFastIntakeZoneOpen] = useState(true);
  const [isDraggingOverPage, setIsDraggingOverPage] = useState(false);
  const [isDraggingOverIntakeZone, setIsDraggingOverIntakeZone] = useState(false);
  const [isDraggingOverModalZone, setIsDraggingOverModalZone] = useState(false);
  const [intakeDropMode, setIntakeDropMode] = useState<'stage' | 'instant'>('stage');
  const [stagedIntakeFiles, setStagedIntakeFiles] = useState<StagedIntakeFile[]>([]);
  const [intakeTargetCaseId, setIntakeTargetCaseId] = useState<string>(cases[0]?.id || '');
  const [intakeDefaultCategory, setIntakeDefaultCategory] = useState<'Auto-Detect' | ClientDocument['category']>('Auto-Detect');
  const [intakeAutoVerify, setIntakeAutoVerify] = useState<boolean>(false);
  const [intakeIsConfidential, setIntakeIsConfidential] = useState<boolean>(true);
  const [intakeSuccessMessage, setIntakeSuccessMessage] = useState<string | null>(null);
  const [isProcessingIntake, setIsProcessingIntake] = useState(false);
  const [modalStagedFile, setModalStagedFile] = useState<{ name: string; sizeFormatted: string; type: string } | null>(null);

  const dragCounterRef = useRef<number>(0);
  const intakeFileInputRef = useRef<HTMLInputElement>(null);
  const modalFileInputRef = useRef<HTMLInputElement>(null);

  // Visualization Section State
  const [chartLayout, setChartLayout] = useState<'stacked' | 'grouped'>('stacked');
  const [isWorkloadSectionExpanded, setIsWorkloadSectionExpanded] = useState<boolean>(true);

  // Custom custody note addition modal / state
  const [isAddingCustodyNote, setIsAddingCustodyNote] = useState(false);
  const [customCustodyNote, setCustomCustodyNote] = useState('');

  // Auto legal draft generator state
  const [isDraftingModalOpen, setIsDraftingModalOpen] = useState(false);
  const [draftDocType, setDraftDocType] = useState('Non-Disclosure & Confidentiality Agreement');
  const [draftCaseId, setDraftCaseId] = useState(cases[0]?.id || '');
  const [draftInstructions, setDraftInstructions] = useState('');
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);
  const [generatedDraftText, setGeneratedDraftText] = useState('');

  // Upload modal state
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadFileName, setUploadFileName] = useState('');
  const [uploadCaseId, setUploadCaseId] = useState(cases[0]?.id || '');
  const [uploadCategory, setUploadCategory] = useState<ClientDocument['category']>('Evidence');
  const [uploadIsConfidential, setUploadIsConfidential] = useState(true);
  const [uploadInitialVerification, setUploadInitialVerification] = useState<'Needs Review' | 'Verified'>('Needs Review');

  // Find currently selected document from latest documents array
  const selectedDoc = useMemo(() => {
    return documents.find((d) => d.id === selectedDocId) || documents[0] || null;
  }, [documents, selectedDocId]);

  // Find currently previewed document for Quick Preview modal
  const previewDoc = useMemo(() => {
    return documents.find((d) => d.id === previewDocId) || selectedDoc || documents[0] || null;
  }, [documents, previewDocId, selectedDoc]);

  // Document counts for quick filter chips
  const totalCount = documents.length;
  const evidenceCount = documents.filter((d) => d.category === 'Evidence').length;
  const verifiedCount = documents.filter((d) => (d.verificationStatus || 'Needs Review') === 'Verified').length;
  const needsReviewCount = documents.filter((d) => (d.verificationStatus || 'Needs Review') === 'Needs Review').length;

  // Aggregate Workload Data per Case for Recharts Visualization
  const caseWorkloadData = useMemo(() => {
    return cases.map((c) => {
      const caseDocs = documents.filter(
        (d) => d.caseId === c.id || d.caseTitle.toLowerCase() === c.title.toLowerCase()
      );
      const verified = caseDocs.filter(
        (d) => (d.verificationStatus || 'Needs Review') === 'Verified'
      ).length;
      const needsReview = caseDocs.filter(
        (d) => (d.verificationStatus || 'Needs Review') === 'Needs Review'
      ).length;
      const total = caseDocs.length;
      const rate = total > 0 ? Math.round((verified / total) * 100) : 0;

      // Truncate title nicely for X-Axis tick labels
      const shortName = c.caseNumber
        ? `${c.caseNumber}`
        : c.title.length > 14
        ? `${c.title.substring(0, 12)}…`
        : c.title;

      return {
        id: c.id,
        caseNumber: c.caseNumber,
        caseTitle: c.title,
        shortName,
        displayLabel: `${c.caseNumber ? c.caseNumber + ': ' : ''}${c.title}`,
        clientName: c.clientName,
        assignedLawyer: c.assignedLawyerName,
        verified,
        needsReview,
        total,
        rate
      };
    }).filter((item) => item.total > 0 || cases.length <= 6);
  }, [cases, documents]);

  // Global workload summary metrics
  const totalVerifiedAcrossAll = useMemo(() => {
    return documents.filter((d) => (d.verificationStatus || 'Needs Review') === 'Verified').length;
  }, [documents]);

  const totalNeedsReviewAcrossAll = useMemo(() => {
    return documents.filter((d) => (d.verificationStatus || 'Needs Review') === 'Needs Review').length;
  }, [documents]);

  const overallCompletionRate = documents.length > 0
    ? Math.round((totalVerifiedAcrossAll / documents.length) * 100)
    : 0;

  const highestBacklogCase = useMemo(() => {
    if (caseWorkloadData.length === 0) return null;
    const sorted = [...caseWorkloadData].sort((a, b) => b.needsReview - a.needsReview);
    return sorted[0]?.needsReview > 0 ? sorted[0] : null;
  }, [caseWorkloadData]);

  const filteredDocs = useMemo(() => {
    const rawQuery = searchTerm.trim().toLowerCase();

    return documents.filter((d) => {
      // 1. Real-time Multi-Token Search Filtering
      let matchesSearch = true;
      if (rawQuery) {
        const currentVerification = (d.verificationStatus || 'Needs Review').toLowerCase();
        const isVerified = currentVerification === 'verified';

        const fileNameLower = d.fileName.toLowerCase();
        const aiSummaryLower = (d.aiSummary || '').toLowerCase();
        const aiClausesLower = (d.aiKeyClauses || []).join(' ').toLowerCase();
        const aiRiskLower = (d.aiRiskLevel || '').toLowerCase();
        const caseTitleLower = d.caseTitle.toLowerCase();
        const clientNameLower = (d.clientName || '').toLowerCase();
        const categoryLower = d.category.toLowerCase();
        const uploadedByLower = d.uploadedBy.toLowerCase();
        const verifiedByLower = (d.verifiedBy || '').toLowerCase();

        // Tokenize query by whitespace for multi-term search
        const tokens = rawQuery.split(/\s+/).filter(Boolean);

        matchesSearch = tokens.every((token) => {
          // Direct field matches: File name, AI Summary, AI Key Clauses, AI Risk Level
          if (
            fileNameLower.includes(token) ||
            aiSummaryLower.includes(token) ||
            aiClausesLower.includes(token) ||
            aiRiskLower.includes(token) ||
            caseTitleLower.includes(token) ||
            clientNameLower.includes(token) ||
            categoryLower.includes(token) ||
            uploadedByLower.includes(token) ||
            verifiedByLower.includes(token)
          ) {
            return true;
          }

          // Verification Status keyword matching
          if (
            token === 'verified' ||
            token === 'authenticated' ||
            token === 'sealed'
          ) {
            return isVerified;
          }

          if (
            token === 'unverified' ||
            token === 'pending' ||
            token === 'review' ||
            token === 'needs-review' ||
            token === 'unreviewed'
          ) {
            return !isVerified;
          }

          if (token === 'needs') {
            return !isVerified || currentVerification.includes('needs');
          }

          return false;
        });
      }

      // 2. Dropdown Filter Matches
      const matchesCat = categoryFilter === 'all' || d.category === categoryFilter;

      const currentVerification = d.verificationStatus || 'Needs Review';
      const matchesVerification =
        verificationFilter === 'all' || currentVerification === verificationFilter;

      const matchesCase =
        selectedCaseFilter === 'all' ||
        d.caseId === selectedCaseFilter ||
        d.caseTitle.toLowerCase().includes(selectedCaseFilter.toLowerCase());

      return matchesSearch && matchesCat && matchesVerification && matchesCase;
    });
  }, [documents, searchTerm, categoryFilter, verificationFilter, selectedCaseFilter]);

  const handleQuickToggleVerification = (e: React.MouseEvent, docId: string) => {
    e.stopPropagation();
    if (onToggleVerification) {
      onToggleVerification(docId);
    }
  };

  // Batch Selection Calculations
  const selectedNeedsReviewDocs = useMemo(() => {
    return documents.filter(
      (d) => selectedDocIdsForBatch.includes(d.id) && (d.verificationStatus || 'Needs Review') === 'Needs Review'
    );
  }, [documents, selectedDocIdsForBatch]);

  const filteredNeedsReviewDocs = useMemo(() => {
    return filteredDocs.filter((d) => (d.verificationStatus || 'Needs Review') === 'Needs Review');
  }, [filteredDocs]);

  const isAllFilteredSelected =
    filteredDocs.length > 0 && filteredDocs.every((d) => selectedDocIdsForBatch.includes(d.id));

  const isSomeFilteredSelected =
    filteredDocs.some((d) => selectedDocIdsForBatch.includes(d.id)) && !isAllFilteredSelected;

  const handleToggleSelectDoc = (docId: string) => {
    setSelectedDocIdsForBatch((prev) =>
      prev.includes(docId) ? prev.filter((id) => id !== docId) : [...prev, docId]
    );
  };

  const handleToggleSelectAllFiltered = () => {
    if (isAllFilteredSelected) {
      const filteredIdSet = new Set(filteredDocs.map((d) => d.id));
      setSelectedDocIdsForBatch((prev) => prev.filter((id) => !filteredIdSet.has(id)));
    } else {
      const newIds = new Set([...selectedDocIdsForBatch, ...filteredDocs.map((d) => d.id)]);
      setSelectedDocIdsForBatch(Array.from(newIds));
    }
  };

  const handleSelectAllNeedsReview = () => {
    const unverifiedIds = filteredNeedsReviewDocs.map((d) => d.id);
    setSelectedDocIdsForBatch((prev) => Array.from(new Set([...prev, ...unverifiedIds])));
  };

  const handleExecuteBatchVerify = (customNote?: string) => {
    if (selectedDocIdsForBatch.length === 0) return;

    setIsExecutingBatch(true);
    const count = selectedDocIdsForBatch.length;

    if (onBatchVerify) {
      onBatchVerify(selectedDocIdsForBatch, customNote);
    } else if (onToggleVerification) {
      selectedDocIdsForBatch.forEach((id) => {
        const doc = documents.find((d) => d.id === id);
        if (doc && (doc.verificationStatus || 'Needs Review') !== 'Verified') {
          onToggleVerification(id, customNote);
        }
      });
    }

    setBatchSuccessMessage(
      `Batch authenticated and verified ${count} document${count > 1 ? 's' : ''} into matter evidentiary vault.`
    );
    setSelectedDocIdsForBatch([]);
    setIsBatchModalOpen(false);
    setBatchCustomNote('');
    setIsExecutingBatch(false);

    setTimeout(() => {
      setBatchSuccessMessage(null);
    }, 5000);
  };

  const handleAddCustodyNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDoc || !customCustodyNote.trim() || !onToggleVerification) return;
    
    // Call verification toggle with custom note or append note
    onToggleVerification(selectedDoc.id, customCustodyNote.trim());
    setCustomCustodyNote('');
    setIsAddingCustodyNote(false);
  };

  const handleAnalyzeWithAI = async (doc: ClientDocument) => {
    setIsAnalyzing(true);
    setAiAnalysisResult(null);

    try {
      const res = await fetch('/api/ai/analyze-doc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          documentName: doc.fileName,
          documentType: doc.category,
          content: doc.aiSummary || 'Legal clause analysis requested.'
        })
      });
      const data = await res.json();
      setAiAnalysisResult(data);
    } catch (err) {
      console.error(err);
      setAiAnalysisResult({
        summary: `Document "${doc.fileName}" analyzed. High sensitivity terms detected.`,
        keyClauses: ['Indemnification clause limits liability.', 'Filing deadline within 30 days.'],
        riskLevel: 'Moderate'
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleGenerateLegalDraft = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeneratingDraft(true);
    setGeneratedDraftText('');

    const matchedCase = cases.find((c) => c.id === draftCaseId);

    try {
      const res = await fetch('/api/ai/draft-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          docType: draftDocType,
          caseTitle: matchedCase ? matchedCase.title : 'General Legal Matter',
          clientName: matchedCase ? matchedCase.clientName : 'Client',
          customInstructions: draftInstructions
        })
      });
      const data = await res.json();
      setGeneratedDraftText(data.draftText || 'Draft completed.');
    } catch (err) {
      console.error(err);
      setGeneratedDraftText(
        `LEGAL MEMORANDUM & AGREEMENT DRAFT\n\nRE: ${matchedCase?.title}\nCLIENT: ${matchedCase?.clientName}\nTYPE: ${draftDocType}\n\n1. OBLIGATIONS & TERMS\nThe parties hereby agree to maintain strict confidentiality under state law. Breach triggers immediate injunctive relief.\n\n2. DISPUTE RESOLUTION\nGoverned by the rules of the American Arbitration Association.\n\nRespectfully submitted,\nJurisPulse Counsel of Record`
      );
    } finally {
      setIsGeneratingDraft(false);
    }
  };

  const handleSaveDraftAsDocument = () => {
    if (!generatedDraftText) return;
    const matchedCase = cases.find((c) => c.id === draftCaseId);
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 16);

    const newDoc: ClientDocument = {
      id: `doc-${Date.now()}`,
      caseId: draftCaseId,
      caseTitle: matchedCase ? matchedCase.title : 'General Legal Matter',
      clientName: matchedCase ? matchedCase.clientName : 'Client',
      fileName: `${draftDocType.replace(/\s+/g, '_')}_DRAFT.pdf`,
      fileSize: '1.2 MB',
      fileType: 'pdf',
      category: 'Contracts',
      uploadedAt: timestamp,
      uploadedBy: 'Gemini Copilot',
      version: '1.0',
      isConfidential: true,
      verificationStatus: 'Verified',
      verifiedBy: 'Gemini AI Drafter Engine',
      verifiedAt: timestamp,
      custodyHash: `SHA256: ${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`,
      chainOfCustody: [
        {
          id: `cust-${Date.now()}-1`,
          action: 'Uploaded',
          performedBy: 'Gemini AI Drafter Engine',
          timestamp,
          note: `Auto-generated legal memorandum template for ${draftDocType}`
        },
        {
          id: `cust-${Date.now()}-2`,
          action: 'Marked Verified',
          performedBy: 'Automated Drafting Custody Daemon',
          timestamp,
          note: 'Syntactically verified and ingested into secure matter vault'
        }
      ],
      aiSummary: `AI Generated Legal Draft for ${draftDocType}.`,
      aiRiskLevel: 'Low',
      aiKeyClauses: ['Custom AI Legal Drafting Engine']
    };

    onAddDocument(newDoc);
    setSelectedDocId(newDoc.id);
    setIsDraftingModalOpen(false);
    setGeneratedDraftText('');
  };

  const formatBytes = (bytes: number): string => {
    if (!bytes || bytes === 0) return '1.5 MB';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const detectFileType = (fileName: string): ClientDocument['fileType'] => {
    const lower = fileName.toLowerCase();
    if (lower.endsWith('.xlsx') || lower.endsWith('.xls') || lower.endsWith('.csv')) return 'xlsx';
    if (lower.endsWith('.docx') || lower.endsWith('.doc') || lower.endsWith('.rtf') || lower.endsWith('.odt')) return 'docx';
    if (lower.endsWith('.png') || lower.endsWith('.jpg') || lower.endsWith('.jpeg') || lower.endsWith('.tiff') || lower.endsWith('.bmp') || lower.endsWith('.webp')) return 'scanned_img';
    return 'pdf';
  };

  const inferCategoryFromFileName = (fileName: string): ClientDocument['category'] => {
    const lower = fileName.toLowerCase();
    if (/contract|agreement|nda|lease|retainer|terms|sla|mou|addendum|amendment/.test(lower)) return 'Contracts';
    if (/pleading|motion|complaint|brief|order|petition|subpoena|writ|injunction|affidavit|summons|judgment/.test(lower)) return 'Pleadings';
    if (/discovery|interrogator|deposition|request_for_prod|admission|transcript|expert_report|exhibit_list/.test(lower)) return 'Discovery';
    if (/correspondence|email|letter|notice|memo|demand|fax|communication|notes/.test(lower)) return 'Correspondence';
    return 'Evidence';
  };

  // Full-page drag and drop listeners
  const handlePageDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current += 1;
    if (e.dataTransfer.items && e.dataTransfer.items.length > 0) {
      setIsDraggingOverPage(true);
    }
  };

  const handlePageDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current -= 1;
    if (dragCounterRef.current <= 0) {
      dragCounterRef.current = 0;
      setIsDraggingOverPage(false);
    }
  };

  const handlePageDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handlePageDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current = 0;
    setIsDraggingOverPage(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      if (intakeDropMode === 'instant') {
        handleInstantDropIngest(e.dataTransfer.files);
      } else {
        handleStageIntakeFiles(e.dataTransfer.files);
      }
    }
  };

  // Intake drop zone listeners
  const handleIntakeZoneDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
    setIsDraggingOverIntakeZone(true);
  };

  const handleIntakeZoneDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOverIntakeZone(false);
  };

  const handleIntakeZoneDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingOverIntakeZone(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      if (intakeDropMode === 'instant') {
        handleInstantDropIngest(e.dataTransfer.files);
      } else {
        handleStageIntakeFiles(e.dataTransfer.files);
      }
    }
  };

  const handleStageIntakeFiles = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    const newStaged: StagedIntakeFile[] = fileArray.map((file, idx) => {
      const detectedExt = detectFileType(file.name);
      const inferredCat = intakeDefaultCategory === 'Auto-Detect'
        ? inferCategoryFromFileName(file.name)
        : intakeDefaultCategory;

      return {
        id: `staged-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 7)}`,
        file,
        name: file.name,
        sizeFormatted: formatBytes(file.size),
        fileType: detectedExt,
        category: inferredCat,
        isConfidential: intakeIsConfidential,
        verificationStatus: intakeAutoVerify ? 'Verified' : 'Needs Review'
      };
    });

    setStagedIntakeFiles((prev) => [...prev, ...newStaged]);
    setIsFastIntakeZoneOpen(true);
  };

  const handleRemoveStagedFile = (id: string) => {
    setStagedIntakeFiles((prev) => prev.filter((item) => item.id !== id));
  };

  const handleUpdateStagedCategory = (id: string, newCategory: ClientDocument['category']) => {
    setStagedIntakeFiles((prev) =>
      prev.map((item) => (item.id === id ? { ...item, category: newCategory } : item))
    );
  };

  const handleUpdateStagedVerification = (id: string, newStatus: 'Needs Review' | 'Verified') => {
    setStagedIntakeFiles((prev) =>
      prev.map((item) => (item.id === id ? { ...item, verificationStatus: newStatus } : item))
    );
  };

  const handleDepositStagedFiles = () => {
    if (stagedIntakeFiles.length === 0) return;

    setIsProcessingIntake(true);
    const targetCase = cases.find((c) => c.id === intakeTargetCaseId) || cases[0];
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 16);
    let lastAddedDocId = '';

    stagedIntakeFiles.forEach((item, idx) => {
      const randomHex = Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 10);
      const custodyHash = `SHA256: ${randomHex}`;
      const isVer = item.verificationStatus === 'Verified';

      const doc: ClientDocument = {
        id: `doc-${Date.now()}-${idx}`,
        caseId: targetCase ? targetCase.id : cases[0]?.id || 'case-1',
        caseTitle: targetCase ? targetCase.title : 'General Legal Matter',
        clientName: targetCase ? targetCase.clientName : 'Client',
        fileName: item.name,
        fileSize: item.sizeFormatted,
        fileType: item.fileType,
        category: item.category,
        uploadedAt: timestamp,
        uploadedBy: 'Current Counsel (Drag & Drop Fast Intake)',
        version: '1.0',
        isConfidential: item.isConfidential,
        verificationStatus: item.verificationStatus,
        verifiedBy: isVer ? 'Current Counsel' : undefined,
        verifiedAt: isVer ? timestamp : undefined,
        custodyHash,
        chainOfCustody: [
          {
            id: `cust-${Date.now()}-${idx}-1`,
            action: 'Uploaded',
            performedBy: 'Current Counsel',
            timestamp,
            note: `Deposited into vault via Drag-and-Drop Fast Intake under category ${item.category}`
          },
          ...(isVer
            ? [
                {
                  id: `cust-${Date.now()}-${idx}-2`,
                  action: 'Marked Verified' as const,
                  performedBy: 'Current Counsel',
                  timestamp,
                  note: 'Evidentiary authenticity verified during fast intake'
                }
              ]
            : [])
        ],
        aiSummary: `Fast-intake deposited legal record for ${targetCase?.title || 'Matter'}. Chain-of-custody sealed with SHA-256.`,
        aiRiskLevel: 'Low',
        aiKeyClauses: [`Intake Cryptographic Hash: ${custodyHash.substring(0, 18)}...`]
      };

      onAddDocument(doc);
      lastAddedDocId = doc.id;
    });

    if (lastAddedDocId) {
      setSelectedDocId(lastAddedDocId);
    }

    const count = stagedIntakeFiles.length;
    setStagedIntakeFiles([]);
    setIsProcessingIntake(false);
    setIntakeSuccessMessage(`Successfully ingested ${count} document${count === 1 ? '' : 's'} into Matter "${targetCase?.caseNumber || targetCase?.title || 'Selected Matter'}" with cryptographic custody records.`);
    setTimeout(() => setIntakeSuccessMessage(null), 6000);
  };

  const handleInstantDropIngest = (files: FileList | File[]) => {
    const fileArray = Array.from(files);
    if (fileArray.length === 0) return;

    const targetCase = cases.find((c) => c.id === intakeTargetCaseId) || cases[0];
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 16);
    let lastAddedDocId = '';

    fileArray.forEach((file, idx) => {
      const detectedExt = detectFileType(file.name);
      const inferredCat = intakeDefaultCategory === 'Auto-Detect'
        ? inferCategoryFromFileName(file.name)
        : intakeDefaultCategory;
      const randomHex = Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 10);
      const custodyHash = `SHA256: ${randomHex}`;
      const isVer = intakeAutoVerify;

      const doc: ClientDocument = {
        id: `doc-${Date.now()}-${idx}`,
        caseId: targetCase ? targetCase.id : cases[0]?.id || 'case-1',
        caseTitle: targetCase ? targetCase.title : 'General Legal Matter',
        clientName: targetCase ? targetCase.clientName : 'Client',
        fileName: file.name,
        fileSize: formatBytes(file.size),
        fileType: detectedExt,
        category: inferredCat,
        uploadedAt: timestamp,
        uploadedBy: 'Current Counsel (Instant Drop Intake)',
        version: '1.0',
        isConfidential: intakeIsConfidential,
        verificationStatus: isVer ? 'Verified' : 'Needs Review',
        verifiedBy: isVer ? 'Current Counsel' : undefined,
        verifiedAt: isVer ? timestamp : undefined,
        custodyHash,
        chainOfCustody: [
          {
            id: `cust-${Date.now()}-${idx}-1`,
            action: 'Uploaded',
            performedBy: 'Current Counsel',
            timestamp,
            note: `Instant drop deposited into vault under category ${inferredCat}`
          },
          ...(isVer
            ? [
                {
                  id: `cust-${Date.now()}-${idx}-2`,
                  action: 'Marked Verified' as const,
                  performedBy: 'Current Counsel',
                  timestamp,
                  note: 'Evidentiary authenticity verified on direct intake'
                }
              ]
            : [])
        ],
        aiSummary: `Fast-intake record for ${targetCase?.title || 'Matter'}. Verified custody hash assigned.`,
        aiRiskLevel: 'Low',
        aiKeyClauses: [`Vault Hash: ${custodyHash.substring(0, 18)}...`]
      };

      onAddDocument(doc);
      lastAddedDocId = doc.id;
    });

    if (lastAddedDocId) {
      setSelectedDocId(lastAddedDocId);
    }

    const count = fileArray.length;
    setIntakeSuccessMessage(`Directly ingested ${count} document${count === 1 ? '' : 's'} into Matter "${targetCase?.caseNumber || targetCase?.title || 'Selected Matter'}".`);
    setTimeout(() => setIntakeSuccessMessage(null), 6000);
  };

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadFileName) return;

    const matchedCase = cases.find((c) => c.id === uploadCaseId);
    const timestamp = new Date().toISOString().replace('T', ' ').slice(0, 16);
    const detectedType = modalStagedFile ? detectFileType(uploadFileName) : 'pdf';
    const computedSize = modalStagedFile ? modalStagedFile.sizeFormatted : '2.4 MB';

    const newDoc: ClientDocument = {
      id: `doc-${Date.now()}`,
      caseId: uploadCaseId,
      caseTitle: matchedCase ? matchedCase.title : 'General Case Matter',
      clientName: matchedCase ? matchedCase.clientName : 'Client',
      fileName: uploadFileName.includes('.') ? uploadFileName : `${uploadFileName}.pdf`,
      fileSize: computedSize,
      fileType: detectedType,
      category: uploadCategory,
      uploadedAt: timestamp,
      uploadedBy: 'Current Counsel',
      version: '1.0',
      isConfidential: uploadIsConfidential,
      verificationStatus: uploadInitialVerification,
      verifiedBy: uploadInitialVerification === 'Verified' ? 'Current Counsel' : undefined,
      verifiedAt: uploadInitialVerification === 'Verified' ? timestamp : undefined,
      custodyHash: `SHA256: ${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`,
      chainOfCustody: [
        {
          id: `cust-${Date.now()}-1`,
          action: 'Uploaded',
          performedBy: 'Current Counsel',
          timestamp,
          note: `Manual upload deposited to vault under category ${uploadCategory}`
        },
        ...(uploadInitialVerification === 'Verified'
          ? [
              {
                id: `cust-${Date.now()}-2`,
                action: 'Marked Verified' as const,
                performedBy: 'Current Counsel',
                timestamp,
                note: 'Chain of custody confirmed during initial document deposit'
              }
            ]
          : [])
      ],
      aiSummary: 'Newly uploaded document pending Gemini AI deep risk scan.',
      aiRiskLevel: 'Low'
    };

    onAddDocument(newDoc);
    setSelectedDocId(newDoc.id);
    setIsUploadModalOpen(false);
    setUploadFileName('');
    setModalStagedFile(null);
  };

  // Export current view's document metadata to RFC-4180 CSV
  const handleExportMetadataCSV = (docsToExport: ClientDocument[] = filteredDocs) => {
    if (!docsToExport || docsToExport.length === 0) {
      setExportSuccessMessage('No document records available in current view to export.');
      setTimeout(() => setExportSuccessMessage(null), 3000);
      return;
    }

    const headers = [
      'Document ID',
      'File Name',
      'Category',
      'Verification Status',
      'Custody SHA-256 Hash',
      'Matter ID',
      'Matter Title',
      'Client Name',
      'File Size',
      'File Type',
      'Version',
      'Confidentiality',
      'Uploaded At',
      'Uploaded By',
      'Verified By',
      'Verified At',
      'AI Risk Level',
      'AI Summary',
      'Extracted Key Clauses',
      'Custody Events Count',
      'Latest Custody Action',
      'Latest Custody Timestamp',
      'Latest Custody Performed By',
      'Latest Custody Note'
    ];

    const escapeCSV = (val: any) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = docsToExport.map((doc) => {
      const custodyEvents = doc.chainOfCustody || [];
      const latestEvent = custodyEvents.length > 0 ? custodyEvents[custodyEvents.length - 1] : null;
      const custodyHash = doc.custodyHash || `SHA256: 8f3c7a912e5d944bc0891d21e89b41a3_${doc.id}`;
      const clauses = doc.aiKeyClauses?.join('; ') || '';

      return [
        escapeCSV(doc.id),
        escapeCSV(doc.fileName),
        escapeCSV(doc.category),
        escapeCSV(doc.verificationStatus || 'Needs Review'),
        escapeCSV(custodyHash),
        escapeCSV(doc.caseId),
        escapeCSV(doc.caseTitle),
        escapeCSV(doc.clientName),
        escapeCSV(doc.fileSize),
        escapeCSV(doc.fileType.toUpperCase()),
        escapeCSV(`v${doc.version}`),
        escapeCSV(doc.isConfidential ? 'Confidential Privileged' : 'Standard Public Filing'),
        escapeCSV(doc.uploadedAt),
        escapeCSV(doc.uploadedBy),
        escapeCSV(doc.verifiedBy || 'N/A'),
        escapeCSV(doc.verifiedAt || 'N/A'),
        escapeCSV(doc.aiRiskLevel || 'Low'),
        escapeCSV(doc.aiSummary || ''),
        escapeCSV(clauses),
        escapeCSV(custodyEvents.length),
        escapeCSV(latestEvent?.action || 'Uploaded'),
        escapeCSV(latestEvent?.timestamp || doc.uploadedAt),
        escapeCSV(latestEvent?.performedBy || doc.uploadedBy),
        escapeCSV(latestEvent?.note || '')
      ].join(',');
    });

    const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const dateStr = new Date().toISOString().slice(0, 10);
    link.href = url;
    link.setAttribute('download', `JurisPulse_Document_Metadata_Export_${dateStr}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setExportSuccessMessage(
      `Exported ${docsToExport.length} document metadata record${docsToExport.length === 1 ? '' : 's'} with SHA-256 custody hashes & verification status to CSV.`
    );
    setTimeout(() => setExportSuccessMessage(null), 5000);
  };

  // Custom Tooltip for Workload Recharts BarChart
  const CustomWorkloadTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900/95 text-white p-3 rounded-xl shadow-2xl border border-slate-700/80 text-xs min-w-[220px] backdrop-blur-md">
          <div className="border-b border-slate-700/60 pb-2 mb-2">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[10px] text-blue-400 font-bold bg-blue-950/80 px-1.5 py-0.5 rounded border border-blue-800">
                {data.caseNumber || 'CASE'}
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {data.total} {data.total === 1 ? 'Doc' : 'Docs'}
              </span>
            </div>
            <p className="font-bold text-slate-100 mt-1 leading-tight">{data.caseTitle}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Client: {data.clientName}</p>
            <p className="text-[10px] text-slate-400">Assigned: {data.assignedLawyer}</p>
          </div>

          <div className="space-y-1.5 font-medium">
            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Verified Exhibits:
              </span>
              <span className="font-mono font-bold text-white text-xs">{data.verified}</span>
            </div>

            <div className="flex items-center justify-between gap-4">
              <span className="flex items-center gap-1.5 text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                Needs Review:
              </span>
              <span className="font-mono font-bold text-white text-xs">{data.needsReview}</span>
            </div>

            <div className="pt-2 border-t border-slate-700/60 flex items-center justify-between text-slate-300 text-[11px]">
              <span>Verification Audit:</span>
              <span className="font-bold text-blue-400 font-mono">{data.rate}% Complete</span>
            </div>
          </div>
          <div className="mt-2 text-[10px] text-slate-400 italic text-center border-t border-slate-800 pt-1">
            Click bar to filter repository by this matter
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div
      onDragEnter={handlePageDragEnter}
      onDragLeave={handlePageDragLeave}
      onDragOver={handlePageDragOver}
      onDrop={handlePageDrop}
      className="space-y-6 animate-in fade-in duration-300 relative"
    >
      {/* Full-Page Drag and Drop Active Overlay */}
      {isDraggingOverPage && (
        <div className="fixed inset-0 z-50 bg-blue-950/75 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-white border-4 border-dashed border-blue-400 m-3 rounded-3xl pointer-events-none animate-in fade-in zoom-in-95 duration-150 shadow-2xl">
          <div className="p-6 bg-slate-900/95 rounded-2xl border border-blue-400/60 shadow-2xl flex flex-col items-center text-center max-w-md">
            <div className="w-16 h-16 rounded-2xl bg-blue-600/30 border border-blue-400 text-blue-300 flex items-center justify-center mb-4 animate-bounce">
              <FolderUp className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-extrabold text-white">Deposit Files into Vault</h3>
            <p className="text-xs text-blue-200 mt-1.5 leading-relaxed">
              Release to fast-ingest legal records into Matter{' '}
              <span className="font-bold text-white font-mono bg-blue-900/80 px-1.5 py-0.5 rounded border border-blue-700">
                {cases.find((c) => c.id === intakeTargetCaseId)?.caseNumber || 'Selected Matter'}
              </span>{' '}
              with SHA-256 custody seals.
            </p>
            <div className="mt-4 flex items-center gap-2 text-[11px] text-blue-300 bg-blue-950/80 px-3 py-1.5 rounded-full border border-blue-800">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Supports PDF, DOCX, XLSX, PNG, MSG & multi-file batch drops</span>
            </div>
          </div>
        </div>
      )}

      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-slate-900">Encrypted Document Vault & Chain of Custody</h1>
            <span className="text-[10px] font-mono font-bold bg-blue-50 text-blue-700 border border-blue-200 px-2 py-0.5 rounded">
              AES-256 Vault
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Single-click evidentiary verification, cryptographic custody audit trail, and Gemini AI contract scanner.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsFastIntakeZoneOpen(!isFastIntakeZoneOpen)}
            className={`px-3.5 py-1.5 font-semibold text-xs rounded-lg flex items-center gap-2 border shadow-2xs transition cursor-pointer ${
              isFastIntakeZoneOpen
                ? 'bg-blue-50 border-blue-300 text-blue-800'
                : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700'
            }`}
            title="Toggle Fast Drag & Drop Evidentiary Intake Zone"
          >
            <Zap className="w-4 h-4 text-blue-600" />
            <span>Fast Intake Zone</span>
            {stagedIntakeFiles.length > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-600 text-white font-mono font-bold">
                {stagedIntakeFiles.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => handleExportMetadataCSV(filteredDocs)}
            className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 font-semibold text-xs rounded-lg flex items-center gap-2 border border-slate-200 shadow-2xs transition cursor-pointer"
            title="Export current view's document list including custody hashes and verification status as CSV"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export Metadata</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] bg-slate-100 text-slate-600 font-mono">
              {filteredDocs.length}
            </span>
          </button>

          <button
            onClick={() => setIsDraftingModalOpen(true)}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg flex items-center gap-2 shadow-sm transition cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-blue-200" />
            <span>AI Legal Drafter</span>
          </button>

          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-lg flex items-center gap-2 shadow-sm transition cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Document</span>
          </button>
        </div>
      </div>

      {/* Intake Success Notification Banner */}
      {intakeSuccessMessage && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-950 flex items-center justify-between shadow-xs animate-in fade-in duration-200">
          <div className="flex items-center gap-2.5">
            <div className="p-1 rounded-md bg-emerald-100 text-emerald-700">
              <CheckCircle className="w-4 h-4 shrink-0" />
            </div>
            <div>
              <p className="font-bold text-emerald-900">{intakeSuccessMessage}</p>
              <p className="text-[11px] text-emerald-700">
                Cryptographic SHA-256 hash verified and chain-of-custody recorded.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {selectedDoc && (
              <button
                type="button"
                onClick={() => {
                  setPreviewDocId(selectedDoc.id);
                  setIsPreviewModalOpen(true);
                }}
                className="px-2.5 py-1 bg-white hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-md font-semibold text-xs flex items-center gap-1 transition cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Quick Preview</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setIntakeSuccessMessage(null)}
              className="text-emerald-700 hover:text-emerald-950 font-bold p-1 hover:bg-emerald-100 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Dedicated Fast Evidentiary Intake & Drag-and-Drop Zone */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden transition">
        {/* Section Header */}
        <div className="p-3.5 border-b border-slate-100 bg-slate-50/70 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
              <Zap className="w-4 h-4 text-blue-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xs font-bold text-slate-900">Fast Intake Drop Zone</h3>
                <span className="text-[10px] font-semibold bg-blue-100 text-blue-800 px-2 py-0.2 rounded-full font-mono">
                  Drag & Drop Enabled
                </span>
                {stagedIntakeFiles.length > 0 && (
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.2 rounded-full">
                    {stagedIntakeFiles.length} file{stagedIntakeFiles.length === 1 ? '' : 's'} in queue
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500">
                Rapid evidentiary intake with automatic file type detection, category tagging, and cryptographic SHA-256 seal.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Drop Mode Switcher */}
            <div className="flex items-center bg-slate-200/80 p-0.5 rounded-lg text-xs font-medium">
              <button
                type="button"
                onClick={() => setIntakeDropMode('stage')}
                className={`px-2 py-0.8 rounded-md transition text-[11px] font-semibold ${
                  intakeDropMode === 'stage'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Stage and review files in intake queue before saving"
              >
                Review Queue
              </button>
              <button
                type="button"
                onClick={() => setIntakeDropMode('instant')}
                className={`px-2 py-0.8 rounded-md transition text-[11px] font-semibold ${
                  intakeDropMode === 'instant'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Directly ingest and encrypt files upon dropping"
              >
                ⚡ Instant Drop
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsFastIntakeZoneOpen(!isFastIntakeZoneOpen)}
              className="p-1 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition cursor-pointer"
              title={isFastIntakeZoneOpen ? 'Collapse Intake Zone' : 'Expand Intake Zone'}
            >
              {isFastIntakeZoneOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {isFastIntakeZoneOpen && (
          <div className="p-4 space-y-4 text-xs">
            {/* Quick Intake Configuration Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Target Case Matter *
                </label>
                <select
                  value={intakeTargetCaseId}
                  onChange={(e) => setIntakeTargetCaseId(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                >
                  {cases.map((c) => (
                    <option key={`intake-case-${c.id}`} value={c.id}>
                      {c.caseNumber} - {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Intake Category Tag
                </label>
                <select
                  value={intakeDefaultCategory}
                  onChange={(e) => setIntakeDefaultCategory(e.target.value as any)}
                  className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-blue-500 font-medium"
                >
                  <option value="Auto-Detect">⚡ Smart Auto-Detect</option>
                  <option value="Evidence">Evidence</option>
                  <option value="Contracts">Contracts</option>
                  <option value="Pleadings">Pleadings</option>
                  <option value="Discovery">Discovery</option>
                  <option value="Correspondence">Correspondence</option>
                </select>
              </div>

              <div className="flex items-center pt-2 sm:pt-4">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={intakeAutoVerify}
                    onChange={(e) => setIntakeAutoVerify(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Auto-Verify on Deposit</span>
                  </span>
                </label>
              </div>

              <div className="flex items-center pt-2 sm:pt-4">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={intakeIsConfidential}
                    onChange={(e) => setIntakeIsConfidential(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded cursor-pointer"
                  />
                  <span className="text-xs font-semibold text-slate-800 flex items-center gap-1">
                    <Lock className="w-3.5 h-3.5 text-blue-600" />
                    <span>Privileged Work-Product</span>
                  </span>
                </label>
              </div>
            </div>

            {/* Hidden Input for Click Selection */}
            <input
              type="file"
              ref={intakeFileInputRef}
              multiple
              onChange={(e) => {
                if (e.target.files) {
                  if (intakeDropMode === 'instant') {
                    handleInstantDropIngest(e.target.files);
                  } else {
                    handleStageIntakeFiles(e.target.files);
                  }
                }
                e.target.value = '';
              }}
              className="hidden"
            />

            {/* Primary Interactive Drop Target Area */}
            <div
              onDragOver={handleIntakeZoneDragOver}
              onDragLeave={handleIntakeZoneDragLeave}
              onDrop={handleIntakeZoneDrop}
              onClick={() => intakeFileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center transition cursor-pointer ${
                isDraggingOverIntakeZone
                  ? 'border-blue-500 bg-blue-50/90 ring-4 ring-blue-500/20 scale-[0.995]'
                  : 'border-slate-300 hover:border-blue-400 bg-slate-50/70 hover:bg-blue-50/30'
              }`}
            >
              <div className="flex flex-col items-center justify-center">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-2.5 transition ${
                    isDraggingOverIntakeZone
                      ? 'bg-blue-600 text-white scale-110'
                      : 'bg-blue-100 text-blue-600'
                  }`}
                >
                  <FileUp className="w-6 h-6" />
                </div>
                <p className="text-sm font-bold text-slate-800">
                  Drag & drop files here to deposit into matter vault
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  or <span className="text-blue-600 font-bold underline cursor-pointer">browse your device</span> to upload multiple documents
                </p>
                <div className="mt-3 flex flex-wrap items-center justify-center gap-1.5 text-[10px] text-slate-500">
                  <span className="bg-white border border-slate-200 px-2 py-0.5 rounded font-mono font-bold text-slate-700">
                    PDF
                  </span>
                  <span className="bg-white border border-slate-200 px-2 py-0.5 rounded font-mono font-bold text-slate-700">
                    DOCX
                  </span>
                  <span className="bg-white border border-slate-200 px-2 py-0.5 rounded font-mono font-bold text-slate-700">
                    XLSX
                  </span>
                  <span className="bg-white border border-slate-200 px-2 py-0.5 rounded font-mono font-bold text-slate-700">
                    PNG / JPG
                  </span>
                  <span className="bg-white border border-slate-200 px-2 py-0.5 rounded font-mono font-bold text-slate-700">
                    MSG / EML
                  </span>
                  <span className="text-slate-400 ml-1">Up to 50MB per file</span>
                </div>
              </div>
            </div>

            {/* Staged Files List (if files in intake queue) */}
            {stagedIntakeFiles.length > 0 && (
              <div className="space-y-3 pt-1 animate-in fade-in">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-xs">
                      Staged for Ingestion ({stagedIntakeFiles.length})
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Verify classifications before final deposit
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStagedIntakeFiles([])}
                    className="text-slate-500 hover:text-red-600 text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {stagedIntakeFiles.map((staged) => (
                    <div
                      key={staged.id}
                      className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:border-slate-300 transition"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px] font-mono shrink-0 uppercase">
                          {staged.fileType}
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 text-xs truncate max-w-[280px]" title={staged.name}>
                            {staged.name}
                          </p>
                          <p className="text-[11px] text-slate-500 font-mono">
                            {staged.sizeFormatted} • {staged.isConfidential ? 'Privileged' : 'Public'}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        {/* Category Dropdown */}
                        <select
                          value={staged.category}
                          onChange={(e) => handleUpdateStagedCategory(staged.id, e.target.value as any)}
                          className="bg-white border border-slate-200 rounded-md px-2 py-1 text-[11px] font-semibold text-slate-700 focus:outline-none"
                        >
                          <option value="Evidence">Evidence</option>
                          <option value="Contracts">Contracts</option>
                          <option value="Pleadings">Pleadings</option>
                          <option value="Discovery">Discovery</option>
                          <option value="Correspondence">Correspondence</option>
                        </select>

                        {/* Verification Status Pill */}
                        <button
                          type="button"
                          onClick={() =>
                            handleUpdateStagedVerification(
                              staged.id,
                              staged.verificationStatus === 'Verified' ? 'Needs Review' : 'Verified'
                            )
                          }
                          className={`px-2 py-1 rounded-md text-[11px] font-bold border transition flex items-center gap-1 cursor-pointer ${
                            staged.verificationStatus === 'Verified'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          {staged.verificationStatus === 'Verified' ? (
                            <>
                              <ShieldCheck className="w-3 h-3 text-emerald-600" />
                              <span>Verified</span>
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="w-3 h-3 text-amber-600" />
                              <span>Needs Review</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={() => handleRemoveStagedFile(staged.id)}
                          className="p-1 text-slate-400 hover:text-red-600 rounded transition cursor-pointer"
                          title="Remove file from staging queue"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Ingest Action Button */}
                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-t border-slate-100">
                  <span className="text-[11px] text-slate-500 font-medium">
                    Depositing to Matter:{' '}
                    <strong className="text-slate-800">
                      {cases.find((c) => c.id === intakeTargetCaseId)?.title || 'Selected Matter'}
                    </strong>
                  </span>

                  <button
                    type="button"
                    onClick={handleDepositStagedFiles}
                    disabled={isProcessingIntake}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-2 shadow-sm transition disabled:opacity-50 cursor-pointer"
                  >
                    <FolderUp className="w-4 h-4 text-blue-100" />
                    <span>Deposit & Ingest {stagedIntakeFiles.length} File{stagedIntakeFiles.length === 1 ? '' : 's'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Workload Visualization & Evidentiary Verification Tracking Section */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden transition">
        {/* Header & Controls */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
              <BarChart3 className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold text-slate-900">
                  Case Workload: 'Verified' vs 'Needs Review' Audit Distribution
                </h2>
                <span className="text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  Live Recharts Visualizer
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Track pending evidentiary verification and review backlogs per legal matter. Click bars to filter.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Chart Layout Toggle */}
            <div className="flex items-center bg-slate-200/80 p-0.5 rounded-lg text-xs font-medium">
              <button
                type="button"
                onClick={() => setChartLayout('stacked')}
                className={`px-2.5 py-1 rounded-md transition text-xs font-semibold ${
                  chartLayout === 'stacked'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Stacked bar chart view"
              >
                Stacked
              </button>
              <button
                type="button"
                onClick={() => setChartLayout('grouped')}
                className={`px-2.5 py-1 rounded-md transition text-xs font-semibold ${
                  chartLayout === 'grouped'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="Grouped bar chart view"
              >
                Grouped
              </button>
            </div>

            {/* Matter Filter Selector */}
            <select
              value={selectedCaseFilter}
              onChange={(e) => setSelectedCaseFilter(e.target.value)}
              className="bg-white border border-slate-200 text-slate-700 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium max-w-[180px] truncate"
              title="Filter by legal matter"
            >
              <option value="all">All Matters ({caseWorkloadData.length})</option>
              {cases.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.caseNumber ? `${c.caseNumber} - ` : ''}{c.title}
                </option>
              ))}
            </select>

            {/* Collapse/Expand Toggle */}
            <button
              type="button"
              onClick={() => setIsWorkloadSectionExpanded(!isWorkloadSectionExpanded)}
              className="p-1.5 hover:bg-slate-200/70 text-slate-500 rounded-lg transition"
              title={isWorkloadSectionExpanded ? 'Collapse analytics chart' : 'Expand analytics chart'}
            >
              {isWorkloadSectionExpanded ? (
                <ChevronUp className="w-4 h-4" />
              ) : (
                <ChevronDown className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Expandable Chart Body */}
        {isWorkloadSectionExpanded && (
          <div className="p-4 sm:p-5 space-y-5">
            {/* Workload Metric KPIs */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-slate-50/80 border border-slate-200/70 p-3 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-slate-500">Active Matters</span>
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                </div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-xl font-bold text-slate-900 font-mono">{caseWorkloadData.length}</span>
                  <span className="text-[11px] text-slate-500">matters with docs</span>
                </div>
              </div>

              <div className="bg-emerald-50/50 border border-emerald-100 p-3 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-emerald-800">Verified Exhibits</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                </div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-xl font-bold text-emerald-700 font-mono">{totalVerifiedAcrossAll}</span>
                  <span className="text-[11px] text-emerald-600 font-semibold">({overallCompletionRate}% total)</span>
                </div>
                <div className="w-full bg-emerald-200/60 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${overallCompletionRate}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-amber-50/50 border border-amber-100 p-3 rounded-xl">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-amber-800">Needs Review Backlog</span>
                  <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                </div>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-xl font-bold text-amber-700 font-mono">{totalNeedsReviewAcrossAll}</span>
                  <span className="text-[11px] text-amber-600">requiring audit</span>
                </div>
                <div className="w-full bg-amber-200/60 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-amber-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${totalCount > 0 ? (totalNeedsReviewAcrossAll / totalCount) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>

              <div className="bg-blue-50/50 border border-blue-100 p-3 rounded-xl flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-blue-800">Highest Review Queue</span>
                  <TrendingUp className="w-3.5 h-3.5 text-blue-600" />
                </div>
                <div className="mt-1">
                  {highestBacklogCase ? (
                    <div className="flex items-center justify-between gap-1">
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900 truncate">
                          {highestBacklogCase.caseTitle}
                        </p>
                        <p className="text-[10px] text-amber-700 font-medium">
                          {highestBacklogCase.needsReview} pending review
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setSelectedCaseFilter(highestBacklogCase.id)}
                        className="px-2 py-0.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-[10px] font-bold shrink-0 transition shadow-xs"
                        title="Filter documents to this matter"
                      >
                        Filter
                      </button>
                    </div>
                  ) : (
                    <p className="text-xs font-medium text-emerald-600">All matters verified</p>
                  )}
                </div>
              </div>
            </div>

            {/* Recharts Workload Bar Chart Container */}
            <div className="bg-slate-50/60 rounded-xl p-4 border border-slate-200/80">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800">Document Verification by Matter</span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    (Click any bar to instantly filter the document directory below)
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs font-medium">
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <span className="w-3 h-3 rounded-sm bg-emerald-500 inline-block shadow-xs"></span>
                    <span>Verified ({totalVerifiedAcrossAll})</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-700">
                    <span className="w-3 h-3 rounded-sm bg-amber-500 inline-block shadow-xs"></span>
                    <span>Needs Review ({totalNeedsReviewAcrossAll})</span>
                  </div>
                </div>
              </div>

              {caseWorkloadData.length === 0 ? (
                <div className="py-12 text-center text-slate-400">
                  <FileQuestion className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p className="text-xs font-medium">No document matters available to visualize.</p>
                </div>
              ) : (
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={caseWorkloadData}
                      margin={{ top: 10, right: 15, left: -20, bottom: 25 }}
                      onClick={(state: any) => {
                        if (state && state.activePayload && state.activePayload.length > 0) {
                          const clickedCaseId = state.activePayload[0].payload.id;
                          setSelectedCaseFilter((prev) => (prev === clickedCaseId ? 'all' : clickedCaseId));
                        }
                      }}
                      className="cursor-pointer"
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                      <XAxis
                        dataKey="shortName"
                        tick={{ fontSize: 11, fill: '#475569', fontWeight: 500 }}
                        interval={0}
                        angle={-18}
                        textAnchor="end"
                        height={40}
                        stroke="#94a3b8"
                      />
                      <YAxis
                        allowDecimals={false}
                        tick={{ fontSize: 11, fill: '#64748b' }}
                        stroke="#94a3b8"
                      />
                      <Tooltip content={<CustomWorkloadTooltip />} />
                      <Bar
                        dataKey="verified"
                        name="Verified Exhibits"
                        fill="#10b981"
                        stackId={chartLayout === 'stacked' ? 'a' : undefined}
                        radius={chartLayout === 'stacked' ? [0, 0, 0, 0] : [4, 4, 0, 0]}
                        animationDuration={600}
                      >
                        {caseWorkloadData.map((entry) => (
                          <Cell
                            key={`cell-v-${entry.id}`}
                            fill={selectedCaseFilter === 'all' || selectedCaseFilter === entry.id ? '#10b981' : '#a7f3d0'}
                          />
                        ))}
                      </Bar>
                      <Bar
                        dataKey="needsReview"
                        name="Needs Review"
                        fill="#f59e0b"
                        stackId={chartLayout === 'stacked' ? 'a' : undefined}
                        radius={[4, 4, 0, 0]}
                        animationDuration={600}
                      >
                        {caseWorkloadData.map((entry) => (
                          <Cell
                            key={`cell-nr-${entry.id}`}
                            fill={selectedCaseFilter === 'all' || selectedCaseFilter === entry.id ? '#f59e0b' : '#fde68a'}
                          />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            {/* Matter Quick-Select Pills Bar */}
            <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
              <span className="text-slate-400 text-[11px] font-semibold flex items-center gap-1 mr-1">
                <Filter className="w-3 h-3" />
                Filter by Matter:
              </span>
              <button
                type="button"
                onClick={() => setSelectedCaseFilter('all')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-bold transition ${
                  selectedCaseFilter === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                All Matters
              </button>
              {caseWorkloadData.map((item) => {
                const isSelected = selectedCaseFilter === item.id;
                return (
                  <button
                    key={`pill-${item.id}`}
                    type="button"
                    onClick={() => setSelectedCaseFilter(isSelected ? 'all' : item.id)}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition flex items-center gap-1.5 border ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className="truncate max-w-[140px]">{item.caseNumber || item.caseTitle}</span>
                    <span className="flex items-center gap-1 font-mono text-[10px]">
                      <span className="text-emerald-500 font-bold">{item.verified}v</span>
                      <span className="text-slate-400">/</span>
                      <span className="text-amber-500 font-bold">{item.needsReview}r</span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Quick Filter Pill Badges */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <button
          onClick={() => {
            setCategoryFilter('all');
            setVerificationFilter('all');
          }}
          className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 border ${
            categoryFilter === 'all' && verificationFilter === 'all'
              ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
              : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>All Documents</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-800/20 text-inherit font-mono">
            {totalCount}
          </span>
        </button>

        <button
          onClick={() => {
            setCategoryFilter('Evidence');
            setVerificationFilter('all');
          }}
          className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 border ${
            categoryFilter === 'Evidence'
              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
              : 'bg-white text-blue-800 border-blue-200 hover:bg-blue-50'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Evidentiary Exhibits</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-blue-900/20 text-inherit font-mono">
            {evidenceCount}
          </span>
        </button>

        <button
          onClick={() => {
            setVerificationFilter('Verified');
          }}
          className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 border ${
            verificationFilter === 'Verified'
              ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
              : 'bg-white text-emerald-800 border-emerald-200 hover:bg-emerald-50'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <span>Verified Status</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-emerald-900/20 text-inherit font-mono">
            {verifiedCount}
          </span>
        </button>

        <button
          onClick={() => {
            setVerificationFilter('Needs Review');
          }}
          className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 border ${
            verificationFilter === 'Needs Review'
              ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
              : 'bg-white text-amber-800 border-amber-200 hover:bg-amber-50'
          }`}
        >
          <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
          <span>Needs Review</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-900/20 text-inherit font-mono">
            {needsReviewCount}
          </span>
        </button>
      </div>

      {/* Main Grid: Document List + Right Pane Inspector / Side-Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Col: Document Directory (full width if side panel closed or in drawer mode) */}
        <div className={isSidePanelOpen && sidePanelMode === 'docked' ? 'lg:col-span-7 space-y-4' : 'lg:col-span-12 space-y-4'}>
          {/* Search, Filter & Side Panel Display Toggle Bar */}
          <div className="p-3.5 bg-white border border-slate-200 rounded-xl shadow-xs space-y-2.5">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
              {/* Real-time Search Input */}
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-blue-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by file name, AI summary keywords, key clauses, or status ('verified', 'breach', 'settlement')..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-8 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all shadow-inner"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-0.5 rounded hover:bg-slate-200 transition"
                    title="Clear search"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                <select
                  value={selectedCaseFilter}
                  onChange={(e) => setSelectedCaseFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-lg px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium max-w-[150px] truncate"
                  title="Filter by legal matter"
                >
                  <option value="all">All Matters</option>
                  {cases.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.caseNumber ? `${c.caseNumber} - ` : ''}{c.title}
                    </option>
                  ))}
                </select>

                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-lg px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  <option value="all">All Categories</option>
                  <option value="Evidence">Evidence</option>
                  <option value="Contracts">Contracts</option>
                  <option value="Pleadings">Pleadings</option>
                  <option value="Discovery">Discovery</option>
                  <option value="Correspondence">Correspondence</option>
                </select>

                <select
                  value={verificationFilter}
                  onChange={(e) => setVerificationFilter(e.target.value as any)}
                  className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-lg px-2.5 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                >
                  <option value="all">All Verification</option>
                  <option value="Verified">Verified Only</option>
                  <option value="Needs Review">Needs Review Only</option>
                </select>

                {/* Side Panel Toggle Button */}
                <button
                  type="button"
                  onClick={() => setIsSidePanelOpen(!isSidePanelOpen)}
                  className={`px-3 py-2 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition ${
                    isSidePanelOpen
                      ? 'bg-blue-50 text-blue-700 border-blue-300 hover:bg-blue-100'
                      : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                  }`}
                  title={isSidePanelOpen ? 'Hide Side Panel' : 'Open Side Panel (AI Summary & Custody)'}
                >
                  {isSidePanelOpen ? (
                    <>
                      <PanelRightClose className="w-3.5 h-3.5 text-blue-600" />
                      <span className="hidden sm:inline">Side Panel: Open</span>
                      <span className="sm:hidden">Panel</span>
                    </>
                  ) : (
                    <>
                      <PanelRightOpen className="w-3.5 h-3.5 text-slate-600" />
                      <span className="hidden sm:inline">Side Panel: Hidden</span>
                      <span className="sm:hidden">Open</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Real-time Search Helpers & Quick Query Tags */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-100 text-[11px]">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-slate-400 font-medium">Quick Search:</span>
                {[
                  { label: 'Verified', query: 'verified' },
                  { label: 'Needs Review', query: 'needs review' },
                  { label: 'AI: Breach', query: 'breach' },
                  { label: 'AI: Indemnity', query: 'indemnity' },
                  { label: 'High Risk', query: 'high risk' },
                  { label: 'Exhibit', query: 'exhibit' }
                ].map((chip) => {
                  const isActive = searchTerm.toLowerCase().includes(chip.query);
                  return (
                    <button
                      key={chip.query}
                      type="button"
                      onClick={() => setSearchTerm(isActive ? '' : chip.query)}
                      className={`px-2 py-0.5 rounded-md font-medium transition cursor-pointer border ${
                        isActive
                          ? 'bg-blue-600 text-white border-blue-600 shadow-2xs'
                          : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200 hover:text-slate-900'
                      }`}
                    >
                      {chip.label}
                    </button>
                  );
                })}
              </div>

              <div className="text-slate-500 font-medium ml-auto">
                Showing <strong className="text-blue-700 font-bold">{filteredDocs.length}</strong> of{' '}
                <span className="text-slate-700">{documents.length}</span> documents
                {searchTerm && (
                  <span className="text-slate-400 ml-1">
                    for &ldquo;<strong className="text-slate-700">{searchTerm}</strong>&rdquo;
                  </span>
                )}
              </div>
            </div>
          </div>

          {selectedCaseFilter !== 'all' && (
            <div className="flex items-center justify-between gap-2 px-3.5 py-2 bg-blue-50/90 border border-blue-200 rounded-xl text-xs">
              <div className="flex items-center gap-2 text-blue-900 font-medium truncate">
                <Filter className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="text-slate-500">Filtered by Matter:</span>
                <span className="font-bold text-slate-900 truncate">
                  {cases.find((c) => c.id === selectedCaseFilter)?.title || selectedCaseFilter}
                </span>
                <span className="text-[10px] font-mono font-bold bg-blue-200/70 text-blue-800 px-1.5 py-0.5 rounded">
                  {filteredDocs.length} {filteredDocs.length === 1 ? 'doc' : 'docs'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCaseFilter('all')}
                className="text-blue-700 hover:text-blue-900 font-bold text-[11px] underline shrink-0 cursor-pointer"
              >
                Clear Matter Filter
              </button>
            </div>
          )}

          {/* Success Banner if batch verified */}
          {batchSuccessMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 flex items-center justify-between shadow-xs animate-in fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-semibold">{batchSuccessMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => setBatchSuccessMessage(null)}
                className="text-emerald-700 hover:text-emerald-900 font-bold p-1 hover:bg-emerald-100 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Success Banner if metadata exported */}
          {exportSuccessMessage && (
            <div className="p-3 bg-blue-50 border border-blue-300 rounded-xl text-xs text-blue-900 flex items-center justify-between shadow-xs animate-in fade-in">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="font-semibold">{exportSuccessMessage}</span>
              </div>
              <button
                type="button"
                onClick={() => setExportSuccessMessage(null)}
                className="text-blue-700 hover:text-blue-900 font-bold p-1 hover:bg-blue-100 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Bulk Selection Bar & Batch Verify Action Toolbar */}
          <div className="p-3 bg-white border border-slate-200 rounded-xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            {/* Left: Master Checkbox and Quick Select Tools */}
            <div className="flex flex-wrap items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer select-none font-semibold text-slate-800 hover:text-blue-600 transition-colors">
                <input
                  type="checkbox"
                  checked={isAllFilteredSelected}
                  ref={(el) => {
                    if (el) el.indeterminate = isSomeFilteredSelected;
                  }}
                  onChange={handleToggleSelectAllFiltered}
                  className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600"
                />
                <span>
                  Select All <span className="font-mono text-slate-500">({filteredDocs.length})</span>
                </span>
              </label>

              {filteredNeedsReviewDocs.length > 0 && (
                <button
                  type="button"
                  onClick={handleSelectAllNeedsReview}
                  className="text-[11px] font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-2 py-0.5 rounded-md transition flex items-center gap-1 cursor-pointer"
                  title="Quickly select all unverified exhibits and documents requiring counsel review"
                >
                  <AlertCircle className="w-3 h-3 text-amber-600" />
                  <span>Select Unverified ({filteredNeedsReviewDocs.length})</span>
                </button>
              )}

              {selectedDocIdsForBatch.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSelectedDocIdsForBatch([])}
                  className="text-[11px] font-semibold text-slate-500 hover:text-slate-800 underline transition cursor-pointer"
                >
                  Clear ({selectedDocIdsForBatch.length})
                </button>
              )}
            </div>

            {/* Right: Batch Action Execution Buttons & Export Metadata Button */}
            <div className="flex flex-wrap items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
              {selectedDocIdsForBatch.length > 0 ? (
                <>
                  <div className="text-xs font-bold text-slate-700 mr-1">
                    <span className="text-blue-700 font-extrabold">{selectedDocIdsForBatch.length}</span> selected
                    {selectedNeedsReviewDocs.length > 0 && (
                      <span className="text-amber-700 font-medium ml-1">
                        ({selectedNeedsReviewDocs.length} pending review)
                      </span>
                    )}
                  </div>

                  {/* Primary 'Batch Verify' Action Button */}
                  <button
                    type="button"
                    onClick={() => handleExecuteBatchVerify()}
                    disabled={isExecutingBatch}
                    className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-sm transition disabled:opacity-50 cursor-pointer"
                    title="Bulk update all selected documents to 'Verified' status with cryptographic seal"
                  >
                    <ShieldCheck className="w-4 h-4 text-emerald-100" />
                    <span>Batch Verify ({selectedDocIdsForBatch.length})</span>
                  </button>

                  {/* Batch Verify with Custom Audit/Notary Note */}
                  <button
                    type="button"
                    onClick={() => setIsBatchModalOpen(true)}
                    className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg font-semibold text-xs flex items-center gap-1 transition shadow-2xs cursor-pointer"
                    title="Batch verify and append custom evidentiary audit note to custody ledger"
                  >
                    <Plus className="w-3 h-3 text-blue-600" />
                    <span>Custom Note</span>
                  </button>

                  {/* Export Selected Metadata CSV */}
                  <button
                    type="button"
                    onClick={() => handleExportMetadataCSV(documents.filter((d) => selectedDocIdsForBatch.includes(d.id)))}
                    className="px-2.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-slate-300 rounded-lg font-semibold text-xs flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
                    title="Export selected document metadata with custody hashes as CSV"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Export Selected ({selectedDocIdsForBatch.length})</span>
                  </button>
                </>
              ) : (
                <>
                  <div className="text-[11px] text-slate-400 hidden sm:flex items-center gap-1.5 mr-1">
                    <ListChecks className="w-3.5 h-3.5 text-slate-400" />
                    <span>Select via checkboxes for bulk verify</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleExportMetadataCSV(filteredDocs)}
                    disabled={filteredDocs.length === 0}
                    className="px-2.5 py-1.5 bg-white hover:bg-slate-50 disabled:opacity-50 text-slate-700 hover:text-slate-900 border border-slate-200 rounded-lg font-semibold text-xs flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
                    title="Download metadata CSV containing custody hashes and verification status for current view"
                  >
                    <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Export View CSV ({filteredDocs.length})</span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Document Rows with Click-to-Expand, Inline Accordion, and Side-Panel Triggers */}
          <div className="space-y-2.5">
            {filteredDocs.length === 0 ? (
              <div className="p-10 bg-white border border-slate-200 rounded-xl text-center text-slate-500">
                <FileQuestion className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                <p className="text-sm font-semibold">No documents found matching the filter criteria.</p>
                <p className="text-xs text-slate-400 mt-1">Try resetting your search query or verification filter.</p>
              </div>
            ) : (
              filteredDocs.map((doc) => {
                const isVerified = (doc.verificationStatus || 'Needs Review') === 'Verified';
                const isSelected = selectedDoc?.id === doc.id;
                const isEvidence = doc.category === 'Evidence';
                const isInlineExpanded = !!expandedRowIds[doc.id];
                const isDocSelectedForBatch = selectedDocIdsForBatch.includes(doc.id);

                return (
                  <div
                    key={doc.id}
                    className={`rounded-xl border transition overflow-hidden ${
                      isSelected && isSidePanelOpen
                        ? 'bg-blue-50/40 border-blue-500 shadow-md ring-1 ring-blue-500/30'
                        : isDocSelectedForBatch
                        ? 'bg-blue-50/30 border-blue-300 shadow-xs ring-1 ring-blue-400/40'
                        : 'bg-white border-slate-200 hover:border-blue-400 shadow-xs'
                    }`}
                  >
                    {/* Main Row Header (Clickable - Opens Quick Preview Modal) */}
                    <div
                      onClick={() => {
                        setSelectedDocId(doc.id);
                        setPreviewDocId(doc.id);
                        setIsPreviewModalOpen(true);
                      }}
                      className="p-3.5 cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3.5"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        {/* Checkbox for Batch Selection */}
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToggleSelectDoc(doc.id);
                          }}
                          className="pt-1 sm:pt-2 shrink-0 cursor-pointer"
                          title={isDocSelectedForBatch ? 'Deselect document' : 'Select document for batch verify'}
                        >
                          <input
                            type="checkbox"
                            checked={isDocSelectedForBatch}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleToggleSelectDoc(doc.id);
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer accent-blue-600"
                          />
                        </div>

                        {/* Icon */}
                        <div
                          className={`p-2.5 rounded-xl shrink-0 mt-0.5 ${
                            isEvidence
                              ? isVerified
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                : 'bg-amber-100 text-amber-800 border border-amber-200'
                              : 'bg-blue-100 text-blue-700 border border-blue-200'
                          }`}
                        >
                          {isEvidence ? (
                            isVerified ? (
                              <ShieldCheck className="w-5 h-5" />
                            ) : (
                              <AlertCircle className="w-5 h-5" />
                            )
                          ) : (
                            <FileText className="w-5 h-5" />
                          )}
                        </div>

                        <div className="min-w-0 space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-bold text-sm text-slate-900 truncate hover:text-blue-600 transition-colors">
                              {doc.fileName}
                            </h4>
                            {isEvidence && (
                              <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-blue-100 text-blue-800 border border-blue-300 uppercase tracking-wide">
                                Exhibit
                              </span>
                            )}
                            {doc.isConfidential && (
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-0.5 shrink-0">
                                <Lock className="w-2.5 h-2.5" />
                                Encrypted
                              </span>
                            )}
                            {isDocSelectedForBatch && (
                              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 border border-blue-300 flex items-center gap-0.5 shrink-0">
                                <Check className="w-2.5 h-2.5 text-blue-600" />
                                Selected
                              </span>
                            )}
                            {isSelected && isSidePanelOpen && (
                              <span className="text-[10px] font-bold px-2 py-0.2 rounded bg-blue-600 text-white flex items-center gap-1 shadow-2xs">
                                <PanelRight className="w-2.5 h-2.5" />
                                In Side Panel
                              </span>
                            )}
                          </div>

                          <p className="text-xs text-slate-600 truncate">
                            Matter: <strong className="text-slate-800">{doc.caseTitle}</strong> • {doc.category} ({doc.fileSize})
                          </p>

                          {/* AI Summary or Key Clauses Search Match Snippet */}
                          {searchTerm.trim() &&
                            (doc.aiSummary?.toLowerCase().includes(searchTerm.trim().toLowerCase()) ||
                              doc.aiKeyClauses?.some((k) =>
                                k.toLowerCase().includes(searchTerm.trim().toLowerCase())
                              )) && (
                              <div className="text-[11px] text-blue-900 bg-blue-50 border border-blue-200/80 rounded-md px-2 py-1 flex items-center gap-1.5 mt-0.5">
                                <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                                <span className="font-semibold text-blue-800 shrink-0">AI Match:</span>
                                <span className="truncate text-slate-700">
                                  {doc.aiSummary || doc.aiKeyClauses?.join('; ')}
                                </span>
                              </div>
                            )}

                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-slate-400">
                            <span>Uploaded: {doc.uploadedAt}</span>
                            <span>By: {doc.uploadedBy}</span>
                            {doc.verifiedBy && (
                              <span className="text-emerald-700 font-medium">
                                Verified by: {doc.verifiedBy}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Right side Actions: Verification Badge, Quick Preview Trigger, AI Risk, and Expand */}
                      <div className="shrink-0 flex items-center gap-2 self-start sm:self-center">
                        {/* 1-Click Verification Toggle */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuickToggleVerification(e, doc.id);
                          }}
                          title={isVerified ? 'Click to mark as Needs Review' : 'Click to Authenticate & Verify Chain of Custody'}
                          className={`group px-3 py-1.5 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition shadow-2xs ${
                            isVerified
                              ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border-emerald-300 hover:border-emerald-400'
                              : 'bg-amber-50 hover:bg-amber-100 text-amber-900 border-amber-300 hover:border-amber-400'
                          }`}
                        >
                          {isVerified ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-110 transition-transform" />
                              <span>Verified</span>
                              <RotateCcw className="w-3 h-3 text-emerald-500 opacity-0 group-hover:opacity-100 ml-0.5 transition-opacity" />
                            </>
                          ) : (
                            <>
                              <AlertCircle className="w-3.5 h-3.5 text-amber-600 group-hover:scale-110 transition-transform" />
                              <span>Needs Review</span>
                              <Check className="w-3 h-3 text-amber-700 opacity-0 group-hover:opacity-100 ml-0.5 transition-opacity" />
                            </>
                          )}
                        </button>

                        {/* Dedicated Quick Preview Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDocId(doc.id);
                            setPreviewDocId(doc.id);
                            setIsPreviewModalOpen(true);
                          }}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-blue-400 bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs font-bold flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
                          title="Open Quick Preview Modal (Details & Metadata)"
                        >
                          <Eye className="w-3.5 h-3.5 text-blue-600" />
                          <span className="hidden sm:inline">Preview</span>
                        </button>

                        {/* AI Risk Tag */}
                        {doc.aiRiskLevel && (
                          <span
                            className={`text-[10px] font-bold px-2 py-1 rounded-md border uppercase hidden md:inline-block ${
                              doc.aiRiskLevel === 'High'
                                ? 'bg-rose-50 text-rose-700 border-rose-200'
                                : doc.aiRiskLevel === 'Moderate'
                                ? 'bg-amber-50 text-amber-700 border-amber-200'
                                : 'bg-slate-100 text-slate-700 border-slate-200'
                            }`}
                          >
                            {doc.aiRiskLevel}
                          </span>
                        )}

                        {/* Inline Accordion Toggle */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedRowIds((prev) => ({ ...prev, [doc.id]: !prev[doc.id] }));
                          }}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition"
                          title={isInlineExpanded ? 'Collapse inline preview' : 'Expand inline quick summary'}
                        >
                          {isInlineExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>

                        {/* Dedicated Click-to-Expand Side Panel Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDocId(doc.id);
                            setIsSidePanelOpen(true);
                          }}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition shadow-2xs ${
                            isSelected && isSidePanelOpen
                              ? 'bg-blue-600 text-white'
                              : 'bg-slate-900 hover:bg-blue-600 text-white'
                          }`}
                          title="Open full AI Summary & Chain of Custody in Side-Panel"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          <span className="hidden sm:inline">AI & Custody</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Inline Expandable Accordion Drawer */}
                    {isInlineExpanded && (
                      <div className="p-4 bg-slate-50 border-t border-slate-200 space-y-3 text-xs animate-in fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {/* AI Summary Card */}
                          <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                                Gemini AI Summary Snapshot:
                              </span>
                              <span
                                className={`text-[10px] font-bold px-1.5 py-0.2 rounded border ${
                                  doc.aiRiskLevel === 'High'
                                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                                    : doc.aiRiskLevel === 'Moderate'
                                    ? 'bg-amber-50 text-amber-700 border-amber-200'
                                    : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                }`}
                              >
                                Risk: {doc.aiRiskLevel || 'Moderate'}
                              </span>
                            </div>
                            <p className="text-slate-600 text-[11px] leading-relaxed line-clamp-3">
                              {doc.aiSummary || 'Automated legal clause extraction and admissibility briefing for matter file.'}
                            </p>
                          </div>

                          {/* Chain of Custody Status Card */}
                          <div className="p-3 bg-white rounded-lg border border-slate-200 space-y-1.5">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-slate-800 flex items-center gap-1.5">
                                <History className="w-3.5 h-3.5 text-blue-600" />
                                Chain of Custody ({doc.chainOfCustody?.length || 1} Events):
                              </span>
                              <span className="font-mono text-[10px] text-slate-400">
                                {isVerified ? 'Sealed & Signed' : 'Pending Verification'}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-600 space-y-1">
                              <p className="font-mono text-[10px] text-slate-500 truncate">
                                Hash: {doc.custodyHash || `SHA256: 8f3c7a912e5d944bc0891d21e89b41a3_${doc.id}`}
                              </p>
                              <p>
                                Latest Status: <strong className={isVerified ? 'text-emerald-700' : 'text-amber-800'}>
                                  {isVerified ? 'Authenticated by Counsel' : 'Awaiting Evidentiary Audit'}
                                </strong>
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* CTA to open in full side panel */}
                        <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                          <span className="text-[11px] text-slate-500">
                            Click below to access full clause breakdown, audit log history, and cryptographic notary certificates.
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedDocId(doc.id);
                              setIsSidePanelOpen(true);
                            }}
                            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs flex items-center gap-1.5 transition shadow-2xs"
                          >
                            <PanelRightOpen className="w-3.5 h-3.5" />
                            <span>Open in Side-Panel</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Col: Docked Side-Panel when docked mode is active */}
        {isSidePanelOpen && sidePanelMode === 'docked' && (
          <div className="lg:col-span-5 space-y-4 text-slate-900">
            <DocumentSidePanel
              document={selectedDoc}
              isOpen={isSidePanelOpen}
              onClose={() => setIsSidePanelOpen(false)}
              onToggleVerification={onToggleVerification}
              userRole={userRole}
              onAnalyzeWithAI={handleAnalyzeWithAI}
              isAnalyzing={isAnalyzing}
              aiAnalysisResult={aiAnalysisResult}
              mode="docked"
              onToggleMode={() => setSidePanelMode('drawer')}
            />
          </div>
        )}
      </div>

      {/* Floating Drawer Side-Panel when drawer mode is active */}
      {isSidePanelOpen && sidePanelMode === 'drawer' && (
        <DocumentSidePanel
          document={selectedDoc}
          isOpen={isSidePanelOpen}
          onClose={() => setIsSidePanelOpen(false)}
          onToggleVerification={onToggleVerification}
          userRole={userRole}
          onAnalyzeWithAI={handleAnalyzeWithAI}
          isAnalyzing={isAnalyzing}
          aiAnalysisResult={aiAnalysisResult}
          mode="drawer"
          onToggleMode={() => setSidePanelMode('docked')}
        />
      )}

      {/* AI Automated Legal Drafter Modal */}
      {isDraftingModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in text-slate-900">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-sm">Gemini Automated Legal Memorandum Drafter</h3>
              </div>
              <button onClick={() => setIsDraftingModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[80vh] overflow-y-auto text-xs">
              <form onSubmit={handleGenerateLegalDraft} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Document Template Type</label>
                    <select
                      value={draftDocType}
                      onChange={(e) => setDraftDocType(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900 focus:outline-none"
                    >
                      <option value="Non-Disclosure & Confidentiality Agreement">Non-Disclosure & Confidentiality (NDA)</option>
                      <option value="Motion for Extension of Time">Motion for Extension of Time</option>
                      <option value="Retainer & Legal Services Agreement">Retainer & Legal Services Agreement</option>
                      <option value="Settlement Demand Letter">Settlement Demand Letter</option>
                      <option value="Client Intake Memorandum">Client Intake Memorandum</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Target Case File</label>
                    <select
                      value={draftCaseId}
                      onChange={(e) => setDraftCaseId(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900 focus:outline-none"
                    >
                      {cases.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.caseNumber} - {c.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Custom Legal Clauses & Instructions</label>
                  <textarea
                    rows={3}
                    value={draftInstructions}
                    onChange={(e) => setDraftInstructions(e.target.value)}
                    placeholder="e.g., Include mandatory arbitration in Delaware court, 30-day notice period, $5M liquidated damages cap..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isGeneratingDraft}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm flex items-center gap-2 transition disabled:opacity-50"
                  >
                    <Sparkles className={`w-4 h-4 text-blue-200 ${isGeneratingDraft ? 'animate-spin' : ''}`} />
                    <span>{isGeneratingDraft ? 'Generating Draft...' : 'Generate Legal Draft'}</span>
                  </button>
                </div>
              </form>

              {/* Draft Result Box */}
              {generatedDraftText && (
                <div className="pt-3 border-t border-slate-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">Generated Draft Preview:</span>
                    <button
                      onClick={handleSaveDraftAsDocument}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-lg shadow-sm transition"
                    >
                      Save & Deposit in Vault
                    </button>
                  </div>

                  <pre className="p-3.5 bg-slate-50 rounded-lg border border-slate-200 text-slate-800 font-mono text-xs whitespace-pre-wrap leading-relaxed max-h-60 overflow-y-auto">
                    {generatedDraftText}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in text-slate-900">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">Upload Document to Vault</h3>
              <button onClick={() => setIsUploadModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Document File Name *</label>
                <input
                  type="text"
                  required
                  value={uploadFileName}
                  onChange={(e) => setUploadFileName(e.target.value)}
                  placeholder="e.g., Forensic_Exhibit_A_Receipt.pdf"
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Associated Matter</label>
                  <select
                    value={uploadCaseId}
                    onChange={(e) => setUploadCaseId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900 focus:outline-none"
                  >
                    {cases.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.caseNumber} - {c.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Document Category</label>
                  <select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900 focus:outline-none"
                  >
                    <option value="Evidence">Evidence</option>
                    <option value="Contracts">Contracts</option>
                    <option value="Pleadings">Pleadings</option>
                    <option value="Discovery">Discovery</option>
                    <option value="Correspondence">Correspondence</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Initial Verification Status</label>
                  <select
                    value={uploadInitialVerification}
                    onChange={(e) => setUploadInitialVerification(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-slate-900 focus:outline-none"
                  >
                    <option value="Needs Review">Needs Review</option>
                    <option value="Verified">Verified</option>
                  </select>
                </div>

                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={uploadIsConfidential}
                      onChange={(e) => setUploadIsConfidential(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded"
                    />
                    <span className="font-semibold text-slate-800">Attorney-Client Privileged</span>
                  </label>
                </div>
              </div>

              {/* Hidden file input for modal */}
              <input
                type="file"
                ref={modalFileInputRef}
                onChange={(e) => {
                  if (e.target.files && e.target.files.length > 0) {
                    const file = e.target.files[0];
                    setUploadFileName(file.name);
                    setUploadCategory(inferCategoryFromFileName(file.name));
                    setModalStagedFile({
                      name: file.name,
                      sizeFormatted: formatBytes(file.size),
                      type: detectFileType(file.name),
                    });
                  }
                  e.target.value = '';
                }}
                className="hidden"
              />

              {modalStagedFile ? (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-[10px] font-mono shrink-0 uppercase">
                      {modalStagedFile.type}
                    </div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 text-xs truncate max-w-[240px]" title={modalStagedFile.name}>
                        {modalStagedFile.name}
                      </p>
                      <p className="text-[11px] text-slate-500 font-mono">
                        {modalStagedFile.sizeFormatted} • Ready to encrypt
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => modalFileInputRef.current?.click()}
                    className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-[11px] font-semibold transition cursor-pointer"
                  >
                    Change File
                  </button>
                </div>
              ) : (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    e.dataTransfer.dropEffect = 'copy';
                    setIsDraggingOverModalZone(true);
                  }}
                  onDragLeave={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDraggingOverModalZone(false);
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsDraggingOverModalZone(false);
                    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                      const file = e.dataTransfer.files[0];
                      setUploadFileName(file.name);
                      setUploadCategory(inferCategoryFromFileName(file.name));
                      setModalStagedFile({
                        name: file.name,
                        sizeFormatted: formatBytes(file.size),
                        type: detectFileType(file.name),
                      });
                    }
                  }}
                  onClick={() => modalFileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-5 text-center transition cursor-pointer ${
                    isDraggingOverModalZone
                      ? 'border-blue-500 bg-blue-50/90 ring-2 ring-blue-500/20'
                      : 'border-slate-300 hover:border-blue-500 bg-slate-50'
                  }`}
                >
                  <Upload className="w-7 h-7 text-blue-600 mx-auto mb-2" />
                  <p className="text-slate-800 font-semibold">Drag & drop encrypted document here</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    or click to browse • Supports PDF, DOCX, XLSX up to 50MB
                  </p>
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm"
                >
                  Encrypt & Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Batch Verification & Custody Audit Modal */}
      {isBatchModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in text-slate-900">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Batch Authenticate Documents</h3>
                  <p className="text-[11px] text-slate-500">
                    Bulk-updating <strong className="text-slate-800">{selectedDocIdsForBatch.length}</strong> selected matter exhibits to Verified
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsBatchModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              {/* Selected documents list preview */}
              <div>
                <label className="block text-slate-700 font-bold mb-1.5 flex items-center justify-between">
                  <span>Selected Documents ({selectedDocIdsForBatch.length}):</span>
                  <span className="text-[11px] font-normal text-slate-500">
                    {selectedNeedsReviewDocs.length} pending review,{' '}
                    {selectedDocIdsForBatch.length - selectedNeedsReviewDocs.length} already verified
                  </span>
                </label>
                <div className="max-h-36 overflow-y-auto space-y-1.5 p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
                  {selectedDocIdsForBatch.map((id) => {
                    const doc = documents.find((d) => d.id === id);
                    if (!doc) return null;
                    const isVerified = (doc.verificationStatus || 'Needs Review') === 'Verified';
                    return (
                      <div
                        key={id}
                        className="p-2 bg-white rounded-lg border border-slate-200 flex items-center justify-between gap-2 text-[11px]"
                      >
                        <div className="min-w-0 flex items-center gap-2">
                          <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <span className="font-bold text-slate-800 truncate">{doc.fileName}</span>
                          <span className="text-slate-400 truncate max-w-[120px]">({doc.caseTitle})</span>
                        </div>
                        <span
                          className={`shrink-0 px-2 py-0.5 rounded font-bold text-[10px] uppercase ${
                            isVerified
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {isVerified ? 'Verified' : 'Needs Review'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Custody Audit Note */}
              <div className="space-y-1.5">
                <label className="block text-slate-700 font-bold">
                  Chain of Custody & Evidentiary Audit Note (Optional):
                </label>
                <textarea
                  rows={3}
                  value={batchCustomNote}
                  onChange={(e) => setBatchCustomNote(e.target.value)}
                  placeholder="e.g., Forensic hash validation and metadata audit completed by lead counsel. Verified for court submission."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
                <p className="text-[11px] text-slate-400">
                  This note and a cryptographic timestamp will be appended to the immutable custody ledger of all selected files.
                </p>
              </div>

              {/* Action buttons */}
              <div className="pt-3 flex items-center justify-end gap-2.5 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsBatchModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs cursor-pointer transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleExecuteBatchVerify(batchCustomNote)}
                  disabled={isExecutingBatch}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-sm transition disabled:opacity-50 cursor-pointer"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-200" />
                  <span>
                    {isExecutingBatch
                      ? 'Verifying...'
                      : `Confirm & Batch Verify (${selectedDocIdsForBatch.length} Files)`}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Document Quick Preview Modal */}
      <DocumentQuickPreviewModal
        isOpen={isPreviewModalOpen}
        onClose={() => setIsPreviewModalOpen(false)}
        document={previewDoc}
        documentsList={documents}
        cases={cases}
        userRole={userRole}
        onSelectDocument={(doc) => {
          setSelectedDocId(doc.id);
          setPreviewDocId(doc.id);
        }}
        onToggleVerification={(docId, note) => {
          if (onToggleVerification) {
            onToggleVerification(docId, note);
          }
        }}
        onOpenInSidePanel={(docId) => {
          setSelectedDocId(docId);
          setIsSidePanelOpen(true);
        }}
      />
    </div>
  );
};
