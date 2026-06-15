'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sprout, TrendingUp, Leaf, Globe } from 'lucide-react';
import { AnimatedSection } from '@eldovia/ui';

const floatingStats = [
  { icon: TrendingUp, value: '$70M+', label: 'Capital Deployed' },
  { icon: Globe, value: '8 Countries', label: 'Across Africa' },
  { icon: Leaf, value: '50+ Projects', label: 'Active & Funded' },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-white dark:bg-[#0C0C0C]">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_40%_50%,rgba(13,87,48,0.1)_0%,transparent_65%)] dark:bg-[radial-gradient(ellipse_70%_60%_at_40%_50%,rgba(13,87,48,0.18)_0%,transparent_65%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_30%_at_85%_20%,rgba(13,87,48,0.05)_0%,transparent_60%)] dark:bg-[radial-gradient(ellipse_40%_30%_at_85%_20%,rgba(13,87,48,0.08)_0%,transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.02]"
          style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.08) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      {/* Animated orbs */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/3 left-1/4 h-96 w-96 rounded-full blur-3xl pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(13,87,48,0.08) 0%, transparent 70%)' }}
      />

      <div className="relative mx-auto max-w-7xl px-6 pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <AnimatedSection>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm"
                style={{ borderColor: 'rgba(13,87,48,0.4)', background: 'rgba(13,87,48,0.1)', color: '#15803d' }}
              >
                <Sprout size={13} />
                Agricultural Investment Platform
              </motion.div>

              <h1 className="mb-6 text-5xl font-bold text-gray-900 dark:text-white sm:text-6xl lg:text-7xl leading-tight">
                Grow Africa&apos;s{' '}
                <span
                  className="bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]"
                  style={{ backgroundImage: 'linear-gradient(90deg, #22c55e, #4ade80, #86efac, #22c55e)' }}
                >
                  future
                </span>
              </h1>

              <p className="mb-10 text-lg text-gray-500 dark:text-white/50 leading-relaxed max-w-lg">
                Connect with Africa&apos;s most impactful agricultural projects. Transparent investment vehicles, real-time impact tracking, and ESG-aligned returns.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/projects"
                  className="group inline-flex items-center justify-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02]"
                  style={{ background: 'linear-gradient(135deg, #0d5730, #158040)', boxShadow: '0 8px 30px rgba(13,87,48,0.35)' }}
                >
                  <Sprout size={16} />
                  Browse Projects
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/invest"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-black/15 dark:border-white/15 px-8 py-4 text-sm font-semibold text-gray-800 dark:text-white transition-all duration-300 hover:bg-black/5 dark:hover:bg-white/5 hover:border-black/25 dark:hover:border-white/25"
                >
                  <TrendingUp size={16} />
                  Investor Portal
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap gap-6">
                {['Impact Tracked', 'ESG Compliant', 'IFC Standards'].map((b) => (
                  <div key={b} className="flex items-center gap-2 text-xs text-gray-400 dark:text-white/35">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ background: '#0d5730' }} />
                    {b}
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>

          {/* Right: floating stat cards + visual */}
          <AnimatedSection direction="right">
            <div className="relative">
              {/* Central visual */}
              <div className="relative h-80 rounded-3xl overflow-hidden border border-black/8 dark:border-white/8"
                style={{ background: 'linear-gradient(135deg, #071A0E 0%, #0a2318 50%, #0d5730 100%)' }}>
                <div className="absolute inset-0 opacity-10"
                  style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(255,255,255,0.05) 0%, transparent 50%), radial-gradient(circle at 70% 50%, rgba(34,197,94,0.05) 0%, transparent 50%)' }} />

                <div className="absolute inset-0 flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0], y: [0, -8, 0] }}
                    transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                    className="opacity-30"
                  >
                    <Sprout size={120} className="text-green-400" />
                  </motion.div>
                </div>

                {/* Floating progress bars (simulates project funding) */}
                <div className="absolute bottom-5 left-5 right-5">
                  {[
                    { label: 'Maize Valley, Kenya', pct: 82 },
                    { label: 'Rice Hub, Tanzania', pct: 65 },
                    { label: 'Cocoa Belt, Ghana', pct: 91 },
                  ].map((p) => (
                    <div key={p.label} className="mb-3">
                      <div className="flex justify-between text-[10px] text-white/40 mb-1">
                        <span>{p.label}</span>
                        <span>{p.pct}% funded</span>
                      </div>
                      <div className="h-1 rounded-full bg-white/10">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${p.pct}%` }}
                          transition={{ duration: 1.5, delay: 0.5, ease: 'easeOut' }}
                          className="h-full rounded-full"
                          style={{ background: 'linear-gradient(90deg, #0d5730, #22c55e)' }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stat badges */}
              {floatingStats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.2 }}
                  className={`absolute rounded-2xl border border-black/10 dark:border-white/10 bg-white/90 dark:bg-[#111111]/90 backdrop-blur-sm p-3 ${
                    i === 0 ? '-top-4 -right-4' : i === 1 ? 'top-1/2 -left-6' : '-bottom-4 right-8'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: 'rgba(13,87,48,0.2)', border: '1px solid rgba(13,87,48,0.3)' }}>
                      <s.icon size={14} style={{ color: '#22c55e' }} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900 dark:text-white">{s.value}</div>
                      <div className="text-[10px] text-gray-400 dark:text-white/35">{s.label}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
