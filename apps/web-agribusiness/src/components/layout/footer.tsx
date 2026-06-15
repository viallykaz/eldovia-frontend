import Link from 'next/link';
import { Sprout } from 'lucide-react';

const links = {
  Platform: [
    { label: 'Browse Projects', href: '/projects' },
    { label: 'Invest', href: '/invest' },
    { label: 'Partners', href: '/partners' },
    { label: 'Impact Reports', href: '/impact' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'News', href: '/news' },
    { label: 'Contact', href: '/contact' },
    { label: 'Eldovia Group', href: 'http://localhost:3100' },
  ],
  Legal: [
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Investor Disclosure', href: '/disclosure' },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-black/6 dark:border-white/6 bg-white dark:bg-[#0C0C0C]">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: 'linear-gradient(135deg, #0d5730, #158040)' }}>
                <Sprout size={16} className="text-white" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-[10px] font-semibold text-gray-400 dark:text-white/35 tracking-widest uppercase">Eldovia</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">Agribusiness</span>
              </div>
            </Link>
            <p className="text-sm text-gray-400 dark:text-white/35 leading-relaxed max-w-xs">
              Connecting global capital with Africa&apos;s most promising agricultural projects. Transparent, impact-driven, and ESG-aligned.
            </p>
            <p className="mt-4 text-xs text-gray-300 dark:text-white/20">
              Part of{' '}
              <a href="http://localhost:3100" target="_blank" className="hover:text-gray-600 dark:hover:text-white/50 transition" style={{ color: '#158040' }}>
                Eldovia Group
              </a>
            </p>
          </div>

          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-white/35">{title}</p>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href} className="text-sm text-gray-400 dark:text-white/40 hover:text-gray-700 dark:hover:text-white/80 transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-black/6 dark:border-white/6 pt-8">
          <p className="text-xs text-gray-400 dark:text-white/25">
            &copy; {new Date().getFullYear()} Eldovia Agribusiness. All rights reserved.
          </p>
          <p className="text-xs text-gray-300 dark:text-white/20">
            Investment activities regulated per applicable jurisdictional requirements.
          </p>
        </div>
      </div>
    </footer>
  );
}
