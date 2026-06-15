'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Plus,
  Loader2,
  Search,
  ChevronLeft,
  ChevronRight,
  Trash2,
  UserCheck,
  UserX,
  Mail,
  X,
  RefreshCw,
} from 'lucide-react';
import { getToken } from '@/lib/auth';
import {
  getUsers,
  updateUser,
  deleteUser,
  inviteUser,
  syncFirebaseUsers,
  AdminUser,
  ALL_ROLES,
} from '@/lib/api';

// ─── Status badge config ──────────────────────────────────────────────────────

const STATUS_BADGE: Record<string, { label: string; className: string }> = {
  active: { label: 'Active', className: 'bg-green-100 text-green-700' },
  suspended: { label: 'Suspended', className: 'bg-red-100 text-red-600' },
  pending_verification: {
    label: 'Pending Verification',
    className: 'bg-yellow-100 text-yellow-700',
  },
  pending_approval: {
    label: 'Pending Approval',
    className: 'bg-yellow-100 text-yellow-700',
  },
  deactivated: { label: 'Deactivated', className: 'bg-gray-100 text-gray-500' },
};

// ─── Role badge ───────────────────────────────────────────────────────────────

function RoleBadge({ role }: { role: string }) {
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 capitalize">
      {role.replace(/_/g, ' ')}
    </span>
  );
}

// ─── Invite Modal ─────────────────────────────────────────────────────────────

function InviteModal({
  onClose,
  onSuccess,
}: {
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('user');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await inviteUser({
        email: email.trim(),
        roles: [selectedRole],
        firstName: firstName.trim() || undefined,
      });
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send invite');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-semibold text-gray-900">Invite User</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="user@example.com"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Optional"
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white"
            >
              {ALL_ROLES.map((r) => (
                <option key={r} value={r}>
                  {r.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors disabled:opacity-60"
            >
              {loading ? (
                <Loader2 size={15} className="animate-spin" />
              ) : (
                <Mail size={15} />
              )}
              Send Invite
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

const PAGE_LIMIT = 20;

export default function UsersPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  // Inline role editing
  const [editingRoleFor, setEditingRoleFor] = useState<string | null>(null);
  const [roleSelectValue, setRoleSelectValue] = useState('');

  // Action loading states
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Invite modal
  const [showInvite, setShowInvite] = useState(false);

  // Firebase sync
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{ synced: number; updated: number; total: number } | null>(null);

  useEffect(() => {
    if (!getToken()) {
      router.replace('/login');
      return;
    }
    setReady(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUsers = useCallback(async (p = page) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getUsers({
        page: p,
        limit: PAGE_LIMIT,
        search: search || undefined,
        status: statusFilter || undefined,
        role: roleFilter || undefined,
      });
      setUsers(res.data ?? []);
      setTotal(res.total ?? 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load users');
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, search, statusFilter, roleFilter]);

  useEffect(() => {
    if (ready) fetchUsers(page);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, page, search, statusFilter, roleFilter]);

  async function handleStatusChange(user: AdminUser, newStatus: string) {
    setActionLoading(`status-${user.id}`);
    try {
      const updated = await updateUser(user.id, { status: newStatus });
      setUsers((prev) =>
        prev.map((u) => (u.id === user.id ? updated : u)),
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setActionLoading(null);
    }
  }

  async function handleRoleSave(userId: string) {
    if (!roleSelectValue) return;
    setActionLoading(`role-${userId}`);
    try {
      const updated = await updateUser(userId, { roles: [roleSelectValue] });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? updated : u)),
      );
      setEditingRoleFor(null);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update role');
    } finally {
      setActionLoading(null);
    }
  }

  async function handleDelete(user: AdminUser) {
    if (
      !confirm(
        `Are you sure you want to delete ${user.firstName} ${user.lastName} (${user.email})? This action cannot be undone.`,
      )
    )
      return;
    setActionLoading(`delete-${user.id}`);
    try {
      await deleteUser(user.id);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
      setTotal((t) => t - 1);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete user');
    } finally {
      setActionLoading(null);
    }
  }

  async function handleSyncFirebase() {
    if (!confirm('Sync all Firebase users to the local database? New Firebase accounts will be created as local users.')) return;
    setSyncing(true);
    setSyncResult(null);
    try {
      const result = await syncFirebaseUsers();
      setSyncResult(result);
      await fetchUsers(1);
      setPage(1);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Sync failed');
    } finally {
      setSyncing(false);
    }
  }

  function handleSearch(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPage(1);
    fetchUsers(1);
  }

  const totalPages = Math.ceil(total / PAGE_LIMIT);

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <>
      {showInvite && (
        <InviteModal
          onClose={() => setShowInvite(false)}
          onSuccess={() => fetchUsers(page)}
        />
      )}

      <div className="max-w-7xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Users</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              {total} user{total !== 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleSyncFirebase}
              disabled={syncing}
              className="flex items-center gap-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-60"
            >
              {syncing ? <Loader2 size={15} className="animate-spin" /> : <RefreshCw size={15} />}
              Sync Firebase
            </button>
            <button
              onClick={() => setShowInvite(true)}
              className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              <Plus size={16} />
              Invite User
            </button>
          </div>
        </div>

        {/* Sync result banner */}
        {syncResult && (
          <div className="bg-green-50 border border-green-200 text-green-800 text-sm rounded-lg px-4 py-3 flex items-center justify-between">
            <span>
              Sync complete — <strong>{syncResult.synced}</strong> new user{syncResult.synced !== 1 ? 's' : ''} imported,{' '}
              <strong>{syncResult.updated}</strong> existing record{syncResult.updated !== 1 ? 's' : ''} linked.{' '}
              ({syncResult.total} Firebase accounts scanned)
            </span>
            <button onClick={() => setSyncResult(null)} className="ml-4 text-green-600 hover:text-green-800">
              <X size={15} />
            </button>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-4">
          <form
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3"
          >
            {/* Search */}
            <div className="relative flex-1">
              <Search
                size={15}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  if (e.target.value === '') {
                    setPage(1);
                  }
                }}
                placeholder="Search by name or email…"
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
              />
            </div>

            {/* Status filter */}
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white text-gray-700 min-w-[160px]"
            >
              <option value="">All statuses</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="pending_verification">Pending Verification</option>
              <option value="pending_approval">Pending Approval</option>
              <option value="deactivated">Deactivated</option>
            </select>

            {/* Role filter */}
            <select
              value={roleFilter}
              onChange={(e) => {
                setRoleFilter(e.target.value);
                setPage(1);
              }}
              className="px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent bg-white text-gray-700 min-w-[150px]"
            >
              <option value="">All roles</option>
              {ALL_ROLES.map((r) => (
                <option key={r} value={r}>
                  {r.replace(/_/g, ' ')}
                </option>
              ))}
            </select>

            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors"
            >
              Search
            </button>
          </form>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
            {error}
            <button
              onClick={() => fetchUsers(page)}
              className="ml-3 underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Table */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20 text-gray-400">
              <Loader2 size={24} className="animate-spin mr-2" />
              Loading users…
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-500 text-sm">No users found.</p>
              {(search || statusFilter || roleFilter) && (
                <button
                  onClick={() => {
                    setSearch('');
                    setStatusFilter('');
                    setRoleFilter('');
                    setPage(1);
                  }}
                  className="mt-3 text-sm text-orange-500 hover:text-orange-600 font-medium"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[900px]">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">
                      Name
                    </th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">
                      Email
                    </th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">
                      Roles
                    </th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">
                      Status
                    </th>
                    <th className="text-left px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">
                      Joined
                    </th>
                    <th className="text-right px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.map((user) => {
                    const badge =
                      STATUS_BADGE[user.status] ?? STATUS_BADGE.deactivated;
                    const isActive = user.status === 'active';
                    return (
                      <tr
                        key={user.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        {/* Name */}
                        <td className="px-5 py-3.5">
                          <Link
                            href={`/users/${user.id}`}
                            className="font-medium text-gray-900 hover:text-orange-600 transition-colors"
                          >
                            {user.firstName} {user.lastName}
                          </Link>
                        </td>

                        {/* Email */}
                        <td className="px-5 py-3.5 text-gray-500 text-xs font-mono">
                          {user.email}
                        </td>

                        {/* Roles */}
                        <td className="px-5 py-3.5">
                          {editingRoleFor === user.id ? (
                            <div className="flex items-center gap-2">
                              <select
                                value={roleSelectValue}
                                onChange={(e) =>
                                  setRoleSelectValue(e.target.value)
                                }
                                className="px-2 py-1 text-xs border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                                autoFocus
                              >
                                {ALL_ROLES.map((r) => (
                                  <option key={r} value={r}>
                                    {r.replace(/_/g, ' ')}
                                  </option>
                                ))}
                              </select>
                              <button
                                onClick={() => handleRoleSave(user.id)}
                                disabled={actionLoading === `role-${user.id}`}
                                className="px-2 py-1 text-xs font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-md transition-colors disabled:opacity-60"
                              >
                                {actionLoading === `role-${user.id}` ? (
                                  <Loader2 size={11} className="animate-spin" />
                                ) : (
                                  'Save'
                                )}
                              </button>
                              <button
                                onClick={() => setEditingRoleFor(null)}
                                className="px-2 py-1 text-xs text-gray-500 hover:text-gray-700 rounded-md"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <div className="flex flex-wrap gap-1">
                              {(user.roles ?? []).length === 0 ? (
                                <span className="text-gray-400 text-xs">—</span>
                              ) : (
                                user.roles.map((r) => (
                                  <RoleBadge key={r} role={r} />
                                ))
                              )}
                            </div>
                          )}
                        </td>

                        {/* Status */}
                        <td className="px-5 py-3.5">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${badge.className}`}
                          >
                            {badge.label}
                          </span>
                        </td>

                        {/* Joined */}
                        <td className="px-5 py-3.5 text-gray-400 text-xs">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center justify-end gap-1.5 flex-wrap">
                            {/* Activate / Suspend */}
                            {isActive ? (
                              <button
                                onClick={() =>
                                  handleStatusChange(user, 'suspended')
                                }
                                disabled={
                                  actionLoading === `status-${user.id}`
                                }
                                title="Suspend user"
                                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors disabled:opacity-60"
                              >
                                {actionLoading === `status-${user.id}` ? (
                                  <Loader2 size={11} className="animate-spin" />
                                ) : (
                                  <UserX size={12} />
                                )}
                                Suspend
                              </button>
                            ) : (
                              <button
                                onClick={() =>
                                  handleStatusChange(user, 'active')
                                }
                                disabled={
                                  actionLoading === `status-${user.id}`
                                }
                                title="Activate user"
                                className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-md transition-colors disabled:opacity-60"
                              >
                                {actionLoading === `status-${user.id}` ? (
                                  <Loader2 size={11} className="animate-spin" />
                                ) : (
                                  <UserCheck size={12} />
                                )}
                                Activate
                              </button>
                            )}

                            {/* Change Role */}
                            {editingRoleFor !== user.id && (
                              <button
                                onClick={() => {
                                  setEditingRoleFor(user.id);
                                  setRoleSelectValue(user.roles?.[0] ?? 'customer');
                                }}
                                className="px-2.5 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                              >
                                Change Role
                              </button>
                            )}

                            {/* Delete */}
                            <button
                              onClick={() => handleDelete(user)}
                              disabled={actionLoading === `delete-${user.id}`}
                              title="Delete user"
                              className="flex items-center justify-center w-7 h-7 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors disabled:opacity-60"
                            >
                              {actionLoading === `delete-${user.id}` ? (
                                <Loader2 size={13} className="animate-spin" />
                              ) : (
                                <Trash2 size={13} />
                              )}
                            </button>
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>
              Page {page} of {totalPages} &middot; {total} total
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1 || loading}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 transition-colors"
              >
                <ChevronLeft size={15} /> Previous
              </button>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages || loading}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 transition-colors"
              >
                Next <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
