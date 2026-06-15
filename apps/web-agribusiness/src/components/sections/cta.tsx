'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, TrendingUp } from 'lucide-react';
import { AnimatedSection } from '@eldovia/ui';

export function CtaSection() {
  return (
    <section className="relative py-28 overflow-hidden bg-slate-50 dark:bg-[#111111]">
      <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(13,87,48,0.08) 0%, transparent 70%)' }} />

      <div className="relative mx-auto max-w-4xl px-6 text-center">
        <AnimatedSection>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm"
            style={{ borderColor: 'rgba(13,87,48,0.4)', background: 'rgba(13,87,48,0.1)', color: '#16a34a' }}
          >
            <TrendingUp size={13} />
            Start investing today
          </motion.div>

          <h2 className="mb-6 text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl leading-tight">
            Put your capital to{' '}
            <span
              className="bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]"
              style={{ backgroundImage: 'linear-gradient(90deg, #22c55e, #4ade80, #86efac, #22c55e)' }}
            >
              work
            </span>
          </h2>

          <p className="mb-10 text-lg text-gray-500 dark:text-white/45 max-w-xl mx-auto leading-relaxed">
            Join impact investors from 15+ countries already deploying capital through Eldovia Agribusiness projects.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/projects"
              className="group inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.02]"
              style={{ background: 'linear-gradient(135deg, #0d5730, #158040)', boxShadow: '0 8px 30px rgba(13,87,48,0.35)' }}
            >
              <TrendingUp size={16} />
              Start Investing
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-black/15 dark:border-white/15 px-8 py-4 text-sm font-semibold text-gray-800 dark:text-white transition-all duration-300 hover:bg-black/5 dark:hover:bg-white/5"
            >
              Talk to Our Team
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}
