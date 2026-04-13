import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import ShopLayout from '@/components/layout/ShopLayout';
import { getOrderByNumber } from '@/lib/actions/orders';
import { formatPrice, formatDateTime } from '@/lib/utils';
import { CheckCircle, Package, Truck, MapPin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Order Confirmed',
  description: 'Your order has been successfully placed.',
  robots: { index: false },
};

interface Props {
  params: { orderNumber: string };
}

export default async function ConfirmationPage({ params }: Props) {
  const order = await getOrderByNumber(params.orderNumber);
  if (!order) notFound();

  const shippingAddress =
    typeof order.shipping_address === 'string'
      ? JSON.parse(order.shipping_address)
      : order.shipping_address;

  const STEPS = [
    { icon: CheckCircle, label: 'Order Confirmed', done: true },
    { icon: Package, label: 'Processing', done: ['processing', 'shipped', 'delivered'].includes(order.status) },
    { icon: Truck, label: 'Shipped', done: ['shipped', 'delivered'].includes(order.status) },
    { icon: MapPin, label: 'Delivered', done: order.status === 'delivered' },
  ];

  return (
    <ShopLayout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16">
        {/* Success banner */}
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gold-50 border border-gold-200 flex items-center justify-center mx-auto mb-5">
            <CheckCircle size={28} className="text-gold-500" strokeWidth={1.5} />
          </div>
          <h1 className="font-serif text-3xl font-light text-charcoal mb-2">
            Thank You for Your Order
          </h1>
          <p className="font-sans text-sm text-charcoal-muted">
            A confirmation email has been sent to{' '}
            <strong className="text-charcoal">{(order as any).customer_email}</strong>
          </p>
        </div>

        {/* Order reference */}
        <div className="bg-ivory border border-gold-100 p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <p className="font-sans text-2xs tracking-[0.15em] uppercase text-charcoal-muted mb-1">
                Order Number
              </p>
              <p className="font-serif text-xl text-charcoal font-medium">
                {order.order_number}
              </p>
            </div>
            <div className="text-right">
              <p className="font-sans text-2xs tracking-[0.15em] uppercase text-charcoal-muted mb-1">
                Order Date
              </p>
              <p className="font-sans text-sm text-charcoal">
                {formatDateTime(order.created_at)}
              </p>
            </div>
          </div>
        </div>

        {/* Progress tracker */}
        <div className="mb-10">
          <div className="flex items-center justify-between relative">
            <div className="absolute top-4 left-0 right-0 h-px bg-gray-200 -z-0" />
            {STEPS.map(({ icon: Icon, label, done }, i) => (
              <div key={label} className="flex flex-col items-center gap-2 z-10">
                <div
                  className={`w-8 h-8 flex items-center justify-center border-2 transition-colors ${
                    done
                      ? 'border-gold-500 bg-gold-500 text-white'
                      : 'border-gray-200 bg-white text-gray-300'
                  }`}
                >
                  <Icon size={14} strokeWidth={done ? 2 : 1.5} />
                </div>
                <span className={`font-sans text-2xs text-center ${done ? 'text-gold-600 font-medium' : 'text-gray-400'}`}>
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Tracking info */}
        {order.tracking_id && (
          <div className="bg-blue-50 border border-blue-200 p-4 mb-8">
            <p className="font-sans text-xs font-medium text-blue-700 mb-1">Tracking Information</p>
            <p className="font-sans text-xs text-blue-600">
              Tracking ID: <strong>{order.tracking_id}</strong>
            </p>
            {order.tracking_url && (
              <a
                href={order.tracking_url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-sans text-xs text-blue-700 underline mt-1 block"
              >
                Track your shipment →
              </a>
            )}
          </div>
        )}

        {/* Order Items */}
        <div className="mb-8">
          <h2 className="font-sans text-2xs tracking-[0.2em] uppercase text-charcoal-muted mb-4 pb-2 border-b border-gray-100">
            Order Items
          </h2>
          <div className="space-y-4">
            {(order.items ?? []).map((item: any) => (
              <div key={item.id} className="flex gap-4 items-center">
                <div className="relative w-16 h-16 bg-ivory shrink-0">
                  <Image
                    src={item.product_image}
                    alt={item.product_name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-sm text-charcoal">{item.product_name}</p>
                  <p className="font-sans text-xs text-charcoal-muted mt-0.5">
                    Qty: {item.quantity} × {formatPrice(item.price)}
                  </p>
                </div>
                <span className="font-sans text-sm text-charcoal shrink-0">
                  {formatPrice(item.total)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="bg-ivory p-5 mb-8">
          <dl className="space-y-2 font-sans text-sm">
            <div className="flex justify-between">
              <dt className="text-charcoal-muted">Subtotal</dt>
              <dd>{formatPrice(order.subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-charcoal-muted">Shipping</dt>
              <dd>{order.shipping_fee === 0 ? 'FREE' : formatPrice(order.shipping_fee)}</dd>
            </div>
            <div className="h-px bg-gray-200 my-1" />
            <div className="flex justify-between text-base font-medium">
              <dt>Total Paid</dt>
              <dd className="font-serif text-lg">{formatPrice(order.total)}</dd>
            </div>
          </dl>
        </div>

        {/* Shipping address */}
        <div className="mb-10">
          <h2 className="font-sans text-2xs tracking-[0.2em] uppercase text-charcoal-muted mb-3 pb-2 border-b border-gray-100">
            Shipping To
          </h2>
          <address className="not-italic font-sans text-sm text-charcoal-muted leading-relaxed">
            <strong className="text-charcoal">{(order as any).customer_name}</strong><br />
            {shippingAddress.line1}
            {shippingAddress.line2 && <>, {shippingAddress.line2}</>}<br />
            {shippingAddress.city}, {shippingAddress.state} — {shippingAddress.pincode}<br />
            {shippingAddress.country}
          </address>
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/shop" className="btn-gold flex-1 text-center flex items-center justify-center">
            Continue Shopping
          </Link>
          <Link href="/" className="btn-outline-gold flex-1 text-center flex items-center justify-center">
            Back to Home
          </Link>
        </div>
      </div>
    </ShopLayout>
  );
}
