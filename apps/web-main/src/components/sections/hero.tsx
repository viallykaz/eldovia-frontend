'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Play } from 'lucide-react';

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-white dark:bg-[#030A14]">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(249,115,22,0.12)_0%,transparent_60%)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[600px] rounded-full bg-orange-500/5 blur-[120px]" />
        <div className="absolute top-1/4 right-1/4 h-[300px] w-[300px] rounded-full bg-blue-500/5 blur-[80px]" />

        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.5) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      {/* Floating orbs */}
      <motion.div
        animate={{ y: [0, -30, 0], rotate: [0, 180, 360] }}
        transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
        className="absolute top-20 right-20 h-20 w-20 rounded-full border border-orange-500/20 opacity-40"
      />
      <motion.div
        animate={{ y: [0, 20, 0], rotate: [360, 180, 0] }}
        transition={{ duration: 15, repeat: Infinity, ease: 'linear', delay: 2 }}
        className="absolute bottom-40 left-20 h-12 w-12 rounded-full border border-amber-400/20 opacity-30"
      />
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/3 right-1/3 h-4 w-4 rounded-full bg-orange-500/40"
      />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-7xl px-6 pt-32 pb-20">
        <div className="max-w-4xl">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-sm text-orange-500 dark:text-orange-300 backdrop-blur-sm"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-pulse" />
            Enterprise Ecosystem · Est. 2024
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="mb-6 text-5xl font-bold leading-[1.1] tracking-tight text-gray-900 dark:text-white sm:text-6xl xl:text-7xl"
          >
            Building
            <span className="block mt-1">
              <span className="bg-gradient-to-r from-orange-500 via-amber-400 to-orange-300 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                Tomorrow&apos;s
              </span>
            </span>
            Industries Today
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-10 max-w-xl text-lg text-gray-500 dark:text-white/55 leading-relaxed"
          >
            Eldovia Group is a diversified enterprise ecosystem driving innovation across
            automobile auctions, agricultural investment, and emerging markets.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-wrap items-center gap-4"
          >
            <Link
              href="/subsidiaries"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 transition-all duration-300 hover:shadow-orange-500/50 hover:scale-[1.02]"
            >
              Explore Subsidiaries
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 rounded-full border border-black/15 dark:border-white/15 px-7 py-3.5 text-sm font-semibold text-gray-800 dark:text-white backdrop-blur-sm transition-all duration-300 hover:bg-black/5 dark:hover:bg-white/5 hover:border-black/25 dark:hover:border-white/25"
            >
              <Play size={14} className="fill-current" />
              Watch Story
            </Link>
          </motion.div>

          {/* Trusted by */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="mt-16 flex items-center gap-6"
          >
            <p className="text-xs text-gray-400 dark:text-white/30 uppercase tracking-widest">Trusted by</p>
            <div className="flex items-center gap-5">
              {['International Finance Corp', 'AgriVest Partners', 'AutoGlobal Network'].map((name) => (
                <span key={name} className="text-xs text-gray-400 dark:text-white/25 font-medium hover:text-gray-600 dark:hover:text-white/50 transition cursor-default">
                  {name}
                </span>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Stats preview */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="absolute bottom-16 right-6 hidden xl:flex gap-4"
        >
          {[
            { value: '2', suffix: 'K+', label: 'Active Auctions' },
            { value: '50', suffix: '+', label: 'Projects Funded' },
            { value: '15', suffix: '+', label: 'Countries' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-black/8 dark:border-white/8 bg-black/4 dark:bg-white/4 backdrop-blur-sm px-5 py-4 text-center"
            >
              <div className="text-2xl font-bold text-orange-400">
                {stat.value}<span className="text-lg">{stat.suffix}</span>
              </div>
              <div className="text-xs text-gray-400 dark:text-white/40 mt-1">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white dark:from-[#030A14] to-transparent" />
    </section>
  );
}
