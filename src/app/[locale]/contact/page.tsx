import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { MapPin, Phone, Clock, ExternalLink, MessageCircle } from 'lucide-react';
import { CONTACT_CONFIG } from '@/constants/contact';
import FacebookIcon from '@/components/ui/FacebookIcon';
import ZaloIcon from '@/components/ui/ZaloIcon';
import TikTokIcon from '@/components/ui/TikTokIcon';
import { SOCIAL_ALT } from '@/lib/seo-alt';
import { getCanonicalUrl, getAlternateLanguages, getRestaurantSchema } from '@/lib/seo';

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
  name_vi: 'EGGU - Sandwich trứng Hàn Quốc',
  name_en: 'EGGU - Korean Egg Sandwich',
  address_vi: '54 Nguyễn Hữu Huân, Hoàn Kiếm, Hà Nội',
  address_en: '54 Nguyen Huu Huan, Hoan Kiem, Hanoi',
  phone: '0356779899',
  opening_hours_vi: '07:00 - 21:00',
  opening_hours_en: '07:00 - 21:00',
  google_maps_url: 'https://maps.google.com/maps?q=54+Nguyen+Huu+Huan,+Hoan+Kiem,+Hanoi&t=&z=16&ie=UTF8&iwloc=&output=embed',
  is_active: true,
};

function getMapEmbedUrl(url: string | null | undefined, address: string) {
  if (url) {
    const iframeMatch = url.match(/src=["']([^"']+)["']/);
    if (iframeMatch) {
      return iframeMatch[1];
    }
    if (url.includes('output=embed') || url.includes('google.com/maps/embed')) {
      return url;
    }
  }
  if (address && address.trim()) {
    return `https://maps.google.com/maps?q=${encodeURIComponent(address.trim())}&t=&z=16&ie=UTF8&iwloc=&output=embed`;
  }
  return null;
}

interface ContactPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isVi = locale === 'vi';
  const canonicalUrl = getCanonicalUrl('/contact', locale);
  const alternates = getAlternateLanguages('/contact');

  return {
    title: isVi
      ? 'Liên Hệ & Địa Chỉ Cửa Hàng | EGGU - Sandwich Trứng Hàn Quốc'
      : 'Contact & Store Location | EGGU - Korean Egg Sandwich Hanoi',
    description: isVi
      ? 'Địa chỉ cửa hàng EGGU tại 54 Nguyễn Hữu Huân, Hoàn Kiếm, Hà Nội. Hotline: 0356779899. Giờ mở cửa: 07:00 - 21:00. Đặt hàng bánh mì sandwich trứng giao tận nơi.'
      : 'Visit EGGU at 54 Nguyen Huu Huan, Hoan Kiem, Hanoi. Hotline: 0356779899. Open daily 07:00 - 21:00. Delicious Korean egg sandwich delivery.',
    keywords: [
      'Liên hệ EGGU',
      'EGGU 54 Nguyễn Hữu Huân',
      'Sandwich Trứng Hàn Quốc',
      'Korean Egg Sandwich',
      'Bánh mì sandwich Hà Nội',
    ],
    alternates: {
      canonical: canonicalUrl,
      languages: alternates,
    },
    openGraph: {
      title: isVi ? 'Liên Hệ EGGU' : 'Contact EGGU',
      description: isVi
        ? 'Địa chỉ cửa hàng EGGU tại 54 Nguyễn Hữu Huân, Hoàn Kiếm, Hà Nội.'
        : 'EGGU store location at 54 Nguyen Huu Huan, Hoan Kiem, Hanoi.',
      url: canonicalUrl,
      siteName: 'EGGU',
    },
  };
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
    primaryStore.google_maps_url &&
    !primaryStore.google_maps_url.includes('<iframe') &&
    !primaryStore.google_maps_url.includes('embed')
      ? primaryStore.google_maps_url
      : `https://maps.google.com/?q=${encodeURIComponent(primaryAddress)}`;
  const embedUrl = getMapEmbedUrl(primaryStore.google_maps_url, primaryAddress);
  const restaurantSchema = getRestaurantSchema(locale);

  return (
    <div className="min-h-screen bg-transparent pt-20 md:pt-24 pb-12 md:pb-16">
      {/* Schema Markup Restaurant / LocalBusiness for SEO Local */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurantSchema) }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-10 space-y-8 md:space-y-10">
        {/* Title Header */}
        <div className="border-b border-[#e0352b]/20 pb-3 mb-6 text-left">
          <h1 className="text-xl font-bold uppercase tracking-wider text-[#e0352b]">
            {t('title')}
          </h1>
        </div>

        {/* 2-Column Balanced Grid: Store Details (Left) & Map + Direct Contact (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {/* Cột trái: Giữ nguyên thẻ card trắng chứa thông tin cửa hàng */}
          <div className="flex flex-col space-y-6">
            {stores.map((store, index) => {
              const storeAddress = isVi ? store.address_vi : store.address_en;
              const storeHours = isVi ? store.opening_hours_vi : store.opening_hours_en;
              const storeName = isVi ? store.name_vi : store.name_en;
              const directionsUrl =
                store.google_maps_url &&
                !store.google_maps_url.includes('<iframe') &&
                !store.google_maps_url.includes('embed')
                  ? store.google_maps_url
                  : `https://maps.google.com/?q=${encodeURIComponent(storeAddress)}`;

              return (
                <div
                  key={store.id || index}
                  className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E5E7EB] shadow-xs flex flex-col justify-between space-y-6 h-full"
                >
                  <div>
                    <div className="flex items-start justify-between gap-4 mb-5">
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
                      {/* Địa chỉ */}
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

                      {/* Giờ mở cửa */}
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

                      {/* Facebook Fanpage */}
                      <div className="flex items-start space-x-3">
                        <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 overflow-hidden">
                          <FacebookIcon alt={SOCIAL_ALT.facebook(locale)} className="w-full h-full object-contain" />
                        </div>
                        <div>
                          <p className="text-xs text-[#9CA3AF] uppercase font-black tracking-wider mb-1">
                            {isVi ? 'Fanpage Facebook' : 'Facebook Fanpage'}
                          </p>
                          <a
                            href={CONTACT_CONFIG.facebookUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[#111111] font-bold hover:text-[#e0352b] transition-colors inline-flex items-center gap-1.5"
                          >
                            <span>{CONTACT_CONFIG.facebookName}</span>
                            <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
                          </a>
                        </div>
                      </div>

                      {/* Zalo hỗ trợ */}
                      <div className="flex items-start space-x-3">
                        <div className="w-5 h-5 rounded-full bg-[#0068FF] flex items-center justify-center shrink-0 mt-0.5 overflow-hidden">
                          <ZaloIcon alt={SOCIAL_ALT.zalo(locale)} className="w-3.5 h-3.5 object-contain" />
                        </div>
                        <div>
                          <p className="text-xs text-[#9CA3AF] uppercase font-black tracking-wider mb-1">
                            {isVi ? 'Zalo hỗ trợ' : 'Zalo Support'}
                          </p>
                          <a
                            href={CONTACT_CONFIG.zaloUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={SOCIAL_ALT.zalo(locale)}
                            className="text-[#0068FF] font-bold hover:underline inline-flex items-center gap-1.5"
                          >
                            <span>{isVi ? 'Nhắn tin qua Zalo' : 'Chat via Zalo'}</span>
                            <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
                          </a>
                        </div>
                      </div>

                      {/* Kênh TikTok */}
                      <div className="flex items-start space-x-3">
                        <div className="w-5 h-5 rounded-full bg-black flex items-center justify-center shrink-0 mt-0.5 overflow-hidden">
                          <TikTokIcon alt={SOCIAL_ALT.tiktok(locale)} className="w-3 h-3 object-contain" />
                        </div>
                        <div>
                          <p className="text-xs text-[#9CA3AF] uppercase font-black tracking-wider mb-1">
                            {isVi ? 'Kênh TikTok' : 'TikTok Channel'}
                          </p>
                          <a
                            href={CONTACT_CONFIG.tiktokUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={SOCIAL_ALT.tiktok(locale)}
                            className="text-[#111111] font-bold hover:text-[#e0352b] transition-colors inline-flex items-center gap-1.5"
                          >
                            <span>@eggu_sandwich</span>
                            <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Local SEO Context Highlights */}
                    <div className="mt-4 p-3.5 bg-amber-50/80 border border-amber-200/80 rounded-2xl space-y-2 text-xs">
                      <div className="flex items-start gap-2">
                        <span className="text-amber-700 font-bold shrink-0">📍 Vị trí:</span>
                        <span className="text-neutral-700 font-medium">
                          {isVi
                            ? 'Nằm trên phố cà phê trứng Nguyễn Hữu Huân, cách Hồ Gươm & Phố Đi Bộ chỉ 300m.'
                            : 'Located on Nguyen Huu Huan street, only 300m from Hoan Kiem Lake & Walking Street.'}
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-amber-700 font-bold shrink-0">🛵 Đỗ xe:</span>
                        <span className="text-neutral-700 font-medium">
                          {isVi
                            ? 'Có chỗ dừng đỗ xe máy thuận tiện ngay trước tiệm để ghé mua mang đi (Takeaway).'
                            : 'Convenient motorbike parking in front for quick takeaway orders.'}
                        </span>
                      </div>
                      <div className="flex items-start gap-2">
                        <span className="text-amber-700 font-bold shrink-0">🚀 Giao nhanh:</span>
                        <span className="text-neutral-700 font-medium">
                          {isVi
                            ? 'Ship bánh nóng giòn từ 15-30 phút tới các cơ quan, văn phòng quận Hoàn Kiếm & Hai Bà Trưng.'
                            : 'Fast warm sandwich delivery within 15-30 mins across Hoan Kiem & Hai Ba Trung offices.'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Directions Action */}
                  <div className="pt-4 border-t border-neutral-100">
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
          </div>

          {/* Cột phải: Xếp theo chiều dọc (flex flex-col gap-3.5) */}
          <div className="flex flex-col justify-between gap-3.5 h-full">
            {/* Phía trên: Khung bản đồ Google Maps (chiều cao h-64 / h-72 hoặc flex-1, bo góc rounded-2xl) */}
            <div className="relative w-full flex-1 min-h-[260px] h-64 lg:h-auto rounded-2xl overflow-hidden border border-[#E5E7EB] shadow-xs bg-neutral-100">
              {embedUrl ? (
                <iframe
                  title={SOCIAL_ALT.map(locale)}
                  src={embedUrl}
                  width="100%"
                  height="100%"
                  className="w-full h-full min-h-[260px] border-0"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
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

            {/* Phía dưới bản đồ: Thanh banner Zalo hỗ trợ */}
            <a
              href={CONTACT_CONFIG.zaloUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={SOCIAL_ALT.zalo(locale)}
              className="p-4 bg-gradient-to-r from-blue-50/80 via-white to-white rounded-2xl border border-[#0068FF]/20 hover:border-[#0068FF] shadow-xs hover:shadow-md transition-all group cursor-pointer shrink-0"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#0068FF] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform shrink-0">
                    <ZaloIcon alt={SOCIAL_ALT.zalo(locale)} className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-base sm:text-lg font-black text-[#111111] group-hover:text-[#0068FF] transition-colors truncate">
                      {isVi ? 'Zalo Hỗ Trợ' : 'Zalo Support'}
                    </p>
                    <p className="text-xs text-neutral-500 font-medium truncate">
                      {isVi ? 'Tư vấn & giải đáp nhanh chóng' : 'Quick consultation & support'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-100/70 text-[#0068FF] text-xs font-bold group-hover:bg-[#0068FF] group-hover:text-white transition-colors shrink-0">
                  <span>{isVi ? 'Nhắn tin Zalo ngay' : 'Chat via Zalo'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </div>
            </a>

            {/* Hàng 2 nút Facebook / Messenger: Chia dạng 2 cột */}
            <div className="grid grid-cols-2 gap-2.5 shrink-0">
              <a
                href={CONTACT_CONFIG.messengerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-3 bg-[#0084FF] hover:bg-[#0073e6] text-white rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 shrink-0" />
                <span className="truncate">{isVi ? 'Nhắn Tin Messenger' : 'Chat via Messenger'}</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80 shrink-0" />
              </a>

              <a
                href={CONTACT_CONFIG.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-3 bg-[#0866FF] hover:bg-[#0756d6] text-white rounded-2xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <FacebookIcon className="w-4 h-4 shrink-0" />
                <span className="truncate">{isVi ? 'Ghé Thăm Fanpage' : 'Visit Fanpage'}</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80 shrink-0" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
