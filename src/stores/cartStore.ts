import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItemOption {
  id: string;
  name_vi: string;
  name_en: string;
  price: number;
}

export interface CartItem {
  productId: string;
  name_vi: string;
  name_en: string;
  price: number;
  image: string;
  quantity: number;
  options: CartItemOption[];
  note?: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, optionsHash: string) => void;
  updateQuantity: (productId: string, optionsHash: string, quantity: number) => void;
  clearCart: () => void;
}

export const getOptionsHash = (options: CartItemOption[]) => {
  return options
    .map((o) => o.id)
    .sort()
    .join('-');
};

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (newItem) =>
        set((state) => {
          const newHash = getOptionsHash(newItem.options);
          const existingItemIndex = state.items.findIndex(
            (item) =>
              item.productId === newItem.productId &&
              getOptionsHash(item.options) === newHash
          );

          if (existingItemIndex > -1) {
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex].quantity += newItem.quantity;
            return { items: updatedItems };
          }

          return { items: [...state.items, newItem] };
        }),
      removeItem: (productId, optionsHash) =>
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(
                item.productId === productId &&
                getOptionsHash(item.options) === optionsHash
              )
          ),
        })),
      updateQuantity: (productId, optionsHash, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId && getOptionsHash(item.options) === optionsHash
              ? { ...item, quantity: Math.max(1, quantity) }
              : item
          ),
        })),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: 'eggu-cart-storage',
    }
  )
);
