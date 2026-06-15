'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  TrendingUp, Sprout, ArrowRight, LayoutDashboard,
  CheckCircle2, Clock, AlertCircle, DollarSign, X,
  Filter,
} from 'lucide-react';
import { useAuth } from '@/components/session-provider';
import { getMyInvestments, type Investment } from '@/lib/api';

const fmt = (n: number, currency = 'USD') => {
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n);
  } catch {
    return `${currency} ${n.toLocaleString()}`;
  }
};

const STATUS_COLORS: Record<string, { bg: string; border: string; color: string }> = {
  approved:  { bg: 'rgba(13,87,48,0.12)',  border: 'rgba(13,87,48,0.3)',  color: '#4ade80' },
  active:    { bg: 'rgba(13,87,48,0.12)',  border: 'rgba(13,87,48,0.3)',  color: '#4ade80' },
  confirmed: { bg: 'rgba(13,87,48,0.12)',  border: 'rgba(13,87,48,0.3)',  color: '#4ade80' },
  pending:   { bg: 'rgba(234,179,8,0.1)', border: 'rgba(234,179,8,0.3)', color: '#facc15' },
  rejected:  { bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)', color: '#f87171' },
  cancelled: { bg: 'rgba(107,114,128,0.1)', border: 'rgba(107,114,128,0.3)', color: '#9ca3af' },
};

type CardFilter = 'total_invested' | 'active' | 'projects' | null;

function InvestmentDetailPanel({ investment, onClose }: { investment: Investment; onClose: () => void }) {
  const sc = STATUS_COLORS[investment.status?.toLowerCase()] ?? STATUS_COLORS.pending;
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-[360px] z-50 bg-white dark:bg-[#111] shadow-2xl border-l border-black/8 dark:border-white/8 flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-black/8 dark:border-white/8 flex-shrink-0">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Investment Summary</h3>
          <button onClick={onClose} className="p-1 rounded-md text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-black/5 transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <span
            className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold capitalize"
            style={{ background: sc.bg, borderColor: sc.border, color: sc.color }}
          >
            {investment.status}
          </span>

          <div>
            <p className="text-[10px] font-semibold text-gray-400 dark:text-white/30 uppercase tracking-wide mb-1">Project</p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {investment.project?.title ?? `Project ${investment.projectId.slice(0, 8)}…`}
            </p>
            {investment.project?.slug && (
              <Link href={`/projects/${investment.project.slug}`} className="text-xs hover:underline mt-0.5 inline-block" style={{ color: '#22c55e' }}>
                View project →
              </Link>
            )}
          </div>

          <div>
            <p className="text-[10px] font-semibold text-gray-400 dark:text-white/30 uppercase tracking-wide mb-1">Amount Invested</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{fmt(Number(investment.amount), investment.currency || 'USD')}</p>
          </div>

          {investment.notes && (
            <div>
              <p className="text-[10px] font-semibold text-gray-400 dark:text-white/30 uppercase tracking-wide mb-1">Your Notes</p>
              <p className="text-sm text-gray-700 dark:text-white/70 bg-black/[0.02] dark:bg-white/[0.02] rounded-lg p-3 leading-relaxed border border-black/6 dark:border-white/6">
                {investment.notes}
              </p>
            </div>
          )}

          {(investment.contactName || investment.contactEmail || investment.contactPhone) && (
            <div>
              <p className="text-[10px] font-semibold text-gray-400 dark:text-white/30 uppercase tracking-wide mb-2">Contact Submitted</p>
              <div className="space-y-1">
                {investment.contactName && <p className="text-sm text-gray-800 dark:text-white/80 font-medium">{investment.contactName}</p>}
                {investment.contactEmail && <p className="text-xs text-gray-500 dark:text-white/50">{investment.contactEmail}</p>}
                {investment.contactPhone && <p className="text-xs text-gray-500 dark:text-white/50">{investment.contactPhone}</p>}
              </div>
            </div>
          )}

          <div>
            <p className="text-[10px] font-semibold text-gray-400 dark:text-white/30 uppercase tracking-wide mb-2">Timeline</p>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-gray-500 dark:text-white/40">
                <span>Submitted</span>
                <span>{new Date(investment.investedAt).toLocaleString()}</span>
              </div>
              {investment.approvedAt && (
                <div className="flex justify-between text-green-600 dark:text-green-400">
                  <span>Approved</span>
                  <span>{new Date(investment.approvedAt).toLocaleString()}</span>
                </div>
              )}
              {investment.rejectedAt && (
                <div className="flex justify-between text-red-500">
                  <span>Rejected</span>
                  <span>{new Date(investment.rejectedAt).toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>

          {investment.rejectionReason && (
            <div>
              <p className="text-[10px] font-semibold text-gray-400 dark:text-white/30 uppercase tracking-wide mb-1">Rejection Reason</p>
              <p className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-800/30 rounded-lg p-3">
                {investment.rejectionReason}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function statusBadge(status: string) {
  switch (status?.toLowerCase()) {
    case 'active':
    case 'confirmed':
    case 'approved':
      return { bg: 'rgba(13,87,48,0.12)', border: 'rgba(13,87,48,0.3)', color: '#4ade80', icon: <CheckCircle2 size={11} /> };
    case 'pending':
      return { bg: 'rgba(234,179,8,0.1)', border: 'rgba(234,179,8,0.3)', color: '#facc15', icon: <Clock size={11} /> };
    case 'cancelled':
    case 'failed':
    case 'rejected':
      return { bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)', color: '#f87171', icon: <AlertCircle size={11} /> };
    default:
      return { bg: 'rgba(107,114,128,0.1)', border: 'rgba(107,114,128,0.3)', color: '#9ca3af', icon: <Clock size={11} /> };
  }
}

const FILTER_LABELS: Record<NonNullable<CardFilter>, string> = {
  total_invested: 'Approved investments',
  active: 'Active investments',
  projects: 'All investments',
};

export default function DashboardPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const [investments, setInvestments] = useState<Investment[]>([]);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);
  const [activeFilter, setActiveFilter] = useState<CardFilter>(null);

  useEffect(() => {
    if (!isLoading && !user) router.replace('/signin');
  }, [user, isLoading, router]);

  useEffect(() => {
    if (!user) return;
    setFetching(true);
    getMyInvestments()
      .then(setInvestments)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load investments'))
      .finally(() => setFetching(false));
  }, [user]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0C0C0C] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-green-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const totalInvested = investments
    .filter((inv) => inv.status === 'approved')
    .reduce((sum, inv) => sum + Number(inv.amount ?? 0), 0);
  const activeCount = investments.filter(
    (inv) => ['active', 'confirmed', 'approved'].includes(inv.status?.toLowerCase()),
  ).length;
  const uniqueProjectCount = new Set(
    investments
      .filter((i) => !['rejected', 'cancelled'].includes(i.status?.toLowerCase()))
      .map((i) => i.projectId),
  ).size;

  const filteredInvestments = (() => {
    if (!activeFilter) return investments;
    if (activeFilter === 'total_invested') return investments.filter((i) => i.status === 'approved');
    if (activeFilter === 'active') return investments.filter((i) => ['active', 'confirmed', 'approved'].includes(i.status?.toLowerCase()));
    return investments;
  })();

  function toggleFilter(f: CardFilter) {
    setActiveFilter((prev) => (prev === f ? null : f));
    // Scroll down to list
    setTimeout(() => {
      document.getElementById('investments-list')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }

  const cards = [
    {
      key: 'total_invested' as CardFilter,
      label: 'Total Invested',
      value: fmt(totalInvested),
      icon: <DollarSign size={18} style={{ color: '#22c55e' }} />,
      sub: 'across approved investments',
    },
    {
      key: 'active' as CardFilter,
      label: 'Active Investments',
      value: String(activeCount),
      icon: <TrendingUp size={18} style={{ color: '#22c55e' }} />,
      sub: 'approved / confirmed',
    },
    {
      key: 'projects' as CardFilter,
      label: 'Total Projects',
      value: String(uniqueProjectCount),
      icon: <Sprout size={18} style={{ color: '#22c55e' }} />,
      sub: 'projects invested in',
    },
  ];

  return (
    <>
      {selectedInvestment && (
        <InvestmentDetailPanel investment={selectedInvestment} onClose={() => setSelectedInvestment(null)} />
      )}
      <main className="bg-white dark:bg-[#0C0C0C] min-h-screen pt-24 pb-20">
        <div className="mx-auto max-w-5xl px-6">
          {/* Header */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-1">
              <LayoutDashboard size={18} style={{ color: '#22c55e' }} />
              <p className="text-xs uppercase tracking-widest" style={{ color: '#22c55e' }}>
                Investor Dashboard
              </p>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back, {user.firstName}
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-white/40">{user.email}</p>
          </div>

          {/* Summary cards */}
          {!fetching && !error && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              {cards.map((s) => {
                const isActive = activeFilter === s.key;
                return (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => toggleFilter(s.key)}
                    className={`rounded-2xl border p-5 text-left transition-all cursor-pointer group ${
                      isActive
                        ? 'border-green-500/40 bg-green-50/60 dark:bg-green-900/10 ring-1 ring-green-500/30'
                        : 'border-black/8 dark:border-white/8 bg-black/[0.02] dark:bg-white/[0.02] hover:border-green-500/30 hover:bg-green-50/30 dark:hover:bg-green-900/5'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors"
                          style={{ background: isActive ? 'rgba(13,87,48,0.2)' : 'rgba(13,87,48,0.12)' }}
                        >
                          {s.icon}
                        </div>
                        <span className="text-xs text-gray-500 dark:text-white/40">{s.label}</span>
                      </div>
                      <Filter
                        size={12}
                        className={`transition-opacity ${isActive ? 'text-green-500 opacity-100' : 'text-gray-300 dark:text-white/20 opacity-0 group-hover:opacity-100'}`}
                      />
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">{s.value}</div>
                    <div className="text-xs text-gray-400 dark:text-white/30 mt-0.5">{s.sub}</div>
                  </button>
                );
              })}
            </div>
          )}

          {/* Loading skeleton */}
          {fetching && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-2xl border border-black/8 dark:border-white/8 h-28 animate-pulse bg-gray-100 dark:bg-white/5" />
              ))}
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-red-200 dark:border-red-800/40 bg-red-50 dark:bg-red-900/10 p-4 mb-8 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Investments list */}
          <div id="investments-list">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">My Investments</h2>
                {activeFilter && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-green-500/30 bg-green-50 dark:bg-green-900/10 px-2.5 py-0.5 text-xs font-medium text-green-700 dark:text-green-400">
                    <Filter size={10} />
                    {FILTER_LABELS[activeFilter]}
                    <button
                      onClick={() => setActiveFilter(null)}
                      className="ml-0.5 text-green-500 hover:text-green-700 dark:hover:text-green-300"
                    >
                      <X size={10} />
                    </button>
                  </span>
                )}
              </div>
              <Link
                href="/projects"
                className="inline-flex items-center gap-1.5 text-sm font-medium"
                style={{ color: '#22c55e' }}
              >
                Browse projects <ArrowRight size={13} />
              </Link>
            </div>

            {fetching ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 rounded-xl animate-pulse bg-gray-100 dark:bg-white/5" />
                ))}
              </div>
            ) : filteredInvestments.length === 0 && investments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center rounded-2xl border border-dashed border-black/10 dark:border-white/10">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl mb-4" style={{ background: 'rgba(13,87,48,0.08)' }}>
                  <Sprout size={28} style={{ color: '#22c55e' }} />
                </div>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">No investments yet</h3>
                <p className="text-sm text-gray-500 dark:text-white/40 mb-6 max-w-xs">
                  You haven&apos;t invested in any projects yet. Browse active opportunities to get started.
                </p>
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white"
                  style={{ background: 'linear-gradient(135deg, #0d5730, #158040)', boxShadow: '0 4px 20px rgba(13,87,48,0.3)' }}
                >
                  <Sprout size={15} />
                  Browse Projects
                  <ArrowRight size={14} />
                </Link>
              </div>
            ) : filteredInvestments.length === 0 ? (
              <div className="flex flex-col items-center py-12 text-center rounded-2xl border border-dashed border-black/10 dark:border-white/10">
                <Filter size={24} className="mb-2 text-gray-300 dark:text-white/20" />
                <p className="text-sm text-gray-500 dark:text-white/40">No investments match this filter.</p>
                <button onClick={() => setActiveFilter(null)} className="mt-2 text-xs hover:underline" style={{ color: '#22c55e' }}>
                  Clear filter
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredInvestments.map((inv) => {
                  const badge = statusBadge(inv.status);
                  return (
                    <div
                      key={inv.id}
                      onClick={() => setSelectedInvestment(inv)}
                      className="flex items-center gap-4 rounded-xl border border-black/8 dark:border-white/8 bg-black/[0.02] dark:bg-white/[0.02] p-5 hover:border-green-800/30 transition-all cursor-pointer"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl" style={{ background: 'rgba(13,87,48,0.1)' }}>
                        <TrendingUp size={16} style={{ color: '#22c55e' }} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">
                            {inv.project?.title ?? `Project ${inv.projectId.slice(0, 8)}…`}
                          </span>
                          <span
                            className="inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium capitalize"
                            style={{ background: badge.bg, borderColor: badge.border, color: badge.color }}
                          >
                            {badge.icon}
                            {inv.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 dark:text-white/30 mt-0.5">
                          Invested on{' '}
                          {new Date(inv.investedAt).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'short', day: 'numeric',
                          })}
                        </p>
                        {inv.status === 'rejected' && inv.rejectionReason && (
                          <p className="text-xs text-red-400 dark:text-red-500 mt-1">
                            Rejection reason: {inv.rejectionReason}
                          </p>
                        )}
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-base font-bold text-gray-900 dark:text-white">
                          {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: inv.currency || 'USD',
                            maximumFractionDigits: 0,
                          }).format(inv.amount)}
                        </div>
                        {inv.project?.slug && (
                          <Link
                            href={`/projects/${inv.project.slug}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-xs hover:underline"
                            style={{ color: '#22c55e' }}
                          >
                            View project
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
