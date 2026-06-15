'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Plus, Pencil, Globe, Archive, Loader2, Newspaper, Star } from 'lucide-react';
import { getToken } from '@/lib/auth';
import { getNewsAdmin, publishNewsArticle, archiveNewsArticle, updateNewsArticle, NewsArticle } from '@/lib/api';

export default function NewsPage() {
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const PAGE_LIMIT = 20;

  useEffect(() => {
    if (!getToken()) { router.replace('/login'); return; }
    setReady(true);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchArticles = useCallback(async (p = page) => {
    setLoading(true);
    setError(null);
    try {
      const res = await getNewsAdmin({ page: p, limit: PAGE_LIMIT });
      setArticles(res.data ?? []);
      setTotal(res.total ?? 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load articles');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    if (ready) fetchArticles(page);
  }, [ready, page, fetchArticles]);

  async function handlePublish(id: string) {
    setActionLoading(`publish-${id}`);
    try {
      await publishNewsArticle(id);
      await fetchArticles(page);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to publish');
    } finally {
      setActionLoading(null);
    }
  }

  async function handleArchive(article: NewsArticle) {
    if (!confirm(`Archive "${article.title}"?`)) return;
    setActionLoading(`archive-${article.id}`);
    try {
      await archiveNewsArticle(article.id);
      setArticles((prev) => prev.filter((a) => a.id !== article.id));
      setTotal((t) => Math.max(0, t - 1));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to archive');
    } finally {
      setActionLoading(null);
    }
  }

  async function handleToggleFeatured(article: NewsArticle) {
    setActionLoading(`feat-${article.id}`);
    try {
      const updated = await updateNewsArticle(article.id, { isFeatured: !article.isFeatured });
      setArticles((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update');
    } finally {
      setActionLoading(null);
    }
  }

  const totalPages = Math.ceil(total / PAGE_LIMIT);

  if (!ready) return <div className="min-h-screen flex items-center justify-center"><div className="text-gray-400">Loading...</div></div>;

  return (
    <div className="max-w-7xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">News</h2>
          <p className="text-sm text-gray-500 mt-0.5">{total} article{total !== 1 ? 's' : ''}</p>
        </div>
        <Link href="/news/new" className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          <Plus size={16} /> New Article
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {error} <button onClick={() => fetchArticles(page)} className="ml-2 underline">Retry</button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-gray-100 rounded-xl shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-400">
            <Loader2 size={24} className="animate-spin mr-2" /> Loading articles…
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-20">
            <Newspaper size={40} className="text-gray-200 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No articles yet.</p>
            <Link href="/news/new" className="mt-3 inline-flex items-center gap-1.5 text-sm text-orange-500 font-medium">
              <Plus size={14} /> Write the first article
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[800px]">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {['Title', 'Category', 'Status', 'Featured', 'Published At', 'Actions'].map((h) => (
                    <th key={h} className={`px-5 py-3 font-medium text-gray-500 text-xs uppercase tracking-wide ${h === 'Actions' ? 'text-right' : 'text-left'}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {articles.map((article) => (
                  <tr key={article.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3.5 max-w-[280px]">
                      <Link href={`/news/${article.id}`} className="font-medium text-gray-900 hover:text-orange-600 transition-colors block truncate">
                        {article.title}
                      </Link>
                      <p className="text-xs text-gray-400 truncate">{article.excerpt?.slice(0, 60)}…</p>
                    </td>
                    <td className="px-5 py-3.5 text-gray-500 text-xs capitalize">
                      {article.category ?? '—'}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${article.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                        {article.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => handleToggleFeatured(article)}
                        disabled={actionLoading === `feat-${article.id}`}
                        title={article.isFeatured ? 'Remove from featured' : 'Mark as featured'}
                        className="transition-colors disabled:opacity-60"
                      >
                        {actionLoading === `feat-${article.id}` ? (
                          <Loader2 size={14} className="animate-spin text-gray-400" />
                        ) : (
                          <Star size={14} className={article.isFeatured ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} />
                        )}
                      </button>
                    </td>
                    <td className="px-5 py-3.5 text-gray-400 text-xs">
                      {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : '—'}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center justify-end gap-1.5">
                        {!article.isPublished && (
                          <button
                            onClick={() => handlePublish(article.id)}
                            disabled={actionLoading === `publish-${article.id}`}
                            className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-green-700 bg-green-50 hover:bg-green-100 rounded-md transition-colors disabled:opacity-60"
                          >
                            {actionLoading === `publish-${article.id}` ? <Loader2 size={11} className="animate-spin" /> : <Globe size={11} />}
                            Publish
                          </button>
                        )}
                        <Link href={`/news/${article.id}`} className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors">
                          <Pencil size={11} /> Edit
                        </Link>
                        <button
                          onClick={() => handleArchive(article)}
                          disabled={actionLoading === `archive-${article.id}`}
                          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors disabled:opacity-60"
                        >
                          {actionLoading === `archive-${article.id}` ? <Loader2 size={11} className="animate-spin" /> : <Archive size={11} />}
                          Archive
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Page {page} of {totalPages} · {total} total</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1 || loading}
              className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 transition-colors text-xs">
              Previous
            </button>
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages || loading}
              className="px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-40 transition-colors text-xs">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
