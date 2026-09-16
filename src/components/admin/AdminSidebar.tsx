'use client';

import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  ClipboardList,
  ShoppingBag,
  Tags,
  MapPin,
  HelpCircle,
  FileText,
  Percent,
  LogOut,
  Info,
} from 'lucide-react';

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const MENU_ITEMS = [
  { id: 'orders', label: 'Đơn hàng', icon: ClipboardList },
  { id: 'products', label: 'Sản phẩm', icon: ShoppingBag },
  { id: 'categories', label: 'Danh mục', icon: Tags },
  { id: 'about', label: 'Giới thiệu', icon: Info },
  { id: 'stores', label: 'Cửa hàng', icon: MapPin },
  { id: 'faqs', label: 'Hỏi đáp (FAQ)', icon: HelpCircle },
  { id: 'news', label: 'Tin tức & Blog', icon: FileText },
  { id: 'promotions', label: 'Khuyến mãi', icon: Percent },
];

export default function AdminSidebar({ activeTab, setActiveTab }: AdminSidebarProps) {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      router.push('/admin/login');
      router.refresh();
    } catch (err) {
      console.error('Lỗi khi đăng xuất:', err);
    }
  };

  return (
    <aside className="w-64 bg-[#1E1B18] text-white flex flex-col justify-between shrink-0 h-screen sticky top-0 border-r border-white/5">
      {/* Brand logo details */}
      <div className="space-y-6">
        <div className="p-5 border-b border-white/5 flex items-center space-x-3">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-white p-0.5 shadow-xs border border-white/10 shrink-0 flex items-center justify-center">
            <Image
              src="/logo.png"
              alt="EGGU Admin Logo"
              fill
              sizes="40px"
              className="object-contain"
            />
          </div>
          <div>
            <h2 className="font-black text-sm tracking-tight text-white leading-none">
              EGGU Admin
            </h2>
            <span className="text-[10px] text-[#EAAA08] font-bold uppercase tracking-wider mt-1 block">
              Hệ Thống Quản Trị
            </span>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="px-4 space-y-1.5">
          {MENU_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold transition duration-150 ${
                  isActive
                    ? 'bg-[#EAAA08] text-[#1E1B18]'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4.5 h-4.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Logout triggers */}
      <div className="p-4 border-t border-white/5">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-500/10 transition duration-150"
        >
          <LogOut className="w-4.5 h-4.5" />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
}
