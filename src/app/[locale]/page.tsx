import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/server';
import { ArrowRight, Clock, MapPin } from 'lucide-react';

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
  const t = await getTranslations('home.hero');
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
    <div className="flex flex-col min-h-screen bg-[#FAF8F5]">
      {/* 1. Hero Section */}
      <section className="relative min-h-screen flex items-center pt-24 pb-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Content */}
          <div className="lg:col-span-6 space-y-6 z-10">
            <span className="inline-block px-3 py-1 rounded-full bg-[#EAAA08]/15 text-[#EAAA08] font-bold text-xs uppercase tracking-wider">
              {t('subtitle')}
            </span>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-[#1E1B18] leading-none">
              {isVi ? (
                <>
                  Chế biến <span className="text-[#EAAA08]">tươi</span>.<br />
                  Ăn <span className="text-[#5C4B3E]">ngon</span> hơn.
                </>
              ) : (
                <>
                  Made <span className="text-[#EAAA08]">fresh</span>.<br />
                  Made <span className="text-[#5C4B3E]">better</span>.
                </>
              )}
            </h1>
            <p className="text-[#706860] text-lg font-medium leading-relaxed max-w-lg">
              {t('description')}
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                href="/menu"
                className="px-8 py-4 bg-[#EAAA08] text-[#1E1B18] font-extrabold uppercase tracking-wider rounded-xl shadow-lg hover:shadow-xl hover:bg-[#EAAA08]/90 transition duration-200"
              >
                {tc('orderNow')}
              </Link>
              <Link
                href="/about"
                className="px-8 py-4 bg-white border border-[#E5E0D8] text-[#1E1B18] font-extrabold uppercase tracking-wider rounded-xl hover:bg-[#EFECE6] transition duration-200"
              >
                {tc('exploreMenu')}
              </Link>
            </div>
          </div>

          {/* Hero Image */}
          <div className="lg:col-span-6 relative flex justify-center z-10">
            <div className="relative w-full max-w-[480px] aspect-square rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white transform rotate-2 hover:rotate-0 transition duration-500">
              <Image
                src="/images/hero-sandwich.jpg"
                alt="EGGU Sandwich"
                fill
                priority
                className="object-cover"
              />
            </div>
            {/* Background design elements */}
            <div className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-[#EAAA08]/10 blur-2xl z-0" />
            <div className="absolute -bottom-10 -right-10 w-52 h-52 rounded-full bg-[#5C4B3E]/10 blur-3xl z-0" />
          </div>
        </div>
      </section>

      {/* 2. Featured Products Section */}
      <section className="py-20 bg-white border-y border-[#E5E0D8]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-[#EAAA08] text-xs font-bold uppercase tracking-widest block mb-2">
                {isVi ? 'Món Nổi Bật' : 'Signature Picks'}
              </span>
              <h2 className="text-3xl md:text-4xl font-black tracking-tight text-[#1E1B18]">
                {isVi ? 'Bán Chạy Nhất Tại EGGU' : 'Our Best Sellers'}
              </h2>
            </div>
            <Link
              href="/menu"
              className="group flex items-center space-x-2 text-sm font-extrabold uppercase tracking-wider text-[#EAAA08] hover:text-[#5C4B3E] transition duration-200 mt-4 md:mt-0"
            >
              <span>{isVi ? 'Xem thực đơn đầy đủ' : 'View Full Menu'}</span>
              <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="bg-[#FAF8F5] rounded-2xl overflow-hidden border border-[#E5E0D8] group hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={product.image_url || '/images/hero-sandwich.jpg'}
                    alt={isVi ? product.name_vi : product.name_en}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {product.is_best_seller && (
                    <span className="absolute top-3 left-3 bg-[#EAAA08] text-[#1E1B18] font-bold text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                      Best Seller
                    </span>
                  )}
                </div>
                <div className="p-6 flex-grow flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-[#1E1B18] group-hover:text-[#EAAA08] transition duration-200">
                      {isVi ? product.name_vi : product.name_en}
                    </h3>
                    <p className="text-sm text-[#706860] line-clamp-2 leading-relaxed">
                      {isVi ? product.description_vi : product.description_en}
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-6 border-t border-[#E5E0D8] mt-6">
                    <span className="text-lg font-black text-[#5C4B3E]">
                      {product.price.toLocaleString()} VND
                    </span>
                    <Link
                      href={`/menu/${product.slug}`}
                      className="px-4 py-2 bg-[#1E1B18] text-[#FAF8F5] text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-[#EAAA08] hover:text-[#1E1B18] transition duration-200"
                    >
                      {isVi ? 'Tùy chỉnh' : 'Order Now'}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Brand Story / Ingredients Section */}
      <section className="py-24 bg-[#FAF8F5]">
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
