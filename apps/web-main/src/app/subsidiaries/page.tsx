'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Car, Sprout, Zap, CheckCircle2 } from 'lucide-react';
import { AnimatedSection } from '@eldovia/ui';

const subsidiaries = [
  {
    id: 'automobile',
    name: 'Eldovia Automobile',
    tagline: 'The Premier Auto Auction Marketplace',
    description:
      'A complete vehicle auction and marketplace platform connecting buyers, sellers, and dealers across borders. Powered by real-time technology that makes every transaction transparent, fast, and secure.',
    href: 'http://localhost:3101',
    gradient: 'from-[#0B1E3F] via-[#0D2952] to-[#0F3470]',
    borderColor: 'border-blue-500/20',
    accentColor: '#F97316',
    accentBg: 'bg-orange-500/10',
    accentBorder: 'border-orange-500/20',
    accentText: 'text-orange-400',
    icon: Car,
    features: [
      'Live & Timed Auctions',
      'Real-time Bidding Engine',
      'VIN Verification System',
      'Cross-border Logistics',
      'Inspection Reports',
      'Customs Documentation',
      'Escrow-protected Payments',
      'Dealer Network Access',
    ],
    stats: [
      { value: '2,400+', label: 'Vehicles Auctioned' },
      { value: '850+', label: 'Active Dealers' },
      { value: '12', label: 'Countries Served' },
      { value: '$180M', label: 'Transaction Volume' },
    ],
    audience: ['Vehicle Dealers', 'Fleet Managers', 'Private Buyers', 'Export/Import Firms'],
  },
  {
    id: 'agribusiness',
    name: 'Eldovia Agribusiness',
    tagline: 'Agricultural Investment & Innovation',
    description:
      'An investment-focused agribusiness platform showcasing agricultural projects and attracting global investors and partners. Transforming food systems and rural economies through transparent, impact-driven capital deployment.',
    href: 'http://localhost:3102',
    gradient: 'from-[#071A10] via-[#0a2318] to-[#0d5730]',
    borderColor: 'border-green-700/30',
    accentColor: '#22c55e',
    accentBg: 'bg-green-500/10',
    accentBorder: 'border-green-500/20',
    accentText: 'text-green-400',
    icon: Sprout,
    features: [
      'Project Showcase Portal',
      'Investor Dashboard',
      'Impact Metrics Tracking',
      'ESG Reporting',
      'Partnership Hub',
      'Due Diligence Tools',
      'Community Impact Metrics',
      'Regulatory Compliance',
    ],
    stats: [
      { value: '50+', label: 'Projects Funded' },
      { value: '$70M', label: 'Capital Deployed' },
      { value: '8', label: 'African Countries' },
      { value: '3,200', label: 'Farmers Supported' },
    ],
    audience: ['Impact Investors', 'NGOs & Foundations', 'Agricultural Partners', 'Government Bodies'],
  },
];

export default function SubsidiariesPage() {
  return (
    <main className="bg-white dark:bg-[#030A14] min-h-screen">
      {/* Hero */}
      <section className="relative pt-36 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(249,115,22,0.08)_0%,transparent_70%)]" />
        <div className="relative mx-auto max-w-4xl px-6 text-center">
          <AnimatedSection>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-500/25 bg-orange-500/8 px-4 py-1.5 text-sm text-orange-500 dark:text-orange-300"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-pulse" />
              Our Portfolio
            </motion.div>

            <h1 className="mb-6 text-5xl font-bold text-gray-900 dark:text-white sm:text-6xl leading-tight">
              Two industries.{' '}
              <span className="bg-gradient-to-r from-orange-500 via-amber-400 to-orange-300 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                One vision.
              </span>
            </h1>

            <p className="text-lg text-gray-500 dark:text-white/50 max-w-2xl mx-auto leading-relaxed">
              Each subsidiary operates independently while sharing Eldovia Group&apos;s infrastructure, capital, and global network — creating compounding advantages neither could achieve alone.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Subsidiaries */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 space-y-20">
          {subsidiaries.map((sub, i) => (
            <AnimatedSection key={sub.id} delay={i * 0.1}>
              <div className={`rounded-3xl border ${sub.borderColor} overflow-hidden bg-black/[0.02] dark:bg-white/[0.02]`}>
                {/* Banner */}
                <div className={`relative h-64 bg-gradient-to-br ${sub.gradient} overflow-hidden`}>
                  <div className="absolute inset-0 opacity-20"
                    style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

                  <div className="absolute inset-0 flex items-center justify-center">
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                    >
                      <div className={`rounded-2xl border border-white/20 bg-white/10 p-6 backdrop-blur-sm`}>
                        <sub.icon size={48} className="text-white" />
                      </div>
                    </motion.div>
                  </div>

                  <div className="absolute top-6 right-6">
                    <div className={`inline-flex items-center gap-2 rounded-full ${sub.accentBg} ${sub.accentBorder} border px-4 py-1.5`}>
                      <span className={`text-sm font-semibold ${sub.accentText}`}>Subsidiary #{i + 1}</span>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 lg:p-12">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left: description */}
                    <div className="lg:col-span-2">
                      <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${sub.accentText}`}>
                        {sub.tagline}
                      </p>
                      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">{sub.name}</h2>
                      <p className="text-gray-500 dark:text-white/50 leading-relaxed mb-8">{sub.description}</p>

                      {/* Features grid */}
                      <div className="grid grid-cols-2 gap-3 mb-8">
                        {sub.features.map((f) => (
                          <div key={f} className="flex items-center gap-2 text-sm text-gray-500 dark:text-white/55">
                            <CheckCircle2 size={14} className={sub.accentText} />
                            {f}
                          </div>
                        ))}
                      </div>

                      {/* Who it's for */}
                      <div className="mb-8">
                        <p className="text-xs uppercase tracking-widest text-gray-400 dark:text-white/30 mb-3">Who it&apos;s for</p>
                        <div className="flex flex-wrap gap-2">
                          {sub.audience.map((a) => (
                            <span key={a} className="rounded-full border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/3 px-3 py-1 text-xs text-gray-500 dark:text-white/50">
                              {a}
                            </span>
                          ))}
                        </div>
                      </div>

                      <Link
                        href={sub.href}
                        target="_blank"
                        className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/25 transition-all duration-300 hover:shadow-orange-500/40 hover:scale-[1.02]"
                      >
                        Visit {sub.name}
                        <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                      </Link>
                    </div>

                    {/* Right: stats */}
                    <div className="grid grid-cols-2 gap-4 content-start">
                      {sub.stats.map((s) => (
                        <div key={s.label} className="rounded-2xl border border-black/8 dark:border-white/8 bg-black/[0.02] dark:bg-white/3 p-5">
                          <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">{s.value}</div>
                          <div className="text-xs text-gray-400 dark:text-white/40 leading-tight">{s.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </section>

      {/* Synergies */}
      <section className="py-24 bg-slate-50 dark:bg-[#050E1A]">
        <div className="mx-auto max-w-5xl px-6">
          <AnimatedSection className="text-center mb-14">
            <p className="text-xs uppercase tracking-widest text-orange-400 mb-3">Group Advantage</p>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Stronger{' '}
              <span className="bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">
                together
              </span>
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              { icon: Zap, title: 'Shared Infrastructure', desc: 'Common authentication, payments, and compliance tooling reduces cost and time-to-market for both platforms.' },
              { icon: Car, title: 'Cross-sector Capital', desc: 'Group-level fundraising brings institutional capital that flows to whichever subsidiary has the highest near-term return potential.' },
              { icon: Sprout, title: 'Network Effects', desc: 'Investors and partners in Agribusiness often become buyers in Automobile — and vice versa — multiplying LTV across the group.' },
            ].map((item, i) => (
              <AnimatedSection key={item.title} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-2xl border border-black/8 dark:border-white/8 bg-black/[0.02] dark:bg-white/3 p-6"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/10 border border-orange-500/20">
                    <item.icon size={20} className="text-orange-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-white/45 leading-relaxed">{item.desc}</p>
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
              Interested in partnering with{' '}
              <span className="bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">
                our subsidiaries?
              </span>
            </h2>
            <p className="text-gray-500 dark:text-white/45 mb-8">
              Whether at the group level or directly with one of our platforms, we welcome conversations with aligned investors and partners.
            </p>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 transition-all duration-300 hover:shadow-orange-500/50 hover:scale-[1.02]"
            >
              Get in Touch
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}
