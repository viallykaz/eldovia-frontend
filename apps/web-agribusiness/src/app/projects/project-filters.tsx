'use client';

import { useRouter, usePathname } from 'next/navigation';
import { ChevronDown, Bell } from 'lucide-react';
import { getMyFollowedProjects } from '@/lib/api';
import { useState, useEffect } from 'react';
import { useAuth } from '@/components/session-provider';

interface ProjectFiltersProps {
  categories: string[];
  currentStatus?: string;
  currentCategory?: string;
  showFollowed?: boolean;
}

const statuses = [
  { value: 'all', label: 'All' },
  { value: 'open', label: 'Active' },
  { value: 'funded', label: 'Funded' },
  { value: 'completed', label: 'Completed' },
];

export function ProjectFilters({ categories, currentStatus = 'open', currentCategory, showFollowed }: ProjectFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const [followCount, setFollowCount] = useState(0);

  useEffect(() => {
    if (!user) { setFollowCount(0); return; }
    getMyFollowedProjects()
      .then((projects) => setFollowCount(projects.length))
      .catch(() => setFollowCount(0));
  }, [user]);

  function navigate(status: string, category?: string, followed?: boolean) {
    if (followed && !user) {
      router.push('/signin?next=/projects?followed=1');
      return;
    }
    const qs = new URLSearchParams();
    if (followed) {
      qs.set('followed', '1');
    } else {
      if (status && status !== 'all') qs.set('status', status);
      if (category && category !== 'all') qs.set('category', category);
    }
    const query = qs.toString();
    router.push(`${pathname}${query ? `?${query}` : ''}`);
  }

  return (
    <div className="mb-8 flex flex-col sm:flex-row gap-3 flex-wrap">
      {/* Followed toggle */}
      <button
        onClick={() => navigate('open', undefined, !showFollowed)}
        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all border"
        style={
          showFollowed
            ? { background: 'rgba(13,87,48,0.15)', borderColor: 'rgba(13,87,48,0.4)', color: '#4ade80' }
            : { borderColor: 'rgba(0,0,0,0.1)', color: 'rgba(0,0,0,0.5)' }
        }
      >
        <Bell size={13} />
        Following
        {!user && (
          <span className="text-[9px] text-gray-400 dark:text-white/25 ml-0.5">· Sign in</span>
        )}
        {user && followCount > 0 && (
          <span
            className="inline-flex items-center justify-center rounded-full text-[10px] font-bold h-4 w-4"
            style={showFollowed ? { background: '#22c55e', color: '#fff' } : { background: 'rgba(0,0,0,0.1)', color: 'rgba(0,0,0,0.5)' }}
          >
            {followCount}
          </span>
        )}
      </button>

      {/* Status filters (hidden when showing followed) */}
      {!showFollowed && (
        <div className="flex items-center gap-2 flex-wrap">
          {statuses.map((s) => {
            const active = currentStatus === s.value || (!currentStatus && s.value === 'open');
            return (
              <button
                key={s.value}
                onClick={() => navigate(s.value, currentCategory)}
                className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all border"
                style={
                  active
                    ? { background: 'rgba(13,87,48,0.15)', borderColor: 'rgba(13,87,48,0.4)', color: '#4ade80' }
                    : { borderColor: 'rgba(0,0,0,0.1)', color: 'rgba(0,0,0,0.5)' }
                }
              >
                {s.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Category dropdown */}
      {!showFollowed && categories.length > 0 && (
        <div className="relative">
          <select
            value={currentCategory ?? 'all'}
            onChange={(e) => navigate(currentStatus ?? 'open', e.target.value)}
            className="appearance-none rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0C0C0C] pl-4 pr-9 py-2.5 text-sm text-gray-600 dark:text-white/60 focus:outline-none cursor-pointer"
          >
            <option value="all">All Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c.replace(/_/g, ' ')}</option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/30 pointer-events-none"
          />
        </div>
      )}
    </div>
  );
}
