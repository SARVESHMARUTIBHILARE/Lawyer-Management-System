import React, { useState, useEffect, useMemo } from 'react';
import {
  Mail,
  Send,
  Copy,
  Check,
  ExternalLink,
  FileText,
  Sparkles,
  Clock,
  AlertTriangle,
  Building2,
  DollarSign,
  Calendar,
  ChevronLeft,
  ChevronRight,
  X,
  ShieldCheck,
  History,
  Eye,
  Edit3,
  SlidersHorizontal,
  CreditCard,
  Building,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { Invoice, CaseFile, ReminderTone, InvoiceReminderLog } from '../types';
import {
  generateOverdueEmailDraft,
  calculateDaysOverdue,
  generateMailtoLink,
  DEFAULT_FIRM_WIRE
} from '../utils/reminderEmailDrafts';
import { exportInvoicePDF } from '../utils/pdfExport';

interface OverdueReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoices: Invoice[];
  cases: CaseFile[];
  initialInvoiceId?: string;
  senderName?: string;
  senderTitle?: string;
  senderEmail?: string;
  onSendReminder: (reminder: InvoiceReminderLog) => void;
}

export function OverdueReminderModal({
  isOpen,
  onClose,
  invoices,
  cases,
  initialInvoiceId,
  senderName = 'Eleanor Vance, Esq.',
  senderTitle = 'Managing Partner, Commercial Litigation',
  senderEmail = 'e.vance@vcs-law.com',
  onSendReminder
}: OverdueReminderModalProps) {
  // Filter all candidate past-due or uncollected invoices
  const overdueInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const balance = inv.totalAmount - inv.amountPaid;
      return balance > 0 && inv.status !== 'draft';
    });
  }, [invoices]);

  // Current active index in the modal
  const [currentIndex, setCurrentIndex] = useState(0);

  // Initialize selected invoice when opening
  useEffect(() => {
    if (isOpen) {
      if (initialInvoiceId) {
        const foundIdx = overdueInvoices.findIndex((inv) => inv.id === initialInvoiceId);
        if (foundIdx >= 0) {
          setCurrentIndex(foundIdx);
        } else {
          setCurrentIndex(0);
        }
      } else {
        setCurrentIndex(0);
      }
    }
  }, [isOpen, initialInvoiceId, overdueInvoices]);

  const activeInvoice = overdueInvoices[currentIndex] || invoices[0];
  const activeCase = useMemo(() => {
    return cases.find((c) => c.id === activeInvoice?.caseId);
  }, [cases, activeInvoice]);

  const daysOverdue = useMemo(() => {
    return calculateDaysOverdue(activeInvoice?.dueDate || '2026-08-01', '2026-08-23');
  }, [activeInvoice]);

  const balanceDue = activeInvoice ? activeInvoice.totalAmount - activeInvoice.amountPaid : 0;

  // Form State
  const [selectedTone, setSelectedTone] = useState<ReminderTone>('formal_standard');
  const [includeWire, setIncludeWire] = useState(true);
  const [includeLineItems, setIncludeLineItems] = useState(true);
  const [includePortalLink, setIncludePortalLink] = useState(true);
  const [includeLatePenalty, setIncludeLatePenalty] = useState(false);
  const [customDeadline, setCustomDeadline] = useState('');
  const [customNotes, setCustomNotes] = useState('');

  // Editable Form Fields
  const [toField, setToField] = useState('');
  const [ccField, setCcField] = useState('');
  const [subjectField, setSubjectField] = useState('');
  const [bodyField, setBodyField] = useState('');

  // UI state
  const [activeTab, setActiveTab] = useState<'editor' | 'preview' | 'history'>('editor');
  const [copied, setCopied] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [aiPolishing, setAiPolishing] = useState<string | null>(null);

  // Determine appropriate initial tone when active invoice changes
  useEffect(() => {
    if (!activeInvoice) return;

    let defaultTone: ReminderTone = 'courteous_first';
    if (activeCase && activeCase.retainerRemaining <= 0) {
      defaultTone = 'retainer_depletion';
    } else if (daysOverdue > 21) {
      defaultTone = 'urgent_final';
    } else if (daysOverdue > 7) {
      defaultTone = 'formal_standard';
    }

    setSelectedTone(defaultTone);
    setIncludeLatePenalty(daysOverdue > 21);

    // Generate initial draft
    const draft = generateOverdueEmailDraft({
      invoice: activeInvoice,
      caseFile: activeCase,
      tone: defaultTone,
      senderName,
      senderTitle,
      senderEmail,
      referenceDate: '2026-08-23',
      includeWireDetails: true,
      includeLineItems: true,
      includePaymentPortalLink: true,
      includeLatePenaltyWarning: daysOverdue > 21,
      customDueDateDeadline: customDeadline,
      customNotes
    });

    setToField(draft.to);
    setCcField(draft.cc);
    setSubjectField(draft.subject);
    setBodyField(draft.body);
  }, [activeInvoice, activeCase, daysOverdue, senderName, senderTitle, senderEmail]);

  // Re-generate draft when user changes tone or options (unless user is heavily editing)
  const handleRegenerateDraft = (newTone?: ReminderTone) => {
    if (!activeInvoice) return;
    const toneToUse = newTone || selectedTone;

    const draft = generateOverdueEmailDraft({
      invoice: activeInvoice,
      caseFile: activeCase,
      tone: toneToUse,
      senderName,
      senderTitle,
      senderEmail,
      referenceDate: '2026-08-23',
      includeWireDetails: includeWire,
      includeLineItems: includeLineItems,
      includePaymentPortalLink: includePortalLink,
      includeLatePenaltyWarning: includeLatePenalty,
      customDueDateDeadline: customDeadline,
      customNotes
    });

    setToField(draft.to);
    setCcField(draft.cc);
    setSubjectField(draft.subject);
    setBodyField(draft.body);
  };

  const handleToneChange = (tone: ReminderTone) => {
    setSelectedTone(tone);
    handleRegenerateDraft(tone);
  };

  // AI Quick Refinements
  const handleAiRefinement = (action: 'more_urgent' | 'diplomatic' | 'concise' | 'payment_plan') => {
    setAiPolishing(action);
    setTimeout(() => {
      let refined = bodyField;

      if (action === 'more_urgent') {
        setSelectedTone('urgent_final');
        refined = `*** FINAL DEMAND FOR IMMEDIATE REMITTANCE ***\n\n` +
          `Dear ${activeInvoice.clientName},\n\n` +
          `This serves as formal notice regarding delinquent Invoice ${activeInvoice.invoiceNumber} ($${balanceDue.toLocaleString()} balance due), which is now ${daysOverdue} days past due.\n\n` +
          `Please note that under Bar ethical rules and our engagement terms, active litigation staffing and court filings on "${activeInvoice.caseTitle}" will be halted if payment is not confirmed within 48 hours.\n\n` +
          (includeWire ? `\n--- Wire Transfer Instructions ---\nBank: ${DEFAULT_FIRM_WIRE.bankName}\nRouting: ${DEFAULT_FIRM_WIRE.routingNumber}\nAccount: ${DEFAULT_FIRM_WIRE.accountNumber}\n` : '') +
          `\nPlease confirm payment dispatch immediately.\n\nSincerely,\n${senderName}\n${senderTitle}\nVance, Chen & Sterling LLP`;
        setSubjectField(`URGENT: Final Demand for Immediate Remittance - ${activeInvoice.invoiceNumber} (${activeInvoice.caseTitle})`);
      } else if (action === 'diplomatic') {
        setSelectedTone('courteous_first');
        refined = `Dear ${activeInvoice.clientName},\n\n` +
          `We hope your business is thriving. We are writing to share a brief update and courtesy check-in regarding Invoice ${activeInvoice.invoiceNumber} for work on "${activeInvoice.caseTitle}".\n\n` +
          `Our records show an open balance of $${balanceDue.toLocaleString()} that became due on ${activeInvoice.dueDate}. We greatly appreciate your partnership and want to ensure our invoices are reaching the right contact on your accounts team.\n\n` +
          `If there are any questions regarding our filings or billing statements, please reach out to me directly at any time.\n\n` +
          `Warm regards,\n${senderName}\n${senderTitle}`;
        setSubjectField(`Checking In: Statement of Account for ${activeInvoice.caseTitle} (Inv ${activeInvoice.invoiceNumber})`);
      } else if (action === 'concise') {
        refined = `Dear ${activeInvoice.clientName},\n\n` +
          `Summary of Past-Due Account:\n` +
          `• Matter: ${activeInvoice.caseTitle}\n` +
          `• Invoice: ${activeInvoice.invoiceNumber} (Due ${activeInvoice.dueDate}, ${daysOverdue} days past due)\n` +
          `• Total Invoiced: $${activeInvoice.totalAmount.toLocaleString()}\n` +
          `• Balance Due: $${balanceDue.toLocaleString()}\n\n` +
          `Please remit the outstanding balance at your earliest convenience to maintain active account standing.\n\n` +
          (includeWire ? `Wire: ${DEFAULT_FIRM_WIRE.bankName} | Routing: ${DEFAULT_FIRM_WIRE.routingNumber} | Acct: ${DEFAULT_FIRM_WIRE.accountNumber}\n\n` : '') +
          `Thank you,\n${senderName}\nVance, Chen & Sterling LLP`;
        setSubjectField(`Summary of Outstanding Balance: ${activeInvoice.invoiceNumber} - $${balanceDue.toLocaleString()}`);
      } else if (action === 'payment_plan') {
        refined = `Dear ${activeInvoice.clientName},\n\n` +
          `Re: Structured Settlement & Payment Plan Options for Invoice ${activeInvoice.invoiceNumber}\n` +
          `Matter: ${activeInvoice.caseTitle} | Outstanding Balance: $${balanceDue.toLocaleString()}\n\n` +
          `We recognize that corporate cash flow and litigation timing can present periodic challenges. To support your company while ensuring compliance with our retainer guidelines, we are pleased to offer a structured 3-part installment schedule:\n\n` +
          `  1. Installment 1 (40%): $${(balanceDue * 0.4).toLocaleString()} due immediately upon acceptance.\n` +
          `  2. Installment 2 (30%): $${(balanceDue * 0.3).toLocaleString()} due within 15 days.\n` +
          `  3. Installment 3 (30%): $${(balanceDue * 0.3).toLocaleString()} due within 30 days.\n\n` +
          `If this structured arrangement is acceptable, please reply with your confirmation or contact our finance team so we can formalize this agreement.\n\n` +
          `Sincerely,\n${senderName}\n${senderTitle}`;
        setSubjectField(`Payment Plan Proposal: Invoice ${activeInvoice.invoiceNumber} ($${balanceDue.toLocaleString()}) - ${activeInvoice.caseTitle}`);
      }

      setBodyField(refined);
      setAiPolishing(null);
    }, 350);
  };

  // Copy to Clipboard
  const handleCopyClipboard = async () => {
    try {
      const fullText = `To: ${toField}\nCc: ${ccField}\nSubject: ${subjectField}\n\n${bodyField}`;
      await navigator.clipboard.writeText(fullText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  // Open Native Email Client
  const handleOpenMailto = () => {
    const link = generateMailtoLink(toField, ccField, subjectField, bodyField);
    window.open(link, '_blank');
  };

  // Send and Record in System
  const handleSendReminderConfirm = () => {
    if (!activeInvoice) return;
    setIsSending(true);

    let noticeLevelStr: InvoiceReminderLog['noticeLevel'] = '1st Courtesy Notice';
    if (selectedTone === 'urgent_final' || daysOverdue > 21) {
      noticeLevelStr = '3rd Final Notice';
    } else if (selectedTone === 'formal_standard' || daysOverdue > 7) {
      noticeLevelStr = '2nd Formal Demand';
    } else if (selectedTone === 'retainer_depletion') {
      noticeLevelStr = 'Retainer Depletion';
    }

    const reminderLog: InvoiceReminderLog = {
      id: `rem-${Date.now()}`,
      invoiceId: activeInvoice.id,
      invoiceNumber: activeInvoice.invoiceNumber,
      sentAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      sentBy: senderName,
      recipientEmail: toField,
      recipientName: activeInvoice.clientName,
      subject: subjectField,
      tone: selectedTone,
      body: bodyField,
      balanceDue,
      deliveryMethod: 'in_app_dispatch',
      noticeLevel: noticeLevelStr
    };

    setTimeout(() => {
      onSendReminder(reminderLog);
      setIsSending(false);

      // If there are more overdue invoices, advance to next
      if (currentIndex < overdueInvoices.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        onClose();
      }
    }, 400);
  };

  if (!isOpen || !activeInvoice) return null;

  const pastReminders = activeInvoice.reminderHistory || [];

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-5xl my-auto overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="px-5 py-3.5 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-600/30 text-blue-400 border border-blue-500/30">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
                  <span>Automatic Overdue Invoice Reminder Drafter</span>
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {daysOverdue} Days Past Due
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Review, tailor tone, and dispatch formal billing follow-up to client counsel.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Batch Navigation */}
            {overdueInvoices.length > 1 && (
              <div className="flex items-center gap-1.5 bg-slate-800 px-2.5 py-1 rounded-lg border border-slate-700 text-xs">
                <button
                  type="button"
                  onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
                  disabled={currentIndex === 0}
                  className="p-1 rounded hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-transparent text-slate-300"
                  title="Previous overdue invoice"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>
                <span className="font-mono text-[11px] font-semibold text-slate-300 px-1">
                  {currentIndex + 1} of {overdueInvoices.length} Overdue
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentIndex((prev) => Math.min(overdueInvoices.length - 1, prev + 1))}
                  disabled={currentIndex === overdueInvoices.length - 1}
                  className="p-1 rounded hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-transparent text-slate-300"
                  title="Next overdue invoice"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* INVOICE CONTEXT STRIP */}
        <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              <span>{activeInvoice.clientName}</span>
            </div>
            <span className="text-slate-300">•</span>
            <div className="font-mono font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              {activeInvoice.invoiceNumber}
            </div>
            <span className="text-slate-300">•</span>
            <span className="text-slate-600 truncate max-w-xs">{activeInvoice.caseTitle}</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-500">Matured:</span>
              <span className="font-mono font-semibold text-slate-800">{activeInvoice.dueDate}</span>
            </div>
            <div className="flex items-center gap-1.5 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
              <span className="text-amber-800 font-bold">Outstanding AR:</span>
              <span className="font-mono font-bold text-amber-900 text-sm">${balanceDue.toLocaleString()}</span>
            </div>
            <button
              type="button"
              onClick={() => exportInvoicePDF(activeInvoice)}
              className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 rounded border border-slate-200 flex items-center gap-1 font-semibold text-[11px] shadow-2xs"
              title="Download original invoice PDF"
            >
              <FileText className="w-3 h-3 text-blue-600" />
              <span>Invoice PDF</span>
            </button>
          </div>
        </div>

        {/* MAIN BODY WORKBENCH */}
        <div className="flex-1 overflow-y-auto p-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* LEFT COLUMN: Controls & Tone Presets (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            {/* Tone Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600" />
                <span>Reminder Notice Tone</span>
              </label>

              <div className="grid grid-cols-1 gap-1.5">
                {[
                  {
                    id: 'courteous_first',
                    label: 'Courteous Reminder (1st Notice)',
                    desc: 'Friendly, diplomatic check-in (1–7 days overdue)',
                    badgeColor: 'bg-blue-100 text-blue-800'
                  },
                  {
                    id: 'formal_standard',
                    label: 'Formal Past-Due Demand (2nd Notice)',
                    desc: 'Itemized statement & prompt settlement request (8–21 days)',
                    badgeColor: 'bg-amber-100 text-amber-800'
                  },
                  {
                    id: 'urgent_final',
                    label: 'Urgent Pre-Suspension Notice (3rd Notice)',
                    desc: 'Cites Rule 1.16 representation halt & collection warning',
                    badgeColor: 'bg-rose-100 text-rose-800'
                  },
                  {
                    id: 'retainer_depletion',
                    label: 'Evergreen Retainer Depletion Notice',
                    desc: 'Alerts client of trust fund exhaustion & top-up necessity',
                    badgeColor: 'bg-purple-100 text-purple-800'
                  }
                ].map((t) => {
                  const isSelected = selectedTone === t.id;
                  return (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => handleToneChange(t.id as ReminderTone)}
                      className={`text-left p-2.5 rounded-lg border transition flex flex-col gap-0.5 ${
                        isSelected
                          ? 'bg-blue-50/80 border-blue-500 shadow-xs ring-1 ring-blue-500'
                          : 'bg-white border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900">{t.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                      </div>
                      <span className="text-[11px] text-slate-500 leading-tight">{t.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Smart Insertion Options */}
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-2.5">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                Automatic Content Inclusions
              </span>

              <div className="space-y-1.5 text-xs text-slate-700">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={includeWire}
                    onChange={(e) => {
                      setIncludeWire(e.target.checked);
                      setTimeout(() => handleRegenerateDraft(), 50);
                    }}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Include Firm Wire / Trust ACH Info</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={includeLineItems}
                    onChange={(e) => {
                      setIncludeLineItems(e.target.checked);
                      setTimeout(() => handleRegenerateDraft(), 50);
                    }}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Include Itemized Services Summary</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={includePortalLink}
                    onChange={(e) => {
                      setIncludePortalLink(e.target.checked);
                      setTimeout(() => handleRegenerateDraft(), 50);
                    }}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Include Direct Client Portal Pay Link</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={includeLatePenalty}
                    onChange={(e) => {
                      setIncludeLatePenalty(e.target.checked);
                      setTimeout(() => handleRegenerateDraft(), 50);
                    }}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span>Include Late Fee / Rule 1.16 Warning</span>
                </label>
              </div>
            </div>

            {/* AI Refinement Presets */}
            <div className="p-3 bg-blue-50/50 rounded-lg border border-blue-200 space-y-2">
              <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Smart Drafting Refinements</span>
              </span>

              <div className="grid grid-cols-2 gap-1.5">
                <button
                  type="button"
                  onClick={() => handleAiRefinement('more_urgent')}
                  disabled={aiPolishing !== null}
                  className="px-2 py-1.5 bg-white hover:bg-rose-50 text-rose-800 font-semibold text-[11px] rounded border border-rose-200 transition text-left"
                >
                  ⚡ Make More Urgent
                </button>
                <button
                  type="button"
                  onClick={() => handleAiRefinement('diplomatic')}
                  disabled={aiPolishing !== null}
                  className="px-2 py-1.5 bg-white hover:bg-blue-50 text-blue-800 font-semibold text-[11px] rounded border border-blue-200 transition text-left"
                >
                  🤝 More Diplomatic
                </button>
                <button
                  type="button"
                  onClick={() => handleAiRefinement('concise')}
                  disabled={aiPolishing !== null}
                  className="px-2 py-1.5 bg-white hover:bg-slate-100 text-slate-800 font-semibold text-[11px] rounded border border-slate-200 transition text-left"
                >
                  ✂️ Executive Summary
                </button>
                <button
                  type="button"
                  onClick={() => handleAiRefinement('payment_plan')}
                  disabled={aiPolishing !== null}
                  className="px-2 py-1.5 bg-white hover:bg-emerald-50 text-emerald-800 font-semibold text-[11px] rounded border border-emerald-200 transition text-left"
                >
                  💳 Installment Plan
                </button>
              </div>
            </div>

            {/* Custom Notes from Counsel */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-700 block">
                Additional Counsel Note (Optional):
              </label>
              <textarea
                value={customNotes}
                onChange={(e) => {
                  setCustomNotes(e.target.value);
                }}
                onBlur={() => handleRegenerateDraft()}
                placeholder="e.g., Per our phone conversation on Monday, please confirm wire dispatch..."
                rows={2}
                className="w-full bg-white border border-slate-200 rounded p-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* RIGHT COLUMN: Email Editor & Live Preview (8 cols) */}
          <div className="lg:col-span-8 flex flex-col space-y-3">
            {/* View Switcher Tabs */}
            <div className="flex items-center justify-between border-b border-slate-200 pb-2 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('editor')}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition flex items-center gap-1.5 ${
                    activeTab === 'editor'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Draft</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition flex items-center gap-1.5 ${
                    activeTab === 'preview'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Live Client Email Preview</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('history')}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition flex items-center gap-1.5 ${
                    activeTab === 'history'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <History className="w-3.5 h-3.5" />
                  <span>Notice History ({pastReminders.length})</span>
                </button>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => handleRegenerateDraft()}
                  className="p-1.5 text-slate-500 hover:text-blue-600 rounded hover:bg-slate-100 transition flex items-center gap-1 font-semibold text-[11px]"
                  title="Reset to template defaults"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Reset Draft</span>
                </button>
              </div>
            </div>

            {/* TAB 1: EDIT DRAFT */}
            {activeTab === 'editor' && (
              <div className="space-y-3 flex-1 flex flex-col">
                {/* Header Inputs */}
                <div className="grid grid-cols-1 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs">
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                    <span className="sm:col-span-2 font-bold text-slate-600">To:</span>
                    <input
                      type="email"
                      value={toField}
                      onChange={(e) => setToField(e.target.value)}
                      className="sm:col-span-10 bg-white border border-slate-300 rounded px-2.5 py-1 text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                    <span className="sm:col-span-2 font-bold text-slate-600">Cc:</span>
                    <input
                      type="text"
                      value={ccField}
                      onChange={(e) => setCcField(e.target.value)}
                      placeholder="e.g. billing@vcs-law.com"
                      className="sm:col-span-10 bg-white border border-slate-300 rounded px-2.5 py-1 text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                    <span className="sm:col-span-2 font-bold text-slate-600">Subject:</span>
                    <input
                      type="text"
                      value={subjectField}
                      onChange={(e) => setSubjectField(e.target.value)}
                      className="sm:col-span-10 bg-white border border-slate-300 rounded px-2.5 py-1 text-slate-900 font-semibold focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>

                {/* Body Textarea */}
                <div className="flex-1 flex flex-col min-h-[280px]">
                  <textarea
                    value={bodyField}
                    onChange={(e) => setBodyField(e.target.value)}
                    rows={12}
                    className="w-full flex-1 bg-white border border-slate-200 rounded-lg p-3.5 text-xs text-slate-800 font-mono leading-relaxed focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    placeholder="Drafting reminder email..."
                  />
                </div>
              </div>
            )}

            {/* TAB 2: LIVE EMAIL CLIENT PREVIEW */}
            {activeTab === 'preview' && (
              <div className="flex-1 border border-slate-200 rounded-lg overflow-hidden bg-slate-100 flex flex-col">
                {/* Email Client Top Bar */}
                <div className="bg-white px-4 py-3 border-b border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 text-sm">{subjectField}</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                      Standard HTML Email
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 space-y-0.5">
                    <p>
                      <strong>From:</strong> {senderName} &lt;{senderEmail}&gt;
                    </p>
                    <p>
                      <strong>To:</strong> {toField}
                    </p>
                    {ccField && (
                      <p>
                        <strong>Cc:</strong> {ccField}
                      </p>
                    )}
                    <p>
                      <strong>Date:</strong> {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                </div>

                {/* Email Message Content Envelope */}
                <div className="p-5 overflow-y-auto flex-1 bg-slate-50">
                  <div className="max-w-2xl mx-auto bg-white rounded-lg border border-slate-200 shadow-xs p-6 space-y-4 text-xs text-slate-800 font-sans leading-relaxed">
                    {/* Firm Branding Header */}
                    <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center font-serif font-bold text-sm">
                          VC
                        </div>
                        <div>
                          <div className="font-serif font-bold text-slate-900">Vance, Chen & Sterling LLP</div>
                          <div className="text-[10px] text-slate-400">Counselors & Attorneys at Law • New York</div>
                        </div>
                      </div>
                      <span className="font-mono text-[11px] text-slate-400">Inv #{activeInvoice.invoiceNumber}</span>
                    </div>

                    {/* Pre-formatted Message Text */}
                    <div className="whitespace-pre-wrap font-sans text-slate-800 leading-relaxed">
                      {bodyField}
                    </div>

                    {/* Secure Footer Seal */}
                    <div className="pt-4 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between">
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Confidential Attorney-Client Privileged Communication</span>
                      </span>
                      <span>VCS LLP Billing Dept</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: NOTICE HISTORY & AUDIT TRAIL */}
            {activeTab === 'history' && (
              <div className="flex-1 border border-slate-200 rounded-lg p-4 bg-white overflow-y-auto space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5 text-blue-600" />
                    <span>Prior Reminder Dispatch Logs</span>
                  </h3>
                  <span className="text-xs text-slate-500 font-mono">
                    Total Sent: {pastReminders.length}
                  </span>
                </div>

                {pastReminders.length > 0 ? (
                  <div className="space-y-2">
                    {pastReminders.map((log) => (
                      <div
                        key={log.id}
                        className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900">{log.subject}</span>
                          <span className="font-mono text-[11px] text-slate-500">{log.sentAt}</span>
                        </div>
                        <p className="text-slate-600 text-[11px]">
                          Sent by: <strong className="text-slate-800">{log.sentBy}</strong> to <em>{log.recipientEmail}</em>
                        </p>
                        <div className="flex items-center gap-2 pt-1">
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                            {log.noticeLevel || log.tone}
                          </span>
                          <span className="text-[11px] text-slate-500 font-mono">
                            Balance Due at Dispatch: ${log.balanceDue.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center text-slate-500 space-y-2">
                    <Mail className="w-8 h-8 text-slate-300 mx-auto" />
                    <p className="font-bold text-slate-700 text-xs">No prior email reminders recorded for this invoice.</p>
                    <p className="text-[11px] text-slate-400">
                      Dispatched notices will automatically appear in this audit log.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyClipboard}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-lg border border-slate-200 shadow-2xs transition flex items-center gap-1.5"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copy Text</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleOpenMailto}
              className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-lg border border-slate-200 shadow-2xs transition flex items-center gap-1.5"
              title="Launch native email client (Outlook, Apple Mail, Gmail)"
            >
              <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              <span>Open in Email Client</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs rounded-lg transition"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSendReminderConfirm}
              disabled={isSending}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg shadow-sm transition flex items-center gap-1.5 disabled:opacity-50"
            >
              {isSending ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Logging & Dispatching...</span>
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>
                    {currentIndex < overdueInvoices.length - 1
                      ? 'Send & Next Invoice'
                      : 'Send Reminder & Record'}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
