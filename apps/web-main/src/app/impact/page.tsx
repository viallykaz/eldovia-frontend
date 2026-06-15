'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Leaf, Users, TrendingUp, Globe, Sun, Droplets } from 'lucide-react';
import { AnimatedSection, CountUp } from '@eldovia/ui';

const impactStats = [
  { icon: Users, value: 3200, suffix: '+', label: 'Farmers Supported', sub: 'Direct beneficiaries across agribusiness projects' },
  { icon: TrendingUp, value: 70, suffix: 'M+', label: 'Capital Deployed', sub: 'USD into agricultural transformation' },
  { icon: Leaf, value: 12000, suffix: '+', label: 'Hectares Under Management', sub: 'Productive land supported by Eldovia projects' },
  { icon: Globe, value: 8, suffix: '', label: 'African Countries', sub: 'Where agribusiness projects operate' },
  { icon: Sun, value: 45, suffix: '%', label: 'Renewable Energy', sub: 'Of project energy from solar and biogas' },
  { icon: Droplets, value: 60, suffix: '+', label: 'Water Projects', sub: 'Irrigation and water management initiatives' },
];

const sdgs = [
  { number: 1, title: 'No Poverty', color: '#E5243B', desc: 'Raising incomes for 3,200+ smallholder farmers through market linkages.' },
  { number: 2, title: 'Zero Hunger', color: '#DDA63A', desc: 'Improving food security across 8 African countries through productive agriculture.' },
  { number: 8, title: 'Decent Work', color: '#A21942', desc: '1,800+ jobs created in agricultural value chains and platform operations.' },
  { number: 13, title: 'Climate Action', color: '#3F7E44', desc: '45% renewable energy in projects; carbon sequestration measurement underway.' },
  { number: 17, title: 'Partnerships', color: '#19486A', desc: 'Mobilising global capital to meet African development objectives.' },
];

const caseStudies = [
  {
    title: 'Maize Value Chain Project — Kenya',
    category: 'Agribusiness',
    result: '$2.3M deployed',
    description: '450 smallholder farmers connected to Nairobi supermarket supply chains through aggregation centers and cold chain logistics. Average household income increased by 67% in year one.',
    metrics: ['450 Farmers', '67% Income Increase', '3 Counties', '$2.3M Deployed'],
  },
  {
    title: 'Cross-Border Vehicle Auction — West Africa',
    category: 'Automobile',
    result: '380 vehicles',
    description: 'First live digital auction crossing Ghana, Ivory Coast, and Senegal simultaneously. 380 vehicles sold in 72 hours, reducing average transaction time from 3 weeks to 4 days.',
    metrics: ['380 Vehicles', '72 Hours', '3 Countries', '4-day Settlement'],
  },
  {
    title: 'Rice Processing Hub — Tanzania',
    category: 'Agribusiness',
    result: '800 beneficiaries',
    description: 'Solar-powered rice milling cooperative serving 800 farmers across 5 districts. Post-harvest losses reduced from 35% to below 8% in the first season.',
    metrics: ['800 Farmers', '5 Districts', '35→8% Loss', 'Solar Powered'],
  },
];

export default function ImpactPage() {
  return (
    <main className="bg-white dark:bg-[#030A14] min-h-screen">
      {/* Hero */}
      <section className="relative pt-36 pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(249,115,22,0.08)_0%,transparent_70%)]" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <AnimatedSection>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-500/25 bg-orange-500/8 px-4 py-1.5 text-sm text-orange-500 dark:text-orange-300"
            >
              <Leaf size={13} />
              Impact & ESG
            </motion.div>

            <h1 className="mb-6 text-5xl font-bold text-gray-900 dark:text-white sm:text-6xl leading-tight">
              Returns with{' '}
              <span className="bg-gradient-to-r from-orange-500 via-amber-400 to-orange-300 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                real-world impact
              </span>
            </h1>

            <p className="text-lg text-gray-500 dark:text-white/50 max-w-2xl mx-auto leading-relaxed">
              We believe financial performance and positive impact are not in tension. Every investment we make is measured against both a financial return and a social outcome.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-24 bg-slate-50 dark:bg-[#050E1A]">
        <div className="mx-auto max-w-7xl px-6">
          <AnimatedSection className="text-center mb-14">
            <p className="text-xs uppercase tracking-widest text-orange-400 mb-3">By The Numbers</p>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Impact that{' '}
              <span className="bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">
                scales
              </span>
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {impactStats.map((stat, i) => (
              <AnimatedSection key={stat.label} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="group rounded-2xl border border-black/8 dark:border-white/8 bg-black/[0.02] dark:bg-white/3 p-6"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/10 border border-orange-500/20">
                    <stat.icon size={20} className="text-orange-400" />
                  </div>
                  <div className="text-4xl font-bold text-gray-900 dark:text-white mb-1">
                    <CountUp end={stat.value} suffix={stat.suffix} duration={2.5} />
                  </div>
                  <div className="text-sm font-semibold text-gray-600 dark:text-white/80 mb-1">{stat.label}</div>
                  <div className="text-xs text-gray-400 dark:text-white/35">{stat.sub}</div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* SDGs */}
      <section className="py-24 bg-white dark:bg-[#030A14]">
        <div className="mx-auto max-w-7xl px-6">
          <AnimatedSection className="text-center mb-14">
            <p className="text-xs uppercase tracking-widest text-orange-400 mb-3">UN Sustainable Development Goals</p>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Aligned with global{' '}
              <span className="bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">
                development goals
              </span>
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {sdgs.map((sdg, i) => (
              <AnimatedSection key={sdg.number} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-2xl border border-black/8 dark:border-white/8 bg-black/[0.02] dark:bg-white/3 p-5 text-center"
                >
                  <div
                    className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl text-white font-bold text-lg"
                    style={{ backgroundColor: sdg.color + '30', border: `1px solid ${sdg.color}50` }}
                  >
                    <span style={{ color: sdg.color }}>{sdg.number}</span>
                  </div>
                  <div className="font-semibold text-gray-900 dark:text-white text-sm mb-2">{sdg.title}</div>
                  <p className="text-xs text-gray-400 dark:text-white/40 leading-relaxed">{sdg.desc}</p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Case Studies */}
      <section className="py-24 bg-slate-50 dark:bg-[#050E1A]">
        <div className="mx-auto max-w-7xl px-6">
          <AnimatedSection className="text-center mb-14">
            <p className="text-xs uppercase tracking-widest text-orange-400 mb-3">Case Studies</p>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Stories from the{' '}
              <span className="bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">
                field
              </span>
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {caseStudies.map((cs, i) => (
              <AnimatedSection key={cs.title} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-3xl border border-black/8 dark:border-white/8 bg-black/[0.02] dark:bg-white/3 overflow-hidden"
                >
                  <div className="h-2 bg-gradient-to-r from-orange-500 to-amber-400" />
                  <div className="p-7">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-xs rounded-full border border-orange-500/25 bg-orange-500/10 px-3 py-1 text-orange-500 dark:text-orange-300">
                        {cs.category}
                      </span>
                      <span className="text-xs text-gray-400 dark:text-white/40">{cs.result}</span>
                    </div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-3 leading-snug">{cs.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-white/50 leading-relaxed mb-6">{cs.description}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {cs.metrics.map((m) => (
                        <div key={m} className="rounded-lg border border-black/8 dark:border-white/8 bg-black/[0.02] dark:bg-white/3 px-3 py-2 text-xs text-gray-500 dark:text-white/55 text-center">
                          {m}
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-white dark:bg-[#030A14]">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <AnimatedSection>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Invest with{' '}
              <span className="bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">
                impact in mind
              </span>
            </h2>
            <p className="text-gray-500 dark:text-white/45 mb-8 leading-relaxed">
              Download our ESG report or speak directly with our Impact team to understand how your capital creates measurable change.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 transition-all duration-300 hover:shadow-orange-500/50 hover:scale-[1.02]"
              >
                Talk to Our Team
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <button className="inline-flex items-center gap-2 rounded-full border border-black/15 dark:border-white/15 px-8 py-4 text-sm font-semibold text-gray-800 dark:text-white transition-all duration-300 hover:bg-black/5 dark:hover:bg-white/5">
                Download ESG Report
              </button>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}
