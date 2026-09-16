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

  return (
    <div className="min-h-screen bg-white pt-24 md:pt-28 pb-16 md:pb-24 text-[#1E1B18] overflow-hidden relative">
      
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
            TIÊU ĐỀ CHÍNH (CĂN TRÁI TỐI GIẢN KHUNG MAX-W-7XL)
            ======================================================== */}
        <div className="border-b border-[#e0352b]/20 pb-3 mb-8 md:mb-10 text-left">
          <h1 className="text-xl font-bold uppercase tracking-wider text-[#e0352b]">
            {content.mainTitle || (isVi ? 'VỀ CHÚNG TÔI' : 'ABOUT US')}
          </h1>
        </div>

        {/* ========================================================
            KHỐI 1: ẢNH KHỞI NGUỒN & HỘP TỐI ĐÈ LÊN ẢNH
            ======================================================== */}
        <div className="relative pt-2 pb-4">
          <div className="flex flex-col md:flex-row items-center justify-end relative">
            
            {/* Founder / Origin Photo on the Right */}
            <div className="w-full md:w-[70%] lg:w-[65%] relative aspect-[16/11] sm:aspect-[16/10] rounded-3xl overflow-hidden shadow-md bg-[#F5F2EC]">
              <Image
                src={content.section1Image || '/images/about-founder.png'}
                alt="Eggu Founder"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 850px"
                className="object-cover object-center"
              />
            </div>

            {/* Overlapping Dark Gray Card on the Left */}
            <div className="w-full md:w-[45%] lg:w-[42%] mt-4 md:mt-0 md:absolute md:left-0 md:bottom-8 bg-[#5C5450] text-white rounded-2xl p-6 sm:p-7 shadow-xl border border-white/10 z-20">
              <p className="text-sm sm:text-base font-semibold leading-relaxed text-[#F5F5F5]">
                {content.section1Text ||
                  'Eggu ra đời từ một mong muốn đơn giản nhưng đầy tâm huyết: mang đến những bữa ăn nhanh, tiện lợi nhưng vẫn trọn vẹn dinh dưỡng và đậm đà hương vị cho tất cả mọi người.'}
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================
            KHỐI 2: KHUNG BO GÓC TRẢI RỘNG XÁM NHẠT / BEIGE
            ======================================================== */}
        <div className="w-full">
          <div className="w-full bg-[#E7D8CA] rounded-2xl md:rounded-3xl p-6 sm:p-8 md:p-12 border border-[#D4C3B3] shadow-xs">
            <p className="text-sm sm:text-base md:text-lg leading-relaxed md:leading-loose text-[#2B2520] italic font-medium text-justify">
              {content.section2Text ||
                'Từ niềm tin rằng bữa ăn sáng hay một món ăn nhẹ giữa ngày không chỉ để lót bụng, mà còn là khoảnh khắc tiếp thêm năng lượng tích cực, Eggu chiêu đãi thực khách các món sandwich nướng kèm phô mai thơm lừng ôm trọn lớp trứng xốp mềm ngập tràn hương vị, thêm vào đó là sự hấp dẫn của rất nhiều loại topping đa dạng như thịt xông khói, dăm bông, cá ngừ,... Đây chính là lời chào ngọt ngào nhất Eggu gửi tới bạn.'}
            </p>
          </div>
        </div>

        {/* ========================================================
            KHỐI 3: 2 CỘT SONG SONG (TRÁI: VĂN BẢN | PHẢI: ẢNH HÀNG BÁNH)
            ======================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 lg:gap-16 items-center pt-2">
          {/* Cột Trái: Nội dung cam kết chất lượng */}
          <div className="md:col-span-6 space-y-4">
            {content.section3Title && (
              <h3 className="text-lg sm:text-xl font-black text-[#1E1B18]">
                {content.section3Title}
              </h3>
            )}
            <p className="text-sm sm:text-base leading-relaxed text-[#2B2520] font-medium text-justify">
              {content.section3Text ||
                'Với nguồn nguyên liệu tươi mới từ 100% trứng gà sạch đạt chuẩn, rau củ tươi trong ngày và các loại thịt, phô mai cao cấp, cùng với đó là công thức đặc biệt tạo nên nước sốt độc quyền giúp hương vị thêm phần trọn vẹn. Eggu sẽ mang đến cho bạn trải nghiệm ẩm thực không chỉ mãn nhãn mà còn tràn đầy hương vị!'}
            </p>
          </div>

          {/* Cột Phải: Ảnh khay bánh sandwich EGGU */}
          <div className="md:col-span-6">
            <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden shadow-md bg-[#FAF8F5]">
              <Image
                src={content.section3Image || '/images/about-sandwiches.png'}
                alt="Eggu Fresh Sandwiches"
                fill
                sizes="(max-width: 1024px) 100vw, 650px"
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
