'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { AnimatedSection } from '@eldovia/ui';

const testimonials = [
  {
    id: 1,
    name: 'Marcus Steinberg',
    title: 'Fleet Manager',
    company: 'Eurofleet Solutions',
    quote: 'The Eldovia Automobile platform transformed how we acquire vehicles. The real-time bidding system is flawless, and the inspection reports are comprehensive. We\'ve sourced 120+ vehicles through the platform with zero disputes.',
    rating: 5,
    avatar: 'MS',
    location: 'Netherlands',
  },
  {
    id: 2,
    name: 'Chen Wei',
    title: 'CEO',
    company: 'AsiaAuto Import Ltd',
    quote: 'The customs documentation support and logistics coordination saved us weeks of work per shipment. We expanded our import operations by 40% in the first year of using Eldovia Automobile.',
    rating: 5,
    avatar: 'CW',
    location: 'Hong Kong',
  },
  {
    id: 3,
    name: 'Kofi Mensah',
    title: 'Used Car Dealer',
    company: 'Mensah Motors, Accra',
    quote: 'As a seller, the platform is incredibly easy to use. I listed 8 vehicles last month and sold all 8 within 5 days. The escrow payment system gives my buyers confidence and me peace of mind.',
    rating: 5,
    avatar: 'KM',
    location: 'Ghana',
  },
  {
    id: 4,
    name: 'Ingrid Larsson',
    title: 'Procurement Director',
    company: 'Nordic Fleet Partners',
    quote: 'We needed diverse inventory quickly. Eldovia\'s multi-country sourcing gave us access to vehicles across 12 markets simultaneously. The VIN verification reports are more thorough than anything we\'ve seen.',
    rating: 5,
    avatar: 'IL',
    location: 'Sweden',
  },
];

export function TestimonialsSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true },
    [Autoplay({ delay: 5000, stopOnInteraction: false })],
  );
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const update = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on('select', update);
    return () => { emblaApi.off('select', update); };
  }, [emblaApi]);

  return (
    <section className="relative py-28 bg-white dark:bg-[#020B18]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_50%,rgba(249,115,22,0.04)_0%,transparent_60%)]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <AnimatedSection className="text-center mb-16">
          <p className="text-xs uppercase tracking-widest text-orange-400 mb-3">Testimonials</p>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Trusted by{' '}
            <span className="bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">
              dealers & fleets
            </span>
          </h2>
        </AnimatedSection>

        <div className="relative max-w-3xl mx-auto">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {testimonials.map((t) => (
                <div key={t.id} className="min-w-0 shrink-0 grow-0 basis-full px-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-3xl border border-black/8 dark:border-white/8 bg-black/[0.02] dark:bg-white/3 p-8 sm:p-10 backdrop-blur-sm"
                  >
                    <Quote size={32} className="text-orange-500/30 mb-6" />
                    <p className="text-lg text-gray-600 dark:text-white/75 leading-relaxed mb-8 italic">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-400 text-white font-bold text-sm">
                          {t.avatar}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">{t.name}</div>
                          <div className="text-sm text-gray-500 dark:text-white/40">{t.title} · {t.company}</div>
                          <div className="text-xs text-gray-400 dark:text-white/25 mt-0.5">{t.location}</div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <Star key={i} size={12} className="fill-orange-400 text-orange-400" />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4">
            <button
              onClick={scrollPrev}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 dark:border-white/10 text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-white hover:border-black/30 dark:hover:border-white/30 transition"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => emblaApi?.scrollTo(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === selectedIndex ? 'w-6 bg-orange-500' : 'w-1.5 bg-black/20 dark:bg-white/20'}`}
                />
              ))}
            </div>
            <button
              onClick={scrollNext}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 dark:border-white/10 text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-white hover:border-black/30 dark:hover:border-white/30 transition"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
