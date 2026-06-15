'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Loader2, Globe } from 'lucide-react';
import { getToken } from '@/lib/auth';
import { getPage, updatePage, publishPage, CmsPage } from '@/lib/api';

export default function EditPagePage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [ready, setReady] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<CmsPage | null>(null);

  const [title, setTitle] = useState('');
  const [site, setSite] = useState('main');
  const [content, setContent] = useState('');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');

  useEffect(() => {
    if (!getToken()) {
      router.replace('/login');
      return;
    }
    setReady(true);
    fetchPage();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function fetchPage() {
    setFetchLoading(true);
    try {
      const p = await getPage(id);
      setPage(p);
      setTitle(p.title);
      setSite(p.site ?? 'main');
      setContent(p.content);
      setSeoTitle(p.seoTitle ?? '');
      setSeoDescription(p.seoDescription ?? '');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load page');
    } finally {
      setFetchLoading(false);
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      await updatePage(id, {
        title,
        content,
        site,
        seoTitle: seoTitle || undefined,
        seoDescription: seoDescription || undefined,
      });
      router.push('/pages');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save page');
    } finally {
      setSaving(false);
    }
  }

  async function handlePublish() {
    setError(null);
    setPublishing(true);
    try {
      await publishPage(id);
      await fetchPage();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish page');
    } finally {
      setPublishing(false);
    }
  }

  if (!ready)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-400">Loading...</div>
      </div>
    );

  if (fetchLoading)
    return (
      <div className="flex items-center justify-center py-24 text-gray-400">
        <Loader2 size={24} className="animate-spin mr-2" />
        Loading page…
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Back */}
      <Link
        href="/pages"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
      >
        <ArrowLeft size={15} />
        Back to Pages
      </Link>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Edit Page</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            Status:{' '}
            <span
              className={`font-medium capitalize ${
                page?.status === 'published'
                  ? 'text-green-600'
                  : page?.status === 'archived'
                  ? 'text-red-500'
                  : 'text-gray-500'
              }`}
            >
              {page?.status ?? 'draft'}
            </span>
          </p>
        </div>
        {page?.status === 'draft' && (
          <button
            onClick={handlePublish}
            disabled={publishing}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {publishing ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Globe size={14} />
            )}
            Publish
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 space-y-5">
          <h3 className="text-sm font-semibold text-gray-700 border-b border-gray-100 pb-3">
            Page Details
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
            />
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={10}
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition resize-y"
            />
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 space-y-5">
          <h3 className="text-sm font-semibold text-gray-700 border-b border-gray-100 pb-3">
            SEO (optional)
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              SEO Title
            </label>
            <input
              type="text"
              value={seoTitle}
              onChange={(e) => setSeoTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              SEO Description
            </label>
            <textarea
              value={seoDescription}
              onChange={(e) => setSeoDescription(e.target.value)}
              rows={3}
              className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition resize-none"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pb-6">
          <Link
            href="/pages"
            className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
          >
            {saving && <Loader2 size={15} className="animate-spin" />}
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
