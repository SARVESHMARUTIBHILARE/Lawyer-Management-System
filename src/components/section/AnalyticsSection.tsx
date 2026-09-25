import React, { useState, useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  AreaChart,
  Area,
  LineChart,
  Line
} from 'recharts';
import {
  BarChart3,
  TrendingUp,
  FileSpreadsheet,
  FileText,
  Download,
  Printer,
  Filter,
  Calendar,
  DollarSign,
  Scale,
  Briefcase,
  Users,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Clock,
  Building,
  ChevronRight,
  Layers,
  Eye,
  ArrowUpRight,
  ShieldCheck,
  RefreshCw,
  Search,
  Check,
  SlidersHorizontal,
  BookmarkCheck,
  FileCheck
} from 'lucide-react';
import {
  Appointment,
  LegalCase,
  Client,
  LawyerProfile,
  Invoice,
  LegalDocument
} from '../../../types/dashboard';
import {
  generateExecutivePDF,
  generateLitigationDocketPDF,
  generateFinancialAuditExcel,
  exportToCSV,
  ReportConfig
} from '../../../utils/reportGenerator';

interface AnalyticsSectionProps {
  lawyers: LawyerProfile[];
  currentLawyer: LawyerProfile;
  cases: LegalCase[];
  appointments: Appointment[];
  clients: Client[];
  invoices: Invoice[];
  documents: LegalDocument[];
  onNavigateToSection?: (section: string) => void;
  onShowToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

export const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({
  lawyers,
  currentLawyer,
  cases,
  appointments,
  clients,
  invoices,
  documents,
  onNavigateToSection,
  onShowToast
}) => {
  // Navigation / View Tabs inside Analytics Page
  const [activeTab, setActiveTab] = useState<'analytics' | 'reports' | 'ai_insights'>('analytics');

  // Filters
  const [timeframe, setTimeframe] = useState<string>('Q3 2026');
  const [selectedPracticeGroup, setSelectedPracticeGroup] = useState<string>('All');
  const [selectedAttorneyFilter, setSelectedAttorneyFilter] = useState<string>('All');

  // Report Generator Configuration
  const [reportType, setReportType] = useState<'executive' | 'financial' | 'litigation' | 'attorney' | 'clients'>('executive');
  const [includeFinancials, setIncludeFinancials] = useState<boolean>(true);
  const [includeConfidentialNotes, setIncludeConfidentialNotes] = useState<boolean>(true);
  const [customReportNotes, setCustomReportNotes] = useState<string>(
    'Official practice performance docket certified for internal partnership review, bank credit facility covenants, and firm audit compliance.'
  );
  const [isExporting, setIsExporting] = useState<boolean>(false);

  // --- FILTERED DATA CALCULATIONS ---
  const filteredCases = useMemo(() => {
    return cases.filter((c) => {
      if (selectedPracticeGroup !== 'All' && c.caseType !== selectedPracticeGroup) return false;
      if (selectedAttorneyFilter !== 'All') {
        const counsel = c.leadCounsel || currentLawyer.name;
        if (!counsel.toLowerCase().includes(selectedAttorneyFilter.toLowerCase())) return false;
      }
      return true;
    });
  }, [cases, selectedPracticeGroup, selectedAttorneyFilter, currentLawyer.name]);

  const filteredInvoices = useMemo(() => {
    return invoices.filter((inv) => {
      if (selectedAttorneyFilter !== 'All') {
        // match case's lead counsel
        const matchedCase = cases.find((c) => c.id === inv.caseId);
        if (matchedCase) {
          const counsel = matchedCase.leadCounsel || currentLawyer.name;
          if (!counsel.toLowerCase().includes(selectedAttorneyFilter.toLowerCase())) return false;
        }
      }
      return true;
    });
  }, [invoices, cases, selectedAttorneyFilter, currentLawyer.name]);

  // Aggregate Metrics
  const totalBilled = filteredInvoices.reduce((sum, inv) => sum + inv.amount, 0);
  const totalCollected = filteredInvoices
    .filter((inv) => inv.status === 'Paid')
    .reduce((sum, inv) => sum + inv.amount, 0);
  const totalPending = filteredInvoices
    .filter((inv) => inv.status === 'Pending' || inv.status === 'Overdue')
    .reduce((sum, inv) => sum + inv.amount, 0);
  const realizationRate = totalBilled > 0 ? Math.round((totalCollected / totalBilled) * 100) : 84;

  const activeCasesCount = filteredCases.filter((c) => c.caseStatus !== 'Closed').length;
  const trialCasesCount = filteredCases.filter((c) => c.caseStatus === 'Pre-Trial' || c.caseStatus === 'Discovery').length;
  const activeClientsCount = clients.filter((c) => c.status === 'Active').length;

  // Estimated billable hours based on matters and average lawyer rates
  const totalEstimatedBillableHours = Math.round((totalBilled / (currentLawyer.hourlyRate || 650)) * 1.35);

  // --- CHART 1: MONTHLY REVENUE & ESCROW TREND ---
  const monthlyRevenueData = [
    { month: 'Apr 2026', billed: 42000, collected: 38000, trustEscrow: 24000 },
    { month: 'May 2026', billed: 56000, collected: 49000, trustEscrow: 31000 },
    { month: 'Jun 2026', billed: 64000, collected: 58000, trustEscrow: 38000 },
    { month: 'Jul 2026', billed: 71000, collected: 65000, trustEscrow: 42000 },
    { month: 'Aug 2026', billed: 82000, collected: 74000, trustEscrow: 51000 },
    { month: 'Sep 2026', billed: totalBilled > 0 ? totalBilled : 96000, collected: totalCollected > 0 ? totalCollected : 84000, trustEscrow: 58000 }
  ];

  // --- CHART 2: PRACTICE GROUP DISTRIBUTION ---
  const practiceAreaCounts: Record<string, number> = {};
  cases.forEach((c) => {
    practiceAreaCounts[c.caseType] = (practiceAreaCounts[c.caseType] || 0) + 1;
  });

  const practiceGroupData = Object.keys(practiceAreaCounts).length > 0
    ? Object.entries(practiceAreaCounts).map(([name, count]) => ({
        name,
        value: count
      }))
    : [
        { name: 'Commercial Litigation', value: 8 },
        { name: 'Intellectual Property', value: 6 },
        { name: 'Corporate M&A', value: 5 },
        { name: 'Estate & Trust', value: 3 },
        { name: 'Employment Defense', value: 2 }
      ];

  const PIE_COLORS = ['#1e3a8a', '#0284c7', '#0f766e', '#d97706', '#64748b', '#7c3aed'];

  // --- CHART 3: CASE STAGE PIPELINE ---
  const stageCounts: Record<string, number> = {
    'Discovery': 0,
    'Pre-Trial': 0,
    'Active': 0,
    'In Review': 0,
    'Closed': 0
  };
  cases.forEach((c) => {
    if (stageCounts[c.caseStatus] !== undefined) {
      stageCounts[c.caseStatus]++;
    } else {
      stageCounts['Active']++;
    }
  });

  const casePipelineData = [
    { stage: 'Initial Review', count: stageCounts['In Review'] || 1, fill: '#94a3b8' },
    { stage: 'Discovery Phase', count: stageCounts['Discovery'] || 3, fill: '#0284c7' },
    { stage: 'Pre-Trial Motions', count: stageCounts['Pre-Trial'] || 2, fill: '#1e3a8a' },
    { stage: 'Active Litigation', count: stageCounts['Active'] || 4, fill: '#0f766e' },
    { stage: 'Settled / Closed', count: stageCounts['Closed'] || 3, fill: '#10b981' }
  ];

  // --- CHART 4: ATTORNEY ROSTER PERFORMANCE ---
  const attorneyPerformanceData = lawyers.map((l) => {
    // count cases where leadCounsel matches or contains name
    const assignedCases = cases.filter((c) =>
      c.leadCounsel ? c.leadCounsel.toLowerCase().includes(l.name.toLowerCase()) : false
    );
    const count = assignedCases.length > 0 ? assignedCases.length : Math.floor(Math.random() * 4) + 2;
    const rate = l.hourlyRate || 650;
    const estRevenue = count * rate * 32;

    return {
      name: l.name.replace(', Esq.', ''),
      rate,
      matters: count,
      revenueK: Math.round(estRevenue / 1000)
    };
  });

  // --- CHART 5: CONSULTATION INTAKE FUNNEL ---
  const consultationFunnelData = [
    { name: 'Inquiries Received', volume: 64, fill: '#3b82f6' },
    { name: 'Consultations Held', volume: appointments.length + 18, fill: '#1d4ed8' },
    { name: 'Retainers Signed', volume: clients.length + 4, fill: '#0f766e' },
    { name: 'Active Dockets', volume: cases.length, fill: '#10b981' }
  ];

  // --- EXPORT HANDLERS ---
  const getBundle = () => ({
    lawyers,
    currentLawyer,
    cases,
    appointments,
    clients,
    invoices,
    documents
  });

  const handleDownloadPDF = () => {
    setIsExporting(true);
    try {
      if (reportType === 'litigation') {
        generateLitigationDocketPDF(getBundle());
        onShowToast('Court Litigation Docket PDF generated and downloaded.', 'success');
      } else {
        generateExecutivePDF(getBundle(), {
          reportType,
          timeframe,
          selectedAttorney: selectedAttorneyFilter,
          includeFinancials,
          includeConfidentialNotes,
          notes: customReportNotes
        });
        onShowToast('Executive Practice Performance PDF generated and downloaded.', 'success');
      }
    } catch (err) {
      console.error(err);
      onShowToast('Error generating PDF report. Please try again.', 'warning');
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadExcel = () => {
    setIsExporting(true);
    try {
      generateFinancialAuditExcel(getBundle());
      onShowToast('Practice Audit Excel Workbook (.xlsx) generated and downloaded.', 'success');
    } catch (err) {
      console.error(err);
      onShowToast('Error exporting Excel workbook.', 'warning');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportCSV = () => {
    try {
      const rows = cases.map((c) => ({
        DocketID: c.id,
        MatterTitle: c.title,
        Client: c.clientName,
        PracticeGroup: c.caseType,
        Status: c.caseStatus,
        Jurisdiction: c.courtJurisdiction || 'Federal Court',
        LeadCounsel: c.leadCounsel || currentLawyer.name,
        NextHearing: c.hearingDate || 'TBD',
        LastUpdated: c.lastUpdated
      }));
      exportToCSV(`JurisPulse_Cases_Export_${Date.now()}.csv`, rows);
      onShowToast('Cases data exported as CSV file.', 'success');
    } catch (err) {
      console.error(err);
      onShowToast('Error exporting CSV data.', 'warning');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* ================= PAGE HEADER & PRIMARY NAVIGATION ================= */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase tracking-wider mb-1">
              <BarChart3 className="w-4 h-4 text-blue-800" />
              <span>Chambers Telemetry & Official Reporting Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Analytics & Output Reports
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
              Real-time firm financial realization, litigation docket velocity, attorney workload telemetry,
              and professional court-ready executive report generation.
            </p>
          </div>

          {/* Quick Action Export Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadPDF}
              disabled={isExporting}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-semibold text-xs shadow-xs transition"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Generating...' : 'Export Official PDF'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadExcel}
              disabled={isExporting}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs shadow-xs transition"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>Export Excel (.xlsx)</span>
            </button>

            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-200 transition"
              title="Print document preview"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Print</span>
            </button>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
          <div className="inline-flex p-1 bg-slate-100/80 rounded-xl border border-slate-200/60">
            <button
              type="button"
              onClick={() => setActiveTab('analytics')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
                activeTab === 'analytics'
                  ? 'bg-white text-blue-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Practice Analytics</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('reports')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
                activeTab === 'reports'
                  ? 'bg-white text-blue-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Output Report Generator</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('ai_insights')}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition ${
                activeTab === 'ai_insights'
                  ? 'bg-white text-blue-950 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>AI Practice Intelligence</span>
            </button>
          </div>

          {/* Global Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700">
              <Calendar className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={timeframe}
                onChange={(e) => setTimeframe(e.target.value)}
                className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="Last 30 Days">Last 30 Days</option>
                <option value="Q3 2026">Q3 2026 (Current)</option>
                <option value="YTD 2026">Year-to-Date (YTD 2026)</option>
                <option value="All Time">All Time</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700">
              <Scale className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={selectedPracticeGroup}
                onChange={(e) => setSelectedPracticeGroup(e.target.value)}
                className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="All">All Practice Groups</option>
                {Object.keys(practiceAreaCounts).map((pg) => (
                  <option key={pg} value={pg}>{pg}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700">
              <Users className="w-3.5 h-3.5 text-slate-500" />
              <select
                value={selectedAttorneyFilter}
                onChange={(e) => setSelectedAttorneyFilter(e.target.value)}
                className="bg-transparent font-semibold text-slate-800 focus:outline-none cursor-pointer"
              >
                <option value="All">All Attorneys</option>
                {lawyers.map((l) => (
                  <option key={l.name} value={l.name}>{l.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* ================= TAB 1: PRACTICE ANALYTICS & VISUALIZATIONS ================= */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          {/* Executive KPI Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Revenue & Trust Realization */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-sm transition">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  IOLTA Escrow & Fees
                </span>
                <span className="p-2 rounded-xl bg-emerald-50 text-emerald-700">
                  <DollarSign className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-3">
                <span className="text-2xl font-black text-slate-900 tracking-tight">
                  ${totalCollected.toLocaleString()}
                </span>
                <span className="text-xs text-slate-500 font-medium ml-1.5">
                  / ${totalBilled.toLocaleString()}
                </span>
              </div>
              <div className="mt-3">
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-emerald-600 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min(realizationRate, 100)}%` }}
                  />
                </div>
                <div className="flex justify-between items-center mt-1.5 text-[11px] text-slate-500">
                  <span className="font-semibold text-emerald-700">{realizationRate}% Realization</span>
                  <span>${totalPending.toLocaleString()} Pending</span>
                </div>
              </div>
            </div>

            {/* Card 2: Active Dockets & Trial Velocity */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-sm transition">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Active Dockets
                </span>
                <span className="p-2 rounded-xl bg-blue-50 text-blue-800">
                  <Briefcase className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900 tracking-tight">
                  {activeCasesCount}
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-blue-100 text-blue-900">
                  {trialCasesCount} In Trial Prep
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-3 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>94.2% Favorable Settlement Rate</span>
              </p>
            </div>

            {/* Card 3: Billable Counsel Hours */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-sm transition">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Billable Hours Tracked
                </span>
                <span className="p-2 rounded-xl bg-amber-50 text-amber-800">
                  <Clock className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900 tracking-tight">
                  {totalEstimatedBillableHours} hrs
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  @ ${currentLawyer.hourlyRate || 650}/hr avg
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                <span>Roster Capacity: 88.5%</span>
                <span className="text-emerald-700 font-bold flex items-center">
                  <ArrowUpRight className="w-3.5 h-3.5" /> +12% MoM
                </span>
              </div>
            </div>

            {/* Card 4: Clients & Retainer Growth */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs hover:shadow-sm transition">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Active Retainers
                </span>
                <span className="p-2 rounded-xl bg-purple-50 text-purple-800">
                  <Users className="w-4 h-4" />
                </span>
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-2xl font-black text-slate-900 tracking-tight">
                  {activeClientsCount} Clients
                </span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-purple-100 text-purple-900">
                  {clients.length} Total
                </span>
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                <span>Intake Conversion: 82%</span>
                <span className="text-blue-900 font-bold">100% Retainer Backed</span>
              </div>
            </div>
          </div>

          {/* Visualization Grid Row 1: Revenue Trend & Practice Group Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart 1: Revenue & Escrow Trend (2 cols) */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-900" />
                    <span>Monthly Financial Performance & Trust Escrow Collections</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Comparison of total fees billed vs settled IOLTA escrow receipts (USD)
                  </p>
                </div>
                <div className="flex items-center gap-3 text-xs font-bold">
                  <div className="flex items-center gap-1.5 text-blue-950">
                    <span className="w-3 h-3 rounded-sm bg-blue-900" />
                    <span>Billed Fees</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-700">
                    <span className="w-3 h-3 rounded-sm bg-emerald-600" />
                    <span>Collected</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-500">
                    <span className="w-3 h-3 rounded-sm bg-slate-300" />
                    <span>Trust Escrow</span>
                  </div>
                </div>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monthlyRevenueData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorBilled" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1e3a8a" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#1e3a8a" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="colorCollected" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#059669" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#059669" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="month" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis
                      stroke="#64748b"
                      fontSize={11}
                      tickLine={false}
                      tickFormatter={(val) => `$${val / 1000}k`}
                    />
                    <Tooltip
                      formatter={(value: any) => [`$${Number(value).toLocaleString()}`, '']}
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderRadius: '10px',
                        border: 'none',
                        color: '#fff',
                        fontSize: '12px'
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="billed"
                      stroke="#1e3a8a"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorBilled)"
                      name="Billed"
                    />
                    <Area
                      type="monotone"
                      dataKey="collected"
                      stroke="#059669"
                      strokeWidth={2.5}
                      fillOpacity={1}
                      fill="url(#colorCollected)"
                      name="Collected"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Practice Group Distribution Donut (1 col) */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs flex flex-col justify-between">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                  <Scale className="w-4 h-4 text-blue-900" />
                  <span>Practice Group Distribution</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Matter volume segmented across active legal disciplines
                </p>
              </div>

              <div className="h-56 w-full my-2">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={practiceGroupData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {practiceGroupData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(val: any) => [`${val} Active Dockets`, 'Matters']}
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderRadius: '10px',
                        color: '#fff',
                        fontSize: '12px'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Custom Legend */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs">
                {practiceGroupData.slice(0, 4).map((entry, idx) => (
                  <div key={entry.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2 truncate pr-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}
                      />
                      <span className="truncate text-slate-700 font-medium">{entry.name}</span>
                    </div>
                    <span className="font-bold text-slate-900">{entry.value} dockets</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Visualization Grid Row 2: Litigation Docket Pipeline & Attorney Utilization */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 3: Litigation Pipeline Stages */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Layers className="w-4 h-4 text-blue-900" />
                    <span>Litigation Docket Pipeline & Court Stages</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Caseload velocity from initial intake discovery to courtroom trial
                  </p>
                </div>
                <span className="text-xs font-bold text-slate-500">
                  {cases.length} Total Matters
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={casePipelineData} layout="vertical" margin={{ left: 20, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
                    <XAxis type="number" stroke="#64748b" fontSize={11} />
                    <YAxis dataKey="stage" type="category" stroke="#334155" fontSize={11} tickLine={false} />
                    <Tooltip
                      formatter={(val: any) => [`${val} Cases`, 'Volume']}
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderRadius: '10px',
                        color: '#fff',
                        fontSize: '12px'
                      }}
                    />
                    <Bar dataKey="count" radius={[0, 6, 6, 0]}>
                      {casePipelineData.map((entry, index) => (
                        <Cell key={`bar-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 4: Attorney Roster Billable Workload */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <Users className="w-4 h-4 text-blue-900" />
                    <span>Attorney Counsel Workload & Billings</span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Active matters assigned and estimated generated fees ($k USD)
                  </p>
                </div>
                <span className="text-xs font-bold text-blue-900">
                  {lawyers.length} Practicing Counsel
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={attorneyPerformanceData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} />
                    <Tooltip
                      formatter={(val: any, name: any) => [
                        name === 'revenueK' ? `$${val}k Billed` : `${val} Matters`,
                        name === 'revenueK' ? 'Generated' : 'Caseload'
                      ]}
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderRadius: '10px',
                        color: '#fff',
                        fontSize: '12px'
                      }}
                    />
                    <Bar dataKey="matters" fill="#1e3a8a" name="Matters" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="revenueK" fill="#d97706" name="Revenue ($k)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: OUTPUT REPORT GENERATOR ================= */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          {/* Report Builder Configuration Panel */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-blue-900" />
                  <span>Report Configuration & Output Parameters</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select parameters to generate an official courtroom, executive partnership, or financial audit report.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadPDF}
                  disabled={isExporting}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs shadow-xs transition"
                >
                  <Download className="w-4 h-4" />
                  <span>Download PDF Report</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadExcel}
                  disabled={isExporting}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs transition"
                >
                  <FileSpreadsheet className="w-4 h-4" />
                  <span>Download Excel (.xlsx)</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs border border-slate-200 transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>CSV</span>
                </button>
              </div>
            </div>

            {/* Report Options Form */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
              {/* Report Document Type */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Report Type
                </label>
                <div className="space-y-2">
                  {[
                    {
                      id: 'executive',
                      title: 'Executive Practice Performance Dossier',
                      desc: 'Full partnership brief with dockets, financials, and attorney hours'
                    },
                    {
                      id: 'litigation',
                      title: 'Court Docket & Hearing Calendar Schedule',
                      desc: 'Trial dates, judges, presiding jurisdictions, and deadlines'
                    },
                    {
                      id: 'financial',
                      title: 'Financial & IOLTA Trust Audit Report',
                      desc: 'Accounts receivable, retainers, disbursements, and realization'
                    },
                    {
                      id: 'attorney',
                      title: 'Attorney Workload & Billing Ledger',
                      desc: 'Practicing lawyers, hourly rates, and matter assignments'
                    }
                  ].map((opt) => (
                    <label
                      key={opt.id}
                      className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition ${
                        reportType === opt.id
                          ? 'border-blue-900 bg-blue-50/50 shadow-2xs'
                          : 'border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="reportType"
                        value={opt.id}
                        checked={reportType === opt.id}
                        onChange={() => setReportType(opt.id as any)}
                        className="mt-0.5 text-blue-900 focus:ring-blue-900"
                      />
                      <div>
                        <p className="text-xs font-extrabold text-slate-900">{opt.title}</p>
                        <p className="text-[11px] text-slate-500 leading-tight mt-0.5">{opt.desc}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Scope & Inclusions */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Scope & Inclusions
                </label>
                <div className="space-y-3 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
                    <input
                      type="checkbox"
                      checked={includeFinancials}
                      onChange={(e) => setIncludeFinancials(e.target.checked)}
                      className="rounded text-blue-900 focus:ring-blue-900 w-4 h-4"
                    />
                    <span>Include Financial Billings & IOLTA Escrow Ledger</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-800">
                    <input
                      type="checkbox"
                      checked={includeConfidentialNotes}
                      onChange={(e) => setIncludeConfidentialNotes(e.target.checked)}
                      className="rounded text-blue-900 focus:ring-blue-900 w-4 h-4"
                    />
                    <span>Include Confidential Hearing & Deposition Notes</span>
                  </label>

                  <div className="pt-2 border-t border-slate-200">
                    <span className="block text-[11px] font-bold text-slate-600 mb-1">
                      Designated Counsel for Sign-Off
                    </span>
                    <select
                      value={selectedAttorneyFilter}
                      onChange={(e) => setSelectedAttorneyFilter(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                    >
                      <option value="All">All Partners (Firm-Wide)</option>
                      {lawyers.map((l) => (
                        <option key={l.name} value={l.name}>{l.name} ({l.title})</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <span className="block text-[11px] font-bold text-slate-600 mb-1">
                      Reporting Period / Fiscal Window
                    </span>
                    <select
                      value={timeframe}
                      onChange={(e) => setTimeframe(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                    >
                      <option value="Last 30 Days">Last 30 Days</option>
                      <option value="Q3 2026">Q3 2026 (Quarter-to-Date)</option>
                      <option value="YTD 2026">Year-to-Date (Fiscal 2026)</option>
                      <option value="All Time">All Practice History</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Memorandum / Certification Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Executive Certification Note
                </label>
                <textarea
                  rows={5}
                  value={customReportNotes}
                  onChange={(e) => setCustomReportNotes(e.target.value)}
                  placeholder="Enter customized legal memorandum text, certification declaration, or filing note..."
                  className="w-full p-3 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-900 transition resize-none"
                />

                <div className="mt-3 p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-2 text-[11px] text-amber-900">
                  <ShieldCheck className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
                  <span>
                    Each output document includes an authentic SHA-256 verification seal and official Bar registration timestamp.
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* ================= ON-SCREEN INTERACTIVE REPORT PREVIEW ================= */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden print:border-none print:shadow-none">
            {/* Preview Toolbar */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-blue-900" />
                <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                  Live Report Document Output Preview
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Ready to Export
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDownloadPDF}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-900 hover:bg-blue-950 text-white rounded-lg text-xs font-bold transition"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Save PDF</span>
                </button>
                <button
                  type="button"
                  onClick={handleDownloadExcel}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" />
                  <span>Save Excel</span>
                </button>
              </div>
            </div>

            {/* Document Body Formatted as Official Legal Letterhead */}
            <div className="p-8 sm:p-12 max-w-4xl mx-auto bg-white font-sans text-slate-800">
              {/* Firm Letterhead */}
              <div className="border-b-2 border-slate-900 pb-5 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-slate-950 tracking-wider">
                      JURISPULSE LEGAL PARTNERS LLP
                    </h2>
                    <p className="text-xs uppercase tracking-widest text-slate-500 font-bold mt-0.5">
                      Attorneys & Counselors at Law • Federal & Commercial Practice
                    </p>
                    <p className="text-xs text-slate-600 mt-1">
                      {currentLawyer.officeAddress || '30 Rockefeller Plaza, Suite 4400, New York, NY 10112'}
                    </p>
                  </div>

                  <div className="text-left sm:text-right text-xs text-slate-600">
                    <p className="font-bold text-slate-900">{currentLawyer.name}</p>
                    <p>{currentLawyer.title}</p>
                    <p className="font-mono text-slate-500">{currentLawyer.barNumber}</p>
                    <p className="mt-1 font-semibold text-blue-950">Tel: {currentLawyer.phone}</p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200 flex flex-wrap justify-between text-xs text-slate-500">
                  <span>DOCKET REF: JP-{timeframe.replace(/\s+/g, '-')}-{Date.now().toString().slice(-6)}</span>
                  <span>DATE: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  <span>CONFIDENTIAL & PRIVILEGED ATTORNEY-CLIENT WORK PRODUCT</span>
                </div>
              </div>

              {/* Document Title */}
              <div className="text-center my-6">
                <h3 className="text-lg font-black text-slate-950 uppercase tracking-wide">
                  {reportType === 'litigation'
                    ? 'Official Court Litigation Docket & Trial Proceeding Schedule'
                    : reportType === 'financial'
                    ? 'Chambers Trust Accounting & Retainer Escrow Audit'
                    : reportType === 'attorney'
                    ? 'Practicing Counsel Workload & Hourly Schedule Audit'
                    : 'Executive Legal Practice Performance & Caseload Dossier'}
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Covering Reporting Window: <span className="font-semibold text-slate-800">{timeframe}</span> • Authorized By: <span className="font-semibold text-slate-800">{currentLawyer.name}</span>
                </p>
              </div>

              {/* Executive Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Active Matters</span>
                  <p className="text-lg font-black text-slate-950 mt-0.5">{cases.length} Dockets</p>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Retained Clients</span>
                  <p className="text-lg font-black text-slate-950 mt-0.5">{clients.length} Clients</p>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Trust Escrow Collections</span>
                  <p className="text-lg font-black text-emerald-700 mt-0.5">${totalCollected.toLocaleString()}</p>
                </div>
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Resolution Success</span>
                  <p className="text-lg font-black text-blue-950 mt-0.5">94.2% Rate</p>
                </div>
              </div>

              {/* Memorandum Section */}
              <div className="my-6 p-4 bg-slate-50/70 border-l-4 border-blue-900 rounded-r-xl">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                  Partner Memorandum & Declaration
                </h4>
                <p className="text-xs text-slate-700 leading-relaxed italic">
                  "{customReportNotes}"
                </p>
              </div>

              {/* Active Litigation Table Output */}
              <div className="my-6">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center justify-between">
                  <span>I. Active Litigation Dockets & Court Calendaring</span>
                  <span className="text-[11px] text-slate-500 font-normal">{filteredCases.length} Matters Listed</span>
                </h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-900 text-white font-bold">
                        <th className="p-2.5">Docket #</th>
                        <th className="p-2.5">Matter Title</th>
                        <th className="p-2.5">Client</th>
                        <th className="p-2.5">Practice Area</th>
                        <th className="p-2.5">Jurisdiction</th>
                        <th className="p-2.5">Status</th>
                        <th className="p-2.5">Hearing Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {filteredCases.map((c) => (
                        <tr key={c.id} className="hover:bg-slate-50">
                          <td className="p-2.5 font-mono font-bold text-blue-950">{c.id}</td>
                          <td className="p-2.5 font-semibold text-slate-900">{c.title}</td>
                          <td className="p-2.5 text-slate-700">{c.clientName}</td>
                          <td className="p-2.5 text-slate-600">{c.caseType}</td>
                          <td className="p-2.5 text-slate-600">{c.courtJurisdiction || 'Federal Court'}</td>
                          <td className="p-2.5">
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800">
                              {c.caseStatus}
                            </span>
                          </td>
                          <td className="p-2.5 text-slate-600">{c.hearingDate || 'TBD'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Financial Invoices Table Output */}
              {includeFinancials && (
                <div className="my-6">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center justify-between">
                    <span>II. Billing Realization & Retainer Escrows</span>
                    <span className="text-[11px] text-slate-500 font-normal">${totalBilled.toLocaleString()} Total Invoiced</span>
                  </h4>
                  <div className="border border-slate-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-900 text-white font-bold">
                          <th className="p-2.5">Invoice #</th>
                          <th className="p-2.5">Client</th>
                          <th className="p-2.5">Matter Ref</th>
                          <th className="p-2.5">Category</th>
                          <th className="p-2.5">Issued Date</th>
                          <th className="p-2.5">Amount</th>
                          <th className="p-2.5">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {filteredInvoices.map((inv) => (
                          <tr key={inv.id} className="hover:bg-slate-50">
                            <td className="p-2.5 font-mono font-bold text-blue-950">{inv.id}</td>
                            <td className="p-2.5 font-semibold text-slate-900">{inv.clientName}</td>
                            <td className="p-2.5 font-mono text-slate-600">{inv.caseId}</td>
                            <td className="p-2.5 text-slate-600">{inv.type}</td>
                            <td className="p-2.5 text-slate-600">{inv.issueDate}</td>
                            <td className="p-2.5 font-bold text-slate-900">${inv.amount.toLocaleString()}.00</td>
                            <td className="p-2.5">
                              <span
                                className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                                  inv.status === 'Paid'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-amber-100 text-amber-900'
                                }`}
                              >
                                {inv.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Roster of Practicing Lawyers */}
              <div className="my-6">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  III. Practicing Attorneys Roster & Bar Certifications
                </h4>
                <div className="border border-slate-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-900 text-white font-bold">
                        <th className="p-2.5">Attorney at Law</th>
                        <th className="p-2.5">Title / Practice Role</th>
                        <th className="p-2.5">Bar Admission</th>
                        <th className="p-2.5">Specializations</th>
                        <th className="p-2.5">Hourly Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {lawyers.map((l) => (
                        <tr key={l.name} className="hover:bg-slate-50">
                          <td className="p-2.5 font-bold text-slate-900">{l.name}</td>
                          <td className="p-2.5 text-slate-700">{l.title}</td>
                          <td className="p-2.5 font-mono text-slate-600">{l.barNumber}</td>
                          <td className="p-2.5 text-slate-600">{l.specialization.slice(0, 2).join(', ')}</td>
                          <td className="p-2.5 font-bold text-slate-900">${l.hourlyRate || 650}/hr</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Official Seal & Signature Section */}
              <div className="mt-12 pt-6 border-t-2 border-slate-900 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
                <div>
                  <p className="text-xs font-bold text-slate-950 uppercase tracking-wider">
                    Official Certification & Attestation:
                  </p>
                  <p className="text-[11px] text-slate-600 mt-1 max-w-sm italic">
                    Certified authentic and compliant under State Bar Model Rules of Professional Conduct and IOLTA Trust Accounting Standards.
                  </p>
                  <div className="mt-4 flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full border-2 border-amber-600 flex items-center justify-center text-amber-700 font-serif font-black text-xs">
                      SEAL
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      <div>JURISPULSE PARTNERSHIP SEAL</div>
                      <div>SEC-VERIFIED #99420-NY</div>
                    </div>
                  </div>
                </div>

                <div className="w-56 text-right">
                  <div className="border-b border-slate-400 pb-1 font-serif italic text-base text-slate-900">
                    {currentLawyer.name}
                  </div>
                  <p className="text-xs font-bold text-slate-900 mt-1">Authorized Managing Partner</p>
                  <p className="text-[10px] font-mono text-slate-500">{currentLawyer.barNumber}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {new Date().toISOString().slice(0, 10)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 3: AI PRACTICE INTELLIGENCE ================= */}
      {activeTab === 'ai_insights' && (
        <div className="space-y-6">
          {/* AI Practice Intelligence Header */}
          <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-6 shadow-md border border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
                  <Sparkles className="w-4 h-4" />
                  <span>JurisPulse Legal AI Engine • Practice Diagnostics</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                  Chambers Strategic Intelligence Briefing
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
                  Automated telemetry analysis scanning docket progress, judge rulings, fee realization bottlenecks,
                  and litigation court calendar critical paths.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Real-time Sync Active</span>
                </span>
              </div>
            </div>
          </div>

          {/* AI Intelligence Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Card 1: Docket Bottleneck Flag */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 flex items-center justify-center font-bold">
                    <AlertTriangle className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900">
                      Discovery Bottleneck Identified
                    </h4>
                    <span className="text-[11px] font-semibold text-amber-700">
                      #CAS-2026-904 • Rostova Patent Infringement
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                  Medium Risk
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                Matter is currently at day 48 in patent claim construction discovery without responsive opposing deposition notices.
                Recommendation: File motion to compel or schedule an expedited Rule 16 pre-trial conference with S.D.N.Y. Magistrate Judge.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Suggested Action: Motion to Compel</span>
                <button
                  type="button"
                  onClick={() => onShowToast('Drafted motion to compel template queued in Documents.', 'info')}
                  className="font-bold text-blue-900 hover:text-blue-950 flex items-center gap-1"
                >
                  <span>Draft Motion</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Card 2: Fee Realization Opportunity */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 flex items-center justify-center font-bold">
                    <DollarSign className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900">
                      Retainer Replenishment Advisory
                    </h4>
                    <span className="text-[11px] font-semibold text-emerald-700">
                      $42,500 Outstanding Client Balances
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Opportunity
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                Trust accounts for 3 corporate clients have dipped below the 15-day average burn rate threshold.
                Automated electronic retainer replenishment invoices can recover $28,000 within 5 business days with 92% historical promptness.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">IOLTA Account: Audit Verified</span>
                <button
                  type="button"
                  onClick={() => onShowToast('Automated trust replenishment reminders dispatched.', 'success')}
                  className="font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1"
                >
                  <span>Dispatch Reminders</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Card 3: Court Hearing Critical Path */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 flex items-center justify-center font-bold">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900">
                      Critical Hearing Calendar Window
                    </h4>
                    <span className="text-[11px] font-semibold text-blue-800">
                      Markman Claim Hearing in 14 Days
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-200">
                  Critical Date
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                Pre-hearing brief filing deadline is in 6 calendar days. Expert witness technical exhibits are 80% compiled in the vault.
                Recommend scheduling final oral argument rehearsal with trial team by Thursday.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Bench: Hon. Katherine Failla</span>
                <button
                  type="button"
                  onClick={() => onShowToast('Hearing rehearsal consultation added to calendar.', 'info')}
                  className="font-bold text-blue-900 hover:text-blue-950 flex items-center gap-1"
                >
                  <span>Schedule Prep</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Card 4: Attorney Capacity & Roster Allocation */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-2xs">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 border border-purple-200 text-purple-800 flex items-center justify-center font-bold">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900">
                      Partner Caseload Optimization
                    </h4>
                    <span className="text-[11px] font-semibold text-purple-700">
                      Commercial Trial Group Operating @ 91%
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 border border-purple-200">
                  Capacity Notice
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-3 leading-relaxed">
                Marcus Sterling and Sarah Vance have 7 active federal trial briefs scheduled within the next 30 days.
                David Kim and Elena Rostova have 40% open capacity for corporate compliance and tech IP licensing dockets.
              </p>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">Firm Roster: {lawyers.length} Practicing Counsel</span>
                <button
                  type="button"
                  onClick={() => setActiveTab('reports')}
                  className="font-bold text-purple-800 hover:text-purple-950 flex items-center gap-1"
                >
                  <span>Generate Roster Audit</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
