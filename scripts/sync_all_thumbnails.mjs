import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function syncAllThumbnails() {
  console.log('Fetching all news articles from Supabase...');
  const { data: articles, error } = await supabase
    .from('news')
    .select('id, title_vi, content_vi, thumbnail_url');

  if (error || !articles) {
    console.error('Failed to get articles:', error);
    return;
  }

  console.log(`Found ${articles.length} articles.`);

  for (const article of articles) {
    // If article already has a valid supabase storage thumbnail, skip
    if (article.thumbnail_url && article.thumbnail_url.includes('bnblofcypxfydnptazrs.supabase.co/storage')) {
      console.log(`[SKIP] Already in Supabase storage: "${article.title_vi}"`);
      continue;
    }

    const match = article.content_vi?.match(/https:\/\/www\.tiktok\.com\/@[^/]+\/video\/(\d+)/);
    if (!match) {
      console.log(`[SKIP] No TikTok link in: "${article.title_vi}"`);
      continue;
    }

    const videoId = match[1];
    const videoUrl = match[0];
    console.log(`\nFetching cover for "${article.title_vi}" (ID: ${videoId})...`);

    try {
      const res = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(videoUrl)}`);
      const json = await res.json();
      const coverUrl = json?.data?.cover || json?.data?.origin_cover;

      if (!coverUrl) {
        console.warn(`No cover found for ${videoId}`);
        continue;
      }

      console.log(`Downloading cover: ${coverUrl.substring(0, 60)}...`);
      const imgRes = await fetch(coverUrl);
      if (!imgRes.ok) {
        console.warn(`Failed to download image: status ${imgRes.status}`);
        continue;
      }

      const buffer = Buffer.from(await imgRes.arrayBuffer());
      const filePath = `tiktok-${videoId}.jpg`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('news')
        .upload(filePath, buffer, {
          contentType: 'image/jpeg',
          upsert: true,
        });

      if (uploadError) {
        console.error(`Upload error for ${filePath}:`, uploadError);
        continue;
      }

      const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/news/${filePath}`;

      // Update Supabase news table
      const { error: updateError } = await supabase
        .from('news')
        .update({ thumbnail_url: publicUrl })
        .eq('id', article.id);

      if (updateError) {
        console.error(`Update error:`, updateError);
      } else {
        console.log(`=> SUCCESS! Updated "${article.title_vi}" -> ${publicUrl}`);
      }

      // Small delay to be polite to the API
      await new Promise((r) => setTimeout(r, 600));
    } catch (err) {
      console.error(`Error processing ${videoId}:`, err);
    }
  }

  console.log('\n========================================');
  console.log('All thumbnails synced to Supabase Storage!');
  console.log('========================================');
}

syncAllThumbnails();
