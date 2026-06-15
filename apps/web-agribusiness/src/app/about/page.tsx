'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Sprout, Globe, Users, TrendingUp, Shield } from 'lucide-react';
import { AnimatedSection, CountUp } from '@eldovia/ui';

export default function AboutPage() {
  return (
    <main className="bg-white dark:bg-[#0C0C0C] min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-5xl px-6">
        <AnimatedSection className="text-center mb-16">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm"
            style={{ borderColor: 'rgba(13,87,48,0.4)', background: 'rgba(13,87,48,0.1)', color: '#16a34a' }}
          >
            <Sprout size={13} />
            About Us
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl mb-4">
            Agriculture as an{' '}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(90deg, #22c55e, #4ade80)' }}>
              asset class
            </span>
          </h1>
          <p className="text-gray-500 dark:text-white/45 max-w-2xl mx-auto leading-relaxed">
            Eldovia Agribusiness was founded on a simple belief: African agriculture is one of the most undervalued investment opportunities of our generation — and the right infrastructure can change that.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
          <AnimatedSection direction="left">
            <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#22c55e' }}>Our Mission</p>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-5">
              Connecting capital with{' '}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(90deg, #22c55e, #4ade80)' }}>
                opportunity
              </span>
            </h2>
            <p className="text-gray-500 dark:text-white/50 leading-relaxed mb-4">
              We build the financial and technological infrastructure that allows global investors to participate in African agricultural projects at scale — with the transparency and governance standards they expect from any top-tier investment.
            </p>
            <p className="text-gray-500 dark:text-white/50 leading-relaxed">
              Our project structuring, due diligence, and impact measurement capabilities reduce the friction that has historically kept institutional capital out of smallholder agriculture — and in doing so, we change outcomes for thousands of farming families.
            </p>
          </AnimatedSection>

          <AnimatedSection direction="right">
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: 70, suffix: 'M+', label: 'Capital Deployed (USD)' },
                { value: 8, suffix: '', label: 'Countries Reached' },
                { value: 50, suffix: '+', label: 'Projects Funded' },
                { value: 3200, suffix: '+', label: 'Farmers Supported' },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl border border-black/8 dark:border-white/8 bg-black/[0.02] dark:bg-white/[0.02] p-5">
                  <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                    <CountUp end={s.value} suffix={s.suffix} duration={2} />
                  </div>
                  <div className="text-xs text-gray-400 dark:text-white/40">{s.label}</div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>

        {/* Values */}
        <AnimatedSection className="text-center mb-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Our{' '}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(90deg, #22c55e, #4ade80)' }}>
              principles
            </span>
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-16">
          {[
            { icon: Shield, title: 'Transparency', desc: 'Real-time dashboards, satellite crop monitoring, and investor-grade financial reporting.' },
            { icon: Globe, title: 'Local Expertise', desc: 'Deep in-country teams in every operating market with relationships at every level of the value chain.' },
            { icon: TrendingUp, title: 'Financial Discipline', desc: 'Rigorous project selection with clear hurdle rates and exit structures before any capital is deployed.' },
            { icon: Users, title: 'Community First', desc: 'Projects are structured so that farmers benefit as owners and participants, not just labor.' },
          ].map((v, i) => (
            <AnimatedSection key={v.title} delay={i * 0.1}>
              <motion.div whileHover={{ y: -4 }} transition={{ duration: 0.2 }} className="rounded-2xl border border-black/8 dark:border-white/8 bg-black/[0.02] dark:bg-white/[0.02] p-6">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: 'rgba(13,87,48,0.15)', border: '1px solid rgba(13,87,48,0.3)' }}>
                  <v.icon size={18} style={{ color: '#22c55e' }} />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{v.title}</h3>
                <p className="text-xs text-gray-500 dark:text-white/40 leading-relaxed">{v.desc}</p>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>

        <AnimatedSection className="text-center">
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/invest"
              className="group inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-white shadow-lg transition-all hover:scale-[1.02]"
              style={{ background: 'linear-gradient(135deg, #0d5730, #158040)', boxShadow: '0 8px 30px rgba(13,87,48,0.3)' }}
            >
              Start Investing
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-full border border-black/15 dark:border-white/15 px-8 py-4 text-sm font-semibold text-gray-800 dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition">
              Get in Touch
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </main>
  );
}
