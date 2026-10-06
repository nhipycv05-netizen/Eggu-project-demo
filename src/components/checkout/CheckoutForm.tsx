'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useSearchParams } from 'next/navigation';
import { useCartStore } from '@/stores/cartStore';
import { createOrder, getActivePromotions } from '@/features/orders/actions';
import { ShoppingBag, Loader2, Tag, X, Check, TicketPercent, PhoneCall, Bike, Store, Zap, Clock } from 'lucide-react';
import { Promotion } from '@/types/promotion';
import { formatPrice } from '@/lib/utils';

const STORE_PICKUP_ADDRESS = 'Nhận tại: EGGU - 54 Nguyễn Hữu Huân, Hoàn Kiếm, Hà Nội';

const generatePickupTimeSlots = (): string[] => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  // Start at least 15 mins from now, rounded up to next 15-min mark
  let startMinutesTotal = currentHour * 60 + currentMinute + 15;
  const remainder = startMinutesTotal % 15;
  if (remainder !== 0) {
    startMinutesTotal += 15 - remainder;
  }

  // Store opening hours: 07:00 (420m) to 21:00 (1260m)
  const openTimeMinutes = 7 * 60;
  const closeTimeMinutes = 21 * 60;

  if (startMinutesTotal < openTimeMinutes) {
    startMinutesTotal = openTimeMinutes + 15;
  }

  const slots: string[] = [];
  for (let m = startMinutesTotal; m <= closeTimeMinutes; m += 15) {
    const hh = String(Math.floor(m / 60)).padStart(2, '0');
    const mm = String(m % 60).padStart(2, '0');
    slots.push(`${hh}:${mm}`);
  }

  // Fallback if store is near/past closing time today
  if (slots.length < 3) {
    const defaultSlots: string[] = [];
    for (let m = 7 * 60 + 30; m <= 21 * 60; m += 15) {
      const hh = String(Math.floor(m / 60)).padStart(2, '0');
      const mm = String(m % 60).padStart(2, '0');
      defaultSlots.push(`${hh}:${mm}`);
    }
    return defaultSlots;
  }

  return slots;
};

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
  const searchParams = useSearchParams();
  const { items, clearCart } = useCartStore();

  const initialDeliveryType = searchParams.get('type') === 'pickup' ? 'pickup' : 'delivery';
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'pickup'>(initialDeliveryType);

  // Pickup timing state
  const timeSlots = useMemo(() => generatePickupTimeSlots(), []);
  const [pickupTimingMode, setPickupTimingMode] = useState<'NOW' | 'SCHEDULED'>('NOW');
  const [scheduledTime, setScheduledTime] = useState<string>(timeSlots[0] || '11:30');

  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [pendingFormData, setPendingFormData] = useState<CheckoutFormValues | null>(null);

  // Promotions state
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loadingPromos, setLoadingPromos] = useState(true);
  const [selectedPromo, setSelectedPromo] = useState<Promotion | null>(null);

  const checkoutSchema = useMemo(() => {
    return z.object({
      fullName: z.string().min(2, { message: t('errors.nameRequired') }),
      phone: z.string().min(10, { message: t('errors.phoneRequired') }),
      email: z.string().email({ message: t('errors.emailInvalid') }).optional().or(z.literal('')),
      address:
        deliveryType === 'pickup'
          ? z.string()
          : z.string().min(5, { message: t('errors.addressRequired') }),
      note: z.string().optional(),
    });
  }, [t, deliveryType]);

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    clearErrors,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      email: '',
      address: initialDeliveryType === 'pickup' ? STORE_PICKUP_ADDRESS : '',
      note: '',
    },
  });

  // Keep deliveryType in sync if query param changes
  useEffect(() => {
    const typeParam = searchParams.get('type');
    if (typeParam === 'pickup') {
      setDeliveryType('pickup');
      setValue('address', STORE_PICKUP_ADDRESS);
      clearErrors('address');
    } else if (typeParam === 'delivery') {
      setDeliveryType('delivery');
      if (getValues('address') === STORE_PICKUP_ADDRESS) {
        setValue('address', '');
      }
    }
  }, [searchParams, setValue, getValues, clearErrors]);

  const handleSelectType = (type: 'delivery' | 'pickup') => {
    setDeliveryType(type);
    if (typeof window !== 'undefined') {
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.set('type', type);
      window.history.replaceState(null, '', newUrl.toString());
    }

    if (type === 'pickup') {
      setValue('address', STORE_PICKUP_ADDRESS);
      clearErrors('address');
    } else {
      if (getValues('address') === STORE_PICKUP_ADDRESS) {
        setValue('address', '');
      }
    }
  };

  const fetchActivePromos = useCallback(async () => {
    try {
      const data = await getActivePromotions();
      setPromotions(data || []);
    } catch (err) {
      console.error('Lỗi khi tải danh sách voucher:', err);
      setPromotions([]);
    } finally {
      setLoadingPromos(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    setTimeout(() => {
      if (active) {
        setIsMounted(true);
      }
    }, 0);

    fetchActivePromos();

    // Re-fetch on window focus to immediately sync when admin adds promotions
    const handleFocus = () => {
      fetchActivePromos();
    };
    window.addEventListener('focus', handleFocus);

    return () => {
      active = false;
      window.removeEventListener('focus', handleFocus);
    };
  }, [fetchActivePromos]);

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

  const onInitiateSubmit = (data: CheckoutFormValues) => {
    let finalNote = data.note?.trim() || '';
    if (deliveryType === 'pickup') {
      const timingLabel =
        pickupTimingMode === 'NOW'
          ? 'Lấy ngay (10-15 phút)'
          : scheduledTime || '11:30';
      const timingTag = `[Thời gian nhận: ${timingLabel}]`;
      finalNote = finalNote ? `${timingTag} ${finalNote}` : timingTag;
    }

    const finalData = {
      ...data,
      address: deliveryType === 'pickup' ? STORE_PICKUP_ADDRESS : data.address,
      note: finalNote,
    };
    setPendingFormData(finalData);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmOrder = async () => {
    if (!pendingFormData) return;
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
        fullName: pendingFormData.fullName,
        phone: pendingFormData.phone,
        email: pendingFormData.email,
        address: pendingFormData.address,
        note: pendingFormData.note,
      },
      actionItems,
      selectedPromo?.code
    );

    if (result.success && result.orderNumber) {
      clearCart();
      setIsConfirmModalOpen(false);
      router.push(`/order-success?order=${result.orderNumber}`);
    } else {
      setSubmitError(result.error || (isVi ? 'Đã có lỗi xảy ra khi tạo đơn hàng' : 'Failed to submit order'));
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Checkout Form - Right 7 columns on desktop, Bottom on mobile */}
      <form
        onSubmit={handleSubmit(onInitiateSubmit)}
        className="order-2 lg:order-2 lg:col-span-7 bg-white p-5 sm:p-6 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-4"
      >
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-[#111111]">
            {deliveryType === 'pickup' ? t('titlePickup') : t('title')}
          </h2>
          <p className="text-xs sm:text-sm text-[#6B7280] font-medium leading-relaxed">
            {deliveryType === 'pickup' ? t('subtitlePickup') : t('subtitle')}
          </p>
        </div>

        {/* Fulfillment Method Switcher Tabs */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block">
            {t('fulfillmentMethod')}
          </label>
          <div className="grid grid-cols-2 gap-2 p-1 bg-[#F8F9FA] rounded-xl border border-[#E5E7EB]">
            <button
              type="button"
              onClick={() => handleSelectType('delivery')}
              className={`py-2 px-3 sm:px-3.5 rounded-lg font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all duration-150 cursor-pointer ${
                deliveryType === 'delivery'
                  ? 'bg-white text-[#E53935] shadow-xs border border-[#E53935]/20 ring-1 ring-[#E53935]/15'
                  : 'text-[#6B7280] hover:text-[#111111]'
              }`}
            >
              <Bike className={`w-4 h-4 shrink-0 ${deliveryType === 'delivery' ? 'text-[#E53935]' : 'text-neutral-400'}`} />
              <span className="truncate">{t('deliveryOption')}</span>
            </button>

            <button
              type="button"
              onClick={() => handleSelectType('pickup')}
              className={`py-2 px-3 sm:px-3.5 rounded-lg font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 transition-all duration-150 cursor-pointer ${
                deliveryType === 'pickup'
                  ? 'bg-white text-[#B45309] shadow-xs border border-[#EAAA08]/40 ring-1 ring-[#EAAA08]/20'
                  : 'text-[#6B7280] hover:text-[#111111]'
              }`}
            >
              <Store className={`w-4 h-4 shrink-0 ${deliveryType === 'pickup' ? 'text-[#B45309]' : 'text-neutral-400'}`} />
              <span className="truncate">{t('pickupOption')}</span>
            </button>
          </div>
        </div>

        {submitError && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs sm:text-sm font-semibold">
            {submitError}
          </div>
        )}

        <div className="space-y-3">
          {/* Full Name */}
          <div className="space-y-1">
            <label htmlFor="fullName" className="text-xs font-bold uppercase tracking-wider text-gray-700 block">
              {t('fullName')} *
            </label>
            <input
              id="fullName"
              type="text"
              disabled={isSubmitting}
              {...register('fullName')}
              className={`w-full h-10 px-3.5 py-2 border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935] transition duration-150 text-[#111111] font-medium bg-[#F8F9FA] ${
                errors.fullName ? 'border-red-500 focus:border-red-500' : 'border-[#E5E7EB]'
              }`}
            />
            {errors.fullName && (
              <p className="text-red-500 text-xs font-semibold">{errors.fullName.message}</p>
            )}
          </div>

          {/* Phone Number */}
          <div className="space-y-1">
            <label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-gray-700 block">
              {t('phone')} *
            </label>
            <input
              id="phone"
              type="text"
              disabled={isSubmitting}
              {...register('phone')}
              className={`w-full h-10 px-3.5 py-2 border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935] transition duration-150 text-[#111111] font-medium bg-[#F8F9FA] ${
                errors.phone ? 'border-red-500 focus:border-red-500' : 'border-[#E5E7EB]'
              }`}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs font-semibold">{errors.phone.message}</p>
            )}
          </div>

          {/* Email Address */}
          <div className="space-y-1">
            <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-gray-700 block">
              {t('email')}
            </label>
            <input
              id="email"
              type="text"
              disabled={isSubmitting}
              {...register('email')}
              className={`w-full h-10 px-3.5 py-2 border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935] transition duration-150 text-[#111111] font-medium bg-[#F8F9FA] ${
                errors.email ? 'border-red-500 focus:border-red-500' : 'border-[#E5E7EB]'
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs font-semibold">{errors.email.message}</p>
            )}
          </div>

          {/* Delivery Address (if Delivery) or Fixed Store Address Card (if Pickup) */}
          {deliveryType === 'delivery' ? (
            <div className="space-y-1 animate-in fade-in duration-150">
              <label htmlFor="address" className="text-xs font-bold uppercase tracking-wider text-gray-700 block">
                {t('address')} *
              </label>
              <input
                id="address"
                type="text"
                disabled={isSubmitting}
                {...register('address')}
                placeholder={isVi ? 'Số nhà, tên đường, phường/xã, quận/huyện...' : 'Street address, ward, district...'}
                className={`w-full h-10 px-3.5 py-2 border rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935] transition duration-150 text-[#111111] font-medium bg-[#F8F9FA] ${
                  errors.address ? 'border-red-500 focus:border-red-500' : 'border-[#E5E7EB]'
                }`}
              />
              {errors.address && (
                <p className="text-red-500 text-xs font-semibold">{errors.address.message}</p>
              )}
            </div>
          ) : (
            <div className="p-3.5 sm:p-4 bg-gradient-to-br from-[#FFFBEB] via-[#FEF3C7]/30 to-[#FFFBEB] border-2 border-[#EAAA08]/50 rounded-xl space-y-1.5 shadow-xs animate-in fade-in duration-200">
              <div className="flex items-center space-x-2 text-[#B45309]">
                <div className="w-7 h-7 rounded-lg bg-[#EAAA08]/25 flex items-center justify-center shrink-0">
                  <Store className="w-4 h-4 text-[#B45309]" />
                </div>
                <span className="text-xs font-bold uppercase tracking-wider">
                  {t('pickupAddressTitle')}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-extrabold text-[#111111] leading-snug">
                {STORE_PICKUP_ADDRESS}
              </p>
              <p className="text-[11px] font-semibold text-[#B45309]/90">
                {t('pickupAddressNote')}
              </p>
            </div>
          )}

          {/* Pickup Timing Selection (Only for Pickup) */}
          {deliveryType === 'pickup' && (
            <div className="space-y-1.5 pt-0.5 animate-in fade-in duration-200">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block">
                THỜI GIAN NHẬN MÓN *
              </label>
              <div className="grid grid-cols-2 gap-2.5 mb-2">
                {/* Option 1: Lấy ngay */}
                <button
                  type="button"
                  onClick={() => setPickupTimingMode('NOW')}
                  className={`p-2.5 sm:p-3 rounded-xl border-2 text-left transition-all duration-150 cursor-pointer ${
                    pickupTimingMode === 'NOW'
                      ? 'border-[#EAAA08] bg-gradient-to-br from-[#FFFBEB] via-[#FEF3C7]/40 to-[#FFFBEB] shadow-xs ring-1 ring-[#EAAA08]/40'
                      : 'border-[#E5E7EB] bg-[#F8F9FA] hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                        pickupTimingMode === 'NOW'
                          ? 'bg-[#EAAA08] text-[#1E1B18]'
                          : 'bg-neutral-200 text-neutral-600'
                      }`}
                    >
                      <Zap className="w-3.5 h-3.5 fill-current" />
                    </div>
                    <span
                      className={`text-xs sm:text-sm font-extrabold ${
                        pickupTimingMode === 'NOW' ? 'text-[#1E1B18]' : 'text-neutral-700'
                      }`}
                    >
                      Lấy ngay
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-neutral-500 font-medium mt-1 leading-normal">
                    Quán chuẩn bị trong 10 - 15 phút
                  </p>
                </button>

                {/* Option 2: Đặt giờ dự kiến */}
                <button
                  type="button"
                  onClick={() => setPickupTimingMode('SCHEDULED')}
                  className={`p-2.5 sm:p-3 rounded-xl border-2 text-left transition-all duration-150 cursor-pointer ${
                    pickupTimingMode === 'SCHEDULED'
                      ? 'border-[#EAAA08] bg-gradient-to-br from-[#FFFBEB] via-[#FEF3C7]/40 to-[#FFFBEB] shadow-xs ring-1 ring-[#EAAA08]/40'
                      : 'border-[#E5E7EB] bg-[#F8F9FA] hover:border-neutral-300'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                        pickupTimingMode === 'SCHEDULED'
                          ? 'bg-[#EAAA08] text-[#1E1B18]'
                          : 'bg-neutral-200 text-neutral-600'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                    </div>
                    <span
                      className={`text-xs sm:text-sm font-extrabold ${
                        pickupTimingMode === 'SCHEDULED' ? 'text-[#1E1B18]' : 'text-neutral-700'
                      }`}
                    >
                      Đặt giờ dự kiến
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-neutral-500 font-medium mt-1 leading-normal">
                    Chọn giờ ghé lấy bánh
                  </p>
                </button>
              </div>

              {/* Flexible Time Picker dropdown if SCHEDULED */}
              {pickupTimingMode === 'SCHEDULED' && (
                <div className="p-3 bg-gradient-to-br from-[#FFFBEB] via-[#FEF3C7]/20 to-[#FFFBEB] border border-[#EAAA08]/50 rounded-xl space-y-1.5 animate-in fade-in slide-in-from-top-1 duration-200 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <label htmlFor="scheduledPickupTime" className="text-xs font-bold text-[#1E1B18]">
                      Khung giờ bạn dự kiến ghé lấy *
                    </label>
                    <span className="text-[10px] font-bold text-amber-800 bg-amber-200/60 px-2 py-0.5 rounded">
                      Mỗi 15 phút
                    </span>
                  </div>
                  <div className="relative">
                    <select
                      id="scheduledPickupTime"
                      value={scheduledTime}
                      onChange={(e) => setScheduledTime(e.target.value)}
                      className="w-full h-10 px-3 pr-10 border border-[#EAAA08]/60 rounded-xl text-xs sm:text-sm font-bold text-neutral-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#EAAA08]/30 focus:border-[#EAAA08] cursor-pointer shadow-xs"
                    >
                      {timeSlots.map((time) => (
                        <option key={time} value={time}>
                          {time} (Hôm nay)
                        </option>
                      ))}
                    </select>
                    <Clock className="w-4 h-4 text-[#B45309] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-neutral-500 font-medium">
                    Tiệm mở cửa từ 07:00 đến 21:00. Vui lòng ghé đúng giờ để bánh luôn nóng giòn nhé!
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Special Delivery Note / Pickup Note */}
          <div className="space-y-1">
            <label htmlFor="note" className="text-xs font-bold uppercase tracking-wider text-gray-700 block">
              {deliveryType === 'pickup' ? 'GHI CHÚ CHO TIỆM (TÙY CHỌN)' : t('note')}
            </label>
            <textarea
              id="note"
              disabled={isSubmitting}
              {...register('note')}
              rows={2}
              placeholder={
                deliveryType === 'pickup'
                  ? (isVi ? 'Ví dụ: Cần nhiều ớt, sốt ngọt để riêng...' : 'e.g., Extra chili, sauce on the side...')
                  : t('deliveryNotePlaceholder')
              }
              className="w-full px-3.5 py-2 border border-[#E5E7EB] bg-[#F8F9FA] rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935] transition duration-150 resize-none text-[#111111] font-medium"
            />
          </div>
        </div>

        {/* Submit Action */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 bg-[#e0352b] hover:bg-red-700 text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-full transition duration-150 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>{t('processing')}</span>
            </>
          ) : (
            <span>{t('placeOrder')}</span>
          )}
        </button>
      </form>

      {/* Review Items List - Left 5 columns on desktop, Top on mobile */}
      <div className="order-1 lg:order-1 lg:col-span-5 bg-white p-5 sm:p-6 rounded-2xl border border-[#E5E7EB] shadow-xs space-y-3.5">
        <h3 className="text-base sm:text-lg font-black text-[#111111] border-b border-[#E5E7EB] pb-3">
          {t('reviewItems') || 'Review Items'}
        </h3>

        {/* Review list */}
        <div className="divide-y divide-[#E5E7EB] max-h-[240px] overflow-y-auto pr-1">
          {items.map((item, idx) => {
            const optionsPrice = item.options.reduce((sum, opt) => sum + opt.price, 0);
            const price = (item.price + optionsPrice) * item.quantity;
            return (
              <div key={idx} className="py-2.5 flex justify-between items-start gap-4 text-xs sm:text-sm font-semibold">
                <div>
                  <h4 className="font-extrabold text-[#111111]">
                    {isVi ? item.name_vi : item.name_en}
                    <span className="text-xs text-[#6B7280] font-bold tracking-wider ml-1.5">
                      x{item.quantity}
                    </span>
                  </h4>
                  {item.options.length > 0 && (
                    <p className="text-[11px] sm:text-xs text-[#6B7280] font-medium mt-0.5">
                      {item.options.map((o) => (isVi ? o.name_vi : o.name_en)).join(', ')}
                    </p>
                  )}
                </div>
                <span className="text-xs sm:text-sm font-black text-[#E53935] shrink-0">
                  {formatPrice(price)} {tc('currency')}
                </span>
              </div>
            );
          })}
        </div>

        {/* Available Vouchers List Section (Between items list and Subtotal) */}
        <div className="border-t border-[#E5E7EB] pt-3 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <TicketPercent className="w-4 h-4 text-[#EAAA08]" />
              <span className="text-xs font-bold uppercase tracking-wider text-gray-700">
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
            <div className="flex justify-center py-3">
              <Loader2 className="w-4 h-4 text-[#EAAA08] animate-spin" />
            </div>
          ) : promotions.length === 0 ? (
            <p className="text-xs text-neutral-400 italic py-1.5">
              {t('vouchersEmpty') || (isVi ? 'Không có mã giảm giá nào khả dụng' : 'No coupons available')}
            </p>
          ) : (
            <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
              {promotions.map((promo) => {
                const isSelected = selectedPromo?.id === promo.id;
                const isEligible = !promo.min_order_value || subtotal >= promo.min_order_value;
                const missingAmount = promo.min_order_value ? promo.min_order_value - subtotal : 0;

                const discountLabel =
                  promo.discount_type === 'PERCENTAGE'
                    ? `${promo.discount_value}%`
                    : `${formatPrice(promo.discount_value)} VND`;

                const minOrderLabel =
                  promo.min_order_value && promo.min_order_value > 0
                    ? `${t('minOrderShort') || 'Đơn từ'} ${formatPrice(promo.min_order_value)} VND`
                    : t('noMinOrderShort') || 'Mọi đơn hàng';

                return (
                  <div
                    key={promo.id}
                    onClick={() => isEligible && handleTogglePromo(promo)}
                    className={`relative p-2.5 rounded-xl border transition-all duration-200 ${
                      isSelected
                        ? 'border-[#EAAA08] bg-gradient-to-r from-[#FFFBEB] via-[#FEF3C7]/40 to-[#FFFBEB] shadow-xs'
                        : isEligible
                        ? 'border-[#E5E7EB] bg-white hover:border-[#EAAA08]/70 hover:bg-[#FDFBF7] cursor-pointer'
                        : 'border-dashed border-[#E5E7EB] bg-neutral-50/70 opacity-65 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2.5">
                      {/* Left: Code, Discount & Condition */}
                      <div className="space-y-0.5 flex-1">
                        <div className="flex items-center space-x-1.5 flex-wrap gap-y-1">
                          <Tag className={`w-3.5 h-3.5 ${isSelected ? 'text-[#B45309]' : 'text-[#EAAA08]'}`} />
                          <span className="font-mono font-bold text-xs sm:text-sm text-[#111111] tracking-wide">
                            {promo.code}
                          </span>
                          <span className="inline-block px-1.5 py-0.5 rounded-full bg-[#E53935]/10 text-[#E53935] text-[10px] font-bold uppercase tracking-wider">
                            Giảm {discountLabel}
                          </span>
                        </div>

                        <p className="text-[11px] text-neutral-500 font-medium">
                          {minOrderLabel}
                        </p>

                        {/* Ineligible warning hint */}
                        {!isEligible && missingAmount > 0 && (
                          <p className="text-[10px] font-bold text-amber-700 pt-0.5">
                            {t('needMore', { amount: `${formatPrice(missingAmount)} VND` }) ||
                              `Mua thêm ${formatPrice(missingAmount)} VND để dùng mã này`}
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
                            className="px-2 py-0.5 rounded-lg bg-[#EAAA08] text-[#1E1B18] font-bold text-[10px] uppercase tracking-wider flex items-center space-x-1 shadow-xs hover:bg-[#d89905] transition cursor-pointer"
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
                            className="px-2 py-0.5 rounded-lg bg-neutral-900 hover:bg-[#E53935] text-white font-bold text-[10px] uppercase tracking-wider transition cursor-pointer"
                          >
                            {t('apply') || 'Áp dụng'}
                          </button>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded-md bg-neutral-200/60 text-neutral-400 font-bold text-[10px] uppercase">
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
        <div className="border-t border-[#E5E7EB] pt-3 space-y-2 text-xs sm:text-sm font-semibold text-[#6B7280]">
          {/* Subtotal */}
          <div className="flex justify-between">
            <span>{t('subtotal') || 'Subtotal'}</span>
            <span className="text-[#111111] font-bold">
              {formatPrice(subtotal)} {tc('currency')}
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
                  className="p-0.5 text-neutral-400 hover:text-red-500 hover:bg-neutral-100 rounded-full transition cursor-pointer"
                  title={t('deselect') || 'Bỏ chọn'}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
              <span className="font-extrabold">
                -{formatPrice(discount)} {tc('currency')}
              </span>
            </div>
          )}

          {/* Total Amount */}
          <div className="border-t border-[#E5E7EB] pt-2.5 flex justify-between items-baseline">
            <span className="text-xs sm:text-sm font-extrabold text-[#111111]">{t('total') || 'Total Amount'}</span>
            <span className="text-lg sm:text-xl font-black text-[#E53935]">
              {formatPrice(total)} {tc('currency')}
            </span>
          </div>
        </div>
      </div>

      {/* Phone Confirmation Modal */}
      {isConfirmModalOpen && pendingFormData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div
            className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-[#E5E7EB] space-y-5 animate-in zoom-in-95 duration-200"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-phone-modal-title"
          >
            {/* Header Icon & Title */}
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-[#e0352b]/10 text-[#e0352b] rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xs">
                <PhoneCall className="w-7 h-7" />
              </div>
              <h3 id="confirm-phone-modal-title" className="text-xl sm:text-2xl font-black text-[#111111]">
                {t('confirmPhoneModal.title')}
              </h3>
              <p className="text-sm text-[#6B7280] font-medium leading-relaxed">
                {t('confirmPhoneModal.message')}
              </p>
            </div>

            {/* Prominent Phone Number Display */}
            <div className="bg-[#FFF5F5] border-2 border-[#e0352b]/20 rounded-2xl p-4 text-center space-y-1">
              <div className="inline-flex items-center space-x-1.5 text-xs font-black px-3 py-1 rounded-full bg-[#e0352b]/10 text-[#e0352b] mb-1">
                {deliveryType === 'pickup' ? (
                  <>
                    <Store className="w-3.5 h-3.5" />
                    <span>{t('pickupOption')}</span>
                    <span className="ml-1 text-[10px] font-bold bg-[#e0352b]/20 px-1.5 py-0.5 rounded">
                      {pickupTimingMode === 'NOW' ? '⚡ Lấy ngay' : `🕒 ${scheduledTime}`}
                    </span>
                  </>
                ) : (
                  <>
                    <Bike className="w-3.5 h-3.5" />
                    <span>{t('deliveryOption')}</span>
                  </>
                )}
              </div>
              <p className="text-[11px] uppercase font-black text-neutral-400 tracking-wider">
                {t('phone')}
              </p>
              <div className="text-xl sm:text-2xl font-black text-[#e0352b] py-1 tracking-wide select-all">
                {pendingFormData.phone}
              </div>
              <p className="text-xs font-bold text-neutral-700 truncate">
                {pendingFormData.fullName}
              </p>
              <p className="text-[11px] font-semibold text-neutral-500 leading-snug">
                {pendingFormData.address}
              </p>
              {deliveryType === 'pickup' && (
                <p className="text-[11px] font-bold text-amber-800 pt-0.5">
                  Thời gian nhận: {pickupTimingMode === 'NOW' ? 'Lấy ngay (10 - 15 phút)' : scheduledTime}
                </p>
              )}
            </div>

            {/* Submit Error inside modal if any */}
            {submitError && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-semibold">
                {submitError}
              </div>
            )}

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => {
                  setIsConfirmModalOpen(false);
                  setSubmitError(null);
                }}
                className="w-full py-3.5 px-4 rounded-full border border-neutral-300 hover:bg-neutral-100 text-neutral-800 font-bold text-sm transition duration-150 order-2 sm:order-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t('confirmPhoneModal.change')}
              </button>

              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleConfirmOrder}
                className="w-full py-3.5 px-4 rounded-full bg-[#e0352b] hover:bg-[#c92e25] text-white font-black text-sm uppercase tracking-wider transition duration-150 shadow-md hover:shadow-lg flex items-center justify-center space-x-2 order-1 sm:order-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{t('processing')}</span>
                  </>
                ) : (
                  <span>{t('confirmPhoneModal.confirm')}</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
