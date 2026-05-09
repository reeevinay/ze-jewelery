import ShopLayout from '@/components/layout/ShopLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | Aurelius Jewelry',
};

export default function TermsofServicePage() {
  return (
    <ShopLayout>
      <div className="max-w-3xl mx-auto px-4 py-24">
        <h1 className="font-serif text-4xl text-charcoal mb-8 text-center">Terms of Service</h1>
        <div className="prose prose-sm md:prose-base font-sans text-charcoal-muted mx-auto">
          <p>This is the Terms of Service page. Content is currently being updated by our team.</p>
        </div>
      </div>
    </ShopLayout>
  );
}
