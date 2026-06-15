'use client';

import { motion } from 'framer-motion';
import { AnimatedSection } from '@eldovia/ui';

const partners = [
  'International Finance Corp',
  'AgriVest Partners',
  'AutoGlobal Network',
  'GreenFarm Solutions',
  'EuroCars Alliance',
  'AfricaAgri Fund',
  'TechDrive Capital',
  'HarvestFirst Ltd',
];

export function PartnersSection() {
  const duplicated = [...partners, ...partners];

  return (
    <section className="relative py-20 overflow-hidden bg-white dark:bg-[#030A14]">
      <div className="mx-auto max-w-7xl px-6 mb-12">
        <AnimatedSection className="text-center">
          <p className="text-xs uppercase tracking-widest text-gray-400 dark:text-white/30 mb-3">
            Backed by world-class organisations
          </p>
        </AnimatedSection>
      </div>

      {/* Infinite scroll marquee */}
      <div className="relative overflow-hidden">
        {/* Left fade */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white dark:from-[#030A14] to-transparent z-10" />
        {/* Right fade */}
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white dark:from-[#030A14] to-transparent z-10" />

        <motion.div
          animate={{ x: [0, -50 * partners.length] }}
          transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          className="flex gap-8 whitespace-nowrap"
          style={{ width: 'max-content' }}
        >
          {duplicated.map((partner, i) => (
            <div
              key={i}
              className="inline-flex items-center gap-3 rounded-full border border-black/8 dark:border-white/8 bg-black/[0.02] dark:bg-white/3 px-6 py-3 text-sm text-gray-500 dark:text-white/35 hover:text-gray-700 dark:hover:text-white/60 hover:border-black/15 dark:hover:border-white/15 transition cursor-default"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-orange-500/60" />
              {partner}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
