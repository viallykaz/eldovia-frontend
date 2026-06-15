'use client';

import { motion } from 'framer-motion';
import { UserPlus, Search, Gavel, Truck, CheckCircle2, ArrowRight } from 'lucide-react';
import { AnimatedSection } from '@eldovia/ui';
import Link from 'next/link';

const buyerSteps = [
  { icon: UserPlus, title: 'Create Account', desc: 'Register and complete KYC verification in under 10 minutes. Access to all auctions unlocked immediately.' },
  { icon: Search, title: 'Browse & Inspect', desc: 'Filter by make, model, year, country, and price. Review full inspection reports and VIN history.' },
  { icon: Gavel, title: 'Place Your Bid', desc: 'Bid live in real-time or set a maximum auto-bid and let the system bid on your behalf.' },
  { icon: Truck, title: 'Receive Your Vehicle', desc: 'We handle customs documentation and coordinate door-to-door logistics to your location.' },
];

const sellerSteps = [
  { icon: UserPlus, title: 'Register as Seller', desc: 'Complete dealer verification. Individual sellers also welcome for single-vehicle listings.' },
  { icon: CheckCircle2, title: 'Submit for Inspection', desc: 'Our certified inspectors assess the vehicle and produce a detailed condition report.' },
  { icon: Gavel, title: 'Launch Your Auction', desc: 'Choose auction type (live or timed), set your reserve price, and go live in minutes.' },
  { icon: Truck, title: 'Get Paid', desc: 'Funds are released from escrow within 48 hours of successful vehicle handover.' },
];

export function HowItWorksSection() {
  return (
    <section className="relative py-28 bg-slate-50 dark:bg-[#040F20]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_20%_50%,rgba(249,115,22,0.04)_0%,transparent_60%)]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <AnimatedSection className="text-center mb-16">
          <p className="text-xs uppercase tracking-widest text-orange-400 mb-3">Simple Process</p>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            How it{' '}
            <span className="bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">
              works
            </span>
          </h2>
          <p className="mt-4 text-gray-500 dark:text-white/40 max-w-lg mx-auto text-sm leading-relaxed">
            Whether you&apos;re buying or selling, Eldovia Automobile makes every step clear, secure, and fast.
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Buyer */}
          <AnimatedSection direction="left">
            <div className="rounded-3xl border border-black/8 dark:border-white/8 bg-black/[0.02] dark:bg-white/[0.02] p-8">
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-blue-500/25 bg-blue-500/10 px-4 py-1.5 text-sm text-blue-500 dark:text-blue-300">
                <Gavel size={13} />
                For Buyers
              </div>
              <div className="space-y-6">
                {buyerSteps.map((step, i) => (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="shrink-0 flex flex-col items-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 border border-orange-500/20">
                        <step.icon size={18} className="text-orange-400" />
                      </div>
                      {i < buyerSteps.length - 1 && (
                        <div className="mt-2 w-px flex-1 bg-gradient-to-b from-orange-500/20 to-transparent min-h-[24px]" />
                      )}
                    </div>
                    <div className="pb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-orange-500/60">STEP {i + 1}</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{step.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-white/45 leading-relaxed">{step.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <Link
                href="/auctions"
                className="mt-6 group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-orange-500/25 hover:shadow-orange-500/40 transition-all duration-300"
              >
                Start Bidding
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </AnimatedSection>

          {/* Seller */}
          <AnimatedSection direction="right">
            <div className="rounded-3xl border border-black/8 dark:border-white/8 bg-black/[0.02] dark:bg-white/[0.02] p-8">
              <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-green-500/25 bg-green-500/10 px-4 py-1.5 text-sm text-green-600 dark:text-green-300">
                <CheckCircle2 size={13} />
                For Sellers
              </div>
              <div className="space-y-6">
                {sellerSteps.map((step, i) => (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-4"
                  >
                    <div className="shrink-0 flex flex-col items-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 border border-orange-500/20">
                        <step.icon size={18} className="text-orange-400" />
                      </div>
                      {i < sellerSteps.length - 1 && (
                        <div className="mt-2 w-px flex-1 bg-gradient-to-b from-orange-500/20 to-transparent min-h-[24px]" />
                      )}
                    </div>
                    <div className="pb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-orange-500/60">STEP {i + 1}</span>
                      </div>
                      <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{step.title}</h3>
                      <p className="text-sm text-gray-500 dark:text-white/45 leading-relaxed">{step.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <Link
                href="/sell"
                className="mt-6 group inline-flex items-center gap-2 rounded-full border border-black/15 dark:border-white/15 px-6 py-3 text-sm font-semibold text-gray-800 dark:text-white hover:bg-black/5 dark:hover:bg-white/5 hover:border-black/25 dark:hover:border-white/25 transition-all duration-300"
              >
                List a Vehicle
                <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
