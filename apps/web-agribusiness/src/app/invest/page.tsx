'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { TrendingUp, Shield, BarChart3, ArrowRight, CheckCircle2, Users } from 'lucide-react';
import { AnimatedSection } from '@eldovia/ui';

const tiers = [
  {
    name: 'Seed Investor',
    min: 10000,
    max: 49999,
    benefits: ['Access to all open projects', 'Quarterly impact reports', 'Investor portal access', 'Email support'],
    color: '#22c55e',
  },
  {
    name: 'Growth Investor',
    min: 50000,
    max: 249999,
    benefits: ['All Seed benefits', 'Early access to new projects', 'Dedicated relationship manager', 'Annual site visits'],
    color: '#4ade80',
    featured: true,
  },
  {
    name: 'Impact Partner',
    min: 250000,
    max: null,
    benefits: ['All Growth benefits', 'Co-investment rights', 'Board observer seat', 'Custom impact reporting', 'Priority allocation'],
    color: '#86efac',
  },
];

const faqs = [
  { q: 'Who can invest on Eldovia Agribusiness?', a: 'Accredited investors from our supported jurisdictions. KYC/AML verification is required before any investment.' },
  { q: 'What are the typical returns?', a: 'Target IRRs range from 12% to 18% depending on project risk profile and term. Returns are not guaranteed.' },
  { q: 'How are funds held?', a: 'Investor funds are held in a regulated escrow account and disbursed to projects in tranches tied to verified milestones.' },
  { q: 'What happens if a project underperforms?', a: 'We carry a first-loss guarantee on all projects of up to 15% of project capital. Investors are informed immediately of any material developments.' },
  { q: 'How often do I receive updates?', a: 'Quarterly impact and financial reports, plus immediate notifications for any material project events.' },
];

export default function InvestPage() {
  const [form, setForm] = useState({ name: '', email: '', company: '', amount: '', tier: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  return (
    <main className="bg-white dark:bg-[#0C0C0C] min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-6xl px-6">
        {/* Hero */}
        <AnimatedSection className="text-center mb-16">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm"
            style={{ borderColor: 'rgba(13,87,48,0.4)', background: 'rgba(13,87,48,0.1)', color: '#16a34a' }}
          >
            <TrendingUp size={13} />
            Investor Portal
          </motion.div>

          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">
            Invest for{' '}
            <span
              className="bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]"
              style={{ backgroundImage: 'linear-gradient(90deg, #22c55e, #4ade80, #86efac, #22c55e)' }}
            >
              returns and impact
            </span>
          </h1>
          <p className="text-gray-500 dark:text-white/45 max-w-xl mx-auto leading-relaxed">
            Target IRRs of 12–18% with full ESG reporting. Our projects are structured to deliver financial returns alongside measurable agricultural and community outcomes.
          </p>
        </AnimatedSection>

        {/* How it works */}
        <div className="mb-16 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { icon: Users, title: 'Register & Verify', desc: 'Complete KYC/AML verification. Takes under 24 hours.' },
            { icon: BarChart3, title: 'Choose Projects', desc: 'Browse open investments, review due diligence, and select allocations.' },
            { icon: TrendingUp, title: 'Track & Earn', desc: 'Monitor live impact metrics and receive quarterly distributions.' },
          ].map((s, i) => (
            <AnimatedSection key={s.title} delay={i * 0.1}>
              <div className="rounded-2xl border border-black/8 dark:border-white/8 bg-black/[0.02] dark:bg-white/[0.02] p-6 text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl" style={{ background: 'rgba(13,87,48,0.15)', border: '1px solid rgba(13,87,48,0.3)' }}>
                  <s.icon size={20} style={{ color: '#22c55e' }} />
                </div>
                <div className="text-xs font-bold mb-1" style={{ color: 'rgba(13,87,48,0.7)' }}>Step {i + 1}</div>
                <div className="font-semibold text-gray-900 dark:text-white mb-1">{s.title}</div>
                <p className="text-xs text-gray-500 dark:text-white/40 leading-relaxed">{s.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Tiers */}
        <AnimatedSection className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(90deg, #22c55e, #4ade80)' }}>
              Investor tiers
            </span>
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-16">
          {tiers.map((tier, i) => (
            <AnimatedSection key={tier.name} delay={i * 0.1}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className={`rounded-3xl border p-7 relative ${tier.featured ? 'border-green-700/40 bg-green-950/10 dark:bg-green-950/20' : 'border-black/8 dark:border-white/8 bg-black/[0.02] dark:bg-white/[0.02]'}`}
              >
                {tier.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="rounded-full px-3 py-1 text-xs font-semibold text-black" style={{ background: '#22c55e' }}>
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="mb-1 text-lg font-bold text-gray-900 dark:text-white">{tier.name}</div>
                <div className="text-sm text-gray-500 dark:text-white/40 mb-5">
                  ${tier.min.toLocaleString()}{tier.max ? ` – $${tier.max.toLocaleString()}` : '+'}
                </div>
                <div className="space-y-2.5 mb-7">
                  {tier.benefits.map((b) => (
                    <div key={b} className="flex items-center gap-2 text-sm text-gray-600 dark:text-white/60">
                      <CheckCircle2 size={13} style={{ color: tier.color }} />
                      {b}
                    </div>
                  ))}
                </div>
                <Link
                  href="#register"
                  className="block w-full rounded-full py-3 text-center text-sm font-semibold text-white transition-all hover:scale-[1.01]"
                  style={{ background: `linear-gradient(135deg, #0d5730, ${tier.color})` }}
                >
                  Get Started
                </Link>
              </motion.div>
            </AnimatedSection>
          ))}
        </div>

        {/* Registration form */}
        <div id="register" className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <AnimatedSection className="lg:col-span-3" direction="left">
            <div className="rounded-3xl border border-black/8 dark:border-white/8 bg-black/[0.02] dark:bg-white/[0.02] p-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Register your interest</h2>

              {submitted ? (
                <div className="text-center py-12">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full" style={{ background: 'rgba(13,87,48,0.15)', border: '1px solid rgba(13,87,48,0.3)' }}>
                    <CheckCircle2 size={28} style={{ color: '#22c55e' }} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Thank you</h3>
                  <p className="text-sm text-gray-500 dark:text-white/45">Our investor relations team will contact you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { name: 'name', label: 'Full Name', placeholder: 'Jane Smith' },
                      { name: 'email', label: 'Email Address', placeholder: 'jane@fund.com' },
                      { name: 'company', label: 'Organisation', placeholder: 'Impact Fund Ltd' },
                      { name: 'amount', label: 'Investment Range (USD)', placeholder: '$50,000+' },
                    ].map((f) => (
                      <div key={f.name}>
                        <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-white/35 mb-2">{f.label}</label>
                        <input name={f.name} value={form[f.name as keyof typeof form]} onChange={handleChange} placeholder={f.placeholder}
                          className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/20 focus:outline-none transition" />
                      </div>
                    ))}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-white/35 mb-2">Investor Tier</label>
                    <select name="tier" value={form.tier} onChange={handleChange}
                      className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0C0C0C] px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none appearance-none">
                      <option value="">Select a tier</option>
                      {tiers.map((t) => <option key={t.name} value={t.name}>{t.name}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-white/35 mb-2">Message (optional)</label>
                    <textarea name="message" value={form.message} onChange={handleChange} rows={3} placeholder="Tell us about your investment focus and any specific questions…"
                      className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/20 focus:outline-none resize-none transition" />
                  </div>
                  <button type="submit"
                    className="group w-full inline-flex items-center justify-center gap-2 rounded-full py-4 text-sm font-semibold text-white shadow-lg transition-all hover:scale-[1.01]"
                    style={{ background: 'linear-gradient(135deg, #0d5730, #158040)', boxShadow: '0 8px 30px rgba(13,87,48,0.3)' }}
                  >
                    Register Interest
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </button>
                </form>
              )}
            </div>
          </AnimatedSection>

          {/* FAQs */}
          <AnimatedSection className="lg:col-span-2" direction="right">
            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Investor FAQs</h3>
              {faqs.map((faq, i) => (
                <details key={i} className="group rounded-2xl border border-black/8 dark:border-white/8 bg-black/[0.02] dark:bg-white/[0.02]">
                  <summary className="cursor-pointer list-none flex items-center justify-between p-4 text-sm font-medium text-gray-900 dark:text-white hover:text-green-600 dark:hover:text-green-400 transition">
                    {faq.q}
                    <span className="ml-2 text-gray-400 dark:text-white/30 group-open:text-green-500 dark:group-open:text-green-400 transition">+</span>
                  </summary>
                  <div className="px-4 pb-4 text-xs text-gray-500 dark:text-white/40 leading-relaxed border-t border-black/6 dark:border-white/6 pt-3">
                    {faq.a}
                  </div>
                </details>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </main>
  );
}
