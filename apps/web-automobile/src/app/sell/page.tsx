'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Car, CheckCircle2, ArrowRight, Upload, Gavel, Clock, DollarSign } from 'lucide-react';
import { AnimatedSection } from '@eldovia/ui';

const steps = [
  { icon: Upload, title: 'Submit Vehicle', desc: 'Fill in your vehicle details and upload photos. Our team reviews within 24 hours.' },
  { icon: CheckCircle2, title: 'Pass Inspection', desc: 'A certified inspector verifies the vehicle and produces a full condition report.' },
  { icon: Gavel, title: 'Set & Launch Auction', desc: 'Choose live or timed auction, set your reserve price, and go live.' },
  { icon: DollarSign, title: 'Get Paid', desc: 'Funds released from escrow within 48 hours of confirmed handover.' },
];

const auctionTypes = [
  {
    id: 'live',
    icon: Gavel,
    title: 'Live Auction',
    desc: 'Real-time competitive bidding with a countdown timer. Ideal for high-demand vehicles. Maximum exposure in a short window.',
    badge: 'Most Popular',
    badgeColor: 'bg-orange-500/15 border-orange-500/30 text-orange-300',
    pros: ['Maximum price discovery', 'Urgency drives bidding', 'Typically 1-2 hour sessions'],
  },
  {
    id: 'timed',
    icon: Clock,
    title: 'Timed Auction',
    desc: 'Bidding open for 24–72 hours. Buyers can research thoroughly before bidding. Great for specialist vehicles.',
    badge: 'Best for Rare Vehicles',
    badgeColor: 'bg-blue-500/15 border-blue-500/30 text-blue-300',
    pros: ['Wider buyer pool', 'More time for due diligence', 'Flexible scheduling'],
  },
];

export default function SellPage() {
  const [selectedType, setSelectedType] = useState<'live' | 'timed'>('live');
  const [form, setForm] = useState({
    make: '', model: '', year: '', mileage: '', vin: '', country: '', reserve: '', description: '',
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  return (
    <main className="bg-white dark:bg-[#020B18] min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-6xl px-6">
        {/* Hero */}
        <AnimatedSection className="mb-14 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-500/25 bg-orange-500/8 px-4 py-1.5 text-sm text-orange-500 dark:text-orange-300"
          >
            <Car size={13} />
            Sell Your Vehicle
          </motion.div>

          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">
            List a vehicle.{' '}
            <span className="bg-gradient-to-r from-orange-500 via-amber-400 to-orange-300 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
              Get top dollar.
            </span>
          </h1>
          <p className="text-gray-500 dark:text-white/45 max-w-xl mx-auto leading-relaxed">
            Access 850+ verified buyers across 12 countries. Our transparent auction process consistently achieves 15–25% above private sale prices.
          </p>
        </AnimatedSection>

        {/* How it works */}
        <div className="mb-16 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {steps.map((s, i) => (
            <AnimatedSection key={s.title} delay={i * 0.08}>
              <div className="text-center">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-500/10 border border-orange-500/20">
                  <s.icon size={20} className="text-orange-400" />
                </div>
                <div className="text-xs font-bold text-orange-500/50 mb-1">Step {i + 1}</div>
                <div className="text-sm font-semibold text-gray-900 dark:text-white mb-1">{s.title}</div>
                <p className="text-xs text-gray-400 dark:text-white/35 leading-relaxed">{s.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Form */}
          <AnimatedSection className="lg:col-span-3" direction="left">
            <div className="rounded-3xl border border-black/8 dark:border-white/8 bg-black/[0.02] dark:bg-white/[0.02] p-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Vehicle Details</h2>

              <div className="grid grid-cols-2 gap-4 mb-4">
                {[
                  { name: 'make', label: 'Make', placeholder: 'BMW' },
                  { name: 'model', label: 'Model', placeholder: '5 Series' },
                  { name: 'year', label: 'Year', placeholder: '2021' },
                  { name: 'mileage', label: 'Mileage (km)', placeholder: '42000' },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-white/40 mb-2">
                      {field.label}
                    </label>
                    <input
                      name={field.name}
                      value={form[field.name as keyof typeof form]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/20 focus:border-orange-500/40 focus:outline-none focus:ring-1 focus:ring-orange-500/20 transition"
                    />
                  </div>
                ))}
              </div>

              <div className="mb-4">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-white/40 mb-2">VIN Number</label>
                <input
                  name="vin"
                  value={form.vin}
                  onChange={handleChange}
                  placeholder="17-character VIN"
                  className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/20 focus:border-orange-500/40 focus:outline-none focus:ring-1 focus:ring-orange-500/20 transition"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-white/40 mb-2">Country</label>
                  <select
                    name="country"
                    value={form.country}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#020B18] px-4 py-3 text-sm text-gray-900 dark:text-white focus:border-orange-500/40 focus:outline-none transition appearance-none"
                  >
                    <option value="">Select country</option>
                    {['Germany', 'Netherlands', 'France', 'Belgium', 'Switzerland', 'Japan', 'South Africa', 'UAE'].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-white/40 mb-2">Reserve Price (USD)</label>
                  <input
                    name="reserve"
                    type="number"
                    value={form.reserve}
                    onChange={handleChange}
                    placeholder="25000"
                    className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/20 focus:border-orange-500/40 focus:outline-none focus:ring-1 focus:ring-orange-500/20 transition"
                  />
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-white/40 mb-2">Description</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Service history, recent work, additional features…"
                  className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/20 focus:border-orange-500/40 focus:outline-none focus:ring-1 focus:ring-orange-500/20 transition resize-none"
                />
              </div>

              <div className="mb-6">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-white/40 mb-3">Auction Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {auctionTypes.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setSelectedType(t.id as 'live' | 'timed')}
                      className={`rounded-xl border p-4 text-left transition-all ${
                        selectedType === t.id
                          ? 'border-orange-500/40 bg-orange-500/8'
                          : 'border-black/8 dark:border-white/8 bg-black/[0.02] dark:bg-white/3 hover:border-black/15 dark:hover:border-white/15'
                      }`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <t.icon size={14} className={selectedType === t.id ? 'text-orange-400' : 'text-gray-400 dark:text-white/40'} />
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{t.title}</span>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-white/35 leading-relaxed">{t.desc.slice(0, 60)}…</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Photo upload */}
              <div className="mb-8">
                <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-white/40 mb-3">Photos</label>
                <div className="rounded-xl border-2 border-dashed border-black/10 dark:border-white/10 p-8 text-center hover:border-orange-500/30 transition cursor-pointer">
                  <Upload size={24} className="mx-auto mb-2 text-gray-300 dark:text-white/20" />
                  <p className="text-sm text-gray-400 dark:text-white/30">Drop photos here or click to upload</p>
                  <p className="text-xs text-gray-300 dark:text-white/20 mt-1">Minimum 6 photos required · JPEG, PNG · Max 10MB each</p>
                </div>
              </div>

              <button className="group w-full inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-[1.01] transition-all duration-300">
                Submit for Review
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </AnimatedSection>

          {/* Sidebar */}
          <AnimatedSection className="lg:col-span-2" direction="right">
            <div className="space-y-5 sticky top-24">
              <div className="rounded-3xl border border-orange-500/15 bg-orange-500/5 p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Why sell with Eldovia?</h3>
                <div className="space-y-3">
                  {[
                    { v: '850+ Buyers', d: 'Verified dealers and fleet buyers in 12 countries' },
                    { v: '+15-25%', d: 'Average premium vs. private sale price' },
                    { v: '48h', d: 'Payment released after confirmed handover' },
                    { v: '0 disputes', d: 'Escrow-protected payments, every transaction' },
                  ].map((item) => (
                    <div key={item.v} className="flex gap-3">
                      <div className="text-orange-400 font-bold text-sm w-20 shrink-0">{item.v}</div>
                      <div className="text-xs text-gray-500 dark:text-white/45 leading-relaxed">{item.d}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-3xl border border-black/8 dark:border-white/8 bg-black/[0.02] dark:bg-white/3 p-6">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Seller Fees</h3>
                <div className="space-y-2 text-sm">
                  {[
                    { label: 'Listing fee', value: 'Free' },
                    { label: 'Inspection fee', value: '$150 – $300' },
                    { label: 'Success fee', value: '2.5% of final sale' },
                    { label: 'Logistics (optional)', value: 'From $200' },
                  ].map((fee) => (
                    <div key={fee.label} className="flex justify-between">
                      <span className="text-gray-500 dark:text-white/40">{fee.label}</span>
                      <span className="text-gray-700 dark:text-white/70 font-medium">{fee.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </main>
  );
}
