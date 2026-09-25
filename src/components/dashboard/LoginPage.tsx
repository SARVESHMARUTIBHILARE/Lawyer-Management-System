import React, { useState } from 'react';
import {
  Scale,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  User as UserIcon,
  Briefcase,
  ExternalLink,
  ChevronRight,
  Fingerprint,
  RefreshCw,
  X
} from 'lucide-react';
import { User, UserRole } from '../types';

interface LoginPageProps {
  onLoginSuccess: (user: User) => void;
  availableUsers?: User[];
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  availableUsers = []
}) => {
  const [authTab, setAuthTab] = useState<'signin' | 'signup' | 'demo'>('signin');
  
  // Email Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Sign Up Form State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('associate');
  const [regDepartment, setRegDepartment] = useState('Litigation & Trial Practice');
  const [regTermsAccepted, setRegTermsAccepted] = useState(true);

  // Social Auth Modal Simulation State
  const [socialModal, setSocialModal] = useState<{
    isOpen: boolean;
    provider: 'google' | 'twitter' | 'instagram' | null;
    customHandleOrEmail: string;
    customName: string;
  }>({
    isOpen: false,
    provider: null,
    customHandleOrEmail: '',
    customName: ''
  });

  // Forgot Password Modal State
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  // 2FA Verification Modal State
  const [pending2FAUser, setPending2FAUser] = useState<User | null>(null);
  const [twoFactorCode, setTwoFactorCode] = useState('849201');

  // Handle Email ID Login
  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!email.trim()) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }
    if (!password) {
      setErrorMessage('Please enter your password.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      // Check if matches known user
      const matchedUser = availableUsers.find(
        (u) => u.email.toLowerCase() === email.trim().toLowerCase()
      );

      if (matchedUser) {
        if (matchedUser.twoFactorEnabled) {
          setPending2FAUser({
            ...matchedUser,
            authProvider: 'email',
            lastLoginAt: new Date().toISOString()
          });
          return;
        }

        onLoginSuccess({
          ...matchedUser,
          authProvider: 'email',
          lastLoginAt: new Date().toISOString()
        });
      } else {
        // Create an ad-hoc session user with provided email
        const isClient = email.toLowerCase().includes('client') || email.toLowerCase().includes('com');
        const syntheticUser: User = {
          id: `u-${Date.now()}`,
          name: email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
          email: email.trim(),
          role: isClient ? 'client' : 'associate',
          title: isClient ? 'Represented Client' : 'Counsel of Record',
          avatarUrl: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
          hourlyRate: isClient ? 0 : 380,
          twoFactorEnabled: false,
          status: 'active',
          department: isClient ? 'Client Legal Affairs' : 'General Counsel Practice',
          authProvider: 'email',
          lastLoginAt: new Date().toISOString()
        };

        onLoginSuccess(syntheticUser);
      }
    }, 600);
  };

  // Trigger Social Auth Flow Modal
  const openSocialAuth = (provider: 'google' | 'twitter' | 'instagram') => {
    setErrorMessage(null);
    let defaultName = 'Ritesh Bitode';
    let defaultHandle = 'riteshbitode06@gmail.com';

    if (provider === 'twitter') {
      defaultName = 'Ritesh Bitode';
      defaultHandle = '@ritesh_legal';
    } else if (provider === 'instagram') {
      defaultName = 'Ritesh Legal';
      defaultHandle = '@ritesh.juris';
    }

    setSocialModal({
      isOpen: true,
      provider,
      customName: defaultName,
      customHandleOrEmail: defaultHandle
    });
  };

  // Complete Social Auth
  const handleConfirmSocialLogin = (roleToAssign: UserRole = 'associate') => {
    if (!socialModal.provider) return;

    setIsLoading(true);
    setSocialModal((prev) => ({ ...prev, isOpen: false }));

    setTimeout(() => {
      setIsLoading(false);
      const provider = socialModal.provider!;
      const name = socialModal.customName.trim() || 'Verified User';
      const handle = socialModal.customHandleOrEmail.trim();

      const emailAddress =
        provider === 'google'
          ? handle.includes('@') ? handle : `${handle}@gmail.com`
          : `${handle.replace('@', '')}@social-auth.juris-pulse.law`;

      const avatar =
        provider === 'google'
          ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'
          : provider === 'twitter'
          ? 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80';

      const socialUser: User = {
        id: `u-${provider}-${Date.now()}`,
        name: name,
        email: emailAddress,
        role: roleToAssign,
        title: roleToAssign === 'client' ? 'Client Representative' : 'Attorney / Legal Counsel',
        avatarUrl: avatar,
        hourlyRate: roleToAssign === 'client' ? 0 : 450,
        twoFactorEnabled: false,
        status: 'active',
        department: roleToAssign === 'client' ? 'Retained Client Portal' : 'Litigation & Digital Practice',
        authProvider: provider,
        socialHandle: handle,
        lastLoginAt: new Date().toISOString()
      };

      onLoginSuccess(socialUser);
    }, 700);
  };

  // Handle New Registration
  const handleSignUpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!regName.trim()) {
      setErrorMessage('Full name is required.');
      return;
    }
    if (!regEmail.trim() || !regEmail.includes('@')) {
      setErrorMessage('Please provide a valid corporate or personal email address.');
      return;
    }
    if (regPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      const newUser: User = {
        id: `u-${Date.now()}`,
        name: regName.trim(),
        email: regEmail.trim().toLowerCase(),
        role: regRole,
        title:
          regRole === 'admin'
            ? 'Managing Partner'
            : regRole === 'partner'
            ? 'Partner'
            : regRole === 'associate'
            ? 'Associate Attorney'
            : regRole === 'paralegal'
            ? 'Legal Assistant'
            : regRole === 'billing_specialist'
            ? 'Billing Specialist'
            : 'Client Portal User',
        avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
        hourlyRate: regRole === 'client' ? 0 : regRole === 'admin' ? 650 : regRole === 'partner' ? 550 : 380,
        twoFactorEnabled: true,
        status: 'active',
        department: regDepartment,
        authProvider: 'email',
        lastLoginAt: new Date().toISOString()
      };

      onLoginSuccess(newUser);
    }, 600);
  };

  // Demo Persona Quick-Login
  const handleSelectDemoUser = (user: User) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess({
        ...user,
        authProvider: 'email',
        lastLoginAt: new Date().toISOString()
      });
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 flex flex-col justify-center items-center px-4 py-8 sm:py-12 relative overflow-hidden text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* Background Decorative Lighting Gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-xl z-10">
        {/* Brand Header */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center p-3.5 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-xl shadow-blue-500/20 mb-3 border border-blue-400/30">
            <Scale className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center justify-center gap-2">
            JurisPulse <span className="text-blue-400 font-light text-xl sm:text-2xl">| Legal Suite</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-md mx-auto">
            AI-Powered Legal Practice Management & Encrypted Client Portal
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800/80 border border-slate-700/80 rounded-full text-[11px] text-slate-300 font-medium mt-3 shadow-inner">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>256-Bit SSL/TLS • ABA Formal Op. 477R & FRE 902 Compliant</span>
          </div>
        </div>

        {/* Auth Card */}
        <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-md overflow-hidden">
          {/* Tabs: Sign In / Create Account / Quick Demo Personas */}
          <div className="grid grid-cols-3 border-b border-slate-800 bg-slate-950/40 p-1.5 gap-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setAuthTab('signin');
                setErrorMessage(null);
              }}
              className={`py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                authTab === 'signin'
                  ? 'bg-blue-600 text-white shadow-md font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthTab('signup');
                setErrorMessage(null);
              }}
              className={`py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                authTab === 'signup'
                  ? 'bg-blue-600 text-white shadow-md font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Register</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setAuthTab('demo');
                setErrorMessage(null);
              }}
              className={`py-2 px-3 rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer ${
                authTab === 'demo'
                  ? 'bg-blue-600 text-white shadow-md font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Demo Roles</span>
            </button>
          </div>

          <div className="p-6 sm:p-8">
            {/* Feedback Notifications */}
            {errorMessage && (
              <div className="mb-5 p-3.5 bg-rose-500/15 border border-rose-500/40 rounded-xl text-rose-300 text-xs flex items-start gap-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            {successMessage && (
              <div className="mb-5 p-3.5 bg-emerald-500/15 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-start gap-2.5 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </div>
            )}

            {/* TAB 1: SIGN IN */}
            {authTab === 'signin' && (
              <div className="space-y-6">
                {/* Social Login Options */}
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                    Fast Social Single Sign-On (SSO)
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {/* Google Button */}
                    <button
                      type="button"
                      onClick={() => openSocialAuth('google')}
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer group"
                      title="Continue with Google"
                    >
                      <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                        <path
                          fill="#4285F4"
                          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        />
                        <path
                          fill="#34A853"
                          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        />
                        <path
                          fill="#FBBC05"
                          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                        />
                        <path
                          fill="#EA4335"
                          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                        />
                      </svg>
                      <span>Google</span>
                    </button>

                    {/* Twitter (X) Button */}
                    <button
                      type="button"
                      onClick={() => openSocialAuth('twitter')}
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-black hover:bg-zinc-900 text-white border border-zinc-700 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer group"
                      title="Continue with Twitter / X"
                    >
                      <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                      <span>Twitter (X)</span>
                    </button>

                    {/* Instagram Button */}
                    <button
                      type="button"
                      onClick={() => openSocialAuth('instagram')}
                      disabled={isLoading}
                      className="w-full flex items-center justify-center gap-2 px-3 py-2.5 bg-gradient-to-r from-purple-600 via-pink-600 to-amber-500 hover:opacity-95 text-white border border-pink-500/40 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer group"
                      title="Continue with Instagram"
                    >
                      <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                      </svg>
                      <span>Instagram</span>
                    </button>
                  </div>
                </div>

                {/* Divider */}
                <div className="relative flex items-center justify-center">
                  <div className="border-t border-slate-800 w-full" />
                  <span className="bg-slate-900 px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider shrink-0">
                    Or sign in with Email ID
                  </span>
                  <div className="border-t border-slate-800 w-full" />
                </div>

                {/* Email Sign In Form */}
                <form onSubmit={handleEmailLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Email Address / Attorney ID
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="e.vance@juris-pulse.law or client@example.com"
                        className="w-full bg-slate-800/80 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-slate-300">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => setIsForgotPasswordOpen(true)}
                        className="text-[11px] text-blue-400 hover:text-blue-300 transition cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full bg-slate-800/80 border border-slate-700 rounded-xl py-2.5 pl-10 pr-10 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-blue-500 focus:ring-offset-slate-900 w-3.5 h-3.5"
                      />
                      <span>Trust this workstation</span>
                    </label>
                    <span className="text-[11px] text-slate-500">256-Bit Encrypted</span>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-xl py-2.5 px-4 text-xs sm:text-sm font-bold shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Verifying Credentials...</span>
                      </>
                    ) : (
                      <>
                        <span>Sign In to JurisPulse</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>

                {/* Quick Helper for Test Login */}
                <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/60 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>Want to test without typing?</span>
                  <button
                    type="button"
                    onClick={() => {
                      setEmail('e.vance@juris-pulse.law');
                      setPassword('password123');
                    }}
                    className="text-blue-400 hover:text-blue-300 font-semibold cursor-pointer underline"
                  >
                    Auto-fill Partner Login
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: REGISTER / CREATE ACCOUNT */}
            {authTab === 'signup' && (
              <form onSubmit={handleSignUpSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Full Name & Title
                  </label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Attorney Sarah Jenkins, Esq."
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl py-2 px-3.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Official Email ID
                  </label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="s.jenkins@lawfirm.com"
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl py-2 px-3.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Account Type / Role
                    </label>
                    <select
                      value={regRole}
                      onChange={(e) => setRegRole(e.target.value as UserRole)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="partner">Senior Partner</option>
                      <option value="associate">Associate Attorney</option>
                      <option value="paralegal">Paralegal / Staff</option>
                      <option value="billing_specialist">Billing Specialist</option>
                      <option value="admin">Managing Partner / Admin</option>
                      <option value="client">Client Portal User</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Practice Department
                    </label>
                    <input
                      type="text"
                      value={regDepartment}
                      onChange={(e) => setRegDepartment(e.target.value)}
                      placeholder="e.g. Corporate Law"
                      className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2 px-3 text-xs text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    Create Password
                  </label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                    className="w-full bg-slate-800/80 border border-slate-700 rounded-xl py-2 px-3.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>

                <label className="flex items-start gap-2 text-xs text-slate-400 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={regTermsAccepted}
                    onChange={(e) => setRegTermsAccepted(e.target.checked)}
                    className="mt-0.5 rounded border-slate-700 bg-slate-800 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5 shrink-0"
                  />
                  <span>
                    I accept the JurisPulse Master Legal Services Agreement, ABA Rule 1.6 Confidentiality covenant, and Terms of Use.
                  </span>
                </label>

                <button
                  type="submit"
                  disabled={isLoading || !regTermsAccepted}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded-xl py-2.5 px-4 text-xs sm:text-sm font-bold shadow-lg shadow-blue-600/30 flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50 mt-2"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Creating Profile...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account & Log In</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* TAB 3: QUICK DEMO PERSONAS */}
            {authTab === 'demo' && (
              <div className="space-y-3">
                <p className="text-xs text-slate-400 mb-2">
                  Select an enterprise persona to immediately test role-based access control, portals, and document vaults:
                </p>

                <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                  {availableUsers.map((user) => (
                    <button
                      key={user.id}
                      type="button"
                      onClick={() => handleSelectDemoUser(user)}
                      disabled={isLoading}
                      className="w-full p-3 bg-slate-800/70 hover:bg-slate-800 border border-slate-700/80 rounded-xl flex items-center justify-between text-left transition group cursor-pointer"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={user.avatarUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'}
                          alt={user.name}
                          className="w-9 h-9 rounded-full border border-slate-600 object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs sm:text-sm text-white truncate group-hover:text-blue-400 transition">
                              {user.name}
                            </span>
                            <span
                              className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded border ${
                                user.role === 'admin'
                                  ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                                  : user.role === 'partner'
                                  ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                                  : user.role === 'associate'
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                  : user.role === 'billing_specialist'
                                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/30'
                                  : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                              }`}
                            >
                              {user.role}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-400 truncate mt-0.5">
                            {user.title} • {user.email}
                          </p>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition shrink-0 ml-2" />
                    </button>
                  ))}

                  {/* External Client Persona option */}
                  <button
                    type="button"
                    onClick={() =>
                      handleSelectDemoUser({
                        id: 'u-client-demo',
                        name: 'Arthur Pendelton (Apex Dynamics)',
                        email: 'a.pendelton@apexdynamics.com',
                        role: 'client',
                        title: 'Corporate Client Representative',
                        avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
                        hourlyRate: 0,
                        twoFactorEnabled: false,
                        status: 'active',
                        department: 'Client Legal Affairs',
                        authProvider: 'email'
                      })
                    }
                    className="w-full p-3 bg-blue-950/40 hover:bg-blue-950/70 border border-blue-800/60 rounded-xl flex items-center justify-between text-left transition group cursor-pointer"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-blue-600/30 border border-blue-500/50 flex items-center justify-center text-blue-300 font-bold shrink-0">
                        AP
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-xs sm:text-sm text-white truncate group-hover:text-blue-300 transition">
                            Arthur Pendelton (Apex Dynamics)
                          </span>
                          <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded border bg-blue-500/20 text-blue-300 border-blue-500/40">
                            Client Portal
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          External Client Account • View matters, retainers & invoices
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-blue-300 group-hover:translate-x-1 transition shrink-0 ml-2" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Card Footer Security Guarantee */}
          <div className="bg-slate-950/80 px-6 py-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5">
              <Fingerprint className="w-3.5 h-3.5 text-blue-400" />
              <span>Zero-Knowledge Architecture</span>
            </span>
            <span>Version 4.8.2-SEC</span>
          </div>
        </div>

        {/* Footer Support Info */}
        <p className="text-center text-[11px] text-slate-500 mt-6">
          © {new Date().getFullYear()} JurisPulse LLP. All attorney-client communications are privileged and encrypted.
        </p>
      </div>

      {/* SOCIAL AUTH CONFIRMATION MODAL */}
      {socialModal.isOpen && socialModal.provider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2.5">
                {socialModal.provider === 'google' && (
                  <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center p-1.5 shrink-0">
                    <svg className="w-full h-full" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                  </div>
                )}
                {socialModal.provider === 'twitter' && (
                  <div className="w-8 h-8 rounded-full bg-black border border-zinc-700 flex items-center justify-center p-2 shrink-0">
                    <svg className="w-full h-full fill-white" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </div>
                )}
                {socialModal.provider === 'instagram' && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-amber-500 flex items-center justify-center p-1.5 shrink-0">
                    <svg className="w-full h-full fill-white" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </div>
                )}
                <div>
                  <h3 className="text-sm font-bold text-white capitalize">
                    Authenticate with {socialModal.provider === 'twitter' ? 'Twitter (X)' : socialModal.provider}
                  </h3>
                  <p className="text-[11px] text-slate-400">JurisPulse OAuth 2.0 Identity Protocol</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSocialModal((prev) => ({ ...prev, isOpen: false }))}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Full Name / Display Name
                </label>
                <input
                  type="text"
                  value={socialModal.customName}
                  onChange={(e) =>
                    setSocialModal((prev) => ({ ...prev, customName: e.target.value }))
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {socialModal.provider === 'google' ? 'Google Account Email' : 'Social Handle / Username'}
                </label>
                <input
                  type="text"
                  value={socialModal.customHandleOrEmail}
                  onChange={(e) =>
                    setSocialModal((prev) => ({ ...prev, customHandleOrEmail: e.target.value }))
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>

              <div className="p-3 bg-slate-800/60 rounded-xl border border-slate-700/60 text-[11px] text-slate-400">
                <p className="font-semibold text-slate-300 mb-1">Requested Permissions:</p>
                <ul className="list-disc pl-4 space-y-0.5 text-slate-400">
                  <li>Verify public profile and identity credential</li>
                  <li>Secure sign-on to JurisPulse enterprise legal suite</li>
                </ul>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => handleConfirmSocialLogin('client')}
                  className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition cursor-pointer"
                >
                  Authorize as Client
                </button>
                <button
                  type="button"
                  onClick={() => handleConfirmSocialLogin('associate')}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold transition shadow-md shadow-blue-600/30 cursor-pointer"
                >
                  Authorize as Attorney
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* FORGOT PASSWORD MODAL */}
      {isForgotPasswordOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-400" />
                <h3 className="text-sm font-bold text-white">Reset Credentials</h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setIsForgotPasswordOpen(false);
                  setForgotSent(false);
                }}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {forgotSent ? (
              <div className="space-y-4 py-2">
                <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold text-white">Recovery Link Dispatched</p>
                    <p className="mt-1 leading-relaxed">
                      A single-use, 256-bit encrypted credential recovery token has been transmitted to{' '}
                      <span className="text-emerald-200 font-mono font-bold">{forgotEmail || email || 'your email'}</span>.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPasswordOpen(false);
                    setForgotSent(false);
                  }}
                  className="w-full bg-slate-800 hover:bg-slate-700 text-white rounded-xl py-2 text-xs font-bold transition"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-slate-400">
                  Enter your firm-registered email address to receive an authorized security reset link:
                </p>
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  placeholder="e.g. counsel@juris-pulse.law"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsForgotPasswordOpen(false)}
                    className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => setForgotSent(true)}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-xs"
                  >
                    Transmit Reset Token
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 2FA VERIFICATION CODE MODAL */}
      {pending2FAUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-slate-100">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="text-sm font-bold text-white">Two-Factor Authentication (2FA)</h3>
              </div>
              <button
                type="button"
                onClick={() => setPending2FAUser(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="text-center py-2">
              <div className="w-12 h-12 rounded-full bg-blue-600/20 text-blue-400 flex items-center justify-center mx-auto mb-3 border border-blue-500/30">
                <Fingerprint className="w-6 h-6" />
              </div>
              <p className="text-xs text-slate-300 font-semibold">
                Confirm Authentication for {pending2FAUser.name}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Enter the 6-digit security code generated by your Authenticator app:
              </p>
            </div>

            <div className="py-2">
              <input
                type="text"
                maxLength={6}
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value.replace(/\D/g, ''))}
                className="w-full bg-slate-800 border-2 border-blue-500 rounded-xl py-3 text-center text-xl font-mono tracking-widest text-white focus:outline-none"
              />
              <p className="text-[10px] text-emerald-400 text-center mt-2 font-medium">
                ✓ Pre-filled test code: 849201
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  const verifiedUser = pending2FAUser;
                  setPending2FAUser(null);
                  onLoginSuccess(verifiedUser);
                }}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-600/30 transition cursor-pointer"
              >
                Verify & Enter JurisPulse
              </button>
              <button
                type="button"
                onClick={() => setPending2FAUser(null)}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs transition cursor-pointer"
              >
                Back to Sign In
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
