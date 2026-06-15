import Link from 'next/link';
import { Sprout, MapPin, TrendingUp, ArrowRight, Users, ThumbsUp, Star, Bell } from 'lucide-react';
import { getProjects, type Project } from '@/lib/api';
import { ProjectFilters } from './project-filters';
import { FollowedProjects } from './followed-projects';

const fmt = (n: number, currency = 'USD') => {
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n);
  } catch {
    return `${currency} ${n.toLocaleString()}`;
  }
};

function statusStyle(status: string): { bg: string; border: string; color: string } {
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

function ProjectCard({ project }: { project: Project }) {
  const pct = project.fundingGoal > 0
    ? Math.min(100, Math.round((project.fundingRaised / project.fundingGoal) * 100))
    : 0;
  const st = statusStyle(project.status);
  const img = project.images?.[0];
  const displayStatus = project.status === 'open' ? 'active' : project.status;

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group rounded-3xl border border-black/8 dark:border-white/8 bg-white dark:bg-white/[0.02] overflow-hidden hover:border-green-800/40 hover:shadow-md transition-all duration-300 flex flex-col"
    >
      {/* Banner */}
      <div
        className="relative h-36 overflow-hidden flex-shrink-0"
        style={img
          ? { backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center' }
          : { background: 'linear-gradient(135deg, #071A0E 0%, #0a2318 60%, #0d5730 100%)' }
        }
      >
        {!img && (
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <Sprout size={56} className="text-green-400" />
          </div>
        )}

        {/* Status badge */}
        <div className="absolute top-3 left-3">
          <span
            className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold capitalize"
            style={{ background: st.bg, borderColor: st.border, color: st.color }}
          >
            {st.color === '#4ade80' && (
              <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
            )}
            {displayStatus}
          </span>
        </div>

        {/* Category */}
        <div className="absolute top-3 right-3">
          <span className="rounded-full border border-white/15 bg-black/40 px-2.5 py-1 text-[10px] text-white/60">
            {project.category}
          </span>
        </div>

        {/* Location */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1 text-xs text-white/50">
          <MapPin size={10} />
          {project.location ? `${project.location}, ` : ''}{project.country}
        </div>

        {/* Operational stage badge */}
        {project.operationalStatus && (
          <div className="absolute bottom-3 right-3">
            <span className="rounded-full border border-white/10 bg-black/50 px-2 py-0.5 text-[9px] text-white/50 capitalize">
              {project.operationalStatus.replace(/_/g, ' ')}
            </span>
          </div>
        )}

        {/* Funding bar */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5">
          <div
            className="h-full transition-all duration-700"
            style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #0d5730, #22c55e)' }}
          />
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1 group-hover:text-green-700 dark:group-hover:text-green-400 transition-colors">
          {project.title}
        </h3>
        <p className="text-xs text-gray-500 dark:text-white/40 leading-relaxed mb-4 line-clamp-2 flex-1">
          {project.summary}
        </p>

        {/* Progress */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-400 dark:text-white/40 mb-1.5">
            <span>{fmt(project.fundingRaised, project.currency)} raised</span>
            <span className="font-medium" style={{ color: '#22c55e' }}>{pct}%</span>
          </div>
          <div className="h-1.5 rounded-full bg-gray-100 dark:bg-white/8">
            <div
              className="h-full rounded-full"
              style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #0d5730, #22c55e)' }}
            />
          </div>
          <div className="mt-1 flex items-center justify-between text-[10px] text-gray-400 dark:text-white/30">
            <span>of {fmt(project.fundingGoal, project.currency)} goal</span>
            <span className="flex items-center gap-1">
              <Users size={9} />
              {project.investorCount} investors
            </span>
          </div>
        </div>

        {/* Metrics row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {project.expectedReturnRate != null && (
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-white/50">
                <TrendingUp size={11} style={{ color: '#22c55e' }} />
                <span>{project.expectedReturnRate}% IRR</span>
              </div>
            )}
            {(project.likeCount ?? 0) > 0 && (
              <span className="flex items-center gap-1 text-[10px] text-gray-400 dark:text-white/30">
                <ThumbsUp size={10} /> {project.likeCount}
              </span>
            )}
            {(project.interestingCount ?? 0) > 0 && (
              <span className="flex items-center gap-1 text-[10px] text-gray-400 dark:text-white/30">
                <Star size={10} /> {project.interestingCount}
              </span>
            )}
            {(project.followersCount ?? 0) > 0 && (
              <span className="flex items-center gap-1 text-[10px] text-gray-400 dark:text-white/30">
                <Bell size={10} /> {project.followersCount}
              </span>
            )}
          </div>
          <span
            className="ml-auto inline-flex items-center gap-1 text-xs font-medium"
            style={{ color: '#22c55e' }}
          >
            View Project <ArrowRight size={11} className="transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; status?: string; followed?: string }>;
}) {
  const sp = await searchParams;
  const category = sp.category;
  const status = sp.status ?? 'open';
  const showFollowed = sp.followed === '1';

  let projects: Project[] = [];
  let error: string | null = null;

  if (!showFollowed) {
    try {
      projects = await getProjects({ status: status !== 'all' ? status : undefined, category });
    } catch (e) {
      error = e instanceof Error ? e.message : 'Failed to load projects';
    }
  }

  const featured = projects.filter((p) => p.isFeatured);
  const rest = featured.length > 0 ? projects.filter((p) => !p.isFeatured) : projects;
  const categories = Array.from(new Set(projects.map((p) => p.category).filter(Boolean)));

  return (
    <main className="bg-white dark:bg-[#0C0C0C] min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Header */}
        <div className="mb-10">
          <p className="text-xs uppercase tracking-widest mb-2" style={{ color: '#22c55e' }}>
            Investment Opportunities
          </p>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            {showFollowed ? (
              <>Projects you&apos;re <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(90deg, #22c55e, #4ade80)' }}>following</span></>
            ) : (
              <>Invest in <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(90deg, #22c55e, #4ade80)' }}>Africa&apos;s agriculture</span></>
            )}
          </h1>
          <p className="mt-3 text-gray-500 dark:text-white/50 max-w-xl">
            {showFollowed
              ? 'Track the progress of projects you follow. Get notified when they update.'
              : 'Browse active agricultural investment projects across Africa. Real impact, transparent returns.'}
          </p>
        </div>

        {/* Filters */}
        <ProjectFilters
          categories={categories}
          currentStatus={status}
          currentCategory={category}
          showFollowed={showFollowed}
        />

        {/* Error state */}
        {error && (
          <div className="rounded-xl border border-red-200 dark:border-red-800/40 bg-red-50 dark:bg-red-900/10 p-4 mb-8 text-sm text-red-600 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Followed projects (client component, reads localStorage) */}
        {showFollowed ? (
          <FollowedProjects />
        ) : (
          <>
            {/* Featured projects */}
            {featured.length > 0 && (
              <div className="mb-12">
                <p className="text-xs font-semibold uppercase tracking-widest text-yellow-600 dark:text-yellow-400 mb-4">
                  Featured Projects
                </p>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {featured.map((p) => (
                    <ProjectCard key={p.id} project={p} />
                  ))}
                </div>
              </div>
            )}

            {/* All projects */}
            {rest.length > 0 ? (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {rest.map((p) => (
                  <ProjectCard key={p.id} project={p} />
                ))}
              </div>
            ) : !error ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl mb-4" style={{ background: 'rgba(13,87,48,0.1)' }}>
                  <Sprout size={28} style={{ color: '#22c55e' }} />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No projects found</h3>
                <p className="text-sm text-gray-500 dark:text-white/40 mb-6">
                  Try adjusting your filters or check back soon for new opportunities.
                </p>
                <Link
                  href="/projects"
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white"
                  style={{ background: 'linear-gradient(135deg, #0d5730, #158040)' }}
                >
                  Clear filters
                </Link>
              </div>
            ) : null}
          </>
        )}
      </div>
    </main>
  );
}
