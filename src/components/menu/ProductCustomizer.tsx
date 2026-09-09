'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useCartStore, CartItemOption } from '@/stores/cartStore';
import { Plus, Minus, Check, ShoppingBag } from 'lucide-react';

interface DBProductOption {
  id: string;
  name?: string;
  name_vi?: string;
  name_en?: string;
  price: number;
}

interface ProductCustomizerProps {
  product: {
    id: string;
    name_vi: string;
    name_en: string;
    price: number;
    image_url: string;
    is_available?: boolean;
  };
  options: DBProductOption[];
  locale: string;
}

export default function ProductCustomizer({ product, options, locale }: ProductCustomizerProps) {
  const tm = useTranslations('menu');
  const tp = useTranslations('product');
  const tc = useTranslations('common');
  const router = useRouter();
  const addItem = useCartStore((state) => state.addItem);

  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<DBProductOption[]>([]);
  const [note, setNote] = useState('');
  const [isAdded, setIsAdded] = useState(false);

  const isVi = locale === 'vi';
  const isSoldOut = product.is_available === false;

  // Toggle option selection
  const handleToggleOption = (option: DBProductOption) => {
    if (isSoldOut) return;
    const isSelected = selectedOptions.some((o) => o.id === option.id);
    if (isSelected) {
      setSelectedOptions(selectedOptions.filter((o) => o.id !== option.id));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  // Calculate prices
  const optionsPrice = selectedOptions.reduce((sum, opt) => sum + Number(opt.price), 0);
  const unitPrice = Number(product.price) + optionsPrice;
  const totalPrice = unitPrice * quantity;

  // Add to cart handler
  const handleAddToCart = () => {
    if (isSoldOut) return;
    const cartOptions: CartItemOption[] = selectedOptions.map((o) => ({
      id: o.id,
      name_vi: o.name_vi || o.name || '',
      name_en: o.name_en || o.name || '',
      price: Number(o.price),
    }));

    addItem({
      productId: product.id,
      name_vi: product.name_vi,
      name_en: product.name_en,
      price: Number(product.price),
      image: product.image_url || '/images/hero-sandwich.jpg',
      quantity,
      options: cartOptions,
      note: note.trim() || undefined,
    });

    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      router.push('/cart');
    }, 1500);
  };

  return (
    <div className="space-y-8">
      {/* Option Customizer List */}
      {options.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-sm font-black text-[#111111] uppercase tracking-wider">
            {tp('options')}
          </h3>
          <div className="space-y-3">
            {options.map((option) => {
              const isSelected = selectedOptions.some((o) => o.id === option.id);
              return (
                <button
                  key={option.id}
                  onClick={() => handleToggleOption(option)}
                  className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all duration-200 ${
                    isSelected
                      ? 'border-[#E53935] bg-[#E53935]/5 shadow-xs'
                      : 'border-[#E5E7EB] bg-white hover:border-[#111111]'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-[#E53935] border-[#E53935] text-white'
                          : 'border-[#E5E7EB] bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3px]" />}
                    </div>
                    <span className="font-bold text-[#111111] text-sm">
                      {option.name || (isVi ? option.name_vi : option.name_en)}
                    </span>
                  </div>
                  <span className="text-sm font-black text-[#E53935]">
                    +{Number(option.price).toLocaleString()} {tc('currency')}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Special Instruction Note */}
      <div className="space-y-2">
        <label htmlFor="note" className="text-sm font-black text-[#111111] uppercase tracking-wider block">
          {tp('note')}
        </label>
        <textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={tp('notePlaceholder')}
          rows={3}
          className="w-full p-4 border border-[#E5E7EB] bg-white rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935] transition duration-150 resize-none font-medium text-[#111111]"
        />
      </div>

      {/* Quantity & Add to Cart Action Bar */}
      <div className="border-t border-[#E5E7EB] pt-6 space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-black text-[#111111] uppercase tracking-wider">
            {tp('quantity')}
          </span>
          <div className="flex items-center bg-[#F8F9FA] border border-[#E5E7EB] rounded-full p-1">
            <button
              type="button"
              disabled={isSoldOut}
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-2 hover:bg-white rounded-full transition duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Minus className="w-4 h-4 text-[#111111]" />
            </button>
            <span className="px-6 font-black text-sm text-[#111111] min-w-[50px] text-center">
              {quantity}
            </span>
            <button
              type="button"
              disabled={isSoldOut}
              onClick={() => setQuantity(quantity + 1)}
              className="p-2 hover:bg-white rounded-full transition duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Plus className="w-4 h-4 text-[#111111]" />
            </button>
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="bg-[#F8F9FA] p-4 rounded-2xl border border-[#E5E7EB] flex items-center justify-between">
          <span className="text-sm font-black text-[#111111] uppercase tracking-wider">
            {tp('totalPrice')}
          </span>
          <span className="text-2xl font-black text-[#E53935]">
            {totalPrice.toLocaleString()} {tc('currency')}
          </span>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={isAdded || isSoldOut}
          className={`w-full py-4 text-sm font-black uppercase tracking-widest rounded-full shadow-md flex items-center justify-center space-x-2 transition-all duration-300 ${
            isSoldOut
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
              : isAdded
              ? 'bg-[#22C55E] text-white shadow-none'
              : 'bg-[#E53935] text-white hover:bg-[#D32F2F] hover:shadow-xl active:scale-98'
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
          <span>
            {isSoldOut
              ? isVi
                ? 'HẾT HÀNG'
                : 'SOLD OUT'
              : isAdded
              ? tp('addedToCart')
              : tm('addToCart')}
          </span>
        </button>
      </div>
    </div>
  );
}
