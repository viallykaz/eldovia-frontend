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
    quote: 'Eldovia Agribusiness opened our eyes to the untapped potential of African agricultural projects. Their due diligence process and transparent impact reporting gave us the confidence to commit $5M in funding.',
    rating: 5,
    avatar: 'AO',
  },
  {
    id: 2,
    name: 'Fatima Al-Hassan',
    title: 'Regional Director',
    company: 'GreenFarm Partners',
    quote: 'Working with Eldovia Agribusiness has been transformative. Their project management platform keeps all stakeholders aligned, and the community impact metrics are exactly what our ESG requirements demand.',
    rating: 5,
    avatar: 'FA',
  },
  {
    id: 3,
    name: 'Dr. Jonas Mwangi',
    title: 'Fund Manager',
    company: 'AfricaAgri Fund',
    quote: 'The reporting quality is exceptional — quarterly updates, satellite crop monitoring data, and real-time cashflow visibility. We\'ve deployed $12M across 8 Eldovia projects in 18 months.',
    rating: 5,
    avatar: 'JM',
  },
  {
    id: 4,
    name: 'Ingrid Brandt',
    title: 'ESG Lead',
    company: 'Nordic Impact Investors',
    quote: 'The alignment with GRI and IFC standards made this an easy decision. We received more granular impact data from Eldovia than from most developed-market investments in our portfolio.',
    rating: 5,
    avatar: 'IB',
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
    <section className="relative py-28 bg-white dark:bg-[#0C0C0C]">
      <div className="relative mx-auto max-w-7xl px-6">
        <AnimatedSection className="text-center mb-16">
          <p className="text-xs uppercase tracking-widest mb-3" style={{ color: '#22c55e' }}>Testimonials</p>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Trusted by{' '}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(90deg, #22c55e, #4ade80)' }}>
              global investors
            </span>
          </h2>
        </AnimatedSection>

        <div className="relative max-w-3xl mx-auto">
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {testimonials.map((t) => (
                <div key={t.id} className="min-w-0 shrink-0 grow-0 basis-full px-4">
                  <div className="rounded-3xl border border-black/8 dark:border-white/8 bg-black/[0.02] dark:bg-white/[0.02] p-8 sm:p-10 backdrop-blur-sm">
                    <Quote size={32} className="mb-6 opacity-30" style={{ color: '#0d5730' }} />
                    <p className="text-lg text-gray-600 dark:text-white/75 leading-relaxed mb-8 italic">
                      &ldquo;{t.quote}&rdquo;
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className="flex h-12 w-12 items-center justify-center rounded-full text-white font-bold text-sm"
                          style={{ background: 'linear-gradient(135deg, #0d5730, #22c55e)' }}
                        >
                          {t.avatar}
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-white">{t.name}</div>
                          <div className="text-sm text-gray-500 dark:text-white/40">{t.title} · {t.company}</div>
                        </div>
                      </div>
                      <div className="flex gap-1">
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <Star key={i} size={12} style={{ fill: '#22c55e', color: '#22c55e' }} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex items-center justify-center gap-4">
            <button onClick={scrollPrev} className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 dark:border-white/10 text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-white hover:border-black/30 dark:hover:border-white/30 transition">
              <ChevronLeft size={18} />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  onClick={() => emblaApi?.scrollTo(i)}
                  className="h-1.5 rounded-full transition-all duration-300"
                  style={{
                    width: i === selectedIndex ? '24px' : '6px',
                    background: i === selectedIndex ? '#0d5730' : 'rgba(0,0,0,0.15)',
                  }}
                />
              ))}
            </div>
            <button onClick={scrollNext} className="flex h-10 w-10 items-center justify-center rounded-full border border-black/10 dark:border-white/10 text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-white hover:border-black/30 dark:hover:border-white/30 transition">
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
