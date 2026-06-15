'use client';

import { usePathname } from 'next/navigation';
import { Bell } from 'lucide-react';

const PATH_LABELS: Record<string, string> = {
  '/': 'Dashboard',
  '/pages': 'Pages',
  '/pages/new': 'New Page',
  '/testimonials': 'Testimonials',
  '/testimonials/new': 'New Testimonial',
  '/media': 'Media',
};

function getPageTitle(pathname: string): string {
  if (PATH_LABELS[pathname]) return PATH_LABELS[pathname];
  if (pathname.startsWith('/pages/') && pathname.endsWith('/edit'))
    return 'Edit Page';
  if (pathname.startsWith('/pages/')) return 'Edit Page';
  return 'Admin';
}

export default function AdminHeader() {
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-6 flex-shrink-0">
      <h1 className="text-base font-semibold text-gray-900">{title}</h1>
      <div className="flex items-center gap-3">
        <button className="relative p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-gray-100 transition-colors">
          <Bell size={18} />
        </button>
        <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-semibold">A</span>
        </div>
      </div>
    </header>
  );
}
