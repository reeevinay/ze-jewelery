import type { Metadata } from 'next';
import { Suspense } from 'react';
import ShopLayout from '@/components/layout/ShopLayout';
import ProductGrid, { ProductGridSkeleton } from '@/components/shop/ProductGrid';
import FilterSidebar from '@/components/shop/FilterSidebar';
import { getProducts } from '@/lib/actions/products';

export const metadata: Metadata = {
  title: 'Shop All Jewelry',
  description:
    'Browse our complete collection of handcrafted rings, necklaces, earrings, bracelets and more. Free shipping on orders above ₹2,500.',
};

export const revalidate = 1800;

interface ShopPageProps {
  searchParams: { sort?: string; page?: string };
}

async function Products({ sort = 'newest', page = 1 }: { sort?: string; page?: number }) {
  const { products, total } = await getProducts({ page, limit: 24 });
  const totalPages = Math.ceil(total / 24);

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <p className="font-sans text-sm text-charcoal-muted">
          {total} {total === 1 ? 'piece' : 'pieces'}
        </p>
      </div>
      <ProductGrid products={products} />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-16">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={`/shop?page=${p}&sort=${sort}`}
              className={`w-10 h-10 flex items-center justify-center font-sans text-sm transition-colors ${
                p === page
                  ? 'bg-gold-500 text-white'
                  : 'border border-gray-200 text-charcoal hover:border-gold-500 hover:text-gold-600'
              }`}
            >
              {p}
            </a>
          ))}
        </div>
      )}
    </>
  );
}

export default function ShopPage({ searchParams }: ShopPageProps) {
  const sort = searchParams.sort ?? 'newest';
  const page = parseInt(searchParams.page ?? '1');

  return (
    <ShopLayout>
      {/* Hero */}
      <div className="bg-ivory py-12 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-sans text-2xs tracking-[0.25em] uppercase text-gold-500 mb-2">
            The Collection
          </p>
          <h1 className="font-serif text-4xl lg:text-5xl font-light text-charcoal">
            All Jewelry
          </h1>
          <div className="gold-divider mt-4" />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col lg:flex-row gap-12">
          <Suspense>
            <FilterSidebar activeCategory="" />
          </Suspense>

          <div className="flex-1 min-w-0">
            <Suspense fallback={<ProductGridSkeleton count={12} />}>
              <Products sort={sort} page={page} />
            </Suspense>
          </div>
        </div>
      </div>
    </ShopLayout>
  );
}
