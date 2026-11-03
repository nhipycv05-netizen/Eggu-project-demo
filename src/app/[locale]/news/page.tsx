import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { MOCK_NEWS_ARTICLES } from '@/lib/mockNews';
import { getCanonicalUrl, getAlternateLanguages } from '@/lib/seo';
import TikTokNewsContainer from '@/components/news/TikTokNewsContainer';

export const dynamic = 'force-dynamic';

interface NewsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: NewsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isVi = locale === 'vi';
  const canonicalUrl = getCanonicalUrl('/news', locale);
  const alternates = getAlternateLanguages('/news');

  return {
    title: isVi
      ? 'Tin Tức & Video TikTok | EGGU - Sandwich Trứng Hàn Quốc'
      : 'News & TikTok Videos | EGGU Hanoi',
    description: isVi
      ? 'Khám phá video TikTok triệu view, tin tức và các chương trình ưu đãi hấp dẫn từ EGGU - Sandwich Trứng Hàn Quốc tại Hà Nội.'
      : 'Explore trending TikTok videos, latest news, promotions and culinary stories from EGGU Korean Egg Sandwich Hanoi.',
    keywords: [
      'Tin tức EGGU',
      'TikTok EGGU',
      'EGGU Sandwich TikTok',
      'Sandwich Trứng Hàn Quốc',
      'Korean Egg Sandwich',
      'Bánh mì sandwich Hà Nội',
    ],
    alternates: {
      canonical: canonicalUrl,
      languages: alternates,
    },
    openGraph: {
      title: isVi
        ? 'Tin Tức & Video TikTok | EGGU'
        : 'News & TikTok Videos | EGGU',
      description: isVi
        ? 'Video TikTok và tin tức mới nhất từ thương hiệu Sandwich Trứng Hàn Quốc EGGU.'
        : 'Latest TikTok videos and news from EGGU Korean Egg Sandwich.',
      url: canonicalUrl,
      siteName: 'EGGU',
    },
  };
}

export default async function NewsPage({ params }: NewsPageProps) {
  const { locale } = await params;
  const t = await getTranslations('news');

  // Fetch articles from Supabase (accepts both uppercase PUBLISHED and lowercase published)
  let articles = MOCK_NEWS_ARTICLES;
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .in('status', ['PUBLISHED', 'published'])
      .order('published_at', { ascending: false });

    if (!error && data && data.length > 0) {
      articles = data;
    }
  } catch (error) {
    console.error('Supabase query failed on news page, using mock fallbacks:', error);
  }

  return (
    <div className="min-h-screen bg-transparent pt-24 md:pt-28 pb-16 md:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TikTokNewsContainer
          articles={articles}
          locale={locale}
          title={t('title')}
          readMoreText={t('readMore')}
          emptyNewsText={t('emptyNews')}
        />
      </div>
    </div>
  );
}
