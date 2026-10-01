'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link, useRouter } from '@/i18n/navigation';
import { useCartStore, getOptionsHash } from '@/stores/cartStore';
import { Plus, Minus, Trash2, ArrowLeft, ArrowRight, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import DeliveryTypeModal from './DeliveryTypeModal';
import { formatPrice } from '@/lib/utils';

interface CartManagerProps {
  locale: string;
}

export default function CartManager({ locale }: CartManagerProps) {
  const t = useTranslations('cart');
  const tc = useTranslations('common');
  const isVi = locale === 'vi';
  const router = useRouter();

  const { items, updateQuantity, removeItem } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);
  const [isDeliveryModalOpen, setIsDeliveryModalOpen] = useState(false);

  useEffect(() => {
    let active = true;
    setTimeout(() => {
      if (active) {
        setIsMounted(true);
      }
    }, 0);
    return () => {
      active = false;
    };
  }, []);

  if (!isMounted) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#E53935] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-[#E5E7EB] max-w-md mx-auto p-8 space-y-6 shadow-xs">
        <div className="w-16 h-16 bg-[#E53935]/10 text-[#E53935] rounded-full flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-[#111111]">{t('title')}</h2>
          <p className="text-sm text-[#6B7280] font-medium">{t('empty')}</p>
        </div>
        <Link
          href="/menu"
          className="inline-block px-8 py-3.5 bg-[#E53935] text-white font-black uppercase tracking-wider rounded-full hover:bg-[#D32F2F] transition duration-150 shadow-sm"
        >
          {t('continue')}
        </Link>
      </div>
    );
  }

  // Calculate pricing
  const subtotal = items.reduce((sum, item) => {
    const optionsPrice = item.options.reduce((oSum, opt) => oSum + opt.price, 0);
    return sum + (item.price + optionsPrice) * item.quantity;
  }, 0);

  const total = subtotal;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Items List - Left 8 columns */}
      <div className="lg:col-span-8 space-y-4">
        <h2 className="text-xl font-black text-[#111111] mb-6">{t('title')}</h2>

        <div className="space-y-4">
          {items.map((item) => {
            const optionsPrice = item.options.reduce((sum, opt) => sum + opt.price, 0);
            const itemPrice = item.price + optionsPrice;
            const itemSubtotal = itemPrice * item.quantity;
            const hash = getOptionsHash(item.options);

            return (
              <div
                key={`${item.productId}-${hash}`}
                className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E5E7EB] hover:border-[#e0352b]/30 transition-colors flex gap-4 md:gap-5 items-start justify-between shadow-xs"
              >
                {/* Cột 1: Ảnh đại diện món ăn */}
                <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden border border-[#E5E7EB] shrink-0 bg-neutral-100">
                  <Image
                    src={item.image || '/images/hero-sandwich.jpg'}
                    alt={isVi ? item.name_vi : item.name_en}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>

                {/* Cột 2: Cụm thông tin: Tên món → Giá tiền bên dưới → Topping → Bộ tăng giảm số lượng */}
                <div className="flex-grow space-y-2 min-w-0">
                  {/* Gom Tên món và Giá tiền vào chung một khối xếp theo chiều dọc */}
                  <div className="flex flex-col items-start gap-1">
                    <h3 className="font-bold uppercase text-gray-900 text-sm md:text-base truncate max-w-full">
                      {isVi ? item.name_vi : item.name_en}
                    </h3>
                    <span className="font-extrabold text-[#e0352b] text-sm md:text-base">
                      {formatPrice(itemSubtotal)} {tc('currency')}
                    </span>
                  </div>

                  {/* Danh sách topping đã chọn (nếu có) */}
                  {item.options.length > 0 && (
                    <p className="text-xs text-[#6B7280] font-semibold">
                      + {item.options.map((o) => (isVi ? o.name_vi : o.name_en)).join(', ')}
                    </p>
                  )}

                  {/* Ghi chú (nếu có) */}
                  {item.note && (
                    <p className="text-xs italic text-[#e0352b] font-semibold">
                      {t('note')}: &ldquo;{item.note}&rdquo;
                    </p>
                  )}

                  {/* Bộ tăng giảm số lượng */}
                  <div className="pt-1">
                    <div className="flex items-center bg-[#F8F9FA] border border-[#E5E7EB] rounded-full p-0.5 w-fit">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, hash, item.quantity - 1)}
                        className="p-1 hover:bg-white rounded-full transition cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5 text-[#111111]" />
                      </button>
                      <span className="px-3.5 font-bold text-xs sm:text-sm text-[#111111] min-w-[28px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, hash, item.quantity + 1)}
                        className="p-1 hover:bg-white rounded-full transition cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5 text-[#111111]" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Cột 3 (bên phải cùng): Nút xóa/thùng rác (icon trash) để xóa món khỏi giỏ hàng */}
                <button
                  type="button"
                  onClick={() => removeItem(item.productId, hash)}
                  className="text-[#9CA3AF] hover:text-[#e0352b] p-2 hover:bg-red-50 rounded-xl transition-all duration-150 shrink-0 self-start cursor-pointer"
                  aria-label="Remove item"
                  title="Xóa món"
                >
                  <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
            );
          })}
        </div>

        {/* Continue Shopping Link */}
        <div className="pt-4">
          <Link
            href="/menu"
            className="inline-flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-[#6B7280] hover:text-[#E53935] transition duration-150"
          >
            <ArrowLeft className="w-4 h-4 text-[#E53935]" />
            <span>{t('continue')}</span>
          </Link>
        </div>
      </div>

      {/* Cart Summary Panel - Right 4 columns */}
      <div className="lg:col-span-4 bg-white p-4 sm:p-5 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-3">
        <h3 className="text-sm sm:text-base font-extrabold text-gray-900 border-b border-[#E5E7EB] pb-2.5">
          {t('summary')}
        </h3>

        <div className="space-y-2.5 text-xs sm:text-sm">
          {/* Subtotal */}
          <div className="flex justify-between items-center text-xs sm:text-sm">
            <span className="text-gray-500">{t('subtotal')}</span>
            <span className="font-semibold text-gray-800">
              {formatPrice(subtotal)} {tc('currency')}
            </span>
          </div>

          {/* Total */}
          <div className="border-t border-[#E5E7EB] pt-2.5 flex justify-between items-center">
            <span className="text-xs sm:text-sm font-bold text-gray-900">{t('total')}</span>
            <span className="text-base sm:text-lg font-black text-[#e0352b]">
              {formatPrice(total)} {tc('currency')}
            </span>
          </div>
        </div>

        {/* Checkout Button */}
        <button
          type="button"
          onClick={() => setIsDeliveryModalOpen(true)}
          className="w-full py-2.5 px-4 bg-[#e0352b] text-white text-center font-bold text-xs sm:text-sm uppercase tracking-wider rounded-full shadow-md hover:shadow-lg hover:bg-red-700 active:scale-98 transition duration-150 flex items-center justify-center space-x-1.5 cursor-pointer mt-1"
        >
          <span>{t('checkout')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Delivery Type Selection Modal */}
      <DeliveryTypeModal
        isOpen={isDeliveryModalOpen}
        onClose={() => setIsDeliveryModalOpen(false)}
        onSelect={(type) => {
          setIsDeliveryModalOpen(false);
          router.push(`/checkout?type=${type}`);
        }}
      />
    </div>
  );
}
