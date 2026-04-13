'use server';

import sql from '@/lib/db';
import { generateOrderNumber } from '@/lib/utils';
import { createRazorpayOrder, verifyPaymentSignature } from '@/lib/razorpay';
import { createShipment } from '@/lib/shiprocket';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import type { Order, CartItem, CheckoutFormData, OrderStatus } from '@/types';

// ─── Validation ────────────────────────────────────────────────────────────

const CheckoutSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().regex(/^[6-9]\d{9}$/),
  address: z.object({
    line1: z.string().min(5),
    line2: z.string().optional(),
    city: z.string().min(2),
    state: z.string().min(2),
    pincode: z.string().regex(/^[1-9][0-9]{5}$/),
    country: z.string().default('India'),
  }),
  notes: z.string().optional(),
});

// ─── Create Order ──────────────────────────────────────────────────────────

export async function createOrder(params: {
  customer: CheckoutFormData;
  items: CartItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
}) {
  // Validate inputs
  const validatedCustomer = CheckoutSchema.parse(params.customer);

  // Upsert customer
  const [customer] = await sql`
    INSERT INTO customers (email, name, phone, address)
    VALUES (
      ${validatedCustomer.email},
      ${validatedCustomer.name},
      ${validatedCustomer.phone},
      ${JSON.stringify(validatedCustomer.address)}
    )
    ON CONFLICT (email) DO UPDATE SET
      name = EXCLUDED.name,
      phone = EXCLUDED.phone,
      address = EXCLUDED.address,
      updated_at = NOW()
    RETURNING *
  `;

  const orderNumber = generateOrderNumber();

  // Create order
  const [order] = await sql`
    INSERT INTO orders (
      order_number, customer_id, subtotal, discount, shipping_fee,
      total, status, payment_status, shipping_address, notes
    ) VALUES (
      ${orderNumber},
      ${customer.id},
      ${params.subtotal},
      0,
      ${params.shippingFee},
      ${params.total},
      'pending',
      'pending',
      ${JSON.stringify(validatedCustomer.address)},
      ${validatedCustomer.notes ?? null}
    ) RETURNING *
  `;

  // Insert order items
  await Promise.all(
    params.items.map((item) =>
      sql`
        INSERT INTO order_items (
          order_id, product_id, product_name, product_image,
          quantity, price, total
        ) VALUES (
          ${order.id},
          ${item.productId},
          ${item.name},
          ${item.image},
          ${item.quantity},
          ${item.price},
          ${item.price * item.quantity}
        )
      `
    )
  );

  // Decrement stock
  await Promise.all(
    params.items.map((item) =>
      sql`
        UPDATE products
        SET stock_qty = stock_qty - ${item.quantity}
        WHERE id = ${item.productId} AND stock_qty >= ${item.quantity}
      `
    )
  );

  // Create Razorpay order
  const razorpayOrder = await createRazorpayOrder({
    amount: params.total,
    receipt: orderNumber,
    notes: {
      orderId: String(order.id),
      customerEmail: validatedCustomer.email,
    },
  });

  // Update order with Razorpay order ID
  await sql`
    UPDATE orders SET
      payment_id = ${razorpayOrder.id},
      status = 'payment_pending'
    WHERE id = ${order.id}
  `;

  revalidatePath('/admin/orders');

  return {
    orderId: order.id,
    orderNumber,
    razorpayOrderId: razorpayOrder.id,
    amount: params.total,
  };
}

// ─── Confirm Payment & Trigger Shipping ───────────────────────────────────

export async function confirmPayment(params: {
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}) {
  // Verify signature
  const isValid = verifyPaymentSignature({
    orderId: params.razorpayOrderId,
    paymentId: params.razorpayPaymentId,
    signature: params.razorpaySignature,
  });

  if (!isValid) {
    throw new Error('Payment signature verification failed');
  }

  // Get order with items & customer
  const [order] = await sql`
    SELECT o.*, c.name as customer_name, c.email as customer_email, c.phone as customer_phone
    FROM orders o
    JOIN customers c ON o.customer_id = c.id
    WHERE o.id = ${params.orderId}
    LIMIT 1
  `;

  const orderItems = await sql`
    SELECT oi.*, p.slug as product_slug
    FROM order_items oi
    LEFT JOIN products p ON oi.product_id = p.id
    WHERE oi.order_id = ${params.orderId}
  `;

  if (!order) throw new Error('Order not found');

  // Update payment status
  await sql`
    UPDATE orders SET
      payment_status = 'paid',
      payment_method = 'razorpay',
      status = 'confirmed',
      payment_id = ${params.razorpayPaymentId},
      updated_at = NOW()
    WHERE id = ${params.orderId}
  `;

  // Trigger Shiprocket shipment
  try {
    const shippingAddress = typeof order.shipping_address === 'string'
      ? JSON.parse(order.shipping_address)
      : order.shipping_address;

    const shipment = await createShipment({
      orderId: params.orderId,
      orderNumber: order.order_number,
      customerName: order.customer_name,
      customerEmail: order.customer_email,
      customerPhone: order.customer_phone ?? '',
      shippingAddress,
      items: orderItems.map((item: Record<string, unknown>) => ({
        name: String(item.product_name),
        sku: String(item.product_id),
        units: Number(item.quantity),
        sellingPrice: Number(item.price),
      })),
      paymentMethod: 'prepaid',
      subTotal: Number(order.subtotal),
      weight: 0.3, // default 300g per jewelry item
    });

    // Update tracking info
    await sql`
      UPDATE orders SET
        tracking_id = ${shipment.trackingId},
        tracking_url = ${shipment.trackingUrl},
        status = 'processing',
        updated_at = NOW()
      WHERE id = ${params.orderId}
    `;

    return {
      success: true,
      orderNumber: order.order_number,
      trackingId: shipment.trackingId,
      trackingUrl: shipment.trackingUrl,
    };
  } catch (err) {
    console.error('Shiprocket error (non-fatal):', err);
    return {
      success: true,
      orderNumber: order.order_number,
      trackingId: null,
      trackingUrl: null,
    };
  }
}

// ─── Get Orders ────────────────────────────────────────────────────────────

export async function getOrders(params?: {
  status?: OrderStatus;
  page?: number;
  limit?: number;
}): Promise<{ orders: Order[]; total: number }> {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 20;
  const offset = (page - 1) * limit;

  const statusFilter = params?.status ? sql`AND o.status = ${params.status}` : sql``;

  const orders = await sql`
    SELECT o.*, c.name as customer_name, c.email as customer_email
    FROM orders o
    JOIN customers c ON o.customer_id = c.id
    WHERE 1=1 ${statusFilter}
    ORDER BY o.created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `;

  const [{ count }] = await sql`
    SELECT COUNT(*) as count FROM orders o
    WHERE 1=1 ${statusFilter}
  `;

  return {
    orders: orders as Order[],
    total: parseInt(String(count)),
  };
}

// ─── Get Order by Number ───────────────────────────────────────────────────

export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  const [order] = await sql`
    SELECT o.*, c.name as customer_name, c.email as customer_email
    FROM orders o
    JOIN customers c ON o.customer_id = c.id
    WHERE o.order_number = ${orderNumber}
    LIMIT 1
  `;

  if (!order) return null;

  const items = await sql`
    SELECT * FROM order_items WHERE order_id = ${order.id}
  `;

  return { ...order, items } as Order;
}

// ─── Update Order Status ───────────────────────────────────────────────────

export async function updateOrderStatus(id: string, status: OrderStatus) {
  const [order] = await sql`
    UPDATE orders SET status = ${status}, updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;

  revalidatePath('/admin/orders');
  return order as Order;
}

// ─── Admin Stats ───────────────────────────────────────────────────────────

export async function getAdminStats() {
  const [
    orderStats,
    recentOrders,
  ] = await Promise.all([
    sql`
      SELECT
        COUNT(*) as total_orders,
        COALESCE(SUM(total), 0) as total_revenue,
        COUNT(DISTINCT customer_id) as total_customers
      FROM orders
      WHERE payment_status = 'paid'
    `,
    sql`
      SELECT o.*, c.name as customer_name
      FROM orders o
      JOIN customers c ON o.customer_id = c.id
      ORDER BY o.created_at DESC
      LIMIT 5
    `,
  ]);

  return {
    totalOrders: parseInt(String(orderStats[0]?.total_orders ?? 0)),
    totalRevenue: parseInt(String(orderStats[0]?.total_revenue ?? 0)),
    totalCustomers: parseInt(String(orderStats[0]?.total_customers ?? 0)),
    recentOrders,
  };
}
