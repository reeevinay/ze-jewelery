import type { Metadata } from 'next';
import ShopLayout from '@/components/layout/ShopLayout';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Aurelius Jewelry — reach our support team for orders, returns, or general inquiries.',
};

const CHANNELS = [
  { icon: Mail, label: 'Email', value: 'support@aurelius.jewelry', href: 'mailto:support@aurelius.jewelry' },
  { icon: Phone, label: 'Phone', value: '+91 98XX XXX XXX', href: 'tel:+919800000000' },
  { icon: MapPin, label: 'Studio', value: 'Mumbai, Maharashtra, India', href: '#' },
  { icon: Clock, label: 'Hours', value: 'Mon – Sat, 10 AM – 7 PM IST', href: '#' },
];

export default function ContactPage() {
  return (
    <ShopLayout>
      <section className="bg-ivory py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-sans text-2xs tracking-[0.35em] uppercase text-gold-500 mb-4">Get In Touch</p>
          <h1 className="font-serif text-4xl sm:text-5xl font-light text-charcoal">Contact Us</h1>
          <div className="gold-divider mt-6" />
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-12">
          {/* Info */}
          <div>
            <h2 className="font-serif text-2xl font-light text-charcoal mb-6">We&apos;d Love to Hear From You</h2>
            <p className="font-sans text-sm text-charcoal-muted leading-relaxed mb-8">
              Whether you have a question about an order, need help choosing the perfect piece, or want to discuss
              a custom design — our team is here to help.
            </p>
            <div className="space-y-5">
              {CHANNELS.map(({ icon: Icon, label, value, href }) => (
                <a key={label} href={href} className="flex items-start gap-4 group">
                  <div className="w-10 h-10 border border-gray-200 flex items-center justify-center shrink-0 group-hover:border-gold-400 transition-colors">
                    <Icon size={16} className="text-gold-500" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="font-sans text-2xs tracking-[0.12em] uppercase text-charcoal-muted mb-0.5">{label}</p>
                    <p className="font-sans text-sm text-charcoal group-hover:text-gold-500 transition-colors">{value}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Form */}
          <div className="bg-white border border-gray-100 p-8">
            <h3 className="font-serif text-xl font-light text-charcoal mb-6">Send a Message</h3>
            <form className="space-y-4">
              <div>
                <label className="block font-sans text-2xs tracking-[0.12em] uppercase text-charcoal-muted mb-1.5">Name</label>
                <input className="input-luxury" placeholder="Your full name" />
              </div>
              <div>
                <label className="block font-sans text-2xs tracking-[0.12em] uppercase text-charcoal-muted mb-1.5">Email</label>
                <input type="email" className="input-luxury" placeholder="you@example.com" />
              </div>
              <div>
                <label className="block font-sans text-2xs tracking-[0.12em] uppercase text-charcoal-muted mb-1.5">Subject</label>
                <select className="input-luxury">
                  <option value="">Select a topic</option>
                  <option>Order Inquiry</option>
                  <option>Returns & Exchanges</option>
                  <option>Custom Design</option>
                  <option>General Question</option>
                </select>
              </div>
              <div>
                <label className="block font-sans text-2xs tracking-[0.12em] uppercase text-charcoal-muted mb-1.5">Message</label>
                <textarea className="input-luxury resize-none h-28" placeholder="How can we help?" />
              </div>
              <button type="submit" className="btn-gold w-full">Send Message</button>
            </form>
          </div>
        </div>
      </section>
    </ShopLayout>
  );
}
