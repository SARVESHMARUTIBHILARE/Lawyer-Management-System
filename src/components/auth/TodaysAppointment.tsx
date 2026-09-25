import React from 'react';
import {
  CalendarClock,
  Clock,
  Eye,
  Check,
  X,
  Video,
  MapPin,
  ExternalLink,
  ChevronRight,
  Briefcase
} from 'lucide-react';
import { Appointment } from '../../types/dashboard';

interface TodaysAppointmentsProps {
  appointments: Appointment[];
  onViewAppointment: (appointment: Appointment) => void;
  onAcceptAppointment: (appointmentId: string) => void;
  onRejectAppointment: (appointmentId: string) => void;
  onAddNewClick: () => void;
}

export const TodaysAppointments: React.FC<TodaysAppointmentsProps> = ({
  appointments,
  onViewAppointment,
  onAcceptAppointment,
  onRejectAppointment,
  onAddNewClick
}) => {
  const getStatusBadge = (status: Appointment['status']) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Pending':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'In Progress':
        return 'bg-blue-50 text-blue-700 border-blue-200 animate-pulse';
      case 'Rejected':
        return 'bg-rose-50 text-rose-700 border-rose-200 line-through';
      case 'Completed':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden">
      {/* Section Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-slate-50/70 to-white">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-900 text-white shadow-xs">
            <CalendarClock className="w-4 h-4 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900">
                Today's Appointments
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-900">
                {appointments.length} Scheduled
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Client consultations, client intakes, and hearing briefings for today
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onAddNewClick}
          className="text-xs font-semibold text-blue-900 hover:text-blue-950 bg-blue-50 hover:bg-blue-100/80 px-3 py-1.5 rounded-lg border border-blue-200/80 transition flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <span>+ Schedule Appointment</span>
        </button>
      </div>

      {/* Appointments List / Table */}
      {appointments.length === 0 ? (
        <div className="p-8 text-center text-slate-400">
          <CalendarClock className="w-10 h-10 mx-auto mb-2 opacity-50" />
          <p className="text-xs font-medium">No appointments scheduled for today.</p>
        </div>
      ) : (
        <div className="divide-y divide-slate-100">
          {appointments.map((apt) => (
            <div
              key={apt.id}
              className="p-4 sm:p-5 hover:bg-slate-50/70 transition-colors flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              {/* Client Info & Time */}
              <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                <div className="relative shrink-0">
                  {apt.clientAvatar ? (
                    <img
                      src={apt.clientAvatar}
                      alt={apt.clientName}
                      className="w-11 h-11 rounded-full object-cover ring-1 ring-slate-200"
                    />
                  ) : (
                    <div className="w-11 h-11 rounded-full bg-blue-100 text-blue-900 font-bold flex items-center justify-center text-sm">
                      {apt.clientName.charAt(0)}
                    </div>
                  )}
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-blue-900 ring-2 ring-white" />
                </div>

                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-slate-900 truncate">
                      {apt.clientName}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getStatusBadge(
                        apt.status
                      )}`}
                    >
                      {apt.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 sm:gap-3 text-xs text-slate-500 mt-1 flex-wrap">
                    <span className="flex items-center gap-1 font-mono font-bold text-blue-900 bg-blue-50 px-2 py-0.5 rounded">
                      <Clock className="w-3 h-3 text-blue-700" />
                      {apt.time} ({apt.duration})
                    </span>

                    <span className="flex items-center gap-1 text-slate-600">
                      <Briefcase className="w-3 h-3 text-slate-400" />
                      <span className="truncate max-w-[180px] sm:max-w-[260px] font-medium text-slate-800">
                        {apt.caseType}
                      </span>
                    </span>

                    {apt.roomOrLink && (
                      <span className="flex items-center gap-1 text-[11px] text-slate-600 font-mono">
                        {apt.appointmentType === 'Video Consultation' ? (
                          <Video className="w-3 h-3 text-indigo-500" />
                        ) : (
                          <MapPin className="w-3 h-3 text-emerald-600" />
                        )}
                        <span className="truncate max-w-[140px]">{apt.roomOrLink}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons: View, Accept, Reject */}
              <div className="flex items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 self-end sm:self-auto">
                {/* View Button */}
                <button
                  type="button"
                  onClick={() => onViewAppointment(apt)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white hover:bg-slate-100 border border-slate-200 shadow-2xs transition flex items-center gap-1.5 cursor-pointer"
                  title="View appointment details and client dossier"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  <span>View</span>
                </button>

                {/* Accept Button */}
                {apt.status !== 'Confirmed' && (
                  <button
                    type="button"
                    onClick={() => onAcceptAppointment(apt.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition flex items-center gap-1.5 cursor-pointer"
                    title="Accept and confirm appointment"
                  >
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Accept</span>
                  </button>
                )}

                {/* Reject Button */}
                {apt.status !== 'Rejected' && (
                  <button
                    type="button"
                    onClick={() => onRejectAppointment(apt.id)}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition flex items-center gap-1.5 cursor-pointer"
                    title="Reject or decline appointment"
                  >
                    <X className="w-3.5 h-3.5 text-rose-600" />
                    <span>Reject</span>
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
