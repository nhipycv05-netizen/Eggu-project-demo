import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/server';
import ProductCustomizer from '@/components/menu/ProductCustomizer';
import { ChevronLeft } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { getProductAltFromItem } from '@/lib/seo-alt';
import { SITE_URL, getCanonicalUrl, getAlternateLanguages } from '@/lib/seo';

const MOCK_PRODUCTS = [
  {
    id: '9a999999-9999-9999-9999-999999999999',
    category_id: '1a111111-1111-1111-1111-111111111111',
    category_slug: 'sandwich',
    name_vi: 'Mr. Egg',
    name_en: 'Mr. Egg',
    slug: 'mr-egg',
    description_vi: 'Bánh mì nướng bơ tỏi kẹp trứng khuấy mềm béo và sốt sriracha ngọt dịu đặc trưng.',
    description_en: 'Garlic butter toast filled with fluffy soft-scrambled eggs and sweet sriracha mayo.',
    price: 39000,
    image_url: '/images/hero-sandwich.jpg',
    ingredients_vi: 'Trứng khuấy mềm, Bánh mì brioche, Sốt Eggu ngọt dịu, Bơ tỏi',
    ingredients_en: 'Fluffy Scrambled Eggs, Brioche Bread, Signature Eggu Mayo, Garlic Butter',
    nutrition: { calories: 480, protein: '15g', fat: '22g', carbs: '45g' },
    allergy_info_vi: 'Có chứa trứng, sữa, gluten từ lúa mì.',
    allergy_info_en: 'Contains eggs, dairy, wheat gluten.',
  },
  {
    id: 'afaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    category_id: '1a111111-1111-1111-1111-111111111111',
    category_slug: 'sandwich',
    name_vi: 'American Ham & Cheese',
    name_en: 'American Ham & Cheese',
    slug: 'american-ham-cheese',
    description_vi: 'Trứng khuấy mềm béo, thịt nguội cao cấp và phô mai Cheddar tan chảy.',
    description_en: 'Fluffy soft-scrambled eggs, premium ham slices, and melted Cheddar cheese.',
    price: 49000,
    image_url: '/images/hero-sandwich.jpg',
    ingredients_vi: 'Trứng khuấy mềm, Thịt nguội, Phô mai Cheddar, Bánh mì brioche, Sốt đặc trưng',
    ingredients_en: 'Fluffy Scrambled Eggs, Ham, Cheddar Cheese, Brioche Bread, Signature Sauce',
    nutrition: { calories: 520, protein: '19g', fat: '26g', carbs: '46g' },
    allergy_info_vi: 'Có chứa trứng, sữa, lúa mì, đậu nành.',
    allergy_info_en: 'Contains eggs, dairy, wheat, soy.',
  },
  {
    id: 'bfbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    category_id: '1a111111-1111-1111-1111-111111111111',
    category_slug: 'sandwich',
    name_vi: 'Bacon Double Cheese',
    name_en: 'Bacon Double Cheese',
    slug: 'bacon-double-cheese',
    description_vi: 'Thịt xông khói giòn nhân đôi, trứng khuấy mềm và phô mai Cheddar kép.',
    description_en: 'Double crispy bacon, fluffy soft-scrambled eggs, and double melted Cheddar cheese.',
    price: 55000,
    image_url: '/images/hero-sandwich.jpg',
    ingredients_vi: 'Thịt xông khói (nhân đôi), Phô mai Cheddar (nhân đôi), Trứng khuấy mềm, Bánh mì brioche',
    ingredients_en: 'Double Bacon, Double Cheddar Cheese, Fluffy Scrambled Eggs, Brioche Bread',
    nutrition: { calories: 610, protein: '22g', fat: '34g', carbs: '44g' },
    allergy_info_vi: 'Có chứa trứng, sữa, lúa mì.',
    allergy_info_en: 'Contains eggs, dairy, wheat.',
  },
  {
    id: 'cfcccccc-cccc-cccc-cccc-cccccccccccc',
    category_id: '1a111111-1111-1111-1111-111111111111',
    category_slug: 'sandwich',
    name_vi: 'Avocado Holic',
    name_en: 'Avocado Holic',
    slug: 'avocado-holic',
    description_vi: 'Bơ sáp tươi thái lát bùi béo kết hợp trứng khuấy mềm và sốt trứng đặc chế.',
    description_en: 'Rich soft-scrambled eggs combined with fresh sliced creamy avocado and signature sauce.',
    price: 59000,
    image_url: '/images/hero-sandwich.jpg',
    ingredients_vi: 'Bơ tươi thái lát, Trứng khuấy mềm, Sốt mù tạt mật ong, Bánh mì brioche',
    ingredients_en: 'Fresh Avocado Slices, Fluffy Scrambled Eggs, Honey Mustard Sauce, Brioche Bread',
    nutrition: { calories: 540, protein: '14g', fat: '28g', carbs: '48g' },
    allergy_info_vi: 'Có chứa trứng, sữa, gluten, hạt.',
    allergy_info_en: 'Contains eggs, dairy, gluten, seeds.',
  },
  {
    id: 'dfdddddd-dddd-dddd-dddd-dddddddddddd',
    category_id: '1a111111-1111-1111-1111-111111111111',
    category_slug: 'sandwich',
    name_vi: 'Bánh Mì Tỏi Thịt Xông Khói & Phô Mai',
    name_en: 'Garlic Bacon Cheese Toast',
    slug: 'garlic-bacon-cheese-toast',
    description_vi: 'Bánh mì nướng tỏi thơm nồng kẹp phô mai, thịt xông khói và sốt mật ong ngọt ngào.',
    description_en: 'Toasted garlic bread loaded with bacon, melted cheese, and sweet honey drizzle.',
    price: 52000,
    image_url: '/images/hero-sandwich.jpg',
    ingredients_vi: 'Bánh mì tỏi, Thịt xông khói, Phô mai, Sốt mật ong',
    ingredients_en: 'Garlic Bread, Bacon, Cheese, Honey Sauce',
    nutrition: { calories: 490, protein: '16g', fat: '24g', carbs: '51g' },
    allergy_info_vi: 'Có chứa gluten, tỏi, sữa.',
    allergy_info_en: 'Contains gluten, garlic, dairy.',
  },
  {
    id: 'efeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    category_id: '2b222222-2222-2222-2222-222222222222',
    category_slug: 'fried-food',
    name_vi: 'Khoai Tây Chiên Pháp',
    name_en: 'French Fries',
    slug: 'french-fries',
    description_vi: 'Khoai tây chiên giòn vàng đều, phủ nhẹ muối biển nhuyễn.',
    description_en: 'Golden crispy French fries lightly dusted with fine sea salt.',
    price: 29000,
    image_url: '/images/hero-sandwich.jpg',
    ingredients_vi: 'Khoai tây tươi, Dầu thực vật, Muối biển',
    ingredients_en: 'Potatoes, Vegetable Oil, Sea Salt',
    nutrition: { calories: 310, protein: '3g', fat: '15g', carbs: '40g' },
    allergy_info_vi: 'Không chứa tác nhân dị ứng phổ biến.',
    allergy_info_en: 'Free from common allergens.',
  },
  {
    id: 'aff77777-7777-7777-7777-777777777777',
    category_id: '3c333333-3333-3333-3333-333333333333',
    category_slug: 'coffee-drinks',
    name_vi: 'Cà Phê Americano Đá',
    name_en: 'Iced Americano',
    slug: 'iced-americano',
    description_vi: 'Cà phê espresso nguyên chất pha với nước lạnh và đá, đậm đà tỉnh táo.',
    description_en: 'Rich espresso shot mixed with cold water and ice for a crisp, refreshing kick.',
    price: 29000,
    image_url: '/images/hero-sandwich.jpg',
    ingredients_vi: 'Hạt cà phê Arabica & Robusta, Nước lọc, Đá',
    ingredients_en: 'Arabica & Robusta Coffee Beans, Water, Ice',
    nutrition: { calories: 15, protein: '0.5g', fat: '0g', carbs: '3g' },
    allergy_info_vi: 'Chứa caffeine.',
    allergy_info_en: 'Contains caffeine.',
  },
  {
    id: 'bff77777-7777-7777-7777-777777777777',
    category_id: '3c333333-3333-3333-3333-333333333333',
    category_slug: 'coffee-drinks',
    name_vi: 'Cà Phê Bạc Xỉu Đá',
    name_en: 'Iced White Coffee',
    slug: 'iced-white-coffee',
    description_vi: 'Cà phê hòa quyện cùng sữa đặc ngọt ngào béo ngậy truyền thống Việt Nam.',
    description_en: 'Vietnamese espresso blended with condensed milk and fresh milk.',
    price: 35000,
    image_url: '/images/hero-sandwich.jpg',
    ingredients_vi: 'Cà phê espresso, Sữa đặc, Sữa tươi, Đá',
    ingredients_en: 'Espresso, Condensed Milk, Fresh Milk, Ice',
    nutrition: { calories: 220, protein: '5g', fat: '6g', carbs: '32g' },
    allergy_info_vi: 'Có chứa sữa, caffeine.',
    allergy_info_en: 'Contains dairy, caffeine.',
  },
  {
    id: 'cff88888-8888-8888-8888-888888888888',
    category_id: '2b222222-2222-2222-2222-222222222222',
    category_slug: 'fried-food',
    name_vi: 'Phô Mai Que Giòn Rụm',
    name_en: 'Crispy Cheese Sticks',
    slug: 'crispy-cheese-sticks',
    description_vi: 'Phô mai Mozzarella bọc bột chiên xù giòn tan kéo sợi thơm ngon hấp dẫn.',
    description_en: 'Crispy golden fried Mozzarella cheese sticks with melted stretchy cheese inside.',
    price: 35000,
    image_url: '/images/hero-sandwich.jpg',
    ingredients_vi: 'Phô mai Mozzarella, Bột chiên xù, Trứng',
    ingredients_en: 'Mozzarella Cheese, Breadcrumbs, Eggs',
    nutrition: { calories: 340, protein: '14g', fat: '20g', carbs: '26g' },
    allergy_info_vi: 'Có chứa sữa, gluten, trứng.',
    allergy_info_en: 'Contains dairy, gluten, eggs.',
  },
  {
    id: 'dff99999-9999-9999-9999-999999999999',
    category_id: '4d444444-4444-4444-4444-444444444444',
    category_slug: 'smoothie-fresh-juice',
    name_vi: 'Sinh Tố Bơ Tươi Dẻo',
    name_en: 'Fresh Avocado Smoothie',
    slug: 'fresh-avocado-smoothie',
    description_vi: 'Sinh tố bơ Đắk Lắk nguyên chất béo ngậy, ngọt dịu thanh mát.',
    description_en: 'Creamy fresh avocado smoothie made with fresh milk and condensed milk.',
    price: 45000,
    image_url: '/images/hero-sandwich.jpg',
    ingredients_vi: 'Bơ sáp tươi, Sữa tươi, Sữa đặc, Đá xay',
    ingredients_en: 'Fresh Avocado, Fresh Milk, Condensed Milk, Ice',
    nutrition: { calories: 380, protein: '6g', fat: '18g', carbs: '48g' },
    allergy_info_vi: 'Có chứa sữa.',
    allergy_info_en: 'Contains dairy.',
  },
  {
    id: 'eff00000-0000-0000-0000-000000000000',
    category_id: '4d444444-4444-4444-4444-444444444444',
    category_slug: 'smoothie-fresh-juice',
    name_vi: 'Nước Cam Vắt Tươi Nguyên Chất',
    name_en: 'Fresh Orange Juice',
    slug: 'fresh-orange-juice',
    description_vi: 'Nước cam sành vắt tươi mọng nước, giàu Vitamin C tăng cường sức đề kháng.',
    description_en: 'Freshly squeezed orange juice, rich in natural Vitamin C.',
    price: 39000,
    image_url: '/images/hero-sandwich.jpg',
    ingredients_vi: 'Cam sành tươi 100%, Đường mía tự nhiên, Đá',
    ingredients_en: '100% Fresh Orange, Cane Sugar, Ice',
    nutrition: { calories: 120, protein: '2g', fat: '0.2g', carbs: '28g' },
    allergy_info_vi: 'Không chứa chất gây dị ứng.',
    allergy_info_en: 'Free from common allergens.',
  }
];

const SANDWICH_TOPPINGS = [
  { id: 'bacon', name: 'Bacon / Thịt xông khói', name_vi: 'Bacon / Thịt xông khói', name_en: 'Bacon / Thịt xông khói', price: 12000 },
  { id: 'ham', name: 'Ham / Thịt dăm bông', name_vi: 'Ham / Thịt dăm bông', name_en: 'Ham / Thịt dăm bông', price: 12000 },
  { id: 'scrambled_egg', name: 'Scrambled egg / Trứng bác', name_vi: 'Scrambled egg / Trứng bác', name_en: 'Scrambled egg / Trứng bác', price: 10000 },
  { id: 'cheese', name: 'Cheese / Phô mai', name_vi: 'Cheese / Phô mai', name_en: 'Cheese / Phô mai', price: 10000 },
  { id: 'garlic_butter', name: 'Garlic butter / Xốt bơ tỏi phết mặt bánh', name_vi: 'Garlic butter / Xốt bơ tỏi phết mặt bánh', name_en: 'Garlic butter / Xốt bơ tỏi phết mặt bánh', price: 7000 },
  { id: 'boiled_egg', name: 'Boiled Egg / Trứng luộc', name_vi: 'Boiled Egg / Trứng luộc', name_en: 'Boiled Egg / Trứng luộc', price: 10000 },
];

interface ProductDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const isVi = locale === 'vi';

  let product: any = MOCK_PRODUCTS.find((p) => p.slug === slug);
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .maybeSingle();
    if (data) product = data;
  } catch {
    // fallback to mock
  }

  if (!product) {
    return {
      title: isVi ? 'Món Ăn Không Tồn Tại | EGGU' : 'Product Not Found | EGGU',
    };
  }

  const name = isVi
    ? (product.name_vi || product.name)
    : (product.name_en || product.name || product.name_vi);
  const title = isVi
    ? `${name} - Sandwich Trứng Hàn Quốc | EGGU Hà Nội`
    : `${name} - Korean Egg Sandwich | EGGU Hanoi`;
  const description = isVi
    ? (product.description_vi || `Thưởng thức ${name} - Bánh mì sandwich trứng Hàn Quốc chuẩn vị tại EGGU Hà Nội.`)
    : (product.description_en || `Enjoy ${name} - Authentic Korean egg sandwich at EGGU Hanoi.`);
  const canonicalUrl = getCanonicalUrl(`/menu/${slug}`, locale);
  const alternates = getAlternateLanguages(`/menu/${slug}`);

  return {
    title,
    description,
    keywords: [
      name,
      'EGGU',
      'Sandwich Trứng Hàn Quốc',
      'Korean Egg Sandwich',
      'Bánh mì sandwich Hà Nội',
    ],
    alternates: {
      canonical: canonicalUrl,
      languages: alternates,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: 'EGGU',
      images: [
        {
          url: product.image_url?.startsWith('http')
            ? product.image_url
            : `${SITE_URL}${product.image_url || '/images/hero-sandwich.jpg'}`,
          alt: `${name} - EGGU Sandwich`,
        },
      ],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { locale, slug } = await params;
  
  const tp = await getTranslations('product');
  const tc = await getTranslations('common');
  const isVi = locale === 'vi';

  // 1. Fetch Product from DB or fallback to MOCK_PRODUCTS
  let product = MOCK_PRODUCTS.find((p) => p.slug === slug);

  try {
    const supabase = await createClient();
    
    // Fetch product details with joined category
    const { data: dbProduct } = await supabase
      .from('products')
      .select('*, categories(id, slug, name_vi, name_en)')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();
    
    if (dbProduct) {
      product = dbProduct;
    }
  } catch (error) {
    console.error('Supabase query failed on product detail page, using mock fallbacks:', error);
  }

  // If no product found in DB or mocks, trigger 404
  if (!product) {
    notFound();
  }

  // 2. Check if product belongs to SANDWICH category (Toppings ONLY available for sandwiches)
  const categorySlug = (product as Record<string, any>)?.categories?.slug || (product as Record<string, any>)?.category_slug;
  const categoryId = (product as Record<string, any>)?.category_id;
  const productNameVi = ((product as Record<string, any>)?.name_vi || '').toLowerCase();
  const productNameEn = ((product as Record<string, any>)?.name_en || '').toLowerCase();

  const isSandwich =
    categorySlug === 'sandwich' ||
    categoryId === '1a111111-1111-1111-1111-111111111111' ||
    productNameVi.includes('sandwich') ||
    productNameEn.includes('sandwich') ||
    productNameVi.includes('bánh mì') ||
    productNameEn.includes('toast') ||
    ['mr-egg', 'american-ham-cheese', 'bacon-double-cheese', 'avocado-holic', 'garlic-bacon-cheese-toast'].includes(slug);

  // If sandwich, ALWAYS render exactly the 6 shared standard SANDWICH_TOPPINGS. For other categories (drinks, fries), empty array.
  const options = isSandwich ? SANDWICH_TOPPINGS : [];

  // Parse nutrition if string or object
  const nutrition = typeof product.nutrition === 'string'
    ? JSON.parse(product.nutrition)
    : product.nutrition;

  // Check if sold out
  const isSoldOut = (product as Record<string, any>)?.is_available === false;

  const productDisplayName = isVi
    ? ((product as any).name_vi || (product as any).name)
    : ((product as any).name_en || (product as any).name || (product as any).name_vi);

  const productSchema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: productDisplayName,
    description: isVi ? (product.description_vi || '') : (product.description_en || ''),
    image: product.image_url?.startsWith('http')
      ? product.image_url
      : `${SITE_URL}${product.image_url || '/images/hero-sandwich.jpg'}`,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: 'VND',
      availability: isSoldOut ? 'https://schema.org/OutOfStock' : 'https://schema.org/InStock',
      url: getCanonicalUrl(`/menu/${slug}`, locale),
    },
    brand: {
      '@type': 'Brand',
      name: 'EGGU',
    },
  };

  return (
    <div className="min-h-screen bg-transparent pt-24 md:pt-28 pb-28 md:pb-16">
      {/* Product Schema Markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Back Link */}
        <div>
          <Link
            href="/menu"
            className="inline-flex items-center space-x-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#706860] hover:text-[#1E1B18] transition duration-150"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{isVi ? 'Quay lại thực đơn' : 'Back to Menu'}</span>
          </Link>
        </div>

        {/* Product Page Detail Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Image Card */}
          <div className="lg:col-span-5 w-full flex justify-center">
            <div className="w-full max-w-sm sm:max-w-md relative aspect-square h-[340px] sm:h-[380px] md:h-[400px] max-h-[400px] rounded-3xl overflow-hidden border border-[#E5E0D8] bg-white shadow-sm p-6 flex items-center justify-center">
              <div className="relative w-full h-full">
                <Image
                  src={product.image_url || '/images/hero-sandwich.jpg'}
                  alt={getProductAltFromItem(product, locale)}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 40vw, 400px"
                  className={`object-contain transition-transform duration-300 hover:scale-105 ${isSoldOut ? 'opacity-75 grayscale-[30%]' : ''}`}
                />
              </div>
              {isSoldOut && (
                <div className="absolute top-4 left-4 z-10">
                  <span className="bg-[#1E1B18]/90 backdrop-blur-xs text-white font-black text-xs uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-md">
                    {isVi ? 'HẾT MÓN' : 'SOLD OUT'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Customizer Details */}
          <div className="lg:col-span-7 w-full space-y-4 pt-0">
            <div className="mb-3 space-y-1.5">
              <h1 className="text-2xl md:text-3xl font-bold text-[#1E1B18] leading-tight break-words">
                {isVi ? product.name_vi : product.name_en}
              </h1>
              <p className="text-xl font-bold text-[#e0352b]">
                {formatPrice(product.price)} {tc('currency')}
              </p>
              <p className="text-xs sm:text-sm text-[#706860] leading-relaxed font-medium">
                {isVi ? product.description_vi : product.description_en}
              </p>
            </div>

            {/* Interactive Customizer */}
            <ProductCustomizer
              product={{
                id: product.id,
                name_vi: product.name_vi,
                name_en: product.name_en,
                price: product.price,
                image_url: product.image_url || '',
                is_available: !isSoldOut,
                category_slug: categorySlug,
                category: categorySlug,
                slug: product.slug,
              }}
              category={categorySlug}
              options={options}
              locale={locale}
            />

            {/* Accordion Content Information (Compact) */}
            <div className="border-t border-[#E5E0D8] pt-4 space-y-2.5 text-xs font-medium">
              {/* Ingredients details */}
              {(product.ingredients_vi || product.ingredients_en) && (
                <div className="space-y-0.5">
                  <h4 className="text-neutral-500 uppercase tracking-widest font-bold text-[10px]">
                    {tp('ingredients')}
                  </h4>
                  <p className="text-[#1E1B18] text-xs font-medium leading-relaxed">
                    {isVi ? product.ingredients_vi : product.ingredients_en}
                  </p>
                </div>
              )}

              {/* Allergen details */}
              {(product.allergy_info_vi || product.allergy_info_en) && (
                <div className="space-y-0.5 pt-1">
                  <h4 className="text-red-500 uppercase tracking-widest font-bold text-[10px]">
                    {tp('allergy')}
                  </h4>
                  <p className="text-[#1E1B18] text-xs font-medium leading-relaxed">
                    {isVi ? product.allergy_info_vi : product.allergy_info_en}
                  </p>
                </div>
              )}

              {/* Nutrition details */}
              {nutrition && (
                <div className="space-y-1.5 pt-1">
                  <h4 className="text-neutral-500 uppercase tracking-widest font-bold text-[10px]">
                    {tp('nutrition')}
                  </h4>
                  <div className="grid grid-cols-4 gap-2 bg-white/80 p-2 rounded-xl border border-[#E5E0D8]">
                    {Object.entries(nutrition).map(([key, val]) => (
                      <div key={key} className="text-center">
                        <span className="text-[9px] text-[#706860] uppercase font-bold">{key}</span>
                        <p className="text-[#1E1B18] font-bold text-xs">{val as string}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
