'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Gavel, Car, Clock, TrendingUp } from 'lucide-react';
import { AnimatedSection } from '@eldovia/ui';

const liveAuctions = [
  { make: 'BMW', model: '5 Series', year: 2021, currentBid: 28500, endsIn: '2h 14m', bids: 17 },
  { make: 'Mercedes', model: 'C-Class', year: 2020, currentBid: 24200, endsIn: '45m', bids: 23 },
  { make: 'Toyota', model: 'Land Cruiser', year: 2019, currentBid: 41000, endsIn: '3h 02m', bids: 8 },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-white dark:bg-[#020B18]">
      {/* Background layers */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_30%_40%,rgba(15,41,82,0.08)_0%,transparent_70%)] dark:bg-[radial-gradient(ellipse_80%_60%_at_30%_40%,rgba(15,41,82,0.8)_0%,transparent_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_40%_at_80%_60%,rgba(249,115,22,0.07)_0%,transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
      </div>

      {/* Floating orbs */}
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 right-1/4 h-64 w-64 rounded-full bg-orange-500/5 blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ x: [0, -30, 0], y: [0, 40, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-1/3 left-1/5 h-80 w-80 rounded-full bg-blue-600/5 blur-3xl pointer-events-none"
      />

      <div className="relative mx-auto max-w-7xl px-6 pt-24 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <AnimatedSection>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-1.5 text-sm text-red-400 dark:text-red-300"
              >
                <span className="live-dot" />
                Live Auctions Running Now
              </motion.div>

              <h1 className="mb-6 text-5xl font-bold text-gray-900 dark:text-white sm:text-6xl lg:text-7xl leading-tight">
                Bid. Win.{' '}
                <span className="bg-gradient-to-r from-orange-500 via-amber-400 to-orange-300 bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                  Drive.
                </span>
              </h1>

              <p className="mb-10 text-lg text-gray-500 dark:text-white/50 leading-relaxed max-w-lg">
                Africa&apos;s premier cross-border vehicle auction marketplace. Transparent bidding, verified vehicles, and seamless logistics — all in one platform.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/auctions"
                  className="group inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 transition-all duration-300 hover:shadow-orange-500/50 hover:scale-[1.02]"
                >
                  <Gavel size={16} />
                  Browse Auctions
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/sell"
                  className="inline-flex items-center justify-center gap-2 rounded-full border border-black/15 dark:border-white/15 px-8 py-4 text-sm font-semibold text-gray-800 dark:text-white transition-all duration-300 hover:bg-black/5 dark:hover:bg-white/5 hover:border-black/25 dark:hover:border-white/25"
                >
                  <Car size={16} />
                  List Your Vehicle
                </Link>
              </div>

              {/* Trust badges */}
              <div className="mt-10 flex flex-wrap gap-6">
                {[
                  { label: '2,400+ Vehicles Auctioned' },
                  { label: 'VIN Verified' },
                  { label: '12 Countries' },
                ].map((b) => (
                  <div key={b.label} className="flex items-center gap-2 text-xs text-gray-400 dark:text-white/35">
                    <span className="h-1.5 w-1.5 rounded-full bg-orange-500/60" />
                    {b.label}
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>

          {/* Right: Live auction cards */}
          <AnimatedSection direction="right">
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <span className="live-dot" />
                <span className="text-xs font-semibold text-gray-400 dark:text-white/40 uppercase tracking-wider">Live Now</span>
              </div>
              {liveAuctions.map((auction, i) => (
                <motion.div
                  key={auction.model}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.15 }}
                  whileHover={{ scale: 1.01, y: -2 }}
                  className="group cursor-pointer rounded-2xl border border-black/8 dark:border-white/8 bg-black/[0.02] dark:bg-white/3 p-5 backdrop-blur-sm hover:border-orange-500/25 hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-500/20 to-amber-400/20 border border-orange-500/20">
                        <Car size={20} className="text-orange-400" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {auction.year} {auction.make} {auction.model}
                        </div>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-white/40">
                            <Clock size={10} />
                            {auction.endsIn}
                          </span>
                          <span className="text-xs text-gray-400 dark:text-white/30">{auction.bids} bids</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-gray-900 dark:text-white">
                        ${auction.currentBid.toLocaleString()}
                      </div>
                      <div className="text-xs text-orange-400">Current bid</div>
                    </div>
                  </div>
                </motion.div>
              ))}

              <Link
                href="/auctions"
                className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-black/12 dark:border-white/12 py-4 text-sm text-gray-400 dark:text-white/30 hover:text-gray-600 dark:hover:text-white/60 hover:border-black/20 dark:hover:border-white/20 transition"
              >
                View all auctions
                <ArrowRight size={14} />
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
