import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Plus,
  Mail,
  Phone,
  Building2,
  Briefcase,
  Calendar,
  MessageSquare,
  ShieldCheck,
  DollarSign,
  UserCheck,
  Scale,
  Award,
  Star,
  MapPin,
  Clock,
  ChevronLeft,
  ChevronRight,
  Filter,
  LayoutGrid,
  List,
  CheckCircle2
} from 'lucide-react';
import { Client, LawyerProfile } from '../../../types/dashboard';
import { ProfileAvatar } from '../ProfileAvatar';
import { SPECIALIZATIONS_LIST, DetailedLawyerAccount, DetailedClientAccount } from '../../../data/extendedLawyersAndClients';

interface ClientsSectionProps {
  clients: Client[];
  lawyers?: LawyerProfile[];
  onAddNewClient: () => void;
  onScheduleWithClient: (client: Client) => void;
  onMessageClient: (client: Client) => void;
  onViewClientCases: (client: Client) => void;
  onViewClientProfile?: (client: Client) => void;
  onSelectLawyer?: (lawyer: LawyerProfile) => void;
  onOpenLawyerPortal?: (lawyer: LawyerProfile) => void;
}

export const ClientsSection: React.FC<ClientsSectionProps> = ({
  clients,
  lawyers = [],
  onAddNewClient,
  onScheduleWithClient,
  onMessageClient,
  onViewClientCases,
  onViewClientProfile,
  onSelectLawyer,
  onOpenLawyerPortal
}) => {
  // Directory Toggle: Clients vs Lawyers
  const [activeDirectory, setActiveDirectory] = useState<'clients' | 'lawyers'>('clients');

  // Filters
  const [filterTab, setFilterTab] = useState<'All' | 'Active' | 'Prospective' | 'Closed'>('All');
  const [specializationFilter, setSpecializationFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Filtered Clients
  const filteredClients = useMemo(() => {
    return clients.filter((cli) => {
      if (filterTab !== 'All' && cli.status !== filterTab) return false;
      if (specializationFilter !== 'All' && cli.caseType !== specializationFilter) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchName = cli.name.toLowerCase().includes(q);
        const matchEmail = cli.email.toLowerCase().includes(q);
        const matchCompany = (cli.company || '').toLowerCase().includes(q);
        const matchCase = cli.caseType.toLowerCase().includes(q);
        const matchCity = (cli.address || '').toLowerCase().includes(q);
        return matchName || matchEmail || matchCompany || matchCase || matchCity;
      }
      return true;
    });
  }, [clients, filterTab, specializationFilter, searchQuery]);

  // Filtered Lawyers
  const filteredLawyers = useMemo(() => {
    return lawyers.filter((law) => {
      if (specializationFilter !== 'All') {
        const specs = Array.isArray(law.specialization) ? law.specialization : [law.specialization];
        if (!specs.some((s) => s.toLowerCase().includes(specializationFilter.toLowerCase()))) {
          return false;
        }
      }
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchName = law.name.toLowerCase().includes(q);
        const matchEmail = (law.email || '').toLowerCase().includes(q);
        const matchBar = (law.barNumber || '').toLowerCase().includes(q);
        const matchFirm = (law.firmName || '').toLowerCase().includes(q);
        const matchCity = (law.officeAddress || '').toLowerCase().includes(q);
        return matchName || matchEmail || matchBar || matchFirm || matchCity;
      }
      return true;
    });
  }, [lawyers, specializationFilter, searchQuery]);

  // Pagination slicing
  const activeListLength = activeDirectory === 'clients' ? filteredClients.length : filteredLawyers.length;
  const totalPages = Math.max(1, Math.ceil(activeListLength / pageSize));

  const paginatedClients = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredClients.slice(start, start + pageSize);
  }, [filteredClients, currentPage]);

  const paginatedLawyers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredLawyers.slice(start, start + pageSize);
  }, [filteredLawyers, currentPage]);

  const handleDirectoryChange = (dir: 'clients' | 'lawyers') => {
    setActiveDirectory(dir);
    setCurrentPage(1);
  };

  const activeClientsCount = clients.filter((c) => c.status === 'Active').length;
  const prospectiveClientsCount = clients.filter((c) => c.status === 'Prospective').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase tracking-wider mb-1">
            <Scale className="w-4 h-4" />
            <span>Chambers Practice Directory</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {activeDirectory === 'clients' ? 'Clients Directory' : 'Lawyers & Counsel Directory'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            {activeDirectory === 'clients'
              ? 'Comprehensive registry of 50 verified clients with retainers, active court matters, and encrypted direct messaging.'
              : 'Directory of 50 practicing legal counsel with verified bar credentials, practice specializations, and fee schedules.'}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          {activeDirectory === 'clients' && (
            <button
              type="button"
              onClick={onAddNewClient}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-semibold text-xs shadow-sm transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Client</span>
            </button>
          )}
        </div>
      </div>

      {/* Directory Switcher Tabs & Quick Metrics */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-2 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            type="button"
            onClick={() => handleDirectoryChange('clients')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeDirectory === 'clients'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Clients Directory</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${activeDirectory === 'clients' ? 'bg-blue-800 text-white' : 'bg-slate-200 text-slate-700'}`}>
              {clients.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleDirectoryChange('lawyers')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
              activeDirectory === 'lawyers'
                ? 'bg-blue-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Lawyers Directory</span>
            <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono ${activeDirectory === 'lawyers' ? 'bg-blue-800 text-white' : 'bg-slate-200 text-slate-700'}`}>
              {lawyers.length}
            </span>
          </button>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-1.5 px-2">
          <span className="text-[11px] font-medium text-slate-500 hidden sm:inline">View:</span>
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`p-1.5 rounded-lg text-xs transition cursor-pointer ${
              viewMode === 'grid' ? 'bg-blue-100 text-blue-900' : 'text-slate-400 hover:text-slate-700'
            }`}
            title="Grid Cards View"
          >
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`p-1.5 rounded-lg text-xs transition cursor-pointer ${
              viewMode === 'table' ? 'bg-blue-100 text-blue-900' : 'text-slate-400 hover:text-slate-700'
            }`}
            title="Compact Table View"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mini Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            {activeDirectory === 'clients' ? 'Total Clients' : 'Total Counsel'}
          </span>
          <p className="text-2xl font-black text-slate-900 mt-0.5">
            {activeDirectory === 'clients' ? clients.length : lawyers.length}
          </p>
          <p className="text-[10px] text-slate-500">Verified accounts</p>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            {activeDirectory === 'clients' ? 'Active Retainers' : 'Avg Experience'}
          </span>
          <p className="text-2xl font-black text-emerald-600 mt-0.5">
            {activeDirectory === 'clients' ? activeClientsCount : '16.4 Yrs'}
          </p>
          <p className="text-[10px] text-slate-500">
            {activeDirectory === 'clients' ? 'Engaged legal counsel' : 'Senior trial advocates'}
          </p>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            {activeDirectory === 'clients' ? 'Prospective / Intake' : 'Specializations'}
          </span>
          <p className="text-2xl font-black text-amber-600 mt-0.5">
            {activeDirectory === 'clients' ? prospectiveClientsCount : SPECIALIZATIONS_LIST.length}
          </p>
          <p className="text-[10px] text-slate-500">
            {activeDirectory === 'clients' ? 'Pending consultation' : 'Legal disciplines'}
          </p>
        </div>

        <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            {activeDirectory === 'clients' ? 'Avg Matters/Client' : 'Bar Admitted'}
          </span>
          <p className="text-2xl font-black text-blue-900 mt-0.5">
            {activeDirectory === 'clients' ? '2.4' : '100%'}
          </p>
          <p className="text-[10px] text-slate-500">
            {activeDirectory === 'clients' ? 'Active dockets' : 'Verified state bar licenses'}
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
          {/* Client Status Tabs (only if clients directory active) */}
          {activeDirectory === 'clients' && (
            <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
              {(['All', 'Active', 'Prospective', 'Closed'] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => {
                    setFilterTab(tab);
                    setCurrentPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                    filterTab === tab
                      ? 'bg-white text-blue-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab}
                  {tab === 'Active' && (
                    <span className="ml-1.5 px-1.5 py-0.2 bg-emerald-600 text-white rounded-full text-[10px]">
                      {activeClientsCount}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Specialization Filter Dropdown */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <select
              value={specializationFilter}
              onChange={(e) => {
                setSpecializationFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="text-xs py-1.5 px-2.5 bg-slate-50 rounded-xl border border-slate-200 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-900"
            >
              <option value="All">All Specializations & Fields</option>
              {SPECIALIZATIONS_LIST.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>

          {/* Search Input */}
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              placeholder={activeDirectory === 'clients' ? 'Search 50 clients by name, email, company...' : 'Search 50 lawyers by name, bar no, city...'}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none transition"
            />
          </div>
        </div>

        {/* -------------------- CLIENTS VIEW -------------------- */}
        {activeDirectory === 'clients' && (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paginatedClients.map((client) => (
                  <div
                    key={client.id}
                    className="p-4 rounded-2xl border border-slate-200 hover:border-blue-900/40 bg-slate-50/50 hover:bg-white transition shadow-2xs space-y-3"
                  >
                    {/* Top row */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <ProfileAvatar
                          src={client.avatar}
                          name={client.name}
                          size="lg"
                          rounded="full"
                          ring="ring-1 ring-slate-200"
                          badgeType="client"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-sm font-bold text-slate-900 leading-tight">
                              {client.name}
                            </h3>
                            <span className="text-[10px] font-mono text-slate-400 font-semibold">
                              {client.id}
                            </span>
                          </div>
                          {client.company && (
                            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                              <Building2 className="w-3 h-3 text-slate-400" />
                              <span>{client.company}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          client.status === 'Active'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : client.status === 'Prospective'
                            ? 'bg-amber-100 text-amber-900 border border-amber-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {client.status}
                      </span>
                    </div>

                    {/* Case matter & retainer info */}
                    <div className="bg-white p-3 rounded-xl border border-slate-100 text-xs space-y-1.5">
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                          <Briefcase className="w-3.5 h-3.5 text-blue-900" />
                          <span>{client.caseType}</span>
                        </span>
                        <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                          {client.totalMatters} {client.totalMatters === 1 ? 'Matter' : 'Matters'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1.5 border-t border-slate-100">
                        <span className="flex items-center gap-1 font-bold text-emerald-700">
                          <DollarSign className="w-3 h-3" />
                          ${(client.retainerBalance ?? 25000).toLocaleString()} Retainer
                        </span>
                        <span className="text-slate-600 font-medium truncate max-w-[160px]">
                          Counsel: {client.leadCounsel ? client.leadCounsel.split(',')[0] : 'Sarah Vance'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-50">
                        <span>Client since {client.joinedDate}</span>
                        <span className="text-emerald-600 font-semibold flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3" />
                          {client.conflictStatus || 'Conflict Cleared'}
                        </span>
                      </div>
                    </div>

                    {/* Contact info */}
                    <div className="text-xs text-slate-600 space-y-1">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{client.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{client.phone}</span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-1.5">
                      {onViewClientProfile && (
                        <button
                          type="button"
                          onClick={() => onViewClientProfile(client)}
                          className="py-1.5 px-2.5 bg-blue-50 hover:bg-blue-100 text-blue-900 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition border border-blue-200 cursor-pointer"
                          title="View & edit client profile in database"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Profile</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => onScheduleWithClient(client)}
                        className="flex-1 py-1.5 px-2 bg-blue-900 hover:bg-blue-950 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition cursor-pointer"
                      >
                        <Calendar className="w-3 h-3" />
                        <span>Consultation</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onMessageClient(client)}
                        className="py-1.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition cursor-pointer"
                        title="Send Encrypted Message"
                      >
                        <MessageSquare className="w-3 h-3 text-blue-900" />
                        <span>Message</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* Compact Table View */
              <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-white">
                      <th className="p-3 font-bold">Client Name</th>
                      <th className="p-3 font-bold">Company</th>
                      <th className="p-3 font-bold">Case Type</th>
                      <th className="p-3 font-bold">Retainer</th>
                      <th className="p-3 font-bold">Status</th>
                      <th className="p-3 font-bold">Contact</th>
                      <th className="p-3 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {paginatedClients.map((client) => (
                      <tr key={client.id} className="hover:bg-blue-50/30 transition">
                        <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                          <ProfileAvatar src={client.avatar} name={client.name} size="sm" rounded="full" />
                          <div>
                            <div>{client.name}</div>
                            <div className="text-[10px] font-mono text-slate-400">{client.id}</div>
                          </div>
                        </td>
                        <td className="p-3 text-slate-600">{client.company || '—'}</td>
                        <td className="p-3 font-medium text-slate-800">{client.caseType}</td>
                        <td className="p-3 font-bold text-emerald-700">
                          ${(client.retainerBalance ?? 25000).toLocaleString()}
                        </td>
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              client.status === 'Active'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {client.status}
                          </span>
                        </td>
                        <td className="p-3 text-slate-500">
                          <div>{client.email}</div>
                          <div className="text-[10px]">{client.phone}</div>
                        </td>
                        <td className="p-3 text-right">
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => onMessageClient(client)}
                              className="px-2 py-1 rounded-lg bg-blue-50 text-blue-900 hover:bg-blue-100 font-bold text-[11px] cursor-pointer"
                            >
                              Message
                            </button>
                            <button
                              type="button"
                              onClick={() => onScheduleWithClient(client)}
                              className="px-2 py-1 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-semibold text-[11px] cursor-pointer"
                            >
                              Consult
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* -------------------- LAWYERS VIEW -------------------- */}
        {activeDirectory === 'lawyers' && (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {paginatedLawyers.map((lawyer) => {
                  const specs = Array.isArray(lawyer.specialization)
                    ? lawyer.specialization
                    : [lawyer.specialization];

                  return (
                    <div
                      key={lawyer.id || lawyer.email}
                      className="p-4 rounded-2xl border border-slate-200 hover:border-blue-900/40 bg-slate-50/50 hover:bg-white transition shadow-2xs space-y-3"
                    >
                      {/* Top row */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <ProfileAvatar
                            src={lawyer.avatarUrl}
                            name={lawyer.name}
                            size="lg"
                            rounded="full"
                            ring="ring-1 ring-slate-200"
                            badgeType="lawyer"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h3 className="text-sm font-bold text-slate-900 leading-tight">
                                {lawyer.name}
                              </h3>
                              <span className="text-[10px] font-mono text-slate-400 font-semibold">
                                {lawyer.id}
                              </span>
                            </div>
                            <p className="text-xs text-blue-900 font-semibold mt-0.5">
                              {lawyer.title || 'Senior Counsel'}
                            </p>
                          </div>
                        </div>

                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-200">
                          {lawyer.barNumber || 'Active Bar'}
                        </span>
                      </div>

                      {/* Bio snippet & details */}
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {lawyer.bio || 'Practicing senior legal counsel with trial litigation experience.'}
                      </p>

                      {/* Specializations & Rate box */}
                      <div className="bg-white p-3 rounded-xl border border-slate-100 text-xs space-y-2">
                        <div className="flex flex-wrap gap-1">
                          {specs.map((s, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-[10px] font-bold border border-slate-200"
                            >
                              {s}
                            </span>
                          ))}
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-slate-600 pt-1.5 border-t border-slate-100">
                          <span className="flex items-center gap-1 font-bold text-emerald-700">
                            <DollarSign className="w-3 h-3" />${lawyer.hourlyRate || 650}/hr
                          </span>
                          <span className="flex items-center gap-1 text-slate-500 font-medium">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {lawyer.officeAddress ? lawyer.officeAddress.split(',').slice(-2).join(',') : 'Chambers'}
                          </span>
                        </div>
                      </div>

                      {/* Contact row */}
                      <div className="text-xs text-slate-600 space-y-1">
                        <div className="flex items-center gap-2">
                          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{lawyer.email}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span>{lawyer.phone}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-1.5">
                        {onSelectLawyer && (
                          <button
                            type="button"
                            onClick={() => onSelectLawyer(lawyer)}
                            className="py-1.5 px-2.5 bg-blue-50 hover:bg-blue-100 text-blue-900 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition border border-blue-200 cursor-pointer"
                          >
                            <Scale className="w-3.5 h-3.5" />
                            <span>Profile</span>
                          </button>
                        )}
                        {onOpenLawyerPortal && (
                          <button
                            type="button"
                            onClick={() => onOpenLawyerPortal(lawyer)}
                            className="py-1.5 px-2.5 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl text-xs font-bold flex items-center justify-center gap-1 transition border border-amber-300 cursor-pointer shadow-2xs"
                            title="Launch this attorney's workstation in Lawyers Portal"
                          >
                            <Scale className="w-3.5 h-3.5 text-amber-700" />
                            <span>Portal</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            // Message this lawyer directly!
                            const mockClientAsRecipient: Client = {
                              id: lawyer.id,
                              name: lawyer.name,
                              email: lawyer.email,
                              phone: lawyer.phone,
                              avatar: lawyer.avatarUrl,
                              caseType: specs[0] || 'Legal Advisory',
                              status: 'Active',
                              totalMatters: 1,
                              joinedDate: '2026'
                            };
                            onMessageClient(mockClientAsRecipient);
                          }}
                          className="flex-1 py-1.5 px-3 bg-blue-900 hover:bg-blue-950 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>Message</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Compact Table View */
              <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-white">
                      <th className="p-3 font-bold">Counsel Name</th>
                      <th className="p-3 font-bold">Bar Registration</th>
                      <th className="p-3 font-bold">Specialization</th>
                      <th className="p-3 font-bold">Rate</th>
                      <th className="p-3 font-bold">Office</th>
                      <th className="p-3 font-bold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 bg-white">
                    {paginatedLawyers.map((lawyer) => {
                      const specs = Array.isArray(lawyer.specialization)
                        ? lawyer.specialization
                        : [lawyer.specialization];

                      return (
                        <tr key={lawyer.id || lawyer.email} className="hover:bg-blue-50/30 transition">
                          <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                            <ProfileAvatar src={lawyer.avatarUrl} name={lawyer.name} size="sm" rounded="full" />
                            <div>
                              <div>{lawyer.name}</div>
                              <div className="text-[10px] text-slate-500 font-normal">{lawyer.title}</div>
                            </div>
                          </td>
                          <td className="p-3 font-mono text-blue-900 font-semibold">{lawyer.barNumber}</td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 font-semibold text-[11px]">
                              {specs[0]}
                            </span>
                          </td>
                          <td className="p-3 font-bold text-emerald-700">${lawyer.hourlyRate || 650}/hr</td>
                          <td className="p-3 text-slate-600 truncate max-w-[150px]">{lawyer.officeAddress || 'Chambers'}</td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {onOpenLawyerPortal && (
                                <button
                                  type="button"
                                  onClick={() => onOpenLawyerPortal(lawyer)}
                                  className="px-2.5 py-1 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[11px] cursor-pointer"
                                  title="Launch in Lawyers Portal"
                                >
                                  Portal
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => {
                                  const mockClientAsRecipient: Client = {
                                    id: lawyer.id,
                                    name: lawyer.name,
                                    email: lawyer.email,
                                    phone: lawyer.phone,
                                    avatar: lawyer.avatarUrl,
                                    caseType: specs[0] || 'Legal Advisory',
                                    status: 'Active',
                                    totalMatters: 1,
                                    joinedDate: '2026'
                                  };
                                  onMessageClient(mockClientAsRecipient);
                                }}
                                className="px-3 py-1.5 rounded-xl bg-blue-900 text-white hover:bg-blue-950 font-bold text-[11px] cursor-pointer"
                              >
                                Message
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* Pagination Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-200">
          <p className="text-xs text-slate-500">
            Showing <strong className="text-slate-800">{activeListLength === 0 ? 0 : (currentPage - 1) * pageSize + 1}</strong> to{' '}
            <strong className="text-slate-800">{Math.min(currentPage * pageSize, activeListLength)}</strong> of{' '}
            <strong className="text-slate-800">{activeListLength}</strong> {activeDirectory === 'clients' ? 'clients' : 'lawyers'}
          </p>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
              <button
                key={pageNum}
                type="button"
                onClick={() => setCurrentPage(pageNum)}
                className={`w-8 h-8 rounded-xl text-xs font-bold transition cursor-pointer ${
                  currentPage === pageNum
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              type="button"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 disabled:opacity-40 disabled:pointer-events-none transition cursor-pointer"
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
