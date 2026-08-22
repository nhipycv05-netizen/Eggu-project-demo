import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/navigation';
import { getOrderDetails } from '@/features/orders/actions';
import { CheckCircle2, ShoppingBag, Home, FileText } from 'lucide-react';

interface SuccessOption {
  id: string;
  name_vi: string;
  name_en: string;
  price: number;
}

interface SuccessItem {
  id: string;
  product_id: string | null;
  product_name_vi: string;
  product_name_en: string;
  quantity: number;
  unit_price: number;
  subtotal: number;
  options: SuccessOption[] | null;
  note: string | null;
  created_at: string;
}

interface OrderSuccessPageProps {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ order?: string }>;
}

export default async function OrderSuccessPage({ params, searchParams }: OrderSuccessPageProps) {
  const { locale } = await params;
  const { order: orderNumber } = await searchParams;

  const t = await getTranslations('success');
  const tc = await getTranslations('common');
  const isVi = locale === 'vi';

  if (!orderNumber) {
    notFound();
  }

  // Fetch order details securely by calling the server action
  const orderDetails = await getOrderDetails(orderNumber);

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] pt-24 pb-20 flex items-center justify-center">
        <div className="text-center py-12 bg-white rounded-3xl border border-[#E5E0D8] p-8 space-y-4 max-w-md mx-auto shadow-sm">
          <ShoppingBag className="w-12 h-12 text-[#706860] mx-auto animate-pulse" />
          <h3 className="text-lg font-bold text-[#1E1B18]">Order not found</h3>
          <p className="text-sm text-[#706860] font-semibold">
            We couldn&apos;t retrieve the details for order number &ldquo;{orderNumber}&rdquo;.
          </p>
          <Link
            href="/menu"
            className="inline-block px-6 py-2 bg-[#EAAA08] text-[#1E1B18] font-bold rounded-xl hover:bg-[#EAAA08]/90 transition"
          >
            {tc('exploreMenu')}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-24 pb-20">
      <div className="max-w-xl mx-auto px-6 space-y-8">
        {/* Header checkmark */}
        <div className="bg-white p-8 rounded-3xl border border-[#E5E0D8] shadow-sm text-center space-y-4">
          <div className="w-16 h-16 bg-[#22C55E]/15 text-[#22C55E] rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-[#1E1B18]">{t('title')}</h1>
            <p className="text-sm text-[#706860] font-medium leading-relaxed">
              {t('subtitle')}
            </p>
          </div>
        </div>

        {/* Order Details Panel */}
        <div className="bg-white p-8 rounded-3xl border border-[#E5E0D8] shadow-sm space-y-6">
          <h3 className="text-lg font-black text-[#1E1B18] border-b border-[#E5E0D8] pb-4 flex items-center space-x-2">
            <FileText className="w-5 h-5 text-[#EAAA08]" />
            <span>Order Summary</span>
          </h3>

          <div className="space-y-4 text-sm font-semibold text-[#706860]">
            {/* Order Number */}
            <div className="flex justify-between items-center py-1">
              <span>{t('orderNumber')}</span>
              <span className="text-[#1E1B18] font-extrabold">{orderDetails.order_number}</span>
            </div>

            {/* Payment Method */}
            <div className="flex justify-between items-center py-1">
              <span>{t('paymentMethod')}</span>
              <span className="text-[#1E1B18] font-extrabold">{orderDetails.payment_method} (COD)</span>
            </div>

            {/* Delivery address info */}
            <div className="border-t border-[#E5E0D8] pt-4 space-y-1">
              <span className="text-xs uppercase text-[#706860] font-black tracking-wider block">
                Deliver to
              </span>
              <p className="text-[#1E1B18] text-sm leading-relaxed font-bold">
                {orderDetails.customer_name} ({orderDetails.phone})
              </p>
              <p className="text-[#706860] text-xs font-semibold leading-relaxed">
                {orderDetails.address}
              </p>
            </div>

            {/* Ordered Items list */}
            <div className="border-t border-[#E5E0D8] pt-4 space-y-3">
              <span className="text-xs uppercase text-[#706860] font-black tracking-wider block">
                Items
              </span>
              <div className="divide-y divide-[#E5E0D8]/40">
                {(orderDetails.items as SuccessItem[]).map((item, idx) => {
                  return (
                    <div key={idx} className="py-2.5 flex justify-between items-start gap-4">
                      <div>
                        <p className="text-[#1E1B18] text-sm font-bold">
                          {isVi ? item.product_name_vi : item.product_name_en}
                          <span className="text-xs text-[#706860] font-black ml-1">
                            x{item.quantity}
                          </span>
                        </p>
                        {item.options && item.options.length > 0 && (
                          <p className="text-xs text-[#706860] font-medium mt-0.5">
                            {item.options.map((o) => (isVi ? o.name_vi : o.name_en)).join(', ')}
                          </p>
                        )}
                      </div>
                      <span className="text-[#5C4B3E] font-bold text-sm shrink-0">
                        {Number(item.subtotal).toLocaleString()} {tc('currency')}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Prices details */}
            <div className="border-t border-[#E5E0D8] pt-4 space-y-2">
              <div className="flex justify-between text-xs">
                <span>Subtotal</span>
                <span className="text-[#1E1B18]">
                  {Number(orderDetails.subtotal).toLocaleString()} {tc('currency')}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Delivery Fee</span>
                <span className="text-[#1E1B18]">
                  {Number(orderDetails.delivery_fee).toLocaleString()} {tc('currency')}
                </span>
              </div>
              <div className="border-t border-[#E5E0D8] pt-3 flex justify-between items-end">
                <span className="text-base font-black text-[#1E1B18]">{t('total')}</span>
                <span className="text-xl font-black text-[#5C4B3E]">
                  {Number(orderDetails.total).toLocaleString()} {tc('currency')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation banner */}
        <div className="p-4 bg-[#EAAA08]/10 border border-[#EAAA08]/30 rounded-xl text-center text-sm font-bold text-[#5C4B3E]">
          {t('confirmCall')}
        </div>

        {/* Action Links */}
        <div className="flex gap-4">
          <Link
            href="/"
            className="flex-1 py-4 bg-white border border-[#E5E0D8] text-[#1E1B18] font-extrabold uppercase tracking-wider rounded-xl text-center shadow-sm hover:bg-[#EFECE6] transition duration-150 flex items-center justify-center space-x-2 text-xs"
          >
            <Home className="w-4 h-4" />
            <span>{t('backHome')}</span>
          </Link>
          <Link
            href="/menu"
            className="flex-1 py-4 bg-[#EAAA08] text-[#1E1B18] font-extrabold uppercase tracking-wider rounded-xl text-center shadow-md hover:shadow-lg hover:bg-[#EAAA08]/90 transition duration-150 flex items-center justify-center space-x-2 text-xs"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>{t('continueShopping')}</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
