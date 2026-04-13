import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Suspense } from 'react';
import ShopLayout from '@/components/layout/ShopLayout';
import AddToCartButton from '@/components/shop/AddToCartButton';
import ProductGrid from '@/components/shop/ProductGrid';
import { getProductBySlug, getRelatedProducts, getProducts } from '@/lib/actions/products';
import { formatPrice } from '@/lib/utils';
import { Shield, RefreshCw, Award, ChevronDown } from 'lucide-react';

// ISR — regenerate every 30 minutes
export const revalidate = 1800;

interface Props {
  params: { slug: string };
}

function cloudinaryUrl(publicId: string, opts: { w?: number; h?: number; crop?: 'fill' | 'limit' } = {}) {
  if (publicId.startsWith('http://') || publicId.startsWith('https://')) return publicId;
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) return null;
  const parts: string[] = ['f_auto', 'q_auto:good'];
  if (opts.w) parts.push(`w_${opts.w}`);
  if (opts.h) parts.push(`h_${opts.h}`);
  parts.push(`c_${opts.crop ?? 'fill'}`);
  const params = parts.join(',');
  return `https://res.cloudinary.com/${cloudName}/image/upload/${params}/${publicId}`;
}

export async function generateStaticParams() {
  const { products } = await getProducts({ limit: 100 });
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return { title: 'Product Not Found' };

  const ogImage = product.images[0] ? cloudinaryUrl(product.images[0], { w: 1200, h: 630, crop: 'fill' }) : null;

  return {
    title: product.meta_title ?? product.name,
    description: product.meta_description ?? product.short_description,
    openGraph: {
      title: product.name,
      description: product.short_description,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : [],
    },
  };
}

async function RelatedProducts({ productId, category }: { productId: string; category: string }) {
  const products = await getRelatedProducts(productId, category);
  if (products.length === 0) return null;
  return (
    <section className="border-t border-gray-100 pt-16">
      <div className="text-center mb-10">
        <h2 className="font-serif text-3xl font-light">You May Also Like</h2>
        <div className="gold-divider mt-3" />
      </div>
      <ProductGrid products={products} />
    </section>
  );
}

export default async function ProductPage({ params }: Props) {
  const product = await getProductBySlug(params.slug);
  if (!product) notFound();

  const primaryPublicId = product.images[0] ?? null;
  const primaryImage =
    (primaryPublicId ? cloudinaryUrl(primaryPublicId, { w: 1200, h: 1200, crop: 'fill' }) : null) ??
    '/images/product-placeholder.svg';
  const discountPct =
    product.compare_price && product.compare_price > product.price
      ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
      : null;

  // JSON-LD structured data
  const jsonLdImages = product.images
    .map((img) => cloudinaryUrl(img, { w: 1200, crop: 'limit' }))
    .filter(Boolean);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    sku: product.id,
    image: jsonLdImages,
    brand: { '@type': 'Brand', name: 'Aurelius Jewelry' },
    offers: {
      '@type': 'Offer',
      priceCurrency: 'INR',
      price: (product.price / 100).toFixed(2),
      availability:
        product.stock_qty > 0
          ? 'https://schema.org/InStock'
          : 'https://schema.org/OutOfStock',
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/product/${product.slug}`,
    },
    material: product.material,
    category: product.category,
  };

  return (
    <ShopLayout>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 font-sans text-xs text-charcoal-muted mb-8">
          <a href="/" className="hover:text-gold-500 transition-colors">Home</a>
          <span>·</span>
          <a href="/shop" className="hover:text-gold-500 transition-colors">Shop</a>
          <span>·</span>
          <a href={`/category/${product.category}`} className="hover:text-gold-500 transition-colors capitalize">
            {product.category}
          </a>
          <span>·</span>
          <span className="text-charcoal truncate max-w-[160px]">{product.name}</span>
        </nav>

        {/* Main grid */}
        <div className="grid lg:grid-cols-2 gap-12 xl:gap-16">
          {/* Images */}
          <div className="space-y-3">
            {/* Primary image */}
            <div className="aspect-square relative overflow-hidden bg-ivory">
              <Image
                src={primaryImage}
                alt={product.name}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              {discountPct && (
                <span className="absolute top-4 left-4 bg-gold-500 text-white text-2xs font-sans font-medium px-2 py-1 tracking-wide">
                  −{discountPct}%
                </span>
              )}
            </div>

            {/* Thumbnails */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(0, 4).map((img, i) => (
                  <div key={i} className="aspect-square relative overflow-hidden bg-ivory cursor-pointer group">
                    <Image
                      src={cloudinaryUrl(img, { w: 300, h: 300, crop: 'fill' }) ?? '/images/product-placeholder.svg'}
                      alt={`${product.name} view ${i + 1}`}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="15vw"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            <p className="font-sans text-2xs tracking-[0.2em] uppercase text-gold-500 mb-2">
              {product.category}
            </p>
            <h1 className="font-serif text-3xl lg:text-4xl font-light text-charcoal leading-snug">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 mt-4">
              <span className="font-serif text-2xl text-charcoal">
                {formatPrice(product.price)}
              </span>
              {product.compare_price && product.compare_price > product.price && (
                <>
                  <span className="font-sans text-base text-gray-400 line-through">
                    {formatPrice(product.compare_price)}
                  </span>
                  <span className="font-sans text-sm text-green-600 font-medium">
                    Save {discountPct}%
                  </span>
                </>
              )}
            </div>

            {/* Divider */}
            <div className="h-px bg-gray-100 my-6" />

            {/* Short description */}
            <p className="font-sans text-sm text-charcoal-muted leading-relaxed">
              {product.short_description}
            </p>

            {/* Specs */}
            <dl className="grid grid-cols-2 gap-x-6 gap-y-3 mt-6">
              {[
                { label: 'Material', value: product.material },
                { label: 'Category', value: product.category },
                product.weight && { label: 'Weight', value: product.weight },
                product.dimensions && { label: 'Dimensions', value: product.dimensions },
              ]
                .filter(Boolean)
                .map((spec: any) => (
                  <div key={spec.label}>
                    <dt className="font-sans text-2xs tracking-wide uppercase text-charcoal-muted">
                      {spec.label}
                    </dt>
                    <dd className="font-sans text-sm text-charcoal mt-0.5 capitalize">
                      {spec.value}
                    </dd>
                  </div>
                ))}
            </dl>

            {/* Stock status */}
            <div className="flex items-center gap-2 mt-6">
              <span
                className={`w-2 h-2 rounded-full ${
                  product.stock_qty > 5
                    ? 'bg-green-500'
                    : product.stock_qty > 0
                    ? 'bg-yellow-500'
                    : 'bg-red-500'
                }`}
              />
              <span className="font-sans text-xs text-charcoal-muted">
                {product.stock_qty > 5
                  ? 'In Stock'
                  : product.stock_qty > 0
                  ? `Only ${product.stock_qty} left`
                  : 'Out of Stock'}
              </span>
            </div>

            {/* Add to cart */}
            <div className="mt-6">
              <AddToCartButton product={product} />
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-3 gap-3 mt-6">
              {[
                { icon: Award, text: 'BIS Certified' },
                { icon: RefreshCw, text: '15-Day Returns' },
                { icon: Shield, text: 'Secure Payment' },
              ].map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="border border-gray-100 p-3 flex flex-col items-center gap-1.5 text-center"
                >
                  <Icon size={14} className="text-gold-500" strokeWidth={1.5} />
                  <span className="font-sans text-2xs text-charcoal-muted">{text}</span>
                </div>
              ))}
            </div>

            {/* Expandable description */}
            <details className="mt-8 border-t border-gray-100 group">
              <summary className="flex items-center justify-between py-4 cursor-pointer font-sans text-xs tracking-[0.15em] uppercase text-charcoal list-none">
                Full Description
                <ChevronDown size={14} className="transition-transform group-open:rotate-180" />
              </summary>
              <div className="pb-4 font-sans text-sm text-charcoal-muted leading-relaxed whitespace-pre-line">
                {product.description}
              </div>
            </details>

            <details className="border-t border-gray-100 group">
              <summary className="flex items-center justify-between py-4 cursor-pointer font-sans text-xs tracking-[0.15em] uppercase text-charcoal list-none">
                Shipping & Returns
                <ChevronDown size={14} className="transition-transform group-open:rotate-180" />
              </summary>
              <div className="pb-4 font-sans text-sm text-charcoal-muted leading-relaxed space-y-2">
                <p>Free shipping on orders above ₹2,500. Standard delivery in 5-7 business days.</p>
                <p>Express delivery (2-3 days) available at checkout.</p>
                <p>Returns accepted within 15 days of delivery for unworn, unaltered pieces.</p>
              </div>
            </details>

            <details className="border-t border-b border-gray-100 group">
              <summary className="flex items-center justify-between py-4 cursor-pointer font-sans text-xs tracking-[0.15em] uppercase text-charcoal list-none">
                Care Guide
                <ChevronDown size={14} className="transition-transform group-open:rotate-180" />
              </summary>
              <div className="pb-4 font-sans text-sm text-charcoal-muted leading-relaxed">
                Store in the provided pouch. Avoid contact with perfumes, chemicals and water.
                Clean gently with a soft cloth. Visit our care guide for full instructions.
              </div>
            </details>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-20">
          <Suspense>
            <RelatedProducts productId={product.id} category={product.category} />
          </Suspense>
        </div>
      </div>
    </ShopLayout>
  );
}
