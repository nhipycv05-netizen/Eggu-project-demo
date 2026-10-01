import { Link } from '@/i18n/navigation';
import SafeImage from '@/components/ui/SafeImage';
import { Plus } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { getProductAltFromItem } from '@/lib/seo-alt';

export interface ProductCardItem {
  id: string;
  slug: string;
  name_vi: string;
  name_en: string;
  description_vi?: string | null;
  description_en?: string | null;
  price: number;
  image_url?: string | null;
  is_new?: boolean | null;
  is_best_seller?: boolean | null;
  is_available?: boolean | null;
}

interface ProductCardProps {
  product: ProductCardItem;
  locale: string;
  buttonLabel?: string;
  currencyLabel?: string;
  newBadgeLabel?: string;
  bestSellerBadgeLabel?: string;
  soldOutBadgeLabel?: string;
  soldOutBtnLabel?: string;
}

export default function ProductCard({
  product,
  locale,
  buttonLabel,
  currencyLabel = 'VND',
  newBadgeLabel,
  bestSellerBadgeLabel,
  soldOutBadgeLabel,
  soldOutBtnLabel,
}: ProductCardProps) {
  const isVi = locale === 'vi';
  const isSoldOut = product.is_available === false;
  const productAlt = getProductAltFromItem(product, locale);

  const actionText = isSoldOut
    ? soldOutBtnLabel || (isVi ? 'HẾT HÀNG' : 'SOLD OUT')
    : buttonLabel || (isVi ? 'ĐẶT HÀNG' : 'ORDER NOW');

  const soldOutBadge = soldOutBadgeLabel || (isVi ? 'HẾT MÓN' : 'SOLD OUT');
  const newBadge = newBadgeLabel || (isVi ? 'MỚI' : 'NEW');
  const bestSellerBadge = bestSellerBadgeLabel || (isVi ? 'Bán Chạy' : 'Best Seller');
  const description = isVi ? product.description_vi : product.description_en;

  return (
    <div
      id={`product-${product.slug}`}
      className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-[#e0352b]/40 group hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full shadow-xs"
    >
      {/* Product Thumbnail (Links to product detail page) */}
      <Link
        href={`/menu/${product.slug}`}
        aria-label={isVi ? product.name_vi : product.name_en}
        className="relative w-full h-44 sm:h-48 md:h-52 overflow-hidden rounded-t-2xl flex items-center justify-center bg-transparent block group/img"
      >
        <SafeImage
          src={product.image_url || '/images/hero-sandwich.jpg'}
          alt={productAlt}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className={`w-full h-full object-contain p-2.5 sm:p-3 group-hover:scale-105 transition-transform duration-300 ${
            isSoldOut ? 'opacity-75 grayscale-[30%]' : ''
          }`}
        />

        {/* Badges overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10 pointer-events-none">
          {isSoldOut ? (
            <span className="bg-[#1E1B18]/90 backdrop-blur-xs text-white font-black text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
              {soldOutBadge}
            </span>
          ) : (
            <>
              {product.is_new && (
                <span className="bg-[#e0352b] text-white font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
                  {newBadge}
                </span>
              )}
              {product.is_best_seller && (
                <span className="bg-[#FFC107] text-[#111111] font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
                  {bestSellerBadge}
                </span>
              )}
            </>
          )}
        </div>
      </Link>

      {/* Product Content Details */}
      <div className="p-3 md:p-3.5 flex-grow flex flex-col justify-between space-y-3">
        <div>
          <Link href={`/menu/${product.slug}`} className="block group-hover:text-[#e0352b] transition-colors">
            <h3 className="text-xs md:text-sm font-bold uppercase tracking-tight text-gray-900 line-clamp-2 min-h-[36px] md:min-h-[40px] leading-snug" title={isVi ? product.name_vi : product.name_en}>
              {isVi ? product.name_vi : product.name_en}
            </h3>
          </Link>
          {description && description.trim() !== '' && (
            <p className="text-[10px] sm:text-xs text-gray-500 line-clamp-2 mt-1 leading-snug">
              {description}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-[#E5E7EB] gap-2">
          <span className="text-sm md:text-base font-extrabold text-[#e0352b] shrink-0">
            {formatPrice(product.price)} {currencyLabel}
          </span>
          {isSoldOut ? (
            <button
              type="button"
              disabled
              aria-disabled="true"
              aria-label={actionText}
              title={actionText}
              className="w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center bg-gray-200 text-gray-400 cursor-not-allowed shrink-0 select-none shadow-none"
            >
              <Plus className="w-4 h-4 md:w-4.5 md:h-4.5 stroke-[2.5px]" aria-hidden="true" />
            </button>
          ) : (
            <Link
              href={`/menu/${product.slug}`}
              aria-label={actionText}
              title={actionText}
              className="w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center bg-[#e0352b] hover:bg-red-700 text-white shadow-xs transition-colors shrink-0"
            >
              <Plus className="w-4 h-4 md:w-4.5 md:h-4.5 stroke-[2.5px]" aria-hidden="true" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
