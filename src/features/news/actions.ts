'use server';

import { createClient as createServerClient } from '@/lib/supabase/server';
import { createServiceRoleClient } from '@/lib/supabase/serviceRole';
import { revalidatePath } from 'next/cache';

export interface NewsPayload {
  id?: string;
  title_vi: string;
  title_en: string;
  slug: string;
  summary_vi: string;
  summary_en: string;
  content_vi?: string | null;
  content_en?: string | null;
  thumbnail_url?: string | null;
  status: 'DRAFT' | 'PUBLISHED';
  published_at?: string | null;
}

/**
 * Robust Vietnamese slugifier:
 * Converts Vietnamese characters with accents to ASCII equivalents,
 * removes special characters, and hyphenates words.
 */
export async function generateSlug(text: string): Promise<string> {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, 'd')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

/**
 * Verify if current session belongs to an authenticated user/admin.
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
 * Server action to save (create or update) a news article.
 * Validates data, ensures slug uniqueness, and executes via Supabase.
 */
export async function saveNewsArticleAction(payload: NewsPayload): Promise<{
  ok: boolean;
  data?: any;
  error?: string;
}> {
  try {
    // 1. Check authentication
    const isAuthenticated = await checkAdminAuth();
    if (!isAuthenticated) {
      return {
        ok: false,
        error: 'Phiên đăng nhập quản trị đã hết hạn. Vui lòng đăng nhập lại.',
      };
    }

    // 2. Validate essential fields
    if (!payload.title_vi?.trim()) {
      return { ok: false, error: 'Tiêu đề tiếng Việt không được để trống.' };
    }
    if (!payload.title_en?.trim()) {
      return { ok: false, error: 'Tiêu đề tiếng Anh không được để trống.' };
    }

    // 3. Normalize slug
    let rawSlug = payload.slug?.trim();
    if (!rawSlug) {
      rawSlug = await generateSlug(payload.title_en || payload.title_vi);
    } else {
      // Normalize provided slug to be URL-safe (lowercase, hyphenated, no trailing slashes)
      rawSlug = rawSlug
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[đĐ]/g, 'd')
        .replace(/[^a-z0-9-]+/g, '-')
        .replace(/(^-|-$)+/g, '');
    }

    if (!rawSlug) {
      return { ok: false, error: 'Không thể tạo đường dẫn URL (slug) hợp lệ từ tiêu đề.' };
    }

    // 4. Use service role client to ensure reliable admin operations
    const client = createServiceRoleClient();

    // 5. Check duplicate slug
    const { data: existingWithSlug, error: slugCheckErr } = await client
      .from('news')
      .select('id, title_vi')
      .eq('slug', rawSlug)
      .maybeSingle();

    if (slugCheckErr) {
      console.error('Error checking duplicate slug:', slugCheckErr);
    } else if (existingWithSlug && existingWithSlug.id !== payload.id) {
      return {
        ok: false,
        error: `Đường dẫn URL (slug) "${rawSlug}" đã được sử dụng bởi bài viết "${existingWithSlug.title_vi}". Vui lòng chọn đường dẫn khác.`,
      };
    }

    const cleanPayload = {
      title_vi: payload.title_vi.trim(),
      title_en: payload.title_en.trim(),
      slug: rawSlug,
      summary_vi: payload.summary_vi?.trim() || '',
      summary_en: payload.summary_en?.trim() || '',
      content_vi: payload.content_vi?.trim() || null,
      content_en: payload.content_en?.trim() || null,
      thumbnail_url: payload.thumbnail_url?.trim() || null,
      status: payload.status,
      published_at: payload.published_at || new Date().toISOString(),
    };

    let resultData = null;

    if (payload.id) {
      // UPDATE
      const { data, error } = await client
        .from('news')
        .update(cleanPayload)
        .eq('id', payload.id)
        .select()
        .single();

      if (error) {
        return {
          ok: false,
          error: `Lỗi cập nhật bài viết (Mã: ${error.code}): ${error.message}`,
        };
      }
      resultData = data;
    } else {
      // INSERT
      const { data, error } = await client
        .from('news')
        .insert(cleanPayload)
        .select()
        .single();

      if (error) {
        return {
          ok: false,
          error: `Lỗi thêm bài viết mới (Mã: ${error.code}): ${error.message}`,
        };
      }
      resultData = data;
    }

    // 6. Revalidate public and admin pages
    try {
      revalidatePath('/news');
      revalidatePath('/[locale]/news', 'page');
      revalidatePath(`/[locale]/news/${rawSlug}`, 'page');
      revalidatePath('/admin/dashboard');
      revalidatePath('/sitemap.xml');
    } catch (e) {
      // Ignore revalidation errors in non-request contexts
    }

    return { ok: true, data: resultData };
  } catch (err: any) {
    console.error('Unexpected error in saveNewsArticleAction:', err);
    return {
      ok: false,
      error: `Đã xảy ra lỗi không xác định: ${err?.message || String(err)}`,
    };
  }
}

/**
 * Server action to delete a news article.
 */
export async function deleteNewsArticleAction(id: string): Promise<{
  ok: boolean;
  error?: string;
}> {
  try {
    const isAuthenticated = await checkAdminAuth();
    if (!isAuthenticated) {
      return {
        ok: false,
        error: 'Phiên đăng nhập quản trị đã hết hạn. Vui lòng đăng nhập lại.',
      };
    }

    const client = createServiceRoleClient();
    const { error } = await client.from('news').delete().eq('id', id);

    if (error) {
      return {
        ok: false,
        error: `Lỗi khi xóa bài viết (Mã: ${error.code}): ${error.message}`,
      };
    }

    try {
      revalidatePath('/news');
      revalidatePath('/[locale]/news', 'page');
      revalidatePath('/admin/dashboard');
      revalidatePath('/sitemap.xml');
    } catch {}

    return { ok: true };
  } catch (err: any) {
    return {
      ok: false,
      error: `Lỗi khi xóa bài viết: ${err?.message || String(err)}`,
    };
  }
}

/**
 * Server action to upload news thumbnail image directly to Supabase Storage bucket 'news'.
 * Bypasses RLS issues using service role client while maintaining admin authentication.
 */
export async function uploadNewsImageAction(formData: FormData): Promise<{
  ok: boolean;
  url?: string;
  error?: string;
}> {
  try {
    const isAuthenticated = await checkAdminAuth();
    if (!isAuthenticated) {
      return {
        ok: false,
        error: 'Phiên đăng nhập quản trị đã hết hạn. Vui lòng đăng nhập lại.',
      };
    }

    const file = formData.get('file') as File | null;
    if (!file) {
      return { ok: false, error: 'Không tìm thấy tệp ảnh tải lên.' };
    }

    if (!file.type.startsWith('image/')) {
      return { ok: false, error: 'Tệp tải lên phải là hình ảnh (JPG, PNG, WebP, GIF).' };
    }

    // Max 5MB
    if (file.size > 5 * 1024 * 1024) {
      return { ok: false, error: 'Dung lượng ảnh vượt quá giới hạn 5MB.' };
    }

    const client = createServiceRoleClient();

    // Ensure bucket exists
    const { data: buckets } = await client.storage.listBuckets();
    const hasNewsBucket = buckets?.some((b) => b.name === 'news');
    if (!hasNewsBucket) {
      await client.storage.createBucket('news', { public: true });
    }

    const fileExt = file.name.split('.').pop() || 'jpg';
    const cleanExt = fileExt.toLowerCase().replace(/[^a-z0-9]/g, '');
    const fileName = `news-${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${cleanExt}`;

    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await client.storage
      .from('news')
      .upload(fileName, buffer, {
        contentType: file.type,
        upsert: true,
      });

    if (uploadError) {
      return {
        ok: false,
        error: `Lỗi tải ảnh lên Storage (${uploadError.name}): ${uploadError.message}`,
      };
    }

    const { data: pubData } = client.storage.from('news').getPublicUrl(fileName);
    if (!pubData?.publicUrl) {
      return { ok: false, error: 'Không thể lấy URL công khai của ảnh vừa tải.' };
    }

    return { ok: true, url: pubData.publicUrl };
  } catch (err: any) {
    console.error('Error in uploadNewsImageAction:', err);
    return {
      ok: false,
      error: `Lỗi upload ảnh: ${err?.message || String(err)}`,
    };
  }
}
