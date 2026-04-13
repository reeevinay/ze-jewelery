import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import ShopLayout from '@/components/layout/ShopLayout';
import ProductGrid, { ProductGridSkeleton } from '@/components/shop/ProductGrid';
import { getFeaturedProducts } from '@/lib/actions/products';
import { Award, RefreshCw, Truck, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Aurelius Jewelry — Heirloom Fine Jewelry',
  description:
    'Discover handcrafted heirloom jewelry made with ethically sourced gold, diamonds and precious stones. Free shipping above ₹2,500.',
};

// ISR — regenerate every hour
export const revalidate = 3600;

async function FeaturedProducts() {
  const products = await getFeaturedProducts();
  return <ProductGrid products={products} prioritizeFirst={4} />;
}

const CATEGORIES = [
  { name: 'Rings', slug: 'rings', image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=600&q=80' },
  { name: 'Necklaces', slug: 'necklaces', image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600&q=80' },
  { name: 'Earrings', slug: 'earrings', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80' },
  { name: 'Bracelets', slug: 'bracelets', image: '/images/bracelets.svg' },
];

const TRUST_BADGES = [
  { icon: Award, label: 'BIS Hallmark Certified', description: 'All gold jewelry is certified' },
  { icon: Truck, label: 'Free Shipping ₹2,500+', description: 'Pan-India express delivery' },
  { icon: RefreshCw, label: '15-Day Returns', description: 'Hassle-free return policy' },
  { icon: Shield, label: 'Secure Payments', description: 'Razorpay encrypted checkout' },
];

export default function HomePage() {
  return (
    <ShopLayout>
      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <section className="relative h-[90vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=1800&q=90"
            alt="Luxury jewelry collection — Aurelius"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/50" />
        </div>

        {/* Hero content */}
        <div className="relative z-10 text-center text-white max-w-3xl mx-auto px-6 animate-fade-in">
          <p className="font-sans text-2xs tracking-[0.35em] uppercase text-gold-300 mb-6">
            Heirloom Jewelry Since 2018
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-light leading-tight mb-6">
            Crafted to Last
            <br />
            <em className="italic text-gold-300">Generations</em>
          </h1>
          <p className="font-sans text-base text-white/80 max-w-md mx-auto mb-10 leading-relaxed">
            Each piece is handcrafted using ethically sourced gold and
            precious stones by master artisans.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop" className="btn-gold">
              Explore Collection
            </Link>
            <Link href="/category/rings" className="btn-outline-gold border-white text-white hover:bg-white hover:text-charcoal">
              Shop Rings
            </Link>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60">
          <span className="font-sans text-2xs tracking-[0.2em] uppercase">Scroll</span>
          <div className="w-px h-8 bg-white/40 animate-gold-pulse" />
        </div>
      </section>

      {/* ── Trust Badges ─────────────────────────────────────────────── */}
      <section className="border-y border-gray-100 bg-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-gray-200">
            {TRUST_BADGES.map(({ icon: Icon, label, description }) => (
              <div key={label} className="flex flex-col items-center text-center py-8 px-4 gap-2">
                <Icon size={20} className="text-gold-500 mb-1" strokeWidth={1.5} />
                <p className="font-sans text-xs font-medium text-charcoal tracking-wide">{label}</p>
                <p className="font-sans text-2xs text-charcoal-muted hidden sm:block">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Shop by Category ─────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <p className="font-sans text-2xs tracking-[0.25em] uppercase text-gold-500 mb-3">
            Browse by Category
          </p>
          <h2 className="font-serif text-4xl font-light text-charcoal">
            Find Your Perfect Piece
          </h2>
          <div className="gold-divider mt-4" />
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              className="group relative aspect-[3/4] overflow-hidden"
            >
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="font-serif text-xl text-white font-light">{cat.name}</p>
                <p className="font-sans text-2xs text-gold-300 tracking-[0.15em] uppercase mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  Shop Now →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured Products ─────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="text-center mb-12">
          <p className="font-sans text-2xs tracking-[0.25em] uppercase text-gold-500 mb-3">
            Handpicked for You
          </p>
          <h2 className="font-serif text-4xl font-light text-charcoal">
            Featured Collection
          </h2>
          <div className="gold-divider mt-4" />
        </div>

        <Suspense fallback={<ProductGridSkeleton count={8} />}>
          <FeaturedProducts />
        </Suspense>

        <div className="text-center mt-12">
          <Link href="/shop" className="btn-outline-gold">
            View All Jewelry
          </Link>
        </div>
      </section>

      {/* ── Brand Story ───────────────────────────────────────────────── */}
      <section className="bg-charcoal text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="font-sans text-2xs tracking-[0.25em] uppercase text-gold-400 mb-4">
                Our Craft
              </p>
              <h2 className="font-serif text-4xl lg:text-5xl font-light leading-tight mb-6">
                Every Piece Tells
                <br />
                <em className="italic text-gold-400">a Story</em>
              </h2>
              <p className="font-sans text-sm text-gray-400 leading-relaxed mb-4">
                At Aurelius, we believe jewelry is more than adornment — it&apos;s memory made tangible.
                Our artisans work with centuries-old techniques passed down through generations,
                combining them with modern precision to create pieces that endure.
              </p>
              <p className="font-sans text-sm text-gray-400 leading-relaxed mb-8">
                All our gold is BIS hallmark certified. Our diamonds are conflict-free.
                Our stones are ethically sourced from trusted mines in India and abroad.
              </p>
              <Link href="/about" className="btn-outline-gold border-gold-500 text-gold-400 hover:bg-gold-500 hover:text-white">
                Our Story
              </Link>
            </div>
            <div className="relative aspect-square max-w-md mx-auto lg:mx-0 lg:ml-auto">
              <Image
                src="/images/craft.svg"
                alt="Aurelius craftsman at work"
                fill
                className="object-cover"
                loading="lazy"
                sizes="(max-width: 1024px) 80vw, 40vw"
              />
              <div className="absolute -bottom-4 -left-4 bg-gold-500 text-white p-6 max-w-[160px]">
                <p className="font-serif text-3xl font-light">6+</p>
                <p className="font-sans text-2xs tracking-wide uppercase mt-1">
                  Years of Craftsmanship
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </ShopLayout>
  );
}
