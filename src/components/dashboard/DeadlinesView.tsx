import React, { useState, useMemo, useEffect } from 'react';
import {
  CalendarClock,
  Plus,
  Search,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Filter,
  FileSpreadsheet,
  X,
  User,
  AlertCircle,
  Calendar as CalendarIcon,
  Sparkles,
  Scale,
  FileText,
  Layers,
  RefreshCw,
  Zap,
  Check,
  ChevronRight,
  ShieldAlert,
  LayoutList,
  CalendarDays
} from 'lucide-react';
import { CaseDeadline, CaseFile, ClientDocument, UserRole, SmartDeadlineSuggestion } from '../types';
import { exportDeadlinesExcel } from '../utils/excelExport';
import { SmartDeadlineSuggesterModal } from './SmartDeadlineSuggesterModal';
import { CaseDeadlinesCalendar } from './CaseDeadlinesCalendar';

interface DeadlinesViewProps {
  deadlines: CaseDeadline[];
  cases: CaseFile[];
  documents?: ClientDocument[];
  userRole: UserRole;
  onAddDeadline: (d: CaseDeadline) => void;
  onToggleComplete: (id: string) => void;
}

export const DeadlinesView: React.FC<DeadlinesViewProps> = ({
  deadlines,
  cases,
  documents = [],
  userRole,
  onAddDeadline,
  onToggleComplete
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAiPlannerOpen, setIsAiPlannerOpen] = useState(false);

  // New deadline state
  const [selectedCaseId, setSelectedCaseId] = useState(cases[0]?.id || '');
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('2026-08-25T17:00');
  const [type, setType] = useState<CaseDeadline['type']>('filing');
  const [priority, setPriority] = useState<CaseDeadline['priority']>('high');
  const [assignedTo, setAssignedTo] = useState('Sophia Chen');
  const [notes, setNotes] = useState('');

  // Inline AI Suggestions in New Deadline Modal
  const [modalSuggestions, setModalSuggestions] = useState<SmartDeadlineSuggestion[]>([]);
  const [isGeneratingModalSuggestions, setIsGeneratingModalSuggestions] = useState(false);
  const [activeAppliedSuggestionId, setActiveAppliedSuggestionId] = useState<string | null>(null);

  // Current selected case & related docs
  const currentCase = cases.find((c) => c.id === selectedCaseId) || cases[0];
  const currentCaseDocs = documents.filter((d) => d.caseId === selectedCaseId);

  // Fetch quick modal suggestions when selectedCaseId changes in modal
  const fetchInlineSuggestions = async (caseId: string) => {
    const targetCase = cases.find((c) => c.id === caseId) || cases[0];
    if (!targetCase) return;

    setIsGeneratingModalSuggestions(true);
    const relatedDocs = documents.filter((d) => d.caseId === caseId);

    try {
      const response = await fetch('/api/ai/suggest-deadlines', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          caseData: {
            id: targetCase.id,
            caseNumber: targetCase.caseNumber,
            title: targetCase.title,
            practiceArea: targetCase.practiceArea,
            status: targetCase.status,
            description: targetCase.description,
            openedDate: targetCase.openedDate,
            expectedClosureDate: targetCase.expectedClosureDate,
            assignedLawyerName: targetCase.assignedLawyerName
          },
          documents: relatedDocs.map((d) => ({
            fileName: d.fileName,
            category: d.category,
            uploadedAt: d.uploadedAt,
            aiSummary: d.aiSummary,
            aiRiskLevel: d.aiRiskLevel,
            aiKeyClauses: d.aiKeyClauses,
            isConfidential: d.isConfidential
          })),
          currentDate: '2026-08-20'
        })
      });

      const data = await response.json();
      if (data.success && data.plan && data.plan.suggestedMilestones) {
        setModalSuggestions(data.plan.suggestedMilestones);
      }
    } catch (err) {
      console.error('Failed to fetch modal smart suggestions:', err);
    } finally {
      setIsGeneratingModalSuggestions(false);
    }
  };

  useEffect(() => {
    if (isModalOpen && selectedCaseId) {
      fetchInlineSuggestions(selectedCaseId);
    }
  }, [isModalOpen, selectedCaseId]);

  const handleApplySuggestion = (sugg: SmartDeadlineSuggestion) => {
    setTitle(sugg.title);
    setDueDate(sugg.suggestedDate);
    setType(sugg.type);
    setPriority(sugg.priority);
    if (sugg.assignedTo) {
      setAssignedTo(sugg.assignedTo);
    }
    const rationaleNote = `[AI Milestone - ${sugg.statutoryReference || 'Procedural Rule'}] ${sugg.rationale}`;
    setNotes(rationaleNote);
    setActiveAppliedSuggestionId(sugg.id);
  };

  const filteredDeadlines = useMemo(() => {
    return deadlines.filter((d) => {
      const matchesSearch =
        d.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.caseTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        d.assignedTo.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesPriority = priorityFilter === 'all' || d.priority === priorityFilter;
      const matchesType = typeFilter === 'all' || d.type === typeFilter;

      return matchesSearch && matchesPriority && matchesType;
    });
  }, [deadlines, searchTerm, priorityFilter, typeFilter]);

  const criticalCount = deadlines.filter((d) => d.priority === 'critical' && !d.completed).length;

  const handleCreateDeadlineSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !selectedCaseId) return;

    const matchedCase = cases.find((c) => c.id === selectedCaseId);

    const newD: CaseDeadline = {
      id: `dl-${Date.now()}`,
      caseId: selectedCaseId,
      caseTitle: matchedCase ? matchedCase.title : 'General Case Matter',
      title,
      dueDate: dueDate.replace('T', ' '),
      type,
      priority,
      assignedTo,
      completed: false,
      notes
    };

    onAddDeadline(newD);
    setIsModalOpen(false);
    setTitle('');
    setNotes('');
    setActiveAppliedSuggestionId(null);
  };

  const priorityBadge: Record<CaseDeadline['priority'], string> = {
    critical: 'bg-red-100 text-red-700 border-red-200 font-bold animate-pulse',
    high: 'bg-orange-100 text-orange-700 border-orange-200 font-bold',
    medium: 'bg-blue-100 text-blue-700 border-blue-200 font-bold',
    low: 'bg-slate-100 text-slate-700 border-slate-200 font-bold'
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-4 rounded-lg shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-slate-900">Case Deadlines & Court Calendar</h1>
            {criticalCount > 0 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-100 text-red-700 border border-red-200 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-red-600" />
                {criticalCount} Critical
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated court appearance schedules, filing due dates, and AI-assisted statutory milestone docketing.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* View Mode Toggle: List vs Monthly Calendar */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1 text-xs font-bold rounded-md flex items-center gap-1.5 transition ${
                viewMode === 'list'
                  ? 'bg-white text-slate-900 shadow-2xs border border-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LayoutList className="w-3.5 h-3.5" />
              <span>List View</span>
            </button>
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-1 text-xs font-bold rounded-md flex items-center gap-1.5 transition ${
                viewMode === 'calendar'
                  ? 'bg-blue-600 text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Monthly Calendar</span>
            </button>
          </div>

          <button
            onClick={() => exportDeadlinesExcel(filteredDeadlines)}
            className="px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-md flex items-center gap-2 border border-slate-200 shadow-sm transition"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span className="hidden sm:inline">Export XLSX</span>
          </button>

          <button
            onClick={() => setIsAiPlannerOpen(true)}
            className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-md flex items-center gap-1.5 border border-indigo-200 shadow-sm transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span className="hidden sm:inline">AI Milestone Planner</span>
          </button>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-md flex items-center gap-2 shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>Schedule Deadline</span>
          </button>
        </div>
      </div>

      {/* Conditional Rendering: Monthly Calendar View vs List View */}
      {viewMode === 'calendar' ? (
        <CaseDeadlinesCalendar
          deadlines={deadlines}
          cases={cases}
          userRole={userRole}
          onToggleComplete={onToggleComplete}
          onScheduleForDate={(dateStr) => {
            setDueDate(dateStr);
            setIsModalOpen(true);
          }}
          onOpenAiPlanner={() => setIsAiPlannerOpen(true)}
        />
      ) : (
        <>
          {/* Filter Bar */}
          <div className="p-3 bg-white border border-slate-200 rounded-lg shadow-sm flex flex-col md:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search deadlines by subject, case title, or assigned attorney..."
                className="w-full bg-slate-50 border border-slate-200 rounded-md pl-9 pr-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Priorities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>

              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Event Types</option>
                <option value="court_appearance">Court Appearance</option>
                <option value="filing">Motion / Court Filing</option>
                <option value="statute_of_limitations">Statute of Limitations</option>
                <option value="discovery_response">Discovery Response</option>
                <option value="client_meeting">Client Meeting</option>
              </select>
            </div>
          </div>

          {/* Deadlines List */}
          <div className="space-y-2.5">
            {filteredDeadlines.length === 0 ? (
              <div className="p-8 bg-white border border-slate-200 rounded-xl text-center text-slate-500 space-y-2">
                <CalendarClock className="w-8 h-8 text-slate-300 mx-auto" />
                <p className="font-semibold text-slate-700 text-xs">No deadlines match current search filters</p>
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setPriorityFilter('all');
                    setTypeFilter('all');
                  }}
                  className="text-xs text-blue-600 font-bold hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              filteredDeadlines.map((dl) => (
                <div
                  key={dl.id}
                  className={`p-3.5 rounded-lg border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    dl.completed
                      ? 'bg-slate-50 border-slate-200 opacity-60'
                      : dl.priority === 'critical'
                      ? 'bg-white border-red-300 shadow-sm'
                      : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                  }`}
                >
                  <div className="flex items-start gap-3.5">
                    {/* Checkbox */}
                    <button
                      onClick={() => onToggleComplete(dl.id)}
                      className={`mt-0.5 p-1 rounded transition ${
                        dl.completed
                          ? 'bg-emerald-100 text-emerald-700 border border-emerald-300'
                          : 'bg-slate-100 text-slate-400 hover:text-slate-600 border border-slate-200'
                      }`}
                    >
                      <CheckCircle2 className="w-5 h-5" />
                    </button>

                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase ${priorityBadge[dl.priority]}`}>
                          {dl.priority}
                        </span>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 capitalize">
                          {dl.type.replace('_', ' ')}
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-700 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-blue-600" />
                          Due: {dl.dueDate}
                        </span>
                      </div>

                      <h3 className={`font-bold text-sm text-slate-900 ${dl.completed ? 'line-through text-slate-400' : ''}`}>
                        {dl.title}
                      </h3>

                      <p className="text-xs text-slate-500 mt-0.5">
                        Re: <strong className="text-slate-800">{dl.caseTitle}</strong> • Assigned: <span className="text-slate-700">{dl.assignedTo}</span>
                      </p>

                      {dl.notes && (
                        <p className="text-xs text-slate-600 mt-2 bg-slate-50 p-2 rounded border border-slate-100 italic">
                          "{dl.notes}"
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="shrink-0 flex items-center gap-2 self-end sm:self-center">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded ${dl.completed ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-800 border border-amber-200'}`}>
                      {dl.completed ? 'Completed' : 'Pending Action'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {/* New Deadline Modal with Integrated Smart AI Suggestion Engine */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden animate-in fade-in text-slate-900 max-h-[92vh] flex flex-col">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50 shrink-0">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <CalendarClock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">Schedule Case Deadline</h3>
                  <p className="text-[11px] text-slate-500">Create new court appearance, filing due date, or procedural cutoff</p>
                </div>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="overflow-y-auto p-5 space-y-4 text-xs flex-1">
              {/* Case Selector */}
              <div>
                <label className="block text-slate-700 font-bold mb-1">Select Associated Case *</label>
                <select
                  value={selectedCaseId}
                  onChange={(e) => setSelectedCaseId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-md px-3 py-2 text-slate-900 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {cases.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.caseNumber} - {c.title} ({c.practiceArea} • {c.status})
                    </option>
                  ))}
                </select>
              </div>

              {/* AI Smart Milestone Suggestions Box */}
              <div className="p-3.5 bg-gradient-to-br from-indigo-50/90 via-slate-50 to-blue-50/60 border border-indigo-200 rounded-xl space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">
                      <Sparkles className="w-3 h-3" />
                    </span>
                    <span className="font-bold text-indigo-950 text-xs flex items-center gap-1.5">
                      Smart Milestone Suggestions
                      <span className="text-[10px] font-normal text-indigo-700">
                        (Analyzing case description & {currentCaseDocs.length} vault docs)
                      </span>
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => fetchInlineSuggestions(selectedCaseId)}
                    disabled={isGeneratingModalSuggestions}
                    className="text-[11px] text-indigo-700 hover:text-indigo-900 font-semibold flex items-center gap-1"
                  >
                    <RefreshCw className={`w-3 h-3 ${isGeneratingModalSuggestions ? 'animate-spin' : ''}`} />
                    <span>Refresh</span>
                  </button>
                </div>

                {isGeneratingModalSuggestions ? (
                  <div className="py-4 text-center text-slate-500 flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4 text-indigo-600 animate-spin" />
                    <span className="text-[11px] font-medium">Analyzing case posture & vault evidence for milestone rules...</span>
                  </div>
                ) : modalSuggestions.length > 0 ? (
                  <div className="space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {modalSuggestions.map((sugg) => {
                        const isApplied = activeAppliedSuggestionId === sugg.id;
                        return (
                          <div
                            key={sugg.id}
                            onClick={() => handleApplySuggestion(sugg)}
                            className={`p-2.5 rounded-lg border text-left cursor-pointer transition relative group ${
                              isApplied
                                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                                : 'bg-white border-indigo-100 hover:border-indigo-300 hover:shadow-xs text-slate-800'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span
                                className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${
                                  isApplied
                                    ? 'bg-indigo-800 text-indigo-100'
                                    : sugg.priority === 'critical'
                                    ? 'bg-red-100 text-red-700'
                                    : 'bg-indigo-100 text-indigo-700'
                                }`}
                              >
                                {sugg.priority} • {sugg.type.replace('_', ' ')}
                              </span>
                              <span className={`text-[10px] font-mono font-bold ${isApplied ? 'text-indigo-100' : 'text-slate-600'}`}>
                                {sugg.suggestedDate.replace('T', ' ')}
                              </span>
                            </div>

                            <p className={`font-bold text-[11px] line-clamp-1 ${isApplied ? 'text-white' : 'text-slate-900'}`}>
                              {sugg.title}
                            </p>

                            <p className={`text-[10px] line-clamp-2 mt-0.5 ${isApplied ? 'text-indigo-100' : 'text-slate-500'}`}>
                              {sugg.rationale}
                            </p>

                            {sugg.statutoryReference && (
                              <div className="mt-1.5 flex items-center justify-between text-[9px]">
                                <span className={`font-mono ${isApplied ? 'text-indigo-200' : 'text-indigo-700'}`}>
                                  {sugg.statutoryReference}
                                </span>
                                <span className={`font-bold flex items-center gap-0.5 ${isApplied ? 'text-white' : 'text-indigo-600 group-hover:underline'}`}>
                                  {isApplied ? 'Applied ✓' : 'Use Milestone →'}
                                </span>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    <div className="flex items-center justify-between pt-1 text-[11px] text-slate-500">
                      <span>Click any suggestion to autofill title, due date, category & rationale.</span>
                      <button
                        type="button"
                        onClick={() => {
                          setIsModalOpen(false);
                          setIsAiPlannerOpen(true);
                        }}
                        className="text-indigo-600 font-bold hover:underline flex items-center gap-0.5"
                      >
                        Open Full Milestone Roadmap →
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="py-2 text-center text-slate-500 text-[11px]">
                    No automatic suggestions returned. You can fill out the form manually or click Refresh.
                  </div>
                )}
              </div>

              <form onSubmit={handleCreateDeadlineSubmit} className="space-y-4 pt-1">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Deadline Title / Motion Subject *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Opposition to Summary Judgment Filing Due"
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Due Date & Time *</label>
                    <input
                      type="datetime-local"
                      required
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-slate-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Priority Urgency</label>
                    <select
                      value={priority}
                      onChange={(e) => setPriority(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-slate-900 focus:outline-none"
                    >
                      <option value="critical">Critical (Mandatory)</option>
                      <option value="high">High Urgency</option>
                      <option value="medium">Medium Urgency</option>
                      <option value="low">Low Priority</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Event Category</label>
                    <select
                      value={type}
                      onChange={(e) => setType(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-slate-900 focus:outline-none"
                    >
                      <option value="court_appearance">Court Appearance</option>
                      <option value="filing">Court Filing</option>
                      <option value="statute_of_limitations">Statute of Limitations</option>
                      <option value="discovery_response">Discovery Response</option>
                      <option value="client_meeting">Client Meeting</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-700 font-semibold mb-1">Assigned Staff / Attorney</label>
                    <input
                      type="text"
                      value={assignedTo}
                      onChange={(e) => setAssignedTo(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-slate-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-semibold mb-1">Specific Instructions / Notes</label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Courtroom location, docket filing instructions, or key statutes..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-3 py-1.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md shadow-sm"
                  >
                    Schedule Deadline
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Full AI Milestone Roadmap & Suggester Modal */}
      <SmartDeadlineSuggesterModal
        isOpen={isAiPlannerOpen}
        onClose={() => setIsAiPlannerOpen(false)}
        cases={cases}
        documents={documents}
        initialCaseId={selectedCaseId}
        onAddDeadline={onAddDeadline}
        onApplyToForm={(sugg, cId) => {
          setSelectedCaseId(cId);
          handleApplySuggestion(sugg);
          setIsModalOpen(true);
        }}
      />
    </div>
  );
};

