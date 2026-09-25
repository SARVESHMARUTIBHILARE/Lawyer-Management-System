import React, { useState } from 'react';
import {
  Briefcase,
  Search,
  Plus,
  Scale,
  Calendar,
  Building,
  UserCheck,
  Clock,
  ChevronRight,
  FileCheck,
  FileUp,
  AlertCircle
} from 'lucide-react';
import { LegalCase } from '../../../types/dashboard';

interface CasesSectionProps {
  cases: LegalCase[];
  onCreateCase: () => void;
  onViewCase: (c: LegalCase) => void;
  onScheduleHearingPrep: (c: LegalCase) => void;
  onUploadFiling: (c: LegalCase) => void;
}

export const CasesSection: React.FC<CasesSectionProps> = ({
  cases,
  onCreateCase,
  onViewCase,
  onScheduleHearingPrep,
  onUploadFiling
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredCases = cases.filter((c) => {
    if (filterStatus !== 'All' && c.caseStatus !== filterStatus) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchId = c.id.toLowerCase().includes(q);
      const matchTitle = c.title.toLowerCase().includes(q);
      const matchClient = c.clientName.toLowerCase().includes(q);
      const matchType = c.caseType.toLowerCase().includes(q);
      const matchCourt = (c.courtJurisdiction || '').toLowerCase().includes(q);
      return matchId || matchTitle || matchClient || matchType || matchCourt;
    }
    return true;
  });

  const activeCasesCount = cases.filter((c) => c.caseStatus === 'Active').length;
  const discoveryCount = cases.filter((c) => c.caseStatus === 'Discovery').length;
  const preTrialCount = cases.filter((c) => c.caseStatus === 'Pre-Trial').length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase tracking-wider mb-1">
            <Scale className="w-4 h-4" />
            <span>Litigation & Matters Registry</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Cases & Court Dockets
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Track active civil litigations, patent defense proceedings, arbitration hearings, and federal jurisdiction filings.
          </p>
        </div>

        <button
          type="button"
          onClick={onCreateCase}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-semibold text-xs shadow-sm transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Open New Case Matter</span>
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Total Dockets</span>
          <p className="text-xl font-extrabold text-slate-900 mt-0.5">{cases.length}</p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Active Litigation</span>
          <p className="text-xl font-extrabold text-blue-900 mt-0.5">{activeCasesCount}</p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">In Discovery</span>
          <p className="text-xl font-extrabold text-indigo-600 mt-0.5">{discoveryCount}</p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Pre-Trial</span>
          <p className="text-xl font-extrabold text-amber-600 mt-0.5">{preTrialCount}</p>
        </div>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        {/* Controls */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
            {['All', 'Active', 'Discovery', 'Pre-Trial', 'In Review'].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  filterStatus === status
                    ? 'bg-white text-blue-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search case, client, court..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none transition"
            />
          </div>
        </div>

        {/* Case Rows */}
        <div className="divide-y divide-slate-100">
          {filteredCases.map((c) => (
            <div
              key={c.id}
              className="p-5 hover:bg-slate-50/70 transition flex flex-col lg:flex-row lg:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-blue-950 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-md">
                    {c.id}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      c.caseStatus === 'Active'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        : c.caseStatus === 'Discovery'
                        ? 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                        : c.caseStatus === 'Pre-Trial'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {c.caseStatus}
                  </span>
                  <span className="text-xs text-slate-400">• Updated {c.lastUpdated}</span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug hover:text-blue-900 transition cursor-pointer" onClick={() => onViewCase(c)}>
                    {c.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600 mt-1">
                    <span className="font-medium text-slate-800">
                      Client: <span className="font-semibold text-blue-950">{c.clientName}</span>
                    </span>
                    <span>Matter: {c.caseType}</span>
                    {c.courtJurisdiction && (
                      <span className="flex items-center gap-1 text-slate-500 font-medium">
                        <Building className="w-3 h-3 text-slate-400" />
                        {c.courtJurisdiction}
                      </span>
                    )}
                  </div>
                </div>

                {c.hearingDate && (
                  <div className="inline-flex items-center gap-1.5 text-xs text-amber-800 bg-amber-50/80 border border-amber-200/80 px-2.5 py-1 rounded-lg">
                    <Calendar className="w-3.5 h-3.5 text-amber-600" />
                    <span>Next Hearing: <strong>{c.hearingDate}</strong></span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end lg:self-center shrink-0">
                <button
                  type="button"
                  onClick={() => onScheduleHearingPrep(c)}
                  className="px-3 py-1.5 rounded-lg bg-blue-900 hover:bg-blue-950 text-white text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Schedule Prep</span>
                </button>
                <button
                  type="button"
                  onClick={() => onUploadFiling(c)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
                >
                  <FileUp className="w-3.5 h-3.5" />
                  <span>Upload Filing</span>
                </button>
                <button
                  type="button"
                  onClick={() => onViewCase(c)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition"
                  title="View Docket"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
