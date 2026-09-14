'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { ShoppingCart, Search, Menu, X } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import { useCartStore } from '@/stores/cartStore';

export default function Header() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const router = useRouter();
  
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Zustand cart items
  const cartItems = useCartStore((state) => state.items);
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration mismatches by counting only after mount
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const cartCount = isMounted
    ? cartItems.reduce((acc, item) => acc + item.quantity, 0)
    : 0;

  // Handle scroll shadow/border styling
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Navigation items: Giới thiệu, Thực đơn, Tin tức, Liên hệ
  const navLinks = [
    { href: '/about', label: t('about') },
    { href: '/menu', label: t('menu') },
    { href: '/news', label: t('news') },
    { href: '/contact', label: t('contact') },
  ];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/menu?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push('/menu');
    }
    setIsOpen(false);
  };

  const searchPlaceholder = t('searchPlaceholder') || 'thanh tìm kiếm bánh';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-[#E5E7EB]'
          : 'bg-white border-b border-[#E5E7EB]'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* 1. Logo (Far Left) */}
        <div className="flex-shrink-0">
          <Link
            href="/"
            aria-label="EGGU Home"
            className="flex items-center gap-2.5 group transition-transform duration-200 active:scale-95"
          >
            <div className="relative h-11 w-11 sm:h-12 sm:w-12 max-h-12 rounded-xl overflow-hidden bg-white shadow-xs border border-[#E5E7EB] group-hover:border-[#E53935]/40 group-hover:scale-105 transition-all duration-200 flex items-center justify-center">
              <Image
                src="/images/logo-icon.png"
                alt="EGGU Mascot"
                fill
                priority
                sizes="(max-width: 640px) 44px, 48px"
                className="object-contain p-1"
              />
            </div>
            <div className="relative h-7 sm:h-8 w-16 sm:w-20 flex items-center">
              <Image
                src="/images/logo-text.png"
                alt="Eggu"
                fill
                priority
                sizes="(max-width: 640px) 64px, 80px"
                className="object-contain object-left group-hover:scale-105 transition-transform duration-200"
              />
            </div>
          </Link>
        </div>

        {/* 2. Navigation Menu (Centered - Exactly 3 items: Giới thiệu, Menu, Liên hệ) */}
        <nav className="hidden md:flex items-center justify-center flex-1 space-x-1 lg:space-x-4">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 text-xs lg:text-sm font-extrabold uppercase tracking-wider rounded-full transition-all duration-200 ${
                  isActive
                    ? 'text-[#E53935] font-black'
                    : 'text-[#111111] hover:text-[#E53935] hover:bg-[#F8F9FA]'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#E53935] rounded-full" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* 3. Right Side Group: Search Bar -> Language Switcher -> Cart Icon */}
        <div className="hidden md:flex items-center gap-3">
          {/* Search Bar (Pill shape, placeholder, search icon on right) */}
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={searchPlaceholder}
              aria-label={searchPlaceholder}
              className="w-44 lg:w-56 pl-4 pr-9 py-1.5 text-xs lg:text-sm bg-[#F8F9FA] hover:bg-white focus:bg-white text-[#111111] placeholder:text-[#9CA3AF] rounded-full border border-[#E5E7EB] shadow-xs focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935] transition-all duration-200"
            />
            <button
              type="submit"
              aria-label="Search"
              className="absolute right-2.5 p-1 text-[#6B7280] hover:text-[#E53935] transition-colors"
            >
              <Search className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Language Switcher (Globe + VI/EN) */}
          <LanguageSwitcher />

          {/* Cart Icon (Far right) */}
          <Link
            href="/cart"
            aria-label={t('cart')}
            className="relative p-2 text-[#111111] hover:text-[#E53935] hover:bg-[#F8F9FA] rounded-full transition-colors duration-200"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 bg-[#E53935] text-white font-black text-[9px] rounded-full flex items-center justify-center shadow-xs animate-in zoom-in-50">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile Controls (Cart & Hamburger Menu) */}
        <div className="flex md:hidden items-center gap-2">
          {/* Cart icon on mobile */}
          <Link
            href="/cart"
            aria-label={t('cart')}
            className="relative p-2 text-[#111111] hover:text-[#E53935] hover:bg-[#F8F9FA] rounded-full transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 bg-[#E53935] text-white font-black text-[9px] rounded-full flex items-center justify-center shadow-xs">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>

          {/* Mobile Hamburger toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            className="p-2 text-[#111111] hover:text-[#E53935] hover:bg-[#F8F9FA] rounded-full transition-colors duration-200"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 top-16 bg-white z-40 border-t border-[#E5E7EB] p-6 flex flex-col justify-between overflow-y-auto animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="space-y-6">
            {/* Search Bar for Mobile */}
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={searchPlaceholder}
                aria-label={searchPlaceholder}
                className="w-full pl-4 pr-10 py-2.5 text-sm bg-[#F8F9FA] text-[#111111] placeholder:text-[#9CA3AF] rounded-full border border-[#E5E7EB] shadow-xs focus:outline-none focus:ring-2 focus:ring-[#E53935]/20 focus:border-[#E53935]"
              />
              <button
                type="submit"
                aria-label="Search"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#6B7280] hover:text-[#E53935]"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* 3 Nav Links */}
            <nav className="flex flex-col space-y-2 pt-2">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-2xl text-base font-extrabold uppercase tracking-wide transition-colors ${
                      isActive
                        ? 'bg-[#E53935] text-white shadow-xs'
                        : 'text-[#111111] hover:bg-[#F8F9FA] hover:text-[#E53935]'
                    }`}
                  >
                    <span>{link.label}</span>
                    {isActive && <span className="w-2 h-2 rounded-full bg-white" />}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Bottom section in mobile drawer */}
          <div className="border-t border-[#E5E7EB] pt-6 flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">
                Ngôn ngữ / Language
              </span>
              <LanguageSwitcher />
            </div>
            <p className="text-xs text-[#6B7280] text-center mt-2">
              © 2026 EGGU Korean Egg Sandwich. All rights reserved.
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
