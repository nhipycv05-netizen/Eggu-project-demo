import { Link } from '@/i18n/navigation';
import SafeImage from '@/components/ui/SafeImage';

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

  const actionText = isSoldOut
    ? soldOutBtnLabel || (isVi ? 'HẾT HÀNG' : 'SOLD OUT')
    : buttonLabel || (isVi ? 'ĐẶT HÀNG' : 'ORDER NOW');

  const soldOutBadge = soldOutBadgeLabel || (isVi ? 'HẾT MÓN' : 'SOLD OUT');
  const newBadge = newBadgeLabel || (isVi ? 'MỚI' : 'NEW');
  const bestSellerBadge = bestSellerBadgeLabel || (isVi ? 'Bán Chạy' : 'Best Seller');
  const description = isVi ? product.description_vi : product.description_en;

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-[#E53935]/40 group hover:shadow-md transition-all duration-300 flex flex-col justify-between h-full shadow-xs">
      {/* Product Thumbnail (Links to product detail page) */}
      <Link
        href={`/menu/${product.slug}`}
        aria-label={isVi ? product.name_vi : product.name_en}
        className="relative w-full h-44 sm:h-48 md:h-52 overflow-hidden rounded-t-2xl flex items-center justify-center bg-transparent block group/img"
      >
        <SafeImage
          src={product.image_url || '/images/hero-sandwich.jpg'}
          alt={isVi ? product.name_vi : product.name_en}
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
                <span className="bg-[#E53935] text-white font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
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
          <Link href={`/menu/${product.slug}`} className="block group-hover:text-[#E53935] transition-colors">
            <h3 className="text-base sm:text-lg font-black text-[#111111] line-clamp-2 leading-snug" title={isVi ? product.name_vi : product.name_en}>
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
          <span className="text-sm sm:text-base font-black text-[#E53935] shrink-0">
            {product.price.toLocaleString()} {currencyLabel}
          </span>
          {isSoldOut ? (
            <button
              type="button"
              disabled
              aria-disabled="true"
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gray-300 text-gray-500 cursor-not-allowed text-center text-xs font-black uppercase tracking-wider rounded-full shrink-0 select-none shadow-none"
            >
              {actionText}
            </button>
          ) : (
            <Link
              href={`/menu/${product.slug}`}
              className="px-3 sm:px-4 py-1.5 sm:py-2 bg-[#E53935] text-white text-center text-xs font-black uppercase tracking-wider rounded-full hover:bg-[#D32F2F] hover:shadow-md transition-all shrink-0 shadow-xs flex items-center justify-center cursor-pointer"
            >
              {actionText}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
