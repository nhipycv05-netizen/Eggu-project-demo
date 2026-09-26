'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { MapPin, Phone, Clock } from 'lucide-react';
import { CONTACT_CONFIG } from '@/constants/contact';
import ZaloIcon from '@/components/ui/ZaloIcon';

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
    <footer className="bg-[#2B1810] text-[#E7DFD5] border-t border-[#44281D] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="sm:col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex items-center space-x-2.5 group">
              <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-white p-0.5 shadow-xs border border-[#44281D] group-hover:scale-105 transition-transform flex items-center justify-center">
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
            <div className="mt-4 flex items-center gap-2 flex-wrap">
              <a
                href={CONTACT_CONFIG.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Facebook Fanpage ${CONTACT_CONFIG.facebookName}`}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#3D2318] border border-[#44281D] text-xs font-semibold text-[#E7DFD5] hover:text-[#e0352b] hover:border-[#e0352b]/50 transition-colors group/fb"
              >
                <svg className="w-4 h-4 fill-[#1877F2] group-hover/fb:fill-[#e0352b] transition-colors" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
                <span>Eggu Fanpage</span>
              </a>

              <a
                href={CONTACT_CONFIG.zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Zalo EGGU"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#3D2318] border border-[#44281D] text-xs font-semibold text-[#E7DFD5] hover:text-[#0068FF] hover:border-[#0068FF]/50 transition-colors group/zalo"
              >
                <ZaloIcon className="w-4 h-4" />
                <span>Zalo</span>
              </a>
            </div>
          </div>

          {/* Quick Links Column */}
          <div>
            <h4 className="text-sm font-black uppercase tracking-wider text-[#FBBF24] mb-3">
              Khám Phá / Explore
            </h4>
            <ul className="space-y-1.5 text-sm text-[#E7DFD5]">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="hover:text-[#e0352b] transition-colors duration-150 font-medium"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Store Info Column */}
          <div>
            <h4 className="text-sm font-black uppercase tracking-wider text-[#FBBF24] mb-3">
              Cửa Hàng / Store
            </h4>
            <div className="space-y-2 text-sm text-[#E7DFD5] font-medium">
              <p className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#e0352b] shrink-0 mt-0.5" />
                <span>{address}</span>
              </p>
              <p className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#e0352b] shrink-0 mt-0.5" />
                <span>{hours}</span>
              </p>
            </div>
          </div>

          {/* Contact Column */}
          <div>
            <h4 className="text-sm font-black uppercase tracking-wider text-[#FBBF24] mb-3">
              Liên Hệ / Contact
            </h4>
            <div className="space-y-2.5 text-sm text-[#E7DFD5] font-medium">
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#e0352b] shrink-0" />
                <a href={`tel:${phone.replace(/\s+/g, '')}`} className="hover:text-[#e0352b] transition-colors">{phone}</a>
              </p>
              <p className="flex items-start gap-2">
                <svg className="w-4 h-4 text-[#1877F2] shrink-0 fill-current mt-0.5" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                </svg>
                <a
                  href={CONTACT_CONFIG.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#e0352b] transition-colors"
                >
                  {CONTACT_CONFIG.facebookName}
                </a>
              </p>
              <p className="flex items-center gap-2">
                <ZaloIcon className="w-4 h-4 shrink-0" />
                <a
                  href={CONTACT_CONFIG.zaloUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#0068FF] transition-colors"
                >
                  Zalo
                </a>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-[#44281D] mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#C5B8A8] font-medium">
          <p>© 2026 EGGU Korean Egg Sandwich. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="/faq" className="hover:text-[#e0352b] transition-colors">FAQ</Link>
            <Link href="/contact" className="hover:text-[#e0352b] transition-colors">Contact</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
