import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Jost } from 'next/font/google';
import './globals.css';
import { Toaster } from 'sonner';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
});

const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-jost',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL ?? 'https://aurelius.jewelry'),
  title: {
    default: 'Aurelius Jewelry — Heirloom Fine Jewelry',
    template: '%s | Aurelius Jewelry',
  },
  description:
    'Discover handcrafted heirloom jewelry — rings, necklaces, earrings and more. Made with ethically sourced gold, diamonds and precious stones.',
  keywords: ['jewelry', 'fine jewelry', 'gold', 'rings', 'necklaces', 'handcrafted', 'luxury'],
  authors: [{ name: 'Aurelius Jewelry' }],
  creator: 'Aurelius Jewelry',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: '/',
    siteName: 'Aurelius Jewelry',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630 }],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@aureliusjewelry',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
};

export const viewport: Viewport = {
  themeColor: '#c8881a',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`}>
      <body className="bg-white text-charcoal antialiased">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              fontFamily: 'var(--font-jost)',
              background: '#1a1a1a',
              color: '#fdfcf0',
              border: '1px solid rgba(200,136,26,0.3)',
            },
          }}
        />
      </body>
    </html>
  );
}
