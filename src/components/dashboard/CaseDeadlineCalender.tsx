import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Scale,
  ShieldAlert,
  Layers,
  Users,
  Plus,
  Filter,
  Check,
  X,
  ExternalLink,
  Sparkles,
  Info,
  CalendarDays
} from 'lucide-react';
import { CaseDeadline, CaseFile, UserRole } from '../types';

interface CaseDeadlinesCalendarProps {
  deadlines: CaseDeadline[];
  cases: CaseFile[];
  userRole: UserRole;
  onToggleComplete: (id: string) => void;
  onScheduleForDate: (dateStr: string) => void;
  onOpenAiPlanner?: () => void;
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December'
];

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const CaseDeadlinesCalendar: React.FC<CaseDeadlinesCalendarProps> = ({
  deadlines,
  cases,
  userRole,
  onToggleComplete,
  onScheduleForDate,
  onOpenAiPlanner
}) => {
  // Calendar month state (default to August 2026)
  const [currentYear, setCurrentYear] = useState<number>(2026);
  const [currentMonth, setCurrentMonth] = useState<number>(7); // 0-indexed: 7 = August

  // Filters
  const [selectedCaseFilter, setSelectedCaseFilter] = useState<string>('all');
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState<string>('all');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');

  // Selected Day for Detailed Agenda Drawer / Popover
  const [selectedDayKey, setSelectedDayKey] = useState<string | null>('2026-08-20');
  const [inspectDeadline, setInspectDeadline] = useState<CaseDeadline | null>(null);

  // Today reference (2026-08-22)
  const TODAY_KEY = '2026-08-22';

  // Navigation handlers
  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleJumpToToday = () => {
    setCurrentYear(2026);
    setCurrentMonth(7); // August
    setSelectedDayKey(TODAY_KEY);
  };

  // Helper to extract YYYY-MM-DD from deadline dueDate
  const getDateKey = (dateStr: string): string => {
    if (!dateStr) return '';
    return dateStr.replace('T', ' ').split(' ')[0];
  };

  // Helper to extract time string (e.g. 14:30)
  const getTimeString = (dateStr: string): string => {
    if (!dateStr) return '';
    const parts = dateStr.replace('T', ' ').split(' ');
    return parts[1] || '';
  };

  // Filtered deadlines according to dropdown filters
  const filteredDeadlines = useMemo(() => {
    return deadlines.filter((d) => {
      const matchesCase = selectedCaseFilter === 'all' || d.caseId === selectedCaseFilter;
      const matchesPriority = selectedPriorityFilter === 'all' || d.priority === selectedPriorityFilter;
      const matchesType = selectedTypeFilter === 'all' || d.type === selectedTypeFilter;
      const matchesStatus =
        selectedStatusFilter === 'all'
          ? true
          : selectedStatusFilter === 'completed'
          ? d.completed
          : !d.completed;

      return matchesCase && matchesPriority && matchesType && matchesStatus;
    });
  }, [deadlines, selectedCaseFilter, selectedPriorityFilter, selectedTypeFilter, selectedStatusFilter]);

  // Index deadlines by date key (YYYY-MM-DD)
  const deadlinesByDate = useMemo(() => {
    const map: Record<string, CaseDeadline[]> = {};
    filteredDeadlines.forEach((dl) => {
      const key = getDateKey(dl.dueDate);
      if (!map[key]) {
        map[key] = [];
      }
      map[key].push(dl);
    });
    return map;
  }, [filteredDeadlines]);

  // Compute month calendar cells (including leading & trailing days)
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const startingDayOfWeek = firstDayOfMonth.getDay(); // 0 = Sunday
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();

    const cells: {
      date: number;
      month: number;
      year: number;
      dateKey: string;
      isCurrentMonth: boolean;
      isToday: boolean;
    }[] = [];

    // Leading days from previous month
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const prevDate = daysInPrevMonth - i;
      const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
      const dateKey = `${prevYear}-${String(prevMonth + 1).padStart(2, '0')}-${String(prevDate).padStart(2, '0')}`;
      cells.push({
        date: prevDate,
        month: prevMonth,
        year: prevYear,
        dateKey,
        isCurrentMonth: false,
        isToday: dateKey === TODAY_KEY
      });
    }

    // Days in current month
    for (let d = 1; d <= daysInMonth; d++) {
      const dateKey = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      cells.push({
        date: d,
        month: currentMonth,
        year: currentYear,
        dateKey,
        isCurrentMonth: true,
        isToday: dateKey === TODAY_KEY
      });
    }

    // Trailing days to fill 35 or 42 cells (5 or 6 rows)
    const totalCellsNeeded = cells.length > 35 ? 42 : 35;
    const remainingCells = totalCellsNeeded - cells.length;
    for (let d = 1; d <= remainingCells; d++) {
      const nextMonth = currentMonth === 11 ? 0 : currentMonth + 1;
      const nextYear = currentMonth === 11 ? currentYear + 1 : currentYear;
      const dateKey = `${nextYear}-${String(nextMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      cells.push({
        date: d,
        month: nextMonth,
        year: nextYear,
        dateKey,
        isCurrentMonth: false,
        isToday: dateKey === TODAY_KEY
      });
    }

    return cells;
  }, [currentYear, currentMonth]);

  // Current month summary stats
  const monthStats = useMemo(() => {
    const monthPrefix = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;
    const monthDeadlines = deadlines.filter((d) => getDateKey(d.dueDate).startsWith(monthPrefix));
    const criticalMonth = monthDeadlines.filter((d) => d.priority === 'critical' && !d.completed).length;
    const completedMonth = monthDeadlines.filter((d) => d.completed).length;
    const totalMonth = monthDeadlines.length;
    const hearings = monthDeadlines.filter((d) => d.type === 'court_appearance').length;
    const filings = monthDeadlines.filter((d) => d.type === 'filing').length;
    const discovery = monthDeadlines.filter((d) => d.type === 'discovery_response').length;
    const sol = monthDeadlines.filter((d) => d.type === 'statute_of_limitations').length;

    return {
      total: totalMonth,
      critical: criticalMonth,
      completed: completedMonth,
      hearings,
      filings,
      discovery,
      sol,
      complianceRate: totalMonth > 0 ? Math.round((completedMonth / totalMonth) * 100) : 0
    };
  }, [deadlines, currentYear, currentMonth]);

  // Selected Day's events
  const selectedDayEvents = useMemo(() => {
    if (!selectedDayKey) return [];
    return deadlinesByDate[selectedDayKey] || [];
  }, [selectedDayKey, deadlinesByDate]);

  // Formatted title for selected day
  const formattedSelectedDate = useMemo(() => {
    if (!selectedDayKey) return '';
    const [y, m, d] = selectedDayKey.split('-').map(Number);
    const dateObj = new Date(y, m - 1, d);
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  }, [selectedDayKey]);

  // Event category icon and styling
  const getTypeMeta = (type: CaseDeadline['type']) => {
    switch (type) {
      case 'court_appearance':
        return {
          label: 'Court Appearance',
          icon: <Scale className="w-3 h-3 text-purple-600 shrink-0" />,
          badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
          dotClass: 'bg-purple-500'
        };
      case 'filing':
        return {
          label: 'Motion / Court Filing',
          icon: <FileText className="w-3 h-3 text-blue-600 shrink-0" />,
          badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
          dotClass: 'bg-blue-500'
        };
      case 'statute_of_limitations':
        return {
          label: 'Statute of Limitations',
          icon: <ShieldAlert className="w-3 h-3 text-rose-600 shrink-0" />,
          badgeClass: 'bg-rose-50 text-rose-700 border-rose-200',
          dotClass: 'bg-rose-500'
        };
      case 'discovery_response':
        return {
          label: 'Discovery Response',
          icon: <Clock className="w-3 h-3 text-amber-600 shrink-0" />,
          badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
          dotClass: 'bg-amber-500'
        };
      case 'client_meeting':
        return {
          label: 'Client Meeting',
          icon: <Users className="w-3 h-3 text-emerald-600 shrink-0" />,
          badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          dotClass: 'bg-emerald-500'
        };
      default:
        return {
          label: 'Case Milestone',
          icon: <Clock className="w-3 h-3 text-slate-600 shrink-0" />,
          badgeClass: 'bg-slate-50 text-slate-700 border-slate-200',
          dotClass: 'bg-slate-500'
        };
    }
  };

  // Priority color styling
  const getPriorityStyle = (priority: CaseDeadline['priority'], completed: boolean) => {
    if (completed) {
      return 'border-slate-200 bg-slate-50/80 text-slate-400 opacity-65';
    }
    switch (priority) {
      case 'critical':
        return 'border-red-300 bg-red-50/90 text-red-900 shadow-2xs ring-1 ring-red-200';
      case 'high':
        return 'border-orange-300 bg-orange-50/90 text-orange-900';
      case 'medium':
        return 'border-blue-200 bg-blue-50/80 text-blue-900';
      case 'low':
      default:
        return 'border-slate-200 bg-slate-50 text-slate-700';
    }
  };

  return (
    <div className="space-y-4">
      {/* Month Navigation & Controls Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Left: Month / Year Title & Quick Nav */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg border border-slate-200">
            <button
              onClick={handlePrevMonth}
              title="Previous Month"
              className="p-1.5 hover:bg-white text-slate-600 hover:text-slate-900 rounded-md transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleJumpToToday}
              className="px-2.5 py-1 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold rounded-md shadow-2xs border border-slate-200 transition"
            >
              Today
            </button>
            <button
              onClick={handleNextMonth}
              title="Next Month"
              className="p-1.5 hover:bg-white text-slate-600 hover:text-slate-900 rounded-md transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <h2 className="text-lg font-black text-slate-900 tracking-tight">
              {MONTH_NAMES[currentMonth]} {currentYear}
            </h2>

            {monthStats.critical > 0 && (
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-700 border border-red-200 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3 text-red-600" />
                {monthStats.critical} Critical this month
              </span>
            )}
          </div>
        </div>

        {/* Right: Filters & Quick Schedulers */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Case Filter */}
          <select
            value={selectedCaseFilter}
            onChange={(e) => setSelectedCaseFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-medium rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 max-w-[200px] truncate"
          >
            <option value="all">All Matters ({cases.length})</option>
            {cases.map((c) => (
              <option key={c.id} value={c.id}>
                {c.caseNumber} - {c.title}
              </option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={selectedPriorityFilter}
            onChange={(e) => setSelectedPriorityFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-medium rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* Type Filter */}
          <select
            value={selectedTypeFilter}
            onChange={(e) => setSelectedTypeFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-medium rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Types</option>
            <option value="court_appearance">Court Appearance</option>
            <option value="filing">Court Filing</option>
            <option value="statute_of_limitations">Statute of Limitations</option>
            <option value="discovery_response">Discovery</option>
            <option value="client_meeting">Client Meeting</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 text-slate-800 text-xs font-medium rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending Action</option>
            <option value="completed">Completed</option>
          </select>

          <button
            onClick={() => onScheduleForDate(`${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-15T10:00`)}
            className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg flex items-center gap-1.5 shadow-2xs transition shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {/* Monthly Milestone Metric Ribbon */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2.5 text-xs">
        <div className="p-2.5 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Month Deadlines</span>
          <span className="text-base font-black text-slate-900">{monthStats.total}</span>
        </div>
        <div className="p-2.5 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Hearings / Appearances</span>
          <span className="text-base font-black text-purple-700">{monthStats.hearings}</span>
        </div>
        <div className="p-2.5 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Court Filings</span>
          <span className="text-base font-black text-blue-700">{monthStats.filings}</span>
        </div>
        <div className="p-2.5 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Discovery Responses</span>
          <span className="text-base font-black text-amber-700">{monthStats.discovery}</span>
        </div>
        <div className="p-2.5 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Statutory Limits</span>
          <span className="text-base font-black text-rose-700">{monthStats.sol}</span>
        </div>
        <div className="p-2.5 bg-white border border-slate-200 rounded-xl shadow-2xs">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Completed</span>
          <span className="text-base font-black text-emerald-700">
            {monthStats.completed} <span className="text-xs font-normal text-slate-500">({monthStats.complianceRate}%)</span>
          </span>
        </div>
      </div>

      {/* Main Calendar View Area: Grid + Side Agenda Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        {/* Calendar Grid (8 cols on large screens, or 12 if no day selected) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
          {/* Day of Week Headers */}
          <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50/80 text-center text-[11px] font-bold text-slate-600 py-2.5">
            {DAY_NAMES.map((name, i) => (
              <div key={name} className={i === 0 || i === 6 ? 'text-slate-400' : 'text-slate-700'}>
                {name}
              </div>
            ))}
          </div>

          {/* Monthly Day Cells Grid */}
          <div className="grid grid-cols-7 divide-x divide-y divide-slate-100 bg-slate-100/30">
            {calendarDays.map((cell) => {
              const dayEvents = deadlinesByDate[cell.dateKey] || [];
              const isSelected = selectedDayKey === cell.dateKey;
              const hasCritical = dayEvents.some((e) => e.priority === 'critical' && !e.completed);

              return (
                <div
                  key={cell.dateKey}
                  onClick={() => setSelectedDayKey(cell.dateKey)}
                  className={`min-h-[105px] sm:min-h-[115px] p-1.5 transition flex flex-col justify-between group relative cursor-pointer ${
                    !cell.isCurrentMonth
                      ? 'bg-slate-50/60 text-slate-400'
                      : isSelected
                      ? 'bg-blue-50/40 ring-2 ring-blue-500 ring-inset z-10'
                      : 'bg-white hover:bg-slate-50/80'
                  }`}
                >
                  {/* Date Header inside cell */}
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <div className="flex items-center gap-1">
                      <span
                        className={`text-xs font-mono font-bold w-6 h-6 flex items-center justify-center rounded-full transition ${
                          cell.isToday
                            ? 'bg-blue-600 text-white shadow-xs'
                            : isSelected
                            ? 'bg-slate-900 text-white'
                            : cell.isCurrentMonth
                            ? 'text-slate-800 group-hover:text-blue-600'
                            : 'text-slate-400'
                        }`}
                      >
                        {cell.date}
                      </span>

                      {hasCritical && (
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" title="Critical Deadline Pending" />
                      )}
                    </div>

                    {/* Quick Add Button on Cell Hover */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onScheduleForDate(`${cell.dateKey}T09:00`);
                      }}
                      title={`Add deadline on ${cell.dateKey}`}
                      className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Event Chips List */}
                  <div className="space-y-1 flex-1 overflow-hidden">
                    {dayEvents.slice(0, 3).map((dl) => {
                      const typeMeta = getTypeMeta(dl.type);
                      return (
                        <div
                          key={dl.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDayKey(cell.dateKey);
                            setInspectDeadline(dl);
                          }}
                          className={`p-1 rounded border text-[10px] leading-tight truncate flex items-center gap-1 transition shadow-2xs ${getPriorityStyle(
                            dl.priority,
                            dl.completed
                          )}`}
                          title={`${dl.title} (${dl.caseTitle}) - Due: ${dl.dueDate}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${typeMeta.dotClass}`} />
                          <span className={`font-mono text-[9px] font-bold shrink-0 opacity-85`}>
                            {getTimeString(dl.dueDate)}
                          </span>
                          <span className={`truncate font-medium ${dl.completed ? 'line-through' : 'font-semibold'}`}>
                            {dl.title}
                          </span>
                          {dl.completed && <Check className="w-2.5 h-2.5 text-emerald-600 shrink-0 ml-auto" />}
                        </div>
                      );
                    })}

                    {dayEvents.length > 3 && (
                      <div className="text-[9px] font-bold text-blue-700 hover:underline px-1 py-0.2 bg-blue-50 rounded border border-blue-100 text-center">
                        +{dayEvents.length - 3} more event{dayEvents.length - 3 > 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legend Footer */}
          <div className="p-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-600 flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-bold text-slate-700">Event Types:</span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-purple-500" /> Court Appearance
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-blue-500" /> Court Filing
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500" /> Statute of Limitations
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> Discovery Response
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Client Meeting
              </span>
            </div>

            <div className="flex items-center gap-2 font-mono text-[10px]">
              <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-700 font-bold">Critical</span>
              <span className="px-1.5 py-0.5 rounded bg-orange-100 text-orange-700 font-bold">High</span>
              <span className="px-1.5 py-0.5 rounded bg-blue-100 text-blue-700 font-bold">Medium</span>
            </div>
          </div>
        </div>

        {/* Selected Day Agenda & Docket Inspector Side Panel */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">
                  Day Docket & Milestones
                </span>
                <h3 className="font-bold text-sm text-white">{formattedSelectedDate || 'Select a Day'}</h3>
              </div>

              {selectedDayKey && (
                <button
                  type="button"
                  onClick={() => onScheduleForDate(`${selectedDayKey}T10:00`)}
                  className="px-2.5 py-1 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-2xs transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              )}
            </div>

            {/* Content List */}
            <div className="p-4 space-y-3 max-h-[580px] overflow-y-auto">
              {selectedDayEvents.length === 0 ? (
                <div className="py-8 text-center text-slate-400 space-y-2">
                  <CalendarDays className="w-8 h-8 text-slate-300 mx-auto" />
                  <p className="text-xs font-medium text-slate-600">No deadlines or court hearings scheduled for this date.</p>
                  <button
                    type="button"
                    onClick={() => onScheduleForDate(`${selectedDayKey}T09:00`)}
                    className="text-xs text-blue-600 font-bold hover:underline inline-flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Schedule Deadline for {selectedDayKey}
                  </button>
                </div>
              ) : (
                selectedDayEvents.map((dl) => {
                  const typeMeta = getTypeMeta(dl.type);
                  return (
                    <div
                      key={dl.id}
                      className={`p-3 rounded-xl border transition space-y-2 ${
                        dl.completed
                          ? 'bg-slate-50 border-slate-200 opacity-70'
                          : dl.priority === 'critical'
                          ? 'bg-red-50/40 border-red-200 shadow-2xs'
                          : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs'
                      }`}
                    >
                      {/* Priority & Category Badges */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                              dl.priority === 'critical'
                                ? 'bg-red-100 text-red-700 border-red-300 font-black'
                                : dl.priority === 'high'
                                ? 'bg-orange-100 text-orange-700 border-orange-300 font-bold'
                                : dl.priority === 'medium'
                                ? 'bg-blue-100 text-blue-700 border-blue-300 font-bold'
                                : 'bg-slate-100 text-slate-700 border-slate-300'
                            }`}
                          >
                            {dl.priority}
                          </span>

                          <span
                            className={`text-[9px] font-semibold px-2 py-0.5 rounded-full border flex items-center gap-1 ${typeMeta.badgeClass}`}
                          >
                            {typeMeta.icon}
                            <span>{typeMeta.label}</span>
                          </span>
                        </div>

                        {/* Due Time */}
                        <span className="font-mono text-xs font-bold text-slate-700 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-blue-600" />
                          {getTimeString(dl.dueDate) || 'All Day'}
                        </span>
                      </div>

                      {/* Title & Case */}
                      <div>
                        <h4
                          className={`font-bold text-xs text-slate-900 leading-snug ${
                            dl.completed ? 'line-through text-slate-400' : ''
                          }`}
                        >
                          {dl.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Matter: <strong className="text-slate-800">{dl.caseTitle}</strong>
                        </p>
                        <p className="text-[10px] text-slate-400">Assigned: {dl.assignedTo}</p>
                      </div>

                      {/* Notes / Rationale */}
                      {dl.notes && (
                        <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 italic leading-relaxed">
                          "{dl.notes}"
                        </p>
                      )}

                      {/* Action Footer: Complete Toggle */}
                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={() => onToggleComplete(dl.id)}
                          className={`px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 transition ${
                            dl.completed
                              ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
                          }`}
                        >
                          <CheckCircle2 className={`w-3.5 h-3.5 ${dl.completed ? 'text-emerald-600' : 'text-slate-400'}`} />
                          <span>{dl.completed ? 'Completed ✓' : 'Mark Complete'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setInspectDeadline(dl)}
                          className="text-[11px] text-blue-600 font-semibold hover:underline"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* AI Suggester CTA in sidebar */}
            {onOpenAiPlanner && (
              <div className="p-3.5 bg-gradient-to-br from-indigo-50 via-blue-50 to-white border-t border-slate-200 flex items-center justify-between">
                <div>
                  <span className="font-bold text-indigo-950 text-xs flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                    AI Milestone Assistant
                  </span>
                  <p className="text-[10px] text-slate-500">Auto-docket statutory procedural deadlines</p>
                </div>
                <button
                  type="button"
                  onClick={onOpenAiPlanner}
                  className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-xs font-bold shadow-2xs transition"
                >
                  Generate
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Single Deadline Inspection Popover Modal */}
      {inspectDeadline && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden text-slate-900 animate-in fade-in">
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                  <CalendarIcon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-sm">Case Deadline & Milestone Details</h3>
                  <p className="text-[10px] text-slate-400 font-mono">ID: {inspectDeadline.id}</p>
                </div>
              </div>
              <button
                onClick={() => setInspectDeadline(null)}
                className="p-1 text-slate-400 hover:text-white rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${
                      inspectDeadline.priority === 'critical'
                        ? 'bg-red-100 text-red-700 border-red-300'
                        : inspectDeadline.priority === 'high'
                        ? 'bg-orange-100 text-orange-700 border-orange-300'
                        : 'bg-blue-100 text-blue-700 border-blue-300'
                    }`}
                  >
                    {inspectDeadline.priority} Priority
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 capitalize">
                    {inspectDeadline.type.replace('_', ' ')}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                      inspectDeadline.completed
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                        : 'bg-amber-100 text-amber-800 border-amber-300'
                    }`}
                  >
                    {inspectDeadline.completed ? 'Completed' : 'Pending Action'}
                  </span>
                </div>

                <h2 className="text-base font-black text-slate-900 mt-2">{inspectDeadline.title}</h2>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2">
                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  <div>
                    <span className="text-slate-400 block text-[10px]">Associated Case Matter:</span>
                    <strong className="text-slate-900 block truncate">{inspectDeadline.caseTitle}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Due Date & Time:</span>
                    <strong className="text-blue-700 font-mono block">{inspectDeadline.dueDate}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Assigned Attorney:</span>
                    <strong className="text-slate-900 block">{inspectDeadline.assignedTo}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Event Category:</span>
                    <strong className="text-slate-800 block capitalize">{inspectDeadline.type.replace('_', ' ')}</strong>
                  </div>
                </div>
              </div>

              {inspectDeadline.notes && (
                <div>
                  <span className="text-slate-500 font-bold block mb-1">Procedural Notes & Statutory Rules:</span>
                  <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-xl text-slate-700 italic leading-relaxed">
                    "{inspectDeadline.notes}"
                  </div>
                </div>
              )}

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onToggleComplete(inspectDeadline.id);
                    setInspectDeadline((prev) => (prev ? { ...prev, completed: !prev.completed } : null));
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
                    inspectDeadline.completed
                      ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{inspectDeadline.completed ? 'Mark as Incomplete' : 'Mark as Completed'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setInspectDeadline(null)}
                  className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
