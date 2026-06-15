'use client';

import { motion } from 'framer-motion';
import { Leaf, Sun, Droplets, Users } from 'lucide-react';
import { AnimatedSection, CountUp } from '@eldovia/ui';

const impactItems = [
  { icon: Users, value: 3200, suffix: '+', label: 'Farmers Supported', color: '#22c55e' },
  { icon: Leaf, value: 12000, suffix: '+', label: 'Hectares Managed', color: '#4ade80' },
  { icon: Sun, value: 45, suffix: '%', label: 'Renewable Energy Use', color: '#fbbf24' },
  { icon: Droplets, value: 60, suffix: '+', label: 'Water Projects', color: '#60a5fa' },
];

const sdgBadges = [
  { n: 1, color: '#E5243B', label: 'No Poverty' },
  { n: 2, color: '#DDA63A', label: 'Zero Hunger' },
  { n: 8, color: '#A21942', label: 'Decent Work' },
  { n: 13, color: '#3F7E44', label: 'Climate Action' },
];

export function ImpactSection() {
  return (
    <section className="relative py-28 bg-slate-50 dark:bg-[#111111]">
      <div className="relative mx-auto max-w-7xl px-6">
        <AnimatedSection className="text-center mb-14">
          <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#22c55e' }}>Impact</p>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Measuring what{' '}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(90deg, #22c55e, #4ade80)' }}>
              matters
            </span>
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 mb-16">
          {impactItems.map((item, i) => (
            <AnimatedSection key={item.label} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className="rounded-2xl border border-black/8 dark:border-white/8 bg-black/[0.02] dark:bg-white/[0.02] p-6 text-center"
              >
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl" style={{ background: `${item.color}15`, border: `1px solid ${item.color}30` }}>
                  <item.icon size={20} style={{ color: item.color }} />
                </div>
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  <CountUp end={item.value} suffix={item.suffix} duration={2.5} />
                </div>
                <div className="text-xs text-gray-500 dark:text-white/40">{item.label}</div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>

        {/* SDG section */}
        <AnimatedSection className="rounded-3xl border border-black/8 dark:border-white/8 bg-black/[0.02] dark:bg-white/[0.02] p-8">
          <p className="text-xs uppercase tracking-widest text-gray-400 dark:text-white/30 mb-6 text-center">
            Aligned with UN Sustainable Development Goals
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {sdgBadges.map((sdg, i) => (
              <motion.div
                key={sdg.n}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-2 rounded-xl border px-4 py-2"
                style={{ borderColor: `${sdg.color}30`, background: `${sdg.color}10` }}
              >
                <span className="text-lg font-bold" style={{ color: sdg.color }}>{sdg.n}</span>
                <span className="text-xs text-gray-600 dark:text-white/55">{sdg.label}</span>
              </motion.div>
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
