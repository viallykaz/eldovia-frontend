'use client';

import { motion } from 'framer-motion';
import { AnimatedSection, CountUp } from '@eldovia/ui';
import { TrendingUp, Globe, Users, Leaf } from 'lucide-react';

const stats = [
  { icon: TrendingUp, value: 70, suffix: 'M+', label: 'Capital Deployed', sub: 'USD into agricultural projects' },
  { icon: Globe, value: 8, suffix: '', label: 'African Countries', sub: 'Active project footprint' },
  { icon: Leaf, value: 50, suffix: '+', label: 'Projects Funded', sub: 'Across 6 crop categories' },
  { icon: Users, value: 3200, suffix: '+', label: 'Farmers Supported', sub: 'Direct beneficiaries' },
];

export function StatsSection() {
  return (
    <section className="relative py-20 bg-slate-50 dark:bg-[#111111]">
      <div className="relative mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((stat, i) => (
            <AnimatedSection key={stat.label} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="group rounded-2xl border border-black/8 dark:border-white/8 bg-black/[0.02] dark:bg-white/[0.02] p-6"
              >
                <div
                  className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
                  style={{ background: 'rgba(13,87,48,0.15)', border: '1px solid rgba(13,87,48,0.3)' }}
                >
                  <stat.icon size={18} style={{ color: '#22c55e' }} />
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
