'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Send, ArrowRight, Linkedin, Twitter } from 'lucide-react';
import { AnimatedSection } from '@eldovia/ui';

const inquiryTypes = [
  { value: 'investor', label: 'Investor Relations' },
  { value: 'partnership', label: 'Strategic Partnership' },
  { value: 'enterprise', label: 'Enterprise / B2B' },
  { value: 'media', label: 'Media & Press' },
  { value: 'careers', label: 'Careers' },
  { value: 'other', label: 'General Enquiry' },
];

const offices = [
  {
    city: 'Luxembourg City',
    role: 'Group Headquarters',
    address: '2 Place de Metz, L-1930 Luxembourg',
    phone: '+352 123 456 789',
    email: 'group@eldovia.com',
  },
  {
    city: 'Nairobi',
    role: 'Africa Operations Hub',
    address: 'Westlands Business Park, Nairobi, Kenya',
    phone: '+254 700 123 456',
    email: 'africa@eldovia.com',
  },
  {
    city: 'Amsterdam',
    role: 'European Automobile Hub',
    address: 'Strawinskylaan 3051, 1077 ZX Amsterdam',
    phone: '+31 20 123 4567',
    email: 'automobile@eldovia.com',
  },
];

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    company: '',
    inquiryType: '',
    message: '',
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

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
              <Mail size={13} />
              Let&apos;s Talk
            </motion.div>

            <h1 className="mb-6 text-5xl font-bold text-gray-900 dark:text-white sm:text-6xl leading-tight">
              Start a{' '}
              <span className="bg-gradient-to-r from-orange-500 via-amber-400 to-orange-300 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                conversation
              </span>
            </h1>

            <p className="text-lg text-gray-500 dark:text-white/50 max-w-xl mx-auto leading-relaxed">
              Whether you&apos;re exploring investment opportunities, partnership structures, or simply want to learn more — our team responds within one business day.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Form + Info */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Form */}
            <AnimatedSection className="lg:col-span-3" direction="left">
              <div className="rounded-3xl border border-black/8 dark:border-white/8 bg-black/[0.02] dark:bg-white/3 p-8 sm:p-10">
                {submitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-12"
                  >
                    <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-500/15 border border-green-500/30">
                      <Send size={28} className="text-green-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Message received</h3>
                    <p className="text-gray-500 dark:text-white/45 text-sm">
                      Thank you for reaching out. A member of our team will be in touch within one business day.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 dark:text-white/50 mb-2 uppercase tracking-wider">
                          Full Name *
                        </label>
                        <input
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          required
                          placeholder="Jane Smith"
                          className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/20 focus:border-orange-500/50 focus:outline-none focus:ring-1 focus:ring-orange-500/30 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 dark:text-white/50 mb-2 uppercase tracking-wider">
                          Email Address *
                        </label>
                        <input
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={handleChange}
                          required
                          placeholder="jane@company.com"
                          className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/20 focus:border-orange-500/50 focus:outline-none focus:ring-1 focus:ring-orange-500/30 transition"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 dark:text-white/50 mb-2 uppercase tracking-wider">
                          Company / Organisation
                        </label>
                        <input
                          name="company"
                          value={form.company}
                          onChange={handleChange}
                          placeholder="Acme Corp"
                          className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/20 focus:border-orange-500/50 focus:outline-none focus:ring-1 focus:ring-orange-500/30 transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 dark:text-white/50 mb-2 uppercase tracking-wider">
                          Enquiry Type *
                        </label>
                        <select
                          name="inquiryType"
                          value={form.inquiryType}
                          onChange={handleChange}
                          required
                          className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#030A14] px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-orange-500/50 focus:outline-none focus:ring-1 focus:ring-orange-500/30 transition appearance-none"
                        >
                          <option value="" disabled>Select a type</option>
                          {inquiryTypes.map((t) => (
                            <option key={t.value} value={t.value}>{t.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-500 dark:text-white/50 mb-2 uppercase tracking-wider">
                        Message *
                      </label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        placeholder="Tell us about your interest, timeline, and any specific questions…"
                        className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/20 focus:border-orange-500/50 focus:outline-none focus:ring-1 focus:ring-orange-500/30 transition resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="group w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 transition-all duration-300 hover:shadow-orange-500/50 hover:scale-[1.01]"
                    >
                      Send Message
                      <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                    </button>
                  </form>
                )}
              </div>
            </AnimatedSection>

            {/* Info */}
            <div className="lg:col-span-2 space-y-8">
              <AnimatedSection direction="right">
                <div>
                  <p className="text-xs uppercase tracking-widest text-orange-400 mb-4">Our Offices</p>
                  <div className="space-y-5">
                    {offices.map((o, i) => (
                      <motion.div
                        key={o.city}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="rounded-2xl border border-black/8 dark:border-white/8 bg-black/[0.02] dark:bg-white/3 p-5"
                      >
                        <div className="font-semibold text-gray-900 dark:text-white mb-0.5">{o.city}</div>
                        <div className="text-xs text-orange-400 mb-3">{o.role}</div>
                        <div className="space-y-2 text-xs text-gray-500 dark:text-white/45">
                          <div className="flex items-start gap-2">
                            <MapPin size={12} className="shrink-0 mt-0.5 text-gray-400 dark:text-white/25" />
                            {o.address}
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone size={12} className="shrink-0 text-gray-400 dark:text-white/25" />
                            {o.phone}
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail size={12} className="shrink-0 text-gray-400 dark:text-white/25" />
                            {o.email}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </AnimatedSection>

              <AnimatedSection direction="right" delay={0.2}>
                <div className="rounded-2xl border border-black/8 dark:border-white/8 bg-black/[0.02] dark:bg-white/3 p-6">
                  <p className="text-xs uppercase tracking-widest text-gray-400 dark:text-white/30 mb-4">Follow Us</p>
                  <div className="flex gap-3">
                    {[
                      { icon: Linkedin, label: 'LinkedIn' },
                      { icon: Twitter, label: 'Twitter / X' },
                    ].map(({ icon: Icon, label }) => (
                      <button
                        key={label}
                        className="flex items-center gap-2 rounded-full border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/3 px-4 py-2 text-xs text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-white hover:border-black/20 dark:hover:border-white/20 transition"
                      >
                        <Icon size={13} />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
