import React, { useState, useRef } from 'react';
import {
  Code2,
  Users,
  Upload,
  Camera,
  Edit3,
  Trash2,
  Plus,
  Sparkles,
  CheckCircle2,
  ShieldCheck,
  Mail,
  Phone,
  ExternalLink,
  Award,
  FileText,
  Search,
  RefreshCw,
  Star,
  GraduationCap,
  Building2,
  UserCheck,
  X,
  Printer,
  ChevronRight,
  HelpCircle,
  FolderGit2
} from 'lucide-react';
import { TeamMemberProfile, PersonProfile } from '../../../types/dashboard';
import { ProfileAvatar } from '../ProfileAvatar';
import {
  getStoredTeamMembers,
  saveTeamMembersRoster,
  updateTeamMemberProfile,
  resetTeamMembersToDefault
} from '../../../data/teamProfilesData';
import { compressImageFile } from '../../../utils/imageOptimizer';

interface TeamSectionProps {
  onSwitchPerson?: (person: PersonProfile) => void;
  activePerson?: PersonProfile | null;
  onShowToast: (message: string, type?: 'success' | 'info' | 'warning') => void;
}

const PRESET_AVATARS = [
  { label: 'Developer 1 (Tech)', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300&h=300' },
  { label: 'Developer 2 (Modern)', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300&h=300' },
  { label: 'Developer 3 (Engineer)', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=300' },
  { label: 'Developer 4 (Tech Lead)', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=300&h=300' },
  { label: 'Developer 5 (Coder)', url: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&q=80&w=300&h=300' },
  { label: 'Developer 6 (Software)', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=300&h=300' },
  { label: 'Developer 7 (Analyst)', url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300&h=300' },
  { label: 'Developer 8 (Architect)', url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=300&h=300' }
];

export const TeamSection: React.FC<TeamSectionProps> = ({
  onSwitchPerson,
  activePerson,
  onShowToast
}) => {
  const [teamMembers, setTeamMembers] = useState<TeamMemberProfile[]>(() => getStoredTeamMembers());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'lead' | 'core'>('all');

  // Photo Upload Modal State
  const [uploadModalMember, setUploadModalMember] = useState<TeamMemberProfile | null>(null);
  const [tempPhotoUrl, setTempPhotoUrl] = useState('');
  const [isDraggingPhoto, setIsDraggingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit Profile Modal State
  const [editingMember, setEditingMember] = useState<TeamMemberProfile | null>(null);
  const [editFormData, setEditFormData] = useState<Partial<TeamMemberProfile>>({});
  const [contributionsInput, setContributionsInput] = useState('');
  const [skillsInput, setSkillsInput] = useState('');

  // Add Member Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newMemberForm, setNewMemberForm] = useState<Partial<TeamMemberProfile>>({
    name: '',
    enrollmentNo: '',
    role: 'Software Developer',
    email: '',
    phone: '',
    department: 'Computer Engineering',
    institution: 'Engineering Institute of Technology',
    bio: '',
    avatarUrl: PRESET_AVATARS[0].url,
    contributions: ['System Engineering & Module Implementation'],
    skills: ['React', 'TypeScript', 'Tailwind CSS']
  });

  // Project Report / Certificate Modal
  const [isReportOpen, setIsReportOpen] = useState(false);

  // Filtered members
  const filteredMembers = teamMembers.filter((m) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      m.name.toLowerCase().includes(q) ||
      m.enrollmentNo.toLowerCase().includes(q) ||
      m.role.toLowerCase().includes(q) ||
      m.skills.some((s) => s.toLowerCase().includes(q));

    if (!matchesSearch) return false;
    if (filterRole === 'lead') return !!m.isLeadDeveloper;
    if (filterRole === 'core') return !m.isLeadDeveloper;
    return true;
  });

  // Handle Photo File Upload
  const handlePhotoFileChange = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      onShowToast('Please choose a valid image file (PNG, JPG, WebP).', 'warning');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      onShowToast('File size is larger than 15MB. Please choose a smaller image.', 'warning');
      return;
    }

    try {
      const compressed = await compressImageFile(file, 260, 260, 0.78);
      setTempPhotoUrl(compressed);
      onShowToast('Photo compressed and loaded into preview. Click "Save Photo" to apply.', 'info');
    } catch (err) {
      onShowToast('Failed to process the image file.', 'warning');
    }
  };

  // Save Uploaded Photo
  const handleSavePhoto = () => {
    if (!uploadModalMember) return;
    if (!tempPhotoUrl || tempPhotoUrl.trim() === '') {
      onShowToast('Please upload or select a valid photo first.', 'warning');
      return;
    }

    const updated = updateTeamMemberProfile(uploadModalMember.id, {
      avatarUrl: tempPhotoUrl.trim()
    });
    setTeamMembers(updated);

    // If this member matches the active person, sync active person photo too
    if (activePerson && (activePerson.name.toLowerCase() === uploadModalMember.name.toLowerCase() || activePerson.email.toLowerCase() === uploadModalMember.email.toLowerCase())) {
      const syncedActive: PersonProfile = {
        ...activePerson,
        avatarUrl: tempPhotoUrl.trim()
      };
      if (onSwitchPerson) {
        onSwitchPerson(syncedActive);
      }
    }

    onShowToast(`Photo updated successfully for ${uploadModalMember.name}!`, 'success');
    setUploadModalMember(null);
    setTempPhotoUrl('');
  };

  // Open Edit Modal
  const handleOpenEditModal = (member: TeamMemberProfile) => {
    setEditingMember(member);
    setEditFormData({ ...member });
    setContributionsInput(member.contributions.join('\n'));
    setSkillsInput(member.skills.join(', '));
  };

  // Save Edit Profile
  const handleSaveEditProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember) return;

    const contribArray = contributionsInput
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const skillsArray = skillsInput
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const updatedData: Partial<TeamMemberProfile> = {
      ...editFormData,
      contributions: contribArray.length > 0 ? contribArray : editingMember.contributions,
      skills: skillsArray.length > 0 ? skillsArray : editingMember.skills
    };

    const updated = updateTeamMemberProfile(editingMember.id, updatedData);
    setTeamMembers(updated);
    onShowToast(`Profile updated for ${editFormData.name || editingMember.name}!`, 'success');
    setEditingMember(null);
  };

  // Handle Add New Member
  const handleAddMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemberForm.name || !newMemberForm.enrollmentNo) {
      onShowToast('Name and Enrollment / Roll Number are required.', 'warning');
      return;
    }

    const newMember: TeamMemberProfile = {
      id: `dev-${Date.now()}`,
      name: newMemberForm.name.trim(),
      enrollmentNo: newMemberForm.enrollmentNo.trim(),
      role: newMemberForm.role || 'Project Developer',
      isLeadDeveloper: !!newMemberForm.isLeadDeveloper,
      avatarUrl: newMemberForm.avatarUrl || PRESET_AVATARS[0].url,
      email: newMemberForm.email || `${newMemberForm.name.toLowerCase().replace(/\s+/g, '.')}@student.institute.edu`,
      phone: newMemberForm.phone || '+91 98000 00000',
      department: newMemberForm.department || 'Computer Engineering',
      institution: newMemberForm.institution || 'Engineering Institute of Technology',
      bio: newMemberForm.bio || 'Project contributor to JurisPulse Legal Practice Management System.',
      contributions: newMemberForm.contributions || ['System Implementation & Module Design'],
      skills: newMemberForm.skills || ['React', 'TypeScript', 'Tailwind CSS'],
      joinedDate: 'Project Contributor'
    };

    const updated = [...teamMembers, newMember];
    setTeamMembers(updated);
    saveTeamMembersRoster(updated);
    onShowToast(`Added new developer profile for ${newMember.name}!`, 'success');
    setIsAddModalOpen(false);
  };

  // Handle Switch to Team Member
  const handleSwitchToTeamMember = (member: TeamMemberProfile) => {
    if (!onSwitchPerson) return;
    const person: PersonProfile = {
      id: member.id,
      name: member.name,
      email: member.email,
      phone: member.phone || '+91 98000 00000',
      avatarUrl: member.avatarUrl,
      role: `${member.role} (Roll: ${member.enrollmentNo})`,
      personType: 'lawyer',
      firmName: 'JurisPulse Engineering Chambers LLP',
      barNumber: `STUDENT-ID #${member.enrollmentNo}`,
      specialization: member.skills,
      bio: member.bio,
      officeAddress: `${member.department}, ${member.institution}`
    };
    onSwitchPerson(person);
    onShowToast(`Switched active session to ${member.name} (${member.enrollmentNo})!`, 'success');
  };

  // Handle Reset to Default
  const handleResetTeam = () => {
    if (window.confirm('Reset team roster to original 4 project developers?')) {
      const reset = resetTeamMembersToDefault();
      setTeamMembers(reset);
      onShowToast('Team roster reset to default project creators.', 'info');
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 text-white/5 pointer-events-none">
          <Code2 className="w-full h-full" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2.5 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs text-xs font-semibold text-amber-300 border border-white/15">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Project Team & Engineering Roster</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              Meet Our Team / Project Team
            </h1>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-medium">
              The team behind the development and implementation of this project.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-400/20 text-amber-200 text-xs font-semibold border border-amber-400/30">
                <Star className="w-3.5 h-3.5 text-amber-400" />
                Developer / Project Developer: Bhilare Sarvesh (240860131012)
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-400/20 text-blue-200 text-xs font-semibold border border-blue-400/30">
                <Users className="w-3.5 h-3.5 text-blue-300" />
                Project Team: 4 Members
              </span>
            </div>
          </div>

          <div className="flex flex-wrap sm:flex-nowrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => setIsReportOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition border border-white/20 backdrop-blur-xs cursor-pointer shadow-xs"
              title="View and print Project Team Report & Credential Sheet"
            >
              <FileText className="w-4 h-4 text-amber-300" />
              <span>Project Credential Sheet</span>
            </button>

            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-500 text-slate-950 text-xs font-bold transition shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Member</span>
            </button>
          </div>
        </div>
      </div>

      {/* Metric Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-blue-900" />
            Total Team
          </div>
          <div className="text-xl sm:text-2xl font-black text-slate-900 mt-1 font-mono">
            {teamMembers.length} Members
          </div>
          <p className="text-[11px] text-slate-500 mt-0.5">Engineering & QA</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-amber-600" />
            Project Lead
          </div>
          <div className="text-sm sm:text-base font-black text-slate-900 mt-1 truncate">
            Bhilare Sarvesh
          </div>
          <p className="text-[11px] text-amber-700 font-mono mt-0.5">ID: 240860131012</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <FolderGit2 className="w-3.5 h-3.5 text-emerald-600" />
            Core Stack
          </div>
          <div className="text-sm sm:text-base font-black text-slate-900 mt-1 truncate">
            React 18 + TS + Tailwind
          </div>
          <p className="text-[11px] text-emerald-700 font-medium mt-0.5">Vite + Express</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5 text-indigo-600" />
            Photo Storage
          </div>
          <div className="text-sm sm:text-base font-black text-slate-900 mt-1">
            Local + Real-Time
          </div>
          <p className="text-[11px] text-indigo-700 font-medium mt-0.5">Persistent in Browser</p>
        </div>
      </div>

      {/* Search, Filter & Utility Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by developer name, enrollment ID (e.g. 240860131012), or skills..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-900 focus:border-transparent bg-slate-50/50"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setFilterRole('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              filterRole === 'all'
                ? 'bg-blue-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Members ({teamMembers.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterRole('lead')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              filterRole === 'lead'
                ? 'bg-amber-500 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Lead Developer
          </button>
          <button
            type="button"
            onClick={() => setFilterRole('core')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
              filterRole === 'core'
                ? 'bg-blue-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Core Team
          </button>

          <button
            type="button"
            onClick={handleResetTeam}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition cursor-pointer"
            title="Reset roster to default project creators"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Team Member Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredMembers.map((member) => {
          const isLead = member.isLeadDeveloper;
          const isActiveSession =
            activePerson &&
            (activePerson.name.toLowerCase() === member.name.toLowerCase() ||
              activePerson.email.toLowerCase() === member.email.toLowerCase());

          return (
            <div
              key={member.id}
              className={`bg-white rounded-3xl border transition-all duration-200 shadow-xs hover:shadow-md flex flex-col justify-between overflow-hidden relative ${
                isLead
                  ? 'border-amber-300 ring-2 ring-amber-400/20'
                  : 'border-slate-200 hover:border-blue-900/30'
              }`}
            >
              {/* Card Header Tag */}
              <div className="px-6 pt-6 pb-4">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-4">
                    {/* Member Photo with Interactive Upload Button */}
                    <div className="relative group shrink-0">
                      <ProfileAvatar
                        src={member.avatarUrl}
                        name={member.name}
                        size="2xl"
                        rounded="2xl"
                        ring={
                          isLead
                            ? 'ring-4 ring-amber-400/40 shadow-md'
                            : 'ring-3 ring-slate-200 shadow-sm'
                        }
                        showBadge
                        badgeType={isLead ? 'lawyer' : 'online'}
                      />

                      {/* Photo Upload Trigger Overlay */}
                      <button
                        type="button"
                        onClick={() => {
                          setUploadModalMember(member);
                          setTempPhotoUrl(member.avatarUrl);
                        }}
                        className="absolute inset-0 bg-slate-900/60 text-white rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 text-[10px] font-bold cursor-pointer"
                        title="Click to upload your photo"
                      >
                        <Camera className="w-5 h-5 text-amber-300" />
                        <span>Change</span>
                      </button>
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        {isLead ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold border border-amber-300">
                            <Star className="w-3 h-3 fill-amber-500 text-amber-600" />
                            Lead Developer
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-900 text-[10px] font-bold border border-blue-200">
                            <Code2 className="w-3 h-3" />
                            Core Team Member
                          </span>
                        )}

                        {isActiveSession && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Active Profile
                          </span>
                        )}
                      </div>

                      <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-1 truncate">
                        {member.name}
                      </h2>

                      {/* Explicit Roll / Enrollment Number Badge */}
                      <div className="mt-1 flex items-center gap-1.5">
                        <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-800 border border-slate-200">
                          ID: {member.enrollmentNo}
                        </span>
                      </div>

                      <p className="text-xs font-medium text-blue-950 mt-1">
                        {member.role}
                      </p>
                    </div>
                  </div>

                  {/* Edit / Quick Photo buttons */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        setUploadModalMember(member);
                        setTempPhotoUrl(member.avatarUrl);
                      }}
                      className="p-2 text-slate-500 hover:text-blue-900 hover:bg-blue-50 rounded-xl transition cursor-pointer"
                      title="Upload new photo"
                    >
                      <Upload className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(member)}
                      className="p-2 text-slate-500 hover:text-blue-900 hover:bg-blue-50 rounded-xl transition cursor-pointer"
                      title="Edit developer details"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Bio text */}
                <p className="text-xs text-slate-600 leading-relaxed bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                  {member.bio}
                </p>

                {/* Key Contributions */}
                <div className="mt-4 space-y-1.5">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    Project Contributions
                  </div>
                  <ul className="space-y-1 text-xs text-slate-700">
                    {member.contributions.map((c, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-900 shrink-0 mt-1.5" />
                        <span className="leading-snug">{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Technical Skills */}
                <div className="mt-4">
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Technologies & Skills
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {member.skills.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Contact info row */}
                <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-600">
                  <div className="flex items-center gap-1.5 truncate">
                    <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{member.email}</span>
                  </div>
                  {member.phone && (
                    <div className="flex items-center gap-1.5 truncate">
                      <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{member.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setUploadModalMember(member);
                    setTempPhotoUrl(member.avatarUrl);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white hover:bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200 transition shadow-2xs cursor-pointer"
                >
                  <Camera className="w-3.5 h-3.5 text-blue-900" />
                  <span>Upload Photo</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSwitchToTeamMember(member)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer ${
                    isActiveSession
                      ? 'bg-emerald-600 text-white'
                      : 'bg-blue-900 hover:bg-blue-950 text-white'
                  }`}
                  title="Make this member the active user session"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>{isActiveSession ? 'Active Session' : 'Set as Active'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredMembers.length === 0 && (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200 space-y-3">
          <Code2 className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-800">No matching team members found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Try adjusting your search query or reset the team roster back to the original 4 project developers.
          </p>
          <button
            type="button"
            onClick={handleResetTeam}
            className="px-4 py-2 rounded-xl bg-blue-900 text-white text-xs font-bold shadow-xs cursor-pointer"
          >
            Reset to Original Developers
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 1: PHOTO UPLOAD & PRESET SELECTION MODAL */}
      {/* ========================================================================= */}
      {uploadModalMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-100 text-blue-900">
                  <Camera className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Upload Photo for {uploadModalMember.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-mono">
                    ID: {uploadModalMember.enrollmentNo}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setUploadModalMember(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* Live Preview Center */}
              <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <ProfileAvatar
                  src={tempPhotoUrl || uploadModalMember.avatarUrl}
                  name={uploadModalMember.name}
                  size="3xl"
                  rounded="2xl"
                  ring="ring-4 ring-blue-900/20 shadow-md"
                  showBadge
                  badgeType={uploadModalMember.isLeadDeveloper ? 'lawyer' : 'online'}
                />
                <span className="text-xs font-bold text-slate-800 mt-2.5">
                  {uploadModalMember.name}
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  Live Preview
                </span>
              </div>

              {/* Upload Option 1: File Drag & Drop / Device Browser */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Option 1: Upload Image from Computer / Phone
                </label>
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingPhoto(true);
                  }}
                  onDragLeave={() => setIsDraggingPhoto(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDraggingPhoto(false);
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      handlePhotoFileChange(e.dataTransfer.files[0]);
                    }
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition ${
                    isDraggingPhoto
                      ? 'border-blue-900 bg-blue-50/70'
                      : 'border-slate-300 hover:border-blue-900 hover:bg-slate-50/60'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handlePhotoFileChange(e.target.files[0]);
                      }
                    }}
                  />
                  <Upload className="w-8 h-8 text-blue-900 mx-auto mb-2" />
                  <p className="text-xs font-bold text-slate-800">
                    Click to browse or drag and drop your photo here
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Supports PNG, JPG, JPEG, WebP • Converted and stored directly
                  </p>
                </div>
              </div>

              {/* Upload Option 2: Image Web URL */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Option 2: Paste Direct Image URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={tempPhotoUrl}
                    onChange={(e) => setTempPhotoUrl(e.target.value)}
                    placeholder="https://example.com/my-photo.jpg"
                    className="flex-1 p-2.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-900"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (tempPhotoUrl) {
                        onShowToast('Image URL preview loaded.', 'info');
                      }
                    }}
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold cursor-pointer"
                  >
                    Preview
                  </button>
                </div>
              </div>

              {/* Upload Option 3: Presets Gallery */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">
                  Option 3: Choose from Curated Developer Avatars
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {PRESET_AVATARS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setTempPhotoUrl(preset.url);
                        onShowToast(`Selected ${preset.label}`, 'info');
                      }}
                      className={`p-1.5 rounded-xl border transition flex flex-col items-center gap-1 cursor-pointer ${
                        tempPhotoUrl === preset.url
                          ? 'border-blue-900 bg-blue-50 ring-2 ring-blue-900/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.label}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <span className="text-[9px] font-medium text-slate-600 truncate max-w-full">
                        {preset.label.split(' ')[0]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setUploadModalMember(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSavePhoto}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold transition shadow-xs cursor-pointer"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save Photo</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: EDIT DEVELOPER PROFILE MODAL */}
      {/* ========================================================================= */}
      {editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-blue-100 text-blue-900">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Edit Profile: {editingMember.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 font-mono">
                    ID: {editingMember.enrollmentNo}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingMember(null)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEditProfile}>
              <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={editFormData.name || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Enrollment / Roll Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={editFormData.enrollmentNo || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, enrollmentNo: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 font-mono font-bold focus:ring-2 focus:ring-blue-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Project Role & Title
                    </label>
                    <input
                      type="text"
                      value={editFormData.role || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={editFormData.email || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      value={editFormData.phone || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, phone: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Department / College
                    </label>
                    <input
                      type="text"
                      value={editFormData.department || ''}
                      onChange={(e) => setEditFormData({ ...editFormData, department: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Project Bio & About
                  </label>
                  <textarea
                    rows={3}
                    value={editFormData.bio || ''}
                    onChange={(e) => setEditFormData({ ...editFormData, bio: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Key Project Contributions (one per line)
                  </label>
                  <textarea
                    rows={4}
                    value={contributionsInput}
                    onChange={(e) => setContributionsInput(e.target.value)}
                    placeholder="Project Lead & Architecture&#10;Interactive Dashboard&#10;Photo Upload..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-900 focus:outline-none font-mono text-[11px]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Technologies & Skills (comma separated)
                  </label>
                  <input
                    type="text"
                    value={skillsInput}
                    onChange={(e) => setSkillsInput(e.target.value)}
                    placeholder="React, TypeScript, Tailwind CSS, Vite..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setEditingMember(null)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: ADD NEW TEAM MEMBER MODAL */}
      {/* ========================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-amber-100 text-amber-900">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-slate-900">
                  Add Contributor / Team Member
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddMemberSubmit}>
              <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Member Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={newMemberForm.name}
                      onChange={(e) => setNewMemberForm({ ...newMemberForm, name: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Enrollment / Roll ID *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 240860131..."
                      value={newMemberForm.enrollmentNo}
                      onChange={(e) =>
                        setNewMemberForm({ ...newMemberForm, enrollmentNo: e.target.value })
                      }
                      className="w-full p-2.5 rounded-xl border border-slate-200 font-mono font-bold focus:ring-2 focus:ring-blue-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Project Role
                    </label>
                    <input
                      type="text"
                      value={newMemberForm.role}
                      onChange={(e) => setNewMemberForm({ ...newMemberForm, role: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-900 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={newMemberForm.email}
                      onChange={(e) => setNewMemberForm({ ...newMemberForm, email: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-900 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Photo URL (or choose preset)
                  </label>
                  <input
                    type="url"
                    value={newMemberForm.avatarUrl}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, avatarUrl: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Bio & Project Contribution
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Short description of this member's contribution..."
                    value={newMemberForm.bio}
                    onChange={(e) => setNewMemberForm({ ...newMemberForm, bio: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-900 focus:outline-none"
                  />
                </div>
              </div>

              <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold transition shadow-xs cursor-pointer"
                >
                  Add Team Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 4: PROJECT CREDENTIAL SHEET & SUBMISSION REPORT */}
      {/* ========================================================================= */}
      {isReportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-900" />
                <h3 className="text-sm font-bold text-slate-900">
                  Project Team Credential Sheet
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsReportOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              <div className="p-5 bg-gradient-to-r from-blue-900 to-slate-900 text-white rounded-2xl">
                <div className="text-[11px] font-mono uppercase tracking-wider text-amber-300">
                  Academic Project Engineering Documentation
                </div>
                <h2 className="text-xl font-black mt-1">
                  JurisPulse: AI-Powered Legal Practice Management System
                </h2>
                <p className="text-xs text-slate-300 mt-1">
                  Official project development submission acknowledging the lead developer and team members.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Engineering Team Register
                </h4>

                <div className="divide-y divide-slate-100 border border-slate-200 rounded-2xl overflow-hidden bg-white">
                  {teamMembers.map((m, idx) => (
                    <div key={m.id} className="p-3.5 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs font-bold flex items-center justify-center shrink-0">
                          {idx + 1}
                        </span>
                        <ProfileAvatar
                          src={m.avatarUrl}
                          name={m.name}
                          size="sm"
                          rounded="full"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-extrabold text-slate-900">
                              {m.name}
                            </span>
                            {m.isLeadDeveloper && (
                              <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-amber-100 text-amber-900">
                                Lead Developer
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500">{m.role}</p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-mono font-bold px-2 py-1 rounded-md bg-slate-100 text-slate-900 border border-slate-200">
                          {m.enrollmentNo}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs space-y-1.5 text-slate-600">
                <p className="font-bold text-slate-900 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Academic Certification & Originality
                </p>
                <p>
                  This system was conceptualized, architected, and engineered by the registered project developers listed above.
                </p>
              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setIsReportOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-200 transition cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold transition shadow-xs cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
