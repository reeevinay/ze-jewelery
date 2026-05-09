import type { Metadata } from 'next';
import ShopLayout from '@/components/layout/ShopLayout';
import { RotateCcw, CheckCircle2, XCircle, Mail } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Return & Exchange Policy',
  description:
    'Aurelius Jewelry offers a hassle-free 15-day return and exchange policy. Learn about eligibility, process, and refund timelines.',
};

const ELIGIBLE = [
  'Unused, unworn jewelry in original condition',
  'Items with all original tags and packaging intact',
  'Items returned within 15 days of delivery',
  'Items with original invoice / proof of purchase',
];

const NOT_ELIGIBLE = [
  'Customized or engraved jewelry',
  'Items showing signs of wear, damage, or alteration',
  'Items without original packaging or tags',
  'Items returned after 15 days of delivery',
  'Earrings (for hygiene reasons, unless defective)',
];

const STEPS = [
  {
    step: '01',
    title: 'Initiate Request',
    description: 'Email us at returns@aurelius.jewelry with your order number and reason for return within 15 days of delivery.',
  },
  {
    step: '02',
    title: 'Receive Approval',
    description: 'Our team will review your request and send you a return shipping label within 24 hours of approval.',
  },
  {
    step: '03',
    title: 'Ship the Item',
    description: 'Pack the item securely in its original packaging and hand it to our courier partner for free pickup.',
  },
  {
    step: '04',
    title: 'Refund or Exchange',
    description: 'Once we receive and inspect the item, your refund will be processed within 5–7 business days to your original payment method.',
  },
];

export default function ReturnsPage() {
  return (
    <ShopLayout>
      {/* Header */}
      <section className="bg-ivory py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-sans text-2xs tracking-[0.35em] uppercase text-gold-500 mb-4">
            Hassle-Free Returns
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl font-light text-charcoal">
            Return & Exchange Policy
          </h1>
          <div className="gold-divider mt-6" />
        </div>
      </section>

      {/* Overview */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <RotateCcw size={28} className="text-gold-500 mx-auto mb-4" strokeWidth={1.5} />
          <p className="font-sans text-sm text-charcoal-muted leading-relaxed max-w-2xl mx-auto">
            At Aurelius, your satisfaction is our priority. If you are not completely happy
            with your purchase, we offer a <strong className="text-charcoal">15-day hassle-free return and exchange</strong> policy
            from the date of delivery. No questions asked.
          </p>
        </div>

        {/* Eligibility grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="border border-green-200 bg-green-50/30 p-6">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle2 size={18} className="text-green-600" />
              <h3 className="font-serif text-lg font-light text-charcoal">Eligible for Returns</h3>
            </div>
            <ul className="space-y-2">
              {ELIGIBLE.map((item) => (
                <li key={item} className="flex items-start gap-2 font-sans text-xs text-charcoal-muted leading-relaxed">
                  <span className="text-green-500 mt-0.5 shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="border border-red-200 bg-red-50/30 p-6">
            <div className="flex items-center gap-2 mb-4">
              <XCircle size={18} className="text-red-500" />
              <h3 className="font-serif text-lg font-light text-charcoal">Not Eligible</h3>
            </div>
            <ul className="space-y-2">
              {NOT_ELIGIBLE.map((item) => (
                <li key={item} className="flex items-start gap-2 font-sans text-xs text-charcoal-muted leading-relaxed">
                  <span className="text-red-400 mt-0.5 shrink-0">✗</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Process steps */}
      <section className="bg-charcoal text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <p className="font-sans text-2xs tracking-[0.25em] uppercase text-gold-400 mb-3">
              How It Works
            </p>
            <h2 className="font-serif text-3xl font-light">Return Process</h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map(({ step, title, description }) => (
              <div key={step} className="text-center">
                <span className="font-serif text-3xl font-light text-gold-400 block mb-2">{step}</span>
                <h3 className="font-sans text-xs tracking-[0.12em] uppercase font-medium mb-2">{title}</h3>
                <p className="font-sans text-xs text-gray-400 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="bg-ivory">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <Mail size={24} className="text-gold-500 mx-auto mb-4" strokeWidth={1.5} />
          <h2 className="font-serif text-2xl font-light text-charcoal mb-3">Need Help?</h2>
          <p className="font-sans text-sm text-charcoal-muted leading-relaxed mb-6">
            If you have any questions about returns or exchanges, our team is here to help.
          </p>
          <a
            href="mailto:returns@aurelius.jewelry"
            className="btn-outline-gold inline-flex items-center gap-2"
          >
            <Mail size={14} />
            Contact Returns Team
          </a>
        </div>
      </section>
    </ShopLayout>
  );
}
