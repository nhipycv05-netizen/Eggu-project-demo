'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard, { ProductCardItem } from './ProductCard';

interface CategoryItem {
  id: string;
  name_vi: string;
  name_en: string;
  slug: string;
}

interface CategoryHorizontalSectionProps {
  category: CategoryItem;
  products: ProductCardItem[];
  locale: string;
  buttonLabel?: string;
  currencyLabel?: string;
  newBadgeLabel?: string;
  bestSellerBadgeLabel?: string;
  soldOutBadgeLabel?: string;
  soldOutBtnLabel?: string;
}

export default function CategoryHorizontalSection({
  category,
  products,
  locale,
  buttonLabel,
  currencyLabel,
  newBadgeLabel,
  bestSellerBadgeLabel,
  soldOutBadgeLabel,
  soldOutBtnLabel,
}: CategoryHorizontalSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const isVi = locale === 'vi';
  const categoryName = isVi ? category.name_vi : category.name_en;

  const checkScrollState = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 6);
    // Allow slight tolerance for subpixel rounding
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    // Initial check
    checkScrollState();

    el.addEventListener('scroll', checkScrollState, { passive: true });
    window.addEventListener('resize', checkScrollState);

    // Also observe size changes via ResizeObserver
    const observer = new ResizeObserver(() => {
      checkScrollState();
    });
    observer.observe(el);

    return () => {
      el.removeEventListener('scroll', checkScrollState);
      window.removeEventListener('resize', checkScrollState);
      observer.disconnect();
    };
  }, [checkScrollState, products.length]);

  const handleScroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;

    const scrollAmount = el.clientWidth * 0.8;
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <section className="mb-10 sm:mb-12 relative">
      {/* Category Header Badge: inline-block bg-[#F8E2B0] text-[#452817] font-bold px-4 py-1.5 rounded-r-xl text-base mb-4 */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="inline-block bg-[#F8E2B0] text-[#452817] font-bold px-4 py-1.5 rounded-r-xl text-base shadow-xs select-none">
          {categoryName}
        </h2>
        <span className="text-xs text-[#706860] font-semibold pr-2">
          {products.length} {isVi ? 'món' : 'items'}
        </span>
      </div>

      {/* Horizontal Scroll Area */}
      <div className="relative group">
        {/* Left Arrow Button (Desktop) */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => handleScroll('left')}
            aria-label={isVi ? 'Cuộn sang trái' : 'Scroll left'}
            className="hidden md:flex absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/95 text-[#111111] shadow-lg border border-[#E5E7EB] hover:bg-[#E53935] hover:text-white hover:border-[#E53935] items-center justify-center transition-all duration-200 active:scale-90 cursor-pointer backdrop-blur-xs"
          >
            <ChevronLeft className="w-5 h-5 stroke-[2.5]" />
          </button>
        )}

        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          tabIndex={0}
          aria-label={categoryName}
          className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-3 md:gap-4 py-2 px-0.5 scroll-smooth focus:outline-none"
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="flex-none snap-start w-[calc((100vw-3.2rem)/2.25)] min-w-[150px] max-w-[185px] sm:max-w-none sm:w-[calc((100%-2*1rem)/3)] md:w-[calc((100%-3*1rem)/4)] lg:w-[calc((100%-4*1rem)/5)] flex flex-col"
            >
              <ProductCard
                product={product}
                locale={locale}
                buttonLabel={buttonLabel}
                currencyLabel={currencyLabel}
                newBadgeLabel={newBadgeLabel}
                bestSellerBadgeLabel={bestSellerBadgeLabel}
                soldOutBadgeLabel={soldOutBadgeLabel}
                soldOutBtnLabel={soldOutBtnLabel}
              />
            </div>
          ))}
        </div>

        {/* Right Arrow Button (Desktop) */}
        {canScrollRight && (
          <button
            type="button"
            onClick={() => handleScroll('right')}
            aria-label={isVi ? 'Cuộn sang phải' : 'Scroll right'}
            className="hidden md:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/95 text-[#111111] shadow-lg border border-[#E5E7EB] hover:bg-[#E53935] hover:text-white hover:border-[#E53935] items-center justify-center transition-all duration-200 active:scale-90 cursor-pointer backdrop-blur-xs"
          >
            <ChevronRight className="w-5 h-5 stroke-[2.5]" />
          </button>
        )}
      </div>
    </section>
  );
}
