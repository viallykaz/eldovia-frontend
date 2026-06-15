'use client';

import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { cn } from '../lib/utils';

interface CarouselProps {
  children: React.ReactNode[];
  className?: string;
  autoplay?: boolean;
  autoplayDelay?: number;
  showArrows?: boolean;
  showDots?: boolean;
  loop?: boolean;
  align?: 'start' | 'center' | 'end';
}

export function Carousel({
  children,
  className,
  autoplay = false,
  autoplayDelay = 4000,
  showArrows = true,
  showDots = true,
  loop = true,
  align = 'start',
}: CarouselProps) {
  const plugins = autoplay ? [Autoplay({ delay: autoplayDelay, stopOnInteraction: false })] : [];
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop, align }, plugins);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((idx: number) => emblaApi?.scrollTo(idx), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const update = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
      setCanPrev(emblaApi.canScrollPrev());
      setCanNext(emblaApi.canScrollNext());
    };
    emblaApi.on('select', update);
    emblaApi.on('reInit', update);
    update();
    return () => { emblaApi.off('select', update); emblaApi.off('reInit', update); };
  }, [emblaApi]);

  return (
    <div className={cn('relative', className)}>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {children.map((child, i) => (
            <div key={i} className="min-w-0 shrink-0 grow-0 basis-full">
              {child}
            </div>
          ))}
        </div>
      </div>

      {showArrows && (
        <>
          <button
            onClick={scrollPrev}
            disabled={!canPrev && !loop}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/5 dark:bg-white/10 backdrop-blur-sm border border-black/10 dark:border-white/20 text-gray-700 dark:text-white transition hover:bg-black/10 dark:hover:bg-white/20 disabled:opacity-30"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={scrollNext}
            disabled={!canNext && !loop}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/5 dark:bg-white/10 backdrop-blur-sm border border-black/10 dark:border-white/20 text-gray-700 dark:text-white transition hover:bg-black/10 dark:hover:bg-white/20 disabled:opacity-30"
          >
            <ChevronRight size={20} />
          </button>
        </>
      )}

      {showDots && children.length > 1 && (
        <div className="mt-6 flex justify-center gap-2">
          {children.map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                i === selectedIndex ? 'w-6 bg-current opacity-100' : 'w-2 bg-current opacity-30',
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}
