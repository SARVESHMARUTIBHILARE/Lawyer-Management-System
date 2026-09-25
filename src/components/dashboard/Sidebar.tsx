import React from 'react';
import {
  BarChart3,
  Briefcase,
  CalendarClock,
  FileText,
  CreditCard,
  MessageSquareLock,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  UserCheck,
  UserPlus,
  Send,
  Scale
} from 'lucide-react';
import { UserRole } from '../types';

export type TabType = 'analytics' | 'lawyer_portal' | 'cases' | 'deadlines' | 'documents' | 'billing' | 'messaging' | 'security' | 'client_portal';

interface SidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  unreadMessagesCount: number;
  criticalDeadlinesCount: number;
  pendingRequestsCount?: number;
  onOpenSendRequest?: () => void;
  userRole?: UserRole;
  currentUser?: import('../types').User;
  onLogout?: () => void;
  onOpenLoginPage?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onTabChange,
  unreadMessagesCount,
  criticalDeadlinesCount,
  pendingRequestsCount = 0,
  onOpenSendRequest,
  userRole = 'admin',
  currentUser,
  onLogout,
  onOpenLoginPage
}) => {
  const isClient = userRole === 'client';

  const clientNavigationItems: { id: TabType; label: string; icon: React.FC<{ className?: string }>; badge?: number | string; badgeColor?: string }[] = [
    { id: 'client_portal', label: 'My Matters & Requests', icon: Briefcase, badge: pendingRequestsCount > 0 ? `${pendingRequestsCount} Req` : 'Live', badgeColor: 'bg-emerald-600 text-white' },
    { id: 'documents', label: 'Shared Vault & Evidence', icon: FileText },
    { id: 'messaging', label: 'Counsel Encrypted Chat', icon: MessageSquareLock, badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined, badgeColor: 'bg-blue-500 text-white' },
    { id: 'billing', label: 'Invoices & Statements', icon: CreditCard },
  ];

  const managementItems: { id: TabType; label: string; icon: React.FC<{ className?: string }>; badge?: number | string; badgeColor?: string }[] = [
    { id: 'lawyer_portal', label: 'Main Lawyer Dashboard', icon: Scale, badge: pendingRequestsCount > 0 ? `${pendingRequestsCount} Req` : 'Counsel', badgeColor: 'bg-indigo-600 text-white' },
    { id: 'cases', label: 'Case Management', icon: Briefcase, badge: pendingRequestsCount > 0 ? `${pendingRequestsCount} New` : undefined, badgeColor: 'bg-blue-600 text-white' },
    { id: 'client_portal', label: 'Client Portal (Preview)', icon: UserCheck, badge: 'Client', badgeColor: 'bg-emerald-600 text-white' },
    { id: 'documents', label: 'Client Documents', icon: FileText },
    { id: 'billing', label: 'Billing & Workflows', icon: CreditCard },
  ];

  const analyticsItems: { id: TabType; label: string; icon: React.FC<{ className?: string }>; badge?: number | string; badgeColor?: string }[] = [
    { id: 'analytics', label: 'Firm Productivity', icon: BarChart3 },
    {
      id: 'deadlines',
      label: 'Deadlines & Calendar',
      icon: CalendarClock,
      badge: criticalDeadlinesCount > 0 ? criticalDeadlinesCount : undefined,
      badgeColor: 'bg-red-500 text-white'
    },
    {
      id: 'messaging',
      label: 'Encrypted Portal',
      icon: MessageSquareLock,
      badge: unreadMessagesCount > 0 ? unreadMessagesCount : undefined,
      badgeColor: 'bg-blue-500 text-white'
    },
    { id: 'security', label: 'Security & RBAC', icon: ShieldCheck }
  ];

  return (
    <aside className="w-full lg:w-64 bg-slate-900 text-white shrink-0 flex flex-col justify-between border-r border-slate-800">
      <div>
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center font-extrabold text-sm text-white shadow-xs shrink-0">
                JP
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold tracking-tight text-base text-white">JurisPulse</span>
                  <span className="text-[10px] font-extrabold font-mono bg-blue-500/20 text-blue-300 border border-blue-400/40 px-1 py-0.2 rounded">
                    AI
                  </span>
                </div>
              </div>
            </div>
            {isClient && (
              <span className="text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.5 rounded shrink-0">
                CLIENT
              </span>
            )}
          </div>
          <p className="text-[10px] text-slate-400 font-medium leading-tight mt-1.5">
            AI-Powered Legal Practice Management System
            <span className="block text-[9px] text-slate-500 font-normal mt-0.5">(Lawyer Management System)</span>
          </p>
        </div>

        {/* Client-specific Navigation vs Staff Navigation */}
        {isClient ? (
          <nav className="p-2 space-y-1">
            <div className="text-slate-500 text-[10px] uppercase font-bold px-3 py-2 tracking-wider">
              Client Portal Vault
            </div>
            {clientNavigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-800 text-white border-l-4 border-blue-500'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${item.badgeColor || 'bg-slate-700 text-slate-200'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        ) : (
          <nav className="p-2 space-y-1">
            <div className="text-slate-500 text-[10px] uppercase font-bold px-3 py-2 tracking-wider">Management</div>
            {managementItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-800 text-white border-l-4 border-blue-500'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${item.badgeColor || 'bg-slate-700 text-slate-200'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            <div className="text-slate-500 text-[10px] uppercase font-bold px-3 py-2 pt-4 tracking-wider">Analytics & Governance</div>
            {analyticsItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-slate-800 text-white border-l-4 border-blue-500'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-full ${item.badgeColor || 'bg-slate-700 text-slate-200'}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        )}

        {/* Quick Send Request to Lawyers CTA Box */}
        {onOpenSendRequest && (
          <div className="p-3 mx-2 my-2 bg-slate-800/80 border border-blue-500/30 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[11px] font-bold text-slate-200 flex items-center gap-1.5">
                <UserPlus className="w-3.5 h-3.5 text-blue-400" />
                Legal Consultation
              </span>
              <span className="text-[9px] font-bold px-1.5 py-0.2 bg-blue-500/20 text-blue-300 rounded">
                Direct
              </span>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Submit matter facts, select specific counsel, and attach evidence exhibits.
            </p>
            <button
              onClick={onOpenSendRequest}
              className="w-full py-1.5 px-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition"
            >
              <Send className="w-3 h-3" />
              <span>Send Request to Lawyers</span>
            </button>
          </div>
        )}
      </div>

      {/* User & Security Footer */}
      <div className="p-4 border-t border-slate-800 space-y-3">
        <div className="flex items-center gap-3">
          {currentUser?.avatarUrl ? (
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="w-8 h-8 rounded-full border border-slate-700 object-cover shrink-0"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-xs font-bold text-white shrink-0">
              {currentUser ? currentUser.name.slice(0, 2).toUpperCase() : isClient ? 'CL' : 'SC'}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-white truncate">
              {currentUser?.name || (isClient ? 'External Corporate Client' : 'Sophia Chen, Esq.')}
            </p>
            <p className="text-[11px] text-slate-400 truncate">
              {currentUser?.title || (isClient ? 'Client Portal Scope' : 'Senior Partner (Admin)')}
            </p>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 text-[11px]">
          {onOpenLoginPage && (
            <button
              type="button"
              onClick={onOpenLoginPage}
              className="text-slate-400 hover:text-blue-400 transition cursor-pointer font-medium"
            >
              Switch User
            </button>
          )}
          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="text-slate-400 hover:text-rose-400 transition cursor-pointer font-medium ml-auto"
            >
              Sign Out
            </button>
          )}
        </div>

        <div className={`text-[10px] px-2 py-1 rounded border text-center font-bold tracking-tight uppercase ${
          isClient ? 'bg-amber-950/60 text-amber-400 border-amber-800' : 'bg-emerald-950/60 text-emerald-400 border-emerald-800'
        }`}>
          {isClient ? 'READ-ONLY CLIENT VAULT' : '2FA ENABLED • ENCRYPTED'}
        </div>
      </div>
    </aside>
  );
};
