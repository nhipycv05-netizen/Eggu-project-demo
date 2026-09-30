'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { Link } from '@/i18n/navigation';
import { MapPin, Phone, Clock } from 'lucide-react';
import { CONTACT_CONFIG } from '@/constants/contact';
import ZaloIcon from '@/components/ui/ZaloIcon';
import FacebookIcon from '@/components/ui/FacebookIcon';
import TikTokIcon from '@/components/ui/TikTokIcon';

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
            <div className="mt-4 flex items-center gap-3">
              <a
                href={CONTACT_CONFIG.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Facebook ${CONTACT_CONFIG.facebookName}`}
                className="w-8 h-8 rounded-full overflow-hidden hover:scale-110 hover:opacity-90 transition-all duration-200 inline-flex items-center justify-center shrink-0 shadow-xs"
              >
                <FacebookIcon className="w-8 h-8" />
              </a>

              <a
                href={CONTACT_CONFIG.zaloUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Zalo EGGU"
                className="w-8 h-8 hover:scale-110 hover:opacity-90 transition-all duration-200 inline-flex items-center justify-center shrink-0 drop-shadow-xs"
              >
                <ZaloIcon className="w-8 h-8" />
              </a>

              <a
                href={CONTACT_CONFIG.tiktokUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok EGGU"
                className="w-8 h-8 rounded-full overflow-hidden hover:scale-110 hover:opacity-90 transition-all duration-200 inline-flex items-center justify-center shrink-0 shadow-xs"
              >
                <TikTokIcon className="w-8 h-8" />
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
            <div className="space-y-3 text-sm text-[#E7DFD5] font-medium">
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#e0352b] shrink-0" />
                <a href={`tel:${phone.replace(/\s+/g, '')}`} className="hover:text-[#e0352b] transition-colors">{phone}</a>
              </p>
              <div className="flex items-center gap-3 pt-1">
                <a
                  href={CONTACT_CONFIG.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Facebook ${CONTACT_CONFIG.facebookName}`}
                  className="w-8 h-8 rounded-full overflow-hidden hover:scale-110 hover:opacity-90 transition-all duration-200 inline-flex items-center justify-center shrink-0 shadow-xs"
                >
                  <FacebookIcon className="w-8 h-8" />
                </a>

                <a
                  href={CONTACT_CONFIG.zaloUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Zalo EGGU"
                  className="w-8 h-8 hover:scale-110 hover:opacity-90 transition-all duration-200 inline-flex items-center justify-center shrink-0 drop-shadow-xs"
                >
                  <ZaloIcon className="w-8 h-8" />
                </a>

                <a
                  href={CONTACT_CONFIG.tiktokUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="TikTok EGGU"
                  className="w-8 h-8 rounded-full overflow-hidden hover:scale-110 hover:opacity-90 transition-all duration-200 inline-flex items-center justify-center shrink-0 shadow-xs"
                >
                  <TikTokIcon className="w-8 h-8" />
                </a>
              </div>
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
