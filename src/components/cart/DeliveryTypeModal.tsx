'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Bike, Store, X, ChevronRight } from 'lucide-react';

interface DeliveryTypeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: 'delivery' | 'pickup') => void;
}

export default function DeliveryTypeModal({
  isOpen,
  onClose,
  onSelect,
}: DeliveryTypeModalProps) {
  const t = useTranslations('cart');

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-[#E5E7EB] space-y-6 animate-in zoom-in-95 duration-200 relative"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delivery-type-modal-title"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 rounded-full transition duration-150 cursor-pointer"
          aria-label={t('fulfillmentModal.close')}
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="space-y-1.5 pr-8">
          <span className="inline-block px-3 py-1 rounded-full bg-[#E53935]/10 text-[#E53935] text-xs font-black uppercase tracking-wider">
            EGGU Checkout
          </span>
          <h3
            id="delivery-type-modal-title"
            className="text-xl sm:text-2xl font-black text-[#111111]"
          >
            {t('fulfillmentModal.title')}
          </h3>
          <p className="text-sm text-[#6B7280] font-medium leading-relaxed">
            {t('fulfillmentModal.subtitle')}
          </p>
        </div>

        {/* Option Cards */}
        <div className="space-y-3.5 pt-1">
          {/* Option 1: Doorstep Delivery */}
          <button
            type="button"
            onClick={() => onSelect('delivery')}
            className="w-full border-2 border-[#E5E7EB] hover:border-[#E53935] hover:bg-gradient-to-r hover:from-[#FFF5F5] hover:to-white transition-all duration-150 rounded-2xl p-4 sm:p-5 flex items-center justify-between text-left group cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-[#E53935]/30"
          >
            <div className="flex items-center space-x-4 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-[#E53935]/10 text-[#E53935] flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-[#E53935] group-hover:text-white transition duration-200">
                <Bike className="w-6 h-6" />
              </div>
              <div className="min-w-0 space-y-0.5">
                <div className="flex items-center space-x-2">
                  <h4 className="text-base font-black text-[#111111] group-hover:text-[#E53935] transition duration-150">
                    {t('fulfillmentModal.deliveryTitle')}
                  </h4>
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-[#E53935]/10 text-[#E53935] text-[10px] font-black uppercase tracking-wider">
                    {t('fulfillmentModal.deliveryBadge')}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#6B7280] font-medium leading-normal">
                  {t('fulfillmentModal.deliveryDesc')}
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-[#E53935] group-hover:translate-x-1 transition duration-150 shrink-0 ml-2" />
          </button>

          {/* Option 2: Store Takeaway / Pickup */}
          <button
            type="button"
            onClick={() => onSelect('pickup')}
            className="w-full border-2 border-[#E5E7EB] hover:border-[#EAAA08] hover:bg-gradient-to-r hover:from-[#FFFBEB] hover:to-white transition-all duration-150 rounded-2xl p-4 sm:p-5 flex items-center justify-between text-left group cursor-pointer shadow-xs focus:outline-none focus:ring-2 focus:ring-[#EAAA08]/30"
          >
            <div className="flex items-center space-x-4 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-[#EAAA08]/15 text-[#B45309] flex items-center justify-center shrink-0 group-hover:scale-105 group-hover:bg-[#EAAA08] group-hover:text-[#1E1B18] transition duration-200">
                <Store className="w-6 h-6" />
              </div>
              <div className="min-w-0 space-y-0.5">
                <div className="flex items-center space-x-2">
                  <h4 className="text-base font-black text-[#111111] group-hover:text-[#B45309] transition duration-150">
                    {t('fulfillmentModal.pickupTitle')}
                  </h4>
                  <span className="hidden sm:inline-block px-2 py-0.5 rounded-md bg-[#EAAA08]/20 text-[#B45309] text-[10px] font-black uppercase tracking-wider">
                    {t('fulfillmentModal.pickupBadge')}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-[#6B7280] font-medium leading-normal">
                  {t('fulfillmentModal.pickupDesc')}
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-[#B45309] group-hover:translate-x-1 transition duration-150 shrink-0 ml-2" />
          </button>
        </div>
      </div>
    </div>
  );
}
