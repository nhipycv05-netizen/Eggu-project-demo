import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import ProductCard from '@/components/menu/ProductCard';
import CategoryHorizontalSection from '@/components/menu/CategoryHorizontalSection';
import { Link } from '@/i18n/navigation';
import { createClient } from '@/lib/supabase/server';
import { SITE_URL, getCanonicalUrl, getAlternateLanguages } from '@/lib/seo';

import { MOCK_CATEGORIES, MOCK_PRODUCTS, removeVietnameseAccents } from '@/lib/mockProducts';

interface MenuPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; q?: string }>;
}

export async function generateMetadata({
  params,
}: MenuPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isVi = locale === 'vi';
  const canonicalUrl = getCanonicalUrl('/menu', locale);
  const alternates = getAlternateLanguages('/menu');

  return {
    title: isVi
      ? 'Thực Đơn Sandwich & Đồ Uống | EGGU - Sandwich Trứng Hàn Quốc'
      : 'Menu - Korean Egg Sandwiches & Drinks | EGGU Hanoi',
    description: isVi
      ? 'Khám phá thực đơn bánh mì sandwich trứng Hàn Quốc chuẩn vị tại EGGU Hà Nội: Mr. Egg, Ham & Cheese, Bacon Double Cheese và các loại đồ uống thanh mát.'
      : 'Explore EGGU Hanoi full menu: signature Korean egg sandwiches, brioche toasts, crispy sides and refreshing drinks.',
    keywords: [
      'Thực đơn EGGU',
      'EGGU menu',
      'Sandwich Trứng Hàn Quốc',
      'Korean Egg Sandwich',
      'Bánh mì sandwich Hà Nội',
    ],
    alternates: {
      canonical: canonicalUrl,
      languages: alternates,
    },
    openGraph: {
      title: isVi
        ? 'Thực Đơn Sandwich & Đồ Uống | EGGU'
        : 'EGGU Menu - Korean Egg Sandwiches & Drinks',
      description: isVi
        ? 'Bánh mì sandwich trứng mềm béo và đồ uống tươi ngon tại EGGU Hà Nội.'
        : 'Authentic Korean egg sandwiches and beverages at EGGU Hanoi.',
      url: canonicalUrl,
      siteName: 'EGGU',
    },
  };
}

function normalizeCategorySlug(slug?: string): string {
  if (!slug) return 'all';
  const s = slug.toLowerCase().trim();
  if (s === 'all' || s === 'tat-ca') return 'all';
  if (s === 'sandwich' || s === 'banh-mi-sandwich') return 'sandwich';
  if (s === 'fried-food' || s === 'mon-chien' || s === 'fried') return 'fried-food';
  if (s === 'coffee-drinks' || s === 'ca-phe-do-uong' || s === 'coffee' || s === 'ca-phe') return 'coffee-drinks';
  if (s === 'smoothie-fresh-juice' || s === 'sinh-to-nuoc-ep' || s === 'smoothie' || s === 'sinh-to') return 'smoothie-fresh-juice';
  return s;
}

export default async function MenuPage({ params, searchParams }: MenuPageProps) {
  const { locale } = await params;
  const { category: rawCategorySlug = 'all', q = '' } = await searchParams;
  const selectedCategorySlug = normalizeCategorySlug(rawCategorySlug);
  
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
  const activeCategory = categories.find((c) => c.slug === selectedCategorySlug || c.slug === rawCategorySlug) || categories[0];

  // 3. Filter products by category and query
  let filteredProducts = activeCategory.id === 'all'
    ? products
    : products.filter((p) => p.category_id === activeCategory.id);

  if (q.trim()) {
    const normQuery = removeVietnameseAccents(q.trim()).toLowerCase();
    const queryTokens = normQuery.split(/\s+/).filter(Boolean);

    filteredProducts = filteredProducts.filter((p) => {
      const normVi = removeVietnameseAccents(p.name_vi || '').toLowerCase();
      const normEn = removeVietnameseAccents(p.name_en || '').toLowerCase();
      const normDescVi = removeVietnameseAccents(p.description_vi || '').toLowerCase();
      const normDescEn = removeVietnameseAccents(p.description_en || '').toLowerCase();

      return queryTokens.every(
        (token) =>
          normVi.includes(token) ||
          normEn.includes(token) ||
          normDescVi.includes(token) ||
          normDescEn.includes(token)
      );
    });
  }

  return (
    <div className="min-h-screen bg-transparent pt-24 md:pt-28 pb-12 md:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Title Header (Minimalist Left-Aligned) */}
        <div className="border-b border-[#e0352b]/20 pb-3 mb-6 text-left">
          <h1 className="text-xl font-bold uppercase tracking-wider text-[#e0352b]">
            {tm('title')}
          </h1>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap justify-center gap-2 border-b border-[#E5E7EB] pb-6">
          {categories.map((cat) => {
            const isActive = cat.id === activeCategory.id;
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

        {/* Product Display: Horizontal Scroll when "All" tab is selected, Grid when specific category is filtered */}
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
        ) : activeCategory.id === 'all' ? (
          <div className="space-y-4">
            {categories
              .filter((cat) => cat.id !== 'all')
              .map((cat) => {
                const categoryProducts = filteredProducts.filter((p) => p.category_id === cat.id);
                if (categoryProducts.length === 0) return null;
                return (
                  <CategoryHorizontalSection
                    key={cat.id}
                    category={cat}
                    products={categoryProducts}
                    locale={locale}
                    buttonLabel={tm('customize')}
                    currencyLabel={tc('currency')}
                    newBadgeLabel={tm('newBadge')}
                    bestSellerBadgeLabel={tm('bestSellerBadge')}
                    soldOutBadgeLabel={tm('soldOutBadge')}
                    soldOutBtnLabel={tm('soldOutBtn')}
                  />
                );
              })}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5 md:gap-4 max-w-7xl mx-auto px-4 my-6">
            {filteredProducts.map((product) => (
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
        )}
      </div>
    </div>
  );
}
