'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { AnimatedSection } from '@eldovia/ui';
import { ArrowRight, Car, Sprout, Zap } from 'lucide-react';

const subsidiaries = [
  {
    id: 'automobile',
    name: 'Eldovia Automobile',
    tagline: 'The Premier Auto Auction Marketplace',
    description:
      'A complete vehicle auction and marketplace platform. Buy and sell vehicles through live auctions, timed bidding, and direct listings — powered by real-time technology.',
    href: 'http://localhost:3101',
    gradient: 'from-blue-600 via-azure-700 to-indigo-900',
    accentColor: '#F97316',
    icon: Car,
    features: ['Live & Timed Auctions', 'Real-time Bidding', 'VIN Verification', 'Logistics Support'],
    stats: { label: 'Vehicles Auctioned', value: '2,400+' },
  },
  {
    id: 'agribusiness',
    name: 'Eldovia Agribusiness',
    tagline: 'Agricultural Investment & Innovation',
    description:
      'An investment-focused agribusiness platform showcasing agricultural projects, attracting global investors and partners to transform food systems and rural economies.',
    href: 'http://localhost:3102',
    gradient: 'from-green-900 via-emerald-900 to-[#0d5730]',
    accentColor: '#0d5730',
    icon: Sprout,
    features: ['Project Showcasing', 'Investor Portal', 'Impact Tracking', 'Partnership Hub'],
    stats: { label: 'Projects Funded', value: '50+' },
  },
];

export function SubsidiariesSection() {
  return (
    <section className="relative py-28 overflow-hidden bg-white dark:bg-[#030A14]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_30%_at_20%_50%,rgba(249,115,22,0.04)_0%,transparent_60%)]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <AnimatedSection className="mb-16">
          <p className="text-xs uppercase tracking-widest text-orange-400 mb-3">Our Portfolio</p>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl lg:text-5xl max-w-md leading-tight">
              Two industries.{' '}
              <span className="bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">
                One vision.
              </span>
            </h2>
            <p className="text-gray-500 dark:text-white/45 text-sm max-w-xs leading-relaxed">
              Each subsidiary operates independently while benefiting from Eldovia Group&apos;s shared infrastructure and capital.
            </p>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {subsidiaries.map((sub, i) => (
            <AnimatedSection key={sub.id} delay={i * 0.15} direction={i % 2 === 0 ? 'left' : 'right'}>
              <motion.div
                whileHover={{ y: -6 }}
                transition={{ duration: 0.3 }}
                className="group relative rounded-3xl overflow-hidden border border-black/8 dark:border-white/8 bg-black/[0.02] dark:bg-white/3"
              >
                {/* Top gradient banner */}
                <div className={`relative h-52 bg-gradient-to-br ${sub.gradient} overflow-hidden`}>
                  <div className="absolute inset-0 opacity-30"
                    style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

                  {/* Floating icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      animate={{ y: [0, -12, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: i }}
                      className="relative"
                    >
                      <div className="absolute inset-0 rounded-full blur-2xl"
                        style={{ background: `radial-gradient(circle, ${sub.accentColor}60 0%, transparent 70%)` }} />
                      <div className="relative rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-sm">
                        <sub.icon size={36} className="text-white" />
                      </div>
                    </motion.div>
                  </div>

                  {/* Stat badge */}
                  <div className="absolute top-4 right-4 rounded-xl border border-white/20 bg-black/30 backdrop-blur-sm px-3 py-2">
                    <div className="text-lg font-bold text-white">{sub.stats.value}</div>
                    <div className="text-xs text-white/60">{sub.stats.label}</div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-7">
                  <div className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-white/35">
                    Subsidiary
                  </div>
                  <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">{sub.name}</h3>
                  <p className="mb-1 text-sm font-medium" style={{ color: sub.accentColor }}>
                    {sub.tagline}
                  </p>
                  <p className="mb-6 text-sm text-gray-500 dark:text-white/50 leading-relaxed">{sub.description}</p>

                  {/* Features */}
                  <div className="mb-6 grid grid-cols-2 gap-2">
                    {sub.features.map((f) => (
                      <div key={f} className="flex items-center gap-2 text-xs text-gray-500 dark:text-white/45">
                        <Zap size={11} className="text-orange-400 shrink-0" />
                        {f}
                      </div>
                    ))}
                  </div>

                  <Link
                    href={sub.href}
                    target="_blank"
                    className="group/btn inline-flex items-center gap-2 rounded-full border border-black/15 dark:border-white/15 px-5 py-2.5 text-sm font-semibold text-gray-800 dark:text-white transition-all duration-300 hover:bg-black/5 dark:hover:bg-white/8 hover:border-black/25 dark:hover:border-white/25"
                  >
                    Visit Platform
                    <ArrowRight size={14} className="transition-transform group-hover/btn:translate-x-1" />
                  </Link>
                </div>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}
