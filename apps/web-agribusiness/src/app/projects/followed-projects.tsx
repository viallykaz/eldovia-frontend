'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Bell, Sprout, MapPin, TrendingUp, ArrowRight, Users, Lock } from 'lucide-react';
import { getMyFollowedProjects, type Project } from '@/lib/api';
import { useAuth } from '@/components/session-provider';

const fmt = (n: number, currency = 'USD') => {
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n);
  } catch {
    return `${currency} ${n.toLocaleString()}`;
  }
};

function MiniCard({ project }: { project: Project }) {
  const pct = project.fundingGoal > 0
    ? Math.min(100, Math.round((Number(project.fundingRaised) / Number(project.fundingGoal)) * 100))
    : 0;
  const img = project.images?.[0];

  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group rounded-3xl border border-black/8 dark:border-white/8 bg-white dark:bg-white/[0.02] overflow-hidden hover:border-green-800/40 hover:shadow-md transition-all duration-300 flex flex-col"
    >
      <div
        className="relative h-32 overflow-hidden flex-shrink-0"
        style={img
          ? { backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center' }
          : { background: 'linear-gradient(135deg, #071A0E 0%, #0a2318 60%, #0d5730 100%)' }
        }
      >
        {!img && (
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <Sprout size={48} className="text-green-400" />
          </div>
        )}
        <div className="absolute top-3 right-3">
          <span className="rounded-full border border-white/15 bg-black/40 px-2.5 py-1 text-[10px] text-white/60 capitalize">
            {project.category.replace(/_/g, ' ')}
          </span>
        </div>
        <div className="absolute bottom-3 left-3 flex items-center gap-1 text-xs text-white/50">
          <MapPin size={10} />
          {project.location ? `${project.location}, ` : ''}{project.country}
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5">
          <div className="h-full" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #0d5730, #22c55e)' }} />
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm mb-1 group-hover:text-green-700 dark:group-hover:text-green-400">
          {project.title}
        </h3>
        <p className="text-xs text-gray-500 dark:text-white/40 mb-3 line-clamp-2 flex-1">{project.summary}</p>
        <div className="flex items-center justify-between text-[10px] text-gray-400 dark:text-white/30">
          <span className="flex items-center gap-1"><Users size={9} />{project.investorCount} investors</span>
          <span className="font-semibold" style={{ color: '#22c55e' }}>{pct}% funded</span>
        </div>
        {project.expectedReturnRate != null && (
          <div className="mt-2 flex items-center gap-1 text-xs text-gray-500 dark:text-white/50">
            <TrendingUp size={10} style={{ color: '#22c55e' }} />
            {project.expectedReturnRate}% IRR
          </div>
        )}
        <span className="mt-2 flex items-center gap-1 text-xs font-medium" style={{ color: '#22c55e' }}>
          View Project <ArrowRight size={10} className="group-hover:translate-x-1 transition-transform" />
        </span>
      </div>
    </Link>
  );
}

export function FollowedProjects() {
  const { user, isLoading: authLoading } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) { setLoading(false); return; }
    getMyFollowedProjects()
      .then(setProjects)
      .catch(() => setProjects([]))
      .finally(() => setLoading(false));
  }, [user, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="h-8 w-8 rounded-full border-2 border-green-500/40 border-t-green-500 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl mb-4" style={{ background: 'rgba(13,87,48,0.1)' }}>
          <Lock size={28} style={{ color: '#22c55e' }} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Sign in to see your follows</h3>
        <p className="text-sm text-gray-500 dark:text-white/40 mb-6 max-w-xs">
          Your followed projects are saved to your account, not your device.
        </p>
        <Link
          href="/signin?next=/projects?followed=1"
          className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white"
          style={{ background: 'linear-gradient(135deg, #0d5730, #158040)' }}
        >
          Sign in
        </Link>
      </div>
    );
  }

  if (!projects.length) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl mb-4" style={{ background: 'rgba(13,87,48,0.1)' }}>
          <Bell size={28} style={{ color: '#22c55e' }} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No followed projects</h3>
        <p className="text-sm text-gray-500 dark:text-white/40 mb-6 max-w-xs">
          Follow projects to track their progress and get notified when they update.
        </p>
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold text-white"
          style={{ background: 'linear-gradient(135deg, #0d5730, #158040)' }}
        >
          Browse projects
        </Link>
      </div>
    );
  }

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#22c55e' }}>
        Projects you follow · {projects.length}
      </p>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {projects.map((p) => (
          <MiniCard key={p.id} project={p} />
        ))}
      </div>
    </div>
  );
}
