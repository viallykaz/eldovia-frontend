'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Sprout, Menu, X, ArrowRight, LayoutDashboard } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { AuthButton } from '@/components/auth-button';
import { NotificationBell } from '@/components/notification-bell';
import { useAuth } from '@/components/session-provider';

const nav = [
  { label: 'Projects', href: '/projects' },
  { label: 'Partners', href: '/partners' },
  { label: 'News', href: '/news' },
  { label: 'Impact', href: '/impact' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-white/90 dark:bg-[#0C0C0C]/90 backdrop-blur-xl border-b border-black/5 dark:border-white/6 shadow-xl shadow-black/5 dark:shadow-black/30' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: 'linear-gradient(135deg, #0d5730, #158040)' }}>
              <Sprout size={16} className="text-white" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[11px] font-semibold text-gray-400 dark:text-white/40 tracking-widest uppercase">Eldovia</span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">Agribusiness</span>
            </div>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-2 text-sm text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
              >
                {item.label}
              </Link>
            ))}
            {user && (
              <Link
                href="/dashboard"
                className="flex items-center gap-1.5 px-4 py-2 text-sm text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-white transition-colors rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
              >
                <LayoutDashboard size={13} />
                Dashboard
              </Link>
            )}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <NotificationBell />
            <AuthButton />
            <ThemeToggle />
            <Link
              href="/invest"
              className="group inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-sm font-semibold text-white transition-all duration-300 hover:scale-[1.02]"
              style={{ background: 'linear-gradient(135deg, #0d5730, #158040)', boxShadow: '0 4px 20px rgba(13,87,48,0.3)' }}
            >
              Invest Now
              <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <button
            onClick={() => setOpen(!open)}
            className="md:hidden rounded-lg p-2 text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 dark:bg-[#0C0C0C]/95 backdrop-blur-xl border-t border-black/5 dark:border-white/6"
          >
            <div className="mx-auto max-w-7xl px-6 py-4 space-y-1">
              <div className="flex justify-end pb-2">
                <ThemeToggle />
              </div>
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block px-4 py-2.5 text-sm text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition"
                >
                  {item.label}
                </Link>
              ))}
              {user && (
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 rounded-lg transition"
                >
                  <LayoutDashboard size={13} />
                  Dashboard
                </Link>
              )}
              <div className="pt-3 border-t border-black/8 dark:border-white/8 space-y-2">
                <Link href="/signin" onClick={() => setOpen(false)}
                  className="block w-full text-center rounded-full border border-black/12 dark:border-white/12 px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-white/80">
                  Sign in
                </Link>
                <Link href="/signup" onClick={() => setOpen(false)}
                  className="block w-full text-center rounded-full px-5 py-2.5 text-sm font-semibold text-white"
                  style={{ background: 'linear-gradient(135deg, #0d5730, #158040)' }}>
                  Sign up
                </Link>
                <Link href="/invest" onClick={() => setOpen(false)}
                  className="block w-full text-center rounded-full py-2.5 text-sm font-semibold text-white"
                  style={{ background: 'linear-gradient(135deg, #0d5730, #158040)' }}>
                  Invest Now
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
