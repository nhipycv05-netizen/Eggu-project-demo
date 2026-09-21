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

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-[#E5E7EB] hover:border-[#E53935]/40 group hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full">
      {/* Product Thumbnail (Links to product detail page) */}
      <Link
        href={`/menu/${product.slug}`}
        aria-label={isVi ? product.name_vi : product.name_en}
        className="relative aspect-square overflow-hidden bg-neutral-100 block"
      >
        <SafeImage
          src={product.image_url || '/images/hero-sandwich.jpg'}
          alt={isVi ? product.name_vi : product.name_en}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className={`object-cover group-hover:scale-105 transition-transform duration-500 ${
            isSoldOut ? 'opacity-75 grayscale-[30%]' : ''
          }`}
        />

        {/* Badges overlay */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          {isSoldOut ? (
            <span className="bg-[#1E1B18]/90 backdrop-blur-xs text-white font-black text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-md">
              {soldOutBadge}
            </span>
          ) : (
            <>
              {product.is_new && (
                <span className="bg-[#E53935] text-white font-bold text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm">
                  {newBadge}
                </span>
              )}
              {product.is_best_seller && (
                <span className="bg-[#FFC107] text-[#111111] font-bold text-[9px] uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-sm">
                  {bestSellerBadge}
                </span>
              )}
            </>
          )}
        </div>
      </Link>

      {/* Product Content Details */}
      <div className="p-4 md:p-5 flex-grow flex flex-col justify-between space-y-4">
        <div className="space-y-1.5">
          <Link href={`/menu/${product.slug}`} className="block group-hover:text-[#E53935] transition-colors">
            <h3 className="text-base sm:text-lg font-black text-[#111111] line-clamp-1">
              {isVi ? product.name_vi : product.name_en}
            </h3>
          </Link>
          <p className="text-xs text-[#6B7280] line-clamp-2 leading-relaxed font-medium">
            {isVi ? product.description_vi : product.description_en}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-4 border-t border-[#E5E7EB] gap-3">
          <span className="text-base font-black text-[#E53935] shrink-0">
            {product.price.toLocaleString()} {currencyLabel}
          </span>
          {isSoldOut ? (
            <button
              type="button"
              disabled
              aria-disabled="true"
              className="w-full sm:w-auto px-4 py-2 bg-gray-300 text-gray-500 cursor-not-allowed text-center text-xs font-black uppercase tracking-wider rounded-full shrink-0 select-none shadow-none"
            >
              {actionText}
            </button>
          ) : (
            <Link
              href={`/menu/${product.slug}`}
              className="w-full sm:w-auto px-4 py-2 bg-[#E53935] text-white text-center text-xs font-black uppercase tracking-wider rounded-full hover:bg-[#D32F2F] hover:shadow-md transition-all shrink-0 shadow-xs flex items-center justify-center cursor-pointer"
            >
              {actionText}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
