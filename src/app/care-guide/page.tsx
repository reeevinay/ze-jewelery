import type { Metadata } from 'next';
import ShopLayout from '@/components/layout/ShopLayout';
import { Droplets, Sun, SprayCan, Gem } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Jewelry Care Guide',
  description: 'Learn how to keep your Aurelius jewelry looking beautiful for generations with our expert care tips.',
};

const TIPS = [
  {
    icon: Droplets,
    title: 'Avoid Moisture',
    do: 'Remove jewelry before showering, swimming, or washing hands.',
    dont: 'Never expose jewelry to chlorine, salt water, or hot tubs.',
  },
  {
    icon: SprayCan,
    title: 'Cosmetics & Chemicals',
    do: 'Put jewelry on last — after perfume, lotion, and hairspray have dried.',
    dont: 'Avoid contact with household cleaners, bleach, or abrasive chemicals.',
  },
  {
    icon: Sun,
    title: 'Storage',
    do: 'Store each piece separately in the Aurelius pouch or a soft-lined box.',
    dont: 'Don\u0027t store pieces together — they can scratch each other.',
  },
  {
    icon: Gem,
    title: 'Cleaning',
    do: 'Gently polish with a soft microfiber cloth after each wear.',
    dont: 'Don\u0027t use toothpaste, baking soda, or ultrasonic cleaners on delicate stones.',
  },
];

export default function CareGuidePage() {
  return (
    <ShopLayout>
      <section className="bg-ivory py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-sans text-2xs tracking-[0.35em] uppercase text-gold-500 mb-4">Keep It Beautiful</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-light text-charcoal">Jewelry Care Guide</h1>
          <div className="gold-divider mt-6" />
        </div>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className="font-sans text-sm text-charcoal-muted leading-relaxed text-center max-w-2xl mx-auto mb-14">
          Fine jewelry is meant to last a lifetime — and beyond. With a few simple habits, you can keep
          your Aurelius pieces looking radiant for generations.
        </p>

        <div className="space-y-8">
          {TIPS.map(({ icon: Icon, title, do: doTip, dont }) => (
            <div key={title} className="border border-gray-100 p-6 grid md:grid-cols-[auto_1fr_1fr] gap-6 items-start hover:border-gold-300 transition-colors">
              <div className="w-12 h-12 border border-gold-200 flex items-center justify-center shrink-0">
                <Icon size={20} className="text-gold-500" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-serif text-lg font-light text-charcoal mb-2">{title}</h3>
                <p className="font-sans text-xs text-green-700 leading-relaxed">
                  <span className="font-medium uppercase tracking-wider text-2xs">Do: </span>{doTip}
                </p>
              </div>
              <div className="md:pt-8">
                <p className="font-sans text-xs text-red-600 leading-relaxed">
                  <span className="font-medium uppercase tracking-wider text-2xs">Don&apos;t: </span>{dont}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </ShopLayout>
  );
}
