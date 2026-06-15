'use client';

import { useEffect, useState, useCallback, DragEvent, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Upload,
  Loader2,
  Trash2,
  FileText,
  Film,
  Music,
  File,
} from 'lucide-react';
import { getToken } from '@/lib/auth';
import { getMedia, uploadMedia, deleteMedia, MediaFile } from '@/lib/api';

const MEDIA_BASE = 'http://localhost:3005';

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function FileIcon({ mimeType }: { mimeType: string }) {
  if (mimeType.startsWith('video/'))
    return <Film size={28} className="text-purple-400" />;
  if (mimeType.startsWith('audio/'))
    return <Music size={28} className="text-blue-400" />;
  if (mimeType.includes('pdf') || mimeType.includes('text'))
    return <FileText size={28} className="text-orange-400" />;
  return <File size={28} className="text-gray-400" />;
}

function MimeTypeBadge({ mimeType }: { mimeType: string }) {
  const label = mimeType.split('/')[1]?.toUpperCase() ?? mimeType;
  return (
    <span className="text-[10px] font-medium px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">
      {label}
    </span>
  );
}

export default function MediaPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!getToken()) {
      router.replace('/login');
      return;
    }
    setReady(true);
    fetchMedia();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchMedia() {
    setLoading(true);
    setError(null);
    try {
      const res = await getMedia();
      setFiles((res as any) ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load media');
    } finally {
      setLoading(false);
    }
  }

  const handleUpload = useCallback(async (fileList: FileList) => {
    if (!fileList.length) return;
    setUploading(true);
    setError(null);
    try {
      for (const file of Array.from(fileList)) {
        await uploadMedia(file);
      }
      await fetchMedia();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(true);
  }

  function handleDragLeave(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
  }

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files) {
      handleUpload(e.dataTransfer.files);
    }
  }

  function handleFileInput(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      handleUpload(e.target.files);
      e.target.value = '';
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this file? This action cannot be undone.')) return;
    setDeleting(id);
    try {
      await deleteMedia(id);
      setFiles((prev) => prev.filter((f) => f.id !== id));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setDeleting(null);
    }
  }

  if (!ready)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Media Library</h2>
        <p className="text-sm text-gray-500 mt-0.5">
          {files.length} file{files.length !== 1 ? 's' : ''} uploaded
        </p>
      </div>

      {/* Upload area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-10 text-center transition-colors ${
          dragging
            ? 'border-orange-400 bg-orange-50'
            : 'border-gray-200 bg-white hover:border-gray-300'
        }`}
      >
        <input
          id="file-upload"
          type="file"
          multiple
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading}
        />
        <div className="flex flex-col items-center gap-3 pointer-events-none">
          {uploading ? (
            <>
              <Loader2 size={36} className="text-orange-500 animate-spin" />
              <p className="text-sm font-medium text-gray-700">Uploading…</p>
            </>
          ) : (
            <>
              <div className="w-14 h-14 bg-orange-50 border-2 border-orange-200 rounded-full flex items-center justify-center">
                <Upload size={22} className="text-orange-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-700">
                  {dragging ? 'Drop files here' : 'Drag & drop files here'}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  or{' '}
                  <label
                    htmlFor="file-upload"
                    className="text-orange-500 hover:text-orange-600 cursor-pointer underline pointer-events-auto"
                  >
                    browse to upload
                  </label>
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {error}
          <button onClick={fetchMedia} className="ml-3 underline hover:no-underline">
            Retry
          </button>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <Loader2 size={24} className="animate-spin mr-2" />
          Loading media…
        </div>
      ) : files.length === 0 ? (
        <div className="text-center py-16 text-gray-400 text-sm">
          No files uploaded yet. Drop some files above to get started.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {files.map((file) => {
            const isImage = file.mimeType.startsWith('image/');
            const imageUrl = `${MEDIA_BASE}${file.url}`;

            return (
              <div
                key={file.id}
                className="group bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Thumbnail / Icon */}
                <div className="h-36 bg-gray-50 flex items-center justify-center relative overflow-hidden">
                  {isImage ? (
                    <Image
                      src={imageUrl}
                      alt={file.originalName}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <FileIcon mimeType={file.mimeType} />
                  )}

                  {/* Delete overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button
                      onClick={() => handleDelete(file.id)}
                      disabled={deleting === file.id}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-medium rounded-lg transition-colors disabled:opacity-60"
                    >
                      {deleting === file.id ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : (
                        <Trash2 size={12} />
                      )}
                      Delete
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-3">
                  <p className="text-xs font-medium text-gray-800 truncate" title={file.originalName}>
                    {file.originalName}
                  </p>
                  <div className="flex items-center justify-between mt-1.5">
                    <MimeTypeBadge mimeType={file.mimeType} />
                    <span className="text-[10px] text-gray-400">
                      {formatBytes(file.size)}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-1">
                    {new Date(file.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
