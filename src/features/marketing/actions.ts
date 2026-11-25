'use server';

import { createServiceRoleClient } from '@/lib/supabase/serviceRole';
import { createClient as createServerClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

export interface MarketingPost {
  id: string;
  title: string;
  dish_name: string | null;
  dish_category: string | null;
  dish_price: string | null;
  target_angle: string | null;
  content: string;
  real_photo_url: string | null;
  ai_photo_url: string | null;
  status: 'PENDING' | 'COPIED' | 'PUBLISHED' | 'ARCHIVED';
  created_at: string;
  copied_at: string | null;
}

/**
 * Check if the user is authenticated as admin
 */
async function checkAdminAuth(): Promise<boolean> {
  try {
    const supabase = await createServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return !!user;
  } catch {
    return false;
  }
}

/**
 * Fetch all marketing posts for Admin dashboard
 */
export async function getMarketingPostsAction(): Promise<{
  ok: boolean;
  data: MarketingPost[];
  error?: string;
}> {
  try {
    let supabase = createServiceRoleClient();
    let { data, error } = await supabase
      .from('marketing_posts')
      .select('*')
      .order('created_at', { ascending: false });

    // Fallback directly to anon client if server has invalid service role key
    if (error && (error.message?.includes('API key') || error.code === 'PGRST301')) {
      const { createClient } = await import('@supabase/supabase-js');
      const anonClient = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const fallback = await anonClient
        .from('marketing_posts')
        .select('*')
        .order('created_at', { ascending: false });
      if (!fallback.error) {
        data = fallback.data;
        error = null;
      }
    }

    if (error) {
      // Table might not exist yet if migration hasn't run
      if (error.code === 'PGRST205') {
        return {
          ok: true,
          data: [],
          error: 'Bảng marketing_posts chưa được tạo trên Supabase. Vui lòng chạy file migration.',
        };
      }
      return { ok: false, data: [], error: error.message };
    }

    return { ok: true, data: (data as MarketingPost[]) || [] };
  } catch (err) {
    return {
      ok: false,
      data: [],
      error: err instanceof Error ? err.message : 'Lỗi không xác định',
    };
  }
}

/**
 * Mark a post as copied by staff
 */
export async function markPostAsCopiedAction(id: string): Promise<{
  ok: boolean;
  error?: string;
}> {
  try {
    const supabase = createServiceRoleClient();
    const { error } = await supabase
      .from('marketing_posts')
      .update({
        status: 'COPIED',
        copied_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      return { ok: false, error: error.message };
    }

    revalidatePath('/admin/dashboard');
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Lỗi không xác định',
    };
  }
}

/**
 * Update post status (e.g. PUBLISHED or ARCHIVED)
 */
export async function updatePostStatusAction(
  id: string,
  status: 'PENDING' | 'COPIED' | 'PUBLISHED' | 'ARCHIVED'
): Promise<{ ok: boolean; error?: string }> {
  try {
    const supabase = createServiceRoleClient();
    const { error } = await supabase
      .from('marketing_posts')
      .update({ status })
      .eq('id', id);

    if (error) {
      return { ok: false, error: error.message };
    }

    revalidatePath('/admin/dashboard');
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Lỗi không xác định',
    };
  }
}

/**
 * Delete a post from marketing dashboard
 */
export async function deleteMarketingPostAction(id: string): Promise<{
  ok: boolean;
  error?: string;
}> {
  try {
    const supabase = createServiceRoleClient();
    const { error } = await supabase
      .from('marketing_posts')
      .delete()
      .eq('id', id);

    if (error) {
      return { ok: false, error: error.message };
    }

    revalidatePath('/admin/dashboard');
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error: err instanceof Error ? err.message : 'Lỗi không xác định',
    };
  }
}
