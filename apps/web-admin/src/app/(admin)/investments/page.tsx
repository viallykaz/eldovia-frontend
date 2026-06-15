'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, TrendingUp, DollarSign, Users, Sprout, ChevronDown, ChevronRight, X } from 'lucide-react';
import { getToken } from '@/lib/auth';
import { getProjects, getProjectInvestments, Project, Investment } from '@/lib/api';
import { fetchUSDRates, convertCurrency, fmtCurrency } from '@/lib/currency';

const STATUS_BADGE: Record<string, string> = {
  approved:  'bg-green-100 text-green-700',
  confirmed: 'bg-green-100 text-green-700',
  pending:   'bg-yellow-100 text-yellow-700',
  rejected:  'bg-red-100 text-red-600',
  cancelled: 'bg-gray-100 text-gray-500',
};

function InvestmentDetailPanel({
  investment,
  projectCurrency,
  usdRates,
  onClose,
}: {
  investment: Investment;
  projectCurrency: string;
  usdRates: Record<string, number> | null;
  onClose: () => void;
}) {
  const badgeClass = STATUS_BADGE[investment.status] ?? 'bg-gray-100 text-gray-500';
  const currency = investment.currency || projectCurrency;
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-[360px] z-50 bg-white shadow-2xl border-l border-gray-100 flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <h3 className="text-sm font-semibold text-gray-900">Investment Details</h3>
          <button onClick={onClose} className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${badgeClass}`}>
            {investment.status}
          </span>

          <div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-2">Contact</p>
            <div className="space-y-1">
              {investment.contactName && <p className="text-sm font-semibold text-gray-900">{investment.contactName}</p>}
              {investment.contactEmail && (
                <a href={`mailto:${investment.contactEmail}`} className="block text-sm text-blue-600 hover:underline">{investment.contactEmail}</a>
              )}
              {investment.contactPhone && (
                <a href={`tel:${investment.contactPhone}`} className="block text-sm text-gray-600">{investment.contactPhone}</a>
              )}
              {!investment.contactName && !investment.contactEmail && (
                <p className="text-xs text-gray-400 font-mono">{investment.investorId}</p>
              )}
            </div>
          </div>

          <div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Amount</p>
            <p className="text-2xl font-bold text-gray-900">{fmtCurrency(Number(investment.amount), currency)}</p>
            {usdRates && currency !== 'USD' && (
              <p className="text-xs text-gray-400 mt-0.5">
                ≈ {fmtCurrency(convertCurrency(Number(investment.amount), currency, 'USD', usdRates), 'USD')}
              </p>
            )}
          </div>

          {investment.notes && (
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Notes from Investor</p>
              <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 leading-relaxed">{investment.notes}</p>
            </div>
          )}

          <div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-2">Timeline</p>
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-gray-500">
                <span>Submitted</span>
                <span>{new Date(investment.investedAt).toLocaleString()}</span>
              </div>
              {investment.approvedAt && (
                <div className="flex justify-between text-green-600">
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
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Rejection Reason</p>
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">{investment.rejectionReason}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

interface ProjectWithInvestments extends Project {
  investments: Investment[];
  totalRaised: number;
}

export default function InvestmentsPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [projects, setProjects] = useState<ProjectWithInvestments[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);
  const [selectedProject, setSelectedProject] = useState<ProjectWithInvestments | null>(null);
  const [usdRates, setUsdRates] = useState<Record<string, number> | null>(null);

  useEffect(() => {
    if (!getToken()) { router.replace('/login'); return; }
    setReady(true);
    fetchUSDRates().then(setUsdRates).catch(() => {});
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const allProjects = await getProjects({ limit: 100 });
      // Fetch investments for each project in parallel
      const results = await Promise.allSettled(
        allProjects.map((p) => getProjectInvestments(p.id).then((invs) => ({ project: p, investments: invs ?? [] })))
      );
      const enriched: ProjectWithInvestments[] = results
        .filter((r): r is PromiseFulfilledResult<{ project: Project; investments: Investment[] }> => r.status === 'fulfilled')
        .map((r) => ({
          ...r.value.project,
          investments: r.value.investments,
          totalRaised: r.value.investments.filter((i) => i.status === 'approved').reduce((s, i) => s + Number(i.amount), 0),
        }))
        .filter((p) => p.investments.length > 0)
        .sort((a, b) => b.totalRaised - a.totalRaised);
      setProjects(enriched);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load investments');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (ready) fetchData();
  }, [ready, fetchData]);

  function toggleExpand(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const totalInvestors = projects.reduce((s, p) => s + p.investments.length, 0);
  const totalRaisedUSD = usdRates
    ? projects.reduce((s, p) => s + convertCurrency(p.totalRaised, p.currency, 'USD', usdRates), 0)
    : null;
  const totalConfirmed = projects.reduce((s, p) => s + p.investments.filter((i) => i.status === 'approved').length, 0);

  if (!ready) return <div className="min-h-screen flex items-center justify-center"><div className="text-gray-400">Loading...</div></div>;

  return (
    <>
    {selectedInvestment && (
      <InvestmentDetailPanel
        investment={selectedInvestment}
        projectCurrency={selectedProject?.currency ?? 'USD'}
        usdRates={usdRates}
        onClose={() => { setSelectedInvestment(null); setSelectedProject(null); }}
      />
    )}
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Investments</h2>
        <p className="text-sm text-gray-500 mt-0.5">Overview of all project investments</p>
      </div>

      {/* Summary cards */}
      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Total Raised (USD)', value: totalRaisedUSD != null ? fmtCurrency(totalRaisedUSD, 'USD') : '—', icon: DollarSign, bg: 'bg-green-50', color: 'text-green-600' },
            { label: 'Total Investments', value: String(totalInvestors), icon: TrendingUp, bg: 'bg-blue-50', color: 'text-blue-600' },
            { label: 'Approved', value: String(totalConfirmed), icon: Users, bg: 'bg-orange-50', color: 'text-orange-600' },
          ].map(({ label, value, icon: Icon, bg, color }) => (
            <div key={label} className="bg-white border border-gray-100 rounded-xl p-5 flex items-center gap-4 shadow-sm">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${bg}`}>
                <Icon size={22} className={color} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
                <p className="text-sm text-gray-500">{label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {error} <button onClick={fetchData} className="ml-2 underline">Retry</button>
        </div>
      )}

      {/* Projects with investments */}
      {loading ? (
        <div className="flex items-center justify-center py-20 text-gray-400">
          <Loader2 size={24} className="animate-spin mr-2" /> Loading investment data…
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-20">
          <Sprout size={40} className="text-gray-200 mx-auto mb-3" />
          <p className="text-gray-500 text-sm">No investments recorded yet.</p>
          <Link href="/projects" className="mt-3 inline-flex items-center gap-1.5 text-sm text-orange-500 font-medium">
            Manage Projects
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {projects.map((project) => {
            const isOpen = expanded.has(project.id);
            const pct = project.fundingGoal > 0
              ? Math.min(Math.round((project.totalRaised / project.fundingGoal) * 100), 100)
              : 0;
            return (
              <div key={project.id} className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
                {/* Project row */}
                <button
                  onClick={() => toggleExpand(project.id)}
                  className="w-full flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-semibold text-gray-900 text-sm truncate">{project.title}</span>
                      <span className="text-xs text-gray-400 capitalize">{project.category.replace(/_/g, ' ')}</span>
                      <Link
                        href={`/projects/${project.id}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-xs text-orange-500 hover:underline flex-shrink-0"
                      >
                        Edit
                      </Link>
                    </div>
                    <div className="flex items-center gap-4">
                      {/* Progress bar */}
                      <div className="flex items-center gap-2 flex-1 max-w-xs">
                        <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-green-500 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="text-xs text-gray-500 flex-shrink-0">{pct}%</span>
                      </div>
                      <span className="text-xs text-gray-500">{project.investments.length} investor{project.investments.length !== 1 ? 's' : ''}</span>
                      <div className="text-right">
                        <span className="text-sm font-semibold text-gray-800">{fmtCurrency(project.totalRaised, project.currency)}</span>
                        {usdRates && project.currency !== 'USD' && (
                          <p className="text-[10px] text-gray-400">≈ {fmtCurrency(convertCurrency(project.totalRaised, project.currency, 'USD', usdRates), 'USD')}</p>
                        )}
                      </div>
                      <span className="text-xs text-gray-400">of {fmtCurrency(project.fundingGoal, project.currency)}</span>
                    </div>
                  </div>
                  {isOpen ? <ChevronDown size={16} className="text-gray-400 flex-shrink-0" /> : <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />}
                </button>

                {/* Investments table */}
                {isOpen && (
                  <div className="border-t border-gray-50">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="text-left px-5 py-2.5 font-medium text-gray-500 uppercase tracking-wide text-xs">Contact</th>
                          <th className="text-left px-5 py-2.5 font-medium text-gray-500 uppercase tracking-wide text-xs">Amount</th>
                          <th className="text-left px-5 py-2.5 font-medium text-gray-500 uppercase tracking-wide text-xs">Status</th>
                          <th className="text-left px-5 py-2.5 font-medium text-gray-500 uppercase tracking-wide text-xs">Date</th>
                          <th className="text-left px-5 py-2.5 font-medium text-gray-500 uppercase tracking-wide text-xs">Notes</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {project.investments.map((inv) => (
                          <tr
                            key={inv.id}
                            onClick={() => { setSelectedInvestment(inv); setSelectedProject(project); }}
                            className="hover:bg-orange-50 transition-colors cursor-pointer"
                          >
                            <td className="px-5 py-3">
                              <div className="font-medium text-gray-800 text-xs">{inv.contactName || <span className="font-mono text-gray-400">{inv.investorId.slice(0, 8)}…</span>}</div>
                              {inv.contactEmail && <div className="text-[11px] text-gray-400">{inv.contactEmail}</div>}
                              {inv.contactPhone && <div className="text-[11px] text-gray-400">{inv.contactPhone}</div>}
                            </td>
                            <td className="px-5 py-3 text-xs">
                              <span className="font-semibold text-gray-800">{fmtCurrency(Number(inv.amount), inv.currency || project.currency)}</span>
                              {usdRates && (inv.currency || project.currency) !== 'USD' && (
                                <p className="text-[10px] text-gray-400 mt-0.5">≈ {fmtCurrency(convertCurrency(Number(inv.amount), inv.currency || project.currency, 'USD', usdRates), 'USD')}</p>
                              )}
                            </td>
                            <td className="px-5 py-3">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium capitalize ${STATUS_BADGE[inv.status] ?? 'bg-gray-100 text-gray-500'}`}>
                                {inv.status}
                              </span>
                            </td>
                            <td className="px-5 py-3 text-gray-400 text-xs">{new Date(inv.investedAt).toLocaleDateString()}</td>
                            <td className="px-5 py-3 text-gray-400 text-xs max-w-[200px] truncate">{inv.notes ?? '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
    </>
  );
}
