'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/session-provider';
import { User, Mail, Shield, Fingerprint } from 'lucide-react';

function getProviderLabel(firebaseUid: string, email: string): string {
  if (!firebaseUid) return 'Email';
  if (/^\d+$/.test(firebaseUid)) return 'Google';
  if (/^[0-9a-f-]{30,}$/i.test(firebaseUid) && firebaseUid.includes('-')) return 'Microsoft';
  return 'Email';
}

function ProviderBadge({ firebaseUid, email }: { firebaseUid: string; email: string }) {
  const label = getProviderLabel(firebaseUid, email);
  const styles: Record<string, string> = {
    Google: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
    Microsoft: 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400',
    Email: 'bg-sky-50 dark:bg-sky-900/30 text-sky-700 dark:text-sky-400',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${styles[label] ?? styles.Email}`}>
      {label}
    </span>
  );
}

export default function AccountPage() {
  const { user, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) router.replace('/signin');
  }, [user, isLoading, router]);

  if (isLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">My Account</h1>
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-white/10 p-6 space-y-4">
          <div className="flex items-center gap-3 text-sm">
            <User size={16} className="text-gray-400" />
            <span className="text-gray-500 dark:text-gray-400 w-24">Name</span>
            <span className="font-medium text-gray-900 dark:text-white">{user.firstName} {user.lastName}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Mail size={16} className="text-gray-400" />
            <span className="text-gray-500 dark:text-gray-400 w-24">Email</span>
            <span className="font-medium text-gray-900 dark:text-white">{user.email}</span>
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Fingerprint size={16} className="text-gray-400" />
            <span className="text-gray-500 dark:text-gray-400 w-24">Sign-in via</span>
            <ProviderBadge firebaseUid={user.firebaseUid} email={user.email} />
          </div>
          <div className="flex items-center gap-3 text-sm">
            <Shield size={16} className="text-gray-400" />
            <span className="text-gray-500 dark:text-gray-400 w-24">Roles</span>
            <div className="flex gap-1 flex-wrap">
              {user.roles.map(r => (
                <span key={r} className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded text-xs">{r}</span>
              ))}
            </div>
          </div>
        </div>
        <button onClick={logout} className="mt-6 text-sm text-red-500 hover:underline">
          Sign out
        </button>
      </div>
    </div>
  );
}
