import React, { useState, useEffect } from 'react';
import { Camera, CheckCircle2, ShieldCheck, User } from 'lucide-react';

export interface ProfileAvatarProps {
  src?: string | null;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'custom';
  rounded?: 'full' | 'xl' | '2xl' | '3xl';
  className?: string;
  ring?: string;
  showBadge?: boolean;
  badgeType?: 'verified' | 'client' | 'online' | 'lawyer';
  onEditClick?: () => void;
  editTooltip?: string;
  role?: string;
  id?: string;
}

export const ProfileAvatar: React.FC<ProfileAvatarProps> = ({
  src,
  name = 'Counsel',
  size = 'md',
  rounded = '2xl',
  className = '',
  ring = '',
  showBadge = false,
  badgeType = 'verified',
  onEditClick,
  editTooltip = 'Change Profile Picture',
  id
}) => {
  const [hasError, setHasError] = useState(false);

  // Reset error state whenever the src prop changes
  useEffect(() => {
    setHasError(false);
  }, [src]);

  // Extract initials (e.g., "Ritesh Bitode" -> "RB", "Sarah Vance, Esq." -> "SV")
  const getInitials = (fullName: string): string => {
    if (!fullName) return 'CP';
    const cleaned = fullName.replace(/,.*$/, '').trim(); // Remove suffix like ", Esq."
    const parts = cleaned.split(/\s+/).filter(Boolean);
    if (parts.length === 0) return 'CP';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const initials = getInitials(name);

  // Size mappings
  const sizeStyles = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-xs',
    lg: 'w-12 h-12 text-sm',
    xl: 'w-14 h-14 sm:w-16 sm:h-16 text-base',
    '2xl': 'w-20 h-20 sm:w-24 sm:h-24 text-xl',
    '3xl': 'w-28 h-28 sm:w-32 sm:h-32 text-2xl font-bold',
    custom: ''
  };

  // Rounded mappings
  const roundedStyles = {
    full: 'rounded-full',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl'
  };

  const badgeSizeStyles = {
    xs: 'w-2 h-2 -bottom-0.5 -right-0.5',
    sm: 'w-2.5 h-2.5 -bottom-0.5 -right-0.5',
    md: 'w-3 h-3 -bottom-0.5 -right-0.5',
    lg: 'w-3.5 h-3.5 -bottom-0.5 -right-0.5',
    xl: 'w-4 h-4 -bottom-1 -right-1',
    '2xl': 'w-5 h-5 -bottom-1 -right-1 p-0.5',
    '3xl': 'w-6 h-6 -bottom-1 -right-1 p-1'
  };

  const currentSizeClass = sizeStyles[size] || sizeStyles.md;
  const currentRoundedClass = roundedStyles[rounded] || roundedStyles['2xl'];
  const currentBadgeSize = badgeSizeStyles[size === 'custom' ? 'lg' : size] || badgeSizeStyles.md;

  const validSrc = src && typeof src === 'string' && src.trim().length > 0 && !hasError ? src.trim() : null;

  return (
    <div
      className={`relative inline-flex shrink-0 aspect-square select-none ${currentSizeClass} ${className}`}
      id={id}
    >
      {validSrc ? (
        <img
          src={validSrc}
          alt={name}
          referrerPolicy="no-referrer"
          onError={() => setHasError(true)}
          className={`w-full h-full object-cover aspect-square ${currentRoundedClass} ${ring} bg-slate-800 transition-all duration-200`}
        />
      ) : (
        <div
          className={`w-full h-full flex items-center justify-center font-bold text-white uppercase tracking-wider aspect-square ${currentRoundedClass} ${ring} ${
            badgeType === 'client'
              ? 'bg-gradient-to-br from-amber-600 via-amber-700 to-slate-800'
              : 'bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900'
          } shadow-xs`}
        >
          {initials || <User className="w-1/2 h-1/2 text-white/80" />}
        </div>
      )}

      {/* Interactive Photo Edit Overlay Button if onEditClick provided */}
      {onEditClick && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onEditClick();
          }}
          title={editTooltip}
          aria-label={editTooltip}
          className={`absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 hover:opacity-100 transition-opacity duration-150 cursor-pointer backdrop-blur-[1px] ${currentRoundedClass} group`}
        >
          <div className="flex flex-col items-center gap-0.5 p-1 text-center">
            <Camera className="w-5 h-5 drop-shadow-md text-amber-300 group-hover:scale-110 transition-transform" />
            {(size === '2xl' || size === '3xl') && (
              <span className="text-[10px] font-bold text-white drop-shadow-sm px-1.5 py-0.5 rounded bg-black/40">
                Change
              </span>
            )}
          </div>
        </button>
      )}

      {/* Status / Verified Badge */}
      {showBadge && (
        <span
          className={`absolute flex items-center justify-center text-white ring-2 ring-white shadow-xs rounded-full ${currentBadgeSize} ${
            badgeType === 'client'
              ? 'bg-amber-500'
              : badgeType === 'online'
              ? 'bg-emerald-500'
              : 'bg-emerald-600'
          }`}
          title={
            badgeType === 'client'
              ? 'Verified Client Profile'
              : badgeType === 'online'
              ? 'Active Session'
              : 'Verified Legal Counsel'
          }
        >
          {size === '3xl' || size === '2xl' ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
          ) : size === 'xl' || size === 'lg' ? (
            <CheckCircle2 className="w-2.5 h-2.5 text-white" />
          ) : (
            <span className="w-full h-full rounded-full bg-white/40" />
          )}
        </span>
      )}
    </div>
  );
};
