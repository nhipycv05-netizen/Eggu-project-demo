import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

export interface SceneContext {
  key: string;
  nameVi: string;
  bgPrompt: string;
  lightingMood: 'morning_warm' | 'cool_office' | 'amber_rainy' | 'golden_sunset' | 'sweet_caramel' | 'fresh_teal';
  badgeTitle: string;
  badgeSubtitle: string;
}

/**
 * 1. Phân tích ngữ cảnh, cảm xúc, thời gian và địa điểm từ Caption
 */
export function analyzeCaptionContext(caption: string, dishName: string): SceneContext {
  const text = (caption + ' ' + dishName).toLowerCase();

  // Văn phòng / Đi làm / Bữa sáng vội vã
  if (text.includes('văn phòng') || text.includes('công sở') || text.includes('đi làm') || text.includes('vội vã') || text.includes('sạch tay') || text.includes('no lâu') || text.includes('đồng nghiệp')) {
    return {
      key: 'office_morning_rush',
      nameVi: 'Bữa Sáng Công Sở (Gọn gàng & Tiện lợi)',
      bgPrompt: 'Modern minimalist office desk workspace background, blurred laptop keyboard and cold brew coffee cup, bright morning natural sunlight through large window, creamy shallow depth of field, organized productivity atmosphere, high-end food advertising backdrop',
      lightingMood: 'cool_office',
      badgeTitle: '💼 BỮA SÁNG CÔNG SỞ',
      badgeSubtitle: 'Gọn gàng sạch tay · Nạp năng lượng khởi đầu ngày mới',
    };
  }

  // Trời mưa / Se lạnh / Phố cổ hoài niệm
  if (text.includes('trời mưa') || text.includes('mưa') || text.includes('se lạnh') || text.includes('gió mùa') || text.includes('rét') || text.includes('ẩm ướt')) {
    return {
      key: 'rainy_hanoi_cafe',
      nameVi: 'Ngắm Mưa Hà Nội (Ấm áp bên khung cửa kính)',
      bgPrompt: 'Cozy Hanoi Old Quarter cafe window background with gentle raindrops on glass, warm amber indoor pendant lighting, blurred bokeh street lamps in the rain, cozy comforting rainy day atmosphere, shallow depth of field',
      lightingMood: 'amber_rainy',
      badgeTitle: '🌧️ NGẮM MƯA PHỐ CỔ',
      badgeSubtitle: 'Bánh nóng giòn rụm sưởi ấm ngày mưa se lạnh',
    };
  }

  // Ngọt ngào / Kiểu Pháp / Chủ Nhật thảnh thơi
  if (text.includes('kiểu pháp') || text.includes('ngọt') || text.includes('caramel') || text.includes('chủ nhật') || text.includes('thảnh thơi') || text.includes('brunch') || text.includes('bơ sữa')) {
    return {
      key: 'sweet_sunday_brunch',
      nameVi: 'Chủ Nhật Thảnh Thơi (Sweet Sunday Brunch)',
      bgPrompt: 'Elegant sunlit Sunday brunch table background, delicate ceramic latte cup with heart latte art, linen napkin, maple syrup drizzle ambiance, soft morning golden hour glow, dreamy aesthetic cafe vibe',
      lightingMood: 'sweet_caramel',
      badgeTitle: '☕ SUNDAY SLOW BRUNCH',
      badgeSubtitle: 'Chủ Nhật thảnh thơi · Tự thưởng vị ngọt ngào tan chảy',
    };
  }

  // Phố đi bộ / Gom đơn / Dạo phố cuối tuần
  if (text.includes('phố đi bộ') || text.includes('dạo phố') || text.includes('hồ gươm') || text.includes('ca cứng') || text.includes('nhóm bạn') || text.includes('check-in')) {
    return {
      key: 'walking_street_weekend',
      nameVi: 'Check-in Phố Đi Bộ (Cuối tuần sôi động)',
      bgPrompt: 'Lively Hanoi pedestrian walking street background in the golden afternoon, blurred crowd enjoying street food, outdoor wooden bench, festive energetic weekend vibe, cinematic natural lighting',
      lightingMood: 'golden_sunset',
      badgeTitle: '🚶‍♂️ CHECK-IN PHỐ ĐI BỘ',
      badgeSubtitle: 'Gom đơn ca cứng · Dạo phố cuối tuần trọn vị ngon',
    };
  }

  // Cá ngừ / Rong biển / Thanh mát
  if (text.includes('cá ngừ') || text.includes('nori') || text.includes('rong biển') || text.includes('thanh mát')) {
    return {
      key: 'fresh_oceanic_snack',
      nameVi: 'Thanh Mát & Đậm Đà (Xế chiều sảng khoái)',
      bgPrompt: 'Aesthetic modern bistro table setting, iced fruit soda glass with lemon slice and fresh herbs, clean bright daytime lighting, ocean breeze freshness mood, shallow depth of field food photography',
      lightingMood: 'fresh_teal',
      badgeTitle: '🐟 THANH MÁT ĐẬM ĐÀ',
      badgeSubtitle: 'Hương vị biển thanh mát quyện sốt béo ngậy',
    };
  }

  // Mặc định: Phố cổ Hà Nội - Chuẩn vị Seoul
  return {
    key: 'street_signature_seoul',
    nameVi: 'Chuẩn Vị Seoul Giữa Phố Cổ Hà Nội',
    bgPrompt: 'Iconic Hanoi Old Quarter heritage street view background, warm yellow colonial building facade with green shutters, bright morning golden sunlight, authentic urban street food culture mood, shallow depth of field',
    lightingMood: 'morning_warm',
    badgeTitle: '✨ EGGU SIGNATURE',
    badgeSubtitle: 'Chuẩn vị Seoul giữa lòng phố cổ Hà Nội',
  };
}

/**
 * 2. Tái tạo nền bối cảnh (Background Synthesis & Bokeh Depth of Field)
 */
function generateBackgroundSvg(mood: SceneContext['lightingMood']): string {
  switch (mood) {
    case 'cool_office':
      return `
        <svg width="1000" height="1000" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="officeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#E2E8F0"/>
              <stop offset="50%" stop-color="#CBD5E1"/>
              <stop offset="100%" stop-color="#94A3B8"/>
            </linearGradient>
            <radialGradient id="sunBeam" cx="20%" cy="10%" r="80%">
              <stop offset="0%" stop-color="#FEF08A" stop-opacity="0.6"/>
              <stop offset="100%" stop-color="#FEF08A" stop-opacity="0"/>
            </radialGradient>
          </defs>
          <rect width="1000" height="1000" fill="url(#officeGrad)"/>
          <rect width="1000" height="1000" fill="url(#sunBeam)"/>
          <!-- Blurred desk & window elements -->
          <circle cx="200" cy="300" r="180" fill="#FFFFFF" fill-opacity="0.35"/>
          <circle cx="800" cy="400" r="220" fill="#64748B" fill-opacity="0.25"/>
          <rect x="0" y="650" width="1000" height="350" fill="#475569" fill-opacity="0.2"/>
        </svg>
      `;

    case 'amber_rainy':
      return `
        <svg width="1000" height="1000" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <radialGradient id="rainGrad" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stop-color="#4A5568"/>
              <stop offset="50%" stop-color="#2D3748"/>
              <stop offset="100%" stop-color="#1A202C"/>
            </radialGradient>
            <radialGradient id="bokehAmber" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stop-color="#F59E0B" stop-opacity="0.6"/>
              <stop offset="100%" stop-color="#F59E0B" stop-opacity="0"/>
            </radialGradient>
          </defs>
          <rect width="1000" height="1000" fill="url(#rainGrad)"/>
          <circle cx="220" cy="220" r="180" fill="url(#bokehAmber)"/>
          <circle cx="780" cy="280" r="220" fill="url(#bokehAmber)"/>
          <circle cx="480" cy="180" r="130" fill="#FEF3C7" fill-opacity="0.3"/>
          <circle cx="180" cy="680" r="160" fill="url(#bokehAmber)"/>
          <circle cx="840" cy="720" r="190" fill="url(#bokehAmber)"/>
        </svg>
      `;

    case 'sweet_caramel':
      return `
        <svg width="1000" height="1000" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="sweetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#FFFBEB"/>
              <stop offset="50%" stop-color="#FEF3C7"/>
              <stop offset="100%" stop-color="#FDE68A"/>
            </linearGradient>
            <radialGradient id="caramelGlow" cx="40%" cy="30%" r="70%">
              <stop offset="0%" stop-color="#D97706" stop-opacity="0.35"/>
              <stop offset="100%" stop-color="#D97706" stop-opacity="0"/>
            </radialGradient>
          </defs>
          <rect width="1000" height="1000" fill="url(#sweetGrad)"/>
          <rect width="1000" height="1000" fill="url(#caramelGlow)"/>
          <circle cx="300" cy="250" r="220" fill="#FFFFFF" fill-opacity="0.6"/>
          <circle cx="750" cy="350" r="250" fill="#F59E0B" fill-opacity="0.3"/>
        </svg>
      `;

    case 'golden_sunset':
      return `
        <svg width="1000" height="1000" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="sunsetGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#EA580C"/>
              <stop offset="50%" stop-color="#D97706"/>
              <stop offset="100%" stop-color="#7C2D12"/>
            </linearGradient>
            <radialGradient id="sunBokeh" cx="50%" cy="30%" r="60%">
              <stop offset="0%" stop-color="#FDE047" stop-opacity="0.7"/>
              <stop offset="100%" stop-color="#FDE047" stop-opacity="0"/>
            </radialGradient>
          </defs>
          <rect width="1000" height="1000" fill="url(#sunsetGrad)"/>
          <circle cx="500" cy="300" r="300" fill="url(#sunBokeh)"/>
          <circle cx="200" cy="650" r="180" fill="#FB923C" fill-opacity="0.4"/>
          <circle cx="800" cy="700" r="200" fill="#F97316" fill-opacity="0.35"/>
        </svg>
      `;

    case 'fresh_teal':
      return `
        <svg width="1000" height="1000" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="tealGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#CCFBF1"/>
              <stop offset="50%" stop-color="#99F6E4"/>
              <stop offset="100%" stop-color="#0F766E"/>
            </linearGradient>
          </defs>
          <rect width="1000" height="1000" fill="url(#tealGrad)"/>
          <circle cx="300" cy="300" r="240" fill="#FFFFFF" fill-opacity="0.5"/>
          <circle cx="750" cy="400" r="220" fill="#14B8A6" fill-opacity="0.3"/>
        </svg>
      `;

    case 'morning_warm':
    default:
      return `
        <svg width="1000" height="1000" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="warmHanoi" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#FEF9C3"/>
              <stop offset="50%" stop-color="#FDE047"/>
              <stop offset="100%" stop-color="#CA8A04"/>
            </linearGradient>
            <radialGradient id="sunGlow" cx="30%" cy="20%" r="70%">
              <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.8"/>
              <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
            </radialGradient>
          </defs>
          <rect width="1000" height="1000" fill="url(#warmHanoi)"/>
          <rect width="1000" height="1000" fill="url(#sunGlow)"/>
          <circle cx="250" cy="280" r="220" fill="#F59E0B" fill-opacity="0.4"/>
          <circle cx="750" cy="350" r="260" fill="#EAB308" fill-opacity="0.35"/>
        </svg>
      `;
  }
}

/**
 * 3. Đồng bộ ánh sáng, bóng đổ và ghép sản phẩm (Lighting Harmonization & Compositing)
 */
export async function composeHarmonizedEgguPhoto(options: {
  caption: string;
  dishName: string;
  dishPrice: string;
}): Promise<Buffer> {
  const { caption, dishName, dishPrice } = options;
  const context = analyzeCaptionContext(caption, dishName);

  // 1. Tạo nền với hiệu ứng Bokeh
  const rawBgSvg = generateBackgroundSvg(context.lightingMood);
  const bgBuffer = await sharp(Buffer.from(rawBgSvg))
    .blur(25) // Hiệu ứng xóa phông Bokeh khẩu độ lớn f/2.0
    .toBuffer();

  // 2. Tải và xử lý chủ thể (100% giữ nguyên bánh và hộp giấy EGGU)
  const masterPath = path.resolve(process.cwd(), 'public/images/eggu-master-ai-concept.jpg');
  const cutoutPath = path.resolve(process.cwd(), 'public/images/eggu-sandwich-subject-cutout.png');

  let productBuffer: Buffer;
  if (fs.existsSync(cutoutPath)) {
    productBuffer = await sharp(cutoutPath)
      .trim()
      .resize(680, 760, { fit: 'inside' })
      .toBuffer();
  } else {
    // Fallback: Lấy trực tiếp từ ảnh master
    productBuffer = await sharp(masterPath)
      .extract({ left: 180, top: 380, width: 480, height: 540 })
      .resize(680, 760, { fit: 'inside' })
      .toBuffer();
  }

  // 3. Điều chỉnh ánh sáng chủ thể (Relighting) để khớp với môi trường
  let relitProduct = sharp(productBuffer);
  if (context.lightingMood === 'amber_rainy') {
    relitProduct = relitProduct.modulate({ brightness: 0.96, saturation: 1.05 });
  } else if (context.lightingMood === 'cool_office') {
    relitProduct = relitProduct.modulate({ brightness: 1.02, saturation: 0.98 });
  } else if (context.lightingMood === 'sweet_caramel' || context.lightingMood === 'golden_sunset') {
    relitProduct = relitProduct.modulate({ brightness: 1.04, saturation: 1.12 });
  }
  const relitBuffer = await relitProduct.toBuffer();

  // 4. Tạo bóng đổ tiếp xúc (Contact Ambient Shadow) để bánh bám tự nhiên vào không gian
  const shadowSvg = Buffer.from(`
    <svg width="1000" height="1000" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadowContact" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="30"/>
        </filter>
      </defs>
      <!-- Deep core shadow under box -->
      <ellipse cx="610" cy="850" rx="310" ry="110" fill="#000000" fill-opacity="0.75" filter="url(#shadowContact)"/>
      <!-- Soft ambient rim shadow -->
      <ellipse cx="580" cy="810" rx="220" ry="70" fill="#000000" fill-opacity="0.55" filter="url(#shadowContact)"/>
    </svg>
  `);

  // 5. Tạo lớp phủ đồ họa thương hiệu (Editorial Header & Bottom Card)
  const graphicOverlaySvg = Buffer.from(`
    <svg width="1000" height="1000" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="topFade" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#000000" stop-opacity="0.65"/>
          <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
        </linearGradient>
        <linearGradient id="botFade" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#000000" stop-opacity="0"/>
          <stop offset="100%" stop-color="#000000" stop-opacity="0.85"/>
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="1000" height="180" fill="url(#topFade)"/>
      <rect x="0" y="730" width="1000" height="270" fill="url(#botFade)"/>

      <!-- Top Left Brand Badge -->
      <g transform="translate(45, 45)">
        <rect width="280" height="52" rx="26" fill="#FFFFFF" fill-opacity="0.95"/>
        <circle cx="26" cy="26" r="16" fill="#E11D48"/>
        <text x="26" y="32" font-family="'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="15" fill="#FFFFFF" text-anchor="middle">E</text>
        <text x="52" y="33" font-family="'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="15" fill="#1E1B18">EGGU KOREAN TOAST</text>
      </g>

      <!-- Top Right Price Pill -->
      <g transform="translate(710, 45)">
        <rect width="245" height="52" rx="26" fill="#F59E0B"/>
        <text x="122" y="33" font-family="'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="16" fill="#1E1B18" text-anchor="middle">${dishPrice || '39.000đ'}</text>
      </g>

      <!-- Bottom Contextual Card -->
      <g transform="translate(50, 830)">
        <rect width="240" height="30" rx="15" fill="#E11D48"/>
        <text x="120" y="20" font-family="'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="13" fill="#FFFFFF" text-anchor="middle">${context.badgeTitle.replace(/&/g, '&amp;')}</text>
        <text x="0" y="68" font-family="'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="31" fill="#FFFFFF">${dishName.replace(/&/g, '&amp;')}</text>
        <text x="0" y="104" font-family="'Segoe UI', Roboto, sans-serif" font-weight="500" font-size="18" fill="#FDE68A">${context.badgeSubtitle.replace(/&/g, '&amp;')}</text>
        <text x="0" y="132" font-family="'Segoe UI', Roboto, sans-serif" font-weight="600" font-size="14" fill="#E5E7EB">📍 54 Nguyễn Hữu Huân, Hoàn Kiếm, Hà Nội</text>
      </g>
    </svg>
  `);

  // 6. Ghép tổng hợp đa tầng (Multi-layer Compositing)
  return await sharp(bgBuffer)
    .composite([
      { input: shadowSvg, blend: 'over' },
      { input: relitBuffer, top: 190, left: 210, blend: 'over' },
      { input: graphicOverlaySvg, blend: 'over' },
    ])
    .jpeg({ quality: 92 })
    .toBuffer();
}

/**
 * 4. Tải lên Supabase Storage và lưu vào Database
 */
export async function uploadAndDeployConceptPhoto(
  imageBuffer: Buffer,
  filename: string
): Promise<string> {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://bnblofcypxfydnptazrs.supabase.co',
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
  );

  const storageFilename = filename.endsWith('.jpg') ? filename : `${filename}.jpg`;

  const { error: upErr } = await supabase.storage
    .from('promotions')
    .upload(storageFilename, imageBuffer, {
      contentType: 'image/jpeg',
      upsert: true,
      cacheControl: '0',
    });

  if (upErr) {
    throw new Error(`Upload error to Supabase Storage: ${upErr.message}`);
  }

  const publicUrl = `https://bnblofcypxfydnptazrs.supabase.co/storage/v1/object/public/promotions/${storageFilename}?v=${Date.now()}`;
  return publicUrl;
}
