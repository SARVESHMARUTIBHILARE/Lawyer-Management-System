import React, { useState } from 'react';
import {
  Scale,
  Mail,
  Lock,
  Eye,
  EyeOff,
  LogIn,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Chrome,
  Twitter,
  Instagram,
  User,
  Sparkles,
  Calendar,
  LockKeyhole,
  Users,
  Briefcase
} from 'lucide-react';
import { AuthProvider, AuthUser, PersonType } from '../../types/dashboard';
import {
  createOrGetPersonForEmail,
  getPersonProfileById,
  defaultPersonsList
} from '../../data/personProfiles';

interface LoginPageProps {
  onLoginSuccess: (user: AuthUser) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('riteshbitode06@gmail.com');
  const [name, setName] = useState('Ritesh Bitode');
  const [personType, setPersonType] = useState<PersonType>('lawyer');
  const [password, setPassword] = useState('••••••••••••');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProvider, setLoadingProvider] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auto-suggest name when email changes if name is still empty or matches old email
  const handleEmailChange = (val: string) => {
    setEmail(val);
    const existing = getPersonProfileById(val);
    if (existing) {
      setName(existing.name);
      setPersonType(existing.personType);
    } else {
      const derived = val
        .split('@')[0]
        .replace(/[._\d]+/g, ' ')
        .trim()
        .split(' ')
        .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
        .join(' ');
      if (derived && derived.length > 1) {
        setName(derived);
      }
    }
  };

  // Email login handler
  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim() || !email.includes('@')) {
      setErrorMessage('Please enter a valid attorney or client Email ID.');
      return;
    }

    if (!password.trim()) {
      setErrorMessage('Please enter your chambers passcode.');
      return;
    }

    setIsLoading(true);
    setLoadingProvider('email');

    setTimeout(() => {
      // Guarantees every person receives their own dedicated profile, never another person's!
      const person = createOrGetPersonForEmail(
        email.trim(),
        name.trim() || undefined,
        personType === 'client' ? 'client' : 'lawyer'
      );

      const user: AuthUser = {
        id: person.id,
        email: person.email,
        name: person.name,
        avatarUrl: person.avatarUrl,
        provider: 'email',
        role: person.role,
        personType: person.personType,
        profileId: person.id,
        firmName: person.firmName,
        barNumber: person.barNumber,
        clientId: person.personType === 'client' ? person.id : undefined,
        loggedInAt: 'Active Now'
      };

      setIsLoading(false);
      setLoadingProvider(null);
      onLoginSuccess(user);
    }, 450);
  };

  // Social Auth Handlers
  const handleSocialLogin = (provider: AuthProvider) => {
    setErrorMessage(null);
    setLoadingProvider(provider);
    setIsLoading(true);

    setTimeout(() => {
      let userEmail = email.trim();
      let userName = name.trim();

      if (provider === 'google') {
        userEmail = userEmail || 'riteshbitode06@gmail.com';
        userName = userName || 'Ritesh Bitode (Google Account)';
      } else if (provider === 'twitter') {
        userEmail = userEmail || 'counsel@twitter-juris.com';
        userName = userName || `${userName || 'Counsel'} (@LegalX)`;
      } else if (provider === 'instagram') {
        userEmail = userEmail || 'counsel@instagram-legal.com';
        userName = userName || `${userName || 'Counsel'} (@LegalInsta)`;
      }

      const person = createOrGetPersonForEmail(userEmail, userName, personType);

      const user: AuthUser = {
        id: person.id,
        email: person.email,
        name: person.name,
        avatarUrl: person.avatarUrl,
        provider,
        role: person.role,
        personType: person.personType,
        profileId: person.id,
        firmName: person.firmName,
        barNumber: person.barNumber,
        clientId: person.personType === 'client' ? person.id : undefined,
        loggedInAt: 'Active Now'
      };

      setIsLoading(false);
      setLoadingProvider(null);
      onLoginSuccess(user);
    }, 500);
  };

  // 1-Click Fast Presets for any person
  const handleQuickPresetPerson = (personId: string) => {
    setIsLoading(true);
    setLoadingProvider(personId);

    setTimeout(() => {
      const person = defaultPersonsList.find((p) => p.id === personId) || defaultPersonsList[0];
      const user: AuthUser = {
        id: person.id,
        email: person.email,
        name: person.name,
        avatarUrl: person.avatarUrl,
        provider: 'email',
        role: person.role,
        personType: person.personType,
        profileId: person.id,
        firmName: person.firmName,
        barNumber: person.barNumber,
        clientId: person.personType === 'client' ? person.id : undefined,
        loggedInAt: 'Active Now'
      };
      setIsLoading(false);
      setLoadingProvider(null);
      onLoginSuccess(user);
    }, 350);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-between selection:bg-blue-900 selection:text-white">
      {/* Top Simple Brand Nav */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-900 flex items-center justify-center text-amber-400 shadow-md">
            <Scale className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-base font-extrabold tracking-tight text-white leading-none">
                Juris<span className="text-blue-400">Pulse</span>
              </span>
              <span className="text-[10px] font-semibold text-blue-200 bg-blue-950/80 px-2 py-0.5 rounded-full border border-blue-800 hidden sm:inline-block">
                Lawyer & Client Management System
              </span>
            </div>
            <span className="text-[10px] font-medium text-slate-400 mt-0.5">
              Personalized Practice & Client Identity Security Portal
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="hidden sm:inline">Chambers Security Gateway Online</span>
        </div>
      </header>

      {/* Main Login Canvas */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-8 flex items-center justify-center">
        <div className="w-full bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[640px]">
          {/* Left Hero Panel (Desktop) */}
          <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white p-8 flex-col justify-between relative overflow-hidden">
            {/* Background watermark */}
            <div className="absolute -right-12 -bottom-12 w-80 h-80 text-white/5 pointer-events-none">
              <Scale className="w-full h-full" />
            </div>

            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-semibold text-amber-300 border border-white/15">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Isolated Multi-User Identity Protection</span>
              </div>

              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight">
                  Independent Personal Profiles for Every Legal Member
                </h1>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  Every attorney and client maintains their own private, authenticated profile. Your appointments, billing rates, credentials, and notes are never merged with another person.
                </p>
              </div>

              {/* Feature Highlights */}
              <div className="space-y-3 text-xs pt-2">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                  <User className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-bold text-white">Strict Profile Separation</p>
                    <p className="text-[11px] text-slate-300">
                      Each person has their own private profile, credentials, and settings.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                  <Calendar className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-bold text-white">Court Calendar & Consultation Dockets</p>
                    <p className="text-[11px] text-slate-300">
                      Synchronized hearing dates, deposition reviews, and personal calendar.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-white/5 border border-white/10">
                  <LockKeyhole className="w-4 h-4 text-blue-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-bold text-white">Privileged Vault Security</p>
                    <p className="text-[11px] text-slate-300">
                      256-bit encrypted attorney-client records and escrow trust ledgers.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Counsel trust statement */}
            <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
              <span>Jurisdiction: Federal & NY State</span>
              <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                256-Bit SSL Secured
              </span>
            </div>
          </div>

          {/* Right Form Panel */}
          <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center bg-white">
            <div className="max-w-md w-full mx-auto space-y-5">
              {/* Header */}
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-900 text-[11px] font-bold border border-blue-100 mb-1.5">
                  <Lock className="w-3 h-3" />
                  <span>Personal Authentication Gateway</span>
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">
                  Sign In to Your Own Profile
                </h2>
                <p className="text-xs text-slate-500 mt-1">
                  Access your personal docket, client matters, and individual chambers credentials.
                </p>
              </div>

              {/* Error Banner if any */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2 text-xs font-semibold text-rose-800 animate-in fade-in duration-150">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* 1-CLICK INSTANT PRESETS (Lawyers & Clients) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    Quick Select Active Person Profile
                  </span>
                  <span className="text-[10px] text-blue-700 font-medium bg-blue-50 px-2 py-0.5 rounded-full">
                    Own Profile Each
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {/* Ritesh Bitode (User Profile) */}
                  <button
                    type="button"
                    onClick={() => handleQuickPresetPerson('usr-ritesh-bitode')}
                    disabled={isLoading}
                    className="p-2 rounded-xl bg-blue-50/80 hover:bg-blue-100/80 border border-blue-200 text-left transition group cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="w-2 h-2 rounded-full bg-blue-600" />
                      <span className="text-[9px] font-bold text-blue-800 uppercase">You (Lead)</span>
                    </div>
                    <p className="font-bold text-slate-900 text-xs truncate group-hover:text-blue-900">
                      Ritesh Bitode
                    </p>
                    <p className="text-[10px] text-slate-500 truncate">Managing Counsel</p>
                  </button>

                  {/* Sarah Vance, Esq. */}
                  <button
                    type="button"
                    onClick={() => handleQuickPresetPerson('usr-sarah-vance')}
                    disabled={isLoading}
                    className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition group cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-[9px] font-bold text-slate-600 uppercase">Lawyer</span>
                    </div>
                    <p className="font-bold text-slate-900 text-xs truncate group-hover:text-blue-900">
                      Sarah Vance, Esq.
                    </p>
                    <p className="text-[10px] text-slate-500 truncate">Lead Partner</p>
                  </button>

                  {/* Marcus Sterling, Esq. */}
                  <button
                    type="button"
                    onClick={() => handleQuickPresetPerson('usr-marcus-sterling')}
                    disabled={isLoading}
                    className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition group cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-[9px] font-bold text-slate-600 uppercase">Lawyer</span>
                    </div>
                    <p className="font-bold text-slate-900 text-xs truncate group-hover:text-blue-900">
                      Marcus Sterling
                    </p>
                    <p className="text-[10px] text-slate-500 truncate">Senior Partner</p>
                  </button>

                  {/* Elena Rostova, Esq. */}
                  <button
                    type="button"
                    onClick={() => handleQuickPresetPerson('usr-elena-rostova')}
                    disabled={isLoading}
                    className="p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-left transition group cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span className="text-[9px] font-bold text-slate-600 uppercase">Lawyer</span>
                    </div>
                    <p className="font-bold text-slate-900 text-xs truncate group-hover:text-blue-900">
                      Elena Rostova
                    </p>
                    <p className="text-[10px] text-slate-500 truncate">IP Partner</p>
                  </button>

                  {/* Arthur Pendelton (Client) */}
                  <button
                    type="button"
                    onClick={() => handleQuickPresetPerson('cli-1')}
                    disabled={isLoading}
                    className="p-2 rounded-xl bg-amber-50/60 hover:bg-amber-100/70 border border-amber-200 text-left transition group cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <span className="text-[9px] font-bold text-amber-800 uppercase">Client</span>
                    </div>
                    <p className="font-bold text-slate-900 text-xs truncate group-hover:text-amber-900">
                      Arthur Pendelton
                    </p>
                    <p className="text-[10px] text-slate-500 truncate">Apex Global CLO</p>
                  </button>

                  {/* Dr. Helena Rostova (Client) */}
                  <button
                    type="button"
                    onClick={() => handleQuickPresetPerson('cli-2')}
                    disabled={isLoading}
                    className="p-2 rounded-xl bg-amber-50/60 hover:bg-amber-100/70 border border-amber-200 text-left transition group cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <span className="text-[9px] font-bold text-amber-800 uppercase">Client</span>
                    </div>
                    <p className="font-bold text-slate-900 text-xs truncate group-hover:text-amber-900">
                      Dr. Helena Rostova
                    </p>
                    <p className="text-[10px] text-slate-500 truncate">BioVenture VP</p>
                  </button>
                </div>
              </div>

              {/* Divider */}
              <div className="relative flex items-center justify-center">
                <div className="border-t border-slate-200 w-full" />
                <span className="bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0">
                  Or Sign In As Any Custom Person
                </span>
              </div>

              {/* Email & Name Form */}
              <form onSubmit={handleEmailSubmit} className="space-y-3.5">
                {/* Person Type Selector */}
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Your Profile Category
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setPersonType('lawyer')}
                      className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold transition border cursor-pointer ${
                        personType === 'lawyer'
                          ? 'bg-blue-900 text-white border-blue-900 shadow-2xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <Scale className="w-3.5 h-3.5" />
                      <span>Attorney / Counsel</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPersonType('client')}
                      className={`flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg text-xs font-bold transition border cursor-pointer ${
                        personType === 'client'
                          ? 'bg-blue-900 text-white border-blue-900 shadow-2xs'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>Client / Entity</span>
                    </button>
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => handleEmailChange(e.target.value)}
                      placeholder="e.g. riteshbitode06@gmail.com"
                      required
                      className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none transition font-medium text-slate-900"
                    />
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Your Full Name (Appears on your own profile)
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Ritesh Bitode"
                      required
                      className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none transition font-medium text-slate-900"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-bold text-slate-700">
                      Chambers Passcode
                    </label>
                    <button
                      type="button"
                      onClick={() =>
                        setErrorMessage(
                          'Passcode reset link has been dispatched to your email address.'
                        )
                      }
                      className="text-[11px] font-semibold text-blue-900 hover:underline"
                    >
                      Forgot passcode?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••••••"
                      required
                      className="w-full pl-10 pr-10 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-900 focus:outline-none transition font-medium text-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="p-1 text-slate-400 hover:text-slate-600 absolute right-3 top-1/2 -translate-y-1/2"
                      aria-label="Toggle password visibility"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="rounded border-slate-300 text-blue-900 focus:ring-blue-900"
                    />
                    <span className="font-medium text-[11px]">
                      Remember this person terminal
                    </span>
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold shadow-md transition disabled:opacity-70 cursor-pointer"
                >
                  {isLoading && loadingProvider === 'email' ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Loading Your Personal Profile...</span>
                    </span>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      <span>Sign In to {name ? `${name}'s Profile` : 'My Own Profile'}</span>
                    </>
                  )}
                </button>
              </form>

              {/* Social Login Buttons */}
              <div className="pt-2 border-t border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Or Connect With Identity Provider
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSocialLogin('google')}
                    disabled={isLoading}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-800 transition disabled:opacity-60 cursor-pointer"
                    title="Sign in with Google Account"
                  >
                    <Chrome className="w-3.5 h-3.5 text-rose-500" />
                    <span>Google</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSocialLogin('twitter')}
                    disabled={isLoading}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-800 transition disabled:opacity-60 cursor-pointer"
                    title="Sign in with Twitter / X"
                  >
                    <Twitter className="w-3.5 h-3.5 text-sky-500" />
                    <span>Twitter</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSocialLogin('instagram')}
                    disabled={isLoading}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-800 transition disabled:opacity-60 cursor-pointer"
                    title="Sign in with Instagram"
                  >
                    <Instagram className="w-3.5 h-3.5 text-pink-600" />
                    <span>Instagram</span>
                  </button>
                </div>
              </div>

              {/* Security & Compliance Footer */}
              <div className="pt-2 border-t border-slate-100 text-center">
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Strict Profile Isolation • Private Record Boundaries Enforced</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-4 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 border-t border-slate-800/80">
        <p>© 2026 JurisPulse. All rights reserved. Individual Attorney & Client Privileged Portal.</p>
        <div className="flex items-center gap-4 text-[11px]">
          <a href="#privacy" onClick={(e) => e.preventDefault()} className="hover:text-slate-300 transition">
            Privacy Policy
          </a>
          <span>•</span>
          <a href="#terms" onClick={(e) => e.preventDefault()} className="hover:text-slate-300 transition">
            Terms of Counsel Service
          </a>
          <span>•</span>
          <a href="#compliance" onClick={(e) => e.preventDefault()} className="hover:text-slate-300 transition">
            Bar Ethics Compliance
          </a>
        </div>
      </footer>
    </div>
  );
};
