'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useCartStore, getOptionsHash } from '@/stores/cartStore';
import { Plus, Minus, Trash2, ArrowLeft, ArrowRight, ShoppingBag } from 'lucide-react';
import Image from 'next/image';

interface CartManagerProps {
  locale: string;
}

export default function CartManager({ locale }: CartManagerProps) {
  const t = useTranslations('cart');
  const tc = useTranslations('common');
  const isVi = locale === 'vi';

  const { items, updateQuantity, removeItem } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);

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
        <div className="w-8 h-8 border-4 border-[#EAAA08] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-[#E5E0D8] max-w-md mx-auto p-8 space-y-6">
        <div className="w-16 h-16 bg-[#EAAA08]/15 text-[#EAAA08] rounded-full flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-[#1E1B18]">{t('title')}</h2>
          <p className="text-sm text-[#706860] font-medium">{t('empty')}</p>
        </div>
        <Link
          href="/menu"
          className="inline-block px-6 py-3 bg-[#EAAA08] text-[#1E1B18] font-extrabold uppercase tracking-wider rounded-xl hover:bg-[#EAAA08]/90 transition duration-150 shadow-sm"
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

  const deliveryFee = 20000; // Fixed delivery fee 20,000 VND
  const total = subtotal + deliveryFee;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Items List - Left 8 columns */}
      <div className="lg:col-span-8 space-y-4">
        <h2 className="text-xl font-black text-[#1E1B18] mb-6">{t('title')}</h2>

        <div className="space-y-4">
          {items.map((item) => {
            const optionsPrice = item.options.reduce((sum, opt) => sum + opt.price, 0);
            const itemPrice = item.price + optionsPrice;
            const itemSubtotal = itemPrice * item.quantity;
            const hash = getOptionsHash(item.options);

            return (
              <div
                key={`${item.productId}-${hash}`}
                className="bg-white p-5 rounded-2xl border border-[#E5E0D8] flex gap-4 md:gap-6 items-start"
              >
                {/* Thumbnail */}
                <div className="relative w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden border border-[#E5E0D8] shrink-0 bg-neutral-100">
                  <Image
                    src={item.image || '/images/hero-sandwich.jpg'}
                    alt={isVi ? item.name_vi : item.name_en}
                    fill
                    sizes="96px"
                    className="object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-grow space-y-3 min-w-0">
                  <div className="flex justify-between items-start gap-4">
                    <div>
                      <h3 className="font-black text-base md:text-lg text-[#1E1B18] truncate">
                        {isVi ? item.name_vi : item.name_en}
                      </h3>
                      {/* Options */}
                      {item.options.length > 0 && (
                        <p className="text-xs text-[#706860] mt-1 font-semibold">
                          + {item.options.map((o) => (isVi ? o.name_vi : o.name_en)).join(', ')}
                        </p>
                      )}
                      {/* Note */}
                      {item.note && (
                        <p className="text-xs italic text-amber-600 mt-1 font-semibold">
                          {t('note')}: &ldquo;{item.note}&rdquo;
                        </p>
                      )}
                    </div>
                    {/* Item price */}
                    <span className="font-extrabold text-[#5C4B3E] shrink-0 text-sm md:text-base">
                      {itemSubtotal.toLocaleString()} {tc('currency')}
                    </span>
                  </div>

                  {/* Quantity and Remove actions */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center bg-[#EFECE6] border border-[#E5E0D8] rounded-lg p-0.5">
                      <button
                        onClick={() => updateQuantity(item.productId, hash, item.quantity - 1)}
                        className="p-1 hover:bg-white rounded transition"
                      >
                        <Minus className="w-3.5 h-3.5 text-[#1E1B18]" />
                      </button>
                      <span className="px-4 font-bold text-xs text-[#1E1B18] min-w-[30px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, hash, item.quantity + 1)}
                        className="p-1 hover:bg-white rounded transition"
                      >
                        <Plus className="w-3.5 h-3.5 text-[#1E1B18]" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.productId, hash)}
                      className="text-neutral-400 hover:text-red-500 p-2 transition-colors duration-150"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Continue Shopping Link */}
        <div className="pt-4">
          <Link
            href="/menu"
            className="inline-flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-[#706860] hover:text-[#1E1B18] transition duration-150"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{t('continue')}</span>
          </Link>
        </div>
      </div>

      {/* Cart Summary Panel - Right 4 columns */}
      <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-[#E5E0D8] shadow-sm space-y-6">
        <h3 className="text-lg font-black text-[#1E1B18] border-b border-[#E5E0D8] pb-4">
          Order Summary
        </h3>

        <div className="space-y-4 text-sm font-semibold text-[#706860]">
          {/* Subtotal */}
          <div className="flex justify-between">
            <span>{t('subtotal')}</span>
            <span className="text-[#1E1B18] font-bold">
              {subtotal.toLocaleString()} {tc('currency')}
            </span>
          </div>

          {/* Delivery Fee */}
          <div className="flex justify-between">
            <span>{t('deliveryFee')}</span>
            <span className="text-[#1E1B18] font-bold">
              {deliveryFee.toLocaleString()} {tc('currency')}
            </span>
          </div>

          {/* Total */}
          <div className="border-t border-[#E5E0D8] pt-4 flex justify-between items-end">
            <span className="text-base font-black text-[#1E1B18]">{t('total')}</span>
            <span className="text-2xl font-black text-[#5C4B3E]">
              {total.toLocaleString()} {tc('currency')}
            </span>
          </div>
        </div>

        {/* Checkout Button */}
        <Link
          href="/checkout"
          className="w-full py-4 bg-[#EAAA08] text-[#1E1B18] text-center font-extrabold uppercase tracking-widest rounded-xl shadow-md hover:shadow-lg hover:bg-[#EAAA08]/90 transition duration-150 flex items-center justify-center space-x-2"
        >
          <span>{t('checkout')}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
