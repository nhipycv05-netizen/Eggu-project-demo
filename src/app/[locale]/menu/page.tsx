import { getTranslations } from 'next-intl/server';
import ProductCard from '@/components/menu/ProductCard';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/server';

const MOCK_CATEGORIES = [
  { id: 'all', name_vi: 'Tất Cả', name_en: 'All', slug: 'all' },
  { id: '1a111111-1111-1111-1111-111111111111', name_vi: 'Sandwich', name_en: 'Sandwich', slug: 'sandwich' },
  { id: '2b222222-2222-2222-2222-222222222222', name_vi: 'Món Chiên', name_en: 'Fried Food', slug: 'fried-food' },
  { id: '3c333333-3333-3333-3333-333333333333', name_vi: 'Cà Phê & Đồ Uống', name_en: 'Coffee & Drinks', slug: 'coffee-drinks' },
  { id: '4d444444-4444-4444-4444-444444444444', name_vi: 'Sinh Tố & Nước Ép', name_en: 'Smoothie & Fresh Juice', slug: 'smoothie-fresh-juice' }
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
    category_id: '1a111111-1111-1111-1111-111111111111',
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
    category_id: '2b222222-2222-2222-2222-222222222222',
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
    id: '7d777777-7777-7777-7777-777777777777',
    category_id: '2b222222-2222-2222-2222-222222222222',
    name_vi: 'Phô Mai Que Chiên Giòn',
    name_en: 'Crispy Cheese Sticks',
    slug: 'crispy-cheese-sticks',
    description_vi: 'Phô mai Mozzarella kéo sợi chiên xù vàng rụm ăn kèm sốt chấm đặc chế.',
    description_en: 'Crispy golden breaded mozzarella sticks served with signature dipping sauce.',
    price: 35000,
    image_url: '/images/hero-sandwich.jpg',
    is_new: true,
    is_best_seller: false,
  },
  {
    id: 'aff77777-7777-7777-7777-777777777777',
    category_id: '3c333333-3333-3333-3333-333333333333',
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
    category_id: '3c333333-3333-3333-3333-333333333333',
    name_vi: 'Cà Phê Bạc Xỉu Đá',
    name_en: 'Iced White Coffee',
    slug: 'iced-white-coffee',
    description_vi: 'Cà phê hòa quyện cùng sữa đặc ngọt ngào béo ngậy truyền thống Việt Nam.',
    description_en: 'Vietnamese espresso blended with condensed milk and fresh milk.',
    price: 35000,
    image_url: '/images/hero-sandwich.jpg',
    is_new: false,
    is_best_seller: true,
  },
  {
    id: '5d555555-5555-5555-5555-555555555555',
    category_id: '4d444444-4444-4444-4444-444444444444',
    name_vi: 'Sinh Tố Bơ Tươi',
    name_en: 'Fresh Avocado Smoothie',
    slug: 'fresh-avocado-smoothie',
    description_vi: 'Sinh tố bơ sáp tươi béo ngậy hòa quyện cùng sữa tươi và sữa đặc mát lạnh.',
    description_en: 'Creamy fresh avocado blended with chilled fresh milk and sweet condensed milk.',
    price: 45000,
    image_url: '/images/hero-sandwich.jpg',
    is_new: true,
    is_best_seller: true,
  },
  {
    id: '6d666666-6666-6666-6666-666666666666',
    category_id: '4d444444-4444-4444-4444-444444444444',
    name_vi: 'Nước Ép Cam Tươi',
    name_en: 'Fresh Squeezed Orange Juice',
    slug: 'fresh-orange-juice',
    description_vi: 'Nước ép cam sành tươi nguyên chất 100%, giàu vitamin C sảng khoái.',
    description_en: '100% freshly squeezed natural orange juice, rich in Vitamin C.',
    price: 39000,
    image_url: '/images/hero-sandwich.jpg',
    is_new: false,
    is_best_seller: true,
  }
];

interface MenuPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; q?: string }>;
}

export default async function MenuPage({ params, searchParams }: MenuPageProps) {
  const { locale } = await params;
  const { category: selectedCategorySlug = 'all', q = '' } = await searchParams;
  
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

  // 3. Filter products by category and query
  let filteredProducts = activeCategory.id === 'all'
    ? products
    : products.filter((p) => p.category_id === activeCategory.id);

  if (q.trim()) {
    const searchQuery = q.trim().toLowerCase();
    filteredProducts = filteredProducts.filter((p) =>
      p.name_vi.toLowerCase().includes(searchQuery) ||
      p.name_en.toLowerCase().includes(searchQuery) ||
      p.description_vi.toLowerCase().includes(searchQuery) ||
      p.description_en.toLowerCase().includes(searchQuery)
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-24 md:pt-28 pb-12 md:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Title Header */}
        <div className="text-center max-w-xl mx-auto space-y-3">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#111111]">
            {tm('title')}
          </h1>
          <p className="text-sm md:text-base text-[#6B7280] font-medium leading-relaxed">
            {tm('subtitle')}
          </p>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap justify-center gap-2 border-b border-[#E5E7EB] pb-6">
          {categories.map((cat) => {
            const isActive = cat.slug === selectedCategorySlug;
            return (
              <Link
                key={cat.id}
                href={cat.slug === 'all' ? '/menu' : `/menu?category=${cat.slug}`}
                className={`px-4 sm:px-5 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all duration-200 ${
                  isActive
                    ? 'bg-[#E53935] text-white shadow-md scale-105'
                    : 'bg-white text-[#111111] hover:text-[#E53935] hover:bg-[#F8F9FA] border border-[#E5E7EB]'
                }`}
              >
                {isVi ? cat.name_vi : cat.name_en}
              </Link>
            );
          })}
        </div>

        {/* Product Grid */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-[#E5E7EB] max-w-md mx-auto p-8 space-y-4 shadow-xs">
            <span className="text-4xl block">🍳</span>
            <p className="text-[#6B7280] font-bold text-sm">{tm('emptyState')}</p>
            <Link
              href="/menu"
              className="inline-block text-xs font-black uppercase tracking-wider text-[#111111] hover:text-[#E53935]"
            >
              Reset Filters
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {filteredProducts.map((product) => (
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
        )}
      </div>
    </div>
  );
}
