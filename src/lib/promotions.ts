import { Promotion } from '@/types/promotion';

interface PromoMetadata {
  code?: string;
  discount_type?: 'PERCENTAGE' | 'FIXED';
  discount_value?: number;
  min_order_value?: number | null;
  image_url?: string | null;
}

/**
 * Parse a raw database record from the `promotions` table into a unified Promotion object.
 */
export function parsePromotionFromDb(row: Record<string, any>): Promotion {
  let meta: PromoMetadata = {};

  if (row.image_url && typeof row.image_url === 'string' && row.image_url.trim().startsWith('{')) {
    try {
      meta = JSON.parse(row.image_url);
    } catch {
      // Ignore JSON parse error and keep meta empty
    }
  }

  const code =
    row.code ||
    meta.code ||
    (row.title_vi && row.title_vi.length <= 25 && !row.title_vi.includes(' ')
      ? row.title_vi.toUpperCase()
      : 'EGGU');

  const discount_type: 'PERCENTAGE' | 'FIXED' =
    row.discount_type || meta.discount_type || 'PERCENTAGE';

  const discount_value = Number(
    row.discount_value !== undefined && row.discount_value !== null
      ? row.discount_value
      : meta.discount_value !== undefined && meta.discount_value !== null
      ? meta.discount_value
      : 10
  );

  const min_order_value =
    row.min_order_value !== undefined && row.min_order_value !== null
      ? Number(row.min_order_value)
      : meta.min_order_value !== undefined && meta.min_order_value !== null
      ? Number(meta.min_order_value)
      : null;

  const start_at = row.start_at || row.start_date || new Date().toISOString();
  const end_at =
    row.end_at ||
    row.end_date ||
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  return {
    id: row.id,
    code: code.toUpperCase().trim(),
    title_vi: row.title_vi || '',
    title_en: row.title_en || '',
    description_vi: row.description_vi || '',
    description_en: row.description_en || '',
    discount_type,
    discount_value,
    min_order_value,
    start_at,
    end_at,
    start_date: start_at,
    end_date: end_at,
    is_active: Boolean(row.is_active),
    image_url: meta.image_url || (!row.image_url?.trim().startsWith('{') ? row.image_url : null),
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

/**
 * Serialize a Promotion object into DB columns compatible with the existing schema.
 */
export function serializePromotionForDb(promo: {
  code: string;
  description_vi: string;
  description_en: string;
  discount_type: 'PERCENTAGE' | 'FIXED';
  discount_value: number;
  min_order_value: number | null;
  start_date: string;
  end_date: string;
  is_active: boolean;
  image_url?: string | null;
}) {
  const meta: PromoMetadata = {
    code: promo.code.toUpperCase().trim(),
    discount_type: promo.discount_type,
    discount_value: Number(promo.discount_value),
    min_order_value: promo.min_order_value ? Number(promo.min_order_value) : null,
    image_url: promo.image_url || null,
  };

  return {
    title_vi: promo.code.toUpperCase().trim(),
    title_en: promo.code.toUpperCase().trim(),
    description_vi: promo.description_vi,
    description_en: promo.description_en,
    image_url: JSON.stringify(meta),
    start_at: new Date(promo.start_date).toISOString(),
    end_at: new Date(promo.end_date).toISOString(),
    is_active: promo.is_active,
  };
}

/**
 * Check whether a promotion is currently active and within its valid date range.
 */
export function isPromotionActiveAndValid(promo: Promotion, now = new Date()): boolean {
  if (!promo.is_active) return false;

  const start = new Date(promo.start_at);
  const end = new Date(promo.end_at);
  const currentTime = now.getTime();

  if (!isNaN(start.getTime()) && currentTime < start.getTime()) {
    return false;
  }

  if (!isNaN(end.getTime()) && currentTime > end.getTime()) {
    return false;
  }

  return true;
}
