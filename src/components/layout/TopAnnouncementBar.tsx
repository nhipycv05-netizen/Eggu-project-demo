'use client';

import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { CheckCircle2, Phone, Bike } from 'lucide-react';
import { CONTACT_CONFIG } from '@/constants/contact';
import ZaloIcon from '@/components/ui/ZaloIcon';

interface TopAnnouncementBarProps {
  /**
   * Mode for mobile screens:
   * - 'ticker': Auto-rotates between the 2 messages every few seconds (ultra-compact 1 line with marquee if long)
   * - 'multiline': Displays both messages cleanly centered on 2 lines ('ngắt dòng gọn gàng')
   * Default: 'ticker'
   */
  mobileMode?: 'ticker' | 'multiline';
}

export default function TopAnnouncementBar({ mobileMode = 'ticker' }: TopAnnouncementBarProps) {
  const t = useTranslations('announcement');
  const [activeSlide, setActiveSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-rotate ticker on mobile if not paused by touch/hover
  useEffect(() => {
    if (isPaused) return;
    const duration = activeSlide === 0 ? 4800 : 3500;
    const timer = setTimeout(() => {
      setActiveSlide((prev) => (prev === 0 ? 1 : 0));
    }, duration);

    return () => clearTimeout(timer);
  }, [isPaused, activeSlide]);

  return (
    <div
      role="region"
      aria-label="Thông báo đầu trang"
      className="bg-[#e0352b] text-white text-xs md:text-sm font-bold py-1.5 md:py-2 px-4 select-none relative z-50 border-b border-red-700/20"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      onTouchEnd={() => setIsPaused(false)}
    >
      <style>{`
        @keyframes announcementMarquee {
          0%, 25% {
            transform: translateX(0);
          }
          75%, 100% {
            transform: translateX(calc(-100% + 88vw));
          }
        }
        @media (max-width: 639px) {
          .animate-announcement-marquee {
            animation: announcementMarquee 4.4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
          }
        }
      `}</style>

      <div className="max-w-7xl mx-auto">
        {/* DESKTOP & TABLET LAYOUT (>= md: 768px): 2 sides spaced out evenly */}
        <div className="hidden md:flex items-center justify-between gap-3 lg:gap-4">
          {/* Left Announcement: Order Confirmation info */}
          <div className="flex items-center gap-2 tracking-wide font-bold min-w-0">
            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-white/20 text-white shrink-0">
              <CheckCircle2 className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
            </span>
            <span className="whitespace-nowrap font-bold text-xs lg:text-sm">
              {t('orderConfirmation')}
            </span>
          </div>

          {/* Right Announcement: Delivery & Hotline with quick call */}
          <div className="flex items-center gap-2.5 lg:gap-3 shrink-0 text-white font-bold text-xs lg:text-sm">
            <span className="hidden xl:flex items-center gap-1.5 whitespace-nowrap font-bold">
              <Bike className="w-3.5 h-3.5 text-white shrink-0" strokeWidth={2.5} />
              <span>{t('delivery')}</span>
            </span>

            <span className="hidden xl:inline text-white/50 select-none font-normal" aria-hidden="true">
              |
            </span>

            <a
              href="tel:0356779899"
              className="inline-flex items-center gap-1.5 hover:text-amber-200 transition-colors group cursor-pointer focus:outline-none focus:ring-1 focus:ring-white/50 rounded font-bold"
              title="Gọi hotline tư vấn & đặt bánh"
            >
              <Phone className="w-3.5 h-3.5 text-white group-hover:scale-110 transition-transform shrink-0" strokeWidth={2.5} />
              <span className="whitespace-nowrap font-bold">
                {t('hotline')}:{' '}
                <strong className="font-extrabold underline decoration-white/70 underline-offset-2 group-hover:decoration-amber-200 tracking-wider">
                  0356779899
                </strong>
              </span>
            </a>

            <span className="text-white/50 select-none font-normal" aria-hidden="true">
              |
            </span>

            <a
              href={CONTACT_CONFIG.zaloUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 hover:text-amber-200 transition-colors group cursor-pointer focus:outline-none focus:ring-1 focus:ring-white/50 rounded font-bold"
              title="Nhắn tin Zalo tư vấn & đặt bánh"
            >
              <div className="w-4 h-4 rounded-full bg-white flex items-center justify-center shrink-0 p-0.5 group-hover:scale-110 transition-transform">
                <ZaloIcon className="w-3.5 h-3.5 object-contain" />
              </div>
              <span className="whitespace-nowrap font-bold underline decoration-white/70 underline-offset-2 group-hover:decoration-amber-200">
                Zalo
              </span>
            </a>
          </div>
        </div>

        {/* MOBILE LAYOUT (< md: 768px) */}
        {mobileMode === 'ticker' ? (
          /* Option 1: Animated Smooth Ticker (Single line, ultra-compact, auto-rotating with marquee for long text) */
          <div className="md:hidden relative h-5 flex items-center justify-center overflow-hidden font-bold">
            {/* Slide 0: Order Confirmation */}
            <div
              className={`absolute inset-0 flex items-center justify-center text-center text-xs tracking-tight transition-all duration-500 ease-in-out font-bold px-1 ${
                activeSlide === 0
                  ? 'opacity-100 translate-y-0 pointer-events-auto'
                  : 'opacity-0 -translate-y-3 pointer-events-none'
              }`}
            >
              <div className="overflow-hidden w-full max-w-[95vw] flex items-center justify-center">
                <div className="inline-flex items-center gap-1.5 whitespace-nowrap animate-announcement-marquee sm:animate-none">
                  <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-white/20 shrink-0">
                    <CheckCircle2 className="w-2.5 h-2.5 text-white" strokeWidth={2.5} />
                  </span>
                  <span className="font-bold">
                    {t('orderConfirmation')}
                  </span>
                </div>
              </div>
            </div>

            {/* Slide 1: Delivery & Hotline & Zalo */}
            <div
              className={`absolute inset-0 flex items-center justify-center gap-2 text-center text-xs tracking-tight transition-all duration-500 ease-in-out font-bold ${
                activeSlide === 1
                  ? 'opacity-100 translate-y-0 pointer-events-auto'
                  : 'opacity-0 translate-y-3 pointer-events-none'
              }`}
            >
              <span className="flex items-center gap-1 shrink-0 font-bold">
                <Bike className="w-3.5 h-3.5 text-white shrink-0" strokeWidth={2.5} />
                <span className="hidden xs:inline">{t('delivery')}</span>
                <span className="xs:hidden">{t('deliveryShort')}</span>
              </span>

              <span className="text-white/50 font-normal" aria-hidden="true">
                |
              </span>

              <a
                href="tel:0356779899"
                className="inline-flex items-center gap-1 font-bold underline decoration-white/70 underline-offset-2 hover:text-amber-200 shrink-0"
              >
                <Phone className="w-3.5 h-3.5 text-white shrink-0" strokeWidth={2.5} />
                <span className="font-bold">{t('hotline')}: 0356779899</span>
              </a>

              <span className="text-white/50 font-normal" aria-hidden="true">
                |
              </span>

              <a
                href={CONTACT_CONFIG.zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-bold underline decoration-white/70 underline-offset-2 hover:text-amber-200 shrink-0"
                title="Nhắn tin Zalo"
              >
                <div className="w-3.5 h-3.5 rounded-full bg-white flex items-center justify-center shrink-0 p-0.5">
                  <ZaloIcon className="w-3.5 h-3.5 object-contain" />
                </div>
                <span className="font-bold">Zalo</span>
              </a>
            </div>
          </div>
        ) : (
          /* Option 2: Clean 2-Line Centered Layout ('ngắt dòng gọn gàng') */
          <div className="md:hidden flex flex-col items-center justify-center text-center gap-1 py-0.5 text-xs leading-snug font-bold">
            {/* Line 1: Order Confirmation */}
            <div className="flex items-center justify-center gap-1.5 font-bold text-white px-2">
              <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-white/20 shrink-0">
                <CheckCircle2 className="w-2.5 h-2.5 text-white" strokeWidth={2.5} />
              </span>
              <span className="font-bold text-[11px] xs:text-xs text-center leading-tight">
                {t('orderConfirmation')}
              </span>
            </div>

            {/* Line 2: Delivery & Hotline & Zalo */}
            <div className="flex items-center justify-center gap-2 text-white font-bold text-[11px] sm:text-xs">
              <span className="flex items-center gap-1 shrink-0 font-bold">
                <Bike className="w-3.5 h-3.5 text-white shrink-0" strokeWidth={2.5} />
                <span className="hidden xs:inline">{t('delivery')}</span>
                <span className="xs:hidden">{t('deliveryShort')}</span>
              </span>

              <span className="text-white/50 font-normal" aria-hidden="true">
                |
              </span>

              <a
                href="tel:0356779899"
                className="inline-flex items-center gap-1 font-bold underline decoration-white/70 underline-offset-2 hover:text-amber-200 shrink-0"
              >
                <Phone className="w-3.5 h-3.5 text-white shrink-0" strokeWidth={2.5} />
                <span className="font-bold">{t('hotline')}: 0356779899</span>
              </a>

              <span className="text-white/50 font-normal" aria-hidden="true">
                |
              </span>

              <a
                href={CONTACT_CONFIG.zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-bold underline decoration-white/70 underline-offset-2 hover:text-amber-200 shrink-0"
                title="Nhắn tin Zalo"
              >
                <div className="w-3.5 h-3.5 rounded-full bg-white flex items-center justify-center shrink-0 p-0.5">
                  <ZaloIcon className="w-3.5 h-3.5 object-contain" />
                </div>
                <span className="font-bold">Zalo</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
