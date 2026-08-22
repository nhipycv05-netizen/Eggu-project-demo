import { getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { MapPin, Phone, Clock, ArrowUpRight } from 'lucide-react';

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
    <div className="min-h-screen bg-[#FAF8F5] pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-6 space-y-16">
        {/* Title Header */}
        <div className="text-center space-y-4">
          <span className="text-[#EAAA08] text-xs font-bold uppercase tracking-widest block">
            {isVi ? 'Hệ Thống Chi Nhánh' : 'Our Stores'}
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#1E1B18]">
            {t('title')}
          </h1>
          <p className="text-[#706860] font-medium text-lg leading-relaxed max-w-xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* Stores List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {stores.map((store) => (
            <div
              key={store.id}
              className="bg-white rounded-3xl p-8 border border-[#E5E0D8] shadow-sm space-y-6 hover:shadow-md transition duration-200"
            >
              {/* Branch name */}
              <h2 className="text-2xl font-black text-[#1E1B18]">
                {isVi ? store.name_vi : store.name_en}
              </h2>

              {/* Branch details */}
              <div className="space-y-4 text-sm font-semibold text-[#706860]">
                {/* Address */}
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-[#EAAA08] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-neutral-400 uppercase font-black tracking-wider mb-1">
                      {t('address')}
                    </p>
                    <p className="text-[#1E1B18] font-medium leading-relaxed">
                      {isVi ? store.address_vi : store.address_en}
                    </p>
                  </div>
                </div>

                {/* Opening hours */}
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-[#EAAA08] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-neutral-400 uppercase font-black tracking-wider mb-1">
                      {t('hours')}
                    </p>
                    <p className="text-[#1E1B18] font-bold">
                      {isVi ? store.opening_hours_vi : store.opening_hours_en}
                    </p>
                  </div>
                </div>

                {/* Hotline */}
                {store.phone && (
                  <div className="flex items-start space-x-3">
                    <Phone className="w-5 h-5 text-[#EAAA08] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs text-neutral-400 uppercase font-black tracking-wider mb-1">
                        {t('phone')}
                      </p>
                      <a href={`tel:${store.phone}`} className="text-[#EAAA08] font-bold hover:underline">
                        {store.phone}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              {/* Maps navigation */}
              <div className="pt-4 border-t border-[#E5E0D8]">
                <a
                  href={store.google_maps_url || `https://maps.google.com/?q=${encodeURIComponent(isVi ? store.address_vi : store.address_en)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-[#5C4B3E] hover:text-[#EAAA08] transition duration-150"
                >
                  <span>{t('directions')}</span>
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
