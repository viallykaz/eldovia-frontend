'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Mail } from 'lucide-react';
import { AnimatedSection } from '@eldovia/ui';

export function CtaSection() {
  return (
    <section className="relative py-28 overflow-hidden bg-white dark:bg-[#030A14]">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_50%_50%,rgba(249,115,22,0.08)_0%,transparent_70%)]" />
      </div>

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <AnimatedSection>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-500/25 bg-orange-500/8 px-4 py-1.5 text-sm text-orange-500 dark:text-orange-300"
          >
            <Mail size={13} />
            Ready to partner with us?
          </motion.div>

          <h2 className="mb-6 text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl leading-tight">
            Join the{' '}
            <span className="bg-gradient-to-r from-orange-500 via-amber-400 to-orange-300 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
              Eldovia ecosystem
            </span>
          </h2>

          <p className="mb-10 text-lg text-gray-500 dark:text-white/45 max-w-xl mx-auto leading-relaxed">
            Whether you&apos;re an investor, strategic partner, or enterprise buyer — there&apos;s
            a place for you in the Eldovia ecosystem.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 transition-all duration-300 hover:shadow-orange-500/50 hover:scale-[1.02]"
            >
              Get in Touch
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/subsidiaries"
              className="inline-flex items-center gap-2 rounded-full border border-black/15 dark:border-white/15 px-8 py-4 text-sm font-semibold text-gray-800 dark:text-white transition-all duration-300 hover:bg-black/5 dark:hover:bg-white/5"
            >
              Explore Subsidiaries
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
