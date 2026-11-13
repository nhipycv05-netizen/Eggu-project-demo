export interface ProductItem {
  id: string;
  category_id?: string;
  category_slug?: string;
  name_vi: string;
  name_en: string;
  slug: string;
  description_vi?: string | null;
  description_en?: string | null;
  price: number;
  image_url?: string | null;
  is_new?: boolean | null;
  is_best_seller?: boolean | null;
  is_available?: boolean | null;
  sort_order?: number;
}

export interface CategoryItem {
  id: string;
  name_vi: string;
  name_en: string;
  slug: string;
}

export const MOCK_CATEGORIES: CategoryItem[] = [
  { id: 'all', name_vi: 'Tất Cả', name_en: 'All', slug: 'all' },
  { id: '1a111111-1111-1111-1111-111111111111', name_vi: 'Sandwich', name_en: 'Sandwich', slug: 'sandwich' },
  { id: '2b222222-2222-2222-2222-222222222222', name_vi: 'Món Chiên', name_en: 'Fried Food', slug: 'fried-food' },
  { id: '3c333333-3333-3333-3333-333333333333', name_vi: 'Cà Phê & Đồ Uống', name_en: 'Coffee & Drinks', slug: 'coffee-drinks' },
  { id: '4d444444-4444-4444-4444-444444444444', name_vi: 'Sinh Tố & Nước Ép', name_en: 'Smoothie & Fresh Juice', slug: 'smoothie-fresh-juice' }
];

export const MOCK_PRODUCTS: ProductItem[] = [
  {
    id: '9a999999-9999-9999-9999-999999999999',
    category_id: '1a111111-1111-1111-1111-111111111111',
    category_slug: 'sandwich',
    name_vi: 'Mr. Egg',
    name_en: 'Mr. Egg',
    slug: 'mr-egg',
    description_vi: 'Vỏ bánh brioche nướng bơ tỏi vàng rụm, ôm trọn lớp trứng cuộn fluffy mềm mượt tan chảy và sốt sriracha ngọt béo cay nhẹ.',
    description_en: 'Garlic butter brioche toast filled with fluffy soft-scrambled eggs and sweet sriracha mayo.',
    price: 39000,
    image_url: '/images/hero-sandwich.jpg',
    is_new: false,
    is_best_seller: true,
    is_available: true,
  },
  {
    id: 'afaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    category_id: '1a111111-1111-1111-1111-111111111111',
    category_slug: 'sandwich',
    name_vi: 'American Ham & Cheese',
    name_en: 'American Ham & Cheese',
    slug: 'american-ham-cheese',
    description_vi: 'Thịt nguội áp chảo thơm lừng, phủ phô mai Cheddar tan chảy quyện cùng trứng cuộn bơ sữa mềm mướt.',
    description_en: 'Fluffy soft-scrambled eggs, premium ham slices, and melted Cheddar cheese.',
    price: 49000,
    image_url: '/images/hero-sandwich.jpg',
    is_new: false,
    is_best_seller: true,
    is_available: true,
  },
  {
    id: 'bfbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    category_id: '1a111111-1111-1111-1111-111111111111',
    category_slug: 'sandwich',
    name_vi: 'Bacon Double Cheese',
    name_en: 'Bacon Double Cheese',
    slug: 'bacon-double-cheese',
    description_vi: 'Nhân đôi thịt xông khói áp chảo giòn rụm, đẫm phô mai Cheddar kép và trứng khuấy bông béo ngậy khó cưỡng.',
    description_en: 'Double crispy bacon, fluffy soft-scrambled eggs, and double melted Cheddar cheese.',
    price: 55000,
    image_url: '/images/hero-sandwich.jpg',
    is_new: false,
    is_best_seller: true,
    is_available: true,
  },
  {
    id: 'cfcccccc-cccc-cccc-cccc-cccccccccccc',
    category_id: '1a111111-1111-1111-1111-111111111111',
    category_slug: 'sandwich',
    name_vi: 'Avocado Holic',
    name_en: 'Avocado Holic',
    slug: 'avocado-holic',
    description_vi: 'Bơ sáp tươi Đà Lạt thái lát bùi béo kết hợp hoàn hảo cùng trứng cuộn thanh trùng mềm mướt và sốt trứng tươi ngậy dịu.',
    description_en: 'Rich soft-scrambled eggs combined with fresh sliced creamy avocado and signature sauce.',
    price: 59000,
    image_url: '/images/hero-sandwich.jpg',
    is_new: true,
    is_best_seller: false,
    is_available: true,
  },
  {
    id: 'dfdddddd-dddd-dddd-dddd-dddddddddddd',
    category_id: '1a111111-1111-1111-1111-111111111111',
    category_slug: 'sandwich',
    name_vi: 'Bánh Mì Tỏi Thịt Xông Khói & Phô Mai',
    name_en: 'Garlic Bacon Cheese Toast',
    slug: 'garlic-bacon-cheese-toast',
    description_vi: 'Bánh mì nướng sốt bơ tỏi vàng ươm nức mũi, đầy ắp thịt xông khói đậm đà, phô mai kéo sợi và mật ong ngọt thanh.',
    description_en: 'Toasted garlic bread loaded with bacon, melted cheese, and sweet honey drizzle.',
    price: 52000,
    image_url: '/images/hero-sandwich.jpg',
    is_new: true,
    is_best_seller: true,
    is_available: true,
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
    is_new: false,
    is_best_seller: false,
    is_available: true,
  },
  {
    id: '7d777777-7777-7777-7777-777777777777',
    category_id: '2b222222-2222-2222-2222-222222222222',
    category_slug: 'fried-food',
    name_vi: 'Phô Mai Que Chiên Giòn',
    name_en: 'Crispy Cheese Sticks',
    slug: 'crispy-cheese-sticks',
    description_vi: 'Phô mai Mozzarella kéo sợi chiên xù vàng rụm ăn kèm sốt chấm đặc chế.',
    description_en: 'Crispy golden breaded mozzarella sticks served with signature dipping sauce.',
    price: 35000,
    image_url: '/images/hero-sandwich.jpg',
    is_new: true,
    is_best_seller: false,
    is_available: true,
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
    is_new: false,
    is_best_seller: true,
    is_available: true,
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
    is_new: false,
    is_best_seller: true,
    is_available: true,
  },
  {
    id: '5d555555-5555-5555-5555-555555555555',
    category_id: '4d444444-4444-4444-4444-444444444444',
    category_slug: 'smoothie-fresh-juice',
    name_vi: 'Sinh Tố Bơ Tươi',
    name_en: 'Fresh Avocado Smoothie',
    slug: 'fresh-avocado-smoothie',
    description_vi: 'Sinh tố bơ sáp tươi béo ngậy hòa quyện cùng sữa tươi và sữa đặc mát lạnh.',
    description_en: 'Creamy fresh avocado blended with chilled fresh milk and sweet condensed milk.',
    price: 45000,
    image_url: '/images/hero-sandwich.jpg',
    is_new: true,
    is_best_seller: true,
    is_available: true,
  },
  {
    id: '6d666666-6666-6666-6666-666666666666',
    category_id: '4d444444-4444-4444-4444-444444444444',
    category_slug: 'smoothie-fresh-juice',
    name_vi: 'Nước Ép Cam Tươi',
    name_en: 'Fresh Squeezed Orange Juice',
    slug: 'fresh-orange-juice',
    description_vi: 'Nước ép cam sành tươi nguyên chất 100%, giàu vitamin C sảng khoái.',
    description_en: '100% freshly squeezed natural orange juice, rich in Vitamin C.',
    price: 39000,
    image_url: '/images/hero-sandwich.jpg',
    is_new: false,
    is_best_seller: true,
    is_available: true,
  }
];

/**
 * Remove Vietnamese diacritics/accents for accent-insensitive search.
 * Preserves 1-to-1 character length mapping to original string.
 */
export function removeVietnameseAccents(str: string): string {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

export interface HighlightSegment {
  text: string;
  isMatch: boolean;
}

/**
 * Splits text into segments indicating whether each segment matches the search query.
 * Accents and case are ignored when matching, while original casing & accents are preserved in output.
 */
export function getHighlightSegments(text: string, query: string): HighlightSegment[] {
  if (!text) return [];
  if (!query || !query.trim()) return [{ text, isMatch: false }];

  const normalizedText = removeVietnameseAccents(text).toLowerCase();
  const rawTerms = query.trim().split(/\s+/).filter(Boolean);

  const intervals: [number, number][] = [];
  for (const term of rawTerms) {
    const normTerm = removeVietnameseAccents(term).toLowerCase();
    if (!normTerm) continue;
    let pos = 0;
    while ((pos = normalizedText.indexOf(normTerm, pos)) !== -1) {
      intervals.push([pos, pos + normTerm.length]);
      pos += normTerm.length;
    }
  }

  if (intervals.length === 0) {
    return [{ text, isMatch: false }];
  }

  // Merge overlapping / adjacent intervals
  intervals.sort((a, b) => a[0] - b[0]);
  const merged: [number, number][] = [intervals[0]];
  for (let i = 1; i < intervals.length; i++) {
    const last = merged[merged.length - 1];
    const curr = intervals[i];
    if (curr[0] <= last[1]) {
      last[1] = Math.max(last[1], curr[1]);
    } else {
      merged.push(curr);
    }
  }

  // Build segments with original string slicing
  const segments: HighlightSegment[] = [];
  let currIdx = 0;
  for (const [start, end] of merged) {
    if (start > currIdx) {
      segments.push({ text: text.slice(currIdx, start), isMatch: false });
    }
    segments.push({ text: text.slice(start, end), isMatch: true });
    currIdx = end;
  }
  if (currIdx < text.length) {
    segments.push({ text: text.slice(currIdx), isMatch: false });
  }

  return segments;
}

/**
 * Filter product list by query with accent & case insensitivity across name_vi, name_en, and descriptions.
 */
export function filterProductsByQuery(products: ProductItem[], query: string): ProductItem[] {
  const q = query.trim();
  if (!q) return products;

  const normalizedQuery = removeVietnameseAccents(q).toLowerCase();
  const queryTokens = normalizedQuery.split(/\s+/).filter(Boolean);

  return products.filter((product) => {
    const normVi = removeVietnameseAccents(product.name_vi || '').toLowerCase();
    const normEn = removeVietnameseAccents(product.name_en || '').toLowerCase();
    const normDescVi = removeVietnameseAccents(product.description_vi || '').toLowerCase();
    const normDescEn = removeVietnameseAccents(product.description_en || '').toLowerCase();

    // Every token in query must match somewhere in the product info
    return queryTokens.every(
      (token) =>
        normVi.includes(token) ||
        normEn.includes(token) ||
        normDescVi.includes(token) ||
        normDescEn.includes(token)
    );
  });
}
