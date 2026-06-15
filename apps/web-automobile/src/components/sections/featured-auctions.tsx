'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Car, Clock, Gavel, ArrowRight, Zap, Timer } from 'lucide-react';
import { AnimatedSection } from '@eldovia/ui';

type AuctionType = 'LIVE' | 'TIMED';

const auctions: {
  id: string;
  type: AuctionType;
  make: string;
  model: string;
  year: number;
  mileage: number;
  country: string;
  currentBid: number;
  startingPrice: number;
  bids: number;
  endsIn: string;
  features: string[];
  condition: string;
}[] = [
  {
    id: 'a1',
    type: 'LIVE',
    make: 'BMW',
    model: '5 Series 530i',
    year: 2021,
    mileage: 42000,
    country: 'Germany',
    currentBid: 28500,
    startingPrice: 22000,
    bids: 17,
    endsIn: '2h 14m',
    features: ['Sunroof', 'Navigation', 'Heated Seats'],
    condition: 'Excellent',
  },
  {
    id: 'a2',
    type: 'LIVE',
    make: 'Mercedes-Benz',
    model: 'C 220d AMG Line',
    year: 2020,
    mileage: 58000,
    country: 'Netherlands',
    currentBid: 24200,
    startingPrice: 18000,
    bids: 23,
    endsIn: '45m',
    features: ['Leather Interior', 'MBUX', 'LED Lights'],
    condition: 'Very Good',
  },
  {
    id: 'a3',
    type: 'TIMED',
    make: 'Toyota',
    model: 'Land Cruiser 200',
    year: 2019,
    mileage: 78000,
    country: 'Japan',
    currentBid: 41000,
    startingPrice: 35000,
    bids: 8,
    endsIn: '3h 02m',
    features: ['4WD', '7 Seats', 'Air Suspension'],
    condition: 'Good',
  },
  {
    id: 'a4',
    type: 'TIMED',
    make: 'Audi',
    model: 'A6 Avant 40 TDI',
    year: 2022,
    mileage: 31000,
    country: 'Belgium',
    currentBid: 33800,
    startingPrice: 28000,
    bids: 11,
    endsIn: '1d 6h',
    features: ['Quattro', 'Virtual Cockpit', 'Bang & Olufsen'],
    condition: 'Excellent',
  },
  {
    id: 'a5',
    type: 'TIMED',
    make: 'Volkswagen',
    model: 'Tiguan R-Line',
    year: 2021,
    mileage: 44000,
    country: 'France',
    currentBid: 21500,
    startingPrice: 17000,
    bids: 14,
    endsIn: '5h 30m',
    features: ['Panoramic Roof', 'Digital Dash', 'App Connect'],
    condition: 'Very Good',
  },
  {
    id: 'a6',
    type: 'LIVE',
    make: 'Porsche',
    model: 'Cayenne S',
    year: 2020,
    mileage: 35000,
    country: 'Switzerland',
    currentBid: 62000,
    startingPrice: 55000,
    bids: 6,
    endsIn: '1h 18m',
    features: ['Air Suspension', 'PRTV', 'Sport Chrono'],
    condition: 'Excellent',
  },
];

const typeBadge: Record<AuctionType, { label: string; className: string; icon: typeof Zap }> = {
  LIVE: { label: 'Live', className: 'bg-red-500/15 border-red-500/30 text-red-300', icon: Zap },
  TIMED: { label: 'Timed', className: 'bg-blue-500/15 border-blue-500/30 text-blue-300', icon: Timer },
};

export function FeaturedAuctionsSection() {
  return (
    <section className="relative py-28 bg-white dark:bg-[#020B18]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_50%_30%_at_80%_50%,rgba(249,115,22,0.04)_0%,transparent_60%)]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <AnimatedSection className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
          <div>
            <p className="text-xs uppercase tracking-widest text-orange-400 mb-2">Active Auctions</p>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
              Bid on{' '}
              <span className="bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">
                top vehicles
              </span>
            </h2>
          </div>
          <Link
            href="/auctions"
            className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-white transition"
          >
            View all auctions
            <ArrowRight size={14} />
          </Link>
        </AnimatedSection>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {auctions.map((auction, i) => {
            const badge = typeBadge[auction.type];
            const BadgeIcon = badge.icon;
            return (
              <AnimatedSection key={auction.id} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.25 }}
                  className="group rounded-3xl border border-black/8 dark:border-white/8 bg-black/[0.02] dark:bg-white/[0.02] overflow-hidden hover:border-orange-500/20 transition-all duration-300"
                >
                  {/* Vehicle visual placeholder */}
                  <div className="relative h-44 bg-gradient-to-br from-[#071628] to-[#0B1E3A] overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
                        className="opacity-15"
                      >
                        <Car size={80} className="text-white" />
                      </motion.div>
                    </div>

                    <div className="absolute top-3 left-3">
                      <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${badge.className}`}>
                        {auction.type === 'LIVE' && <span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />}
                        <BadgeIcon size={10} />
                        {badge.label}
                      </span>
                    </div>

                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center gap-1 rounded-xl border border-white/15 bg-black/40 backdrop-blur-sm px-2.5 py-1 text-xs text-white/70">
                        <Clock size={10} />
                        {auction.endsIn}
                      </span>
                    </div>

                    <div className="absolute bottom-3 left-3">
                      <span className="rounded-full border border-white/15 bg-black/40 backdrop-blur-sm px-2.5 py-1 text-[10px] text-white/50">
                        {auction.country}
                      </span>
                    </div>
                  </div>

                  {/* Card content */}
                  <div className="p-5">
                    <div className="mb-3">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        {auction.year} {auction.make} {auction.model}
                      </h3>
                      <div className="flex items-center gap-3 mt-1 text-xs text-gray-400 dark:text-white/35">
                        <span>{auction.mileage.toLocaleString()} km</span>
                        <span>·</span>
                        <span>{auction.condition}</span>
                        <span>·</span>
                        <span>{auction.bids} bids</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {auction.features.slice(0, 3).map((f) => (
                        <span key={f} className="rounded-full border border-black/8 dark:border-white/8 bg-black/[0.02] dark:bg-white/3 px-2 py-0.5 text-[10px] text-gray-500 dark:text-white/40">
                          {f}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-end justify-between">
                      <div>
                        <div className="text-xs text-gray-400 dark:text-white/30 mb-0.5">Current bid</div>
                        <div className="text-xl font-bold text-gray-900 dark:text-white">
                          ${auction.currentBid.toLocaleString()}
                        </div>
                      </div>
                      <Link
                        href={`/auctions/${auction.id}`}
                        className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.03] transition-all duration-300"
                      >
                        <Gavel size={12} />
                        Bid Now
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}
