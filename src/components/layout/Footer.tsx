'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function Footer() {
  const t = useTranslations('nav');

  const links = [
    { href: '/menu', label: t('menu') },
    { href: '/about', label: t('about') },
    { href: '/store', label: t('store') },
    { href: '/faq', label: t('faq') },
    { href: '/news', label: t('news') },
    { href: '/contact', label: t('contact') },
  ];

  return (
    <footer className="bg-[#e4e5e2] text-[#6b5549] border-t border-[#d7d9d5] py-7">
      <div className="site-frame border-0 bg-transparent px-7 grid grid-cols-2 md:grid-cols-4 gap-6 text-[9px]">
        {/* Brand Column */}
        <div className="space-y-2 md:col-span-2">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-6 h-6 rounded-full bg-[#f8c400] flex items-center justify-center font-bold text-[#261d1b]">E</div>
            <span className="text-sm font-bold">Eggu</span>
          </Link>
          <p className="text-[#756b67] max-w-sm leading-relaxed">
            © 2026 Eggu Korean Sandwich. All rights reserved.
          </p>
          <div className="hidden">
            <a href="#" className="w-8 h-8 rounded-full bg-[#5C4B3E]/30 flex items-center justify-center text-sm font-bold hover:bg-[#EAAA08] hover:text-[#1E1B18] transition duration-200">
              FB
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-[#5C4B3E]/30 flex items-center justify-center text-sm font-bold hover:bg-[#EAAA08] hover:text-[#1E1B18] transition duration-200">
              IG
            </a>
            <a href="#" className="w-8 h-8 rounded-full bg-[#5C4B3E]/30 flex items-center justify-center text-sm font-bold hover:bg-[#EAAA08] hover:text-[#1E1B18] transition duration-200">
              YT
            </a>
          </div>
        </div>

        {/* Quick Links Column */}
        <div>
          <h4 className="text-[#6b5549] font-bold mb-2">
            About Us
          </h4>
          <ul className="space-y-1 text-[#756b67]">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="hover:text-[#6b5549] transition duration-150"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Store Info Column */}
        <div className="space-y-3 text-sm">
          <h4 className="text-[#6b5549] font-bold mb-2">
            Store Locator
          </h4>
          <p className="text-[#756b67]">Nguyễn Huệ, Quận 1</p>
          <div className="space-y-1 text-[#756b67]">
            <p>Privacy Policy</p>
            <p>07:00 - 22:00</p>
          </div>
        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div className="hidden max-w-7xl mx-auto px-6">
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-[#EFECE6] transition duration-150">Privacy Policy</a>
          <a href="#" className="hover:text-[#EFECE6] transition duration-150">Terms of Service</a>
          <a href="#" className="hover:text-[#EFECE6] transition duration-150">COD Policy</a>
        </div>
      </div>
    </footer>
  );
}
