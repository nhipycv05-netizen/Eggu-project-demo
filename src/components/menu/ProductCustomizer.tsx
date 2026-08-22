'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useCartStore, CartItemOption } from '@/stores/cartStore';
import { Plus, Minus, Check, ShoppingBag } from 'lucide-react';

interface DBProductOption {
  id: string;
  name_vi: string;
  name_en: string;
  price: number;
}

interface ProductCustomizerProps {
  product: {
    id: string;
    name_vi: string;
    name_en: string;
    price: number;
    image_url: string;
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

  // Toggle option selection
  const handleToggleOption = (option: DBProductOption) => {
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
    const cartOptions: CartItemOption[] = selectedOptions.map((o) => ({
      id: o.id,
      name_vi: o.name_vi,
      name_en: o.name_en,
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
          <h3 className="text-sm font-bold text-[#706860] uppercase tracking-wider">
            {tp('options')}
          </h3>
          <div className="space-y-3">
            {options.map((option) => {
              const isSelected = selectedOptions.some((o) => o.id === option.id);
              return (
                <button
                  key={option.id}
                  onClick={() => handleToggleOption(option)}
                  className={`w-full p-4 rounded-xl border flex items-center justify-between transition-all duration-200 ${
                    isSelected
                      ? 'border-[#EAAA08] bg-[#FFF6DF] shadow-sm'
                      : 'border-[#E5E0D8] bg-white hover:border-[#706860]'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-[#EAAA08] border-[#EAAA08] text-[#1E1B18]'
                          : 'border-[#E5E0D8] bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3px]" />}
                    </div>
                    <span className="font-bold text-[#1E1B18] text-sm">
                      {isVi ? option.name_vi : option.name_en}
                    </span>
                  </div>
                  <span className="text-sm font-extrabold text-[#5C4B3E]">
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
        <label htmlFor="note" className="text-sm font-bold text-[#706860] uppercase tracking-wider block">
          {tp('note')}
        </label>
        <textarea
          id="note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={tp('notePlaceholder')}
          rows={3}
          className="w-full p-4 border border-[#E5E0D8] bg-white rounded-xl text-sm focus:outline-none focus:border-[#EAAA08] transition duration-150 resize-none font-medium text-[#1E1B18]"
        />
      </div>

      {/* Quantity & Add to Cart Action Bar */}
      <div className="border-t border-[#E5E0D8] pt-6 space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-sm font-bold text-[#706860] uppercase tracking-wider">
            {tp('quantity')}
          </span>
          <div className="flex items-center bg-[#EFECE6] border border-[#E5E0D8] rounded-xl p-1">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-2 hover:bg-white rounded-lg transition duration-150"
            >
              <Minus className="w-4 h-4 text-[#1E1B18]" />
            </button>
            <span className="px-6 font-extrabold text-sm text-[#1E1B18] min-w-[50px] text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-2 hover:bg-white rounded-lg transition duration-150"
            >
              <Plus className="w-4 h-4 text-[#1E1B18]" />
            </button>
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="bg-[#5C4B3E]/5 p-4 rounded-xl border border-[#E5E0D8]/50 flex items-center justify-between">
          <span className="text-sm font-bold text-[#706860] uppercase tracking-wider">
            {tp('totalPrice')}
          </span>
          <span className="text-2xl font-black text-[#5C4B3E]">
            {totalPrice.toLocaleString()} {tc('currency')}
          </span>
        </div>

        {/* Action Button */}
        <button
          onClick={handleAddToCart}
          disabled={isAdded}
          className={`w-full py-4 text-sm font-extrabold uppercase tracking-widest rounded-xl shadow-lg flex items-center justify-center space-x-2 transition-all duration-300 ${
            isAdded
              ? 'bg-[#22C55E] text-white shadow-none'
              : 'bg-[#EAAA08] text-[#1E1B18] hover:bg-[#EAAA08]/90 hover:shadow-xl'
          }`}
        >
          <ShoppingBag className="w-5 h-5" />
          <span>{isAdded ? tp('addedToCart') : tm('addToCart')}</span>
        </button>
      </div>
    </div>
  );
}
