import { Suspense } from 'react';
import CheckoutForm from '@/components/checkout/CheckoutForm';

export default async function CheckoutPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-24 md:pt-28 pb-12 md:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Suspense
          fallback={
            <div className="min-h-[400px] flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-[#E53935] border-t-transparent rounded-full animate-spin" />
            </div>
          }
        >
          <CheckoutForm />
        </Suspense>
      </div>
    </div>
  );
}
