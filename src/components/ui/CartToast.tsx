'use client';

import { useEffect } from 'react';
import { useToastStore } from '@/stores/toastStore';
import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import SafeImage from '@/components/ui/SafeImage';
import { CheckCircle2, ArrowRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartToast() {
  const { toast, hideCartToast } = useToastStore();
  const locale = useLocale();
  const isVi = locale === 'vi';
  const t = useTranslations('cartToast');

  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      hideCartToast();
    }, 4500);

    return () => clearTimeout(timer);
  }, [toast, hideCartToast]);

  const itemName = toast ? (isVi ? toast.name_vi : toast.name_en) : '';

  return (
    <AnimatePresence>
      {toast && (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="fixed bottom-28 sm:bottom-20 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-auto sm:max-w-md pointer-events-auto"
        >
          <div className="relative overflow-hidden rounded-2xl bg-white/95 backdrop-blur-md p-3.5 sm:p-4 shadow-2xl shadow-black/15 border border-gray-100 ring-1 ring-black/5 flex items-center gap-3.5">
            {/* Product Thumbnail */}
            <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-neutral-100 shrink-0 border border-black/5">
              <SafeImage
                src={toast.image || '/images/hero-sandwich.jpg'}
                alt={itemName}
                fill
                sizes="48px"
                className="object-cover"
              />
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-0.5 shadow-sm">
                <CheckCircle2 className="w-3.5 h-3.5 fill-emerald-500 text-white" />
              </div>
            </div>

            {/* Notification Text & Actions */}
            <div className="flex-1 min-w-0 pr-6">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
                  {t('title')}
                </span>
                {toast.quantity && toast.quantity > 1 && (
                  <span className="px-1.5 py-0.2 bg-neutral-100 text-neutral-700 text-[10px] font-bold rounded-full">
                    x{toast.quantity}
                  </span>
                )}
              </div>
              <p className="text-sm font-black text-[#111111] truncate mt-0.5">
                {itemName}
              </p>
              <div className="mt-1">
                <Link
                  href="/cart"
                  onClick={hideCartToast}
                  className="inline-flex items-center gap-1 text-xs font-black text-[#E53935] hover:text-[#D32F2F] transition-colors group"
                >
                  <span>{t('viewCart')}</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5] transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              </div>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={hideCartToast}
              aria-label="Close notification"
              className="absolute top-2.5 right-2.5 p-1 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-4 h-4 stroke-[2]" />
            </button>

            {/* Auto dismiss progress bar */}
            <motion.div
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 4.5, ease: 'linear' }}
              className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E53935] to-[#FFC107] origin-left"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
