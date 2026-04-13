import { NextRequest, NextResponse } from 'next/server';
import { createOrder } from '@/lib/actions/orders';
import { z } from 'zod';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { customer, items, subtotal, shippingFee, total } = body;

    if (!customer || !items || items.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid order data' },
        { status: 400 }
      );
    }

    const result = await createOrder({ customer, items, subtotal, shippingFee, total });

    return NextResponse.json({ success: true, ...result });
  } catch (err: any) {
    console.error('Order creation error:', err);
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          issues: err.issues,
        },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: err.message ?? 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Admin only — check admin token
  const adminToken = request.headers.get('x-admin-token');
  if (adminToken !== process.env.ADMIN_SECRET_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { getOrders } = await import('@/lib/actions/orders');
  const { orders, total } = await getOrders();
  return NextResponse.json({ success: true, data: orders, total });
}
