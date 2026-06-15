'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Info, Images, MessageCircle, FileText } from 'lucide-react';

interface ProjectTabsProps {
  slug: string;
}

export function ProjectTabs({ slug }: ProjectTabsProps) {
  const pathname = usePathname();
  const base = `/projects/${slug}`;

  const tabs = [
    { href: base, label: 'Overview', icon: Info, exact: true },
    { href: `${base}/gallery`, label: 'Gallery', icon: Images, exact: false },
    { href: `${base}/forum`, label: 'Forum', icon: MessageCircle, exact: false },
    { href: `${base}/reports`, label: 'Reports', icon: FileText, exact: false },
  ];

  return (
    <div className="flex gap-1 border-b border-white/10 mt-4">
      {tabs.map(({ href, label, icon: Icon, exact }) => {
        const active = exact ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              active
                ? 'border-green-400 text-green-400'
                : 'border-transparent text-white/40 hover:text-white/70'
            }`}
          >
            <Icon size={14} />
            {label}
          </Link>
        );
      })}
    </div>
  );
}
