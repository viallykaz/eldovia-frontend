import { HowItWorksSection } from '@/components/sections/how-it-works';
import { AnimatedSection } from '@eldovia/ui';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function HowItWorksPage() {
  return (
    <main className="bg-white dark:bg-[#020B18] min-h-screen pt-24">
      <div className="mx-auto max-w-4xl px-6 pb-0 text-center">
        <AnimatedSection>
          <h1 className="mt-6 text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl leading-tight">
            Simple.{' '}
            <span className="bg-gradient-to-r from-orange-500 via-amber-400 to-orange-300 bg-clip-text text-transparent">
              Transparent. Secure.
            </span>
          </h1>
          <p className="mt-4 text-gray-500 dark:text-white/45 max-w-xl mx-auto leading-relaxed">
            Eldovia Automobile removes the complexity from cross-border vehicle transactions. Here&apos;s exactly how buying and selling works on our platform.
          </p>
        </AnimatedSection>
      </div>

      <HowItWorksSection />

      {/* FAQ */}
      <section className="py-24 bg-white dark:bg-[#020B18]">
        <div className="mx-auto max-w-3xl px-6">
          <AnimatedSection className="text-center mb-12">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Frequently asked{' '}
              <span className="bg-gradient-to-r from-orange-500 to-amber-400 bg-clip-text text-transparent">
                questions
              </span>
            </h2>
          </AnimatedSection>

          <div className="space-y-4">
            {[
              { q: 'Who can buy on Eldovia Automobile?', a: 'Anyone with a verified account. Buyers can be private individuals, dealers, or fleet managers. KYC verification is required to place bids.' },
              { q: 'What countries do you ship to?', a: 'We coordinate shipping to all 12 countries in our network. For custom routes, contact our logistics team.' },
              { q: 'Is my payment secure?', a: 'Yes. All payments are held in escrow and only released once the buyer confirms vehicle receipt and condition.' },
              { q: 'What does the inspection report include?', a: 'Engine, transmission, body condition, interior, electrical systems, service history, and a full VIN check for any liens or damage history.' },
              { q: 'What happens if I win but don\'t pay?', a: 'Failure to pay after winning an auction results in account suspension and forfeiture of any deposit placed.' },
              { q: 'Can I set a reserve price as a seller?', a: 'Yes. Reserve prices are mandatory. Your vehicle will only sell if bidding reaches your reserve. Reserves are kept confidential from bidders.' },
            ].map((item, i) => (
              <AnimatedSection key={i} delay={i * 0.06}>
                <details className="group rounded-2xl border border-black/8 dark:border-white/8 bg-black/[0.02] dark:bg-white/3">
                  <summary className="cursor-pointer list-none flex items-center justify-between p-5 text-sm font-medium text-gray-900 dark:text-white hover:text-orange-500 dark:hover:text-orange-300 transition">
                    {item.q}
                    <span className="ml-4 text-gray-400 dark:text-white/30 group-open:text-orange-400 transition">+</span>
                  </summary>
                  <div className="px-5 pb-5 text-sm text-gray-500 dark:text-white/45 leading-relaxed border-t border-black/6 dark:border-white/6 pt-4">
                    {item.a}
                  </div>
                </details>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-24 bg-white dark:bg-[#020B18]">
        <div className="mx-auto max-w-xl px-6 text-center">
          <AnimatedSection>
            <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
              Ready to get started?
            </h2>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/auctions"
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-amber-400 px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 hover:scale-[1.02] transition-all"
              >
                Browse Auctions
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/sell"
                className="inline-flex items-center gap-2 rounded-full border border-black/15 dark:border-white/15 px-7 py-3.5 text-sm font-semibold text-gray-800 dark:text-white hover:bg-black/5 dark:hover:bg-white/5 transition"
              >
                List a Vehicle
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </main>
  );
}
