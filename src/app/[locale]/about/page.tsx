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
    <div className="site-frame min-h-screen bg-[#fff9f7] px-7 pb-16 pt-20">
      <div className="mx-auto max-w-[900px] space-y-10">
        {/* Header Block */}
        <div className="grid grid-cols-1 items-start gap-8 md:grid-cols-2">
          <span className="text-[#EAAA08] text-xs font-bold uppercase tracking-widest block">
            {isVi ? 'Về Chúng Tôi' : 'Who We Are'}
          </span>
          <h1 className="text-3xl font-bold leading-tight text-[#6b5549] md:text-4xl">
            {t('title')}
          </h1>
          <p className="max-w-xl text-sm leading-relaxed text-[#756b67]">
            {t('subtitle')}
          </p>
        </div>

        {/* Big Editorial Image */}
        <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-[#eadfdb] shadow-sm">
          <Image
            src="/images/hero-sandwich.jpg"
            alt="EGGU Story Bread and Eggs"
            fill
            priority
            className="object-cover"
          />
        </div>

        {/* Philosophy Block */}
        <div className="grid grid-cols-1 items-start gap-10 border-t border-[#eadfdb] pt-6 md:grid-cols-2">
          <div className="space-y-4">
            <h2 className="text-2xl font-black text-[#1E1B18]">{t('philosophy')}</h2>
            <p className="text-sm text-[#706860] leading-relaxed font-medium">
              {t('philosophyDesc')}
            </p>
            <p className="text-sm text-[#706860] leading-relaxed font-medium">
              {isVi
                ? 'Chúng tôi tin rằng ẩm thực không chỉ để làm no bụng, mà còn là cách lan tỏa sự ấm áp. Mỗi chiếc bánh mì nướng bơ tỏi kẹp trứng chảy tại EGGU được gói ghém cẩn thận như một món quà gửi gắm niềm vui và năng lượng tích cực cho ngày mới.'
                : 'We believe that food is not just sustenance, but a connection. Every butter-toasted sandwich with soft scrambled egg at EGGU is carefully packaged as a warm gift, intended to bring simple joy and positive energy to start your day.'}
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-black text-[#1E1B18]">{t('quality')}</h2>
            <p className="text-sm text-[#706860] leading-relaxed font-medium">
              {t('qualityDesc')}
            </p>
            <p className="text-sm text-[#706860] leading-relaxed font-medium">
              {isVi
                ? 'Không thỏa hiệp với nguyên liệu kém chất lượng. Trứng gà sạch, phô mai thật, rau tươi rửa kỹ mỗi sáng và nước sốt được pha chế theo công thức độc quyền là tiêu chuẩn làm nên thương hiệu của chúng tôi.'
                : 'No compromise on ingredient quality. Clean pasteurized eggs, real cheese, freshly washed greens, and house-made signature sauces are the standard metrics that define our gourmet menu.'}
            </p>
          </div>
        </div>

        {/* Final Storytelling Quote */}
        <div className="bg-[#5C4B3E]/5 border-y border-[#E5E0D8] p-10 rounded-2xl text-center space-y-4">
          <span className="text-3xl">🍳</span>
          <blockquote className="text-xl font-bold text-[#5C4B3E] italic">
            {isVi
              ? '"Chế biến tươi ngon, trải nghiệm tuyệt vời. Đó là tất cả những gì chúng tôi hướng tới tại EGGU."'
              : '"Made fresh. Made better. That is the simple promise we deliver in every box at EGGU."'}
          </blockquote>
          <cite className="block text-xs font-bold uppercase tracking-wider text-[#706860]">
            — EGGU Culinary Team
          </cite>
        </div>
      </div>
    </div>
  );
}
