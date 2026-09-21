'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { MapPin, Phone, Clock } from 'lucide-react';

interface FooterProps {
  store?: {
    name_vi?: string;
    name_en?: string;
    address_vi?: string;
    address_en?: string;
    phone?: string;
    opening_hours_vi?: string;
    opening_hours_en?: string;
  } | null;
  locale?: string;
}

export default function Footer({ store, locale = 'vi' }: FooterProps) {
  const t = useTranslations('nav');
  const isVi = locale === 'vi';

  const address = store
    ? (isVi ? store.address_vi : store.address_en) || store.address_vi
    : '54 Nguyễn Hữu Huân, Hoàn Kiếm, Hà Nội';
  const hours = store
    ? (isVi ? store.opening_hours_vi : store.opening_hours_en) || store.opening_hours_vi
    : '07:00 - 21:00';
  const phone = store?.phone || '0356779899';

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="sm:col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex items-center space-x-2.5 group">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-white p-0.5 shadow-xs border border-[#333333] group-hover:scale-105 transition-transform flex items-center justify-center">
                <Image
                  src="/images/logo-icon.png"
                  alt="EGGU Mascot"
                  fill
                  sizes="40px"
                  className="object-contain p-0.5"
                />
              </div>
              <div className="relative h-6 sm:h-7 w-16 flex items-center">
                <Image
                  src="/images/logo-text.png"
                  alt="Eggu"
                  fill
                  sizes="64px"
                  className="object-contain object-left group-hover:scale-105 transition-transform"
                />
              </div>
            </Link>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="text-sm font-black uppercase tracking-wider text-[#FFC107] mb-3">
              Khám Phá / Explore
            </h4>
            <ul className="space-y-1.5 text-sm text-[#9CA3AF]">
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
          <div>
            <h4 className="text-sm font-black uppercase tracking-wider text-[#FFC107] mb-3">
              Cửa Hàng / Store
            </h4>
            <div className="space-y-2 text-sm text-[#9CA3AF] font-medium">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#E53935] shrink-0 mt-0.5" />
                <span>{address}</span>
              </p>
              <p className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#E53935] shrink-0 mt-0.5" />
                <span>{hours}</span>
              </p>
            </div>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-sm font-black uppercase tracking-wider text-[#FFC107] mb-3">
              Liên Hệ / Contact
            </h4>
            <div className="space-y-2 text-sm text-[#9CA3AF] font-medium">
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#E53935] shrink-0" />
                <a href={`tel:${phone.replace(/\s+/g, '')}`} className="hover:text-[#E53935] transition-colors">{phone}</a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#222222] mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6B7280] font-medium">
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
