'use client';

import Link from 'next/link';
import { useAuth } from '@/components/session-provider';
import { User, LogOut } from 'lucide-react';

export function AuthButton() {
  const { user, isLoading, logout } = useAuth();

  if (isLoading) return <div className="h-9 w-20 bg-black/5 dark:bg-white/10 rounded-full animate-pulse" />;

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/account" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-white/80 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">
          <User size={15} />
          {user.firstName}
        </Link>
        <button
          onClick={logout}
          className="flex items-center gap-1 text-sm text-gray-400 dark:text-white/40 hover:text-red-500 transition-colors"
          aria-label="Sign out"
        >
          <LogOut size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link href="/signin" className="text-sm font-medium text-gray-600 dark:text-white/70 hover:text-gray-900 dark:hover:text-white transition-colors">
        Sign in
      </Link>
      <Link href="/signup" className="inline-flex items-center rounded-full bg-gradient-to-r from-orange-500 to-amber-400 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 hover:scale-[1.02] transition-all duration-300">
        Sign up
      </Link>
    </div>
  );
}
