'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/navigation';
import { useCartStore, CartItemOption } from '@/stores/cartStore';
import { useToastStore } from '@/stores/toastStore';
import { Plus, Minus, Check, ShoppingBag, Zap } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

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
    category?: string;
    category_slug?: string;
    slug?: string;
  };
  options: DBProductOption[];
  locale: string;
  category?: string;
}

export function isDrinkProduct(
  category?: string,
  categorySlug?: string,
  nameVi?: string,
  nameEn?: string,
  slug?: string
): boolean {
  const norm = (str?: string) => (str || '').toLowerCase().trim();
  const c = norm(category);
  const cs = norm(categorySlug);
  const nVi = norm(nameVi);
  const nEn = norm(nameEn);
  const s = norm(slug);

  // 1. Direct Category codes/slugs ('drink', 'coffee', 'smoothie', 'coffee-drinks', 'smoothie-fresh-juice' etc.)
  const drinkCategorySlugs = [
    'drink',
    'drinks',
    'coffee',
    'coffee-drinks',
    'ca-phe',
    'ca-phe-do-uong',
    'smoothie',
    'smoothie-fresh-juice',
    'sinh-to',
    'sinh-to-nuoc-ep',
    'juice',
    'fresh-juice',
    'nuoc-ep',
    'beverage',
    'beverages',
    'tea',
    'tra',
    '3c333333-3333-3333-3333-333333333333',
    '4d444444-4444-4444-4444-444444444444',
  ];

  if (drinkCategorySlugs.some((id) => c === id || cs === id || c.includes(id) || cs.includes(id))) {
    return true;
  }

  // 2. Category names in Vietnamese / English ('Cà Phê & Đồ Uống', 'Sinh Tố & Nước Ép', etc.)
  if (
    c.includes('cà phê') ||
    c.includes('đồ uống') ||
    c.includes('sinh tố') ||
    c.includes('nước ép') ||
    c.includes('coffee') ||
    c.includes('smoothie') ||
    c.includes('juice') ||
    cs.includes('cà phê') ||
    cs.includes('đồ uống') ||
    cs.includes('sinh tố') ||
    cs.includes('nước ép')
  ) {
    return true;
  }

  // 3. Fallback name / slug matching
  const drinkKeywords = [
    'cà phê',
    'ca phe',
    'coffee',
    'americano',
    'latte',
    'cappuccino',
    'capuchino',
    'espresso',
    'sinh tố',
    'sinh to',
    'smoothie',
    'nước ép',
    'nuoc ep',
    'juice',
    'matcha',
    'trà',
    'tea',
    'cold brew',
    'chocolate',
  ];

  if (drinkKeywords.some((kw) => nVi.includes(kw) || nEn.includes(kw) || s.includes(kw))) {
    return true;
  }

  return false;
}

export default function ProductCustomizer({ product, options, locale, category }: ProductCustomizerProps) {
  const router = useRouter();
  const tm = useTranslations('menu');
  const tp = useTranslations('product');
  const tc = useTranslations('common');
  const addItem = useCartStore((state) => state.addItem);
  const showCartToast = useToastStore((state) => state.showCartToast);

  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<DBProductOption[]>([]);
  const [note, setNote] = useState('');
  const [isAdded, setIsAdded] = useState(false);

  const isVi = locale === 'vi';
  const isSoldOut = product.is_available === false;

  // Determine if product is Drink/Coffee/Smoothie to customize the note placeholder
  const isDrink = isDrinkProduct(
    category || product.category || product.category_slug,
    product.category_slug,
    product.name_vi,
    product.name_en,
    product.slug
  );

  const notePlaceholder = isDrink
    ? (tp('drinkNotePlaceholder') || (isVi ? 'Ví dụ: Giảm ngọt (50% đường), ít đá, uống nóng...' : 'e.g. Less sweet (50% sugar), less ice, hot...'))
    : (tp('notePlaceholder') || (isVi ? 'Ví dụ: Không hành, sốt ngọt để riêng...' : 'e.g. No onion, extra sauce on the side...'));

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

    showCartToast({
      name_vi: product.name_vi,
      name_en: product.name_en,
      image: product.image_url || '/images/hero-sandwich.jpg',
      price: totalPrice,
      quantity,
    });

    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1800);
  };

  // Direct order now handler (adds to cart & redirects to /cart)
  const handleOrderNow = () => {
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

    router.push('/cart');
  };

  return (
    <div className="space-y-4">
      {/* Option Customizer List */}
      {options.length > 0 && (
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-[#111111] uppercase tracking-wider">
            {tp('options')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {options.map((option) => {
              const isSelected = selectedOptions.some((o) => o.id === option.id);
              const optName = (option.name || (isVi ? option.name_vi : option.name_en) || '').toLowerCase();
              const isPopular =
                option.id === 'cheese' ||
                option.id === 'bacon' ||
                optName.includes('cheese') ||
                optName.includes('phô mai') ||
                optName.includes('bacon') ||
                optName.includes('xông khói');

              return (
                <button
                  key={option.id}
                  onClick={() => handleToggleOption(option)}
                  className={`w-full py-2 px-3.5 rounded-xl border flex items-center justify-between transition-all duration-200 cursor-pointer ${
                    isSelected
                      ? 'border-[#E53935] bg-[#E53935]/5 shadow-xs'
                      : 'border-[#E5E7EB] bg-white hover:border-[#111111]'
                  }`}
                >
                  <div className="flex items-center space-x-2 min-w-0">
                    <div
                      className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors shrink-0 ${
                        isSelected
                          ? 'bg-[#E53935] border-[#E53935] text-white'
                          : 'border-[#E5E7EB] bg-white'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3px]" />}
                    </div>
                    <span className="font-semibold text-[#111111] text-xs sm:text-sm truncate">
                      {option.name || (isVi ? option.name_vi : option.name_en)}
                    </span>
                    {isPopular && (
                      <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.5 rounded-md shrink-0">
                        {isVi ? '⭐ Gợi ý' : '⭐ Top'}
                      </span>
                    )}
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-[#E53935] shrink-0 ml-2">
                    +{formatPrice(option.price)} {tc('currency')}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Special Instruction Note (Compact 1-row input) */}
      <div className="space-y-1">
        <label htmlFor="note" className="text-xs font-bold text-[#111111] uppercase tracking-wider block">
          {tp('note')}
        </label>
        <input
          id="note"
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder={notePlaceholder}
          className="w-full py-1.5 px-3 border border-[#E5E7EB] bg-white rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935] transition duration-150 font-medium text-[#111111]"
        />
      </div>

      {/* Combined Quantity & Pricing on 1 row */}
      <div className="flex items-center justify-between py-2 border-t border-[#E5E7EB] gap-3">
        {/* Quantity stepper */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-[#111111] uppercase tracking-wider">
            {tp('quantity')}:
          </span>
          <div className="flex items-center bg-[#F8F9FA] border border-[#E5E7EB] rounded-full p-0.5">
            <button
              type="button"
              disabled={isSoldOut}
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-1 hover:bg-white rounded-full transition duration-150 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5 text-[#111111]" />
            </button>
            <span className="px-3 font-bold text-sm text-[#111111] min-w-[32px] text-center">
              {quantity}
            </span>
            <button
              type="button"
              disabled={isSoldOut}
              onClick={() => setQuantity(quantity + 1)}
              className="p-1 hover:bg-white rounded-full transition duration-150 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-[#111111]" />
            </button>
          </div>
        </div>

        {/* Total Price */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-[#6B7280] uppercase tracking-wider hidden sm:inline">
            {tp('totalPrice')}:
          </span>
          <span className="text-lg sm:text-xl font-black text-[#E53935]">
            {formatPrice(totalPrice)} {tc('currency')}
          </span>
        </div>
      </div>

      {/* 2 Action Buttons: In-flow on desktop, Sticky Bottom Bar on mobile */}
      <div className="fixed sm:static bottom-0 left-0 right-0 z-40 bg-white/95 sm:bg-transparent backdrop-blur-md sm:backdrop-blur-none border-t border-[#E5E0D8] sm:border-0 p-3 sm:p-0 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] sm:shadow-none pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))] sm:pb-0">
        <div className="max-w-md mx-auto sm:max-w-none">
          {/* Mobile-only compact row with total price */}
          <div className="flex sm:hidden items-center justify-between mb-2 px-1">
            <span className="text-xs font-bold text-[#706860] uppercase tracking-wider">
              {tp('totalPrice')}:
            </span>
            <span className="text-base font-black text-[#e0352b]">
              {formatPrice(totalPrice)} {tc('currency')}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
            {/* Nút 1: THÊM VÀO GIỎ */}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isAdded || isSoldOut}
              className={`w-full h-11 sm:h-12 py-2 px-2 sm:px-4 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-full flex items-center justify-center space-x-1.5 sm:space-x-2 transition-all duration-200 select-none ${
                isSoldOut
                  ? 'border-2 border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed shadow-none'
                  : isAdded
                  ? 'border-2 border-[#22C55E] bg-[#22C55E] text-white shadow-xs'
                  : 'border-2 border-[#e0352b] bg-white text-[#e0352b] hover:bg-red-50 active:scale-98 shadow-xs cursor-pointer'
              }`}
            >
              {isAdded ? (
                <Check className="w-4 h-4 stroke-[3] shrink-0" />
              ) : (
                <ShoppingBag className="w-4 h-4 shrink-0" />
              )}
              <span className="truncate">
                {isSoldOut
                  ? isVi
                    ? 'HẾT HÀNG'
                    : 'SOLD OUT'
                  : isAdded
                  ? tp('added')
                  : tm('addToCart')}
              </span>
            </button>

            {/* Nút 2: ĐẶT HÀNG NGAY */}
            <button
              type="button"
              onClick={handleOrderNow}
              disabled={isSoldOut}
              className={`w-full h-11 sm:h-12 py-2 px-2 sm:px-4 text-xs sm:text-sm font-bold uppercase tracking-wider rounded-full shadow-md flex items-center justify-center space-x-1.5 sm:space-x-2 transition-all duration-200 select-none ${
                isSoldOut
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed shadow-none'
                  : 'bg-[#e0352b] hover:bg-red-700 text-white hover:shadow-lg active:scale-98 cursor-pointer'
              }`}
            >
              <Zap className="w-4 h-4 fill-current shrink-0" />
              <span className="truncate">
                {isSoldOut
                  ? isVi
                    ? 'HẾT HÀNG'
                    : 'SOLD OUT'
                  : tm('orderNow')}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
