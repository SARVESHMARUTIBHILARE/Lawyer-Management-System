import React, { useState } from 'react';
import {
  ShieldCheck,
  Lock,
  KeyRound,
  Users,
  QrCode,
  CheckCircle2,
  AlertTriangle,
  FileText,
  UserCheck,
  ShieldAlert,
  Smartphone,
  Copy,
  RefreshCw
} from 'lucide-react';
import { User, SecurityAuditLog, RolePermission, UserRole } from '../types';
import { ROLE_PERMISSIONS } from '../data/mockData';

interface SecurityRbacViewProps {
  users: User[];
  currentUser: User;
  auditLogs: SecurityAuditLog[];
  userRole: UserRole;
  twoFactorActive: boolean;
  onToggleTwoFactor: () => void;
  onUpdateUserRole: (userId: string, newRole: UserRole) => void;
}

export const SecurityRbacView: React.FC<SecurityRbacViewProps> = ({
  users,
  currentUser,
  auditLogs,
  userRole,
  twoFactorActive,
  onToggleTwoFactor,
  onUpdateUserRole
}) => {
  const [activeTab, setActiveTab] = useState<'rbac' | '2fa' | 'audit_logs'>('rbac');
  const [verificationCode, setVerificationCode] = useState('');
  const [codeSuccess, setCodeSuccess] = useState(false);
  const [secretKey] = useState('JURIS-PULSE-TOTP-8842-SECURE');

  const permissionsList = Object.values(ROLE_PERMISSIONS);

  const handleVerify2FACode = (e: React.FormEvent) => {
    e.preventDefault();
    if (verificationCode.length >= 6) {
      setCodeSuccess(true);
      if (!twoFactorActive) {
        onToggleTwoFactor();
      }
      setTimeout(() => setCodeSuccess(false), 3000);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 p-4 rounded-lg shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-slate-900">Security, RBAC & Two-Factor Authentication</h1>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 flex items-center gap-1 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              SOC2 & HIPAA Compliant
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Enforce distinct roles for admins and regular staff, configure TOTP 2FA multi-factor authentication, and inspect audit logs.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onToggleTwoFactor}
            className={`px-3.5 py-1.5 rounded-md text-xs font-semibold flex items-center gap-2 transition shadow-sm ${
              twoFactorActive
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                : 'bg-amber-600 hover:bg-amber-700 text-white'
            }`}
          >
            <Lock className="w-4 h-4" />
            <span>2FA Security: {twoFactorActive ? 'ACTIVE (ENABLED)' : 'DISABLED (ENABLE NOW)'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 p-1 bg-slate-100 border border-slate-200 rounded-md w-full sm:w-auto">
        <button
          onClick={() => setActiveTab('rbac')}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
            activeTab === 'rbac' ? 'bg-white text-blue-700 shadow-sm border border-slate-200' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Role Access Matrix (RBAC)
        </button>
        <button
          onClick={() => setActiveTab('2fa')}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
            activeTab === '2fa' ? 'bg-white text-blue-700 shadow-sm border border-slate-200' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Two-Factor Authenticator (2FA) Setup
        </button>
        <button
          onClick={() => setActiveTab('audit_logs')}
          className={`px-3 py-1.5 rounded-md text-xs font-semibold transition ${
            activeTab === 'audit_logs' ? 'bg-white text-blue-700 shadow-sm border border-slate-200' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Security Audit Logs ({auditLogs.length})
        </button>
      </div>

      {/* Tab 1: RBAC Matrix & Staff Permissions */}
      {activeTab === 'rbac' && (
        <div className="space-y-6">
          {/* User Directory Table */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-4 overflow-x-auto text-slate-900">
            <h3 className="font-bold text-slate-900 text-sm mb-0.5">Firm User Access Control List</h3>
            <p className="text-xs text-slate-500 mb-3">
              Distinct roles for Admins, Partners, Associate Attorneys, Paralegals, and Billing Specialists.
            </p>

            <table className="w-full text-left text-xs text-slate-800">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200 font-bold">
                <tr>
                  <th className="px-3 py-2.5">User / Attorney</th>
                  <th className="px-3 py-2.5">Title / Department</th>
                  <th className="px-3 py-2.5">Assigned Role</th>
                  <th className="px-3 py-2.5">2FA Status</th>
                  <th className="px-3 py-2.5">Role Adjustment</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-50 transition">
                    <td className="px-3 py-2.5 font-semibold text-slate-900 flex items-center gap-2.5">
                      <img
                        src={u.avatarUrl || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150'}
                        alt={u.name}
                        className="w-7 h-7 rounded-full object-cover border border-slate-200"
                      />
                      <div>
                        <p>{u.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{u.email}</p>
                      </div>
                    </td>

                    <td className="px-3 py-2.5 text-slate-600">{u.title}</td>

                    <td className="px-3 py-2.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase">
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>

                    <td className="px-3 py-2.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          u.twoFactorEnabled
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {u.twoFactorEnabled ? '2FA Active' : '2FA Pending'}
                      </span>
                    </td>

                    <td className="px-3 py-2.5">
                      <select
                        value={u.role}
                        onChange={(e) => onUpdateUserRole(u.id, e.target.value as UserRole)}
                        disabled={userRole !== 'admin'}
                        className="bg-slate-50 border border-slate-200 text-slate-800 text-xs rounded-md px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                      >
                        <option value="admin">Admin / Partner</option>
                        <option value="partner">Senior Partner</option>
                        <option value="associate">Associate Attorney</option>
                        <option value="paralegal">Paralegal / Staff</option>
                        <option value="billing_specialist">Billing Specialist</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Granular Matrix */}
          <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-4 overflow-x-auto text-slate-900">
            <h3 className="font-bold text-slate-900 text-sm mb-3">Role Permission Matrix</h3>

            <table className="w-full text-left text-xs text-slate-800">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200 font-bold">
                <tr>
                  <th className="px-3 py-2.5">Permission Scope</th>
                  {permissionsList.map((p) => (
                    <th key={p.role} className="px-3 py-2.5 text-center">{p.roleName}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-mono">
                <tr>
                  <td className="px-3 py-2.5 font-sans text-slate-900 font-semibold">View All Case Files</td>
                  {permissionsList.map((p) => (
                    <td key={p.role} className="px-3 py-2.5 text-center">
                      {p.canViewAllCases ? <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /> : <span className="text-slate-300">-</span>}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-3 py-2.5 font-sans text-slate-900 font-semibold">Edit / Modify Cases</td>
                  {permissionsList.map((p) => (
                    <td key={p.role} className="px-3 py-2.5 text-center">
                      {p.canEditCases ? <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /> : <span className="text-slate-300">-</span>}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-3 py-2.5 font-sans text-slate-900 font-semibold">Approve Invoices & Billing</td>
                  {permissionsList.map((p) => (
                    <td key={p.role} className="px-3 py-2.5 text-center">
                      {p.canApproveInvoices ? <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /> : <span className="text-slate-300">-</span>}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-3 py-2.5 font-sans text-slate-900 font-semibold">Firm Productivity Analytics</td>
                  {permissionsList.map((p) => (
                    <td key={p.role} className="px-3 py-2.5 text-center">
                      {p.canViewAnalytics ? <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /> : <span className="text-slate-300">-</span>}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-3 py-2.5 font-sans text-slate-900 font-semibold">Manage Security & 2FA Rules</td>
                  {permissionsList.map((p) => (
                    <td key={p.role} className="px-3 py-2.5 text-center">
                      {p.canManageSecurity2FA ? <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto" /> : <span className="text-slate-300">-</span>}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: 2FA Setup */}
      {activeTab === '2fa' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* QR Code Authenticator Box */}
          <div className="p-5 bg-white border border-slate-200 rounded-lg shadow-sm space-y-4 text-slate-900">
            <div className="flex items-center gap-2">
              <QrCode className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-sm">Configure TOTP Authenticator App</h3>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Scan this QR code with Google Authenticator, Authy, or 1Password to bind your attorney account to maximum two-factor security.
            </p>

            {/* Simulated SVG QR Code */}
            <div className="w-44 h-44 mx-auto p-3 bg-slate-50 border border-slate-200 rounded-xl shadow-inner flex items-center justify-center">
              <div className="grid grid-cols-6 gap-1.5 w-full h-full">
                {Array.from({ length: 36 }).map((_, i) => (
                  <div
                    key={i}
                    className={`rounded ${
                      (i * 7 + 3) % 5 === 0 || i % 2 === 0 ? 'bg-slate-900' : 'bg-transparent'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div className="p-3 bg-amber-50 rounded-md border border-amber-200 font-mono text-center text-xs text-amber-800 font-bold">
              Secret Key: {secretKey}
            </div>
          </div>

          {/* Verification Code Form */}
          <div className="p-5 bg-white border border-slate-200 rounded-lg shadow-sm space-y-4 flex flex-col justify-between text-slate-900">
            <div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Verify 6-Digit Authenticator Token</h3>
              <p className="text-xs text-slate-500 mb-4">
                Enter the passcode generated by your authenticator app to complete active session binding.
              </p>

              <form onSubmit={handleVerify2FACode} className="space-y-4">
                <div>
                  <label className="block text-slate-700 text-xs font-semibold mb-1">Passcode Token</label>
                  <input
                    type="text"
                    maxLength={6}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="w-full bg-slate-50 border border-slate-200 rounded-md px-4 py-2.5 font-mono text-lg text-center tracking-widest text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs rounded-md shadow-sm transition"
                >
                  Verify & Activate 2FA
                </button>
              </form>

              {codeSuccess && (
                <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-md text-xs flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Two-Factor Authentication token verified successfully! Account secured.</span>
                </div>
              )}
            </div>

            <div className="p-3 bg-slate-50 rounded-md border border-slate-200 text-[11px] text-slate-600 space-y-1">
              <span className="font-semibold text-slate-800">Backup Emergency Recovery Codes</span>
              <p className="font-mono text-[10px] text-slate-500">8f21-9941 • 440a-112e • 771b-302a • 922c-8800</p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Security Audit Logs */}
      {activeTab === 'audit_logs' && (
        <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-4 overflow-x-auto text-slate-900">
          <h3 className="font-bold text-slate-900 text-sm mb-0.5">Security & Access Audit Trail</h3>
          <p className="text-xs text-slate-500 mb-3">Immutable audit events tracking user logins, document accesses, and permission checks.</p>

          <table className="w-full text-left text-xs text-slate-800">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] tracking-wider border-b border-slate-200 font-bold">
              <tr>
                <th className="px-3 py-2.5">Timestamp</th>
                <th className="px-3 py-2.5">User</th>
                <th className="px-3 py-2.5">Security Action</th>
                <th className="px-3 py-2.5">Event Details</th>
                <th className="px-3 py-2.5">IP Address</th>
                <th className="px-3 py-2.5">Severity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 transition">
                  <td className="px-3 py-2.5 text-slate-500">{log.timestamp}</td>
                  <td className="px-3 py-2.5 font-sans font-semibold text-slate-900">{log.userName}</td>
                  <td className="px-3 py-2.5 text-blue-700 font-bold">{log.action}</td>
                  <td className="px-3 py-2.5 font-sans text-slate-600">{log.details}</td>
                  <td className="px-3 py-2.5 text-slate-400">{log.ipAddress}</td>
                  <td className="px-3 py-2.5 font-sans">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        log.severity === 'critical'
                          ? 'bg-rose-50 text-rose-700 border border-rose-200'
                          : log.severity === 'warning'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}
                    >
                      {log.severity}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
