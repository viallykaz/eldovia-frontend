'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Save, User, Building, Calendar, Mail } from 'lucide-react';
import { getToken } from '@/lib/auth';
import { getUser, updateUser, AdminUser, ALL_ROLES } from '@/lib/api';

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

const STATUS_TRANSITIONS: Record<
  string,
  { label: string; value: string; className: string }[]
> = {
  active: [
    {
      label: 'Suspend',
      value: 'suspended',
      className:
        'text-red-600 bg-red-50 hover:bg-red-100 border-red-200',
    },
    {
      label: 'Deactivate',
      value: 'deactivated',
      className:
        'text-gray-600 bg-gray-100 hover:bg-gray-200 border-gray-200',
    },
  ],
  suspended: [
    {
      label: 'Activate',
      value: 'active',
      className:
        'text-green-700 bg-green-50 hover:bg-green-100 border-green-200',
    },
    {
      label: 'Deactivate',
      value: 'deactivated',
      className:
        'text-gray-600 bg-gray-100 hover:bg-gray-200 border-gray-200',
    },
  ],
  pending_verification: [
    {
      label: 'Activate',
      value: 'active',
      className:
        'text-green-700 bg-green-50 hover:bg-green-100 border-green-200',
    },
    {
      label: 'Suspend',
      value: 'suspended',
      className:
        'text-red-600 bg-red-50 hover:bg-red-100 border-red-200',
    },
  ],
  pending_approval: [
    {
      label: 'Approve & Activate',
      value: 'active',
      className:
        'text-green-700 bg-green-50 hover:bg-green-100 border-green-200',
    },
    {
      label: 'Suspend',
      value: 'suspended',
      className:
        'text-red-600 bg-red-50 hover:bg-red-100 border-red-200',
    },
  ],
  deactivated: [
    {
      label: 'Reactivate',
      value: 'active',
      className:
        'text-green-700 bg-green-50 hover:bg-green-100 border-green-200',
    },
  ],
};

// ─── Info row helper ──────────────────────────────────────────────────────────

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon size={15} className="text-orange-500" />
      </div>
      <div>
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">
          {label}
        </p>
        <p className="text-sm text-gray-900 mt-0.5 break-all">{value}</p>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function UserDetailPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  const [ready, setReady] = useState(false);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Roles editing
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  // Save / status change loading
  const [saving, setSaving] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (!getToken()) {
      router.replace('/login');
      return;
    }
    setReady(true);
    fetchUser();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchUser() {
    setLoading(true);
    setError(null);
    try {
      const res = await getUser(userId);
      setUser(res);
      setSelectedRoles(res.roles ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load user');
    } finally {
      setLoading(false);
    }
  }

  function toggleRole(role: string) {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role],
    );
    setSaveSuccess(false);
  }

  async function handleSaveRoles() {
    if (!user) return;
    setSaving(true);
    setSaveSuccess(false);
    try {
      const updated = await updateUser(user.id, { roles: selectedRoles });
      setUser(updated);
      setSelectedRoles(updated.roles ?? []);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to save roles');
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusChange(newStatus: string) {
    if (!user) return;
    setStatusLoading(true);
    try {
      const updated = await updateUser(user.id, { status: newStatus });
      setUser(updated);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setStatusLoading(false);
    }
  }

  const rolesChanged =
    user &&
    JSON.stringify([...selectedRoles].sort()) !==
      JSON.stringify([...(user.roles ?? [])].sort());

  if (!ready) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back link */}
      <Link
        href="/users"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft size={15} />
        Back to Users
      </Link>

      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <Loader2 size={24} className="animate-spin mr-2" />
          Loading user…
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
          {error}
          <button onClick={fetchUser} className="ml-3 underline hover:no-underline">
            Retry
          </button>
        </div>
      ) : user ? (
        <>
          {/* Page title */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {user.firstName} {user.lastName}
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">{user.email}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Left column: info + status */}
            <div className="lg:col-span-1 space-y-5">
              {/* Info card */}
              <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 space-y-4">
                <h3 className="text-sm font-semibold text-gray-900">
                  User Info
                </h3>

                <InfoRow
                  icon={User}
                  label="Full name"
                  value={`${user.firstName} ${user.lastName}`}
                />
                <InfoRow icon={Mail} label="Email" value={user.email} />
                <InfoRow
                  icon={Calendar}
                  label="Joined"
                  value={new Date(user.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                />
                {user.organizationId && (
                  <InfoRow
                    icon={Building}
                    label="Organization ID"
                    value={user.organizationId}
                  />
                )}
              </div>

              {/* Status card */}
              <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-gray-900">Status</h3>
                  {statusLoading && (
                    <Loader2 size={14} className="animate-spin text-gray-400" />
                  )}
                </div>

                {/* Current status badge */}
                {(() => {
                  const badge =
                    STATUS_BADGE[user.status] ?? STATUS_BADGE.deactivated;
                  return (
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${badge.className}`}
                    >
                      {badge.label}
                    </span>
                  );
                })()}

                {/* Transition buttons */}
                <div className="space-y-2">
                  {(STATUS_TRANSITIONS[user.status] ?? []).map((t) => (
                    <button
                      key={t.value}
                      onClick={() => handleStatusChange(t.value)}
                      disabled={statusLoading}
                      className={`w-full px-3 py-2 text-xs font-medium rounded-lg border transition-colors disabled:opacity-60 ${t.className}`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column: roles */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">
                      Roles
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Select all roles that apply to this user.
                    </p>
                  </div>
                  {saveSuccess && (
                    <span className="text-xs text-green-600 font-medium">
                      Saved!
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {ALL_ROLES.map((role) => {
                    const checked = selectedRoles.includes(role);
                    return (
                      <label
                        key={role}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg border cursor-pointer transition-colors select-none ${
                          checked
                            ? 'border-orange-300 bg-orange-50'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleRole(role)}
                          className="w-4 h-4 accent-orange-500 flex-shrink-0"
                        />
                        <span
                          className={`text-sm font-medium capitalize ${
                            checked ? 'text-orange-700' : 'text-gray-700'
                          }`}
                        >
                          {role.replace(/_/g, ' ')}
                        </span>
                      </label>
                    );
                  })}
                </div>

                <div className="pt-2 border-t border-gray-100">
                  <button
                    onClick={handleSaveRoles}
                    disabled={saving || !rolesChanged}
                    className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors disabled:opacity-50"
                  >
                    {saving ? (
                      <Loader2 size={15} className="animate-spin" />
                    ) : (
                      <Save size={15} />
                    )}
                    Save Changes
                  </button>
                  {!rolesChanged && !saveSuccess && (
                    <p className="text-xs text-gray-400 mt-2">
                      No changes to save.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}
