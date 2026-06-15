'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Star } from 'lucide-react';
import { getToken } from '@/lib/auth';
import { createTestimonial } from '@/lib/api';

export default function NewTestimonialPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [organization, setOrganization] = useState('');
  const [quote, setQuote] = useState('');
  const [type, setType] = useState('customer');
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [site, setSite] = useState('main');

  useEffect(() => {
    if (!getToken()) {
      router.replace('/login');
      return;
    }
    setReady(true);
  }, [router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await createTestimonial({
        name,
        quote,
        title: title || undefined,
        organization: organization || undefined,
        type,
        rating,
        site,
      });
      router.push('/testimonials');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create testimonial');
    } finally {
      setLoading(false);
    }
  }

  if (!ready)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      {/* Back */}
      <Link
        href="/testimonials"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft size={15} />
        Back to Testimonials
      </Link>

      <div>
        <h2 className="text-lg font-semibold text-gray-900">Add Testimonial</h2>
        <p className="text-sm text-gray-500 mt-0.5">Create a new customer or partner testimonial.</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 space-y-5">
          <h3 className="text-sm font-semibold text-gray-700 border-b border-gray-100 pb-3">
            Person Details
          </h3>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Smith"
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Job Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="CEO, Director of Operations…"
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
            />
          </div>

          {/* Organization */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Organization
            </label>
            <input
              type="text"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              placeholder="Company or organization name"
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
            />
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 space-y-5">
          <h3 className="text-sm font-semibold text-gray-700 border-b border-gray-100 pb-3">
            Testimonial Content
          </h3>

          {/* Quote */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Quote <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              placeholder="What did they say about Eldovia?"
              rows={5}
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition resize-y"
            />
          </div>

          {/* Type & Site row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition bg-white"
              >
                <option value="customer">Customer</option>
                <option value="investor">Investor</option>
                <option value="partner">Partner</option>
                <option value="community">Community</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Site
              </label>
              <select
                value={site}
                onChange={(e) => setSite(e.target.value)}
                className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition bg-white"
              >
                <option value="main">Main</option>
                <option value="automobile">Automobile</option>
                <option value="agribusiness">Agribusiness</option>
              </select>
            </div>
          </div>

          {/* Rating */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rating
            </label>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((i) => (
                <button
                  key={i}
                  type="button"
                  onMouseEnter={() => setHoverRating(i)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(i)}
                  className="focus:outline-none"
                >
                  <Star
                    size={24}
                    className={`transition-colors ${
                      i <= (hoverRating || rating)
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-gray-200'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-500">{rating}/5</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pb-6">
          <Link
            href="/testimonials"
            className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            {loading && <Loader2 size={15} className="animate-spin" />}
            Save Testimonial
          </button>
        </div>
      </form>
    </div>
  );
}
