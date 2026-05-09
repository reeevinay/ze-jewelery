import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import ShopLayout from '@/components/layout/ShopLayout';
import { Award, Heart, Gem, Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us',
  description:
    'Learn about Aurelius Jewelry — our story, our values, and our commitment to crafting heirloom-quality fine jewelry with ethically sourced materials.',
};

const VALUES = [
  {
    icon: Gem,
    title: 'Exceptional Craftsmanship',
    description:
      'Every piece is handcrafted by master artisans using centuries-old techniques refined for the modern age.',
  },
  {
    icon: Heart,
    title: 'Ethically Sourced',
    description:
      'We use only conflict-free diamonds, BIS hallmark certified gold, and responsibly mined precious stones.',
  },
  {
    icon: Award,
    title: 'Heirloom Quality',
    description:
      'Our jewelry is built to endure — designed to be passed down through generations as cherished family heirlooms.',
  },
  {
    icon: Users,
    title: 'Customer First',
    description:
      'From selection to delivery, we provide white-glove service with 15-day hassle-free returns and lifetime support.',
  },
];

export default function AboutPage() {
  return (
    <ShopLayout>
      {/* Hero */}
      <section className="relative h-[50vh] min-h-[350px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=1800&q=90"
            alt="Aurelius jewelry craftsmanship"
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />
        </div>
        <div className="relative z-10 text-center text-white max-w-2xl mx-auto px-6">
          <p className="font-sans text-2xs tracking-[0.35em] uppercase text-gold-300 mb-4">
            Our Story
          </p>
          <h1 className="font-serif text-5xl sm:text-6xl font-light leading-tight">
            About <em className="italic text-gold-300">Aurelius</em>
          </h1>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <div className="gold-divider mb-8" />
          <h2 className="font-serif text-3xl sm:text-4xl font-light text-charcoal mb-6">
            Where Heritage Meets Elegance
          </h2>
          <p className="font-sans text-sm text-charcoal-muted leading-relaxed max-w-2xl mx-auto mb-4">
            Founded in 2018, Aurelius Jewelry was born from a simple belief — that jewelry
            should be more than an accessory. It should be a story, a memory, a legacy. Our
            founders envisioned a brand that marries India&apos;s rich tradition of goldsmithing
            with contemporary design sensibilities.
          </p>
          <p className="font-sans text-sm text-charcoal-muted leading-relaxed max-w-2xl mx-auto">
            Today, every Aurelius piece travels from the hands of our master artisans —
            each with over a decade of experience — to become a treasured part of your life.
            We work exclusively with BIS hallmark certified gold, conflict-free diamonds,
            and ethically sourced gemstones to ensure that every creation is as responsible
            as it is beautiful.
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="bg-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-14">
            <p className="font-sans text-2xs tracking-[0.25em] uppercase text-gold-500 mb-3">
              What We Stand For
            </p>
            <h2 className="font-serif text-3xl sm:text-4xl font-light text-charcoal">
              Our Values
            </h2>
            <div className="gold-divider mt-4" />
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {VALUES.map(({ icon: Icon, title, description }) => (
              <div key={title} className="text-center px-4">
                <div className="w-12 h-12 mx-auto mb-4 border border-gold-300 flex items-center justify-center">
                  <Icon size={20} className="text-gold-500" strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-lg font-light text-charcoal mb-2">{title}</h3>
                <p className="font-sans text-xs text-charcoal-muted leading-relaxed">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Promise */}
      <section className="bg-charcoal text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <p className="font-sans text-2xs tracking-[0.25em] uppercase text-gold-400 mb-4">
            Our Promise
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl font-light leading-tight mb-6">
            Jewelry That Outlives <em className="italic text-gold-400">Trends</em>
          </h2>
          <p className="font-sans text-sm text-gray-400 leading-relaxed max-w-2xl mx-auto mb-10">
            We don&apos;t follow fast fashion. Every Aurelius piece is designed to be timeless
            — a quiet statement of elegance that grows more meaningful with each passing year.
            When you choose Aurelius, you choose a piece of art that will be cherished for
            generations.
          </p>
          <Link
            href="/shop"
            className="btn-outline-gold border-gold-500 text-gold-400 hover:bg-gold-500 hover:text-white"
          >
            Explore Our Collection
          </Link>
        </div>
      </section>
    </ShopLayout>
  );
}
