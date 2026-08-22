import CheckoutForm from '@/components/checkout/CheckoutForm';

export default async function CheckoutPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <CheckoutForm />
      </div>
    </div>
  );
}
