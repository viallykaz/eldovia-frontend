import { HeroSection } from '@/components/sections/hero';
import { StatsSection } from '@/components/sections/stats';
import { FeaturedProjectsSection } from '@/components/sections/featured-projects';
import { ImpactSection } from '@/components/sections/impact';
import { TestimonialsSection } from '@/components/sections/testimonials';
import { CtaSection } from '@/components/sections/cta';

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <StatsSection />
      <FeaturedProjectsSection />
      <ImpactSection />
      <TestimonialsSection />
      <CtaSection />
    </main>
  );
}
