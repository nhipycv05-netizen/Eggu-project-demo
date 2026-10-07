import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { MapPin, Phone, Clock, ArrowUpRight } from 'lucide-react';
import { getCanonicalUrl, getAlternateLanguages } from '@/lib/seo';

export const dynamic = 'force-dynamic';


const MOCK_STORES = [
  {
    id: 'store-1',
    name_vi: 'EGGU Nguyễn Huệ (Quận 1)',
    name_en: 'EGGU Nguyen Hue (District 1)',
    address_vi: '123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh',
    address_en: '123 Nguyen Hue, Ben Nghe Ward, District 1, Ho Chi Minh City',
    phone: '028 1234 5678',
    opening_hours_vi: '07:00 - 22:00',
    opening_hours_en: '07:00 - 22:00',
    google_maps_url: 'https://maps.google.com/?q=123+Nguyen+Hue+Ho+Chi+Minh',
  },
  {
    id: 'store-2',
    name_vi: 'EGGU Nguyễn Đình Chiểu (Quận 3)',
    name_en: 'EGGU Nguyen Dinh Chieu (District 3)',
    address_vi: '456 Nguyễn Đình Chiểu, Phường 3, Quận 3, TP. Hồ Chí Minh',
    address_en: '456 Nguyen Dinh Chieu, Ward 3, District 3, Ho Chi Minh City',
    phone: '028 8765 4321',
    opening_hours_vi: '07:00 - 22:00',
    opening_hours_en: '07:00 - 22:00',
    google_maps_url: 'https://maps.google.com/?q=456+Nguyen+Dinh+Chieu+Ho+Chi+Minh',
  },
];

interface StorePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: StorePageProps): Promise<Metadata> {
  const { locale } = await params;
  const isVi = locale === 'vi';
  const canonicalUrl = getCanonicalUrl('/store', locale);
  const alternates = getAlternateLanguages('/store');

  return {
    title: isVi
      ? 'Hệ Thống Cửa Hàng | EGGU - Sandwich Trứng Hàn Quốc'
      : 'Store Locator | EGGU - Korean Egg Sandwich Hanoi',
    description: isVi
      ? 'Tìm cửa hàng EGGU gần bạn nhất để thưởng thức bánh mì sandwich trứng Hàn Quốc tươi nóng mỗi ngày.'
      : 'Find the nearest EGGU store location to enjoy freshly made Korean egg sandwiches in Hanoi.',
    keywords: [
      'Cửa hàng EGGU',
      'Hệ thống EGGU',
      'Sandwich Trứng Hàn Quốc',
      'Korean Egg Sandwich',
      'Bánh mì sandwich Hà Nội',
    ],
    alternates: {
      canonical: canonicalUrl,
      languages: alternates,
    },
    openGraph: {
      title: isVi ? 'Hệ Thống Cửa Hàng EGGU' : 'EGGU Store Locations',
      description: isVi
        ? 'Danh sách cửa hàng EGGU - Sandwich Trứng Hàn Quốc.'
        : 'EGGU store directory and locations.',
      url: canonicalUrl,
      siteName: 'EGGU',
    },
  };
}

export default async function StorePage({ params }: StorePageProps) {
  const { locale } = await params;
  const t = await getTranslations('store');
  const isVi = locale === 'vi';

  // Fetch stores from Supabase with fallback to mock data
  let stores = MOCK_STORES;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('stores')
      .select('*')
      .eq('is_active', true);
    
    if (data && data.length > 0) {
      stores = data;
    }
  } catch (error) {
    console.error('Supabase query failed on store page, using mock fallbacks:', error);
  }

  return (
    <div className="min-h-screen bg-transparent pt-24 md:pt-28 pb-12 md:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 md:space-y-10">
        {/* Title Header (Minimalist Left-Aligned) */}
        <div className="border-b border-[#e0352b]/20 pb-3 mb-6 text-left">
          <h1 className="text-xl font-bold uppercase tracking-wider text-[#e0352b]">
            {t('title')}
          </h1>
        </div>

        {/* Stores List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          {stores.map((store) => (
            <div
              key={store.id}
              className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E5E7EB] shadow-xs space-y-6 hover:border-[#E53935]/40 hover:shadow-md transition duration-200 flex flex-col justify-between h-full"
            >
              {/* Branch name */}
              <h2 className="text-2xl font-black text-[#111111]">
                {isVi ? store.name_vi : store.name_en}
              </h2>

              {/* Branch details */}
              <div className="space-y-4 text-sm font-semibold text-[#6B7280]">
                {/* Address */}
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-[#E53935] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-[#9CA3AF] uppercase font-black tracking-wider mb-1">
                      {t('address')}
                    </p>
                    <p className="text-[#111111] font-medium leading-relaxed">
                      {isVi ? store.address_vi : store.address_en}
                    </p>
                  </div>
                </div>

                {/* Opening hours */}
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-[#E53935] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-[#9CA3AF] uppercase font-black tracking-wider mb-1">
                      {t('hours')}
                    </p>
                    <p className="text-[#111111] font-bold">
                      {isVi ? store.opening_hours_vi : store.opening_hours_en}
                    </p>
                  </div>
                </div>

                {/* Hotline */}
                {store.phone && (
                  <div className="flex items-start space-x-3">
                    <Phone className="w-5 h-5 text-[#E53935] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-[#9CA3AF] uppercase font-black tracking-wider mb-1">
                        {t('phone')}
                      </p>
                      <a href={`tel:${store.phone}`} className="text-[#E53935] font-bold hover:underline">
                        {store.phone}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Maps navigation */}
              <div className="pt-4 border-t border-[#E5E7EB]">
                <a
                  href={store.google_maps_url || `https://maps.google.com/?q=${encodeURIComponent(isVi ? store.address_vi : store.address_en)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-[#111111] hover:text-[#E53935] transition duration-150"
                >
                  <span>{t('directions')}</span>
                  <ArrowUpRight className="w-4 h-4 text-[#E53935]" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
