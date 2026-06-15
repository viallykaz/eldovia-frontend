'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Handshake, Globe, TrendingUp, Users, Star } from 'lucide-react';
import { AnimatedSection } from '@eldovia/ui';

const partnerTypes = [
  {
    icon: TrendingUp,
    title: 'Financial Partners',
    description: 'Institutional investors, family offices, and development finance institutions co-investing in our vehicles.',
    examples: ['Development Banks', 'Impact Funds', 'Private Equity', 'Venture Capital'],
  },
  {
    icon: Globe,
    title: 'Strategic Partners',
    description: 'Industry leaders providing distribution, expertise, and market access to accelerate subsidiary growth.',
    examples: ['Dealer Networks', 'Logistics Providers', 'Agricultural Offtakers', 'Government Agencies'],
  },
  {
    icon: Users,
    title: 'Community Partners',
    description: 'NGOs, cooperatives, and community organisations that help us deliver and measure on-the-ground impact.',
    examples: ['Farmer Cooperatives', 'Rural NGOs', 'UN Agencies', 'Academic Institutions'],
  },
  {
    icon: Handshake,
    title: 'Technology Partners',
    description: 'Technology vendors and integration partners that power our platforms and keep us at the frontier.',
    examples: ['Payments Infrastructure', 'KYC / AML Providers', 'Cloud Platforms', 'Data Analytics'],
  },
];

const featuredPartners = [
  { name: 'International Finance Corp', type: 'Financial Partner', description: 'IFC co-investment in Agribusiness portfolio projects.', initials: 'IFC' },
  { name: 'AgriVest Partners', type: 'Financial Partner', description: 'Lead LP in Eldovia Agribusiness Fund I.', initials: 'AV' },
  { name: 'AutoGlobal Network', type: 'Strategic Partner', description: 'European dealer network providing inventory access for Automobile platform.', initials: 'AG' },
  { name: 'GreenFarm Solutions', type: 'Strategic Partner', description: 'Agri-input supply partner ensuring project viability.', initials: 'GF' },
  { name: 'EuroCars Alliance', type: 'Strategic Partner', description: 'Cross-border vehicle sourcing and logistics partner.', initials: 'EC' },
  { name: 'AfricaAgri Fund', type: 'Financial Partner', description: 'Pan-African impact fund anchoring Agribusiness projects.', initials: 'AA' },
];

const benefits = [
  { title: 'Deal Flow Access', desc: 'Early visibility into high-quality deals across automobile and agribusiness before public listing.' },
  { title: 'Co-investment Rights', desc: 'Pro-rata rights to participate in follow-on rounds and new project financings.' },
  { title: 'Dedicated Relationship', desc: 'Named relationship manager and quarterly business reviews with group leadership.' },
  { title: 'ESG Reporting', desc: 'Comprehensive impact reporting aligned with GRI, SASB, and IFC Performance Standards.' },
  { title: 'Brand Visibility', desc: 'Logo placement and joint marketing opportunities across Eldovia Group platforms.' },
  { title: 'Network Access', desc: 'Invitation to annual Eldovia Partner Summit and exclusive deal-flow roundtables.' },
];

export default function PartnersPage() {
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
              <Handshake size={13} />
              Partnership Programme
            </motion.div>

            <h1 className="mb-6 text-5xl font-bold text-gray-900 dark:text-white sm:text-6xl leading-tight">
              Grow with{' '}
              <span className="bg-gradient-to-r from-orange-500 via-amber-400 to-orange-300 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                the ecosystem
              </span>
            </h1>

            <p className="text-lg text-gray-500 dark:text-white/50 max-w-2xl mx-auto leading-relaxed">
              Eldovia&apos;s partner programme is designed for organisations that want deep, strategic alignment — not just a logo on a page. We build relationships that last.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Partner Types */}
      <section className="py-24 bg-slate-50 dark:bg-[#050E1A]">
        <div className="mx-auto max-w-7xl px-6">
          <AnimatedSection className="text-center mb-16">
            <p className="text-xs uppercase tracking-widest text-orange-400 mb-3">How We Partner</p>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Four ways to{' '}
              <span className="bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">
                collaborate
              </span>
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {partnerTypes.map((pt, i) => (
              <AnimatedSection key={pt.title} delay={i * 0.1}>
                <motion.div
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="group rounded-2xl border border-black/8 dark:border-white/8 bg-black/[0.02] dark:bg-white/3 p-6 h-full"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-orange-500/10 border border-orange-500/20">
                    <pt.icon size={20} className="text-orange-400" />
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{pt.title}</h3>
                  <p className="text-sm text-gray-500 dark:text-white/45 leading-relaxed mb-4">{pt.description}</p>
                  <div className="space-y-1">
                    {pt.examples.map((e) => (
                      <div key={e} className="flex items-center gap-2 text-xs text-gray-400 dark:text-white/30">
                        <span className="h-1 w-1 rounded-full bg-orange-500/50 shrink-0" />
                        {e}
                      </div>
                    ))}
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-white dark:bg-[#030A14]">
        <div className="mx-auto max-w-7xl px-6">
          <AnimatedSection className="text-center mb-16">
            <p className="text-xs uppercase tracking-widest text-orange-400 mb-3">Partner Benefits</p>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              What you{' '}
              <span className="bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">
                unlock
              </span>
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b, i) => (
              <AnimatedSection key={b.title} delay={i * 0.08}>
                <div className="flex gap-4 rounded-2xl border border-black/8 dark:border-white/8 bg-black/[0.02] dark:bg-white/3 p-6">
                  <div className="shrink-0 mt-1">
                    <div className="h-6 w-6 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center">
                      <Star size={12} className="text-orange-400" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{b.title}</h3>
                    <p className="text-sm text-gray-500 dark:text-white/45 leading-relaxed">{b.desc}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Partners */}
      <section className="py-24 bg-slate-50 dark:bg-[#050E1A]">
        <div className="mx-auto max-w-7xl px-6">
          <AnimatedSection className="text-center mb-16">
            <p className="text-xs uppercase tracking-widest text-orange-400 mb-3">Our Partners</p>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              In good{' '}
              <span className="bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">
                company
              </span>
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredPartners.map((p, i) => (
              <AnimatedSection key={p.name} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-2xl border border-black/8 dark:border-white/8 bg-black/[0.02] dark:bg-white/3 p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-400 text-white font-bold text-sm">
                      {p.initials}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white mb-0.5">{p.name}</div>
                      <div className="text-xs text-orange-400 mb-2">{p.type}</div>
                      <p className="text-xs text-gray-500 dark:text-white/45 leading-relaxed">{p.description}</p>
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
              Ready to join our{' '}
              <span className="bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">
                partner network?
              </span>
            </h2>
            <p className="text-gray-500 dark:text-white/45 mb-8 leading-relaxed">
              Tell us about your organisation and how you see us working together. Our partnerships team will respond within 48 hours.
            </p>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 transition-all duration-300 hover:shadow-orange-500/50 hover:scale-[1.02]"
            >
              Become a Partner
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}
