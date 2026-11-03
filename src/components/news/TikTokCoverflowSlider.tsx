'use client';

import React, { useState, useEffect, useCallback } from 'react';
import SafeImage from '@/components/ui/SafeImage';
import { Link } from '@/i18n/navigation';
import { ChevronLeft, ChevronRight, Play, ArrowRight, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

export interface NewsSlideItem {
  id: string;
  title_vi: string;
  title_en?: string;
  slug: string;
  summary_vi?: string | null;
  summary_en?: string | null;
  content_vi?: string | null;
  content_en?: string | null;
  thumbnail_url?: string | null;
  published_at?: string | null;
}

interface TikTokCoverflowSliderProps {
  articles: NewsSlideItem[];
  locale?: string;
}

export default function TikTokCoverflowSlider({
  articles,
  locale = 'vi',
}: TikTokCoverflowSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const isVi = locale === 'vi';
  const total = articles.length;

  // Touch swipe support for mobile
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : total - 1));
  }, [total]);

  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev < total - 1 ? prev + 1 : 0));
  }, [total]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlePrev, handleNext]);

  // Touch event listeners
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 40;
    if (distance > minSwipeDistance) handleNext();
    if (distance < -minSwipeDistance) handlePrev();
  };

  if (total === 0) return null;

  return (
    <div className="relative w-full overflow-hidden py-4 select-none">
      {/* 3D Stage Container */}
      <div
        className="relative w-full max-w-6xl mx-auto h-[550px] sm:h-[620px] md:h-[650px] flex items-center justify-center perspective-[1200px]"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Navigation Arrow: Prev */}
        <button
          onClick={handlePrev}
          aria-label="Previous Slide"
          className="absolute left-2 sm:left-6 md:left-10 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-13 sm:h-13 rounded-full bg-white/95 text-neutral-800 hover:text-[#e0352b] hover:bg-white shadow-xl border border-neutral-200/90 flex items-center justify-center transition-all duration-200 active:scale-90 hover:scale-105 cursor-pointer backdrop-blur-md"
        >
          <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
        </button>

        {/* Navigation Arrow: Next */}
        <button
          onClick={handleNext}
          aria-label="Next Slide"
          className="absolute right-2 sm:right-6 md:right-10 top-1/2 -translate-y-1/2 z-40 w-10 h-10 sm:w-13 sm:h-13 rounded-full bg-white/95 text-neutral-800 hover:text-[#e0352b] hover:bg-white shadow-xl border border-neutral-200/90 flex items-center justify-center transition-all duration-200 active:scale-90 hover:scale-105 cursor-pointer backdrop-blur-md"
        >
          <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.5]" />
        </button>

        {/* Cards Stack */}
        <div className="relative w-full h-full flex items-center justify-center">
          {articles.map((article, index) => {
            let offset = index - activeIndex;

            // Handle circular loop
            if (offset > total / 2) offset -= total;
            if (offset < -total / 2) offset += total;

            const isCenter = offset === 0;
            const isLeft = offset === -1;
            const isRight = offset === 1;
            const isFarLeft = offset === -2;
            const isFarRight = offset === 2;
            const isVisible = Math.abs(offset) <= 2;

            if (!isVisible) return null;

            const title =
              (isVi ? article.title_vi : article.title_en) ||
              article.title_vi ||
              'EGGU Sandwich';

            // Coverflow positioning variables
            let xOffset = 0;
            let scale = 1;
            let opacity = 1;
            let zIndex = 30;
            let rotateY = 0;
            let filter = 'blur(0px)';

            const sideOffset = isMobile ? 180 : 280;
            const farSideOffset = isMobile ? 320 : 480;

            if (isCenter) {
              xOffset = 0;
              scale = 1;
              opacity = 1;
              zIndex = 30;
              rotateY = 0;
              filter = 'blur(0px)';
            } else if (isLeft) {
              xOffset = -sideOffset;
              scale = isMobile ? 0.78 : 0.83;
              opacity = isMobile ? 0.45 : 0.6;
              zIndex = 20;
              rotateY = isMobile ? 8 : 15;
              filter = 'blur(0.5px)';
            } else if (isRight) {
              xOffset = sideOffset;
              scale = isMobile ? 0.78 : 0.83;
              opacity = isMobile ? 0.45 : 0.6;
              zIndex = 20;
              rotateY = isMobile ? -8 : -15;
              filter = 'blur(0.5px)';
            } else if (isFarLeft) {
              xOffset = -farSideOffset;
              scale = isMobile ? 0.65 : 0.7;
              opacity = 0.2;
              zIndex = 10;
              rotateY = isMobile ? 12 : 22;
              filter = 'blur(1px)';
            } else if (isFarRight) {
              xOffset = farSideOffset;
              scale = isMobile ? 0.65 : 0.7;
              opacity = 0.2;
              zIndex = 10;
              rotateY = isMobile ? -12 : -22;
              filter = 'blur(1px)';
            }

            return (
              <motion.div
                key={article.id}
                className="absolute top-1/2 -translate-y-1/2 cursor-pointer transition-shadow"
                style={{ zIndex }}
                animate={{
                  x: xOffset,
                  scale,
                  opacity,
                  rotateY,
                  filter,
                }}
                transition={{
                  type: 'spring',
                  stiffness: 280,
                  damping: 28,
                }}
                onClick={() => {
                  if (!isCenter) setActiveIndex(index);
                }}
              >
                {/* Individual TikTok Card */}
                <div
                  className={`w-[260px] sm:w-[305px] md:w-[325px] rounded-3xl sm:rounded-[28px] overflow-hidden bg-white border ${
                    isCenter
                      ? 'border-neutral-200 shadow-2xl shadow-neutral-950/15 ring-1 ring-black/5'
                      : 'border-neutral-200/90 shadow-md'
                  } transition-all duration-300 flex flex-col`}
                >
                  {/* Top: 9:16 Vertical Video/Thumbnail Box */}
                  <div className="relative aspect-[9/13.5] w-full overflow-hidden bg-neutral-900 group">
                    <SafeImage
                      src={article.thumbnail_url || '/images/hero-sandwich.jpg'}
                      alt={title}
                      fill
                      sizes="(max-width: 640px) 260px, 325px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      priority={isCenter}
                    />

                    {/* Gradient Overlays for contrast */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-transparent to-black/75 pointer-events-none" />

                    {/* Top Bar: Channel Avatar & Name */}
                    <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between z-10">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full overflow-hidden border border-white/80 bg-white shrink-0 shadow-xs">
                          <img
                            src="/images/logo.png"
                            alt="Eggu Logo"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex flex-col text-left">
                          <div className="flex items-center gap-1">
                            <span className="text-xs font-black text-white tracking-wide drop-shadow-md">
                              Eggu Sandwich
                            </span>
                            {/* Blue Verified Badge */}
                            <svg
                              className="w-3.5 h-3.5 text-[#20D5EC] fill-current"
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                            </svg>
                          </div>
                          <span className="text-[10px] text-white/85 font-medium tracking-tight">
                            @eggu_sandwich
                          </span>
                        </div>
                      </div>

                      {/* Small TikTok Logo on Top Right */}
                      <div className="w-6 h-6 rounded-full bg-black/40 backdrop-blur-xs flex items-center justify-center text-white shadow-xs">
                        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.47 6.3 6.3 0 0 0 1.86-4.47V8.78a8.18 8.18 0 0 0 4.77 1.52V6.85a4.85 4.85 0 0 1-.86-.16z" />
                        </svg>
                      </div>
                    </div>

                    {/* Center: Play Button */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-12 h-12 sm:w-13 sm:h-13 rounded-full bg-black/45 backdrop-blur-sm border border-white/30 text-white flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110">
                        <Play className="w-5 h-5 fill-white ml-0.5" />
                      </div>
                    </div>
                  </div>

                  {/* Bottom: Caption & Action Button */}
                  <div className="p-4 sm:p-5 flex flex-col justify-between gap-3 text-left bg-white">
                    {/* Caption: Clamped to 2 lines with ellipsis */}
                    <h3
                      className="text-[13px] sm:text-sm font-bold text-neutral-900 line-clamp-2 leading-snug min-h-[38px] group-hover:text-[#e0352b] transition-colors"
                      title={title}
                    >
                      {title}
                    </h3>

                    {/* Outlined Round Button: "Xem chi tiết" */}
                    <Link
                      href={`/news/${encodeURIComponent(article.slug)}`}
                      className="w-full py-2 sm:py-2.5 px-4 rounded-full border border-neutral-300 hover:border-black hover:bg-neutral-950 hover:text-white text-neutral-800 text-xs font-bold transition-all duration-200 flex items-center justify-center gap-1.5 shadow-2xs group/btn"
                    >
                      <span>{isVi ? 'Xem chi tiết' : 'View details'}</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Footer Controls of the Slider */}
      <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
        {/* Pagination Counter: e.g. 1 / 20 */}
        <div className="inline-flex items-center gap-1 text-xs font-black tracking-widest text-neutral-600 bg-neutral-100/90 border border-neutral-200 px-3.5 py-1.5 rounded-full shadow-2xs">
          <span className="text-[#e0352b]">{activeIndex + 1}</span>
          <span className="text-neutral-400">/</span>
          <span>{total}</span>
        </div>

        {/* Prominent Black Pill Button: "Xem thêm trên TikTok" */}
        <a
          href="https://www.tiktok.com/@eggu_sandwich"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2.5 bg-[#010101] hover:bg-[#1a1a1a] text-white rounded-full px-7 py-3 text-xs font-black uppercase tracking-wider shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 group"
        >
          {/* TikTok Icon */}
          <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.47 6.3 6.3 0 0 0 1.86-4.47V8.78a8.18 8.18 0 0 0 4.77 1.52V6.85a4.85 4.85 0 0 1-.86-.16z" />
          </svg>
          <span>{isVi ? 'Xem thêm trên TikTok' : 'Watch more on TikTok'}</span>
          <ExternalLink className="w-3.5 h-3.5 text-neutral-400 group-hover:text-white transition-colors" />
        </a>
      </div>
    </div>
  );
}
