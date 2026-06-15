'use client';

import { useState, useRef } from 'react';
import { ImagePlus, X, Loader2 } from 'lucide-react';
import { useAuth } from '@/components/session-provider';
import { uploadFile, addProjectImage } from '@/lib/api';

interface UploadGalleryButtonProps {
  projectId: string;
  teamMembers?: string[];
  managerId?: string;
}

export function UploadGalleryButton({ projectId, teamMembers, managerId }: UploadGalleryButtonProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isAdmin = user?.roles.some((r) => ['super_admin', 'group_admin', 'manager'].includes(r));
  const isTeamMember = user && (teamMembers?.includes(user.id) || managerId === user.id);
  if (!isAdmin && !isTeamMember) return null;

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0] ?? null;
    setFile(selected);
    setError(null);
    if (selected) {
      const reader = new FileReader();
      reader.onload = (ev) => setPreview(ev.target?.result as string);
      reader.readAsDataURL(selected);
    } else {
      setPreview(null);
    }
  }

  async function handleUpload() {
    if (!file) return;
    setError(null);
    setLoading(true);
    try {
      const uploaded = await uploadFile(file);
      await addProjectImage(projectId, uploaded.url);
      setSuccess(true);
      setTimeout(() => {
        setOpen(false);
        setSuccess(false);
        setFile(null);
        setPreview(null);
        window.location.reload();
      }, 1200);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition-all hover:opacity-90"
        style={{ background: 'linear-gradient(135deg, #0d5730, #158040)' }}
      >
        <ImagePlus size={14} />
        Add Image
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#141414] border border-black/8 dark:border-white/10 shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-black/8 dark:border-white/8">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Add Gallery Image</h3>
              <button
                onClick={() => { setOpen(false); setFile(null); setPreview(null); setError(null); }}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />

              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="w-full flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-black/15 dark:border-white/15 overflow-hidden transition hover:border-green-500"
                style={{ minHeight: 160 }}
              >
                {preview ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={preview} alt="Preview" className="w-full object-cover max-h-48" />
                ) : (
                  <div className="flex flex-col items-center gap-2 py-8 text-sm text-gray-400 dark:text-white/40 hover:text-green-600 dark:hover:text-green-400">
                    <ImagePlus size={28} />
                    <span>Click to select an image</span>
                    <span className="text-xs">JPG, PNG, WEBP — max 50 MB</span>
                  </div>
                )}
              </button>

              {error && <p className="text-xs text-red-500">{error}</p>}

              <button
                type="button"
                onClick={handleUpload}
                disabled={loading || !file}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium text-white disabled:opacity-50 transition"
                style={{ background: 'linear-gradient(135deg, #0d5730, #158040)' }}
              >
                {loading ? (
                  <><Loader2 size={14} className="animate-spin" /> Uploading…</>
                ) : success ? (
                  '✓ Image added!'
                ) : (
                  <><ImagePlus size={14} /> Upload Image</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
