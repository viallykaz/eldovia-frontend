import Link from 'next/link';
import { ArrowRight, Globe, TrendingUp, Users, Handshake } from 'lucide-react';
import { AnimatedSection } from '@eldovia/ui';
import { getPartners, Partner } from '@/lib/api';

const partnerTypes = [
  { icon: TrendingUp, title: 'Financial Partners', desc: 'Institutional investors, impact funds, and development finance institutions.' },
  { icon: Globe, title: 'Offtake Partners', desc: 'Buyers, processors, and retailers committing to purchase project output at agreed prices.' },
  { icon: Users, title: 'Technical Partners', desc: 'Agronomy firms, technology providers, and NGOs improving project outcomes.' },
  { icon: Handshake, title: 'Community Partners', desc: 'Cooperatives, farmer associations, and local government bodies.' },
];

function initials(name: string) {
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function PartnerCard({ partner }: { partner: Partner }) {
  return (
    <div className="rounded-2xl border border-black/8 dark:border-white/8 bg-black/[0.02] dark:bg-white/[0.02] p-6">
      <div className="flex items-start gap-4">
        {partner.logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={partner.logoUrl} alt={partner.name} className="h-12 w-12 shrink-0 rounded-full object-cover" />
        ) : (
          <div
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-white font-bold text-sm"
            style={{ background: 'linear-gradient(135deg, #0d5730, #22c55e)' }}
          >
            {initials(partner.name)}
          </div>
        )}
        <div>
          <div className="font-semibold text-gray-900 dark:text-white mb-0.5">{partner.name}</div>
          <div className="text-xs mb-2 capitalize" style={{ color: '#22c55e' }}>
            {partner.type.replace(/_/g, ' ')}
          </div>
          {partner.description && (
            <p className="text-xs text-gray-500 dark:text-white/40 leading-relaxed">{partner.description}</p>
          )}
          {partner.websiteUrl && (
            <a
              href={partner.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1 text-xs"
              style={{ color: '#22c55e' }}
            >
              Visit site <ArrowRight size={10} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

export default async function PartnersPage() {
  let partners: Partner[] = [];
  try {
    partners = await getPartners();
  } catch {
    // show empty state
  }

  return (
    <main className="bg-white dark:bg-[#0C0C0C] min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-6">
        <AnimatedSection className="mb-14 text-center">
          <div
            className="mb-5 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm"
            style={{ borderColor: 'rgba(13,87,48,0.4)', background: 'rgba(13,87,48,0.1)', color: '#16a34a' }}
          >
            <Handshake size={13} />
            Partners
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl mb-4">
            A network built for{' '}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(90deg, #22c55e, #4ade80)' }}>
              impact
            </span>
          </h1>
          <p className="text-gray-500 dark:text-white/45 max-w-xl mx-auto leading-relaxed">
            Eldovia Agribusiness works with world-class partners across the investment, agricultural, and development sectors.
          </p>
        </AnimatedSection>

        {/* Partner types */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-20">
          {partnerTypes.map((pt, i) => (
            <AnimatedSection key={pt.title} delay={i * 0.1}>
              <div className="rounded-2xl border border-black/8 dark:border-white/8 bg-black/[0.02] dark:bg-white/[0.02] p-6">
                <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: 'rgba(13,87,48,0.15)', border: '1px solid rgba(13,87,48,0.3)' }}>
                  <pt.icon size={18} style={{ color: '#22c55e' }} />
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{pt.title}</h3>
                <p className="text-xs text-gray-500 dark:text-white/40 leading-relaxed">{pt.desc}</p>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* Partners from DB */}
        {partners.length > 0 && (
          <>
            <AnimatedSection className="text-center mb-10">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Our{' '}
                <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(90deg, #22c55e, #4ade80)' }}>
                  key partners
                </span>
              </h2>
            </AnimatedSection>

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-20">
              {partners.map((p, i) => (
                <AnimatedSection key={p.id} delay={i * 0.08}>
                  <PartnerCard partner={p} />
                </AnimatedSection>
              ))}
            </div>
          </>
        )}

        {/* CTA */}
        <AnimatedSection className="text-center">
          <div className="rounded-3xl border border-black/8 dark:border-white/8 bg-black/[0.02] dark:bg-white/[0.02] py-16 px-8">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Become a{' '}
              <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(90deg, #22c55e, #4ade80)' }}>
                partner
              </span>
            </h2>
            <p className="text-gray-500 dark:text-white/45 mb-8 max-w-md mx-auto leading-relaxed">
              Whether as an investor, offtake buyer, technical advisor, or community partner — there&apos;s a place for you in our ecosystem.
            </p>
            <Link
              href="/contact"
              className="group inline-flex items-center gap-2 rounded-full px-8 py-4 text-sm font-semibold text-white shadow-lg transition-all hover:scale-[1.02]"
              style={{ background: 'linear-gradient(135deg, #0d5730, #158040)', boxShadow: '0 8px 30px rgba(13,87,48,0.3)' }}
            >
              Get in Touch
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </AnimatedSection>
      </div>
    </main>
  );
}
