'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslations } from 'next-intl';

const contactSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  phone: z.string().min(10, { message: 'Phone must be at least 10 digits' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters' }),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactForm() {
  const t = useTranslations('contact');
  const [isSuccess, setIsSuccess] = useState(false);
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
      phone: '',
      message: '',
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    // Mimic API submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Contact form submitted data:', data);
    setIsSubmitting(false);
    setIsSuccess(true);
    reset();
    setTimeout(() => setIsSuccess(false), 5000);
  };

  return (
    <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5E7EB] shadow-xs space-y-6">
      <h2 className="text-2xl font-black text-[#111111]">{t('formTitle')}</h2>

      {isSuccess && (
        <div className="p-4 bg-[#22C55E]/15 border border-[#22C55E]/30 text-[#166534] rounded-2xl text-sm font-semibold">
          {t('success')}
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
            {...register('name')}
            className={`w-full p-4 border rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935] transition duration-150 text-[#111111] font-medium bg-[#F8F9FA] ${
              errors.name ? 'border-red-500 focus:border-red-500' : 'border-[#E5E7EB]'
            }`}
          />
          {errors.name && (
            <p className="text-red-500 text-xs font-semibold">{errors.name.message}</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
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

        {/* Message */}
        <div className="space-y-1.5">
          <label htmlFor="message" className="text-xs font-black uppercase tracking-wider text-[#111111]">
            {t('message')} *
          </label>
          <textarea
            id="message"
            disabled={isSubmitting}
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
          className="w-full py-4 bg-[#E53935] text-white font-black uppercase tracking-widest rounded-full hover:bg-[#D32F2F] transition duration-150 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Sending...' : t('submit')}
        </button>
      </form>
    </div>
  );
}
