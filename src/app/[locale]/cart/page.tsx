import CartManager from '@/components/cart/CartManager';

interface CartPageProps {
  params: Promise<{ locale: string }>;
}

export default async function CartPage({ params }: CartPageProps) {
  const { locale } = await params;

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-24 md:pt-28 pb-12 md:pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <CartManager locale={locale} />
      </div>
    </div>
  );
}
