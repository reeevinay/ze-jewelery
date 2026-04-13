// ─── Database Models ────────────────────────────────────────────────────────

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  price: number;            // in paise (INR smallest unit)
  compare_price?: number;   // original price for discount display
  category: ProductCategory;
  subcategory?: string;
  material: string;
  weight?: string;
  dimensions?: string;
  stock_qty: number;
  images: string[];         // Cloudinary public IDs
  featured: boolean;
  is_active: boolean;
  meta_title?: string;
  meta_description?: string;
  created_at: string;
  updated_at: string;
}

export type ProductCategory =
  | 'rings'
  | 'necklaces'
  | 'earrings'
  | 'bracelets'
  | 'bangles'
  | 'pendants'
  | 'sets';

export interface Customer {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: Address;
  created_at: string;
  updated_at: string;
}

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export type OrderStatus =
  | 'pending'
  | 'payment_pending'
  | 'payment_failed'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export interface Order {
  id: string;
  order_number: string;
  customer_id: string;
  customer?: Customer;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shipping_fee: number;
  total: number;
  status: OrderStatus;
  payment_id?: string;
  payment_method?: string;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  shipping_address: Address;
  tracking_id?: string;
  tracking_url?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product?: Product;
  product_name: string;
  product_image: string;
  quantity: number;
  price: number;
  total: number;
}

// ─── Cart ──────────────────────────────────────────────────────────────────

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  slug: string;
  maxQty: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  total: number;
}

// ─── API Responses ─────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ─── Checkout ──────────────────────────────────────────────────────────────

export interface CheckoutFormData {
  name: string;
  email: string;
  phone: string;
  address: Address;
  notes?: string;
}

// ─── Payment ──────────────────────────────────────────────────────────────

export interface RazorpayOrder {
  id: string;
  entity: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
}

export interface PaymentVerification {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

// ─── Admin ─────────────────────────────────────────────────────────────────

export interface AdminStats {
  totalOrders: number;
  totalRevenue: number;
  totalCustomers: number;
  totalProducts: number;
  recentOrders: Order[];
  topProducts: { product: Product; sold: number }[];
}

export interface ProductFormData {
  name: string;
  description: string;
  short_description: string;
  price: number;
  compare_price?: number;
  category: ProductCategory;
  subcategory?: string;
  material: string;
  weight?: string;
  dimensions?: string;
  stock_qty: number;
  images: string[];
  featured: boolean;
  is_active: boolean;
  meta_title?: string;
  meta_description?: string;
}
