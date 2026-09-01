'use client';

import { usePathname, useRouter } from '@/i18n/navigation';
import { useLocale } from 'next-intl';
import { useTransition } from 'react';
import { Globe } from 'lucide-react';

interface LanguageSwitcherProps {
  className?: string;
}

export default function LanguageSwitcher({ className = '' }: LanguageSwitcherProps) {
  const [isPending, startTransition] = useTransition();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (nextLocale: 'vi' | 'en') => {
    if (nextLocale === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <div
      className={`inline-flex items-center gap-1.5 bg-[#F8F9FA] hover:bg-white px-2.5 py-1 rounded-full border border-[#E5E7EB] shadow-xs transition-colors duration-200 ${
        isPending ? 'opacity-70 cursor-not-allowed' : ''
      } ${className}`}
    >
      <Globe className="w-3.5 h-3.5 text-[#6B7280] shrink-0" aria-hidden="true" />
      <div className="flex items-center text-xs font-bold text-[#111111]">
        <button
          type="button"
          onClick={() => handleLanguageChange('vi')}
          disabled={isPending}
          className={`px-1.5 py-0.5 rounded-full transition-all duration-150 ${
            locale === 'vi'
              ? 'bg-[#E53935] text-white font-black shadow-xs'
              : 'text-[#6B7280] hover:text-[#E53935]'
          }`}
          aria-label="Tiếng Việt"
        >
          VI
        </button>
        <span className="text-[#E5E7EB] px-0.5 select-none">/</span>
        <button
          type="button"
          onClick={() => handleLanguageChange('en')}
          disabled={isPending}
          className={`px-1.5 py-0.5 rounded-full transition-all duration-150 ${
            locale === 'en'
              ? 'bg-[#E53935] text-white font-black shadow-xs'
              : 'text-[#6B7280] hover:text-[#E53935]'
          }`}
          aria-label="English"
        >
          EN
        </button>
      </div>
    </div>
  );
}
