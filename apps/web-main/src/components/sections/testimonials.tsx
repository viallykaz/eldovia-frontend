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
    name: 'Adaeze Okonkwo',
    title: 'Investment Director',
    company: 'Pan-African Capital',
    quote:
      'Eldovia Agribusiness opened our eyes to the untapped potential of African agricultural projects. Their due diligence process and transparent impact reporting gave us the confidence to commit $5M in funding.',
    rating: 5,
    avatar: 'AO',
  },
  {
    id: 2,
    name: 'Marcus Steinberg',
    title: 'Fleet Manager',
    company: 'Eurofleet Solutions',
    quote:
      'The Eldovia Automobile platform transformed how we acquire vehicles. The real-time bidding system is flawless, and the inspection reports are comprehensive. We\'ve sourced 120+ vehicles through the platform.',
    rating: 5,
    avatar: 'MS',
  },
  {
    id: 3,
    name: 'Fatima Al-Hassan',
    title: 'Regional Director',
    company: 'GreenFarm Partners',
    quote:
      'As a strategic partner, working with Eldovia Agribusiness has been transformative. Their project management platform keeps all stakeholders aligned, and the community impact metrics are exactly what our ESG requirements demand.',
    rating: 5,
    avatar: 'FA',
  },
  {
    id: 4,
    name: 'Chen Wei',
    title: 'CEO',
    company: 'AsiaAuto Import Ltd',
    quote:
      'The customs documentation support and logistics coordination on the Automobile platform saved us weeks of work. We expanded our import operations by 40% in the first year of using Eldovia.',
    rating: 5,
    avatar: 'CW',
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
    <section className="relative py-28 overflow-hidden bg-slate-50 dark:bg-[#050E1A]">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_80%_50%,rgba(249,115,22,0.04)_0%,transparent_60%)]" />

      <div className="relative mx-auto max-w-7xl px-6">
        <AnimatedSection className="text-center mb-16">
          <p className="text-xs uppercase tracking-widest text-orange-400 mb-3">Testimonials</p>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Trusted by{' '}
            <span className="bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">
              global leaders
            </span>
          </h2>
        </AnimatedSection>

        <div className="relative max-w-4xl mx-auto">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {testimonials.map((t) => (
                <div key={t.id} className="min-w-0 shrink-0 grow-0 basis-full px-4">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-3xl border border-black/8 dark:border-white/8 bg-black/[0.02] dark:bg-white/3 p-8 sm:p-10 backdrop-blur-sm"
                  >
                    <Quote size={36} className="text-orange-500/30 mb-6" />

                    <p className="text-lg sm:text-xl text-gray-600 dark:text-white/75 leading-relaxed mb-8 italic">
                      &ldquo;{t.quote}&rdquo;
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-amber-400 text-white font-bold text-sm">
                          {t.avatar}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">{t.name}</div>
                          <div className="text-sm text-gray-500 dark:text-white/45">
                            {t.title} · {t.company}
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <Star key={i} size={14} className="fill-orange-400 text-orange-400" />
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>

          {/* Controls */}
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
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === selectedIndex ? 'w-6 bg-orange-500' : 'w-1.5 bg-black/20 dark:bg-white/20'
                  }`}
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
