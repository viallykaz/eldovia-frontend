'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Car, Menu, X, Gavel, Search } from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { AuthButton } from '@/components/auth-button';

const nav = [
  { label: 'Auctions', href: '/auctions' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Sell a Vehicle', href: '/sell' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? 'bg-white/90 dark:bg-[#020B18]/90 backdrop-blur-xl border-b border-black/5 dark:border-white/6 shadow-xl shadow-black/5 dark:shadow-black/30' : 'bg-transparent'
      }`}
    >
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-orange-500 to-amber-400">
              <Car size={16} className="text-white" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-[11px] font-semibold text-gray-400 dark:text-white/40 tracking-widest uppercase">Eldovia</span>
              <span className="text-sm font-bold text-gray-900 dark:text-white">Automobile</span>
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
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/auctions"
              className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <Search size={14} />
              Browse
            </Link>
            <AuthButton />
            <ThemeToggle />
            <Link
              href="/sell"
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.02] transition-all duration-300"
            >
              <Gavel size={14} />
              List a Vehicle
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden rounded-lg p-2 text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white/95 dark:bg-[#020B18]/95 backdrop-blur-xl border-t border-black/5 dark:border-white/6"
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
              <div className="pt-3 border-t border-black/8 dark:border-white/8 space-y-2">
                <Link href="/signin" onClick={() => setOpen(false)}
                  className="block w-full text-center rounded-full border border-black/12 dark:border-white/12 px-5 py-2.5 text-sm font-medium text-gray-700 dark:text-white/80">
                  Sign in
                </Link>
                <Link href="/signup" onClick={() => setOpen(false)}
                  className="block w-full text-center rounded-full border border-blue-600 bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white">
                  Sign up
                </Link>
                <Link href="/sell" onClick={() => setOpen(false)}
                  className="block w-full text-center rounded-full bg-gradient-to-r from-orange-500 to-amber-400 px-5 py-2.5 text-sm font-semibold text-white">
                  List a Vehicle
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
