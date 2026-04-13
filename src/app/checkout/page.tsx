'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Lock } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { formatPrice, isValidEmail, isValidPhone, isValidPincode } from '@/lib/utils';
import ShopLayout from '@/components/layout/ShopLayout';
import { toast } from 'sonner';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
  notes: string;
}

type FieldProps = {
  id: string;
  label: string;
  error?: string;
  children: React.ReactNode;
};

function Field({ id, label, error, children }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block font-sans text-2xs tracking-[0.12em] uppercase text-charcoal-muted mb-1.5">
        {label}
      </label>
      {children}
      {error && <p className="mt-1 font-sans text-xs text-red-500">{error}</p>}
    </div>
  );
}

const INITIAL_FORM: FormData = {
  name: '', email: '', phone: '',
  line1: '', line2: '', city: '', state: '', pincode: '',
  notes: '',
};

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh',
];

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, items, shippingFee, clearCart, isLoaded } = useCart();
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [loading, setLoading] = useState(false);

  const setField = (key: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: '' }));
  };

  function validate(): boolean {
    const newErrors: Partial<FormData> = {};
    if (!form.name.trim() || form.name.length < 2) newErrors.name = 'Full name required';
    if (!isValidEmail(form.email)) newErrors.email = 'Valid email required';
    if (!isValidPhone(form.phone.replace(/\D/g, ''))) newErrors.phone = 'Valid 10-digit mobile number required';
    if (!form.line1.trim() || form.line1.trim().length < 5) newErrors.line1 = 'Address must be at least 5 characters';
    if (!form.city.trim()) newErrors.city = 'City required';
    if (!form.state) newErrors.state = 'State required';
    if (!isValidPincode(form.pincode)) newErrors.pincode = 'Valid 6-digit pincode required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleCheckout() {
    if (!validate()) {
      toast.error('Please fix the errors before proceeding');
      return;
    }
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    setLoading(true);

    try {
      // Create order via server action / API
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: {
            name: form.name,
            email: form.email,
            phone: form.phone.replace(/\D/g, ''),
            address: {
              line1: form.line1,
              line2: form.line2,
              city: form.city,
              state: form.state,
              pincode: form.pincode,
              country: 'India',
            },
            notes: form.notes,
          },
          items,
          subtotal: cart.subtotal,
          shippingFee,
          total: cart.total,
        }),
      });

      const data = await res.json().catch(() => null);
      if (!res.ok || !data?.success) {
        const msg =
          data?.error ||
          (Array.isArray(data?.issues) && data.issues[0]?.message) ||
          'Failed to create order';
        throw new Error(msg);
      }
      const { orderId, orderNumber, razorpayOrderId, amount } = data;

      // Load Razorpay script
      await loadRazorpayScript();

      const rzpOptions = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID ?? 'rzp_test_placeholder',
        amount,
        currency: 'INR',
        name: 'Aurelius Jewelry',
        description: `Order #${orderNumber}`,
        order_id: razorpayOrderId,
        image: '/logo.png',
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        theme: { color: '#c8881a' },
        handler: async (response: any) => {
          try {
            // Confirm payment
            const confirmRes = await fetch('/api/payment/confirm', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId,
                razorpayOrderId: response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            });

            if (!confirmRes.ok) throw new Error('Payment confirmation failed');

            clearCart();
            router.push(`/confirmation/${orderNumber}`);
          } catch {
            toast.error('Payment confirmation failed. Contact support.');
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            toast.error('Payment cancelled');
          },
        },
      };

      const rzp = new window.Razorpay(rzpOptions);
      rzp.open();
      setLoading(false);
    } catch (err) {
      console.error(err);
      toast.error(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  if (!isLoaded) {
    return (
      <ShopLayout>
        <div className="max-w-4xl mx-auto px-4 py-20 animate-pulse space-y-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-12 skeleton" />)}
        </div>
      </ShopLayout>
    );
  }

  if (items.length === 0) {
    return (
      <ShopLayout>
        <div className="max-w-xl mx-auto px-4 py-24 text-center">
          <p className="font-serif text-2xl font-light mb-4">Your cart is empty</p>
          <Link href="/shop" className="btn-gold inline-flex">Shop Now</Link>
        </div>
      </ShopLayout>
    );
  }

  return (
    <>
      {/* Razorpay script */}
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />

      <ShopLayout>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center justify-between mb-10">
            <h1 className="font-serif text-3xl font-light">Checkout</h1>
            <Link
              href="/cart"
              className="flex items-center gap-2 font-sans text-xs tracking-wide uppercase text-charcoal-muted hover:text-gold-500 transition-colors"
            >
              <ArrowLeft size={13} />
              Back to Cart
            </Link>
          </div>

          <div className="grid lg:grid-cols-3 gap-10">
            {/* Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Contact */}
              <section>
                <h2 className="font-sans text-2xs tracking-[0.2em] uppercase text-gold-500 mb-5 pb-2 border-b border-gray-100">
                  Contact Information
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Field id="name" label="Full Name *" error={errors.name}>
                    <input id="name" className="input-luxury" value={form.name}
                      onChange={(e) => setField('name', e.target.value)} />
                  </Field>
                  <Field id="email" label="Email *" error={errors.email}>
                    <input id="email" type="email" className="input-luxury" value={form.email}
                      onChange={(e) => setField('email', e.target.value)} />
                  </Field>
                  <Field id="phone" label="Mobile Number *" error={errors.phone}>
                    <input id="phone" type="tel" className="input-luxury" value={form.phone}
                      placeholder="10-digit number"
                      onChange={(e) => setField('phone', e.target.value)} />
                  </Field>
                </div>
              </section>

              {/* Shipping Address */}
              <section>
                <h2 className="font-sans text-2xs tracking-[0.2em] uppercase text-gold-500 mb-5 pb-2 border-b border-gray-100">
                  Shipping Address
                </h2>
                <div className="space-y-4">
                  <Field id="line1" label="Address Line 1 *" error={errors.line1}>
                    <input id="line1" className="input-luxury" value={form.line1}
                      placeholder="House no., Street, Area"
                      onChange={(e) => setField('line1', e.target.value)} />
                  </Field>
                  <Field id="line2" label="Address Line 2" error={errors.line2}>
                    <input id="line2" className="input-luxury" value={form.line2}
                      placeholder="Landmark (optional)"
                      onChange={(e) => setField('line2', e.target.value)} />
                  </Field>
                  <div className="grid sm:grid-cols-3 gap-4">
                    <Field id="city" label="City *" error={errors.city}>
                      <input id="city" className="input-luxury" value={form.city}
                        onChange={(e) => setField('city', e.target.value)} />
                    </Field>
                    <Field id="state" label="State *" error={errors.state}>
                      <select id="state" className="input-luxury" value={form.state}
                        onChange={(e) => setField('state', e.target.value)}>
                        <option value="">Select state</option>
                        {INDIAN_STATES.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                    </Field>
                    <Field id="pincode" label="Pincode *" error={errors.pincode}>
                      <input id="pincode" className="input-luxury" value={form.pincode}
                        maxLength={6} placeholder="6-digit code"
                        onChange={(e) => setField('pincode', e.target.value.replace(/\D/g, ''))} />
                    </Field>
                  </div>
                </div>
              </section>

              {/* Notes */}
              <section>
                <h2 className="font-sans text-2xs tracking-[0.2em] uppercase text-gold-500 mb-5 pb-2 border-b border-gray-100">
                  Order Notes (Optional)
                </h2>
                <textarea
                  className="input-luxury resize-none h-24"
                  value={form.notes}
                  placeholder="Gift message, special instructions..."
                  onChange={(e) => setField('notes', e.target.value)}
                />
              </section>
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="bg-ivory p-6 sticky top-28">
                <h2 className="font-serif text-xl font-light mb-5">Order Summary</h2>

                {/* Items */}
                <div className="space-y-3 mb-5">
                  {items.map((item) => (
                    <div key={item.productId} className="flex gap-3 items-center">
                      <div className="relative w-12 h-12 bg-white border border-gray-100 shrink-0">
                        <Image src={item.image} alt={item.name} fill className="object-cover" sizes="48px" />
                        <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-charcoal text-white text-2xs flex items-center justify-center rounded-full">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-sans text-xs text-charcoal line-clamp-2">{item.name}</p>
                      </div>
                      <span className="font-sans text-xs text-charcoal shrink-0">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="h-px bg-gray-200 mb-4" />

                <dl className="space-y-2 font-sans text-sm">
                  <div className="flex justify-between">
                    <dt className="text-charcoal-muted">Subtotal</dt>
                    <dd>{formatPrice(cart.subtotal)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-charcoal-muted">Shipping</dt>
                    <dd className={shippingFee === 0 ? 'text-green-600 font-medium' : ''}>
                      {shippingFee === 0 ? 'FREE' : formatPrice(shippingFee)}
                    </dd>
                  </div>
                  <div className="h-px bg-gray-200 my-1" />
                  <div className="flex justify-between text-base">
                    <dt className="font-medium">Total</dt>
                    <dd className="font-serif text-xl">{formatPrice(cart.total)}</dd>
                  </div>
                </dl>

                <button
                  onClick={handleCheckout}
                  disabled={loading}
                  className="btn-gold mt-6 w-full flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  ) : (
                    <Lock size={13} />
                  )}
                  {loading ? 'Processing…' : 'Pay Securely'}
                </button>

                <div className="flex items-center justify-center gap-2 mt-4">
                  <Lock size={10} className="text-gray-400" />
                  <p className="font-sans text-2xs text-gray-400">
                    Secured by Razorpay · 256-bit SSL
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ShopLayout>
    </>
  );
}

function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) { resolve(); return; }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Razorpay SDK failed to load'));
    document.body.appendChild(script);
  });
}
