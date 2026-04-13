import type { Metadata } from 'next';
import Link from 'next/link';
import { getAdminStats } from '@/lib/actions/orders';
import { getProducts } from '@/lib/actions/products';
import { formatPrice, formatDateTime } from '@/lib/utils';
import { TrendingUp, Package, ShoppingBag, Users, Plus, Eye } from 'lucide-react';

export const metadata: Metadata = { title: 'Admin Dashboard | Aurelius' };
export const dynamic = 'force-dynamic';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700',
  payment_pending: 'bg-orange-100 text-orange-700',
  confirmed: 'bg-blue-100 text-blue-700',
  processing: 'bg-indigo-100 text-indigo-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
  payment_failed: 'bg-red-100 text-red-700',
};

export default async function AdminDashboard() {
  const [stats, { products, total: totalProducts }] = await Promise.all([
    getAdminStats(),
    getProducts({ limit: 5, isActive: undefined }),
  ]);

  const STAT_CARDS = [
    {
      icon: TrendingUp,
      label: 'Total Revenue',
      value: formatPrice(stats.totalRevenue),
      href: '/admin/orders',
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      icon: ShoppingBag,
      label: 'Total Orders',
      value: stats.totalOrders.toString(),
      href: '/admin/orders',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      icon: Users,
      label: 'Total Customers',
      value: stats.totalCustomers.toString(),
      href: '/admin/customers',
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      icon: Package,
      label: 'Total Products',
      value: totalProducts.toString(),
      href: '/admin/products',
      color: 'text-gold-600',
      bg: 'bg-gold-50',
    },
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-2xl font-light text-charcoal">Dashboard</h1>
          <p className="font-sans text-sm text-charcoal-muted mt-1">
            Welcome back — here&apos;s what&apos;s happening
          </p>
        </div>
        <Link href="/admin/products/new" className="btn-gold flex items-center gap-2 text-xs py-3 px-5">
          <Plus size={14} />
          Add Product
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {STAT_CARDS.map(({ icon: Icon, label, value, href, color, bg }) => (
          <Link
            key={label}
            href={href}
            className="bg-white border border-gray-100 p-5 hover:border-gold-200 hover:shadow-gold transition-all duration-200 group"
          >
            <div className="flex items-start justify-between">
              <div className={`w-10 h-10 ${bg} flex items-center justify-center`}>
                <Icon size={18} className={color} />
              </div>
              <Eye size={13} className="text-gray-300 group-hover:text-gold-400 transition-colors" />
            </div>
            <p className="font-serif text-2xl font-light text-charcoal mt-4">{value}</p>
            <p className="font-sans text-xs text-charcoal-muted mt-1 tracking-wide">{label}</p>
          </Link>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white border border-gray-100">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="font-sans text-sm font-medium text-charcoal">Recent Orders</h2>
            <Link href="/admin/orders" className="font-sans text-xs text-gold-500 hover:text-gold-600">
              View all →
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {stats.recentOrders.length === 0 && (
              <p className="p-6 text-center font-sans text-sm text-charcoal-muted">No orders yet</p>
            )}
            {stats.recentOrders.map((order: any) => (
              <Link
                key={order.id}
                href={`/admin/orders?highlight=${order.id}`}
                className="flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors"
              >
                <div>
                  <p className="font-sans text-sm font-medium text-charcoal">{order.order_number}</p>
                  <p className="font-sans text-xs text-charcoal-muted mt-0.5">{order.customer_name}</p>
                </div>
                <div className="text-right">
                  <p className="font-sans text-sm text-charcoal">{formatPrice(order.total)}</p>
                  <span
                    className={`inline-block mt-0.5 px-2 py-0.5 text-2xs font-sans rounded-full ${
                      STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {order.status.replace('_', ' ')}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Products */}
        <div className="bg-white border border-gray-100">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h2 className="font-sans text-sm font-medium text-charcoal">Recent Products</h2>
            <Link href="/admin/products" className="font-sans text-xs text-gold-500 hover:text-gold-600">
              View all →
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/admin/products/${product.id}/edit`}
                className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="w-10 h-10 bg-ivory flex items-center justify-center shrink-0 overflow-hidden">
                  {product.images[0] ? (
                    <img
                      src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_80,h_80,c_fill,f_auto/${product.images[0]}`}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Package size={14} className="text-gray-300" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-sm text-charcoal truncate">{product.name}</p>
                  <p className="font-sans text-xs text-charcoal-muted capitalize">{product.category}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-sans text-sm text-charcoal">{formatPrice(product.price)}</p>
                  <p className={`font-sans text-2xs ${product.is_active ? 'text-green-600' : 'text-red-500'}`}>
                    {product.is_active ? 'Active' : 'Hidden'}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
