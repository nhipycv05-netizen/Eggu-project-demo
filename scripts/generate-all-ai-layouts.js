const sharp = require('sharp');
const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const masterPhoto = 'public/images/eggu-master-ai-concept.jpg'; // 763 x 1024
const trayPhoto = 'public/images/eggu-walking-street-tray.jpg';   // 573 x 1024

const layouts = [
  {
    // Post 0: Mr. Egg (39.000đ)
    id: '60d79d11-0148-4d30-af72-c4c8faa6ba7a',
    filename: 'ai-concept-mr-egg-street.jpg',
    base: async () => {
      return await sharp(masterPhoto)
        .extract({ left: 0, top: 220, width: 763, height: 763 })
        .resize(1000, 1000)
        .toBuffer();
    },
    svg: `
      <svg width="1000" height="1000" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="topFade0" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#000000" stop-opacity="0.65"/>
            <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
          </linearGradient>
          <linearGradient id="botFade0" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#000000" stop-opacity="0"/>
            <stop offset="100%" stop-color="#000000" stop-opacity="0.8"/>
          </linearGradient>
          <linearGradient id="goldPill0" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#F59E0B"/>
            <stop offset="100%" stop-color="#EA580C"/>
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="1000" height="180" fill="url(#topFade0)"/>
        <rect x="0" y="740" width="1000" height="260" fill="url(#botFade0)"/>

        <!-- Top Left Brand Badge -->
        <g transform="translate(45, 45)">
          <rect width="260" height="52" rx="26" fill="#FFFFFF" fill-opacity="0.95"/>
          <circle cx="26" cy="26" r="16" fill="#E11D48"/>
          <text x="26" y="32" font-family="'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="15" fill="#FFFFFF" text-anchor="middle">E</text>
          <text x="52" y="33" font-family="'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="15" fill="#1E1B18">EGGU SIGNATURE</text>
        </g>

        <!-- Top Right Price Pill -->
        <g transform="translate(735, 45)">
          <rect width="220" height="52" rx="26" fill="url(#goldPill0)"/>
          <text x="110" y="33" font-family="'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="17" fill="#FFFFFF" text-anchor="middle">MR. EGG · 39.000đ</text>
        </g>

        <!-- Bottom Story Card -->
        <g transform="translate(50, 835)">
          <rect width="220" height="30" rx="15" fill="#F59E0B"/>
          <text x="110" y="20" font-family="'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="13" fill="#1E1B18" text-anchor="middle">KHỞI ĐỘNG CUỐI TUẦN</text>
          <text x="0" y="68" font-family="'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="32" fill="#FFFFFF">Nạp Năng Lượng Chuẩn Vị Seoul</text>
          <text x="0" y="104" font-family="'Segoe UI', Roboto, sans-serif" font-weight="500" font-size="18" fill="#FDE68A">Trứng cuộn fluffy mềm mượt · Brioche nướng bơ tỏi vàng rụm</text>
          <text x="0" y="132" font-family="'Segoe UI', Roboto, sans-serif" font-weight="600" font-size="14" fill="#E5E7EB">📍 Phố Lý Quốc Sư, Hoàn Kiếm, Hà Nội</text>
        </g>
      </svg>
    `
  },
  {
    // Post 1: Sandwich Thịt Hộp, Phô Mai & Nori (60.000đ)
    id: '1def400f-3879-4477-ba0b-fd284c65e5dd',
    filename: 'ai-concept-spam-nori-tray.jpg',
    base: async () => {
      // Use walking street tray image (two sandwiches on wooden tray)
      return await sharp(trayPhoto)
        .extract({ left: 0, top: 260, width: 573, height: 573 })
        .resize(1000, 1000)
        .toBuffer();
    },
    svg: `
      <svg width="1000" height="1000" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="topFade1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#000000" stop-opacity="0.65"/>
            <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
          </linearGradient>
          <linearGradient id="botFade1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#000000" stop-opacity="0"/>
            <stop offset="100%" stop-color="#000000" stop-opacity="0.82"/>
          </linearGradient>
          <linearGradient id="greenPill1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#059669"/>
            <stop offset="100%" stop-color="#10B981"/>
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="1000" height="180" fill="url(#topFade1)"/>
        <rect x="0" y="740" width="1000" height="260" fill="url(#botFade1)"/>

        <!-- Top Left Badge -->
        <g transform="translate(45, 45)">
          <rect width="290" height="52" rx="26" fill="#FFFFFF" fill-opacity="0.95"/>
          <text x="30" y="32" font-family="'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="15" fill="#E11D48">EGGU</text>
          <text x="85" y="32" font-family="'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="15" fill="#1E1B18">· STREET FOOD TRAY</text>
        </g>

        <!-- Top Right Price Pill -->
        <g transform="translate(680, 45)">
          <rect width="275" height="52" rx="26" fill="url(#greenPill1)"/>
          <text x="137" y="33" font-family="'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="16" fill="#FFFFFF" text-anchor="middle">THỊT HỘP &amp; NORI · 60K</text>
        </g>

        <!-- Bottom Story Card -->
        <g transform="translate(50, 830)">
          <rect width="200" height="30" rx="15" fill="#10B981"/>
          <text x="100" y="20" font-family="'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="13" fill="#FFFFFF" text-anchor="middle">GOM ĐƠN CA CỨNG</text>
          <text x="0" y="68" font-family="'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="31" fill="#FFFFFF">Thịt Hộp, Phô Mai Kéo Sợi &amp; Nori</text>
          <text x="0" y="104" font-family="'Segoe UI', Roboto, sans-serif" font-weight="500" font-size="18" fill="#A7F3D0">Đậm đà chuẩn vị đường phố Seoul · Thơm nức rong biển nướng</text>
          <text x="0" y="132" font-family="'Segoe UI', Roboto, sans-serif" font-weight="600" font-size="14" fill="#E5E7EB">🚶‍♂️ Check-in dạo phố đi bộ cuối tuần</text>
        </g>
      </svg>
    `
  },
  {
    // Post 2: Sandwich Thịt Xông Khói Ngô Phô Mai (50.000đ)
    id: 'f0892d13-b18a-42c3-bc99-512bbea30471',
    filename: 'ai-concept-corn-bacon-macro.jpg',
    base: async () => {
      // Zoom close-up into the sandwich top and fillings
      return await sharp(masterPhoto)
        .extract({ left: 160, top: 400, width: 480, height: 480 })
        .resize(1000, 1000)
        .modulate({ saturation: 1.15, brightness: 1.03 })
        .toBuffer();
    },
    svg: `
      <svg width="1000" height="1000" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="topFade2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#000000" stop-opacity="0.65"/>
            <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
          </linearGradient>
          <linearGradient id="botFade2" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#000000" stop-opacity="0"/>
            <stop offset="100%" stop-color="#000000" stop-opacity="0.85"/>
          </linearGradient>
          <linearGradient id="yellowPill2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#EAB308"/>
            <stop offset="100%" stop-color="#CA8A04"/>
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="1000" height="180" fill="url(#topFade2)"/>
        <rect x="0" y="730" width="1000" height="270" fill="url(#botFade2)"/>

        <!-- Top Left Badge -->
        <g transform="translate(45, 45)">
          <rect width="270" height="52" rx="26" fill="#FFFFFF" fill-opacity="0.95"/>
          <text x="30" y="32" font-family="'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="15" fill="#E11D48">EGGU</text>
          <text x="85" y="32" font-family="'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="15" fill="#1E1B18">· MACRO GOURMET</text>
        </g>

        <!-- Top Right Pill -->
        <g transform="translate(710, 45)">
          <rect width="245" height="52" rx="26" fill="url(#yellowPill2)"/>
          <text x="122" y="33" font-family="'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="16" fill="#1E1B18" text-anchor="middle">🌽 BẮP PHÔ MAI · 50K</text>
        </g>

        <!-- Bottom Story Card -->
        <g transform="translate(50, 830)">
          <rect width="210" height="30" rx="15" fill="#EAB308"/>
          <text x="105" y="20" font-family="'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="13" fill="#1E1B18" text-anchor="middle">NGỌT BÙI KÉO SỢI</text>
          <text x="0" y="68" font-family="'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="31" fill="#FFFFFF">Thịt Xông Khói Ngô Phô Mai</text>
          <text x="0" y="104" font-family="'Segoe UI', Roboto, sans-serif" font-weight="500" font-size="18" fill="#FEF08A">Từng hạt ngô ngọt giòn quyện thịt xông khói áp chảo mằn mặn</text>
          <text x="0" y="132" font-family="'Segoe UI', Roboto, sans-serif" font-weight="600" font-size="14" fill="#E5E7EB">🔥 Nướng bơ tỏi vàng rụm nóng hổi</text>
        </g>
      </svg>
    `
  },
  {
    // Post 3: Sandwich Nướng Kiểu Pháp (55.000đ)
    id: 'a4ad6011-43a9-49e8-aebb-b18e2e72f0e1',
    filename: 'ai-concept-french-toast-warm.jpg',
    base: async () => {
      // Warm golden morning tone crop
      return await sharp(masterPhoto)
        .extract({ left: 100, top: 320, width: 580, height: 580 })
        .resize(1000, 1000)
        .modulate({ brightness: 1.05, saturation: 1.2 })
        .toBuffer();
    },
    svg: `
      <svg width="1000" height="1000" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="topFade3" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#451A03" stop-opacity="0.65"/>
            <stop offset="100%" stop-color="#451A03" stop-opacity="0"/>
          </linearGradient>
          <linearGradient id="botFade3" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#451A03" stop-opacity="0"/>
            <stop offset="100%" stop-color="#451A03" stop-opacity="0.85"/>
          </linearGradient>
          <linearGradient id="maplePill3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#D97706"/>
            <stop offset="100%" stop-color="#B45309"/>
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="1000" height="180" fill="url(#topFade3)"/>
        <rect x="0" y="730" width="1000" height="270" fill="url(#botFade3)"/>

        <!-- Top Left Badge -->
        <g transform="translate(45, 45)">
          <rect width="290" height="52" rx="26" fill="#FFFFFF" fill-opacity="0.95"/>
          <text x="30" y="32" font-family="'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="15" fill="#D97706">EGGU DESSERT</text>
          <text x="160" y="32" font-family="'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="15" fill="#1E1B18">· FRENCH TOAST</text>
        </g>

        <!-- Top Right Pill -->
        <g transform="translate(710, 45)">
          <rect width="245" height="52" rx="26" fill="url(#maplePill3)"/>
          <text x="122" y="33" font-family="'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="16" fill="#FFFFFF" text-anchor="middle">🍯 NƯỚNG PHÁP · 55K</text>
        </g>

        <!-- Bottom Story Card -->
        <g transform="translate(50, 830)">
          <rect width="210" height="30" rx="15" fill="#F59E0B"/>
          <text x="105" y="20" font-family="'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="13" fill="#1E1B18" text-anchor="middle">NGỌT NGÀO BƠ SỮA</text>
          <text x="0" y="68" font-family="'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="31" fill="#FFFFFF">Sandwich Nướng Kiểu Pháp</text>
          <text x="0" y="104" font-family="'Segoe UI', Roboto, sans-serif" font-weight="500" font-size="18" fill="#FDE68A">Lớp caramel óng ả · Bánh mì bơ tỏi thơm lừng ngọt ngào</text>
          <text x="0" y="132" font-family="'Segoe UI', Roboto, sans-serif" font-weight="600" font-size="14" fill="#E5E7EB">✨ Tự thưởng bữa sáng cuối tuần trọn vẹn</text>
        </g>
      </svg>
    `
  },
  {
    // Post 4: Sandwich Thịt Xông Khói Bơ Tỏi Phô Mai (55.000đ) - Best Seller
    id: 'd3b091ec-dc7f-4154-962c-a726bbf19371',
    filename: 'ai-concept-bacon-garlic-bestseller.jpg',
    base: async () => {
      // High dynamic contrast, close angled hero crop
      return await sharp(masterPhoto)
        .extract({ left: 120, top: 360, width: 550, height: 550 })
        .resize(1000, 1000)
        .linear(1.1, -10)
        .toBuffer();
    },
    svg: `
      <svg width="1000" height="1000" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="topFade4" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#000000" stop-opacity="0.7"/>
            <stop offset="100%" stop-color="#000000" stop-opacity="0"/>
          </linearGradient>
          <linearGradient id="botFade4" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#000000" stop-opacity="0"/>
            <stop offset="100%" stop-color="#000000" stop-opacity="0.85"/>
          </linearGradient>
          <linearGradient id="redPill4" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#E11D48"/>
            <stop offset="100%" stop-color="#BE123C"/>
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="1000" height="180" fill="url(#topFade4)"/>
        <rect x="0" y="730" width="1000" height="270" fill="url(#botFade4)"/>

        <!-- Top Left Badge -->
        <g transform="translate(45, 45)">
          <rect width="250" height="52" rx="26" fill="url(#redPill4)"/>
          <text x="125" y="33" font-family="'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="16" fill="#FFFFFF" text-anchor="middle">🔥 BEST SELLER</text>
        </g>

        <!-- Top Right Pill -->
        <g transform="translate(680, 45)">
          <rect width="275" height="52" rx="26" fill="#FFFFFF" fill-opacity="0.95"/>
          <text x="137" y="33" font-family="'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="16" fill="#1E1B18" text-anchor="middle">BƠ TỎI PHÔ MAI · 55K</text>
        </g>

        <!-- Bottom Story Card -->
        <g transform="translate(50, 830)">
          <rect width="220" height="30" rx="15" fill="#E11D48"/>
          <text x="110" y="20" font-family="'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="13" fill="#FFFFFF" text-anchor="middle">BÙNG NỔ VỊ GIÁC</text>
          <text x="0" y="68" font-family="'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="31" fill="#FFFFFF">Thịt Xông Khói Bơ Tỏi Phô Mai</text>
          <text x="0" y="104" font-family="'Segoe UI', Roboto, sans-serif" font-weight="500" font-size="18" fill="#FECDD3">Vỏ brioche nướng bơ tỏi vàng rụm · Phô mai cheddar béo ngậy</text>
          <text x="0" y="132" font-family="'Segoe UI', Roboto, sans-serif" font-weight="600" font-size="14" fill="#E5E7EB">⭐ Món được yêu thích nhất tại EGGU</text>
        </g>
      </svg>
    `
  },
  {
    // Post 5: Đồng hành công sở (Bữa sáng vội vã) - 55.000đ
    id: 'cebf1228-97ba-406c-bfe1-5d88e5d9e029',
    filename: 'ai-concept-office-morning-rush.jpg',
    base: async () => {
      // Modern commuter framing (wider view showing the neat box and clean grip)
      return await sharp(masterPhoto)
        .extract({ left: 30, top: 250, width: 700, height: 700 })
        .resize(1000, 1000)
        .toBuffer();
    },
    svg: `
      <svg width="1000" height="1000" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="topFade5" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#0F172A" stop-opacity="0.7"/>
            <stop offset="100%" stop-color="#0F172A" stop-opacity="0"/>
          </linearGradient>
          <linearGradient id="botFade5" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#0F172A" stop-opacity="0"/>
            <stop offset="100%" stop-color="#0F172A" stop-opacity="0.85"/>
          </linearGradient>
          <linearGradient id="bluePill5" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#2563EB"/>
            <stop offset="100%" stop-color="#1D4ED8"/>
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="1000" height="180" fill="url(#topFade5)"/>
        <rect x="0" y="730" width="1000" height="270" fill="url(#botFade5)"/>

        <!-- Top Left Badge -->
        <g transform="translate(45, 45)">
          <rect width="280" height="52" rx="26" fill="url(#bluePill5)"/>
          <text x="140" y="33" font-family="'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="15" fill="#FFFFFF" text-anchor="middle">💼 ĐỒNG HÀNH CÔNG SỞ</text>
        </g>

        <!-- Top Right Pill -->
        <g transform="translate(710, 45)">
          <rect width="245" height="52" rx="26" fill="#FFFFFF" fill-opacity="0.95"/>
          <text x="122" y="33" font-family="'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="16" fill="#1E293B" text-anchor="middle">BỮA SÁNG · 55.000đ</text>
        </g>

        <!-- Bottom Story Card -->
        <g transform="translate(50, 830)">
          <rect width="230" height="30" rx="15" fill="#3B82F6"/>
          <text x="115" y="20" font-family="'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="13" fill="#FFFFFF" text-anchor="middle">TIỆN LỢI · NO LÂU · SẠCH TAY</text>
          <text x="0" y="68" font-family="'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="31" fill="#FFFFFF">Bữa Sáng Nhanh Gọn Cho Dân Văn Phòng</text>
          <text x="0" y="104" font-family="'Segoe UI', Roboto, sans-serif" font-weight="500" font-size="18" fill="#BFDBFE">Hộp giấy cầm tay không dính mỡ · Nạp năng lượng khởi đầu ngày mới</text>
          <text x="0" y="132" font-family="'Segoe UI', Roboto, sans-serif" font-weight="600" font-size="14" fill="#E5E7EB">🛵 Giao nhanh tận bàn làm việc qua Grab/ShopeeFood</text>
        </g>
      </svg>
    `
  },
  {
    // Post 6: Sandwich Cá Ngừ Phô Mai (60.000đ)
    id: 'a6be4913-58fb-4e70-8c49-56925ef1eff9',
    filename: 'ai-concept-tuna-melt-crunch.jpg',
    base: async () => {
      // Oceanic teal tone, savory focus
      return await sharp(masterPhoto)
        .extract({ left: 80, top: 300, width: 620, height: 620 })
        .resize(1000, 1000)
        .toBuffer();
    },
    svg: `
      <svg width="1000" height="1000" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="topFade6" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#042F2E" stop-opacity="0.65"/>
            <stop offset="100%" stop-color="#042F2E" stop-opacity="0"/>
          </linearGradient>
          <linearGradient id="botFade6" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#042F2E" stop-opacity="0"/>
            <stop offset="100%" stop-color="#042F2E" stop-opacity="0.85"/>
          </linearGradient>
          <linearGradient id="tealPill6" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#0D9488"/>
            <stop offset="100%" stop-color="#0F766E"/>
          </linearGradient>
        </defs>
        <rect x="0" y="0" width="1000" height="180" fill="url(#topFade6)"/>
        <rect x="0" y="730" width="1000" height="270" fill="url(#botFade6)"/>

        <!-- Top Left Badge -->
        <g transform="translate(45, 45)">
          <rect width="270" height="52" rx="26" fill="#FFFFFF" fill-opacity="0.95"/>
          <text x="30" y="32" font-family="'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="15" fill="#0D9488">EGGU SEAFOOD</text>
          <text x="160" y="32" font-family="'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="15" fill="#1E1B18">· TUNA MELT</text>
        </g>

        <!-- Top Right Pill -->
        <g transform="translate(710, 45)">
          <rect width="245" height="52" rx="26" fill="url(#tealPill6)"/>
          <text x="122" y="33" font-family="'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="16" fill="#FFFFFF" text-anchor="middle">🐟 CÁ NGỪ · 60.000đ</text>
        </g>

        <!-- Bottom Story Card -->
        <g transform="translate(50, 830)">
          <rect width="210" height="30" rx="15" fill="#0D9488"/>
          <text x="105" y="20" font-family="'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="13" fill="#FFFFFF" text-anchor="middle">NÓNG HỔI GIÒN RỤM</text>
          <text x="0" y="68" font-family="'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="31" fill="#FFFFFF">Sandwich Cá Ngừ Phô Mai</text>
          <text x="0" y="104" font-family="'Segoe UI', Roboto, sans-serif" font-weight="500" font-size="18" fill="#99F6E4">Xốt mayo béo ngậy quyện hành tây thanh mát &amp; mozzarella</text>
          <text x="0" y="132" font-family="'Segoe UI', Roboto, sans-serif" font-weight="600" font-size="14" fill="#E5E7EB">✨ Món ăn vặt lý tưởng dạo phố chiều</text>
        </g>
      </svg>
    `
  },
  {
    // Post 7: Sandwich Nướng Kiểu Pháp EGGU (55.000đ) - Sunday Brunch Editorial
    id: '7ccd15ac-4803-4e6d-a698-e13ce4b23d70',
    filename: 'ai-concept-sunday-brunch-editorial.jpg',
    base: async () => {
      // Editorial framing with delicate border
      return await sharp(masterPhoto)
        .extract({ left: 60, top: 280, width: 650, height: 650 })
        .resize(1000, 1000)
        .modulate({ saturation: 1.1 })
        .toBuffer();
    },
    svg: `
      <svg width="1000" height="1000" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="topFade7" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#18181B" stop-opacity="0.65"/>
            <stop offset="100%" stop-color="#18181B" stop-opacity="0"/>
          </linearGradient>
          <linearGradient id="botFade7" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#18181B" stop-opacity="0"/>
            <stop offset="100%" stop-color="#18181B" stop-opacity="0.85"/>
          </linearGradient>
          <linearGradient id="amberPill7" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stop-color="#F59E0B"/>
            <stop offset="100%" stop-color="#D97706"/>
          </linearGradient>
        </defs>
        <!-- Fine Editorial Inner Border -->
        <rect x="25" y="25" width="950" height="950" fill="none" stroke="#FFFFFF" stroke-opacity="0.3" stroke-width="2"/>

        <rect x="0" y="0" width="1000" height="180" fill="url(#topFade7)"/>
        <rect x="0" y="730" width="1000" height="270" fill="url(#botFade7)"/>

        <!-- Top Left Editorial Badge -->
        <g transform="translate(45, 45)">
          <rect width="320" height="52" rx="6" fill="#18181B" fill-opacity="0.85" stroke="#F59E0B" stroke-width="1.5"/>
          <text x="160" y="32" font-family="'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="14" fill="#F59E0B" text-anchor="middle" letter-spacing="2">WEEKEND SLOW BRUNCH</text>
        </g>

        <!-- Top Right Pill -->
        <g transform="translate(710, 45)">
          <rect width="245" height="52" rx="26" fill="url(#amberPill7)"/>
          <text x="122" y="33" font-family="'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="16" fill="#1E1B18" text-anchor="middle">KIỂU PHÁP · 55.000đ</text>
        </g>

        <!-- Bottom Story Card -->
        <g transform="translate(50, 830)">
          <rect width="210" height="30" rx="4" fill="#F59E0B"/>
          <text x="105" y="20" font-family="'Segoe UI', Roboto, sans-serif" font-weight="800" font-size="13" fill="#1E1B18" text-anchor="middle">CHỦ NHẬT THẢNH THƠI</text>
          <text x="0" y="68" font-family="'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="31" fill="#FFFFFF">Tự Thưởng Bữa Sáng Chuẩn Vị Seoul</text>
          <text x="0" y="104" font-family="'Segoe UI', Roboto, sans-serif" font-weight="500" font-size="18" fill="#FDE68A">Bánh mì nướng kiểu Pháp thơm bơ sữa · Thư thái ngày nghỉ</text>
          <text x="0" y="132" font-family="'Segoe UI', Roboto, sans-serif" font-weight="600" font-size="14" fill="#E5E7EB">☕ Thưởng thức chậm rãi cùng ly trà hoa quả</text>
        </g>
      </svg>
    `
  }
];

async function generateAll() {
  console.log('--- Generating 8 Distinct AI Concept Layouts ---');
  const now = Date.now();

  for (let i = 0; i < layouts.length; i++) {
    const item = layouts[i];
    console.log(`[${i}] Processing ${item.filename} for post ${item.id}...`);

    const baseBuf = await item.base();
    const svgBuf = Buffer.from(item.svg);

    const outBuf = await sharp(baseBuf)
      .composite([{ input: svgBuf, blend: 'over' }])
      .jpeg({ quality: 92 })
      .toBuffer();

    const localPath = `public/images/${item.filename}`;
    fs.writeFileSync(localPath, outBuf);
    console.log(`    Saved locally: ${localPath} (${outBuf.length} bytes)`);

    // Upload to Supabase Storage
    const storagePath = item.filename;
    const { error: upErr } = await supabase.storage
      .from('promotions')
      .upload(storagePath, outBuf, {
        contentType: 'image/jpeg',
        upsert: true,
        cacheControl: '0'
      });

    if (upErr) {
      console.error(`    Upload error for ${storagePath}:`, upErr);
    } else {
      console.log(`    Uploaded to Supabase: promotions/${storagePath}`);
    }

    // Update database record
    const photoUrl = `https://bnblofcypxfydnptazrs.supabase.co/storage/v1/object/public/promotions/${storagePath}?v=${now}`;
    const { error: dbErr } = await supabase
      .from('marketing_posts')
      .update({ ai_photo_url: photoUrl })
      .eq('id', item.id);

    if (dbErr) {
      console.error(`    DB update error:`, dbErr);
    } else {
      console.log(`    Updated post ${item.id} -> ${photoUrl}`);
    }
  }

  console.log('--- All 8 Distinct Layouts Successfully Deployed! ---');
}

generateAll();
