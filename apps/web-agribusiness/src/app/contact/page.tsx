'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, ArrowRight, Send } from 'lucide-react';
import { AnimatedSection } from '@eldovia/ui';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', company: '', type: '', message: '' });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  return (
    <main className="bg-white dark:bg-[#0C0C0C] min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-5xl px-6">
        <AnimatedSection className="text-center mb-14">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-5 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm"
            style={{ borderColor: 'rgba(13,87,48,0.4)', background: 'rgba(13,87,48,0.1)', color: '#16a34a' }}
          >
            <Mail size={13} />
            Get in Touch
          </motion.div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Start a{' '}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(90deg, #22c55e, #4ade80)' }}>
              conversation
            </span>
          </h1>
          <p className="text-gray-500 dark:text-white/45 max-w-md mx-auto">Whether you&apos;re an investor, partner, or farmer — our team responds within one business day.</p>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <AnimatedSection className="lg:col-span-3" direction="left">
            <div className="rounded-3xl border border-black/8 dark:border-white/8 bg-black/[0.02] dark:bg-white/[0.02] p-8">
              {submitted ? (
                <div className="text-center py-12">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full" style={{ background: 'rgba(13,87,48,0.15)', border: '1px solid rgba(13,87,48,0.3)' }}>
                    <Send size={28} style={{ color: '#22c55e' }} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Message sent</h3>
                  <p className="text-sm text-gray-500 dark:text-white/45">We&apos;ll be in touch within one business day.</p>
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-white/35 mb-2">Full Name *</label>
                      <input name="name" value={form.name} onChange={handleChange} required placeholder="Jane Smith"
                        className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/20 focus:outline-none transition" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-white/35 mb-2">Email *</label>
                      <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="jane@fund.com"
                        className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/20 focus:outline-none transition" />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-white/35 mb-2">Organisation</label>
                      <input name="company" value={form.company} onChange={handleChange} placeholder="Your organisation"
                        className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/20 focus:outline-none transition" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-white/35 mb-2">Enquiry Type *</label>
                      <select name="type" value={form.type} onChange={handleChange} required
                        className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#0C0C0C] px-4 py-3 text-sm text-gray-900 dark:text-white focus:outline-none appearance-none">
                        <option value="">Select</option>
                        <option value="investor">Investor Enquiry</option>
                        <option value="partnership">Partnership</option>
                        <option value="farmer">Farmer Cooperative</option>
                        <option value="media">Media & Press</option>
                        <option value="other">General</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-white/35 mb-2">Message *</label>
                    <textarea name="message" value={form.message} onChange={handleChange} required rows={5}
                      placeholder="Tell us about your interest and any specific questions…"
                      className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/20 focus:outline-none resize-none transition" />
                  </div>
                  <button type="submit"
                    className="group w-full inline-flex items-center justify-center gap-2 rounded-full py-4 text-sm font-semibold text-white shadow-lg transition-all hover:scale-[1.01]"
                    style={{ background: 'linear-gradient(135deg, #0d5730, #158040)', boxShadow: '0 8px 30px rgba(13,87,48,0.3)' }}
                  >
                    Send Message
                    <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                  </button>
                </form>
              )}
            </div>
          </AnimatedSection>

          <AnimatedSection className="lg:col-span-2" direction="right">
            <div className="space-y-4">
              {[
                { city: 'Luxembourg City', role: 'Group HQ', address: '2 Place de Metz, L-1930', phone: '+352 123 456 789', email: 'agri@eldovia.com' },
                { city: 'Nairobi', role: 'Africa Hub', address: 'Westlands Business Park', phone: '+254 700 123 456', email: 'kenya@eldovia.com' },
              ].map((o) => (
                <div key={o.city} className="rounded-2xl border border-black/8 dark:border-white/8 bg-black/[0.02] dark:bg-white/[0.02] p-5">
                  <div className="font-semibold text-gray-900 dark:text-white mb-0.5">{o.city}</div>
                  <div className="text-xs mb-3" style={{ color: '#22c55e' }}>{o.role}</div>
                  <div className="space-y-1.5 text-xs text-gray-500 dark:text-white/40">
                    <div className="flex items-start gap-2"><MapPin size={11} className="mt-0.5 shrink-0" />{o.address}</div>
                    <div className="flex items-center gap-2"><Phone size={11} className="shrink-0" />{o.phone}</div>
                    <div className="flex items-center gap-2"><Mail size={11} className="shrink-0" />{o.email}</div>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </div>
    </main>
  );
}
