'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Gavel, Car } from 'lucide-react';
import { AnimatedSection } from '@eldovia/ui';

export function CtaSection() {
  return (
    <section className="relative py-28 overflow-hidden bg-slate-50 dark:bg-[#040F20]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_50%,rgba(249,115,22,0.07)_0%,transparent_70%)]" />

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <AnimatedSection>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-500/25 bg-orange-500/8 px-4 py-1.5 text-sm text-orange-500 dark:text-orange-300"
          >
            <Gavel size={13} />
            Ready to transact?
          </motion.div>

          <h2 className="mb-6 text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl leading-tight">
            Your next vehicle is{' '}
            <span className="bg-gradient-to-r from-orange-500 via-amber-400 to-orange-300 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
              waiting
            </span>
          </h2>

          <p className="mb-10 text-lg text-gray-500 dark:text-white/45 max-w-xl mx-auto leading-relaxed">
            Join 12,000+ buyers and sellers already using Eldovia Automobile. Registration takes under 10 minutes.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auctions"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 transition-all duration-300 hover:shadow-orange-500/50 hover:scale-[1.02]"
            >
              <Gavel size={16} />
              Browse Auctions
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/sell"
              className="inline-flex items-center gap-2 rounded-full border border-black/15 dark:border-white/15 px-8 py-4 text-sm font-semibold text-gray-800 dark:text-white transition-all duration-300 hover:bg-black/5 dark:hover:bg-white/5"
            >
              <Car size={16} />
              Sell a Vehicle
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
