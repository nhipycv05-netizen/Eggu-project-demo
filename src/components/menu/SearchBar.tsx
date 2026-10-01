'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useRouter } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';
import { Search, X, ArrowRight, Frown } from 'lucide-react';
import SafeImage from '@/components/ui/SafeImage';
import {
  ProductItem,
  MOCK_PRODUCTS,
  removeVietnameseAccents,
  getHighlightSegments,
  HighlightSegment,
} from '@/lib/mockProducts';
import { formatPrice } from '@/lib/utils';
import { getProductAltFromItem } from '@/lib/seo-alt';

export interface SearchBarProps {
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  dropdownClassName?: string;
  onClose?: () => void;
  autoFocus?: boolean;
}

/**
 * Renders text with matching characters highlighted in Eggu Red bold.
 */
function HighlightMatch({ text, query }: { text: string; query: string }) {
  const segments: HighlightSegment[] = useMemo(
    () => getHighlightSegments(text, query),
    [text, query]
  );

  return (
    <span>
      {segments.map((segment, idx) =>
        segment.isMatch ? (
          <strong
            key={idx}
            className="text-[#e0352b] font-black underline decoration-[#e0352b]/40"
          >
            {segment.text}
          </strong>
        ) : (
          <span key={idx}>{segment.text}</span>
        )
      )}
    </span>
  );
}

export default function SearchBar({
  placeholder,
  className = '',
  inputClassName = '',
  dropdownClassName = '',
  onClose,
  autoFocus = false,
}: SearchBarProps) {
  const router = useRouter();
  const locale = useLocale();
  const isVi = locale === 'vi';
  const tNav = useTranslations('nav');
  const tCommon = useTranslations('common');

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);
  const [products, setProducts] = useState<ProductItem[]>(MOCK_PRODUCTS);

  // Default placeholder with capitalized 'T'
  const defaultPlaceholder = tNav('searchPlaceholder') || (isVi ? 'Thanh tìm kiếm bánh' : 'Search egg sandwiches...');
  const activePlaceholder = placeholder || defaultPlaceholder;
  const currencyLabel = tCommon('currency') || (isVi ? 'VND' : 'VND');
  const noResultsText = tNav('noResultsFound') || (isVi ? 'Không tìm thấy món phù hợp' : 'No matching items found');

  // Fetch live products on client mount (cached fallback to MOCK_PRODUCTS)
  useEffect(() => {
    let isMounted = true;
    async function fetchProducts() {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.products && Array.isArray(data.products) && data.products.length > 0) {
            setProducts(data.products);
          }
        }
      } catch (err) {
        console.warn('Live products fetch failed, using fallback:', err);
      }
    }
    fetchProducts();
    return () => {
      isMounted = false;
    };
  }, []);

  // Filter products by query (accent-insensitive & case-insensitive)
  const filteredProducts = useMemo(() => {
    const trimmed = query.trim();
    if (!trimmed) return [];

    const normQuery = removeVietnameseAccents(trimmed).toLowerCase();
    const queryTokens = normQuery.split(/\s+/).filter(Boolean);

    return products.filter((product) => {
      const normVi = removeVietnameseAccents(product.name_vi || '').toLowerCase();
      const normEn = removeVietnameseAccents(product.name_en || '').toLowerCase();
      const normDescVi = removeVietnameseAccents(product.description_vi || '').toLowerCase();
      const normDescEn = removeVietnameseAccents(product.description_en || '').toLowerCase();

      return queryTokens.every(
        (token) =>
          normVi.includes(token) ||
          normEn.includes(token) ||
          normDescVi.includes(token) ||
          normDescEn.includes(token)
      );
    });
  }, [query, products]);

  // Click outside listener to automatically close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  // Reset selected index when query changes
  useEffect(() => {
    setSelectedIndex(-1);
  }, [query]);

  // Handle clearing the search field
  const handleClear = useCallback(() => {
    setQuery('');
    setIsOpen(false);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  }, []);

  // When a product suggestion is clicked
  const handleSelectProduct = useCallback(
    (product: ProductItem) => {
      const productName = isVi ? product.name_vi : product.name_en;
      setQuery(productName);
      setIsOpen(false);
      onClose?.();

      // Check if product card exists in DOM on the current page
      const el = document.getElementById(`product-${product.slug}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('ring-4', 'ring-[#e0352b]', 'scale-105', 'transition-all', 'duration-300');
        setTimeout(() => {
          el.classList.remove('ring-4', 'ring-[#e0352b]', 'scale-105');
        }, 2000);
      } else {
        router.push(`/menu/${product.slug}`);
      }
    },
    [isVi, onClose, router]
  );

  // Form submission
  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < filteredProducts.length) {
        handleSelectProduct(filteredProducts[selectedIndex]);
        return;
      }

      const trimmed = query.trim();
      setIsOpen(false);
      onClose?.();

      if (trimmed) {
        router.push(`/menu?q=${encodeURIComponent(trimmed)}`);
      } else {
        router.push('/menu');
      }
    },
    [selectedIndex, filteredProducts, handleSelectProduct, query, onClose, router]
  );

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || filteredProducts.length === 0) {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1 < filteredProducts.length ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 >= 0 ? prev - 1 : filteredProducts.length - 1));
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
    }
  };

  const showDropdown = isOpen && query.trim().length >= 1;
  const displayedSuggestions = filteredProducts.slice(0, 6);

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* 1. Input Field */}
      <form onSubmit={handleSubmit} className="relative flex items-center w-full">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => {
            if (query.trim().length >= 1) {
              setIsOpen(true);
            }
          }}
          onKeyDown={handleKeyDown}
          placeholder={activePlaceholder}
          aria-label={activePlaceholder}
          aria-autocomplete="list"
          aria-expanded={showDropdown}
          autoComplete="off"
          autoFocus={autoFocus}
          className={`w-full pl-4 pr-16 py-1.5 md:py-2 text-xs lg:text-sm bg-white text-[#111111] placeholder:text-[#9CA3AF] rounded-full border border-[#E5E7EB] shadow-xs focus:outline-none focus:ring-2 focus:ring-[#e0352b]/20 focus:border-[#e0352b] transition-all duration-200 ${inputClassName}`}
        />

        {/* Right-side Action Icons: Clear (X) + Magnifying Glass (Search) */}
        <div className="absolute right-2.5 flex items-center gap-0.5 md:gap-1">
          {query.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Xóa nội dung tìm kiếm"
              title="Xóa tìm kiếm"
              className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <button
            type="submit"
            aria-label="Tìm kiếm"
            title="Tìm kiếm"
            className="p-1 text-[#6B7280] hover:text-[#e0352b] transition-colors rounded-full"
          >
            <Search className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </button>
        </div>
      </form>

      {/* 2. Dropdown Suggestions */}
      {showDropdown && (
        <div
          role="listbox"
          className={`absolute top-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-150 ${dropdownClassName}`}
        >
          {filteredProducts.length > 0 ? (
            <div>
              {/* Header count */}
              <div className="px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-400 border-b border-gray-100 flex items-center justify-between">
                <span>{isVi ? 'Gợi ý món ăn' : 'Suggestions'}</span>
                <span className="text-[10px] text-gray-400 font-normal">
                  {filteredProducts.length} {isVi ? 'kết quả' : 'results'}
                </span>
              </div>

              {/* Suggestions List */}
              <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                {displayedSuggestions.map((product, idx) => {
                  const isSelected = idx === selectedIndex;
                  const name = isVi ? product.name_vi : product.name_en;
                  const isSoldOut = product.is_available === false;

                  return (
                    <button
                      key={product.id}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => handleSelectProduct(product)}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full text-left px-3.5 py-2.5 flex items-center gap-3 transition-colors duration-150 group cursor-pointer ${
                        isSelected ? 'bg-[#FFF5F5]' : 'hover:bg-[#FBFBFB]'
                      }`}
                    >
                      {/* Product Thumbnail */}
                      <div className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-gray-50 border border-gray-100 overflow-hidden shrink-0 flex items-center justify-center p-1">
                        <SafeImage
                          src={product.image_url || '/images/hero-sandwich.jpg'}
                          alt={getProductAltFromItem(product, locale)}
                          fill
                          sizes="48px"
                          className={`object-contain transition-transform duration-200 group-hover:scale-105 ${
                            isSoldOut ? 'opacity-70 grayscale-[20%]' : ''
                          }`}
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-bold text-gray-900 truncate group-hover:text-[#e0352b] transition-colors">
                          <HighlightMatch text={name} query={query} />
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-black text-[#e0352b]">
                            {formatPrice(product.price)} {currencyLabel}
                          </span>
                          {isSoldOut && (
                            <span className="text-[10px] bg-gray-100 text-gray-500 font-semibold px-1.5 py-0.5 rounded-sm">
                              {isVi ? 'Hết món' : 'Sold out'}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* View all results button */}
              <div className="p-2 border-t border-gray-100 bg-gray-50/60">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full py-2 px-3 text-center text-xs font-bold text-[#e0352b] hover:bg-red-50 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>
                    {isVi
                      ? `Xem tất cả kết quả cho "${query.trim()}"`
                      : `View all results for "${query.trim()}"`}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            /* No Results Found */
            <div className="py-7 px-4 text-center">
              <div className="w-10 h-10 mx-auto rounded-full bg-red-50 text-[#e0352b] flex items-center justify-center mb-2">
                <Frown className="w-5 h-5" />
              </div>
              <p className="text-xs sm:text-sm font-bold text-gray-700">{noResultsText}</p>
              <p className="text-[11px] text-gray-400 mt-1">
                {isVi
                  ? 'Vui lòng kiểm tra lại chính tả hoặc thử từ khóa khác'
                  : 'Please check your spelling or try different keywords'}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Export MenuSearch as an alias
export { SearchBar as MenuSearch };
