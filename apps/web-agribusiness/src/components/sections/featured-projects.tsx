'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sprout, MapPin, TrendingUp, Users, ThumbsUp, Star, Bell } from 'lucide-react';
import { AnimatedSection } from '@eldovia/ui';
import { getProjects, type Project } from '@/lib/api';

const fmt = (n: number, currency = 'USD') => {
  try {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency, maximumFractionDigits: 0 }).format(n);
  } catch {
    return `${currency} ${n.toLocaleString()}`;
  }
};

function statusColor(status: string) {
  switch (status?.toLowerCase()) {
    case 'active':
      return { bg: 'rgba(13,87,48,0.15)', border: 'rgba(13,87,48,0.35)', text: '#4ade80' };
    case 'funded':
      return { bg: 'rgba(59,130,246,0.15)', border: 'rgba(59,130,246,0.35)', text: '#60a5fa' };
    default:
      return { bg: 'rgba(234,179,8,0.1)', border: 'rgba(234,179,8,0.25)', text: '#facc15' };
  }
}

// Fallback static projects shown while API loads or if API fails
const fallbackProjects: Partial<Project>[] = [
  {
    id: 'f1', slug: 'maize-valley-kenya', title: 'Maize Valley', country: 'Kenya',
    category: 'Cereals', status: 'active', fundingGoal: 2800000, fundingRaised: 2296000,
    investorCount: 45, expectedReturnRate: 14.2, isFeatured: true,
    summary: 'Commercial maize farming cooperative connecting 450 smallholder farmers in Rift Valley to supermarket supply chains.',
    images: [],
  },
  {
    id: 'f2', slug: 'rice-processing-hub-tanzania', title: 'Rice Processing Hub', country: 'Tanzania',
    category: 'Rice', status: 'active', fundingGoal: 3500000, fundingRaised: 2275000,
    investorCount: 62, expectedReturnRate: 12.8, isFeatured: true,
    summary: 'Solar-powered rice milling cooperative reducing post-harvest losses to under 8%.',
    images: [],
  },
  {
    id: 'f3', slug: 'cocoa-belt-ghana', title: 'Cocoa Belt Initiative', country: 'Ghana',
    category: 'Cocoa', status: 'active', fundingGoal: 5200000, fundingRaised: 4732000,
    investorCount: 98, expectedReturnRate: 16.5, isFeatured: true,
    summary: 'Premium cocoa certification and direct trade linking Ghanaian farmers with European chocolatiers.',
    images: [],
  },
];

function ProjectCard({ project, index }: { project: Partial<Project>; index: number }) {
  const pct = (project.fundingGoal ?? 0) > 0
    ? Math.min(100, Math.round(((project.fundingRaised ?? 0) / (project.fundingGoal ?? 1)) * 100))
    : 0;
  const stage = statusColor(project.status ?? '');
  const img = project.images?.[0];

  return (
    <AnimatedSection delay={index * 0.08}>
      <motion.div
        whileHover={{ y: -5 }}
        transition={{ duration: 0.25 }}
        className="group rounded-3xl border border-black/8 dark:border-white/8 bg-black/[0.02] dark:bg-white/[0.02] overflow-hidden hover:border-green-800/40 transition-all duration-300"
      >
        {/* Banner */}
        <div
          className="relative h-32 overflow-hidden"
          style={img
            ? { backgroundImage: `url(${img})`, backgroundSize: 'cover', backgroundPosition: 'center' }
            : { background: 'linear-gradient(135deg, #071A0E 0%, #0a2318 60%, #0d5730 100%)' }
          }
        >
          {!img && (
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <Sprout size={60} className="text-green-400" />
            </div>
          )}

          <div className="absolute top-3 left-3">
            <span
              className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold capitalize"
              style={{ background: stage.bg, borderColor: stage.border, color: stage.text }}
            >
              {stage.text === '#4ade80' && (
                <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
              )}
              {project.status}
            </span>
          </div>

          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-xs text-white/40">
            <MapPin size={10} />
            {project.country}
          </div>

          <div className="absolute top-3 right-3 flex flex-col items-end gap-1">
            <span className="rounded-full border border-white/15 bg-black/40 px-2.5 py-1 text-[10px] text-white/50">
              {project.category}
            </span>
            {project.operationalStatus && (
              <span className="rounded-full border border-white/10 bg-black/50 px-2 py-0.5 text-[9px] text-white/40 capitalize">
                {project.operationalStatus.replace(/_/g, ' ')}
              </span>
            )}
          </div>

          {/* Funding bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5">
            <motion.div
              initial={{ width: 0 }}
              whileInView={{ width: `${pct}%` }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: index * 0.1, ease: 'easeOut' }}
              className="h-full"
              style={{ background: 'linear-gradient(90deg, #0d5730, #22c55e)' }}
            />
          </div>
        </div>

        <div className="p-5">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{project.title}</h3>
          <p className="text-xs text-gray-500 dark:text-white/40 leading-relaxed mb-4 line-clamp-2">
            {project.summary}
          </p>

          <div className="grid grid-cols-3 gap-2 mb-4">
            {[
              { label: 'Target IRR', value: project.expectedReturnRate != null ? `${project.expectedReturnRate}%` : '—' },
              { label: 'Funded', value: `${pct}%` },
              { label: 'Investors', value: String(project.investorCount ?? 0) },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-black/6 dark:border-white/6 bg-black/[0.02] dark:bg-white/3 p-2 text-center">
                <div className="text-xs font-semibold text-gray-900 dark:text-white">{s.value}</div>
                <div className="text-[9px] text-gray-400 dark:text-white/30 mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="mb-4">
            <div className="flex justify-between text-xs text-gray-400 dark:text-white/40 mb-1">
              <span>{fmt(project.fundingRaised ?? 0, project.currency)} raised</span>
              <span className="flex items-center gap-1">
                <Users size={9} />
                {project.investorCount}
              </span>
            </div>
            <div className="h-1.5 rounded-full bg-black/8 dark:bg-white/8">
              <div
                className="h-full rounded-full"
                style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #0d5730, #22c55e)' }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
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
            <Link
              href={`/projects/${project.slug}`}
              className="group/btn inline-flex items-center gap-1.5 rounded-full border border-black/12 dark:border-white/12 px-4 py-2 text-xs font-semibold text-gray-700 dark:text-white hover:border-green-700/40 hover:bg-green-900/10 dark:hover:bg-green-900/20 transition-all"
            >
              <TrendingUp size={12} />
              View Details
              <ArrowRight size={12} className="transition-transform group-hover/btn:translate-x-1" />
            </Link>
          </div>
        </div>
      </motion.div>
    </AnimatedSection>
  );
}

export function FeaturedProjectsSection() {
  const [projects, setProjects] = useState<Partial<Project>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProjects({ featured: true, limit: 3, status: 'open' })
      .then((data) => {
        setProjects(data.length > 0 ? data.slice(0, 3) : fallbackProjects);
      })
      .catch(() => {
        setProjects(fallbackProjects);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="relative py-28 bg-white dark:bg-[#0C0C0C]">
      <div className="relative mx-auto max-w-7xl px-6">
        <AnimatedSection className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <p className="text-xs uppercase tracking-widest mb-2" style={{ color: '#22c55e' }}>
              Active Portfolio
            </p>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Open{' '}
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: 'linear-gradient(90deg, #22c55e, #4ade80)' }}
              >
                investments
              </span>
            </h2>
          </div>
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-white transition"
          >
            View all projects <ArrowRight size={14} />
          </Link>
        </AnimatedSection>

        {loading ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-72 rounded-3xl animate-pulse bg-gray-100 dark:bg-white/5" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {projects.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
