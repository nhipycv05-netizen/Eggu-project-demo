'use client';

import { useState } from 'react';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { Ticket, Copy, Check, ArrowRight, Sparkles, Tag, Clock } from 'lucide-react';
import { Promotion } from '@/types/promotion';

interface ActivePromotionsBlockProps {
  promotions: Promotion[];
  title?: string;
  subtitle?: string;
  className?: string;
}

export default function ActivePromotionsBlock({
  promotions,
  title,
  subtitle,
  className = '',
}: ActivePromotionsBlockProps) {
  const t = useTranslations('news');
  const tp = useTranslations('promotions');
  const locale = useLocale();
  const isVi = locale === 'vi';
  const router = useRouter();

  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (!promotions || promotions.length === 0) {
    return null;
  }

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedCode(code);
      setTimeout(() => {
        setCopiedCode((prev) => (prev === code ? null : prev));
      }, 2500);
    } catch (err) {
      console.error('Failed to copy promo code:', err);
    }
  };

  const handleUseNow = (code: string) => {
    handleCopyCode(code);
    router.push('/menu');
  };

  return (
    <section
      className={`rounded-3xl bg-gradient-to-br from-[#FFFBEB] via-[#FEF3C7]/40 to-[#FFF7ED] border-2 border-[#EAAA08]/40 p-6 md:p-8 shadow-sm relative overflow-hidden ${className}`}
    >
      {/* Decorative background circle */}
      <div className="absolute -top-12 -right-12 w-40 h-40 bg-[#EAAA08]/15 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-[#E53935]/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-5 border-b border-[#EAAA08]/30">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[#E53935] font-black text-xs uppercase tracking-widest">
            <Sparkles className="w-4 h-4 text-[#EAAA08]" />
            <span>{isVi ? 'Ưu Đãi Độc Quyền EGGU' : 'EGGU Exclusive Offers'}</span>
          </div>
          <h3 className="text-xl md:text-2xl font-black text-[#1E1B18] flex items-center gap-2.5">
            <Ticket className="w-6 h-6 text-[#EAAA08]" />
            <span>{title || t('applicablePromotions')}</span>
          </h3>
          <p className="text-xs md:text-sm text-[#706860] font-medium">
            {subtitle || t('applicablePromotionsSub')}
          </p>
        </div>

        <button
          onClick={() => router.push('/menu')}
          className="self-start sm:self-center inline-flex items-center gap-1.5 px-4 py-2 bg-[#E53935] hover:bg-[#D32F2F] text-white text-xs font-black uppercase tracking-wider rounded-xl shadow-xs hover:shadow-md transition-all duration-200 active:scale-95"
        >
          <span>{isVi ? 'Khám Phá Menu' : 'Explore Menu'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Promotions Cards Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {promotions.map((promo) => {
          const isCopied = copiedCode === promo.code;
          const discountLabel =
            promo.discount_type === 'PERCENTAGE'
              ? `-${promo.discount_value}%`
              : `-${Number(promo.discount_value).toLocaleString('vi-VN')}đ`;

          const description = isVi
            ? promo.description_vi || promo.title_vi
            : promo.description_en || promo.title_en || promo.description_vi;

          const promoTitle = isVi
            ? promo.title_vi || (promo.discount_type === 'PERCENTAGE' ? `Giảm ${promo.discount_value}%` : `Giảm ${Number(promo.discount_value).toLocaleString('vi-VN')}đ`)
            : promo.title_en || (promo.discount_type === 'PERCENTAGE' ? `${promo.discount_value}% Off` : `Save ${Number(promo.discount_value).toLocaleString('vi-VN')} VND`);

          const minOrderFormatted = promo.min_order_value
            ? `${isVi ? 'Đơn từ' : 'Min order'} ${Number(promo.min_order_value).toLocaleString('vi-VN')}đ`
            : isVi ? 'Mọi đơn hàng' : 'All orders';

          const validUntilDate = promo.end_at
            ? new Date(promo.end_at).toLocaleDateString(isVi ? 'vi-VN' : 'en-US', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
              })
            : null;

          return (
            <div
              key={promo.id}
              className="bg-white/95 backdrop-blur-xs rounded-2xl p-4 border border-[#EAAA08]/30 hover:border-[#EAAA08] shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
            >
              {/* Card Top: Badge & Discount */}
              <div className="space-y-2.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#FFFBEB] border border-[#EAAA08]/40 rounded-lg text-[#B45309] font-black text-xs">
                    <Tag className="w-3.5 h-3.5 text-[#EAAA08]" />
                    <span>{discountLabel}</span>
                  </div>
                  {validUntilDate && (
                    <div className="flex items-center gap-1 text-[10px] text-[#9CA3AF] font-bold">
                      <Clock className="w-3 h-3 text-[#9CA3AF]" />
                      <span>{validUntilDate}</span>
                    </div>
                  )}
                </div>

                {/* Promo Name & Description */}
                <div>
                  <h4 className="text-sm font-black text-[#111111] group-hover:text-[#E53935] transition-colors line-clamp-1">
                    {promoTitle}
                  </h4>
                  <p className="text-xs text-[#6B7280] font-medium leading-snug line-clamp-2 mt-0.5">
                    {description}
                  </p>
                </div>

                {/* Min order tag */}
                <div className="text-[11px] font-bold text-[#706860] bg-[#F8F9FA] px-2.5 py-1 rounded-md inline-block">
                  {minOrderFormatted}
                </div>
              </div>

              {/* Card Bottom: Code & Actions */}
              <div className="mt-4 pt-3 border-t border-neutral-100 space-y-2">
                <div className="flex items-center justify-between bg-[#F8F9FA] border border-dashed border-[#EAAA08] rounded-xl px-3 py-1.5">
                  <span className="font-mono font-black text-sm text-[#1E1B18] tracking-wider uppercase">
                    {promo.code}
                  </span>
                  <button
                    onClick={() => handleCopyCode(promo.code)}
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-black transition-all ${
                      isCopied
                        ? 'bg-green-600 text-white'
                        : 'bg-[#EAAA08] hover:bg-[#D97706] text-[#1E1B18]'
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                        <span>{t('copied')}</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>{t('copyCode')}</span>
                      </>
                    )}
                  </button>
                </div>

                <button
                  onClick={() => handleUseNow(promo.code)}
                  className="w-full py-2 bg-[#1E1B18] hover:bg-[#E53935] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors duration-200 flex items-center justify-center gap-1.5"
                >
                  <span>{t('useNow')}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
