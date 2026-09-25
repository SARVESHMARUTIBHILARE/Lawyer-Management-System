import React from 'react';
import {
  Sparkles,
  Scale,
  Search
} from 'lucide-react';
import { Appointment, LegalCase, Client, LawyerProfile, AuthUser, PersonProfile } from '../../../types/dashboard';
import { StatCards } from '../StatCards';
import { QuickActions } from '../QuickActions';
import { TodaysAppointments } from '../TodaysAppointments';
import { UpcomingAppointments } from '../UpcomingAppointments';
import { RecentCases } from '../RecentCases';
import { ProfileAvatar } from '../ProfileAvatar';

interface DashboardSectionProps {
  lawyer: LawyerProfile;
  currentUser?: AuthUser | null;
  activePerson?: PersonProfile | null;
  todayAppointments: Appointment[];
  upcomingAppointments: Appointment[];
  recentCases: LegalCase[];
  clients: Client[];
  pendingRequestsCount: number;
  totalAppointmentsCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onViewAppointment: (apt: Appointment) => void;
  onAcceptAppointment: (id: string) => void;
  onRejectAppointment: (id: string) => void;
  onViewCase: (c: LegalCase) => void;
  onAddAppointmentClick: () => void;
  onAddClientClick: () => void;
  onCreateCaseClick: () => void;
  onUploadDocClick: () => void;
  onAddLawyerClick?: () => void;
  onNavigateToSection: (sectionKey: any) => void;
}

export const DashboardSection: React.FC<DashboardSectionProps> = ({
  lawyer,
  currentUser,
  activePerson,
  todayAppointments,
  upcomingAppointments,
  recentCases,
  clients,
  pendingRequestsCount,
  totalAppointmentsCount,
  searchQuery,
  onSearchChange,
  onViewAppointment,
  onAcceptAppointment,
  onRejectAppointment,
  onViewCase,
  onAddAppointmentClick,
  onAddClientClick,
  onCreateCaseClick,
  onUploadDocClick,
  onAddLawyerClick,
  onNavigateToSection
}) => {
  const displayAvatar = activePerson?.avatarUrl || currentUser?.avatarUrl || lawyer.avatarUrl;
  const displayName = activePerson?.name || currentUser?.name || lawyer.name;
  const displayRole = activePerson?.role || currentUser?.role || lawyer.title;
  const isClient = activePerson?.personType === 'client' || currentUser?.personType === 'client';
  const firstName = displayName.split(' ')[0] || 'Counsel';

  const filteredTodayAppointments = todayAppointments.filter(
    (apt) =>
      apt.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.caseType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUpcomingAppointments = upcomingAppointments.filter(
    (apt) =>
      apt.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.caseType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      apt.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRecentCases = recentCases.filter(
    (c) =>
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.caseType.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Welcome Banner & Counsel Briefing */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="absolute -right-8 -bottom-8 w-56 h-56 text-white/5 pointer-events-none">
          <Scale className="w-full h-full" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5">
            <button
              type="button"
              onClick={() => onNavigateToSection('Profile')}
              className="relative group shrink-0 cursor-pointer focus:outline-none"
              title="Click to view and edit your profile"
              id="dashboard-header-profile-avatar"
            >
              <ProfileAvatar
                src={displayAvatar}
                name={displayName}
                size="2xl"
                rounded="2xl"
                ring="ring-4 ring-white/20 group-hover:ring-amber-300 shadow-xl transition"
                showBadge
                badgeType={isClient ? 'client' : 'lawyer'}
              />
              <span className="absolute -bottom-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-blue-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-xs pointer-events-none">
                Edit
              </span>
            </button>

            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-[11px] font-medium text-amber-300 border border-white/15 mb-2">
                <Sparkles className="w-3 h-3" />
                <span>
                  {displayRole} • Chambers Docket
                </span>
              </div>

              {/* Explicitly Requested Welcome Message */}
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
                Welcome back, {firstName}!
              </h1>

              <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                You have <span className="text-white font-bold">{todayAppointments.length} appointments</span> scheduled for today and <span className="text-amber-300 font-bold">{pendingRequestsCount} pending requests</span> requiring review.
              </p>

              <div className="flex flex-wrap items-center gap-2.5 mt-3.5">
                <button
                  type="button"
                  onClick={() => onNavigateToSection('LawyersPortal')}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-blue-950 font-bold text-xs shadow-md transition transform active:scale-95"
                >
                  <Scale className="w-3.5 h-3.5" />
                  <span>Open Lawyers Portal</span>
                </button>
                <button
                  type="button"
                  onClick={() => onNavigateToSection('Clients')}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition"
                >
                  <span>Browse 50 Clients</span>
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-3.5 border border-white/15 text-right shrink-0 hidden sm:block">
            <div className="text-[11px] font-mono text-slate-300 uppercase tracking-wider">
              Today's Calendar
            </div>
            <div className="text-lg font-bold text-white font-mono mt-0.5">
              Monday, Sep 21, 2026
            </div>
            <div className="text-[11px] text-emerald-400 font-medium flex items-center justify-end gap-1.5 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Calendar Synced</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Search & Filter Utility */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search appointments by client, case type, or status..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none transition"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium text-slate-500 hidden sm:inline">
            Quick filter:
          </span>
          <button
            type="button"
            onClick={() => onSearchChange(searchQuery === 'Pending' ? '' : 'Pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
              searchQuery === 'Pending'
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
          >
            Pending ({pendingRequestsCount})
          </button>
          <button
            type="button"
            onClick={() => onSearchChange(searchQuery === 'Confirmed' ? '' : 'Confirmed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition border ${
              searchQuery === 'Confirmed'
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
            }`}
          >
            Confirmed
          </button>
        </div>
      </div>

      {/* 5 Key Metric Cards */}
      <StatCards
        totalAppointments={totalAppointmentsCount}
        todaysAppointments={todayAppointments.length}
        activeCases={recentCases.length}
        totalClients={clients.length}
        pendingRequests={pendingRequestsCount}
        onFilterClick={(filterType) => {
          if (filterType === 'pending_requests') onNavigateToSection('Appointments');
          if (filterType === 'todays_appointments') onNavigateToSection('Appointments');
          if (filterType === 'active_cases') onNavigateToSection('Cases');
          if (filterType === 'total_clients') onNavigateToSection('Clients');
          if (filterType === 'total_appointments') onNavigateToSection('Appointments');
        }}
      />

      {/* Quick Actions Bar */}
      <QuickActions
        onOpenLawyersPortal={() => onNavigateToSection('LawyersPortal')}
        onAddAppointment={onAddAppointmentClick}
        onAddClient={onAddClientClick}
        onCreateCase={onCreateCaseClick}
        onUploadDocument={onUploadDocClick}
        onAddLawyer={onAddLawyerClick}
        onViewAnalytics={() => onNavigateToSection('Analytics')}
      />

      {/* Today's Appointments Section */}
      <section id="todays-appointments">
        <TodaysAppointments
          appointments={filteredTodayAppointments}
          onViewAppointment={onViewAppointment}
          onAcceptAppointment={onAcceptAppointment}
          onRejectAppointment={onRejectAppointment}
          onAddNewClick={onAddAppointmentClick}
        />
      </section>

      {/* Upcoming Appointments Section */}
      <section id="upcoming-appointments">
        <UpcomingAppointments
          appointments={filteredUpcomingAppointments}
          onViewDetails={onViewAppointment}
        />
      </section>

      {/* Recent Cases Section */}
      <section id="recent-cases">
        <RecentCases
          cases={filteredRecentCases}
          onViewCase={onViewCase}
          onCreateCaseClick={onCreateCaseClick}
        />
      </section>
    </div>
  );
};
