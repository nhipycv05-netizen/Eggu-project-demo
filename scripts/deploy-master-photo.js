const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function deploy() {
  const fileBuffer = fs.readFileSync('public/images/eggu-master-ai-concept.jpg');
  console.log('Read local file:', fileBuffer.length, 'bytes');

  // 1. Upload to Supabase Storage with cacheControl: '0'
  const targetNames = [
    'eggu-sandwich-approved-model.jpg',
    'ai-concept-eggu-official.jpg'
  ];

  for (const name of targetNames) {
    const { data, error } = await supabase.storage
      .from('promotions')
      .upload(name, fileBuffer, {
        contentType: 'image/jpeg',
        upsert: true,
        cacheControl: '0'
      });
    if (error) {
      console.error(`Upload error for ${name}:`, error);
    } else {
      console.log(`Uploaded successfully: ${name}`);
    }
  }

  // 2. Update all records in marketing_posts with fresh version query param to bypass all browser caches
  const newUrl = `https://bnblofcypxfydnptazrs.supabase.co/storage/v1/object/public/promotions/eggu-sandwich-approved-model.jpg?v=${Date.now()}`;
  const { data: updateData, error: updateError } = await supabase
    .from('marketing_posts')
    .update({ ai_photo_url: newUrl })
    .neq('id', '00000000-0000-0000-0000-000000000000'); // match all

  if (updateError) {
    console.error('Database update error:', updateError);
  } else {
    console.log('Updated marketing_posts with new ai_photo_url:', newUrl);
  }

  // 3. Verify
  const { data: posts, error: fetchErr } = await supabase
    .from('marketing_posts')
    .select('id, title, ai_photo_url');
  if (fetchErr) {
    console.error('Fetch error:', fetchErr);
  } else {
    console.log(`Verified ${posts.length} posts updated to:`, posts[0].ai_photo_url);
  }
}

deploy();
