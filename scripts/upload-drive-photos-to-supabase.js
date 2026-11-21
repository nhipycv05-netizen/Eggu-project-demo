const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function uploadAll() {
  console.log('Uploading 16 real photos to Supabase Storage bucket "promotions"...');
  const uploadedUrls = [];

  for (let i = 1; i <= 16; i++) {
    const localPath = path.join('public/images/real-eggu', `drive-eggu-${i}.jpg`);
    if (!fs.existsSync(localPath)) {
      console.log(`Missing file: ${localPath}`);
      continue;
    }

    const fileBuffer = fs.readFileSync(localPath);
    const storagePath = `real-photos/eggu-real-drive-${i}.jpg`;

    const { data, error } = await supabase.storage
      .from('promotions')
      .upload(storagePath, fileBuffer, {
        contentType: 'image/jpeg',
        upsert: true,
        cacheControl: '3600',
      });

    if (error) {
      console.error(`Error uploading #${i}:`, error.message);
    } else {
      const { data: urlData } = supabase.storage
        .from('promotions')
        .getPublicUrl(storagePath);

      console.log(`Uploaded #${i} => ${urlData.publicUrl}`);
      uploadedUrls.push({ index: i, url: urlData.publicUrl });
    }
  }

  // Also ensure master street photo and walking street tray photo are uploaded and available
  const extraPhotos = [
    { name: 'eggu-master-ly-quoc-su.jpg', src: 'public/images/eggu-master-ai-concept.jpg' },
    { name: 'eggu-walking-street-tray.jpg', src: 'public/images/eggu-walking-street-tray.jpg' }
  ];

  for (const extra of extraPhotos) {
    if (fs.existsSync(extra.src)) {
      const buf = fs.readFileSync(extra.src);
      const storagePath = `real-photos/${extra.name}`;
      const { error } = await supabase.storage.from('promotions').upload(storagePath, buf, {
        contentType: 'image/jpeg',
        upsert: true,
        cacheControl: '3600'
      });
      const { data: u } = supabase.storage.from('promotions').getPublicUrl(storagePath);
      console.log(`Extra uploaded => ${u.publicUrl}`);
      uploadedUrls.push({ name: extra.name, url: u.publicUrl });
    }
  }

  fs.writeFileSync('scripts/uploaded-real-urls.json', JSON.stringify(uploadedUrls, null, 2));
  console.log('Saved scripts/uploaded-real-urls.json with total', uploadedUrls.length, 'photos');
}

uploadAll();
