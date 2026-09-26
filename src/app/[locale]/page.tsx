import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/server';
import FeaturedProductsSlider from '@/components/home/FeaturedProductsSlider';
import { MOCK_PRODUCTS } from '@/lib/mockProducts';
import HeroSandwichCarousel from '@/components/home/HeroSandwichCarousel';
import { ArrowRight, Clock, MapPin } from 'lucide-react';
import {
  SandwichColorIcon,
  FriesColorIcon,
  CoffeeColorIcon,
  DessertColorIcon,
} from '@/components/home/CategoryIcons';

export const dynamic = 'force-dynamic';

// 4 Homepage Categories with cute colored icons and menu links
const HOME_CATEGORIES = [
  {
    slug: 'sandwich',
    name_vi: 'Sandwich',
    name_en: 'Sandwich',
    icon: SandwichColorIcon,
  },
  {
    slug: 'fried-food',
    name_vi: 'Món chiên',
    name_en: 'Fried Food',
    icon: FriesColorIcon,
  },
  {
    slug: 'coffee-drinks',
    name_vi: 'Cà phê & Đồ uống',
    name_en: 'Coffee & Drinks',
    icon: CoffeeColorIcon,
  },
  {
    slug: 'smoothie-fresh-juice',
    name_vi: 'Sinh tố & Nước ép',
    name_en: 'Smoothie & Juice',
    icon: DessertColorIcon,
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
  let products = MOCK_PRODUCTS.filter((item) => item.is_best_seller);
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('is_best_seller', true)
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (data && data.length > 0) {
      products = data;
    }
  } catch (error) {
    console.error('Supabase query failed on homepage, using mock fallbacks:', error);
  }

  // Filter all products with best seller flag
  const bestSellerProducts = products.filter((item) => item.is_best_seller);

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

      {/* 2. Category Navigation Bar (Circular Icons, Seamless Background) */}
      <section className="py-8 md:py-10 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start justify-center gap-8 md:gap-14 max-w-4xl mx-auto overflow-x-auto no-scrollbar py-2 px-2">
            {HOME_CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={cat.slug}
                  href={`/menu?category=${cat.slug}`}
                  className="flex flex-col items-center group cursor-pointer transition-transform duration-200 hover:scale-105 shrink-0"
                >
                  <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-[#fdd871] flex items-center justify-center shadow-xs group-hover:shadow-md transition-all duration-200">
                    <Icon className="w-9 h-9 sm:w-10 sm:h-10 transform group-hover:scale-110 transition-transform duration-200" />
                  </div>
                  <span className="mt-3 font-bold text-xs md:text-sm text-[#452817] group-hover:text-[#e0352b] transition-colors text-center whitespace-nowrap">
                    {isVi ? cat.name_vi : cat.name_en}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. Featured Products Section (Bestseller) */}
      <section className="py-12 md:py-16 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          {/* Tiêu đề chính độc lập căn giữa trên cùng */}
          <div className="relative flex items-center justify-center mb-8 md:mb-10">
            <h2 className="font-bold uppercase text-2xl md:text-3xl tracking-widest text-[#e0352b] text-center">
              {isVi ? 'MÓN NỔI BẬT' : 'FEATURED PRODUCTS'}
            </h2>
            <div className="hidden sm:block absolute right-0">
              <Link
                href="/menu"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#111111] hover:text-[#e0352b] transition-colors"
              >
                <span>{isVi ? 'Xem toàn bộ thực đơn' : 'View All Menu'}</span>
                <ArrowRight className="w-4 h-4 text-[#e0352b]" />
              </Link>
            </div>
          </div>

          <FeaturedProductsSlider
            products={bestSellerProducts}
            locale={locale}
            buttonLabel={tm('customize')}
            currencyLabel={tc('currency')}
            newBadgeLabel={tm('newBadge')}
            bestSellerBadgeLabel={tm('bestSellerBadge')}
            soldOutBadgeLabel={tm('soldOutBadge')}
            soldOutBtnLabel={tm('soldOutBtn')}
          />

          <div className="sm:hidden text-center pt-2">
            <Link
              href="/menu"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#111111] hover:text-[#e0352b] transition-colors"
            >
              <span>{isVi ? 'Xem toàn bộ thực đơn' : 'View All Menu'}</span>
              <ArrowRight className="w-4 h-4 text-[#e0352b]" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Story Section */}
      <section className="py-12 md:py-16 bg-transparent border-t border-[#E5E7EB]/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tiêu đề chính độc lập căn giữa trên cùng */}
          <div className="text-center w-full mb-8 md:mb-10">
            <h2 className="font-bold uppercase text-2xl md:text-3xl tracking-widest text-[#e0352b]">
              {isVi ? 'CÂU CHUYỆN THƯƠNG HIỆU' : 'OUR STORY'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Cột trái: Hình ảnh (giữ nguyên w-full, khống chế chiều cao cân bằng với khối chữ) */}
            <div className="w-full flex justify-center">
              <div className="relative w-full h-[260px] sm:h-[280px] md:h-[300px] max-w-[460px] rounded-2xl overflow-hidden shadow-sm border border-[#E5E7EB]">
                <Image
                  src="/images/story-sandwich.jpg"
                  alt="EGGU Story"
                  fill
                  sizes="(max-width: 768px) 100vw, 600px"
                  className="object-cover"
                />
              </div>
            </div>

            {/* Cột phải: Nội dung chữ */}
            <div className="flex flex-col text-left">
              {/* Dòng 1: Tiêu đề nổi bật / Điểm nhấn */}
              <h3 className="font-bold italic text-base md:text-lg text-gray-900 mb-2.5 leading-snug">
                {isVi ? 'Bí quyết tạo nên hương vị mềm béo tan chảy' : 'Fluffy, golden eggs cooked to perfection'}
              </h3>

              {/* Dòng 2: Đoạn mô tả (ngắt thành 2 đoạn riêng biệt) */}
              <div className="space-y-3 mb-5 text-sm md:text-base text-gray-600 leading-relaxed">
                <p>
                  {isVi
                    ? 'Tại Eggu, chúng tôi mang đến những chiếc sandwich trứng ngon, tiện lợi và phù hợp với gu riêng, được tạo nên từ sự chỉn chu, sáng tạo và thấu hiểu khách hàng.'
                    : 'At Eggu, we deliver delicious, convenient, and tailored egg sandwiches crafted with precision, creativity, and a deep understanding of our customers.'}
                </p>
                <p>
                  {isVi
                    ? 'Eggu – nơi mỗi người đều có thể tìm thấy hương vị “đúng với mình”.'
                    : 'Eggu – where everyone can find a flavor that truly feels “right for them”.'}
                </p>
              </div>

              {/* Dòng 3: Nút chuyển tiếp */}
              <div>
                <Link
                  href="/about"
                  className="text-sm font-bold text-gray-900 hover:text-[#e0352b] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{isVi ? 'KHÁM PHÁ CÂU CHUYỆN EGGU' : 'DISCOVER EGGU STORY'}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Branch Info Section */}
      <section className="py-12 md:py-16 bg-transparent border-t border-[#E5E7EB]/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Tiêu đề chính độc lập căn giữa trên cùng */}
          <div className="text-center w-full mb-8 md:mb-10">
            <h2 className="font-bold uppercase text-2xl md:text-3xl tracking-widest text-[#e0352b]">
              {isVi ? 'GHÉ THĂM CỬA HÀNG' : 'VISIT OUR STORE'}
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 items-stretch max-w-5xl mx-auto">
            {/* Cột bên trái: Thẻ thông tin cửa hàng */}
            <div className="p-6 sm:p-8 bg-white rounded-3xl border border-[#E5E7EB] shadow-xs flex flex-col justify-between space-y-6 hover:border-[#E53935]/40 transition-colors">
              <div className="space-y-5">
                <h3 className="text-xl sm:text-2xl font-bold text-[#e0352b]">
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
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 bg-[#e0352b] hover:bg-red-700 text-white font-black text-xs sm:text-sm uppercase tracking-wider rounded-full transition shadow-sm cursor-pointer"
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
