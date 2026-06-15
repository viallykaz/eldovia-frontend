'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@eldovia/ui';
import { ThemeToggle } from '@/components/theme-toggle';
import { AuthButton } from '@/components/auth-button';

const navLinks = [
  { label: 'About', href: '/about' },
  {
    label: 'Subsidiaries',
    href: '/subsidiaries',
    children: [
      { label: 'Eldovia Automobile', href: 'http://localhost:3101', external: true },
      { label: 'Eldovia Agribusiness', href: 'http://localhost:3102', external: true },
    ],
  },
  { label: 'Partners', href: '/partners' },
  { label: 'Impact', href: '/impact' },
  { label: 'Contact', href: '/contact' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
        scrolled
          ? 'bg-white/90 dark:bg-[#050E1A]/90 backdrop-blur-xl border-b border-black/5 dark:border-white/5 py-3'
          : 'bg-transparent py-5',
      )}
    >
      <div className="mx-auto max-w-7xl px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-9 w-9">
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-orange-500 to-amber-400 animate-pulse-glow" />
            <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-orange-500 to-amber-400 flex items-center justify-center text-white font-black text-sm">
              E
            </div>
          </div>
          <div>
            <span className="text-gray-900 dark:text-white font-bold text-lg tracking-tight">Eldovia</span>
            <span className="ml-1 text-orange-400 font-light text-lg">Group</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <div
              key={link.label}
              className="relative"
              onMouseEnter={() => link.children && setActiveDropdown(link.label)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                href={link.href}
                className="flex items-center gap-1 px-4 py-2 text-sm text-gray-600 dark:text-white/70 hover:text-gray-900 dark:hover:text-white transition-colors rounded-full hover:bg-black/5 dark:hover:bg-white/5"
              >
                {link.label}
                {link.children && <ChevronDown size={14} className="opacity-60" />}
              </Link>

              {link.children && activeDropdown === link.label && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute top-full left-0 mt-2 w-56 rounded-2xl bg-white/95 dark:bg-[#071627]/95 backdrop-blur-xl border border-black/10 dark:border-white/10 shadow-2xl overflow-hidden"
                >
                  {link.children.map((child) => (
                    <Link
                      key={child.label}
                      href={child.href}
                      target={child.external ? '_blank' : undefined}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-600 dark:text-white/70 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                      {child.label}
                    </Link>
                  ))}
                </motion.div>
              )}
            </div>
          ))}
        </nav>

        {/* CTA */}
        <div className="hidden lg:flex items-center gap-3">
          <AuthButton />
          <ThemeToggle />
          <Link
            href="/contact"
            className="px-5 py-2.5 text-sm font-semibold rounded-full bg-gradient-to-r from-orange-500 to-amber-400 text-white shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.02] transition-all duration-300"
          >
            Get in Touch
          </Link>
        </div>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden text-gray-600 dark:text-white p-2 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-black/10 dark:border-white/10 bg-white/98 dark:bg-[#050E1A]/98 backdrop-blur-xl"
          >
            <div className="px-6 py-4 space-y-1">
              <div className="flex justify-end pb-2">
                <ThemeToggle />
              </div>
              {navLinks.map((link) => (
                <div key={link.label}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 text-sm text-gray-600 dark:text-white/70 hover:text-gray-900 dark:hover:text-white rounded-xl hover:bg-black/5 dark:hover:bg-white/5 transition"
                  >
                    {link.label}
                  </Link>
                  {link.children?.map((child) => (
                    <Link
                      key={child.label}
                      href={child.href}
                      onClick={() => setMobileOpen(false)}
                      className="block pl-8 pr-4 py-2.5 text-sm text-gray-500 dark:text-white/50 hover:text-orange-400 transition"
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ))}
              <div className="pt-2 space-y-2 border-t border-black/8 dark:border-white/8">
                <Link href="/signin" onClick={() => setMobileOpen(false)}
                  className="block text-center px-5 py-2.5 text-sm font-medium rounded-full border border-black/12 dark:border-white/12 text-gray-700 dark:text-white/80">
                  Sign in
                </Link>
                <Link href="/signup" onClick={() => setMobileOpen(false)}
                  className="block text-center px-5 py-2.5 text-sm font-semibold rounded-full bg-gradient-to-r from-orange-500 to-amber-400 text-white">
                  Sign up
                </Link>
                <Link href="/contact" onClick={() => setMobileOpen(false)}
                  className="block text-center px-5 py-2.5 text-sm font-medium text-gray-500 dark:text-white/50 hover:text-gray-700 dark:hover:text-white/80 transition">
                  Get in Touch
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
