import { getTranslations } from 'next-intl/server';
import SafeImage from '@/components/ui/SafeImage';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/server';
import { Calendar, ArrowRight, Newspaper } from 'lucide-react';
import { MOCK_NEWS_ARTICLES } from '@/lib/mockNews';

export const dynamic = 'force-dynamic';

interface NewsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function NewsPage({ params }: NewsPageProps) {
  const { locale } = await params;
  const t = await getTranslations('news');
  const isVi = locale === 'vi';

  // Fetch articles from Supabase
  let articles = MOCK_NEWS_ARTICLES;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('status', 'PUBLISHED')
      .order('published_at', { ascending: false });

    if (!error && data && data.length > 0) {
      articles = data;
    }
  } catch (error) {
    console.error('Supabase query failed on news page, using mock fallbacks:', error);
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-24 md:pt-28 pb-16 md:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 md:space-y-10">
        {/* Title Header (Minimalist Left-Aligned) */}
        <div className="border-b border-[#e0352b]/20 pb-3 mb-6 text-left">
          <h1 className="text-xl font-bold uppercase tracking-wider text-[#e0352b]">
            {t('title')}
          </h1>
        </div>

        {/* News Grid */}
        {articles.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#E5E7EB] space-y-3">
            <Newspaper className="w-12 h-12 text-[#9CA3AF] mx-auto" />
            <p className="text-neutral-500 font-bold">{t('emptyNews')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {articles.map((article) => {
              const formattedDate = new Date(article.published_at).toLocaleDateString(
                isVi ? 'vi-VN' : 'en-US',
                { year: 'numeric', month: 'long', day: 'numeric' }
              );

              const title = (isVi ? article.title_vi : article.title_en) || article.title_vi;
              const summary = (isVi ? article.summary_vi : article.summary_en) || article.summary_vi;

              return (
                <article
                  key={article.id}
                  className="bg-white rounded-3xl overflow-hidden border border-[#E5E7EB] group hover:border-[#E53935]/40 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  {/* Thumbnail */}
                  <Link href={`/news/${article.slug}`} className="block relative aspect-video overflow-hidden bg-neutral-100">
                    <SafeImage
                      src={article.thumbnail_url || '/images/hero-sandwich.jpg'}
                      alt={title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 380px"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 bg-[#1E1B18]/80 backdrop-blur-xs text-white px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider">
                      {isVi ? 'Tin tức' : 'News'}
                    </div>
                  </Link>

                  {/* Content */}
                  <div className="p-6 flex-grow flex flex-col justify-between space-y-6">
                    <div className="space-y-3">
                      {/* Date */}
                      <div className="flex items-center space-x-2 text-xs font-bold text-[#9CA3AF]">
                        <Calendar className="w-3.5 h-3.5 text-[#E53935]" />
                        <span>{formattedDate}</span>
                      </div>

                      {/* Title */}
                      <h2 className="text-lg font-black text-[#111111] line-clamp-2 leading-snug group-hover:text-[#E53935] transition duration-200">
                        <Link href={`/news/${article.slug}`}>
                          {title}
                        </Link>
                      </h2>

                      {/* Summary */}
                      <p className="text-xs text-[#6B7280] leading-relaxed line-clamp-3 font-medium">
                        {summary}
                      </p>
                    </div>

                    {/* Footer / CTA */}
                    <div className="pt-4 border-t border-[#E5E7EB] flex items-center justify-between">
                      <Link
                        href={`/news/${article.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-[#E53935] group-hover:text-[#D32F2F] transition duration-150"
                      >
                        <span>{t('readMore')}</span>
                        <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
