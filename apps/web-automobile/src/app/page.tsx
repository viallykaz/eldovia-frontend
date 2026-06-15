import { HeroSection } from '@/components/sections/hero';
import { StatsSection } from '@/components/sections/stats';
import { FeaturedAuctionsSection } from '@/components/sections/featured-auctions';
import { HowItWorksSection } from '@/components/sections/how-it-works';
import { TestimonialsSection } from '@/components/sections/testimonials';
import { CtaSection } from '@/components/sections/cta';

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <StatsSection />
      <FeaturedAuctionsSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <CtaSection />
    </main>
  );
}
