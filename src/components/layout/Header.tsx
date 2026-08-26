'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/navigation';
import { ShoppingBag, Menu, X } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import { useCartStore } from '@/stores/cartStore';

export default function Header() {
  const t = useTranslations('nav');
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Zustand cart items
  const cartItems = useCartStore((state) => state.items);
  const [isMounted, setIsMounted] = useState(false);

  // Prevent hydration mismatches by counting only after mount
  useEffect(() => {
    let active = true;
    setTimeout(() => {
      if (active) {
        setIsMounted(true);
      }
    }, 0);
    return () => {
      active = false;
    };
  }, []);

  const cartCount = isMounted
    ? cartItems.reduce((acc, item) => acc + item.quantity, 0)
    : 0;

  // Handle scroll backdrop styling
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

  const navLinks = [
    { href: '/', label: t('home') },
    { href: '/menu', label: t('menu') },
    { href: '/about', label: t('about') },
    { href: '/store', label: t('store') },
    { href: '/faq', label: t('faq') },
    { href: '/news', label: t('news') },
    { href: '/contact', label: t('contact') },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#fff9f7]/95 backdrop-blur-md border-b border-[#eadfdb]'
          : 'bg-[#fff9f7] border-b border-[#f1e7e4]'
      }`}
    >
      <div className="site-frame border-0 px-7 h-14 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-2 group">
          <div className="w-7 h-7 rounded-full bg-[#f8c400] flex items-center justify-center text-[11px] font-black text-[#261d1b]">
            E
          </div>
          <span className="text-base font-bold tracking-tight text-[#6b5549]">
            Eggu
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive =
              link.href === '/'
                ? pathname === '/'
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[10px] relative py-1 transition-colors duration-200 ${
                  isActive
                    ? 'text-[#6b5549] font-bold'
                    : 'text-[#756b67] hover:text-[#6b5549]'
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-px bg-[#f8c400]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right side controls */}
        <div className="hidden md:flex items-center gap-4">
          <LanguageSwitcher />

          {/* Cart Trigger Link */}
          <Link href="/cart" aria-label="Cart" className="relative group p-1 transition duration-200">
            <ShoppingBag className="w-4 h-4 text-[#6b5549]" />
            {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 w-3.5 h-3.5 bg-[#ee6b61] text-white font-bold text-[8px] rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile controls bar */}
        <div className="flex md:hidden items-center space-x-4">
          {/* Cart icon for mobile */}
          <Link href="/cart" aria-label="Cart" className="relative p-2">
            <ShoppingBag className="w-5 h-5 text-[#6b5549]" />
            {cartCount > 0 && (
              <span className="absolute top-0 right-0 w-4 h-4 bg-[#EAAA08] text-[#1E1B18] font-bold text-[10px] rounded-full flex items-center justify-center shadow-sm">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Hamburger Menu toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-[#1E1B18] hover:bg-[#EFECE6] rounded-full transition duration-200"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 top-[60px] bg-[#FAF8F5] z-40 border-t border-[#E5E0D8] p-6 flex flex-col justify-between">
          <nav className="flex flex-col space-y-6">
            {navLinks.map((link) => {
              const isActive =
                link.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`text-xl font-extrabold uppercase tracking-wide transition-colors duration-200 ${
                    isActive ? 'text-[#EAAA08]' : 'text-[#1E1B18] hover:text-[#EAAA08]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-[#E5E0D8] pt-6 flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-[#706860]">Select Language</span>
              <LanguageSwitcher />
            </div>
            <p className="text-xs text-[#706860] text-center mt-4">
              © 2026 EGGU Korean Egg Sandwich. All rights reserved.
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
