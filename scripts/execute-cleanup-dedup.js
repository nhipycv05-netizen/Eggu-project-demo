require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function cleanup() {
  console.log('--- BẮT ĐẦU DỌN DẸP BẢN GHI TRÙNG TRONG BẢNG NEWS ---');
  const { data: news, error } = await supabase
    .from('news')
    .select('id, slug, title_vi, content_vi, summary_vi, created_at')
    .order('created_at', { ascending: false });

  if (error || !news) {
    console.error('Lỗi lấy dữ liệu:', error);
    return;
  }

  console.log(`Tổng số bài viết hiện tại: ${news.length}`);

  // Gom nhóm theo videoId
  const videoMap = new Map();
  for (const item of news) {
    const text = `${item.slug} ${item.content_vi || ''} ${item.summary_vi || ''}`;
    const m = text.match(/video\/(\d+)/) || item.slug.match(/tiktok-video-(\d+)/);
    if (m) {
      const vid = m[1];
      if (!videoMap.has(vid)) videoMap.set(vid, []);
      videoMap.get(vid).push(item);
    }
  }

  const idsToDelete = [];
  const slugsToUpdate = [];

  for (const [vid, items] of videoMap.entries()) {
    const targetSlug = `tiktok-video-${vid}`;

    if (items.length > 1) {
      // Có trùng lặp: Giữ bản ghi cũ (chất lượng hơn), xóa bản ghi mới tạo thử nghiệm
      // Sắp xếp theo ngày tạo tăng dần (cũ nhất đứng đầu)
      items.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
      const keepItem = items[0];
      const dupItems = items.slice(1);

      for (const d of dupItems) {
        idsToDelete.push(d.id);
        console.log(`[XÓA TRÙNG] ID ${d.id} | Slug: ${d.slug} | Tiêu đề: ${d.title_vi.slice(0, 35)}`);
      }

      // Chuẩn hóa slug của bản ghi giữ lại
      if (keepItem.slug !== targetSlug) {
        slugsToUpdate.push({ id: keepItem.id, oldSlug: keepItem.slug, newSlug: targetSlug });
      }
    } else {
      // Chỉ có 1 bản ghi: chuẩn hóa slug nếu chưa đúng chuẩn tiktok-video-[videoId]
      const singleItem = items[0];
      if (singleItem.slug !== targetSlug) {
        slugsToUpdate.push({ id: singleItem.id, oldSlug: singleItem.slug, newSlug: targetSlug });
      }
    }
  }

  console.log(`\nSẽ xóa ${idsToDelete.length} bản ghi trùng.`);
  if (idsToDelete.length > 0) {
    const { error: delErr } = await supabase.from('news').delete().in('id', idsToDelete);
    if (delErr) {
      console.error('Lỗi khi xóa trùng:', delErr);
      return;
    }
    console.log('✅ Đã xóa thành công các bản ghi trùng!');
  }

  console.log(`\nSẽ chuẩn hóa slug cho ${slugsToUpdate.length} bài viết TikTok...`);
  for (const item of slugsToUpdate) {
    const { error: upErr } = await supabase
      .from('news')
      .update({ slug: item.newSlug })
      .eq('id', item.id);
    if (upErr) {
      console.error(`Lỗi update slug cho ${item.id}:`, upErr.message);
    } else {
      console.log(`- ID: ${item.id}: ${item.oldSlug} -> ${item.newSlug}`);
    }
  }

  // Kiểm tra lại sau khi dọn dẹp
  const { data: remaining } = await supabase.from('news').select('id, slug, title_vi');
  console.log(`\n🎉 HOÀN TẤT! Số bài viết còn lại trong Supabase: ${remaining.length}`);
}

cleanup();
