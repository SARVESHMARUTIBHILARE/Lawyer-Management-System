import React, { useState } from 'react';
import {
  GraduationCap,
  FileText,
  Printer,
  Copy,
  Check,
  Download,
  Search,
  ExternalLink,
  ShieldCheck,
  Sparkles,
  Layers,
  Cpu,
  Server,
  Activity,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Code2,
  BookOpen,
  ArrowRight,
  Filter,
  Users
} from 'lucide-react';

interface PblReportSectionProps {
  onShowToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
  totalLawyersCount?: number;
  totalClientsCount?: number;
  totalCasesCount?: number;
  totalAppointmentsCount?: number;
}

export const PblReportSection: React.FC<PblReportSectionProps> = ({
  onShowToast,
  totalLawyersCount = 50,
  totalClientsCount = 50,
  totalCasesCount = 38,
  totalAppointmentsCount = 42
}) => {
  const [activeTab, setActiveTab] = useState<
    'report' | 'problems' | 'technologies' | 'activities' | 'flow' | 'team'
  >('report');
  const [copied, setCopied] = useState(false);
  const [problemSearch, setProblemSearch] = useState('');

  const handlePrint = () => {
    window.print();
  };

  const handleCopyReport = () => {
    const reportText = `PBL REPORT–02
MINI PROJECT
JurisPulse – AI-Powered Legal Practice Management System
Project Type: Mini Project / Complex Problem-Solving

Team Members:
1. Bhilare Sarvesh (Enrollment: 240860131012) - Developer / Project Developer
2. Ritesh Bitode (Enrollment: 240860131013) - Team Member
3. Taufeek Khan (Enrollment: 240860131058) - Team Member
4. PASWAN ABHISHEK (Enrollment: 250860131004) - Team Member

Project Description:
JurisPulse – AI-Powered Legal Practice Management System is a web-based legal practice management platform designed to digitally manage legal-service operations. Centralized platform for managing lawyers (50), clients (50), cases, appointments, hearings, documents, payments, and legal-practice activities with RBAC (Admin, Lawyer, Client) and real-time AI Assistant.`;

    navigator.clipboard.writeText(reportText);
    setCopied(true);
    onShowToast('PBL Report summary copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 3000);
  };

  // 13 PROBLEMS & SOLUTIONS FROM REPORT
  const problemsAndSolutions = [
    {
      problem: 'AI Assistant page was temporarily unavailable',
      solution: 'Restored the required AI Assistant module and validated mount hooks.'
    },
    {
      problem: 'API could not resolve the AI module',
      solution: 'Corrected module/import configuration and server path mappings.'
    },
    {
      problem: 'Incorrect request disconnect detection',
      solution: 'Corrected response-close handling and AbortController integration.'
    },
    {
      problem: 'Streaming timeout could produce false completion',
      solution: 'Added explicit timeout handling with heartbeat events.'
    },
    {
      problem: '[DONE] was not terminating upstream stream',
      solution: 'Implemented proper stream termination on server and client parser.'
    },
    {
      problem: 'Raw AI provider errors could be exposed',
      solution: 'Added safe server-side error mapping and sanitized error payloads.'
    },
    {
      problem: 'SSE events could be split across chunks',
      solution: 'Implemented buffering/parser logic for streaming chunk boundaries.'
    },
    {
      problem: 'UI layout inconsistencies',
      solution: 'Aligned pages with the shared design system and Tailwind tokens.'
    },
    {
      problem: 'Lawyer pages showed missing data states',
      solution: 'Traced frontend → API → backend → database flow and added fallbacks.'
    },
    {
      problem: 'Client data was not displayed correctly',
      solution: 'Verified API and database data flow and sanitized client schemas.'
    },
    {
      problem: 'Responsive sidebar issue',
      solution: 'Corrected breakpoint behavior, touch backdrop, and mobile drawer transitions.'
    },
    {
      problem: 'Unauthorized case access',
      solution: 'Improved RBAC and authorization checks at route and query level.'
    },
    {
      problem: 'Local storage quota exceeded on photo uploads',
      solution: 'Implemented client-side canvas image downscaling (max 256x256, 0.78 quality) and safe quota error recovery.'
    }
  ];

  // 19 TECHNOLOGIES TABLE
  const technologies = [
    { sr: 1, name: 'HTML5', category: 'Frontend UI/UX', purpose: 'Semantic web structure and accessibility' },
    { sr: 2, name: 'CSS3 / Tailwind', category: 'Frontend UI/UX', purpose: 'High-contrast legal design tokens & responsive layouts' },
    { sr: 3, name: 'TypeScript / React 18', category: 'Frontend UI/UX', purpose: 'Type-safe reactive state management & component hierarchy' },
    { sr: 4, name: 'Node.js', category: 'Backend / Framework', purpose: 'Asynchronous event-driven runtime environment' },
    { sr: 5, name: 'Express.js', category: 'Backend / Framework', purpose: 'REST API routing, middleware and controller orchestration' },
    { sr: 6, name: 'MySQL 8.0', category: 'Database', purpose: 'Relational data persistence for cases, users, and dockets' },
    { sr: 7, name: 'MySQL Workbench', category: 'Database Management', purpose: 'Entity-relationship diagrams and SQL operations' },
    { sr: 8, name: 'Vite / XAMPP', category: 'Development Environment', purpose: 'Ultra-fast HMR and local backend development' },
    { sr: 9, name: 'MVC', category: 'Architecture', purpose: 'Clean separation of Model, View, and Controller layers' },
    { sr: 10, name: 'Repository Pattern', category: 'Architecture', purpose: 'Decoupled data access logic from business rules' },
    { sr: 11, name: 'JWT', category: 'Authentication', purpose: 'Stateless secure user token verification' },
    { sr: 12, name: 'RBAC', category: 'Authorization', purpose: 'Role-based access controls for Admin, Lawyer, and Client' },
    { sr: 13, name: 'REST API', category: 'API', purpose: 'Standardized client-server data exchange protocols' },
    { sr: 14, name: 'Figma', category: 'UI Design', purpose: 'Wireframes, color palettes, and responsive mockups' },
    { sr: 15, name: 'Visual Studio Code', category: 'Development Tool', purpose: 'IDE with ESLint and TypeScript compilation' },
    { sr: 16, name: 'Git', category: 'Version Control', purpose: 'Distributed version control and branch branching' },
    { sr: 17, name: 'GitHub', category: 'Repository / Hosting', purpose: 'Remote repository hosting and CI/CD validation' },
    { sr: 18, name: 'AI API (Gemini / LLM)', category: 'Artificial Intelligence', purpose: 'Legal assistant reasoning, docket summary, and draft support' },
    { sr: 19, name: 'SSE (Server-Sent Events)', category: 'Real-Time Communication', purpose: 'Low-latency incremental token streaming from AI server' }
  ];

  // DATE-WISE ACTIVITIES
  const dateWiseActivities = [
    { date: '26 Aug 2026', activity: 'Sprint implementation and development of the remaining Legal Practice Management requirements continued.', status: 'Completed' },
    { date: '27 Aug 2026', activity: 'Backend/frontend workflows, authentication and RBAC verification continued.', status: 'Completed' },
    { date: '29 Aug 2026', activity: 'Lawyer, Client and Case Management functionality was reviewed and verified with 50-account test suites.', status: 'Completed' },
    { date: '30 Aug 2026', activity: 'Appointment and case workflow requirements were reviewed with court docket timelines.', status: 'Completed' },
    { date: '31 Aug 2026', activity: 'Final hardening activities including bug fixing, responsive testing and security review were identified.', status: 'Completed' },
    { date: '01 Sep 2026', activity: 'Remaining case and appointment functionality was implemented and verified.', status: 'Completed' },
    { date: '03 Sep 2026', activity: 'Lawyer Dashboard, Client Management and Case Management functionality were verified across viewports.', status: 'Completed' },
    { date: '05 Sep 2026', activity: 'Detailed verification and review of the project implementation status continued.', status: 'Completed' },
    { date: '07 Sep 2026', activity: 'Authentication, RBAC and functional requirements were cross-checked for privilege escalation prevention.', status: 'Completed' },
    { date: '09 Sep 2026', activity: 'Project documentation and authorization requirements were reviewed.', status: 'Completed' },
    { date: '10 Sep 2026', activity: 'Remaining project blockers and verification requirements were consolidated.', status: 'Completed' },
    { date: '11 Sep 2026', activity: 'Final blocker reconciliation, quota error resolution, and client-side photo compression testing completed.', status: 'Completed' },
    { date: '13 Sep 2026', activity: 'Project hardening, functional verification and UI/API checking continued.', status: 'Completed' },
    { date: '15 Sep 2026', activity: 'Lawyer and Client browser QA was completed across mobile, tablet, and desktop viewports.', status: 'Completed' },
    { date: '17 Sep 2026', activity: 'Admin, Lawyer and Client workflows were verified with end-to-end simulation.', status: 'Completed' },
    { date: '19 Sep 2026', activity: 'JurisPulse AI Assistant backend was implemented with authentication, validation and rate limiting.', status: 'Completed' },
    { date: '20 Sep 2026', activity: 'AI Assistant real-time streaming/SSE integration was worked on (POST /api/v1/admin/ai/chat/stream).', status: 'Completed' },
    { date: '21 Sep 2026', activity: 'AI integration, streaming response handling, and PBL Report 02 compilation completed.', status: 'Completed' }
  ];

  const filteredProblems = problemsAndSolutions.filter(
    (p) =>
      p.problem.toLowerCase().includes(problemSearch.toLowerCase()) ||
      p.solution.toLowerCase().includes(problemSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Top Academic Report Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden print:border-none print:shadow-none print:p-0 print:text-black print:bg-none">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
                <GraduationCap className="w-3.5 h-3.5" />
                PBL REPORT–02 • MINI PROJECT
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold border border-blue-400/30">
                Month 2 Progress Review
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-400/30">
                Complex Problem-Solving
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white print:text-slate-900">
              JurisPulse – AI-Powered Legal Practice Management System
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium print:text-slate-700">
              Web-based legal practice management platform designed to digitally manage legal-service operations. Centralized platform for managing lawyers, clients, cases, appointments, hearings, documents, payments, and legal-practice activities with Role-Based Access Control (Admin, Lawyer, Client).
            </p>

            {/* Team Members List Highlight */}
            <div className="pt-2">
              <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5" />
                Project Development Team
              </div>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-amber-400/20 text-amber-200 border border-amber-400/30 font-bold">
                  ★ Bhilare Sarvesh (240860131012) – Developer / Project Developer
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white/10 text-slate-200 border border-white/15 font-medium">
                  Ritesh Bitode (240860131013) – Team Member
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white/10 text-slate-200 border border-white/15 font-medium">
                  Taufeek Khan (240860131058) – Team Member
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white/10 text-slate-200 border border-white/15 font-medium">
                  PASWAN ABHISHEK (250860131004) – Team Member
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap md:flex-col gap-2 shrink-0 print:hidden">
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs transition border border-white/20 backdrop-blur-xs cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4 text-amber-300" />
              <span>Print Official Report</span>
            </button>

            <button
              type="button"
              onClick={handleCopyReport}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 font-bold text-xs transition cursor-pointer shadow-md"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-950" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard' : 'Copy Report Text'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live System Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 print:grid-cols-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Total Lawyers</span>
            <span className="p-1.5 rounded-lg bg-blue-100 text-blue-900 font-mono text-[10px] font-bold">50 PROFILES</span>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-1">{totalLawyersCount}</p>
          <p className="text-[11px] text-slate-600 mt-0.5">Full bar numbers, ratings & fees</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Total Clients</span>
            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800 font-mono text-[10px] font-bold">50 CLIENTS</span>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-1">{totalClientsCount}</p>
          <p className="text-[11px] text-slate-600 mt-0.5">Connected to messaging & dockets</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">Legal Cases</span>
            <span className="p-1.5 rounded-lg bg-purple-100 text-purple-900 font-mono text-[10px] font-bold">ACTIVE</span>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-1">{totalCasesCount}</p>
          <p className="text-[11px] text-slate-600 mt-0.5">Pre-trial, discovery & arbitration</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">AI Streaming API</span>
            <span className="p-1.5 rounded-lg bg-amber-100 text-amber-900 font-mono text-[10px] font-bold">SSE v1</span>
          </div>
          <p className="text-lg font-black text-emerald-600 mt-1">POST /api/v1/stream</p>
          <p className="text-[11px] text-slate-600 mt-0.5">Real-time incremental delivery</p>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="bg-white p-1.5 rounded-2xl border border-slate-200 shadow-2xs flex flex-wrap gap-1 print:hidden">
        {[
          { key: 'report', label: 'Complete PBL-02 Report', icon: BookOpen },
          { key: 'problems', label: 'Problems & Solutions (13)', icon: AlertTriangle },
          { key: 'technologies', label: 'Technologies (19)', icon: Cpu },
          { key: 'activities', label: 'Date-wise Activities', icon: Calendar },
          { key: 'flow', label: 'Architecture & UI Flow', icon: Layers },
          { key: 'team', label: 'Development Team (5)', icon: Users }
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                isActive
                  ? 'bg-blue-900 text-white shadow-sm'
                  : 'text-slate-600 hover:text-blue-900 hover:bg-slate-100'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: COMPLETE PBL-02 REPORT */}
      {activeTab === 'report' && (
        <div className="space-y-6">
          {/* Section 1 & 2 */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">Report Section 01</span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                1. Legal Practice Management Completion
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Comprehensive integration and verification of core legal operational modules.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="space-y-2.5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Integrated Management Modules
                </h3>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-900" />
                    <strong>Lawyer Management:</strong> 50 detailed accounts with bar registrations, fees, and specializations.
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-900" />
                    <strong>Client Management:</strong> 50 corporate and private client profiles with matter histories.
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-900" />
                    <strong>Case Management:</strong> Multi-jurisdiction dockets, court jurisdictions, and hearing dates.
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-900" />
                    <strong>Appointment Management:</strong> Pre-trial conferences, video consultations, and booking slots.
                  </li>
                </ul>
              </div>

              <div className="space-y-2.5 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                <h3 className="font-bold text-slate-800 text-sm flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-900" />
                  Verification & Architecture
                </h3>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    <strong>Profile Integrity:</strong> Isolated person registries preventing data cross-leakage.
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    <strong>Hearing & Status:</strong> Integrated hearing countdowns and case-status pipelines.
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    <strong>Navigation Flow:</strong> Verified zero-deadlock routing across major practice views.
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                    <strong>Modular Architecture:</strong> Component-driven React + Vite structure with repository models.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 2: Admin Dashboard & UI/UX Improvements */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">Report Section 02</span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                2. Admin Dashboard & UI/UX Improvements
              </h2>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              During Month 2, significant work was performed on the JurisPulse Admin interface to ensure full compliance with the shared design system.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100 text-blue-950 font-medium">
                ✓ Shared page headers and action areas aligned
              </div>
              <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100 text-blue-950 font-medium">
                ✓ Sidebar responsive drawer and touch backdrop corrected
              </div>
              <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100 text-blue-950 font-medium">
                ✓ Desktop, tablet, and mobile viewports fully verified
              </div>
              <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100 text-blue-950 font-medium">
                ✓ Duplicate UI elements eliminated across modals
              </div>
              <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100 text-blue-950 font-medium">
                ✓ Detail/View navigation verified across major entities
              </div>
              <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100 text-blue-950 font-medium">
                ✓ Tables upgraded with pagination, sorting & search
              </div>
            </div>
          </div>

          {/* Section 3 & 4: Lawyer & Client Module Verification */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Section 3: Lawyer Module */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
              <div>
                <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">Report Section 03</span>
                <h3 className="text-lg font-black text-slate-900 mt-1">
                  3. Lawyer Module Development & Verification
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                The Lawyer architecture follows authenticated and role-restricted access rather than treating lawyers as system administrators.
              </p>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Lawyer Dashboard: Total cases, active retainers, upcoming hearings.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Case-level data access: Assigned matters only, with confidentiality flags.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Encrypted Client Messaging: Unread badges and direct response tools.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Hearing Schedule & Document Vault synchronization.</span>
                </li>
              </ul>
            </div>

            {/* Section 4: Client Module */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
              <div>
                <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">Report Section 04</span>
                <h3 className="text-lg font-black text-slate-900 mt-1">
                  4. Client Module Development & Verification
                </h3>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                The Client module provides authenticated access to the client's own legal information and prevents unauthorized access to other users' data.
              </p>
              <ul className="space-y-2 text-xs text-slate-700">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Client Dashboard & Case Progress status tracker.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Lawyer Search & Profile Directory across 15 specializations.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Appointment Booking with immediate confirmation and video links.</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Client-to-Counsel direct messaging with conversation history.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Section 5, 6 & 7: AI Assistant Architecture & Real-Time Streaming */}
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-blue-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl space-y-6">
            <div className="border-b border-white/15 pb-4">
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                Report Sections 05, 06 & 07 • Technical Architecture
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1">
                Admin AI Assistant & Real-Time SSE Streaming Pipeline
              </h2>
              <p className="text-xs text-slate-300 mt-1">
                End-to-end implementation of server-owned system prompts, streaming controller endpoints, and incremental SSE parsing.
              </p>
            </div>

            {/* Architecture Box */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                  <Server className="w-4 h-4" />
                  Backend Components (Step 1 & Step 2A)
                </h3>
                <div className="bg-slate-950/70 rounded-2xl p-4 border border-white/10 font-mono text-xs space-y-1.5 text-slate-300">
                  <p className="text-emerald-400 font-bold">Endpoints:</p>
                  <p>• POST /api/v1/admin/ai/chat</p>
                  <p>• POST /api/v1/admin/ai/chat/stream</p>
                  <p className="pt-2 text-amber-300 font-bold">Security Features:</p>
                  <p>• JWT Authentication & RBAC</p>
                  <p>• Message Validation & Prompt Injection Guard</p>
                  <p>• Rate Limiting & Safe Error Mapping</p>
                  <p>• Secret/API-Key Server Isolation</p>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-bold text-blue-300 flex items-center gap-2">
                  <Activity className="w-4 h-4" />
                  Frontend Real-Time Streaming (Step 2B)
                </h3>
                <div className="bg-slate-950/70 rounded-2xl p-4 border border-white/10 font-mono text-xs text-slate-300 leading-relaxed">
                  <p className="text-amber-400 font-bold mb-1">Architecture Flow:</p>
                  <div className="pl-2 border-l-2 border-blue-500/40 space-y-1">
                    <p>AI Assistant UI</p>
                    <p>↓ aiAssistantApi.js</p>
                    <p>↓ httpClient.js</p>
                    <p>↓ ReadableStream</p>
                    <p>↓ SSE Parser</p>
                    <p className="text-emerald-400 font-bold">↓ Incremental AI Response Render</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 8: Testing & Quality Assurance */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
            <div className="border-b border-slate-200 pb-4">
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">Report Section 08</span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                8. Testing & Quality Assurance
              </h2>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              During Month 2, comprehensive testing was strengthened across all major JurisPulse modules. The project uses automated type-checking and manual test verification routines.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              {[
                'Backend unit testing',
                'Backend integration testing',
                'Frontend unit testing',
                'API contract testing',
                'RBAC permission testing',
                'Authentication testing',
                'Client access testing',
                'Lawyer access testing',
                'Case-management testing',
                'Appointment booking testing',
                'Input validation testing',
                'AI streaming SSE testing',
                'Provider failure recovery',
                'UI browser cross-checking',
                'Responsive screen testing',
                'Security & quota audits'
              ].map((testItem, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>{testItem}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PROBLEMS ENCOUNTERED & SOLUTIONS (TABLE) */}
      {activeTab === 'problems' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">Report Section 09</span>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
                9. Problems Encountered & Solutions
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Official problem and solution matrix recorded during Month 2 development and testing.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={problemSearch}
                onChange={(e) => setProblemSearch(e.target.value)}
                placeholder="Search problems or solutions..."
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-900"
              />
            </div>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="p-3.5 font-bold uppercase tracking-wider w-12 text-center">#</th>
                  <th className="p-3.5 font-bold uppercase tracking-wider w-5/12">Problem Encountered</th>
                  <th className="p-3.5 font-bold uppercase tracking-wider w-6/12">Implemented Solution</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredProblems.map((item, index) => (
                  <tr key={index} className="hover:bg-blue-50/40 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-slate-600 text-center">{index + 1}</td>
                    <td className="p-3.5 font-semibold text-rose-900">
                      <div className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 shrink-0" />
                        <span>{item.problem}</span>
                      </div>
                    </td>
                    <td className="p-3.5 text-slate-700">
                      <div className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                        <span>{item.solution}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: TECHNOLOGIES USED (19 ITEMS) */}
      {activeTab === 'technologies' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">Report Section 10</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              10. Technologies Used During Month 2
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Full categorized inventory of technologies, frameworks, and architecture tools utilized.
            </p>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-blue-950 text-white">
                  <th className="p-3.5 font-bold uppercase tracking-wider w-16 text-center">Sr. No.</th>
                  <th className="p-3.5 font-bold uppercase tracking-wider w-3/12">Technology / Tool</th>
                  <th className="p-3.5 font-bold uppercase tracking-wider w-3/12">Category</th>
                  <th className="p-3.5 font-bold uppercase tracking-wider w-5/12">Purpose in JurisPulse</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {technologies.map((tech) => (
                  <tr key={tech.sr} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-slate-600 text-center">{tech.sr}</td>
                    <td className="p-3.5 font-bold text-slate-900">{tech.name}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {tech.category}
                      </span>
                    </td>
                    <td className="p-3.5 text-slate-600">{tech.purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: DATE-WISE ACTIVITIES */}
      {activeTab === 'activities' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">Report Section 11</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              Month 2 — Date-wise Activities Log
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Detailed chronological record of sprint milestones executed between August 26 and September 21, 2026.
            </p>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded-2xl">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="p-3.5 font-bold uppercase tracking-wider w-36">Date</th>
                  <th className="p-3.5 font-bold uppercase tracking-wider">Work / Activity</th>
                  <th className="p-3.5 font-bold uppercase tracking-wider w-28 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {dateWiseActivities.map((act, i) => (
                  <tr key={i} className="hover:bg-blue-50/30 transition-colors">
                    <td className="p-3.5 font-mono font-bold text-blue-900 whitespace-nowrap">{act.date}</td>
                    <td className="p-3.5 text-slate-700 leading-relaxed">{act.activity}</td>
                    <td className="p-3.5 text-center">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        {act.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: ARCHITECTURE & UI FLOW (FIGURE 6) */}
      {activeTab === 'flow' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">Figure 6 & UI Flow</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              JurisPulse System UI Flow & Navigation Model
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Interactive structural map showing routing between authentication, dashboards, entity details, and AI services.
            </p>
          </div>

          {/* Graphical Flow Representation */}
          <div className="p-6 rounded-2xl bg-slate-900 text-white font-mono text-xs overflow-x-auto space-y-6">
            <div className="text-center">
              <span className="inline-block px-4 py-2 rounded-xl bg-blue-600 text-white font-bold shadow-sm">
                LOGIN (Admin / Lawyer / Client Auth)
              </span>
            </div>

            <div className="flex justify-center">
              <span className="text-blue-400 font-bold">│<br />▼</span>
            </div>

            <div className="text-center">
              <span className="inline-block px-5 py-2.5 rounded-xl bg-slate-800 border border-blue-400/40 text-amber-300 font-bold text-sm shadow-md">
                ADMIN / LAWYER / CLIENT DASHBOARD
              </span>
            </div>

            <div className="flex justify-center">
              <span className="text-blue-400 font-bold">┌──────────────────────────────┼──────────────────────────────┐</span>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <span className="text-blue-400 font-bold">▼</span>
                <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-200">
                  <p className="font-bold text-blue-400">LAWYERS (50)</p>
                  <p className="text-[10px] text-slate-400 mt-1">Bar No, Specialization, Fees</p>
                </div>
                <span className="text-blue-400 font-bold block my-1">▼</span>
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-[11px]">
                  Lawyer Details & Profile
                </div>
              </div>

              <div>
                <span className="text-blue-400 font-bold">▼</span>
                <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-200">
                  <p className="font-bold text-emerald-400">CLIENTS (50)</p>
                  <p className="text-[10px] text-slate-400 mt-1">Retainers, CRM, Matters</p>
                </div>
                <span className="text-blue-400 font-bold block my-1">▼</span>
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-[11px]">
                  Client Details & CRM
                </div>
              </div>

              <div>
                <span className="text-blue-400 font-bold">▼</span>
                <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-200">
                  <p className="font-bold text-purple-400">CASES (38+)</p>
                  <p className="text-[10px] text-slate-400 mt-1">Dockets, Court Filings, AAA</p>
                </div>
                <span className="text-blue-400 font-bold block my-1">▼</span>
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 text-[11px]">
                  Case Details & Briefs
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <span className="text-blue-400 font-bold">└──────────────────────────────┼──────────────────────────────┘</span>
            </div>

            <div className="flex justify-center">
              <span className="text-blue-400 font-bold">▼</span>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-200">
                <p className="font-bold text-amber-300">APPOINTMENTS</p>
                <p className="text-[10px] text-slate-400">Hearings & Consultations</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-800 border border-slate-700 text-slate-200">
                <p className="font-bold text-amber-300">HEARINGS & EVIDENCE</p>
                <p className="text-[10px] text-slate-400">Documents Vault & Chain</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-800 border border-emerald-500/50 text-emerald-300">
                <p className="font-bold">JURISPULSE AI ASSISTANT</p>
                <p className="text-[10px] text-emerald-400">SSE Real-Time Stream</p>
              </div>
            </div>
          </div>

          {/* Month 2 Outcome Summary */}
          <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-900" />
              Month 2 Deliverables & Outcome
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700">
              <div>✓ Lawyer Management module integrated (50 accounts)</div>
              <div>✓ Client Management module integrated (50 accounts)</div>
              <div>✓ Case Management module integrated with court dockets</div>
              <div>✓ Appointment Management workflow implemented</div>
              <div>✓ Hearing Management functionality developed</div>
              <div>✓ Document Vault & Chain of Custody integrated</div>
              <div>✓ Role-Based Access Control implemented</div>
              <div>✓ Real-time AI Assistant SSE streaming operational</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 6: DEVELOPMENT TEAM CREDENTIALS */}
      {activeTab === 'team' && (
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xs space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">Project Team Roster</span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              Meet Our Team / Project Team
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              The team behind the development and implementation of this project.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
            {/* 1. Bhilare Sarvesh */}
            <div className="p-5 rounded-2xl border-2 border-amber-400 bg-amber-50/40 space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 font-bold text-[10px]">
                  LEAD DEVELOPER
                </span>
                <span className="font-mono text-slate-500 font-bold">240860131012</span>
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Bhilare Sarvesh</h3>
                <p className="text-xs font-bold text-amber-900 mt-0.5">Developer / Project Developer</p>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Developer of this project and responsible for the development and implementation of the system.
              </p>
            </div>

            {/* 2. Ritesh Bitode */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 font-bold text-[10px]">
                  CORE TEAM
                </span>
                <span className="font-mono text-slate-500 font-bold">240860131013</span>
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Ritesh Bitode</h3>
                <p className="text-xs font-bold text-blue-900 mt-0.5">Team Member</p>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Full-stack developer and UI/UX specialist responsible for responsive component architecture, interactive dashboards, and client CRM workflows.
              </p>
            </div>

            {/* 3. Taufeek Khan */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 font-bold text-[10px]">
                  CORE TEAM
                </span>
                <span className="font-mono text-slate-500 font-bold">240860131058</span>
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">Taufeek Khan</h3>
                <p className="text-xs font-bold text-blue-900 mt-0.5">Team Member</p>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Backend developer and database engineer responsible for litigation case schemas, evidence vault pipelines, and encrypted messaging protocols.
              </p>
            </div>

            {/* 4. PASWAN ABHISHEK */}
            <div className="p-5 rounded-2xl border border-slate-200 bg-white space-y-3 shadow-xs">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 font-bold text-[10px]">
                  CORE TEAM
                </span>
                <span className="font-mono text-slate-500 font-bold">250860131004</span>
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900">PASWAN ABHISHEK</h3>
                <p className="text-xs font-bold text-blue-900 mt-0.5">Team Member</p>
              </div>
              <p className="text-slate-600 leading-relaxed">
                Frontend developer and quality assurance engineer responsible for cross-browser responsive layouts, form validation, and testing.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
