import React from 'react';
import {
  CalendarDays,
  CalendarCheck,
  Briefcase,
  Users,
  ClockAlert,
  ArrowUpRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

interface StatCardsProps {
  totalAppointments: number;
  todaysAppointments: number;
  activeCases: number;
  totalClients: number;
  pendingRequests: number;
  onFilterClick?: (filterType: string) => void;
}

export const StatCards: React.FC<StatCardsProps> = ({
  totalAppointments,
  todaysAppointments,
  activeCases,
  totalClients,
  pendingRequests,
  onFilterClick
}) => {
  const cards = [
    {
      id: 'total_appointments',
      title: 'Total Appointments',
      value: totalAppointments,
      subtitle: '+14% vs. previous month',
      icon: CalendarDays,
      iconBg: 'bg-blue-50 text-blue-900 border-blue-100',
      badge: 'All Time',
      badgeBg: 'bg-blue-50 text-blue-800 border-blue-200',
      trendIcon: TrendingUp
    },
    {
      id: 'todays_appointments',
      title: "Today's Appointments",
      value: todaysAppointments,
      subtitle: `${todaysAppointments} scheduled for today`,
      icon: CalendarCheck,
      iconBg: 'bg-indigo-50 text-indigo-700 border-indigo-100',
      badge: 'Active Docket',
      badgeBg: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      trendIcon: ArrowUpRight
    },
    {
      id: 'active_cases',
      title: 'Active Cases',
      value: activeCases,
      subtitle: '24 ongoing litigation matters',
      icon: Briefcase,
      iconBg: 'bg-slate-100 text-slate-800 border-slate-200',
      badge: 'Federal & State',
      badgeBg: 'bg-slate-100 text-slate-700 border-slate-200',
      trendIcon: ArrowUpRight
    },
    {
      id: 'total_clients',
      title: 'Total Clients',
      value: totalClients,
      subtitle: '+5 onboarded this quarter',
      icon: Users,
      iconBg: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      badge: 'Retained',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      trendIcon: TrendingUp
    },
    {
      id: 'pending_requests',
      title: 'Pending Requests',
      value: pendingRequests,
      subtitle: 'Requires counsel intake decision',
      icon: ClockAlert,
      iconBg: 'bg-amber-50 text-amber-800 border-amber-100',
      badge: pendingRequests > 0 ? 'Needs Action' : 'All Clear',
      badgeBg: pendingRequests > 0 ? 'bg-amber-50 text-amber-800 border-amber-200' : 'bg-slate-100 text-slate-700',
      trendIcon: AlertCircle,
      highlight: pendingRequests > 0
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const Trend = card.trendIcon;

        return (
          <div
            key={card.id}
            onClick={() => onFilterClick?.(card.id)}
            className={`bg-white border rounded-2xl p-4.5 shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between cursor-pointer group ${
              card.highlight
                ? 'border-amber-300 ring-1 ring-amber-300/30'
                : 'border-slate-200 hover:border-blue-900/40'
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-xl border ${card.iconBg} group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${card.badgeBg}`}>
                  {card.badge}
                </span>
              </div>

              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {card.title}
              </h3>
              <div className="text-2xl sm:text-3xl font-bold text-slate-900 font-mono tracking-tight mt-1 group-hover:text-blue-900 transition-colors">
                {card.value}
              </div>
            </div>

            <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span className="truncate pr-1">{card.subtitle}</span>
              <Trend className="w-3.5 h-3.5 shrink-0 text-slate-400 group-hover:text-blue-900" />
            </div>
          </div>
        );
      })}
    </div>
  );
};
