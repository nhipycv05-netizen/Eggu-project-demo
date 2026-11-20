import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const dish = searchParams.get('dish') || 'Bacon Double Cheese';
    const price = searchParams.get('price') || '55.000đ';
    const headline = searchParams.get('headline') || 'NÓNG HỔI VỪA THỔI VỪA ĂN';
    const subline =
      searchParams.get('subline') ||
      'Bánh mì brioche nướng bơ tỏi đẫm trứng cuộn fluffy và phô mai';
    const badge = searchParams.get('badge') || 'BÁN CHẠY NHẤT';
    const theme = searchParams.get('theme') || 'street_bold';
    const imageUrl =
      searchParams.get('image') ||
      'https://bnblofcypxfydnptazrs.supabase.co/storage/v1/object/public/products/1790252169872-e67ur3a.png';

    // 4 Distinct Dynamic Layout Themes
    if (theme === 'seoul_cafe') {
      // THEME 1: Seoul Aesthetic Minimalist (Kem Be, Tinh tế, Cafe Hàn Quốc)
      return new ImageResponse(
        (
          <div
            style={{
              width: '1080px',
              height: '1080px',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#FAF7F2',
              padding: '60px',
              fontFamily: 'sans-serif',
              position: 'relative',
              justifyContent: 'space-between',
            }}
          >
            {/* Header Brand */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderBottom: '2px solid #E5DFD5',
                paddingBottom: '24px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '24px',
                    backgroundColor: '#EAAA08',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '24px',
                    marginRight: '16px',
                  }}
                >
                  🍳
                </div>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <span
                    style={{
                      fontSize: '32px',
                      fontWeight: 900,
                      color: '#1E1B18',
                    }}
                  >
                    EGGU
                  </span>
                  <span
                    style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#8A8275',
                    }}
                  >
                    KOREAN EGG TOAST & CAFE
                  </span>
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  backgroundColor: '#1E1B18',
                  color: '#FAF7F2',
                  padding: '8px 20px',
                  borderRadius: '30px',
                  fontSize: '16px',
                  fontWeight: 700,
                }}
              >
                {badge}
              </div>
            </div>

            {/* Central Product Showcase */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                margin: '20px 0',
              }}
            >
              {/* Product Glow */}
              <div
                style={{
                  position: 'absolute',
                  width: '520px',
                  height: '520px',
                  borderRadius: '260px',
                  backgroundColor: '#F5E6C4',
                  display: 'flex',
                }}
              />
              {/* Real Product Image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt={dish}
                style={{
                  width: '500px',
                  height: '500px',
                  objectFit: 'contain',
                }}
              />
              {/* Floating Price Tag */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '20px',
                  right: '120px',
                  backgroundColor: '#EAAA08',
                  color: '#1E1B18',
                  padding: '14px 26px',
                  borderRadius: '18px',
                  fontSize: '36px',
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {price}
              </div>
            </div>

            {/* Typography & Callout */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                textAlign: 'center',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  fontSize: '44px',
                  fontWeight: 900,
                  color: '#1E1B18',
                  lineHeight: 1.2,
                  marginBottom: '10px',
                }}
              >
                {headline}
              </span>
              <span
                style={{
                  fontSize: '22px',
                  color: '#5C5549',
                  maxWidth: '820px',
                  lineHeight: 1.4,
                }}
              >
                {subline}
              </span>
            </div>

            {/* Footer */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '2px solid #E5DFD5',
                paddingTop: '20px',
                fontSize: '18px',
                color: '#736B5E',
                fontWeight: 600,
              }}
            >
              <span style={{ display: 'flex' }}>📍 54 Nguyễn Hữu Huân, Hoàn Kiếm, Hà Nội</span>
              <span style={{ display: 'flex' }}>🌐 eggu.vn</span>
            </div>
          </div>
        ),
        { width: 1080, height: 1080 }
      );
    } else if (theme === 'morning_commute') {
      // THEME 2: Morning Commute Hero (Đen Espresso + Vàng Eggu, Hiện đại, Công sở)
      return new ImageResponse(
        (
          <div
            style={{
              width: '1080px',
              height: '1080px',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#171412',
              color: '#FFFFFF',
              padding: '60px',
              fontFamily: 'sans-serif',
              position: 'relative',
              justifyContent: 'space-between',
            }}
          >
            {/* Top Bar */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span
                  style={{
                    fontSize: '40px',
                    fontWeight: 900,
                    color: '#EAAA08',
                    marginRight: '14px',
                  }}
                >
                  EGGU
                </span>
                <span
                  style={{
                    fontSize: '18px',
                    color: '#A39B8B',
                    borderLeft: '2px solid #3D372E',
                    paddingLeft: '14px',
                  }}
                >
                  Bữa Sáng Công Sở Nóng Hổi
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  backgroundColor: '#EAAA08',
                  color: '#171412',
                  padding: '10px 24px',
                  borderRadius: '12px',
                  fontSize: '20px',
                  fontWeight: 900,
                }}
              >
                {badge}
              </div>
            </div>

            {/* Headline section */}
            <div style={{ display: 'flex', flexDirection: 'column', marginTop: '20px' }}>
              <span
                style={{
                  fontSize: '50px',
                  fontWeight: 900,
                  color: '#FFFFFF',
                  lineHeight: 1.15,
                  marginBottom: '10px',
                }}
              >
                {headline}
              </span>
              <span style={{ fontSize: '24px', color: '#EAAA08', fontWeight: 700 }}>
                {dish} — {price}
              </span>
            </div>

            {/* Center Product with Dynamic Frame */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
                margin: '10px 0',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  width: '480px',
                  height: '480px',
                  borderRadius: '240px',
                  backgroundColor: '#26201A',
                  display: 'flex',
                }}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt={dish}
                style={{
                  width: '480px',
                  height: '480px',
                  objectFit: 'contain',
                }}
              />
            </div>

            {/* Value Props & Footer */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                borderTop: '1px solid #332C24',
                paddingTop: '24px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-around',
                  color: '#D4CEBF',
                  fontSize: '18px',
                  fontWeight: 600,
                  marginBottom: '16px',
                }}
              >
                <span style={{ display: 'flex' }}>✨ Nướng nóng khi có đơn</span>
                <span style={{ display: 'flex' }}>✨ Cầm tay ăn sạch không dính mỡ</span>
                <span style={{ display: 'flex' }}>✨ No lâu cả buổi sáng</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  color: '#8F8674',
                  fontSize: '17px',
                }}
              >
                <span style={{ display: 'flex' }}>📍 54 Nguyễn Hữu Huân, Hoàn Kiếm</span>
                <span style={{ display: 'flex' }}>🛵 Đặt giao tận bàn làm việc tại eggu.vn</span>
              </div>
            </div>
          </div>
        ),
        { width: 1080, height: 1080 }
      );
    } else if (theme === 'hanoi_vintage') {
      // THEME 3: Hanoi Heritage Phố Cổ (Cam Đất Ấm, Vintage, Hoài Niệm)
      return new ImageResponse(
        (
          <div
            style={{
              width: '1080px',
              height: '1080px',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#C25E28',
              padding: '50px',
              fontFamily: 'sans-serif',
              position: 'relative',
              justifyContent: 'space-between',
            }}
          >
            {/* Outer Border Frame */}
            <div
              style={{
                width: '980px',
                height: '980px',
                border: '3px solid #FBE8DB',
                borderRadius: '24px',
                padding: '40px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                position: 'relative',
              }}
            >
              {/* Top Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '30px', fontWeight: 900, color: '#FDF6F0' }}>
                  EGGU • PHỐ CỔ HÀ NỘI
                </span>
                <span
                  style={{
                    backgroundColor: '#FDF6F0',
                    color: '#C25E28',
                    padding: '8px 20px',
                    borderRadius: '8px',
                    fontSize: '18px',
                    fontWeight: 900,
                    display: 'flex',
                  }}
                >
                  54 NGUYỄN HỮU HUÂN
                </span>
              </div>

              {/* Title & Dish */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  textAlign: 'center',
                  alignItems: 'center',
                  marginTop: '10px',
                }}
              >
                <span
                  style={{
                    fontSize: '46px',
                    fontWeight: 900,
                    color: '#FFFFFF',
                    lineHeight: 1.2,
                    marginBottom: '8px',
                  }}
                >
                  {headline}
                </span>
                <span style={{ fontSize: '24px', color: '#FBE8DB', fontWeight: 600 }}>
                  {subline}
                </span>
              </div>

              {/* Center Polarized Frame */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    width: '460px',
                    height: '460px',
                    backgroundColor: '#FFFFFF',
                    borderRadius: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '16px',
                  }}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt={dish}
                    style={{
                      width: '420px',
                      height: '420px',
                      objectFit: 'contain',
                    }}
                  />
                </div>
                {/* Price Stamp */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '-20px',
                    right: '160px',
                    backgroundColor: '#1E1B18',
                    color: '#EAAA08',
                    padding: '12px 26px',
                    borderRadius: '16px',
                    fontSize: '34px',
                    fontWeight: 900,
                    border: '2px solid #EAAA08',
                    display: 'flex',
                  }}
                >
                  {price}
                </div>
              </div>

              {/* Bottom Address */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  color: '#FBE8DB',
                  fontSize: '18px',
                  fontWeight: 600,
                  borderTop: '1px solid rgba(251,232,219,0.4)',
                  paddingTop: '16px',
                }}
              >
                <span style={{ display: 'flex' }}>Dạo quanh phố cổ, cầm tay chiếc bánh nóng hổi</span>
                <span style={{ display: 'flex' }}>🌐 eggu.vn</span>
              </div>
            </div>
          </div>
        ),
        { width: 1080, height: 1080 }
      );
    } else {
      // THEME 4: Street Bold (Vàng Rực Rỡ, Năng Động, Bắt Mắt, Cứu Đói Xế Chiều)
      return new ImageResponse(
        (
          <div
            style={{
              width: '1080px',
              height: '1080px',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: '#FFBE1A',
              padding: '60px',
              fontFamily: 'sans-serif',
              position: 'relative',
              justifyContent: 'space-between',
            }}
          >
            {/* Top Bar with Badge */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  backgroundColor: '#1E1B18',
                  color: '#FFBE1A',
                  padding: '12px 28px',
                  borderRadius: '16px',
                  fontSize: '32px',
                  fontWeight: 900,
                  display: 'flex',
                }}
              >
                EGGU
              </div>
              <div
                style={{
                  backgroundColor: '#E11D48',
                  color: '#FFFFFF',
                  padding: '10px 24px',
                  borderRadius: '30px',
                  fontSize: '20px',
                  fontWeight: 900,
                  display: 'flex',
                }}
              >
                🔥 {badge}
              </div>
            </div>

            {/* Giant Bold Headline */}
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span
                style={{
                  fontSize: '54px',
                  fontWeight: 900,
                  color: '#1E1B18',
                  lineHeight: 1.1,
                  marginBottom: '8px',
                }}
              >
                {headline}
              </span>
              <span
                style={{
                  fontSize: '26px',
                  fontWeight: 700,
                  color: '#4A3700',
                  lineHeight: 1.3,
                }}
              >
                {subline}
              </span>
            </div>

            {/* Center Big Real Product */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  width: '540px',
                  height: '540px',
                  borderRadius: '270px',
                  backgroundColor: '#FFFFFF',
                  display: 'flex',
                }}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt={dish}
                style={{
                  width: '500px',
                  height: '500px',
                  objectFit: 'contain',
                }}
              />
              {/* Boom Sticker Price */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '10px',
                  right: '80px',
                  backgroundColor: '#1E1B18',
                  color: '#FFBE1A',
                  padding: '16px 30px',
                  borderRadius: '22px',
                  fontSize: '40px',
                  fontWeight: 900,
                  display: 'flex',
                  alignItems: 'baseline',
                }}
              >
                {price}
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                backgroundColor: '#1E1B18',
                color: '#FFBE1A',
                padding: '18px 32px',
                borderRadius: '18px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '20px',
                fontWeight: 700,
              }}
            >
              <span style={{ display: 'flex' }}>📍 54 Nguyễn Hữu Huân, Hoàn Kiếm</span>
              <span style={{ display: 'flex' }}>🛵 Đặt giao nhanh: eggu.vn</span>
            </div>
          </div>
        ),
        { width: 1080, height: 1080 }
      );
    }
  } catch (error) {
    return new Response(
      `Lỗi tạo poster: ${error instanceof Error ? error.message : 'Unknown error'}`,
      { status: 500 }
    );
  }
}
