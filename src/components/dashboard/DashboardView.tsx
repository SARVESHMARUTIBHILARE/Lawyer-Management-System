import React, { useState } from 'react';
import {
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertCircle,
  Download,
  FileSpreadsheet,
  FileType,
  Briefcase,
  Users,
  Target,
  ArrowUpRight,
  Sparkles,
  Calendar,
  Scale,
  UserCheck,
  Compass,
  ChevronRight,
  CreditCard,
  MessageSquareLock,
  ShieldCheck,
  FileText,
  CalendarClock,
  Layers
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { ProductivityMetrics, UserRole } from '../types';
import { exportProductivityReportPDF } from '../utils/pdfExport';
import { exportProductivityExcel } from '../utils/excelExport';

interface DashboardViewProps {
  metrics: ProductivityMetrics;
  userRole: UserRole;
  onNavigateToTab: (tab: any) => void;
}

const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];

export const DashboardView: React.FC<DashboardViewProps> = ({
  metrics,
  userRole,
  onNavigateToTab
}) => {
  const [exportingPDF, setExportingPDF] = useState(false);
  const [exportingExcel, setExportingExcel] = useState(false);

  const handleExportPDF = () => {
    setExportingPDF(true);
    setTimeout(() => {
      exportProductivityReportPDF(metrics);
      setExportingPDF(false);
    }, 500);
  };

  const handleExportExcel = () => {
    setExportingExcel(true);
    setTimeout(() => {
      exportProductivityExcel(metrics);
      setExportingExcel(false);
    }, 500);
  };

  const practiceModules = [
    {
      id: 'lawyer_portal',
      title: 'Main Lawyer Dashboard',
      subtitle: 'Counsel Workstation & Cockpit',
      badge: 'Lead Counsel',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      description: 'Active matter dockets, live billable timer, incoming client intake requests, and FRE 902 verification seals.',
      icon: Scale,
      actionText: 'Open Main Lawyer Dashboard',
      iconBg: 'bg-indigo-100 text-indigo-700 border-indigo-200'
    },
    {
      id: 'cases',
      title: 'Cases & Matters',
      subtitle: `${metrics.activeCasesCount} Active Matters`,
      badge: 'Litigation',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      description: 'Multi-stage litigation pipelines, conflict check clearance, discovery tracking, and assigned lead counsel.',
      icon: Briefcase,
      actionText: 'Manage Cases',
      iconBg: 'bg-blue-100 text-blue-700 border-blue-200'
    },
    {
      id: 'deadlines',
      title: 'Deadlines & Calendar',
      subtitle: 'Hearings & Court Filings',
      badge: 'Court Docket',
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      description: 'Statutory filing cutoffs, motion hearings, interactive monthly court calendar, and AI deadline suggestions.',
      icon: CalendarClock,
      actionText: 'Open Calendar',
      iconBg: 'bg-rose-100 text-rose-700 border-rose-200'
    },
    {
      id: 'documents',
      title: 'Document Vault',
      subtitle: 'Evidence & Custody',
      badge: 'SHA-256 Sealed',
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      description: 'Federal Rule of Evidence 902 certification, tamper-evident hash validation, and certified PDF/CSV export.',
      icon: FileText,
      actionText: 'Access Vault',
      iconBg: 'bg-emerald-100 text-emerald-700 border-emerald-200'
    },
    {
      id: 'billing',
      title: 'Billing & Invoices',
      subtitle: `$${(metrics.totalRevenueMonth / 1000).toFixed(1)}k Monthly Billed`,
      badge: 'LEDES Ready',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
      description: 'LEDES-compliant billing codes, PDF invoice generation, overdue payment dispatch, and time tracking entries.',
      icon: CreditCard,
      actionText: 'Open Billing',
      iconBg: 'bg-amber-100 text-amber-800 border-amber-200'
    },
    {
      id: 'messaging',
      title: 'Encrypted Chat',
      subtitle: 'Privileged Counsel Channels',
      badge: '256-bit E2E',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      description: 'Confidential client-attorney threads, encrypted evidentiary attachments, and formal consultation requests.',
      icon: MessageSquareLock,
      actionText: 'Open Chat',
      iconBg: 'bg-purple-100 text-purple-700 border-purple-200'
    },
    {
      id: 'security',
      title: 'Security & RBAC',
      subtitle: 'Zero-Trust Audit Log',
      badge: 'Real-time Audit',
      badgeColor: 'bg-slate-100 text-slate-800 border-slate-300',
      description: 'Real-time tamper-evident access logs, role permissions, multi-device sync, and two-factor authentication.',
      icon: ShieldCheck,
      actionText: 'Inspect Security',
      iconBg: 'bg-slate-100 text-slate-700 border-slate-300'
    },
    {
      id: 'client_portal',
      title: 'Client Portal View',
      subtitle: 'External Client Perspective',
      badge: 'Client Scope',
      badgeColor: 'bg-teal-50 text-teal-700 border-teal-200',
      description: 'Direct representation request workflow, milestone timeline, statement reconciliation, and document signing.',
      icon: UserCheck,
      actionText: 'Preview Client View',
      iconBg: 'bg-teal-100 text-teal-700 border-teal-200'
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner & Fast Navigation Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-4 rounded-xl shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-slate-900">Firm Productivity & Practice Analytics</h1>
            <span className="text-[10px] font-bold tracking-wide uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
              Live Q3 2026 Docket
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real-time management dashboard. Click on any metric card or practice module below to jump directly into that workspace.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center flex-wrap gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onNavigateToTab('lawyer_portal')}
            className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-lg flex items-center gap-2 border border-indigo-200 shadow-2xs transition cursor-pointer"
          >
            <Scale className="w-4 h-4 text-indigo-600" />
            <span>Open Main Lawyer Dashboard</span>
          </button>

          <button
            type="button"
            onClick={handleExportPDF}
            disabled={exportingPDF}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-lg flex items-center gap-2 shadow-2xs transition disabled:opacity-50 cursor-pointer"
          >
            <FileType className="w-4 h-4" />
            {exportingPDF ? 'Exporting PDF...' : 'Export PDF Report'}
          </button>

          <button
            type="button"
            onClick={handleExportExcel}
            disabled={exportingExcel}
            className="px-3.5 py-1.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-lg flex items-center gap-2 border border-slate-200 shadow-2xs transition disabled:opacity-50 cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            {exportingExcel ? 'Exporting XLSX...' : 'Export Excel'}
          </button>
        </div>
      </div>

      {/* Interactive Clickable KPI Cards Grid (CLICK IN MAIN DASHBOARD) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Monthly Revenue -> Navigates to Billing */}
        <button
          type="button"
          onClick={() => onNavigateToTab('billing')}
          className="text-left p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all group cursor-pointer flex flex-col justify-between"
          title="Click to view Invoices & Billing Statements"
        >
          <div>
            <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
              <span className="font-semibold uppercase tracking-wider text-[10px] group-hover:text-blue-600 transition">
                Monthly Revenue
              </span>
              <div className="p-1.5 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-100 group-hover:bg-emerald-100 transition">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900 font-mono group-hover:text-blue-600 transition">
              ${metrics.totalRevenueMonth.toLocaleString()}
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-500">Target: ${metrics.revenueTarget.toLocaleString()}</span>
              <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded text-[11px] font-bold flex items-center gap-0.5">
                <ArrowUpRight className="w-3 h-3" /> 91.0%
              </span>
            </div>
            <p className="text-[11px] text-blue-600 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              <span>View invoices & statements</span>
              <ChevronRight className="w-3 h-3" />
            </p>
          </div>
        </button>

        {/* Card 2: Billable Hours -> Navigates to Billing */}
        <button
          type="button"
          onClick={() => onNavigateToTab('billing')}
          className="text-left p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all group cursor-pointer flex flex-col justify-between"
          title="Click to view Billable Time Entries & Logs"
        >
          <div>
            <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
              <span className="font-semibold uppercase tracking-wider text-[10px] group-hover:text-blue-600 transition">
                Billable Hours (Month)
              </span>
              <div className="p-1.5 rounded-md bg-blue-50 text-blue-600 border border-blue-100 group-hover:bg-blue-100 transition">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900 font-mono group-hover:text-blue-600 transition">
              {metrics.totalBillableHoursMonth} <span className="text-xs text-slate-400 font-sans">hrs</span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-500">Target: {metrics.billableHoursTarget} hrs</span>
              <span className="text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded text-[11px] font-bold">92.7% Goal</span>
            </div>
            <p className="text-[11px] text-blue-600 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              <span>Manage time entries</span>
              <ChevronRight className="w-3 h-3" />
            </p>
          </div>
        </button>

        {/* Card 3: Realization Rate -> Navigates to Lawyer Portal */}
        <button
          type="button"
          onClick={() => onNavigateToTab('lawyer_portal')}
          className="text-left p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all group cursor-pointer flex flex-col justify-between"
          title="Click to view Counsel Realization & Lawyer Portal"
        >
          <div>
            <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
              <span className="font-semibold uppercase tracking-wider text-[10px] group-hover:text-blue-600 transition">
                Realization Rate
              </span>
              <div className="p-1.5 rounded-md bg-purple-50 text-purple-600 border border-purple-100 group-hover:bg-purple-100 transition">
                <Target className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900 font-mono group-hover:text-blue-600 transition">
              {metrics.realizationRatePercent}%
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-500">Firm Benchmark</span>
              <span className="text-purple-700 bg-purple-50 border border-purple-200 px-1.5 py-0.5 rounded text-[11px] font-bold">+2.4% vs Q1</span>
            </div>
            <p className="text-[11px] text-blue-600 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              <span>Inspect counsel performance</span>
              <ChevronRight className="w-3 h-3" />
            </p>
          </div>
        </button>

        {/* Card 4: Deadline Compliance -> Navigates to Deadlines */}
        <button
          type="button"
          onClick={() => onNavigateToTab('deadlines')}
          className="text-left p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md transition-all group cursor-pointer flex flex-col justify-between"
          title="Click to view Court Deadlines & Interactive Calendar"
        >
          <div>
            <div className="flex items-center justify-between text-slate-500 text-xs mb-2">
              <span className="font-semibold uppercase tracking-wider text-[10px] group-hover:text-blue-600 transition">
                Deadline Compliance
              </span>
              <div className="p-1.5 rounded-md bg-amber-50 text-amber-600 border border-amber-100 group-hover:bg-amber-100 transition">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="text-3xl font-bold text-slate-900 font-mono group-hover:text-blue-600 transition">
              {metrics.deadlineCompliancePercent}%
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-slate-500">Active Matters: {metrics.activeCasesCount}</span>
              <span className="text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded text-[11px] font-bold">On Track</span>
            </div>
            <p className="text-[11px] text-blue-600 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
              <span>Open court calendar</span>
              <ChevronRight className="w-3 h-3" />
            </p>
          </div>
        </button>
      </div>

      {/* Direct Practice Navigation Hub (CLICK IN MAIN DASHBOARD) */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Compass className="w-4 h-4 text-blue-600" />
              <span>Practice Modules & Section Fast-Launch Hub</span>
            </h2>
            <p className="text-xs text-slate-500">
              Click any section module below to jump directly into that workspace. Every section is fully synchronized with live dockets.
            </p>
          </div>
          <span className="text-[11px] font-mono font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 shrink-0">
            8 Practice Modules
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {practiceModules.map((mod) => {
            const ModIcon = mod.icon;
            return (
              <div
                key={mod.id}
                onClick={() => onNavigateToTab(mod.id)}
                className="bg-slate-50 hover:bg-white border border-slate-200 hover:border-blue-400 hover:shadow-md rounded-xl p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <div className={`p-2 rounded-lg border ${mod.iconBg}`}>
                      <ModIcon className="w-4 h-4" />
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${mod.badgeColor}`}>
                      {mod.badge}
                    </span>
                  </div>

                  <h3 className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition">
                    {mod.title}
                  </h3>
                  <p className="text-[11px] font-medium text-slate-500 mb-1.5">
                    {mod.subtitle}
                  </p>
                  <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed mb-3">
                    {mod.description}
                  </p>
                </div>

                <div className="pt-2.5 border-t border-slate-200/60 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:text-blue-700">
                  <span>{mod.actionText}</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend Area Chart */}
        <div className="lg:col-span-2 p-5 bg-white border border-slate-200 rounded-xl shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 text-sm">Revenue & Billable Hours Trajectory</h3>
              <p className="text-xs text-slate-500">Monthly breakdown over the last 6 months</p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateToTab('billing')}
              className="text-xs font-mono text-blue-600 hover:text-blue-800 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200 font-bold transition cursor-pointer"
            >
              View Full Ledger →
            </button>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics.monthlyRevenueHistory}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '8px', color: '#0f172a', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Practice Area Revenue Pie with Interactive Filter Navigation */}
        <div className="p-5 bg-white border border-slate-200 rounded-xl shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-0.5">
              <h3 className="font-bold text-slate-900 text-sm">Practice Area Share</h3>
              <button
                type="button"
                onClick={() => onNavigateToTab('cases')}
                className="text-[11px] font-bold text-blue-600 hover:text-blue-700 cursor-pointer"
              >
                View Cases →
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-3">Distribution across legal departments</p>
          </div>

          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={metrics.practiceAreaBreakdown}
                  dataKey="revenue"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={48}
                  outerRadius={70}
                  paddingAngle={4}
                >
                  {metrics.practiceAreaBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '8px', color: '#0f172a', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                  formatter={(val: any) => [`$${Number(val).toLocaleString()}`, 'Revenue']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-2 space-y-1.5 text-xs border-t border-slate-100 pt-3">
            {metrics.practiceAreaBreakdown.slice(0, 4).map((item, idx) => (
              <button
                key={item.name}
                type="button"
                onClick={() => onNavigateToTab('cases')}
                className="w-full flex items-center justify-between text-slate-700 hover:bg-slate-50 p-1 rounded transition cursor-pointer text-left group"
              >
                <div className="flex items-center gap-2 truncate">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                  <span className="truncate group-hover:text-blue-600 transition font-medium">{item.name}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-slate-600 font-semibold">${(item.revenue / 1000).toFixed(0)}k</span>
                  <ChevronRight className="w-3 h-3 text-slate-400 group-hover:text-blue-600" />
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Staff Productivity Table with Interactive Click Actions */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-slate-900 text-sm">Attorney & Staff Productivity Ledger</h3>
            <p className="text-xs text-slate-500">Click any counsel row to open their Counsel Workstation in Lawyer Portal</p>
          </div>
          <button
            type="button"
            onClick={() => onNavigateToTab('billing')}
            className="text-xs text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-1 cursor-pointer"
          >
            <span>Manage Time Entries & Invoices</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-2.5">Attorney / Staff</th>
                <th className="px-4 py-2.5">Title / Role</th>
                <th className="px-4 py-2.5">Target Hours</th>
                <th className="px-4 py-2.5">Actual Billed</th>
                <th className="px-4 py-2.5">Utilization Rate</th>
                <th className="px-4 py-2.5">Total Billed Revenue</th>
                <th className="px-4 py-2.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {metrics.staffProductivity.map((staff) => (
                <tr
                  key={staff.lawyerName}
                  onClick={() => onNavigateToTab('lawyer_portal')}
                  className="hover:bg-blue-50/50 transition cursor-pointer group"
                >
                  <td className="px-4 py-2.5 font-semibold text-slate-900 group-hover:text-blue-600 transition flex items-center gap-2">
                    <Scale className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
                    <span>{staff.lawyerName}</span>
                  </td>
                  <td className="px-4 py-2.5 text-slate-500">{staff.role}</td>
                  <td className="px-4 py-2.5 font-mono">{staff.targetHours} hrs</td>
                  <td className="px-4 py-2.5 font-mono font-semibold text-blue-600">{staff.actualHours} hrs</td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200">
                        <div
                          className={`h-full rounded-full ${
                            staff.utilizationRate >= 100 ? 'bg-emerald-500' : 'bg-blue-600'
                          }`}
                          style={{ width: `${Math.min(staff.utilizationRate, 100)}%` }}
                        />
                      </div>
                      <span className="font-mono text-[11px] font-bold">{staff.utilizationRate}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 font-mono font-bold text-slate-900">
                    ${staff.billedAmount.toLocaleString()}
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <span className="text-[11px] font-semibold text-blue-600 group-hover:underline inline-flex items-center gap-0.5">
                      View Counsel <ChevronRight className="w-3 h-3" />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
