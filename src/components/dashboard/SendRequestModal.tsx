import React, { useState, useMemo } from 'react';
import {
  UserPlus,
  X,
  Shield,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Paperclip,
  Trash2,
  AlertCircle,
  Clock,
  Sparkles,
  Lock,
  DollarSign,
  User,
  Building,
  Calendar,
  Send,
  HelpCircle,
  Eye,
  Check,
  FileSignature,
  Fingerprint,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  Search,
  Scale,
  Zap
} from 'lucide-react';
import {
  PracticeArea,
  ClientRepresentationRequest,
  EvidenceProof,
  User as UserType,
  DigitalConsentRecord,
  CaseFile
} from '../types';
import { performAutomatedConflictCheck } from '../utils/conflictCheck';
import { INITIAL_CASES } from '../data/mockData';

interface SendRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: UserType[];
  cases?: CaseFile[];
  existingRequests?: ClientRepresentationRequest[];
  initialClientName?: string;
  initialClientEmail?: string;
  preselectedLawyerId?: string;
  onSubmitRequest: (request: ClientRepresentationRequest) => void;
}

export const SendRequestModal: React.FC<SendRequestModalProps> = ({
  isOpen,
  onClose,
  users,
  cases = INITIAL_CASES,
  existingRequests = [],
  initialClientName = 'AeroTech Dynamics Global',
  initialClientEmail = 'legal@aerotech-global.com',
  preselectedLawyerId = '',
  onSubmitRequest
}) => {
  if (!isOpen) return null;

  // Attorneys available for selection
  const attorneys = useMemo(() => {
    return users.filter(
      (u) => u.role === 'admin' || u.role === 'partner' || u.role === 'associate'
    );
  }, [users]);

  // Form State
  const [clientName, setClientName] = useState(initialClientName);
  const [clientEmail, setClientEmail] = useState(initialClientEmail);
  const [clientPhone, setClientPhone] = useState('+1 (555) 438-9900');
  const [practiceArea, setPracticeArea] = useState<PracticeArea>('Intellectual Property');
  const [primaryLawyerId, setPrimaryLawyerId] = useState<string>(preselectedLawyerId || '');
  const [targetLawyerIds, setTargetLawyerIds] = useState<string[]>(
    preselectedLawyerId ? [preselectedLawyerId] : []
  );
  const [requestTitle, setRequestTitle] = useState('');
  const [caseSummary, setCaseSummary] = useState('');
  const [opposingParty, setOpposingParty] = useState('');
  const [relatedPartiesInput, setRelatedPartiesInput] = useState('');
  const [incidentDate, setIncidentDate] = useState('');
  const [urgencyLevel, setUrgencyLevel] = useState<
    'Standard' | 'Urgent (Within 48h)' | 'Critical / Immediate Court Filing'
  >('Standard');
  const [estimatedBudget, setEstimatedBudget] = useState('30000');
  const [preferredContactMode, setPreferredContactMode] = useState<'chat' | 'video' | 'phone' | 'in_person'>('chat');
  const [showConflictDetails, setShowConflictDetails] = useState(false);

  // Digital Consent State
  const [digitalConsentAgreed, setDigitalConsentAgreed] = useState(true);
  const [signerName, setSignerName] = useState('Jonathan Vance (Authorized Legal Liaison)');
  const [consentTimestamp, setConsentTimestamp] = useState(() =>
    new Date().toISOString().replace('T', ' ').slice(0, 19)
  );
  const [showConsentTerms, setShowConsentTerms] = useState(false);

  // Evidence list
  const [evidenceList, setEvidenceList] = useState<EvidenceProof[]>([]);

  // Draft Evidence Form
  const [isAddingEvidence, setIsAddingEvidence] = useState(false);
  const [draftEvTitle, setDraftEvTitle] = useState('');
  const [draftEvCategory, setDraftEvCategory] = useState<EvidenceProof['category']>('Contract & Agreement');
  const [draftEvFileName, setDraftEvFileName] = useState('');
  const [draftEvDesc, setDraftEvDesc] = useState('');
  const [draftEvDate, setDraftEvDate] = useState(new Date().toISOString().slice(0, 10));
  const [draftEvConfidential, setDraftEvConfidential] = useState(true);

  // Parse related parties array
  const parsedRelatedParties = useMemo(() => {
    return relatedPartiesInput
      .split(/[,;\n]/)
      .map((p) => p.trim())
      .filter(Boolean);
  }, [relatedPartiesInput]);

  // Automated Real-Time Conflict of Interest Check
  const liveConflictReport = useMemo(() => {
    return performAutomatedConflictCheck({
      clientName,
      opposingParty,
      relatedParties: parsedRelatedParties,
      caseSummary,
      requestTitle,
      cases,
      existingRequests
    });
  }, [clientName, opposingParty, parsedRelatedParties, caseSummary, requestTitle, cases, existingRequests]);

  // Handle digital consent toggle
  const handleToggleConsent = (agreed: boolean) => {
    setDigitalConsentAgreed(agreed);
    if (agreed) {
      setConsentTimestamp(new Date().toISOString().replace('T', ' ').slice(0, 19));
    }
  };

  // Toggle target lawyer
  const handleToggleTargetLawyer = (lawyerId: string) => {
    setTargetLawyerIds((prev) =>
      prev.includes(lawyerId) ? prev.filter((id) => id !== lawyerId) : [...prev, lawyerId]
    );
  };

  // Add evidence draft
  const handleAddEvidence = () => {
    if (!draftEvTitle.trim()) return;

    const newEvidence: EvidenceProof = {
      id: `ev-${Date.now()}`,
      title: draftEvTitle.trim(),
      category: draftEvCategory,
      fileName: draftEvFileName.trim() || `${draftEvTitle.trim().replace(/\s+/g, '_')}_Exhibit.pdf`,
      fileSize: `${(Math.random() * 4 + 1.2).toFixed(1)} MB`,
      fileType: draftEvFileName.endsWith('.xlsx') ? 'xlsx' : draftEvFileName.endsWith('.docx') ? 'docx' : 'pdf',
      description: draftEvDesc.trim() || 'Evidentiary proof submitted by user for legal evaluation.',
      dateOfEvidence: draftEvDate || new Date().toISOString().slice(0, 10),
      confidential: draftEvConfidential,
      uploadedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
    };

    setEvidenceList((prev) => [...prev, newEvidence]);
    setDraftEvTitle('');
    setDraftEvFileName('');
    setDraftEvDesc('');
    setIsAddingEvidence(false);
  };

  // Quick preset sample helper
  const handleAddSampleProof = (type: 'contract' | 'wire' | 'incident' | 'witness') => {
    let sample: EvidenceProof;
    if (type === 'contract') {
      sample = {
        id: `ev-sample-${Date.now()}`,
        title: 'Master Service Agreement & Exclusivity Addendum',
        category: 'Contract & Agreement',
        fileName: 'Executed_Commercial_Contract_Exhibit_A.pdf',
        fileSize: '3.4 MB',
        fileType: 'pdf',
        description: 'Executed commercial agreement with Section 9 non-solicitation and jurisdiction covenants.',
        dateOfEvidence: '2026-03-15',
        confidential: true,
        uploadedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
      };
    } else if (type === 'wire') {
      sample = {
        id: `ev-sample-${Date.now()}`,
        title: 'Escrow Wire Confirmation Receipt ($1.25M)',
        category: 'Financial & Bank Record',
        fileName: 'JPMorgan_Escrow_Wire_Receipt_7749.pdf',
        fileSize: '1.6 MB',
        fileType: 'pdf',
        description: 'Official bank wire confirmation of escrow deposit for contractual milestones.',
        dateOfEvidence: '2026-06-20',
        confidential: true,
        uploadedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
      };
    } else if (type === 'incident') {
      sample = {
        id: `ev-sample-${Date.now()}`,
        title: 'On-Site Inspection Report & Stamped Incident Log',
        category: 'Photo & Visual Proof',
        fileName: 'Municipal_Inspection_Incident_Report.pdf',
        fileSize: '7.8 MB',
        fileType: 'pdf',
        description: 'Official damage inspection records and timestamped photographic evidence.',
        dateOfEvidence: '2026-07-12',
        confidential: false,
        uploadedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
      };
    } else {
      sample = {
        id: `ev-sample-${Date.now()}`,
        title: 'Sworn Witness Affidavit (Notarized)',
        category: 'Witness Statement',
        fileName: 'Notarized_Witness_Affidavit_Deposition.pdf',
        fileSize: '2.2 MB',
        fileType: 'pdf',
        description: 'Notarized sworn statement from direct eyewitness verifying chronological facts.',
        dateOfEvidence: '2026-07-25',
        confidential: true,
        uploadedAt: new Date().toISOString().replace('T', ' ').slice(0, 16)
      };
    }

    setEvidenceList((prev) => [...prev, sample]);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!requestTitle.trim() || !caseSummary.trim()) return;

    const leadLawyer = attorneys.find((a) => a.id === primaryLawyerId);
    const targetNames = targetLawyerIds.map((id) => {
      const found = attorneys.find((a) => a.id === id);
      return found ? `${found.name} (${found.title})` : id;
    });

    const digitalConsentRecord: DigitalConsentRecord = digitalConsentAgreed
      ? {
          agreed: true,
          consentedAt: consentTimestamp || new Date().toISOString().replace('T', ' ').slice(0, 19),
          consentedBy: signerName.trim() || clientName.trim() || 'Authorized Representative',
          signerEmail: clientEmail.trim(),
          signerIp: '192.168.1.188 (Client Vault IP)',
          consentVersion: 'v2026.4 - ESIGN / UETA Digital Legal Intake & Privacy Disclosure',
          consentHash: `SHA256: ${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`,
          acknowledgedTerms: [
            'Authorization for Preliminary Conflict of Interest Clearance and Records Triage',
            'Electronic Records & Digital Signature Consent under ESIGN Act (15 U.S.C. § 7001) & UETA',
            'Privileged & Confidential Transmission of Attached Evidentiary Proof Records',
            'Acknowledgement that formal legal representation commences only upon written attorney acceptance'
          ],
          signatureType: 'electronic_consent_toggle'
        }
      : {
          agreed: false,
          notes: 'Client submitted without digital consent. Formal acceptance locked pending signature.'
        };

    const newReq: ClientRepresentationRequest = {
      id: `req-${Date.now()}`,
      clientName: clientName.trim() || 'Client Entity',
      clientEmail: clientEmail.trim() || 'client@enterprise.com',
      clientPhone: clientPhone.trim(),
      practiceArea,
      preferredLawyerId: primaryLawyerId || undefined,
      preferredLawyerName: leadLawyer ? leadLawyer.name : 'Any Available Senior Counsel',
      targetLawyerIds:
        targetLawyerIds.length > 0 ? targetLawyerIds : primaryLawyerId ? [primaryLawyerId] : undefined,
      targetLawyerNames:
        targetNames.length > 0
          ? targetNames
          : leadLawyer
          ? [leadLawyer.name]
          : ['Firm Senior Partner Review Committee'],
      requestTitle: requestTitle.trim(),
      caseSummary: caseSummary.trim(),
      opposingParty: opposingParty.trim() || undefined,
      relatedParties: parsedRelatedParties.length > 0 ? parsedRelatedParties : undefined,
      incidentDate: incidentDate || undefined,
      urgencyLevel,
      estimatedBudget: parseFloat(estimatedBudget) || 25000,
      evidenceList: evidenceList.length > 0 ? [...evidenceList] : undefined,
      digitalConsent: digitalConsentRecord,
      conflictCheckReport: liveConflictReport,
      submittedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      status: 'pending'
    };

    onSubmitRequest(newReq);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="w-full max-w-3xl bg-white border border-slate-200 rounded-2xl shadow-2xl overflow-hidden text-slate-900 animate-in fade-in my-auto max-h-[94vh] flex flex-col">
        {/* Header */}
        <div className="p-4 sm:p-5 bg-slate-900 text-white flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-base sm:text-lg">
                  Send Representation Request to Lawyers
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-400/30">
                  AES-256 Encrypted
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-400/30 flex items-center gap-1">
                  <Scale className="w-3 h-3" />
                  Auto-Conflict Clearance
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Designate counsel, describe your legal matter, and perform automated ethical conflict-of-interest screening.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleFormSubmit} className="p-4 sm:p-6 space-y-6 overflow-y-auto text-xs flex-1">
          {/* Section 1: Client & Contact Info */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-blue-600" />
                1. Client Entity & Contact Information
              </span>
              <span className="text-[10px] text-slate-500 font-medium">Confidential Attorney-Client Privilege</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1 text-[11px]">Client / Organization Name</label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="e.g. AeroTech Dynamics Global"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-xs shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1 text-[11px]">Primary Contact Email</label>
                <input
                  type="email"
                  required
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="legal@client.org"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-xs shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1 text-[11px]">Contact Phone</label>
                <input
                  type="tel"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="+1 (555) 000-0000"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-xs shadow-2xs"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Choose Lawyers / Counsel */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3.5">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                2. Designate Recipient Lawyers & Legal Team
              </span>
              <span className="text-[10px] text-blue-700 font-semibold bg-blue-50 border border-blue-200 px-2 py-0.5 rounded">
                Select Lead Counsel or Multiple Co-Attorneys
              </span>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1.5 text-[11px]">
                Primary Lead Attorney (Direct Case Lead)
              </label>
              <select
                value={primaryLawyerId}
                onChange={(e) => {
                  setPrimaryLawyerId(e.target.value);
                  if (e.target.value && !targetLawyerIds.includes(e.target.value)) {
                    setTargetLawyerIds((prev) => [...prev, e.target.value]);
                  }
                }}
                className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs shadow-2xs"
              >
                <option value="">-- Any Available Senior Partner / Intake Committee --</option>
                {attorneys.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.name} — {a.title} ({a.department}) • ${a.hourlyRate}/hr
                  </option>
                ))}
              </select>
            </div>

            {/* Individual Lawyer Cards */}
            <div>
              <label className="block text-slate-600 font-semibold mb-2 text-[11px]">
                Or select specific counsel to receive and review this brief:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {attorneys.map((atty) => {
                  const isSelected = targetLawyerIds.includes(atty.id) || primaryLawyerId === atty.id;
                  return (
                    <div
                      key={atty.id}
                      onClick={() => handleToggleTargetLawyer(atty.id)}
                      className={`p-2.5 rounded-xl border cursor-pointer transition flex items-center gap-2.5 ${
                        isSelected
                          ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <img
                        src={atty.avatarUrl}
                        alt={atty.name}
                        className="w-9 h-9 rounded-full object-cover border border-slate-200 shrink-0"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-bold text-slate-900 text-[11px] truncate">{atty.name}</p>
                          {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
                        </div>
                        <p className="text-[10px] text-slate-500 truncate">{atty.title}</p>
                        <p className="text-[9px] text-blue-600 font-semibold truncate">{atty.department}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Section 3: Legal Matter Details */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3.5">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              3. Legal Matter Specification & Overview
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-bold mb-1 text-[11px]">Request / Matter Title</label>
                <input
                  type="text"
                  required
                  value={requestTitle}
                  onChange={(e) => setRequestTitle(e.target.value)}
                  placeholder="e.g. Cross-Border Patent Infringement Defense & Injunction Stay"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-xs shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1 text-[11px]">Practice Area</label>
                <select
                  value={practiceArea}
                  onChange={(e) => setPracticeArea(e.target.value as PracticeArea)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs shadow-2xs"
                >
                  <option value="Intellectual Property">Intellectual Property</option>
                  <option value="Litigation">Litigation & Trial</option>
                  <option value="Corporate">Corporate & Governance</option>
                  <option value="Family Law">Family Law & Estate</option>
                  <option value="Real Estate">Real Estate & Construction</option>
                  <option value="Criminal Defense">Criminal Defense</option>
                  <option value="Tax Law">Tax Law & Compliance</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-700 font-bold mb-1 text-[11px]">
                Statement of Facts & Matter Summary
              </label>
              <textarea
                required
                rows={3}
                value={caseSummary}
                onChange={(e) => setCaseSummary(e.target.value)}
                placeholder="Provide key factual background, core claims, timeline of events, and objectives for representation..."
                className="w-full bg-white border border-slate-300 rounded-lg p-3 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-xs shadow-2xs"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-700 font-bold mb-1 text-[11px]">
                  Adverse / Opposing Entity
                </label>
                <input
                  type="text"
                  value={opposingParty}
                  onChange={(e) => setOpposingParty(e.target.value)}
                  placeholder="e.g. Quantum Systems Inc."
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-xs shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1 text-[11px]">
                  Related Entities / Affiliates
                </label>
                <input
                  type="text"
                  value={relatedPartiesInput}
                  onChange={(e) => setRelatedPartiesInput(e.target.value)}
                  placeholder="e.g. Parent Corp, Co-defendants"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-xs shadow-2xs"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1 text-[11px]">Incident / Critical Date</label>
                <input
                  type="date"
                  value={incidentDate}
                  onChange={(e) => setIncidentDate(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-xs shadow-2xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-slate-700 font-bold mb-1 text-[11px]">Estimated Budget / Retainer</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                  <input
                    type="number"
                    value={estimatedBudget}
                    onChange={(e) => setEstimatedBudget(e.target.value)}
                    placeholder="30000"
                    className="w-full bg-white border border-slate-300 rounded-lg pl-7 pr-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium text-xs shadow-2xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1 text-[11px]">Urgency Level</label>
                <select
                  value={urgencyLevel}
                  onChange={(e) => setUrgencyLevel(e.target.value as any)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 text-xs shadow-2xs"
                >
                  <option value="Standard">Standard (1-3 Business Days Review)</option>
                  <option value="Urgent (Within 48h)">Urgent (Within 48h Assessment)</option>
                  <option value="Critical / Immediate Court Filing">Critical / Immediate Court Injunction</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 4: Automated Conflict of Interest Clearance Engine Live Feedback */}
          <div
            className={`rounded-xl border p-3.5 transition ${
              liveConflictReport.riskLevel === 'critical' || liveConflictReport.riskLevel === 'high'
                ? 'bg-rose-50 border-rose-300 text-rose-950'
                : liveConflictReport.riskLevel === 'medium'
                ? 'bg-amber-50 border-amber-300 text-amber-950'
                : 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    liveConflictReport.riskLevel === 'critical' || liveConflictReport.riskLevel === 'high'
                      ? 'bg-rose-600 text-white'
                      : liveConflictReport.riskLevel === 'medium'
                      ? 'bg-amber-500 text-white'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  <Scale className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-xs uppercase tracking-wide">
                      Automated Conflict of Interest Engine
                    </span>
                    <span
                      className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                        liveConflictReport.riskLevel === 'critical' || liveConflictReport.riskLevel === 'high'
                          ? 'bg-rose-200 text-rose-900 border border-rose-300'
                          : liveConflictReport.riskLevel === 'medium'
                          ? 'bg-amber-200 text-amber-900 border border-amber-300'
                          : 'bg-emerald-200 text-emerald-900 border border-emerald-300'
                      }`}
                    >
                      {liveConflictReport.riskLevel === 'clear'
                        ? 'CLEARED • 0 ADVERSE MATCHES'
                        : `${liveConflictReport.riskLevel.toUpperCase()} RISK • ${liveConflictReport.overallScore}% MATCH`}
                    </span>
                  </div>
                  <p className="text-[11px] opacity-90 mt-0.5">
                    {liveConflictReport.summary}
                  </p>
                </div>
              </div>

              {liveConflictReport.matches.length > 0 && (
                <button
                  type="button"
                  onClick={() => setShowConflictDetails(!showConflictDetails)}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-bold border transition flex items-center gap-1 shrink-0 ${
                    liveConflictReport.riskLevel === 'critical' || liveConflictReport.riskLevel === 'high'
                      ? 'bg-white text-rose-800 border-rose-300 hover:bg-rose-100'
                      : 'bg-white text-amber-800 border-amber-300 hover:bg-amber-100'
                  }`}
                >
                  <Search className="w-3 h-3" />
                  <span>{showConflictDetails ? 'Hide Matches' : `View ${liveConflictReport.matches.length} Match Breakdown`}</span>
                  {showConflictDetails ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                </button>
              )}
            </div>

            {/* Collapsible Match Breakdown */}
            {showConflictDetails && liveConflictReport.matches.length > 0 && (
              <div className="mt-3 pt-3 border-t border-rose-200/60 space-y-2 text-[11px]">
                <div className="font-bold text-xs">Fuzzy Matching & Algorithmic Audit Details:</div>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {liveConflictReport.matches.map((m, idx) => (
                    <div
                      key={idx}
                      className="bg-white/90 p-2.5 rounded-lg border border-rose-200 shadow-2xs space-y-1"
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span className="text-rose-900 flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                          <span>Matched Case: {m.matchedCaseNumber} — {m.matchedCaseTitle}</span>
                        </span>
                        <span className="font-mono text-rose-700 text-[10px] bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">
                          {m.similarityScore}% Similarity
                        </span>
                      </div>
                      <p className="text-slate-700 text-[10px]">{m.description}</p>
                      <div className="flex flex-wrap items-center gap-2 text-[9px] text-slate-500 font-mono pt-1">
                        <span>Levenshtein: {m.algorithmBreakdown.levenshtein}%</span>
                        <span>•</span>
                        <span>Jaro-Winkler: {m.algorithmBreakdown.jaroWinkler}%</span>
                        <span>•</span>
                        <span>Token Overlap: {m.algorithmBreakdown.tokenOverlap}%</span>
                        <span>•</span>
                        <span>N-gram Dice: {m.algorithmBreakdown.ngramDice}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Section 5: Attached Evidentiary Exhibits */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <Paperclip className="w-3.5 h-3.5 text-blue-600" />
                5. Evidentiary Proof Exhibits & Documentation ({evidenceList.length})
              </span>
              <button
                type="button"
                onClick={() => setIsAddingEvidence(!isAddingEvidence)}
                className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-[10px] font-bold transition flex items-center gap-1 self-start sm:self-auto"
              >
                <span>+ Custom Proof Attachment</span>
              </button>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap gap-1.5">
              <span className="text-[10px] text-slate-500 font-semibold self-center mr-1">Quick Sample Exhibits:</span>
              <button
                type="button"
                onClick={() => handleAddSampleProof('contract')}
                className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded text-[10px] font-semibold transition"
              >
                + Commercial Contract Exhibit
              </button>
              <button
                type="button"
                onClick={() => handleAddSampleProof('wire')}
                className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded text-[10px] font-semibold transition"
              >
                + Escrow Wire Receipt ($1.25M)
              </button>
              <button
                type="button"
                onClick={() => handleAddSampleProof('incident')}
                className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded text-[10px] font-semibold transition"
              >
                + Police / Damage Report
              </button>
              <button
                type="button"
                onClick={() => handleAddSampleProof('witness')}
                className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded text-[10px] font-semibold transition"
              >
                + Sworn Witness Affidavit
              </button>
            </div>

            {/* Custom Draft Form */}
            {isAddingEvidence && (
              <div className="p-3.5 bg-white border border-blue-200 rounded-xl space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-bold mb-1 text-[10px]">Evidence Title</label>
                    <input
                      type="text"
                      placeholder="e.g. Master Supply Agreement Exhibit"
                      value={draftEvTitle}
                      onChange={(e) => setDraftEvTitle(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-bold mb-1 text-[10px]">Category</label>
                    <select
                      value={draftEvCategory}
                      onChange={(e) => setDraftEvCategory(e.target.value as any)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs text-slate-900"
                    >
                      <option value="Contract & Agreement">Contract & Agreement</option>
                      <option value="Financial & Bank Record">Financial & Bank Record</option>
                      <option value="Photo & Visual Proof">Photo & Visual Proof</option>
                      <option value="Email & Correspondence">Email & Correspondence</option>
                      <option value="Official / Police Report">Official / Police Report</option>
                      <option value="Witness Statement">Witness Statement</option>
                      <option value="Patent / IP Filing">Patent / IP Filing</option>
                      <option value="Expert Testimony / Other">Expert Testimony / Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1 text-[10px]">Description</label>
                  <textarea
                    rows={2}
                    placeholder="Brief description of what this exhibit proves..."
                    value={draftEvDesc}
                    onChange={(e) => setDraftEvDesc(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs text-slate-900"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={draftEvConfidential}
                      onChange={(e) => setDraftEvConfidential(e.target.checked)}
                      className="rounded text-blue-600"
                    />
                    <span className="text-[10px] font-bold text-slate-700">Attorney-Client Privileged</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAddEvidence}
                    disabled={!draftEvTitle.trim()}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition"
                  >
                    Save & Attach Proof
                  </button>
                </div>
              </div>
            )}

            {/* List of Attached Evidence */}
            {evidenceList.length > 0 && (
              <div className="space-y-1.5">
                {evidenceList.map((ev) => (
                  <div
                    key={ev.id}
                    className="p-2.5 bg-white border border-slate-200 rounded-lg flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <div className="font-bold text-slate-900 truncate">{ev.title}</div>
                      <div className="text-[10px] text-slate-500 font-mono">
                        {ev.category} • {ev.fileName} ({ev.fileSize})
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setEvidenceList((prev) => prev.filter((item) => item.id !== ev.id))}
                      className="p-1 text-slate-400 hover:text-rose-600 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 6: Digital Intake Consent & Authentication */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                <FileSignature className="w-3.5 h-3.5 text-blue-600" />
                6. Digital Intake Consent & Authorization
              </span>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-bold">
                ESIGN & UETA Compliant
              </span>
            </div>

            <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={digitalConsentAgreed}
                  onChange={(e) => handleToggleConsent(e.target.checked)}
                  className="mt-0.5 rounded text-blue-600 focus:ring-blue-500 w-4 h-4"
                />
                <div className="text-[11px] text-slate-700 leading-snug">
                  <span className="font-bold text-slate-900 block">
                    I agree to the Electronic Legal Intake Terms & Consent to Preliminary Conflict Evaluation
                  </span>
                  <span className="text-[10px] text-slate-500">
                    Authorizes JurisPulse counsel to process preliminary facts, conduct fuzzy conflict-of-interest database matching, and securely store exhibits.
                  </span>
                </div>
              </label>

              {digitalConsentAgreed && (
                <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px]">
                  <div>
                    <span className="text-slate-400 block font-semibold">Signatory Authorized Officer:</span>
                    <input
                      type="text"
                      value={signerName}
                      onChange={(e) => setSignerName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded px-2 py-1 text-slate-800 font-semibold"
                    />
                  </div>
                  <div>
                    <span className="text-slate-400 block font-semibold">Consent Timestamp:</span>
                    <span className="font-mono text-slate-700 block py-1">{consentTimestamp}</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button Bar */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-between gap-3">
            <span className="text-[10px] text-slate-500">
              {liveConflictReport.riskLevel === 'critical' ? (
                <span className="text-rose-700 font-bold flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  Direct conflict flagged • Supervisory waiver will be required
                </span>
              ) : (
                'All submissions are protected by attorney-client preliminary inquiry privilege.'
              )}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition"
              >
                <Send className="w-4 h-4" />
                <span>Submit Request & Run Conflict Scan</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
