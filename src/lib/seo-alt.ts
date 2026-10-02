/**
 * Multilingual SEO Alt Helper for Eggu Website
 * Tự động hóa thuộc tính alt đa ngôn ngữ theo chuẩn SEO dựa vào ngôn ngữ hiện tại (vi / en).
 */

export type SupportedLocale = 'vi' | 'en' | string;

/**
 * Cú pháp alt tự động cho món ăn:
 * Khi ở vi: `${productName} - Bánh Mì Sandwich Trứng Eggu`
 * Khi ở en: `${productName} - Eggu Korean Egg Sandwich`
 * Dự phòng (Fallback nếu chưa có tên món):
 * vi: "Sandwich Trứng Eggu"
 * en: "Eggu Korean Egg Sandwich"
 */
export function getProductAlt(
  productName: string | null | undefined,
  locale: SupportedLocale = 'vi'
): string {
  const isVi = locale === 'vi';
  const cleanName = productName?.trim();

  if (!cleanName) {
    return isVi ? 'Sandwich Trứng Eggu' : 'Eggu Korean Egg Sandwich';
  }

  return isVi
    ? `${cleanName} - Bánh Mì Sandwich Trứng Eggu`
    : `${cleanName} - Eggu Korean Egg Sandwich`;
}

/**
 * Lấy tên món theo ngôn ngữ tương ứng rồi tạo alt SEO:
 * vi: name_vi hoặc name
 * en: name_en hoặc fallback name / name_vi
 */
export function getProductAltFromItem(
  item: {
    name_vi?: string | null;
    name_en?: string | null;
    name?: string | null;
  } | null | undefined,
  locale: SupportedLocale = 'vi'
): string {
  const isVi = locale === 'vi';
  if (!item) {
    return isVi ? 'Sandwich Trứng Eggu' : 'Eggu Korean Egg Sandwich';
  }

  const productName = isVi
    ? (item.name_vi || item.name)
    : (item.name_en || item.name || item.name_vi);

  return getProductAlt(productName, locale);
}

/**
 * Logo Eggu (Header / Footer):
 * vi: "Logo Eggu - Sandwich Trứng Chuẩn Vị Hàn Quốc"
 * en: "Eggu Logo - Authentic Korean Egg Sandwich"
 */
export function getLogoAlt(locale: SupportedLocale = 'vi'): string {
  const isVi = locale === 'vi';
  return isVi
    ? 'Logo Eggu - Sandwich Trứng Chuẩn Vị Hàn Quốc'
    : 'Eggu Logo - Authentic Korean Egg Sandwich';
}

/**
 * Biểu tượng / Icon mạng xã hội & Tiện ích:
 * Facebook: vi → "Fanpage Facebook Eggu Việt Nam"; en → "Eggu Vietnam Facebook Fanpage"
 * Zalo: vi → "Zalo hỗ trợ Eggu"; en → "Eggu Zalo Support"
 * TikTok: vi → "Kênh TikTok Eggu Việt Nam"; en → "Eggu Vietnam TikTok Channel"
 * Bản đồ: vi → "Bản đồ chỉ đường đến Eggu 54 Nguyễn Hữu Huân"; en → "Map to Eggu 54 Nguyen Huu Huan"
 */
export const SOCIAL_ALT = {
  facebook: (locale: SupportedLocale = 'vi') =>
    locale === 'vi' ? 'Fanpage Facebook Eggu Việt Nam' : 'Eggu Vietnam Facebook Fanpage',
  zalo: (locale: SupportedLocale = 'vi') =>
    locale === 'vi' ? 'Zalo hỗ trợ Eggu' : 'Eggu Zalo Support',
  tiktok: (locale: SupportedLocale = 'vi') =>
    locale === 'vi' ? 'Kênh TikTok Eggu Việt Nam' : 'Eggu Vietnam TikTok Channel',
  map: (locale: SupportedLocale = 'vi') =>
    locale === 'vi'
      ? 'Bản đồ chỉ đường đến Eggu 54 Nguyễn Hữu Huân'
      : 'Map to Eggu 54 Nguyen Huu Huan',
};

/**
 * Hình ảnh Câu chuyện thương hiệu (Brand Story):
 * vi: "Câu chuyện thương hiệu Eggu - Bánh Mì Sandwich Trứng Chuẩn Vị Hàn Quốc"
 * en: "Eggu Brand Story - Authentic Korean Egg Sandwich"
 */
export function getBrandStoryAlt(locale: SupportedLocale = 'vi'): string {
  const isVi = locale === 'vi';
  return isVi
    ? 'Câu chuyện thương hiệu Eggu - Bánh Mì Sandwich Trứng Chuẩn Vị Hàn Quốc'
    : 'Eggu Brand Story - Authentic Korean Egg Sandwich';
}
