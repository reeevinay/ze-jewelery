'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';

const CATEGORIES = [
  { slug: '', label: 'All Jewelry' },
  { slug: 'rings', label: 'Rings' },
  { slug: 'necklaces', label: 'Necklaces' },
  { slug: 'earrings', label: 'Earrings' },
  { slug: 'bracelets', label: 'Bracelets' },
  { slug: 'bangles', label: 'Bangles' },
  { slug: 'pendants', label: 'Pendants' },
  { slug: 'sets', label: 'Sets' },
];

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'featured', label: 'Featured' },
];

interface FilterSidebarProps {
  activeCategory?: string;
}

export default function FilterSidebar({ activeCategory = '' }: FilterSidebarProps) {
  const searchParams = useSearchParams();
  const currentSort = searchParams.get('sort') ?? 'newest';

  function buildUrl(category: string, sort?: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (sort) params.set('sort', sort);
    else params.delete('sort');

    if (category) {
      return `/category/${category}?${params.toString()}`;
    }
    return `/shop?${params.toString()}`;
  }

  return (
    <aside className="w-full lg:w-56 shrink-0">
      {/* Categories */}
      <div className="mb-8">
        <h2 className="font-sans text-2xs tracking-[0.2em] uppercase text-charcoal-muted mb-4 pb-2 border-b border-gray-100">
          Category
        </h2>
        <ul className="space-y-1">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.slug;
            return (
              <li key={cat.slug}>
                <Link
                  href={buildUrl(cat.slug)}
                  className={cn(
                    'block font-sans text-sm py-1.5 transition-colors duration-150',
                    isActive
                      ? 'text-gold-600 font-medium'
                      : 'text-charcoal-muted hover:text-charcoal'
                  )}
                >
                  {isActive && (
                    <span className="inline-block w-3 mr-1.5 border-t border-gold-500 align-middle" />
                  )}
                  {cat.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Sort */}
      <div className="mb-8">
        <h2 className="font-sans text-2xs tracking-[0.2em] uppercase text-charcoal-muted mb-4 pb-2 border-b border-gray-100">
          Sort By
        </h2>
        <ul className="space-y-1">
          {SORT_OPTIONS.map((opt) => {
            const isActive = currentSort === opt.value;
            const href = buildUrl(activeCategory, opt.value);
            return (
              <li key={opt.value}>
                <Link
                  href={href}
                  className={cn(
                    'block font-sans text-sm py-1.5 transition-colors duration-150',
                    isActive
                      ? 'text-gold-600 font-medium'
                      : 'text-charcoal-muted hover:text-charcoal'
                  )}
                >
                  {opt.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Price Range (static UI — extend with JS for interactivity) */}
      <div>
        <h2 className="font-sans text-2xs tracking-[0.2em] uppercase text-charcoal-muted mb-4 pb-2 border-b border-gray-100">
          Price Range
        </h2>
        <div className="flex gap-2 items-center">
          <input
            type="number"
            placeholder="Min"
            className="input-luxury text-xs py-2"
          />
          <span className="text-charcoal-muted text-xs">—</span>
          <input
            type="number"
            placeholder="Max"
            className="input-luxury text-xs py-2"
          />
        </div>
      </div>
    </aside>
  );
}
