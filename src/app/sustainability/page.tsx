import type { Metadata } from 'next';
import ShopLayout from '@/components/layout/ShopLayout';
import { Leaf, Recycle, Heart, Globe } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Sustainability',
  description: 'Learn about Aurelius Jewelry commitment to ethical sourcing, sustainable practices, and environmental responsibility.',
};

const PILLARS = [
  {
    icon: Leaf,
    title: 'Ethical Sourcing',
    description: 'All our gold is BIS hallmark certified and our diamonds are 100% conflict-free. We partner only with mines and suppliers who adhere to fair labor practices.',
  },
  {
    icon: Recycle,
    title: 'Recycled Materials',
    description: 'We actively incorporate recycled gold and silver into our designs, reducing the environmental impact of mining without compromising on quality.',
  },
  {
    icon: Heart,
    title: 'Artisan Welfare',
    description: 'Our artisans receive fair wages, safe working conditions, and ongoing skill development support. Every purchase directly supports their craft and livelihoods.',
  },
  {
    icon: Globe,
    title: 'Eco Packaging',
    description: 'Our packaging is made from FSC-certified paper, soy-based inks, and biodegradable materials. We are committed to eliminating single-use plastics from our supply chain.',
  },
];

export default function SustainabilityPage() {
  return (
    <ShopLayout>
      <section className="bg-ivory py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-sans text-2xs tracking-[0.35em] uppercase text-gold-500 mb-4">Our Commitment</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-light text-charcoal">Sustainability</h1>
          <div className="gold-divider mt-6" />
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <p className="font-sans text-sm text-charcoal-muted leading-relaxed max-w-2xl mx-auto mb-16">
          At Aurelius, we believe luxury and responsibility go hand in hand. Every decision — from the
          materials we source to the way we package — is made with our planet and communities in mind.
        </p>

        <div className="grid sm:grid-cols-2 gap-8">
          {PILLARS.map(({ icon: Icon, title, description }) => (
            <div key={title} className="border border-gray-100 p-8 text-center hover:border-gold-300 transition-colors duration-300">
              <Icon size={28} className="text-gold-500 mx-auto mb-4" strokeWidth={1.5} />
              <h3 className="font-serif text-lg font-light text-charcoal mb-3">{title}</h3>
              <p className="font-sans text-xs text-charcoal-muted leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>
    </ShopLayout>
  );
}
