import { NextResponse } from 'next/server';
import { AboutContent, DEFAULT_ABOUT_CONTENT } from '@/types/about';
import { createClient } from '@/lib/supabase/server';

// In-memory cache fallback for instant server-side persistence
let cachedAboutContent: AboutContent = { ...DEFAULT_ABOUT_CONTENT };

export async function GET() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('site_settings')
      .select('value')
      .eq('key', 'about_content')
      .single();

    if (!error && data?.value) {
      cachedAboutContent = { ...DEFAULT_ABOUT_CONTENT, ...data.value };
      return NextResponse.json(cachedAboutContent);
    }
  } catch {
    // If Supabase table does not exist or connection fails, use in-memory cache
  }

  return NextResponse.json(cachedAboutContent);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<AboutContent>;
    cachedAboutContent = {
      ...cachedAboutContent,
      ...body,
    };

    try {
      const supabase = await createClient();
      await supabase
        .from('site_settings')
        .upsert(
          {
            key: 'about_content',
            value: cachedAboutContent,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'key' }
        );
    } catch {
      // Ignore database error, in-memory cache updated
    }

    return NextResponse.json({
      success: true,
      data: cachedAboutContent,
      message: 'Cập nhật nội dung giới thiệu thành công!',
    });
  } catch (err) {
    console.error('Error saving about content:', err);
    return NextResponse.json(
      { success: false, message: 'Lỗi khi lưu dữ liệu' },
      { status: 500 }
    );
  }
}
