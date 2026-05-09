import type { Metadata } from 'next';
import ShopLayout from '@/components/layout/ShopLayout';
import { Truck, Clock, MapPin, Package, ShieldCheck } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Shipping Policy',
  description:
    'Learn about Aurelius Jewelry shipping options, delivery timelines, and our free shipping policy for orders above ₹2,500.',
};

const SHIPPING_INFO = [
  {
    icon: Truck,
    title: 'Free Shipping',
    description: 'Complimentary express shipping on all orders above ₹2,500. Standard shipping of ₹99 for orders below ₹2,500.',
  },
  {
    icon: Clock,
    title: 'Delivery Timeline',
    description: 'Orders are processed within 1–2 business days. Standard delivery takes 5–7 business days. Express delivery takes 2–4 business days.',
  },
  {
    icon: MapPin,
    title: 'Pan-India Delivery',
    description: 'We deliver to all serviceable pincodes across India through our trusted courier partners via Shiprocket.',
  },
  {
    icon: Package,
    title: 'Premium Packaging',
    description: 'Every order arrives in our signature Aurelius gift box with a velvet pouch, authenticity card, and care instructions.',
  },
  {
    icon: ShieldCheck,
    title: 'Insured Shipments',
    description: 'All shipments are fully insured against loss or damage during transit at no additional cost to you.',
  },
];

export default function ShippingPage() {
  return (
    <ShopLayout>
      {/* Header */}
      <section className="bg-ivory py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-sans text-2xs tracking-[0.35em] uppercase text-gold-500 mb-4">
            Delivery Information
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-light text-charcoal">
            Shipping Policy
          </h1>
          <div className="gold-divider mt-6" />
        </div>
      </section>

      {/* Shipping highlights */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {SHIPPING_INFO.map(({ icon: Icon, title, description }) => (
            <div key={title} className="border border-gray-100 p-6 hover:border-gold-300 transition-colors duration-300">
              <Icon size={22} className="text-gold-500 mb-4" strokeWidth={1.5} />
              <h3 className="font-serif text-lg font-light text-charcoal mb-2">{title}</h3>
              <p className="font-sans text-xs text-charcoal-muted leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Detailed policy */}
      <section className="bg-ivory">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
          <div>
            <h2 className="font-serif text-2xl font-light text-charcoal mb-4">Order Processing</h2>
            <div className="font-sans text-sm text-charcoal-muted leading-relaxed space-y-3">
              <p>
                All orders are processed within 1–2 business days (Monday to Saturday, excluding public holidays).
                You will receive a confirmation email with your order details immediately after purchase and a
                shipping notification with tracking information once your order is dispatched.
              </p>
              <p>
                During peak seasons (festivals, sales events), processing may take an additional 1–2 business days.
                We appreciate your patience during these times.
              </p>
            </div>
          </div>

          <div>
            <h2 className="font-serif text-2xl font-light text-charcoal mb-4">Shipping Rates</h2>
            <div className="border border-gray-200 overflow-hidden">
              <table className="w-full font-sans text-sm">
                <thead>
                  <tr className="bg-charcoal text-white">
                    <th className="text-left px-5 py-3 text-2xs tracking-[0.15em] uppercase font-medium">Order Value</th>
                    <th className="text-left px-5 py-3 text-2xs tracking-[0.15em] uppercase font-medium">Shipping Cost</th>
                    <th className="text-left px-5 py-3 text-2xs tracking-[0.15em] uppercase font-medium">Estimated Delivery</th>
                  </tr>
                </thead>
                <tbody className="text-charcoal-muted">
                  <tr className="border-b border-gray-100">
                    <td className="px-5 py-3">Below ₹2,500</td>
                    <td className="px-5 py-3">₹99</td>
                    <td className="px-5 py-3">5–7 business days</td>
                  </tr>
                  <tr className="border-b border-gray-100 bg-gold-50/50">
                    <td className="px-5 py-3 font-medium text-charcoal">₹2,500 and above</td>
                    <td className="px-5 py-3 text-green-600 font-medium">FREE</td>
                    <td className="px-5 py-3">5–7 business days</td>
                  </tr>
                  <tr>
                    <td className="px-5 py-3">Express (any order)</td>
                    <td className="px-5 py-3">₹249</td>
                    <td className="px-5 py-3">2–4 business days</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="font-serif text-2xl font-light text-charcoal mb-4">Tracking Your Order</h2>
            <p className="font-sans text-sm text-charcoal-muted leading-relaxed">
              Once your order is shipped, you will receive an email and SMS with a tracking link.
              You can use this link to monitor your shipment in real-time through our courier partner&apos;s website.
              If you have any concerns about your delivery, please contact our support team at{' '}
              <a href="mailto:support@aurelius.jewelry" className="text-gold-500 hover:underline">
                support@aurelius.jewelry
              </a>.
            </p>
          </div>
        </div>
      </section>
    </ShopLayout>
  );
}
