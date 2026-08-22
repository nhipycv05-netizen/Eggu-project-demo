'use client';

import { usePathname, useRouter } from '@/i18n/navigation';
import { useLocale } from 'next-intl';
import { useTransition } from 'react';

export default function LanguageSwitcher() {
  const [isPending, startTransition] = useTransition();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (nextLocale: 'vi' | 'en') => {
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <div className={`inline-flex rounded-full bg-[#EFECE6] p-1 border border-[#E5E0D8] ${isPending ? 'opacity-70 cursor-not-allowed' : ''}`}>
      <button
        onClick={() => handleLanguageChange('vi')}
        disabled={isPending}
        className={`px-3 py-1 text-xs font-bold rounded-full transition-all duration-200 ${
          locale === 'vi'
            ? 'bg-[#EAAA08] text-[#1E1B18] shadow-sm'
            : 'text-[#706860] hover:text-[#1E1B18]'
        }`}
      >
        VI
      </button>
      <button
        onClick={() => handleLanguageChange('en')}
        disabled={isPending}
        className={`px-3 py-1 text-xs font-bold rounded-full transition-all duration-200 ${
          locale === 'en'
            ? 'bg-[#EAAA08] text-[#1E1B18] shadow-sm'
            : 'text-[#706860] hover:text-[#1E1B18]'
        }`}
      >
        EN
      </button>
    </div>
  );
}
