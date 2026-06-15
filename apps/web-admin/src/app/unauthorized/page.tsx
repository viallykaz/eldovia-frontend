'use client';

import Link from 'next/link';
import { ShieldOff } from 'lucide-react';
import { clearToken } from '@/lib/auth';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="text-center max-w-sm">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-2xl mb-5">
          <ShieldOff size={28} className="text-red-500" />
        </div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-sm text-gray-500 mb-6">
          This panel is restricted to administrators and managers. Your account does not have the required role.
        </p>
        <div className="flex flex-col gap-2">
          <Link
            href="/login"
            onClick={clearToken}
            className="inline-block bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition"
          >
            Sign in with a different account
          </Link>
          <a
            href="https://eldovia.com"
            className="text-sm text-gray-400 hover:text-gray-600 transition"
          >
            Go to main site
          </a>
        </div>
      </div>
    </div>
  );
}
