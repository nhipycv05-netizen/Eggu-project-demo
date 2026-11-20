const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const urls = JSON.parse(fs.readFileSync('threads_extracted_urls.json', 'utf8'));
const postMap = new Map();

urls.forEach(u => {
  if (u.includes('t51.82787-19')) return; // skip avatar
  const m = u.match(/\/(\d+_\d+_\d+_n\.jpg)/);
  if (m) {
    const filename = m[1];
    const key = filename.split('_')[1];
    if (!postMap.has(key)) postMap.set(key, []);
    postMap.get(key).push(u);
  }
});

const outDir = 'public/images/threads-real/';
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

async function run() {
  let idx = 0;
  const uploadedUrls = [];

  for (const [key, variants] of postMap.entries()) {
    idx++;
    // Sort by resolution indicator (e.g. s1080x1080 > s828x828 > s720x720 > s640x640)
    const sorted = variants.sort((a, b) => {
      const getRes = str => {
        const m = str.match(/s(\d+)x(\d+)/);
        return m ? parseInt(m[1]) : 0;
      };
      return getRes(b) - getRes(a);
    });

    const bestUrl = sorted[0];
    try {
      console.log(`Downloading post [${idx}/${postMap.size}] ID ${key}...`);
      const res = await fetch(bestUrl);
      if (!res.ok) continue;
      const buf = Buffer.from(await res.arrayBuffer());
      const meta = await sharp(buf).metadata();
      
      const fileName = `threads-real-${idx}.jpg`;
      fs.writeFileSync(path.join(outDir, fileName), buf);

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage.from('promotions').upload(fileName, buf, {
        contentType: 'image/jpeg',
        upsert: true
      });

      if (!error) {
        const publicUrl = `https://bnblofcypxfydnptazrs.supabase.co/storage/v1/object/public/promotions/${fileName}`;
        uploadedUrls.push(publicUrl);
        console.log(`✓ [${idx}] Uploaded ${fileName}: ${meta.width}x${meta.height} (${buf.length} bytes)`);
      } else {
        console.error(`✗ Error uploading ${fileName}:`, error);
      }
    } catch (e) {
      console.error(`Error processing post ${key}:`, e);
    }
  }

  fs.writeFileSync('threads_supabase_urls.json', JSON.stringify(uploadedUrls, null, 2));
  console.log(`\nSuccessfully downloaded & uploaded ${uploadedUrls.length} REAL photos from Threads @hhnh_7410!`);
}

run();
