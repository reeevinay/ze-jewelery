import ShopLayout from '@/components/layout/ShopLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shipping Policy | Aurelius Jewelry',
};

export default function ShippingPolicyPage() {
  return (
    <ShopLayout>
      <div className="max-w-3xl mx-auto px-4 py-24">
        <h1 className="font-serif text-4xl text-charcoal mb-8 text-center">Shipping Policy</h1>
        <div className="prose prose-sm md:prose-base font-sans text-charcoal-muted mx-auto">
          <p>This is the Shipping Policy page. Content is currently being updated by our team.</p>
        </div>
      </div>
    </ShopLayout>
  );
}
