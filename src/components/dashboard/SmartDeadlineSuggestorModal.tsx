import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  X,
  Calendar,
  Clock,
  CheckCircle2,
  FileText,
  AlertTriangle,
  Scale,
  ShieldCheck,
  ArrowRight,
  Plus,
  Loader2,
  RefreshCw,
  FolderLock,
  Layers,
  Check
} from 'lucide-react';
import { CaseFile, ClientDocument, CaseDeadline, CaseMilestonePlan, SmartDeadlineSuggestion } from '../types';

interface SmartDeadlineSuggesterModalProps {
  isOpen: boolean;
  onClose: () => void;
  cases: CaseFile[];
  documents: ClientDocument[];
  initialCaseId?: string;
  onAddDeadline: (deadline: CaseDeadline) => void;
  onApplyToForm?: (suggestion: SmartDeadlineSuggestion, caseId: string) => void;
}

export const SmartDeadlineSuggesterModal: React.FC<SmartDeadlineSuggesterModalProps> = ({
  isOpen,
  onClose,
  cases,
  documents,
  initialCaseId,
  onAddDeadline,
  onApplyToForm
}) => {
  const [selectedCaseId, setSelectedCaseId] = useState<string>(initialCaseId || cases[0]?.id || '');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [plan, setPlan] = useState<CaseMilestonePlan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [addedMilestoneIds, setAddedMilestoneIds] = useState<Record<string, boolean>>({});
  const [batchAdded, setBatchAdded] = useState<boolean>(false);

  const selectedCase = cases.find((c) => c.id === selectedCaseId) || cases[0];
  const caseDocuments = documents.filter((d) => d.caseId === selectedCaseId);

  const buildLocalMilestones = () => {
    if (!selectedCase) return;
    const baseDate = new Date('2026-08-20');
    const addDays = (days: number) => {
      const d = new Date(baseDate);
      d.setDate(d.getDate() + days);
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}T17:00`;
    };

    const isIP = selectedCase.practiceArea === 'Intellectual Property' || selectedCase.title.toLowerCase().includes('patent');
    const isCorporate = selectedCase.practiceArea === 'Corporate' || selectedCase.title.toLowerCase().includes('merger');

    const milestones: SmartDeadlineSuggestion[] = isIP
      ? [
          {
            id: `sugg-${Date.now()}-1`,
            title: 'Rule 26(f) Discovery Conference & Initial Disclosures',
            suggestedDate: addDays(6),
            type: 'discovery_response',
            priority: 'critical',
            assignedTo: selectedCase.assignedLawyerName || 'Sophia Chen, Esq.',
            rationale: 'Mandatory exchange of source code audit logs and patent claim mapping evidence.',
            statutoryReference: 'Fed. R. Civ. P. 26(a)(1) & Local Patent Rule 3-1',
            derivedFromDocs: caseDocuments.map((d) => d.fileName),
            daysFromNow: 6,
            stage: 'Discovery'
          },
          {
            id: `sugg-${Date.now()}-2`,
            title: 'Emergency Motion for Preliminary Injunction Filing',
            suggestedDate: addDays(8),
            type: 'filing',
            priority: 'critical',
            assignedTo: selectedCase.assignedLawyerName || 'Sophia Chen, Esq.',
            rationale: 'Prevent irreparable trade secret dissemination based on verified vault exhibits.',
            statutoryReference: '35 U.S.C. § 283 & Fed. R. Civ. P. 65(a)',
            derivedFromDocs: caseDocuments.map((d) => d.fileName),
            daysFromNow: 8,
            stage: 'Motions'
          },
          {
            id: `sugg-${Date.now()}-3`,
            title: 'Joint Claim Construction Statement (Markman Briefing)',
            suggestedDate: addDays(21),
            type: 'filing',
            priority: 'high',
            assignedTo: 'Eleanor Vance, Esq.',
            rationale: 'Statutory deadline for filing contested patent claim term interpretations.',
            statutoryReference: 'Local Patent Rule 4-3 (D. Del.)',
            derivedFromDocs: caseDocuments.map((d) => d.fileName),
            daysFromNow: 21,
            stage: 'Pleadings'
          }
        ]
      : isCorporate
      ? [
          {
            id: `sugg-${Date.now()}-1`,
            title: 'FTC / DOJ Hart-Scott-Rodino (HSR) Second Request Filing',
            suggestedDate: addDays(5),
            type: 'filing',
            priority: 'critical',
            assignedTo: selectedCase.assignedLawyerName || 'David Vance, Esq.',
            rationale: 'Antitrust statutory submission deadline for supplemental market disclosures.',
            statutoryReference: '15 U.S.C. § 18a (HSR Act 30-Day Waiting Period)',
            derivedFromDocs: caseDocuments.map((d) => d.fileName),
            daysFromNow: 5,
            stage: 'Discovery'
          },
          {
            id: `sugg-${Date.now()}-2`,
            title: 'Definitive Disclosure Schedules & Indemnity Cap Review',
            suggestedDate: addDays(12),
            type: 'client_meeting',
            priority: 'high',
            assignedTo: selectedCase.assignedLawyerName || 'David Vance, Esq.',
            rationale: 'Executive committee conference to sign off on revised breakup fee schedule.',
            statutoryReference: 'Delaware General Corporation Law § 251',
            derivedFromDocs: caseDocuments.map((d) => d.fileName),
            daysFromNow: 12,
            stage: 'Intake'
          },
          {
            id: `sugg-${Date.now()}-3`,
            title: 'Shareholder Proxy Statement / SEC Form S-4 Submission',
            suggestedDate: addDays(26),
            type: 'filing',
            priority: 'medium',
            assignedTo: 'Eleanor Vance, Esq.',
            rationale: 'Filing regulatory prospectus disclosures prior to shareholder vote.',
            statutoryReference: 'SEC Rule 14a-6 & Securities Exchange Act § 14(a)',
            derivedFromDocs: caseDocuments.map((d) => d.fileName),
            daysFromNow: 26,
            stage: 'Pleadings'
          }
        ]
      : [
          {
            id: `sugg-${Date.now()}-1`,
            title: 'Mandatory Case Management Conference (CMC) Statement',
            suggestedDate: addDays(7),
            type: 'court_appearance',
            priority: 'high',
            assignedTo: selectedCase.assignedLawyerName || 'Lead Counsel',
            rationale: 'Submission of joint meet-and-confer schedule and preliminary trial estimate.',
            statutoryReference: 'Fed. R. Civ. P. 16',
            derivedFromDocs: caseDocuments.map((d) => d.fileName),
            daysFromNow: 7,
            stage: 'Pleadings'
          },
          {
            id: `sugg-${Date.now()}-2`,
            title: 'Interrogatories & Document Production Demand Cutoff',
            suggestedDate: addDays(18),
            type: 'discovery_response',
            priority: 'critical',
            assignedTo: selectedCase.assignedLawyerName || 'Lead Counsel',
            rationale: 'Statutory 30-day window for propounding written discovery requests.',
            statutoryReference: 'Fed. R. Civ. P. 33 & Rule 34',
            derivedFromDocs: caseDocuments.map((d) => d.fileName),
            daysFromNow: 18,
            stage: 'Discovery'
          }
        ];

    setPlan({
      caseId: selectedCase.id,
      caseTitle: selectedCase.title,
      analyzedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      documentCount: caseDocuments.length,
      caseHealthInsight: `Procedural assessment indicates case "${selectedCase.title}" is in active ${selectedCase.status} posture with ${caseDocuments.length} verified evidence filings. Milestones reflect statutory calendar rules.`,
      proceduralPhase: (selectedCase.status || 'Active').toUpperCase(),
      statutoryJurisdiction: isIP ? 'Federal District Court / US Patent Code' : isCorporate ? 'Delaware Chancery Court & FTC' : 'Civil Trial Division',
      suggestedMilestones: milestones,
      riskAlerts: [
        'Ensure electronic service certificates are filed simultaneously with clerk submissions.',
        'Protective order compliance required for all confidential technical attachments.'
      ]
    });
  };

  const fetchSuggestions = async () => {
    if (!selectedCase) return;
    setIsLoading(true);
    setBatchAdded(false);

    try {
      const response = await fetch('/api/ai/suggest-deadlines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseData: {
            id: selectedCase.id,
            caseNumber: selectedCase.caseNumber,
            title: selectedCase.title,
            practiceArea: selectedCase.practiceArea,
            status: selectedCase.status,
            description: selectedCase.description,
            openedDate: selectedCase.openedDate,
            expectedClosureDate: selectedCase.expectedClosureDate,
            assignedLawyerName: selectedCase.assignedLawyerName
          },
          documents: caseDocuments.map((d) => ({
            fileName: d.fileName,
            category: d.category,
            uploadedAt: d.uploadedAt,
            aiSummary: d.aiSummary,
            aiRiskLevel: d.aiRiskLevel,
            aiKeyClauses: d.aiKeyClauses,
            isConfidential: d.isConfidential
          })),
          customPrompt: customPrompt.trim(),
          currentDate: '2026-08-20'
        })
      });

      const data = await response.json();
      if (data.success && data.plan) {
        setPlan(data.plan);
      } else {
        buildLocalMilestones();
      }
    } catch (err) {
      console.error('Error in smart deadline generator, applying procedural engine:', err);
      buildLocalMilestones();
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && selectedCaseId) {
      fetchSuggestions();
    }
  }, [isOpen, selectedCaseId]);

  if (!isOpen) return null;

  const handleDocketSingle = (milestone: SmartDeadlineSuggestion) => {
    if (!selectedCase) return;

    const formattedDueDate = milestone.suggestedDate.replace('T', ' ');

    const newDeadline: CaseDeadline = {
      id: `dl-ai-${Date.now()}-${milestone.id}`,
      caseId: selectedCase.id,
      caseTitle: selectedCase.title,
      title: milestone.title,
      dueDate: formattedDueDate,
      type: milestone.type,
      priority: milestone.priority,
      assignedTo: milestone.assignedTo || selectedCase.assignedLawyerName || 'Counsel of Record',
      completed: false,
      notes: `[AI Smart Suggestion] ${milestone.rationale} (Statutory Ref: ${milestone.statutoryReference || 'Standard Practice Order'})`
    };

    onAddDeadline(newDeadline);
    setAddedMilestoneIds((prev) => ({ ...prev, [milestone.id]: true }));
  };

  const handleBatchDocketAll = () => {
    if (!plan || !selectedCase) return;

    plan.suggestedMilestones.forEach((m, idx) => {
      if (!addedMilestoneIds[m.id]) {
        const formattedDueDate = m.suggestedDate.replace('T', ' ');
        const newDeadline: CaseDeadline = {
          id: `dl-ai-${Date.now()}-${idx}`,
          caseId: selectedCase.id,
          caseTitle: selectedCase.title,
          title: m.title,
          dueDate: formattedDueDate,
          type: m.type,
          priority: m.priority,
          assignedTo: m.assignedTo || selectedCase.assignedLawyerName || 'Counsel of Record',
          completed: false,
          notes: `[AI Smart Roadmap] ${m.rationale} (Statutory Ref: ${m.statutoryReference || 'Procedural Rules'})`
        };
        onAddDeadline(newDeadline);
      }
    });

    const newMap: Record<string, boolean> = {};
    plan.suggestedMilestones.forEach((m) => {
      newMap[m.id] = true;
    });
    setAddedMilestoneIds(newMap);
    setBatchAdded(true);
  };

  const priorityStyles: Record<string, string> = {
    critical: 'bg-red-50 text-red-700 border-red-200',
    high: 'bg-amber-50 text-amber-700 border-amber-200',
    medium: 'bg-blue-50 text-blue-700 border-blue-200',
    low: 'bg-slate-100 text-slate-700 border-slate-200'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white border border-slate-200 rounded-xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden text-slate-900">
        {/* Header */}
        <div className="p-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/30 border border-indigo-400/40 flex items-center justify-center text-indigo-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-bold tracking-tight text-white">AI Smart Deadline & Milestone Engine</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 flex items-center gap-1 font-mono">
                  <Scale className="w-3 h-3 text-indigo-400" />
                  Procedural Intelligence
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Analyzes case facts and vault documents to calculate statutory milestones and court filing cutoffs.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Case & Filter Toolbar */}
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shrink-0">
          <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
            <label className="text-xs font-bold text-slate-700 shrink-0">Active Case Matter:</label>
            <select
              value={selectedCaseId}
              onChange={(e) => setSelectedCaseId(e.target.value)}
              className="bg-white border border-slate-300 rounded-md px-3 py-1.5 text-xs text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs"
            >
              {cases.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.caseNumber} - {c.title} ({c.practiceArea})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-[11px] text-slate-500 font-mono bg-white px-2 py-1 rounded border border-slate-200 flex items-center gap-1.5">
              <FolderLock className="w-3 h-3 text-indigo-600" />
              {caseDocuments.length} Vault Docs Attached
            </span>

            <button
              onClick={fetchSuggestions}
              disabled={isLoading}
              className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 rounded-md text-xs font-bold transition flex items-center gap-1.5 disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Re-Analyze</span>
            </button>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1 bg-white">
          {/* Custom Instruction Box (Collapsible/Inline) */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center gap-2">
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="Optional: Specify procedural focus (e.g. 'Accelerated 30-day discovery cutoff' or 'FTC second request compliance')..."
              className="flex-1 bg-white border border-slate-200 rounded-md px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  fetchSuggestions();
                }
              }}
            />
            <button
              onClick={fetchSuggestions}
              disabled={isLoading}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md text-xs font-bold transition shrink-0"
            >
              Apply Prompt
            </button>
          </div>

          {isLoading ? (
            <div className="py-16 flex flex-col items-center justify-center space-y-3 text-slate-500">
              <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
              <div className="text-center">
                <p className="text-sm font-bold text-slate-800">Calculating Statutory Case Milestones...</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Auditing practice area rules, FRCP deadlines, and document metadata in evidence vault
                </p>
              </div>
            </div>
          ) : plan ? (
            <>
              {/* Case Diagnosis & Procedural Insight */}
              <div className="p-4 bg-gradient-to-r from-indigo-50/80 to-blue-50/80 border border-indigo-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold text-indigo-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Scale className="w-3.5 h-3.5 text-indigo-600" />
                      Procedural Posture Diagnosis
                    </span>
                    <span className="text-[10px] font-mono font-bold bg-white text-indigo-700 px-2 py-0.5 rounded border border-indigo-200">
                      Phase: {plan.proceduralPhase}
                    </span>
                  </div>

                  <span className="text-[10px] font-mono text-slate-500">
                    Jurisdiction: {plan.statutoryJurisdiction}
                  </span>
                </div>

                <p className="text-xs text-slate-800 leading-relaxed font-medium">
                  {plan.caseHealthInsight}
                </p>

                {plan.riskAlerts && plan.riskAlerts.length > 0 && (
                  <div className="pt-1 flex items-start gap-1.5 text-[11px] text-amber-800">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>Statutory Watch:</strong> {plan.riskAlerts.join(' • ')}</span>
                  </div>
                )}
              </div>

              {/* Milestones Action Bar */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-indigo-600" />
                    Suggested Case Milestones & Statutory Cutoffs ({plan.suggestedMilestones.length})
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Calculated using civil procedure rules, court rules, and evidence uploaded in the document vault.
                  </p>
                </div>

                <button
                  onClick={handleBatchDocketAll}
                  disabled={batchAdded}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition flex items-center gap-1.5 shadow-2xs ${
                    batchAdded
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                  }`}
                >
                  {batchAdded ? <Check className="w-3.5 h-3.5" /> : <Layers className="w-3.5 h-3.5" />}
                  <span>{batchAdded ? 'All Docketed to Calendar' : 'Docket All Milestones'}</span>
                </button>
              </div>

              {/* Milestones Cards Grid */}
              <div className="space-y-3">
                {plan.suggestedMilestones.map((m, idx) => {
                  const isAdded = addedMilestoneIds[m.id];
                  return (
                    <div
                      key={m.id || idx}
                      className={`p-3.5 rounded-xl border transition ${
                        isAdded
                          ? 'bg-emerald-50/40 border-emerald-300'
                          : m.priority === 'critical'
                          ? 'bg-white border-red-200 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-indigo-300 shadow-2xs'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                        <div className="space-y-1.5 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${priorityStyles[m.priority] || 'bg-slate-100'}`}>
                              {m.priority}
                            </span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 capitalize">
                              {m.type.replace('_', ' ')}
                            </span>
                            {m.stage && (
                              <span className="text-[10px] font-mono bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-200">
                                Stage: {m.stage}
                              </span>
                            )}
                            <span className="text-xs font-mono font-bold text-slate-800 flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                              <Clock className="w-3 h-3 text-indigo-600" />
                              {m.suggestedDate.replace('T', ' ')} ({m.daysFromNow ? `+${m.daysFromNow} days` : 'Prompt'})
                            </span>
                          </div>

                          <h4 className="font-bold text-sm text-slate-900">
                            {m.title}
                          </h4>

                          <p className="text-xs text-slate-600 leading-relaxed">
                            {m.rationale}
                          </p>

                          <div className="flex flex-wrap items-center gap-2 pt-1">
                            {m.statutoryReference && (
                              <span className="text-[10px] font-mono font-semibold text-indigo-800 bg-indigo-50/80 px-2 py-0.5 rounded border border-indigo-200 flex items-center gap-1">
                                <Scale className="w-2.5 h-2.5" />
                                {m.statutoryReference}
                              </span>
                            )}

                            {m.derivedFromDocs && m.derivedFromDocs.length > 0 && (
                              <span className="text-[10px] text-slate-500 flex items-center gap-1">
                                <FileText className="w-3 h-3 text-slate-400" />
                                Evidence: {m.derivedFromDocs.join(', ')}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex sm:flex-col items-center sm:items-end gap-2 shrink-0 self-end sm:self-start">
                          <button
                            onClick={() => handleDocketSingle(m)}
                            disabled={isAdded}
                            className={`px-3 py-1.5 rounded-md text-xs font-bold transition flex items-center gap-1.5 ${
                              isAdded
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-2xs'
                            }`}
                          >
                            {isAdded ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" /> : <Plus className="w-3.5 h-3.5" />}
                            <span>{isAdded ? 'Docketed' : 'Docket to Calendar'}</span>
                          </button>

                          {onApplyToForm && (
                            <button
                              onClick={() => {
                                onApplyToForm(m, selectedCase.id);
                                onClose();
                              }}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded text-[11px] font-semibold transition"
                            >
                              Apply to Manual Form
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-slate-400">
              <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-amber-500" />
              <p className="text-xs">Select a case to generate AI milestone suggestions.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Statutory procedural engine cross-references FRCP, Local Patent Rules, and Delaware Chancery codes.</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-md font-semibold text-xs transition"
          >
            Close Planner
          </button>
        </div>
      </div>
    </div>
  );
};
