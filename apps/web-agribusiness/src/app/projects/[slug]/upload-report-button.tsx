'use client';

import { useState, useRef, FormEvent } from 'react';
import { Upload, X, FileText, Loader2 } from 'lucide-react';
import { useAuth } from '@/components/session-provider';
import { uploadFile, addProjectDocument } from '@/lib/api';

interface UploadReportButtonProps {
  projectId: string;
  teamMembers?: string[];
  managerId?: string;
}

export function UploadReportButton({ projectId, teamMembers, managerId }: UploadReportButtonProps) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isAdmin = user?.roles.some((r) => ['super_admin', 'group_admin', 'manager'].includes(r));
  const isTeamMember =
    user && (teamMembers?.includes(user.id) || managerId === user.id);
  const canUpload = isAdmin || isTeamMember;

  if (!canUpload) return null;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!file || !title.trim()) return;
    setError(null);
    setLoading(true);
    try {
      const uploaded = await uploadFile(file);
      await addProjectDocument(projectId, {
        title: title.trim(),
        description: description.trim() || undefined,
        type: file.type.includes('pdf') ? 'financial_report' : 'other',
        fileUrl: uploaded.url,
        fileSize: uploaded.size,
        mimeType: uploaded.mimeType,
        isPublic,
      });
      setSuccess(true);
      setTimeout(() => {
        setOpen(false);
        setSuccess(false);
        setFile(null);
        setTitle('');
        setDescription('');
        setIsPublic(false);
      }, 1500);
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
        <Upload size={14} />
        Upload Report
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#141414] border border-black/8 dark:border-white/10 shadow-xl">
            <div className="flex items-center justify-between p-5 border-b border-black/8 dark:border-white/8">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Upload Project Report</h3>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              {/* File picker */}
              <div>
                <input
                  ref={inputRef}
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg,.webp"
                  className="hidden"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                />
                <button
                  type="button"
                  onClick={() => inputRef.current?.click()}
                  className="w-full flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-black/15 dark:border-white/15 p-6 text-sm text-gray-400 dark:text-white/40 hover:border-green-500 hover:text-green-600 dark:hover:text-green-400 transition"
                >
                  {file ? (
                    <>
                      <FileText size={24} className="text-green-500" />
                      <span className="font-medium text-gray-700 dark:text-white/70">{file.name}</span>
                      <span className="text-xs">{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                    </>
                  ) : (
                    <>
                      <Upload size={24} />
                      <span>Click to select a file</span>
                      <span className="text-xs">PDF, PNG, JPG — max 50 MB</span>
                    </>
                  )}
                </button>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-white/60 mb-1">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Q2 Financial Report"
                  className="w-full px-3 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-[#0C0C0C] text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 dark:text-white/60 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Optional short description"
                  className="w-full px-3 py-2 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-[#0C0C0C] text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                />
              </div>

              <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-white/60 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="rounded accent-green-600"
                />
                Make this document publicly accessible
              </label>

              {error && (
                <p className="text-xs text-red-500">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading || !file || !title.trim()}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium text-white disabled:opacity-50 transition"
                style={{ background: 'linear-gradient(135deg, #0d5730, #158040)' }}
              >
                {loading ? (
                  <><Loader2 size={14} className="animate-spin" /> Uploading…</>
                ) : success ? (
                  '✓ Uploaded!'
                ) : (
                  <><Upload size={14} /> Upload Report</>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
