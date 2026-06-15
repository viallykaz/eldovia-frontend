'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FileText,
  MessageSquare,
  Image,
  Users,
  Sprout,
  Newspaper,
  Handshake,
  TrendingUp,
  LogOut,
  BarChart2,
  Bell,
} from 'lucide-react';
import { clearToken } from '@/lib/auth';

const CMS_ITEMS = [
  { href: '/pages', label: 'Pages', icon: FileText },
  { href: '/testimonials', label: 'Testimonials', icon: MessageSquare },
  { href: '/media', label: 'Media', icon: Image },
];

const AGRI_ITEMS = [
  { href: '/projects', label: 'Projects', icon: Sprout },
  { href: '/news', label: 'News', icon: Newspaper },
  { href: '/partners', label: 'Partners', icon: Handshake },
  { href: '/investments', label: 'Investments', icon: TrendingUp },
];

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/users', label: 'Users', icon: Users },
  { href: '/notifications', label: 'Activity', icon: Bell },
  { href: '/analytics', label: 'Analytics', icon: BarChart2 },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  function handleLogout() {
    clearToken();
    router.replace('/login');
  }

  function isActive(href: string) {
    if (href === '/') return pathname === '/';
    return pathname === href || pathname.startsWith(href + '/');
  }

  return (
    <aside className="fixed top-0 left-0 h-full w-60 bg-[#f8fafc] border-r border-gray-100 flex flex-col z-30">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-100">
        <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-white text-sm font-bold">E</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-gray-900 leading-tight">Eldovia</p>
          <p className="text-xs text-gray-400 leading-tight">Admin Dashboard</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {/* Main */}
        <p className="px-5 mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
          Main
        </p>
        <ul className="space-y-0.5 mb-4">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center gap-3 px-5 py-2.5 text-sm transition-colors ${
                    active
                      ? 'border-l-[3px] border-orange-500 text-orange-600 bg-orange-50 font-medium'
                      : 'border-l-[3px] border-transparent text-slate-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon size={17} className={active ? 'text-orange-500' : 'text-slate-400'} />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Agribusiness */}
        <p className="px-5 mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
          Agribusiness
        </p>
        <ul className="space-y-0.5 mb-4">
          {AGRI_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center gap-3 px-5 py-2.5 text-sm transition-colors ${
                    active
                      ? 'border-l-[3px] border-orange-500 text-orange-600 bg-orange-50 font-medium'
                      : 'border-l-[3px] border-transparent text-slate-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon size={17} className={active ? 'text-orange-500' : 'text-slate-400'} />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* CMS */}
        <p className="px-5 mb-2 text-[10px] font-semibold uppercase tracking-widest text-gray-400">
          CMS
        </p>
        <ul className="space-y-0.5">
          {CMS_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = isActive(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`flex items-center gap-3 px-5 py-2.5 text-sm transition-colors ${
                    active
                      ? 'border-l-[3px] border-orange-500 text-orange-600 bg-orange-50 font-medium'
                      : 'border-l-[3px] border-transparent text-slate-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon size={17} className={active ? 'text-orange-500' : 'text-slate-400'} />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Logout */}
      <div className="border-t border-gray-100 p-4">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 text-sm text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
        >
          <LogOut size={17} className="text-slate-400" />
          Sign out
        </button>
      </div>
    </aside>
  );
}
