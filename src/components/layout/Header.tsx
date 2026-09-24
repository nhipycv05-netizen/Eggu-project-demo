'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { ShoppingCart, Menu, X, ChevronDown } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import { useCartStore } from '@/stores/cartStore';
import SearchBar from '@/components/menu/SearchBar';

export default function Header() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const router = useRouter();
  
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Zustand cart items
  const cartItems = useCartStore((state) => state.items);
  const [isMounted, setIsMounted] = useState(false);
  const [isBumping, setIsBumping] = useState(false);

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

  const prevCountRef = useRef(cartCount);

  // Bounce/bump animation whenever cart count increases
  useEffect(() => {
    if (isMounted && cartCount > prevCountRef.current) {
      setIsBumping(true);
      const timer = setTimeout(() => setIsBumping(false), 500);
      return () => clearTimeout(timer);
    }
    prevCountRef.current = cartCount;
  }, [cartCount, isMounted]);

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

  // Menu Dropdown categories
  const menuCategories = [
    { href: '/menu', label: t('allCategories') || 'Tất cả', slug: 'all' },
    { href: '/menu?category=sandwich', label: t('catSandwich') || 'Sandwich', slug: 'sandwich' },
    { href: '/menu?category=fried-food', label: t('catFriedFood') || 'Món chiên', slug: 'fried-food' },
    { href: '/menu?category=coffee-drinks', label: t('catCoffeeDrinks') || 'Cà phê & Đồ uống', slug: 'coffee-drinks' },
    { href: '/menu?category=smoothie-fresh-juice', label: t('catSmoothieJuice') || 'Sinh tố & Nước ép', slug: 'smoothie-fresh-juice' },
  ];

  const searchPlaceholder = t('searchPlaceholder') || 'Thanh tìm kiếm bánh';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white border-b border-gray-100 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm'
          : 'bg-white shadow-xs'
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

        {/* 2. Navigation Menu (Centered) */}
        <nav className="hidden md:flex items-center justify-center flex-1 space-x-1 lg:space-x-2">
          {navLinks.map((link) => {
            const isMenu = link.href === '/menu';
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);

            if (isMenu) {
              return (
                <div key={link.href} className="relative group/menu py-2">
                  <Link
                    href={link.href}
                    className={`relative inline-flex items-center gap-1.5 px-4 py-2 text-xs lg:text-sm font-extrabold uppercase tracking-wider rounded-full transition-all duration-200 ${
                      isActive
                        ? 'text-[#E53935] font-black'
                        : 'text-[#111111] hover:text-[#E53935] hover:bg-[#F8F9FA]'
                    }`}
                  >
                    <span>{link.label}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-500 group-hover/menu:text-[#E53935] group-hover/menu:rotate-180 transition-all duration-200" />
                    {isActive && (
                      <span className="absolute bottom-0 left-4 right-4 h-0.5 bg-[#E53935] rounded-full" />
                    )}
                  </Link>

                  {/* Dropdown Menu on Hover */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-56 opacity-0 invisible translate-y-2 pointer-events-none group-hover/menu:opacity-100 group-hover/menu:visible group-hover/menu:translate-y-0 group-hover/menu:pointer-events-auto group-focus-within/menu:opacity-100 group-focus-within/menu:visible group-focus-within/menu:translate-y-0 group-focus-within/menu:pointer-events-auto transition-all duration-200 ease-out z-50">
                    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-1.5 backdrop-blur-md">
                      {menuCategories.map((cat) => (
                        <Link
                          key={cat.href}
                          href={cat.href}
                          className="flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-bold text-[#333333] hover:text-[#E53935] hover:bg-[#FFF5F5] transition-all duration-150 group/item"
                        >
                          <span>{cat.label}</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-[#E53935] opacity-0 group-hover/item:opacity-100 transition-opacity" />
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            }

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
          {/* Search Bar (Pill shape, live autocomplete suggestions, quick clear) */}
          <SearchBar
            placeholder={searchPlaceholder}
            className="w-48 lg:w-64"
            dropdownClassName="right-0 w-80 sm:w-96"
          />

          {/* Language Switcher (Globe + VI/EN) */}
          <LanguageSwitcher />

          {/* Cart Icon (Far right) */}
          <Link
            href="/cart"
            aria-label={t('cart')}
            className={`relative p-2 text-[#111111] hover:text-[#E53935] hover:bg-[#F8F9FA] rounded-full transition-all duration-300 ${
              isBumping ? 'scale-115 text-[#E53935]' : ''
            }`}
          >
            <ShoppingCart className={`w-5 h-5 transition-transform duration-300 ${isBumping ? 'rotate-12' : ''}`} />
            {cartCount > 0 && (
              <span className={`absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 bg-[#E53935] text-white font-black text-[9px] rounded-full flex items-center justify-center shadow-xs transition-transform duration-300 ${
                isBumping ? 'scale-125 ring-2 ring-[#E53935]/40' : ''
              }`}>
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
            className={`relative p-2 text-[#111111] hover:text-[#E53935] hover:bg-[#F8F9FA] rounded-full transition-all duration-300 ${
              isBumping ? 'scale-115 text-[#E53935]' : ''
            }`}
          >
            <ShoppingCart className={`w-5 h-5 transition-transform duration-300 ${isBumping ? 'rotate-12' : ''}`} />
            {cartCount > 0 && (
              <span className={`absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 bg-[#E53935] text-white font-black text-[9px] rounded-full flex items-center justify-center shadow-xs transition-transform duration-300 ${
                isBumping ? 'scale-125 ring-2 ring-[#E53935]/40' : ''
              }`}>
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
        <div className="md:hidden fixed inset-0 top-16 bg-white z-40 border-t border-gray-100 p-6 flex flex-col justify-between overflow-y-auto animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="space-y-6">
            {/* Search Bar for Mobile */}
            <SearchBar
              placeholder={searchPlaceholder}
              className="w-full"
              dropdownClassName="left-0 right-0 w-full"
              onClose={() => setIsOpen(false)}
            />

            {/* Nav Links on Mobile */}
            <nav className="flex flex-col space-y-2 pt-2">
              {navLinks.map((link) => {
                const isMenu = link.href === '/menu';
                const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);

                if (isMenu) {
                  return (
                    <div key={link.href} className="space-y-1">
                      <Link
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

                      {/* Mobile Subcategories */}
                      <div className="pl-4 pr-2 py-1 space-y-1">
                        {menuCategories.map((cat) => (
                          <Link
                            key={cat.href}
                            href={cat.href}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-[#4B5563] hover:text-[#E53935] hover:bg-[#FFF5F5] transition-colors"
                          >
                            <span>{cat.label}</span>
                            <span className="text-gray-400 text-xs">→</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  );
                }

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

