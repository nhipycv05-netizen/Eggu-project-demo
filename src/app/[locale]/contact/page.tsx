import { getTranslations } from 'next-intl/server';
import ContactForm from '@/components/contact/ContactForm';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

interface ContactPageProps {
  params: Promise<{ locale: string }>;
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;
  const t = await getTranslations('contact');
  const ts = await getTranslations('store');
  const isVi = locale === 'vi';

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-24 pb-20">
      <div className="max-w-6xl mx-auto px-6 space-y-16">
        {/* Title Header */}
        <div className="text-center space-y-4">
          <span className="text-[#EAAA08] text-xs font-bold uppercase tracking-widest block">
            {isVi ? 'Liên Hệ' : 'Contact'}
          </span>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-[#1E1B18]">
            {t('title')}
          </h1>
          <p className="text-[#706860] font-medium text-lg leading-relaxed max-w-xl mx-auto">
            {t('subtitle')}
          </p>
        </div>

        {/* Content Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Store Details & Map */}
          <div className="lg:col-span-6 space-y-8">
            <div className="bg-white p-8 rounded-3xl border border-[#E5E0D8] shadow-sm space-y-6">
              <h2 className="text-2xl font-black text-[#1E1B18]">EGGU Head Office</h2>

              <div className="space-y-4 text-sm font-semibold text-[#706860]">
                {/* Address */}
                <div className="flex items-start space-x-3">
                  <MapPin className="w-5 h-5 text-[#EAAA08] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-neutral-400 uppercase font-black tracking-wider mb-1">
                      {ts('address')}
                    </p>
                    <p className="text-[#1E1B18] font-medium leading-relaxed">
                      123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh
                    </p>
                  </div>
                </div>

                {/* Opening Hours */}
                <div className="flex items-start space-x-3">
                  <Clock className="w-5 h-5 text-[#EAAA08] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-neutral-400 uppercase font-black tracking-wider mb-1">
                      {ts('hours')}
                    </p>
                    <p className="text-[#1E1B18] font-bold">
                      07:00 AM - 10:00 PM
                    </p>
                  </div>
                </div>

                {/* Hotline */}
                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-[#EAAA08] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-neutral-400 uppercase font-black tracking-wider mb-1">
                      {ts('phone')}
                    </p>
                    <a href="tel:02812345678" className="text-[#EAAA08] font-bold hover:underline">
                      028 1234 5678
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-[#EAAA08] shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-neutral-400 uppercase font-black tracking-wider mb-1">
                      Email
                    </p>
                    <a href="mailto:hello@eggu.vn" className="text-[#1E1B18] font-bold hover:underline">
                      hello@eggu.vn
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Google Map iframe */}
            <div className="relative aspect-video w-full rounded-3xl overflow-hidden border border-[#E5E0D8] shadow-sm">
              <iframe
                title="EGGU Location Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.460288849492!2d106.70008241533423!3d10.774465492323063!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f40a1b17d59%3A0x367f08df9d05cb98!2zTmd1eeG7hW4gSHXhu4UsIELhur9uIE5naMOpLCBRdeG6rW4gMSwgVGjDoG5oIHBo4buRIEjhu5MgQ2jDrSBNaW5oLCBWaWV0bmFt!5e0m3!2s!4v1629618037192!5m2!1s!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              />
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
