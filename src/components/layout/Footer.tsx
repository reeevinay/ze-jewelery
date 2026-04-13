import Link from 'next/link';
import { Instagram, Twitter, Facebook } from 'lucide-react';

const SHOP_LINKS = [
  { label: 'All Jewelry', href: '/shop' },
  { label: 'Rings', href: '/category/rings' },
  { label: 'Necklaces', href: '/category/necklaces' },
  { label: 'Earrings', href: '/category/earrings' },
  { label: 'Bracelets', href: '/category/bracelets' },
  { label: 'Sets', href: '/category/sets' },
];

const INFO_LINKS = [
  { label: 'About Us', href: '/about' },
  { label: 'Sustainability', href: '/sustainability' },
  { label: 'Care Guide', href: '/care-guide' },
  { label: 'Size Guide', href: '/size-guide' },
  { label: 'Blog', href: '/blog' },
];

const SUPPORT_LINKS = [
  { label: 'Contact Us', href: '/contact' },
  { label: 'Shipping Policy', href: '/shipping' },
  { label: 'Return Policy', href: '/returns' },
  { label: 'Privacy Policy', href: '/privacy' },
  { label: 'Terms of Service', href: '/terms' },
];

export default function Footer() {
  return (
    <footer className="bg-charcoal text-white">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Brand column */}
          <div className="lg:col-span-1">
            <Link href="/">
              <span className="font-serif text-2xl font-light tracking-[0.2em] uppercase text-white">
                Aurelius
              </span>
            </Link>
            <p className="mt-4 text-sm text-gray-400 font-sans leading-relaxed">
              Heirloom jewelry crafted with ethically sourced
              materials and old-world techniques. Worn for generations.
            </p>
            {/* Social */}
            <div className="flex gap-4 mt-6">
              {[
                { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
                { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
                { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-8 h-8 border border-white/20 flex items-center justify-center text-gray-400 hover:text-gold-400 hover:border-gold-500 transition-colors duration-200"
                >
                  <Icon size={14} />
                </a>
              ))}
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3 className="font-sans text-2xs tracking-[0.2em] uppercase text-gold-400 mb-5">
              Shop
            </h3>
            <ul className="space-y-3">
              {SHOP_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-sans text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Information */}
          <div>
            <h3 className="font-sans text-2xs tracking-[0.2em] uppercase text-gold-400 mb-5">
              Information
            </h3>
            <ul className="space-y-3">
              {INFO_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-sans text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-sans text-2xs tracking-[0.2em] uppercase text-gold-400 mb-5">
              Support
            </h3>
            <ul className="space-y-3">
              {SUPPORT_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-sans text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* Newsletter */}
            <div className="mt-8">
              <p className="text-2xs tracking-[0.15em] uppercase text-gold-400 mb-3 font-sans">
                Join the circle
              </p>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 bg-white/10 border border-white/20 px-3 py-2 text-sm text-white placeholder-gray-500 font-sans focus:outline-none focus:border-gold-500 transition-colors"
                />
                <button
                  type="submit"
                  className="bg-gold-500 px-4 text-white text-xs font-sans tracking-wider hover:bg-gold-600 transition-colors"
                >
                  →
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-500 font-sans">
            © {new Date().getFullYear()} Aurelius Jewelry. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            {['Visa', 'Mastercard', 'UPI', 'Razorpay'].map((method) => (
              <span
                key={method}
                className="text-2xs text-gray-600 border border-white/10 px-2 py-1 font-sans"
              >
                {method}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
