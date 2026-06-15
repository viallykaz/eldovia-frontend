import Link from 'next/link';
import { Calendar, ArrowRight, Tag } from 'lucide-react';
import { AnimatedSection } from '@eldovia/ui';
import { getNewsArticles, NewsArticle } from '@/lib/api';

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

function ArticleCard({ article }: { article: NewsArticle }) {
  const cat = (article.category ?? 'news').toLowerCase().replace(/ /g, '_');
  return (
    <div className="group rounded-3xl border border-black/8 dark:border-white/8 bg-black/[0.02] dark:bg-white/[0.02] overflow-hidden hover:border-green-800/30 transition-all duration-300">
      <div
        className="h-32 flex items-center justify-center"
        style={
          article.coverImageUrl
            ? { backgroundImage: `url(${article.coverImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
            : { background: 'linear-gradient(135deg, #0a2318 0%, #0d5730 100%)' }
        }
      >
        {!article.coverImageUrl && <Tag size={30} className="opacity-10 text-green-400" />}
      </div>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <span
            className="rounded-full px-2.5 py-0.5 text-[10px] font-semibold capitalize"
            style={{
              background: categoryColors[cat] ?? 'rgba(13,87,48,0.15)',
              color: categoryText[cat] ?? '#4ade80',
            }}
          >
            {article.category ?? 'News'}
          </span>
        </div>
        <h3 className="font-semibold text-gray-900 dark:text-white leading-snug mb-2 text-sm">{article.title}</h3>
        <p className="text-xs text-gray-500 dark:text-white/40 leading-relaxed mb-4 line-clamp-2">{article.excerpt}</p>
        <div className="flex items-center justify-between">
          <span className="text-[10px] text-gray-400 dark:text-white/25 flex items-center gap-1">
            <Calendar size={10} />
            {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : ''}
          </span>
          <Link
            href={`/news/${article.slug}`}
            className="text-xs font-medium flex items-center gap-1 transition-all hover:gap-2"
            style={{ color: '#22c55e' }}
          >
            Read <ArrowRight size={11} />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default async function NewsPage() {
  let articles: NewsArticle[] = [];
  try {
    articles = await getNewsArticles({ limit: 20 });
  } catch {
    // show empty state if API fails
  }

  const [featured, ...rest] = articles;
  const cat = featured ? (featured.category ?? 'news').toLowerCase().replace(/ /g, '_') : '';

  return (
    <main className="bg-white dark:bg-[#0C0C0C] min-h-screen pt-24 pb-20">
      <div className="mx-auto max-w-7xl px-6">
        <AnimatedSection className="mb-12">
          <p className="text-xs uppercase tracking-widest mb-2" style={{ color: '#22c55e' }}>Newsroom</p>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white sm:text-4xl">
            Latest from{' '}
            <span className="bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(90deg, #22c55e, #4ade80)' }}>
              the field
            </span>
          </h1>
        </AnimatedSection>

        {articles.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 dark:text-white/40">No articles published yet. Check back soon.</p>
          </div>
        ) : (
          <>
            {/* Featured article */}
            {featured && (
              <AnimatedSection className="mb-10">
                <div className="group rounded-3xl border border-black/8 dark:border-white/8 bg-black/[0.02] dark:bg-white/[0.02] overflow-hidden hover:border-green-800/30 transition-all duration-300">
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    <div
                      className="h-52 lg:h-auto flex items-center justify-center"
                      style={
                        featured.coverImageUrl
                          ? { backgroundImage: `url(${featured.coverImageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }
                          : { background: 'linear-gradient(135deg, #071A0E 0%, #0a2318 60%, #0d5730 100%)' }
                      }
                    >
                      {!featured.coverImageUrl && <div className="text-6xl font-black text-white/5 select-none">NEWS</div>}
                    </div>
                    <div className="p-8">
                      <div className="flex items-center gap-3 mb-4">
                        <span
                          className="rounded-full px-3 py-1 text-xs font-semibold capitalize"
                          style={{
                            background: categoryColors[cat] ?? 'rgba(13,87,48,0.15)',
                            color: categoryText[cat] ?? '#4ade80',
                          }}
                        >
                          {featured.category ?? 'News'}
                        </span>
                        <span className="text-xs text-gray-400 dark:text-white/25">Featured</span>
                      </div>
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 leading-snug">{featured.title}</h2>
                      <p className="text-sm text-gray-500 dark:text-white/45 leading-relaxed mb-5">{featured.excerpt}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-gray-400 dark:text-white/25">
                          <span className="flex items-center gap-1">
                            <Calendar size={11} />
                            {featured.publishedAt ? new Date(featured.publishedAt).toLocaleDateString() : ''}
                          </span>
                        </div>
                        <Link
                          href={`/news/${featured.slug}`}
                          className="flex items-center gap-1.5 text-sm font-medium hover:gap-2.5 transition-all"
                          style={{ color: '#22c55e' }}
                        >
                          Read More <ArrowRight size={14} />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </AnimatedSection>
            )}

            {/* Article grid */}
            {rest.length > 0 && (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((article, i) => (
                  <AnimatedSection key={article.id} delay={i * 0.08}>
                    <ArticleCard article={article} />
                  </AnimatedSection>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
