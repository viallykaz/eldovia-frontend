import Link from 'next/link';
import { Car } from 'lucide-react';

const links = {
  Platform: [
    { label: 'Live Auctions', href: '/auctions?type=live' },
    { label: 'Timed Auctions', href: '/auctions?type=timed' },
    { label: 'Browse All', href: '/auctions' },
    { label: 'Sell a Vehicle', href: '/sell' },
  ],
  Support: [
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'Buyer Guide', href: '/how-it-works#buyer' },
    { label: 'Seller Guide', href: '/how-it-works#seller' },
    { label: 'Contact Us', href: '/contact' },
  ],
  Legal: [
    { label: 'Terms of Service', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Cookie Policy', href: '/cookies' },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-black/6 dark:border-white/6 bg-white dark:bg-[#020B18]">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-amber-400">
                <Car size={16} className="text-white" />
              </div>
              <div className="flex flex-col leading-tight">
                <span className="text-[10px] font-semibold text-gray-400 dark:text-white/35 tracking-widest uppercase">Eldovia</span>
                <span className="text-sm font-bold text-gray-900 dark:text-white">Automobile</span>
              </div>
            </Link>
            <p className="text-sm text-gray-400 dark:text-white/35 leading-relaxed max-w-xs">
              Africa&apos;s premier cross-border vehicle auction platform. Buy and sell with confidence — powered by real-time technology.
            </p>
            <p className="mt-4 text-xs text-gray-300 dark:text-white/20">
              Part of{' '}
              <a href="http://localhost:3100" target="_blank" className="text-orange-400/70 hover:text-orange-400 transition">
                Eldovia Group
              </a>
            </p>
          </div>

          {/* Links */}
          {Object.entries(links).map(([title, items]) => (
            <div key={title}>
              <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-white/35">{title}</p>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-sm text-gray-400 dark:text-white/40 hover:text-gray-700 dark:hover:text-white/80 transition-colors"
                    >
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
            &copy; {new Date().getFullYear()} Eldovia Automobile. All rights reserved.
          </p>
          <p className="text-xs text-gray-300 dark:text-white/20">
            Registered in Luxembourg · VAT LU12345678
          </p>
        </div>
      </div>
    </footer>
  );
}
