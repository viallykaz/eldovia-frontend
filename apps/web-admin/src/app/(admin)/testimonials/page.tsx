'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Loader2, Star } from 'lucide-react';
import { getToken } from '@/lib/auth';
import { getTestimonials, updateTestimonial, Testimonial } from '@/lib/api';

const TYPE_BADGE: Record<string, string> = {
  investor: 'bg-blue-100 text-blue-700',
  partner: 'bg-purple-100 text-purple-700',
  community: 'bg-green-100 text-green-700',
  customer: 'bg-orange-100 text-orange-700',
};

function StarRating({ rating }: { rating?: number }) {
  if (!rating) return <span className="text-gray-400 text-xs">—</span>;
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={12}
          className={i <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'}
        />
      ))}
    </div>
  );
}

function Toggle({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      disabled={disabled}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors focus:outline-none disabled:opacity-50 ${
        checked ? 'bg-orange-500' : 'bg-gray-200'
      }`}
    >
      <span
        className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
          checked ? 'translate-x-4.5' : 'translate-x-0.5'
        }`}
        style={{ transform: checked ? 'translateX(18px)' : 'translateX(2px)' }}
      />
    </button>
  );
}

export default function TestimonialsPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!getToken()) {
      router.replace('/login');
      return;
    }
    setReady(true);
    fetchTestimonials();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchTestimonials() {
    setLoading(true);
    setError(null);
    try {
      const res = await getTestimonials();
      setTestimonials((res as any) ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  }

  async function handleToggle(
    t: Testimonial,
    field: 'featured' | 'active',
  ) {
    const key = `${t.id}-${field}`;
    setToggling(key);
    try {
      const updated = await updateTestimonial(t.id, {
        [field]: !t[field],
      });
      setTestimonials((prev) =>
        prev.map((item) => (item.id === t.id ? (updated as any) : item)),
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Update failed');
    } finally {
      setToggling(null);
    }
  }

  if (!ready)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Testimonials</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {testimonials.length} testimonial{testimonials.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/testimonials/new"
          className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={16} />
          New Testimonial
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {error}
          <button onClick={fetchTestimonials} className="ml-3 underline hover:no-underline">
            Retry
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-400">
            <Loader2 size={24} className="animate-spin mr-2" />
            Loading testimonials…
          </div>
        ) : testimonials.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-sm">No testimonials found.</p>
            <Link
              href="/testimonials/new"
              className="mt-3 inline-flex items-center gap-1.5 text-sm text-orange-500 hover:text-orange-600 font-medium"
            >
              <Plus size={15} /> Add the first testimonial
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[800px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Name</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Organization</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Type</th>
                  <th className="text-left px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Rating</th>
                  <th className="text-center px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Featured</th>
                  <th className="text-center px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">Active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {testimonials.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-gray-900">{t.name}</p>
                      {t.title && (
                        <p className="text-xs text-gray-400 mt-0.5">{t.title}</p>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-gray-500">
                      {t.organization ?? '—'}
                    </td>
                    <td className="px-5 py-3.5">
                      {t.type ? (
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                            TYPE_BADGE[t.type] ?? 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {t.type}
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <StarRating rating={t.rating} />
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <Toggle
                        checked={t.featured}
                        onChange={() => handleToggle(t, 'featured')}
                        disabled={toggling === `${t.id}-featured`}
                      />
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <Toggle
                        checked={t.active}
                        onChange={() => handleToggle(t, 'active')}
                        disabled={toggling === `${t.id}-active`}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
