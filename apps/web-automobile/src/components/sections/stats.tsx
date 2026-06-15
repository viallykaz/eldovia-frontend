'use client';

import { motion } from 'framer-motion';
import { AnimatedSection, CountUp } from '@eldovia/ui';
import { Car, Globe, Users, TrendingUp } from 'lucide-react';

const stats = [
  { icon: Car, value: 2400, suffix: '+', label: 'Vehicles Auctioned', sub: 'Across all categories' },
  { icon: TrendingUp, value: 180, suffix: 'M+', label: 'Transaction Volume', sub: 'USD processed to date' },
  { icon: Globe, value: 12, suffix: '', label: 'Countries Served', sub: 'Buyers & sellers worldwide' },
  { icon: Users, value: 850, suffix: '+', label: 'Active Dealers', sub: 'Verified dealer network' },
];

export function StatsSection() {
  return (
    <section className="relative py-20 bg-slate-50 dark:bg-[#040F20]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(249,115,22,0.04)_0%,transparent_70%)]" />
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <AnimatedSection key={stat.label} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="group rounded-2xl border border-black/8 dark:border-white/8 bg-black/[0.02] dark:bg-white/3 p-6"
              >
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 border border-orange-500/20">
                  <stat.icon size={18} className="text-orange-400" />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  <CountUp end={stat.value} suffix={stat.suffix} duration={2.5} />
                </div>
                <div className="text-sm font-medium text-gray-600 dark:text-white/70 mb-0.5">{stat.label}</div>
                <div className="text-xs text-gray-400 dark:text-white/30">{stat.sub}</div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
