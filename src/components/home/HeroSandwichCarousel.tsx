'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Link } from '@/i18n/navigation';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';

export interface SandwichItem {
  id: string;
  image_url: string;
}

export const HERO_SANDWICH_IMAGES: SandwichItem[] = [
  {
    id: 'hero-bacon-cheese',
    image_url: '/images/carousel/sandwich-bacon-cheese.jpg',
  },
  {
    id: 'hero-mr-egg',
    image_url: '/images/carousel/sandwich-egg-scramble.jpg',
  },
  {
    id: 'hero-corn-bacon',
    image_url: '/images/carousel/sandwich-corn-bacon.jpg',
  },
  {
    id: 'hero-chicken-herb',
    image_url: '/images/carousel/sandwich-chicken-herbs.jpg',
  },
  {
    id: 'hero-tuna-tomato',
    image_url: '/images/carousel/sandwich-tuna-tomato.jpg',
  },
];

interface HeroSandwichCarouselProps {
  locale: string;
}

const AUTOPLAY_INTERVAL = 4000; // 4 seconds per slide

export default function HeroSandwichCarousel({ locale }: HeroSandwichCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const isVi = locale === 'vi';
  const total = HERO_SANDWICH_IMAGES.length;

  // Static content according to exact user specification
  const staticContent = {
    tagline: isVi ? 'Sandwich Trứng Chuẩn Vị Hàn Quốc' : 'Authentic Korean Gourmet Egg Toast',
    title: isVi
      ? 'SANDWICH NÓNG GIÒN – NGẬP TRÀN TOPPING'
      : 'CRISPY WARM SANDWICH – LOADED WITH TOPPINGS',
    description: isVi
      ? 'Sự kết hợp hoàn hảo giữa độ béo ngậy của trứng, vị đậm đà của sốt đặc chế và chiếc bánh mì vàng ươm thơm lừng.'
      : 'A perfect combination of rich creamy eggs, signature flavorful sauce, and freshly toasted golden brioche.',
    learnMore: isVi ? 'KHÁM PHÁ BÁNH' : 'DISCOVER SANDWICHES',
  };

  // Move to next item with infinite loop
  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  // Move to previous item with infinite loop
  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  // Select direct index (clicking dots or side items)
  const handleSelectIndex = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);

  // Continuous Autoplay effect:
  // - Runs every 4 seconds (AUTOPLAY_INTERVAL)
  // - Resets 4-second countdown whenever user interacts (currentIndex changes)
  // - Seamlessly continues infinite loop across all 5 images
  useEffect(() => {
    const timer = setInterval(() => {
      handleNext();
    }, AUTOPLAY_INTERVAL);

    return () => {
      clearInterval(timer);
    };
  }, [handleNext, currentIndex]);

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const minSwipeDistance = 45;
    if (distance > minSwipeDistance) {
      handleNext();
    } else if (distance < -minSwipeDistance) {
      handlePrev();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  // 3D Carousel Conveyor Positioning Logic:
  // Smoothly calculates 3D transform, scale, opacity, and layering
  const getItemTransform = (index: number) => {
    let diff = (index - currentIndex + total) % total;
    if (diff > total / 2) {
      diff -= total;
    }

    if (diff === 0) {
      // Center active sandwich: foreground, largest, floating, high shadow
      return {
        x: '0%',
        scale: 1.05,
        opacity: 1,
        zIndex: 30,
        rotate: 0,
        filter: 'drop-shadow(0 20px 30px rgba(229, 57, 53, 0.12)) drop-shadow(0 10px 15px rgba(0, 0, 0, 0.08))',
        isCenter: true,
        pointerEvents: 'auto' as const,
      };
    } else if (diff === -1) {
      // Left sandwich: behind center, offset to left, slight tilt
      return {
        x: '-62%',
        scale: 0.74,
        opacity: 0.68,
        zIndex: 15,
        rotate: -5,
        filter: 'brightness(0.95) blur(0.3px) drop-shadow(0 10px 15px rgba(0, 0, 0, 0.06))',
        isCenter: false,
        pointerEvents: 'auto' as const,
      };
    } else if (diff === 1) {
      // Right sandwich: behind center, offset to right, slight tilt
      return {
        x: '62%',
        scale: 0.74,
        opacity: 0.68,
        zIndex: 15,
        rotate: 5,
        filter: 'brightness(0.95) blur(0.3px) drop-shadow(0 10px 15px rgba(0, 0, 0, 0.06))',
        isCenter: false,
        pointerEvents: 'auto' as const,
      };
    } else {
      // Offscreen items: hidden seamlessly until rotated in
      const isPositive = diff > 0;
      return {
        x: isPositive ? '140%' : '-140%',
        scale: 0.45,
        opacity: 0,
        zIndex: 0,
        rotate: isPositive ? 10 : -10,
        filter: 'brightness(0.9) blur(2px)',
        isCenter: false,
        pointerEvents: 'none' as const,
      };
    }
  };

  return (
    <section className="relative pt-24 md:pt-28 pb-12 md:pb-16 bg-transparent overflow-hidden">
      {/* Subtle decorative background glow */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#FFC107]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 right-1/4 translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#E53935]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="relative overflow-hidden rounded-3xl bg-white/85 backdrop-blur-md p-6 sm:p-8 md:p-12 lg:p-14 shadow-xl shadow-[#FFC107]/10 border border-[#FFE8B3]/60">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* LEFT CONTENT AREA: COMPLETELY FIXED/STATIC TEXT ACROSS ALL SLIDES */}
            <div className="lg:col-span-6 space-y-5 md:space-y-6 text-left flex flex-col justify-center">
              
              {/* Category Badge */}
              <div className="flex flex-wrap items-center gap-2.5">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E53935]/10 text-[#E53935] text-xs font-black uppercase tracking-wider">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E53935] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#E53935]"></span>
                  </span>
                  <span>{staticContent.tagline}</span>
                </div>
              </div>

              {/* Fixed Title: Compact responsive sizing on 1-2 lines */}
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-3xl lg:text-[30px] xl:text-[35px] font-black leading-snug md:leading-tight text-[#111111] tracking-tight uppercase max-w-lg">
                  {staticContent.title}
                </h1>
              </div>

              {/* Fixed Description: Constrained width and clean 2-line break */}
              <div className="max-w-md xl:max-w-lg">
                {isVi ? (
                  <p className="text-sm sm:text-base md:text-[16px] leading-relaxed text-[#4B5563] font-medium">
                    Sự kết hợp hoàn hảo giữa độ béo ngậy của trứng, vị đậm đà<br className="hidden sm:inline" /> của sốt đặc chế và chiếc bánh mì vàng ươm thơm lừng.
                  </p>
                ) : (
                  <p className="text-sm sm:text-base md:text-[16px] leading-relaxed text-[#4B5563] font-medium">
                    A perfect combination of rich creamy eggs, signature flavorful sauce<br className="hidden sm:inline" /> and freshly toasted golden brioche.
                  </p>
                )}
              </div>

              {/* Single CTA Button: KHÁM PHÁ BÁNH */}
              <div className="pt-2">
                <Link
                  href="/menu"
                  className="group inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#FFC107] text-[#111111] font-black text-sm uppercase tracking-wider hover:bg-[#FFB300] hover:shadow-lg hover:shadow-[#FFC107]/25 transition-all duration-300 active:scale-95"
                >
                  <span>{staticContent.learnMore}</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
              </div>

            </div>

            {/* RIGHT CAROUSEL 3D CONVEYOR AREA: ROTATING 5 PRODUCT IMAGES */}
            <div 
              className="lg:col-span-6 flex flex-col items-center justify-center relative select-none w-full"
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* 3D Carousel Stage */}
              <div className="relative w-full h-[320px] sm:h-[380px] md:h-[430px] flex items-center justify-center overflow-hidden sm:overflow-visible">
                
                {/* Left Navigation Arrow */}
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label={isVi ? 'Món trước đó' : 'Previous sandwich'}
                  className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-40 flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/95 text-[#111111] shadow-lg shadow-black/10 border border-gray-100 hover:bg-[#E53935] hover:text-white hover:border-[#E53935] transition-all duration-300 active:scale-90 cursor-pointer backdrop-blur-sm"
                >
                  <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
                </button>

                {/* Right Navigation Arrow */}
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label={isVi ? 'Món kế tiếp' : 'Next sandwich'}
                  className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-40 flex items-center justify-center w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/95 text-[#111111] shadow-lg shadow-black/10 border border-gray-100 hover:bg-[#E53935] hover:text-white hover:border-[#E53935] transition-all duration-300 active:scale-90 cursor-pointer backdrop-blur-sm"
                >
                  <ChevronRight className="w-6 h-6 stroke-[2.5]" />
                </button>

                {/* Sandwich Carousel Items */}
                <div className="relative w-full max-w-[300px] sm:max-w-[340px] md:max-w-[370px] aspect-square flex items-center justify-center">
                  {HERO_SANDWICH_IMAGES.map((item, index) => {
                    const style = getItemTransform(index);
                    const isCurrent = index === currentIndex;

                    return (
                      <motion.div
                        key={item.id}
                        initial={false}
                        animate={{
                          x: style.x,
                          scale: style.scale,
                          opacity: style.opacity,
                          rotate: style.rotate,
                          zIndex: style.zIndex,
                        }}
                        transition={{
                          type: 'spring',
                          stiffness: 220,
                          damping: 26,
                          mass: 0.85,
                        }}
                        onClick={() => {
                          if (!isCurrent) handleSelectIndex(index);
                        }}
                        style={{
                          pointerEvents: style.pointerEvents,
                          filter: style.filter,
                        }}
                        className={`absolute inset-0 flex items-center justify-center transition-shadow duration-300 ${
                          !isCurrent ? 'cursor-pointer hover:opacity-90' : ''
                        }`}
                      >
                        {/* Sandwich Card Container */}
                        <div
                          className={`relative w-full h-full rounded-3xl overflow-hidden bg-white border-2 transition-all duration-500 p-2 sm:p-3 flex items-center justify-center ${
                            isCurrent
                              ? 'border-[#FFC107] ring-4 ring-[#FFC107]/20 shadow-2xl bg-gradient-to-b from-white to-[#FFFDF7]'
                              : 'border-transparent shadow-md bg-white/90'
                          }`}
                        >
                          {/* Gentle floating micro-animation for active center sandwich */}
                          <motion.div
                            animate={
                              isCurrent
                                ? {
                                    y: [0, -7, 0],
                                  }
                                : { y: 0 }
                            }
                            transition={
                              isCurrent
                                ? {
                                    duration: 3.5,
                                    repeat: Infinity,
                                    ease: 'easeInOut',
                                  }
                                : {}
                            }
                            className="relative w-full h-full rounded-2xl overflow-hidden flex items-center justify-center"
                          >
                            <Image
                              src={item.image_url}
                              alt="EGGU Sandwich"
                              fill
                              sizes="(max-width: 640px) 280px, (max-width: 1024px) 360px, 420px"
                              priority={index === 0 || index === 1}
                              className="object-contain p-1 transform transition-transform duration-500 hover:scale-105"
                            />
                          </motion.div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

              {/* Carousel Indicators / Dots with active highlight & progress feel */}
              <div className="flex items-center justify-center gap-2 mt-4 z-30">
                {HERO_SANDWICH_IMAGES.map((item, index) => {
                  const isActive = index === currentIndex;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectIndex(index)}
                      aria-label={`Go to slide ${index + 1}`}
                      className={`relative h-2.5 rounded-full transition-all duration-300 cursor-pointer overflow-hidden ${
                        isActive
                          ? 'w-8 bg-[#E53935] shadow-sm shadow-[#E53935]/40'
                          : 'w-2.5 bg-gray-300 hover:bg-gray-400 hover:w-3.5'
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          key={`progress-${currentIndex}`}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: AUTOPLAY_INTERVAL / 1000, ease: 'linear' }}
                          style={{ originX: 0 }}
                          className="absolute inset-0 bg-white/30"
                        />
                      )}
                    </button>
                  );
                })}
              </div>

            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
