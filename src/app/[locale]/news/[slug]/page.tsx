import { getTranslations } from 'next-intl/server';
import SafeImage from '@/components/ui/SafeImage';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/server';
import { Calendar, ChevronLeft } from 'lucide-react';

const MOCK_NEWS = [
  {
    id: 'news-1',
    title_vi: 'Khai Trương Cửa Hàng EGGU Đầu Tiên Tại Phố Đi Bộ Nguyễn Huệ!',
    title_en: 'Grand Opening of First EGGU Store on Nguyen Hue Walking Street!',
    slug: 'grand-opening-nguyen-hue',
    summary_vi: 'Chào đón thành viên đầu tiên tại trung tâm Sài Gòn sôi động cùng chuỗi sự kiện đặc biệt rinh quà miễn phí.',
    summary_en: 'Join the grand opening events of our first branch in Ho Chi Minh City with free signature sandwiches and exclusive discounts.',
    content_vi: '<p>Chúng tôi vô cùng tự hào thông báo chi nhánh đầu tiên của chuỗi bánh mì kẹp trứng bơ sữa cao cấp EGGU sẽ chính thức đi vào hoạt động tại địa chỉ 123 Nguyễn Huệ, Quận 1 bắt đầu từ ngày 25/08/2026. Hãy đến chung vui để nhận ngập tràn ưu đãi Mua 1 Tặng 1 dành cho Mr. Egg và cùng trải nghiệm không gian F&B chuẩn phong cách Hàn Quốc trẻ trung, thanh lịch!</p><p>Sản phẩm của chúng tôi được tuyển chọn từ nguồn nguyên liệu tuyệt hảo nhất: bánh mì brioche mềm xốp được đặt hàng nướng tươi mỗi ngày, kết hợp cùng phô mai Cheddar béo ngậy và đặc biệt là lớp trứng bác (scrambled egg) bông mịn chế biến từ bơ lạt nguyên chất.</p>',
    content_en: '<p>We are thrilled to announce the official grand opening of our very first premium Korean Egg Sandwich store at 123 Nguyen Hue, District 1 starting August 25, 2026. Come celebrate with us to receive a Buy 1 Get 1 Free promotion on our classic Mr. Egg and immerse yourself in a modern, cozy Korean F&B aesthetic!</p><p>All sandwiches are crafted with the highest precision and ingredients: fresh soft scrambled eggs, melted real Cheddar cheese, garlic-butter toasted brioche buns, and signature sauces.</p>',
    thumbnail_url: '/images/hero-sandwich.jpg',
    published_at: new Date('2026-08-22T17:00:00+07:00').toISOString(),
  },
];

interface NewsDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { locale, slug } = await params;
  const t = await getTranslations('news');
  const isVi = locale === 'vi';

  // Fetch article matching slug from Supabase
  let article = MOCK_NEWS.find((n) => n.slug === slug);
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
  } catch (error) {
    console.error('Supabase query failed on news detail page, using mock fallbacks:', error);
  }

  if (!article) {
    notFound();
  }

  const formattedDate = new Date(article.published_at).toLocaleDateString(
    isVi ? 'vi-VN' : 'en-US',
    { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }
  );

  return (
    <div className="min-h-screen bg-[#F8F9FA] pt-24 md:pt-28 pb-12 md:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto space-y-8">
        {/* Back Link */}
        <div>
          <Link
            href="/news"
            className="inline-flex items-center space-x-2 text-sm font-bold uppercase tracking-wider text-[#6B7280] hover:text-[#E53935] transition duration-150"
          >
            <ChevronLeft className="w-4 h-4 text-[#E53935]" />
            <span>{t('backToNews')}</span>
          </Link>
        </div>

        {/* Date and title */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-xs font-bold text-[#9CA3AF]">
            <Calendar className="w-3.5 h-3.5 text-[#E53935]" />
            <span>{formattedDate}</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-[#111111] leading-tight">
            {isVi ? article.title_vi : article.title_en}
          </h1>
        </div>

        {/* Hero image banner */}
        <div className="relative aspect-video w-full rounded-3xl overflow-hidden border border-[#E5E7EB] shadow-lg">
          <SafeImage
            src={article.thumbnail_url || '/images/hero-sandwich.jpg'}
            alt={isVi ? article.title_vi : article.title_en}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 900px"
            className="object-cover"
          />
        </div>

        {/* Article Body Content */}
        <article
          className="prose prose-neutral max-w-none text-[#1E1B18] font-medium leading-relaxed space-y-6 pt-4"
          dangerouslySetInnerHTML={{ __html: isVi ? (article.content_vi || '') : (article.content_en || '') }}
        />
      </div>
    </div>
  </div>
  );
}
