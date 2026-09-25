import React, { useState } from 'react';
import {
  FileText,
  Search,
  UploadCloud,
  FileCheck,
  Download,
  Eye,
  Lock,
  Plus,
  Filter,
  ShieldCheck,
  Scale
} from 'lucide-react';
import { LegalDocument } from '../../../types/dashboard';

interface DocumentsSectionProps {
  documents: LegalDocument[];
  onUploadClick: () => void;
  onDownloadDoc: (doc: LegalDocument) => void;
  onPreviewDoc: (doc: LegalDocument) => void;
}

export const DocumentsSection: React.FC<DocumentsSectionProps> = ({
  documents,
  onUploadClick,
  onDownloadDoc,
  onPreviewDoc
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['All', 'Pleadings', 'Evidence', 'Retainer Agreement', 'Court Order', 'Brief'];

  const filteredDocs = documents.filter((doc) => {
    if (filterCategory !== 'All' && doc.category !== filterCategory) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchTitle = doc.title.toLowerCase().includes(q);
      const matchCase = doc.caseId.toLowerCase().includes(q);
      const matchClient = doc.clientName.toLowerCase().includes(q);
      return matchTitle || matchCase || matchClient;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase tracking-wider mb-1">
            <FileText className="w-4 h-4" />
            <span>Evidentiary Vault & Pleadings</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Legal Documents Repository
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Store, audit, and organize confidential case filings, court orders, discovery disclosures, and retainer agreements.
          </p>
        </div>

        <button
          type="button"
          onClick={onUploadClick}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-semibold text-xs shadow-sm transition shrink-0"
        >
          <UploadCloud className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Mini Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Total Files</span>
          <p className="text-xl font-extrabold text-slate-900 mt-0.5">{documents.length}</p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Pleadings & Briefs</span>
          <p className="text-xl font-extrabold text-blue-900 mt-0.5">
            {documents.filter((d) => d.category === 'Pleadings' || d.category === 'Brief').length}
          </p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Evidence Exhibits</span>
          <p className="text-xl font-extrabold text-indigo-600 mt-0.5">
            {documents.filter((d) => d.category === 'Evidence').length}
          </p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Security Protocol</span>
          <p className="text-sm font-bold text-emerald-700 mt-1 flex items-center gap-1">
            <Lock className="w-3.5 h-3.5" />
            AES-256 Vault
          </p>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        {/* Filter bar */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  filterCategory === cat
                    ? 'bg-white text-blue-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search file name, case, client..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none transition"
            />
          </div>
        </div>

        {/* Documents Rows */}
        <div className="divide-y divide-slate-100">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="p-4 hover:bg-slate-50/70 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-900 shrink-0">
                  <FileText className="w-5 h-5" />
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 hover:text-blue-900 transition cursor-pointer" onClick={() => onPreviewDoc(doc)}>
                    {doc.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-1">
                    <span className="font-mono font-bold text-blue-950 bg-slate-100 px-1.5 py-0.5 rounded text-[11px]">
                      {doc.caseId}
                    </span>
                    <span>Client: <strong className="text-slate-700">{doc.clientName}</strong></span>
                    <span>Size: {doc.fileSize}</span>
                    <span>Filed: {doc.uploadDate}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                <span className="text-[10px] font-bold bg-slate-100 text-slate-700 px-2 py-1 rounded-md">
                  {doc.category}
                </span>
                <button
                  type="button"
                  onClick={() => onPreviewDoc(doc)}
                  className="p-1.5 text-slate-500 hover:text-blue-900 hover:bg-slate-100 rounded-lg transition"
                  title="Preview Document"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => onDownloadDoc(doc)}
                  className="p-1.5 text-slate-500 hover:text-blue-900 hover:bg-slate-100 rounded-lg transition"
                  title="Download File"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
