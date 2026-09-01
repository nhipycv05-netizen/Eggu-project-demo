import { getTranslations } from 'next-intl/server';
import SafeImage from '@/components/ui/SafeImage';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/server';
import { Calendar } from 'lucide-react';

const MOCK_NEWS = [
  {
    id: 'news-1',
    title_vi: 'Khai Trương Cửa Hàng EGGU Đầu Tiên Tại Phố Đi Bộ Nguyễn Huệ!',
    title_en: 'Grand Opening of First EGGU Store on Nguyen Hue Walking Street!',
    slug: 'grand-opening-nguyen-hue',
    summary_vi: 'Chào đón thành viên đầu tiên tại trung tâm Sài Gòn sôi động cùng chuỗi sự kiện đặc biệt rinh quà miễn phí.',
    summary_en: 'Join the grand opening events of our first branch in Ho Chi Minh City with free signature sandwiches and exclusive discounts.',
    thumbnail_url: '/images/hero-sandwich.jpg',
    published_at: new Date('2026-08-22T17:00:00+07:00').toISOString(),
  },
];

interface NewsPageProps {
  params: Promise<{ locale: string }>;
}

export default async function NewsPage({ params }: NewsPageProps) {
  const { locale } = await params;
  const t = await getTranslations('news');
  const isVi = locale === 'vi';

  // Fetch articles from Supabase
  let articles = MOCK_NEWS;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('news')
      .select('*')
      .eq('status', 'PUBLISHED')
      .order('published_at', { ascending: false });
    
    if (data && data.length > 0) {
      articles = data;
    }
  } catch (error) {
    console.error('Supabase query failed on news page, using mock fallbacks:', error);
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-24 md:pt-28 pb-12 md:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 md:space-y-16">
        {/* Title Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-[#f8c400] text-xs font-black uppercase tracking-widest block">
            {isVi ? 'Bản Tin EGGU' : 'Brand News'}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#1E1B18]">
            {t('title')}
          </h1>
          <p className="text-sm md:text-base text-[#706860] font-medium leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {articles.map((article) => {
            const formattedDate = new Date(article.published_at).toLocaleDateString(
              isVi ? 'vi-VN' : 'en-US',
              { year: 'numeric', month: 'long', day: 'numeric' }
            );

            return (
              <div
                key={article.id}
                className="bg-white rounded-3xl overflow-hidden border border-[#E5E7EB] group hover:border-[#E53935]/40 hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden bg-neutral-100">
                  <SafeImage
                    src={article.thumbnail_url || '/images/hero-sandwich.jpg'}
                    alt={isVi ? article.title_vi : article.title_en}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 380px"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Content */}
                <div className="p-6 flex-grow flex flex-col justify-between space-y-6">
                  <div className="space-y-3">
                    {/* Date */}
                    <div className="flex items-center space-x-2 text-xs font-bold text-[#9CA3AF]">
                      <Calendar className="w-3.5 h-3.5 text-[#E53935]" />
                      <span>{formattedDate}</span>
                    </div>
                    {/* Title */}
                    <h3 className="text-lg font-black text-[#111111] line-clamp-2 leading-snug group-hover:text-[#E53935] transition duration-200">
                      {isVi ? article.title_vi : article.title_en}
                    </h3>
                    {/* Summary */}
                    <p className="text-xs text-[#6B7280] leading-relaxed line-clamp-3 font-medium">
                      {isVi ? article.summary_vi : article.summary_en}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-[#E5E7EB] flex">
                    <Link
                      href={`/news/${article.slug}`}
                      className="text-xs font-black uppercase tracking-wider text-[#E53935] hover:text-[#D32F2F] transition duration-150"
                    >
                      {t('readMore')} →
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
