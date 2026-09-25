import React from 'react';
import { CalendarPlus, UserPlus, FolderPlus, FileUp, Sparkles, ChevronRight, Scale, BarChart3 } from 'lucide-react';

interface QuickActionsProps {
  onAddAppointment: () => void;
  onAddClient: () => void;
  onCreateCase: () => void;
  onUploadDocument: () => void;
  onAddLawyer?: () => void;
  onViewAnalytics?: () => void;
  onOpenLawyersPortal?: () => void;
}

export const QuickActions: React.FC<QuickActionsProps> = ({
  onAddAppointment,
  onAddClient,
  onCreateCase,
  onUploadDocument,
  onAddLawyer,
  onViewAnalytics,
  onOpenLawyersPortal
}) => {
  const actions = [
    ...(onOpenLawyersPortal
      ? [
          {
            id: 'lawyers_portal',
            label: 'Lawyers Portal',
            description: 'Access counsel cockpit, intake reviews, conflict audits & timesheets',
            icon: Scale,
            color: 'bg-gradient-to-r from-blue-900 to-indigo-900 text-white hover:from-blue-950 hover:to-indigo-950 shadow-xs',
            iconBg: 'bg-white/10 text-amber-300',
            onClick: onOpenLawyersPortal
          }
        ]
      : []),
    {
      id: 'add_appointment',
      label: 'Add Appointment',
      description: 'Schedule a new client consultation or deposition prep',
      icon: CalendarPlus,
      color: 'bg-blue-900 text-white hover:bg-blue-950',
      iconBg: 'bg-white/10 text-amber-300',
      onClick: onAddAppointment
    },
    {
      id: 'add_client',
      label: 'Add Client',
      description: 'Onboard an individual or corporate legal client',
      icon: UserPlus,
      color: 'bg-white text-slate-800 hover:bg-slate-50 border border-slate-200 hover:border-slate-300',
      iconBg: 'bg-blue-50 text-blue-900',
      onClick: onAddClient
    },
    {
      id: 'create_case',
      label: 'Create Case',
      description: 'Open a new litigation matter or regulatory proceeding',
      icon: FolderPlus,
      color: 'bg-white text-slate-800 hover:bg-slate-50 border border-slate-200 hover:border-slate-300',
      iconBg: 'bg-indigo-50 text-indigo-700',
      onClick: onCreateCase
    },
    {
      id: 'upload_document',
      label: 'Upload Document',
      description: 'Store pleadings, evidence affidavits, or fee agreements',
      icon: FileUp,
      color: 'bg-white text-slate-800 hover:bg-slate-50 border border-slate-200 hover:border-slate-300',
      iconBg: 'bg-emerald-50 text-emerald-700',
      onClick: onUploadDocument
    },
    ...(onAddLawyer
      ? [
          {
            id: 'add_lawyer',
            label: 'Add Lawyer',
            description: 'Register a new practicing attorney with photo to firm roster',
            icon: Scale,
            color: 'bg-white text-slate-800 hover:bg-slate-50 border border-slate-200 hover:border-slate-300',
            iconBg: 'bg-amber-50 text-amber-800',
            onClick: onAddLawyer
          }
        ]
      : []),
    ...(onViewAnalytics
      ? [
          {
            id: 'analytics_reports',
            label: 'Analytics & Reports',
            description: 'Generate certified PDF dossiers, audit spreadsheets & telemetry',
            icon: BarChart3,
            color: 'bg-white text-slate-800 hover:bg-slate-50 border border-slate-200 hover:border-slate-300',
            iconBg: 'bg-blue-50 text-blue-900',
            onClick: onViewAnalytics
          }
        ]
      : [])
  ];

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl p-4.5 shadow-2xs">
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-50 text-blue-900 border border-blue-100">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Quick Actions
            </h2>
            <p className="text-[11px] text-slate-500">
              Immediate legal workflow and intake triggers
            </p>
          </div>
        </div>
        <span className="text-[10px] font-mono font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
          One-Click Actions
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <button
              key={action.id}
              type="button"
              onClick={action.onClick}
              className={`p-3 rounded-xl flex items-center justify-between text-left transition-all duration-150 group cursor-pointer shadow-2xs hover:shadow-xs ${action.color}`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg shrink-0 ${action.iconBg}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold leading-tight">
                    {action.label}
                  </div>
                  <div className="text-[10px] opacity-75 line-clamp-1 mt-0.5 font-normal">
                    {action.description}
                  </div>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all shrink-0 ml-1" />
            </button>
          );
        })}
      </div>
    </div>
  );
};
