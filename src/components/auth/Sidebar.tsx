import React from 'react';
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  Briefcase,
  MessageSquare,
  FileText,
  CreditCard,
  UserCheck,
  ChevronRight,
  ShieldAlert,
  Clock,
  Scale,
  Database,
  BarChart3,
  Code2,
  GraduationCap
} from 'lucide-react';
import { NavItemKey } from '../../types/dashboard';

export type { NavItemKey };

interface SidebarProps {
  activeNav: NavItemKey;
  onSelectNav: (item: NavItemKey) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  pendingAppointmentsCount: number;
  activeCasesCount: number;
  totalClientsCount: number;
  databaseRecordsCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeNav,
  onSelectNav,
  isOpenMobile,
  onCloseMobile,
  pendingAppointmentsCount,
  activeCasesCount,
  totalClientsCount,
  databaseRecordsCount
}) => {
  const navItems: {
    key: NavItemKey;
    label: string;
    icon: React.FC<{ className?: string }>;
    badge?: string | number;
    badgeColor?: string;
  }[] = [
    { key: 'Dashboard', label: 'Dashboard', icon: LayoutDashboard },
    {
      key: 'LawyersPortal',
      label: 'Lawyers Portal',
      icon: Scale,
      badge: '50 Lawyers',
      badgeColor: 'bg-blue-100 text-blue-900 border border-blue-200 font-semibold'
    },
    {
      key: 'Appointments',
      label: 'Appointments',
      icon: CalendarDays,
      badge: pendingAppointmentsCount > 0 ? `${pendingAppointmentsCount} New` : undefined,
      badgeColor: 'bg-blue-900 text-white'
    },
    {
      key: 'Clients',
      label: 'Clients',
      icon: Users,
      badge: totalClientsCount > 0 ? totalClientsCount : undefined,
      badgeColor: 'bg-slate-200 text-slate-700'
    },
    {
      key: 'Cases',
      label: 'Cases',
      icon: Briefcase,
      badge: activeCasesCount > 0 ? `${activeCasesCount}` : undefined,
      badgeColor: 'bg-slate-200 text-slate-700'
    },
    { key: 'Messages', label: 'Messages', icon: MessageSquare, badge: '2', badgeColor: 'bg-emerald-600 text-white' },
    { key: 'Documents', label: 'Documents', icon: FileText },
    { key: 'Payments', label: 'Payments', icon: CreditCard },
    {
      key: 'Analytics',
      label: 'Analytics & Reports',
      icon: BarChart3,
      badge: 'Live',
      badgeColor: 'bg-emerald-100 text-emerald-800 border border-emerald-300'
    },
    { key: 'Profile', label: 'Profile', icon: UserCheck },
    {
      key: 'Team',
      label: 'Our Team / Devs',
      icon: Code2,
      badge: '5 Devs',
      badgeColor: 'bg-indigo-100 text-indigo-900 border border-indigo-200'
    },
    {
      key: 'PblReport',
      label: 'PBL Report–02',
      icon: GraduationCap,
      badge: 'Mini Project',
      badgeColor: 'bg-purple-100 text-purple-900 border border-purple-200'
    },
    {
      key: 'Database',
      label: 'Database',
      icon: Database,
      badge: databaseRecordsCount ? `${databaseRecordsCount}` : undefined,
      badgeColor: 'bg-amber-100 text-amber-900 border border-amber-300'
    }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-16 bottom-0 left-0 z-40 w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Navigation List */}
        <div className="p-4 space-y-1.5 overflow-y-auto">
          <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-600">
            Practice Management
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.key;

            return (
              <button
                key={item.key}
                type="button"
                onClick={() => {
                  onSelectNav(item.key);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 group cursor-pointer ${
                  isActive
                    ? 'bg-blue-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-blue-900 hover:bg-blue-50/70'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-amber-400' : 'text-slate-600 group-hover:text-blue-900'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : item.badgeColor || 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isActive && <ChevronRight className="w-3.5 h-3.5 text-white/80" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Sidebar Footer / Practice Info */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/70">
          <div className="bg-white border border-slate-200/80 rounded-xl p-3 shadow-2xs">
            <div className="flex items-center gap-2 mb-1.5">
              <div className="p-1 rounded-md bg-blue-100 text-blue-900">
                <Scale className="w-3.5 h-3.5" />
              </div>
              <span className="text-xs font-bold text-slate-800">Direct Chambers</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed mb-2">
              Next scheduled consultation begins in <span className="font-semibold text-blue-900">45 mins</span>.
            </p>
            <div className="flex items-center justify-between text-[10px] text-slate-600 pt-1.5 border-t border-slate-100 font-mono">
              <span>Status: Available</span>
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Online
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
