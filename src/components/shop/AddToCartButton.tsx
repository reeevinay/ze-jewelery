'use client';

import { useState } from 'react';
import { ShoppingBag, Check } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { toast } from 'sonner';
import type { Product } from '@/types';

interface AddToCartProps {
  product: Product;
  className?: string;
}

export default function AddToCartButton({ product, className = '' }: AddToCartProps) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);

  const isOutOfStock = product.stock_qty === 0;

  const handleAdd = () => {
    if (isOutOfStock || added) return;

    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] ?? '',
      slug: product.slug,
      maxQty: product.stock_qty,
    });

    setAdded(true);
    toast.success(`${product.name} added to cart`, {
      duration: 2500,
    });

    setTimeout(() => setAdded(false), 2500);
  };

  return (
    <button
      onClick={handleAdd}
      disabled={isOutOfStock}
      className={`btn-gold w-full flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isOutOfStock ? (
        <span>Out of Stock</span>
      ) : added ? (
        <>
          <Check size={15} />
          <span>Added to Cart</span>
        </>
      ) : (
        <>
          <ShoppingBag size={15} />
          <span>Add to Cart</span>
        </>
      )}
    </button>
  );
}
