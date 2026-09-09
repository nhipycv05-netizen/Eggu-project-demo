import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/server';
import ProductCard from '@/components/menu/ProductCard';
import { ArrowRight, Clock, MapPin, ShoppingBag, Coffee, Croissant, IceCreamBowl, Salad } from 'lucide-react';

// Fallback mock products for visual demonstration when DB is not seeded yet
const MOCK_FEATURED = [
  {
    id: '9a999999-9999-9999-9999-999999999999',
    name_vi: 'Mr. Egg',
    name_en: 'Mr. Egg',
    slug: 'mr-egg',
    description_vi: 'Bánh mì nướng bơ tỏi thơm lừng kẹp trứng khuấy mềm béo và sốt sriracha ngọt dịu.',
    description_en: 'Garlic butter toast filled with fluffy soft-scrambled eggs and our signature sweet sriracha mayo.',
    price: 39000,
    image_url: '/images/hero-sandwich.jpg',
    is_new: false,
    is_best_seller: true,
  },
  {
    id: 'afaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    name_vi: 'Bánh Mì Thịt Nguội & Phô Mai',
    name_en: 'American Ham & Cheese',
    slug: 'american-ham-cheese',
    description_vi: 'Trứng khuấy bông mềm kết hợp thịt nguội cao cấp và phô mai Cheddar tan chảy.',
    description_en: 'Fluffy soft-scrambled eggs, premium ham slices, and melted Cheddar cheese.',
    price: 49000,
    image_url: '/images/hero-sandwich.jpg',
    is_new: false,
    is_best_seller: true,
  },
  {
    id: 'bfbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    name_vi: 'Bánh Mì Thịt Xông Khói & Phô Mai Kép',
    name_en: 'Bacon Double Cheese',
    slug: 'bacon-double-cheese',
    description_vi: 'Nhân đôi thịt xông khói giòn rụm kẹp phô mai Cheddar kép và trứng khuấy mềm béo.',
    description_en: 'Double crispy bacon, fluffy scrambled eggs, and double melted Cheddar cheese.',
    price: 55000,
    image_url: '/images/hero-sandwich.jpg',
    is_new: false,
    is_best_seller: true,
  },
  {
    id: 'cfcccccc-cccc-cccc-cccc-cccccccccccc',
    name_vi: 'Bơ Sáp Tươi Đặc Biệt',
    name_en: 'Avocado Holic',
    slug: 'avocado-holic',
    description_vi: 'Bơ sáp tươi thái lát bùi béo kết hợp trứng khuấy mềm và sốt trứng đặc chế.',
    description_en: 'Rich soft-scrambled eggs combined with fresh sliced creamy avocado and signature sauce.',
    price: 59000,
    image_url: '/images/hero-sandwich.jpg',
    is_new: true,
    is_best_seller: true,
  },
];

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const tc = await getTranslations('common');
  const tm = await getTranslations('menu');

  // Fetch featured products from Supabase with a fallback to mock data
  let products = MOCK_FEATURED;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('is_best_seller', true)
      .eq('is_active', true)
      .limit(4);

    if (data && data.length > 0) {
      products = data;
    }
  } catch (error) {
    console.error('Supabase query failed on homepage, using mock fallbacks:', error);
  }

  const isVi = locale === 'vi';

  return (
    <div className="flex min-h-screen flex-col bg-[#F8F9FA]">
      {/* 1. Hero Section */}
      <section className="pt-24 md:pt-28 pb-12 md:pb-16 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-white p-8 md:p-12 lg:p-16 shadow-sm border border-[#E5E7EB]">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-6 text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E53935]/10 text-[#E53935] text-xs font-black uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-[#E53935]" />
                  <span>{isVi ? 'Sandwich Trứng Chuẩn Vị Hàn Quốc' : 'Authentic Korean Egg Sandwich'}</span>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight text-[#111111] tracking-tight">
                  {isVi ? 'Bánh Mì Trứng Nóng Hổi Mỗi Ngày' : 'Freshly Toasted Gourmet Egg Sandwiches'}
                </h1>
                <p className="text-sm md:text-base lg:text-lg leading-relaxed text-[#6B7280] font-medium max-w-xl">
                  {isVi
                    ? 'Thưởng thức hương vị tươi mới, trứng khuấy bơ mềm mịn tan chảy cùng bánh mì Brioche nướng bơ tỏi giòn thơm chuẩn phong cách EGGDROP.'
                    : 'Indulge in fluffy golden scrambled eggs paired with thick-sliced French brioche toast and signature homemade sauces.'}
                </p>
                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link
                    href="/menu"
                    className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-[#E53935] text-white font-black text-sm uppercase tracking-wider hover:bg-[#D32F2F] transition-all shadow-md active:scale-95"
                  >
                    {tc('orderNow')}
                  </Link>
                  <Link
                    href="/about"
                    className="inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-[#FFC107] text-[#111111] font-black text-sm uppercase tracking-wider hover:bg-[#FFB300] transition-all shadow-xs"
                  >
                    {isVi ? 'Tìm hiểu thêm' : 'Learn More'}
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5 relative flex justify-center">
                <div className="relative w-full max-w-[420px] aspect-square rounded-3xl overflow-hidden shadow-xl border-4 border-[#F8F9FA] transform hover:scale-105 transition-transform duration-500">
                  <Image
                    src="/images/hero-sandwich.jpg"
                    alt="EGGU Sandwich"
                    fill
                    priority
                    sizes="(max-width: 1024px) 100vw, 420px"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Icons Row */}
      <section className="py-8 bg-white border-y border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6 text-center">
            {[
              ['Sandwich', ShoppingBag],
              ['Topping', Salad],
              ['Toast & Bread', Croissant],
              ['Coffee & Tea', Coffee],
              ['Fresh Drinks', IceCreamBowl],
            ].map(([label, Icon], index) => (
              <Link
                key={String(label)}
                href="/menu"
                className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-[#F8F9FA] hover:bg-white hover:border-[#E53935] border border-[#E5E7EB] transition-all duration-200 group shadow-xs"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-full transition-transform group-hover:scale-110 ${index === 0 ? 'bg-[#E53935] text-white' : 'bg-white text-[#111111] border border-[#E5E7EB]'}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-bold text-[#111111] group-hover:text-[#E53935] transition-colors">{label as string}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Featured Products Section */}
      <section className="py-12 md:py-16 bg-[#F8F9FA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E5E7EB] pb-4">
            <div>
              <span className="text-[#E53935] text-xs font-black uppercase tracking-widest block mb-1">
                {isVi ? 'Món Nổi Bật' : 'Featured Products'}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-[#111111]">
                {isVi ? 'Bestseller Được Yêu Thích' : 'Our Top Bestsellers'}
              </h2>
            </div>
            <Link
              href="/menu"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#111111] hover:text-[#E53935] transition-colors"
            >
              <span>{isVi ? 'Xem toàn bộ thực đơn' : 'View All Menu'}</span>
              <ArrowRight className="w-4 h-4 text-[#E53935]" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                locale={locale}
                buttonLabel={tm('customize')}
                currencyLabel={tc('currency')}
                newBadgeLabel={tm('newBadge')}
                bestSellerBadgeLabel={tm('bestSellerBadge')}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 3. Story Section */}
      <section className="py-12 md:py-16 bg-white border-t border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <span className="text-[#E53935] text-xs font-black uppercase tracking-widest block">
                {isVi ? 'Câu Chuyện Thương Hiệu' : 'Our Ingredients'}
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-[#111111] leading-tight">
                {isVi ? 'Bí quyết tạo nên hương vị mềm béo tan chảy' : 'Fluffy, golden eggs cooked to perfection'}
              </h2>
              <p className="text-sm md:text-base text-[#6B7280] leading-relaxed font-medium">
                {isVi
                  ? 'Tại EGGU, chúng tôi tin rằng một bữa sáng hoàn hảo bắt đầu từ những nguyên liệu chất lượng tốt nhất. Mỗi ổ bánh mì kẹp trứng đều được chuẩn bị cẩn thận: những quả trứng tươi sạch từ trang trại, phô mai Cheddar béo ngậy, thịt xông khói giòn tan kẹp giữa lớp bánh mì Brioche thơm nồng bơ tỏi nướng nóng hổi.'
                  : 'At EGGU, we believe that the perfect morning begins with high-quality ingredients. Every single sandwich is crafted with precision: farm-fresh organic eggs, rich melted Cheddar cheese, and crispy bacon slices wrapped inside thick-sliced, garlic butter-toasted French Brioche bread.'}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-[#F8F9FA] rounded-2xl border border-[#E5E7EB]">
                  <h4 className="font-black text-[#111111] text-sm mb-1">🥚 Farm-Fresh Eggs</h4>
                  <p className="text-xs text-[#6B7280]">Trứng thanh trùng sạch, đánh bông bơ lạt nguyên chất.</p>
                </div>
                <div className="p-4 bg-[#F8F9FA] rounded-2xl border border-[#E5E7EB]">
                  <h4 className="font-black text-[#111111] text-sm mb-1">🍞 Butter Brioche</h4>
                  <p className="text-xs text-[#6B7280]">Bánh mì nướng bơ tỏi Pháp mềm xốp, thơm nồng.</p>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-wider text-[#111111] hover:text-[#E53935] transition-colors"
                >
                  <span>{isVi ? 'Khám phá câu chuyện EGGU' : 'Discover EGGU Story'}</span>
                  <ArrowRight className="w-4 h-4 text-[#E53935]" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6 relative flex justify-center">
              <div className="relative aspect-square w-full max-w-[480px] rounded-3xl overflow-hidden shadow-xl border border-[#E5E7EB]">
                <Image
                  src="/images/hero-sandwich.jpg"
                  alt="EGGU Story"
                  fill
                  sizes="(max-width: 1024px) 100vw, 480px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Branch Info Section */}
      <section className="py-12 md:py-16 bg-[#F8F9FA] border-t border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[#E53935] text-xs font-black uppercase tracking-widest block">
              {isVi ? 'Ghé Thăm Cửa Hàng' : 'Visit Store'}
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-[#111111]">
              {isVi ? 'Tìm Cửa Hàng Gần Bạn Nhất' : 'Find An EGGU Store'}
            </h2>
            <p className="text-sm md:text-base text-[#6B7280] font-medium">
              {isVi
                ? 'Đến cửa hàng của chúng tôi để tận hưởng không gian ấm cúng và ngửi thấy mùi bơ tỏi nướng thơm lừng.'
                : 'Come by our locations for a cozy dining atmosphere and the irresistible aroma of fresh butter-toasted buns.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto">
            {/* Store Card 1 */}
            <div className="p-6 md:p-8 bg-white rounded-2xl border border-[#E5E7EB] space-y-4 shadow-xs hover:border-[#E53935]/40 transition-colors">
              <h3 className="text-lg sm:text-xl font-black text-[#111111]">EGGU Nguyễn Huệ (Quận 1)</h3>
              <div className="space-y-2 text-[#6B7280] text-sm font-semibold">
                <p className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-[#E53935] shrink-0" />
                  <span>123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh</span>
                </p>
                <p className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-[#E53935] shrink-0" />
                  <span>07:00 AM - 10:00 PM</span>
                </p>
              </div>
              <Link
                href="/store"
                className="inline-block pt-2 text-xs font-black uppercase tracking-wider text-[#E53935] hover:text-[#D32F2F] transition-colors"
              >
                {isVi ? 'Xem bản đồ & Liên hệ' : 'View map & contact'} →
              </Link>
            </div>

            {/* Store Card 2 */}
            <div className="p-6 md:p-8 bg-white rounded-2xl border border-[#E5E7EB] space-y-4 shadow-xs hover:border-[#E53935]/40 transition-colors">
              <h3 className="text-lg sm:text-xl font-black text-[#111111]">EGGU Nguyễn Đình Chiểu (Quận 3)</h3>
              <div className="space-y-2 text-[#6B7280] text-sm font-semibold">
                <p className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-[#E53935] shrink-0" />
                  <span>456 Nguyễn Đình Chiểu, Quận 3, TP. Hồ Chí Minh</span>
                </p>
                <p className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-[#E53935] shrink-0" />
                  <span>07:00 AM - 10:00 PM</span>
                </p>
              </div>
              <Link
                href="/store"
                className="inline-block pt-2 text-xs font-black uppercase tracking-wider text-[#E53935] hover:text-[#D32F2F] transition-colors"
              >
                {isVi ? 'Xem bản đồ & Liên hệ' : 'View map & contact'} →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Last CTA Section */}
      <section className="py-12 md:py-16 bg-[#111111] text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            {isVi ? 'Sẵn sàng thưởng thức chiếc bánh mì tiếp theo?' : 'Ready for your next fresh egg sandwich?'}
          </h2>
          <p className="text-[#9CA3AF] text-sm md:text-base max-w-lg mx-auto font-medium">
            {isVi
              ? 'Đặt hàng ngay hôm nay để nhận giao hàng nhanh chóng, bơ sữa nóng hổi tận nhà.'
              : 'Order today to experience our fresh butter-toasted gourmet sandwich delivered straight to your door.'}
          </p>
          <div className="pt-2">
            <Link
              href="/menu"
              className="inline-block px-8 py-4 bg-[#E53935] text-white font-black uppercase tracking-wider rounded-full hover:bg-[#D32F2F] transition-colors shadow-lg"
            >
              {tc('orderNow')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
