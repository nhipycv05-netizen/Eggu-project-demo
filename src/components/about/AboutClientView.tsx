'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { AboutContent, DEFAULT_ABOUT_CONTENT } from '@/types/about';

interface AboutClientViewProps {
  initialContent: AboutContent;
  locale: string;
}

const LOCAL_STORAGE_KEY = 'eggu_about_content';

export default function AboutClientView({ initialContent, locale }: AboutClientViewProps) {
  const [content, setContent] = useState<AboutContent>(initialContent);
  const isVi = locale === 'vi';

  // Load updated content from localStorage on client or via custom event
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const localSaved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (localSaved) {
        try {
          const parsed = JSON.parse(localSaved);
          setContent((prev) => ({ ...prev, ...parsed }));
        } catch {
          // ignore
        }
      }

      const handleUpdate = (e: Event) => {
        const customEvent = e as CustomEvent<AboutContent>;
        if (customEvent.detail) {
          setContent(customEvent.detail);
        }
      };

      window.addEventListener('eggu_about_updated', handleUpdate);
      return () => window.removeEventListener('eggu_about_updated', handleUpdate);
    }
  }, []);

  const defaultSection4Items = isVi
    ? [
        {
          title: 'Tận tâm',
          description:
            'Phục vụ bánh mỳ không có nghĩa là phục vụ đại trà, mà thay vào đó từng ổ bánh mỳ sandwich trứng được cá nhân hóa theo sở thích từng cá nhân',
        },
        {
          title: 'Trung thực',
          description:
            'Mỗi chiếc bánh mỳ sandwich trứng tại Eggu được làm ra với sự trân trọng khách hàng, trân trọng không chỉ thể hiện ở hình thức thành phẩm bắt mắt, chỉn chu mà còn xuất phát từ nguồn nguyên liệu tươi sạch, chất lượng.',
        },
        {
          title: 'Sáng tạo',
          description:
            'Sáng tạo để tạo nên sự khác biệt có chủ đích, mỗi ý tưởng mới đều hướng đến một chiếc sandwich ngon hơn, tiện hơn và hợp gu hơn.',
        },
      ]
    : [
        {
          title: 'Dedication',
          description:
            'Serving sandwiches does not mean mass service; instead, each egg sandwich is personalized to individual tastes.',
        },
        {
          title: 'Honesty',
          description:
            'Each egg sandwich at Eggu is made with utmost respect for our customers, reflected not only in eye-catching, meticulous presentation but also originating from fresh, clean, high-quality ingredients.',
        },
        {
          title: 'Creativity',
          description:
            'Innovating with purposeful distinction, where every new idea strives toward a tastier, more convenient, and more flavorful sandwich.',
        },
      ];

  const section4Items =
    content.section4Items && content.section4Items.length === 3
      ? content.section4Items
      : defaultSection4Items;

  return (
    <div className="min-h-screen bg-transparent pt-24 md:pt-28 pb-16 md:pb-24 text-[#1E1B18] overflow-hidden relative">
      
      {/* Abstract Background Wave Graphics */}
      <div className="absolute inset-0 pointer-events-none opacity-40 overflow-hidden z-0">
        <svg
          className="absolute top-1/3 -left-20 w-[120%] h-[600px] text-gray-300 stroke-current"
          viewBox="0 0 1200 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M -100 200 C 300 450, 700 -50, 1300 300"
            strokeWidth="1.2"
            strokeDasharray="4 2"
          />
          <path
            d="M -100 230 C 320 480, 680 -20, 1300 330"
            strokeWidth="0.8"
          />
          <path
            d="M -100 260 C 340 510, 660 10, 1300 360"
            strokeWidth="0.8"
          />
          <path
            d="M -100 290 C 360 540, 640 40, 1300 390"
            strokeWidth="1"
          />
          <path
            d="M -100 320 C 380 570, 620 70, 1300 420"
            strokeWidth="0.8"
          />
          <path
            d="M -100 350 C 400 600, 600 100, 1300 450"
            strokeWidth="1.2"
            strokeDasharray="6 3"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 md:space-y-16 relative z-10 w-full">
        
        {/* ========================================================
            TIÊU ĐỀ CHÍNH (CĂN TRÁI TỐI GIẢN KHUNG MAX-W-7XL) & DÒNG THƯƠNG HIỆU
            ======================================================== */}
        <div>
          <div className="border-b border-[#e0352b]/20 pb-3 text-left">
            <h1 className="text-xl font-bold uppercase tracking-wider text-[#e0352b]">
              {content.mainTitle || (isVi ? 'VỀ CHÚNG TÔI' : 'ABOUT US')}
            </h1>
          </div>
          <h2 className="text-center mx-auto font-bold italic text-2xl md:text-3xl text-[#e0352b] my-6">
            {isVi
              ? (content.subTitle && content.subTitle !== 'Eggu · Sandwich trứng Hàn Quốc' ? content.subTitle : 'Eggu - Sandwich trứng Hàn Quốc')
              : (content.subTitle && content.subTitle !== 'Eggu · Sandwich trứng Hàn Quốc' ? content.subTitle : 'Eggu - Korean Egg Sandwich')}
          </h2>
        </div>

        {/* ========================================================
            KHỐI 1: ẢNH KHỞI NGUỒN & HỘP CHỮ NỀN TỐI ĐẶT CẠNH CÂN XỨNG
            ======================================================== */}
        <div className="relative pt-2 pb-4">
          {/* Tiêu đề mục 1: Triết lý kinh doanh */}
          <h3 className="text-left mt-4 mb-4 text-lg md:text-xl font-semibold text-gray-800">
            <span className="font-bold uppercase text-[#e0352b]">
              {isVi ? '1. TRIẾT LÝ KINH DOANH' : '1. BUSINESS PHILOSOPHY'}
            </span>
            {' - '}
            <span>
              {isVi ? 'Đơn giản không có nghĩa là tầm thường' : 'Simple does not mean ordinary'}
            </span>
          </h3>

          <div className="flex flex-col md:flex-row items-center relative w-full pt-2 pb-4">
            {/* Khối chữ màu đen dạt sang phía lề trái, chỉ đè lấn sang mép trái ảnh khoảng 1/4 bề rộng thẻ */}
            <div className="w-full md:w-[58%] lg:w-[55%] z-10 md:-mr-14 lg:md:-mr-16 order-2 md:order-1 mt-4 md:mt-0">
              <div className="bg-[#e0352b]/85 backdrop-blur-md text-white rounded-2xl md:rounded-3xl p-5 sm:p-6 md:p-7 shadow-xl border border-white/20">
                <p className="text-xs sm:text-sm md:text-base font-medium leading-relaxed text-white">
                  {content.section1Text ||
                    'Eggu ra đời từ một mong muốn đơn giản nhưng đầy tâm huyết: mang đến những bữa ăn nhanh, tiện lợi nhưng vẫn trọn vẹn dinh dưỡng và đậm đà hương vị cho tất cả mọi người.'}
                </p>
              </div>
            </div>

            {/* Khung ảnh lệch hẳn sang nửa bên phải màn hình: bắt đầu từ giữa trang và kéo dài sát lề phải */}
            <div className="w-full md:w-1/2 ml-auto h-72 md:h-80 relative rounded-2xl md:rounded-3xl overflow-hidden shadow-md bg-[#F5F2EC] order-1 md:order-2">
              <Image
                src={
                  content.section1Image && content.section1Image !== '/images/about-founder.png'
                    ? content.section1Image
                    : '/images/about-founder.jpg'
                }
                alt={isVi ? 'Nhà sáng lập Eggu - Thương hiệu Sandwich Trứng Chuẩn Vị Hàn Quốc' : 'Eggu Founder - Authentic Korean Egg Sandwich'}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-[center_60%]"
                style={{ objectPosition: 'center 60%' }}
              />
            </div>
          </div>
        </div>

        {/* ========================================================
            KHỐI 2: KHUNG BO GÓC TRẢI RỘNG XÁM NHẠT / BEIGE
            ======================================================== */}
        <div className="w-full">
          {/* Tiêu đề mục 2: Sứ mệnh */}
          <h3 className="text-left mt-10 md:mt-12 mb-4 text-lg md:text-xl font-semibold text-gray-900">
            <span className="text-[#e0352b] font-bold uppercase mr-2">
              {isVi ? '2. SỨ MỆNH' : '2. MISSION'}
            </span>
            <span>
              {isVi ? '- Làm mới món quen, phục vụ gu riêng' : '- Refreshing the familiar, catering to your taste'}
            </span>
          </h3>

          {/* Khối trích dẫn sứ mệnh (Blockquote thanh lịch, trải dài ngang 1-2 dòng) */}
          <div className="w-full bg-[#FAF8F5]/80 rounded-2xl md:rounded-3xl p-6 sm:p-8 md:py-8 md:px-12 border border-[#EAE4DC]/90 shadow-xs">
            <div className="max-w-5xl lg:max-w-6xl mx-auto relative px-8 sm:px-12 md:px-16 py-1">
              {/* Dấu ngoặc kép mở đầu trên bên trái */}
              <span className="text-3xl sm:text-4xl md:text-5xl font-serif text-black font-bold select-none absolute -top-3 left-0 sm:left-1 md:left-2 leading-none">
                “
              </span>

              {/* Đoạn văn trích dẫn */}
              <blockquote className="italic text-gray-800 text-sm md:text-base lg:text-[17px] leading-relaxed md:leading-loose text-center font-medium px-2 sm:px-4">
                {content.section2Text && !content.section2Text.includes('Từ niềm tin rằng')
                  ? content.section2Text
                  : (isVi
                      ? 'Chúng tôi tạo ra những ổ bánh mỳ độc đáo, sáng tạo, tiện lợi và mang cá tính riêng - phục vụ đúng khẩu vị, đúng lúc, đúng cách mà mỗi thực khách muốn trong nhịp sống hiện đại.'
                      : 'We create unique, creative, convenient, and distinctive sandwiches - served just to your taste, just in time, and just the way every diner desires in modern life.')}
              </blockquote>

              {/* Dấu ngoặc kép đóng cuối dưới bên phải */}
              <span className="text-3xl sm:text-4xl md:text-5xl font-serif text-black font-bold select-none absolute -bottom-4 right-0 sm:right-1 md:right-2 leading-none">
                ”
              </span>
            </div>
          </div>
        </div>

        {/* ========================================================
            KHỐI 3: TIÊU ĐỀ MỤC 3 & 2 CỘT SONG SONG (TRÁI: VĂN BẢN | PHẢI: ẢNH HÀNG BÁNH)
            ======================================================== */}
        <div className="w-full">
          {/* Tiêu đề mục 3: Tầm nhìn */}
          <h3 className="text-left mt-10 md:mt-12 mb-4 text-lg md:text-xl font-semibold text-gray-900">
            <span className="text-[#e0352b] font-bold uppercase mr-2">
              {isVi ? '3. TẦM NHÌN' : '3. VISION'}
            </span>
            <span>
              {isVi
                ? '- Trở thành thương hiệu bánh mỳ trứng số 1 trong lòng thế hệ trẻ Việt Nam'
                : '- Becoming the #1 egg sandwich brand in the hearts of Vietnam’s young generation'}
            </span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 lg:gap-14 items-center pt-2">
            {/* Cột Trái: Khung ảnh tỷ lệ dọc thanh thoát */}
            <div className="md:col-span-6 lg:md:col-span-5 flex justify-center md:justify-start">
              <div className="relative w-full max-w-sm md:max-w-md aspect-[4/5] sm:aspect-[3/4] md:h-[400px] lg:h-[440px] rounded-2xl md:rounded-3xl overflow-hidden shadow-lg bg-[#FAF8F5] border border-black/5">
                <Image
                  src={
                    content.section3Image && content.section3Image !== '/images/about-sandwiches.png'
                      ? content.section3Image
                      : '/images/about-vision.jpg'
                  }
                  alt={isVi ? 'Tầm nhìn thương hiệu Eggu - Bánh Mì Sandwich Trứng Hàn Quốc' : 'Eggu Brand Vision - Korean Egg Sandwich'}
                  fill
                  priority
                  sizes="(max-width: 1024px) 100vw, 500px"
                  className="object-cover object-center"
                />
              </div>
            </div>

            {/* Cột Phải: Khối chữ căn chỉnh chiều cao ngang hàng với ảnh */}
            <div className="md:col-span-6 lg:md:col-span-7 flex flex-col justify-center space-y-4 sm:space-y-5 text-left">
              {content.section3Title && (
                <h4 className="text-lg sm:text-xl font-bold text-[#1E1B18]">
                  {content.section3Title}
                </h4>
              )}

              {/* Đoạn văn bản chính */}
              <p className="text-base sm:text-lg leading-relaxed md:leading-loose text-[#2B2520] font-normal text-justify">
                {content.section3Text && !content.section3Text.includes('Với nguồn nguyên liệu')
                  ? content.section3Text
                  : (isVi
                      ? 'Với tâm huyết và lòng hiếu khách, trong tương lai chúng tôi tham vọng trở thành thương hiệu bánh mỳ sandwich trứng số 1 trong lòng thế hệ trẻ Việt Nam và đồng thời dẫn đầu về trải nghiệm cá nhân hóa, tiện lợi và giúp mỗi khách hàng thể hiện gu trong ăn uống.'
                      : 'With dedication and hospitality, in the future we aspire to become the #1 egg sandwich brand in the hearts of Vietnam’s young generation, while leading the way in personalized, convenient experiences that allow every customer to express their personal taste.')}
              </p>

              {/* Dòng kết thúc */}
              <div className="pt-2 border-l-4 border-[#e0352b] pl-4">
                <p className="text-base sm:text-lg font-bold italic text-gray-900 leading-relaxed">
                  {content.section3ClosingText ||
                    (isVi
                      ? 'Eggu - nơi mỗi người đều có thể tìm thấy ổ bánh mỳ “đúng với mình”.'
                      : 'Eggu - where everyone can find a sandwich that is truly “right for them”.')}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================
            KHỐI 4: TIÊU ĐỀ MỤC 4 & 3 THẺ GIÁ TRỊ CỐT LÕI (MINIMALIST CARDS)
            ======================================================== */}
        <div className="w-full">
          {/* Tiêu đề mục 4: Giá trị cốt lõi */}
          <h3 className="text-left mt-10 md:mt-12 mb-4 text-lg md:text-xl font-semibold text-gray-900">
            <span className="text-[#e0352b] font-bold uppercase">
              {isVi ? '4. GIÁ TRỊ CỐT LÕI' : '4. CORE VALUES'}
            </span>
          </h3>

          {/* Bố cục 3 thẻ giá trị (3 Columns Grid) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
            {section4Items.map((item, idx) => {
              const cleanTitle = item.title.replace(/^\d+\.\s*/, '');

              return (
                <div
                  key={idx}
                  className="bg-[#FAF8F5]/80 rounded-[28px] border border-[#EAE4DC]/90 p-8 flex flex-col items-center shadow-xs hover:shadow-md transition-all duration-300 h-full group"
                >
                  {/* Tiêu đề căn giữa thẻ */}
                  <h4 className="text-xl font-bold text-gray-900 mb-4 tracking-tight text-center w-full">
                    {cleanTitle}
                  </h4>

                  {/* Đoạn mô tả */}
                  <p className="text-sm text-gray-600 leading-relaxed font-normal text-left">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
