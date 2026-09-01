'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function Footer() {
  const t = useTranslations('nav');

  const links = [
    { href: '/about', label: t('about') },
    { href: '/menu', label: t('menu') },
    { href: '/store', label: t('store') },
    { href: '/faq', label: t('faq') },
    { href: '/news', label: t('news') },
    { href: '/contact', label: t('contact') },
  ];

  return (
    <footer className="bg-[#111111] text-[#F8F9FA] border-t border-[#222222] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="space-y-4 sm:col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex items-center space-x-2.5 group">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-white p-0.5 shadow-xs border border-[#333333] group-hover:scale-105 transition-transform">
                <Image
                  src="/images/logo.png"
                  alt="EGGU Logo"
                  fill
                  sizes="40px"
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-black tracking-tight text-white group-hover:text-[#E53935] transition-colors">
                Eggu
              </span>
            </Link>
            <p className="text-sm text-[#9CA3AF] leading-relaxed max-w-sm font-medium">
              Bánh mì trứng Hàn Quốc tươi ngon hảo hạng. Chế biến nóng hổi mỗi ngày với bơ sữa Pháp và trứng thanh trùng cao cấp.
            </p>
          </div>

          {/* Quick Links Column */}
          <div className="space-y-4">
            <h4 className="text-sm font-black uppercase tracking-wider text-[#FFC107]">
              Khám Phá / Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-[#9CA3AF]">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-[#E53935] transition-colors duration-150 font-medium"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Store Info Column */}
          <div className="space-y-4">
            <h4 className="text-sm font-black uppercase tracking-wider text-[#FFC107]">
              Cửa Hàng / Store
            </h4>
            <div className="space-y-2.5 text-sm text-[#9CA3AF] font-medium">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#E53935] shrink-0 mt-0.5" />
                <span>123 Nguyễn Huệ, Quận 1, TP.HCM</span>
              </p>
              <p className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#E53935] shrink-0 mt-0.5" />
                <span>07:00 AM - 10:00 PM</span>
              </p>
            </div>
          </div>

          {/* Contact Column */}
          <div className="space-y-4">
            <h4 className="text-sm font-black uppercase tracking-wider text-[#FFC107]">
              Liên Hệ / Contact
            </h4>
            <div className="space-y-2.5 text-sm text-[#9CA3AF] font-medium">
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#E53935] shrink-0" />
                <a href="tel:02812345678" className="hover:text-[#E53935] transition-colors">028 1234 5678</a>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#E53935] shrink-0" />
                <a href="mailto:hello@eggu.vn" className="hover:text-[#E53935] transition-colors">hello@eggu.vn</a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#222222] mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6B7280] font-medium">
          <p>© 2026 EGGU Korean Egg Sandwich. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="/faq" className="hover:text-[#E53935] transition-colors">FAQ</Link>
            <Link href="/contact" className="hover:text-[#E53935] transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
