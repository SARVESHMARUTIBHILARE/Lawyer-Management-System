import React, { useState, useRef } from 'react';
import { Upload, Link, Image as ImageIcon, X, Check, RefreshCw } from 'lucide-react';
import { compressImageFile } from '../../utils/imageOptimizer';

interface PhotoUploadFieldProps {
  label: string;
  value: string;
  onChange: (newUrl: string) => void;
  helperText?: string;
  defaultPresets?: { name: string; url: string }[];
  idPrefix?: string;
}

export const DEFAULT_PORTRAIT_PRESETS = [
  {
    name: 'Ritesh Bitode',
    url: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&q=80&w=300&h=300'
  },
  {
    name: 'Sarah Vance, Esq.',
    url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300&h=300'
  },
  {
    name: 'Marcus Sterling, Esq.',
    url: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300&h=300'
  },
  {
    name: 'Elena Rostova, Esq.',
    url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300&h=300'
  },
  {
    name: 'David Kim, Esq.',
    url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=300&h=300'
  },
  {
    name: 'Rachel Adams, Esq.',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300&h=300'
  },
  {
    name: 'Julian Hayes, Esq.',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300&h=300'
  }
];

export const PhotoUploadField: React.FC<PhotoUploadFieldProps> = ({
  label,
  value,
  onChange,
  helperText,
  defaultPresets = DEFAULT_PORTRAIT_PRESETS,
  idPrefix = 'photo-field'
}) => {
  const [activeMode, setActiveMode] = useState<'upload' | 'preset' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState(value);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (file: File) => {
    setUploadError(null);
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPG, PNG, WEBP).');
      return;
    }
    if (file.size > 15 * 1024 * 1024) {
      setUploadError('Image size exceeds 15MB limit. Please choose a smaller photo.');
      return;
    }

    try {
      const compressed = await compressImageFile(file, 260, 260, 0.78);
      onChange(compressed);
      setUrlInput(compressed);
    } catch (err) {
      setUploadError('Failed to process image file. Please try another photo.');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleApplyUrl = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim());
      setUploadError(null);
    }
  };

  return (
    <div className="space-y-3" id={`${idPrefix}-container`}>
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700">
          {label} <span className="text-rose-500">*</span>
        </label>
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-[11px] font-medium text-slate-600">
          <button
            type="button"
            onClick={() => setActiveMode('upload')}
            className={`px-2.5 py-1 rounded-md transition cursor-pointer flex items-center gap-1 ${
              activeMode === 'upload'
                ? 'bg-white text-blue-900 shadow-2xs font-bold'
                : 'hover:text-slate-900'
            }`}
          >
            <Upload className="w-3 h-3" />
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('preset')}
            className={`px-2.5 py-1 rounded-md transition cursor-pointer flex items-center gap-1 ${
              activeMode === 'preset'
                ? 'bg-white text-blue-900 shadow-2xs font-bold'
                : 'hover:text-slate-900'
            }`}
          >
            <ImageIcon className="w-3 h-3" />
            Presets
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('url')}
            className={`px-2.5 py-1 rounded-md transition cursor-pointer flex items-center gap-1 ${
              activeMode === 'url'
                ? 'bg-white text-blue-900 shadow-2xs font-bold'
                : 'hover:text-slate-900'
            }`}
          >
            <Link className="w-3 h-3" />
            Web URL
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-slate-50/80 p-3.5 rounded-2xl border border-slate-200">
        {/* Photo Preview Thumbnail */}
        <div className="relative shrink-0 group">
          <img
            src={value || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256&h=256'}
            alt="Preview Portrait"
            className="w-20 h-20 rounded-2xl object-cover ring-2 ring-blue-900 shadow-md bg-slate-200"
            onError={(e) => {
              // fallback if broken url
              (e.target as HTMLImageElement).src =
                'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256&h=256';
            }}
          />
          {value && (
            <span className="absolute -bottom-1 -right-1 p-1 bg-emerald-600 text-white rounded-full shadow-xs ring-2 ring-white">
              <Check className="w-3 h-3" />
            </span>
          )}
        </div>

        {/* Dynamic Controls based on selected mode */}
        <div className="flex-1 w-full space-y-2">
          {activeMode === 'upload' && (
            <div>
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition flex flex-col items-center justify-center gap-1.5 ${
                  isDragging
                    ? 'border-blue-900 bg-blue-50/70 text-blue-900'
                    : 'border-slate-300 hover:border-blue-800 hover:bg-white text-slate-600'
                }`}
              >
                <Upload className="w-4 h-4 text-blue-900" />
                <div className="text-xs">
                  <span className="font-bold text-blue-900">Click to upload photo</span> or drag & drop
                </div>
                <p className="text-[10px] text-slate-400">
                  PNG, JPG, or WEBP from your computer (auto-converted to data preview)
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileChange(e.target.files[0]);
                  }
                }}
                className="hidden"
                id={`${idPrefix}-file-input`}
              />
            </div>
          )}

          {activeMode === 'preset' && (
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-500">
                Choose a professional counsel portrait preset:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {defaultPresets.map((preset, idx) => {
                  const isSelected = value === preset.url;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        onChange(preset.url);
                        setUrlInput(preset.url);
                        setUploadError(null);
                      }}
                      className={`flex items-center gap-2 p-1.5 rounded-xl border text-left text-xs transition cursor-pointer ${
                        isSelected
                          ? 'bg-blue-900 text-white border-blue-900 shadow-xs'
                          : 'bg-white hover:bg-slate-100 text-slate-800 border-slate-200'
                      }`}
                    >
                      <img
                        src={preset.url}
                        alt={preset.name}
                        className="w-7 h-7 rounded-lg object-cover shrink-0"
                      />
                      <span className="truncate text-[11px] font-medium leading-tight">
                        {preset.name.split(',')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {activeMode === 'url' && (
            <div className="space-y-1.5">
              <div className="flex gap-2">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://example.com/lawyer-portrait.jpg"
                  className="flex-1 px-3 py-2 text-xs rounded-xl bg-white border border-slate-200 focus:ring-2 focus:ring-blue-900 focus:outline-none"
                  id={`${idPrefix}-url-input`}
                />
                <button
                  type="button"
                  onClick={handleApplyUrl}
                  className="px-3 py-2 bg-blue-900 hover:bg-blue-950 text-white text-xs font-bold rounded-xl transition cursor-pointer shrink-0"
                >
                  Apply
                </button>
              </div>
              <p className="text-[10px] text-slate-400">
                Paste any publicly accessible HTTPS image link.
              </p>
            </div>
          )}

          {uploadError && (
            <p className="text-[11px] text-rose-600 font-medium">{uploadError}</p>
          )}

          {helperText && !uploadError && (
            <p className="text-[10px] text-slate-400">{helperText}</p>
          )}
        </div>
      </div>
    </div>
  );
};
