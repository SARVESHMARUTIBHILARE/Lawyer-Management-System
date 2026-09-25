import React, { useState } from 'react';
import {
  CreditCard,
  Search,
  DollarSign,
  Receipt,
  Download,
  Send,
  AlertCircle,
  CheckCircle2,
  Clock,
  Plus,
  ShieldCheck,
  Building
} from 'lucide-react';
import { Invoice } from '../../../types/dashboard';

interface PaymentsSectionProps {
  invoices: Invoice[];
  onCreateInvoice: () => void;
  onDownloadReceipt: (inv: Invoice) => void;
  onSendReminder: (inv: Invoice) => void;
}

export const PaymentsSection: React.FC<PaymentsSectionProps> = ({
  invoices,
  onCreateInvoice,
  onDownloadReceipt,
  onSendReminder
}) => {
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredInvoices = invoices.filter((inv) => {
    if (filterStatus !== 'All' && inv.status !== filterStatus) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchId = inv.id.toLowerCase().includes(q);
      const matchClient = inv.clientName.toLowerCase().includes(q);
      const matchCase = inv.caseId.toLowerCase().includes(q);
      const matchType = inv.type.toLowerCase().includes(q);
      return matchId || matchClient || matchCase || matchType;
    }
    return true;
  });

  const totalBilled = invoices.reduce((acc, curr) => acc + curr.amount, 0);
  const paidBilled = invoices.filter((i) => i.status === 'Paid').reduce((acc, curr) => acc + curr.amount, 0);
  const pendingBilled = invoices.filter((i) => i.status === 'Pending' || i.status === 'Overdue').reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase tracking-wider mb-1">
            <CreditCard className="w-4 h-4" />
            <span>Chambers Trust Accounting & Retainers</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Payments & Retainer Ledger
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Monitor IOLTA trust escrow deposits, hourly consultation invoices, court filing disbursements, and settlement funds.
          </p>
        </div>

        <button
          type="button"
          onClick={onCreateInvoice}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-semibold text-xs shadow-sm transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Create Legal Invoice</span>
        </button>
      </div>

      {/* Mini Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Escrow Retainers</span>
          <p className="text-xl font-extrabold text-emerald-600 mt-0.5">
            ${paidBilled.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Outstanding Invoices</span>
          <p className="text-xl font-extrabold text-amber-600 mt-0.5">
            ${pendingBilled.toLocaleString()}
          </p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">Counsel Hourly Rate</span>
          <p className="text-xl font-extrabold text-slate-900 mt-0.5">$650 / hr</p>
        </div>
        <div className="bg-white p-3.5 rounded-xl border border-slate-200">
          <span className="text-[11px] font-semibold text-slate-500 uppercase">IOLTA Account Status</span>
          <p className="text-xs font-bold text-blue-950 mt-1 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            Audit Verified
          </p>
        </div>
      </div>

      {/* Main Invoices Table Card */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        {/* Filter controls */}
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
            {['All', 'Paid', 'Pending', 'Overdue'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setFilterStatus(st)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  filterStatus === st
                    ? 'bg-white text-blue-900 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search invoice #, client, matter..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none transition"
            />
          </div>
        </div>

        {/* Invoices List */}
        <div className="divide-y divide-slate-100">
          {filteredInvoices.map((inv) => (
            <div
              key={inv.id}
              className="p-4 hover:bg-slate-50/70 transition flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-800 shrink-0">
                  <DollarSign className="w-5 h-5" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-900">
                      {inv.id}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        inv.status === 'Paid'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : inv.status === 'Pending'
                          ? 'bg-amber-100 text-amber-900 border border-amber-200'
                          : 'bg-rose-100 text-rose-800 border border-rose-200'
                      }`}
                    >
                      {inv.status}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold text-slate-900 mt-0.5">
                    {inv.clientName}
                  </h4>

                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 mt-1">
                    <span className="font-mono text-slate-700">{inv.caseId}</span>
                    <span>• {inv.type}</span>
                    {inv.paymentMethod && <span>• {inv.paymentMethod}</span>}
                    <span>• Due: {inv.dueDate}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 self-end md:self-center shrink-0">
                <div className="text-right">
                  <p className="text-base font-extrabold text-slate-900">
                    ${inv.amount.toLocaleString()}.00
                  </p>
                  <p className="text-[11px] text-slate-400">Issued {inv.issueDate}</p>
                </div>

                <div className="flex items-center gap-1.5 pl-2 border-l border-slate-200">
                  <button
                    type="button"
                    onClick={() => onDownloadReceipt(inv)}
                    className="p-1.5 text-slate-500 hover:text-blue-900 hover:bg-slate-100 rounded-lg transition"
                    title="Download Receipt / Invoice PDF"
                  >
                    <Download className="w-4 h-4" />
                  </button>

                  {inv.status !== 'Paid' && (
                    <button
                      type="button"
                      onClick={() => onSendReminder(inv)}
                      className="px-2.5 py-1 text-xs font-semibold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 rounded-lg flex items-center gap-1 transition"
                    >
                      <Send className="w-3 h-3" />
                      <span>Remind</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
