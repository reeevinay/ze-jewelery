import Razorpay from 'razorpay';
import crypto from 'crypto';

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  console.warn('⚠️  Razorpay keys not configured — payment will run in placeholder mode');
}

const razorpay = process.env.RAZORPAY_KEY_ID
  ? new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID!,
      key_secret: process.env.RAZORPAY_KEY_SECRET!,
    })
  : null;

// ─── Create Razorpay Order ─────────────────────────────────────────────────

export async function createRazorpayOrder(params: {
  amount: number;      // in paise
  currency?: string;
  receipt: string;
  notes?: Record<string, string>;
}) {
  // PLACEHOLDER: In production, remove this block and use live Razorpay
  if (!razorpay) {
    console.log('🏦 [PLACEHOLDER] Creating Razorpay order:', params);
    return {
      id: `order_placeholder_${Date.now()}`,
      entity: 'order',
      amount: params.amount,
      currency: params.currency ?? 'INR',
      receipt: params.receipt,
      status: 'created',
    };
  }

  const order = await razorpay.orders.create({
    amount: params.amount,
    currency: params.currency ?? 'INR',
    receipt: params.receipt,
    notes: params.notes,
  });

  return order;
}

// ─── Verify Payment Signature ──────────────────────────────────────────────

export function verifyPaymentSignature(params: {
  orderId: string;
  paymentId: string;
  signature: string;
}): boolean {
  // PLACEHOLDER: always verify in dev mode
  if (!process.env.RAZORPAY_KEY_SECRET) {
    console.log('🏦 [PLACEHOLDER] Verifying payment signature — auto-passing');
    return true;
  }

  const body = params.orderId + '|' + params.paymentId;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest('hex');

  return expectedSignature === params.signature;
}

// ─── Razorpay Checkout Options ─────────────────────────────────────────────

export function getRazorpayOptions(params: {
  orderId: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  description?: string;
}) {
  return {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    amount: params.amount,
    currency: 'INR',
    name: 'Aurelius Jewelry',
    description: params.description ?? 'Order Payment',
    image: '/logo.png',
    order_id: params.orderId,
    prefill: {
      name: params.customerName,
      email: params.customerEmail,
      contact: params.customerPhone,
    },
    theme: {
      color: '#c8881a',
    },
  };
}
