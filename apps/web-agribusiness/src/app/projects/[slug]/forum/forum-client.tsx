'use client';

import { useState, useEffect, useRef, FormEvent } from 'react';
import Link from 'next/link';
import { Send, Trash2, MessageCircle, Reply, Loader2, Lock, ImagePlus, X } from 'lucide-react';
import { getDiscussions, postDiscussion, deleteDiscussion, getMyInvestments, uploadFile, type Discussion } from '@/lib/api';
import { useAuth } from '@/components/session-provider';
import { ZoomableImage } from '@/components/zoomable-image';

interface ForumClientProps {
  projectId: string;
}

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  return (
    <div
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white text-xs font-bold"
      style={{ background: 'linear-gradient(135deg, #0d5730, #22c55e)' }}
    >
      {initials || '?'}
    </div>
  );
}

export function ForumClient({ projectId }: ForumClientProps) {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Discussion[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [content, setContent] = useState('');
  const [replyTo, setReplyTo] = useState<Discussion | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  const isAdmin = user?.roles.some((r) =>
    ['super_admin', 'group_admin', 'manager'].includes(r),
  );

  useEffect(() => {
    if (isAdmin) {
      setHasAccess(true);
      return;
    }
    if (!user) {
      setHasAccess(false);
      return;
    }
    getMyInvestments()
      .then((investments) => {
        const approved = investments.some(
          (inv) => inv.projectId === projectId && inv.status === 'approved',
        );
        setHasAccess(approved);
      })
      .catch(() => setHasAccess(false));
  }, [user, projectId, isAdmin]);

  useEffect(() => {
    if (!hasAccess) return;
    getDiscussions(projectId)
      .then(setPosts)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [projectId, hasAccess]);

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0] ?? null;
    setImageFile(f);
    if (f) {
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target?.result as string);
      reader.readAsDataURL(f);
    } else {
      setImagePreview(null);
    }
  }

  function clearImage() {
    setImageFile(null);
    setImagePreview(null);
    if (imageInputRef.current) imageInputRef.current.value = '';
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!content.trim() || !user) return;
    setError(null);
    setSubmitting(true);
    try {
      let imageUrl: string | undefined;
      if (imageFile) {
        const uploaded = await uploadFile(imageFile);
        imageUrl = uploaded.url;
      }
      const newPost = await postDiscussion(projectId, content.trim(), replyTo?.id, imageUrl);
      setPosts((prev) => [...prev, newPost]);
      setContent('');
      setReplyTo(null);
      clearImage();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to post');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(post: Discussion) {
    if (!confirm('Delete this message?')) return;
    try {
      await deleteDiscussion(projectId, post.id);
      setPosts((prev) => prev.filter((p) => p.id !== post.id));
    } catch {
      alert('Failed to delete');
    }
  }

  function startReply(post: Discussion) {
    setReplyTo(post);
    setTimeout(() => textareaRef.current?.focus(), 50);
  }

  // Group: top-level posts + their replies
  const topLevel = posts.filter((p) => !p.parentId);
  const replies = posts.filter((p) => !!p.parentId);

  if (!user) {
    return (
      <div className="flex flex-col items-center py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl mb-4" style={{ background: 'rgba(13,87,48,0.08)' }}>
          <Lock size={28} style={{ color: '#22c55e' }} />
        </div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">Investor-only forum</h3>
        <p className="text-sm text-gray-500 dark:text-white/40 mb-6 max-w-xs">
          Sign in and have an approved investment in this project to access the stakeholder forum.
        </p>
        <Link
          href="/signin"
          className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white"
          style={{ background: 'linear-gradient(135deg, #0d5730, #158040)' }}
        >
          Sign in to continue
        </Link>
      </div>
    );
  }

  if (hasAccess === null) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 size={24} className="animate-spin text-green-500" />
      </div>
    );
  }

  if (!hasAccess) {
    return (
      <div className="flex flex-col items-center py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl mb-4" style={{ background: 'rgba(239,68,68,0.08)' }}>
          <Lock size={28} className="text-red-400" />
        </div>
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">Access restricted</h3>
        <p className="text-sm text-gray-500 dark:text-white/40 mb-6 max-w-xs">
          The stakeholder forum is exclusive to investors with an approved investment in this project.
        </p>
        <Link
          href={`/projects`}
          className="text-sm font-medium hover:underline"
          style={{ color: '#22c55e' }}
        >
          Browse investment opportunities →
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-2 mb-6">
        <MessageCircle size={18} style={{ color: '#22c55e' }} />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Stakeholder Forum
        </h2>
        {posts.length > 0 && (
          <span className="rounded-full px-2 py-0.5 text-xs bg-black/5 dark:bg-white/8 text-gray-500 dark:text-white/40">
            {posts.length}
          </span>
        )}
      </div>

      {/* Post list */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 size={24} className="animate-spin text-green-500" />
        </div>
      ) : topLevel.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-center">
          <MessageCircle size={36} className="text-gray-200 dark:text-white/10 mb-3" />
          <p className="text-sm text-gray-500 dark:text-white/40">
            No discussions yet. Be the first to post!
          </p>
        </div>
      ) : (
        <div className="space-y-5 mb-8">
          {topLevel.map((post) => {
            const postReplies = replies.filter((r) => r.parentId === post.id);
            return (
              <div key={post.id}>
                {/* Top-level post */}
                <div className="flex gap-3">
                  <Avatar name={post.authorName} />
                  <div className="flex-1">
                    <div className="rounded-xl border border-black/8 dark:border-white/8 bg-black/[0.02] dark:bg-white/[0.02] px-4 py-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-gray-800 dark:text-white/80">
                          {post.authorName}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] text-gray-400 dark:text-white/25">
                            {timeAgo(post.createdAt)}
                          </span>
                          {isAdmin && (
                            <button
                              onClick={() => handleDelete(post)}
                              className="text-gray-300 dark:text-white/20 hover:text-red-500 transition"
                            >
                              <Trash2 size={12} />
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-700 dark:text-white/70 leading-relaxed whitespace-pre-wrap">
                        {post.content}
                      </p>
                      {post.imageUrl && (
                        <div className="mt-2 max-h-64 rounded-lg overflow-hidden border border-black/8 dark:border-white/8">
                          <ZoomableImage
                            src={post.imageUrl}
                            alt="attachment"
                            className="w-full max-h-64 object-cover"
                          />
                        </div>
                      )}
                    </div>
                    {user && (
                      <button
                        onClick={() => startReply(post)}
                        className="mt-1 ml-1 flex items-center gap-1 text-xs text-gray-400 dark:text-white/30 hover:text-green-600 dark:hover:text-green-400 transition"
                      >
                        <Reply size={11} /> Reply
                      </button>
                    )}
                  </div>
                </div>

                {/* Replies */}
                {postReplies.length > 0 && (
                  <div className="ml-11 mt-3 space-y-3 border-l-2 border-black/5 dark:border-white/5 pl-4">
                    {postReplies.map((reply) => (
                      <div key={reply.id} className="flex gap-2">
                        <Avatar name={reply.authorName} />
                        <div className="flex-1 rounded-xl border border-black/8 dark:border-white/8 bg-black/[0.02] dark:bg-white/[0.02] px-4 py-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold text-gray-800 dark:text-white/80">
                              {reply.authorName}
                            </span>
                            <div className="flex items-center gap-2">
                              <span className="text-[10px] text-gray-400 dark:text-white/25">
                                {timeAgo(reply.createdAt)}
                              </span>
                              {isAdmin && (
                                <button
                                  onClick={() => handleDelete(reply)}
                                  className="text-gray-300 dark:text-white/20 hover:text-red-500 transition"
                                >
                                  <Trash2 size={12} />
                                </button>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-gray-700 dark:text-white/70 leading-relaxed whitespace-pre-wrap">
                            {reply.content}
                          </p>
                          {reply.imageUrl && (
                            <div className="mt-2 max-h-48 rounded-lg overflow-hidden border border-black/8 dark:border-white/8">
                              <ZoomableImage
                                src={reply.imageUrl}
                                alt="attachment"
                                className="w-full max-h-48 object-cover"
                              />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Compose */}
      {user ? (
        <div className="border-t border-black/8 dark:border-white/8 pt-6">
          {replyTo && (
            <div className="flex items-center justify-between rounded-lg bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800/30 px-3 py-2 mb-3 text-xs text-gray-600 dark:text-white/50">
              <span>Replying to <strong>{replyTo.authorName}</strong></span>
              <button onClick={() => setReplyTo(null)} className="text-gray-400 hover:text-red-500 transition">
                ✕
              </button>
            </div>
          )}
          <div className="flex gap-3">
            <Avatar name={`${user.firstName} ${user.lastName}`.trim() || user.email} />
            <form onSubmit={handleSubmit} className="flex-1">
              <textarea
                ref={textareaRef}
                rows={3}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share an update, ask a question, or start a discussion…"
                className="w-full px-4 py-3 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0C0C0C] text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              />

              {/* Image preview */}
              {imagePreview && (
                <div className="relative mt-2 inline-block">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imagePreview}
                    alt="attachment preview"
                    className="max-h-32 rounded-lg border border-black/10 dark:border-white/10 object-cover"
                  />
                  <button
                    type="button"
                    onClick={clearImage}
                    className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white shadow"
                  >
                    <X size={10} />
                  </button>
                </div>
              )}

              {error && <p className="text-xs text-red-500 mt-1">{error}</p>}

              <div className="flex items-center justify-between mt-2">
                <label className="cursor-pointer inline-flex items-center gap-1.5 text-xs text-gray-400 dark:text-white/30 hover:text-green-600 dark:hover:text-green-400 transition">
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageSelect}
                  />
                  <ImagePlus size={14} />
                  {imageFile ? imageFile.name.slice(0, 24) : 'Attach image'}
                </label>
                <button
                  type="submit"
                  disabled={submitting || !content.trim()}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white disabled:opacity-50 transition"
                  style={{ background: 'linear-gradient(135deg, #0d5730, #158040)' }}
                >
                  {submitting ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Send size={14} />
                  )}
                  {submitting ? 'Posting…' : 'Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className="border-t border-black/8 dark:border-white/8 pt-6 text-center">
          <p className="text-sm text-gray-500 dark:text-white/40">
            <Link href="/signin" className="text-green-600 dark:text-green-400 hover:underline font-medium">
              Sign in
            </Link>{' '}
            to join the discussion
          </p>
        </div>
      )}
    </div>
  );
}
