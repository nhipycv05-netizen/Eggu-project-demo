import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/server';

const MOCK_CATEGORIES = [
  { id: 'all', name_vi: 'Tất Cả', name_en: 'All', slug: 'all' },
  { id: '1a111111-1111-1111-1111-111111111111', name_vi: 'Bánh Mì Kẹp', name_en: 'Sandwich', slug: 'sandwich' },
  { id: '2b222222-2222-2222-2222-222222222222', name_vi: 'Bánh Mì Nướng', name_en: 'Toast', slug: 'toast' },
  { id: '3c333333-3333-3333-3333-333333333333', name_vi: 'Bánh Vòng', name_en: 'Bagel', slug: 'bagel' },
  { id: '4d444444-4444-4444-4444-444444444444', name_vi: 'Bữa Sáng Trễ', name_en: 'Brunch', slug: 'brunch' },
  { id: '5e555555-5555-5555-5555-555555555555', name_vi: 'Món Phụ', name_en: 'Side', slug: 'side' },
  { id: '6f666666-6666-6666-6666-666666666666', name_vi: 'Nước Giải Khát', name_en: 'Drinks', slug: 'drinks' },
  { id: '7a777777-7777-7777-7777-777777777777', name_vi: 'Cà Phê', name_en: 'Coffee', slug: 'coffee' },
  { id: '8b888888-8888-8888-8888-888888888888', name_vi: 'Combo Tiết Kiệm', name_en: 'Combo', slug: 'combo' }
];

const MOCK_PRODUCTS = [
  {
    id: '9a999999-9999-9999-9999-999999999999',
    category_id: '1a111111-1111-1111-1111-111111111111',
    name_vi: 'Mr. Egg',
    name_en: 'Mr. Egg',
    slug: 'mr-egg',
    description_vi: 'Bánh mì nướng bơ tỏi kẹp trứng khuấy mềm béo và sốt sriracha ngọt dịu đặc trưng.',
    description_en: 'Garlic butter toast filled with fluffy soft-scrambled eggs and sweet sriracha mayo.',
    price: 39000,
    image_url: '/images/hero-sandwich.jpg',
    is_new: false,
    is_best_seller: true,
  },
  {
    id: 'afaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    category_id: '1a111111-1111-1111-1111-111111111111',
    name_vi: 'American Ham & Cheese',
    name_en: 'American Ham & Cheese',
    slug: 'american-ham-cheese',
    description_vi: 'Trứng khuấy mềm béo, thịt nguội cao cấp và phô mai Cheddar tan chảy.',
    description_en: 'Fluffy soft-scrambled eggs, premium ham slices, and melted Cheddar cheese.',
    price: 49000,
    image_url: '/images/hero-sandwich.jpg',
    is_new: false,
    is_best_seller: true,
  },
  {
    id: 'bfbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    category_id: '1a111111-1111-1111-1111-111111111111',
    name_vi: 'Bacon Double Cheese',
    name_en: 'Bacon Double Cheese',
    slug: 'bacon-double-cheese',
    description_vi: 'Thịt xông khói giòn nhân đôi, trứng khuấy mềm và phô mai Cheddar kép.',
    description_en: 'Double crispy bacon, fluffy soft-scrambled eggs, and double melted Cheddar cheese.',
    price: 55000,
    image_url: '/images/hero-sandwich.jpg',
    is_new: false,
    is_best_seller: true,
  },
  {
    id: 'cfcccccc-cccc-cccc-cccc-cccccccccccc',
    category_id: '1a111111-1111-1111-1111-111111111111',
    name_vi: 'Avocado Holic',
    name_en: 'Avocado Holic',
    slug: 'avocado-holic',
    description_vi: 'Bơ sáp tươi thái lát bùi béo kết hợp trứng khuấy mềm và sốt trứng đặc chế.',
    description_en: 'Rich soft-scrambled eggs combined with fresh sliced creamy avocado and signature sauce.',
    price: 59000,
    image_url: '/images/hero-sandwich.jpg',
    is_new: true,
    is_best_seller: false,
  },
  {
    id: 'dfdddddd-dddd-dddd-dddd-dddddddddddd',
    category_id: '2b222222-2222-2222-2222-222222222222',
    name_vi: 'Bánh Mì Tỏi Thịt Xông Khói & Phô Mai',
    name_en: 'Garlic Bacon Cheese Toast',
    slug: 'garlic-bacon-cheese-toast',
    description_vi: 'Bánh mì nướng tỏi thơm nồng kẹp phô mai, thịt xông khói và sốt mật ong ngọt ngào.',
    description_en: 'Toasted garlic bread loaded with bacon, melted cheese, and sweet honey drizzle.',
    price: 52000,
    image_url: '/images/hero-sandwich.jpg',
    is_new: true,
    is_best_seller: true,
  },
  {
    id: 'efeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    category_id: '5e555555-5555-5555-5555-555555555555',
    name_vi: 'Khoai Tây Chiên Pháp',
    name_en: 'French Fries',
    slug: 'french-fries',
    description_vi: 'Khoai tây chiên giòn vàng đều, phủ nhẹ muối biển nhuyễn.',
    description_en: 'Golden crispy French fries lightly dusted with fine sea salt.',
    price: 29000,
    image_url: '/images/hero-sandwich.jpg',
    is_new: false,
    is_best_seller: false,
  },
  {
    id: 'aff77777-7777-7777-7777-777777777777',
    category_id: '7a777777-7777-7777-7777-777777777777',
    name_vi: 'Cà Phê Americano Đá',
    name_en: 'Iced Americano',
    slug: 'iced-americano',
    description_vi: 'Cà phê espresso nguyên chất pha với nước lạnh và đá, đậm đà tỉnh táo.',
    description_en: 'Rich espresso shot mixed with cold water and ice for a crisp, refreshing kick.',
    price: 29000,
    image_url: '/images/hero-sandwich.jpg',
    is_new: false,
    is_best_seller: true,
  },
  {
    id: 'bff77777-7777-7777-7777-777777777777',
    category_id: '7a777777-7777-7777-7777-777777777777',
    name_vi: 'Cà Phê Bạc Xỉu Đá',
    name_en: 'Iced White Coffee',
    slug: 'iced-white-coffee',
    description_vi: 'Cà phê hòa quyện cùng sữa đặc ngọt ngào béo ngậy truyền thống Việt Nam.',
    description_en: 'Vietnamese espresso blended with condensed milk and fresh milk.',
    price: 35000,
    image_url: '/images/hero-sandwich.jpg',
    is_new: false,
    is_best_seller: true,
  }
];

interface MenuPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}

export default async function MenuPage({ params, searchParams }: MenuPageProps) {
  const { locale } = await params;
  const { category: selectedCategorySlug = 'all' } = await searchParams;
  
  const tm = await getTranslations('menu');
  const tc = await getTranslations('common');
  const isVi = locale === 'vi';

  // 1. Fetch Categories & Products from Supabase with full fallbacks
  let categories = MOCK_CATEGORIES;
  let products = MOCK_PRODUCTS;

  try {
    const supabase = await createClient();
    
    // Fetch Categories
    const { data: dbCategories } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    
    if (dbCategories && dbCategories.length > 0) {
      categories = [{ id: 'all', name_vi: 'Tất Cả', name_en: 'All', slug: 'all' }, ...dbCategories];
    }

    // Fetch Products
    const { data: dbProducts } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (dbProducts && dbProducts.length > 0) {
      products = dbProducts;
    }
  } catch (error) {
    console.error('Supabase fetch failed on menu page, using mocks:', error);
  }

  // 2. Identify the active category record
  const activeCategory = categories.find((c) => c.slug === selectedCategorySlug) || categories[0];

  // 3. Filter products
  const filteredProducts = activeCategory.id === 'all'
    ? products
    : products.filter((p) => p.category_id === activeCategory.id);

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Title Header */}
        <div className="text-center max-w-xl mx-auto mb-16 space-y-4">
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#1E1B18]">
            {tm('title')}
          </h1>
          <p className="text-[#706860] font-medium text-sm md:text-base leading-relaxed">
            {tm('subtitle')}
          </p>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap justify-center gap-2 mb-12 border-b border-[#E5E0D8] pb-6">
          {categories.map((cat) => {
            const isActive = cat.slug === selectedCategorySlug;
            return (
              <Link
                key={cat.id}
                href={cat.slug === 'all' ? '/menu' : `/menu?category=${cat.slug}`}
                className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-200 ${
                  isActive
                    ? 'bg-[#EAAA08] text-[#1E1B18] shadow-md scale-105'
                    : 'bg-white text-[#706860] hover:text-[#1E1B18] hover:bg-[#EFECE6] border border-[#E5E0D8]'
                }`}
              >
                {isVi ? cat.name_vi : cat.name_en}
              </Link>
            );
          })}
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-[#E5E0D8] max-w-md mx-auto p-8 space-y-4">
            <span className="text-4xl">🍳</span>
            <p className="text-[#706860] font-semibold">{tm('emptyState')}</p>
            <Link
              href="/menu"
              className="inline-block text-xs font-black uppercase tracking-wider text-[#EAAA08] hover:text-[#5C4B3E]"
            >
              Reset Filters
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl overflow-hidden border border-[#E5E0D8] group hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                {/* Product Thumbnail */}
                <div className="relative aspect-square overflow-hidden bg-neutral-100">
                  <Image
                    src={product.image_url || '/images/hero-sandwich.jpg'}
                    alt={isVi ? product.name_vi : product.name_en}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Badges overlay */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {product.is_new && (
                      <span className="bg-[#5C4B3E] text-[#FAF8F5] font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm">
                        {tm('newBadge')}
                      </span>
                    )}
                    {product.is_best_seller && (
                      <span className="bg-[#EAAA08] text-[#1E1B18] font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm">
                        {tm('bestSellerBadge')}
                      </span>
                    )}
                  </div>
                </div>

                {/* Product Content Details */}
                <div className="p-4 md:p-5 flex-grow flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <h3 className="text-base md:text-lg font-black text-[#1E1B18] line-clamp-1 group-hover:text-[#EAAA08] transition duration-200">
                      {isVi ? product.name_vi : product.name_en}
                    </h3>
                    <p className="text-xs text-[#706860] line-clamp-2 leading-relaxed">
                      {isVi ? product.description_vi : product.description_en}
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-[#E5E0D8] gap-3">
                    <span className="text-base font-black text-[#5C4B3E] shrink-0">
                      {product.price.toLocaleString()} {tc('currency')}
                    </span>
                    <Link
                      href={`/menu/${product.slug}`}
                      className="w-full sm:w-auto px-4 py-2 bg-[#1E1B18] text-[#FAF8F5] text-center text-xs font-black uppercase tracking-wider rounded-lg hover:bg-[#EAAA08] hover:text-[#1E1B18] transition duration-200 shrink-0"
                    >
                      {tm('customize')}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
