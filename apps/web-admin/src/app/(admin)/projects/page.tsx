'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Plus, Pencil, Globe, Archive, Loader2, Sprout,
  RotateCcw, Trash2, Users, Heart, Bookmark, Eye, EyeOff,
} from 'lucide-react';
import { getToken } from '@/lib/auth';
import {
  getProjects, publishProject, archiveProject, restoreProject, permanentDeleteProject,
  Project, PROJECT_STATUSES,
} from '@/lib/api';
import { fmtCurrency } from '@/lib/currency';

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  draft:       { label: 'Draft',       className: 'bg-gray-100 text-gray-600' },
  open:        { label: 'Open',        className: 'bg-blue-100 text-blue-700' },
  funding:     { label: 'Funding',     className: 'bg-yellow-100 text-yellow-700' },
  funded:      { label: 'Funded',      className: 'bg-green-100 text-green-700' },
  in_progress: { label: 'In Progress', className: 'bg-indigo-100 text-indigo-700' },
  completed:   { label: 'Completed',   className: 'bg-teal-100 text-teal-700' },
  suspended:   { label: 'Suspended',   className: 'bg-red-100 text-red-600' },
};

type ConfirmAction =
  | { type: 'archive'; project: Project }
  | { type: 'restore'; project: Project }
  | { type: 'permanent'; project: Project };

export default function ProjectsPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [showDeleted, setShowDeleted] = useState(false);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);

  useEffect(() => {
    if (!getToken()) { router.replace('/login'); return; }
    setReady(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getProjects({
        status: statusFilter || undefined,
        limit: 100,
        includeDeleted: showDeleted,
      });
      setProjects(data ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load projects');
    } finally {
      setLoading(false);
    }
  }, [statusFilter, showDeleted]);

  useEffect(() => {
    if (ready) fetchProjects();
  }, [ready, fetchProjects]);

  async function handlePublish(id: string) {
    setActionLoading(`publish-${id}`);
    try {
      await publishProject(id);
      await fetchProjects();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to publish');
    } finally {
      setActionLoading(null);
    }
  }

  async function handleConfirm() {
    if (!confirmAction) return;
    const { project } = confirmAction;
    const key = `${confirmAction.type}-${project.id}`;
    setActionLoading(key);
    setConfirmAction(null);
    try {
      if (confirmAction.type === 'archive') {
        await archiveProject(project.id);
        setProjects((prev) => prev.map((p) => p.id === project.id ? { ...p, status: 'suspended' } : p));
      } else if (confirmAction.type === 'restore') {
        await restoreProject(project.id);
        await fetchProjects();
      } else if (confirmAction.type === 'permanent') {
        await permanentDeleteProject(project.id);
        await fetchProjects();
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Action failed');
    } finally {
      setActionLoading(null);
    }
  }

  if (!ready) return <div className="min-h-screen flex items-center justify-center"><div className="text-gray-400">Loading...</div></div>;

  return (
    <>
      {/* Confirm modal */}
      {confirmAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 space-y-4">
            <div className="space-y-1">
              <p className="font-semibold text-gray-900 text-sm">
                {confirmAction.type === 'archive' && 'Archive this project?'}
                {confirmAction.type === 'restore' && 'Restore this project?'}
                {confirmAction.type === 'permanent' && 'Permanently delete this project?'}
              </p>
              <p className="text-sm text-gray-500 line-clamp-2">&ldquo;{confirmAction.project.title}&rdquo;</p>
              {confirmAction.type === 'archive' && (
                <p className="text-xs text-gray-400 mt-1">The project will be set to suspended. You can restore it later.</p>
              )}
              {confirmAction.type === 'restore' && (
                <p className="text-xs text-gray-400 mt-1">The project will be restored to draft status.</p>
              )}
              {confirmAction.type === 'permanent' && (
                <p className="text-xs text-red-500 mt-1">This cannot be undone. The project will be visible to admins but cannot be restored.</p>
              )}
            </div>
            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setConfirmAction(null)}
                className="flex-1 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className={`flex-1 px-4 py-2 text-sm font-medium text-white rounded-lg transition ${
                  confirmAction.type === 'permanent'
                    ? 'bg-red-500 hover:bg-red-600'
                    : confirmAction.type === 'restore'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-orange-500 hover:bg-orange-600'
                }`}
              >
                {confirmAction.type === 'archive' && 'Archive'}
                {confirmAction.type === 'restore' && 'Restore'}
                {confirmAction.type === 'permanent' && 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Projects</h2>
            <p className="text-sm text-gray-500 mt-0.5">{projects.length} project{projects.length !== 1 ? 's' : ''}{showDeleted ? ' (deleted)' : ''}</p>
          </div>
          <Link
            href="/projects/new"
            className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={16} /> New Project
          </Link>
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-3">
              <label className="text-sm text-gray-600">Status:</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                disabled={showDeleted}
                className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white text-gray-700 disabled:opacity-40"
              >
                <option value="">All statuses</option>
                {PROJECT_STATUSES.map((s) => (
                  <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
                ))}
              </select>
            </div>
            <button
              onClick={() => { setShowDeleted((v) => !v); setStatusFilter(''); }}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-lg border transition ${
                showDeleted
                  ? 'bg-red-50 border-red-200 text-red-600'
                  : 'bg-gray-50 border-gray-200 text-gray-500 hover:bg-gray-100'
              }`}
            >
              {showDeleted ? <EyeOff size={13} /> : <Eye size={13} />}
              {showDeleted ? 'Showing Deleted' : 'Show Deleted'}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            {error} <button onClick={fetchProjects} className="ml-2 underline">Retry</button>
          </div>
        )}

        {/* Table */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20 text-gray-400">
              <Loader2 size={24} className="animate-spin mr-2" /> Loading projects…
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-20">
              <Sprout size={40} className="text-gray-200 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">{showDeleted ? 'No deleted projects.' : 'No projects found.'}</p>
              {!showDeleted && (
                <Link href="/projects/new" className="mt-3 inline-flex items-center gap-1.5 text-sm text-orange-500 font-medium">
                  <Plus size={14} /> Create the first project
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[1020px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    {['Title', 'Category', 'Status', 'Funding Goal', 'Raised', '% Done', 'Investors', 'Followers', 'Engagement', 'Actions'].map((h) => (
                      <th key={h} className={`px-4 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide ${h === 'Actions' ? 'text-right' : 'text-left'}`}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {projects.map((project) => {
                    const badge = STATUS_BADGE[project.status] ?? STATUS_BADGE.draft;
                    const isDeleted = project.isDeleted;
                    const isSuspended = project.status === 'suspended';
                    const archiveKey = `archive-${project.id}`;
                    const restoreKey = `restore-${project.id}`;
                    const permKey = `permanent-${project.id}`;
                    const anyLoading = actionLoading === archiveKey || actionLoading === restoreKey || actionLoading === permKey;
                    return (
                      <tr key={project.id} className={`hover:bg-gray-50 transition-colors ${isDeleted ? 'opacity-50' : ''}`}>
                        <td className="px-4 py-3.5 max-w-[180px]">
                          {isDeleted ? (
                            <span className="font-medium text-gray-500 block truncate">{project.title}</span>
                          ) : (
                            <Link href={`/projects/${project.id}`} className="font-medium text-gray-900 hover:text-orange-600 transition-colors block truncate">
                              {project.title}
                            </Link>
                          )}
                          <p className="text-xs text-gray-400 truncate">{project.location}, {project.country}</p>
                          {isDeleted && (
                            <span className="inline-block mt-0.5 text-[10px] font-semibold bg-red-100 text-red-500 px-1.5 py-0.5 rounded">Deleted</span>
                          )}
                        </td>
                        <td className="px-4 py-3.5 text-gray-500 capitalize text-xs">
                          {project.category.replace(/_/g, ' ')}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${badge.className}`}>
                            {badge.label}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-gray-700 text-xs font-mono">
                          {fmtCurrency(project.fundingGoal, project.currency)}
                        </td>
                        <td className="px-4 py-3.5 text-gray-700 text-xs font-mono">
                          {fmtCurrency(project.fundingRaised, project.currency)}
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2">
                            <div className="w-14 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-green-500 rounded-full"
                                style={{ width: `${Math.min(project.completionPercentage, 100)}%` }}
                              />
                            </div>
                            <span className="text-xs text-gray-500">{project.completionPercentage}%</span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                            <Users size={11} className="text-gray-400" />
                            {project.investorCount}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          <span className="inline-flex items-center gap-1 text-xs text-blue-600">
                            <Bookmark size={11} className="text-blue-400" />
                            {project.followersCount ?? 0}
                          </span>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <span className="flex items-center gap-0.5">
                              <Heart size={11} className="text-pink-400" />
                              {project.likeCount ?? 0}
                            </span>
                            <span className="flex items-center gap-0.5">
                              <Sprout size={11} className="text-green-400" />
                              {project.interestingCount ?? 0}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3.5">
                          <div className="flex items-center justify-end gap-1.5">
                            {!isDeleted && (
                              <>
                                {project.status === 'draft' && (
                                  <button
                                    onClick={() => handlePublish(project.id)}
                                    disabled={actionLoading === `publish-${project.id}`}
                                    className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-md transition-colors disabled:opacity-60"
                                  >
                                    {actionLoading === `publish-${project.id}` ? <Loader2 size={11} className="animate-spin" /> : <Globe size={11} />}
                                    Publish
                                  </button>
                                )}
                                {!isSuspended && (
                                  <>
                                    <Link href={`/projects/${project.id}`} className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
                                      <Pencil size={11} /> Edit
                                    </Link>
                                    <button
                                      onClick={() => setConfirmAction({ type: 'archive', project })}
                                      disabled={anyLoading}
                                      className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors disabled:opacity-60"
                                    >
                                      {actionLoading === archiveKey ? <Loader2 size={11} className="animate-spin" /> : <Archive size={11} />}
                                      Archive
                                    </button>
                                  </>
                                )}
                                {isSuspended && (
                                  <>
                                    <button
                                      onClick={() => setConfirmAction({ type: 'restore', project })}
                                      disabled={anyLoading}
                                      className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-md transition-colors disabled:opacity-60"
                                    >
                                      {actionLoading === restoreKey ? <Loader2 size={11} className="animate-spin" /> : <RotateCcw size={11} />}
                                      Restore
                                    </button>
                                    <button
                                      onClick={() => setConfirmAction({ type: 'permanent', project })}
                                      disabled={anyLoading}
                                      className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors disabled:opacity-60"
                                    >
                                      {actionLoading === permKey ? <Loader2 size={11} className="animate-spin" /> : <Trash2 size={11} />}
                                      Delete
                                    </button>
                                  </>
                                )}
                              </>
                            )}
                            {isDeleted && (
                              <span className="text-xs text-gray-300 italic">Permanently deleted</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
