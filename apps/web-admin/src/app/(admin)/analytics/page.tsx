'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  TrendingUp, Sprout, Handshake, Newspaper, Users,
  DollarSign, Clock, CheckCircle2, XCircle, ArrowUp, ArrowDown,
} from 'lucide-react';
import { getToken } from '@/lib/auth';
import { getAnalytics, type AnalyticsSummary } from '@/lib/api';

const fmtNum = (n: number) => n.toLocaleString();

function StatCard({
  label, value, sub, icon: Icon, iconBg, iconColor, loading,
}: {
  label: string; value: string; sub?: string;
  icon: React.ElementType; iconBg: string; iconColor: string; loading: boolean;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
          <Icon size={18} className={iconColor} />
        </div>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
      {loading ? (
        <div className="w-20 h-7 bg-gray-100 rounded animate-pulse" />
      ) : (
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      )}
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

function Trend({ current, previous, label }: { current: number; previous: number; label: string }) {
  const diff = current - previous;
  const pct = previous > 0 ? Math.round((diff / previous) * 100) : null;
  const up = diff >= 0;
  return (
    <div className="flex items-center gap-1.5 text-xs">
      <span className="text-gray-500">{label}:</span>
      <span className={`font-semibold ${up ? 'text-green-600' : 'text-red-500'}`}>
        {fmtNum(current)}
      </span>
      {pct !== null && (
        <span className={`flex items-center gap-0.5 ${up ? 'text-green-600' : 'text-red-500'}`}>
          {up ? <ArrowUp size={10} /> : <ArrowDown size={10} />}
          {Math.abs(pct)}% vs last month
        </span>
      )}
    </div>
  );
}

function MonthBar({ value, max, month, amount }: { value: number; max: number; month: string; amount: number }) {
  const pct = max > 0 ? (value / max) * 100 : 0;
  const label = new Date(month).toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
  return (
    <div className="flex flex-col items-center gap-1 flex-1">
      <span className="text-[10px] text-gray-500 font-medium">{value}</span>
      <div className="w-full rounded-t bg-gray-100 relative" style={{ height: 64 }}>
        <div
          className="absolute bottom-0 left-0 right-0 rounded-t bg-orange-400 transition-all"
          style={{ height: `${pct}%` }}
          title={`${value} investments · ${fmtNum(amount)}`}
        />
      </div>
      <span className="text-[9px] text-gray-400">{label}</span>
    </div>
  );
}

const STATUS_COLORS: Record<string, string> = {
  open: 'bg-green-500',
  funding: 'bg-blue-500',
  funded: 'bg-purple-500',
  in_progress: 'bg-yellow-500',
  completed: 'bg-emerald-600',
  draft: 'bg-gray-400',
  suspended: 'bg-red-400',
};

export default function AnalyticsPage() {
  const router = useRouter();
  const [data, setData] = useState<AnalyticsSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!getToken()) { router.replace('/login'); return; }
    getAnalytics()
      .then(setData)
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load analytics'))
      .finally(() => setLoading(false));
  }, [router]);

  const byMonth = data?.investments.byMonth ?? [];
  const maxByMonth = Math.max(...byMonth.map((m) => m.count), 1);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Analytics</h2>
        <p className="text-sm text-gray-500 mt-1">Platform-wide performance metrics.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">{error}</div>
      )}

      {/* KPI cards */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Overview</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Projects" value={fmtNum(data?.projects.total ?? 0)} icon={Sprout} iconBg="bg-green-50" iconColor="text-green-600" loading={loading} />
          <StatCard label="Active Projects" value={fmtNum(data?.projects.active ?? 0)} icon={Sprout} iconBg="bg-emerald-50" iconColor="text-emerald-600" loading={loading} sub={`${data?.projects.total ? Math.round((data.projects.active / data.projects.total) * 100) : 0}% of total`} />
          <StatCard label="Active Partners" value={fmtNum(data?.partners.active ?? 0)} icon={Handshake} iconBg="bg-purple-50" iconColor="text-purple-600" loading={loading} sub={`${data?.partners.total ?? 0} total`} />
          <StatCard label="Published News" value={fmtNum(data?.news.published ?? 0)} icon={Newspaper} iconBg="bg-blue-50" iconColor="text-blue-600" loading={loading} sub={`${data?.news.total ?? 0} total`} />
        </div>
      </div>

      {/* Investment KPIs */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Investments</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total Raised" value={fmtNum(data?.investments.totalAmountApproved ?? 0)} sub="sum across all currencies" icon={DollarSign} iconBg="bg-green-50" iconColor="text-green-600" loading={loading} />
          <StatCard label="Unique Investors" value={fmtNum(data?.investments.uniqueInvestors ?? 0)} icon={Users} iconBg="bg-orange-50" iconColor="text-orange-600" loading={loading} />
          <StatCard label="Pending Review" value={fmtNum(data?.investments.pending ?? 0)} icon={Clock} iconBg="bg-yellow-50" iconColor="text-yellow-600" loading={loading} />
          <StatCard label="Approved" value={fmtNum(data?.investments.approved ?? 0)} icon={CheckCircle2} iconBg="bg-green-50" iconColor="text-green-600" loading={loading} sub={`${data?.investments.rejected ?? 0} rejected`} />
        </div>
      </div>

      {/* Trends row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly bar chart */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Investment Activity</h3>
              <p className="text-xs text-gray-400 mt-0.5">Last 6 months</p>
            </div>
            {!loading && data && (
              <Trend current={data.investments.thisMonth} previous={data.investments.lastMonth} label="This month" />
            )}
          </div>
          {loading ? (
            <div className="h-20 animate-pulse bg-gray-100 rounded-lg" />
          ) : (
            <div className="flex items-end gap-1.5 h-20">
              {byMonth.length === 0 ? (
                <p className="text-xs text-gray-400 w-full text-center pt-6">No data yet</p>
              ) : (
                byMonth.map((m) => (
                  <MonthBar key={m.month} value={m.count} max={maxByMonth} month={m.month} amount={m.amount} />
                ))
              )}
            </div>
          )}
          {!loading && data && (
            <div className="mt-4 pt-3 border-t border-gray-100 flex gap-4 text-xs text-gray-500">
              <span>This week: <strong className="text-gray-800">{data.investments.thisWeek}</strong></span>
              <span>This month: <strong className="text-gray-800">{data.investments.thisMonth}</strong></span>
              <span>Last month: <strong className="text-gray-800">{data.investments.lastMonth}</strong></span>
            </div>
          )}
        </div>

        {/* Projects by status */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Projects by Status</h3>
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => <div key={i} className="h-7 animate-pulse bg-gray-100 rounded" />)}
            </div>
          ) : !data?.projects.byStatus || Object.keys(data.projects.byStatus).length === 0 ? (
            <p className="text-xs text-gray-400 pt-4">No project data</p>
          ) : (
            <div className="space-y-2.5">
              {Object.entries(data.projects.byStatus)
                .sort(([, a], [, b]) => b - a)
                .map(([status, count]) => {
                  const pct = data.projects.total > 0 ? Math.round((count / data.projects.total) * 100) : 0;
                  return (
                    <div key={status}>
                      <div className="flex items-center justify-between mb-0.5">
                        <span className="text-xs text-gray-600 capitalize">{status.replace(/_/g, ' ')}</span>
                        <span className="text-xs font-semibold text-gray-800">{count} ({pct}%)</span>
                      </div>
                      <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${STATUS_COLORS[status] ?? 'bg-gray-400'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>

      {/* Investment funnel */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Investment Funnel</h3>
        {loading ? (
          <div className="h-8 animate-pulse bg-gray-100 rounded" />
        ) : data && data.investments.total > 0 ? (
          <div className="grid grid-cols-3 gap-4">
            {[
              { label: 'Submitted', value: data.investments.total, color: 'bg-blue-500', icon: TrendingUp },
              { label: 'Approved', value: data.investments.approved, color: 'bg-green-500', icon: CheckCircle2 },
              { label: 'Rejected', value: data.investments.rejected, color: 'bg-red-400', icon: XCircle },
            ].map(({ label, value, color, icon: Icon }) => {
              const pct = data.investments.total > 0 ? Math.round((value / data.investments.total) * 100) : 0;
              return (
                <div key={label} className="text-center">
                  <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center text-white ${color}`}>
                    <Icon size={18} />
                  </div>
                  <p className="text-xl font-bold text-gray-900 mt-2">{fmtNum(value)}</p>
                  <p className="text-xs text-gray-500">{label}</p>
                  <p className="text-xs text-gray-400">{pct}% of total</p>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-xs text-gray-400">No investment data yet.</p>
        )}
      </div>
    </div>
  );
}
