// ─── Shiprocket API Integration ───────────────────────────────────────────
// PLACEHOLDER: Replace with live Shiprocket credentials & production API calls

const SHIPROCKET_BASE_URL = 'https://apiv2.shiprocket.in/v1/external';

interface ShiprocketToken {
  token: string;
  expiresAt: number;
}

let tokenCache: ShiprocketToken | null = null;

// ─── Authenticate ──────────────────────────────────────────────────────────

async function getAuthToken(): Promise<string> {
  // PLACEHOLDER: auto-return dummy token
  if (!process.env.SHIPROCKET_EMAIL || !process.env.SHIPROCKET_PASSWORD) {
    console.log('🚚 [PLACEHOLDER] Shiprocket auth — returning dummy token');
    return 'shiprocket_placeholder_token';
  }

  // Cache token for 9 days
  if (tokenCache && Date.now() < tokenCache.expiresAt) {
    return tokenCache.token;
  }

  const res = await fetch(`${SHIPROCKET_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    }),
  });

  if (!res.ok) throw new Error('Shiprocket auth failed');
  const data = await res.json();

  tokenCache = {
    token: data.token,
    expiresAt: Date.now() + 9 * 24 * 60 * 60 * 1000,
  };

  return tokenCache.token;
}

// ─── Create Shipment ───────────────────────────────────────────────────────

export interface CreateShipmentParams {
  orderId: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  items: Array<{
    name: string;
    sku: string;
    units: number;
    sellingPrice: number;
  }>;
  paymentMethod: 'prepaid' | 'cod';
  subTotal: number;
  weight: number;  // in kg
}

export interface ShipmentResult {
  trackingId: string;
  trackingUrl: string;
  courierName: string;
  awbCode: string;
}

export async function createShipment(
  params: CreateShipmentParams
): Promise<ShipmentResult> {
  // PLACEHOLDER: return mock tracking info
  if (!process.env.SHIPROCKET_EMAIL) {
    console.log('🚚 [PLACEHOLDER] Creating shipment for order:', params.orderNumber);
    return {
      trackingId: `SR${Date.now()}`,
      trackingUrl: `https://shiprocket.co/tracking/SR${Date.now()}`,
      courierName: 'Delhivery',
      awbCode: `DEL${Date.now()}`,
    };
  }

  const token = await getAuthToken();

  const payload = {
    order_id: params.orderNumber,
    order_date: new Date().toISOString().split('T')[0],
    pickup_location: 'Primary',
    channel_id: '',
    comment: `Aurelius Jewelry Order #${params.orderNumber}`,
    billing_customer_name: params.customerName,
    billing_last_name: '',
    billing_address: params.shippingAddress.line1,
    billing_address_2: params.shippingAddress.line2 ?? '',
    billing_city: params.shippingAddress.city,
    billing_pincode: params.shippingAddress.pincode,
    billing_state: params.shippingAddress.state,
    billing_country: params.shippingAddress.country,
    billing_email: params.customerEmail,
    billing_phone: params.customerPhone,
    shipping_is_billing: true,
    order_items: params.items.map((item) => ({
      name: item.name,
      sku: item.sku,
      units: item.units,
      selling_price: item.sellingPrice / 100, // convert paise to rupees
    })),
    payment_method: params.paymentMethod === 'prepaid' ? 'Prepaid' : 'COD',
    sub_total: params.subTotal / 100,
    length: 15,
    breadth: 10,
    height: 5,
    weight: params.weight,
  };

  const res = await fetch(`${SHIPROCKET_BASE_URL}/orders/create/adhoc`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(`Shiprocket order creation failed: ${JSON.stringify(err)}`);
  }

  const data = await res.json();

  return {
    trackingId: data.shipment_id?.toString() ?? '',
    trackingUrl: `https://shiprocket.co/tracking/${data.awb_code}`,
    courierName: data.courier_name ?? 'Unknown',
    awbCode: data.awb_code ?? '',
  };
}

// ─── Track Shipment ────────────────────────────────────────────────────────

export async function trackShipment(awbCode: string) {
  // PLACEHOLDER
  if (!process.env.SHIPROCKET_EMAIL) {
    return {
      status: 'In Transit',
      eta: '3-5 business days',
      events: [],
    };
  }

  const token = await getAuthToken();
  const res = await fetch(`${SHIPROCKET_BASE_URL}/courier/track/awb/${awbCode}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) throw new Error('Failed to track shipment');
  return res.json();
}
