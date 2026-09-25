import React, { useState } from 'react';
import { Smartphone, Monitor, Laptop, CheckCircle2, RefreshCw, X, Wifi, CloudCheck, ShieldAlert } from 'lucide-react';
import { DeviceSyncStatus } from '../types';

interface DeviceSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  syncStatus: DeviceSyncStatus;
  onForceSync: () => void;
}

export const DeviceSyncModal: React.FC<DeviceSyncModalProps> = ({
  isOpen,
  onClose,
  syncStatus,
  onForceSync
}) => {
  const [isSyncing, setIsSyncing] = useState(false);

  if (!isOpen) return null;

  const handleSyncClick = () => {
    setIsSyncing(true);
    setTimeout(() => {
      onForceSync();
      setIsSyncing(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
              <CloudCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-sm">Multi-Device Synchronization</h3>
              <p className="text-xs text-slate-400">Real-time encrypted sync across mobile & desktop</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-200">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sync Status Banner */}
        <div className="p-4 bg-slate-900/60 border-b border-slate-800 space-y-3">
          <div className="flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 p-3 rounded-xl">
            <div className="flex items-center gap-2 text-xs text-emerald-300">
              <Wifi className="w-4 h-4 animate-pulse" />
              <span>Cross-Device State Engine: <strong>Synchronized</strong></span>
            </div>
            <span className="text-[11px] text-emerald-400 font-mono">0 Pending Mutations</span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Last Cloud Handshake:</span>
            <span className="font-mono text-slate-200">{syncStatus.lastSyncedAt}</span>
          </div>
        </div>

        {/* Active Connected Devices */}
        <div className="p-4 space-y-3">
          <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
            Active Registered Devices (End-to-End Encrypted)
          </p>

          <div className="space-y-2">
            {syncStatus.devices.map((device) => (
              <div
                key={device.id}
                className={`p-3 rounded-xl border flex items-center justify-between text-xs transition ${
                  device.isCurrentDevice
                    ? 'bg-indigo-950/40 border-indigo-700/60 text-slate-100'
                    : 'bg-slate-800/40 border-slate-700/60 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  {device.platform.includes('Mobile') ? (
                    <Smartphone className="w-4 h-4 text-indigo-400" />
                  ) : (
                    <Laptop className="w-4 h-4 text-amber-400" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-100">{device.deviceName}</span>
                      {device.isCurrentDevice && (
                        <span className="text-[9px] bg-indigo-500/20 text-indigo-300 px-1.5 py-0.5 rounded font-mono">
                          THIS DEVICE
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400">{device.platform} • {device.lastActive}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-900 flex justify-between items-center">
          <p className="text-[11px] text-slate-400">
            TLS 1.3 + AES-256 Cloud Sync
          </p>
          <button
            onClick={handleSyncClick}
            disabled={isSyncing}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs rounded-xl flex items-center gap-2 shadow-lg shadow-indigo-600/20 transition disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
            {isSyncing ? 'Synchronizing State...' : 'Force Cloud Sync Now'}
          </button>
        </div>
      </div>
    </div>
  );
};
