import ProductCard, { ProductCardSkeleton } from './ProductCard';
import type { Product } from '@/types';

interface ProductGridProps {
  products: Product[];
  prioritizeFirst?: number;
}

export default function ProductGrid({ products, prioritizeFirst = 4 }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-24">
        <p className="font-serif text-2xl text-charcoal-muted font-light">
          No products found
        </p>
        <p className="font-sans text-sm text-gray-400 mt-2">
          Try adjusting your filters
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          priority={index < prioritizeFirst}
        />
      ))}
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-10">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}
