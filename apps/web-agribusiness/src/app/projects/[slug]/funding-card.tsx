'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { TrendingUp, Users, Bell, BellOff, CheckCircle2, ThumbsUp, Lightbulb } from 'lucide-react';
import { useAuth } from '@/components/session-provider';
import { InvestmentModal } from './investment-modal';
import { followProject, unfollowProject, isFollowedLocally, getFollowStatus, reactToProject, hasReacted } from '@/lib/api';
import type { Project } from '@/lib/api';

const fmt = (n: number, currency?: string) => {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency && currency.length === 3 ? currency : 'USD',
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `${currency ?? 'USD'} ${n.toLocaleString()}`;
  }
};

interface FundingCardProps {
  project: Project;
}

export function FundingCard({ project }: FundingCardProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [following, setFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [justFollowed, setJustFollowed] = useState(false);
  const [followersCount, setFollowersCount] = useState(project.followersCount ?? 0);
  const [likes, setLikes] = useState(project.likeCount ?? 0);
  const [interesting, setInteresting] = useState(project.interestingCount ?? 0);
  const [likedLocally, setLikedLocally] = useState(false);
  const [interestingLocally, setInterestingLocally] = useState(false);
  const [reacting, setReacting] = useState<'like' | 'interesting' | null>(null);

  useEffect(() => {
    setFollowing(isFollowedLocally(project.id));
    setLikedLocally(hasReacted(project.id, 'like'));
    setInterestingLocally(hasReacted(project.id, 'interesting'));
  }, [project.id]);

  useEffect(() => {
    if (!user) return;
    getFollowStatus(project.id).then(setFollowing).catch(() => {});
  }, [user, project.id]);

  const pct = project.fundingGoal > 0
    ? Math.min(100, Math.round((project.fundingRaised / project.fundingGoal) * 100))
    : 0;

  function handleInvest() {
    if (!user) {
      router.push(`/signin?next=/projects/${project.slug}`);
      return;
    }
    setShowModal(true);
  }

  async function handleFollow() {
    if (!user) {
      router.push(`/signin?next=/projects/${project.slug}`);
      return;
    }
    setFollowLoading(true);
    try {
      if (following) {
        await unfollowProject(project.id);
        setFollowing(false);
        setJustFollowed(false);
        setFollowersCount((c) => Math.max(0, c - 1));
      } else {
        await followProject(project.id);
        setFollowing(true);
        setJustFollowed(true);
        setFollowersCount((c) => c + 1);
        setTimeout(() => setJustFollowed(false), 3000);
      }
    } finally {
      setFollowLoading(false);
    }
  }

  async function handleReact(type: 'like' | 'interesting') {
    if (type === 'like' && likedLocally) return;
    if (type === 'interesting' && interestingLocally) return;
    setReacting(type);
    try {
      const counts = await reactToProject(project.id, type);
      setLikes(counts.likeCount);
      setInteresting(counts.interestingCount);
      if (type === 'like') setLikedLocally(true);
      else setInterestingLocally(true);
    } catch {
      // silently ignore
    } finally {
      setReacting(null);
    }
  }

  return (
    <>
      <div className="rounded-3xl border border-black/8 dark:border-white/8 bg-black/[0.02] dark:bg-white/[0.02] p-6 sticky top-24">
        {/* Funding progress */}
        <div className="mb-6">
          <div className="mb-1">
            <span className="text-3xl font-bold text-gray-900 dark:text-white">
              {fmt(project.fundingRaised, project.currency)}
            </span>
          </div>
          <p className="text-sm text-gray-500 dark:text-white/40 mb-3">
            of {fmt(project.fundingGoal, project.currency)} goal
          </p>

          <div className="h-3 rounded-full bg-gray-100 dark:bg-white/8 overflow-hidden mb-2">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #0d5730, #22c55e)' }}
            />
          </div>

          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-white/40">
            <span className="font-semibold" style={{ color: '#22c55e' }}>{pct}% funded</span>
            <span className="flex items-center gap-1">
              <Users size={10} />
              {project.investorCount} investors
            </span>
          </div>
        </div>

        {/* Key stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          {project.expectedReturnRate != null && (
            <div className="rounded-xl border border-black/8 dark:border-white/8 bg-black/[0.02] dark:bg-white/3 p-3">
              <div className="text-[10px] text-gray-400 dark:text-white/30 mb-0.5">Expected IRR</div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                {project.expectedReturnRate}%
              </div>
            </div>
          )}
          {project.minimumInvestment != null && (
            <div className="rounded-xl border border-black/8 dark:border-white/8 bg-black/[0.02] dark:bg-white/3 p-3">
              <div className="text-[10px] text-gray-400 dark:text-white/30 mb-0.5">Min. Investment</div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                {fmt(project.minimumInvestment, project.currency)}
              </div>
            </div>
          )}
          {project.endDate && (
            <div className="rounded-xl border border-black/8 dark:border-white/8 bg-black/[0.02] dark:bg-white/3 p-3 col-span-2">
              <div className="text-[10px] text-gray-400 dark:text-white/30 mb-0.5">Closing Date</div>
              <div className="text-sm font-semibold text-gray-900 dark:text-white">
                {new Date(project.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
              </div>
            </div>
          )}
        </div>

        {/* Invest button */}
        <button
          onClick={handleInvest}
          disabled={isLoading}
          className="group w-full inline-flex items-center justify-center gap-2 rounded-full py-4 text-sm font-semibold text-white disabled:opacity-60 transition-all duration-300 hover:scale-[1.01] mb-3"
          style={{ background: 'linear-gradient(135deg, #0d5730, #158040)', boxShadow: '0 8px 30px rgba(13,87,48,0.3)' }}
        >
          <TrendingUp size={16} />
          {user ? 'Invest Now' : 'Sign in to Invest'}
        </button>

        {/* Follow button */}
        <button
          onClick={handleFollow}
          disabled={followLoading}
          className={`w-full inline-flex items-center justify-center gap-2 rounded-full py-3 text-sm transition-all ${
            following
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/40 text-green-700 dark:text-green-400'
              : 'text-gray-500 dark:text-white/50 border border-black/10 dark:border-white/10 hover:border-black/20 dark:hover:border-white/20'
          }`}
        >
          {followLoading ? (
            <span className="h-3.5 w-3.5 rounded-full border-2 border-current border-t-transparent animate-spin" />
          ) : following ? (
            <BellOff size={14} />
          ) : (
            <Bell size={14} />
          )}
          {following ? 'Following · Click to unfollow' : 'Follow this project'}
        </button>

        <div className="mt-2 flex items-center justify-between">
          {justFollowed && (
            <span className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
              <CheckCircle2 size={12} />
              You&apos;re now following this project
            </span>
          )}
          {followersCount > 0 && (
            <span className="ml-auto flex items-center gap-1 text-[11px] text-gray-400 dark:text-white/30">
              <Bell size={10} />
              {followersCount} {followersCount === 1 ? 'follower' : 'followers'}
            </span>
          )}
        </div>

        {/* Reactions */}
        <div className="mt-4 pt-4 border-t border-black/6 dark:border-white/6">
          <p className="text-[10px] text-gray-400 dark:text-white/30 mb-3 uppercase tracking-wide">Community Reactions</p>
          <div className="flex gap-2">
            <button
              onClick={() => handleReact('like')}
              disabled={likedLocally || reacting === 'like'}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-medium transition-all border ${
                likedLocally
                  ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/40 text-blue-600 dark:text-blue-400'
                  : 'border-black/10 dark:border-white/10 text-gray-500 dark:text-white/40 hover:border-blue-200 hover:text-blue-600 dark:hover:text-blue-400'
              } disabled:cursor-default`}
            >
              <ThumbsUp size={13} />
              <span>{likes > 0 ? likes : ''} Like{likes !== 1 ? 's' : ''}</span>
            </button>
            <button
              onClick={() => handleReact('interesting')}
              disabled={interestingLocally || reacting === 'interesting'}
              className={`flex-1 flex items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-medium transition-all border ${
                interestingLocally
                  ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800/40 text-yellow-600 dark:text-yellow-500'
                  : 'border-black/10 dark:border-white/10 text-gray-500 dark:text-white/40 hover:border-yellow-200 hover:text-yellow-600 dark:hover:text-yellow-500'
              } disabled:cursor-default`}
            >
              <Lightbulb size={13} />
              <span>{interesting > 0 ? interesting : ''} Interesting</span>
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <InvestmentModal
          projectId={project.id}
          projectTitle={project.title}
          minimumInvestment={project.minimumInvestment ?? 100}
          currency={project.currency ?? 'USD'}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}
