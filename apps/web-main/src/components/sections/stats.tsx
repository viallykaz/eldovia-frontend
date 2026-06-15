'use client';

import { motion } from 'framer-motion';
import { CountUp, AnimatedSection } from '@eldovia/ui';
import { TrendingUp, Globe, Users, Layers } from 'lucide-react';

const stats = [
  { icon: TrendingUp, value: 250, suffix: 'M+', label: 'Assets Under Management', sub: 'USD across all subsidiaries' },
  { icon: Globe, value: 15, suffix: '+', label: 'Countries Reached', sub: 'Global footprint' },
  { icon: Users, value: 12, suffix: 'K+', label: 'Registered Users', sub: 'Buyers, sellers & investors' },
  { icon: Layers, value: 2, suffix: '', label: 'Active Subsidiaries', sub: 'Automobile · Agribusiness' },
];

export function StatsSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-slate-50 dark:bg-[#050E1A]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(249,115,22,0.05)_0%,transparent_70%)]" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6">
        <AnimatedSection className="text-center mb-14">
          <p className="text-xs uppercase tracking-widest text-orange-400 mb-3">Our Scale</p>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Numbers that{' '}
            <span className="bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">
              define us
            </span>
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <AnimatedSection key={stat.label} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="group relative rounded-2xl border border-black/8 dark:border-white/8 bg-black/[0.02] dark:bg-white/3 p-6 backdrop-blur-sm overflow-hidden"
              >
                {/* Hover glow */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-orange-500/0 to-amber-400/0 group-hover:from-orange-500/5 group-hover:to-amber-400/5 transition-all duration-500" />

                <div className="relative">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/10 border border-orange-500/20">
                    <stat.icon size={20} className="text-orange-400" />
                  </div>
                  <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
                    <CountUp end={stat.value} suffix={stat.suffix} duration={2.5} />
                  </div>
                  <div className="text-sm font-semibold text-gray-600 dark:text-white/80 mb-1">{stat.label}</div>
                  <div className="text-xs text-gray-400 dark:text-white/35">{stat.sub}</div>
                </div>

                {/* Bottom accent */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-orange-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
