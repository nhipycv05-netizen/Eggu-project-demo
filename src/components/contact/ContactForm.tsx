'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useTranslations } from 'next-intl';

const contactSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Invalid email address' }).optional().or(z.literal('')),
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
      email: '',
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
    <div className="bg-white p-8 rounded-3xl border border-[#E5E0D8] shadow-sm space-y-6">
      <h2 className="text-2xl font-black text-[#1E1B18]">{t('formTitle')}</h2>

      {isSuccess && (
        <div className="p-4 bg-[#22C55E]/15 border border-[#22C55E]/30 text-[#166534] rounded-xl text-sm font-semibold">
          {t('success')}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Full Name */}
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-[#706860]">
            {t('name')} *
          </label>
          <input
            id="name"
            type="text"
            disabled={isSubmitting}
            {...register('name')}
            className={`w-full p-4 border rounded-xl text-sm focus:outline-none focus:border-[#EAAA08] transition duration-150 text-[#1E1B18] font-medium bg-[#FAF8F5]/50 ${
              errors.name ? 'border-red-500 focus:border-red-500' : 'border-[#E5E0D8]'
            }`}
          />
          {errors.name && (
            <p className="text-red-500 text-xs font-semibold">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-xs font-bold uppercase tracking-wider text-[#706860]">
            {t('email')}
          </label>
          <input
            id="email"
            type="text"
            disabled={isSubmitting}
            {...register('email')}
            className={`w-full p-4 border rounded-xl text-sm focus:outline-none focus:border-[#EAAA08] transition duration-150 text-[#1E1B18] font-medium bg-[#FAF8F5]/50 ${
              errors.email ? 'border-red-500 focus:border-red-500' : 'border-[#E5E0D8]'
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-xs font-semibold">{errors.email.message}</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <label htmlFor="phone" className="text-xs font-bold uppercase tracking-wider text-[#706860]">
            {t('phone')} *
          </label>
          <input
            id="phone"
            type="text"
            disabled={isSubmitting}
            {...register('phone')}
            className={`w-full p-4 border rounded-xl text-sm focus:outline-none focus:border-[#EAAA08] transition duration-150 text-[#1E1B18] font-medium bg-[#FAF8F5]/50 ${
              errors.phone ? 'border-red-500 focus:border-red-500' : 'border-[#E5E0D8]'
            }`}
          />
          {errors.phone && (
            <p className="text-red-500 text-xs font-semibold">{errors.phone.message}</p>
          )}
        </div>

        {/* Message */}
        <div className="space-y-1.5">
          <label htmlFor="message" className="text-xs font-bold uppercase tracking-wider text-[#706860]">
            {t('message')} *
          </label>
          <textarea
            id="message"
            disabled={isSubmitting}
            {...register('message')}
            rows={4}
            className={`w-full p-4 border rounded-xl text-sm focus:outline-none focus:border-[#EAAA08] transition duration-150 resize-none text-[#1E1B18] font-medium bg-[#FAF8F5]/50 ${
              errors.message ? 'border-red-500 focus:border-red-500' : 'border-[#E5E0D8]'
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
          className="w-full py-4 bg-[#EAAA08] text-[#1E1B18] font-extrabold uppercase tracking-widest rounded-xl hover:bg-[#EAAA08]/90 transition duration-150 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Sending...' : t('submit')}
        </button>
      </form>
    </div>
  );
}
