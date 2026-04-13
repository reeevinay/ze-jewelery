import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import ShopLayout from '@/components/layout/ShopLayout';
import ProductGrid, { ProductGridSkeleton } from '@/components/shop/ProductGrid';
import FilterSidebar from '@/components/shop/FilterSidebar';
import { getProducts } from '@/lib/actions/products';
import type { ProductCategory } from '@/types';

const CATEGORY_META: Record<string, { title: string; description: string }> = {
  rings:     { title: 'Rings', description: 'Discover our collection of handcrafted gold and diamond rings for every occasion.' },
  necklaces: { title: 'Necklaces', description: 'Explore our exquisite range of gold necklaces, chains and chokers.' },
  earrings:  { title: 'Earrings', description: 'Shop beautiful earrings from studs to chandeliers in gold and precious stones.' },
  bracelets: { title: 'Bracelets', description: 'Find the perfect gold bracelet — from delicate chains to statement cuffs.' },
  bangles:   { title: 'Bangles', description: 'Traditional and contemporary gold bangles for every style.' },
  pendants:  { title: 'Pendants', description: 'Meaningful pendants in gold, diamonds and gemstones.' },
  sets:      { title: 'Jewelry Sets', description: 'Complete jewelry sets for weddings, festivals and special occasions.' },
};

const VALID_CATEGORIES = Object.keys(CATEGORY_META);

interface CategoryPageProps {
  params: { category: string };
  searchParams: { sort?: string; page?: string };
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const meta = CATEGORY_META[params.category];
  if (!meta) return { title: 'Not Found' };
  return {
    title: meta.title,
    description: meta.description,
  };
}

async function CategoryProducts({ category, page }: { category: string; page: number }) {
  const { products, total } = await getProducts({
    category: category as ProductCategory,
    page,
    limit: 24,
  });

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <p className="font-sans text-sm text-charcoal-muted">
          {total} {total === 1 ? 'piece' : 'pieces'}
        </p>
      </div>
      <ProductGrid products={products} />
    </>
  );
}

export default function CategoryPage({ params, searchParams }: CategoryPageProps) {
  if (!VALID_CATEGORIES.includes(params.category)) {
    notFound();
  }

  const meta = CATEGORY_META[params.category];
  const page = parseInt(searchParams.page ?? '1');

  return (
    <ShopLayout>
      {/* Hero */}
      <div className="bg-ivory py-12 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-sans text-2xs tracking-[0.25em] uppercase text-gold-500 mb-2">
            Collection
          </p>
          <h1 className="font-serif text-4xl lg:text-5xl font-light text-charcoal">
            {meta.title}
          </h1>
          <p className="font-sans text-sm text-charcoal-muted mt-3 max-w-lg mx-auto">
            {meta.description}
          </p>
          <div className="gold-divider mt-4" />
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <nav className="flex items-center gap-2 font-sans text-xs text-charcoal-muted">
          <a href="/" className="hover:text-gold-500 transition-colors">Home</a>
          <span>·</span>
          <a href="/shop" className="hover:text-gold-500 transition-colors">Shop</a>
          <span>·</span>
          <span className="text-charcoal">{meta.title}</span>
        </nav>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col lg:flex-row gap-12">
          <Suspense>
            <FilterSidebar activeCategory={params.category} />
          </Suspense>

          <div className="flex-1 min-w-0">
            <Suspense fallback={<ProductGridSkeleton count={12} />}>
              <CategoryProducts category={params.category} page={page} />
            </Suspense>
          </div>
        </div>
      </div>
    </ShopLayout>
  );
}
