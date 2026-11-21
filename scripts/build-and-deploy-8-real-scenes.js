const sharp = require('sharp');
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const brain = 'C:/Users/ASUS/.gemini/antigravity/brain/1d5b6f3a-5cfa-4681-84b1-f5a7a5ddea7a/';
const cutoutPath = 'public/images/eggu-sandwich-subject-cutout.png';
const masterPhoto = 'public/images/eggu-master-ai-concept.jpg';
const trayPhoto = 'public/images/eggu-walking-street-tray.jpg';

// Define the 8 posts and their real photorealistic scenes
const scenes = [
  {
    // Post 0: Mr. Egg (39.000đ) - Nạp năng lượng cuối tuần
    id: '60d79d11-0148-4d30-af72-c4c8faa6ba7a',
    title: 'Mr. Egg - Hanoi Old Quarter Street Food',
    filename: 'ai-concept-scene-0-hanoi-street.jpg',
    build: async () => {
      // Authentic Phố Lý Quốc Sư street food shot (763x763 square crop centered on sandwich & street)
      return await sharp(masterPhoto)
        .extract({ left: 0, top: 240, width: 763, height: 763 })
        .resize(1000, 1000)
        .toBuffer();
    }
  },
  {
    // Post 1: Sandwich Thịt Hộp, Phô Mai & Nori (60.000đ) - Cafe Chill
    id: '1def400f-3879-4477-ba0b-fd284c65e5dd',
    title: 'Thịt Hộp Nori - Korean Cafe with Iced Peach Tea',
    filename: 'ai-concept-scene-1-korean-cafe-tea.jpg',
    build: async () => {
      const bgPath = brain + 'korean_cafe_tea_bg_1795282343606.jpg';
      const bg = await sharp(bgPath)
        .resize(1000, 1000, { fit: 'cover', position: 'center' })
        .toBuffer();

      const product = await sharp(cutoutPath)
        .trim()
        .resize(560, 630, { fit: 'inside' })
        .modulate({ brightness: 1.04, saturation: 1.08 })
        .toBuffer();

      const shadowSvg = Buffer.from(`
        <svg width="1000" height="1000" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="cafeShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="30"/>
            </filter>
          </defs>
          <ellipse cx="610" cy="890" rx="270" ry="95" fill="#451A03" fill-opacity="0.6" filter="url(#cafeShadow)"/>
          <ellipse cx="580" cy="855" rx="190" ry="65" fill="#18181B" fill-opacity="0.75" filter="url(#cafeShadow)"/>
        </svg>
      `);

      return await sharp(bg)
        .composite([
          { input: shadowSvg, blend: 'over' },
          { input: product, top: 310, left: 260, blend: 'over' }
        ])
        .jpeg({ quality: 94 })
        .toBuffer();
    }
  },
  {
    // Post 2: Sandwich Thịt Xông Khói Ngô Phô Mai (50.000đ) - Bếp Bơ Tỏi Xèo Xèo
    id: 'f0892d13-b18a-42c3-bc99-512bbea30471',
    title: 'Thịt Xông Khói Ngô Phô Mai - Cozy Evening Kitchen Bar',
    filename: 'ai-concept-scene-2-kitchen-island.jpg',
    build: async () => {
      const bgPath = brain + 'cozy_kitchen_island_counter_bg_png_1795282358976.jpg';
      const bg = await sharp(bgPath)
        .resize(1000, 1000, { fit: 'cover', position: 'center' })
        .toBuffer();

      const product = await sharp(cutoutPath)
        .trim()
        .resize(570, 640, { fit: 'inside' })
        .modulate({ brightness: 0.98, saturation: 1.15 })
        .toBuffer();

      const shadowSvg = Buffer.from(`
        <svg width="1000" height="1000" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="kitchenShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="32"/>
            </filter>
          </defs>
          <ellipse cx="610" cy="895" rx="280" ry="100" fill="#000000" fill-opacity="0.8" filter="url(#kitchenShadow)"/>
          <ellipse cx="580" cy="860" rx="190" ry="65" fill="#000000" fill-opacity="0.9" filter="url(#kitchenShadow)"/>
        </svg>
      `);

      return await sharp(bg)
        .composite([
          { input: shadowSvg, blend: 'over' },
          { input: product, top: 300, left: 250, blend: 'over' }
        ])
        .jpeg({ quality: 94 })
        .toBuffer();
    }
  },
  {
    // Post 3: Sandwich Nướng Kiểu Pháp (55.000đ) - Sunday Brunch Bàn Đá Cẩm Thạch
    id: 'a4ad6011-43a9-49e8-aebb-b18e2e72f0e1',
    title: 'Nướng Kiểu Pháp - Sunlit Sunday Brunch Marble Table',
    filename: 'ai-concept-scene-3-brunch-marble.jpg',
    build: async () => {
      const bgPath = brain + 'sunlit_brunch_marble_table_1795282346945.jpg';
      const bg = await sharp(bgPath)
        .resize(1000, 1000, { fit: 'cover', position: 'center' })
        .toBuffer();

      const product = await sharp(cutoutPath)
        .trim()
        .resize(550, 620, { fit: 'inside' })
        .modulate({ brightness: 1.05, saturation: 1.08 })
        .toBuffer();

      const shadowSvg = Buffer.from(`
        <svg width="1000" height="1000" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="marbleShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="25"/>
            </filter>
          </defs>
          <ellipse cx="610" cy="880" rx="250" ry="85" fill="#4B5563" fill-opacity="0.5" filter="url(#marbleShadow)"/>
          <ellipse cx="580" cy="850" rx="170" ry="55" fill="#1F2937" fill-opacity="0.65" filter="url(#marbleShadow)"/>
        </svg>
      `);

      return await sharp(bg)
        .composite([
          { input: shadowSvg, blend: 'over' },
          { input: product, top: 320, left: 270, blend: 'over' }
        ])
        .jpeg({ quality: 94 })
        .toBuffer();
    }
  },
  {
    // Post 4: Sandwich Thịt Xông Khói Bơ Tỏi Phô Mai (55.000đ) - Hoàng Hôn Hồ Gươm
    id: 'd3b091ec-dc7f-4154-962c-a726bbf19371',
    title: 'Bơ Tỏi Phô Mai - Sunset Hoan Kiem Patio Table',
    filename: 'ai-concept-scene-4-sunset-patio.jpg',
    build: async () => {
      const bgPath = brain + 'hanoi_patio_table_background_1795282354330.jpg';
      const bg = await sharp(bgPath)
        .resize(1000, 1000, { fit: 'cover', position: 'center' })
        .toBuffer();

      const product = await sharp(cutoutPath)
        .trim()
        .resize(560, 630, { fit: 'inside' })
        .modulate({ brightness: 1.03, saturation: 1.15 })
        .toBuffer();

      const shadowSvg = Buffer.from(`
        <svg width="1000" height="1000" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="patioShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="30"/>
            </filter>
          </defs>
          <ellipse cx="610" cy="890" rx="270" ry="95" fill="#431407" fill-opacity="0.65" filter="url(#patioShadow)"/>
          <ellipse cx="580" cy="855" rx="190" ry="65" fill="#18181B" fill-opacity="0.8" filter="url(#patioShadow)"/>
        </svg>
      `);

      return await sharp(bg)
        .composite([
          { input: shadowSvg, blend: 'over' },
          { input: product, top: 310, left: 260, blend: 'over' }
        ])
        .jpeg({ quality: 94 })
        .toBuffer();
    }
  },
  {
    // Post 5: Đồng hành công sở (55.000đ) - Bàn Làm Việc Văn Phòng Buổi Sáng
    id: 'cebf1228-97ba-406c-bfe1-5d88e5d9e029',
    title: 'Bữa Sáng Công Sở - Modern Office Desk with Laptop & Coffee',
    filename: 'ai-concept-scene-5-office-desk.jpg',
    build: async () => {
      const bgPath = brain + 'office_desk_background_1795282325433.jpg';
      const bg = await sharp(bgPath)
        .resize(1000, 1000, { fit: 'cover', position: 'center' })
        .toBuffer();

      const product = await sharp(cutoutPath)
        .trim()
        .resize(560, 630, { fit: 'inside' })
        .modulate({ brightness: 1.02, saturation: 1.0 })
        .toBuffer();

      const shadowSvg = Buffer.from(`
        <svg width="1000" height="1000" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="officeShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="28"/>
            </filter>
          </defs>
          <ellipse cx="600" cy="880" rx="260" ry="90" fill="#000000" fill-opacity="0.65" filter="url(#officeShadow)"/>
          <ellipse cx="580" cy="850" rx="180" ry="60" fill="#000000" fill-opacity="0.8" filter="url(#officeShadow)"/>
        </svg>
      `);

      return await sharp(bg)
        .composite([
          { input: shadowSvg, blend: 'over' },
          { input: product, top: 320, left: 280, blend: 'over' }
        ])
        .jpeg({ quality: 94 })
        .toBuffer();
    }
  },
  {
    // Post 6: Sandwich Cá Ngừ Phô Mai (60.000đ) - Trời Mưa Phố Cổ Hà Nội
    id: 'a6be4913-58fb-4e70-8c49-56925ef1eff9',
    title: 'Cá Ngừ Phô Mai - Rainy Hanoi Old Quarter Cafe Window',
    filename: 'ai-concept-scene-6-rainy-hanoi.jpg',
    build: async () => {
      const bgPath = brain + 'hanoi_cafe_rainy_background_1795282335076.jpg';
      const bg = await sharp(bgPath)
        .resize(1000, 1000, { fit: 'cover', position: 'center' })
        .toBuffer();

      const product = await sharp(cutoutPath)
        .trim()
        .resize(560, 630, { fit: 'inside' })
        .modulate({ brightness: 0.96, saturation: 1.08 })
        .toBuffer();

      const shadowSvg = Buffer.from(`
        <svg width="1000" height="1000" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <filter id="rainyShadow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="32"/>
            </filter>
          </defs>
          <ellipse cx="610" cy="890" rx="270" ry="95" fill="#0F172A" fill-opacity="0.75" filter="url(#rainyShadow)"/>
          <ellipse cx="580" cy="855" rx="180" ry="65" fill="#000000" fill-opacity="0.9" filter="url(#rainyShadow)"/>
        </svg>
      `);

      return await sharp(bg)
        .composite([
          { input: shadowSvg, blend: 'over' },
          { input: product, top: 310, left: 260, blend: 'over' }
        ])
        .jpeg({ quality: 94 })
        .toBuffer();
    }
  },
  {
    // Post 7: Sandwich Nướng Kiểu Pháp EGGU (55.000đ) - Khay Đôi Phố Đi Bộ Hoàn Kiếm
    id: '7ccd15ac-4803-4e6d-a698-e13ce4b23d70',
    title: 'Sandwich Nướng Kiểu Pháp - Walking Street Dual Tray',
    filename: 'ai-concept-scene-7-walking-street-tray.jpg',
    build: async () => {
      // 1000x1000 square crop of the walking street customer tray (two sandwiches in EGGU boxes)
      return await sharp(trayPhoto)
        .extract({ left: 0, top: 220, width: 573, height: 573 })
        .resize(1000, 1000)
        .jpeg({ quality: 94 })
        .toBuffer();
    }
  }
];

async function deploy() {
  console.log('=== Deploying 8 Photorealistic Diverse Scenes with Authentic EGGU Sandwich ===');
  const now = Date.now();

  for (let i = 0; i < scenes.length; i++) {
    const s = scenes[i];
    console.log(`[${i}] Building: ${s.title} -> ${s.filename}...`);
    
    const buffer = await s.build();
    const localPath = `public/images/${s.filename}`;
    fs.writeFileSync(localPath, buffer);
    console.log(`    Saved locally: ${localPath} (${buffer.length} bytes)`);

    // Upload to Supabase Storage
    const { error: upErr } = await supabase.storage
      .from('promotions')
      .upload(s.filename, buffer, {
        contentType: 'image/jpeg',
        upsert: true,
        cacheControl: '0'
      });

    if (upErr) {
      console.error(`    Upload error for ${s.filename}:`, upErr);
    } else {
      console.log(`    Uploaded to Supabase: promotions/${s.filename}`);
    }

    // Update database
    const photoUrl = `https://bnblofcypxfydnptazrs.supabase.co/storage/v1/object/public/promotions/${s.filename}?v=${now}`;
    const { error: dbErr } = await supabase
      .from('marketing_posts')
      .update({ ai_photo_url: photoUrl })
      .eq('id', s.id);

    if (dbErr) {
      console.error(`    Database update error:`, dbErr);
    } else {
      console.log(`    Updated post ${s.id} -> ${photoUrl}`);
    }
  }

  console.log('=== Successfully deployed all 8 distinct photorealistic scenes! ===');
}

deploy();
