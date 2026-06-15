'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Bell, TrendingUp, Users, Clock, CheckCircle2, XCircle,
  AlertCircle, RefreshCw, ExternalLink, Loader2,
} from 'lucide-react';
import { getToken } from '@/lib/auth';
import {
  getUsers, getProjects, getProjectInvestments,
  approveInvestment, rejectInvestment,
  type AdminUser, type Investment, type Project,
} from '@/lib/api';

const fmt = (n: number, currency = 'USD') => {
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n);
  } catch {
    return `${currency} ${n.toLocaleString()}`;
  }
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

interface InvestmentWithProject extends Investment {
  projectTitle?: string;
  projectSlug?: string;
}

export default function NotificationsPage() {
  const router = useRouter();

  const [pendingInvestments, setPendingInvestments] = useState<InvestmentWithProject[]>([]);
  const [pendingUsers, setPendingUsers] = useState<AdminUser[]>([]);
  const [recentUsers, setRecentUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [actionMap, setActionMap] = useState<Record<string, 'approving' | 'rejecting'>>({});
  const [rejectionInput, setRejectionInput] = useState<{ id: string; reason: string } | null>(null);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const [projects, usersRes, pendingUsersRes] = await Promise.all([
        getProjects({ limit: 100 }),
        getUsers({ limit: 10, sortOrder: 'DESC' } as any),
        getUsers({ limit: 50, status: 'pending_approval' }),
      ]);

      const projectMap = new Map(projects.map((p) => [p.id, p]));

      // Collect investments from all projects (paginated batch)
      const investmentArrays = await Promise.allSettled(
        projects.map((p) => getProjectInvestments(p.id)),
      );
      const allInvestments: InvestmentWithProject[] = investmentArrays.flatMap((r, i) => {
        if (r.status !== 'fulfilled') return [];
        return r.value.map((inv) => ({
          ...inv,
          projectTitle: projectMap.get(inv.projectId)?.title,
          projectSlug: projectMap.get(inv.projectId)?.slug,
        }));
      });

      const pending = allInvestments
        .filter((inv) => inv.status === 'pending')
        .sort((a, b) => new Date(b.investedAt).getTime() - new Date(a.investedAt).getTime());

      setPendingInvestments(pending);
      setRecentUsers((usersRes.data ?? []).slice(0, 8));
      setPendingUsers(pendingUsersRes.data ?? []);
    } catch {}
    finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (!getToken()) { router.replace('/login'); return; }
    load();
  }, [load, router]);

  async function handleApprove(inv: InvestmentWithProject) {
    setActionMap((m) => ({ ...m, [inv.id]: 'approving' }));
    try {
      await approveInvestment(inv.id);
      setPendingInvestments((prev) => prev.filter((i) => i.id !== inv.id));
    } catch { alert('Failed to approve'); }
    finally { setActionMap((m) => { const n = { ...m }; delete n[inv.id]; return n; }); }
  }

  async function handleReject(inv: InvestmentWithProject, reason: string) {
    setActionMap((m) => ({ ...m, [inv.id]: 'rejecting' }));
    try {
      await rejectInvestment(inv.id, reason || undefined);
      setPendingInvestments((prev) => prev.filter((i) => i.id !== inv.id));
      setRejectionInput(null);
    } catch { alert('Failed to reject'); }
    finally { setActionMap((m) => { const n = { ...m }; delete n[inv.id]; return n; }); }
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Activity & Notifications</h2>
          <p className="text-sm text-gray-500 mt-1">Pending actions and recent platform events.</p>
        </div>
        <button
          onClick={() => load(true)}
          disabled={refreshing}
          className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition"
        >
          <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 size={24} className="animate-spin text-gray-400" />
        </div>
      ) : (
        <>
          {/* Pending investments */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp size={16} className="text-yellow-500" />
              <h3 className="text-sm font-semibold text-gray-800">Pending Investment Approvals</h3>
              {pendingInvestments.length > 0 && (
                <span className="rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold px-2 py-0.5">
                  {pendingInvestments.length}
                </span>
              )}
            </div>

            {pendingInvestments.length === 0 ? (
              <div className="bg-white border border-gray-100 rounded-xl px-5 py-8 text-center shadow-sm">
                <CheckCircle2 size={28} className="mx-auto mb-2 text-green-300" />
                <p className="text-sm text-gray-400">No pending investments — you&apos;re all caught up!</p>
              </div>
            ) : (
              <div className="bg-white border border-gray-100 rounded-xl shadow-sm divide-y divide-gray-50">
                {pendingInvestments.map((inv) => {
                  const acting = actionMap[inv.id];
                  const isRejectOpen = rejectionInput?.id === inv.id;
                  return (
                    <div key={inv.id} className="px-5 py-4">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Clock size={14} className="text-yellow-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-semibold text-gray-900">
                              {fmt(inv.amount, inv.currency)}
                            </span>
                            <span className="text-sm text-gray-500">in</span>
                            <span className="text-sm font-medium text-gray-800">
                              {inv.projectTitle ?? `Project ${inv.projectId.slice(0, 8)}`}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                            {inv.contactName && (
                              <span className="text-xs text-gray-500">{inv.contactName}</span>
                            )}
                            {inv.contactEmail && (
                              <span className="text-xs text-gray-400">{inv.contactEmail}</span>
                            )}
                            <span className="text-xs text-gray-400">{timeAgo(inv.investedAt)}</span>
                          </div>
                          {inv.notes && (
                            <p className="mt-1 text-xs text-gray-500 bg-gray-50 rounded px-2 py-1 border border-gray-100 line-clamp-2">
                              {inv.notes}
                            </p>
                          )}

                          {isRejectOpen && (
                            <div className="mt-2 flex gap-2">
                              <input
                                type="text"
                                placeholder="Rejection reason (optional)"
                                value={rejectionInput.reason}
                                onChange={(e) => setRejectionInput({ id: inv.id, reason: e.target.value })}
                                className="flex-1 text-xs border border-gray-200 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-orange-400"
                              />
                              <button
                                onClick={() => handleReject(inv, rejectionInput.reason)}
                                disabled={!!acting}
                                className="text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded font-medium disabled:opacity-50"
                              >
                                {acting === 'rejecting' ? <Loader2 size={12} className="animate-spin" /> : 'Confirm'}
                              </button>
                              <button
                                onClick={() => setRejectionInput(null)}
                                className="text-xs text-gray-400 hover:text-gray-600 px-2"
                              >
                                Cancel
                              </button>
                            </div>
                          )}
                        </div>

                        {!isRejectOpen && (
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => handleApprove(inv)}
                              disabled={!!acting}
                              className="flex items-center gap-1 text-xs bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg font-medium transition disabled:opacity-50"
                            >
                              {acting === 'approving' ? <Loader2 size={11} className="animate-spin" /> : <CheckCircle2 size={11} />}
                              Approve
                            </button>
                            <button
                              onClick={() => setRejectionInput({ id: inv.id, reason: '' })}
                              disabled={!!acting}
                              className="flex items-center gap-1 text-xs border border-red-200 text-red-500 hover:bg-red-50 px-3 py-1.5 rounded-lg font-medium transition disabled:opacity-50"
                            >
                              <XCircle size={11} />
                              Reject
                            </button>
                            <Link href="/investments" className="text-gray-300 hover:text-gray-500 transition">
                              <ExternalLink size={13} />
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </section>

          {/* Pending user approvals */}
          {pendingUsers.length > 0 && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <Users size={16} className="text-orange-500" />
                <h3 className="text-sm font-semibold text-gray-800">Users Pending Approval</h3>
                <span className="rounded-full bg-orange-100 text-orange-700 text-xs font-semibold px-2 py-0.5">
                  {pendingUsers.length}
                </span>
              </div>
              <div className="bg-white border border-gray-100 rounded-xl shadow-sm divide-y divide-gray-50">
                {pendingUsers.map((u) => (
                  <div key={u.id} className="flex items-center gap-3 px-5 py-3">
                    <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center flex-shrink-0">
                      <AlertCircle size={14} className="text-orange-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{u.firstName} {u.lastName}</p>
                      <p className="text-xs text-gray-400">{u.email}</p>
                    </div>
                    <span className="text-xs text-orange-600 bg-orange-50 border border-orange-100 rounded-full px-2 py-0.5">
                      pending
                    </span>
                    <Link href={`/users/${u.id}`} className="text-gray-400 hover:text-orange-500 transition">
                      <ExternalLink size={13} />
                    </Link>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Recent registrations */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <Bell size={16} className="text-blue-500" />
              <h3 className="text-sm font-semibold text-gray-800">Recent Registrations</h3>
            </div>
            {recentUsers.length === 0 ? (
              <div className="bg-white border border-gray-100 rounded-xl px-5 py-6 text-center shadow-sm">
                <p className="text-sm text-gray-400">No recent users</p>
              </div>
            ) : (
              <div className="bg-white border border-gray-100 rounded-xl shadow-sm divide-y divide-gray-50">
                {recentUsers.map((u) => (
                  <div key={u.id} className="flex items-center gap-3 px-5 py-3">
                    <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0 text-xs font-bold text-blue-600">
                      {(u.firstName?.[0] ?? u.email[0]).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {u.firstName} {u.lastName}
                      </p>
                      <p className="text-xs text-gray-400 truncate">{u.email}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs rounded-full px-2 py-0.5 font-medium capitalize ${
                        u.status === 'active' ? 'bg-green-50 text-green-700' :
                        u.status?.includes('pending') ? 'bg-yellow-50 text-yellow-700' :
                        'bg-gray-100 text-gray-500'
                      }`}>
                        {u.status?.replace(/_/g, ' ')}
                      </span>
                      <span className="text-xs text-gray-400">{timeAgo(u.createdAt)}</span>
                      <Link href={`/users/${u.id}`} className="text-gray-300 hover:text-blue-400 transition">
                        <ExternalLink size={13} />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-2 text-right">
              <Link href="/users" className="text-xs text-orange-500 hover:underline">
                View all users →
              </Link>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
