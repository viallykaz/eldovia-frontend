'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  FileText, MessageSquare, Image, Plus, ArrowRight,
  Sprout, Newspaper, Handshake, Users, TrendingUp,
} from 'lucide-react';
import { getToken } from '@/lib/auth';
import { getPages, getTestimonials, getMedia, getProjects, getNewsAdmin, getPartnersAdmin, getUsers } from '@/lib/api';

interface Stats {
  pages: number;
  testimonials: number;
  media: number;
  projects: number;
  news: number;
  partners: number;
  users: number;
}

function StatCard({
  label, value, icon: Icon, iconBg, textColor, href, loading,
}: {
  label: string;
  value: number;
  icon: React.ElementType;
  iconBg: string;
  textColor: string;
  href: string;
  loading: boolean;
}) {
  return (
    <Link
      href={href}
      className="bg-white border border-gray-100 rounded-xl p-5 flex items-center gap-4 shadow-sm hover:shadow-md hover:border-gray-200 transition-all group"
    >
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${iconBg}`}>
        <Icon size={22} className={textColor} />
      </div>
      <div className="flex-1 min-w-0">
        {loading ? (
          <div className="w-10 h-6 bg-gray-100 rounded animate-pulse mb-1" />
        ) : (
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        )}
        <p className="text-sm text-gray-500 truncate">{label}</p>
      </div>
      <ArrowRight size={15} className="text-gray-300 group-hover:text-orange-400 transition-colors flex-shrink-0" />
    </Link>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [stats, setStats] = useState<Stats>({
    pages: 0, testimonials: 0, media: 0,
    projects: 0, news: 0, partners: 0, users: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!getToken()) {
      router.replace('/login');
      return;
    }
    setReady(true);
    fetchStats();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchStats() {
    setLoading(true);
    try {
      const [pagesRes, testimonialsRes, mediaRes, projectsRes, newsRes, partnersRes, usersRes] =
        await Promise.allSettled([
          getPages(),
          getTestimonials(),
          getMedia(),
          getProjects({ limit: 100 }),
          getNewsAdmin({ limit: 100 }),
          getPartnersAdmin(),
          getUsers({ limit: 1 }),
        ]);

      setStats({
        pages:        pagesRes.status        === 'fulfilled' ? (pagesRes.value as unknown[]).length                     : 0,
        testimonials: testimonialsRes.status === 'fulfilled' ? (testimonialsRes.value as unknown[]).length               : 0,
        media:        mediaRes.status        === 'fulfilled' ? (mediaRes.value as unknown[]).length                      : 0,
        projects:     projectsRes.status     === 'fulfilled' ? (projectsRes.value as unknown[]).length                   : 0,
        news:         newsRes.status         === 'fulfilled' ? (newsRes.value as { total: number }).total                 : 0,
        partners:     partnersRes.status     === 'fulfilled' ? (partnersRes.value as unknown[]).length                   : 0,
        users:        usersRes.status        === 'fulfilled' ? (usersRes.value as { total: number }).total                : 0,
      });
    } finally {
      setLoading(false);
    }
  }

  if (!ready)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Welcome */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Dashboard</h2>
        <p className="text-sm text-gray-500 mt-1">Platform-wide overview.</p>
      </div>

      {/* Agribusiness stats */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">Agribusiness</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Projects" value={stats.projects} icon={Sprout} iconBg="bg-green-50" textColor="text-green-600" href="/projects" loading={loading} />
          <StatCard label="News Articles" value={stats.news} icon={Newspaper} iconBg="bg-blue-50" textColor="text-blue-600" href="/news" loading={loading} />
          <StatCard label="Partners" value={stats.partners} icon={Handshake} iconBg="bg-purple-50" textColor="text-purple-600" href="/partners" loading={loading} />
          <StatCard label="Users" value={stats.users} icon={Users} iconBg="bg-orange-50" textColor="text-orange-600" href="/users" loading={loading} />
        </div>
      </div>

      {/* CMS stats */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-3">CMS</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard label="CMS Pages" value={stats.pages} icon={FileText} iconBg="bg-blue-50" textColor="text-blue-500" href="/pages" loading={loading} />
          <StatCard label="Testimonials" value={stats.testimonials} icon={MessageSquare} iconBg="bg-purple-50" textColor="text-purple-500" href="/testimonials" loading={loading} />
          <StatCard label="Media Files" value={stats.media} icon={Image} iconBg="bg-orange-50" textColor="text-orange-500" href="/media" loading={loading} />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm">
        <div className="px-5 py-4 border-b border-gray-100">
          <h3 className="text-sm font-semibold text-gray-900">Quick Actions</h3>
        </div>
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { href: '/projects/new', label: 'New Project', desc: 'Create an agribusiness project', icon: Sprout },
            { href: '/news/new', label: 'New Article', desc: 'Write a news article', icon: Newspaper },
            { href: '/partners/new', label: 'Add Partner', desc: 'Register a new partner', icon: Handshake },
            { href: '/investments', label: 'View Investments', desc: 'Review investor activity', icon: TrendingUp },
            { href: '/pages/new', label: 'New CMS Page', desc: 'Add a new site page', icon: FileText },
            { href: '/testimonials/new', label: 'Add Testimonial', desc: 'Publish a new testimonial', icon: MessageSquare },
          ].map(({ href, label, desc, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center justify-between gap-3 px-4 py-3 bg-gray-50 hover:bg-orange-50 border border-gray-100 hover:border-orange-200 rounded-lg transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center group-hover:border-orange-200">
                  <Icon size={15} className="text-orange-500" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{label}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
              </div>
              <ArrowRight size={15} className="text-gray-400 group-hover:text-orange-500 flex-shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
