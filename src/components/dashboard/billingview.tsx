import React, { useState, useMemo } from 'react';
import {
  CreditCard,
  Plus,
  Clock,
  DollarSign,
  Download,
  FileSpreadsheet,
  FileType,
  FileText,
  FileDown,
  Printer,
  Building2,
  User,
  Calendar,
  CalendarRange,
  CheckCircle2,
  AlertCircle,
  X,
  Play,
  Square,
  Send,
  Lock,
  Search,
  Filter,
  Flame,
  AlertTriangle,
  TrendingUp,
  ShieldAlert,
  ArrowUpRight,
  RefreshCw,
  RotateCcw,
  SlidersHorizontal,
  ChevronRight,
  Sparkles,
  Layers,
  BarChart3,
  Mail
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
  Cell
} from 'recharts';
import { TimeEntry, Invoice, CaseFile, UserRole, InvoiceReminderLog } from '../types';
import {
  exportInvoicePDF,
  exportClientMonthlyBillingPDF,
  exportDateRangeBillingReportPDF
} from '../utils/pdfExport';
import { exportInvoicesExcel, exportDateRangeBillingExcel } from '../utils/excelExport';
import { OverdueReminderModal } from './OverdueReminderModal';
import { calculateDaysOverdue } from '../utils/reminderEmailDrafts';

interface BillingViewProps {
  timeEntries: TimeEntry[];
  invoices: Invoice[];
  cases: CaseFile[];
  userRole: UserRole;
  isTimerRunning: boolean;
  timerSeconds: number;
  onToggleTimer: () => void;
  onAddTimeEntry: (entry: TimeEntry) => void;
  onAddInvoice: (invoice: Invoice) => void;
  onUpdateInvoiceStatus: (id: string, status: Invoice['status']) => void;
  onSendInvoiceReminder?: (reminder: InvoiceReminderLog) => void;
}

export type BillingCyclePreset =
  | 'all'
  | 'current_month'
  | 'prev_month'
  | 'q3_2026'
  | 'q2_2026'
  | 'ytd_2026'
  | 'last_30_days'
  | 'custom';

export const BillingView: React.FC<BillingViewProps> = ({
  timeEntries,
  invoices,
  cases,
  userRole,
  isTimerRunning,
  timerSeconds,
  onToggleTimer,
  onAddTimeEntry,
  onAddInvoice,
  onUpdateInvoiceStatus,
  onSendInvoiceReminder
}) => {
  const [activeTab, setActiveTab] = useState<'invoices' | 'retainer_burn' | 'time_entries'>('retainer_burn');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [burnFilter, setBurnFilter] = useState<'all' | 'critical' | 'moderate' | 'healthy'>('all');
  const [selectedCaseForDetails, setSelectedCaseForDetails] = useState<CaseFile | null>(null);

  // Date-Range Picker & Billing Cycle Filter State
  const [cyclePreset, setCyclePreset] = useState<BillingCyclePreset>('all');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [isCustomDateExpanded, setIsCustomDateExpanded] = useState<boolean>(false);

  // Overdue Invoice Reminder Modal State
  const [isReminderModalOpen, setIsReminderModalOpen] = useState(false);
  const [reminderModalInvoiceId, setReminderModalInvoiceId] = useState<string | undefined>(undefined);

  // Time logger modal state
  const [isTimeModalOpen, setIsTimeModalOpen] = useState(false);
  const [timeCaseId, setTimeCaseId] = useState(cases[0]?.id || '');
  const [timeHours, setTimeHours] = useState('2.5');
  const [timeRate, setTimeRate] = useState('420');
  const [timeDesc, setTimeDesc] = useState('');

  // Invoice generator modal state
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [invCaseId, setInvCaseId] = useState(cases[0]?.id || '');
  const [invItemDesc, setInvItemDesc] = useState('Legal consultation & court document drafting');
  const [invHours, setInvHours] = useState('12.0');
  const [invRate, setInvRate] = useState('450');

  // Online payment simulation state
  const [paymentModalInvoice, setPaymentModalInvoice] = useState<Invoice | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Client Monthly Billing PDF Export Modal State
  const [isMonthlyExportModalOpen, setIsMonthlyExportModalOpen] = useState(false);
  const [exportClientName, setExportClientName] = useState(cases[0]?.clientName || 'AeroTech Dynamics Global');
  const [exportCaseId, setExportCaseId] = useState('all');
  const [exportDateMode, setExportDateMode] = useState<'month' | 'custom_range'>('month');
  const [exportMonthYear, setExportMonthYear] = useState('2026-08');
  const [exportStartDate, setExportStartDate] = useState('');
  const [exportEndDate, setExportEndDate] = useState('');
  const [exportIncludeTimeEntries, setExportIncludeTimeEntries] = useState(true);
  const [exportIncludeInvoices, setExportIncludeInvoices] = useState(true);
  const [exportIncludeRetainer, setExportIncludeRetainer] = useState(true);
  const [exportCustomNotes, setExportCustomNotes] = useState('');
  const [exportToastMessage, setExportToastMessage] = useState<string | null>(null);

  // Preset Cycle Handler
  const handleSelectPreset = (preset: BillingCyclePreset) => {
    setCyclePreset(preset);
    if (preset === 'all') {
      setStartDate('');
      setEndDate('');
      setIsCustomDateExpanded(false);
    } else if (preset === 'current_month') {
      setStartDate('2026-08-01');
      setEndDate('2026-08-31');
      setIsCustomDateExpanded(false);
    } else if (preset === 'prev_month') {
      setStartDate('2026-07-01');
      setEndDate('2026-07-31');
      setIsCustomDateExpanded(false);
    } else if (preset === 'q3_2026') {
      setStartDate('2026-07-01');
      setEndDate('2026-09-30');
      setIsCustomDateExpanded(false);
    } else if (preset === 'q2_2026') {
      setStartDate('2026-04-01');
      setEndDate('2026-06-30');
      setIsCustomDateExpanded(false);
    } else if (preset === 'ytd_2026') {
      setStartDate('2026-01-01');
      setEndDate('2026-12-31');
      setIsCustomDateExpanded(false);
    } else if (preset === 'last_30_days') {
      setStartDate('2026-07-24');
      setEndDate('2026-08-23');
      setIsCustomDateExpanded(false);
    } else if (preset === 'custom') {
      if (!startDate) setStartDate('2026-08-01');
      if (!endDate) setEndDate('2026-08-31');
      setIsCustomDateExpanded(true);
    }
  };

  // Human-readable date range label
  const dateRangeLabel = useMemo(() => {
    if (cyclePreset === 'current_month') return 'Current Billing Cycle (August 2026)';
    if (cyclePreset === 'prev_month') return 'Previous Billing Cycle (July 2026)';
    if (cyclePreset === 'q3_2026') return 'Q3 2026 Cycle (Jul 1 – Sep 30, 2026)';
    if (cyclePreset === 'q2_2026') return 'Q2 2026 Cycle (Apr 1 – Jun 30, 2026)';
    if (cyclePreset === 'ytd_2026') return 'Year to Date 2026';
    if (cyclePreset === 'last_30_days') return 'Last 30 Days (Jul 24 – Aug 23, 2026)';
    if (startDate && endDate) {
      return `Custom Period: ${startDate} to ${endDate}`;
    }
    if (startDate) return `From ${startDate} onwards`;
    if (endDate) return `Up to ${endDate}`;
    return 'All Billing Cycles (All Time)';
  }, [cyclePreset, startDate, endDate]);

  const isDateFilterActive = Boolean(startDate || endDate || cyclePreset !== 'all');

  // Extract list of unique clients
  const uniqueClients = useMemo(() => {
    const map = new Map<string, { clientName: string; clientEmail: string; cases: CaseFile[] }>();
    cases.forEach((c) => {
      if (!map.has(c.clientName)) {
        map.set(c.clientName, {
          clientName: c.clientName,
          clientEmail: c.clientEmail || '',
          cases: [c]
        });
      } else {
        map.get(c.clientName)!.cases.push(c);
      }
    });
    return Array.from(map.values());
  }, [cases]);

  // Filtered cases available for the selected export client
  const exportAvailableCases = useMemo(() => {
    if (exportClientName === 'All Clients' || exportClientName === 'All Active Clients') {
      return cases;
    }
    return cases.filter((c) => c.clientName.toLowerCase() === exportClientName.toLowerCase());
  }, [cases, exportClientName]);

  // Dynamic live summary of the monthly PDF data for modal preview
  const exportPreviewData = useMemo(() => {
    const targetCaseIds = new Set(
      exportCaseId === 'all'
        ? exportAvailableCases.map((c) => c.id)
        : [exportCaseId]
    );

    const matchedTimeEntries = timeEntries.filter((te) => {
      const isClientCase = targetCaseIds.size === 0 || targetCaseIds.has(te.caseId);
      if (!isClientCase) return false;

      if (exportDateMode === 'custom_range') {
        if (exportStartDate && te.date < exportStartDate) return false;
        if (exportEndDate && te.date > exportEndDate) return false;
      } else {
        if (exportMonthYear && exportMonthYear !== 'all') {
          return te.date.startsWith(exportMonthYear);
        }
      }
      return true;
    });

    const matchedInvoices = invoices.filter((inv) => {
      const isClientCase = targetCaseIds.size === 0 || targetCaseIds.has(inv.caseId);
      const matchesName =
        inv.clientName.toLowerCase() === exportClientName.toLowerCase() ||
        exportClientName === 'All Clients' ||
        exportClientName === 'All Active Clients';
      if (!isClientCase && !matchesName) return false;

      const invDate = inv.issueDate || inv.dueDate || '';
      if (exportDateMode === 'custom_range') {
        if (exportStartDate && invDate && invDate < exportStartDate) return false;
        if (exportEndDate && invDate && invDate > exportEndDate) return false;
      } else {
        if (exportMonthYear && exportMonthYear !== 'all') {
          return (
            (inv.issueDate && inv.issueDate.startsWith(exportMonthYear)) ||
            (inv.dueDate && inv.dueDate.startsWith(exportMonthYear)) ||
            inv.status !== 'paid'
          );
        }
      }
      return true;
    });

    const totalHours = matchedTimeEntries.reduce((acc, te) => acc + (te.hours || 0), 0);
    const totalTimeFees = matchedTimeEntries.reduce((acc, te) => acc + (te.amount || te.hours * te.rate), 0);
    const totalInvoiced = matchedInvoices.reduce((acc, inv) => acc + inv.totalAmount, 0);
    const totalPaid = matchedInvoices.reduce((acc, inv) => acc + inv.amountPaid, 0);
    const balanceDue = matchedInvoices.reduce((acc, inv) => acc + (inv.totalAmount - inv.amountPaid), 0);
    const totalRetainer = exportAvailableCases.reduce((acc, c) => acc + (c.retainerRemaining || 0), 0);

    return {
      matchedTimeEntries,
      matchedInvoices,
      totalHours,
      totalTimeFees,
      totalInvoiced,
      totalPaid,
      balanceDue,
      totalRetainer
    };
  }, [
    exportClientName,
    exportCaseId,
    exportDateMode,
    exportMonthYear,
    exportStartDate,
    exportEndDate,
    exportAvailableCases,
    timeEntries,
    invoices
  ]);

  const handleTriggerMonthlyPDFExport = () => {
    const clientObj = uniqueClients.find((cl) => cl.clientName === exportClientName);

    const periodDescriptor =
      exportDateMode === 'custom_range'
        ? (exportStartDate || exportEndDate
            ? `${exportStartDate || 'Start'} to ${exportEndDate || 'Present'}`
            : 'Custom Range')
        : exportMonthYear;

    exportClientMonthlyBillingPDF({
      clientName: exportClientName,
      clientEmail: clientObj?.clientEmail,
      cases,
      selectedCaseId: exportCaseId,
      monthYear: exportMonthYear,
      startDate: exportDateMode === 'custom_range' ? exportStartDate : undefined,
      endDate: exportDateMode === 'custom_range' ? exportEndDate : undefined,
      dateRangeLabel: exportDateMode === 'custom_range' ? periodDescriptor : undefined,
      timeEntries,
      invoices,
      customNotes: exportCustomNotes,
      includeTimeEntries: exportIncludeTimeEntries,
      includeInvoicesSummary: exportIncludeInvoices,
      includeRetainerReconciliation: exportIncludeRetainer
    });

    setExportToastMessage(`Branded PDF Statement generated for ${exportClientName} (${periodDescriptor})`);
    setTimeout(() => setExportToastMessage(null), 5000);
    setIsMonthlyExportModalOpen(false);
  };

  // Calculate comprehensive Retainer Burn Metrics for all cases
  const caseBurnStats = useMemo(() => {
    return cases.map((c) => {
      const retainerCap = c.retainerAmount || 1;
      const billed = c.totalBilled || 0;
      const burnPct = (billed / retainerCap) * 100;
      const remainingAmount = retainerCap - billed;
      const isExceeded = billed >= retainerCap;
      const isCritical = burnPct >= 80 && !isExceeded;
      const isModerate = burnPct >= 50 && burnPct < 80;
      const isHealthy = burnPct < 50;

      const rate = c.hourlyRate || 450;
      const hoursCap = Math.round((retainerCap / rate) * 10) / 10;
      const hoursLogged = Math.round((billed / rate) * 10) / 10;
      const hoursRemaining = Math.max(0, Math.round((remainingAmount / rate) * 10) / 10);

      return {
        ...c,
        burnPct: Number(burnPct.toFixed(1)),
        remainingAmount,
        isExceeded,
        isCritical,
        isModerate,
        isHealthy,
        hoursCap,
        hoursLogged,
        hoursRemaining
      };
    });
  }, [cases]);

  // Quick lookup map for case burn status
  const caseBurnMap = useMemo(() => {
    const map: Record<string, { burnPct: number; isCritical: boolean; isExceeded: boolean }> = {};
    caseBurnStats.forEach((c) => {
      map[c.id] = {
        burnPct: c.burnPct,
        isCritical: c.isCritical,
        isExceeded: c.isExceeded
      };
    });
    return map;
  }, [caseBurnStats]);

  // Filtered cases for Retainer Burn tab
  const filteredCaseBurnStats = useMemo(() => {
    return caseBurnStats.filter((c) => {
      const matchesSearch =
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.caseNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.practiceArea.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      if (burnFilter === 'critical') return c.burnPct >= 80;
      if (burnFilter === 'moderate') return c.isModerate;
      if (burnFilter === 'healthy') return c.isHealthy;
      return true;
    });
  }, [caseBurnStats, searchTerm, burnFilter]);

  // Critical burn cases (>80%) for top alert banner
  const criticalBurnCases = useMemo(() => {
    return caseBurnStats.filter((c) => c.burnPct >= 80);
  }, [caseBurnStats]);

  // Filtered Time Entries with Date Range and Search
  const filteredTimeEntries = useMemo(() => {
    return timeEntries.filter((te) => {
      if (startDate && te.date < startDate) return false;
      if (endDate && te.date > endDate) return false;
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matches =
          te.caseTitle.toLowerCase().includes(term) ||
          te.lawyerName.toLowerCase().includes(term) ||
          te.description.toLowerCase().includes(term) ||
          te.date.includes(term);
        if (!matches) return false;
      }
      return true;
    });
  }, [timeEntries, startDate, endDate, searchTerm]);

  // Filter all currently overdue invoices (status 'overdue' or balance > 0 and past due)
  const overdueInvoicesList = useMemo(() => {
    return invoices.filter((inv) => {
      const balance = inv.totalAmount - inv.amountPaid;
      const isPastDueDate = inv.dueDate < '2026-08-23';
      return (inv.status === 'overdue' || (isPastDueDate && balance > 0)) && inv.status !== 'paid';
    });
  }, [invoices]);

  const overdueTotalAR = useMemo(() => {
    return overdueInvoicesList.reduce((acc, inv) => acc + (inv.totalAmount - inv.amountPaid), 0);
  }, [overdueInvoicesList]);

  const handleSendReminder = (reminder: InvoiceReminderLog) => {
    // Record into invoice metadata
    const target = invoices.find((inv) => inv.id === reminder.invoiceId);
    if (target) {
      target.lastReminderSent = {
        sentAt: reminder.sentAt,
        sentBy: reminder.sentBy,
        tone: reminder.tone,
        recipientEmail: reminder.recipientEmail,
        subject: reminder.subject
      };
      target.reminderHistory = [reminder, ...(target.reminderHistory || [])];
    }

    if (onSendInvoiceReminder) {
      onSendInvoiceReminder(reminder);
    }

    setExportToastMessage(
      `Dispatched ${reminder.noticeLevel || 'Notice'} to ${reminder.recipientName} (${reminder.recipientEmail})`
    );
    setTimeout(() => setExportToastMessage(null), 5000);
  };

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      const invDate = inv.issueDate || inv.dueDate || '';
      if (startDate && invDate && invDate < startDate) return false;
      if (endDate && invDate && invDate > endDate) return false;

      const matchesSearch =
        inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.caseTitle.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      if (statusFilter === 'all') return true;
      if (statusFilter === 'overdue') {
        const balance = inv.totalAmount - inv.amountPaid;
        const isPastDue = inv.dueDate < '2026-08-23';
        return (inv.status === 'overdue' || (isPastDue && balance > 0)) && inv.status !== 'paid';
      }
      if (statusFilter === 'needs_reminder') {
        const balance = inv.totalAmount - inv.amountPaid;
        const isPastDue = inv.dueDate < '2026-08-23';
        const isOverdue = (inv.status === 'overdue' || (isPastDue && balance > 0)) && inv.status !== 'paid';
        return isOverdue && !inv.lastReminderSent;
      }
      return inv.status === statusFilter;
    });
  }, [invoices, startDate, endDate, searchTerm, statusFilter]);

  // Live Period Financial KPI summary in filtered date range
  const periodKPIs = useMemo(() => {
    const totalHours = filteredTimeEntries.reduce((acc, te) => acc + (te.hours || 0), 0);
    const totalTimeFees = filteredTimeEntries.reduce((acc, te) => acc + (te.amount || te.hours * te.rate), 0);
    const totalInvoiced = filteredInvoices.reduce((acc, inv) => acc + inv.totalAmount, 0);
    const totalPaid = filteredInvoices.reduce((acc, inv) => acc + inv.amountPaid, 0);
    const balanceDue = filteredInvoices.reduce((acc, inv) => acc + (inv.totalAmount - inv.amountPaid), 0);

    return {
      totalHours,
      totalTimeFees,
      totalInvoiced,
      totalPaid,
      balanceDue
    };
  }, [filteredTimeEntries, filteredInvoices]);

  const handleGenerateCycleReportPDF = () => {
    exportDateRangeBillingReportPDF({
      dateRangeLabel,
      startDate,
      endDate,
      timeEntries: filteredTimeEntries,
      invoices: filteredInvoices,
      cases
    });
    setExportToastMessage(`Successfully generated Billing Cycle Report PDF for "${dateRangeLabel}".`);
  };

  const handleExportCycleExcel = () => {
    exportDateRangeBillingExcel({
      dateRangeLabel,
      startDate,
      endDate,
      timeEntries: filteredTimeEntries,
      invoices: filteredInvoices,
      cases
    });
    setExportToastMessage(`Successfully exported Billing Cycle Ledger XLSX for "${dateRangeLabel}".`);
  };

  // Recharts Chart Dataset comparing Billed vs Retainer Amount
  const chartData = useMemo(() => {
    return caseBurnStats.map((c) => ({
      name: c.caseNumber.replace('JP-2026-', '#'),
      fullName: c.title,
      billed: c.totalBilled,
      retainer: c.retainerAmount,
      burnPct: c.burnPct,
      isAlert: c.burnPct >= 80
    }));
  }, [caseBurnStats]);

  const handleCreateTimeEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!timeDesc) return;

    const matchedCase = cases.find((c) => c.id === timeCaseId);

    const hoursNum = Number(timeHours) || 1;
    const rateNum = Number(timeRate) || 400;

    const newEntry: TimeEntry = {
      id: `te-${Date.now()}`,
      caseId: timeCaseId,
      caseTitle: matchedCase ? matchedCase.title : 'General Case Matter',
      lawyerId: 'u-[current]',
      lawyerName: 'Sophia Chen',
      date: new Date().toISOString().slice(0, 10),
      hours: hoursNum,
      rate: rateNum,
      amount: hoursNum * rateNum,
      description: timeDesc,
      isBilled: false
    };

    onAddTimeEntry(newEntry);
    setIsTimeModalOpen(false);
    setTimeDesc('');
  };

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const matchedCase = cases.find((c) => c.id === invCaseId);
    if (!matchedCase) return;

    const hrs = Number(invHours) || 10;
    const rate = Number(invRate) || 450;
    const sub = hrs * rate;

    const newInv: Invoice = {
      id: `inv-${Date.now()}`,
      invoiceNumber: `INV-2026-${Math.floor(100 + Math.random() * 900)}`,
      caseId: invCaseId,
      caseTitle: matchedCase.title,
      clientName: matchedCase.clientName,
      clientEmail: matchedCase.clientEmail,
      issueDate: new Date().toISOString().slice(0, 10),
      dueDate: new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
      subtotal: sub,
      tax: 0,
      totalAmount: sub,
      amountPaid: 0,
      status: 'pending_approval',
      items: [
        {
          description: invItemDesc,
          hours: hrs,
          rate: rate,
          amount: sub
        }
      ]
    };

    onAddInvoice(newInv);
    setIsInvoiceModalOpen(false);
  };

  const handleOpenReplenishmentInvoice = (targetCase: CaseFile) => {
    setInvCaseId(targetCase.id);
    const deficitOrTopUp = Math.max(
      Math.round(targetCase.retainerAmount * 0.5),
      targetCase.totalBilled - (targetCase.retainerAmount - targetCase.retainerRemaining)
    );
    const calculatedHours = Math.round(deficitOrTopUp / (targetCase.hourlyRate || 450));

    setInvItemDesc(
      `Retainer Trust Replenishment Deposit — Matter ${targetCase.caseNumber}: ${targetCase.title}`
    );
    setInvHours(calculatedHours > 0 ? calculatedHours.toString() : '20.0');
    setInvRate(targetCase.hourlyRate ? targetCase.hourlyRate.toString() : '450');
    setIsInvoiceModalOpen(true);
  };

  const handleProcessPaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentModalInvoice) return;

    setIsProcessingPayment(true);
    setTimeout(() => {
      const payVal = Number(paymentAmount) || paymentModalInvoice.totalAmount;
      const newPaid = paymentModalInvoice.amountPaid + payVal;
      const newStatus = newPaid >= paymentModalInvoice.totalAmount ? 'paid' : 'sent';

      onUpdateInvoiceStatus(paymentModalInvoice.id, newStatus);
      setIsProcessingPayment(false);
      setPaymentModalInvoice(null);
    }, 1000);
  };

  const formatTimer = (totalSec: number) => {
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const statusBadge: Record<Invoice['status'], string> = {
    draft: 'bg-slate-100 text-slate-700 border-slate-200 font-bold',
    pending_approval: 'bg-amber-50 text-amber-700 border-amber-200 font-bold',
    sent: 'bg-blue-50 text-blue-700 border-blue-200 font-bold',
    paid: 'bg-emerald-50 text-emerald-700 border-emerald-200 font-bold',
    overdue: 'bg-rose-50 text-rose-700 border-rose-200 font-bold animate-pulse'
  };

  // Status Badge Component for Case Burn Rate
  const renderBurnBadge = (burnPct: number, isExceeded: boolean, isCritical: boolean) => {
    if (isExceeded || burnPct >= 100) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300 shadow-sm animate-pulse">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
          <span>{burnPct}% EXCEEDED</span>
        </span>
      );
    }
    if (isCritical || burnPct >= 80) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-300 shadow-sm">
          <Flame className="w-3.5 h-3.5 text-amber-600 shrink-0 fill-amber-500/30 animate-bounce" />
          <span>{burnPct}% BURN ALERT</span>
        </span>
      );
    }
    if (burnPct >= 50) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-yellow-50 text-yellow-800 border border-yellow-200">
          <span>{burnPct}% Moderate</span>
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
        <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
        <span>{burnPct}% Healthy</span>
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-4 rounded-lg shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-slate-900">Billing, Retainer Ledgers & Invoicing</h1>
            {criticalBurnCases.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200 flex items-center gap-1">
                <Flame className="w-3 h-3 text-rose-600 fill-rose-500/20" />
                {criticalBurnCases.length} Burn Alert{criticalBurnCases.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time billable time tracking, retainer burn thresholds, hourly rate cards, and automated trust replenishment.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => {
              setExportClientName(cases[0]?.clientName || 'AeroTech Dynamics Global');
              setExportCaseId('all');
              setIsMonthlyExportModalOpen(true);
            }}
            className="px-3.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs rounded-md flex items-center gap-2 border border-blue-200 shadow-sm transition"
            title="Export a client's monthly time entries and invoice summaries as a branded, formal PDF invoice document"
          >
            <FileText className="w-4 h-4 text-blue-600" />
            <span>Export Client Monthly PDF</span>
          </button>

          <button
            onClick={() => exportInvoicesExcel(invoices)}
            className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-md flex items-center gap-2 border border-slate-200 shadow-sm transition"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Export Ledger XLSX</span>
          </button>

          <button
            onClick={() => setIsTimeModalOpen(true)}
            className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-md flex items-center gap-2 border border-slate-200 shadow-sm transition"
          >
            <Clock className="w-4 h-4 text-amber-600" />
            <span>Log Time Entry</span>
          </button>

          <button
            onClick={() => {
              setInvItemDesc('Legal consultation & court document drafting');
              setInvHours('12.0');
              setInvRate('450');
              setIsInvoiceModalOpen(true);
            }}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-md flex items-center gap-2 shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Generate Invoice</span>
          </button>
        </div>
      </div>

      {/* Success Notification Toast */}
      {exportToastMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs font-semibold flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{exportToastMessage}</span>
          </div>
          <button onClick={() => setExportToastMessage(null)} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* RETAINER BURN ALERT ADVISORY BANNER (>80% THRESHOLD) */}
      {criticalBurnCases.length > 0 && (
        <div className="p-4 bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-amber-500/5 border border-amber-300/80 rounded-xl shadow-sm text-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-lg bg-amber-500/20 text-amber-800 border border-amber-300 shrink-0">
              <Flame className="w-5 h-5 text-amber-700 fill-amber-500/30" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-amber-950">
                  Retainer Burn Alert: {criticalBurnCases.length} Matter{criticalBurnCases.length > 1 ? 's' : ''} Exceeding 80% Retainer Cap
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-200 text-amber-900">
                  Replenishment Recommended
                </span>
              </div>
              <p className="text-xs text-amber-800/90 mt-1">
                Total billings on these active matters have reached or surpassed the 80% retainer deposit threshold. Immediate client replenishment invoices are recommended to avoid work stoppage.
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                {criticalBurnCases.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      setActiveTab('retainer_burn');
                      setBurnFilter('critical');
                      setSearchTerm(c.caseNumber);
                    }}
                    className="px-2.5 py-1 rounded-md bg-white/90 hover:bg-white text-slate-800 border border-amber-300 text-xs font-semibold flex items-center gap-1.5 shadow-sm transition"
                  >
                    <span className="font-mono text-amber-700 font-bold">{c.caseNumber}</span>
                    <span className="truncate max-w-[140px]">{c.title}</span>
                    <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 font-bold text-[10px]">
                      {c.burnPct}%
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-center shrink-0">
            <button
              onClick={() => {
                setActiveTab('retainer_burn');
                setBurnFilter('critical');
              }}
              className="px-3.5 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow-sm transition flex items-center gap-1.5"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Review At-Risk Matters</span>
            </button>
          </div>
        </div>
      )}

      {/* Billable Timer Sticky Bar */}
      <div className="p-3.5 rounded-lg bg-white border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-900">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-md bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className={`w-5 h-5 ${isTimerRunning ? 'animate-pulse' : ''}`} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              Active Billable Counter
            </span>
            <div className="text-xl font-mono font-bold text-slate-900">{formatTimer(timerSeconds)}</div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            onClick={onToggleTimer}
            className={`px-4 py-1.5 rounded-md text-xs font-semibold flex items-center gap-2 transition shadow-sm ${
              isTimerRunning
                ? 'bg-rose-600 hover:bg-rose-700 text-white'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white'
            }`}
          >
            {isTimerRunning ? <Square className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isTimerRunning ? 'Pause Timer' : 'Start Billable Timer'}</span>
          </button>
        </div>
      </div>

      {/* BILLING CYCLE & DATE-RANGE PICKER FILTER SUITE */}
      <div className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs space-y-3.5">
        {/* Header & Quick Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 shrink-0">
              <CalendarRange className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wide">
                  Billing Cycle & Date-Range Filter
                </span>
                {isDateFilterActive && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200 animate-in fade-in">
                    Filter Active
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-500 font-medium">
                Active Scope: <strong className="text-slate-800">{dateRangeLabel}</strong>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={handleGenerateCycleReportPDF}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-md shadow-xs flex items-center gap-1.5 transition"
              title="Download formal branded PDF report for the active billing cycle date range"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Generate Cycle Report (PDF)</span>
            </button>

            <button
              onClick={handleExportCycleExcel}
              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold text-xs rounded-md border border-emerald-200 flex items-center gap-1.5 transition"
              title="Download 3-sheet Excel spreadsheet for the active date range"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span>Export Cycle (XLSX)</span>
            </button>

            {isDateFilterActive && (
              <button
                onClick={() => handleSelectPreset('all')}
                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-md border border-slate-200 flex items-center gap-1 transition"
                title="Reset date range to all-time"
              >
                <RotateCcw className="w-3 h-3 text-slate-500" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Preset Cycle Chips & Custom Date Pickers */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all', label: 'All History' },
              { id: 'current_month', label: 'Current Cycle (Aug 2026)' },
              { id: 'prev_month', label: 'Prior Cycle (Jul 2026)' },
              { id: 'q3_2026', label: 'Q3 2026 (Jul–Sep)' },
              { id: 'q2_2026', label: 'Q2 2026 (Apr–Jun)' },
              { id: 'ytd_2026', label: 'Year to Date (2026)' },
              { id: 'last_30_days', label: 'Last 30 Days' },
              { id: 'custom', label: 'Custom Range...' }
            ].map((p) => {
              const isActive = cyclePreset === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handleSelectPreset(p.id as BillingCyclePreset)}
                  className={`px-2.5 py-1 rounded-md text-xs font-semibold border transition ${
                    isActive
                      ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                      : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>

          {/* Custom Date Pickers */}
          <div className="flex items-center gap-2 bg-slate-50 p-1.5 rounded-lg border border-slate-200 shrink-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-600">From:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => {
                  setStartDate(e.target.value);
                  setCyclePreset('custom');
                }}
                className="bg-white border border-slate-200 rounded px-2 py-1 text-xs text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-bold text-slate-600">To:</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => {
                  setEndDate(e.target.value);
                  setCyclePreset('custom');
                }}
                className="bg-white border border-slate-200 rounded px-2 py-1 text-xs text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Live Period Financial Metrics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-1">
          <div className="p-2.5 rounded-lg bg-blue-50/60 border border-blue-100">
            <span className="text-[10px] font-bold text-blue-900 uppercase tracking-wider block">
              Period Billable Hours
            </span>
            <div className="text-sm font-bold font-mono text-blue-700 mt-0.5">
              {periodKPIs.totalHours.toFixed(1)} hrs
            </div>
            <span className="text-[10px] text-blue-600 block">
              {filteredTimeEntries.length} time entries
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
              Accrued Time Fees
            </span>
            <div className="text-sm font-bold font-mono text-slate-900 mt-0.5">
              ${periodKPIs.totalTimeFees.toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-500 block">
              WIP work product
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider block">
              Period Invoiced
            </span>
            <div className="text-sm font-bold font-mono text-slate-900 mt-0.5">
              ${periodKPIs.totalInvoiced.toLocaleString()}
            </div>
            <span className="text-[10px] text-slate-500 block">
              {filteredInvoices.length} invoices issued
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200">
            <span className="text-[10px] font-bold text-emerald-900 uppercase tracking-wider block">
              Cash Collections
            </span>
            <div className="text-sm font-bold font-mono text-emerald-700 mt-0.5">
              ${periodKPIs.totalPaid.toLocaleString()}
            </div>
            <span className="text-[10px] text-emerald-600 block">
              Settled into operating/trust
            </span>
          </div>

          <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200">
            <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block">
              Period AR Balance
            </span>
            <div className="text-sm font-bold font-mono text-amber-800 mt-0.5">
              ${periodKPIs.balanceDue.toLocaleString()}
            </div>
            <span className="text-[10px] text-amber-700 block">
              {periodKPIs.balanceDue > 0 ? 'Pending payment' : 'Fully settled'}
            </span>
          </div>
        </div>
      </div>

      {/* Overdue Accounts Receivable Action Banner */}
      {overdueInvoicesList.length > 0 && (
        <div className="p-4 bg-gradient-to-r from-rose-50/90 via-amber-50/80 to-orange-50/90 border border-amber-200/90 rounded-xl shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 bg-amber-500 text-white rounded-lg shadow-xs shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-slate-900">
                  Delinquent Accounts Receivable Alert
                </span>
                <span className="px-2 py-0.5 bg-rose-100 text-rose-800 text-[10px] font-bold rounded border border-rose-200 uppercase">
                  {overdueInvoicesList.length} Invoices Past Due
                </span>
                <span className="font-mono text-xs font-bold text-rose-700 bg-white/80 px-2 py-0.5 rounded border border-rose-200">
                  ${overdueTotalAR.toLocaleString()} Uncollected AR
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                Generate tailored attorney reminder emails with adjustable tone (courteous, formal, urgent) and review dispatch logs.
              </p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {overdueInvoicesList.slice(0, 3).map((inv) => {
                  const days = calculateDaysOverdue(inv.dueDate);
                  const bal = inv.totalAmount - inv.amountPaid;
                  return (
                    <button
                      key={inv.id}
                      onClick={() => {
                        setReminderModalInvoiceId(inv.id);
                        setIsReminderModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-white/90 hover:bg-white text-slate-800 text-[11px] rounded border border-amber-200 hover:border-amber-400 shadow-2xs transition"
                    >
                      <span className="font-semibold">{inv.clientName}:</span>
                      <span className="font-mono font-bold text-slate-900">${bal.toLocaleString()}</span>
                      <span className="text-rose-600 font-mono text-[10px] font-bold">({days}d late)</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-end md:self-center shrink-0 w-full sm:w-auto">
            <button
              onClick={() => {
                setReminderModalInvoiceId(undefined);
                setIsReminderModalOpen(true);
              }}
              className="w-full sm:w-auto px-4 py-2.5 bg-gradient-to-r from-amber-600 via-amber-700 to-rose-600 hover:from-amber-700 hover:to-rose-700 text-white font-bold text-xs rounded-lg shadow-sm flex items-center justify-center gap-2 transition"
            >
              <Mail className="w-4 h-4" />
              <span>Review & Send Email Reminders ({overdueInvoicesList.length})</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab Switcher & Global Filters */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex gap-1.5 p-1 bg-slate-100 border border-slate-200 rounded-md w-full md:w-auto">
          <button
            onClick={() => {
              setActiveTab('retainer_burn');
              setSearchTerm('');
            }}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition flex items-center gap-1.5 ${
              activeTab === 'retainer_burn'
                ? 'bg-white text-blue-700 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Flame className={`w-3.5 h-3.5 ${criticalBurnCases.length > 0 ? 'text-amber-600' : 'text-slate-400'}`} />
            <span>Retainer Burn & Budgets ({cases.length})</span>
            {criticalBurnCases.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab('invoices');
              setSearchTerm('');
            }}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition flex items-center gap-1.5 ${
              activeTab === 'invoices'
                ? 'bg-white text-blue-700 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5 text-slate-500" />
            <span>Invoices Ledger ({invoices.length})</span>
            {overdueInvoicesList.length > 0 && (
              <span className="px-1.5 py-0.2 bg-rose-100 text-rose-700 text-[10px] font-mono font-bold rounded-full">
                {overdueInvoicesList.length} past due
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab('time_entries');
              setSearchTerm('');
            }}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold transition flex items-center gap-1.5 ${
              activeTab === 'time_entries'
                ? 'bg-white text-blue-700 shadow-sm border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>Unbilled Time Entries ({timeEntries.length})</span>
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={
                activeTab === 'retainer_burn'
                  ? 'Search matter #, client, area...'
                  : activeTab === 'invoices'
                  ? 'Search invoice # or client...'
                  : 'Search time logs...'
              }
              className="w-full bg-slate-50 border border-slate-200 rounded-md pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {activeTab === 'retainer_burn' && (
            <select
              value={burnFilter}
              onChange={(e) => setBurnFilter(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Burn Levels ({caseBurnStats.length})</option>
              <option value="critical">Critical Burn (&gt;80%) ({criticalBurnCases.length})</option>
              <option value="moderate">Moderate Burn (50–79%)</option>
              <option value="healthy">Healthy Burn (&lt;50%)</option>
            </select>
          )}

          {activeTab === 'invoices' && (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="overdue">Overdue Invoices ({overdueInvoicesList.length})</option>
              <option value="needs_reminder">Needs Email Reminder ({overdueInvoicesList.filter(i => !i.lastReminderSent).length})</option>
              <option value="paid">Paid</option>
              <option value="sent">Sent</option>
              <option value="pending_approval">Pending Approval</option>
            </select>
          )}
        </div>
      </div>

      {/* TAB 1: RETAINER BURN & CASE BUDGET CARDS */}
      {activeTab === 'retainer_burn' && (
        <div className="space-y-6">
          {/* Summary Recharts Comparison Section */}
          <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4 text-blue-600" />
                  <span>Matter Retainer Pool vs. Accrued Billings Comparison</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Visual breakdown of initial client retainers versus cumulative billables with the 80% critical burn threshold marked.
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-slate-300 inline-block" />
                  <span className="text-slate-600">Retainer Cap</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-blue-600 inline-block" />
                  <span className="text-slate-600">Total Billed</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-amber-500 inline-block" />
                  <span className="text-amber-800 font-semibold">&gt;80% Alert</span>
                </div>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} />
                  <YAxis
                    tickFormatter={(val) => `$${(val / 1000).toFixed(0)}k`}
                    tick={{ fontSize: 11, fill: '#64748b' }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="p-3 bg-slate-900 text-white rounded-lg shadow-xl text-xs space-y-1.5 border border-slate-700">
                            <p className="font-bold text-slate-200">{data.fullName}</p>
                            <p className="font-mono text-slate-400">Matter: {data.name}</p>
                            <div className="pt-1 border-t border-slate-700 space-y-1">
                              <p className="flex justify-between gap-4">
                                <span className="text-slate-400">Retainer Cap:</span>
                                <span className="font-mono font-bold text-white">${data.retainer.toLocaleString()}</span>
                              </p>
                              <p className="flex justify-between gap-4">
                                <span className="text-slate-400">Total Billed:</span>
                                <span className="font-mono font-bold text-blue-400">${data.billed.toLocaleString()}</span>
                              </p>
                              <p className="flex justify-between gap-4 font-bold">
                                <span className="text-slate-300">Burn Ratio:</span>
                                <span className={data.burnPct >= 80 ? 'text-amber-400' : 'text-emerald-400'}>
                                  {data.burnPct}%
                                </span>
                              </p>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="retainer" name="Retainer Cap" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="billed" name="Total Billed" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.burnPct >= 80 ? '#f59e0b' : '#2563eb'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Case Retainer Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredCaseBurnStats.map((c) => {
              const isAlert = c.burnPct >= 80;
              const isExceeded = c.isExceeded;

              return (
                <div
                  key={c.id}
                  className={`p-5 bg-white rounded-xl shadow-sm border transition flex flex-col justify-between space-y-4 ${
                    isExceeded
                      ? 'border-rose-400 ring-2 ring-rose-500/20 bg-rose-50/10'
                      : isAlert
                      ? 'border-amber-400 ring-2 ring-amber-500/20 bg-amber-50/15'
                      : 'border-slate-200 hover:border-blue-300'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Header with Badges */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 mb-1">
                          <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                            {c.caseNumber}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                            {c.practiceArea}
                          </span>
                        </div>
                        <h3 className="font-bold text-slate-900 text-base group-hover:text-blue-600 transition truncate">
                          {c.title}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5 truncate">
                          Client: <strong className="text-slate-800">{c.clientName}</strong> ({c.clientEmail})
                        </p>
                      </div>

                      <div className="shrink-0">
                        {renderBurnBadge(c.burnPct, isExceeded, isAlert)}
                      </div>
                    </div>

                    {/* Retainer Burn Progress Bar with Threshold Markers */}
                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-700 flex items-center gap-1">
                          <span>Retainer Burn Progress</span>
                          {isAlert && <Flame className="w-3.5 h-3.5 text-amber-600 fill-amber-500/30" />}
                        </span>
                        <span className="font-mono font-bold text-slate-900">
                          {c.burnPct}% <span className="text-slate-400 font-normal">of cap</span>
                        </span>
                      </div>

                      {/* Meter Bar */}
                      <div className="relative w-full h-3.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                        {/* 80% Threshold Guide Line */}
                        <div
                          className="absolute top-0 bottom-0 w-0.5 bg-amber-500 z-10 opacity-70"
                          style={{ left: '80%' }}
                          title="80% Retainer Alert Threshold"
                        />
                        {/* Progress Fill */}
                        <div
                          className={`h-full transition-all duration-500 rounded-full ${
                            isExceeded
                              ? 'bg-gradient-to-r from-rose-500 to-red-600 animate-pulse'
                              : isAlert
                              ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                              : c.burnPct >= 50
                              ? 'bg-gradient-to-r from-blue-500 to-amber-500'
                              : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(100, c.burnPct)}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                        <span>$0 (0%)</span>
                        <span className="text-amber-600 font-semibold">80% Alert Line</span>
                        <span>${c.retainerAmount.toLocaleString()} (100%)</span>
                      </div>
                    </div>

                    {/* Financial Metrics Cards */}
                    <div className="grid grid-cols-3 gap-2 pt-1">
                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                        <span className="block text-[10px] text-slate-500 font-medium">Initial Retainer</span>
                        <span className="font-mono font-bold text-xs text-slate-900">
                          ${c.retainerAmount.toLocaleString()}
                        </span>
                      </div>

                      <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                        <span className="block text-[10px] text-slate-500 font-medium">Total Billed</span>
                        <span className={`font-mono font-bold text-xs ${isAlert ? 'text-amber-700' : 'text-blue-700'}`}>
                          ${c.totalBilled.toLocaleString()}
                        </span>
                      </div>

                      <div className={`p-2 rounded-lg border ${
                        c.remainingAmount <= 0
                          ? 'bg-rose-50 border-rose-200 text-rose-800'
                          : isAlert
                          ? 'bg-amber-50 border-amber-200 text-amber-900'
                          : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      }`}>
                        <span className="block text-[10px] opacity-80 font-medium">
                          {c.remainingAmount <= 0 ? 'Deficit / Uncovered' : 'Remaining Buffer'}
                        </span>
                        <span className="font-mono font-bold text-xs">
                          {c.remainingAmount <= 0 ? `-$${Math.abs(c.remainingAmount).toLocaleString()}` : `$${c.remainingAmount.toLocaleString()}`}
                        </span>
                      </div>
                    </div>

                    {/* Counsel & Rate Footnote */}
                    <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                      <span>Lead Counsel: <strong className="text-slate-700">{c.assignedLawyerName}</strong></span>
                      <span className="font-mono">${c.hourlyRate}/hr • ~{c.hoursRemaining}h buffer</span>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                    <button
                      onClick={() => {
                        setTimeCaseId(c.id);
                        setTimeRate(c.hourlyRate ? c.hourlyRate.toString() : '420');
                        setIsTimeModalOpen(true);
                      }}
                      className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-lg border border-slate-200 transition flex items-center gap-1.5"
                    >
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      <span>Log Time</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveTab('invoices');
                        setSearchTerm(c.caseNumber);
                      }}
                      className="px-2.5 py-1.5 text-slate-500 hover:text-slate-800 text-xs font-semibold transition"
                    >
                      View Invoices
                    </button>

                    <button
                      onClick={() => {
                        setExportClientName(c.clientName);
                        setExportCaseId(c.id);
                        setIsMonthlyExportModalOpen(true);
                      }}
                      className="px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs rounded-lg border border-blue-200 transition flex items-center gap-1 shadow-sm"
                      title="Export branded monthly billing statement & PDF invoice for this client"
                    >
                      <FileText className="w-3.5 h-3.5 text-blue-600" />
                      <span>Monthly PDF</span>
                    </button>

                    <button
                      onClick={() => handleOpenReplenishmentInvoice(c)}
                      className={`px-3.5 py-1.5 text-white font-bold text-xs rounded-lg shadow-sm transition flex items-center gap-1.5 ${
                        isAlert
                          ? 'bg-amber-600 hover:bg-amber-700'
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{isAlert ? 'Replenish Retainer' : 'Top-Up Invoice'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredCaseBurnStats.length === 0 && (
            <div className="p-12 text-center bg-white border border-slate-200 rounded-xl space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <Flame className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-base">No Matching Retainer Burn Matters</h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                No active cases found matching your search term or burn severity filter.
              </p>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setBurnFilter('all');
                }}
                className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg shadow-sm"
              >
                Reset Filters
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: INVOICES LEDGER */}
      {activeTab === 'invoices' && (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-white border border-slate-200 rounded-lg shadow-sm">
            <div>
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                <span>Client Invoices Ledger & Accounts Receivable</span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Track formal matter invoices, settlements, and export branded billing statements.
              </p>
            </div>
            <button
              onClick={() => {
                setExportCaseId('all');
                setIsMonthlyExportModalOpen(true);
              }}
              className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs rounded-md border border-blue-200 shadow-sm transition flex items-center gap-1.5 shrink-0"
            >
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span>Export Client Monthly PDF</span>
            </button>
          </div>

          {filteredInvoices.map((inv) => {
            const caseBurn = caseBurnMap[inv.caseId];
            const balanceDue = inv.totalAmount - inv.amountPaid;
            const daysOverdue = calculateDaysOverdue(inv.dueDate);
            const isPastDue = (inv.status === 'overdue' || (inv.dueDate < '2026-08-23' && balanceDue > 0)) && inv.status !== 'paid';

            return (
              <div
                key={inv.id}
                className={`p-4 bg-white border rounded-lg shadow-sm transition flex flex-col md:flex-row md:items-center justify-between gap-4 text-slate-900 ${
                  isPastDue ? 'border-amber-200/90 hover:border-amber-400 bg-amber-50/15' : 'border-slate-200 hover:border-blue-400'
                }`}
              >
                <div className="space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900">{inv.invoiceNumber}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${statusBadge[inv.status]}`}>
                      {inv.status.replace('_', ' ')}
                    </span>
                    {isPastDue && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 border border-rose-200 flex items-center gap-1 font-mono">
                        <AlertCircle className="w-3 h-3 text-rose-600" />
                        {daysOverdue}d Past Due
                      </span>
                    )}
                    {inv.lastReminderSent && (
                      <button
                        onClick={() => {
                          setReminderModalInvoiceId(inv.id);
                          setIsReminderModalOpen(true);
                        }}
                        className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 flex items-center gap-1 cursor-pointer transition shadow-2xs"
                        title="Click to view full reminder log and send follow-up"
                      >
                        <Mail className="w-3 h-3 text-blue-600" />
                        <span>
                          {inv.reminderHistory && inv.reminderHistory.length > 1
                            ? `${inv.reminderHistory.length} Reminders Sent`
                            : '1st Notice Sent'} ({inv.lastReminderSent.sentAt.slice(5, 10)})
                        </span>
                      </button>
                    )}
                    {caseBurn && caseBurn.burnPct >= 80 && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                        <Flame className="w-3 h-3 text-amber-600 fill-amber-500/20" />
                        Retainer {caseBurn.burnPct}% Burned
                      </span>
                    )}
                    <span className="text-xs text-slate-500">Issue: {inv.issueDate} • Due: {inv.dueDate}</span>
                  </div>

                  <h3 className="font-bold text-slate-900 text-sm">{inv.caseTitle}</h3>
                  <p className="text-xs text-slate-500">
                    Client: <strong className="text-slate-800">{inv.clientName}</strong> ({inv.clientEmail})
                  </p>
                </div>

                <div className="flex items-center gap-3.5 self-end md:self-center shrink-0">
                  <div className="text-right">
                    <div className="text-base font-bold font-mono text-slate-900">
                      ${inv.totalAmount.toLocaleString()}
                    </div>
                    <div className="text-xs font-mono text-slate-500">
                      {inv.amountPaid > 0 ? (
                        <>
                          Paid: <span className="text-emerald-700 font-semibold">${inv.amountPaid.toLocaleString()}</span>
                          {balanceDue > 0 && (
                            <span className="text-rose-700 ml-1.5 font-bold font-mono">(${balanceDue.toLocaleString()} due)</span>
                          )}
                        </>
                      ) : (
                        <span className="text-rose-600 font-semibold">Unpaid (${balanceDue.toLocaleString()})</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => exportInvoicePDF(inv)}
                      title="Download Invoice PDF"
                      className="p-1.5 bg-white hover:bg-slate-50 text-slate-700 rounded-md border border-slate-200 shadow-sm transition"
                    >
                      <FileType className="w-4 h-4 text-blue-600" />
                    </button>

                    {inv.status !== 'paid' && (
                      <button
                        onClick={() => {
                          setReminderModalInvoiceId(inv.id);
                          setIsReminderModalOpen(true);
                        }}
                        title="Draft, customize, and send overdue email reminder"
                        className={`px-2.5 py-1.5 font-semibold text-xs rounded-md border shadow-2xs transition flex items-center gap-1.5 ${
                          isPastDue
                            ? 'bg-amber-500 hover:bg-amber-600 text-white border-amber-600 shadow-sm'
                            : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                        }`}
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>{isPastDue ? 'Draft Reminder' : 'Email Notice'}</span>
                      </button>
                    )}

                    {inv.status !== 'paid' && (
                      <button
                        onClick={() => {
                          setPaymentModalInvoice(inv);
                          setPaymentAmount((inv.totalAmount - inv.amountPaid).toString());
                        }}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-md shadow-sm transition"
                      >
                        Receive Payment
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 3: UNBILLED TIME ENTRIES */}
      {activeTab === 'time_entries' && (
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-white border border-slate-200 rounded-lg shadow-sm">
            <div>
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-blue-600" />
                <span>Itemized Billable Time Entries Ledger</span>
                <span className="ml-2 font-mono text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  {filteredTimeEntries.length} entries in period
                </span>
              </h3>
              <p className="text-[11px] text-slate-500">
                Logged attorney hours, billable rates, and service descriptions filtered for: <strong className="text-slate-700">{dateRangeLabel}</strong>.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => setIsTimeModalOpen(true)}
                className="px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 font-semibold text-xs rounded-md border border-slate-200 transition flex items-center gap-1.5"
              >
                <Clock className="w-3.5 h-3.5 text-amber-600" />
                <span>Log Time</span>
              </button>
              <button
                onClick={() => {
                  setExportCaseId('all');
                  setIsMonthlyExportModalOpen(true);
                }}
                className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs rounded-md border border-blue-200 shadow-sm transition flex items-center gap-1.5"
              >
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                <span>Export Monthly Time Entries PDF</span>
              </button>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-4 overflow-x-auto text-slate-900">
            {filteredTimeEntries.length > 0 ? (
              <table className="w-full text-left text-xs text-slate-800">
                <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200 font-bold">
                  <tr>
                    <th className="px-3 py-2.5">Date</th>
                    <th className="px-3 py-2.5">Case Matter</th>
                    <th className="px-3 py-2.5">Attorney</th>
                    <th className="px-3 py-2.5">Hours</th>
                    <th className="px-3 py-2.5">Rate</th>
                    <th className="px-3 py-2.5">Total Amount</th>
                    <th className="px-3 py-2.5">Status</th>
                    <th className="px-3 py-2.5">Description</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredTimeEntries.map((te) => (
                    <tr key={te.id} className="hover:bg-slate-50 transition">
                      <td className="px-3 py-2.5 font-mono text-slate-500 whitespace-nowrap">{te.date}</td>
                      <td className="px-3 py-2.5 font-bold text-slate-900">{te.caseTitle}</td>
                      <td className="px-3 py-2.5 text-slate-700">{te.lawyerName}</td>
                      <td className="px-3 py-2.5 font-mono text-blue-700 font-bold">{te.hours} hrs</td>
                      <td className="px-3 py-2.5 font-mono text-slate-600">${te.rate}/hr</td>
                      <td className="px-3 py-2.5 font-mono font-bold text-slate-900">${te.amount.toLocaleString()}</td>
                      <td className="px-3 py-2.5 whitespace-nowrap">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${
                            te.isBilled
                              ? 'bg-slate-100 text-slate-700 border-slate-200'
                              : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          }`}
                        >
                          {te.isBilled ? 'Billed' : 'Unbilled WIP'}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-slate-600 max-w-xs truncate">{te.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="py-12 text-center text-slate-500 space-y-3">
                <Clock className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="font-semibold text-slate-700 text-sm">No time entries match the selected date range or search query.</p>
                <p className="text-xs text-slate-400">
                  Try adjusting or resetting your billing cycle date filter ({dateRangeLabel}).
                </p>
                <button
                  onClick={() => handleSelectPreset('all')}
                  className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 font-semibold text-xs rounded-md border border-blue-200 transition"
                >
                  Reset to All Dates
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Time Entry Modal */}
      {isTimeModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden animate-in fade-in text-slate-900">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">Log Billable Time Entry</h3>
              <button onClick={() => setIsTimeModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTimeEntry} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Target Case File *</label>
                <select
                  value={timeCaseId}
                  onChange={(e) => setTimeCaseId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-slate-900 focus:outline-none"
                >
                  {cases.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.caseNumber} - {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Hours Spent *</label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={timeHours}
                    onChange={(e) => setTimeHours(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-slate-900 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Billing Rate ($/hr) *</label>
                  <input
                    type="number"
                    required
                    value={timeRate}
                    onChange={(e) => setTimeRate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-slate-900 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Detailed Service Description *</label>
                <textarea
                  rows={3}
                  required
                  value={timeDesc}
                  onChange={(e) => setTimeDesc(e.target.value)}
                  placeholder="Drafting opposition brief, reviewing discovery logs, client conference call..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsTimeModalOpen(false)}
                  className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-sm"
                >
                  Save Time Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Invoice Generator Modal */}
      {isInvoiceModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden animate-in fade-in text-slate-900">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">Generate Client Invoice / Retainer Top-Up</h3>
              <button onClick={() => setIsInvoiceModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Target Matter File *</label>
                <select
                  value={invCaseId}
                  onChange={(e) => {
                    setInvCaseId(e.target.value);
                    const selected = cases.find((c) => c.id === e.target.value);
                    if (selected && selected.hourlyRate) {
                      setInvRate(selected.hourlyRate.toString());
                    }
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-slate-900 focus:outline-none"
                >
                  {cases.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.caseNumber} - {c.title} ({c.clientName})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Line Item Description</label>
                <input
                  type="text"
                  required
                  value={invItemDesc}
                  onChange={(e) => setInvItemDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-slate-900 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Billable Units / Hours</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={invHours}
                    onChange={(e) => setInvHours(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-slate-900 focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Hourly Rate / Unit ($)</label>
                  <input
                    type="number"
                    required
                    value={invRate}
                    onChange={(e) => setInvRate(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-slate-900 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-md border border-slate-200 flex justify-between items-center font-mono">
                <span className="text-slate-600 font-semibold">Calculated Invoice Subtotal:</span>
                <span className="text-base font-bold text-blue-700">
                  ${(Number(invHours) * Number(invRate)).toLocaleString()}
                </span>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsInvoiceModalOpen(false)}
                  className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-sm"
                >
                  Issue Invoice to Client
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Online Payment Simulator Modal */}
      {paymentModalInvoice && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden animate-in fade-in text-slate-900">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <h3 className="font-bold text-slate-900 text-sm">Record Client Payment</h3>
              <button onClick={() => setPaymentModalInvoice(null)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleProcessPaymentSubmit} className="p-5 space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-md border border-slate-200 space-y-1">
                <p className="font-mono font-bold text-slate-900">{paymentModalInvoice.invoiceNumber}</p>
                <p className="text-slate-600">Client: {paymentModalInvoice.clientName}</p>
                <p className="text-slate-600">
                  Total Due: <span className="text-emerald-700 font-mono font-bold">${paymentModalInvoice.totalAmount.toLocaleString()}</span>
                </p>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Payment Deposit Amount ($)</label>
                <input
                  type="number"
                  required
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-slate-900 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="p-3 bg-emerald-50 rounded-md border border-emerald-200 text-emerald-800 text-[11px] flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
                <span className="font-medium">Simulated PCI-DSS Encrypted Payment Ledger Deposit</span>
              </div>

              <div className="pt-2 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setPaymentModalInvoice(null)}
                  className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessingPayment}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-md shadow-sm transition disabled:opacity-50"
                >
                  {isProcessingPayment ? 'Posting to Ledger...' : 'Confirm Receipt'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Client Monthly Billing & Invoice PDF Export Modal */}
      {isMonthlyExportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in text-slate-900 my-8">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 flex items-start justify-between bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white">
              <div className="flex items-start gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/20 border border-blue-400/30 text-blue-300">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white flex items-center gap-2">
                    Export Client Monthly Billing Statement & Invoice
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Generate an official ABA/NY-Bar branded PDF dossier containing itemized time entries, invoices, and trust ledger reconciliation.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsMonthlyExportModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-5 text-xs">
              {/* Client & Matter Selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1.5 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>Target Client Account</span>
                  </label>
                  <select
                    value={exportClientName}
                    onChange={(e) => {
                      setExportClientName(e.target.value);
                      setExportCaseId('all');
                    }}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="All Clients">All Clients (Consolidated Firm Ledger)</option>
                    {uniqueClients.map((cl) => (
                      <option key={cl.clientName} value={cl.clientName}>
                        {cl.clientName} ({cl.cases.length} active matter{cl.cases.length > 1 ? 's' : ''})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1.5 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-blue-600" />
                    <span>Matter / Case Filter</span>
                  </label>
                  <select
                    value={exportCaseId}
                    onChange={(e) => setExportCaseId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Matters ({exportAvailableCases.length} matters)</option>
                    {exportAvailableCases.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.caseNumber} - {c.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Month / Period Selection */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-slate-700 font-bold flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    <span>Statement Date Range / Cycle</span>
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setExportDateMode('month')}
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded border transition ${
                        exportDateMode === 'month'
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      Preset Months
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setExportDateMode('custom_range');
                        if (!exportStartDate) setExportStartDate(startDate || '2026-08-01');
                        if (!exportEndDate) setExportEndDate(endDate || '2026-08-31');
                      }}
                      className={`text-[11px] font-semibold px-2 py-0.5 rounded border transition ${
                        exportDateMode === 'custom_range'
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      Custom Dates
                    </button>
                    {isDateFilterActive && (
                      <button
                        type="button"
                        onClick={() => {
                          setExportDateMode('custom_range');
                          setExportStartDate(startDate);
                          setExportEndDate(endDate);
                        }}
                        className="text-[11px] font-semibold px-2 py-0.5 rounded border bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 transition flex items-center gap-1"
                        title="Sync with the date filter active in BillingView"
                      >
                        <RotateCcw className="w-3 h-3 text-blue-600" />
                        <span>Use Active Filter</span>
                      </button>
                    )}
                  </div>
                </div>

                {exportDateMode === 'month' ? (
                  <div className="flex flex-wrap items-center gap-2">
                    {[
                      { label: 'August 2026 (Current)', value: '2026-08' },
                      { label: 'July 2026', value: '2026-07' },
                      { label: 'June 2026', value: '2026-06' },
                      { label: 'All Historic Activity', value: 'all' }
                    ].map((m) => (
                      <button
                        key={m.value}
                        type="button"
                        onClick={() => setExportMonthYear(m.value)}
                        className={`px-3 py-1.5 rounded-lg font-semibold text-xs border transition ${
                          exportMonthYear === m.value
                            ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {m.label}
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-2.5 bg-slate-50 border border-slate-200 rounded-lg">
                    <div>
                      <span className="text-[11px] font-bold text-slate-600 block mb-1">Start Date (From):</span>
                      <input
                        type="date"
                        value={exportStartDate}
                        onChange={(e) => setExportStartDate(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <span className="text-[11px] font-bold text-slate-600 block mb-1">End Date (To):</span>
                      <input
                        type="date"
                        value={exportEndDate}
                        onChange={(e) => setExportEndDate(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs text-slate-900 font-mono focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Document Inclusion Controls */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <span className="block font-bold text-slate-800 text-xs">
                  Document Sections & Ledgers to Include:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={exportIncludeTimeEntries}
                      onChange={(e) => setExportIncludeTimeEntries(e.target.checked)}
                      className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                    />
                    <div>
                      <span className="font-semibold text-slate-800 block">Itemized Time Entries</span>
                      <span className="text-[11px] text-slate-500">Hourly billable activity</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={exportIncludeInvoices}
                      onChange={(e) => setExportIncludeInvoices(e.target.checked)}
                      className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                    />
                    <div>
                      <span className="font-semibold text-slate-800 block">Invoices & Balances</span>
                      <span className="text-[11px] text-slate-500">Issued fees & payments</span>
                    </div>
                  </label>

                  <label className="flex items-start gap-2.5 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={exportIncludeRetainer}
                      onChange={(e) => setExportIncludeRetainer(e.target.checked)}
                      className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                    />
                    <div>
                      <span className="font-semibold text-slate-800 block">Retainer Trust Ledger</span>
                      <span className="text-[11px] text-slate-500">Escrow buffer & replenishment</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Live Statement Summary Preview Box */}
              <div className="p-4 bg-gradient-to-br from-blue-50/70 to-slate-50 border border-blue-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between border-b border-blue-100 pb-2">
                  <span className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    <span>Statement Data Snapshot ({exportMonthYear === 'all' ? 'All Records' : exportMonthYear})</span>
                  </span>
                  <span className="font-mono text-[11px] text-slate-600 bg-white px-2 py-0.5 rounded border border-blue-200">
                    {exportPreviewData.matchedTimeEntries.length} Time Logs • {exportPreviewData.matchedInvoices.length} Invoices
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-2.5 bg-white rounded-lg border border-slate-200/80 shadow-xs">
                    <span className="text-[10px] text-slate-500 block">Billable Hours</span>
                    <span className="font-mono font-bold text-sm text-blue-700">
                      {exportPreviewData.totalHours.toFixed(1)} hrs
                    </span>
                    <span className="text-[10px] text-slate-400 block">${exportPreviewData.totalTimeFees.toLocaleString()} fees</span>
                  </div>

                  <div className="p-2.5 bg-white rounded-lg border border-slate-200/80 shadow-xs">
                    <span className="text-[10px] text-slate-500 block">Total Invoiced</span>
                    <span className="font-mono font-bold text-sm text-slate-900">
                      ${exportPreviewData.totalInvoiced.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-emerald-600 block">${exportPreviewData.totalPaid.toLocaleString()} collected</span>
                  </div>

                  <div className="p-2.5 bg-white rounded-lg border border-slate-200/80 shadow-xs">
                    <span className="text-[10px] text-slate-500 block">Outstanding Balance</span>
                    <span className={`font-mono font-bold text-sm ${exportPreviewData.balanceDue > 0 ? 'text-amber-700' : 'text-slate-900'}`}>
                      ${exportPreviewData.balanceDue.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400 block">{exportPreviewData.balanceDue > 0 ? 'Due on receipt' : 'Zero balance'}</span>
                  </div>

                  <div className="p-2.5 bg-white rounded-lg border border-slate-200/80 shadow-xs">
                    <span className="text-[10px] text-slate-500 block">Retainer Trust Pool</span>
                    <span className="font-mono font-bold text-sm text-emerald-700">
                      ${exportPreviewData.totalRetainer.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400 block">IOLTA secured</span>
                  </div>
                </div>
              </div>

              {/* Custom Cover Note */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">
                  Optional Counsel Cover Note / Instructions
                </label>
                <textarea
                  rows={2}
                  value={exportCustomNotes}
                  onChange={(e) => setExportCustomNotes(e.target.value)}
                  placeholder="e.g., Attached is the monthly statement for August 2026. Please remit wire balance by the 1st of next month."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Modal Actions */}
              <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Confidential Attorney-Client Privileged Financial Work Product</span>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={() => setIsMonthlyExportModalOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold text-xs transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={handleTriggerMonthlyPDFExport}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-bold text-xs shadow-md flex items-center gap-2 transition"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Branded PDF Statement</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Overdue Invoices Reminder Modal */}
      <OverdueReminderModal
        isOpen={isReminderModalOpen}
        onClose={() => setIsReminderModalOpen(false)}
        invoices={invoices}
        cases={cases}
        initialInvoiceId={reminderModalInvoiceId}
        onSendReminder={handleSendReminder}
      />
    </div>
  );
};

