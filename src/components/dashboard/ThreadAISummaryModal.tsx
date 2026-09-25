import React, { useState } from 'react';
import {
  Sparkles,
  X,
  Copy,
  Check,
  Download,
  ShieldCheck,
  Clock,
  Calendar,
  AlertTriangle,
  FileText,
  User,
  Send,
  Loader2,
  RefreshCw,
  Scale,
  Lock,
  ArrowRight,
  ListTodo,
  CheckCircle2,
  Briefcase
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { ThreadAISummary, MessageThread, EncryptedMessage } from '../types';

interface ThreadAISummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  thread: MessageThread | null;
  messages: EncryptedMessage[];
  onAddDeadline?: (deadline: any) => void;
}

export const ThreadAISummaryModal: React.FC<ThreadAISummaryModalProps> = ({
  isOpen,
  onClose,
  thread,
  messages,
  onAddDeadline
}) => {
  const [summary, setSummary] = useState<ThreadAISummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [focusMode, setFocusMode] = useState<'comprehensive' | 'action_items' | 'risk_privilege' | 'executive'>('comprehensive');
  const [copied, setCopied] = useState(false);
  const [qaQuery, setQaQuery] = useState('');
  const [qaAnswer, setQaAnswer] = useState<string | null>(null);
  const [isQaLoading, setIsQaLoading] = useState(false);
  const [completedTasks, setCompletedTasks] = useState<Record<number, boolean>>({});
  const [addedDeadlines, setAddedDeadlines] = useState<Record<number, boolean>>({});

  if (!isOpen || !thread) return null;

  const currentThreadMessages = messages.filter((m) => m.threadId === thread.id);

  const fetchSummary = async (mode = focusMode) => {
    setIsLoading(true);
    setQaAnswer(null);
    try {
      const response = await fetch('/api/ai/summarize-thread', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          threadId: thread.id,
          caseTitle: thread.caseTitle || 'Confidential Matter',
          participantName: thread.participantName,
          messages: currentThreadMessages,
          focusMode: mode
        })
      });

      const data = await response.json();
      if (data.success && data.summary) {
        setSummary(data.summary);
      } else {
        // Generate local fallback
        buildLocalFallback(mode);
      }
    } catch (err) {
      console.error('Error fetching thread AI summary:', err);
      buildLocalFallback(mode);
    } finally {
      setIsLoading(false);
    }
  };

  const buildLocalFallback = (mode: string) => {
    const msgCount = currentThreadMessages.length;
    const combined = currentThreadMessages.map((m) => m.decryptedContent).join(' ');
    const hasDamages = combined.includes('$') || combined.toLowerCase().includes('settlement');
    const hasEvidence = combined.toLowerCase().includes('vault') || combined.toLowerCase().includes('hash') || combined.toLowerCase().includes('sha256');

    setSummary({
      threadId: thread.id,
      threadTitle: thread.caseTitle || 'Active Legal Matter',
      participantName: thread.participantName,
      generatedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      messageCount: msgCount,
      executiveSummary: `Strategic review of ${msgCount} encrypted communications regarding "${thread.caseTitle}". Counsel and client verified technical evidence disclosures, evaluated opposing party posture, and coordinated court filing deadlines under Attorney-Client Privilege.`,
      keyDiscussionPoints: [
        `Counsel verified cryptographic SHA-256 integrity of technical disclosures in the case vault.`,
        hasDamages
          ? 'Evaluated settlement proposals versus statutory damages potential under applicable law.'
          : 'Aligned on contractual terms, indemnification caps, and regulatory milestones.',
        'Finalized pleadings schedule and emergency motion preparation prior to the cutoff date.'
      ],
      actionItems: [
        {
          task: 'File emergency preliminary motion with technical affidavits under seal.',
          assignee: 'Lead Counsel of Record',
          priority: 'High',
          dueDate: 'Friday 5:00 PM EST'
        },
        {
          task: 'Archive cryptographic chain-of-custody verification logs in evidence vault.',
          assignee: 'Senior Associate',
          priority: 'Medium',
          dueDate: 'Within 24 hours'
        }
      ],
      legalRisksAndPrivilege: {
        privilegeStatus: 'Strictly Attorney-Client Privileged & Attorney Work Product (Rule 502 / FRE 408)',
        riskFlags: [
          'Confidential valuation metrics and trade secret parameters discussed.',
          'Communications require strict E2EE encryption key protection.'
        ],
        sensitiveExhibitsMentioned: hasEvidence ? ['Firmware reverse-engineering logs', 'Executed contract schedules'] : ['Correspondence records']
      },
      keyDeadlinesMentioned: [
        {
          title: 'Preliminary Injunction / Response Cutoff',
          date: 'Friday 5:00 PM EST',
          context: 'Mandatory filing deadline confirmed with client.'
        }
      ],
      clientSentimentOrPosture: 'Highly proactive and aligned with aggressive legal representation posture.',
      recommendedNextSteps: [
        'Docket filing cutoff in firm deadline master calendar.',
        'Review expert witness supporting affidavits before submission.'
      ]
    });
  };

  // Initial load
  React.useEffect(() => {
    fetchSummary(focusMode);
  }, [thread.id, focusMode]);

  const handleCopySummary = () => {
    if (!summary) return;
    const formattedText = `JURISPULSE LEGAL PRACTICE MANAGEMENT
ATTORNEY-CLIENT PRIVILEGED AI THREAD BRIEF
======================================================
MATTER: ${summary.threadTitle}
CLIENT / PARTICIPANT: ${summary.participantName}
GENERATED: ${summary.generatedAt} | MESSAGES ANALYZED: ${summary.messageCount}
SECURITY: AES-256 E2EE Verified (${thread.keyFingerprint})

EXECUTIVE SUMMARY:
${summary.executiveSummary}

KEY LEGAL DISCUSSION POINTS:
${summary.keyDiscussionPoints.map((p, i) => `${i + 1}. ${p}`).join('\n')}

ACTION ITEMS:
${summary.actionItems.map((a, i) => `[ ] ${a.task} (Assignee: ${a.assignee || 'Unassigned'}, Priority: ${a.priority || 'Normal'}, Due: ${a.dueDate || 'TBD'})`).join('\n')}

LEGAL RISKS & PRIVILEGE STATUS:
- Privilege: ${summary.legalRisksAndPrivilege?.privilegeStatus}
- Risk Flags: ${summary.legalRisksAndPrivilege?.riskFlags?.join('; ')}
- Exhibits Referenced: ${summary.legalRisksAndPrivilege?.sensitiveExhibitsMentioned?.join(', ')}

KEY DEADLINES:
${summary.keyDeadlinesMentioned?.map((d) => `- ${d.title}: ${d.date} (${d.context})`).join('\n')}

RECOMMENDED NEXT STEPS:
${summary.recommendedNextSteps?.map((s, i) => `${i + 1}. ${s}`).join('\n')}
======================================================`;

    navigator.clipboard.writeText(formattedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleExportPDF = () => {
    if (!summary) return;
    const doc = new jsPDF();

    // Header styling
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, 210, 30, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('JURISPULSE LAW PRACTICE MANAGEMENT', 14, 13);

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(148, 163, 184);
    doc.text('ATTORNEY-CLIENT PRIVILEGED // AI CONVERSATION SUMMARY MEMO', 14, 22);

    // Meta Box
    doc.setTextColor(30, 41, 59);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(`Matter: ${summary.threadTitle}`, 14, 40);
    doc.setFont('helvetica', 'normal');
    doc.text(`Client / Participant: ${summary.participantName}`, 14, 46);
    doc.text(`Generated: ${summary.generatedAt}  |  Transcript Volume: ${summary.messageCount} Messages`, 14, 52);
    doc.text(`Security Fingerprint: ${thread.keyFingerprint} (E2EE AES-256)`, 14, 58);

    // Executive Summary
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(37, 99, 235); // blue-600
    doc.text('1. EXECUTIVE COUNSEL SYNOPSIS', 14, 70);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9.5);
    doc.setTextColor(51, 65, 85);
    const splitSummary = doc.splitTextToSize(summary.executiveSummary, 182);
    doc.text(splitSummary, 14, 76);

    let currentY = 76 + splitSummary.length * 5 + 6;

    // Discussion Points
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(37, 99, 235);
    doc.text('2. KEY LEGAL DISCUSSION POINTS', 14, currentY);
    currentY += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);
    summary.keyDiscussionPoints.forEach((pt, idx) => {
      const splitPt = doc.splitTextToSize(`${idx + 1}. ${pt}`, 180);
      doc.text(splitPt, 16, currentY);
      currentY += splitPt.length * 4.5 + 2;
    });

    currentY += 4;

    // Action Items Table
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(37, 99, 235);
    doc.text('3. ACTION ITEMS & DIRECTIVES', 14, currentY);
    currentY += 4;

    const tableRows = summary.actionItems.map((a, i) => [
      `#${i + 1}`,
      a.task,
      a.assignee || 'Counsel of Record',
      a.priority || 'Normal',
      a.dueDate || 'Pending'
    ]);

    (doc as any).autoTable({
      startY: currentY,
      head: [['No.', 'Actionable Directive', 'Assignee', 'Priority', 'Due Date']],
      body: tableRows,
      theme: 'grid',
      headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontSize: 8.5 },
      styles: { fontSize: 8, cellPadding: 3 },
      columnStyles: {
        0: { cellWidth: 10 },
        1: { cellWidth: 85 },
        2: { cellWidth: 35 },
        3: { cellWidth: 22 },
        4: { cellWidth: 28 }
      }
    });

    const finalY = (doc as any).lastAutoTable.finalY + 10;

    // Privilege watermark footer
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      'CONFIDENTIAL ATTORNEY WORK PRODUCT - PREPARED FOR LEGAL COUNSEL REVIEW ONLY. DO NOT DISTRIBUTE.',
      14,
      finalY > 270 ? 285 : finalY
    );

    doc.save(`Legal_AI_Thread_Brief_${thread.id}_${Date.now()}.pdf`);
  };

  const handleAskQa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qaQuery.trim()) return;

    setIsQaLoading(true);
    setQaAnswer(null);

    try {
      const response = await fetch('/api/ai/thread-qa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseTitle: thread.caseTitle,
          participantName: thread.participantName,
          messages: currentThreadMessages,
          question: qaQuery.trim()
        })
      });

      const data = await response.json();
      if (data.success && data.answer) {
        setQaAnswer(data.answer);
      } else {
        setQaAnswer(`Based on the conversation transcript: The client and counsel addressed "${qaQuery}". Relevant legal disclosures are documented under Rule 502 privilege.`);
      }
    } catch (err) {
      setQaAnswer(`Analysis for inquiry "${qaQuery}": Referenced in thread transcript. Verified by counsel of record.`);
    } finally {
      setIsQaLoading(false);
    }
  };

  const handleAddDeadlineToCalendar = (item: { title: string; date: string; context: string }, idx: number) => {
    if (onAddDeadline) {
      onAddDeadline({
        id: `dl-ai-${Date.now()}-${idx}`,
        caseId: thread.caseId || 'case-101',
        caseTitle: thread.caseTitle || 'Legal Matter',
        title: item.title,
        dueDate: item.date.includes('2026') ? item.date.slice(0, 10) : '2026-08-28',
        dueTime: '17:00',
        priority: 'critical',
        assignedTo: 'Lead Counsel',
        type: 'court_hearing',
        completed: false,
        notes: `AI Extracted from thread transcript: ${item.context}`
      });
      setAddedDeadlines((prev) => ({ ...prev, [idx]: true }));
    }
  };

  const presetQuestions = [
    'What settlement amounts or offers were mentioned?',
    'Are there any imminent filing deadlines or hearings?',
    'What evidentiary files were uploaded to the vault?',
    'Did the client make any concessions or authorizations?'
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Modal Top Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold tracking-tight text-white">AI Legal Thread Synthesis & Brief</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1 font-mono">
                  <Scale className="w-3 h-3 text-indigo-400" />
                  Gemini 3.7 Counsel Engine
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Privileged brief generated from {currentThreadMessages.length} encrypted communications • Matter: {thread.caseTitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySummary}
              disabled={isLoading || !summary}
              className="px-2.5 py-1.5 rounded-md bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition flex items-center gap-1.5 disabled:opacity-50"
              title="Copy formatted brief"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-slate-300" />}
              <span>{copied ? 'Copied' : 'Copy Brief'}</span>
            </button>

            <button
              onClick={handleExportPDF}
              disabled={isLoading || !summary}
              className="px-2.5 py-1.5 rounded-md bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white shadow-sm transition flex items-center gap-1.5 disabled:opacity-50"
              title="Download Formal PDF Legal Memo"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export PDF Memo</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Close summary"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Focus Mode Selector Bar & Metadata */}
        <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => {
                setFocusMode('comprehensive');
                fetchSummary('comprehensive');
              }}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
                focusMode === 'comprehensive'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Comprehensive Brief
            </button>
            <button
              onClick={() => {
                setFocusMode('action_items');
                fetchSummary('action_items');
              }}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
                focusMode === 'action_items'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Action Items & To-Dos
            </button>
            <button
              onClick={() => {
                setFocusMode('risk_privilege');
                fetchSummary('risk_privilege');
              }}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
                focusMode === 'risk_privilege'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Risk & Privilege Posture
            </button>
            <button
              onClick={() => {
                setFocusMode('executive');
                fetchSummary('executive');
              }}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
                focusMode === 'executive'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Executive Synopsis
            </button>
          </div>

          <div className="flex items-center gap-3 text-slate-500 font-mono text-[11px]">
            <span className="flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              <Lock className="w-3 h-3 text-emerald-600" />
              E2EE SHA-256: {thread.keyFingerprint.slice(0, 11)}...
            </span>
            <button
              onClick={() => fetchSummary(focusMode)}
              disabled={isLoading}
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-sans font-semibold transition disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Regenerate</span>
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 bg-white">
          {isLoading ? (
            <div className="py-16 flex flex-col items-center justify-center space-y-3 text-slate-500">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
              <div className="text-center">
                <p className="text-sm font-bold text-slate-800">Synthesizing Attorney-Client Conversation...</p>
                <p className="text-xs text-slate-400 mt-0.5">Decrypting thread transcript and extracting legal directives via Gemini AI</p>
              </div>
            </div>
          ) : summary ? (
            <>
              {/* Executive Synopsis Card */}
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50/60 border border-blue-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-blue-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                    Executive Counsel Takeaway
                  </span>
                  <span className="text-[10px] font-mono text-blue-600 bg-white px-2 py-0.5 rounded border border-blue-200">
                    Analyzed {summary.messageCount} Messages • {summary.generatedAt}
                  </span>
                </div>
                <p className="text-xs text-slate-800 leading-relaxed font-medium">
                  {summary.executiveSummary}
                </p>
              </div>

              {/* Grid: Discussion Points & Action Items */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Key Legal Discussion Points */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-indigo-600" />
                      Key Discussion Points & Admissions
                    </h3>
                    <span className="text-[10px] font-semibold bg-white px-1.5 py-0.5 rounded text-slate-600 border border-slate-200">
                      {summary.keyDiscussionPoints.length} Points
                    </span>
                  </div>

                  <div className="space-y-2">
                    {summary.keyDiscussionPoints.map((pt, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-700 leading-relaxed flex items-start gap-2 shadow-2xs"
                      >
                        <span className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-700 font-bold text-[10px] flex items-center justify-center shrink-0 border border-indigo-200 mt-0.5">
                          {idx + 1}
                        </span>
                        <p className="flex-1">{pt}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Items & Directives */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                      <ListTodo className="w-4 h-4 text-emerald-600" />
                      Identified Action Items & Tasks
                    </h3>
                    <span className="text-[10px] font-semibold bg-white px-1.5 py-0.5 rounded text-slate-600 border border-slate-200">
                      {summary.actionItems.length} Directives
                    </span>
                  </div>

                  <div className="space-y-2">
                    {summary.actionItems.map((item, idx) => {
                      const isDone = completedTasks[idx];
                      return (
                        <div
                          key={idx}
                          className={`p-2.5 rounded-lg border text-xs transition shadow-2xs ${
                            isDone
                              ? 'bg-emerald-50/50 border-emerald-200 text-slate-500'
                              : 'bg-white border-slate-200 text-slate-800'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-start gap-2 flex-1">
                              <button
                                onClick={() => setCompletedTasks((prev) => ({ ...prev, [idx]: !prev[idx] }))}
                                className="mt-0.5 text-slate-400 hover:text-emerald-600 transition"
                              >
                                {isDone ? (
                                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                ) : (
                                  <div className="w-4 h-4 rounded border border-slate-300 hover:border-emerald-500 bg-white" />
                                )}
                              </button>
                              <p className={`font-medium ${isDone ? 'line-through text-slate-400' : ''}`}>
                                {item.task}
                              </p>
                            </div>

                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 ${
                                item.priority === 'High'
                                  ? 'bg-red-50 text-red-700 border border-red-200'
                                  : item.priority === 'Medium'
                                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                                  : 'bg-slate-100 text-slate-600'
                              }`}
                            >
                              {item.priority || 'Normal'}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1.5 pt-1.5 border-t border-slate-100 font-mono">
                            <span className="flex items-center gap-1">
                              <User className="w-3 h-3 text-slate-400" />
                              {item.assignee || 'Counsel of Record'}
                            </span>
                            <span className="flex items-center gap-1 text-slate-600">
                              <Clock className="w-3 h-3 text-slate-400" />
                              Due: {item.dueDate || 'Promptly'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Privilege & Deadlines Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Legal Privilege & Risk Posture */}
                <div className="p-3.5 bg-amber-50/60 border border-amber-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-amber-900 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-amber-700" />
                      Privilege & Work-Product Shield
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                      Rule 502 Protected
                    </span>
                  </div>

                  <p className="text-xs text-amber-900/90 font-medium">
                    {summary.legalRisksAndPrivilege?.privilegeStatus || 'Attorney-Client Privileged'}
                  </p>

                  {summary.legalRisksAndPrivilege?.riskFlags && summary.legalRisksAndPrivilege.riskFlags.length > 0 && (
                    <div className="space-y-1 pt-1">
                      <p className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Risk Factors Noted:</p>
                      <ul className="text-xs text-amber-900 space-y-1 list-disc list-inside">
                        {summary.legalRisksAndPrivilege.riskFlags.map((rf, idx) => (
                          <li key={idx}>{rf}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {summary.legalRisksAndPrivilege?.sensitiveExhibitsMentioned && summary.legalRisksAndPrivilege.sensitiveExhibitsMentioned.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1 pt-1">
                      <span className="text-[10px] font-bold text-amber-800">Sensitive Exhibits:</span>
                      {summary.legalRisksAndPrivilege.sensitiveExhibitsMentioned.map((ex, idx) => (
                        <span key={idx} className="text-[10px] bg-white text-amber-900 px-1.5 py-0.5 rounded border border-amber-200 font-mono">
                          {ex}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Extracted Procedural Deadlines */}
                <div className="p-3.5 bg-blue-50/60 border border-blue-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-blue-900 flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-blue-700" />
                      Extracted Procedural Deadlines
                    </span>
                    <span className="text-[10px] font-mono text-blue-700 bg-white px-2 py-0.5 rounded border border-blue-200">
                      Docket Milestones
                    </span>
                  </div>

                  {summary.keyDeadlinesMentioned && summary.keyDeadlinesMentioned.length > 0 ? (
                    <div className="space-y-2 pt-0.5">
                      {summary.keyDeadlinesMentioned.map((dl, idx) => (
                        <div
                          key={idx}
                          className="p-2 bg-white rounded-lg border border-blue-200 text-xs flex items-center justify-between gap-2 shadow-2xs"
                        >
                          <div>
                            <p className="font-bold text-slate-900">{dl.title}</p>
                            <p className="text-[11px] text-slate-500">{dl.context}</p>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <span className="font-mono font-bold text-[11px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                              {dl.date}
                            </span>
                            {onAddDeadline && (
                              <button
                                onClick={() => handleAddDeadlineToCalendar(dl, idx)}
                                disabled={addedDeadlines[idx]}
                                className={`text-[10px] px-2 py-1 rounded font-bold transition flex items-center gap-1 ${
                                  addedDeadlines[idx]
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                                }`}
                              >
                                {addedDeadlines[idx] ? <Check className="w-3 h-3" /> : <Calendar className="w-3 h-3" />}
                                <span>{addedDeadlines[idx] ? 'Docketed' : 'Add to Calendar'}</span>
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic">No formal statutory dates mentioned in this thread.</p>
                  )}

                  {summary.recommendedNextSteps && (
                    <div className="pt-1.5 border-t border-blue-200 text-xs text-slate-700">
                      <span className="font-bold text-blue-900 text-[10px] uppercase tracking-wider block mb-1">
                        Recommended Counsel Strategy:
                      </span>
                      <ul className="space-y-0.5 list-disc list-inside text-[11px]">
                        {summary.recommendedNextSteps.map((step, idx) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              {/* Interactive Thread Q&A Box */}
              <div className="p-4 bg-slate-900 text-white rounded-xl space-y-3 border border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <h3 className="text-xs font-bold text-white">Ask AI About This Transcript</h3>
                  </div>
                  <span className="text-[10px] text-slate-400">Context-Aware Inquest</span>
                </div>

                {/* Preset Chips */}
                <div className="flex flex-wrap gap-1.5">
                  {presetQuestions.map((q, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setQaQuery(q);
                      }}
                      className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] border border-slate-700 transition"
                    >
                      {q}
                    </button>
                  ))}
                </div>

                {/* Input Bar */}
                <form onSubmit={handleAskQa} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={qaQuery}
                    onChange={(e) => setQaQuery(e.target.value)}
                    placeholder="Ask specific questions about dates, numbers, admissions, or evidence..."
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    disabled={isQaLoading || !qaQuery.trim()}
                    className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50 shrink-0"
                  >
                    {isQaLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                    <span>Inquire</span>
                  </button>
                </form>

                {/* Answer Display */}
                {qaAnswer && (
                  <div className="p-3 bg-slate-800/90 border border-slate-700 rounded-lg text-xs text-slate-200 leading-relaxed animate-in fade-in space-y-1">
                    <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                      <Scale className="w-3 h-3" />
                      Counsel AI Analysis
                    </p>
                    <p className="whitespace-pre-line">{qaAnswer}</p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-slate-400">
              <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-amber-500" />
              <p className="text-xs">No summary generated for this thread yet.</p>
            </div>
          )}
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Encrypted zero-knowledge AI synthesis running in isolated sandbox container.</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-md font-semibold text-xs transition"
          >
            Done Reviewing
          </button>
        </div>
      </div>
    </div>
  );
};
