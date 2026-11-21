import { NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/lib/supabase/serviceRole';

export async function POST() {
  try {
    const supabase = createServiceRoleClient();

    // 1. Fetch RSS feed from TikTok
    const res = await fetch('https://rsshub.rss.tips/tiktok/user/@eggu_sandwich', {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      cache: 'no-store',
    });

    if (!res.ok) {
      return NextResponse.json({ error: `Không thể đọc feed TikTok: HTTP ${res.status}` }, { status: 502 });
    }

    const text = await res.text();
    const items = text.match(/<item>[\s\S]*?<\/item>/g) || [];

    let insertedCount = 0;
    const syncedArticles: any[] = [];

    for (let i = 0; i < Math.min(items.length, 10); i++) {
      const item = items[i];
      const titleMatch = item.match(/<title>([\s\S]*?)<\/title>/);
      const linkMatch = item.match(/<link>([\s\S]*?)<\/link>/);
      const descMatch = item.match(/<description>([\s\S]*?)<\/description>/);
      const pubDateMatch = item.match(/<pubDate>([\s\S]*?)<\/pubDate>/);

      const rawTitle = titleMatch ? titleMatch[1].trim() : 'EGGU Sandwich TikTok';
      const rawLink = linkMatch ? linkMatch[1].trim() : 'https://www.tiktok.com/@eggu_sandwich';
      const rawDesc = descMatch ? descMatch[1] : '';
      const pubDate = pubDateMatch ? new Date(pubDateMatch[1]).toISOString() : new Date().toISOString();

      // Check duplicate
      const { data: existing } = await supabase
        .from('news')
        .select('id')
        .ilike('content_vi', `%${rawLink}%`)
        .limit(1);

      if (existing && existing.length > 0) continue;

      const decodedDesc = rawDesc
        .replace(/&quot;/g, '"')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>');

      const posterMatch = decodedDesc.match(/poster="([^"]+)"/) || decodedDesc.match(/src="([^"]+)"/);
      const thumbnailUrl = posterMatch
        ? posterMatch[1]
        : 'https://bnblofcypxfydnptazrs.supabase.co/storage/v1/object/public/promotions/real-photos/eggu-real-drive-1.jpg';

      const cleanSlug =
        'tiktok-' +
        rawTitle
          .toLowerCase()
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .replace(/[^a-z0-9]+/g, '-')
          .substring(0, 45)
          .replace(/^-|-$/g, '') +
        '-' +
        Date.now();

      const titleVi = rawTitle.length > 90 ? rawTitle.substring(0, 87) + '...' : rawTitle;
      const titleEn = 'EGGU TikTok: ' + (rawTitle.length > 70 ? rawTitle.substring(0, 67) + '...' : rawTitle);
      const summaryVi = rawTitle.length > 140 ? rawTitle.substring(0, 137) + '...' : rawTitle;
      const summaryEn = `Discover the latest TikTok highlights from EGGU: ${summaryVi}`;

      const contentVi = `<p>${rawTitle}</p>\n<p>Cùng theo dõi những khoảnh khắc hấp dẫn, món ngon chuẩn vị Hàn và trải nghiệm ẩm thực đường phố tuyệt vời tại tiệm EGGU!</p>\n<p>👉 <strong>Xem video gốc trên TikTok:</strong> <a href="${rawLink}" target="_blank" rel="noopener noreferrer">${rawLink}</a></p>`;
      const contentEn = `<p>${rawTitle}</p>\n<p>Follow along for delicious Korean brioche toast moments and authentic street food experiences at EGGU!</p>\n<p>👉 <strong>Watch original video on TikTok:</strong> <a href="${rawLink}" target="_blank" rel="noopener noreferrer">${rawLink}</a></p>`;

      const payload = {
        title_vi: titleVi,
        title_en: titleEn,
        slug: cleanSlug,
        summary_vi: summaryVi,
        summary_en: summaryEn,
        content_vi: contentVi,
        content_en: contentEn,
        thumbnail_url: thumbnailUrl,
        status: 'PUBLISHED' as const,
        published_at: pubDate,
      };

      const { data: inserted, error: insErr } = await supabase.from('news').insert(payload).select();
      if (!insErr && inserted && inserted.length > 0) {
        insertedCount++;
        syncedArticles.push(inserted[0]);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Đã đồng bộ thành công ${insertedCount} bài viết từ TikTok lên website!`,
      insertedCount,
      articles: syncedArticles,
    });
  } catch (err: any) {
    console.error('Lỗi khi đồng bộ TikTok:', err);
    return NextResponse.json({ error: err.message || 'Lỗi server' }, { status: 500 });
  }
}
