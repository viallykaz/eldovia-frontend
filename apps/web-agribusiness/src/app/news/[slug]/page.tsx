import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Tag } from 'lucide-react';
import { getNewsArticleBySlug } from '@/lib/api';

const categoryColors: Record<string, string> = {
  reports: 'rgba(59,130,246,0.15)',
  project_news: 'rgba(13,87,48,0.15)',
  partnerships: 'rgba(168,85,247,0.15)',
  impact: 'rgba(34,197,94,0.15)',
  investment: 'rgba(234,179,8,0.12)',
};
const categoryText: Record<string, string> = {
  reports: '#60a5fa',
  project_news: '#4ade80',
  partnerships: '#c084fc',
  impact: '#22c55e',
  investment: '#facc15',
};

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let article;
  try {
    article = await getNewsArticleBySlug(slug);
  } catch {
    notFound();
  }

  const cat = (article.category ?? 'news').toLowerCase().replace(/ /g, '_');
  const catColor = categoryText[cat] ?? '#4ade80';
  const catBg = categoryColors[cat] ?? 'rgba(13,87,48,0.15)';

  return (
    <main className="bg-white dark:bg-[#0C0C0C] min-h-screen pb-20">
      {/* Cover image / Hero */}
      <div
        className="relative pt-24 pb-12"
        style={
          article.coverImageUrl
            ? {
                backgroundImage: `linear-gradient(to bottom, rgba(7,26,14,0.75), rgba(7,26,14,0.92)), url(${article.coverImageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }
            : { background: 'linear-gradient(135deg, #071A0E 0%, #0a2318 60%, #0d5730 100%)' }
        }
      >
        <div className="mx-auto max-w-3xl px-6">
          <Link
            href="/news"
            className="mb-8 inline-flex items-center gap-2 text-sm text-white/50 hover:text-white transition"
          >
            <ArrowLeft size={14} />
            Back to Newsroom
          </Link>

          <div className="flex items-center gap-3 mb-4">
            <span
              className="rounded-full px-3 py-1 text-xs font-semibold capitalize"
              style={{ background: catBg, color: catColor }}
            >
              {article.category ?? 'News'}
            </span>
            {article.publishedAt && (
              <span className="flex items-center gap-1 text-xs text-white/40">
                <Calendar size={11} />
                {new Date(article.publishedAt).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric',
                })}
              </span>
            )}
          </div>

          <h1 className="text-3xl font-bold text-white leading-tight mb-4 sm:text-4xl">
            {article.title}
          </h1>
          <p className="text-white/60 text-sm leading-relaxed max-w-2xl">
            {article.excerpt}
          </p>
        </div>
      </div>

      {/* Article body */}
      <div className="mx-auto max-w-3xl px-6 pt-10">
        {/* Tags */}
        {article.tags && article.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 rounded-full border border-black/8 dark:border-white/8 px-2.5 py-1 text-xs text-gray-500 dark:text-white/40"
              >
                <Tag size={9} />
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Content */}
        <div className="prose prose-sm prose-gray dark:prose-invert max-w-none">
          {article.content.split('\n').map((para, i) =>
            para.trim() ? (
              <p key={i} className="text-gray-700 dark:text-white/70 leading-relaxed mb-4 text-sm">
                {para}
              </p>
            ) : (
              <br key={i} />
            ),
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-black/8 dark:border-white/8 flex items-center justify-between">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-sm text-gray-500 dark:text-white/40 hover:text-gray-900 dark:hover:text-white transition"
          >
            <ArrowLeft size={14} />
            All articles
          </Link>
          {article.publishedAt && (
            <span className="text-xs text-gray-400 dark:text-white/25">
              Published {new Date(article.publishedAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </main>
  );
}
