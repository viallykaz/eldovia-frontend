'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Globe, Users, TrendingUp, Shield, Target, Layers } from 'lucide-react';
import { AnimatedSection, CountUp } from '@eldovia/ui';

const values = [
  {
    icon: Shield,
    title: 'Integrity',
    description: 'We operate with full transparency across every transaction, investment, and partnership.',
  },
  {
    icon: Globe,
    title: 'Global Reach',
    description: 'Our platforms connect participants across 15+ countries, bridging markets that were once inaccessible.',
  },
  {
    icon: Target,
    title: 'Impact-Driven',
    description: 'Every metric we track ties back to real-world outcomes — jobs created, food secured, vehicles transacted.',
  },
  {
    icon: Layers,
    title: 'Ecosystem Thinking',
    description: 'Our subsidiaries share infrastructure and capital, creating compounding advantages neither could achieve alone.',
  },
];

const leadership = [
  {
    name: 'Kwame Eldovia',
    title: 'Founder & Group CEO',
    initials: 'KE',
    bio: 'Two decades bridging African and European investment markets. Previously MD at Pan-African Capital.',
  },
  {
    name: 'Sophia Adler',
    title: 'Chief Operating Officer',
    initials: 'SA',
    bio: 'Former operations lead at a top-tier European automotive marketplace. Expert in cross-border logistics.',
  },
  {
    name: 'Dr. Ibrahim Nkosi',
    title: 'Chief Investment Officer',
    initials: 'IN',
    bio: 'PhD Agricultural Economics, Columbia. 18 years structuring agri-investment vehicles across sub-Saharan Africa.',
  },
  {
    name: 'Amara Diallo',
    title: 'Chief Technology Officer',
    initials: 'AD',
    bio: 'Built real-time auction systems processing $1B+ in annual volume. Passionate about emerging-market fintech.',
  },
];

const milestones = [
  { year: '2018', event: 'Eldovia Group founded in Luxembourg with a vision to connect African opportunity with global capital.' },
  { year: '2019', event: 'Launched Eldovia Automobile, Africa\'s first fully digital cross-border vehicle auction platform.' },
  { year: '2021', event: 'Eldovia Agribusiness goes live, securing first $10M in agricultural project funding.' },
  { year: '2022', event: 'Crossed 5,000 registered users; first ISO 27001 certification for data security.' },
  { year: '2023', event: 'Expanded to 12 countries. Surpassed $100M in cumulative assets under management.' },
  { year: '2024', event: '$250M AUM milestone. Group reaches 12K+ users across both platforms.' },
];

export default function AboutPage() {
  return (
    <main className="bg-white dark:bg-[#030A14] min-h-screen">
      {/* Hero */}
      <section className="relative pt-36 pb-24 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(249,115,22,0.1)_0%,transparent_70%)]" />
          <div className="absolute inset-0 opacity-[0.02]"
            style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
        </div>

        <div className="relative mx-auto max-w-5xl px-6 text-center">
          <AnimatedSection>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-500/25 bg-orange-500/8 px-4 py-1.5 text-sm text-orange-500 dark:text-orange-300"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-orange-400 animate-pulse" />
              Our Story
            </motion.div>

            <h1 className="mb-6 text-5xl font-bold text-gray-900 dark:text-white sm:text-6xl lg:text-7xl leading-tight">
              Built to{' '}
              <span className="bg-gradient-to-r from-orange-500 via-amber-400 to-orange-300 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                connect markets
              </span>
            </h1>

            <p className="text-lg text-gray-500 dark:text-white/50 max-w-2xl mx-auto leading-relaxed">
              Eldovia Group is a Luxembourg-headquartered investment holding company that builds digital platforms bridging African opportunity with global capital — starting with automobiles and agribusiness.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Mission */}
      <section className="py-24 bg-slate-50 dark:bg-[#050E1A]">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <AnimatedSection direction="left">
              <p className="text-xs uppercase tracking-widest text-orange-400 mb-3">Our Mission</p>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
                Democratising access to{' '}
                <span className="bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">
                  high-growth markets
                </span>
              </h2>
              <p className="text-gray-500 dark:text-white/50 leading-relaxed mb-6">
                We believe the most significant investment opportunities of the next decade lie in sectors and geographies that traditional capital has historically underserved. Eldovia exists to change that.
              </p>
              <p className="text-gray-500 dark:text-white/50 leading-relaxed">
                By building world-class digital infrastructure, we reduce friction, improve transparency, and create the trust required for global investors to participate in markets they previously could not access at scale.
              </p>
            </AnimatedSection>

            <AnimatedSection direction="right">
              <div className="grid grid-cols-2 gap-4">
                {[
                  { value: 250, suffix: 'M+', label: 'Assets Under Management' },
                  { value: 15, suffix: '+', label: 'Countries Reached' },
                  { value: 12, suffix: 'K+', label: 'Registered Users' },
                  { value: 6, suffix: '', label: 'Years Operating' },
                ].map((s) => (
                  <div key={s.label} className="rounded-2xl border border-black/8 dark:border-white/8 bg-black/[0.02] dark:bg-white/3 p-6">
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                      <CountUp end={s.value} suffix={s.suffix} duration={2} />
                    </div>
                    <div className="text-xs text-gray-400 dark:text-white/40">{s.label}</div>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-white dark:bg-[#030A14]">
        <div className="mx-auto max-w-7xl px-6">
          <AnimatedSection className="text-center mb-16">
            <p className="text-xs uppercase tracking-widest text-orange-400 mb-3">What We Stand For</p>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Principles that{' '}
              <span className="bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">
                guide us
              </span>
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v, i) => (
              <AnimatedSection key={v.title} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-2xl border border-black/8 dark:border-white/8 bg-black/[0.02] dark:bg-white/3 p-6 h-full"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/10 border border-orange-500/20">
                    <v.icon size={20} className="text-orange-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{v.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-white/45 leading-relaxed">{v.description}</p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-slate-50 dark:bg-[#050E1A]">
        <div className="mx-auto max-w-4xl px-6">
          <AnimatedSection className="text-center mb-16">
            <p className="text-xs uppercase tracking-widest text-orange-400 mb-3">Our Journey</p>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Milestones that{' '}
              <span className="bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">
                shaped us
              </span>
            </h2>
          </AnimatedSection>

          <div className="relative">
            <div className="absolute left-[88px] top-0 bottom-0 w-px bg-gradient-to-b from-orange-500/0 via-orange-500/30 to-orange-500/0" />

            <div className="space-y-8">
              {milestones.map((m, i) => (
                <AnimatedSection key={m.year} delay={i * 0.1} direction="left">
                  <div className="flex items-start gap-8">
                    <div className="w-16 shrink-0 text-right">
                      <span className="text-sm font-bold text-orange-400">{m.year}</span>
                    </div>
                    <div className="relative shrink-0 mt-1.5">
                      <div className="h-3 w-3 rounded-full bg-orange-500 ring-4 ring-orange-500/20" />
                    </div>
                    <p className="text-gray-500 dark:text-white/55 leading-relaxed pt-0">{m.event}</p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-24 bg-white dark:bg-[#030A14]">
        <div className="mx-auto max-w-7xl px-6">
          <AnimatedSection className="text-center mb-16">
            <p className="text-xs uppercase tracking-widest text-orange-400 mb-3">Leadership</p>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              The team{' '}
              <span className="bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">
                behind the vision
              </span>
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {leadership.map((person, i) => (
              <AnimatedSection key={person.name} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-2xl border border-black/8 dark:border-white/8 bg-black/[0.02] dark:bg-white/3 p-6 text-center"
                >
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-400 text-white font-bold text-lg">
                    {person.initials}
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{person.name}</h3>
                  <p className="text-xs text-orange-400 mb-3">{person.title}</p>
                  <p className="text-xs text-gray-500 dark:text-white/45 leading-relaxed">{person.bio}</p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-slate-50 dark:bg-[#050E1A]">
        <div className="mx-auto max-w-2xl px-6 text-center">
          <AnimatedSection>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Ready to be part of the{' '}
              <span className="bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">
                story?
              </span>
            </h2>
            <p className="text-gray-500 dark:text-white/45 mb-8 leading-relaxed">
              Whether you&apos;re an investor, strategic partner, or prospective team member — we&apos;d love to connect.
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
                View Subsidiaries
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}
