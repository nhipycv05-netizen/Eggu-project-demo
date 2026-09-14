import { getTranslations } from 'next-intl/server';
import SafeImage from '@/components/ui/SafeImage';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/server';
import { Calendar, ChevronLeft, ChevronRight, FileText, ArrowRight } from 'lucide-react';
import { MOCK_NEWS_ARTICLES } from '@/lib/mockNews';

export const dynamic = 'force-dynamic';

interface NewsDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { locale, slug } = await params;
  const t = await getTranslations('news');
  const isVi = locale === 'vi';

  // 1. Fetch current article matching slug
  let article = MOCK_NEWS_ARTICLES.find((n) => n.slug === slug);
  let relatedArticles: any[] = [];

  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('news')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'PUBLISHED')
      .single();

    if (data) {
      article = data;
    }

    // 2. Fetch other published articles directly from Admin database for Related Posts
    if (article?.id) {
      const { data: related } = await supabase
        .from('news')
        .select('*')
        .eq('status', 'PUBLISHED')
        .neq('id', article.id)
        .order('published_at', { ascending: false })
        .limit(3);

      if (related && related.length > 0) {
        relatedArticles = related;
      }
    } else if (article?.slug) {
      const { data: related } = await supabase
        .from('news')
        .select('*')
        .eq('status', 'PUBLISHED')
        .neq('slug', article.slug)
        .order('published_at', { ascending: false })
        .limit(3);

      if (related && related.length > 0) {
        relatedArticles = related;
      }
    }
  } catch (error) {
    console.error('Supabase query failed on news detail page:', error);
  }

  if (!article) {
    notFound();
  }

  const title = (isVi ? article.title_vi : article.title_en) || article.title_vi;
  const content = (isVi ? article.content_vi : article.content_en) || article.content_vi || '';
  const formattedDate = new Date(article.published_at).toLocaleDateString(
    isVi ? 'vi-VN' : 'en-US',
    { day: '2-digit', month: '2-digit', year: '2-digit' }
  );

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-24 md:pt-28 pb-16 md:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link Button */}
        <div className="mb-6">
          <Link
            href="/news"
            className="inline-flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-[#6B7280] hover:text-[#e0352b] transition duration-150"
          >
            <ChevronLeft className="w-4 h-4 text-[#e0352b]" />
            <span>{t('backToNews')}</span>
          </Link>
        </div>

        {/* 2-Column Layout */}
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
          {/* Left Column (Sidebar: 25% - 30%) */}
          <aside className="w-full lg:w-[28%] shrink-0">
            <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-2xs">
              {/* Sidebar Header with brand red background */}
              <div className="bg-[#e0352b] px-5 py-3.5 text-white font-black text-sm uppercase tracking-wider">
                {isVi ? 'DANH MỤC TIN TỨC' : 'NEWS CATEGORIES'}
              </div>

              {/* Sidebar Menu Item - Only 'Tất cả bài viết' */}
              <nav className="p-3">
                <Link
                  href="/news"
                  className="flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-bold text-neutral-800 hover:text-[#e0352b] hover:bg-[#FFF5F5] transition"
                >
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-[#e0352b]" />
                    <span>{isVi ? 'Tất cả bài viết' : 'All Articles'}</span>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                </Link>
              </nav>
            </div>
          </aside>

          {/* Right Column (Article Content + Related Posts: 70% - 75%) */}
          <main className="w-full lg:w-[72%] space-y-8 text-left">
            {/* Header: Title & Published Date */}
            <header className="space-y-2 border-b border-neutral-200 pb-4 text-left">
              <h1 className="font-bold text-2xl sm:text-3xl tracking-wide uppercase text-[#2b2523] leading-snug">
                {title}
              </h1>

              <div className="flex items-center space-x-1.5 text-xs sm:text-[13px] text-neutral-500 font-medium">
                <Calendar className="w-3.5 h-3.5 text-[#e0352b]" />
                <span>{formattedDate}</span>
              </div>
            </header>

            {/* Content rendered directly on page background with comfortable line-height and compact readable font */}
            <div className="text-left">
              {content.includes('<p>') || content.includes('<br') || content.includes('<div>') || content.includes('<h3>') ? (
                <div
                  className="text-sm sm:text-[13.5px] text-[#333] leading-relaxed space-y-4 text-left whitespace-pre-line
                    [&>h2]:text-lg [&>h2]:font-bold [&>h2]:text-[#2b2523] [&>h2]:mt-6 [&>h2]:mb-2
                    [&>h3]:text-base [&>h3]:font-bold [&>h3]:text-[#2b2523] [&>h3]:mt-4 [&>h3]:mb-1.5
                    [&>p]:text-sm [&>p]:sm:text-[13.5px] [&>p]:text-[#333] [&>p]:leading-relaxed [&>p]:mb-3
                    [&>ul]:list-disc [&>ul]:pl-5 [&>ul]:space-y-1.5 [&>ul]:text-sm [&>ul]:sm:text-[13.5px] [&>ul]:text-[#333] [&>ul]:my-3
                    [&>ol]:list-decimal [&>ol]:pl-5 [&>ol]:space-y-1.5 [&>ol]:text-sm [&>ol]:sm:text-[13.5px] [&>ol]:text-[#333] [&>ol]:my-3
                    [&>strong]:text-[#111] [&>strong]:font-bold"
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              ) : (
                <div className="whitespace-pre-line text-sm sm:text-[13.5px] text-[#333] leading-relaxed text-left space-y-4">
                  {content}
                </div>
              )}
            </div>

            {/* Related Articles Section (Restored right below article content, auto-hidden if empty) */}
            {relatedArticles.length > 0 && (
              <section className="space-y-5 pt-8 border-t border-neutral-200 text-left">
                <div className="flex items-center justify-between">
                  <h3 className="text-base sm:text-lg font-black text-[#2b2523] uppercase tracking-wide">
                    {t('relatedArticles')}
                  </h3>
                  <Link
                    href="/news"
                    className="text-xs font-bold text-[#e0352b] hover:underline inline-flex items-center gap-1"
                  >
                    <span>{isVi ? 'Xem tất cả' : 'View all'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {relatedArticles.map((item) => {
                    const itemTitle = (isVi ? item.title_vi : item.title_en) || item.title_vi;
                    const itemDate = new Date(item.published_at).toLocaleDateString(
                      isVi ? 'vi-VN' : 'en-US',
                      { day: '2-digit', month: '2-digit', year: '2-digit' }
                    );

                    return (
                      <Link
                        key={item.id}
                        href={`/news/${item.slug}`}
                        className="bg-white rounded-2xl p-4 border border-neutral-200 hover:border-[#e0352b]/40 hover:shadow-md transition-all group flex flex-col justify-between text-left"
                      >
                        <div className="space-y-3">
                          <div className="relative aspect-video rounded-xl overflow-hidden bg-neutral-100">
                            <SafeImage
                              src={item.thumbnail_url || '/images/hero-sandwich.jpg'}
                              alt={itemTitle}
                              fill
                              sizes="280px"
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                          <div className="flex items-center gap-1 text-[11px] font-bold text-[#9CA3AF]">
                            <Calendar className="w-3 h-3 text-[#e0352b]" />
                            <span>{itemDate}</span>
                          </div>
                          <h4 className="text-xs font-bold text-[#2b2523] group-hover:text-[#e0352b] transition-colors line-clamp-2 leading-snug">
                            {itemTitle}
                          </h4>
                        </div>

                        <div className="pt-3 mt-3 border-t border-neutral-100 text-[11px] font-black uppercase text-[#e0352b] flex items-center justify-between">
                          <span>{t('readMore')}</span>
                          <ArrowRight className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
