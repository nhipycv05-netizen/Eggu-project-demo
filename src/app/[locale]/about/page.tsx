import { getTranslations } from 'next-intl/server';
import Image from 'next/image';

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  const t = await getTranslations('about');
  const isVi = locale === 'vi';

  return (
    <div className="min-h-screen bg-[#F8F9FA] pt-24 md:pt-28 pb-12 md:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 md:space-y-16">
        {/* Header Block */}
        <div className="max-w-3xl space-y-2">
          <span className="text-[#E53935] text-xs font-black uppercase tracking-widest block">
            {isVi ? 'Về Chúng Tôi' : 'Who We Are'}
          </span>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight text-[#111111] tracking-tight">
            {t('title')}
          </h1>
        </div>

        {/* Big Editorial Image */}
        <div className="relative aspect-video w-full overflow-hidden rounded-3xl border border-[#E5E7EB] shadow-sm">
          <Image
            src="/images/hero-sandwich.jpg"
            alt="EGGU Story Bread and Eggs"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 1200px"
            className="object-cover"
          />
        </div>

        {/* Philosophy Block */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 border-t border-[#E5E7EB] pt-8 md:pt-12">
          <div className="space-y-4 bg-white p-6 sm:p-8 rounded-3xl border border-[#E5E7EB] shadow-xs">
            <h2 className="text-xl sm:text-2xl font-black text-[#111111]">{t('philosophy')}</h2>
            <p className="text-sm text-[#6B7280] leading-relaxed font-medium">
              {t('philosophyDesc')}
            </p>
            <p className="text-sm text-[#6B7280] leading-relaxed font-medium">
              {isVi
                ? 'Chúng tôi tin rằng ẩm thực không chỉ để làm no bụng, mà còn là cách lan tỏa sự ấm áp. Mỗi chiếc bánh mì nướng bơ tỏi kẹp trứng chảy tại EGGU được gói ghém cẩn thận như một món quà gửi gắm niềm vui và năng lượng tích cực cho ngày mới.'
                : 'We believe that food is not just sustenance, but a connection. Every butter-toasted sandwich with soft scrambled egg at EGGU is carefully packaged as a warm gift, intended to bring simple joy and positive energy to start your day.'}
            </p>
          </div>

          <div className="space-y-4 bg-white p-6 sm:p-8 rounded-3xl border border-[#E5E7EB] shadow-xs">
            <h2 className="text-xl sm:text-2xl font-black text-[#111111]">{t('quality')}</h2>
            <p className="text-sm text-[#6B7280] leading-relaxed font-medium">
              {t('qualityDesc')}
            </p>
            <p className="text-sm text-[#6B7280] leading-relaxed font-medium">
              {isVi
                ? 'Không thỏa hiệp với nguyên liệu kém chất lượng. Trứng gà sạch, phô mai thật, rau tươi rửa kỹ mỗi sáng và nước sốt được pha chế theo công thức độc quyền là tiêu chuẩn làm nên thương hiệu của chúng tôi.'
                : 'No compromise on ingredient quality. Clean pasteurized eggs, real cheese, freshly washed greens, and house-made signature sauces are the standard metrics that define our gourmet menu.'}
            </p>
          </div>
        </div>

        {/* Final Storytelling Quote */}
        <div className="bg-[#111111] text-white p-8 md:p-12 rounded-3xl text-center space-y-4 shadow-md">
          <span className="text-4xl block">🍳</span>
          <blockquote className="text-lg sm:text-xl md:text-2xl font-bold italic max-w-2xl mx-auto text-[#F8F9FA]">
            {isVi
              ? '"Chế biến tươi ngon, trải nghiệm tuyệt vời. Đó là tất cả những gì chúng tôi hướng tới tại EGGU."'
              : '"Made fresh. Made better. That is the simple promise we deliver in every box at EGGU."'}
          </blockquote>
          <cite className="block text-xs font-black uppercase tracking-widest text-[#FFC107]">
            — EGGU Culinary Team
          </cite>
        </div>
      </div>
    </div>
  );
}
