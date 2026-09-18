import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/server';
import ProductCard from '@/components/menu/ProductCard';
import HeroSandwichCarousel from '@/components/home/HeroSandwichCarousel';
import { ArrowRight, Clock, MapPin, Coffee, Drumstick, CupSoda } from 'lucide-react';

export const dynamic = 'force-dynamic';

// Custom Crisp Sandwich SVG Icon matching Lucide style
function SandwichIcon({ className = 'h-5 w-5' }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 11v-1a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v1H3z" />
      <path d="M3 17v1a4 4 0 0 0 4 4h10a4 4 0 0 0 4-4v-1H3z" />
      <path d="M2 11h20a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1z" />
      <path d="M6 14h.01" />
      <path d="M10 14h.01" />
      <path d="M14 14h.01" />
      <path d="M18 14h.01" />
    </svg>
  );
}

// 4 Homepage Categories with icons and menu links
const HOME_CATEGORIES = [
  {
    slug: 'sandwich',
    name_vi: 'Sandwich',
    name_en: 'Sandwich',
    icon: SandwichIcon,
  },
  {
    slug: 'fried-food',
    name_vi: 'Món chiên',
    name_en: 'Fried Food',
    icon: Drumstick,
  },
  {
    slug: 'coffee-drinks',
    name_vi: 'Cà phê & Đồ uống',
    name_en: 'Coffee & Drinks',
    icon: Coffee,
  },
  {
    slug: 'smoothie-fresh-juice',
    name_vi: 'Sinh tố & Nước ép',
    name_en: 'Smoothie & Juice',
    icon: CupSoda,
  },
];

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
    image_url: '/images/carousel/sandwich-egg-scramble.jpg',
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
    image_url: '/images/carousel/sandwich-bacon-cheese.jpg',
    is_new: false,
    is_best_seller: true,
  },
  {
    id: 'bfbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    name_vi: 'Bánh Mì Thịt Xông Khói & Phô Mai Kép',
    name_en: 'Bacon Double Cheese',
    slug: 'bacon-double-cheese',
    description_vi: 'Thịt xông khói áp chảo giòn rụm nhân đôi, trứng khuấy mềm và phô mai Cheddar kép béo ngậy.',
    description_en: 'Double crispy bacon, fluffy soft-scrambled eggs, and double melted Cheddar cheese on toasted brioche.',
    price: 55000,
    image_url: '/images/carousel/sandwich-bacon-cheese.jpg',
    is_new: false,
    is_best_seller: true,
  },
  {
    id: 'dfdddddd-dddd-dddd-dddd-dddddddddddd',
    name_vi: 'Herb Grilled Chicken',
    name_en: 'Herb Grilled Chicken',
    slug: 'grilled-chicken-herb',
    description_vi: 'Ức gà nướng sốt thảo mộc tươi mát kết hợp trứng khuấy mềm ngậy giàu protein.',
    description_en: 'Tender grilled herb chicken with signature fluffy scrambled eggs and melted cheese.',
    price: 59000,
    image_url: '/images/carousel/sandwich-chicken-herbs.jpg',
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

  // Fetch stores for homepage
  let store: any = {
    name_vi: 'EGGU - Sandwich trứng Hàn Quốc',
    name_en: 'EGGU - Korean Egg Sandwich',
    address_vi: '54 Nguyễn Hữu Huân, Hoàn Kiếm, Hà Nội',
    address_en: '54 Nguyen Huu Huan, Hoan Kiem, Hanoi',
    opening_hours_vi: '07:00 - 21:00',
    opening_hours_en: '07:00 - 21:00',
  };

  try {
    const supabase = await createClient();
    const { data: storeData } = await supabase
      .from('stores')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: true })
      .limit(1);

    if (storeData && storeData.length > 0) {
      store = storeData[0];
    }
  } catch (error) {
    console.error('Supabase query stores failed on homepage:', error);
  }

  const isVi = locale === 'vi';

  return (
    <div className="flex min-h-screen flex-col bg-transparent">
      {/* 1. Interactive Sandwich Carousel Hero */}
      <HeroSandwichCarousel locale={locale} />

      {/* 2. Category Navigation Cards Row */}
      <section className="py-8 bg-transparent border-y border-[#E5E7EB]/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6 text-center max-w-4xl mx-auto">
            {HOME_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.slug}
                  href={`/menu?category=${cat.slug}`}
                  className="flex flex-col items-center gap-2.5 p-4 sm:p-5 rounded-2xl bg-white hover:border-[#E53935] border border-[#E5E7EB] transition-all duration-200 group shadow-xs hover:shadow-md hover:-translate-y-0.5 text-center"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#111111] border border-[#E5E7EB] group-hover:bg-[#E53935] group-hover:text-white group-hover:border-[#E53935] transition-all duration-200 group-hover:scale-110 shadow-xs">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-[#111111] group-hover:text-[#E53935] transition-colors">
                    {isVi ? cat.name_vi : cat.name_en}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Featured Products Section (Bestseller) */}
      <section className="py-12 md:py-16 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#E5E7EB]/80 pb-4">
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
                soldOutBadgeLabel={tm('soldOutBadge')}
                soldOutBtnLabel={tm('soldOutBtn')}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 3. Story Section */}
      <section className="py-12 md:py-16 bg-transparent border-t border-[#E5E7EB]/70">
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

              <div>
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
      <section className="py-12 md:py-16 bg-transparent border-t border-[#E5E7EB]/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 md:space-y-10">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-[#E53935] uppercase">
              {isVi ? 'GHÉ THĂM CỬA HÀNG' : 'VISIT OUR STORE'}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-stretch max-w-5xl mx-auto">
            {/* Cột bên trái: Thẻ thông tin cửa hàng */}
            <div className="p-6 sm:p-8 bg-white rounded-3xl border border-[#E5E7EB] shadow-xs flex flex-col justify-between space-y-6 hover:border-[#E53935]/40 transition-colors">
              <div className="space-y-5">
                <h3 className="text-xl sm:text-2xl font-black text-[#111111]">
                  {isVi ? (store?.name_vi || 'EGGU - Sandwich trứng Hàn Quốc') : (store?.name_en || 'EGGU - Korean Egg Sandwich')}
                </h3>

                <div className="space-y-4 text-sm font-semibold text-[#6B7280]">
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-5 h-5 text-[#E53935] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-[#9CA3AF] uppercase font-black tracking-wider mb-0.5">
                        {isVi ? 'Địa chỉ' : 'Address'}
                      </p>
                      <p className="text-[#111111] font-medium leading-relaxed">
                        {isVi ? (store?.address_vi || '54 Nguyễn Hữu Huân, Hoàn Kiếm, Hà Nội') : (store?.address_en || '54 Nguyen Huu Huan, Hoan Kiem, Hanoi')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Clock className="w-5 h-5 text-[#E53935] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-[#9CA3AF] uppercase font-black tracking-wider mb-0.5">
                        {isVi ? 'Giờ mở cửa' : 'Opening Hours'}
                      </p>
                      <p className="text-[#111111] font-bold">
                        {isVi ? (store?.opening_hours_vi || '07:00 - 21:00') : (store?.opening_hours_en || '07:00 - 21:00')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#E5E7EB]">
                <Link
                  href="/store"
                  className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 bg-[#E53935] hover:bg-[#D32F2F] text-white font-black text-xs sm:text-sm uppercase tracking-wider rounded-xl transition shadow-sm"
                >
                  <span>{isVi ? 'XEM BẢN ĐỒ & LIÊN HỆ' : 'VIEW MAP & CONTACT'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Cột bên phải: Google Maps iframe */}
            <div className="relative w-full min-h-[320px] lg:min-h-full rounded-3xl overflow-hidden border border-[#E5E7EB] shadow-xs bg-neutral-100">
              <iframe
                title="EGGU Store Location Map"
                src="https://maps.google.com/maps?q=54%20Nguy%E1%BB%85n%20H%E1%BB%AFu%20Hu%C3%A2n%2C%20Ho%C3%A0n%20Ki%E1%BA%BFm%2C%20H%C3%A0%20N%E1%BB%99i&t=&z=16&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                className="w-full h-full min-h-[320px] border-0"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
