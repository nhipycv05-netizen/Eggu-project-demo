import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/server';
import ProductCustomizer from '@/components/menu/ProductCustomizer';
import { ChevronLeft } from 'lucide-react';

const MOCK_PRODUCTS = [
  {
    id: '9a999999-9999-9999-9999-999999999999',
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
  }
];

const MOCK_OPTIONS = [
  { id: 'opt-cheese', name_vi: 'Thêm Phô Mai Cheddar', name_en: 'Extra Cheddar Cheese', price: 10000 },
  { id: 'opt-bacon', name_vi: 'Thêm Thịt Xông Khói', name_en: 'Extra Crispy Bacon', price: 15000 },
  { id: 'opt-avocado', name_vi: 'Thêm Bơ Sáp Tươi', name_en: 'Extra Sliced Avocado', price: 15000 },
  { id: 'opt-egg', name_vi: 'Thêm Trứng Khuấy', name_en: 'Extra Scrambled Egg', price: 12000 }
];

interface ProductDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { locale, slug } = await params;
  
  const tp = await getTranslations('product');
  const tc = await getTranslations('common');
  const isVi = locale === 'vi';

  // 1. Fetch Product and its Options from Supabase with full fallbacks
  let product = MOCK_PRODUCTS.find((p) => p.slug === slug);
  let options = MOCK_OPTIONS;

  try {
    const supabase = await createClient();
    
    // Fetch product details
    const { data: dbProduct } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();
    
    if (dbProduct) {
      product = dbProduct;
      
      // Fetch options for the fetched product
      const { data: dbOptions } = await supabase
        .from('product_options')
        .select('*')
        .eq('product_id', dbProduct.id)
        .eq('is_active', true)
        .order('sort_order', { ascending: true });
      
      if (dbOptions && dbOptions.length > 0) {
        options = dbOptions;
      } else {
        // If product from DB has no custom options in db_options table, don't show mock toppings
        options = [];
      }
    }
  } catch (error) {
    console.error('Supabase query failed on product detail page, using mock fallbacks:', error);
  }

  // If no product found in DB or mocks, trigger 404
  if (!product) {
    notFound();
  }

  // Parse nutrition if string or object
  const nutrition = typeof product.nutrition === 'string'
    ? JSON.parse(product.nutrition)
    : product.nutrition;

  return (
    <div className="site-frame min-h-screen bg-[#fff9f7] px-7 pb-16 pt-20">
      <div className="mx-auto max-w-[1040px]">
        {/* Back Link */}
        <div className="mb-8">
          <Link
            href="/menu"
            className="inline-flex items-center space-x-2 text-sm font-bold uppercase tracking-wider text-[#706860] hover:text-[#1E1B18] transition duration-150"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{isVi ? 'Quay lại thực đơn' : 'Back to Menu'}</span>
          </Link>
        </div>

        {/* Product Page Detail Grid */}
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Left Column: Image Card */}
          <div className="relative mx-auto aspect-square w-full max-w-[520px] overflow-hidden rounded-xl border border-[#eadfdb] bg-neutral-100 shadow-sm">
            <Image
              src={product.image_url || '/images/hero-sandwich.jpg'}
              alt={isVi ? product.name_vi : product.name_en}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 520px"
              className="object-cover"
            />
          </div>

          {/* Right Column: Customizer Details */}
          <div className="space-y-6 pt-1">
            <div className="space-y-4">
              <h1 className="text-3xl lg:text-4xl font-black text-[#1E1B18] leading-tight">
                {isVi ? product.name_vi : product.name_en}
              </h1>
              <p className="text-2xl font-black text-[#5C4B3E]">
                {product.price.toLocaleString()} {tc('currency')}
              </p>
              <p className="text-sm text-[#706860] leading-relaxed font-medium">
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
              }}
              options={options}
              locale={locale}
            />

            {/* Accordion Content Information */}
            <div className="border-t border-[#E5E0D8] pt-6 space-y-4 text-xs font-semibold">
              {/* Ingredients details */}
              {(product.ingredients_vi || product.ingredients_en) && (
                <div className="space-y-1">
                  <h4 className="text-neutral-500 uppercase tracking-widest font-black text-[10px]">
                    {tp('ingredients')}
                  </h4>
                  <p className="text-[#1E1B18] text-sm font-medium">
                    {isVi ? product.ingredients_vi : product.ingredients_en}
                  </p>
                </div>
              )}

              {/* Allergen details */}
              {(product.allergy_info_vi || product.allergy_info_en) && (
                <div className="space-y-1 pt-2">
                  <h4 className="text-red-500 uppercase tracking-widest font-black text-[10px]">
                    {tp('allergy')}
                  </h4>
                  <p className="text-[#1E1B18] text-sm font-medium">
                    {isVi ? product.allergy_info_vi : product.allergy_info_en}
                  </p>
                </div>
              )}

              {/* Nutrition details */}
              {nutrition && (
                <div className="space-y-2 pt-2">
                  <h4 className="text-neutral-500 uppercase tracking-widest font-black text-[10px]">
                    {tp('nutrition')}
                  </h4>
                  <div className="grid grid-cols-4 gap-2 bg-[#FAF8F5] p-3 rounded-lg border border-[#E5E0D8]">
                    {Object.entries(nutrition).map(([key, val]) => (
                      <div key={key} className="text-center">
                        <span className="text-[10px] text-[#706860] uppercase font-bold">{key}</span>
                        <p className="text-[#1E1B18] font-bold text-sm">{val as string}</p>
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
