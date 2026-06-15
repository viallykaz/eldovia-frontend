'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Car, Clock, Gavel, Search, Zap, Timer, ChevronDown } from 'lucide-react';
import { AnimatedSection } from '@eldovia/ui';

type AuctionType = 'ALL' | 'LIVE' | 'TIMED';

const allAuctions = [
  { id: 'a1', type: 'LIVE' as const, make: 'BMW', model: '5 Series 530i', year: 2021, mileage: 42000, country: 'Germany', currentBid: 28500, bids: 17, endsIn: '2h 14m', condition: 'Excellent' },
  { id: 'a2', type: 'LIVE' as const, make: 'Mercedes-Benz', model: 'C 220d AMG Line', year: 2020, mileage: 58000, country: 'Netherlands', currentBid: 24200, bids: 23, endsIn: '45m', condition: 'Very Good' },
  { id: 'a3', type: 'TIMED' as const, make: 'Toyota', model: 'Land Cruiser 200', year: 2019, mileage: 78000, country: 'Japan', currentBid: 41000, bids: 8, endsIn: '3h 02m', condition: 'Good' },
  { id: 'a4', type: 'TIMED' as const, make: 'Audi', model: 'A6 Avant 40 TDI', year: 2022, mileage: 31000, country: 'Belgium', currentBid: 33800, bids: 11, endsIn: '1d 6h', condition: 'Excellent' },
  { id: 'a5', type: 'TIMED' as const, make: 'Volkswagen', model: 'Tiguan R-Line', year: 2021, mileage: 44000, country: 'France', currentBid: 21500, bids: 14, endsIn: '5h 30m', condition: 'Very Good' },
  { id: 'a6', type: 'LIVE' as const, make: 'Porsche', model: 'Cayenne S', year: 2020, mileage: 35000, country: 'Switzerland', currentBid: 62000, bids: 6, endsIn: '1h 18m', condition: 'Excellent' },
  { id: 'a7', type: 'TIMED' as const, make: 'Honda', model: 'CR-V 2.0 AWD', year: 2022, mileage: 22000, country: 'Japan', currentBid: 19800, bids: 19, endsIn: '2d 4h', condition: 'Excellent' },
  { id: 'a8', type: 'TIMED' as const, make: 'Ford', model: 'Ranger Wildtrak', year: 2021, mileage: 51000, country: 'South Africa', currentBid: 16500, bids: 7, endsIn: '12h 20m', condition: 'Good' },
  { id: 'a9', type: 'LIVE' as const, make: 'Lexus', model: 'RX 350 F Sport', year: 2021, mileage: 38000, country: 'UAE', currentBid: 45000, bids: 12, endsIn: '3h 45m', condition: 'Excellent' },
];

export default function AuctionsPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<AuctionType>('ALL');
  const [sortBy, setSortBy] = useState('ending-soon');

  const filtered = allAuctions
    .filter((a) => {
      const q = search.toLowerCase();
      const matchesSearch = !q || `${a.make} ${a.model} ${a.year} ${a.country}`.toLowerCase().includes(q);
      const matchesType = typeFilter === 'ALL' || a.type === typeFilter;
      return matchesSearch && matchesType;
    });

  return (
    <main className="bg-white dark:bg-[#020B18] min-h-screen pt-24">
      <div className="mx-auto max-w-7xl px-6 pb-20">
        {/* Header */}
        <AnimatedSection className="mb-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-orange-400 mb-2">All Auctions</p>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
                Browse{' '}
                <span className="bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">
                  vehicles
                </span>
              </h1>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-400 dark:text-white/30">
              <span className="live-dot" />
              <span>{filtered.filter((a) => a.type === 'LIVE').length} live auctions running now</span>
            </div>
          </div>
        </AnimatedSection>

        {/* Filters */}
        <div className="mb-8 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/25" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search make, model, country…"
              className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 pl-10 pr-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/20 focus:border-orange-500/40 focus:outline-none focus:ring-1 focus:ring-orange-500/20 transition"
            />
          </div>

          <div className="flex items-center gap-2">
            {(['ALL', 'LIVE', 'TIMED'] as AuctionType[]).map((t) => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  typeFilter === t
                    ? 'bg-orange-500/15 border border-orange-500/30 text-orange-500 dark:text-orange-300'
                    : 'border border-black/10 dark:border-white/10 text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white/70 hover:border-black/20 dark:hover:border-white/20'
                }`}
              >
                {t === 'LIVE' && <span className="inline-block h-1.5 w-1.5 rounded-full bg-red-400 mr-1.5 align-middle animate-pulse" />}
                {t === 'ALL' ? 'All Types' : t.charAt(0) + t.slice(1).toLowerCase()}
              </button>
            ))}

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#020B18] pl-4 pr-8 py-2.5 text-sm text-gray-500 dark:text-white/50 focus:outline-none focus:border-black/20 dark:focus:border-white/20"
              >
                <option value="ending-soon">Ending Soon</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low</option>
                <option value="price-high">Price: High</option>
                <option value="most-bids">Most Bids</option>
              </select>
              <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-white/30 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((auction, i) => (
            <AnimatedSection key={auction.id} delay={i * 0.06}>
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.25 }}
                className="group rounded-3xl border border-black/8 dark:border-white/8 bg-black/[0.02] dark:bg-white/[0.02] overflow-hidden hover:border-orange-500/20 transition-all duration-300"
              >
                <div className="relative h-44 bg-gradient-to-br from-[#071628] to-[#0B1E3A] overflow-hidden">
                  <div className="absolute inset-0 flex items-center justify-center opacity-10">
                    <Car size={80} className="text-white" />
                  </div>

                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${
                      auction.type === 'LIVE'
                        ? 'bg-red-500/15 border-red-500/30 text-red-300'
                        : 'bg-blue-500/15 border-blue-500/30 text-blue-300'
                    }`}>
                      {auction.type === 'LIVE' ? (
                        <><span className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" /><Zap size={10} /></>
                      ) : (
                        <Timer size={10} />
                      )}
                      {auction.type}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center gap-1 rounded-xl border border-white/15 bg-black/40 backdrop-blur-sm px-2.5 py-1 text-xs text-white/70">
                      <Clock size={10} />
                      {auction.endsIn}
                    </span>
                  </div>

                  <div className="absolute bottom-3 right-3">
                    <span className="rounded-xl border border-white/15 bg-black/40 backdrop-blur-sm px-2.5 py-1 text-[10px] text-white/50">
                      {auction.country}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                    {auction.year} {auction.make} {auction.model}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-white/35 mb-4">
                    <span>{auction.mileage.toLocaleString()} km</span>
                    <span>·</span>
                    <span>{auction.condition}</span>
                    <span>·</span>
                    <span>{auction.bids} bids</span>
                  </div>
                  <div className="flex items-end justify-between">
                    <div>
                      <div className="text-xs text-gray-400 dark:text-white/30 mb-0.5">Current bid</div>
                      <div className="text-xl font-bold text-gray-900 dark:text-white">${auction.currentBid.toLocaleString()}</div>
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
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="py-24 text-center text-gray-400 dark:text-white/30">
            <Car size={40} className="mx-auto mb-4 opacity-20" />
            <p>No auctions match your search.</p>
          </div>
        )}
      </div>
    </main>
  );
}
