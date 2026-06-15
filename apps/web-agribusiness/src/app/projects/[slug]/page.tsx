import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft, MapPin, Users, Leaf,
  CheckCircle2, Clock, AlertCircle, FileText, Newspaper,
  Tractor, TrendingUp, Wheat, Droplets, TreePine, Fish, Cpu, Factory, LayoutGrid,
} from 'lucide-react';
import { getProject } from '@/lib/api';
import { FundingCard } from './funding-card';
import { DocumentList } from './document-list';
import { ProjectTabs } from './project-tabs';
import { UploadReportButton } from './upload-report-button';
import { ProjectStageBar } from './project-stage-bar';
import type { TeamInfo } from '@/lib/api';

function statusStyle(status: string) {
  switch (status?.toLowerCase()) {
    case 'open':
    case 'in_progress':
      return { bg: 'rgba(13,87,48,0.15)', border: 'rgba(13,87,48,0.4)', color: '#4ade80' };
    case 'funded':
      return { bg: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.4)', color: '#60a5fa' };
    case 'completed':
      return { bg: 'rgba(107,114,128,0.15)', border: 'rgba(107,114,128,0.4)', color: '#9ca3af' };
    case 'suspended':
      return { bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.3)', color: '#f87171' };
    default:
      return { bg: 'rgba(234,179,8,0.1)', border: 'rgba(234,179,8,0.3)', color: '#facc15' };
  }
}

function milestoneIcon(status: string) {
  switch (status?.toLowerCase()) {
    case 'completed': return <CheckCircle2 size={16} style={{ color: '#22c55e' }} />;
    case 'in_progress': return <Clock size={16} className="text-blue-500" />;
    case 'delayed': return <AlertCircle size={16} className="text-red-500" />;
    default: return <Clock size={16} className="text-gray-400 dark:text-white/30" />;
  }
}

function milestoneLineColor(status: string) {
  switch (status?.toLowerCase()) {
    case 'completed': return '#22c55e';
    case 'in_progress': return '#3b82f6';
    case 'delayed': return '#ef4444';
    default: return 'rgba(0,0,0,0.12)';
  }
}

function categoryIcon(category: string) {
  switch (category) {
    case 'farming': return <Tractor size={14} />;
    case 'smart_farming': return <Cpu size={14} />;
    case 'livestock': return <TrendingUp size={14} />;
    case 'crop_production': return <Wheat size={14} />;
    case 'irrigation': return <Droplets size={14} />;
    case 'forestry': return <TreePine size={14} />;
    case 'aquaculture': return <Fish size={14} />;
    case 'food_processing': return <Factory size={14} />;
    default: return <LayoutGrid size={14} />;
  }
}

// Human-readable labels for projectDetails keys
const DETAIL_LABELS: Record<string, string> = {
  hectares: 'Hectares of Land',
  numberOfFarmers: 'Number of Farmers',
  cropTypes: 'Crop Types',
  farmingMethod: 'Farming Method',
  harvestCycles: 'Harvest Cycles/Year',
  expectedYieldTons: 'Expected Yield (tons)',
  technology: 'Technology',
  animalType: 'Animal Type',
  headCount: 'Head Count',
  breedType: 'Breed Type',
  expectedOfftake: 'Expected Offtake (kg/yr)',
  irrigationType: 'Irrigation Type',
  waterSource: 'Water Source',
  communitiesServed: 'Communities Served',
  fishSpecies: 'Fish Species',
  pondCount: 'Ponds / Cages',
  waterAreaHectares: 'Water Area (ha)',
  annualCapacityTons: 'Annual Capacity (tons)',
  treeSpecies: 'Tree Species',
  rotationYears: 'Rotation Period (years)',
  certification: 'Certification',
  processingCapacity: 'Processing Capacity (tons/day)',
  products: 'Products',
  employees: 'Employees',
  targetUsers: 'Target Users',
  customCategory: 'Project Type',
  details: 'Details',
  participants: 'Participants / Beneficiaries',
};

function TeamCard({ teamInfo }: { teamInfo: TeamInfo }) {
  const hasManager = !!teamInfo.manager;
  const hasIM = !!teamInfo.investmentManager;
  const members = teamInfo.members ?? [];

  if (!hasManager && !hasIM && members.length === 0) return null;

  function Avatar({ name, color }: { name: string; color: string }) {
    const initials = name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
    return (
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white text-xs font-bold"
        style={{ background: color }}
      >
        {initials}
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-black/8 dark:border-white/8 bg-black/[0.02] dark:bg-white/[0.02] p-5">
      <div className="flex items-center gap-2 mb-4">
        <Users size={14} style={{ color: '#22c55e' }} />
        <h3 className="text-sm font-bold text-gray-900 dark:text-white">Project Team</h3>
      </div>

      <div className="space-y-3">
        {hasManager && (
          <div className="flex items-center gap-3">
            <Avatar name={teamInfo.manager!.name} color="linear-gradient(135deg, #0d5730, #22c55e)" />
            <div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">{teamInfo.manager!.name}</div>
              <div className="text-xs text-gray-400 dark:text-white/35">Project Manager</div>
            </div>
          </div>
        )}
        {hasIM && (
          <div className="flex items-center gap-3">
            <Avatar name={teamInfo.investmentManager!.name} color="linear-gradient(135deg, #1d4ed8, #3b82f6)" />
            <div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">{teamInfo.investmentManager!.name}</div>
              <div className="text-xs text-gray-400 dark:text-white/35">Investment Manager</div>
            </div>
          </div>
        )}
        {members.map((m) => (
          <div key={m.id} className="flex items-center gap-3">
            <Avatar name={m.name} color="linear-gradient(135deg, #374151, #6b7280)" />
            <div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">{m.name}</div>
              <div className="text-xs text-gray-400 dark:text-white/35">{m.role ?? 'Team Member'}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let project;
  try {
    project = await getProject(slug);
  } catch {
    notFound();
  }

  const st = statusStyle(project.status);
  const img = project.images?.[0];
  const displayStatus = project.status === 'open' ? 'active' : project.status.replace(/_/g, ' ');

  const impactEntries = Object.entries(project.impactMetrics ?? {}).filter(([, v]) => v != null && v !== 0);
  const sortedMilestones = [...(project.milestones ?? [])].sort((a, b) => a.order - b.order);
  const updates = [...(project.updates ?? [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const projectDetails = project.projectDetails as Record<string, unknown> | undefined;
  const detailEntries = Object.entries(projectDetails ?? {}).filter(
    ([k, v]) => v != null && v !== '' && k !== '__typename',
  );

  const teamInfo = project.teamInfo as TeamInfo | undefined;
  const hasTeam = teamInfo && (teamInfo.manager || teamInfo.investmentManager || (teamInfo.members?.length ?? 0) > 0);

  return (
    <main className="bg-white dark:bg-[#0C0C0C] min-h-screen pb-20">
      {/* Hero */}
      <div
        className="relative pt-24 pb-10"
        style={
          img
            ? {
                backgroundImage: `linear-gradient(to bottom, rgba(7,26,14,0.85), rgba(7,26,14,0.92)), url(${img})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }
            : { background: 'linear-gradient(135deg, #071A0E 0%, #0a2318 50%, #0d5730 100%)' }
        }
      >
        <div className="mx-auto max-w-7xl px-6">
          <Link href="/projects" className="mb-6 inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition">
            <ArrowLeft size={14} /> Back to Projects
          </Link>

          <div className="flex flex-wrap items-start gap-3 mb-3">
            <span
              className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-semibold capitalize"
              style={{ background: st.bg, borderColor: st.border, color: st.color }}
            >
              {st.color === '#4ade80' && <span className="h-2 w-2 rounded-full bg-green-400 animate-pulse" />}
              {displayStatus}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/30 px-3 py-1.5 text-sm text-white/60 capitalize">
              {categoryIcon(project.category)}
              {project.category.replace(/_/g, ' ')}
            </span>
            {project.projectType && (
              <span
                className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium"
                style={project.projectType === 'sustainability'
                  ? { background: 'rgba(34,197,94,0.15)', borderColor: 'rgba(34,197,94,0.4)', color: '#4ade80' }
                  : { background: 'rgba(251,191,36,0.12)', borderColor: 'rgba(251,191,36,0.4)', color: '#fbbf24' }}
              >
                <Leaf size={12} />
                {project.projectType === 'sustainability' ? 'Sustainability' : 'Profit Making'}
              </span>
            )}
            {project.operationalStatus && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-sm text-white/70 capitalize">
                {project.operationalStatus.replace(/_/g, ' ')}
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold text-white sm:text-4xl mb-3">{project.title}</h1>

          <div className="flex flex-wrap items-center gap-4 text-sm text-white/50">
            <span className="flex items-center gap-1.5">
              <MapPin size={13} />
              {project.location ? `${project.location}, ` : ''}{project.country}
            </span>
            {project.investorCount > 0 && (
              <span className="flex items-center gap-1.5">
                <Users size={13} />
                {project.investorCount} investors
              </span>
            )}
          </div>

          <div className="flex items-center justify-between mt-4">
            <ProjectTabs slug={project.slug} />
            <UploadReportButton projectId={project.id} />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-7xl px-6 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: content */}
          <div className="lg:col-span-2 space-y-8">

            {/* Project lifecycle stage */}
            <ProjectStageBar category={project.category} operationalStatus={project.operationalStatus} />

            {/* About */}
            <section>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">About this Project</h2>
              <div className="space-y-3 text-gray-600 dark:text-white/60 leading-relaxed text-sm">
                {project.description.split('\n').filter(Boolean).map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </section>

            {/* Project-specific details */}
            {detailEntries.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  {categoryIcon(project.category)}
                  <span className="capitalize">{project.category.replace(/_/g, ' ')} Details</span>
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {detailEntries.map(([key, value]) => (
                    <div
                      key={key}
                      className={`rounded-xl border border-black/8 dark:border-white/8 bg-black/[0.02] dark:bg-white/[0.02] p-4 ${
                        key === 'details' ? 'col-span-2 sm:col-span-3' : ''
                      }`}
                    >
                      <div className="text-xs text-gray-500 dark:text-white/40 mb-1">
                        {DETAIL_LABELS[key] ?? key.replace(/_/g, ' ')}
                      </div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">
                        {typeof value === 'number'
                          ? value.toLocaleString()
                          : String(value)}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Impact Metrics */}
            {impactEntries.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Leaf size={18} style={{ color: '#22c55e' }} />
                  Impact Metrics
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {impactEntries.map(([key, value]) => (
                    <div key={key} className="rounded-xl border border-black/8 dark:border-white/8 bg-black/[0.02] dark:bg-white/[0.02] p-4">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        {typeof value === 'number' ? value.toLocaleString() : value}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-white/40 capitalize">
                        {key.replace(/_/g, ' ')}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Milestones */}
            {sortedMilestones.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-5">Milestones</h2>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-px bg-gray-100 dark:bg-white/8" />
                  <div className="space-y-6">
                    {sortedMilestones.map((m) => (
                      <div key={m.id} className="flex gap-5 pl-1">
                        <div
                          className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 bg-white dark:bg-[#0C0C0C]"
                          style={{ borderColor: milestoneLineColor(m.status) }}
                        >
                          {milestoneIcon(m.status)}
                        </div>
                        <div className="flex-1 pb-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="text-sm font-semibold text-gray-900 dark:text-white">{m.title}</span>
                            <span
                              className="rounded-full px-2 py-0.5 text-[10px] font-medium capitalize border"
                              style={{
                                background: milestoneLineColor(m.status) + '20',
                                borderColor: milestoneLineColor(m.status) + '60',
                                color: milestoneLineColor(m.status),
                              }}
                            >
                              {m.status.replace(/_/g, ' ')}
                            </span>
                          </div>
                          {m.description && (
                            <p className="text-xs text-gray-500 dark:text-white/40 leading-relaxed mb-1">{m.description}</p>
                          )}
                          <p className="text-xs text-gray-400 dark:text-white/25">
                            Due: {new Date(m.dueDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                            {m.completedAt && (
                              <> · Completed: {new Date(m.completedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</>
                            )}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}

            {/* Documents */}
            {(project.documents ?? []).length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <FileText size={18} style={{ color: '#22c55e' }} />
                  Documents
                </h2>
                <DocumentList documents={project.documents!} projectId={project.id} />
              </section>
            )}

            {/* Updates */}
            {updates.length > 0 && (
              <section>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Newspaper size={18} style={{ color: '#22c55e' }} />
                  Project Updates
                </h2>
                <div className="space-y-5">
                  {updates.map((u) => (
                    <div key={u.id} className="rounded-xl border border-black/8 dark:border-white/8 bg-black/[0.02] dark:bg-white/[0.02] p-5">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{u.title}</h3>
                        <span className="shrink-0 text-[10px] text-gray-400 dark:text-white/30">
                          {new Date(u.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-white/45 leading-relaxed whitespace-pre-line">{u.content}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          {/* Right: funding card + team */}
          <div className="space-y-5">
            <FundingCard project={project} />
            {hasTeam && <TeamCard teamInfo={teamInfo!} />}
          </div>
        </div>
      </div>
    </main>
  );
}
