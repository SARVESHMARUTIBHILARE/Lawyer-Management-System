import React, { useState, useMemo, useEffect } from 'react';
import {
  FileText,
  Sparkles,
  Lock,
  Download,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  RotateCcw,
  History,
  Eye,
  X,
  Bot,
  Check,
  Copy,
  ExternalLink,
  Shield,
  Clock,
  Calendar,
  ChevronRight,
  ChevronLeft,
  Scale,
  Maximize2,
  Minimize2,
  Printer,
  Search,
  Key,
  Info,
  Layers,
  ZoomIn,
  ZoomOut,
  FileCheck,
  Plus,
  ArrowRight,
  Activity,
  Milestone
} from 'lucide-react';
import { ClientDocument, CaseFile, UserRole, DocumentCustodyEvent } from '../types';
import { EvidenceBuildingTimeline } from './EvidenceBuildingTimeline';
import { exportDocumentCustodyAuditPDF } from '../utils/pdfExport';

interface DocumentQuickPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  document: ClientDocument | null;
  documentsList?: ClientDocument[];
  cases?: CaseFile[];
  userRole?: UserRole;
  onSelectDocument?: (doc: ClientDocument) => void;
  onToggleVerification?: (docId: string, customNote?: string) => void;
  onOpenInSidePanel?: (docId: string) => void;
}

export const DocumentQuickPreviewModal: React.FC<DocumentQuickPreviewModalProps> = ({
  isOpen,
  onClose,
  document,
  documentsList = [],
  cases = [],
  userRole = 'partner',
  onSelectDocument,
  onToggleVerification,
  onOpenInSidePanel
}) => {
  const [activeTab, setActiveTab] = useState<'content' | 'timeline' | 'ai_analysis' | 'custody' | 'metadata'>('content');
  const [copiedHash, setCopiedHash] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg'>('base');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddingCustodyNote, setIsAddingCustodyNote] = useState(false);
  const [customCustodyNote, setCustomCustodyNote] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [actionNotification, setActionNotification] = useState<string | null>(null);
  const [isExportingPdf, setIsExportingPdf] = useState(false);

  // Close modal on ESC key and navigate with arrow keys
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Stepper navigation in documents list
  const currentIndex = useMemo(() => {
    if (!document || documentsList.length === 0) return -1;
    return documentsList.findIndex((d) => d.id === document.id);
  }, [document, documentsList]);

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex >= 0 && currentIndex < documentsList.length - 1;

  const handlePrev = () => {
    if (hasPrev && onSelectDocument) {
      onSelectDocument(documentsList[currentIndex - 1]);
    }
  };

  const handleNext = () => {
    if (hasNext && onSelectDocument) {
      onSelectDocument(documentsList[currentIndex + 1]);
    }
  };

  if (!isOpen || !document) return null;

  const isVerified = (document.verificationStatus || 'Needs Review') === 'Verified';
  const isEvidence = document.category === 'Evidence';

  const matchedCase = cases.find((c) => c.id === document.caseId);

  // Case documents for case evidence timeline count
  const caseDocuments = useMemo(() => {
    const list = documentsList.length > 0 ? documentsList : [document];
    const filtered = list.filter((doc) => doc.caseId === document.caseId);
    return filtered.length > 0 ? filtered : [document];
  }, [documentsList, document]);

  // AI Summary and Clauses
  const currentSummary =
    document.aiSummary ||
    'Executive legal evaluation of submitted matter exhibits, contractual provisions, and evidentiary admissibility standards under federal and local court rules.';

  const currentClauses: string[] = document.aiKeyClauses && document.aiKeyClauses.length > 0
    ? document.aiKeyClauses
    : [
        'Indemnification & Hold-Harmless covenants governed by Section 12.',
        'Mandatory pre-litigation binding mediation in Delaware jurisdiction.',
        'Liquidated damages limitation capped at aggregate fee disbursements.',
        'Evidentiary chain-of-custody digital notary attestation clause.'
      ];

  const currentRisk = document.aiRiskLevel || (isVerified ? 'Low' : 'Moderate');

  const custodyHash = document.custodyHash || `SHA256: 8f3c7a912e5d944bc0891d21e89b41a3_${document.id}`;

  const handleCopyHash = () => {
    navigator.clipboard.writeText(custodyHash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleQuickToggleVerification = () => {
    if (onToggleVerification) {
      onToggleVerification(document.id);
      const newStatus = isVerified ? 'Needs Review' : 'Verified';
      setActionNotification(`Document updated to "${newStatus}" status`);
      setTimeout(() => setActionNotification(null), 3000);
    }
  };

  const handleAddCustodyNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCustodyNote.trim() || !onToggleVerification) return;
    onToggleVerification(document.id, customCustodyNote.trim());
    setCustomCustodyNote('');
    setIsAddingCustodyNote(false);
    setActionNotification('Custom evidentiary note logged to Chain of Custody.');
    setTimeout(() => setActionNotification(null), 3000);
  };

  // Generate realistic formatted document text
  const simulatedDocumentContent = `IN THE UNITED STATES DISTRICT COURT
FOR THE DISTRICT OF DELAWARE

CASE MATTER: ${document.caseTitle.toUpperCase()}
DOCKET IDENTIFIER: ${matchedCase?.caseNumber || document.caseId.toUpperCase()}
CLIENT OF RECORD: ${document.clientName.toUpperCase()}

================================================================================
EXHIBIT FILING & EVIDENCE VAULT RECORD
================================================================================
DOCUMENT TITLE: ${document.fileName}
VAULT REGISTRATION NUMBER: VLT-${document.id.toUpperCase()}
SECURITY CLASSIFICATION: ${document.isConfidential ? 'CONFIDENTIAL ATTORNEY-CLIENT PRIVILEGED' : 'PUBLIC FILING / EXHIBIT'}
CATEGORY: ${document.category.toUpperCase()} | VERSION: ${document.version} | MIME: application/${document.fileType}
INGESTION DATE: ${document.uploadedAt} | DEPOSITED BY: ${document.uploadedBy}

1. PRELIMINARY STATEMENT & CHAIN OF CUSTODY AUTHENTICATION
1.1 Pursuant to Rule 26 of the Federal Rules of Civil Procedure and applicable local rules, this document was ingested into the law firm's encrypted evidentiary repository.
1.2 Cryptographic Digital Digest: ${custodyHash}
1.3 Current Evidentiary Admissibility Status: ${isVerified ? 'VERIFIED & AUTHENTICATED EXHIBIT' : 'PROVISIONAL / PENDING COUNSEL REVIEW'}.
${document.verifiedBy ? `1.4 Authenticating Counsel: ${document.verifiedBy} on ${document.verifiedAt || 'Recorded Ingestion'}.` : ''}

2. FACTUAL RECORD & SUMMARY OF PROVISIONS
2.1 ${currentSummary}

3. OPERATIVE TERMS, EXTRACTED COVENANTS & CLAUSES
${currentClauses.map((clause, idx) => `3.${idx + 1} [Clause ${idx + 1}] ${clause}`).join('\n\n')}

4. JURISDICTION, DISPUTE RESOLUTION & CHOICE OF LAW
4.1 This instrument and any dispute arising out of or related to the underlying subject matter shall be governed by and construed in accordance with the laws of the State of Delaware, without giving effect to any choice or conflict of law provision.
4.2 Venue for any action, arbitration, or proceeding shall lie exclusively in the state and federal courts situated within the appropriate district.

5. SIGNATURE & NOTARY CERTIFICATE
5.1 Electronically signed and sealed under 28 U.S.C. § 1746.
5.2 Digital Vault Key Fingerprint: RSA-4096-SHA256 [0x9F4B-3A7C-8E11-2026]

[END OF DOCUMENT VAULT PREVIEW - JURIS-PULSE SECURE ARCHIVE]`;

  const handleCopyText = () => {
    navigator.clipboard.writeText(simulatedDocumentContent);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleSimulateDownload = () => {
    const blob = new Blob([simulatedDocumentContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = window.document.createElement('a');
    link.href = url;
    link.download = document.fileName.endsWith('.txt') || document.fileName.endsWith('.pdf')
      ? document.fileName
      : `${document.fileName}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    setActionNotification(`Downloaded "${document.fileName}" to local storage`);
    setTimeout(() => setActionNotification(null), 3500);
  };

  const handleExportCourtroomAuditPdf = () => {
    setIsExportingPdf(true);
    try {
      exportDocumentCustodyAuditPDF({
        document,
        matchedCase,
        firmName: 'JURISPULSE LAW PARTNERS LLP',
        certifyingCounsel: document.verifiedBy || document.uploadedBy || 'Counsel of Record',
        barNumber: 'NY-BAR #5849201 / US-DIST-SDNY',
        jurisdiction: matchedCase?.statutoryJurisdiction || 'Federal District Court / Civil & Commercial Trial Division'
      });
      setActionNotification(`Courtroom chain-of-custody audit PDF generated for "${document.fileName}".`);
      setTimeout(() => setActionNotification(null), 4000);
    } catch (err) {
      console.error('Failed to generate courtroom audit PDF:', err);
      setActionNotification('Failed to generate PDF. Please try again.');
      setTimeout(() => setActionNotification(null), 3000);
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 animate-in fade-in duration-200">
      <div
        className={`bg-white rounded-2xl shadow-2xl border border-slate-200 w-full flex flex-col overflow-hidden text-slate-900 transition-all ${
          isFullscreen ? 'h-[96vh] max-w-[98vw]' : 'max-h-[90vh] max-w-5xl'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div
              className={`p-2.5 rounded-xl shrink-0 ${
                isEvidence
                  ? isVerified
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
              }`}
            >
              {isEvidence ? (
                isVerified ? (
                  <ShieldCheck className="w-5 h-5 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-amber-400" />
                )
              ) : (
                <FileText className="w-5 h-5 text-blue-400" />
              )}
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-500/30 text-blue-200 border border-blue-400/40">
                  Quick Preview
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                  {document.category}
                </span>
                {document.isConfidential && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    Confidential Privileged
                  </span>
                )}
                {isVerified ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    Verified Exhibit
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 text-amber-400" />
                    Needs Review
                  </span>
                )}
                <button
                  type="button"
                  onClick={() => setActiveTab('timeline')}
                  className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-200 border border-indigo-500/40 flex items-center gap-1 transition cursor-pointer"
                  title="Open visual case evidence building timeline"
                >
                  <Milestone className="w-3 h-3 text-indigo-300" />
                  <span>Case Timeline ({caseDocuments.length})</span>
                </button>
              </div>
              <h2 className="text-base sm:text-lg font-bold text-white truncate mt-1">
                {document.fileName}
              </h2>
            </div>
          </div>

          {/* Top Right Stepper & Controls */}
          <div className="flex items-center gap-2 shrink-0">
            {documentsList.length > 1 && (
              <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-lg border border-slate-700 text-xs">
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={!hasPrev}
                  className="p-1 rounded hover:bg-slate-700 text-slate-300 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition cursor-pointer"
                  title="Previous Document"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-2 font-mono text-[11px] text-slate-300">
                  {currentIndex + 1} of {documentsList.length}
                </span>
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={!hasNext}
                  className="p-1 rounded hover:bg-slate-700 text-slate-300 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent transition cursor-pointer"
                  title="Next Document"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-300 hover:text-white border border-slate-700 transition"
              title="Close (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Action Toast Notification */}
        {actionNotification && (
          <div className="px-4 py-2 bg-emerald-600 text-white text-xs font-semibold flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-200" />
              <span>{actionNotification}</span>
            </div>
            <button
              type="button"
              onClick={() => setActionNotification(null)}
              className="text-white hover:text-emerald-100 p-0.5 rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Metadata Summary Banner */}
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-200 text-xs grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 shrink-0">
          <div>
            <span className="text-[10px] text-slate-400 font-semibold uppercase block">Matter</span>
            <span className="font-bold text-slate-800 truncate block mt-0.5" title={document.caseTitle}>
              {document.caseTitle}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 font-semibold uppercase block">Client</span>
            <span className="font-bold text-slate-800 truncate block mt-0.5" title={document.clientName}>
              {document.clientName}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 font-semibold uppercase block">Size & Format</span>
            <span className="font-mono font-semibold text-slate-700 block mt-0.5">
              {document.fileSize} • {document.fileType.toUpperCase()} (v{document.version})
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 font-semibold uppercase block">Uploaded</span>
            <span className="font-medium text-slate-700 truncate block mt-0.5">
              {document.uploadedAt.slice(0, 10)} by {document.uploadedBy.split(' ')[0]}
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 font-semibold uppercase block">AI Risk Level</span>
            <span
              className={`inline-flex items-center gap-1 font-bold px-1.5 py-0.5 rounded text-[11px] mt-0.5 border ${
                currentRisk === 'High'
                  ? 'bg-rose-50 text-rose-700 border-rose-200'
                  : currentRisk === 'Moderate'
                  ? 'bg-amber-50 text-amber-700 border-amber-200'
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              {currentRisk} Risk
            </span>
          </div>

          <div>
            <span className="text-[10px] text-slate-400 font-semibold uppercase block">Custody Hash</span>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="font-mono text-[10px] text-slate-600 truncate max-w-[85px]" title={custodyHash}>
                {custodyHash}
              </span>
              <button
                type="button"
                onClick={handleCopyHash}
                className="p-1 rounded bg-white hover:bg-slate-200 border border-slate-200 text-slate-600 hover:text-blue-600 transition"
                title="Copy cryptographic hash"
              >
                {copiedHash ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
          </div>
        </div>

        {/* Tab Navigation & Toolbar */}
        <div className="px-5 py-2.5 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-lg border border-slate-200 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('content')}
              className={`px-3 py-1.5 rounded-md font-bold transition flex items-center gap-1.5 ${
                activeTab === 'content'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Document Details</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('timeline')}
              className={`px-3 py-1.5 rounded-md font-bold transition flex items-center gap-1.5 ${
                activeTab === 'timeline'
                  ? 'bg-white text-indigo-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Milestone className="w-3.5 h-3.5 text-indigo-600" />
              <span>Evidence Timeline</span>
              <span className="text-[10px] font-mono font-bold bg-indigo-100 text-indigo-700 px-1.5 py-0.2 rounded-full">
                {caseDocuments.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('ai_analysis')}
              className={`px-3 py-1.5 rounded-md font-bold transition flex items-center gap-1.5 ${
                activeTab === 'ai_analysis'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>AI Insights & Risk</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('custody')}
              className={`px-3 py-1.5 rounded-md font-bold transition flex items-center gap-1.5 ${
                activeTab === 'custody'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <History className="w-3.5 h-3.5 text-blue-600" />
              <span>Chain of Custody ({document.chainOfCustody?.length || 1})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('metadata')}
              className={`px-3 py-1.5 rounded-md font-bold transition flex items-center gap-1.5 ${
                activeTab === 'metadata'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Info className="w-3.5 h-3.5" />
              <span>Tech Specs</span>
            </button>
          </div>

          {/* Quick Reader Controls (Search / Font Size / Actions) */}
          <div className="flex items-center gap-2">
            {activeTab === 'content' && (
              <>
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Find in document..."
                    className="bg-slate-50 border border-slate-200 rounded-md pl-8 pr-2.5 py-1 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 w-36 sm:w-48"
                  />
                </div>

                <div className="flex items-center gap-0.5 bg-slate-100 rounded-md border border-slate-200 p-0.5">
                  <button
                    type="button"
                    onClick={() => setFontSize('sm')}
                    className={`px-2 py-0.5 text-xs rounded font-medium ${
                      fontSize === 'sm' ? 'bg-white font-bold text-slate-900 shadow-2xs' : 'text-slate-600'
                    }`}
                    title="Small Text"
                  >
                    A-
                  </button>
                  <button
                    type="button"
                    onClick={() => setFontSize('base')}
                    className={`px-2 py-0.5 text-xs rounded font-medium ${
                      fontSize === 'base' ? 'bg-white font-bold text-slate-900 shadow-2xs' : 'text-slate-600'
                    }`}
                    title="Standard Text"
                  >
                    A
                  </button>
                  <button
                    type="button"
                    onClick={() => setFontSize('lg')}
                    className={`px-2 py-0.5 text-xs rounded font-medium ${
                      fontSize === 'lg' ? 'bg-white font-bold text-slate-900 shadow-2xs' : 'text-slate-600'
                    }`}
                    title="Large Text"
                  >
                    A+
                  </button>
                </div>
              </>
            )}

            <button
              type="button"
              onClick={handleCopyText}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded-md font-semibold border border-slate-200 flex items-center gap-1.5 transition"
              title="Copy all document text"
            >
              {copiedText ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copiedText ? 'Copied' : 'Copy Text'}</span>
            </button>

            <button
              type="button"
              onClick={handleSimulateDownload}
              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs rounded-md font-semibold border border-slate-200 flex items-center gap-1.5 transition"
              title="Download file"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Download</span>
            </button>

            <button
              type="button"
              onClick={handleExportCourtroomAuditPdf}
              disabled={isExportingPdf}
              className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs rounded-md font-bold border border-indigo-300 flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
              title="Trigger PDF generation of the full audit trail and chain-of-custody history for courtroom submission (FRE 901/902)"
            >
              <Scale className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span className="hidden sm:inline">Courtroom Audit PDF</span>
              <span className="sm:hidden">Audit PDF</span>
            </button>
          </div>
        </div>

        {/* Scrollable View Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50/50">
          {/* TAB 1: DOCUMENT CONTENT PREVIEW */}
          {activeTab === 'content' && (
            <div className="space-y-4">
              {/* Document Paper Container */}
              <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
                {/* Parchment / Federal Court Header Strip */}
                <div className="px-6 py-4 bg-slate-900 text-white border-b border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4 text-blue-400" />
                    <span className="font-mono text-xs font-bold tracking-wider uppercase text-slate-200">
                      UNITED STATES DISTRICT COURT • EVIDENTIARY ARCHIVE
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
                    VAULT REF: #{document.id.toUpperCase()}
                  </span>
                </div>

                {/* Main Scrollable Document Text */}
                <div
                  className={`p-6 sm:p-8 font-mono text-slate-800 leading-relaxed overflow-x-auto whitespace-pre-wrap ${
                    fontSize === 'sm' ? 'text-xs' : fontSize === 'lg' ? 'text-sm sm:text-base' : 'text-xs sm:text-sm'
                  }`}
                >
                  {simulatedDocumentContent.split('\n').map((line, idx) => {
                    const isHeader = line.startsWith('IN THE UNITED') || line.startsWith('CASE MATTER:') || line.startsWith('DOCKET IDENTIFIER:');
                    const isSectionHeader = line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') || line.startsWith('4. ') || line.startsWith('5. ');
                    const isDivider = line.startsWith('====');
                    const isMatch = searchTerm.trim() && line.toLowerCase().includes(searchTerm.trim().toLowerCase());

                    return (
                      <div
                        key={idx}
                        className={`py-0.5 transition-colors ${
                          isMatch ? 'bg-amber-100 text-amber-950 font-bold px-1 rounded' : ''
                        } ${isHeader ? 'font-bold text-slate-900' : ''} ${
                          isSectionHeader ? 'font-bold text-blue-900 pt-3 text-sm border-t border-slate-100' : ''
                        } ${isDivider ? 'text-slate-400 font-normal select-none' : ''}`}
                      >
                        {line}
                      </div>
                    );
                  })}
                </div>

                {/* Digital Seal / Verification Watermark Footer */}
                <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-600" />
                    <div>
                      <span className="font-bold text-slate-900 block">
                        {isVerified ? 'Cryptographically Sealed & Verified' : 'Unauthenticated Provisional Filing'}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        {custodyHash}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <button
                      type="button"
                      onClick={handleExportCourtroomAuditPdf}
                      disabled={isExportingPdf}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5 transition shadow-2xs cursor-pointer"
                      title="Export certified chain-of-custody PDF for courtroom submission"
                    >
                      <Scale className="w-3.5 h-3.5" />
                      <span>Courtroom Audit PDF</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActiveTab('timeline')}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 flex items-center gap-1.5 transition cursor-pointer"
                    >
                      <Milestone className="w-3.5 h-3.5" />
                      <span>View Case Timeline</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleQuickToggleVerification}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition shadow-2xs ${
                        isVerified
                          ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                    >
                      {isVerified ? <RotateCcw className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                      <span>{isVerified ? 'Mark as Needs Review' : 'Verify & Seal Exhibit'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB: VISUAL EVIDENCE BUILDING TIMELINE */}
          {activeTab === 'timeline' && (
            <EvidenceBuildingTimeline
              currentDocument={document}
              documentsList={documentsList}
              matchedCase={matchedCase}
              userRole={userRole}
              onSelectDocument={onSelectDocument}
              onToggleVerification={onToggleVerification}
              onExportAuditPdf={(docToExport) => {
                const docCase = cases.find((c) => c.id === docToExport.caseId) || matchedCase;
                exportDocumentCustodyAuditPDF({
                  document: docToExport,
                  matchedCase: docCase,
                  firmName: 'JURISPULSE LAW PARTNERS LLP',
                  certifyingCounsel: docToExport.verifiedBy || docToExport.uploadedBy || 'Counsel of Record',
                  barNumber: 'NY-BAR #5849201 / US-DIST-SDNY',
                  jurisdiction: docCase?.statutoryJurisdiction || 'Federal District Court / Civil & Commercial Trial Division'
                });
                setActionNotification(`Courtroom chain-of-custody audit PDF generated for "${docToExport.fileName}".`);
                setTimeout(() => setActionNotification(null), 4000);
              }}
            />
          )}

          {/* TAB 2: AI INSIGHTS & RISK */}
          {activeTab === 'ai_analysis' && (
            <div className="space-y-4">
              {/* Executive Summary Card */}
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-amber-100 text-amber-800 rounded-lg">
                      <Sparkles className="w-4 h-4 text-amber-600" />
                    </div>
                    <h3 className="font-bold text-sm text-slate-900">Gemini AI Legal Brief & Abstract</h3>
                  </div>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                      currentRisk === 'High'
                        ? 'bg-rose-50 text-rose-700 border-rose-200'
                        : currentRisk === 'Moderate'
                        ? 'bg-amber-50 text-amber-700 border-amber-200'
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}
                  >
                    Risk Evaluation: {currentRisk}
                  </span>
                </div>

                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-lg border border-slate-200">
                  {currentSummary}
                </p>
              </div>

              {/* Identified Key Clauses */}
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-blue-600" />
                  <span>Extracted Covenants & Key Clauses ({currentClauses.length})</span>
                </h3>

                <div className="space-y-2.5">
                  {currentClauses.map((clause, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs flex items-start gap-2.5 hover:border-blue-300 transition"
                    >
                      <span className="font-mono text-[10px] font-bold bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded mt-0.5 shrink-0">
                        § 3.{idx + 1}
                      </span>
                      <div className="space-y-1 min-w-0 flex-1">
                        <p className="text-slate-800 font-medium leading-relaxed">{clause}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CHAIN OF CUSTODY */}
          {activeTab === 'custody' && (
            <div className="space-y-4">
              {/* Courtroom Submission Certificate Action Banner */}
              <div className="p-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-xl border border-indigo-800/80 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="p-2.5 bg-indigo-500/20 rounded-xl border border-indigo-400/30 text-indigo-300 shrink-0">
                    <Scale className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-white">Courtroom Evidentiary Certificate & Audit Trail</h4>
                      <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.2 rounded-full">
                        FRE 902(11)/(14) Compliant
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                      Generate a self-authenticating PDF complete with cryptographic SHA-256 integrity digest, chronological custodian signatures, and formal attestation for judicial submission.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleExportCourtroomAuditPdf}
                  disabled={isExportingPdf}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition shrink-0 cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                  title="Generate certified PDF of full audit trail and chain-of-custody for courtroom submission"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Generate Courtroom Audit PDF</span>
                </button>
              </div>

              {/* Timeline Context Header Banner */}
              <div className="p-3.5 bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-200 rounded-xl flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <Milestone className="w-4 h-4 text-indigo-600 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Multi-Exhibit Evidence Building Timeline</h4>
                    <p className="text-[11px] text-slate-600">
                      View all {caseDocuments.length} evidentiary deposits and verification events for this case in sequence.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('timeline')}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition shrink-0 cursor-pointer flex items-center gap-1 shadow-xs"
                >
                  <span>Open Case Timeline</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <History className="w-4 h-4 text-blue-600" />
                    <h3 className="font-bold text-sm text-slate-900">Cryptographic Chain of Custody Log</h3>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsAddingCustodyNote(!isAddingCustodyNote)}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-md border border-slate-300 flex items-center gap-1.5 transition"
                  >
                    <Plus className="w-3.5 h-3.5 text-blue-600" />
                    <span>Append Audit Note</span>
                  </button>
                </div>

                {isAddingCustodyNote && (
                  <form onSubmit={handleAddCustodyNoteSubmit} className="p-3.5 bg-blue-50/70 border border-blue-200 rounded-lg space-y-2.5 animate-in fade-in">
                    <label className="text-xs font-bold text-slate-800 block">
                      Add Evidentiary Notary / Chain of Custody Remark:
                    </label>
                    <textarea
                      value={customCustodyNote}
                      onChange={(e) => setCustomCustodyNote(e.target.value)}
                      placeholder="e.g., Cross-verified with court filing stamped July 12, 2026..."
                      rows={2}
                      className="w-full text-xs p-2 rounded-md border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      required
                    />
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setIsAddingCustodyNote(false)}
                        className="px-2.5 py-1 text-xs text-slate-600 hover:text-slate-800 font-semibold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded shadow-xs"
                      >
                        Save Entry
                      </button>
                    </div>
                  </form>
                )}

                {/* Timeline */}
                <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {(document.chainOfCustody || [
                    {
                      id: 'c-init',
                      action: 'Uploaded',
                      performedBy: document.uploadedBy,
                      timestamp: document.uploadedAt,
                      note: 'Initial deposit to encrypted vault'
                    }
                  ]).map((event, idx) => (
                    <div key={event.id || idx} className="relative group">
                      <div className="absolute -left-6 top-1 w-3 h-3 rounded-full bg-blue-600 ring-4 ring-white" />
                      <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-bold text-xs text-slate-900">{event.action}</span>
                          <span className="text-[10px] font-mono text-slate-500">{event.timestamp}</span>
                        </div>
                        <p className="text-[11px] text-slate-600">
                          Agent / Counsel: <strong className="text-slate-800">{event.performedBy}</strong>
                        </p>
                        {event.note && (
                          <p className="text-[11px] text-slate-700 bg-white p-2 rounded border border-slate-200 italic mt-1">
                            &ldquo;{event.note}&rdquo;
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TECH SPECS & METADATA */}
          {activeTab === 'metadata' && (
            <div className="space-y-4">
              <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-600" />
                  <span>Technical Vault Metadata & Storage Specifications</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                    <span className="text-slate-400 font-semibold text-[10px] uppercase">Unique Vault GUID</span>
                    <p className="font-mono font-bold text-slate-800 truncate">{document.id}</p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                    <span className="text-slate-400 font-semibold text-[10px] uppercase">Encryption Cipher</span>
                    <p className="font-mono font-bold text-slate-800">AES-256-GCM / PBKDF2</p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                    <span className="text-slate-400 font-semibold text-[10px] uppercase">MIME Content Type</span>
                    <p className="font-mono font-bold text-slate-800">application/{document.fileType}</p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                    <span className="text-slate-400 font-semibold text-[10px] uppercase">Integrity Hash Algorithm</span>
                    <p className="font-mono font-bold text-slate-800">FIPS 180-4 SHA-256 Digest</p>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1 sm:col-span-2">
                    <span className="text-slate-400 font-semibold text-[10px] uppercase">Digital Custody Hash</span>
                    <p className="font-mono font-bold text-slate-900 text-xs break-all bg-white p-2 rounded border border-slate-200">
                      {custodyHash}
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={handleExportCourtroomAuditPdf}
                    disabled={isExportingPdf}
                    className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-300 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                    title="Generate certified PDF of full audit trail and chain-of-custody for courtroom submission (FRE 902)"
                  >
                    <Scale className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Courtroom Audit PDF (FRE 902)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      const headers = ['Document ID', 'File Name', 'Category', 'Verification Status', 'Custody SHA-256 Hash', 'Matter ID', 'Matter Title', 'Client Name', 'File Size', 'File Type', 'Version', 'Confidentiality', 'Uploaded At', 'Uploaded By', 'Verified By', 'Verified At', 'AI Risk Level', 'AI Summary'];
                      const escape = (val: any) => `"${String(val ?? '').replace(/"/g, '""')}"`;
                      const row = [
                        escape(document.id),
                        escape(document.fileName),
                        escape(document.category),
                        escape(document.verificationStatus || 'Needs Review'),
                        escape(custodyHash),
                        escape(document.caseId),
                        escape(document.caseTitle),
                        escape(document.clientName),
                        escape(document.fileSize),
                        escape(document.fileType),
                        escape(`v${document.version}`),
                        escape(document.isConfidential ? 'Confidential' : 'Standard'),
                        escape(document.uploadedAt),
                        escape(document.uploadedBy),
                        escape(document.verifiedBy || 'N/A'),
                        escape(document.verifiedAt || 'N/A'),
                        escape(document.aiRiskLevel || 'Low'),
                        escape(document.aiSummary || '')
                      ].join(',');
                      const blob = new Blob(['\uFEFF' + headers.join(',') + '\r\n' + row], { type: 'text/csv;charset=utf-8;' });
                      const url = URL.createObjectURL(blob);
                      const link = document.createElement('a');
                      link.href = url;
                      link.setAttribute('download', `${document.fileName.replace(/\.[^/.]+$/, "")}_metadata.csv`);
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                      URL.revokeObjectURL(url);
                      setActionNotification('Metadata exported to CSV.');
                      setTimeout(() => setActionNotification(null), 3000);
                    }}
                    className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export Document Metadata (CSV)</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="px-5 py-3.5 bg-slate-100 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
            <button
              type="button"
              onClick={handleQuickToggleVerification}
              className={`w-full sm:w-auto px-4 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 shadow-xs transition cursor-pointer ${
                isVerified
                  ? 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {isVerified ? (
                <>
                  <RotateCcw className="w-4 h-4" />
                  <span>Mark as Needs Review</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Verify Document (Authenticate)</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleExportCourtroomAuditPdf}
              disabled={isExportingPdf}
              className="w-full sm:w-auto px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition cursor-pointer"
              title="Trigger PDF generation of the current document's full audit trail and chain-of-custody history for courtroom submission"
            >
              <Scale className="w-4 h-4" />
              <span>Courtroom Audit PDF</span>
            </button>

            {onOpenInSidePanel && (
              <button
                type="button"
                onClick={() => {
                  onOpenInSidePanel(document.id);
                  onClose();
                }}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 shadow-2xs transition"
                title="Open in persistent docked side-panel"
              >
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                <span>Open in Side Panel</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg border border-slate-200 shadow-2xs flex items-center gap-1.5 transition"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Print</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg shadow-xs transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
