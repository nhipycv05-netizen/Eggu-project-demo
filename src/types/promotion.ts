export interface Promotion {
  id: string;
  code: string;
  title_vi?: string;
  title_en?: string;
  description_vi: string;
  description_en: string;
  discount_type: 'PERCENTAGE' | 'FIXED';
  discount_value: number;
  min_order_value: number | null;
  usage_limit?: number | null;
  used_count?: number;
  start_at: string;
  end_at: string;
  start_date?: string;
  end_date?: string;
  is_active: boolean;
  image_url?: string | null;
  created_at?: string;
  updated_at?: string;
}
