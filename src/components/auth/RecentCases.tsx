import React from 'react';
import { Briefcase, Clock, ShieldCheck, ChevronRight, Scale, ExternalLink } from 'lucide-react';
import { LegalCase } from '../../types/dashboard';

interface RecentCasesProps {
  cases: LegalCase[];
  onViewCase?: (c: LegalCase) => void;
  onCreateCaseClick: () => void;
}

export const RecentCases: React.FC<RecentCasesProps> = ({
  cases,
  onViewCase,
  onCreateCaseClick
}) => {
  const getCaseStatusBadge = (status: LegalCase['caseStatus']) => {
    switch (status) {
      case 'Active':
        return 'bg-blue-50 text-blue-900 border-blue-200';
      case 'Discovery':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Pre-Trial':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'In Review':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'Closed':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-2xs overflow-hidden">
      {/* Header */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50/70 to-white">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-slate-900 text-amber-400">
            <Briefcase className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">Recent Cases</h2>
            <p className="text-xs text-slate-500">
              Active litigation dockets and client representation matters
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onCreateCaseClick}
          className="text-xs font-semibold text-blue-900 hover:text-blue-950 bg-blue-50 hover:bg-blue-100/80 px-3 py-1.5 rounded-lg border border-blue-200/80 transition flex items-center gap-1.5 cursor-pointer"
        >
          <span>+ Create Case</span>
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs text-slate-700">
          <thead className="bg-slate-50/90 text-slate-500 uppercase text-[10px] font-bold tracking-wider border-b border-slate-200">
            <tr>
              <th className="px-4 py-3">Case ID</th>
              <th className="px-4 py-3">Client Name</th>
              <th className="px-4 py-3">Case Type & Title</th>
              <th className="px-4 py-3">Case Status</th>
              <th className="px-4 py-3">Last Updated</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {cases.map((c) => (
              <tr
                key={c.id}
                onClick={() => onViewCase?.(c)}
                className="hover:bg-slate-50/80 transition group cursor-pointer"
              >
                {/* Case ID */}
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <span className="font-mono font-bold text-xs text-blue-900 bg-blue-50/80 px-2 py-1 rounded border border-blue-100">
                    {c.id}
                  </span>
                </td>

                {/* Client Name */}
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <span className="font-semibold text-slate-900 group-hover:text-blue-900 transition">
                    {c.clientName}
                  </span>
                </td>

                {/* Case Type & Title */}
                <td className="px-4 py-3.5">
                  <div>
                    <span className="font-medium text-slate-800 line-clamp-1">
                      {c.title}
                    </span>
                    <span className="text-[11px] text-slate-600 block mt-0.5">
                      {c.caseType} {c.courtJurisdiction ? `• ${c.courtJurisdiction}` : ''}
                    </span>
                  </div>
                </td>

                {/* Case Status */}
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${getCaseStatusBadge(
                      c.caseStatus
                    )}`}
                  >
                    {c.caseStatus}
                  </span>
                </td>

                {/* Last Updated */}
                <td className="px-4 py-3.5 whitespace-nowrap">
                  <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[11px]">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span>{c.lastUpdated}</span>
                  </div>
                </td>

                {/* Action */}
                <td className="px-4 py-3.5 text-right whitespace-nowrap">
                  <span className="text-[11px] font-semibold text-blue-900 group-hover:underline inline-flex items-center gap-0.5">
                    Docket <ChevronRight className="w-3 h-3" />
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
