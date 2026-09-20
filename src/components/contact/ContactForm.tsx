'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslations } from 'next-intl';
import { CheckCircle2, AlertCircle, Loader2, Send } from 'lucide-react';

const contactSchema = z.object({
  name: z.string().min(2, { message: 'Họ và tên phải có ít nhất 2 ký tự' }),
  email: z
    .string()
    .email({ message: 'Địa chỉ email không hợp lệ' })
    .optional()
    .or(z.literal('')),
  phone: z
    .string()
    .min(8, { message: 'Số điện thoại phải có ít nhất 8 chữ số' })
    .regex(/^[0-9+.\s()-]+$/, { message: 'Số điện thoại chứa ký tự không hợp lệ' }),
  message: z.string().min(5, { message: 'Nội dung tin nhắn phải có ít nhất 5 ký tự' }),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactForm() {
  const t = useTranslations('contact');
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || t('error'));
      }

      setIsSuccess(true);
      reset();
      setTimeout(() => setIsSuccess(false), 6000);
    } catch (err) {
      console.error('Lỗi gửi tin nhắn liên hệ:', err);
      setErrorMessage(err instanceof Error ? err.message : t('error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5E7EB] shadow-xs space-y-6">
      <h2 className="text-2xl font-black text-[#111111]">{t('formTitle')}</h2>

      {isSuccess && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-2xl text-sm font-semibold flex items-start gap-3">
          <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
          <p>{t('success')}</p>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-2xl text-sm font-semibold flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <p>{errorMessage}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-xs font-black uppercase tracking-wider text-[#111111]">
            {t('name')} *
          </label>
          <input
            id="name"
            type="text"
            disabled={isSubmitting}
            placeholder={t('namePlaceholder')}
            {...register('name')}
            className={`w-full p-4 border rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935] transition duration-150 text-[#111111] font-medium bg-[#F8F9FA] ${
              errors.name ? 'border-red-500 focus:border-red-500' : 'border-[#E5E7EB]'
            }`}
          />
          {errors.name && (
            <p className="text-red-500 text-xs font-semibold">{errors.name.message}</p>
          )}
        </div>

        {/* Email Address */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-xs font-black uppercase tracking-wider text-[#111111]">
            {t('email')}
          </label>
          <input
            id="email"
            type="email"
            disabled={isSubmitting}
            placeholder={t('emailPlaceholder')}
            {...register('email')}
            className={`w-full p-4 border rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935] transition duration-150 text-[#111111] font-medium bg-[#F8F9FA] ${
              errors.email ? 'border-red-500 focus:border-red-500' : 'border-[#E5E7EB]'
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs font-semibold">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <label htmlFor="phone" className="text-xs font-black uppercase tracking-wider text-[#111111]">
            {t('phone')} *
          </label>
          <input
            id="phone"
            type="tel"
            disabled={isSubmitting}
            placeholder={t('phonePlaceholder')}
            {...register('phone')}
            className={`w-full p-4 border rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935] transition duration-150 text-[#111111] font-medium bg-[#F8F9FA] ${
              errors.phone ? 'border-red-500 focus:border-red-500' : 'border-[#E5E7EB]'
            }`}
          />
          {errors.phone && (
            <p className="text-red-500 text-xs font-semibold">{errors.phone.message}</p>
          )}
        </div>

        {/* Message */}
        <div className="space-y-1.5">
          <label htmlFor="message" className="text-xs font-black uppercase tracking-wider text-[#111111]">
            {t('message')} *
          </label>
          <textarea
            id="message"
            disabled={isSubmitting}
            placeholder={t('messagePlaceholder')}
            {...register('message')}
            rows={4}
            className={`w-full p-4 border rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935] transition duration-150 resize-none text-[#111111] font-medium bg-[#F8F9FA] ${
              errors.message ? 'border-red-500 focus:border-red-500' : 'border-[#E5E7EB]'
            }`}
          />
          {errors.message && (
            <p className="text-red-500 text-xs font-semibold">{errors.message.message}</p>
          )}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-[#E53935] text-white font-black uppercase tracking-widest rounded-full hover:bg-[#D32F2F] transition duration-150 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>{t('sending')}</span>
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              <span>{t('submit')}</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
