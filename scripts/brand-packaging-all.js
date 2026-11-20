const sharp = require('sharp');
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const brainDir = 'C:/Users/ASUS/.gemini/antigravity/brain/1d5b6f3a-5cfa-4681-84b1-f5a7a5ddea7a/';
const artPath = 'public/images/eggu-packaging-art.png';

const items = [
  {
    dish: 'SANDWICH THỊT BÒ NƯỚNG TERIYAKI',
    src: 'social_beef_teriyaki_1795195265951.jpg',
    dest: 'ai-branded-beef-teriyaki.jpg',
    artTop: 675, artLeft: 275, artWidth: 140
  },
  {
    dish: 'SANDWICH THỊT XÔNG KHÓI BƠ TỎI PHÔ MAI',
    src: 'hanoi_egg_drop_sandwich_1795195216990.jpg',
    dest: 'ai-branded-bacon-cheese.jpg',
    artTop: 740, artLeft: 340, artWidth: 135
  },
  {
    dish: 'SANDWICH DĂM BÔNG PHÔ MAI MỸ',
    src: 'social_ham_cheese_1795195274555.jpg',
    dest: 'ai-branded-ham-cheese.jpg',
    artTop: 770, artLeft: 330, artWidth: 135
  },
  {
    dish: 'SANDWICH TRỨNG PHÔ MAI',
    src: 'social_fluffy_egg_1795195278360.jpg',
    dest: 'ai-branded-fluffy-egg.jpg',
    artTop: 700, artLeft: 360, artWidth: 140
  },
  {
    dish: 'SANDWICH CÁ NGỪ PHÔ MAI',
    src: 'social_tuna_melt_1795195284810.jpg',
    dest: 'ai-branded-tuna-melt.jpg',
    artTop: 730, artLeft: 320, artWidth: 140
  },
  {
    dish: 'SANDWICH GÀ NƯỚNG PESTO',
    src: 'social_chicken_pesto_1795195287462.jpg',
    dest: 'ai-branded-chicken-pesto.jpg',
    artTop: 680, artLeft: 290, artWidth: 140
  },
  {
    dish: 'SANDWICH THỊT XÔNG KHÓI NGÔ PHÔ MAI',
    src: 'social_corn_bacon_1795195292226.jpg',
    dest: 'ai-branded-corn-bacon.jpg',
    artTop: 720, artLeft: 330, artWidth: 135
  },
  {
    dish: 'SANDWICH NƯỚNG KIỂU PHÁP',
    src: 'social_french_toast_1795195296177.jpg',
    dest: 'ai-branded-french-toast.jpg',
    artTop: 690, artLeft: 310, artWidth: 140
  }
];

async function run() {
  for (const item of items) {
    const srcPath = brainDir + item.src;
    if (!fs.existsSync(srcPath)) continue;

    const art = await sharp(artPath).resize({ width: item.artWidth }).toBuffer();
    const brandedBuf = await sharp(srcPath)
      .composite([{ input: art, top: item.artTop, left: item.artLeft }])
      .jpeg({ quality: 92 })
      .toBuffer();

    const { data, error } = await supabase.storage.from('promotions').upload(item.dest, brandedBuf, {
      contentType: 'image/jpeg',
      upsert: true
    });

    if (error) {
      console.error('Upload error for', item.dest, error);
    } else {
      console.log('Uploaded official packaging AI concept:', item.dest);
    }
  }
  console.log('All 8 official packaging AI concept images created and uploaded!');
}

run();
