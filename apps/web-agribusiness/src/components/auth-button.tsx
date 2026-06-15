'use client';

import Link from 'next/link';
import { useAuth } from '@/components/session-provider';
import { User, LogOut } from 'lucide-react';

export function AuthButton() {
  const { user, isLoading, logout } = useAuth();

  if (isLoading) return <div className="h-9 w-20 bg-gray-100 dark:bg-white/10 rounded-md animate-pulse" />;

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <Link href="/profile" className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-white/80 hover:text-green-600 dark:hover:text-green-400 transition-colors">
          <User size={16} />
          {user.firstName}
        </Link>
        <button
          onClick={logout}
          className="flex items-center gap-1 text-sm text-gray-500 dark:text-white/50 hover:text-red-500 transition-colors"
          aria-label="Sign out"
        >
          <LogOut size={15} />
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link href="/signin" className="text-sm font-medium text-gray-700 dark:text-white/70 hover:text-green-600 dark:hover:text-green-400 transition-colors">
        Sign in
      </Link>
      <Link href="/signup" className="inline-flex items-center rounded-md bg-green-600 hover:bg-green-700 px-4 py-2 text-sm font-medium text-white transition-colors">
        Sign up
      </Link>
    </div>
  );
}
