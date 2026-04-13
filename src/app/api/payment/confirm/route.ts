import { NextRequest, NextResponse } from 'next/server';
import { confirmPayment } from '@/lib/actions/orders';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature } = body;

    if (!orderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return NextResponse.json(
        { success: false, error: 'Missing payment parameters' },
        { status: 400 }
      );
    }

    const result = await confirmPayment({
      orderId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    });

    return NextResponse.json({ success: true, ...result });
  } catch (err: any) {
    console.error('Payment confirmation error:', err);
    return NextResponse.json(
      { success: false, error: err.message ?? 'Payment confirmation failed' },
      { status: 500 }
    );
  }
}
