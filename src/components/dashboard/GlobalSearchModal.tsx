import React, { useState, useMemo } from 'react';
import { Search, X, Briefcase, FileText, CalendarClock, CreditCard, User, Tag, ArrowRight } from 'lucide-react';
import { CaseFile, ClientDocument, CaseDeadline, Invoice } from '../types';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  cases: CaseFile[];
  documents: ClientDocument[];
  deadlines: CaseDeadline[];
  invoices: Invoice[];
  onSelectResult: (type: 'case' | 'doc' | 'deadline' | 'invoice', item: any) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  cases,
  documents,
  deadlines,
  invoices,
  onSelectResult
}) => {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'cases' | 'docs' | 'deadlines' | 'invoices'>('all');

  const filteredResults = useMemo(() => {
    if (!query.trim()) return { cases: [], documents: [], deadlines: [], invoices: [] };

    const q = query.toLowerCase();

    const matchedCases = cases.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.caseNumber.toLowerCase().includes(q) ||
        c.clientName.toLowerCase().includes(q) ||
        c.practiceArea.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q))
    );

    const matchedDocs = documents.filter(
      (d) =>
        d.fileName.toLowerCase().includes(q) ||
        d.caseTitle.toLowerCase().includes(q) ||
        d.category.toLowerCase().includes(q) ||
        (d.aiSummary && d.aiSummary.toLowerCase().includes(q))
    );

    const matchedDeadlines = deadlines.filter(
      (dl) =>
        dl.title.toLowerCase().includes(q) ||
        dl.caseTitle.toLowerCase().includes(q) ||
        dl.assignedTo.toLowerCase().includes(q) ||
        dl.type.toLowerCase().includes(q)
    );

    const matchedInvoices = invoices.filter(
      (inv) =>
        inv.invoiceNumber.toLowerCase().includes(q) ||
        inv.clientName.toLowerCase().includes(q) ||
        inv.caseTitle.toLowerCase().includes(q)
    );

    return {
      cases: matchedCases,
      documents: matchedDocs,
      deadlines: matchedDeadlines,
      invoices: matchedInvoices
    };
  }, [query, cases, documents, deadlines, invoices]);

  if (!isOpen) return null;

  const totalHits =
    filteredResults.cases.length +
    filteredResults.documents.length +
    filteredResults.deadlines.length +
    filteredResults.invoices.length;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-start justify-center pt-16 px-4">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in duration-200">
        {/* Search Header */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-900">
          <Search className="w-5 h-5 text-amber-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search cases, court numbers, documents, deadlines, invoices..."
            className="flex-1 bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none"
            autoFocus
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-slate-200">
              <X className="w-4 h-4" />
            </button>
          )}
          <button onClick={onClose} className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-200 text-xs font-semibold">
            ESC
          </button>
        </div>

        {/* Category Filters */}
        <div className="px-4 py-2 border-b border-slate-800 bg-slate-900/50 flex gap-2 overflow-x-auto text-xs">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1 rounded-full font-medium transition ${
              selectedCategory === 'all' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            All Results ({totalHits})
          </button>
          <button
            onClick={() => setSelectedCategory('cases')}
            className={`px-3 py-1 rounded-full font-medium transition ${
              selectedCategory === 'cases' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Cases ({filteredResults.cases.length})
          </button>
          <button
            onClick={() => setSelectedCategory('docs')}
            className={`px-3 py-1 rounded-full font-medium transition ${
              selectedCategory === 'docs' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Documents ({filteredResults.documents.length})
          </button>
          <button
            onClick={() => setSelectedCategory('deadlines')}
            className={`px-3 py-1 rounded-full font-medium transition ${
              selectedCategory === 'deadlines' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Deadlines ({filteredResults.deadlines.length})
          </button>
          <button
            onClick={() => setSelectedCategory('invoices')}
            className={`px-3 py-1 rounded-full font-medium transition ${
              selectedCategory === 'invoices' ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Invoices ({filteredResults.invoices.length})
          </button>
        </div>

        {/* Search Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {!query.trim() && (
            <div className="text-center py-12 text-slate-500">
              <Search className="w-10 h-10 mx-auto mb-2 text-slate-600 opacity-50" />
              <p className="text-sm font-medium">Type to search firm database</p>
              <p className="text-xs text-slate-600 mt-1">
                Try searching "Patent", "Merger", "Sophia", "INV-2026", or "Probate"
              </p>
            </div>
          )}

          {query.trim() && totalHits === 0 && (
            <div className="text-center py-12 text-slate-500">
              <p className="text-sm">No records found matching "{query}"</p>
            </div>
          )}

          {/* Cases */}
          {(selectedCategory === 'all' || selectedCategory === 'cases') && filteredResults.cases.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Case Files</p>
              <div className="space-y-1.5">
                {filteredResults.cases.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      onSelectResult('case', c);
                      onClose();
                    }}
                    className="p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 cursor-pointer flex items-center justify-between group transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                        <Briefcase className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-slate-100">{c.title}</span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">
                            {c.caseNumber}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">
                          Client: {c.clientName} • Attorney: {c.assignedLawyerName}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Documents */}
          {(selectedCategory === 'all' || selectedCategory === 'docs') && filteredResults.documents.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Client Documents</p>
              <div className="space-y-1.5">
                {filteredResults.documents.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => {
                      onSelectResult('doc', doc);
                      onClose();
                    }}
                    className="p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 cursor-pointer flex items-center justify-between group transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-semibold text-sm text-slate-100">{doc.fileName}</span>
                        <p className="text-xs text-slate-400">
                          Case: {doc.caseTitle} • Cat: {doc.category} ({doc.fileSize})
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Deadlines */}
          {(selectedCategory === 'all' || selectedCategory === 'deadlines') && filteredResults.deadlines.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Deadlines</p>
              <div className="space-y-1.5">
                {filteredResults.deadlines.map((dl) => (
                  <div
                    key={dl.id}
                    onClick={() => {
                      onSelectResult('deadline', dl);
                      onClose();
                    }}
                    className="p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 cursor-pointer flex items-center justify-between group transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
                        <CalendarClock className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-semibold text-sm text-slate-100">{dl.title}</span>
                        <p className="text-xs text-slate-400">
                          Due: {dl.dueDate} • Assigned: {dl.assignedTo}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-rose-400 transition" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Invoices */}
          {(selectedCategory === 'all' || selectedCategory === 'invoices') && filteredResults.invoices.length > 0 && (
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Invoices</p>
              <div className="space-y-1.5">
                {filteredResults.invoices.map((inv) => (
                  <div
                    key={inv.id}
                    onClick={() => {
                      onSelectResult('invoice', inv);
                      onClose();
                    }}
                    className="p-3 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 cursor-pointer flex items-center justify-between group transition"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-semibold text-sm text-slate-100">
                          {inv.invoiceNumber} - ${inv.totalAmount.toLocaleString()}
                        </span>
                        <p className="text-xs text-slate-400">
                          Client: {inv.clientName} • Due: {inv.dueDate}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 transition" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
