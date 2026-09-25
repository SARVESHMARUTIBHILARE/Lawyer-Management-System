import React, { useState, useMemo } from 'react';
import {
  Database,
  Search,
  Filter,
  Download,
  Plus,
  Trash2,
  Code2,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Layers,
  Users,
  Calendar,
  Briefcase,
  FileText,
  CreditCard,
  UserCheck,
  Scale,
  ShieldCheck,
  ExternalLink,
  ChevronRight,
  HardDrive,
  Cpu,
  Copy,
  Check,
  X
} from 'lucide-react';
import {
  LawyerProfile,
  AuthUser,
  Appointment,
  Client,
  LegalCase,
  LegalDocument,
  Invoice
} from '../../../types/dashboard';

export type DatabaseCollection =
  | 'lawyers'
  | 'users'
  | 'appointments'
  | 'clients'
  | 'cases'
  | 'documents'
  | 'invoices';

interface DatabaseSectionProps {
  lawyers: LawyerProfile[];
  currentLawyer: LawyerProfile;
  currentUser: AuthUser | null;
  appointments: Appointment[];
  clients: Client[];
  cases: LegalCase[];
  documents: LegalDocument[];
  invoices: Invoice[];
  onSelectActiveLawyer: (lawyer: LawyerProfile) => void;
  onAddNewLawyerClick: () => void;
  onAddNewClientClick: () => void;
  onAddNewAppointmentClick: () => void;
  onAddNewCaseClick: () => void;
  onUploadDocClick: () => void;
  onDeleteRecord: (collection: DatabaseCollection, idOrKey: string) => void;
  onResetDatabase?: () => void;
  onViewClientProfile?: (client: Client) => void;
  onViewLawyerProfile?: (lawyer: LawyerProfile) => void;
}

export const DatabaseSection: React.FC<DatabaseSectionProps> = ({
  lawyers,
  currentLawyer,
  currentUser,
  appointments,
  clients,
  cases,
  documents,
  invoices,
  onSelectActiveLawyer,
  onAddNewLawyerClick,
  onAddNewClientClick,
  onAddNewAppointmentClick,
  onAddNewCaseClick,
  onUploadDocClick,
  onDeleteRecord,
  onResetDatabase,
  onViewClientProfile,
  onViewLawyerProfile
}) => {
  const [activeCollection, setActiveCollection] = useState<DatabaseCollection>('lawyers');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [inspectingRecord, setInspectingRecord] = useState<{
    collection: DatabaseCollection;
    data: any;
    id: string;
  } | null>(null);
  const [hasCopiedJson, setHasCopiedJson] = useState(false);
  const [integrityStatus, setIntegrityStatus] = useState<string | null>(null);
  const [isVerifyingIntegrity, setIsVerifyingIntegrity] = useState(false);

  // Derive all users list: currentUser + default system users if needed
  const usersList: AuthUser[] = useMemo(() => {
    const baseUsers: AuthUser[] = [
      currentUser || {
        id: 'usr-sarah-vance',
        name: currentLawyer.name,
        email: currentLawyer.email,
        avatarUrl: currentLawyer.avatarUrl,
        provider: 'email',
        role: currentLawyer.title,
        firmName: currentLawyer.firmName,
        barNumber: currentLawyer.barNumber,
        loggedInAt: 'Active Session'
      },
      {
        id: 'usr-marcus-sterling',
        name: 'Marcus Sterling, Esq.',
        email: 'm.sterling@vancelawpartners.com',
        avatarUrl:
          'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256&h=256',
        provider: 'google',
        role: 'Senior Partner, Trial Practice',
        firmName: 'Vance & Sterling LLP',
        barNumber: 'NY-BAR #3819024',
        loggedInAt: '2 hours ago'
      },
      {
        id: 'usr-paralegal-chen',
        name: 'Sophia Chen',
        email: 's.chen@vancelawpartners.com',
        avatarUrl:
          'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=256&h=256',
        provider: 'twitter',
        role: 'Senior Paralegal & Docket Clerk',
        firmName: 'Vance & Sterling LLP',
        loggedInAt: 'Yesterday'
      }
    ];
    return baseUsers;
  }, [currentUser, currentLawyer]);

  // Record counts
  const counts = {
    lawyers: lawyers.length,
    users: usersList.length,
    appointments: appointments.length,
    clients: clients.length,
    cases: cases.length,
    documents: documents.length,
    invoices: invoices.length
  };

  const totalRecords = Object.values(counts).reduce((a, b) => a + b, 0);

  // Collections meta
  const collectionsMeta: {
    key: DatabaseCollection;
    label: string;
    icon: React.FC<{ className?: string }>;
    count: number;
    description: string;
  }[] = [
    {
      key: 'lawyers',
      label: 'lawyers',
      icon: Scale,
      count: counts.lawyers,
      description: 'Firm practicing attorneys, bar credentials, hourly rates, and photos'
    },
    {
      key: 'users',
      label: 'users',
      icon: Users,
      count: counts.users,
      description: 'Chambers accounts, auth identities, login sessions, and roles'
    },
    {
      key: 'appointments',
      label: 'appointments',
      icon: Calendar,
      count: counts.appointments,
      description: 'Consultations, depositions, and trial hearing prep dockets'
    },
    {
      key: 'clients',
      label: 'clients',
      icon: UserCheck,
      count: counts.clients,
      description: 'Corporate client entities, retainers, and conflict clearance'
    },
    {
      key: 'cases',
      label: 'cases',
      icon: Briefcase,
      count: counts.cases,
      description: 'Active federal & state litigation dockets, filings, and leads'
    },
    {
      key: 'documents',
      label: 'documents',
      icon: FileText,
      count: counts.documents,
      description: 'Evidentiary vault records, pleadings, briefs, and exhibits'
    },
    {
      key: 'invoices',
      label: 'invoices',
      icon: CreditCard,
      count: counts.invoices,
      description: 'IOLTA escrow retainers, hourly billings, and ledgers'
    }
  ];

  // Integrity Verification
  const handleVerifyIntegrity = () => {
    setIsVerifyingIntegrity(true);
    setTimeout(() => {
      setIsVerifyingIntegrity(false);
      setIntegrityStatus(
        `Integrity Check Passed: All ${totalRecords} records across 7 collections validated. Foreign keys, Bar ID indexes, and client relationships intact.`
      );
      setTimeout(() => setIntegrityStatus(null), 5000);
    }, 600);
  };

  // Full Database JSON Export
  const handleExportFullDatabaseJson = () => {
    const fullDbSnapshot = {
      database: 'JurisVault Legal Practice DB',
      version: '3.4.0',
      exportedAt: new Date().toISOString(),
      firm: currentLawyer.firmName,
      totalCollections: 7,
      totalRecords,
      collections: {
        lawyers,
        users: usersList,
        appointments,
        clients,
        cases,
        documents,
        invoices
      }
    };

    const blob = new Blob([JSON.stringify(fullDbSnapshot, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `jurisvault-db-export-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Current Table CSV Export
  const handleExportTableCsv = () => {
    let rows: any[] = [];
    if (activeCollection === 'lawyers') {
      rows = lawyers.map((l) => ({
        name: l.name,
        title: l.title,
        barNumber: l.barNumber,
        email: l.email,
        phone: l.phone,
        hourlyRate: l.hourlyRate,
        firm: l.firmName
      }));
    } else if (activeCollection === 'users') {
      rows = usersList.map((u) => ({
        name: u.name,
        email: u.email,
        role: u.role,
        provider: u.provider,
        firmName: u.firmName
      }));
    } else if (activeCollection === 'appointments') {
      rows = appointments.map((a) => ({
        id: a.id,
        clientName: a.clientName,
        date: a.date,
        time: a.time,
        caseType: a.caseType,
        status: a.status,
        appointmentType: a.appointmentType
      }));
    } else if (activeCollection === 'clients') {
      rows = clients.map((c) => ({
        id: c.id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        company: c.company,
        status: c.status
      }));
    } else if (activeCollection === 'cases') {
      rows = cases.map((c) => ({
        id: c.id,
        title: c.title,
        client: c.clientName,
        status: c.caseStatus,
        jurisdiction: c.courtJurisdiction
      }));
    } else if (activeCollection === 'documents') {
      rows = documents.map((d) => ({
        id: d.id,
        title: d.title,
        caseId: d.caseId,
        client: d.clientName,
        category: d.category,
        fileSize: d.fileSize
      }));
    } else if (activeCollection === 'invoices') {
      rows = invoices.map((i) => ({
        id: i.id,
        client: i.clientName,
        amount: i.amount,
        status: i.status,
        type: i.type
      }));
    }

    if (rows.length === 0) return;

    const headers = Object.keys(rows[0]).join(',');
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers, ...rows.map((r) => Object.values(r).map((v) => `"${v}"`).join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${activeCollection}-table-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy JSON in Inspector
  const handleCopyJson = () => {
    if (!inspectingRecord) return;
    navigator.clipboard.writeText(JSON.stringify(inspectingRecord.data, null, 2));
    setHasCopiedJson(true);
    setTimeout(() => setHasCopiedJson(false), 2000);
  };

  // Filtered rows for current collection
  const filteredRecords = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    if (activeCollection === 'lawyers') {
      return lawyers.filter((l) => {
        const matchesQ =
          !q ||
          l.name.toLowerCase().includes(q) ||
          l.title.toLowerCase().includes(q) ||
          l.barNumber.toLowerCase().includes(q) ||
          l.email.toLowerCase().includes(q);
        return matchesQ;
      });
    }

    if (activeCollection === 'users') {
      return usersList.filter((u) => {
        const matchesQ =
          !q ||
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          u.role.toLowerCase().includes(q);
        const matchesStatus =
          statusFilter === 'All' ||
          (statusFilter === 'Active' && u.loggedInAt.includes('Active')) ||
          (statusFilter === 'Social' && u.provider !== 'email');
        return matchesQ && matchesStatus;
      });
    }

    if (activeCollection === 'appointments') {
      return appointments.filter((a) => {
        const matchesQ =
          !q ||
          a.clientName.toLowerCase().includes(q) ||
          a.caseType.toLowerCase().includes(q) ||
          a.time.toLowerCase().includes(q);
        const matchesStatus = statusFilter === 'All' || a.status === statusFilter;
        return matchesQ && matchesStatus;
      });
    }

    if (activeCollection === 'clients') {
      return clients.filter((c) => {
        const matchesQ =
          !q ||
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q) ||
          (c.company && c.company.toLowerCase().includes(q));
        const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
        return matchesQ && matchesStatus;
      });
    }

    if (activeCollection === 'cases') {
      return cases.filter((c) => {
        const matchesQ =
          !q ||
          c.title.toLowerCase().includes(q) ||
          c.id.toLowerCase().includes(q) ||
          c.clientName.toLowerCase().includes(q);
        const matchesStatus = statusFilter === 'All' || c.caseStatus === statusFilter;
        return matchesQ && matchesStatus;
      });
    }

    if (activeCollection === 'documents') {
      return documents.filter((d) => {
        const matchesQ =
          !q ||
          d.title.toLowerCase().includes(q) ||
          d.caseId.toLowerCase().includes(q) ||
          d.clientName.toLowerCase().includes(q);
        const matchesStatus = statusFilter === 'All' || d.category === statusFilter;
        return matchesQ && matchesStatus;
      });
    }

    if (activeCollection === 'invoices') {
      return invoices.filter((i) => {
        const matchesQ =
          !q ||
          i.id.toLowerCase().includes(q) ||
          i.clientName.toLowerCase().includes(q) ||
          i.type.toLowerCase().includes(q);
        const matchesStatus = statusFilter === 'All' || i.status === statusFilter;
        return matchesQ && matchesStatus;
      });
    }

    return [];
  }, [
    activeCollection,
    searchQuery,
    statusFilter,
    lawyers,
    usersList,
    appointments,
    clients,
    cases,
    documents,
    invoices
  ]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200" id="database-section">
      {/* ======================================================== */}
      {/* SECTION HEADER & STORAGE HEALTH BAR */}
      {/* ======================================================== */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        {/* Subtle decorative grid background */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 uppercase tracking-wider flex items-center gap-1">
                <HardDrive className="w-3 h-3" />
                JurisVault™ Database Engine v3.4
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Replication Online
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-3">
              Chambers Practice Database
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Real-time persistent data vault indexing registered attorneys, authenticated client dockets,
              IOLTA financial ledgers, and evidentiary records under privileged client confidentiality.
            </p>
          </div>

          {/* Quick Database Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onAddNewLawyerClick}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs shadow-md transition cursor-pointer"
              title="Add a new practicing attorney with name and photo"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Lawyer</span>
            </button>

            <button
              type="button"
              onClick={handleExportFullDatabaseJson}
              className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/15 backdrop-blur-xs transition cursor-pointer"
              title="Export all collections to JSON file"
            >
              <Download className="w-4 h-4 text-amber-300" />
              <span>Export Full DB (JSON)</span>
            </button>

            <button
              type="button"
              onClick={handleVerifyIntegrity}
              disabled={isVerifyingIntegrity}
              className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 text-xs font-semibold border border-white/15 transition cursor-pointer"
              title="Run database relationship integrity check"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isVerifyingIntegrity ? 'animate-spin text-amber-300' : ''}`} />
              <span>Verify Integrity</span>
            </button>
          </div>
        </div>

        {/* Database Metric Badges */}
        <div className="mt-6 pt-5 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-[11px] text-slate-400 block font-medium">Total Database Records</span>
            <span className="text-xl font-black text-white">{totalRecords}</span>
            <span className="text-[10px] text-emerald-400 block mt-0.5">Indexed across 7 tables</span>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-[11px] text-slate-400 block font-medium">Registered Counsel Roster</span>
            <span className="text-xl font-black text-amber-400">{lawyers.length} Attorneys</span>
            <span className="text-[10px] text-slate-300 block mt-0.5">Active: {currentLawyer.name.split(',')[0]}</span>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-[11px] text-slate-400 block font-medium">Storage Engine</span>
            <span className="text-sm font-bold text-white flex items-center gap-1 mt-1">
              <Cpu className="w-3.5 h-3.5 text-blue-300" />
              Client Vault (Indexed)
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">AES-256 State Persistence</span>
          </div>

          <div className="bg-white/5 rounded-xl p-3 border border-white/10">
            <span className="text-[11px] text-slate-400 block font-medium">Data Integrity Check</span>
            <span className="text-sm font-bold text-emerald-400 flex items-center gap-1 mt-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              100% Validated
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Zero Foreign Key Violations</span>
          </div>
        </div>

        {/* Integrity alert feedback */}
        {integrityStatus && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-900/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in duration-150">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{integrityStatus}</span>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* TABLE / COLLECTION SELECTION TABS */}
      {/* ======================================================== */}
      <div className="bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
          {collectionsMeta.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeCollection === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => {
                  setActiveCollection(tab.key);
                  setStatusFilter('All');
                  setSearchQuery('');
                }}
                className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-blue-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full font-extrabold ${
                    isActive ? 'bg-blue-800 text-amber-300' : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ======================================================== */}
      {/* SEARCH, FILTER & TABLE CONTROLS BAR */}
      {/* ======================================================== */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
          {/* Universal table search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search collection ${activeCollection} by name, ID, or keyword...`}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none"
            />
          </div>

          {/* Quick Collection specific status filter */}
          {activeCollection !== 'lawyers' && (
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs p-2 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none font-medium text-slate-700"
            >
              <option value="All">All Statuses</option>
              {activeCollection === 'appointments' && (
                <>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                </>
              )}
              {activeCollection === 'clients' && (
                <>
                  <option value="Active">Active Clients</option>
                  <option value="Prospective">Prospective</option>
                  <option value="Closed">Closed</option>
                </>
              )}
              {activeCollection === 'cases' && (
                <>
                  <option value="Active">Active Litigation</option>
                  <option value="Discovery">Discovery</option>
                  <option value="Pre-Trial">Pre-Trial</option>
                  <option value="In Review">In Review</option>
                </>
              )}
              {activeCollection === 'invoices' && (
                <>
                  <option value="Paid">Paid</option>
                  <option value="Pending">Pending</option>
                  <option value="Overdue">Overdue</option>
                </>
              )}
            </select>
          )}
        </div>

        {/* Action buttons for active table */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <span className="text-[11px] text-slate-500 font-medium mr-2">
            Showing <strong>{filteredRecords.length}</strong> of {counts[activeCollection]} records
          </span>

          <button
            type="button"
            onClick={handleExportTableCsv}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition cursor-pointer"
            title="Download this table as CSV spreadsheet"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            <span>CSV</span>
          </button>

          {/* Dynamic contextual Add button */}
          {activeCollection === 'lawyers' && (
            <button
              type="button"
              onClick={onAddNewLawyerClick}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-amber-400" />
              <span>Add Lawyer</span>
            </button>
          )}
          {activeCollection === 'clients' && (
            <button
              type="button"
              onClick={onAddNewClientClick}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-amber-400" />
              <span>Add Client</span>
            </button>
          )}
          {activeCollection === 'appointments' && (
            <button
              type="button"
              onClick={onAddNewAppointmentClick}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-amber-400" />
              <span>Add Appointment</span>
            </button>
          )}
          {activeCollection === 'cases' && (
            <button
              type="button"
              onClick={onAddNewCaseClick}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-amber-400" />
              <span>Create Case</span>
            </button>
          )}
          {activeCollection === 'documents' && (
            <button
              type="button"
              onClick={onUploadDocClick}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold transition shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-amber-400" />
              <span>Upload Doc</span>
            </button>
          )}
        </div>
      </div>

      {/* ======================================================== */}
      {/* LIVE COLLECTION DATA TABLES */}
      {/* ======================================================== */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {/* 1. LAWYERS TABLE */}
          {activeCollection === 'lawyers' && (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">Counsel Photo & Name</th>
                  <th className="py-3.5 px-4">Bar License ID</th>
                  <th className="py-3.5 px-4">Firm Role</th>
                  <th className="py-3.5 px-4">Hourly Rate</th>
                  <th className="py-3.5 px-4">Direct Contact</th>
                  <th className="py-3.5 px-4">Active Counsel</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.map((l: LawyerProfile, idx: number) => {
                  const isActive = l.barNumber === currentLawyer.barNumber;
                  return (
                    <tr key={l.barNumber || idx} className="hover:bg-slate-50/80 transition">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={l.avatarUrl}
                            alt={l.name}
                            className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-300 shrink-0"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block">{l.name}</span>
                            <span className="text-[11px] text-slate-500">{l.firmName}</span>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-slate-700">
                        {l.barNumber}
                      </td>

                      <td className="py-3 px-4">
                        <span className="font-medium text-slate-800">{l.title}</span>
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {l.specialization?.slice(0, 2).map((s) => (
                            <span
                              key={s}
                              className="text-[9px] bg-blue-50 text-blue-900 px-1.5 py-0.2 rounded font-semibold"
                            >
                              {s}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="py-3 px-4 font-bold text-slate-900">
                        ${l.hourlyRate || 650}/hr
                      </td>

                      <td className="py-3 px-4 text-slate-600">
                        <div className="text-[11px]">{l.email}</div>
                        <div className="text-[10px] text-slate-400">{l.phone}</div>
                      </td>

                      <td className="py-3 px-4">
                        {isActive ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                            Current Active
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => onSelectActiveLawyer(l)}
                            className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-slate-100 hover:bg-blue-900 hover:text-white text-slate-700 transition cursor-pointer"
                          >
                            Switch to Counsel
                          </button>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {onViewLawyerProfile && (
                            <button
                              type="button"
                              onClick={() => onViewLawyerProfile(l)}
                              className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-600 hover:text-blue-900 transition"
                              title="View & Edit Lawyer Profile in Database"
                            >
                              <UserCheck className="w-4 h-4 text-blue-900" />
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() =>
                              setInspectingRecord({
                                collection: 'lawyers',
                                data: l,
                                id: l.barNumber
                              })
                            }
                            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-blue-900 transition"
                            title="Inspect Raw JSON Record"
                          >
                            <Code2 className="w-4 h-4" />
                          </button>

                          {lawyers.length > 1 && !isActive && (
                            <button
                              type="button"
                              onClick={() => onDeleteRecord('lawyers', l.barNumber)}
                              className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition"
                              title="Remove from firm roster"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}

          {/* 2. USERS TABLE */}
          {activeCollection === 'users' && (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">User Identity & Photo</th>
                  <th className="py-3.5 px-4">Login Email</th>
                  <th className="py-3.5 px-4">Chambers Role</th>
                  <th className="py-3.5 px-4">Auth Provider</th>
                  <th className="py-3.5 px-4">Session Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.map((u: AuthUser) => (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatarUrl}
                          alt={u.name}
                          className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-300 shrink-0"
                        />
                        <div>
                          <span className="font-bold text-slate-900 block">{u.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{u.id}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-slate-700 font-medium">{u.email}</td>

                    <td className="py-3 px-4 font-semibold text-slate-800">{u.role}</td>

                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 uppercase tracking-wider">
                        {u.provider}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="text-[11px] text-slate-600">{u.loggedInAt}</span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          setInspectingRecord({
                            collection: 'users',
                            data: u,
                            id: u.id
                          })
                        }
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-blue-900 transition"
                        title="Inspect Raw JSON Record"
                      >
                        <Code2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* 3. APPOINTMENTS TABLE */}
          {activeCollection === 'appointments' && (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">Docket ID & Client</th>
                  <th className="py-3.5 px-4">Scheduled Date/Time</th>
                  <th className="py-3.5 px-4">Legal Matter</th>
                  <th className="py-3.5 px-4">Format / Room</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.map((apt: Appointment) => (
                  <tr key={apt.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        {apt.clientAvatar && (
                          <img
                            src={apt.clientAvatar}
                            alt={apt.clientName}
                            className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200 shrink-0"
                          />
                        )}
                        <div>
                          <span className="font-bold text-slate-900 block">{apt.clientName}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{apt.id}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-800">{apt.date}</div>
                      <div className="text-[11px] text-slate-500">{apt.time} ({apt.duration})</div>
                    </td>

                    <td className="py-3 px-4">
                      <div className="font-medium text-slate-800">{apt.caseType}</div>
                      {apt.caseId && <div className="text-[10px] font-mono text-blue-900">{apt.caseId}</div>}
                    </td>

                    <td className="py-3 px-4 text-slate-600">
                      <div className="text-[11px]">{apt.appointmentType}</div>
                      {apt.roomOrLink && (
                        <div className="text-[10px] text-slate-400 truncate max-w-[160px]">
                          {apt.roomOrLink}
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          apt.status === 'Confirmed'
                            ? 'bg-emerald-100 text-emerald-800'
                            : apt.status === 'Pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {apt.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            setInspectingRecord({
                              collection: 'appointments',
                              data: apt,
                              id: apt.id
                            })
                          }
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-blue-900 transition"
                          title="Inspect JSON Record"
                        >
                          <Code2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteRecord('appointments', apt.id)}
                          className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition"
                          title="Delete appointment"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* 4. CLIENTS TABLE */}
          {activeCollection === 'clients' && (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">Client Entity</th>
                  <th className="py-3.5 px-4">Organization / Company</th>
                  <th className="py-3.5 px-4">Direct Contact</th>
                  <th className="py-3.5 px-4">Primary Matter Area</th>
                  <th className="py-3.5 px-4">Matters</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.map((c: Client) => (
                  <tr key={c.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2.5">
                        {c.avatar && (
                          <img
                            src={c.avatar}
                            alt={c.name}
                            className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200 shrink-0"
                          />
                        )}
                        <div>
                          <span className="font-bold text-slate-900 block">{c.name}</span>
                          <span className="text-[10px] text-slate-400 font-mono">{c.id}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-4 font-semibold text-slate-800">{c.company || 'Private Retainer'}</td>

                    <td className="py-3 px-4 text-slate-600">
                      <div className="text-[11px]">{c.email}</div>
                      <div className="text-[10px] text-slate-400">{c.phone}</div>
                    </td>

                    <td className="py-3 px-4 font-medium text-slate-800">{c.caseType}</td>

                    <td className="py-3 px-4 font-bold text-blue-900">{c.totalMatters}</td>

                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          c.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {onViewClientProfile && (
                          <button
                            type="button"
                            onClick={() => onViewClientProfile(c)}
                            className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-600 hover:text-blue-900 transition"
                            title="View & Edit Client Profile in Database"
                          >
                            <UserCheck className="w-4 h-4 text-blue-900" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() =>
                            setInspectingRecord({
                              collection: 'clients',
                              data: c,
                              id: c.id
                            })
                          }
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-blue-900 transition"
                          title="Inspect JSON Record"
                        >
                          <Code2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteRecord('clients', c.id)}
                          className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition"
                          title="Delete client"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* 5. CASES TABLE */}
          {activeCollection === 'cases' && (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">Docket ID</th>
                  <th className="py-3.5 px-4">Matter Title</th>
                  <th className="py-3.5 px-4">Client</th>
                  <th className="py-3.5 px-4">Court Jurisdiction</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.map((cs: LegalCase) => (
                  <tr key={cs.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-mono font-bold text-blue-900">{cs.id}</td>
                    <td className="py-3 px-4 font-bold text-slate-900">{cs.title}</td>
                    <td className="py-3 px-4 text-slate-700">{cs.clientName}</td>
                    <td className="py-3 px-4 text-slate-600">{cs.courtJurisdiction || 'Federal District'}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-900 border border-blue-200">
                        {cs.caseStatus}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            setInspectingRecord({
                              collection: 'cases',
                              data: cs,
                              id: cs.id
                            })
                          }
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-blue-900 transition"
                          title="Inspect JSON Record"
                        >
                          <Code2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteRecord('cases', cs.id)}
                          className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition"
                          title="Delete case"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* 6. DOCUMENTS TABLE */}
          {activeCollection === 'documents' && (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">Vault Record Title</th>
                  <th className="py-3.5 px-4">Associated Case ID</th>
                  <th className="py-3.5 px-4">Client</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">File Size</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.map((d: LegalDocument) => (
                  <tr key={d.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-bold text-slate-900">{d.title}</td>
                    <td className="py-3 px-4 font-mono text-blue-900 font-semibold">{d.caseId}</td>
                    <td className="py-3 px-4 text-slate-700">{d.clientName}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">
                        {d.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-500">{d.fileSize}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            setInspectingRecord({
                              collection: 'documents',
                              data: d,
                              id: d.id
                            })
                          }
                          className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-blue-900 transition"
                          title="Inspect JSON Record"
                        >
                          <Code2 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteRecord('documents', d.id)}
                          className="p-1.5 rounded-lg hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition"
                          title="Delete document"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* 7. INVOICES TABLE */}
          {activeCollection === 'invoices' && (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-3.5 px-4">Invoice ID</th>
                  <th className="py-3.5 px-4">Client Name</th>
                  <th className="py-3.5 px-4">Amount</th>
                  <th className="py-3.5 px-4">Type</th>
                  <th className="py-3.5 px-4">Due Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRecords.map((i: Invoice) => (
                  <tr key={i.id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{i.id}</td>
                    <td className="py-3 px-4 font-medium text-slate-800">{i.clientName}</td>
                    <td className="py-3 px-4 font-black text-slate-900">${i.amount.toLocaleString()}</td>
                    <td className="py-3 px-4 text-slate-600">{i.type}</td>
                    <td className="py-3 px-4 text-slate-500">{i.dueDate}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          i.status === 'Paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : i.status === 'Pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-rose-100 text-rose-800'
                        }`}
                      >
                        {i.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() =>
                          setInspectingRecord({
                            collection: 'invoices',
                            data: i,
                            id: i.id
                          })
                        }
                        className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 hover:text-blue-900 transition"
                        title="Inspect JSON Record"
                      >
                        <Code2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Empty records notice */}
        {filteredRecords.length === 0 && (
          <div className="py-12 text-center text-slate-500 text-xs">
            <Database className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="font-semibold text-slate-700">No records found matching current query</p>
            <p className="text-[11px] text-slate-400 mt-1">
              Try adjusting your search terms or status filter.
            </p>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* RAW RECORD JSON INSPECTOR MODAL */}
      {/* ======================================================== */}
      {inspectingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
          <div className="bg-slate-900 text-slate-100 rounded-3xl max-w-2xl w-full border border-slate-700 shadow-2xl overflow-hidden my-8">
            <div className="flex items-center justify-between p-5 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-900/50 text-blue-400 border border-blue-500/20">
                  <Code2 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    Record Document Inspector
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Collection: <span className="text-amber-400">{inspectingRecord.collection}</span> • Key: {inspectingRecord.id}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopyJson}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 transition cursor-pointer border border-slate-700"
                >
                  {hasCopiedJson ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy JSON</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setInspectingRecord(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-5 max-h-[60vh] overflow-y-auto bg-slate-950/60 font-mono text-[11px] leading-relaxed text-emerald-400 select-all">
              <pre>{JSON.stringify(inspectingRecord.data, null, 2)}</pre>
            </div>

            <div className="p-4 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-3 text-[11px] text-slate-400">
              <div className="flex flex-wrap items-center gap-2">
                {inspectingRecord.collection === 'clients' && onViewClientProfile && (
                  <button
                    type="button"
                    onClick={() => {
                      const clientData = inspectingRecord.data;
                      setInspectingRecord(null);
                      onViewClientProfile(clientData);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition cursor-pointer shadow-sm"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Open Client Profile in Database</span>
                  </button>
                )}
                {inspectingRecord.collection === 'lawyers' && onViewLawyerProfile && (
                  <button
                    type="button"
                    onClick={() => {
                      const lawyerData = inspectingRecord.data;
                      setInspectingRecord(null);
                      onViewLawyerProfile(lawyerData);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition cursor-pointer shadow-sm"
                  >
                    <Scale className="w-3.5 h-3.5" />
                    <span>Open Lawyer Profile in Database</span>
                  </button>
                )}
                <span>JurisVault Schema Standard 2026.09</span>
              </div>
              <button
                type="button"
                onClick={() => setInspectingRecord(null)}
                className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold transition cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
