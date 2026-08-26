import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/server';
import { ArrowRight, Clock, MapPin, Plus, ShoppingBag, Coffee, Croissant, IceCreamBowl, Salad } from 'lucide-react';

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
];

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;
  const tc = await getTranslations('common');

  // Fetch featured products from Supabase with a fallback to mock data
  let products = MOCK_FEATURED;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('is_best_seller', true)
      .eq('is_active', true)
      .limit(3);
    
    if (data && data.length > 0) {
      products = data;
    }
  } catch (error) {
    console.error('Supabase query failed on homepage, using mock fallbacks:', error);
  }

  const isVi = locale === 'vi';

  return (
    <div className="site-frame flex min-h-screen flex-col">
      {/* 1. Hero Section */}
      <section className="relative px-7 pb-8 pt-20">
        <div className="relative mx-auto h-[230px] max-w-[1040px] overflow-hidden rounded-xl bg-[#f3dfb1] shadow-sm">
          <Image src="/images/hero-sandwich.jpg" alt="EGGU sandwich" fill priority className="object-cover opacity-75" />
          {/* Hero Content */}
          <div className="absolute inset-0 flex items-center justify-center text-center">
            <div className="w-[62%] rounded-xl bg-[#fff9f7]/90 px-5 py-4 shadow-sm">
              <h1 className="text-xl font-bold leading-tight text-[#261d1b] md:text-2xl">Eggu - Sandwich Hàn Quốc<br />Chuẩn Vị</h1>
              <p className="mx-auto mt-2 max-w-md text-[10px] leading-relaxed text-[#756b67]">Thưởng thức hương vị tươi mới, mềm mại trong từng lớp bánh. Năng lượng tràn đầy cho một ngày tuyệt vời.</p>
              <Link href="/menu" className="mt-3 inline-block rounded-md bg-[#f8c400] px-8 py-2 text-[9px] font-bold text-[#261d1b]">ĐẶT HÀNG NGAY</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="px-7 pb-10">
        <div className="mx-auto flex max-w-[760px] justify-between text-center">
          {[['Sandwich', ShoppingBag], ['Topping', Salad], ['Fried food', Croissant], ['Coffee & drinks', Coffee], ['Fresh juice', IceCreamBowl]].map(([label, Icon], index) => (
            <div key={String(label)} className="flex w-20 flex-col items-center gap-2 text-[9px] text-[#6b5549]">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${index === 0 ? 'bg-[#f8c400]' : 'bg-[#fae6e2]'}`}><Icon className="h-4 w-4" /></div>
              <span>{label as string}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 2. Featured Products Section */}
      <section className="border-y border-[#eadfdb] bg-[#fff9f7] px-7 py-5">
        <div className="mx-auto max-w-[1040px]">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <span className="text-lg font-bold text-[#261d1b]">
                {isVi ? 'BEST SELLER' : 'BEST SELLER'}
              </span>
            </div>
            <Link href="/menu" className="text-[10px] font-bold text-[#756b67]">Xem tất cả →</Link>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
            {products.map((product) => (
              <div
                key={product.id}
                className="group flex flex-col justify-between overflow-hidden rounded-lg border border-[#eadfdb] bg-white"
              >
                <div className="relative aspect-square overflow-hidden bg-[#f1f1ee]">
                  <Image
                    src={product.image_url || '/images/hero-sandwich.jpg'}
                    alt={isVi ? product.name_vi : product.name_en}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {product.is_best_seller && (
                    <span className="absolute left-2 top-2 rounded bg-[#f8c400] px-1.5 py-1 text-[8px] font-bold text-[#261d1b]">
                      Best Seller
                    </span>
                  )}
                </div>
                <div className="flex flex-grow flex-col justify-between p-2">
                  <div className="space-y-1">
                    <h3 className="text-[10px] font-bold text-[#261d1b]">
                      {isVi ? product.name_vi : product.name_en}
                    </h3>
                    <p className="line-clamp-2 text-[8px] leading-relaxed text-[#756b67]">
                      {isVi ? product.description_vi : product.description_en}
                    </p>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-[#eadfdb] pt-2">
                    <span className="text-[9px] font-bold text-[#6b5549]">
                      {product.price.toLocaleString()}đ
                    </span>
                    <Link
                      href={`/menu/${product.slug}`}
                      aria-label={isVi ? 'Thêm vào giỏ' : 'Add to cart'}
                      className="flex h-5 w-5 items-center justify-center rounded-full bg-[#fae6e2] text-[#ee6b61]"
                    >
                      <Plus className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional content remains available below the compact reference fold. */}
      <section className="hidden py-24 bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <span className="text-[#EAAA08] text-xs font-bold uppercase tracking-widest block">
              {isVi ? 'Câu Chuyện Thương Hiệu' : 'Our Ingredients'}
            </span>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-[#1E1B18] leading-tight">
              {isVi ? (
                <>Bí mật tạo nên hương vị mềm béo tan chảy</>
              ) : (
                <>Fluffy, golden eggs cooked to perfection</>
              )}
            </h2>
            <p className="text-[#706860] leading-relaxed font-medium">
              {isVi
                ? 'Tại EGGU, chúng tôi tin rằng một bữa sáng hoàn hảo bắt đầu từ những nguyên liệu chất lượng tốt nhất. Mỗi ổ bánh mì kẹp trứng đều được chuẩn bị cẩn thận: những quả trứng tươi sạch từ trang trại, phô mai Cheddar béo ngậy, thịt xông khói giòn tan kẹp giữa lớp bánh mì Brioche thơm nồng bơ tỏi nướng nóng hổi.'
                : 'At EGGU, we believe that the perfect morning begins with high-quality ingredients. Every single sandwich is crafted with precision: farm-fresh organic eggs, rich melted Cheddar cheese, and crispy bacon slices wrapped inside thick-sliced, garlic butter-toasted French Brioche bread.'}
            </p>

            <div className="grid grid-cols-2 gap-6 pt-4">
              <div className="p-4 bg-white rounded-xl border border-[#E5E0D8]">
                <h4 className="font-bold text-[#1E1B18] mb-1">🥚 Farm-Fresh Eggs</h4>
                <p className="text-xs text-[#706860]">Pasteurized, locally sourced fresh eggs whipped with dairy butter.</p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-[#E5E0D8]">
                <h4 className="font-bold text-[#1E1B18] mb-1">🍞 Butter Brioche</h4>
                <p className="text-xs text-[#706860]">Thick, soft bread toasted with rich French butter and aromatic garlic.</p>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/about"
                className="inline-flex items-center space-x-2 text-sm font-extrabold uppercase tracking-wider text-[#5C4B3E] hover:text-[#EAAA08] transition duration-200"
              >
                <span>{isVi ? 'Khám phá câu chuyện EGGU' : 'Discover EGGU Story'}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="relative aspect-square w-full max-w-[500px] mx-auto rounded-3xl overflow-hidden shadow-xl border border-[#E5E0D8]">
            <Image
              src="/images/hero-sandwich.jpg"
              alt="EGGU Story"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </section>

      {/* 4. Branch Info Section */}
      <section className="py-20 bg-white border-t border-[#E5E0D8]">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-12">
          <div className="max-w-2xl mx-auto space-y-4">
            <span className="text-[#EAAA08] text-xs font-bold uppercase tracking-widest block">
              {isVi ? 'Ghé Thăm Cửa Hàng' : 'Visit Store'}
            </span>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-[#1E1B18]">
              {isVi ? 'Tìm Cửa Hàng Gần Bạn Nhất' : 'Find An EGGU Store'}
            </h2>
            <p className="text-[#706860] font-medium">
              {isVi
                ? 'Đến cửa hàng của chúng tôi để tận hưởng không gian ấm cúng, sang trọng và ngửi thấy mùi bơ tỏi nướng thơm lừng.'
                : 'Come by our locations for a cozy dining atmosphere and the irresistible aroma of fresh butter-toasted buns.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Store Card 1 */}
            <div className="p-8 bg-[#FAF8F5] rounded-2xl border border-[#E5E0D8] text-left space-y-4">
              <h3 className="text-xl font-bold text-[#1E1B18]">EGGU Nguyễn Huệ (Quận 1)</h3>
              <div className="space-y-2 text-[#706860] text-sm font-semibold">
                <p className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-[#EAAA08] shrink-0" />
                  <span>123 Nguyễn Huệ, Quận 1, TP. Hồ Chí Minh</span>
                </p>
                <p className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-[#EAAA08] shrink-0" />
                  <span>07:00 AM - 10:00 PM</span>
                </p>
              </div>
              <Link
                href="/store"
                className="inline-block mt-4 text-xs font-extrabold uppercase tracking-wider text-[#EAAA08] hover:text-[#5C4B3E] transition duration-200"
              >
                {isVi ? 'Xem bản đồ & Liên hệ' : 'View map & contact'} →
              </Link>
            </div>

            {/* Store Card 2 */}
            <div className="p-8 bg-[#FAF8F5] rounded-2xl border border-[#E5E0D8] text-left space-y-4">
              <h3 className="text-xl font-bold text-[#1E1B18]">EGGU Nguyễn Đình Chiểu (Quận 3)</h3>
              <div className="space-y-2 text-[#706860] text-sm font-semibold">
                <p className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-[#EAAA08] shrink-0" />
                  <span>456 Nguyễn Đình Chiểu, Quận 3, TP. Hồ Chí Minh</span>
                </p>
                <p className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-[#EAAA08] shrink-0" />
                  <span>07:00 AM - 10:00 PM</span>
                </p>
              </div>
              <Link
                href="/store"
                className="inline-block mt-4 text-xs font-extrabold uppercase tracking-wider text-[#EAAA08] hover:text-[#5C4B3E] transition duration-200"
              >
                {isVi ? 'Xem bản đồ & Liên hệ' : 'View map & contact'} →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Last CTA Section */}
      <section className="py-24 bg-[#5C4B3E] text-[#FAF8F5] relative overflow-hidden text-center">
        <div className="max-w-4xl mx-auto px-6 space-y-8 relative z-10">
          <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
            {isVi ? 'Sẵn sàng thưởng thức chiếc bánh mì tiếp theo?' : 'Ready for your next fresh egg sandwich?'}
          </h2>
          <p className="text-[#EFECE6]/80 text-lg max-w-lg mx-auto font-medium">
            {isVi
              ? 'Đặt hàng ngay hôm nay để nhận giao hàng nhanh chóng, thanh toán COD bơ sữa nóng hổi tận nhà.'
              : 'Order today to experience our fresh butter-toasted gourmet sandwich delivered straight to your door.'}
          </p>
          <div>
            <Link
              href="/menu"
              className="inline-block px-10 py-5 bg-[#EAAA08] text-[#1E1B18] font-extrabold uppercase tracking-widest rounded-xl hover:bg-[#EAAA08]/90 transition duration-200 shadow-xl"
            >
              {tc('orderNow')}
            </Link>
          </div>
        </div>
        {/* Background egg vector style */}
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-[#EAAA08]/5 blur-2xl z-0" />
      </section>
    </div>
  );
}
