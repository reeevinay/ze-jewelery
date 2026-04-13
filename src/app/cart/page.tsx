'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/lib/utils';
import ShopLayout from '@/components/layout/ShopLayout';

export default function CartPage() {
  const { cart, items, updateQuantity, removeItem, isLoaded, shippingFee, freeShippingRemaining } =
    useCart();

  if (!isLoaded) {
    return (
      <ShopLayout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 skeleton" />
            ))}
          </div>
        </div>
      </ShopLayout>
    );
  }

  return (
    <ShopLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <h1 className="font-serif text-3xl font-light">Shopping Cart</h1>
          <Link
            href="/shop"
            className="flex items-center gap-2 font-sans text-xs tracking-wide uppercase text-charcoal-muted hover:text-gold-500 transition-colors"
          >
            <ArrowLeft size={13} />
            Continue Shopping
          </Link>
        </div>

        {items.length === 0 ? (
          /* Empty state */
          <div className="text-center py-24 border border-dashed border-gray-200">
            <ShoppingBag size={36} className="text-gray-300 mx-auto mb-4" strokeWidth={1} />
            <p className="font-serif text-2xl font-light text-charcoal-muted mb-2">
              Your cart is empty
            </p>
            <p className="font-sans text-sm text-gray-400 mb-8">
              Discover our handcrafted jewelry collection
            </p>
            <Link href="/shop" className="btn-gold inline-flex">
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-10">
            {/* Cart items */}
            <div className="lg:col-span-2 space-y-6">
              {/* Free shipping banner */}
              {freeShippingRemaining > 0 && (
                <div className="bg-gold-50 border border-gold-200 px-4 py-3">
                  <p className="font-sans text-xs text-gold-700">
                    Add{' '}
                    <strong className="font-semibold">{formatPrice(freeShippingRemaining)}</strong>{' '}
                    more for free shipping!
                  </p>
                </div>
              )}
              {freeShippingRemaining === 0 && (
                <div className="bg-green-50 border border-green-200 px-4 py-3">
                  <p className="font-sans text-xs text-green-700 font-medium">
                    🎉 You qualify for free shipping!
                  </p>
                </div>
              )}

              {/* Items */}
              <div className="divide-y divide-gray-100">
                {items.map((item) => (
                  <div key={item.productId} className="flex gap-5 py-6">
                    {/* Image */}
                    <Link href={`/product/${item.slug}`} className="shrink-0">
                      <div className="relative w-24 h-24 sm:w-28 sm:h-28 bg-ivory overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="112px"
                        />
                      </div>
                    </Link>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between gap-2">
                        <Link
                          href={`/product/${item.slug}`}
                          className="font-serif text-base font-light text-charcoal hover:text-gold-600 transition-colors line-clamp-2"
                        >
                          {item.name}
                        </Link>
                        <span className="font-sans text-sm text-charcoal shrink-0 ml-2">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>

                      <p className="font-sans text-xs text-charcoal-muted mt-1">
                        {formatPrice(item.price)} each
                      </p>

                      {/* Quantity + Remove */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center border border-gray-200">
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center text-charcoal-muted hover:text-charcoal hover:bg-gray-50 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-8 text-center font-sans text-sm text-charcoal">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                            disabled={item.quantity >= item.maxQty}
                            className="w-8 h-8 flex items-center justify-center text-charcoal-muted hover:text-charcoal hover:bg-gray-50 transition-colors disabled:opacity-30"
                            aria-label="Increase quantity"
                          >
                            <Plus size={12} />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.productId)}
                          className="flex items-center gap-1.5 font-sans text-xs text-gray-400 hover:text-red-500 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 size={12} />
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-ivory p-6 sticky top-28">
                <h2 className="font-serif text-xl font-light mb-5">Order Summary</h2>

                <dl className="space-y-3 font-sans text-sm">
                  <div className="flex justify-between">
                    <dt className="text-charcoal-muted">Subtotal</dt>
                    <dd className="text-charcoal">{formatPrice(cart.subtotal)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-charcoal-muted">Shipping</dt>
                    <dd className={shippingFee === 0 ? 'text-green-600 font-medium' : 'text-charcoal'}>
                      {shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}
                    </dd>
                  </div>
                  <div className="h-px bg-gray-200 my-1" />
                  <div className="flex justify-between text-base">
                    <dt className="font-medium text-charcoal">Total</dt>
                    <dd className="font-serif text-xl text-charcoal">{formatPrice(cart.total)}</dd>
                  </div>
                </dl>

                <Link
                  href="/checkout"
                  className="btn-gold mt-6 w-full flex items-center justify-center"
                >
                  Proceed to Checkout
                </Link>

                <p className="font-sans text-2xs text-charcoal-muted text-center mt-4">
                  Taxes calculated at checkout. Secure payment by Razorpay.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </ShopLayout>
  );
}
