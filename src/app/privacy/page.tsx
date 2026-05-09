import type { Metadata } from 'next';
import ShopLayout from '@/components/layout/ShopLayout';

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Read the Aurelius Jewelry privacy policy — how we collect, use, and protect your personal information.',
};

const SECTIONS = [
  {
    title: 'Information We Collect',
    items: [
      'Name, email, phone, and shipping address when you place an order.',
      'Technical data (IP address, browser type) via cookies.',
      'Support correspondence for quality improvement.',
    ],
  },
  {
    title: 'How We Use Your Information',
    items: [
      'Process and fulfill orders via Razorpay and Shiprocket.',
      'Send order confirmations, shipping updates, and delivery notifications.',
      'Improve our website and services based on analytics.',
      'Send promotions only with your consent (opt-out anytime).',
    ],
  },
  {
    title: 'Information Sharing',
    items: [
      'We never sell or rent your personal data.',
      'We share data only with Razorpay (payments), Shiprocket (shipping), Cloudinary (images), and Neon (database).',
      'We may disclose info if required by law.',
    ],
  },
  {
    title: 'Payment Security',
    items: [
      'Payments are processed by Razorpay (PCI-DSS Level 1 compliant).',
      'We never store your card or UPI details.',
      'Our site uses 256-bit SSL encryption.',
    ],
  },
  {
    title: 'Cookies',
    items: [
      'Essential cookies for cart and session management.',
      'Analytics cookies to improve site experience (can be disabled).',
      'No third-party advertising cookies.',
    ],
  },
  {
    title: 'Your Rights',
    items: [
      'Access, correct, or delete your personal data.',
      'Opt out of marketing communications anytime.',
      'Request a copy of your data by emailing privacy@aurelius.jewelry.',
    ],
  },
  {
    title: 'Changes to This Policy',
    items: [
      'Updates will be posted on this page with a revised date.',
      'Continued use constitutes acceptance of changes.',
    ],
  },
];

export default function PrivacyPage() {
  return (
    <ShopLayout>
      <section className="bg-ivory py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-sans text-2xs tracking-[0.35em] uppercase text-gold-500 mb-4">Your Data, Protected</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-light text-charcoal">Privacy Policy</h1>
          <div className="gold-divider mt-6" />
          <p className="font-sans text-xs text-charcoal-muted mt-6">Last updated: May 2026</p>
        </div>
      </section>

      <section className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className="font-sans text-sm text-charcoal-muted leading-relaxed mb-12">
          At Aurelius Jewelry, we are committed to protecting your privacy. This policy explains how we collect,
          use, and safeguard your data when you visit our website or make a purchase.
        </p>

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

        <div className="mt-16 border border-gold-200 bg-gold-50/30 p-6 text-center">
          <h3 className="font-serif text-lg font-light text-charcoal mb-2">Questions About Your Privacy?</h3>
          <p className="font-sans text-xs text-charcoal-muted">
            Contact us at{' '}
            <a href="mailto:privacy@aurelius.jewelry" className="text-gold-500 hover:underline">privacy@aurelius.jewelry</a>
          </p>
        </div>
      </section>
    </ShopLayout>
  );
}
