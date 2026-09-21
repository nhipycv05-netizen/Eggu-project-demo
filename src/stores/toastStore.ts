import { create } from 'zustand';

export interface CartToastItem {
  id: string;
  name_vi: string;
  name_en: string;
  image?: string;
  price?: number;
  quantity?: number;
}

interface ToastState {
  toast: CartToastItem | null;
  showCartToast: (item: Omit<CartToastItem, 'id'>) => void;
  hideCartToast: () => void;
}

export const useToastStore = create<ToastState>((set) => ({
  toast: null,
  showCartToast: (item) => {
    const id = Date.now().toString();
    set({ toast: { ...item, id } });
  },
  hideCartToast: () => set({ toast: null }),
}));
