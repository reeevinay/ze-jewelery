import type { Metadata } from 'next';
import ShopLayout from '@/components/layout/ShopLayout';

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Read the Aurelius Jewelry terms and conditions governing your use of our website and purchases.',
};

const SECTIONS = [
  {
    title: 'Acceptance of Terms',
    items: [
      'By accessing or using the Aurelius Jewelry website, you agree to be bound by these Terms of Service.',
      'If you do not agree with any part of these terms, please do not use our website.',
    ],
  },
  {
    title: 'Products & Pricing',
    items: [
      'All product images are representative. Slight variations in color and texture may occur due to the handcrafted nature of our jewelry.',
      'Prices are listed in Indian Rupees (INR) and include applicable GST unless stated otherwise.',
      'We reserve the right to modify prices without prior notice. The price at the time of order placement will be honored.',
    ],
  },
  {
    title: 'Orders & Payment',
    items: [
      'An order is confirmed only upon successful payment via Razorpay.',
      'We reserve the right to cancel any order if the product is out of stock, pricing errors exist, or fraud is suspected.',
      'In case of order cancellation by us, a full refund will be issued within 5–7 business days.',
    ],
  },
  {
    title: 'Shipping & Delivery',
    items: [
      'Delivery timelines are estimates and may vary based on location and courier availability.',
      'Risk of loss passes to the buyer upon delivery by the courier to the shipping address provided.',
      'Please review our Shipping Policy page for detailed information.',
    ],
  },
  {
    title: 'Returns & Refunds',
    items: [
      'Returns are accepted within 15 days of delivery as per our Return Policy.',
      'Refunds are processed to the original payment method within 5–7 business days after inspection.',
      'Customized or engraved items are not eligible for returns.',
    ],
  },
  {
    title: 'Intellectual Property',
    items: [
      'All content on this website — including designs, images, logos, and text — is the property of Aurelius Jewelry.',
      'Unauthorized use, reproduction, or distribution of our content is strictly prohibited.',
    ],
  },
  {
    title: 'Limitation of Liability',
    items: [
      'Aurelius Jewelry shall not be liable for any indirect, incidental, or consequential damages arising from your use of our website or products.',
      'Our maximum liability shall not exceed the purchase price of the product in question.',
    ],
  },
  {
    title: 'Governing Law',
    items: [
      'These terms are governed by the laws of India.',
      'Any disputes shall be subject to the exclusive jurisdiction of the courts in the registered business location.',
    ],
  },
  {
    title: 'Contact',
    items: [
      'For questions about these terms, email us at legal@aurelius.jewelry.',
    ],
  },
];

export default function TermsPage() {
  return (
    <ShopLayout>
      <section className="bg-ivory py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-sans text-2xs tracking-[0.35em] uppercase text-gold-500 mb-4">Legal</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-light text-charcoal">Terms of Service</h1>
          <div className="gold-divider mt-6" />
          <p className="font-sans text-xs text-charcoal-muted mt-6">Last updated: May 2026</p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-10">
          {SECTIONS.map(({ title, items }, i) => (
            <div key={title}>
              <h2 className="font-serif text-xl font-light text-charcoal mb-4 flex items-baseline gap-3">
                <span className="font-sans text-2xs tracking-[0.1em] text-gold-500 font-medium">
                  {String(i + 1).padStart(2, '0')}
                </span>
                {title}
              </h2>
              <ul className="space-y-2">
                {items.map((item, j) => (
                  <li key={j} className="font-sans text-sm text-charcoal-muted leading-relaxed pl-4 border-l-2 border-gray-100">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </ShopLayout>
  );
}
