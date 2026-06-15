import Link from 'next/link';
import { Mail, Phone, MapPin, Linkedin, Twitter, Facebook, Instagram } from 'lucide-react';

const footerLinks = {
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Mission & Vision', href: '/about#mission' },
    { label: 'Leadership', href: '/about#leadership' },
    { label: 'Impact', href: '/impact' },
  ],
  Subsidiaries: [
    { label: 'Eldovia Automobile', href: 'http://localhost:3101' },
    { label: 'Eldovia Agribusiness', href: 'http://localhost:3102' },
  ],
  Resources: [
    { label: 'Partners', href: '/partners' },
    { label: 'News', href: '/news' },
    { label: 'Contact', href: '/contact' },
    { label: 'Investor Relations', href: '/investors' },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-black/5 dark:border-white/5 bg-white dark:bg-[#030A14]">
      {/* Top glow */}
      <div className="h-px bg-gradient-to-r from-transparent via-orange-500/50 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-5">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center text-white font-black text-sm">
                E
              </div>
              <span className="text-gray-900 dark:text-white font-bold text-xl">
                Eldovia <span className="text-orange-400 font-light">Group</span>
              </span>
            </div>
            <p className="text-gray-500 dark:text-white/50 text-sm leading-relaxed max-w-xs mb-6">
              Building the future through innovation in automobile auctions and agricultural investment.
              A diversified enterprise ecosystem for tomorrow.
            </p>
            <div className="space-y-2.5">
              <a href="mailto:info@eldoviagroup.com" className="flex items-center gap-2.5 text-sm text-gray-400 dark:text-white/40 hover:text-orange-400 transition">
                <Mail size={14} /> info@eldoviagroup.com
              </a>
              <a href="tel:+1234567890" className="flex items-center gap-2.5 text-sm text-gray-400 dark:text-white/40 hover:text-orange-400 transition">
                <Phone size={14} /> +1 (234) 567-890
              </a>
              <p className="flex items-center gap-2.5 text-sm text-gray-400 dark:text-white/40">
                <MapPin size={14} /> Lagos, Nigeria · London, UK
              </p>
            </div>
            {/* Social */}
            <div className="flex gap-3 mt-6">
              {[Linkedin, Twitter, Facebook, Instagram].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 dark:border-white/10 text-gray-400 dark:text-white/40 hover:text-orange-400 hover:border-orange-500/30 transition"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-gray-900 dark:text-white text-sm font-semibold mb-4 tracking-wide">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-gray-400 dark:text-white/40 hover:text-orange-400 transition"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-8 border-t border-black/5 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-400 dark:text-white/25">
            © {new Date().getFullYear()} Eldovia Group. All rights reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((t) => (
              <Link key={t} href="#" className="text-xs text-gray-400 dark:text-white/25 hover:text-gray-600 dark:hover:text-white/60 transition">
                {t}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
