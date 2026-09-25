import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  User,
  Mail,
  Phone,
  Briefcase,
  FileText,
  UploadCloud,
  CheckCircle2,
  Video,
  MapPin,
  Scale,
  Shield,
  Save,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import {
  Appointment,
  LegalCase,
  Client,
  LawyerProfile,
  AppointmentType
} from '../../types/dashboard';

// --- ADD APPOINTMENT MODAL ---
interface AddAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (newApt: Partial<Appointment>) => void;
  clients: Client[];
}

export const AddAppointmentModal: React.FC<AddAppointmentModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  clients
}) => {
  const [clientName, setClientName] = useState(clients[0]?.name || '');
  const [clientEmail, setClientEmail] = useState(clients[0]?.email || '');
  const [clientPhone, setClientPhone] = useState(clients[0]?.phone || '');
  const [date, setDate] = useState('Today');
  const [time, setTime] = useState('10:30 AM');
  const [duration, setDuration] = useState('45 mins');
  const [caseType, setCaseType] = useState('Commercial Litigation');
  const [appointmentType, setAppointmentType] = useState<AppointmentType>(
    'In-person Consultation'
  );
  const [roomOrLink, setRoomOrLink] = useState('Conference Room 4B');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleClientSelect = (name: string) => {
    setClientName(name);
    const found = clients.find((c) => c.name === name);
    if (found) {
      setClientEmail(found.email);
      setClientPhone(found.phone);
      setCaseType(found.caseType);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) return;

    onAdd({
      clientName,
      clientEmail,
      clientPhone,
      date,
      time,
      duration,
      caseType,
      appointmentType,
      roomOrLink,
      notes,
      status: 'Confirmed'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-900 text-amber-300">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Schedule Appointment</h3>
              <p className="text-xs text-slate-500">Book new client consultation or briefing</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs text-slate-700">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Select Client</label>
            <div className="flex gap-2">
              <select
                value={clientName}
                onChange={(e) => handleClientSelect(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-200 bg-white font-medium focus:ring-2 focus:ring-blue-900 focus:outline-none"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name} ({c.company || 'Private Client'})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Date</label>
              <select
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none"
              >
                <option value="Today">Today</option>
                <option value="Tomorrow, Sep 22">Tomorrow, Sep 22</option>
                <option value="Wed, Sep 23">Wed, Sep 23</option>
                <option value="Thu, Sep 24">Thu, Sep 24</option>
                <option value="Fri, Sep 25">Fri, Sep 25</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Time</label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g. 10:30 AM"
                className="w-full p-2.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Appointment Type</label>
              <select
                value={appointmentType}
                onChange={(e) => {
                  const val = e.target.value as AppointmentType;
                  setAppointmentType(val);
                  if (val === 'Video Consultation') {
                    setRoomOrLink('https://vancelaw.secure/meet/' + Math.random().toString(36).substring(7));
                  } else {
                    setRoomOrLink('Conference Room 4B');
                  }
                }}
                className="w-full p-2.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none"
              >
                <option value="In-person Consultation">In-person Consultation</option>
                <option value="Video Consultation">Video Consultation</option>
                <option value="Court Hearing Prep">Court Hearing Prep</option>
                <option value="Deposition Review">Deposition Review</option>
                <option value="Settlement Conference">Settlement Conference</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Duration</label>
              <select
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none"
              >
                <option value="30 mins">30 mins</option>
                <option value="45 mins">45 mins</option>
                <option value="60 mins">60 mins</option>
                <option value="90 mins">90 mins</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Case Type / Matter</label>
            <input
              type="text"
              value={caseType}
              onChange={(e) => setCaseType(e.target.value)}
              placeholder="e.g. Corporate Arbitration"
              className="w-full p-2.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Room or Secure Video URL</label>
            <input
              type="text"
              value={roomOrLink}
              onChange={(e) => setRoomOrLink(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none font-mono text-[11px]"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Counsel Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Pre-meeting briefing topics, document review checklist..."
              className="w-full p-2.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg font-semibold bg-blue-900 hover:bg-blue-950 text-white shadow-xs transition"
            >
              Schedule Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- ADD CLIENT MODAL ---
interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (client: Client) => void;
}

export const AddClientModal: React.FC<AddClientModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [address, setAddress] = useState('');
  const [retainerBalance, setRetainerBalance] = useState(25000);
  const [billingRate, setBillingRate] = useState(650);
  const [leadCounsel, setLeadCounsel] = useState('Sarah Vance, Esq.');
  const [conflictStatus, setConflictStatus] = useState<'Cleared' | 'Pending Review' | 'Waived'>('Cleared');
  const [notes, setNotes] = useState('');
  const [caseType, setCaseType] = useState('Commercial Litigation');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAdd({
      id: `cli-${Date.now()}`,
      name: name.trim(),
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@client.com`,
      phone: phone.trim() || '+1 (212) 555-0100',
      company: company.trim() || undefined,
      address: address.trim() || undefined,
      retainerBalance: Number(retainerBalance) || 25000,
      billingRate: Number(billingRate) || 650,
      leadCounsel,
      conflictStatus,
      notes: notes.trim() || undefined,
      caseType,
      status: 'Active',
      totalMatters: 1,
      joinedDate: 'Sep 2026',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=256'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 my-6">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-900">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Add New Client Profile</h3>
              <p className="text-xs text-slate-500">Register new individual or corporate client profile into database</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs text-slate-700 max-h-[75vh] overflow-y-auto pr-1">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Full Legal Name <span className="text-rose-500">*</span></label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jonathan Vance"
              className="w-full p-2.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none font-semibold"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@domain.com"
                className="w-full p-2.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 (212) 555-0123"
                className="w-full p-2.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Company / Organization</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Apex Industrial Corp"
                className="w-full p-2.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Primary Matter / Case Type</label>
              <select
                value={caseType}
                onChange={(e) => setCaseType(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none"
              >
                <option value="Commercial Litigation">Commercial Litigation</option>
                <option value="Patent & Trademark">Patent & Trademark</option>
                <option value="Corporate Governance">Corporate Governance</option>
                <option value="Trust & Estate Planning">Trust & Estate Planning</option>
                <option value="Employment Restrictive Covenants">Employment Restrictive Covenants</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Office / Mailing Address</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. 100 Park Avenue, 24th Floor, New York, NY"
              className="w-full p-2.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Initial Retainer Deposit ($)</label>
              <input
                type="number"
                min="0"
                step="500"
                value={retainerBalance}
                onChange={(e) => setRetainerBalance(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none font-bold"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Agreed Rate ($/hr)</label>
              <input
                type="number"
                min="100"
                step="25"
                value={billingRate}
                onChange={(e) => setBillingRate(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Assigned Lead Counsel</label>
              <select
                value={leadCounsel}
                onChange={(e) => setLeadCounsel(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none"
              >
                <option value="Sarah Vance, Esq.">Sarah Vance, Esq.</option>
                <option value="Marcus Sterling, Esq.">Marcus Sterling, Esq.</option>
                <option value="Elena Rostova, Esq.">Elena Rostova, Esq.</option>
                <option value="David Kim, Esq.">David Kim, Esq.</option>
              </select>
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Conflict Clearance</label>
              <select
                value={conflictStatus}
                onChange={(e) => setConflictStatus(e.target.value as any)}
                className="w-full p-2.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none"
              >
                <option value="Cleared">Cleared (Verified Clean)</option>
                <option value="Pending Review">Pending Review</option>
                <option value="Waived">Waived by Consent</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Confidential Intake Brief / Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Case history, entity background, or special instructions..."
              className="w-full p-2.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg font-semibold bg-blue-900 hover:bg-blue-950 text-white shadow-xs transition cursor-pointer"
            >
              Save Profile to Database
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- CREATE CASE MODAL ---
interface CreateCaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (newCase: LegalCase) => void;
  clients: Client[];
}

export const CreateCaseModal: React.FC<CreateCaseModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  clients
}) => {
  const [title, setTitle] = useState('');
  const [clientName, setClientName] = useState(clients[0]?.name || '');
  const [caseType, setCaseType] = useState('Commercial Litigation');
  const [courtJurisdiction, setCourtJurisdiction] = useState('U.S. District Court, S.D.N.Y.');
  const [caseStatus, setCaseStatus] = useState<LegalCase['caseStatus']>('Active');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !clientName.trim()) return;

    const caseId = `#CAS-2026-${Math.floor(100 + Math.random() * 900)}`;
    onCreate({
      id: caseId,
      title,
      clientName,
      caseType,
      courtJurisdiction,
      caseStatus,
      lastUpdated: 'Just now',
      leadCounsel: 'Sarah Vance, Esq.',
      hearingDate: 'Nov 2026'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-700">
              <Briefcase className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Create Legal Case</h3>
              <p className="text-xs text-slate-500">Open active court docket or arbitration file</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs text-slate-700">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Case Caption / Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Apex Global vs. Sentinel Horizon Ltd."
              className="w-full p-2.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Client</label>
            <select
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none"
            >
              {clients.map((c) => (
                <option key={c.id} value={c.name}>
                  {c.name} ({c.company || 'Private Client'})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Matter Category</label>
              <select
                value={caseType}
                onChange={(e) => setCaseType(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none"
              >
                <option value="Commercial Litigation">Commercial Litigation</option>
                <option value="Patent Infringement">Patent Infringement</option>
                <option value="Corporate M&A Dispute">Corporate M&A Dispute</option>
                <option value="Probate & Estate">Probate & Estate</option>
                <option value="Arbitration Proceeding">Arbitration Proceeding</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Initial Status</label>
              <select
                value={caseStatus}
                onChange={(e) => setCaseStatus(e.target.value as LegalCase['caseStatus'])}
                className="w-full p-2.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none"
              >
                <option value="Active">Active</option>
                <option value="Discovery">Discovery</option>
                <option value="Pre-Trial">Pre-Trial</option>
                <option value="In Review">In Review</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Court / Jurisdiction</label>
            <input
              type="text"
              value={courtJurisdiction}
              onChange={(e) => setCourtJurisdiction(e.target.value)}
              placeholder="e.g. U.S. District Court, S.D.N.Y."
              className="w-full p-2.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg font-semibold bg-blue-900 hover:bg-blue-950 text-white shadow-xs transition"
            >
              Create Case File
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- UPLOAD DOCUMENT MODAL ---
interface UploadDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUploadSuccess: (filename: string) => void;
  cases: LegalCase[];
}

export const UploadDocumentModal: React.FC<UploadDocumentModalProps> = ({
  isOpen,
  onClose,
  onUploadSuccess,
  cases
}) => {
  const [docTitle, setDocTitle] = useState('');
  const [selectedCase, setSelectedCase] = useState(cases[0]?.id || '');
  const [category, setCategory] = useState('Pleadings');
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalTitle = docTitle || fileName || 'Evidentiary_Filing_Ex_A.pdf';
    onUploadSuccess(finalTitle);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-700">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Upload Legal Document</h3>
              <p className="text-xs text-slate-500">Attach court pleadings, evidence or retainer agreement</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs text-slate-700">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Document Title</label>
            <input
              type="text"
              value={docTitle}
              onChange={(e) => setDocTitle(e.target.value)}
              placeholder="e.g. Motion for Summary Judgment Brief"
              className="w-full p-2.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Assign to Case</label>
              <select
                value={selectedCase}
                onChange={(e) => setSelectedCase(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none font-mono text-[11px]"
              >
                {cases.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.id} ({c.clientName})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none"
              >
                <option value="Pleadings">Pleadings</option>
                <option value="Evidence">Evidence / Exhibit</option>
                <option value="Retainer Agreement">Retainer Agreement</option>
                <option value="Court Order">Court Order</option>
                <option value="Brief">Memorandum of Law</option>
              </select>
            </div>
          </div>

          {/* Drag & Drop Simulation */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              if (e.dataTransfer.files.length > 0) {
                setFileName(e.dataTransfer.files[0].name);
                if (!docTitle) setDocTitle(e.dataTransfer.files[0].name.replace(/\.[^/.]+$/, ''));
              }
            }}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition ${
              isDragging ? 'border-blue-900 bg-blue-50/50' : 'border-slate-200 hover:border-slate-300'
            }`}
          >
            <input
              type="file"
              id="file-upload-input"
              className="hidden"
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  setFileName(e.target.files[0].name);
                  if (!docTitle) setDocTitle(e.target.files[0].name.replace(/\.[^/.]+$/, ''));
                }
              }}
            />
            <label htmlFor="file-upload-input" className="cursor-pointer block">
              <UploadCloud className="w-8 h-8 mx-auto text-blue-900 mb-2 opacity-80" />
              <p className="text-xs font-semibold text-slate-800">
                {fileName ? fileName : 'Click to select or drag & drop document'}
              </p>
              <p className="text-[10px] text-slate-400 mt-1">
                PDF, DOCX, TIFF up to 50MB with automated SHA-256 integrity seal
              </p>
            </label>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg font-semibold bg-blue-900 hover:bg-blue-950 text-white shadow-xs transition"
            >
              Upload Document
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- VIEW APPOINTMENT DETAILS MODAL ---
interface ViewAppointmentModalProps {
  appointment: Appointment | null;
  onClose: () => void;
  onAccept: (id: string) => void;
  onReject: (id: string) => void;
}

export const ViewAppointmentModal: React.FC<ViewAppointmentModalProps> = ({
  appointment,
  onClose,
  onAccept,
  onReject
}) => {
  if (!appointment) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            {appointment.clientAvatar ? (
              <img
                src={appointment.clientAvatar}
                alt={appointment.clientName}
                className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-900 font-bold flex items-center justify-center text-sm">
                {appointment.clientName.charAt(0)}
              </div>
            )}
            <div>
              <h3 className="text-base font-bold text-slate-900">{appointment.clientName}</h3>
              <p className="text-xs text-slate-500">{appointment.caseType}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 space-y-3.5 text-xs text-slate-700">
          <div className="grid grid-cols-2 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-600 block">Date & Time</span>
              <span className="font-semibold text-slate-900 text-xs">
                {appointment.date} at {appointment.time}
              </span>
              <span className="text-[11px] text-slate-500 block">Duration: {appointment.duration}</span>
            </div>

            <div>
              <span className="text-[10px] uppercase font-bold text-slate-600 block">Status</span>
              <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-900">
                {appointment.status}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-600">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>{appointment.clientEmail}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Phone className="w-3.5 h-3.5 text-slate-400" />
              <span>{appointment.clientPhone}</span>
            </div>
            {appointment.roomOrLink && (
              <div className="flex items-center gap-2 text-slate-700 font-mono text-[11px] bg-slate-100/70 p-2 rounded-lg">
                {appointment.appointmentType.includes('Video') ? (
                  <Video className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                ) : (
                  <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                )}
                <span className="truncate">{appointment.roomOrLink}</span>
              </div>
            )}
          </div>

          {appointment.notes && (
            <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 text-slate-700">
              <span className="text-[10px] uppercase font-bold text-blue-900 block mb-1">
                Counsel Briefing Notes
              </span>
              <p className="leading-relaxed">{appointment.notes}</p>
            </div>
          )}

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {appointment.status !== 'Confirmed' && (
                <button
                  type="button"
                  onClick={() => {
                    onAccept(appointment.id);
                    onClose();
                  }}
                  className="px-3.5 py-2 rounded-lg font-semibold bg-emerald-600 hover:bg-emerald-700 text-white transition text-xs flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Accept Appointment</span>
                </button>
              )}

              {appointment.status !== 'Rejected' && (
                <button
                  type="button"
                  onClick={() => {
                    onReject(appointment.id);
                    onClose();
                  }}
                  className="px-3.5 py-2 rounded-lg font-semibold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 transition text-xs flex items-center gap-1.5"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reject Appointment</span>
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- SETTINGS MODAL ---
interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  lawyer: LawyerProfile;
  onSave: (updated: LawyerProfile) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, lawyer, onSave }) => {
  const [name, setName] = useState(lawyer.name);
  const [title, setTitle] = useState(lawyer.title);
  const [barNumber, setBarNumber] = useState(lawyer.barNumber);
  const [email, setEmail] = useState(lawyer.email);
  const [phone, setPhone] = useState(lawyer.phone);
  const [firmName, setFirmName] = useState(lawyer.firmName);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...lawyer,
      name,
      title,
      barNumber,
      email,
      phone,
      firmName
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-900 text-white">
              <Scale className="w-4 h-4 text-amber-300" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Lawyer Practice Settings</h3>
              <p className="text-xs text-slate-500">Chambers profile and appointment credentials</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs text-slate-700">
          <div>
            <label className="block font-semibold text-slate-700 mb-1">Lawyer Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none"
              required
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Title & Practice Role</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Bar Number</label>
              <input
                type="text"
                value={barNumber}
                onChange={(e) => setBarNumber(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none font-mono text-[11px]"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Law Firm Name</label>
              <input
                type="text"
                value={firmName}
                onChange={(e) => setFirmName(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Direct Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Chambers Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-200 bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-semibold text-slate-600 hover:bg-slate-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg font-semibold bg-blue-900 hover:bg-blue-950 text-white shadow-xs transition flex items-center gap-1.5"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- LOGOUT CONFIRMATION MODAL ---
interface LogoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const LogoutModal: React.FC<LogoutModalProps> = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 text-center">
        <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 mx-auto flex items-center justify-center mb-3">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-900">Logout of Chambers?</h3>
        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
          Are you sure you want to end your active counsel session? Your docket and appointments remain safely saved.
        </p>
        <div className="mt-5 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={onClose}
            className="w-1/2 px-4 py-2.5 rounded-xl font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 text-xs transition"
          >
            Stay on Dashboard
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="w-1/2 px-4 py-2.5 rounded-xl font-semibold bg-rose-600 hover:bg-rose-700 text-white text-xs transition shadow-xs"
          >
            Confirm Logout
          </button>
        </div>
      </div>
    </div>
  );
};
