'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Save, Globe, TrendingUp, CheckCircle2, XCircle, ChevronRight, Bookmark, Heart, Sprout as SproutIcon, AlertTriangle } from 'lucide-react';
import {
  getProject, updateProject, publishProject, getProjectInvestments,
  approveInvestment, rejectInvestment, changeOperationalStatus, addDirectInvestment,
  getUsers, PROJECT_CATEGORIES, PROJECT_STATUSES, type Project, type Investment, type AdminUser,
} from '@/lib/api';

const fmt = (n: number, currency = 'USD') => {
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n);
  } catch {
    return `${currency} ${n.toLocaleString()}`;
  }
};

// ─── Operational status cycles per category ───────────────────────────────────
const STATUS_CYCLES: Record<string, string[]> = {
  farming:         ['call_for_investors', 'land_preparation', 'planting', 'growing', 'harvesting', 'post_harvest', 'distribution', 'completed'],
  crop_production: ['call_for_investors', 'land_preparation', 'planting', 'growing', 'harvesting', 'post_harvest', 'distribution', 'completed'],
  smart_farming:   ['call_for_investors', 'land_preparation', 'planting', 'growing', 'harvesting', 'post_harvest', 'completed'],
  livestock:       ['call_for_investors', 'procurement', 'rearing', 'breeding', 'processing', 'distribution', 'completed'],
  aquaculture:     ['call_for_investors', 'pond_preparation', 'stocking', 'growth_monitoring', 'harvesting', 'processing', 'completed'],
  forestry:        ['call_for_investors', 'site_preparation', 'planting', 'nurturing', 'harvesting', 'reforestation', 'completed'],
  irrigation:      ['call_for_investors', 'design', 'construction', 'testing', 'commissioning', 'operational', 'completed'],
  food_processing: ['call_for_investors', 'facility_setup', 'equipment_installation', 'trial_production', 'full_production', 'completed'],
  agri_tech:       ['call_for_investors', 'development', 'pilot_testing', 'deployment', 'scaling', 'completed'],
  other:           ['call_for_investors', 'planning', 'implementation', 'monitoring', 'completed'],
};

const STATUS_LABELS: Record<string, string> = {
  call_for_investors: 'Call for Investors',
  land_preparation: 'Land Preparation',
  planting: 'Planting',
  growing: 'Growing',
  harvesting: 'Harvesting',
  post_harvest: 'Post-Harvest',
  distribution: 'Distribution',
  completed: 'Completed',
  procurement: 'Procurement',
  rearing: 'Rearing',
  breeding: 'Breeding',
  processing: 'Processing',
  pond_preparation: 'Pond Preparation',
  stocking: 'Stocking',
  growth_monitoring: 'Growth Monitoring',
  site_preparation: 'Site Preparation',
  nurturing: 'Nurturing',
  reforestation: 'Reforestation',
  design: 'Design',
  construction: 'Construction',
  testing: 'Testing',
  commissioning: 'Commissioning',
  operational: 'Operational',
  facility_setup: 'Facility Setup',
  equipment_installation: 'Equipment Installation',
  trial_production: 'Trial Production',
  full_production: 'Full Production',
  development: 'Development',
  pilot_testing: 'Pilot Testing',
  deployment: 'Deployment',
  scaling: 'Scaling',
  planning: 'Planning',
  implementation: 'Implementation',
  monitoring: 'Monitoring',
};

// ─── Cycle Diagram ────────────────────────────────────────────────────────────
function StatusCycle({ category, current, onSelect }: {
  category: string;
  current?: string;
  onSelect: (s: string) => void;
}) {
  const steps = STATUS_CYCLES[category] ?? STATUS_CYCLES.other;
  const currentIdx = current ? steps.indexOf(current) : -1;

  return (
    <div className="overflow-x-auto pb-1">
      <div className="flex items-center gap-0 min-w-max">
        {steps.map((step, idx) => {
          const isDone = idx < currentIdx;
          const isActive = idx === currentIdx;
          const isNext = idx === currentIdx + 1;
          return (
            <div key={step} className="flex items-center">
              <button
                onClick={() => onSelect(step)}
                disabled={!isNext}
                title={isNext ? `Advance to: ${STATUS_LABELS[step] ?? step}` : (STATUS_LABELS[step] ?? step)}
                className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-all border ${
                  isActive
                    ? 'bg-orange-500 text-white border-orange-500 shadow-sm cursor-default'
                    : isDone
                    ? 'bg-green-50 text-green-700 border-green-200 cursor-default'
                    : isNext
                    ? 'bg-blue-50 text-blue-600 border-blue-200 hover:border-blue-400 cursor-pointer'
                    : 'bg-gray-50 text-gray-300 border-gray-200 cursor-not-allowed'
                }`}
              >
                <span className={`h-5 w-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  isActive ? 'bg-white text-orange-500' : isDone ? 'bg-green-200 text-green-700' : 'bg-gray-200 text-gray-400'
                }`}>
                  {isDone ? '✓' : idx + 1}
                </span>
                <span className="whitespace-nowrap">{STATUS_LABELS[step] ?? step.replace(/_/g, ' ')}</span>
              </button>
              {idx < steps.length - 1 && (
                <ChevronRight size={14} className={`shrink-0 mx-0.5 ${idx < currentIdx ? 'text-green-400' : 'text-gray-300'}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Investment detail panel ──────────────────────────────────────────────────
function InvestmentDetailPanel({
  investment,
  onClose,
  onApprove,
  onStartReject,
  actionLoading,
}: {
  investment: Investment;
  onClose: () => void;
  onApprove: (id: string) => void;
  onStartReject: (id: string) => void;
  actionLoading: string | null;
}) {
  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/20" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-[360px] z-50 bg-white shadow-2xl border-l border-gray-100 flex flex-col">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <h3 className="text-sm font-semibold text-gray-900">Investment Details</h3>
          <button onClick={onClose} className="p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
            <XCircle size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Status */}
          <InvestmentStatusBadge status={investment.status} />

          {/* Contact */}
          <div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-2">Contact</p>
            <div className="space-y-1">
              {investment.contactName && (
                <p className="text-sm font-semibold text-gray-900">{investment.contactName}</p>
              )}
              {investment.contactEmail && (
                <a href={`mailto:${investment.contactEmail}`} className="block text-sm text-blue-600 hover:underline">
                  {investment.contactEmail}
                </a>
              )}
              {investment.contactPhone && (
                <a href={`tel:${investment.contactPhone}`} className="block text-sm text-gray-600">
                  {investment.contactPhone}
                </a>
              )}
              {!investment.contactName && !investment.contactEmail && (
                <p className="text-xs text-gray-400 font-mono">{investment.investorId}</p>
              )}
            </div>
          </div>

          {/* Amount */}
          <div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Amount</p>
            <p className="text-2xl font-bold text-gray-900">
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: investment.currency || 'USD', maximumFractionDigits: 0 }).format(Number(investment.amount))}
            </p>
          </div>

          {/* Notes */}
          {investment.notes && (
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Notes from Investor</p>
              <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3 leading-relaxed">{investment.notes}</p>
            </div>
          )}

          {/* Timeline */}
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

          {/* Rejection reason */}
          {investment.rejectionReason && (
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wide mb-1">Rejection Reason</p>
              <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3">{investment.rejectionReason}</p>
            </div>
          )}
        </div>

        {/* Actions */}
        {investment.status === 'pending' && (
          <div className="flex-shrink-0 p-4 border-t border-gray-100 flex gap-2">
            <button
              onClick={() => onApprove(investment.id)}
              disabled={!!actionLoading}
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg disabled:opacity-60 transition-colors"
            >
              {actionLoading === investment.id ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
              Approve
            </button>
            <button
              onClick={() => onStartReject(investment.id)}
              disabled={!!actionLoading}
              className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg disabled:opacity-60 transition-colors"
            >
              <XCircle size={14} />
              Reject
            </button>
          </div>
        )}
      </div>
    </>
  );
}

// ─── Investment status badge ──────────────────────────────────────────────────
function InvestmentStatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending:   'bg-yellow-50 text-yellow-700 border-yellow-200',
    approved:  'bg-green-50 text-green-700 border-green-200',
    rejected:  'bg-red-50 text-red-700 border-red-200',
    confirmed: 'bg-blue-50 text-blue-700 border-blue-200',
    cancelled: 'bg-gray-50 text-gray-500 border-gray-200',
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold capitalize border ${styles[status] ?? 'bg-gray-50 text-gray-500 border-gray-200'}`}>
      {status}
    </span>
  );
}

export default function EditProjectPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [project, setProject] = useState<Project | null>(null);
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [invLoading, setInvLoading] = useState(false);
  const [statusChanging, setStatusChanging] = useState(false);
  const [pendingLifecycleStatus, setPendingLifecycleStatus] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);
  const [showAddInvestor, setShowAddInvestor] = useState(false);
  const [addInvLoading, setAddInvLoading] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [userResults, setUserResults] = useState<AdminUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [addInvAmount, setAddInvAmount] = useState('');
  const [addInvError, setAddInvError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '', summary: '', description: '', category: '',
    projectType: 'profit_making',
    location: '', country: '', budget: '', fundingGoal: '',
    currency: 'USD', startDate: '', endDate: '',
    expectedReturnRate: '', minimumInvestment: '',
    completionPercentage: '', isFeatured: false,
  });
  const [pendingStatus, setPendingStatus] = useState<string>('');
  const [statusSaving, setStatusSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getProject(id)
      .then((p) => {
        setProject(p);
        setPendingStatus(p.status);
        setForm({
          title: p.title,
          summary: p.summary,
          description: p.description,
          category: p.category,
          projectType: p.projectType ?? 'profit_making',
          location: p.location,
          country: p.country,
          budget: String(p.budget),
          fundingGoal: String(p.fundingGoal),
          currency: p.currency,
          startDate: p.startDate?.slice(0, 10) ?? '',
          endDate: p.endDate?.slice(0, 10) ?? '',
          expectedReturnRate: p.expectedReturnRate != null ? String(p.expectedReturnRate) : '',
          minimumInvestment: p.minimumInvestment != null ? String(p.minimumInvestment) : '',
          completionPercentage: String(p.completionPercentage),
          isFeatured: p.isFeatured,
        });
        setInvLoading(true);
        return getProjectInvestments(p.id).catch(() => []);
      })
      .then((invs) => setInvestments(invs ?? []))
      .catch((e) => setError(e instanceof Error ? e.message : 'Failed to load project'))
      .finally(() => { setLoading(false); setInvLoading(false); });
  }, [id]);

  useEffect(() => {
    if (!saved) return;
    const t = setTimeout(() => setSaved(false), 4000);
    return () => clearTimeout(t);
  }, [saved]);

  function set(key: string, value: string | boolean) {
    setSaved(false);
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const updated = await updateProject(id, {
        title: form.title,
        summary: form.summary,
        description: form.description,
        category: form.category,
        projectType: form.projectType as 'profit_making' | 'sustainability',
        location: form.location,
        country: form.country,
        budget: parseFloat(form.budget),
        fundingGoal: parseFloat(form.fundingGoal),
        currency: form.currency,
        startDate: form.startDate as unknown as string,
        endDate: form.endDate || undefined,
        expectedReturnRate: form.expectedReturnRate ? parseFloat(form.expectedReturnRate) : undefined,
        minimumInvestment: form.minimumInvestment ? parseFloat(form.minimumInvestment) : undefined,
        completionPercentage: parseFloat(form.completionPercentage),
        isFeatured: form.isFeatured,
      });
      setProject(updated);
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  async function handlePublish() {
    if (!project) return;
    setPublishing(true);
    try {
      const updated = await publishProject(project.id);
      setProject(updated);
      setPendingStatus(updated.status);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish');
    } finally {
      setPublishing(false);
    }
  }

  async function handleStatusChange() {
    if (!project || pendingStatus === project.status) return;
    setStatusSaving(true);
    try {
      const updated = await updateProject(project.id, { status: pendingStatus as Project['status'] });
      setProject(updated);
      setPendingStatus(updated.status);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
      setPendingStatus(project.status);
    } finally {
      setStatusSaving(false);
    }
  }

  async function handleOperationalStatus(status: string) {
    if (!project) return;
    setStatusChanging(true);
    try {
      const updated = await changeOperationalStatus(project.id, status);
      setProject(updated);
      setPendingLifecycleStatus(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setStatusChanging(false);
    }
  }

  async function handleApprove(invId: string) {
    setActionLoading(invId);
    try {
      const updated = await approveInvestment(invId);
      setInvestments((prev) => prev.map((i) => i.id === invId ? { ...i, ...updated } : i));
      setSelectedInvestment((prev) => prev?.id === invId ? { ...prev, ...updated } : prev);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve');
    } finally {
      setActionLoading(null);
    }
  }

  async function handleReject(invId: string) {
    setActionLoading(invId);
    try {
      const updated = await rejectInvestment(invId, rejectReason || undefined);
      setInvestments((prev) => prev.map((i) => i.id === invId ? { ...i, ...updated } : i));
      setSelectedInvestment((prev) => prev?.id === invId ? { ...prev, ...updated } : prev);
      setRejectId(null);
      setRejectReason('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reject');
    } finally {
      setActionLoading(null);
    }
  }

  async function handleUserSearch(query: string) {
    setUserSearch(query);
    setSelectedUser(null);
    if (query.trim().length < 2) { setUserResults([]); return; }
    try {
      const res = await getUsers({ search: query, limit: 8 });
      setUserResults(res.data ?? []);
    } catch { setUserResults([]); }
  }

  async function handleAddDirectInvestment() {
    if (!selectedUser || !addInvAmount || !project) return;
    const amt = parseFloat(addInvAmount);
    if (!amt || amt <= 0) { setAddInvError('Enter a valid amount'); return; }
    setAddInvLoading(true);
    setAddInvError(null);
    try {
      const inv = await addDirectInvestment({
        projectId: project.id,
        investorId: selectedUser.id,
        amount: amt,
        currency: project.currency,
      });
      setInvestments((prev) => [inv, ...prev]);
      setProject((p) => p ? { ...p, fundingRaised: p.fundingRaised + amt, investorCount: p.investorCount + 1 } : p);
      setShowAddInvestor(false);
      setSelectedUser(null);
      setUserSearch('');
      setAddInvAmount('');
    } catch (err) {
      setAddInvError(err instanceof Error ? err.message : 'Failed to add investor');
    } finally {
      setAddInvLoading(false);
    }
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 size={24} className="animate-spin text-gray-400" /></div>;
  if (!project) return <div className="text-center py-20 text-gray-400">Project not found. <Link href="/projects" className="text-orange-500">Back</Link></div>;

  const approvedInvestments = investments.filter((i) => i.status === 'approved');
  const pendingInvestments = investments.filter((i) => i.status === 'pending');
  const totalRaised = approvedInvestments.reduce((s, i) => s + Number(i.amount), 0);

  return (
    <>
    {selectedInvestment && (
      <InvestmentDetailPanel
        investment={selectedInvestment}
        onClose={() => setSelectedInvestment(null)}
        onApprove={handleApprove}
        onStartReject={(id) => { setRejectId(id); setRejectReason(''); setSelectedInvestment(null); }}
        actionLoading={actionLoading}
      />
    )}
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/projects" className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{project.title}</h2>
            <p className="text-xs text-gray-400 font-mono">{project.slug}</p>
          </div>
        </div>
        {project.status === 'draft' && (
          <button
            onClick={handlePublish}
            disabled={publishing}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors disabled:opacity-60"
          >
            {publishing ? <Loader2 size={14} className="animate-spin" /> : <Globe size={14} />}
            Publish
          </button>
        )}
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">{error}</div>}
      {saved && (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-800 text-sm rounded-lg px-4 py-3">
          <CheckCircle2 size={16} className="text-green-500 shrink-0" />
          <span>Project saved successfully.</span>
        </div>
      )}

      {/* Operational status cycle */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">Project Lifecycle</h3>
          {statusChanging && <Loader2 size={14} className="animate-spin text-gray-400" />}
          {project.operationalStatus && !pendingLifecycleStatus && (
            <span className="text-xs bg-orange-50 text-orange-600 border border-orange-200 px-2.5 py-1 rounded-full font-medium capitalize">
              {STATUS_LABELS[project.operationalStatus] ?? project.operationalStatus.replace(/_/g, ' ')}
            </span>
          )}
        </div>
        <StatusCycle
          category={project.category}
          current={project.operationalStatus}
          onSelect={(s) => { if (s !== project.operationalStatus) setPendingLifecycleStatus(s); }}
        />
        {pendingLifecycleStatus ? (
          <div className="space-y-3">
            <div className="flex items-start gap-2 bg-orange-50 border border-orange-100 rounded-lg p-3">
              <AlertTriangle size={14} className="text-orange-400 shrink-0 mt-0.5" />
              <p className="text-xs text-orange-700">
                Move to <strong>{STATUS_LABELS[pendingLifecycleStatus] ?? pendingLifecycleStatus.replace(/_/g, ' ')}</strong>. All followers and investors will be notified.
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleOperationalStatus(pendingLifecycleStatus)}
                disabled={statusChanging}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors disabled:opacity-60"
              >
                {statusChanging ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
                {statusChanging ? 'Applying…' : 'Confirm Phase Change'}
              </button>
              <button
                onClick={() => setPendingLifecycleStatus(null)}
                disabled={statusChanging}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-60"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <p className="text-xs text-gray-400">Click any step to select it, then confirm the phase change.</p>
        )}
      </div>

      {/* Engagement & Status row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Engagement stats */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Engagement</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-blue-50 p-3 text-center">
              <Bookmark size={15} className="text-blue-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-gray-900">{project.followersCount ?? 0}</p>
              <p className="text-xs text-gray-500">Followers</p>
            </div>
            <div className="rounded-lg bg-pink-50 p-3 text-center">
              <Heart size={15} className="text-pink-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-gray-900">{project.likeCount ?? 0}</p>
              <p className="text-xs text-gray-500">Likes</p>
            </div>
            <div className="rounded-lg bg-green-50 p-3 text-center">
              <SproutIcon size={15} className="text-green-400 mx-auto mb-1" />
              <p className="text-lg font-bold text-gray-900">{project.interestingCount ?? 0}</p>
              <p className="text-xs text-gray-500">Interests</p>
            </div>
          </div>
        </div>

        {/* Funding status change with confirmation */}
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-1">Funding Status</h3>
          <p className="text-xs text-gray-400 mb-4">Select a new status then confirm the change. Stakeholders will be notified.</p>
          <select
            value={pendingStatus}
            onChange={(e) => setPendingStatus(e.target.value)}
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white mb-3"
          >
            {PROJECT_STATUSES.map((s) => (
              <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>
            ))}
          </select>
          {pendingStatus !== project.status && (
            <div className="flex items-start gap-2 bg-orange-50 border border-orange-100 rounded-lg p-3 mb-3">
              <AlertTriangle size={14} className="text-orange-400 shrink-0 mt-0.5" />
              <p className="text-xs text-orange-700">
                Changing from <strong className="capitalize">{project.status.replace(/_/g, ' ')}</strong> to <strong className="capitalize">{pendingStatus.replace(/_/g, ' ')}</strong>. This will notify all project stakeholders.
              </p>
            </div>
          )}
          <button
            onClick={handleStatusChange}
            disabled={pendingStatus === project.status || statusSaving}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {statusSaving ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
            {statusSaving ? 'Applying…' : 'Confirm Status Change'}
          </button>
        </div>
      </div>

      {/* Investment summary + approval */}
      {!invLoading && (
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={16} className="text-green-500" />
            <h3 className="text-sm font-semibold text-gray-900">Investments</h3>
            {pendingInvestments.length > 0 && (
              <span className="ml-2 text-xs bg-yellow-50 text-yellow-700 border border-yellow-200 px-2 py-0.5 rounded-full font-medium">
                {pendingInvestments.length} pending review
              </span>
            )}
            <button
              onClick={() => { setShowAddInvestor(true); setAddInvError(null); }}
              className="ml-auto flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
            >
              + Add Investor
            </button>
          </div>

          {/* Add Investor modal */}
          {showAddInvestor && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg space-y-3">
              <p className="text-sm font-semibold text-green-800">Add investor directly (creates approved investment)</p>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Search user by name or email</label>
                <input
                  value={userSearch}
                  onChange={(e) => handleUserSearch(e.target.value)}
                  placeholder="Type at least 2 characters…"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
                />
                {userResults.length > 0 && !selectedUser && (
                  <div className="mt-1 border border-gray-200 rounded-lg divide-y divide-gray-100 bg-white shadow-sm max-h-40 overflow-y-auto">
                    {userResults.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => { setSelectedUser(u); setUserSearch(`${u.firstName} ${u.lastName} (${u.email})`); setUserResults([]); }}
                        className="w-full text-left px-3 py-2 text-xs hover:bg-green-50 transition-colors"
                      >
                        <span className="font-medium text-gray-800">{u.firstName} {u.lastName}</span>
                        <span className="text-gray-400 ml-2">{u.email}</span>
                      </button>
                    ))}
                  </div>
                )}
                {selectedUser && (
                  <div className="mt-1.5 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-1 rounded-full">
                      ✓ {selectedUser.firstName} {selectedUser.lastName}
                    </span>
                    <button onClick={() => { setSelectedUser(null); setUserSearch(''); }} className="text-[10px] text-gray-400 hover:text-red-500">Remove</button>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Amount ({project.currency})</label>
                <input
                  type="number"
                  min="1"
                  step="0.01"
                  value={addInvAmount}
                  onChange={(e) => setAddInvAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-white"
                />
              </div>

              {addInvError && <p className="text-xs text-red-600">{addInvError}</p>}

              <div className="flex gap-2">
                <button
                  onClick={handleAddDirectInvestment}
                  disabled={!selectedUser || !addInvAmount || addInvLoading}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg disabled:opacity-60 transition-colors"
                >
                  {addInvLoading ? <Loader2 size={13} className="animate-spin" /> : null}
                  Add &amp; Approve
                </button>
                <button
                  onClick={() => { setShowAddInvestor(false); setSelectedUser(null); setUserSearch(''); setAddInvAmount(''); setAddInvError(null); }}
                  className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}


          <div className="grid grid-cols-3 gap-4 mb-5">
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-xs text-gray-500 mb-1">Total Raised</p>
              <p className="text-lg font-bold text-gray-900">{fmt(totalRaised, project.currency)}</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-xs text-gray-500 mb-1">Approved</p>
              <p className="text-lg font-bold text-gray-900">{approvedInvestments.length}</p>
            </div>
            <div className="rounded-lg bg-gray-50 p-3">
              <p className="text-xs text-gray-500 mb-1">Goal Progress</p>
              <p className="text-lg font-bold text-gray-900">
                {project.fundingGoal > 0 ? Math.round((project.fundingRaised / project.fundingGoal) * 100) : 0}%
              </p>
            </div>
          </div>

          {/* Reject modal */}
          {rejectId && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg space-y-3">
              <p className="text-sm font-medium text-red-700">Reject this investment?</p>
              <input
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Reason (optional)"
                className="w-full px-3 py-2 text-sm border border-red-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-300 bg-white"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => handleReject(rejectId)}
                  disabled={!!actionLoading}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg disabled:opacity-60"
                >
                  {actionLoading === rejectId ? <Loader2 size={13} className="animate-spin" /> : <XCircle size={13} />}
                  Confirm Reject
                </button>
                <button onClick={() => { setRejectId(null); setRejectReason(''); }} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg">
                  Cancel
                </button>
              </div>
            </div>
          )}

          {investments.length === 0 && !invLoading ? (
            <p className="text-xs text-gray-400 text-center py-4">No investments yet. Use &quot;Add Investor&quot; above to add one directly.</p>
          ) : (
          <div className="max-h-80 overflow-y-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="text-gray-400 border-b border-gray-100">
                  <th className="text-left pb-2">Contact</th>
                  <th className="text-left pb-2">Amount</th>
                  <th className="text-left pb-2">Status</th>
                  <th className="text-left pb-2">Date</th>
                  <th className="pb-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {investments.map((inv) => (
                  <tr
                    key={inv.id}
                    onClick={() => setSelectedInvestment(inv)}
                    className="cursor-pointer hover:bg-orange-50 transition-colors"
                  >
                    <td className="py-2">
                      <div className="font-medium text-gray-800">{inv.contactName || inv.investorId.slice(0, 8) + '…'}</div>
                      {inv.contactEmail && <div className="text-gray-400">{inv.contactEmail}</div>}
                      {inv.contactPhone && <div className="text-gray-400">{inv.contactPhone}</div>}
                      {inv.notes && <div className="text-gray-400 italic max-w-[180px] truncate" title={inv.notes}>&ldquo;{inv.notes}&rdquo;</div>}
                    </td>
                    <td className="py-2 font-medium text-gray-800">{fmt(Number(inv.amount), inv.currency)}</td>
                    <td className="py-2"><InvestmentStatusBadge status={inv.status} /></td>
                    <td className="py-2 text-gray-400">{new Date(inv.investedAt).toLocaleDateString()}</td>
                    <td className="py-2" onClick={(e) => e.stopPropagation()}>
                      {inv.status === 'pending' && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleApprove(inv.id)}
                            disabled={!!actionLoading}
                            className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 rounded-lg disabled:opacity-60"
                          >
                            {actionLoading === inv.id ? <Loader2 size={11} className="animate-spin" /> : <CheckCircle2 size={11} />}
                            Approve
                          </button>
                          <button
                            onClick={() => { setRejectId(inv.id); setRejectReason(''); }}
                            disabled={!!actionLoading}
                            className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg disabled:opacity-60"
                          >
                            <XCircle size={11} />
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          )}
        </div>
      )}

      {/* Edit form */}
      <form onSubmit={handleSave} className="space-y-5">
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 space-y-4">
          <h3 className="text-sm font-semibold text-gray-900">Basic Information</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
            <input required value={form.title} onChange={(e) => set('title', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Summary</label>
            <textarea required rows={2} value={form.summary} onChange={(e) => set('summary', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea required rows={5} value={form.description} onChange={(e) => set('description', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 resize-y" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select value={form.category} onChange={(e) => set('category', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white">
                {PROJECT_CATEGORIES.map((c) => <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project Type</label>
              <select value={form.projectType} onChange={(e) => set('projectType', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white">
                <option value="profit_making">Profit Making</option>
                <option value="sustainability">Sustainability (Non-Profit)</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Completion %</label>
            <input type="number" min="0" max="100" step="0.1" value={form.completionPercentage} onChange={(e) => set('completionPercentage', e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
              <input value={form.location} onChange={(e) => set('location', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
              <input value={form.country} onChange={(e) => set('country', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 space-y-4">
          <h3 className="text-sm font-semibold text-gray-900">Financials & Timeline</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
              <input type="number" min="0" step="0.01" value={form.budget} onChange={(e) => set('budget', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Funding Goal</label>
              <input type="number" min="0" step="0.01" value={form.fundingGoal} onChange={(e) => set('fundingGoal', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Expected Return (%)</label>
              <input type="number" min="0" step="0.1" value={form.expectedReturnRate} onChange={(e) => set('expectedReturnRate', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Min Investment</label>
              <input type="number" min="0" step="0.01" value={form.minimumInvestment} onChange={(e) => set('minimumInvestment', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input type="date" value={form.startDate} onChange={(e) => set('startDate', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input type="date" value={form.endDate} onChange={(e) => set('endDate', e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={form.isFeatured} onChange={(e) => set('isFeatured', e.target.checked)} className="w-4 h-4 accent-orange-500" />
            <span className="text-sm text-gray-700">Featured project</span>
          </label>
        </div>

        <div className="flex items-center gap-3 pb-6">
          <Link href="/projects" className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors">
            Back
          </Link>
          <button type="submit" disabled={saving}
            className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-lg transition-colors disabled:opacity-60">
            {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />}
            {saving ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
    </>
  );
}
