import React, { useState, useMemo } from 'react';
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
  Plus,
  X,
  Bot,
  Check,
  Copy,
  ExternalLink,
  Shield,
  Clock,
  Calendar,
  Layers,
  ChevronRight,
  ChevronDown,
  Scale,
  Maximize2,
  Minimize2,
  FileCheck,
  KeyRound,
  Printer
} from 'lucide-react';
import { ClientDocument, DocumentCustodyEvent, UserRole } from '../types';

interface DocumentSidePanelProps {
  document: ClientDocument | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleVerification?: (docId: string, customNote?: string) => void;
  userRole: UserRole;
  onAnalyzeWithAI?: (doc: ClientDocument) => void;
  isAnalyzing?: boolean;
  aiAnalysisResult?: any;
  mode?: 'drawer' | 'docked';
  onToggleMode?: () => void;
}

export const DocumentSidePanel: React.FC<DocumentSidePanelProps> = ({
  document,
  isOpen,
  onClose,
  onToggleVerification,
  userRole,
  onAnalyzeWithAI,
  isAnalyzing = false,
  aiAnalysisResult = null,
  mode = 'docked',
  onToggleMode
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'ai_summary' | 'custody' | 'metadata'>('all');
  const [copiedHash, setCopiedHash] = useState(false);
  const [isAddingCustodyNote, setIsAddingCustodyNote] = useState(false);
  const [customCustodyNote, setCustomCustodyNote] = useState('');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [expandedClauses, setExpandedClauses] = useState<Record<number, boolean>>({});

  if (!isOpen || !document) return null;

  const isVerified = (document.verificationStatus || 'Needs Review') === 'Verified';
  const isEvidence = document.category === 'Evidence';

  // Derived AI Summary
  const currentSummary =
    aiAnalysisResult?.summary ||
    document.aiSummary ||
    'Executive legal evaluation of submitted matter exhibits, contractual provisions, and evidentiary admissibility standards under federal and local court rules.';

  const currentClauses: string[] =
    aiAnalysisResult?.keyClauses ||
    document.aiKeyClauses || [
      'Indemnification & Hold-Harmless covenants governed by Section 12.',
      'Mandatory pre-litigation binding mediation in Delaware jurisdiction.',
      'Liquidated damages limitation capped at aggregate fee disbursements.',
      'Evidentiary chain-of-custody digital notary attestation clause.'
    ];

  const currentRisk =
    aiAnalysisResult?.riskLevel || document.aiRiskLevel || (isVerified ? 'Low' : 'Moderate');

  const handleCopyHash = () => {
    const hash = document.custodyHash || `SHA256: 8f3c7a912e5d944bc0891d21e89b41a3_${document.id}`;
    navigator.clipboard.writeText(hash);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  const handleQuickToggleVerification = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleVerification) {
      onToggleVerification(document.id);
    }
  };

  const handleAddCustodyNoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customCustodyNote.trim() || !onToggleVerification) return;
    onToggleVerification(document.id, customCustodyNote.trim());
    setCustomCustodyNote('');
    setIsAddingCustodyNote(false);
  };

  const toggleClauseExpand = (idx: number) => {
    setExpandedClauses((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };

  // Mock Simulated Preview Text for legal documents
  const sampleDocumentPreview = useMemo(() => {
    return `IN THE UNITED STATES DISTRICT COURT
FOR THE DISTRICT OF DELAWARE

${document.caseTitle.toUpperCase()}
Case Reference: ${document.caseId.toUpperCase()}

EXHIBIT FILING: ${document.fileName}
Category: ${document.category} | Vault Identifier: VLT-${document.id}

1. PRELIMINARY STATEMENT & CHAIN OF CUSTODY
This document has been ingested into the encrypted matter vault under Rule 26 of the Federal Rules of Civil Procedure.
Digital Custody Hash: ${document.custodyHash || 'SHA256: 8f3c7a912e5d944bc0891d21e89b41a3'}
Verification Audit: ${isVerified ? 'AUTHENTICATED AND SEALED' : 'PENDING COUNSEL VERIFICATION'}

2. FACTUAL RECORD & SUMMARY
${currentSummary}

3. RECORDED COVENANTS & CLAUSES
${currentClauses.map((c, i) => `   3.${i + 1}. ${c}`).join('\n')}

[CONFIDENTIAL ATTORNEY WORK-PRODUCT - PRIVILEGED]`;
  }, [document, isVerified, currentSummary, currentClauses]);

  // Is this side panel rendered in floating slide-over drawer mode or docked mode?
  const isDrawer = mode === 'drawer';

  const containerClasses = isDrawer
    ? isFullscreen
      ? 'fixed inset-4 z-50 bg-white rounded-2xl shadow-2xl border border-slate-300 flex flex-col overflow-hidden text-slate-900 animate-in zoom-in-95'
      : 'fixed inset-y-0 right-0 z-50 w-full sm:max-w-xl md:max-w-2xl bg-white shadow-2xl border-l border-slate-200 flex flex-col overflow-hidden text-slate-900 animate-in slide-in-from-right duration-300'
    : 'bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col text-slate-900 overflow-hidden';

  return (
    <>
      {/* Backdrop for mobile or drawer mode */}
      {isDrawer && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/60 backdrop-blur-xs transition-opacity"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <div className={containerClasses}>
        {/* Panel Header */}
        <div className="p-4 sm:p-4.5 bg-slate-900 text-white shrink-0 border-b border-slate-800 flex items-start justify-between gap-3">
          <div className="space-y-1.5 min-w-0">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30 uppercase tracking-wider">
                {document.category}
              </span>
              {document.isConfidential && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-400/30 flex items-center gap-1">
                  <Lock className="w-2.5 h-2.5" />
                  Privileged Envelope
                </span>
              )}
              {isEvidence && (
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  Exhibit Proof
                </span>
              )}
            </div>

            <h3 className="font-bold text-white text-sm sm:text-base leading-snug break-words">
              {document.fileName}
            </h3>

            <p className="text-xs text-slate-400 truncate flex items-center gap-1.5">
              <span>Matter:</span>
              <strong className="text-slate-200">{document.caseTitle}</strong>
              <span>•</span>
              <span className="font-mono text-slate-400">{document.fileSize}</span>
            </p>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {onToggleMode && (
              <button
                type="button"
                onClick={onToggleMode}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
                title={isDrawer ? 'Switch to Docked Grid Mode' : 'Switch to Slide-Over Drawer Mode'}
              >
                <Layers className="w-4 h-4" />
              </button>
            )}

            {isDrawer && (
              <button
                type="button"
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
                title={isFullscreen ? 'Exit Fullscreen' : 'Expand Fullscreen'}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
              title="Close Side Panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="px-4 bg-slate-100/90 border-b border-slate-200 flex items-center justify-between gap-2 overflow-x-auto shrink-0 py-1.5">
          <div className="flex items-center gap-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
                activeTab === 'all'
                  ? 'bg-white text-blue-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              Overview & All
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('ai_summary')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'ai_summary'
                  ? 'bg-white text-blue-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>AI Summary</span>
              {currentRisk && (
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                    currentRisk === 'High'
                      ? 'bg-rose-100 text-rose-700'
                      : currentRisk === 'Moderate'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {currentRisk}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('custody')}
              className={`px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 whitespace-nowrap ${
                activeTab === 'custody'
                  ? 'bg-white text-blue-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              <History className="w-3.5 h-3.5 text-blue-600" />
              <span>Chain of Custody</span>
              <span className="text-[10px] font-mono font-bold bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded-full">
                {document.chainOfCustody?.length || 1}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('metadata')}
              className={`px-3 py-1.5 rounded-lg transition whitespace-nowrap ${
                activeTab === 'metadata'
                  ? 'bg-white text-blue-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
              }`}
            >
              Raw Preview
            </button>
          </div>

          {/* Quick AI Scan Trigger */}
          {onAnalyzeWithAI && (
            <button
              type="button"
              onClick={() => onAnalyzeWithAI(document)}
              disabled={isAnalyzing}
              className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 font-bold text-[11px] rounded-lg border border-amber-200 flex items-center gap-1.5 transition shrink-0 shadow-2xs disabled:opacity-50"
              title="Rescan document using Gemini AI"
            >
              <Sparkles className={`w-3.5 h-3.5 text-amber-600 ${isAnalyzing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isAnalyzing ? 'Analyzing...' : 'Gemini Rescan'}</span>
              <span className="sm:hidden">{isAnalyzing ? '...' : 'Scan'}</span>
            </button>
          )}
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-5 flex-1 text-xs">
          {/* Quick Status Bar / High-Level Verification Summary */}
          <div
            className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              isVerified
                ? 'bg-emerald-50/70 border-emerald-200'
                : 'bg-amber-50/70 border-amber-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-xl shrink-0 ${
                  isVerified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}
              >
                {isVerified ? (
                  <ShieldCheck className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-900 text-xs">Chain of Custody Status:</span>
                  <span
                    className={`font-bold px-2 py-0.5 rounded text-[11px] uppercase tracking-wide ${
                      isVerified
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-amber-100 text-amber-900 border border-amber-300'
                    }`}
                  >
                    {isVerified ? 'Verified & Authenticated' : 'Needs Evidentiary Review'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-600 mt-0.5">
                  {isVerified
                    ? `Notarized by ${document.verifiedBy || 'Counsel'} • Validated on ${document.verifiedAt || document.uploadedAt}`
                    : 'Pending lead attorney evidentiary review and tamper-proof digital notarization.'}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleQuickToggleVerification}
              className={`px-3.5 py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition shrink-0 ${
                isVerified
                  ? 'bg-slate-900 hover:bg-slate-800 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white'
              }`}
            >
              {isVerified ? (
                <>
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Revert to Needs Review</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>1-Click Authenticate & Verify</span>
                </>
              )}
            </button>
          </div>

          {/* SECTION 1: AI SUMMARY & LEGAL INTELLIGENCE DATA */}
          {(activeTab === 'all' || activeTab === 'ai_summary') && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                      Gemini AI Legal Intelligence & Summary
                    </h4>
                    <p className="text-[10px] text-slate-500">
                      Automated legal clause extraction, risk assessment, and obligation audit
                    </p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                    currentRisk === 'High'
                      ? 'bg-rose-50 text-rose-700 border-rose-200'
                      : currentRisk === 'Moderate'
                      ? 'bg-amber-50 text-amber-700 border-amber-200'
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}
                >
                  Risk: {currentRisk}
                </span>
              </div>

              {/* Summary Statement */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Executive Briefing & Analysis:
                </span>
                <p className="text-xs text-slate-800 leading-relaxed bg-white p-3 rounded-lg border border-slate-200">
                  {currentSummary}
                </p>
              </div>

              {/* Key Clauses Extracted */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Extracted Legal Clauses & Key Obligations ({currentClauses.length}):
                  </span>
                  <span className="text-[10px] text-blue-700 font-semibold">Interactive Breakdown</span>
                </div>

                <div className="space-y-1.5">
                  {currentClauses.map((clause, idx) => {
                    const isExpanded = !!expandedClauses[idx];
                    return (
                      <div
                        key={idx}
                        className="bg-white border border-slate-200 rounded-lg p-2.5 hover:border-blue-300 transition"
                      >
                        <div
                          className="flex items-start justify-between gap-2 cursor-pointer"
                          onClick={() => toggleClauseExpand(idx)}
                        >
                          <div className="flex items-start gap-2">
                            <span className="font-mono text-blue-600 font-bold text-[11px] shrink-0 mt-0.5">
                              § {idx + 1}
                            </span>
                            <p className="text-xs text-slate-800 font-medium leading-normal">{clause}</p>
                          </div>
                          <button
                            type="button"
                            className="text-slate-400 hover:text-slate-700 shrink-0 mt-0.5"
                          >
                            {isExpanded ? (
                              <ChevronDown className="w-3.5 h-3.5" />
                            ) : (
                              <ChevronRight className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>

                        {isExpanded && (
                          <div className="mt-2 pt-2 border-t border-slate-100 text-[11px] text-slate-600 bg-slate-50/70 p-2 rounded space-y-1">
                            <p className="font-semibold text-slate-800">Counsel Annotation & Impact:</p>
                            <p>
                              Standard enforceable provision under federal circuit guidelines. Advised to cross-check with original executed counterpart and discovery disclosures.
                            </p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Strategic Next Steps / Red Flags */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                <div className="p-2.5 bg-amber-50/80 border border-amber-200 rounded-lg space-y-1">
                  <span className="text-[10px] font-bold text-amber-900 flex items-center gap-1 uppercase tracking-wider">
                    <AlertTriangle className="w-3 h-3 text-amber-600" />
                    Potential Red Flags
                  </span>
                  <p className="text-[11px] text-amber-800">
                    Verify timestamp alignment with opposing party’s deposition testimony and exhibits.
                  </p>
                </div>

                <div className="p-2.5 bg-blue-50/80 border border-blue-200 rounded-lg space-y-1">
                  <span className="text-[10px] font-bold text-blue-900 flex items-center gap-1 uppercase tracking-wider">
                    <Scale className="w-3 h-3 text-blue-600" />
                    Recommended Action
                  </span>
                  <p className="text-[11px] text-blue-800">
                    File exhibit into discovery evidentiary binder and serve notice to counsel.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: CHAIN OF CUSTODY HISTORY & CRYPTOGRAPHIC LEDGER */}
          {(activeTab === 'all' || activeTab === 'custody') && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-4 shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-blue-100 text-blue-700">
                    <History className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                      Chain of Custody History & Audit Ledger
                    </h4>
                    <p className="text-[10px] text-slate-500">
                      Cryptographically verified tamper-proof audit trail for court admissibility
                    </p>
                  </div>
                </div>

                <span className="text-[10px] font-mono font-bold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                  {document.chainOfCustody?.length || 1} Events Logged
                </span>
              </div>

              {/* SHA-256 Hash Card */}
              <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-700 flex items-center gap-1">
                    <KeyRound className="w-3 h-3 text-blue-600" />
                    Cryptographic SHA-256 Checksum:
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyHash}
                    className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1 text-[10px]"
                  >
                    {copiedHash ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-600" />
                        <span className="text-emerald-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy Hash</span>
                      </>
                    )}
                  </button>
                </div>
                <div className="p-2 bg-slate-50 rounded border border-slate-200 font-mono text-[10px] text-slate-800 break-all select-all">
                  {document.custodyHash || `SHA256: 8f3c7a912e5d944bc0891d21e89b41a3_${document.id}`}
                </div>
              </div>

              {/* Chronological Custody Event Timeline */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                  Chronological Transfer & Authentication Log:
                </span>

                <div className="bg-white border border-slate-200 rounded-xl p-3.5">
                  {document.chainOfCustody && document.chainOfCustody.length > 0 ? (
                    <div className="relative pl-4 space-y-3.5 before:absolute before:left-1.5 before:top-2.5 before:bottom-2.5 before:w-0.5 before:bg-slate-200">
                      {document.chainOfCustody.map((event: DocumentCustodyEvent, idx: number) => {
                        const isVerifiedEvent = event.action === 'Marked Verified';
                        const isReviewEvent = event.action === 'Flagged for Review';
                        const isTransfer = event.action === 'Transferred';

                        return (
                          <div key={event.id || idx} className="relative text-xs space-y-0.5">
                            {/* Circle Node */}
                            <div
                              className={`absolute -left-[19px] top-1 w-2.5 h-2.5 rounded-full ring-2 ring-white ${
                                isVerifiedEvent
                                  ? 'bg-emerald-500 ring-emerald-100'
                                  : isReviewEvent
                                  ? 'bg-amber-500 ring-amber-100'
                                  : isTransfer
                                  ? 'bg-blue-500 ring-blue-100'
                                  : 'bg-slate-400'
                              }`}
                            />

                            <div className="flex flex-wrap items-center justify-between gap-1">
                              <span
                                className={`font-bold text-xs ${
                                  isVerifiedEvent
                                    ? 'text-emerald-800'
                                    : isReviewEvent
                                    ? 'text-amber-800'
                                    : 'text-slate-800'
                                }`}
                              >
                                {event.action}
                              </span>
                              <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                                <Clock className="w-3 h-3 text-slate-400" />
                                {event.timestamp}
                              </span>
                            </div>

                            <p className="text-[11px] text-slate-600">
                              By: <strong className="text-slate-800">{event.performedBy}</strong>
                            </p>

                            {event.note && (
                              <p className="text-[11px] text-slate-600 italic bg-slate-50 p-2 rounded border border-slate-200 mt-1">
                                "{event.note}"
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="text-xs text-slate-500 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-700">Initial Deposit Ingestion</span>
                        <span className="font-mono text-[10px]">{document.uploadedAt}</span>
                      </div>
                      <p className="text-[11px]">
                        Uploaded by <strong>{document.uploadedBy}</strong> directly into matter vault.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Add Custody Note Action Form */}
              <div className="pt-1">
                {isAddingCustodyNote ? (
                  <form
                    onSubmit={handleAddCustodyNoteSubmit}
                    className="p-3 bg-white border border-blue-200 rounded-xl space-y-2.5 shadow-xs"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">
                        Append Chain of Custody Entry:
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsAddingCustodyNote(false)}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <textarea
                      rows={2}
                      required
                      value={customCustodyNote}
                      onChange={(e) => setCustomCustodyNote(e.target.value)}
                      placeholder="e.g. Received certified notarization from court clerk, verified SHA-256 seal against forensic image..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">
                        Attributed to current session counsel ({userRole})
                      </span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setIsAddingCustodyNote(false)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-xs"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={!customCustodyNote.trim()}
                          className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-bold disabled:opacity-50"
                        >
                          Append to Custody Ledger
                        </button>
                      </div>
                    </div>
                  </form>
                ) : (
                  <button
                    type="button"
                    onClick={() => setIsAddingCustodyNote(true)}
                    className="w-full py-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5 text-blue-600" />
                    <span>Log Custody Event / Transfer Note</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* SECTION 3: RAW PREVIEW & ENCRYPTION ENVELOPE */}
          {(activeTab === 'all' || activeTab === 'metadata') && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3.5 shadow-2xs">
              <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                <span className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-blue-600" />
                  Vault Storage & Metadata Envelope
                </span>
                <span className="font-mono text-slate-500 text-[11px]">{document.fileSize}</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2 bg-white rounded border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Uploaded Date:</span>
                  <span className="font-medium text-slate-800">{document.uploadedAt}</span>
                </div>
                <div className="p-2 bg-white rounded border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Ingested By:</span>
                  <span className="font-medium text-slate-800">{document.uploadedBy}</span>
                </div>
                <div className="p-2 bg-white rounded border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Version:</span>
                  <span className="font-mono font-medium text-slate-800">v{document.version || '1.0'}</span>
                </div>
                <div className="p-2 bg-white rounded border border-slate-200">
                  <span className="text-slate-400 block text-[10px]">Access Control:</span>
                  <span className="font-medium text-emerald-700">AES-256 Privileged</span>
                </div>
              </div>

              {/* Simulated Raw Document Text Viewer */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-700 flex items-center gap-1">
                    <FileText className="w-3 h-3 text-slate-500" />
                    Simulated Exhibit Document Excerpt:
                  </span>
                  <span className="text-slate-400 text-[10px]">Federal Court Format</span>
                </div>

                <pre className="p-3 bg-slate-900 text-slate-200 rounded-lg font-mono text-[10px] leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap select-text border border-slate-800">
                  {sampleDocumentPreview}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Panel Footer Actions */}
        <div className="p-3.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-1 text-[11px] text-slate-500">
            <Shield className="w-3.5 h-3.5 text-blue-600" />
            <span className="hidden sm:inline">Court-admissible custody ledger</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyHash}
              className="px-3 py-1.5 bg-white hover:bg-slate-200 text-slate-700 rounded-lg font-semibold text-xs border border-slate-200 transition"
              title="Copy cryptographic hash"
            >
              {copiedHash ? 'Hash Copied!' : 'Copy Hash'}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-bold text-xs shadow-xs transition"
            >
              Close Panel
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
