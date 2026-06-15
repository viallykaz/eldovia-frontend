import { ImpactSection } from '@/components/sections/impact';
import { AnimatedSection, CountUp } from '@eldovia/ui';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function ImpactPage() {
  return (
    <main className="bg-white dark:bg-[#0C0C0C] min-h-screen pt-24">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <AnimatedSection>
          <h1 className="mt-8 text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl leading-tight mb-4">
            Impact that{' '}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(90deg, #22c55e, #4ade80)' }}>
              scales
            </span>
          </h1>
          <p className="text-gray-500 dark:text-white/45 max-w-xl mx-auto leading-relaxed">
            Every dollar deployed through Eldovia Agribusiness is tracked against both financial and social metrics — because we believe you shouldn&apos;t have to choose.
          </p>
        </AnimatedSection>
      </div>

      <ImpactSection />

      {/* Case studies */}
      <section className="py-24 bg-white dark:bg-[#0C0C0C]">
        <div className="mx-auto max-w-7xl px-6">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Stories from the{' '}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(90deg, #22c55e, #4ade80)' }}>
                field
              </span>
            </h2>
          </AnimatedSection>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              { name: 'Grace Wanjiku', role: 'Smallholder Farmer, Kenya', quote: 'Before Eldovia, I sold my maize for whatever the roadside trader offered. Now I have a contract, a fair price, and I\'ve expanded to 3 acres from 1.', initials: 'GW' },
              { name: 'Amara Diallo', role: 'Cooperative Chair, Ghana', quote: 'The Fairtrade certification our cooperative achieved through Eldovia opened doors to European buyers we could never have reached on our own.', initials: 'AD' },
              { name: 'Joseph Mwenda', role: 'Rice Farmer, Tanzania', quote: 'We used to lose over a third of our harvest to spoilage. The milling hub cut that to under 8%. That\'s food and money that used to disappear, now reaching markets.', initials: 'JM' },
            ].map((s, i) => (
              <AnimatedSection key={s.name} delay={i * 0.1}>
                <div className="rounded-2xl border border-black/8 dark:border-white/8 bg-black/[0.02] dark:bg-white/[0.02] p-6">
                  <p className="text-sm text-gray-600 dark:text-white/60 leading-relaxed italic mb-5">&ldquo;{s.quote}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full text-white text-xs font-bold" style={{ background: 'linear-gradient(135deg, #0d5730, #22c55e)' }}>
                      {s.initials}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-gray-900 dark:text-white">{s.name}</div>
                      <div className="text-xs text-gray-400 dark:text-white/35">{s.role}</div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-24 bg-white dark:bg-[#0C0C0C]">
        <div className="mx-auto max-w-xl px-6 text-center">
          <AnimatedSection>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Invest in impact
            </h2>
            <Link
              href="/invest"
              className="group inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-white shadow-lg transition-all hover:scale-[1.02]"
              style={{ background: 'linear-gradient(135deg, #0d5730, #158040)', boxShadow: '0 8px 30px rgba(13,87,48,0.3)' }}
            >
              Explore Projects
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}
