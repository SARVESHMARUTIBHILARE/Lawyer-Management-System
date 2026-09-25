import React, { useState } from 'react';
import {
  Scale,
  Search,
  ShieldCheck,
  RefreshCw,
  Clock,
  User as UserIcon,
  ChevronDown,
  Bell,
  Lock,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  UserPlus,
  Send,
  LogOut,
  LogIn,
  BarChart3,
  Briefcase,
  CalendarClock,
  FileText,
  CreditCard,
  MessageSquareLock,
  UserCheck,
  Compass,
  Layers,
  Sparkles
} from 'lucide-react';
import { User, UserRole } from '../types';
import { TabType } from './Sidebar';

interface NavbarProps {
  currentUser: User;
  activeRole: UserRole;
  activeTab?: TabType;
  onRoleChange: (role: UserRole) => void;
  onOpenSearch: () => void;
  onOpenSyncModal: () => void;
  onOpenSendRequest?: () => void;
  onNavigateTab?: (tab: TabType) => void;
  onLogout?: () => void;
  onOpenLoginPage?: () => void;
  isTimerRunning: boolean;
  timerSeconds: number;
  onToggleTimer: () => void;
  deviceSyncCount: number;
  twoFactorActive: boolean;
  unreadMessagesCount?: number;
  criticalDeadlinesCount?: number;
  pendingRequestsCount?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentUser,
  activeRole,
  activeTab = 'analytics',
  onRoleChange,
  onOpenSearch,
  onOpenSyncModal,
  onOpenSendRequest,
  onNavigateTab,
  onLogout,
  onOpenLoginPage,
  isTimerRunning,
  timerSeconds,
  onToggleTimer,
  deviceSyncCount,
  twoFactorActive,
  unreadMessagesCount = 0,
  criticalDeadlinesCount = 0,
  pendingRequestsCount = 0
}) => {
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const formatTimer = (totalSec: number) => {
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const roleLabels: Record<UserRole, { label: string; badge: string }> = {
    admin: { label: 'Admin / Managing Partner', badge: 'bg-blue-50 text-blue-700 border-blue-200' },
    partner: { label: 'Senior Partner', badge: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    associate: { label: 'Associate Attorney', badge: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    paralegal: { label: 'Paralegal / Staff', badge: 'bg-amber-50 text-amber-700 border-amber-200' },
    billing_specialist: { label: 'Billing Specialist', badge: 'bg-purple-50 text-purple-700 border-purple-200' },
    client: { label: 'External Client Portal', badge: 'bg-slate-100 text-slate-700 border-slate-200' }
  };

  const isClient = activeRole === 'client';

  // Navigation tab definitions
  const staffTabs: { id: TabType; label: string; icon: React.FC<{ className?: string }>; badge?: number | string; badgeColor?: string }[] = [
    { id: 'lawyer_portal', label: 'Main Lawyer Dashboard', icon: Scale, badge: pendingRequestsCount > 0 ? `${pendingRequestsCount} Req` : 'Counsel', badgeColor: 'bg-indigo-600 text-white' },
    { id: 'analytics', label: 'Firm Analytics', icon: BarChart3 },
    { id: 'cases', label: 'Cases & Matters', icon: Briefcase, badge: pendingRequestsCount > 0 ? `${pendingRequestsCount}` : undefined, badgeColor: 'bg-blue-600 text-white' },
    { id: 'deadlines', label: 'Deadlines & Calendar', icon: CalendarClock, badge: criticalDeadlinesCount > 0 ? `${criticalDeadlinesCount} Due` : undefined, badgeColor: 'bg-rose-600 text-white' },
    { id: 'documents', label: 'Document Vault', icon: FileText },
    { id: 'billing', label: 'Billing & Invoices', icon: CreditCard },
    { id: 'messaging', label: 'Encrypted Chat', icon: MessageSquareLock, badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined, badgeColor: 'bg-blue-600 text-white' },
    { id: 'security', label: 'Security & RBAC', icon: ShieldCheck },
    { id: 'client_portal', label: 'Client Portal View', icon: UserCheck, badge: 'Client', badgeColor: 'bg-emerald-600 text-white' }
  ];

  const clientTabs: { id: TabType; label: string; icon: React.FC<{ className?: string }>; badge?: number | string; badgeColor?: string }[] = [
    { id: 'client_portal', label: 'My Matters & Requests', icon: Briefcase, badge: pendingRequestsCount > 0 ? `${pendingRequestsCount} Req` : 'Live', badgeColor: 'bg-emerald-600 text-white' },
    { id: 'documents', label: 'Shared Vault & Evidence', icon: FileText },
    { id: 'messaging', label: 'Counsel Encrypted Chat', icon: MessageSquareLock, badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined, badgeColor: 'bg-blue-600 text-white' },
    { id: 'billing', label: 'Invoices & Statements', icon: CreditCard }
  ];

  const currentTabs = isClient ? clientTabs : staffTabs;

  const handleTabClick = (tabId: TabType) => {
    if (onNavigateTab) {
      onNavigateTab(tabId);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="bg-white border-b border-slate-200 shrink-0 text-slate-900 shadow-xs z-30 sticky top-0">
      {/* Top Primary Bar */}
      <div className="h-14 flex items-center justify-between px-4 sm:px-6">
        {/* Global Search Bar Input */}
        <div className="flex-1 max-w-md sm:max-w-lg">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
              <Search className="w-4 h-4" />
            </span>
            <button
              onClick={onOpenSearch}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg py-1.5 pl-9 pr-3 text-xs text-left text-slate-500 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between group transition cursor-pointer"
            >
              <span className="truncate">Search case files, client IDs, evidence, billing (⌘K)</span>
              <kbd className="hidden md:inline-flex items-center px-1.5 py-0.5 text-[10px] bg-slate-200 text-slate-600 rounded font-mono">
                ⌘K
              </kbd>
            </button>
          </div>
        </div>

        {/* Header Action Items */}
        <div className="flex items-center gap-2.5 ml-3">
          {/* Active Timer Pill (Only for firm staff, hidden/replaced for clients) */}
          {activeRole === 'client' ? (
            <div className="hidden lg:flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-800 rounded-md px-2.5 py-1 text-xs font-semibold">
              <Lock className="w-3.5 h-3.5 text-amber-600" />
              <span>Read-Only Portal</span>
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1 text-xs text-slate-700">
              <Clock className={`w-3.5 h-3.5 ${isTimerRunning ? 'text-amber-500 animate-pulse' : 'text-slate-400'}`} />
              <span className="font-mono font-bold text-slate-800">{formatTimer(timerSeconds)}</span>
              <button
                onClick={onToggleTimer}
                className={`px-2 py-0.5 rounded text-[10px] font-semibold transition cursor-pointer ${
                  isTimerRunning
                    ? 'bg-rose-100 text-rose-700 border border-rose-200'
                    : 'bg-amber-100 text-amber-800 border border-amber-200'
                }`}
              >
                {isTimerRunning ? 'Stop' : 'Timer'}
              </button>
            </div>
          )}

          {/* Send Request to Lawyers Global Button */}
          {onOpenSendRequest && (
            <button
              onClick={onOpenSendRequest}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1.5 rounded-lg font-bold shadow-xs transition shrink-0 cursor-pointer"
              title="Send legal representation or consultation request to lawyers"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Send Request to Lawyers</span>
              <span className="sm:hidden">Request</span>
            </button>
          )}

          {/* Sync Indicator */}
          <button
            onClick={onOpenSyncModal}
            className="hidden sm:flex items-center gap-1.5 bg-slate-50 border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs px-2.5 py-1.5 rounded-md transition cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="hidden md:inline text-slate-600 font-medium text-[11px]">Live Vault</span>
          </button>

          {/* Role Selector Badge */}
          <div className="relative group">
            <div className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md px-2.5 py-1.5 cursor-pointer text-xs font-semibold text-slate-700 transition">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${roleLabels[activeRole].badge}`}>
                {roleLabels[activeRole].label}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>

            <div className="absolute right-0 mt-1 w-64 bg-white border border-slate-200 rounded-lg shadow-xl p-2 hidden group-hover:block z-50">
              <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 px-2 py-1">
                Switch User Role Scope
              </p>
              {(Object.keys(roleLabels) as UserRole[]).map((role) => (
                <button
                  key={role}
                  onClick={() => onRoleChange(role)}
                  className={`w-full text-left px-2.5 py-2 rounded-md text-xs flex items-center justify-between transition cursor-pointer ${
                    activeRole === role ? 'bg-blue-50 text-blue-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span>{roleLabels[role].label}</span>
                  {activeRole === role && <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* User Profile Avatar with Auth Provider Badge and Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className="flex items-center gap-2 pl-2 border-l border-slate-200 cursor-pointer group focus:outline-none"
              title={`${currentUser.name} (${currentUser.email})`}
            >
              <div className="relative">
                <img
                  src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'}
                  alt={currentUser.name}
                  className="w-8 h-8 rounded-full border border-slate-300 object-cover group-hover:ring-2 group-hover:ring-blue-500 transition"
                />
                {/* Provider Badge on Avatar */}
                {currentUser.authProvider === 'google' ? (
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-white border border-slate-200 shadow-xs flex items-center justify-center p-0.5">
                    <svg className="w-full h-full" viewBox="0 0 24 24">
                      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                    </svg>
                  </span>
                ) : currentUser.authProvider === 'twitter' ? (
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-black border border-zinc-700 shadow-xs flex items-center justify-center p-0.5">
                    <svg className="w-2.5 h-2.5 fill-white" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </span>
                ) : currentUser.authProvider === 'instagram' ? (
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-tr from-purple-600 to-amber-500 shadow-xs flex items-center justify-center p-0.5">
                    <svg className="w-2.5 h-2.5 fill-white" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </span>
                ) : (
                  <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white" />
                )}
              </div>
              <div className="hidden xl:block text-left">
                <p className="text-xs font-bold text-slate-800 leading-tight">{currentUser.name}</p>
                <p className="text-[10px] text-slate-500 leading-tight truncate max-w-[120px]">{currentUser.email}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {/* Profile & Auth Dropdown Menu */}
            {isProfileMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setIsProfileMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-2xl p-3 z-50 animate-fadeIn">
                  <div className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg mb-2 border border-slate-100">
                    <img
                      src={currentUser.avatarUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'}
                      alt={currentUser.name}
                      className="w-10 h-10 rounded-full border border-slate-300 object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 uppercase">
                          {currentUser.role}
                        </span>
                        {currentUser.authProvider && (
                          <span className="text-[9px] font-semibold text-slate-500 flex items-center gap-1">
                            via <span className="capitalize font-bold text-slate-700">{currentUser.authProvider}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    {onOpenLoginPage && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          onOpenLoginPage();
                        }}
                        className="w-full text-left px-2.5 py-2 rounded-lg text-slate-700 hover:bg-slate-50 flex items-center gap-2 transition cursor-pointer font-medium"
                      >
                        <LogIn className="w-3.5 h-3.5 text-blue-600" />
                        <span>Switch / Login Account</span>
                      </button>
                    )}

                    {onLogout && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          onLogout();
                        }}
                        className="w-full text-left px-2.5 py-2 rounded-lg text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition cursor-pointer font-bold border-t border-slate-100 mt-1 pt-2"
                      >
                        <LogOut className="w-3.5 h-3.5 text-rose-500" />
                        <span>Log Out of JurisPulse</span>
                      </button>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Dedicated Quick Log Out Icon Button */}
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
              title="Log Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Primary Section Navigation Tab Bar (CLICK IN NAVIGATION BAR) */}
      <div className="bg-slate-50/80 border-t border-slate-200 px-3 sm:px-6 flex items-center justify-between gap-1 overflow-x-auto text-xs no-scrollbar py-1">
        <div className="flex items-center gap-1 min-w-max">
          <span className="hidden md:inline-flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-slate-400 px-2 py-1 mr-1 border-r border-slate-200 shrink-0">
            <Compass className="w-3 h-3 text-blue-600" />
            <span>Sections</span>
          </span>

          {currentTabs.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleTabClick(item.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md font-semibold transition-all shrink-0 cursor-pointer whitespace-nowrap text-xs ${
                  isActive
                    ? 'bg-blue-600 text-white font-bold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                }`}
                title={`Navigate to ${item.label}`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive
                        ? 'bg-white/25 text-white'
                        : item.badgeColor || 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Quick Scope Indicator */}
        <div className="hidden lg:flex items-center gap-2 text-[11px] text-slate-500 font-medium pl-2 shrink-0">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
          <span>Active View: <strong className="text-slate-800 capitalize">{activeTab.replace('_', ' ')}</strong></span>
        </div>
      </div>
    </header>
  );
};
