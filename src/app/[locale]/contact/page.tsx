import { getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import ContactForm from '@/components/contact/ContactForm';
import { MapPin, Phone, Mail, Clock, ExternalLink } from 'lucide-react';

export const dynamic = 'force-dynamic';

interface Store {
  id: string;
  name_vi: string;
  name_en: string;
  address_vi: string;
  address_en: string;
  phone: string;
  opening_hours_vi: string;
  opening_hours_en: string;
  google_maps_url: string | null;
  is_active: boolean;
}

const DEFAULT_STORE: Store = {
  id: 'default-office',
  name_vi: 'EGGU Head Office',
  name_en: 'EGGU Head Office',
  address_vi: '54 Nguyễn Hữu Huân, Hoàn Kiếm, Hà Nội',
  address_en: '54 Nguyen Huu Huan, Hoan Kiem, Hanoi',
  phone: '0356779899',
  opening_hours_vi: '07:00 - 21:00',
  opening_hours_en: '07:00 - 21:00',
  google_maps_url: null,
  is_active: true,
};

function getMapEmbedUrl(url: string | null | undefined, address: string) {
  if (!url) {
    return null;
  }
  const iframeMatch = url.match(/src=["']([^"']+)["']/);
  if (iframeMatch) {
    return iframeMatch[1];
  }
  if (url.includes('google.com/maps/embed')) {
    return url;
  }
  return null;
}

interface ContactPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  const t = await getTranslations('contact');
  const ts = await getTranslations('store');
  const isVi = locale === 'vi';

  let stores: Store[] = [];
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('stores')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: true });

    if (data && data.length > 0) {
      stores = data;
    }
  } catch (error) {
    console.error('Supabase query failed on contact page:', error);
  }

  if (stores.length === 0) {
    stores = [DEFAULT_STORE];
  }

  const primaryStore = stores[0];
  const primaryAddress = isVi ? primaryStore.address_vi : primaryStore.address_en;
  const primaryDirectionsUrl =
    primaryStore.google_maps_url && !primaryStore.google_maps_url.includes('<iframe')
      ? primaryStore.google_maps_url
      : `https://maps.google.com/?q=${encodeURIComponent(primaryAddress)}`;
  const embedUrl = getMapEmbedUrl(primaryStore.google_maps_url, primaryAddress);

  return (
    <div className="min-h-screen bg-[#F8F9FA] pt-24 md:pt-28 pb-12 md:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 md:space-y-16">
        {/* Title Header */}
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-[#111111]">
            {t('title')}
          </h1>
        </div>

        {/* Content Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left Column: Store Details & Map */}
          <div className="lg:col-span-6 space-y-6">
            {stores.map((store, index) => {
              const storeAddress = isVi ? store.address_vi : store.address_en;
              const storeHours = isVi ? store.opening_hours_vi : store.opening_hours_en;
              const storeName = isVi ? store.name_vi : store.name_en;
              const directionsUrl =
                store.google_maps_url && !store.google_maps_url.includes('<iframe')
                  ? store.google_maps_url
                  : `https://maps.google.com/?q=${encodeURIComponent(storeAddress)}`;

              return (
                <div
                  key={store.id || index}
                  className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5E7EB] shadow-xs space-y-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <h2 className="text-xl sm:text-2xl font-black text-[#111111]">
                      {storeName}
                    </h2>
                    {stores.length > 1 && (
                      <span className="px-2.5 py-1 bg-neutral-100 text-neutral-600 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0">
                        {isVi ? `Chi nhánh ${index + 1}` : `Branch ${index + 1}`}
                      </span>
                    )}
                  </div>

                  <div className="space-y-4 text-sm font-semibold text-[#6B7280]">
                    {/* Address */}
                    <div className="flex items-start space-x-3">
                      <MapPin className="w-5 h-5 text-[#E53935] shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-[#9CA3AF] uppercase font-black tracking-wider mb-1">
                          {ts('address')}
                        </p>
                        <p className="text-[#111111] font-medium leading-relaxed">
                          {storeAddress}
                        </p>
                      </div>
                    </div>

                    {/* Opening Hours */}
                    <div className="flex items-start space-x-3">
                      <Clock className="w-5 h-5 text-[#E53935] shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs text-[#9CA3AF] uppercase font-black tracking-wider mb-1">
                          {ts('hours')}
                        </p>
                        <p className="text-[#111111] font-bold">
                          {storeHours}
                        </p>
                      </div>
                    </div>

                    {/* Hotline */}
                    {store.phone && (
                      <div className="flex items-start space-x-3">
                        <Phone className="w-5 h-5 text-[#E53935] shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs text-[#9CA3AF] uppercase font-black tracking-wider mb-1">
                            {ts('phone')}
                          </p>
                          <a
                            href={`tel:${store.phone.replace(/\s+/g, '')}`}
                            className="text-[#E53935] font-bold hover:underline"
                          >
                            {store.phone}
                          </a>
                        </div>
                      </div>
                    )}

                    {/* Email (Shown for first/main branch) */}
                    {index === 0 && (
                      <div className="flex items-start space-x-3">
                        <Mail className="w-5 h-5 text-[#E53935] shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs text-[#9CA3AF] uppercase font-black tracking-wider mb-1">
                            Email
                          </p>
                          <a
                            href="mailto:hello@eggu.vn"
                            className="text-[#111111] font-bold hover:text-[#E53935] transition-colors"
                          >
                            hello@eggu.vn
                          </a>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Directions Action */}
                  <div className="pt-2">
                    <a
                      href={directionsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-[#E53935] hover:text-[#D32F2F] transition-colors"
                    >
                      <span>{isVi ? 'Mở trong Google Maps' : 'Open in Google Maps'}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}

            {/* Google Map / Map view container */}
            <div className="relative aspect-video w-full rounded-3xl overflow-hidden border border-[#E5E7EB] shadow-xs bg-neutral-100 flex flex-col justify-between">
              {embedUrl ? (
                <iframe
                  title="EGGU Location Map"
                  src={embedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-br from-neutral-50 to-neutral-100 space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-[#E53935]/10 flex items-center justify-center text-[#E53935]">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div className="space-y-1 max-w-sm">
                    <p className="text-sm font-black text-[#111111]">
                      {isVi ? primaryStore.name_vi : primaryStore.name_en}
                    </p>
                    <p className="text-xs text-neutral-500 font-medium">
                      {primaryAddress}
                    </p>
                  </div>
                  <a
                    href={primaryDirectionsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 px-4 py-2 bg-[#E53935] text-white rounded-xl text-xs font-bold shadow-xs hover:bg-[#D32F2F] transition"
                  >
                    <span>{isVi ? 'Mở chỉ đường trên Maps' : 'Open Directions on Maps'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Contact Message Form */}
          <div className="lg:col-span-6">
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  );
}

