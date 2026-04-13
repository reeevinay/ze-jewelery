'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import type { Product } from '@/types';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const primaryImage = product.images[0] ?? 'aurelius/placeholder';
  const secondaryImage = product.images[1];
  const discountPct =
    product.compare_price && product.compare_price > product.price
      ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
      : null;

  return (
    <Link href={`/product/${product.slug}`} className="group product-card block">
      {/* Image */}
      <div className="relative aspect-[3/4] bg-ivory overflow-hidden">
        <Image
          src={primaryImage}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover product-card-image"
          priority={priority}
          loading={priority ? 'eager' : 'lazy'}
        />

        {/* Hover second image */}
        {secondaryImage && (
          <Image
            src={secondaryImage}
            alt={`${product.name} — alternate view`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            loading="lazy"
          />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {discountPct && (
            <span className="bg-gold-500 text-white text-2xs font-sans font-medium px-2 py-0.5 tracking-wide">
              −{discountPct}%
            </span>
          )}
          {product.featured && (
            <span className="bg-charcoal text-white text-2xs font-sans px-2 py-0.5 tracking-wide">
              Featured
            </span>
          )}
          {product.stock_qty === 0 && (
            <span className="bg-white/90 text-charcoal text-2xs font-sans px-2 py-0.5 tracking-wide">
              Sold Out
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          aria-label="Add to wishlist"
          className="absolute top-3 right-3 w-8 h-8 bg-white/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white"
          onClick={(e) => e.preventDefault()}
        >
          <Heart size={14} className="text-charcoal" />
        </button>

        {/* Quick add overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-white/95 py-3 text-center translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <span className="font-sans text-2xs tracking-[0.2em] uppercase text-charcoal">
            View Product
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="mt-3 px-1">
        <p className="font-sans text-2xs tracking-[0.1em] uppercase text-charcoal-muted mb-1">
          {product.category}
        </p>
        <h3 className="font-serif text-base font-light text-charcoal line-clamp-2 leading-snug">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 mt-1.5">
          <span className="font-sans text-sm text-charcoal">
            {formatPrice(product.price)}
          </span>
          {product.compare_price && product.compare_price > product.price && (
            <span className="font-sans text-xs text-gray-400 line-through">
              {formatPrice(product.compare_price)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

// ─── Skeleton ──────────────────────────────────────────────────────────────

export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[3/4] skeleton rounded-none" />
      <div className="mt-3 px-1 space-y-2">
        <div className="h-2 skeleton w-16" />
        <div className="h-4 skeleton w-3/4" />
        <div className="h-3 skeleton w-20" />
      </div>
    </div>
  );
}
