import { CONTACT_CONFIG } from '@/constants/contact';

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : '') ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : '') ||
  'https://eggusandwich.id.vn'
).replace(/\/$/, '');

/**
 * Tạo URL canonical chuẩn SEO theo ngôn ngữ
 */
export function getCanonicalUrl(path: string = '', locale: string = 'vi'): string {
  const cleanPath = path ? (path.startsWith('/') ? path : `/${path}`) : '';
  if (locale === 'en') {
    return `${SITE_URL}/en${cleanPath === '/' ? '' : cleanPath}`;
  }
  return `${SITE_URL}${cleanPath === '/' ? '' : cleanPath}`;
}

/**
 * Hreflang alternates cho thẻ <link rel="alternate" ... />
 */
export function getAlternateLanguages(path: string = '') {
  const cleanPath = path ? (path.startsWith('/') ? path : `/${path}`) : '';
  return {
    vi: `${SITE_URL}${cleanPath === '/' ? '' : cleanPath}`,
    en: `${SITE_URL}/en${cleanPath === '/' ? '' : cleanPath}`,
    'x-default': `${SITE_URL}${cleanPath === '/' ? '' : cleanPath}`,
  };
}

/**
 * Cấu hình SEO riêng biệt cho Trang chủ (/ và /en)
 * Bắt buộc chứa đầy đủ 4 từ khóa:
 * 1. EGGU
 * 2. Sandwich Trứng Hàn Quốc
 * 3. Korean Egg Sandwich
 * 4. Bánh mì sandwich Hà Nội
 */
export const HOMEPAGE_SEO = {
  vi: {
    title: 'EGGU - Sandwich Trứng Hàn Quốc | Bánh Mì Sandwich Hà Nội (Korean Egg Sandwich)',
    description:
      'Thương hiệu EGGU - Sandwich Trứng Hàn Quốc (Korean Egg Sandwich) chuẩn vị hàng đầu tại Hà Nội. Thưởng thức bánh mì sandwich Hà Nội thơm ngon, trứng khuấy mềm béo hảo hạng cùng sốt đặc trưng.',
    keywords: [
      'EGGU',
      'Sandwich Trứng Hàn Quốc',
      'Korean Egg Sandwich',
      'Bánh mì sandwich Hà Nội',
      'Bánh mì kẹp trứng Hàn Quốc',
      'Bánh mì nướng Hàn Quốc Hà Nội',
      'Sandwich Hoàn Kiếm',
      'Bánh mì trứng mềm Hà Nội',
    ],
  },
  en: {
    title: 'EGGU - Korean Egg Sandwich | Sandwich Trứng Hàn Quốc | Bánh Mì Sandwich Hà Nội',
    description:
      'Experience EGGU - Best Korean Egg Sandwich in Hanoi (Sandwich Trứng Hàn Quốc). Authentic street-style bánh mì sandwich Hà Nội with fluffy scrambled eggs and golden toasted brioche.',
    keywords: [
      'EGGU',
      'Korean Egg Sandwich',
      'Sandwich Trứng Hàn Quốc',
      'Bánh mì sandwich Hà Nội',
      'Korean Egg Sandwich Hanoi',
      'Hanoi egg toast',
      'Egg sandwich Old Quarter',
    ],
  },
};

/**
 * Schema JSON-LD Restaurant cho Trang chủ theo chuẩn schema.org
 * Chứa đúng thông tin:
 * - Tên: 'Eggu - Sandwich Trứng Hàn Quốc'
 * - Địa chỉ: '54 Nguyễn Hữu Huân, Hoàn Kiếm, Hà Nội'
 * - Số điện thoại: '0356779899'
 * - Link menu: '${SITE_URL}/menu' (hoặc /en/menu)
 */
export function getRestaurantSchema(locale: string = 'vi') {
  const isVi = locale === 'vi';
  const menuUrl = isVi ? `${SITE_URL}/menu` : `${SITE_URL}/en/menu`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    '@id': `${SITE_URL}/#restaurant`,
    name: 'Eggu - Sandwich Trứng Hàn Quốc',
    alternateName: 'EGGU - Korean Egg Sandwich',
    url: isVi ? SITE_URL : `${SITE_URL}/en`,
    telephone: CONTACT_CONFIG.phone || '0356779899',
    menu: menuUrl,
    hasMenu: menuUrl,
    image: [
      `${SITE_URL}/images/hero-sandwich.jpg`,
      `${SITE_URL}/images/brand-story.jpg`,
    ],
    priceRange: '39.000đ - 65.000đ',
    servesCuisine: [
      'Korean',
      'Sandwich',
      'Breakfast',
      'Fast Food',
      'Toast',
    ],
    description: isVi
      ? 'EGGU - Thương hiệu Sandwich Trứng Hàn Quốc chuẩn vị tại Hà Nội với bánh mì brioche nướng bơ tỏi kẹp trứng khuấy mềm béo hảo hạng.'
      : 'EGGU - Premium Korean Egg Sandwich shop in Hanoi serving fluffy scrambled eggs on garlic butter brioche toast.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '54 Nguyễn Hữu Huân',
      addressLocality: 'Hoàn Kiếm',
      addressRegion: 'Hà Nội',
      postalCode: '100000',
      addressCountry: 'VN',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 21.0336,
      longitude: 105.8545,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: [
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
          'Saturday',
          'Sunday',
        ],
        opens: '07:00',
        closes: '21:00',
      },
    ],
    sameAs: [
      CONTACT_CONFIG.facebookUrl,
      CONTACT_CONFIG.tiktokUrl,
      CONTACT_CONFIG.zaloUrl,
    ].filter(Boolean),
  };
}
