import { HeroSection } from '@/components/sections/hero';
import { StatsSection } from '@/components/sections/stats';
import { SubsidiariesSection } from '@/components/sections/subsidiaries';
import { TestimonialsSection } from '@/components/sections/testimonials';
import { PartnersSection } from '@/components/sections/partners';
import { CtaSection } from '@/components/sections/cta';

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <StatsSection />
      <SubsidiariesSection />
      <TestimonialsSection />
      <PartnersSection />
      <CtaSection />
    </main>
  );
}
