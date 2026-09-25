import React, { useState } from 'react';
import {
  X,
  Scale,
  DollarSign,
  Mail,
  Phone,
  Building,
  Plus,
  Trash2,
  CheckCircle2,
  FileBadge,
  MapPin,
  Sparkles
} from 'lucide-react';
import { LawyerProfile } from '../../types/dashboard';
import { PhotoUploadField, DEFAULT_PORTRAIT_PRESETS } from './PhotoUploadField';

interface AddLawyerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddLawyer: (newLawyer: LawyerProfile) => void;
  defaultFirmName?: string;
}

export const AddLawyerModal: React.FC<AddLawyerModalProps> = ({
  isOpen,
  onClose,
  onAddLawyer,
  defaultFirmName = 'Vance & Sterling LLP'
}) => {
  const [name, setName] = useState('');
  const [title, setTitle] = useState('Litigation Partner');
  const [barNumber, setBarNumber] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+1 (212) 555-0');
  const [firmName, setFirmName] = useState(defaultFirmName);
  const [avatarUrl, setAvatarUrl] = useState(DEFAULT_PORTRAIT_PRESETS[1].url);
  const [hourlyRate, setHourlyRate] = useState<number>(550);
  const [officeAddress, setOfficeAddress] = useState('30 Rockefeller Plaza, Suite 4400, New York, NY 10112');
  const [bio, setBio] = useState('');
  const [specializations, setSpecializations] = useState<string[]>([
    'Commercial Litigation',
    'Arbitration'
  ]);
  const [tagInput, setTagInput] = useState('');
  const [courtAdmissions, setCourtAdmissions] = useState<string[]>([
    'New York State Bar',
    'U.S. District Court (S.D.N.Y.)'
  ]);
  const [admissionInput, setAdmissionInput] = useState('');

  if (!isOpen) return null;

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = tagInput.trim();
    if (clean && !specializations.includes(clean)) {
      setSpecializations([...specializations, clean]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setSpecializations(specializations.filter((t) => t !== tag));
  };

  const handleAddAdmission = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = admissionInput.trim();
    if (clean && !courtAdmissions.includes(clean)) {
      setCourtAdmissions([...courtAdmissions, clean]);
      setAdmissionInput('');
    }
  };

  const handleRemoveAdmission = (adm: string) => {
    setCourtAdmissions(courtAdmissions.filter((a) => a !== adm));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const generatedBar = barNumber.trim() || `NY-BAR #${Math.floor(3000000 + Math.random() * 6000000)}`;
    const cleanEmail =
      email.trim() ||
      `${name.toLowerCase().replace(/[^a-z0-9]/g, '.')}@${firmName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;

    const newLawyer: LawyerProfile = {
      name: name.trim(),
      title: title.trim() || 'Associate Attorney',
      barNumber: generatedBar,
      firmName: firmName.trim() || 'Vance & Sterling LLP',
      email: cleanEmail,
      phone: phone.trim() || '+1 (212) 555-0199',
      avatarUrl: avatarUrl.trim() || DEFAULT_PORTRAIT_PRESETS[0].url,
      hourlyRate: Number(hourlyRate) || 500,
      specialization: specializations.length > 0 ? specializations : ['Commercial Law'],
      officeAddress: officeAddress.trim(),
      bio:
        bio.trim() ||
        `${name.trim()} is an attorney with ${firmName.trim()}, focusing on complex corporate dispute resolution and trial practice.`,
      courtAdmissions,
      chambersHours: 'Mon - Fri • 09:00 AM - 05:30 PM EST',
      consultationSlot: '45 Minutes (15 Min Buffer)',
      trialExperience: 'Experienced Trial & Appellate Advocate'
    };

    onAddLawyer(newLawyer);
    onClose();

    // Reset form
    setName('');
    setBarNumber('');
    setEmail('');
    setBio('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-blue-950 via-blue-900 to-slate-900 text-white p-6 sm:p-7 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-amber-300 border border-white/15 shadow-inner">
              <Scale className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-black tracking-tight text-white">
                  Add New Lawyer to Firm
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-950 uppercase tracking-wider">
                  Counsel Roster
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                Register a new practicing attorney, upload portrait photo, Bar license ID, and hourly rate.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-7 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Lawyer Photo Upload Field */}
          <PhotoUploadField
            label="Attorney Portrait Photo"
            value={avatarUrl}
            onChange={(newUrl) => setAvatarUrl(newUrl)}
            helperText="Upload a high-resolution portrait headshot from your device or select an attorney preset."
            idPrefix="new-lawyer-photo"
          />

          {/* Core Credentials: Name & Title */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Attorney Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Jessica Pearson, Esq."
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Professional Chambers Title <span className="text-rose-500">*</span>
              </label>
              <select
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none"
              >
                <option value="Senior Litigation Partner">Senior Litigation Partner</option>
                <option value="Lead Trial Counsel">Lead Trial Counsel</option>
                <option value="Partner, Corporate & M&A">Partner, Corporate & M&A</option>
                <option value="Senior Associate Attorney">Senior Associate Attorney</option>
                <option value="Special Counsel, Intellectual Property">Special Counsel, Intellectual Property</option>
                <option value="Junior Associate">Junior Associate</option>
                <option value="Of Counsel">Of Counsel</option>
              </select>
            </div>
          </div>

          {/* Bar License & Hourly Retainer Rate */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                State Bar Registration Number
              </label>
              <input
                type="text"
                value={barNumber}
                onChange={(e) => setBarNumber(e.target.value)}
                placeholder="e.g. NY-BAR #6291043"
                className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none"
              />
              <span className="text-[10px] text-slate-400">Leave blank to auto-generate verified format</span>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Hourly Retainer Rate ($/hr) <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  required
                  min={150}
                  max={2500}
                  step={25}
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(Number(e.target.value))}
                  className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Direct Chambers Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.pearson@vancelaw.com"
                  className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Direct Contact Phone
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (212) 555-0144"
                  className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Practice Specializations */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Practice Specializations
            </label>
            <div className="flex flex-wrap items-center gap-1.5 mb-2">
              {specializations.map((spec) => (
                <span
                  key={spec}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 text-blue-900 text-[11px] font-bold border border-blue-200"
                >
                  {spec}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(spec)}
                    className="hover:text-rose-600 transition cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                placeholder="e.g. Antitrust Defense, Appellate Advocacy, Securities"
                className="flex-1 p-2 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition cursor-pointer"
              >
                Add Tag
              </button>
            </div>
          </div>

          {/* Bio statement */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Attorney Bio Statement
            </label>
            <textarea
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Summary of bar credentials, trial history, and areas of legal representation..."
              className="w-full p-2.5 rounded-xl border border-slate-200 text-xs bg-slate-50 focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none"
            />
          </div>

          {/* Modal Action Buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold shadow-md transition cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              Enroll Attorney in Roster
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
