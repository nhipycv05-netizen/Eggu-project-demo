'use client';

import React from 'react';
import { motion } from 'framer-motion';
import ProductCard, { ProductCardItem } from './ProductCard';

interface ProductGridProps {
  products: ProductCardItem[];
  locale: string;
  buttonLabel?: string;
  currencyLabel?: string;
  newBadgeLabel?: string;
  bestSellerBadgeLabel?: string;
  soldOutBadgeLabel?: string;
  soldOutBtnLabel?: string;
  className?: string;
}

export default function ProductGrid({
  products,
  locale,
  buttonLabel,
  currencyLabel,
  newBadgeLabel,
  bestSellerBadgeLabel,
  soldOutBadgeLabel,
  soldOutBtnLabel,
  className = 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5 md:gap-4 max-w-7xl mx-auto px-4 my-6',
}: ProductGridProps) {
  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className={className}>
      {products.map((product, index) => (
        <motion.div
          key={product.id}
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{
            duration: 0.6,
            ease: 'easeOut',
            delay: (index % 5) * 0.1,
          }}
          className="flex flex-col h-full"
        >
          <ProductCard
            product={product}
            locale={locale}
            buttonLabel={buttonLabel}
            currencyLabel={currencyLabel}
            newBadgeLabel={newBadgeLabel}
            bestSellerBadgeLabel={bestSellerBadgeLabel}
            soldOutBadgeLabel={soldOutBadgeLabel}
            soldOutBtnLabel={soldOutBtnLabel}
          />
        </motion.div>
      ))}
    </div>
  );
}
