import { Promotion } from '@/types/promotion';

interface PromoMetadata {
  code?: string;
  discount_type?: 'PERCENTAGE' | 'FIXED';
  discount_value?: number;
  min_order_value?: number | null;
  usage_limit?: number | null;
  used_count?: number;
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

  const rawCode =
    row.code ||
    meta.code ||
    (row.title_vi && row.title_vi.trim().length <= 25
      ? row.title_vi.trim().toUpperCase().replace(/\s+/g, '')
      : '') ||
    (row.title_en && row.title_en.trim().length <= 25
      ? row.title_en.trim().toUpperCase().replace(/\s+/g, '')
      : '') ||
    'EGGU';

  const discount_type: 'PERCENTAGE' | 'FIXED' =
    row.discount_type || meta.discount_type || 'PERCENTAGE';

  const discount_value = Number(
    row.discount_value !== undefined && row.discount_value !== null
      ? row.discount_value
      : meta.discount_value !== undefined && meta.discount_value !== null
      ? meta.discount_value
      : 0
  );

  const min_order_value =
    row.min_order_value !== undefined && row.min_order_value !== null
      ? Number(row.min_order_value)
      : meta.min_order_value !== undefined && meta.min_order_value !== null
      ? Number(meta.min_order_value)
      : null;

  const usage_limit =
    row.usage_limit !== undefined && row.usage_limit !== null
      ? Number(row.usage_limit)
      : meta.usage_limit !== undefined && meta.usage_limit !== null
      ? Number(meta.usage_limit)
      : null;

  const used_count = Number(
    row.used_count !== undefined && row.used_count !== null
      ? row.used_count
      : meta.used_count !== undefined && meta.used_count !== null
      ? meta.used_count
      : 0
  );

  const start_at = row.start_at || row.start_date || new Date().toISOString();
  const end_at =
    row.end_at ||
    row.end_date ||
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

  const isActive =
    row.status !== undefined
      ? String(row.status).toLowerCase() === 'active'
      : Boolean(row.is_active);

  return {
    id: row.id,
    code: rawCode.toUpperCase().trim(),
    title_vi: row.title_vi || '',
    title_en: row.title_en || '',
    description_vi: row.description_vi || '',
    description_en: row.description_en || '',
    discount_type,
    discount_value,
    min_order_value,
    usage_limit,
    used_count,
    start_at,
    end_at,
    start_date: start_at,
    end_date: end_at,
    is_active: isActive,
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
  usage_limit?: number | null;
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
    usage_limit: promo.usage_limit !== undefined && promo.usage_limit !== null ? Number(promo.usage_limit) : null,
    image_url: promo.image_url || null,
  };

  const endDateObj = new Date(promo.end_date);
  if (/^\d{4}-\d{2}-\d{2}$/.test(promo.end_date.trim())) {
    endDateObj.setHours(23, 59, 59, 999);
  }

  return {
    title_vi: promo.code.toUpperCase().trim(),
    title_en: promo.code.toUpperCase().trim(),
    description_vi: promo.description_vi,
    description_en: promo.description_en,
    image_url: JSON.stringify(meta),
    usage_limit: promo.usage_limit !== undefined && promo.usage_limit !== null ? Number(promo.usage_limit) : null,
    start_at: new Date(promo.start_date).toISOString(),
    end_at: endDateObj.toISOString(),
    is_active: promo.is_active,
  };
}

/**
 * Check whether a promotion is currently active and within its valid date range.
 */
export function isPromotionActiveAndValid(promo: Promotion, now = new Date()): boolean {
  const isActive =
    (promo as any).status !== undefined
      ? String((promo as any).status).toLowerCase() === 'active'
      : Boolean(promo.is_active);

  if (!isActive) return false;

  const currentTime = now.getTime();

  if (promo.start_at) {
    const start = new Date(promo.start_at);
    if (!isNaN(start.getTime()) && currentTime < start.getTime()) {
      return false;
    }
  }

  if (promo.end_at) {
    const end = new Date(promo.end_at);
    if (!isNaN(end.getTime())) {
      let endTime = end.getTime();
      if (typeof promo.end_at === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(promo.end_at.trim())) {
        const endOfDay = new Date(promo.end_at);
        endOfDay.setHours(23, 59, 59, 999);
        endTime = endOfDay.getTime();
      }
      if (currentTime > endTime) {
        return false;
      }
    }
  }

  return true;
}
