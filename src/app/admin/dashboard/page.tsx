'use client';

import { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import OrdersTab from '@/components/admin/OrdersTab';
import ProductsTab from '@/components/admin/ProductsTab';
import CategoriesTab from '@/components/admin/CategoriesTab';
import AboutTab from '@/components/admin/AboutTab';
import StoresTab from '@/components/admin/StoresTab';
import FaqsTab from '@/components/admin/FaqsTab';
import NewsTab from '@/components/admin/NewsTab';
import PromotionsTab from '@/components/admin/PromotionsTab';
import { Loader2 } from 'lucide-react';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState('orders');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    let active = true;
    setTimeout(() => {
      if (active) {
        setIsMounted(true);
        if (typeof window !== 'undefined') {
          const params = new URLSearchParams(window.location.search);
          const tab = params.get('tab');
          if (tab) {
            setActiveTab(tab);
          }
        }
      }
    }, 0);
    return () => {
      active = false;
    };
  }, []);

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#EAAA08] animate-spin" />
      </div>
    );
  }

  // Active Tab content mapping
  const renderTabContent = () => {
    switch (activeTab) {
      case 'orders':
        return <OrdersTab />;
      case 'products':
        return <ProductsTab />;
      case 'categories':
        return <CategoriesTab />;
      case 'about':
        return <AboutTab />;
      case 'stores':
        return <StoresTab />;
      case 'faqs':
        return <FaqsTab />;
      case 'news':
        return <NewsTab />;
      case 'promotions':
        return <PromotionsTab />;
      default:
        return <OrdersTab />;
    }
  };

  // Tab titles mapping in Vietnamese
  const TAB_NAMES: Record<string, string> = {
    orders: 'Quản lý đơn hàng',
    products: 'Quản lý sản phẩm',
    categories: 'Quản lý danh mục',
    about: 'Quản lý Giới thiệu',
    stores: 'Hệ thống cửa hàng',
    faqs: 'Hỏi đáp (FAQ)',
    news: 'Tin tức & Bài viết',
    promotions: 'Chương trình khuyến mãi',
  };

  return (
    <main className="min-h-screen flex bg-neutral-50 text-neutral-900 font-sans">
      {/* Sidebar navigation */}
      <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Workspace content panel */}
      <div className="flex-grow p-8 overflow-y-auto max-h-screen">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Top Panel bar info */}
          <div className="flex items-center justify-between border-b border-neutral-200 pb-5">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
              Bảng điều khiển / {TAB_NAMES[activeTab] || activeTab}
            </span>
            <div className="flex items-center space-x-3 text-xs font-bold text-neutral-500">
              <span className="capitalize">{new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-green-600 uppercase tracking-wider text-[10px]">Hệ thống hoạt động</span>
            </div>
          </div>

          {/* Active section grid */}
          <div className="transition duration-150">
            {renderTabContent()}
          </div>
        </div>
      </div>
    </main>
  );
}
