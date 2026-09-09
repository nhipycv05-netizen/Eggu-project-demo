'use client';

import { useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useCartStore } from '@/stores/cartStore';
import { createOrder } from '@/features/orders/actions';
import { ShoppingBag, Loader2 } from 'lucide-react';

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
          <h2 className="text-2xl font-black text-[#111111]">{t('emptyCart')}</h2>
          <p className="text-sm text-[#6B7280] font-medium">{t('emptyCartDesc')}</p>
        </div>
      </div>
    );
  }

  const subtotal = items.reduce((sum, item) => {
    const optionsPrice = item.options.reduce((oSum, opt) => oSum + opt.price, 0);
    return sum + (item.price + optionsPrice) * item.quantity;
  }, 0);
  const total = subtotal;

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
      actionItems
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
          className="w-full py-4 bg-[#E53935] text-white font-black uppercase tracking-widest rounded-full hover:bg-[#D32F2F] transition duration-150 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
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
      <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-[#E5E7EB] shadow-xs space-y-6">
        <h3 className="text-lg font-black text-[#111111] border-b border-[#E5E7EB] pb-4">
          Review Items
        </h3>

        {/* Review list */}
        <div className="divide-y divide-[#E5E7EB] max-h-[300px] overflow-y-auto pr-1">
          {items.map((item, idx) => {
            const optionsPrice = item.options.reduce((sum, opt) => sum + opt.price, 0);
            const price = (item.price + optionsPrice) * item.quantity;
            return (
              <div key={idx} className="py-4 flex justify-between items-start gap-4 text-sm font-semibold">
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

        {/* Payment and Delivery Summary info */}
        <div className="border-t border-[#E5E7EB] pt-6 space-y-3 text-sm font-semibold text-[#6B7280]">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="text-[#111111] font-bold">
              {subtotal.toLocaleString()} {tc('currency')}
            </span>
          </div>
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
