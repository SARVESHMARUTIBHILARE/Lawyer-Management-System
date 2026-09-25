import React, { useState, useEffect } from 'react';
import {
  Scale,
  User,
  ShieldCheck,
  Award,
  BookOpen,
  DollarSign,
  Clock,
  Briefcase,
  MapPin,
  Phone,
  Mail,
  Edit3,
  Save,
  X,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Lock,
  Eye,
  EyeOff,
  UserCheck,
  Building2,
  Chrome,
  Twitter,
  Instagram,
  FileText,
  Users,
  ArrowRightLeft,
  ChevronDown
} from 'lucide-react';
import {
  LawyerProfile,
  AuthUser,
  Client,
  PersonProfile,
  PersonType
} from '../../../types/dashboard';
import { PhotoUploadField } from '../PhotoUploadField';
import { ProfileAvatar } from '../ProfileAvatar';
import { ClientProfileManager } from './ClientProfileManager';
import {
  convertPersonToLawyerProfile,
  convertPersonToClient,
  saveIndividualPersonProfile
} from '../../../data/personProfiles';

interface ProfileSectionProps {
  lawyer: LawyerProfile;
  currentUser?: AuthUser | null;
  activePerson?: PersonProfile | null;
  allPersons?: PersonProfile[];
  onSwitchPerson?: (person: PersonProfile) => void;
  onSavePersonalProfile?: (updated: PersonProfile) => void;
  lawyersList?: LawyerProfile[];
  clientsList?: Client[];
  initialActiveTab?: 'myProfile' | 'lawyer' | 'client' | 'user';
  selectedClientId?: string | null;
  onSelectLawyer?: (selected: LawyerProfile) => void;
  onAddNewLawyerClick?: () => void;
  onSaveProfile: (updated: LawyerProfile) => void;
  onSaveUser?: (updated: AuthUser) => void;
  onSaveClientProfile?: (updated: Client) => void;
  onAddNewClientClick?: (newClient: Client) => void;
  onDeleteClient?: (clientId: string) => void;
  onScheduleWithClient?: (client: Client) => void;
  onMessageClient?: (client: Client) => void;
  onViewClientCases?: (client: Client) => void;
  onEditProfile?: () => void;
}

const AVATAR_PRESETS = [
  {
    name: 'Ritesh Bitode',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256&h=256'
  },
  {
    name: 'Sarah Vance, Esq.',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256&h=256'
  },
  {
    name: 'Marcus Sterling, Esq.',
    url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256&h=256'
  },
  {
    name: 'Elena Rostova, Esq.',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=256&h=256'
  },
  {
    name: 'David Kim, Esq.',
    url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=256&h=256'
  }
];

export const ProfileSection: React.FC<ProfileSectionProps> = ({
  lawyer,
  currentUser,
  activePerson,
  allPersons = [],
  onSwitchPerson,
  onSavePersonalProfile,
  lawyersList,
  clientsList = [],
  initialActiveTab = 'myProfile',
  selectedClientId,
  onSelectLawyer,
  onAddNewLawyerClick,
  onSaveProfile,
  onSaveUser,
  onSaveClientProfile,
  onAddNewClientClick,
  onDeleteClient,
  onScheduleWithClient,
  onMessageClient,
  onViewClientCases,
  onEditProfile
}) => {
  const [activeTab, setActiveTab] = useState<'myProfile' | 'lawyer' | 'client' | 'user'>(
    initialActiveTab === 'myProfile' || initialActiveTab === 'lawyer' ? 'myProfile' : initialActiveTab
  );
  const [isEditingMyProfile, setIsEditingMyProfile] = useState(false);
  const [isEditingUser, setIsEditingUser] = useState(false);
  const [showQuickSwitchDropdown, setShowQuickSwitchDropdown] = useState(false);

  // Identity computation
  const currentPersonId = activePerson?.id || currentUser?.id || 'usr-active';
  const currentPersonName = activePerson?.name || currentUser?.name || lawyer.name;
  const currentPersonEmail = activePerson?.email || currentUser?.email || lawyer.email;
  const currentPersonRole = activePerson?.role || currentUser?.role || lawyer.title;
  const currentPersonAvatar = activePerson?.avatarUrl || currentUser?.avatarUrl || lawyer.avatarUrl;
  const isClientProfile = activePerson?.personType === 'client' || currentUser?.personType === 'client';

  // Personal Profile Form State
  const [name, setName] = useState(currentPersonName);
  const [role, setRole] = useState(currentPersonRole);
  const [barNumber, setBarNumber] = useState(activePerson?.barNumber || lawyer.barNumber || '');
  const [firmName, setFirmName] = useState(
    activePerson?.firmName || lawyer.firmName || 'JurisPulse Legal Partners LLP'
  );
  const [email, setEmail] = useState(currentPersonEmail);
  const [phone, setPhone] = useState(activePerson?.phone || lawyer.phone || '+1 (212) 555-0100');
  const [avatarUrl, setAvatarUrl] = useState(currentPersonAvatar);
  const [bio, setBio] = useState(
    activePerson?.bio ||
      lawyer.bio ||
      'Practicing legal counsel providing commercial advocacy and regulatory defense.'
  );
  const [officeAddress, setOfficeAddress] = useState(
    activePerson?.officeAddress || lawyer.officeAddress || '30 Rockefeller Plaza, Suite 4400, New York, NY 10112'
  );
  const [hourlyRate, setHourlyRate] = useState<number>(
    activePerson?.hourlyRate || lawyer.hourlyRate || 650
  );
  const [chambersHours, setChambersHours] = useState(
    activePerson?.chambersHours || lawyer.chambersHours || 'Mon - Fri • 09:00 AM - 05:30 PM EST'
  );
  const [consultationSlot, setConsultationSlot] = useState(
    activePerson?.consultationSlot || lawyer.consultationSlot || '45 Minutes (15 Min Buffer)'
  );
  const [trialExperience, setTrialExperience] = useState(
    activePerson?.trialExperience || lawyer.trialExperience || '38 Verdicts & Dispositions'
  );
  const [arbitrationForums, setArbitrationForums] = useState(
    activePerson?.arbitrationForums || lawyer.arbitrationForums || 'AAA, JAMS, ICC Paris'
  );
  const [peerRecognition, setPeerRecognition] = useState(
    activePerson?.peerRecognition || lawyer.peerRecognition || 'Super Lawyers Top 100 Metro'
  );

  // Client-specific state (if client)
  const [company, setCompany] = useState(activePerson?.company || '');
  const [caseType, setCaseType] = useState(activePerson?.caseType || 'Corporate Commercial Matter');
  const [retainerBalance, setRetainerBalance] = useState<number>(
    activePerson?.retainerBalance || 25000
  );

  // Specializations & Court Admissions
  const [specializations, setSpecializations] = useState<string[]>(
    activePerson?.specialization || lawyer.specialization || ['Commercial Litigation']
  );
  const [newTag, setNewTag] = useState('');
  const [courtAdmissions, setCourtAdmissions] = useState<string[]>(
    activePerson?.courtAdmissions ||
      lawyer.courtAdmissions || [
        'New York State Bar (Admitted)',
        'U.S. District Court (S.D.N.Y.)'
      ]
  );
  const [newAdmission, setNewAdmission] = useState('');

  // Passcode state
  const [currentPasscode, setCurrentPasscode] = useState('');
  const [newPasscode, setNewPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);

  // Status feedback
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // CRITICAL FIX: Re-synchronize local form states whenever active person changes!
  useEffect(() => {
    setName(currentPersonName);
    setRole(currentPersonRole);
    setBarNumber(activePerson?.barNumber || lawyer.barNumber || '');
    setFirmName(activePerson?.firmName || lawyer.firmName || 'JurisPulse Legal Partners LLP');
    setEmail(currentPersonEmail);
    setPhone(activePerson?.phone || lawyer.phone || '+1 (212) 555-0100');
    setAvatarUrl(currentPersonAvatar);
    setBio(
      activePerson?.bio ||
        lawyer.bio ||
        'Practicing legal counsel providing commercial advocacy and regulatory defense.'
    );
    setOfficeAddress(
      activePerson?.officeAddress || lawyer.officeAddress || '30 Rockefeller Plaza, Suite 4400, New York, NY 10112'
    );
    setHourlyRate(activePerson?.hourlyRate || lawyer.hourlyRate || 650);
    setChambersHours(activePerson?.chambersHours || lawyer.chambersHours || 'Mon - Fri • 09:00 AM - 05:30 PM EST');
    setConsultationSlot(activePerson?.consultationSlot || lawyer.consultationSlot || '45 Minutes');
    setTrialExperience(activePerson?.trialExperience || lawyer.trialExperience || '');
    setArbitrationForums(activePerson?.arbitrationForums || lawyer.arbitrationForums || '');
    setPeerRecognition(activePerson?.peerRecognition || lawyer.peerRecognition || '');
    setCompany(activePerson?.company || '');
    setCaseType(activePerson?.caseType || 'Corporate Commercial Matter');
    setRetainerBalance(activePerson?.retainerBalance || 25000);
    setSpecializations(activePerson?.specialization || lawyer.specialization || []);
    setCourtAdmissions(activePerson?.courtAdmissions || lawyer.courtAdmissions || []);
    setIsEditingMyProfile(false);
  }, [activePerson, lawyer, currentUser]);

  // Handlers for Specializations
  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    const tag = newTag.trim();
    if (tag && !specializations.includes(tag)) {
      setSpecializations([...specializations, tag]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setSpecializations(specializations.filter((t) => t !== tagToRemove));
  };

  // Handlers for Court Admissions
  const handleAddAdmission = (e: React.FormEvent) => {
    e.preventDefault();
    const adm = newAdmission.trim();
    if (adm && !courtAdmissions.includes(adm)) {
      setCourtAdmissions([...courtAdmissions, adm]);
      setNewAdmission('');
    }
  };

  const handleRemoveAdmission = (admToRemove: string) => {
    setCourtAdmissions(courtAdmissions.filter((a) => a !== admToRemove));
  };

  // Save My Own Profile
  const handleSaveMyProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const updatedPerson: PersonProfile = {
      id: currentPersonId,
      name: name.trim() || currentPersonName,
      email: email.trim() || currentPersonEmail,
      phone: phone.trim(),
      avatarUrl: avatarUrl.trim() || currentPersonAvatar,
      role: role.trim() || currentPersonRole,
      personType: isClientProfile ? 'client' : 'lawyer',
      firmName: firmName.trim(),
      barNumber: !isClientProfile ? barNumber.trim() : undefined,
      specialization: !isClientProfile ? specializations : undefined,
      bio: bio.trim(),
      officeAddress: officeAddress.trim(),
      hourlyRate: !isClientProfile ? Number(hourlyRate) || 650 : undefined,
      courtAdmissions: !isClientProfile ? courtAdmissions : undefined,
      chambersHours: !isClientProfile ? chambersHours.trim() : undefined,
      consultationSlot: !isClientProfile ? consultationSlot.trim() : undefined,
      trialExperience: !isClientProfile ? trialExperience.trim() : undefined,
      arbitrationForums: !isClientProfile ? arbitrationForums.trim() : undefined,
      peerRecognition: !isClientProfile ? peerRecognition.trim() : undefined,

      // Client attributes
      company: isClientProfile ? company.trim() : undefined,
      caseType: isClientProfile ? caseType.trim() : undefined,
      retainerBalance: isClientProfile ? Number(retainerBalance) || 0 : undefined,
      status: activePerson?.status || 'Active',
      totalMatters: activePerson?.totalMatters || 1,
      contactPerson: activePerson?.contactPerson || name.trim(),
      leadCounsel: activePerson?.leadCounsel || 'Sarah Vance, Esq.',
      conflictStatus: activePerson?.conflictStatus || 'Cleared',
      taxOrEntityId: activePerson?.taxOrEntityId,
      preferredChannel: activePerson?.preferredChannel || 'Secure Portal',
      joinedDate: activePerson?.joinedDate || 'Active'
    };

    setTimeout(() => {
      if (onSavePersonalProfile) {
        onSavePersonalProfile(updatedPerson);
      } else {
        saveIndividualPersonProfile(updatedPerson);
        if (!isClientProfile) {
          onSaveProfile(convertPersonToLawyerProfile(updatedPerson));
        }
      }

      setIsSaving(false);
      setIsEditingMyProfile(false);
      setSaveSuccessMsg(`Personal profile for ${updatedPerson.name} saved to your isolated database.`);
      setTimeout(() => setSaveSuccessMsg(null), 4000);
    }, 300);
  };

  // Cancel edit
  const handleCancelMyProfileEdit = () => {
    setName(currentPersonName);
    setRole(currentPersonRole);
    setBarNumber(activePerson?.barNumber || lawyer.barNumber || '');
    setFirmName(activePerson?.firmName || lawyer.firmName || 'JurisPulse Legal Partners LLP');
    setEmail(currentPersonEmail);
    setPhone(activePerson?.phone || lawyer.phone || '');
    setAvatarUrl(currentPersonAvatar);
    setBio(activePerson?.bio || lawyer.bio || '');
    setOfficeAddress(activePerson?.officeAddress || lawyer.officeAddress || '');
    setHourlyRate(activePerson?.hourlyRate || lawyer.hourlyRate || 650);
    setSpecializations(activePerson?.specialization || lawyer.specialization || []);
    setCourtAdmissions(activePerson?.courtAdmissions || lawyer.courtAdmissions || []);
    setCompany(activePerson?.company || '');
    setCaseType(activePerson?.caseType || '');
    setRetainerBalance(activePerson?.retainerBalance || 25000);
    setIsEditingMyProfile(false);
  };

  return (
    <div className="space-y-6">
      {/* Save Success Alert Banner */}
      {saveSuccessMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 shadow-sm flex items-center justify-between gap-3 text-xs font-semibold text-emerald-900 animate-in fade-in slide-in-from-top-2 duration-150">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{saveSuccessMsg}</span>
          </div>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-md">
            Isolated Storage Saved
          </span>
        </div>
      )}

      {/* Header Banner & Tab Switcher */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-blue-900 uppercase tracking-wider mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Individual Identity & Profile Isolation System</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>{currentPersonName}'s Profile</span>
            <span
              className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                isClientProfile
                  ? 'bg-amber-100 text-amber-900 border border-amber-200'
                  : 'bg-blue-100 text-blue-900 border border-blue-200'
              }`}
            >
              {isClientProfile ? 'Client Profile' : 'Attorney Profile'}
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-xl">
            Each person maintains their own separate profile, billing dockets, and credentials. Profiles never overwrite each other.
          </p>
        </div>

        {/* Action Controls & Tab Switcher */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
          {/* Quick Switch Person Dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowQuickSwitchDropdown(!showQuickSwitchDropdown)}
              className="w-full sm:w-auto flex items-center justify-between gap-2 px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800 transition cursor-pointer"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 text-blue-900" />
              <span>Switch Active Person</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showQuickSwitchDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in duration-150">
                <div className="px-3 py-1.5 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Select Person to View Their Profile
                </div>
                <div className="max-h-60 overflow-y-auto divide-y divide-slate-100">
                  {allPersons.map((p) => {
                    const isCurrent = p.id === currentPersonId;
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setShowQuickSwitchDropdown(false);
                          if (onSwitchPerson) onSwitchPerson(p);
                        }}
                        className={`w-full flex items-center justify-between p-2.5 text-left text-xs transition cursor-pointer ${
                          isCurrent ? 'bg-blue-50/70 font-bold text-blue-900' : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <ProfileAvatar
                            src={p.avatarUrl}
                            name={p.name}
                            size="xs"
                            rounded="full"
                            badgeType={p.personType === 'client' ? 'client' : 'lawyer'}
                          />
                          <div className="min-w-0">
                            <p className="truncate text-xs font-semibold">{p.name}</p>
                            <p className="text-[10px] text-slate-400 truncate">{p.role}</p>
                          </div>
                        </div>
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md shrink-0 ${
                            p.personType === 'client'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-slate-100 text-slate-700'
                          }`}
                        >
                          {p.personType === 'client' ? 'Client' : 'Attorney'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Tab Switcher */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 shrink-0">
            <button
              type="button"
              onClick={() => setActiveTab('myProfile')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'myProfile'
                  ? 'bg-white text-blue-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>My Profile</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('lawyer')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'lawyer'
                  ? 'bg-white text-blue-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Attorneys</span>
              {lawyersList && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-900">
                  {lawyersList.length}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('client')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeTab === 'client'
                  ? 'bg-white text-blue-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Clients</span>
              {clientsList && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-900">
                  {clientsList.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: MY PERSONAL PROFILE (ISOLATED TO ACTIVE PERSON) */}
      {/* ======================================================== */}
      {activeTab === 'myProfile' && (
        <div className="space-y-6">
          {/* Identity Isolation Banner */}
          <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-900 text-amber-400 flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-slate-900">
                    Personal Profile of {currentPersonName}
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-900">
                    {isClientProfile ? 'Client Account' : 'Attorney Account'}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-0.5">
                  Strict Profile Isolation Active: Updates made here belong strictly to your account (<strong className="text-slate-800">{currentPersonEmail}</strong>) and will never modify another person's profile.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-[11px] font-semibold text-slate-500">Record ID:</span>
              <code className="text-[11px] font-mono bg-white px-2 py-1 rounded-md border border-slate-200 text-slate-700">
                {currentPersonId}
              </code>
            </div>
          </div>

          {/* Main Hero Card for Active Person */}
          <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
            <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6 justify-between">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                <div className="relative shrink-0">
                  <ProfileAvatar
                    src={isEditingMyProfile ? (avatarUrl || currentPersonAvatar) : currentPersonAvatar}
                    name={isEditingMyProfile ? (name || currentPersonName) : currentPersonName}
                    size="3xl"
                    rounded="2xl"
                    ring="ring-4 ring-white/20 shadow-xl"
                    showBadge
                    badgeType={isClientProfile ? 'client' : 'lawyer'}
                    onEditClick={() => {
                      setIsEditingMyProfile(true);
                      setTimeout(() => {
                        const el = document.getElementById('edit-personal-portrait-container');
                        if (el) {
                          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                      }, 100);
                    }}
                    editTooltip="Click to change your portrait photo"
                    id="profile-hero-avatar"
                  />
                </div>

                <div className="flex-1 text-center md:text-left space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-bold border border-white/15">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>
                      {isClientProfile
                        ? `Client Account • Company: ${activePerson?.company || 'Authorized Entity'}`
                        : `${barNumber || 'NY-BAR Verified'} • Good Standing`}
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                    {currentPersonName}
                  </h1>

                  <p className="text-sm font-semibold text-blue-200">
                    {currentPersonRole} • {firmName}
                  </p>

                  <p className="text-xs text-slate-300 max-w-2xl leading-relaxed pt-1">
                    {bio}
                  </p>

                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-slate-300 pt-2">
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-slate-400" />
                      {currentPersonEmail}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-slate-400" />
                      {phone}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      {officeAddress}
                    </span>
                    {!isClientProfile ? (
                      <span className="flex items-center gap-1.5 text-amber-300 font-bold">
                        <DollarSign className="w-3.5 h-3.5" />${hourlyRate}/hr Consultation Rate
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-amber-300 font-bold">
                        <DollarSign className="w-3.5 h-3.5" />${retainerBalance.toLocaleString()} Retainer Escrow
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Edit Button */}
              <div className="shrink-0 flex items-center gap-2">
                {!isEditingMyProfile ? (
                  <button
                    type="button"
                    onClick={() => setIsEditingMyProfile(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-bold text-xs backdrop-blur-xs border border-white/20 shadow-sm transition cursor-pointer"
                  >
                    <Edit3 className="w-4 h-4 text-amber-300" />
                    <span>Edit My Own Profile</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleCancelMyProfileEdit}
                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-slate-200 transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                    <span>Close Editor</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* IN-PLACE MY PROFILE EDIT FORM */}
          {isEditingMyProfile && (
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-blue-200 shadow-lg space-y-6 animate-in fade-in zoom-in-98 duration-150">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-blue-900 text-white">
                    <Edit3 className="w-4 h-4 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Edit Personal Profile ({currentPersonName})
                    </h3>
                    <p className="text-xs text-slate-500">
                      Save updates to your personal name, contact details, rates, and dockets.
                    </p>
                  </div>
                </div>

                <span className="text-[11px] font-bold text-blue-900 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-100">
                  Isolated Profile Editing
                </span>
              </div>

              <form onSubmit={handleSaveMyProfile} className="space-y-6">
                {/* Photo Upload: File, Presets & URL */}
                <div id="edit-personal-portrait-container">
                  <PhotoUploadField
                    label="Profile Portrait Photo"
                    value={avatarUrl}
                    onChange={(newUrl) => setAvatarUrl(newUrl)}
                    helperText="Upload your individual photo from disk, select a preset, or enter an image URL."
                    idPrefix="edit-personal-portrait"
                  />
                </div>

                {/* Grid: Name, Title/Role, Bar Number/Company, Firm */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="e.g. Ritesh Bitode"
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Role / Position <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      required
                      placeholder="e.g. Managing Legal Counsel"
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none font-medium"
                    />
                  </div>

                  {!isClientProfile ? (
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        State Bar Registration <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        value={barNumber}
                        onChange={(e) => setBarNumber(e.target.value)}
                        required
                        placeholder="e.g. NY-BAR #8291045"
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none font-mono"
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block font-bold text-slate-700 mb-1">
                        Represented Company / Entity
                      </label>
                      <input
                        type="text"
                        value={company}
                        onChange={(e) => setCompany(e.target.value)}
                        placeholder="e.g. Apex Global Industries"
                        className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none font-medium"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Firm / Organization Name
                    </label>
                    <input
                      type="text"
                      value={firmName}
                      onChange={(e) => setFirmName(e.target.value)}
                      placeholder="JurisPulse Legal Practice Group"
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none font-medium"
                    />
                  </div>
                </div>

                {/* Contact Coordinates: Email, Phone, Office Address, Rate */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="counsel@vancelawpartners.com"
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (212) 555-0198"
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Office / Chamber Address
                    </label>
                    <input
                      type="text"
                      value={officeAddress}
                      onChange={(e) => setOfficeAddress(e.target.value)}
                      placeholder="30 Rockefeller Plaza, New York, NY"
                      className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none font-medium"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      {!isClientProfile ? 'Consultation Rate ($/hr)' : 'Retainer Balance ($)'}
                    </label>
                    <div className="relative">
                      <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="number"
                        value={!isClientProfile ? hourlyRate : retainerBalance}
                        onChange={(e) =>
                          !isClientProfile
                            ? setHourlyRate(Number(e.target.value))
                            : setRetainerBalance(Number(e.target.value))
                        }
                        className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none font-bold text-slate-900"
                      />
                    </div>
                  </div>
                </div>

                {/* Professional Biography */}
                <div className="text-xs">
                  <label className="block font-bold text-slate-700 mb-1">
                    Professional Biography & Background
                  </label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Enter practice summary, representative disputes, and experience."
                    className="w-full p-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none font-medium text-slate-800 leading-relaxed"
                  />
                </div>

                {/* Attorney-Specific Details: Specializations & Court Admissions */}
                {!isClientProfile && (
                  <>
                    <div className="text-xs space-y-2">
                      <label className="block font-bold text-slate-700">
                        Practice Specializations & Core Dockets
                      </label>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {specializations.map((spec) => (
                          <span
                            key={spec}
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-blue-50 text-blue-900 font-semibold border border-blue-200"
                          >
                            <span>{spec}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(spec)}
                              className="text-blue-600 hover:text-rose-600 transition"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          placeholder="Add new practice area (e.g. Antitrust Defense)"
                          className="flex-1 p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleAddTag}
                          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-blue-900 text-white font-bold transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Area</span>
                        </button>
                      </div>
                    </div>

                    <div className="text-xs space-y-2">
                      <label className="block font-bold text-slate-700">
                        Court Admissions & Bar Registrations
                      </label>
                      <div className="space-y-1.5 mb-2">
                        {courtAdmissions.map((adm) => (
                          <div
                            key={adm}
                            className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-200"
                          >
                            <span className="font-medium text-slate-800">{adm}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveAdmission(adm)}
                              className="text-slate-400 hover:text-rose-600 transition"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newAdmission}
                          onChange={(e) => setNewAdmission(e.target.value)}
                          placeholder="Add jurisdiction admission (e.g. U.S. Supreme Court Bar)"
                          className="flex-1 p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleAddAdmission}
                          className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-blue-900 text-white font-bold transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Court</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {/* Action Buttons */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleCancelMyProfileEdit}
                    className="px-5 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs transition cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs shadow-md transition disabled:opacity-50 cursor-pointer"
                  >
                    {isSaving ? (
                      <span className="inline-flex items-center gap-2">
                        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Saving Your Profile...</span>
                      </span>
                    ) : (
                      <>
                        <Save className="w-4 h-4" />
                        <span>Save My Isolated Profile</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Details Overview Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            {/* Box 1: Areas of Practice / Matters */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <Briefcase className="w-4 h-4 text-blue-900" />
                <span>{!isClientProfile ? 'Practice Areas & Dockets' : 'Case Matters'}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {specializations.map((item) => (
                  <span
                    key={item}
                    className="px-3 py-1.5 rounded-xl bg-slate-50 text-slate-800 font-semibold border border-slate-200/80"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            {/* Box 2: Jurisdictions & Credentials */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <Scale className="w-4 h-4 text-emerald-600" />
                <span>Court Admissions & Standing</span>
              </div>
              <ul className="space-y-2 text-slate-700">
                {courtAdmissions.map((adm) => (
                  <li key={adm} className="flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{adm}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Box 3: Consultation Slots & Chambers Schedule */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>Chambers Consultation Dockets</span>
              </div>
              <div className="space-y-2">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <span className="text-slate-500">Regular Slot:</span>
                  <span className="font-bold text-slate-900">{consultationSlot}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <span className="text-slate-500">Chambers Hours:</span>
                  <span className="font-bold text-slate-900">{chambersHours}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                  <span className="text-slate-500">Trial Experience:</span>
                  <span className="font-bold text-blue-900">{trialExperience}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: FIRM ATTORNEYS DIRECTORY */}
      {/* ======================================================== */}
      {activeTab === 'lawyer' && (
        <div className="space-y-6">
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-2xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Firm Attorneys Roster ({lawyersList?.length || 0})
                </h3>
                <p className="text-xs text-slate-500">
                  Each attorney maintains their own verified bar credentials, bio, and hourly rates.
                </p>
              </div>

              {onAddNewLawyerClick && (
                <button
                  type="button"
                  onClick={onAddNewLawyerClick}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-900 hover:bg-blue-950 text-white font-bold text-xs shadow-sm transition cursor-pointer"
                >
                  <Plus className="w-4 h-4 text-amber-400" />
                  <span>Register New Attorney</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {(lawyersList || [lawyer]).map((law) => {
                const isSelected =
                  law.email.toLowerCase() === currentPersonEmail.toLowerCase() ||
                  law.barNumber === barNumber;
                return (
                  <div
                    key={law.barNumber || law.email}
                    className={`p-5 rounded-2xl border transition relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-blue-900 bg-blue-50/40 shadow-sm ring-1 ring-blue-900/20'
                        : 'border-slate-200 bg-white hover:border-slate-300 shadow-2xs'
                    }`}
                  >
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <ProfileAvatar
                            src={law.avatarUrl}
                            name={law.name}
                            size="xl"
                            rounded="2xl"
                            ring="ring-2 ring-slate-200"
                            showBadge={isSelected}
                            badgeType="lawyer"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <h4 className="font-extrabold text-slate-900 text-sm">
                                {law.name}
                              </h4>
                              {isSelected && (
                                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-900 text-white">
                                  Your Active Session
                                </span>
                              )}
                            </div>
                            <p className="text-xs font-semibold text-blue-900">{law.title}</p>
                            <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                              {law.barNumber}
                            </p>
                          </div>
                        </div>

                        <span className="text-xs font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-lg">
                          ${law.hourlyRate || 650}/hr
                        </span>
                      </div>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed mb-3">
                        {law.bio || 'Admitted attorney directing commercial litigation and advocacy.'}
                      </p>

                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {law.specialization?.slice(0, 3).map((spec) => (
                          <span
                            key={spec}
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-slate-100 gap-2">
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 truncate">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{law.email}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const matchingPerson = allPersons.find(
                            (p) => p.email.toLowerCase() === law.email.toLowerCase()
                          );
                          if (matchingPerson && onSwitchPerson) {
                            onSwitchPerson(matchingPerson);
                          } else if (onSelectLawyer) {
                            onSelectLawyer(law);
                          }
                          setActiveTab('myProfile');
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                          isSelected
                            ? 'bg-blue-900 text-white'
                            : 'bg-slate-100 hover:bg-blue-900 hover:text-white text-slate-800'
                        }`}
                      >
                        {isSelected ? 'Viewing Own Profile' : `Switch to ${law.name.split(' ')[0]}`}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: CLIENTS DIRECTORY (SAVED IN DATABASE) */}
      {/* ======================================================== */}
      {activeTab === 'client' && (
        <ClientProfileManager
          clients={clientsList}
          lawyers={lawyersList || [lawyer]}
          initialSelectedClientId={selectedClientId}
          onSaveClient={(updated) => {
            if (onSaveClientProfile) {
              onSaveClientProfile(updated);
            }
          }}
          onAddNewClient={(newClient) => {
            if (onAddNewClientClick) {
              onAddNewClientClick(newClient);
            }
          }}
          onDeleteClient={(clientId) => {
            if (onDeleteClient) {
              onDeleteClient(clientId);
            }
          }}
          onScheduleWithClient={onScheduleWithClient}
          onMessageClient={onMessageClient}
          onViewClientCases={onViewClientCases}
          onSwitchToClientSession={(client) => {
            const matchingPerson = allPersons.find(
              (p) => p.email.toLowerCase() === client.email.toLowerCase() || p.id === client.id
            );
            if (matchingPerson && onSwitchPerson) {
              onSwitchPerson(matchingPerson);
              setActiveTab('myProfile');
            }
          }}
        />
      )}
    </div>
  );
};
