import React from 'react';
import { Calendar, Clock, Video, MapPin, ChevronRight, User } from 'lucide-react';
import { Appointment } from '../../types/dashboard';

interface UpcomingAppointmentsProps {
  appointments: Appointment[];
  onViewDetails?: (appointment: Appointment) => void;
}

export const UpcomingAppointments: React.FC<UpcomingAppointmentsProps> = ({
  appointments,
  onViewDetails
}) => {
  const getStatusBadge = (status: Appointment['status']) => {
    switch (status) {
      case 'Confirmed':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Pending':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50/70 to-white">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-blue-50 text-blue-900 border border-blue-100">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Upcoming Appointments</h2>
            <p className="text-xs text-slate-500">Upcoming client hearings, depositions, and consultations</p>
          </div>
        </div>
        <span className="text-[11px] font-mono text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
          Next 7 Days
        </span>
      </div>

      {/* Table / List */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50/90 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
            <tr>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Time</th>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Appointment Type</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {appointments.map((apt) => (
              <tr
                key={apt.id}
                className="hover:bg-slate-50/80 transition group cursor-pointer"
                onClick={() => onViewDetails?.(apt)}
              >
                {/* Date */}
                <td className="px-4 py-3.5 font-semibold text-slate-900 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-blue-900 shrink-0" />
                    <span>{apt.date}</span>
                  </div>
                </td>

                {/* Time */}
                <td className="px-4 py-3.5 font-mono text-slate-600 whitespace-nowrap">
                  <div className="flex items-center gap-1.5 font-medium">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{apt.time}</span>
                  </div>
                </td>

                {/* Client */}
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <div className="flex items-center gap-2.5">
                    {apt.clientAvatar ? (
                      <img
                        src={apt.clientAvatar}
                        alt={apt.clientName}
                        className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
                      />
                    ) : (
                      <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-[10px]">
                        <User className="w-3.5 h-3.5 text-slate-500" />
                      </div>
                    )}
                    <div>
                      <span className="font-semibold text-slate-900 group-hover:text-blue-900 transition">
                        {apt.clientName}
                      </span>
                      <span className="block text-[10px] text-slate-600 truncate max-w-[160px]">
                        {apt.caseType}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Appointment Type */}
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <div className="flex items-center gap-1.5 font-medium text-slate-700">
                    {apt.appointmentType.includes('Video') ? (
                      <Video className="w-3.5 h-3.5 text-indigo-500" />
                    ) : (
                      <MapPin className="w-3.5 h-3.5 text-blue-900" />
                    )}
                    <span>{apt.appointmentType}</span>
                  </div>
                </td>

                {/* Status */}
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getStatusBadge(
                      apt.status
                    )}`}
                  >
                    {apt.status}
                  </span>
                </td>

                {/* Action */}
                <td className="px-4 py-3.5 text-right whitespace-nowrap">
                  <span className="text-[11px] font-semibold text-blue-900 group-hover:underline inline-flex items-center gap-0.5">
                    Details <ChevronRight className="w-3 h-3" />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
