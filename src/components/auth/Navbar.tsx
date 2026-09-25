import React, { useState, useRef, useEffect } from 'react';
import {
  Scale,
  Bell,
  Settings,
  LogOut,
  Menu,
  X,
  CheckCircle2,
  Calendar,
  Shield,
  Clock,
  Briefcase,
  ChevronDown,
  User,
  Users,
  ShieldCheck,
  Sparkles,
  ArrowRightLeft,
  Code2
} from 'lucide-react';
import {
  LawyerProfile,
  DashboardNotification,
  AuthUser,
  PersonProfile,
  NavItemKey
} from '../../types/dashboard';
import { ProfileAvatar } from './ProfileAvatar';

interface NavbarProps {
  lawyer: LawyerProfile;
  currentUser?: AuthUser | null;
  activePerson?: PersonProfile | null;
  allPersons?: PersonProfile[];
  onSwitchPerson?: (person: PersonProfile) => void;
  notifications: DashboardNotification[];
  onOpenSettings: () => void;
  onLogoutClick: () => void;
  onToggleSidebar: () => void;
  isSidebarOpen: boolean;
  onMarkNotificationsRead: () => void;
  onSelectNav?: (item: NavItemKey) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lawyer,
  currentUser,
  activePerson,
  allPersons = [],
  onSwitchPerson,
  notifications,
  onOpenSettings,
  onLogoutClick,
  onToggleSidebar,
  isSidebarOpen,
  onMarkNotificationsRead,
  onSelectNav
}) => {
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showAccountMenu, setShowAccountMenu] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const notifRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifMenu(false);
      }
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setShowAccountMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Display details for active identity
  const displayName = activePerson?.name || currentUser?.name || lawyer.name;
  const displayRole = activePerson?.role || currentUser?.role || lawyer.title;
  const displayAvatar = activePerson?.avatarUrl || currentUser?.avatarUrl || lawyer.avatarUrl;
  const displayEmail = activePerson?.email || currentUser?.email || lawyer.email;
  const isClient = activePerson?.personType === 'client' || currentUser?.personType === 'client';

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/90 shadow-2xs backdrop-blur-md bg-white/95">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Left: Mobile Toggle & Brand */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition"
              aria-label="Toggle Navigation Menu"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <button
              type="button"
              onClick={() => onSelectNav && onSelectNav('Dashboard')}
              className="flex items-center gap-2.5 text-left group transition cursor-pointer"
              title="Go to Dashboard - JurisPulse"
            >
              <div className="w-9 h-9 rounded-lg bg-blue-900 flex items-center justify-center text-amber-400 shadow-sm group-hover:scale-105 transition">
                <Scale className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold tracking-tight text-slate-900 leading-none group-hover:text-blue-900 transition">
                    Juris<span className="text-blue-900">Pulse</span>
                  </span>
                  <span className="hidden xl:inline-block text-[10px] font-semibold text-blue-900 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                    Lawyer & Client Management System
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
                  AI-Powered Legal Practice & Isolated Profiles
                </span>
              </div>
            </button>
          </div>

          {/* Center/Active Person Badge */}
          <div className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100/90 border border-slate-200 text-xs text-slate-700">
            <span
              className={`w-2 h-2 rounded-full ${
                isClient ? 'bg-amber-500' : 'bg-emerald-500'
              } animate-pulse`}
            />
            <span className="font-semibold text-slate-900">{displayName}</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-500 text-[11px] truncate max-w-[140px]">
              {displayRole}
            </span>
          </div>

          {/* Right: Controls & Person Account Menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={() => onSelectNav && onSelectNav('LawyersPortal')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-900 text-amber-300 hover:bg-blue-800 transition shadow-xs"
              title="Open Lawyers Portal & Chambers Workstation"
            >
              <Scale className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Lawyers Portal</span>
              <span className="sm:hidden">Portal</span>
            </button>

            {/* Notifications Popover */}
            <div className="relative" ref={notifRef}>
              <button
                type="button"
                onClick={() => {
                  setShowNotifMenu(!showNotifMenu);
                  if (!showNotifMenu && unreadCount > 0) {
                    onMarkNotificationsRead();
                  }
                }}
                className="relative p-2 text-slate-600 hover:text-blue-900 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                title="Notifications"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] font-bold flex items-center justify-center ring-2 ring-white">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifMenu && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-slate-900">Notifications</span>
                      <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-1.5 py-0.2 rounded-full">
                        {notifications.length}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={onMarkNotificationsRead}
                      className="text-[11px] text-blue-800 hover:text-blue-900 font-medium cursor-pointer"
                    >
                      Mark all as read
                    </button>
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                    {notifications.map((notif) => (
                      <button
                        key={notif.id}
                        type="button"
                        onClick={() => {
                          setShowNotifMenu(false);
                          if (onSelectNav) {
                            if (notif.type === 'appointment') onSelectNav('Appointments');
                            else if (notif.type === 'case') onSelectNav('Cases');
                            else if (notif.type === 'payment') onSelectNav('Payments');
                            else onSelectNav('Dashboard');
                          }
                        }}
                        className={`w-full p-3 text-left hover:bg-slate-50 transition cursor-pointer ${
                          !notif.read ? 'bg-blue-50/40' : ''
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-semibold text-slate-900 leading-snug">
                            {notif.title}
                          </p>
                          <span className="text-[10px] text-slate-600 font-mono shrink-0">
                            {notif.timeAgo}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                          {notif.message}
                        </p>
                      </button>
                    ))}
                  </div>

                  <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/70 text-center">
                    <span className="text-[11px] text-slate-600">
                      Click any notification to navigate to its docket section
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Settings Icon */}
            <button
              type="button"
              onClick={onOpenSettings}
              className="p-2 text-slate-600 hover:text-blue-900 hover:bg-slate-100 rounded-lg transition cursor-pointer"
              title="Practice & Appointment Settings"
              aria-label="Settings"
            >
              <Settings className="w-5 h-5" />
            </button>

            <div className="h-6 w-px bg-slate-200 mx-0.5" />

            {/* PERSON PROFILE & ACCOUNT SWITCHER MENU */}
            <div className="relative" ref={accountRef}>
              <button
                type="button"
                onClick={() => setShowAccountMenu(!showAccountMenu)}
                className="flex items-center gap-2 pl-1 py-1 pr-2 rounded-xl hover:bg-slate-100 transition group text-left cursor-pointer border border-transparent hover:border-slate-200"
                title="View your personal profile or switch accounts"
              >
                <div className="relative">
                  <ProfileAvatar
                    src={displayAvatar}
                    name={displayName}
                    size="sm"
                    rounded="full"
                    ring="ring-2 ring-blue-900/20 group-hover:ring-blue-900 transition"
                    showBadge
                    badgeType={isClient ? 'client' : 'online'}
                  />
                </div>

                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-900 leading-tight group-hover:text-blue-900 transition flex items-center gap-1">
                    {displayName}
                    <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-blue-900 transition" />
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium truncate max-w-[120px]">
                    {displayRole}
                  </span>
                </div>
              </button>

              {/* Account & Profile Menu Dropdown */}
              {showAccountMenu && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  {/* Current Active Person Card */}
                  <div className="px-4 pb-3 border-b border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                        Active Personal Session
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isClient
                            ? 'bg-amber-100 text-amber-900'
                            : 'bg-emerald-100 text-emerald-900'
                        }`}
                      >
                        {isClient ? 'Client Profile' : 'Attorney Profile'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <ProfileAvatar
                        src={displayAvatar}
                        name={displayName}
                        size="lg"
                        rounded="full"
                        ring="ring-2 ring-blue-900/20"
                        showBadge
                        badgeType={isClient ? 'client' : 'lawyer'}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">
                          {displayName}
                        </p>
                        <p className="text-xs text-slate-500 truncate">{displayEmail}</p>
                        <p className="text-[11px] text-blue-900 font-medium truncate mt-0.5">
                          {displayRole}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setShowAccountMenu(false);
                        if (onSelectNav) onSelectNav('Profile');
                      }}
                      className="mt-3 w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Manage My Own Profile</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowAccountMenu(false);
                        if (onSelectNav) onSelectNav('Team');
                      }}
                      className="mt-1.5 w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition shadow-xs cursor-pointer border border-slate-200"
                    >
                      <Code2 className="w-3.5 h-3.5 text-blue-900" />
                      <span>Developer & Team Profiles</span>
                    </button>
                  </div>

                  {/* Quick Switch Person (Isolated Accounts) */}
                  <div className="px-4 py-2.5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                        <ArrowRightLeft className="w-3 h-3 text-slate-400" />
                        Switch to Another Person's Profile
                      </span>
                      <span className="text-[10px] text-slate-400">Strictly Isolated</span>
                    </div>

                    <div className="max-h-56 overflow-y-auto space-y-1 pr-1">
                      {allPersons.map((p) => {
                        const isCurrent =
                          p.email.toLowerCase() === displayEmail.toLowerCase() ||
                          p.id === activePerson?.id;
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => {
                              setShowAccountMenu(false);
                              if (onSwitchPerson) onSwitchPerson(p);
                            }}
                            className={`w-full flex items-center justify-between p-2 rounded-xl text-left text-xs transition cursor-pointer ${
                              isCurrent
                                ? 'bg-blue-50 border border-blue-200'
                                : 'hover:bg-slate-50 border border-transparent'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <ProfileAvatar
                                src={p.avatarUrl}
                                name={p.name}
                                size="xs"
                                rounded="full"
                                badgeType={p.personType === 'client' ? 'client' : 'lawyer'}
                              />
                              <div className="min-w-0">
                                <p
                                  className={`font-bold truncate ${
                                    isCurrent ? 'text-blue-900' : 'text-slate-900'
                                  }`}
                                >
                                  {p.name}
                                </p>
                                <p className="text-[10px] text-slate-500 truncate">
                                  {p.role}
                                </p>
                              </div>
                            </div>

                            <span
                              className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md shrink-0 ${
                                p.personType === 'client'
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-slate-100 text-slate-700'
                              }`}
                            >
                              {p.personType === 'client' ? 'Client' : 'Attorney'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Menu Footer / Sign Out */}
                  <div className="px-4 pt-2 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-500 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      Individual identity vaults
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAccountMenu(false);
                        onLogoutClick();
                      }}
                      className="text-xs font-semibold text-rose-700 hover:text-rose-800 flex items-center gap-1.5 cursor-pointer py-1 px-2 rounded-lg hover:bg-rose-50 transition"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Direct Logout Button */}
            <button
              type="button"
              onClick={onLogoutClick}
              className="ml-1 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition cursor-pointer"
              title="Logout from active session"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
