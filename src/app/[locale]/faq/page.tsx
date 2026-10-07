import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { createClient } from '@/lib/supabase/server';
import { Plus, Minus } from 'lucide-react';
import { getCanonicalUrl, getAlternateLanguages } from '@/lib/seo';

const MOCK_FAQS = [
  {
    id: 'faq-1',
    category: 'Ordering',
    question_vi: 'Làm thế nào để tôi đặt hàng trực tuyến?',
    question_en: 'How do I place an order online?',
    answer_vi: 'Bạn có thể truy cập trang "Thực Đơn", chọn bánh mì và đồ uống ưa thích, tùy chỉnh topping nếu muốn, sau đó click nút "Thanh toán". Nhập thông tin liên hệ và địa chỉ giao hàng để đặt hàng. Đơn hàng sẽ được thanh toán bằng hình thức COD (giao hàng nhận tiền) vô cùng tiện lợi mà không bắt buộc đăng ký tài khoản.',
    answer_en: 'Simply browse our "Menu" page, choose your desired sandwich or beverage, customize options (e.g. extra bacon, cheese, or eggs), and click checkout. Fill in your delivery details to complete the order. Payment is processed using COD (Cash on Delivery) without requiring any login/registration.',
  },
  {
    id: 'faq-2',
    category: 'Payment',
    question_vi: 'EGGU có hỗ trợ thanh toán trực tuyến không?',
    question_en: 'Does EGGU support online payments?',
    answer_vi: 'Hiện tại để tối giản hóa quy trình phục vụ nhanh chóng và tin cậy nhất, EGGU chỉ áp dụng duy nhất một hình thức thanh toán là COD (Thanh toán bằng tiền mặt khi nhận hàng). Chúng tôi chưa hỗ trợ các hình thức thanh toán online tại thời điểm này.',
    answer_en: 'To keep our operations simple and highly reliable, EGGU currently supports Cash on Delivery (COD) as the sole payment method. Online payments or bank transfers are not supported at this stage.',
  },
  {
    id: 'faq-3',
    category: 'Delivery',
    question_vi: 'EGGU giao hàng trong khoảng cách bao xa và mất bao lâu?',
    question_en: 'How far does EGGU deliver and how long does it take?',
    answer_vi: 'EGGU sẽ giao hàng tận nơi trong phạm vi bán kính tối đa 5km tính từ chi nhánh cửa hàng gần bạn nhất. Thời gian chuẩn bị bánh nóng hổi và vận chuyển thường dao động từ 15 đến 35 phút tùy thuộc cự ly địa chỉ nhận hàng.',
    answer_en: 'EGGU delivers within a maximum radius of 5km from our nearest physical branch. The sandwich preparation and delivery process normally takes between 15 and 35 minutes depending on your location.',
  },
];

interface FaqPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: FaqPageProps): Promise<Metadata> {
  const { locale } = await params;
  const isVi = locale === 'vi';
  const canonicalUrl = getCanonicalUrl('/faq', locale);
  const alternates = getAlternateLanguages('/faq');

  return {
    title: isVi
      ? 'Hỏi Đáp & Trợ Giúp (FAQ) | EGGU - Sandwich Trứng Hàn Quốc'
      : 'Frequently Asked Questions (FAQ) | EGGU Hanoi',
    description: isVi
      ? 'Giải đáp thắc mắc về cách đặt bánh, thanh toán COD, phạm vi giao hàng tận nơi của EGGU - Sandwich Trứng Hàn Quốc tại Hà Nội.'
      : 'Answers to frequently asked questions about ordering, delivery, and payment at EGGU Korean Egg Sandwich Hanoi.',
    keywords: [
      'FAQ EGGU',
      'Hỏi đáp EGGU',
      'Sandwich Trứng Hàn Quốc',
      'Korean Egg Sandwich',
      'Bánh mì sandwich Hà Nội',
    ],
    alternates: {
      canonical: canonicalUrl,
      languages: alternates,
    },
    openGraph: {
      title: isVi
        ? 'Hỏi Đáp & Trợ Giúp (FAQ) | EGGU'
        : 'Frequently Asked Questions (FAQ) | EGGU',
      description: isVi
        ? 'Giải đáp thắc mắc về đặt bánh mì sandwich trứng Hàn Quốc tại EGGU Hà Nội.'
        : 'Answers to frequently asked questions about EGGU Korean egg sandwiches in Hanoi.',
      url: canonicalUrl,
      siteName: 'EGGU',
    },
  };
}

export default async function FaqPage({ params }: FaqPageProps) {
  const { locale } = await params;
  const t = await getTranslations('faq');
  const isVi = locale === 'vi';

  // Fetch FAQs from Supabase with fallback to mock data
  let faqs = MOCK_FAQS;
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from('faqs')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true });
    
    if (data && data.length > 0) {
      faqs = data;
    }
  } catch (error) {
    console.error('Supabase query failed on FAQ page, using mock fallbacks:', error);
  }

  // Group FAQs by category
  const categories = Array.from(new Set(faqs.map((f) => f.category)));

  // Helper to translate category headers according to current locale (Ordering -> ĐẶT HÀNG / ORDERING, Payment -> THANH TOÁN / PAYMENT)
  const getCategoryLabel = (category: string) => {
    const key = category.toLowerCase().trim();
    if (key === 'ordering' || key === 'dat-hang' || key === 'đặt hàng') {
      return t('categoryOrdering') || (isVi ? 'ĐẶT HÀNG' : 'ORDERING');
    }
    if (key === 'payment' || key === 'thanh-toan' || key === 'thanh toán') {
      return t('categoryPayment') || (isVi ? 'THANH TOÁN' : 'PAYMENT');
    }
    if (key === 'delivery' || key === 'giao-hang' || key === 'giao hàng') {
      return t('categoryDelivery') || (isVi ? 'GIAO HÀNG' : 'DELIVERY');
    }
    return category;
  };

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: isVi ? f.question_vi : f.question_en,
      acceptedAnswer: {
        '@type': 'Answer',
        text: isVi ? f.answer_vi : f.answer_en,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-transparent pt-24 md:pt-28 pb-12 md:pb-16">
      {/* FAQ Schema Markup JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-8 md:space-y-10">
          {/* Title Header (Minimalist Left-Aligned) */}
          <div className="border-b border-[#e0352b]/20 pb-3 mb-6 text-left">
            <h1 className="text-xl font-bold uppercase tracking-wider text-[#e0352b]">
              {t('title')}
            </h1>
          </div>

          {/* FAQ Categories Accodions List */}
          <div className="space-y-12">
            {categories.map((category) => {
              const categoryFaqs = faqs.filter((f) => f.category === category);
              return (
                <div key={category} className="space-y-6">
                  <h2 className="text-xl font-black text-[#111111] uppercase tracking-wider border-b border-[#E5E7EB] pb-2">
                    {getCategoryLabel(category)}
                  </h2>
                  <div className="divide-y divide-[#E5E7EB]">
                    {categoryFaqs.map((faq) => (
                      <details
                        key={faq.id}
                        className="group py-5 [&_summary::-webkit-details-marker]:hidden"
                      >
                        <summary className="flex items-center justify-between cursor-pointer focus:outline-none list-none">
                          <h3 className="text-base md:text-lg font-bold text-[#111111] group-open:text-[#E53935] transition-colors duration-200 pr-4">
                            {isVi ? faq.question_vi : faq.question_en}
                          </h3>
                          <span className="relative w-5 h-5 shrink-0 flex items-center justify-center">
                            <Plus className="w-5 h-5 text-[#6B7280] group-open:hidden transition-all duration-200" />
                            <Minus className="w-5 h-5 text-[#E53935] hidden group-open:block transition-all duration-200" />
                          </span>
                        </summary>
                        <div className="mt-4 text-[#6B7280] text-sm md:text-base leading-relaxed font-medium pl-1 max-w-2xl">
                          {isVi ? faq.answer_vi : faq.answer_en}
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
