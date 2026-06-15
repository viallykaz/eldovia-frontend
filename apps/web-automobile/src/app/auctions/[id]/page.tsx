'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
  Car, Clock, Gavel, ArrowLeft, CheckCircle2, Shield, Truck,
  TrendingUp, Users, Eye, Heart, Share2, AlertCircle
} from 'lucide-react';
import { AnimatedSection } from '@eldovia/ui';

const mockAuction = {
  id: 'a1',
  type: 'LIVE' as const,
  make: 'BMW',
  model: '5 Series 530i',
  year: 2021,
  mileage: 42000,
  country: 'Germany',
  city: 'Munich',
  color: 'Mineral White',
  transmission: 'Automatic',
  fuelType: 'Petrol',
  engine: '2.0L TwinPower Turbo',
  power: '252 hp',
  vin: 'WBAJB9C52GG842619',
  condition: 'Excellent',
  startingPrice: 22000,
  currentBid: 28500,
  bidIncrement: 200,
  reserveMet: true,
  bids: 17,
  watchers: 43,
  endsIn: { h: 2, m: 14, s: 33 },
  features: ['Panoramic Sunroof', 'Navigation Pro', 'Heated Seats', 'Harman Kardon Audio', 'Parking Assistant', 'LED Headlights', 'Adaptive Cruise Control', 'Apple CarPlay'],
  bidHistory: [
    { bidder: 'B***7', amount: 28500, time: '2 min ago' },
    { bidder: 'M***4', amount: 28300, time: '5 min ago' },
    { bidder: 'K***9', amount: 28100, time: '8 min ago' },
    { bidder: 'B***7', amount: 27800, time: '12 min ago' },
    { bidder: 'A***2', amount: 27500, time: '18 min ago' },
  ],
};

export default function AuctionDetailPage({ params }: { params: { id: string } }) {
  const auction = mockAuction;
  const [timeLeft, setTimeLeft] = useState({ h: 2, m: 14, s: 33 });
  const [currentBid, setCurrentBid] = useState(auction.currentBid);
  const [bidCount, setBidCount] = useState(auction.bids);
  const [bidInput, setBidInput] = useState('');
  const [bidFlash, setBidFlash] = useState(false);
  const [newBid, setNewBid] = useState<number | null>(null);
  const [watchlisted, setWatchlisted] = useState(false);

  // Countdown timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.s > 0) return { ...prev, s: prev.s - 1 };
        if (prev.m > 0) return { ...prev, m: prev.m - 1, s: 59 };
        if (prev.h > 0) return { h: prev.h - 1, m: 59, s: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // Simulate incoming bids
  useEffect(() => {
    const timeout = setTimeout(() => {
      const bid = currentBid + 200;
      setCurrentBid(bid);
      setBidCount((c) => c + 1);
      setNewBid(bid);
      setBidFlash(true);
      setTimeout(() => setBidFlash(false), 500);
      setTimeout(() => setNewBid(null), 3000);
    }, 8000);
    return () => clearTimeout(timeout);
  }, [currentBid]);

  const minBid = currentBid + auction.bidIncrement;

  function handlePlaceBid() {
    const amount = parseFloat(bidInput);
    if (isNaN(amount) || amount < minBid) return;
    setCurrentBid(amount);
    setBidCount((c) => c + 1);
    setBidFlash(true);
    setBidInput('');
    setTimeout(() => setBidFlash(false), 500);
  }

  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <main className="bg-white dark:bg-[#020B18] min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-6">
        <AnimatedSection>
          <Link
            href="/auctions"
            className="mb-8 inline-flex items-center gap-2 text-sm text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white transition"
          >
            <ArrowLeft size={14} />
            Back to Auctions
          </Link>
        </AnimatedSection>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: vehicle info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Vehicle card */}
            <AnimatedSection direction="left">
              <div className="rounded-3xl border border-black/8 dark:border-white/8 bg-black/[0.02] dark:bg-white/[0.02] overflow-hidden">
                {/* Image placeholder */}
                <div className="relative h-64 sm:h-80 bg-gradient-to-br from-[#071628] to-[#0F2952] flex items-center justify-center">
                  <div className="absolute inset-0 opacity-[0.03]"
                    style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
                  <motion.div
                    animate={{ y: [0, -8, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                    className="opacity-20"
                  >
                    <Car size={120} className="text-white" />
                  </motion.div>

                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-red-500/30 bg-red-500/15 px-3 py-1.5 text-sm font-semibold text-red-300">
                      <span className="h-2 w-2 rounded-full bg-red-400 animate-pulse" />
                      LIVE
                    </span>
                  </div>

                  <div className="absolute top-4 right-4 flex items-center gap-2">
                    <button
                      onClick={() => setWatchlisted(!watchlisted)}
                      className={`flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-sm transition-all ${watchlisted ? 'border-red-400/40 bg-red-500/20 text-red-400' : 'border-white/15 bg-black/30 text-white/50 hover:text-white'}`}
                    >
                      <Heart size={15} fill={watchlisted ? 'currentColor' : 'none'} />
                    </button>
                    <button className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/30 text-white/50 hover:text-white backdrop-blur-sm transition">
                      <Share2 size={15} />
                    </button>
                  </div>

                  <div className="absolute bottom-4 left-4 flex items-center gap-2 text-xs text-white/50">
                    <Eye size={12} />
                    {auction.watchers} watching
                  </div>
                </div>

                <div className="p-7">
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                    {auction.year} {auction.make} {auction.model}
                  </h1>
                  <p className="text-sm text-gray-400 dark:text-white/40 mb-6">{auction.city}, {auction.country} · VIN: {auction.vin}</p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                    {[
                      { label: 'Mileage', value: `${auction.mileage.toLocaleString()} km` },
                      { label: 'Fuel', value: auction.fuelType },
                      { label: 'Transmission', value: auction.transmission },
                      { label: 'Condition', value: auction.condition },
                    ].map((s) => (
                      <div key={s.label} className="rounded-xl border border-black/8 dark:border-white/8 bg-black/[0.02] dark:bg-white/3 p-3">
                        <div className="text-xs text-gray-400 dark:text-white/30 mb-0.5">{s.label}</div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{s.value}</div>
                      </div>
                    ))}
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-widest text-gray-400 dark:text-white/25 mb-3">Features</p>
                    <div className="flex flex-wrap gap-2">
                      {auction.features.map((f) => (
                        <span key={f} className="flex items-center gap-1.5 rounded-full border border-black/8 dark:border-white/8 bg-black/[0.02] dark:bg-white/3 px-3 py-1 text-xs text-gray-500 dark:text-white/50">
                          <CheckCircle2 size={10} className="text-orange-400" />
                          {f}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            {/* Bid history */}
            <AnimatedSection direction="left" delay={0.1}>
              <div className="rounded-3xl border border-black/8 dark:border-white/8 bg-black/[0.02] dark:bg-white/[0.02] p-6">
                <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <TrendingUp size={16} className="text-orange-400" />
                  Bid History
                  <span className="ml-auto text-xs text-gray-400 dark:text-white/30">{bidCount} bids total</span>
                </h2>
                <div className="space-y-3">
                  <AnimatePresence>
                    {newBid && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, backgroundColor: 'rgba(249,115,22,0.2)' }}
                        animate={{ opacity: 1, y: 0, backgroundColor: 'rgba(249,115,22,0.08)' }}
                        exit={{ opacity: 0 }}
                        className="flex items-center justify-between rounded-xl border border-orange-500/20 px-4 py-3"
                      >
                        <div className="flex items-center gap-2">
                          <span className="h-2 w-2 rounded-full bg-orange-400 animate-pulse" />
                          <span className="text-sm text-orange-400 dark:text-orange-300 font-medium">New bid just placed</span>
                        </div>
                        <span className="text-sm font-bold text-orange-400 dark:text-orange-300">${newBid.toLocaleString()}</span>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  {auction.bidHistory.map((bid, i) => (
                    <div key={i} className="flex items-center justify-between rounded-xl border border-black/6 dark:border-white/6 bg-black/[0.02] dark:bg-white/3 px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black/5 dark:bg-white/5 text-xs text-gray-500 dark:text-white/50 font-medium">
                          {bid.bidder.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 dark:text-white/70">{bid.bidder}</div>
                          <div className="text-xs text-gray-400 dark:text-white/30">{bid.time}</div>
                        </div>
                      </div>
                      <span className={`text-sm font-semibold ${i === 0 ? 'text-orange-400' : 'text-gray-500 dark:text-white/50'}`}>
                        ${bid.amount.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>

          {/* Right: bidding panel */}
          <div className="space-y-5">
            <AnimatedSection direction="right">
              {/* Timer */}
              <div className="rounded-3xl border border-black/8 dark:border-white/8 bg-black/[0.02] dark:bg-white/[0.02] p-6 mb-5">
                <div className="flex items-center gap-2 mb-4">
                  <span className="h-2 w-2 rounded-full bg-red-400 animate-pulse" />
                  <span className="text-xs font-semibold text-red-400 uppercase tracking-wider">Live Auction</span>
                </div>

                <div className="mb-4">
                  <div className="text-xs text-gray-400 dark:text-white/30 mb-1">Time Remaining</div>
                  <div className="flex items-baseline gap-1 text-4xl font-bold text-gray-900 dark:text-white tabular-nums">
                    <span>{pad(timeLeft.h)}</span>
                    <span className="text-xl text-gray-400 dark:text-white/30">:</span>
                    <span>{pad(timeLeft.m)}</span>
                    <span className="text-xl text-gray-400 dark:text-white/30">:</span>
                    <span className={timeLeft.h === 0 && timeLeft.m < 5 ? 'text-red-400' : ''}>{pad(timeLeft.s)}</span>
                  </div>
                </div>

                <div
                  className={`rounded-2xl border border-black/8 dark:border-white/8 bg-black/[0.02] dark:bg-white/3 p-4 mb-5 transition-all duration-300 ${bidFlash ? 'border-orange-500/40 bg-orange-500/10' : ''}`}
                >
                  <div className="text-xs text-gray-400 dark:text-white/30 mb-1">Current Bid</div>
                  <motion.div
                    key={currentBid}
                    initial={{ scale: 1.1, color: '#F97316' }}
                    animate={{ scale: 1, color: '#111827' }}
                    className="text-3xl font-bold dark:[color:#ffffff]"
                  >
                    ${currentBid.toLocaleString()}
                  </motion.div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-gray-400 dark:text-white/30">
                    <Users size={10} />
                    {bidCount} bids · {auction.watchers} watching
                  </div>
                  {auction.reserveMet && (
                    <div className="mt-2 flex items-center gap-1.5 text-xs text-green-500 dark:text-green-400">
                      <CheckCircle2 size={11} />
                      Reserve price met
                    </div>
                  )}
                </div>

                {/* Bid input */}
                <div className="mb-3">
                  <label className="block text-xs text-gray-400 dark:text-white/35 mb-2">
                    Your Bid (min. ${minBid.toLocaleString()})
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={bidInput}
                      onChange={(e) => setBidInput(e.target.value)}
                      placeholder={`${minBid}`}
                      className="flex-1 rounded-xl border border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 px-4 py-3 text-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-white/20 focus:border-orange-500/40 focus:outline-none focus:ring-1 focus:ring-orange-500/20 transition"
                    />
                    <button
                      onClick={handlePlaceBid}
                      className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-400 px-4 py-3 text-sm font-semibold text-white shadow-md shadow-orange-500/25 hover:shadow-orange-500/40 transition-all"
                    >
                      <Gavel size={14} />
                      Bid
                    </button>
                  </div>
                </div>

                {/* Quick bid buttons */}
                <div className="flex gap-2 mb-5">
                  {[minBid, minBid + 200, minBid + 500].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setBidInput(String(amt))}
                      className="flex-1 rounded-xl border border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/3 py-2 text-xs text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-white hover:border-black/20 dark:hover:border-white/20 transition"
                    >
                      ${amt.toLocaleString()}
                    </button>
                  ))}
                </div>

                <div className="flex items-start gap-2 text-xs text-gray-400 dark:text-white/30">
                  <AlertCircle size={12} className="mt-0.5 shrink-0" />
                  By placing a bid you agree to Eldovia&apos;s auction terms. All sales are binding.
                </div>
              </div>

              {/* Logistics badges */}
              <div className="space-y-3">
                {[
                  { icon: Shield, label: 'Escrow Protected', desc: 'Payment held in escrow until vehicle inspection confirmed' },
                  { icon: CheckCircle2, label: 'VIN Verified', desc: 'Full vehicle history and inspection report available' },
                  { icon: Truck, label: 'Door-to-Door Logistics', desc: 'We coordinate shipping to your location' },
                ].map(({ icon: Icon, label, desc }) => (
                  <div key={label} className="flex items-start gap-3 rounded-xl border border-black/8 dark:border-white/8 bg-black/[0.02] dark:bg-white/3 p-4">
                    <Icon size={16} className="text-orange-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{label}</div>
                      <div className="text-xs text-gray-500 dark:text-white/35 mt-0.5">{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </div>
      </div>
    </main>
  );
}
