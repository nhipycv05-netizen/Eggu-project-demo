'use client';

import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useCartStore } from '@/stores/cartStore';
import { createOrder, getActivePromotions } from '@/features/orders/actions';
import { ShoppingBag, Loader2, Tag, X, Check, TicketPercent } from 'lucide-react';
import { Promotion } from '@/types/promotion';

interface CheckoutFormValues {
  fullName: string;
  phone: string;
  email?: string;
  address: string;
  note?: string;
}

export default function CheckoutForm() {
  const t = useTranslations('checkout');
  const tc = useTranslations('common');
  const locale = useLocale();
  const isVi = locale === 'vi';
  const router = useRouter();
  const { items, clearCart } = useCartStore();
  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Promotions state
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loadingPromos, setLoadingPromos] = useState(true);
  const [selectedPromo, setSelectedPromo] = useState<Promotion | null>(null);

  const checkoutSchema = useMemo(() => {
    return z.object({
      fullName: z.string().min(2, { message: t('errors.nameRequired') }),
      phone: z.string().min(10, { message: t('errors.phoneRequired') }),
      email: z.string().email({ message: t('errors.emailInvalid') }).optional().or(z.literal('')),
      address: z.string().min(5, { message: t('errors.addressRequired') }),
      note: z.string().optional(),
    });
  }, [t]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      email: '',
      address: '',
      note: '',
    },
  });

  useEffect(() => {
    let active = true;
    setTimeout(() => {
      if (active) {
        setIsMounted(true);
      }
    }, 0);

    // Fetch active promotions for checkout list
    getActivePromotions()
      .then((data) => {
        if (active) {
          setPromotions(data || []);
          setLoadingPromos(false);
        }
      })
      .catch((err) => {
        console.error('Lỗi khi tải danh sách voucher:', err);
        if (active) setLoadingPromos(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => {
      const optionsPrice = item.options.reduce((oSum, opt) => oSum + opt.price, 0);
      return sum + (item.price + optionsPrice) * item.quantity;
    }, 0);
  }, [items]);

  // Recalculate or auto-deselect promo if subtotal falls below minimum order value
  useEffect(() => {
    if (selectedPromo) {
      if (selectedPromo.min_order_value && subtotal < selectedPromo.min_order_value) {
        setSelectedPromo(null);
      }
    }
  }, [subtotal, selectedPromo]);

  // Calculate discount amount
  const discount = useMemo(() => {
    if (!selectedPromo) return 0;
    if (selectedPromo.discount_type === 'PERCENTAGE') {
      return Math.round((subtotal * selectedPromo.discount_value) / 100);
    }
    return Math.min(subtotal, Number(selectedPromo.discount_value));
  }, [subtotal, selectedPromo]);

  const total = Math.max(0, subtotal - discount);

  const handleTogglePromo = (promo: Promotion) => {
    const isEligible = !promo.min_order_value || subtotal >= promo.min_order_value;
    if (!isEligible) return;

    if (selectedPromo?.id === promo.id) {
      // Deselect
      setSelectedPromo(null);
    } else {
      // Select
      setSelectedPromo(promo);
    }
  };

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
          <h2 className="text-2xl font-black text-[#111111]">{t('emptyCart')}</h2>
          <p className="text-sm text-[#6B7280] font-medium">{t('emptyCartDesc')}</p>
        </div>
      </div>
    );
  }

  const onSubmit = async (data: CheckoutFormValues) => {
    setIsSubmitting(true);
    setSubmitError(null);

    // Format cart items for action validation
    const actionItems = items.map((item) => ({
      productId: item.productId,
      quantity: item.quantity,
      options: item.options.map((o) => ({ id: o.id })),
      note: item.note,
    }));

    const result = await createOrder(
      {
        fullName: data.fullName,
        phone: data.phone,
        email: data.email,
        address: data.address,
        note: data.note,
      },
      actionItems,
      selectedPromo?.code
    );

    if (result.success && result.orderNumber) {
      clearCart();
      router.push(`/order-success?order=${result.orderNumber}`);
    } else {
      setSubmitError(result.error || 'Failed to submit order');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Checkout Form - Left 7 columns */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-[#E5E7EB] shadow-xs space-y-6"
      >
        <h2 className="text-2xl font-black text-[#111111]">{t('title')}</h2>
        <p className="text-sm text-[#6B7280] font-medium leading-relaxed">
          {t('subtitle')}
        </p>

        {submitError && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-2xl text-sm font-semibold">
            {submitError}
          </div>
        )}

        <div className="space-y-4">
          {/* Full Name */}
          <div className="space-y-1">
            <label htmlFor="fullName" className="text-xs font-black uppercase tracking-wider text-[#111111]">
              {t('fullName')} *
            </label>
            <input
              id="fullName"
              type="text"
              disabled={isSubmitting}
              {...register('fullName')}
              className={`w-full p-4 border rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935] transition duration-150 text-[#111111] font-medium bg-[#F8F9FA] ${
                errors.fullName ? 'border-red-500 focus:border-red-500' : 'border-[#E5E7EB]'
              }`}
            />
            {errors.fullName && (
              <p className="text-red-500 text-xs font-semibold">{errors.fullName.message}</p>
            )}
          </div>

          {/* Phone Number */}
          <div className="space-y-1">
            <label htmlFor="phone" className="text-xs font-black uppercase tracking-wider text-[#111111]">
              {t('phone')} *
            </label>
            <input
              id="phone"
              type="text"
              disabled={isSubmitting}
              {...register('phone')}
              className={`w-full p-4 border rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935] transition duration-150 text-[#111111] font-medium bg-[#F8F9FA] ${
                errors.phone ? 'border-red-500 focus:border-red-500' : 'border-[#E5E7EB]'
              }`}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs font-semibold">{errors.phone.message}</p>
            )}
          </div>

          {/* Email Address */}
          <div className="space-y-1">
            <label htmlFor="email" className="text-xs font-black uppercase tracking-wider text-[#111111]">
              {t('email')}
            </label>
            <input
              id="email"
              type="text"
              disabled={isSubmitting}
              {...register('email')}
              className={`w-full p-4 border rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935] transition duration-150 text-[#111111] font-medium bg-[#F8F9FA] ${
                errors.email ? 'border-red-500 focus:border-red-500' : 'border-[#E5E7EB]'
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs font-semibold">{errors.email.message}</p>
            )}
          </div>

          {/* Delivery Address */}
          <div className="space-y-1">
            <label htmlFor="address" className="text-xs font-black uppercase tracking-wider text-[#111111]">
              {t('address')} *
            </label>
            <input
              id="address"
              type="text"
              disabled={isSubmitting}
              {...register('address')}
              className={`w-full p-4 border rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935] transition duration-150 text-[#111111] font-medium bg-[#F8F9FA] ${
                errors.address ? 'border-red-500 focus:border-red-500' : 'border-[#E5E7EB]'
              }`}
            />
            {errors.address && (
              <p className="text-red-500 text-xs font-semibold">{errors.address.message}</p>
            )}
          </div>

          {/* Special Delivery Note */}
          <div className="space-y-1">
            <label htmlFor="note" className="text-xs font-black uppercase tracking-wider text-[#111111]">
              {t('note')}
            </label>
            <textarea
              id="note"
              disabled={isSubmitting}
              {...register('note')}
              rows={3}
              className="w-full p-4 border border-[#E5E7EB] bg-[#F8F9FA] rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935] transition duration-150 resize-none text-[#111111] font-medium"
            />
          </div>
        </div>

        {/* Submit Action */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-[#E53935] text-white font-black uppercase tracking-widest rounded-full hover:bg-[#D32F2F] transition duration-150 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>{t('processing')}</span>
            </>
          ) : (
            <span>{t('placeOrder')}</span>
          )}
        </button>
      </form>

      {/* Cart Summary List - Right 5 columns */}
      <div className="lg:col-span-5 bg-white p-6 sm:p-7 rounded-3xl border border-[#E5E7EB] shadow-xs space-y-6">
        <h3 className="text-lg font-black text-[#111111] border-b border-[#E5E7EB] pb-4">
          Review Items
        </h3>

        {/* Review list */}
        <div className="divide-y divide-[#E5E7EB] max-h-[260px] overflow-y-auto pr-1">
          {items.map((item, idx) => {
            const optionsPrice = item.options.reduce((sum, opt) => sum + opt.price, 0);
            const price = (item.price + optionsPrice) * item.quantity;
            return (
              <div key={idx} className="py-3 flex justify-between items-start gap-4 text-sm font-semibold">
                <div>
                  <h4 className="font-extrabold text-[#111111]">
                    {isVi ? item.name_vi : item.name_en}
                    <span className="text-xs text-[#6B7280] font-black tracking-wider ml-1.5">
                      x{item.quantity}
                    </span>
                  </h4>
                  {item.options.length > 0 && (
                    <p className="text-xs text-[#6B7280] font-medium mt-0.5">
                      {item.options.map((o) => (isVi ? o.name_vi : o.name_en)).join(', ')}
                    </p>
                  )}
                </div>
                <span className="text-sm font-black text-[#E53935] shrink-0">
                  {price.toLocaleString()} {tc('currency')}
                </span>
              </div>
            );
          })}
        </div>

        {/* Available Vouchers List Section (Between items list and Subtotal) */}
        <div className="border-t border-[#E5E7EB] pt-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <TicketPercent className="w-4 h-4 text-[#EAAA08]" />
              <span className="text-xs font-black uppercase tracking-wider text-[#111111]">
                {t('vouchersTitle') || 'Mã Giảm Giá Khả Dụng'}
              </span>
            </div>
            {promotions.length > 0 && (
              <span className="text-[11px] font-bold text-neutral-400">
                {promotions.length} {locale === 'vi' ? 'voucher' : 'coupons'}
              </span>
            )}
          </div>

          {loadingPromos ? (
            <div className="flex justify-center py-4">
              <Loader2 className="w-5 h-5 text-[#EAAA08] animate-spin" />
            </div>
          ) : promotions.length === 0 ? (
            <p className="text-xs text-neutral-400 italic py-2">
              {t('vouchersEmpty') || 'Hiện chưa có mã ưu đãi nào'}
            </p>
          ) : (
            <div className="space-y-2.5 max-h-[240px] overflow-y-auto pr-1">
              {promotions.map((promo) => {
                const isSelected = selectedPromo?.id === promo.id;
                const isEligible = !promo.min_order_value || subtotal >= promo.min_order_value;
                const missingAmount = promo.min_order_value ? promo.min_order_value - subtotal : 0;

                const discountLabel =
                  promo.discount_type === 'PERCENTAGE'
                    ? `${promo.discount_value}%`
                    : `${Number(promo.discount_value).toLocaleString('vi-VN')} VND`;

                const minOrderLabel =
                  promo.min_order_value && promo.min_order_value > 0
                    ? `${t('minOrderShort') || 'Đơn từ'} ${Number(promo.min_order_value).toLocaleString('vi-VN')} VND`
                    : t('noMinOrderShort') || 'Mọi đơn hàng';

                return (
                  <div
                    key={promo.id}
                    onClick={() => isEligible && handleTogglePromo(promo)}
                    className={`relative p-3 rounded-2xl border transition-all duration-200 ${
                      isSelected
                        ? 'border-[#EAAA08] bg-gradient-to-r from-[#FFFBEB] via-[#FEF3C7]/40 to-[#FFFBEB] shadow-xs'
                        : isEligible
                        ? 'border-[#E5E7EB] bg-white hover:border-[#EAAA08]/70 hover:bg-[#FDFBF7] cursor-pointer'
                        : 'border-dashed border-[#E5E7EB] bg-neutral-50/70 opacity-65 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2.5">
                      {/* Left: Code, Discount & Condition */}
                      <div className="space-y-1 flex-1">
                        <div className="flex items-center space-x-2">
                          <Tag className={`w-3.5 h-3.5 ${isSelected ? 'text-[#B45309]' : 'text-[#EAAA08]'}`} />
                          <span className="font-mono font-black text-xs sm:text-sm text-[#111111] tracking-wide">
                            {promo.code}
                          </span>
                          <span className="inline-block px-2 py-0.5 rounded-full bg-[#E53935]/10 text-[#E53935] text-[10px] font-black uppercase tracking-wider">
                            Giảm {discountLabel}
                          </span>
                        </div>

                        <p className="text-[11px] text-neutral-500 font-medium">
                          {minOrderLabel}
                        </p>

                        {/* Ineligible warning hint */}
                        {!isEligible && missingAmount > 0 && (
                          <p className="text-[10px] font-bold text-amber-700 pt-0.5">
                            {t('needMore', { amount: `${missingAmount.toLocaleString('vi-VN')} VND` }) ||
                              `Mua thêm ${missingAmount.toLocaleString('vi-VN')} VND để dùng mã này`}
                          </p>
                        )}
                      </div>

                      {/* Right: Action Button / Status Badge */}
                      <div className="shrink-0 pt-0.5">
                        {isSelected ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTogglePromo(promo);
                            }}
                            className="px-2.5 py-1 rounded-xl bg-[#EAAA08] text-[#1E1B18] font-black text-[11px] uppercase tracking-wider flex items-center space-x-1 shadow-xs hover:bg-[#d89905] transition cursor-pointer"
                          >
                            <Check className="w-3 h-3 stroke-[3px]" />
                            <span>{t('deselect') || 'Bỏ chọn'}</span>
                          </button>
                        ) : isEligible ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTogglePromo(promo);
                            }}
                            className="px-2.5 py-1 rounded-xl bg-neutral-900 hover:bg-[#E53935] text-white font-bold text-[11px] uppercase tracking-wider transition cursor-pointer"
                          >
                            {t('apply') || 'Áp dụng'}
                          </button>
                        ) : (
                          <span className="px-2 py-0.5 rounded-lg bg-neutral-200/60 text-neutral-400 font-bold text-[10px] uppercase">
                            Chưa đủ ĐK
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Payment and Delivery Summary info */}
        <div className="border-t border-[#E5E7EB] pt-5 space-y-3 text-sm font-semibold text-[#6B7280]">
          {/* Subtotal */}
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="text-[#111111] font-bold">
              {subtotal.toLocaleString()} {tc('currency')}
            </span>
          </div>

          {/* Discount Row (Shown when promo is selected) */}
          {selectedPromo && discount > 0 && (
            <div className="flex justify-between items-center text-emerald-600 font-bold animate-in fade-in slide-in-from-top-1 duration-200">
              <div className="flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  {t('discount') || 'Giảm giá'} ({selectedPromo.code})
                </span>
                <button
                  type="button"
                  onClick={() => setSelectedPromo(null)}
                  className="p-1 text-neutral-400 hover:text-red-500 hover:bg-neutral-100 rounded-full transition cursor-pointer"
                  title={t('deselect') || 'Bỏ chọn'}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
              <span className="font-extrabold">
                -{discount.toLocaleString()} {tc('currency')}
              </span>
            </div>
          )}

          {/* Total Amount */}
          <div className="border-t border-[#E5E7EB] pt-4 flex justify-between items-end">
            <span className="text-base font-black text-[#111111]">Total Amount</span>
            <span className="text-2xl font-black text-[#E53935]">
              {total.toLocaleString()} {tc('currency')}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
