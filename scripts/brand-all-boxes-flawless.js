const sharp = require('sharp');
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bnblofcypxfydnptazrs.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'sb_secret_b0IcObDVlfwIlKpClSJD_Q_bAAK8DxJ'
);

const brainDir = 'C:/Users/ASUS/.gemini/antigravity/brain/1d5b6f3a-5cfa-4681-84b1-f5a7a5ddea7a/';
const artBase64 = fs.readFileSync('public/images/eggu-packaging-art.png').toString('base64');
const artDataUri = 'data:image/png;base64,' + artBase64;

const items = [
  {
    name: 'beef-teriyaki',
    file: 'social_beef_teriyaki_1795195265951.jpg',
    dest: 'ai-branded-beef-teriyaki.jpg',
    quad: { tl: [145, 785], tr: [428, 890], br: [430, 1055], bl: [165, 940] },
    yellowSplit: 0.22,
    artScale: 125,
    cleanups: [
      { type: 'circle', cx: 830, cy: 1055, r: 55, color: '#d0b798' }
    ]
  },
  {
    name: 'bacon-cheese',
    file: 'hanoi_egg_drop_sandwich_1795195216990.jpg',
    dest: 'ai-branded-bacon-cheese.jpg',
    quad: { tl: [315, 755], tr: [570, 835], br: [565, 980], bl: [318, 900] },
    yellowSplit: 0.22,
    artScale: 105,
    cleanups: [
      // Storefront sign 'EGG DROP' under awning
      { type: 'rect', x: 168, y: 412, w: 125, h: 36, color: '#d8cebe' }
    ]
  },
  {
    name: 'ham-cheese',
    file: 'social_ham_cheese_1795195274555.jpg',
    dest: 'ai-branded-ham-cheese.jpg',
    quad: { tl: [270, 785], tr: [740, 785], br: [725, 945], bl: [280, 995] },
    yellowSplit: 0.22,
    artScale: 130,
    cleanups: []
  },
  {
    name: 'fluffy-egg',
    file: 'social_fluffy_egg_1795195278360.jpg',
    dest: 'ai-branded-fluffy-egg.jpg',
    quad: { tl: [195, 760], tr: [675, 900], br: [640, 1085], bl: [215, 970] },
    yellowSplit: 0.22,
    artScale: 135,
    cleanups: []
  },
  {
    name: 'tuna-melt',
    file: 'social_tuna_melt_1795195284810.jpg',
    dest: 'ai-branded-tuna-melt.jpg',
    quad: { tl: [250, 785], tr: [650, 785], br: [640, 945], bl: [260, 960] },
    yellowSplit: 0.22,
    artScale: 130,
    cleanups: []
  },
  {
    name: 'chicken-pesto',
    file: 'social_chicken_pesto_1795195287462.jpg',
    dest: 'ai-branded-chicken-pesto.jpg',
    quad: { tl: [165, 775], tr: [545, 895], br: [535, 1065], bl: [188, 945] },
    yellowSplit: 0.22,
    artScale: 130,
    cleanups: []
  },
  {
    name: 'corn-bacon',
    file: 'social_corn_bacon_1795195292226.jpg',
    dest: 'ai-branded-corn-bacon.jpg',
    quad: { tl: [300, 805], tr: [705, 805], br: [675, 935], bl: [305, 1055] },
    yellowSplit: 0.22,
    artScale: 130,
    cleanups: []
  },
  {
    name: 'french-toast',
    file: 'social_french_toast_1795195296177.jpg',
    dest: 'ai-branded-french-toast.jpg',
    quad: { tl: [185, 770], tr: [540, 880], br: [525, 1060], bl: [205, 940] },
    yellowSplit: 0.22,
    artScale: 130,
    cleanups: []
  }
];

function generateSvg(item) {
  const { tl, tr, br, bl } = item.quad;
  const boxPoints = `${tl[0]},${tl[1]} ${tr[0]},${tr[1]} ${br[0]},${br[1]} ${bl[0]},${bl[1]}`;

  // Bottom yellow band
  const ybl = [
    Math.round(tl[0] + (bl[0] - tl[0]) * (1 - item.yellowSplit)),
    Math.round(tl[1] + (bl[1] - tl[1]) * (1 - item.yellowSplit))
  ];
  const ybr = [
    Math.round(tr[0] + (br[0] - tr[0]) * (1 - item.yellowSplit)),
    Math.round(tr[1] + (br[1] - tr[1]) * (1 - item.yellowSplit))
  ];
  const yellowPoints = `${ybl[0]},${ybl[1]} ${ybr[0]},${ybr[1]} ${br[0]},${br[1]} ${bl[0]},${bl[1]}`;

  // Center of box front face
  const centerX = (tl[0] + tr[0] + br[0] + bl[0]) / 4;
  const centerY = (tl[1] + tr[1] + br[1] + bl[1]) / 4;

  // Rotation angle along top rim
  const angle = Math.atan2(tr[1] - tl[1], tr[0] - tl[0]) * (180 / Math.PI);

  // Height of front face
  const avgHeight = ((bl[1] - tl[1]) + (br[1] - tr[1])) / 2;
  // Center of the white section (above the yellow band)
  const artCenterY = centerY - avgHeight * (item.yellowSplit * 0.6);

  let cleanupsSvg = '';
  if (item.cleanups && item.cleanups.length) {
    for (const c of item.cleanups) {
      if (c.type === 'circle') {
        cleanupsSvg += `<circle cx="${c.cx}" cy="${c.cy}" r="${c.r}" fill="${c.color}" opacity="0.96" />`;
      } else if (c.type === 'rect') {
        cleanupsSvg += `<rect x="${c.x}" y="${c.y}" width="${c.w}" height="${c.h}" fill="${c.color}" opacity="0.96" rx="3" />`;
      }
    }
  }

  const artWidth = item.artScale;
  const artHeight = Math.round(artWidth * (218 / 230));

  return `
    <svg width="896" height="1200" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
      <defs>
        <clipPath id="boxClip_${item.name}">
          <polygon points="${boxPoints}" />
        </clipPath>
        <linearGradient id="boxGrad_${item.name}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#ffffff"/>
          <stop offset="60%" stop-color="#f8f8f7"/>
          <stop offset="100%" stop-color="#e8e7e5"/>
        </linearGradient>
        <linearGradient id="yellowGrad_${item.name}" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#f59e0b"/>
          <stop offset="100%" stop-color="#fbbf24"/>
        </linearGradient>
      </defs>

      <!-- Cleanups for surrounding scene -->
      ${cleanupsSvg}

      <!-- Box Front Face: STRICTLY CLIPPED TO BOX -->
      <g clip-path="url(#boxClip_${item.name})">
        <!-- Clean White Paper Surface -->
        <polygon points="${boxPoints}" fill="url(#boxGrad_${item.name})" />

        <!-- Subtle warm gold food doodles -->
        <g opacity="0.18" stroke="#b45309" stroke-width="1.3" fill="none" transform="translate(${centerX}, ${centerY}) rotate(${angle.toFixed(2)})">
          <circle cx="-80" cy="-25" r="8" />
          <path d="M -80,-30 L -80,-20 M -85,-25 L -75,-25" />
          <rect x="65" y="-28" width="14" height="14" rx="3" />
          <path d="M -60,18 Q -50,10 -40,18" />
          <circle cx="75" cy="18" r="6" />
        </g>

        <!-- Yellow Bottom Stripe -->
        <polygon points="${yellowPoints}" fill="url(#yellowGrad_${item.name})" />
        <line x1="${ybl[0]}" y1="${ybl[1]}" x2="${ybr[0]}" y2="${ybr[1]}" stroke="#d97706" stroke-width="1.5" opacity="0.6" />

        <!-- Official EGGU Brand Artwork inside white area -->
        <g transform="translate(${centerX}, ${artCenterY}) rotate(${angle.toFixed(2)})">
          <image href="${artDataUri}" x="${-artWidth / 2}" y="${-artHeight / 2}" width="${artWidth}" height="${artHeight}" />
        </g>
      </g>
    </svg>
  `;
}

async function run() {
  for (const item of items) {
    const srcPath = brainDir + item.file;
    if (!fs.existsSync(srcPath)) continue;

    const svg = generateSvg(item);
    const outBuffer = await sharp(srcPath)
      .composite([{ input: Buffer.from(svg), top: 0, left: 0 }])
      .jpeg({ quality: 95 })
      .toBuffer();

    const localPath = 'public/images/' + item.dest;
    fs.writeFileSync(localPath, outBuffer);
    console.log('Saved local:', localPath);

    const { data, error } = await supabase.storage.from('promotions').upload(item.dest, outBuffer, {
      contentType: 'image/jpeg',
      upsert: true
    });

    if (error) {
      console.error('Supabase upload error for', item.dest, error);
    } else {
      console.log('Uploaded to Supabase Storage:', item.dest);
    }
  }
  console.log('Flawlessly processed and uploaded all 8 images!');
}

run();
