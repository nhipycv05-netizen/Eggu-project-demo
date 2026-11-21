import { NextRequest, NextResponse } from 'next/server';
import {
  analyzeCaptionContext,
  composeHarmonizedEgguPhoto,
  uploadAndDeployConceptPhoto,
} from '@/lib/marketing/aiPhotoEngine';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { caption, dishName, dishPrice, postId } = body;

    if (!caption || !dishName) {
      return NextResponse.json(
        { ok: false, error: 'Thiếu thông tin caption hoặc dishName' },
        { status: 400 }
      );
    }

    // 1. Phân tích ngữ cảnh từ Caption
    const context = analyzeCaptionContext(caption, dishName);

    // 2. Tạo ảnh ghép đồng bộ ánh sáng & bóng đổ
    const imageBuffer = await composeHarmonizedEgguPhoto({
      caption,
      dishName,
      dishPrice: dishPrice || '55.000đ',
    });

    // 3. Tải lên Supabase Storage
    const filename = `ai-concept-${context.key}-${Date.now()}.jpg`;
    const photoUrl = await uploadAndDeployConceptPhoto(imageBuffer, filename);

    return NextResponse.json({
      ok: true,
      data: {
        photoUrl,
        contextKey: context.key,
        contextName: context.nameVi,
        bgPrompt: context.bgPrompt,
        lightingMood: context.lightingMood,
      },
    });
  } catch (err: unknown) {
    console.error('Lỗi khi sinh ảnh AI theo bối cảnh caption:', err);
    return NextResponse.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : 'Lỗi không xác định',
      },
      { status: 500 }
    );
  }
}
