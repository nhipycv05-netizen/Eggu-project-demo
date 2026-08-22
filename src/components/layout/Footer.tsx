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
    <footer className="bg-[#1E1B18] text-[#FAF8F5] border-t border-neutral-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand Column */}
        <div className="space-y-4 md:col-span-2">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-[#EAAA08] flex items-center justify-center font-bold text-[#1E1B18]">
              🍳
            </div>
            <span className="text-xl font-black tracking-tight">
              EGGU<span className="text-[#EAAA08]">.</span>
            </span>
          </Link>
          <p className="text-[#706860] max-w-sm text-sm font-medium leading-relaxed">
            Crafting the ultimate Korean egg sandwich experience with fluffy, melt-in-your-mouth scrambled eggs, premium butter-toasted brioche, and signature sweet-savory sauces.
          </p>
          <div className="flex space-x-4 pt-2">
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
          <h4 className="text-[#EAAA08] font-bold text-xs uppercase tracking-wider mb-4">
            Navigation
          </h4>
          <ul className="space-y-3">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-[#EFECE6]/70 hover:text-[#EAAA08] text-sm font-bold uppercase tracking-wider transition duration-150"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Store Info Column */}
        <div className="space-y-3 text-sm">
          <h4 className="text-[#EAAA08] font-bold text-xs uppercase tracking-wider mb-4">
            Opening Hours
          </h4>
          <p className="text-[#EFECE6]/70 font-semibold">
            Monday - Sunday
          </p>
          <p className="text-xl font-bold text-[#EFECE6]">
            07:00 AM - 10:00 PM
          </p>
          <div className="border-t border-neutral-800 pt-4 mt-4 space-y-2">
            <p className="text-[#706860] text-xs font-bold uppercase tracking-wider">
              Hotline
            </p>
            <p className="font-extrabold text-[#EAAA08] text-lg">
              1900 1234
            </p>
          </div>
        </div>
      </div>

      {/* Footer Bottom Bar */}
      <div className="max-w-7xl mx-auto px-6 border-t border-neutral-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-[#706860] font-bold tracking-wider">
        <p>© 2026 EGGU Korean Egg Sandwich. All rights reserved.</p>
        <div className="flex space-x-6 mt-4 md:mt-0">
          <a href="#" className="hover:text-[#EFECE6] transition duration-150">Privacy Policy</a>
          <a href="#" className="hover:text-[#EFECE6] transition duration-150">Terms of Service</a>
          <a href="#" className="hover:text-[#EFECE6] transition duration-150">COD Policy</a>
        </div>
      </div>
    </footer>
  );
}
