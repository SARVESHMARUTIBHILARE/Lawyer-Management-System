import React, { useState } from 'react';
import {
  CalendarDays,
  Clock,
  Search,
  Filter,
  Plus,
  Video,
  MapPin,
  CheckCircle2,
  XCircle,
  Eye,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { Appointment } from '../../../types/dashboard';
import { ProfileAvatar } from '../ProfileAvatar';

interface AppointmentsSectionProps {
  todayAppointments: Appointment[];
  upcomingAppointments: Appointment[];
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
  onViewDetails: (apt: Appointment) => void;
  onAddNew: () => void;
}

export const AppointmentsSection: React.FC<AppointmentsSectionProps> = ({
  todayAppointments,
  upcomingAppointments,
  onAccept,
  onReject,
  onViewDetails,
  onAddNew
}) => {
  const [filterTab, setFilterTab] = useState<'All' | 'Today' | 'Upcoming' | 'Pending' | 'Confirmed'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const allAppointments = [...todayAppointments, ...upcomingAppointments];

  // Filtering
  const filteredAppointments = allAppointments.filter((apt) => {
    // Tab filter
    if (filterTab === 'Today' && apt.date !== 'Today') return false;
    if (filterTab === 'Upcoming' && apt.date === 'Today') return false;
    if (filterTab === 'Pending' && apt.status !== 'Pending') return false;
    if (filterTab === 'Confirmed' && apt.status !== 'Confirmed') return false;

    // Search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = apt.clientName.toLowerCase().includes(q);
      const matchCase = apt.caseType.toLowerCase().includes(q);
      const matchType = apt.appointmentType.toLowerCase().includes(q);
      const matchStatus = apt.status.toLowerCase().includes(q);
      return matchName || matchCase || matchType || matchStatus;
    }
    return true;
  });

  const pendingCount = allAppointments.filter((a) => a.status === 'Pending').length;
  const todayCount = todayAppointments.length;
  const confirmedCount = allAppointments.filter((a) => a.status === 'Confirmed').length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase tracking-wider mb-1">
            <CalendarDays className="w-4 h-4" />
            <span>Chambers Calendar & Consultation Dockets</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Appointments Management
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Review, confirm, and manage client consultations, court hearing preparations, and pre-trial depositions.
          </p>
        </div>

        <button
          type="button"
          onClick={onAddNew}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-semibold text-xs shadow-sm transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule New Appointment</span>
        </button>
      </div>

      {/* Mini Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Total Dockets</span>
          <p className="text-xl font-extrabold text-slate-900 mt-0.5">{allAppointments.length}</p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Today's Sessions</span>
          <p className="text-xl font-extrabold text-blue-900 mt-0.5">{todayCount}</p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Pending Approval</span>
          <p className="text-xl font-extrabold text-amber-600 mt-0.5">{pendingCount}</p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Confirmed</span>
          <p className="text-xl font-extrabold text-emerald-600 mt-0.5">{confirmedCount}</p>
        </div>
      </div>

      {/* Search & Tabs */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Tab buttons */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
            {(['All', 'Today', 'Upcoming', 'Pending', 'Confirmed'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setFilterTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  filterTab === tab
                    ? 'bg-white text-blue-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab}
                {tab === 'Pending' && pendingCount > 0 && (
                  <span className="ml-1.5 px-1.5 py-0.2 bg-amber-500 text-white rounded-full text-[10px] font-bold">
                    {pendingCount}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by client or matter..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none transition"
            />
          </div>
        </div>

        {/* Appointments List */}
        {filteredAppointments.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
            <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-bold text-slate-700">No appointments found</p>
            <p className="text-xs text-slate-500 mt-1">Try changing your filter or search query.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredAppointments.map((apt) => (
              <div
                key={apt.id}
                className="py-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:bg-slate-50/60 p-2 rounded-xl transition"
              >
                {/* Left: Client & Time Details */}
                <div className="flex items-start gap-3.5">
                  <div className="relative shrink-0">
                    <ProfileAvatar
                      src={apt.clientAvatar}
                      name={apt.clientName}
                      size="md"
                      rounded="full"
                      ring="ring-1 ring-slate-200"
                      badgeType="client"
                    />
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${
                        apt.status === 'Confirmed'
                          ? 'bg-emerald-500'
                          : apt.status === 'Pending'
                          ? 'bg-amber-500'
                          : 'bg-rose-500'
                      }`}
                    />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-bold text-slate-900">{apt.clientName}</h3>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          apt.status === 'Confirmed'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : apt.status === 'Pending'
                            ? 'bg-amber-100 text-amber-900 border border-amber-200'
                            : 'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}
                      >
                        {apt.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 mt-1">
                      <span className="font-semibold text-slate-800">{apt.caseType}</span>
                      {apt.caseId && <span className="font-mono text-slate-600">{apt.caseId}</span>}
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-600 mt-1">
                      <span className="inline-flex items-center gap-1 font-medium text-slate-700">
                        <Clock className="w-3.5 h-3.5 text-blue-900" />
                        {apt.date} • {apt.time} ({apt.duration})
                      </span>
                      <span className="inline-flex items-center gap-1 text-slate-600">
                        {apt.appointmentType.includes('Video') ? (
                          <Video className="w-3.5 h-3.5 text-indigo-600" />
                        ) : (
                          <MapPin className="w-3.5 h-3.5 text-slate-600" />
                        )}
                        {apt.roomOrLink || apt.appointmentType}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                  <button
                    type="button"
                    onClick={() => onViewDetails(apt)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold inline-flex items-center gap-1 transition"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Dossier</span>
                  </button>

                  {apt.status === 'Pending' && (
                    <>
                      <button
                        type="button"
                        onClick={() => onAccept(apt.id)}
                        className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold inline-flex items-center gap-1 transition"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Accept</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onReject(apt.id)}
                        className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold inline-flex items-center gap-1 transition"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Decline</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
