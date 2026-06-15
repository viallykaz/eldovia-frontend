'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Pencil, Globe, Loader2 } from 'lucide-react';
import { getToken } from '@/lib/auth';
import { getPages, publishPage, CmsPage } from '@/lib/api';

const STATUS_BADGE: Record<
  string,
  { label: string; className: string }
> = {
  draft: {
    label: 'Draft',
    className: 'bg-gray-100 text-gray-600',
  },
  published: {
    label: 'Published',
    className: 'bg-green-100 text-green-700',
  },
  archived: {
    label: 'Archived',
    className: 'bg-red-100 text-red-600',
  },
};

export default function PagesListPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [pages, setPages] = useState<CmsPage[]>([]);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!getToken()) {
      router.replace('/login');
      return;
    }
    setReady(true);
    fetchPages();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchPages() {
    setLoading(true);
    setError(null);
    try {
      const pages = await getPages();
      setPages(pages ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load pages');
    } finally {
      setLoading(false);
    }
  }

  async function handlePublish(id: string) {
    setPublishing(id);
    try {
      await publishPage(id);
      await fetchPages();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to publish page');
    } finally {
      setPublishing(null);
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
          <h2 className="text-lg font-semibold text-gray-900">Pages</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            {pages.length} page{pages.length !== 1 ? 's' : ''}
          </p>
        </div>
        <Link
          href="/pages/new"
          className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Plus size={16} />
          New Page
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {error}
          <button
            onClick={fetchPages}
            className="ml-3 underline hover:no-underline"
          >
            Retry
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-400">
            <Loader2 size={24} className="animate-spin mr-2" />
            Loading pages…
          </div>
        ) : pages.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-sm">No pages found.</p>
            <Link
              href="/pages/new"
              className="mt-3 inline-flex items-center gap-1.5 text-sm text-orange-500 hover:text-orange-600 font-medium"
            >
              <Plus size={15} /> Create the first page
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">
                  Title
                </th>
                <th className="text-left px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">
                  Slug
                </th>
                <th className="text-left px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">
                  Status
                </th>
                <th className="text-left px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">
                  Site
                </th>
                <th className="text-left px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">
                  Created
                </th>
                <th className="text-right px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {pages.map((page) => {
                const badge = STATUS_BADGE[page.status] ?? STATUS_BADGE.draft;
                return (
                  <tr key={page.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5 font-medium text-gray-900 max-w-xs truncate">
                      {page.title}
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 font-mono text-xs">
                      /{page.slug}
                    </td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${badge.className}`}
                      >
                        {badge.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 capitalize">
                      {page.site ?? '—'}
                    </td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs">
                      {new Date(page.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-2">
                        {page.status === 'draft' && (
                          <button
                            onClick={() => handlePublish(page.id)}
                            disabled={publishing === page.id}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-md transition-colors disabled:opacity-60"
                          >
                            {publishing === page.id ? (
                              <Loader2 size={12} className="animate-spin" />
                            ) : (
                              <Globe size={12} />
                            )}
                            Publish
                          </button>
                        )}
                        <Link
                          href={`/pages/${page.id}`}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                        >
                          <Pencil size={12} />
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
