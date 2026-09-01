import CheckoutForm from '@/components/checkout/CheckoutForm';

export default async function CheckoutPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-24 md:pt-28 pb-12 md:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CheckoutForm />
      </div>
    </div>
  );
}
