import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { MOCK_PRODUCTS, ProductItem } from '@/lib/mockProducts';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ products: MOCK_PRODUCTS, source: 'fallback' });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const { data: dbProducts, error } = await supabase
      .from('products')
      .select('id, category_id, name_vi, name_en, slug, description_vi, description_en, price, image_url, is_new, is_best_seller, is_available, sort_order')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      console.warn('Failed to fetch products from Supabase, using mock fallback:', error.message);
      return NextResponse.json({ products: MOCK_PRODUCTS, source: 'fallback' });
    }

    if (dbProducts && dbProducts.length > 0) {
      return NextResponse.json(
        { products: dbProducts as ProductItem[], source: 'database' },
        {
          headers: {
            'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
          },
        }
      );
    }

    return NextResponse.json({ products: MOCK_PRODUCTS, source: 'fallback' });
  } catch (error) {
    console.error('Error in /api/products route:', error);
    return NextResponse.json({ products: MOCK_PRODUCTS, source: 'fallback' });
  }
}
