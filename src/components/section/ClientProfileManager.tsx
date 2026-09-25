import React, { useState, useEffect } from 'react';
import {
  UserCheck,
  Building2,
  Mail,
  Phone,
  MapPin,
  DollarSign,
  Briefcase,
  ShieldCheck,
  Calendar,
  MessageSquare,
  Edit3,
  Save,
  X,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Clock,
  FileText,
  Search,
  Scale,
  ShieldAlert,
  Send,
  Database
} from 'lucide-react';
import { Client, LawyerProfile } from '../../../types/dashboard';
import { PhotoUploadField } from '../PhotoUploadField';
import { ProfileAvatar } from '../ProfileAvatar';

interface ClientProfileManagerProps {
  clients: Client[];
  lawyers: LawyerProfile[];
  initialSelectedClientId?: string | null;
  onSaveClient: (updated: Client) => void;
  onAddNewClient: (newClient: Client) => void;
  onDeleteClient: (clientId: string) => void;
  onScheduleWithClient?: (client: Client) => void;
  onMessageClient?: (client: Client) => void;
  onViewClientCases?: (client: Client) => void;
  onSwitchToClientSession?: (client: Client) => void;
}

const CLIENT_AVATAR_PRESETS = [
  {
    name: 'Arthur Pendelton',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256&h=256'
  },
  {
    name: 'Dr. Helena Rostova',
    url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256&h=256'
  },
  {
    name: 'Marcus Sterling Jr.',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256&h=256'
  },
  {
    name: 'Claire Beauchamp',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256&h=256'
  },
  {
    name: 'Gregory Finch',
    url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=256&h=256'
  }
];

export const ClientProfileManager: React.FC<ClientProfileManagerProps> = ({
  clients,
  lawyers,
  initialSelectedClientId,
  onSaveClient,
  onAddNewClient,
  onDeleteClient,
  onScheduleWithClient,
  onMessageClient,
  onViewClientCases,
  onSwitchToClientSession
}) => {
  const [selectedClientId, setSelectedClientId] = useState<string>(
    initialSelectedClientId || (clients[0]?.id ?? '')
  );
  const [isEditing, setIsEditing] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Active' | 'Prospective' | 'Closed'>('All');

  // Find active client
  const activeClient = clients.find((c) => c.id === selectedClientId) || clients[0];

  // Client Edit / Create Form State
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [caseType, setCaseType] = useState('Commercial Litigation');
  const [status, setStatus] = useState<'Active' | 'Prospective' | 'Closed'>('Active');
  const [totalMatters, setTotalMatters] = useState<number>(1);
  const [retainerBalance, setRetainerBalance] = useState<number>(25000);
  const [billingRate, setBillingRate] = useState<number>(650);
  const [leadCounsel, setLeadCounsel] = useState('');
  const [conflictStatus, setConflictStatus] = useState<'Cleared' | 'Pending Review' | 'Waived'>('Cleared');
  const [taxOrEntityId, setTaxOrEntityId] = useState('');
  const [contactPerson, setContactPerson] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [preferredChannel, setPreferredChannel] = useState<'Email' | 'Phone' | 'Secure Portal' | 'Encrypted Signal'>('Secure Portal');
  const [notes, setNotes] = useState('');
  const [avatar, setAvatar] = useState('');

  // Sync form state when active client changes
  useEffect(() => {
    if (activeClient && !isCreatingNew) {
      setName(activeClient.name || '');
      setCompany(activeClient.company || '');
      setEmail(activeClient.email || '');
      setPhone(activeClient.phone || '');
      setAddress(activeClient.address || '');
      setCaseType(activeClient.caseType || 'Commercial Litigation');
      setStatus(activeClient.status || 'Active');
      setTotalMatters(activeClient.totalMatters || 1);
      setRetainerBalance(activeClient.retainerBalance ?? 25000);
      setBillingRate(activeClient.billingRate ?? 650);
      setLeadCounsel(activeClient.leadCounsel || lawyers[0]?.name || 'Sarah Vance, Esq.');
      setConflictStatus(activeClient.conflictStatus || 'Cleared');
      setTaxOrEntityId(activeClient.taxOrEntityId || '');
      setContactPerson(activeClient.contactPerson || '');
      setEmergencyContact(activeClient.emergencyContact || '');
      setPreferredChannel(activeClient.preferredChannel || 'Secure Portal');
      setNotes(activeClient.notes || '');
      setAvatar(activeClient.avatar || '');
      setIsEditing(false);
    }
  }, [activeClient, isCreatingNew, lawyers]);

  // Handle switching to create mode
  const handleStartCreateNew = () => {
    setIsCreatingNew(true);
    setIsEditing(true);
    setName('');
    setCompany('');
    setEmail('');
    setPhone('');
    setAddress('');
    setCaseType('Corporate M&A Litigation');
    setStatus('Active');
    setTotalMatters(1);
    setRetainerBalance(30000);
    setBillingRate(650);
    setLeadCounsel(lawyers[0]?.name || 'Sarah Vance, Esq.');
    setConflictStatus('Cleared');
    setTaxOrEntityId('');
    setContactPerson('');
    setEmergencyContact('');
    setPreferredChannel('Secure Portal');
    setNotes('Initial client intake dossier initialized.');
    setAvatar(CLIENT_AVATAR_PRESETS[0].url);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setIsCreatingNew(false);
    if (activeClient) {
      setName(activeClient.name || '');
      setCompany(activeClient.company || '');
      setEmail(activeClient.email || '');
      setPhone(activeClient.phone || '');
      setAddress(activeClient.address || '');
      setCaseType(activeClient.caseType || 'Commercial Litigation');
      setStatus(activeClient.status || 'Active');
      setTotalMatters(activeClient.totalMatters || 1);
      setRetainerBalance(activeClient.retainerBalance ?? 25000);
      setBillingRate(activeClient.billingRate ?? 650);
      setLeadCounsel(activeClient.leadCounsel || lawyers[0]?.name || 'Sarah Vance, Esq.');
      setConflictStatus(activeClient.conflictStatus || 'Cleared');
      setTaxOrEntityId(activeClient.taxOrEntityId || '');
      setContactPerson(activeClient.contactPerson || '');
      setEmergencyContact(activeClient.emergencyContact || '');
      setPreferredChannel(activeClient.preferredChannel || 'Secure Portal');
      setNotes(activeClient.notes || '');
      setAvatar(activeClient.avatar || '');
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsSaving(true);

    if (isCreatingNew) {
      const newClientObj: Client = {
        id: `cli-${Date.now()}`,
        name: name.trim(),
        company: company.trim() || undefined,
        email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@client.com`,
        phone: phone.trim() || '+1 (212) 555-0100',
        address: address.trim() || undefined,
        caseType: caseType.trim() || 'General Counsel',
        status,
        totalMatters: Number(totalMatters) || 1,
        retainerBalance: Number(retainerBalance) || 0,
        billingRate: Number(billingRate) || 600,
        leadCounsel: leadCounsel || lawyers[0]?.name || 'Sarah Vance, Esq.',
        conflictStatus,
        taxOrEntityId: taxOrEntityId.trim() || undefined,
        contactPerson: contactPerson.trim() || undefined,
        emergencyContact: emergencyContact.trim() || undefined,
        preferredChannel,
        notes: notes.trim() || undefined,
        avatar: avatar.trim() || CLIENT_AVATAR_PRESETS[0].url,
        joinedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
      };

      setTimeout(() => {
        onAddNewClient(newClientObj);
        setSelectedClientId(newClientObj.id);
        setIsSaving(false);
        setIsEditing(false);
        setIsCreatingNew(false);
        setSaveSuccessMsg(`New client profile "${newClientObj.name}" successfully registered & saved to database.`);
        setTimeout(() => setSaveSuccessMsg(null), 4000);
      }, 300);
    } else if (activeClient) {
      const updatedClientObj: Client = {
        ...activeClient,
        name: name.trim() || activeClient.name,
        company: company.trim() || undefined,
        email: email.trim() || activeClient.email,
        phone: phone.trim() || activeClient.phone,
        address: address.trim() || undefined,
        caseType: caseType.trim() || activeClient.caseType,
        status,
        totalMatters: Number(totalMatters) || activeClient.totalMatters,
        retainerBalance: Number(retainerBalance),
        billingRate: Number(billingRate),
        leadCounsel: leadCounsel || activeClient.leadCounsel,
        conflictStatus,
        taxOrEntityId: taxOrEntityId.trim() || undefined,
        contactPerson: contactPerson.trim() || undefined,
        emergencyContact: emergencyContact.trim() || undefined,
        preferredChannel,
        notes: notes.trim() || undefined,
        avatar: avatar.trim() || activeClient.avatar
      };

      setTimeout(() => {
        onSaveClient(updatedClientObj);
        setIsSaving(false);
        setIsEditing(false);
        setSaveSuccessMsg(`Client profile for "${updatedClientObj.name}" saved to chambers database.`);
        setTimeout(() => setSaveSuccessMsg(null), 4000);
      }, 300);
    }
  };

  const filteredClients = clients.filter((c) => {
    if (statusFilter !== 'All' && c.status !== statusFilter) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        c.name.toLowerCase().includes(q) ||
        (c.company || '').toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        c.caseType.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Save Success Alert Banner */}
      {saveSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-sm flex items-center justify-between gap-3 text-xs font-semibold text-emerald-900 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md flex items-center gap-1">
            <Database className="w-3 h-3 text-emerald-600" />
            <span>Database Synced</span>
          </span>
        </div>
      )}

      {/* Client Roster Switcher Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-900 text-white">
              <UserCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Chambers Client Profiles Database
              </h3>
              <p className="text-xs text-slate-500">
                Select an entity to view confidential profiles, edit retainers, and save profile records.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleStartCreateNew}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs shadow-xs transition cursor-pointer shrink-0"
            >
              <Plus className="w-3.5 h-3.5 text-amber-400" />
              <span>Add New Client Profile</span>
            </button>
          </div>
        </div>

        {/* Search & Filter pills */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-1.5">
            {(['All', 'Active', 'Prospective', 'Closed'] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                  statusFilter === tab
                    ? 'bg-blue-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative flex-1 sm:max-w-xs">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter clients by name, company..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none transition"
            />
          </div>
        </div>

        {/* Client Pills Scroll list */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-1">
          {filteredClients.map((c) => {
            const isSelected = c.id === selectedClientId && !isCreatingNew;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => {
                  setSelectedClientId(c.id);
                  setIsCreatingNew(false);
                  setIsEditing(false);
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer shrink-0 border ${
                  isSelected
                    ? 'bg-blue-900 text-white border-blue-900 shadow-xs ring-1 ring-blue-900'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                <ProfileAvatar
                  src={c.avatar}
                  name={c.name}
                  size="xs"
                  rounded="full"
                  badgeType="client"
                />
                <div className="text-left">
                  <span className="block leading-tight font-bold">{c.name}</span>
                  {c.company && (
                    <span
                      className={`text-[10px] block leading-none truncate max-w-[110px] ${
                        isSelected ? 'text-blue-200' : 'text-slate-400'
                      }`}
                    >
                      {c.company}
                    </span>
                  )}
                </div>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.2 rounded-full ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : c.status === 'Active'
                      ? 'bg-emerald-100 text-emerald-800'
                      : c.status === 'Prospective'
                      ? 'bg-amber-100 text-amber-900'
                      : 'bg-slate-200 text-slate-700'
                  }`}
                >
                  {c.status}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Client Profile Card */}
      {(!isCreatingNew && activeClient) && (
        <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 justify-between">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="relative shrink-0">
                <ProfileAvatar
                  src={activeClient.avatar}
                  name={activeClient.name}
                  size="3xl"
                  rounded="2xl"
                  ring="ring-4 ring-white/20 shadow-xl"
                  showBadge
                  badgeType="client"
                  onEditClick={() => {
                    setIsEditing(true);
                  }}
                  editTooltip="Click to edit client profile & photo"
                />
              </div>

              <div className="flex-1 text-center md:text-left space-y-2">
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                  <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/10 text-amber-300 text-xs font-bold border border-white/15">
                    <Database className="w-3.5 h-3.5" />
                    <span>ID: {activeClient.id} • Saved in Database</span>
                  </span>

                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      activeClient.conflictStatus === 'Cleared'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Conflict: {activeClient.conflictStatus || 'Cleared'}</span>
                  </span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                  {activeClient.name}
                </h1>

                <p className="text-sm font-semibold text-blue-200 flex flex-wrap items-center justify-center md:justify-start gap-2">
                  {activeClient.company && (
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3.5 h-3.5 text-blue-300" />
                      <span>{activeClient.company}</span>
                    </span>
                  )}
                  <span>•</span>
                  <span>{activeClient.caseType}</span>
                </p>

                <p className="text-xs text-slate-300 max-w-2xl leading-relaxed pt-1">
                  {activeClient.notes ||
                    'Corporate client account under legal representation. All filings, retainers, and consultation dockets are active.'}
                </p>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-300 pt-2">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    {activeClient.email}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    {activeClient.phone}
                  </span>
                  {activeClient.address && (
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {activeClient.address}
                    </span>
                  )}
                  <span className="flex items-center gap-1.5 text-amber-300 font-bold">
                    <DollarSign className="w-3.5 h-3.5" />
                    ${(activeClient.retainerBalance ?? 25000).toLocaleString()} Retainer Escrow
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Action Controls */}
            <div className="shrink-0 flex flex-col sm:flex-row items-center gap-2">
              {!isEditing ? (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs backdrop-blur-xs border border-white/20 shadow-sm transition cursor-pointer"
                >
                  <Edit3 className="w-4 h-4 text-amber-300" />
                  <span>Edit Client Profile</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-slate-200 transition cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  <span>Close Editor</span>
                </button>
              )}

              {onSwitchToClientSession && (
                <button
                  type="button"
                  onClick={() => onSwitchToClientSession(activeClient)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition cursor-pointer shadow-xs"
                  title={`Switch active session to ${activeClient.name}'s profile`}
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Switch Session to Client</span>
                </button>
              )}

              {onScheduleWithClient && (
                <button
                  type="button"
                  onClick={() => onScheduleWithClient(activeClient)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition cursor-pointer shadow-xs"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Schedule Consultation</span>
                </button>
              )}

              {onMessageClient && (
                <button
                  type="button"
                  onClick={() => onMessageClient(activeClient)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition cursor-pointer"
                  title="Send Encrypted Client Message"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Message</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* EDIT OR CREATE CLIENT PROFILE FORM */}
      {(isEditing || isCreatingNew) && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-blue-200 shadow-lg space-y-6 animate-in fade-in zoom-in-98 duration-150">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-blue-900 text-white">
                <Edit3 className="w-4 h-4 text-amber-400" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {isCreatingNew ? 'Create New Client Profile' : `Edit Profile: ${name || activeClient?.name}`}
                </h3>
                <p className="text-xs text-slate-500">
                  Fill in client entity credentials, contact channels, retainer agreements, and save directly to the database.
                </p>
              </div>
            </div>

            <span className="text-[11px] font-bold text-blue-900 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100 flex items-center gap-1">
              <Database className="w-3 h-3 text-blue-900" />
              <span>Database Edit Mode</span>
            </span>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            {/* Avatar / Photo selection */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
              <label className="block text-xs font-bold text-slate-700">
                Client Profile Photo or Corporate Logo
              </label>
              <div className="flex flex-wrap items-center gap-3">
                <ProfileAvatar
                  src={avatar || CLIENT_AVATAR_PRESETS[0].url}
                  name={name || 'Client Preview'}
                  size="xl"
                  rounded="2xl"
                  ring="ring-2 ring-blue-900/30 shadow-md"
                  badgeType="client"
                />
                <div className="flex-1 min-w-[200px]">
                  <input
                    type="url"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    placeholder="Paste image URL or choose a preset below..."
                    className="w-full p-2 text-xs rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none"
                  />
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-[10px] text-slate-500 font-semibold">Presets:</span>
                    {CLIENT_AVATAR_PRESETS.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setAvatar(p.url)}
                        className="text-[10px] bg-white hover:bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-slate-700 font-medium cursor-pointer"
                      >
                        {p.name.split(' ')[0]}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Core Entity Information Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Client / Entity Full Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Arthur Pendelton"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Company / Organization
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="e.g. Apex Global Industries"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Relationship Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none font-semibold"
                >
                  <option value="Active">Active (Retained)</option>
                  <option value="Prospective">Prospective (Intake)</option>
                  <option value="Closed">Closed / Concluded</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Primary Case / Matter Type
                </label>
                <input
                  type="text"
                  value={caseType}
                  onChange={(e) => setCaseType(e.target.value)}
                  placeholder="e.g. Corporate M&A Litigation"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none"
                />
              </div>
            </div>

            {/* Contact Channels Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Primary Legal Email <span className="text-rose-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="client@firm.com"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Direct Telephone Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (212) 555-0100"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Preferred Communication Channel
                </label>
                <select
                  value={preferredChannel}
                  onChange={(e) => setPreferredChannel(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none"
                >
                  <option value="Secure Portal">Secure Chambers Portal</option>
                  <option value="Email">Encrypted Email</option>
                  <option value="Phone">Direct Phone / Hotline</option>
                  <option value="Encrypted Signal">Signal / Wire</option>
                </select>
              </div>
            </div>

            {/* Address & Corporate Entity Registration */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Registered Office / Mailing Address
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. One Financial Center, 38th Floor, New York, NY 10005"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Tax / EIN / Entity Registration Number
                </label>
                <input
                  type="text"
                  value={taxOrEntityId}
                  onChange={(e) => setTaxOrEntityId(e.target.value)}
                  placeholder="e.g. EIN #13-9847291"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none font-mono"
                />
              </div>
            </div>

            {/* Financial & Representation Terms */}
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
              <h4 className="text-xs font-bold text-blue-950 uppercase tracking-wider flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <span>Financial Terms & Counsel Assignment</span>
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Retainer Escrow Balance ($)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                    <input
                      type="number"
                      min="0"
                      step="500"
                      value={retainerBalance}
                      onChange={(e) => setRetainerBalance(Number(e.target.value))}
                      className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Agreed Billing Rate ($/hr)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                    <input
                      type="number"
                      min="100"
                      step="25"
                      value={billingRate}
                      onChange={(e) => setBillingRate(Number(e.target.value))}
                      className="w-full pl-7 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Assigned Lead Counsel
                  </label>
                  <select
                    value={leadCounsel}
                    onChange={(e) => setLeadCounsel(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none font-semibold"
                  >
                    {lawyers.map((l) => (
                      <option key={l.barNumber} value={l.name}>
                        {l.name} ({l.title.split(',')[0]})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Conflict Clearance Status
                  </label>
                  <select
                    value={conflictStatus}
                    onChange={(e) => setConflictStatus(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none font-semibold"
                  >
                    <option value="Cleared">Cleared (Verified Clean)</option>
                    <option value="Pending Review">Pending Review</option>
                    <option value="Waived">Waived by Consent</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Designated Contact Person & Emergency Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Designated Contact Person & Title
                </label>
                <input
                  type="text"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  placeholder="e.g. Arthur Pendelton (Chief Legal Officer)"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Emergency Contact Name & Phone
                </label>
                <input
                  type="text"
                  value={emergencyContact}
                  onChange={(e) => setEmergencyContact(e.target.value)}
                  placeholder="e.g. Eleanor Vance - +1 (212) 432-8800"
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none"
                />
              </div>
            </div>

            {/* Confidential Counsel Notes */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Confidential Chambers Counsel Notes & Intake Brief
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter confidential notes, litigation history, background facts, or compliance requirements..."
                className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none text-xs leading-relaxed"
              />
            </div>

            {/* Form Actions: Save & Cancel */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              {!isCreatingNew && activeClient && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Are you sure you want to remove client "${activeClient.name}" from database?`)) {
                      onDeleteClient(activeClient.id);
                    }
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Delete Client Record</span>
                </button>
              )}

              <div className="flex items-center gap-3 ml-auto">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={isSaving}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-xs font-bold text-slate-700 transition cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold shadow-md transition disabled:opacity-60 cursor-pointer"
                >
                  {isSaving ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Saving Profile to Database...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 text-amber-300" />
                      <span>Save Client Profile to Database</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {/* READ-ONLY CLIENT DOSSIER DETAILS */}
      {!isEditing && !isCreatingNew && activeClient && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Engagement & Retainer Information */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Retainer & Representation Terms
                </h3>
              </div>
              <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                IOLTA Escrow Active
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[11px] font-bold text-slate-500 uppercase block">Retainer Balance</span>
                <span className="text-lg font-black text-slate-900 block mt-0.5">
                  ${(activeClient.retainerBalance ?? 25000).toLocaleString()}
                </span>
                <span className="text-[10px] text-emerald-600 font-semibold">Replenished Quarterly</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[11px] font-bold text-slate-500 uppercase block">Hourly Billing Rate</span>
                <span className="text-lg font-black text-blue-900 block mt-0.5">
                  ${activeClient.billingRate ?? 650}/hr
                </span>
                <span className="text-[10px] text-slate-500">Tier-1 Chambers Schedule</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[11px] font-bold text-slate-500 uppercase block">Lead Counsel</span>
                <span className="text-xs font-bold text-slate-900 block mt-1">
                  {activeClient.leadCounsel || 'Sarah Vance, Esq.'}
                </span>
                <span className="text-[10px] text-slate-500">Managing Trial Partner</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[11px] font-bold text-slate-500 uppercase block">Active Legal Matters</span>
                <span className="text-lg font-black text-slate-900 block mt-0.5">
                  {activeClient.totalMatters} {activeClient.totalMatters === 1 ? 'Matter' : 'Matters'}
                </span>
                <span className="text-[10px] text-slate-500">Client since {activeClient.joinedDate}</span>
              </div>
            </div>

            {/* Conflict Clearance Details */}
            <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-900" />
                <div>
                  <p className="font-bold text-blue-950">Chambers Conflict Verification</p>
                  <p className="text-[11px] text-blue-800">
                    Status: <span className="font-bold">{activeClient.conflictStatus || 'Cleared'}</span> (Full ethics search verified)
                  </p>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-blue-900 text-white px-2 py-0.5 rounded-full">
                Verified
              </span>
            </div>
          </div>

          {/* Corporate Entity & Contact Dossier */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-blue-900" />
                <h3 className="text-sm font-bold text-slate-900">
                  Entity Profile & Registered Contacts
                </h3>
              </div>
              <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-0.5 rounded-full">
                {activeClient.taxOrEntityId || 'Registered Entity'}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Registered Address</span>
                <p className="font-semibold text-slate-800 flex items-start gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>{activeClient.address || 'Address on file in confidential vault'}</span>
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Contact Person</span>
                  <p className="font-bold text-slate-800 mt-0.5">
                    {activeClient.contactPerson || activeClient.name}
                  </p>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="text-[10px] font-bold uppercase text-slate-400 block">Preferred Channel</span>
                  <p className="font-bold text-blue-900 mt-0.5">
                    {activeClient.preferredChannel || 'Secure Chambers Portal'}
                  </p>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <span className="text-[10px] font-bold uppercase text-slate-400 block">Emergency Contact</span>
                <p className="font-semibold text-slate-800 mt-0.5">
                  {activeClient.emergencyContact || 'General Counsel emergency desk'}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
