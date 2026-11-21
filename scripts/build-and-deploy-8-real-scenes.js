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
const aiCutoutPath = 'public/images/eggu-sandwich-subject-cutout-ai.png';
const masterPhoto = 'public/images/eggu-master-ai-concept.jpg';
const trayPhoto = 'public/images/eggu-walking-street-tray.jpg';

// Helper to composite the seamless AI-cutout product onto any 1000x1000 background
async function compositeSeamlessProduct(bgBuffer, options = {}) {
  const {
    width = 650,
    brightness = 1.0,
    saturation = 1.0,
    shadowColor = '#000000',
    shadowOpacity = 0.65
  } = options;

  // AI Cutout is trimmed to 532 x 594
  const productHeight = Math.round((594 / 532) * width); // e.g. 726 for 650 width
  const topPos = 1000 - productHeight;                  // bottom edge anchors flush with frame bottom (1000)
  const leftPos = Math.round((1000 - width) / 2) + 20;  // centered with slight right bias for the holding hand

  const product = await sharp(aiCutoutPath)
    .trim()
    .resize(width, productHeight)
    .modulate({ brightness, saturation })
    .toBuffer();

  // Natural grounded contact shadow on the table surface
  const shadowSvg = Buffer.from(`
    <svg width="1000" height="1000" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="naturalShadow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="32"/>
        </filter>
      </defs>
      <!-- Deep contact shadow directly under sandwich box -->
      <ellipse cx="${leftPos + Math.round(width * 0.42)}" cy="${topPos + Math.round(productHeight * 0.82)}" rx="${Math.round(width * 0.40)}" ry="${Math.round(productHeight * 0.12)}" fill="${shadowColor}" fill-opacity="${shadowOpacity}" filter="url(#naturalShadow)"/>
      <ellipse cx="${leftPos + Math.round(width * 0.38)}" cy="${topPos + Math.round(productHeight * 0.78)}" rx="${Math.round(width * 0.28)}" ry="${Math.round(productHeight * 0.08)}" fill="#000000" fill-opacity="${shadowOpacity * 1.1}" filter="url(#naturalShadow)"/>
    </svg>
  `);

  return await sharp(bgBuffer)
    .composite([
      { input: shadowSvg, blend: 'over' },
      { input: product, top: topPos, left: leftPos, blend: 'over' }
    ])
    .jpeg({ quality: 94 })
    .toBuffer();
}

const scenes = [
  {
    // Post 0: Mr. Egg (39.000đ) - Hanoi Street Food Original
    id: '60d79d11-0148-4d30-af72-c4c8faa6ba7a',
    title: 'Mr. Egg - Hanoi Old Quarter Street Food',
    filename: 'ai-concept-scene-0-hanoi-street.jpg',
    build: async () => {
      return await sharp(masterPhoto)
        .extract({ left: 0, top: 240, width: 763, height: 763 })
        .resize(1000, 1000)
        .jpeg({ quality: 94 })
        .toBuffer();
    }
  },
  {
    // Post 1: Sandwich Thịt Hộp, Phô Mai & Nori (60.000đ) - Korean Cafe with Iced Peach Tea
    id: '1def400f-3879-4477-ba0b-fd284c65e5dd',
    title: 'Thịt Hộp Nori - Korean Cafe with Iced Peach Tea',
    filename: 'ai-concept-scene-1-korean-cafe-tea.jpg',
    build: async () => {
      const bg = await sharp(brain + 'korean_cafe_tea_bg_1795282343606.jpg')
        .resize(1000, 1000, { fit: 'cover', position: 'center' })
        .toBuffer();
      return await compositeSeamlessProduct(bg, {
        width: 650,
        brightness: 1.03,
        saturation: 1.05,
        shadowColor: '#451A03',
        shadowOpacity: 0.65
      });
    }
  },
  {
    // Post 2: Sandwich Thịt Xông Khói Ngô Phô Mai (50.000đ) - Cozy Evening Kitchen Bar
    id: 'f0892d13-b18a-42c3-bc99-512bbea30471',
    title: 'Thịt Xông Khói Ngô Phô Mai - Cozy Evening Kitchen Bar',
    filename: 'ai-concept-scene-2-kitchen-island.jpg',
    build: async () => {
      const bg = await sharp(brain + 'cozy_kitchen_island_counter_bg_png_1795282358976.jpg')
        .resize(1000, 1000, { fit: 'cover', position: 'center' })
        .toBuffer();
      return await compositeSeamlessProduct(bg, {
        width: 650,
        brightness: 0.98,
        saturation: 1.12,
        shadowColor: '#000000',
        shadowOpacity: 0.8
      });
    }
  },
  {
    // Post 3: Sandwich Nướng Kiểu Pháp (55.000đ) - Sunlit Sunday Brunch Marble Table
    id: 'a4ad6011-43a9-49e8-aebb-b18e2e72f0e1',
    title: 'Nướng Kiểu Pháp - Sunlit Sunday Brunch Marble Table',
    filename: 'ai-concept-scene-3-brunch-marble.jpg',
    build: async () => {
      const bg = await sharp(brain + 'sunlit_brunch_marble_table_1795282346945.jpg')
        .resize(1000, 1000, { fit: 'cover', position: 'center' })
        .toBuffer();
      return await compositeSeamlessProduct(bg, {
        width: 640,
        brightness: 1.04,
        saturation: 1.06,
        shadowColor: '#374151',
        shadowOpacity: 0.55
      });
    }
  },
  {
    // Post 4: Sandwich Thịt Xông Khói Bơ Tỏi Phô Mai (55.000đ) - Sunset Hoan Kiem Patio Table
    id: 'd3b091ec-dc7f-4154-962c-a726bbf19371',
    title: 'Bơ Tỏi Phô Mai - Sunset Hoan Kiem Patio Table',
    filename: 'ai-concept-scene-4-sunset-patio.jpg',
    build: async () => {
      const bg = await sharp(brain + 'hanoi_patio_table_background_1795282354330.jpg')
        .resize(1000, 1000, { fit: 'cover', position: 'center' })
        .toBuffer();
      return await compositeSeamlessProduct(bg, {
        width: 650,
        brightness: 1.02,
        saturation: 1.14,
        shadowColor: '#431407',
        shadowOpacity: 0.7
      });
    }
  },
  {
    // Post 5: Bữa Sáng Công Sở (55.000đ) - Modern Office Desk with Laptop & Coffee
    id: 'cebf1228-97ba-406c-bfe1-5d88e5d9e029',
    title: 'Bữa Sáng Công Sở - Modern Office Desk with Laptop & Coffee',
    filename: 'ai-concept-scene-5-office-desk.jpg',
    build: async () => {
      const bg = await sharp(brain + 'office_desk_background_1795282325433.jpg')
        .resize(1000, 1000, { fit: 'cover', position: 'center' })
        .toBuffer();
      return await compositeSeamlessProduct(bg, {
        width: 640,
        brightness: 1.02,
        saturation: 1.0,
        shadowColor: '#000000',
        shadowOpacity: 0.65
      });
    }
  },
  {
    // Post 6: Sandwich Cá Ngừ Phô Mai (60.000đ) - Rainy Hanoi Old Quarter Cafe Window
    id: 'a6be4913-58fb-4e70-8c49-56925ef1eff9',
    title: 'Cá Ngừ Phô Mai - Rainy Hanoi Old Quarter Cafe Window',
    filename: 'ai-concept-scene-6-rainy-hanoi.jpg',
    build: async () => {
      const bg = await sharp(brain + 'hanoi_cafe_rainy_background_1795282335076.jpg')
        .resize(1000, 1000, { fit: 'cover', position: 'center' })
        .toBuffer();
      return await compositeSeamlessProduct(bg, {
        width: 650,
        brightness: 0.96,
        saturation: 1.06,
        shadowColor: '#0F172A',
        shadowOpacity: 0.75
      });
    }
  },
  {
    // Post 7: Sandwich Nướng Kiểu Pháp EGGU (55.000đ) - Walking Street Customer Dual Tray
    id: '7ccd15ac-4803-4e6d-a698-e13ce4b23d70',
    title: 'Sandwich Nướng Kiểu Pháp - Walking Street Dual Tray',
    filename: 'ai-concept-scene-7-walking-street-tray.jpg',
    build: async () => {
      return await sharp(trayPhoto)
        .extract({ left: 0, top: 220, width: 573, height: 573 })
        .resize(1000, 1000)
        .jpeg({ quality: 94 })
        .toBuffer();
    }
  }
];

async function deploy() {
  console.log('=== Deploying Seamless AI-Cutout Scenes Across Supabase & DB ===');
  const now = Date.now();

  for (let i = 0; i < scenes.length; i++) {
    const s = scenes[i];
    console.log(`[${i}] Processing ${s.title}...`);
    
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

  console.log('=== All 8 scenes updated with seamless AI cutout! ===');
}

deploy();
