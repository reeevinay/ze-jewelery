import type { Metadata } from 'next';
import { getOrders, updateOrderStatus } from '@/lib/actions/orders';
import { formatPrice, formatDateTime } from '@/lib/utils';
import type { OrderStatus } from '@/types';

export const metadata: Metadata = { title: 'Orders | Aurelius Admin' };
export const dynamic = 'force-dynamic';

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  payment_pending: 'bg-orange-100 text-orange-700 border-orange-200',
  payment_failed: 'bg-red-100 text-red-600 border-red-200',
  confirmed: 'bg-blue-100 text-blue-700 border-blue-200',
  processing: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  shipped: 'bg-purple-100 text-purple-700 border-purple-200',
  delivered: 'bg-green-100 text-green-700 border-green-200',
  cancelled: 'bg-red-100 text-red-500 border-red-200',
  refunded: 'bg-gray-100 text-gray-500 border-gray-200',
};

const STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
  pending: ['confirmed', 'cancelled'],
  payment_pending: ['confirmed', 'payment_failed', 'cancelled'],
  payment_failed: ['cancelled'],
  confirmed: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: ['refunded'],
  cancelled: [],
  refunded: [],
};

interface Props {
  searchParams: { status?: string; page?: string };
}

export default async function AdminOrdersPage({ searchParams }: Props) {
  const page = parseInt(searchParams.page ?? '1');
  const { orders, total } = await getOrders({
    status: searchParams.status as OrderStatus,
    page,
    limit: 25,
  });

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-2xl font-light text-charcoal">Orders</h1>
          <p className="font-sans text-sm text-charcoal-muted mt-1">{total} orders total</p>
        </div>
      </div>

      {/* Status filter */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {['', 'pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'].map((s) => (
          <a
            key={s || 'all'}
            href={s ? `/admin/orders?status=${s}` : '/admin/orders'}
            className={`px-3 py-1.5 font-sans text-xs capitalize border transition-colors ${
              (searchParams.status ?? '') === s
                ? 'bg-charcoal text-white border-charcoal'
                : 'border-gray-200 text-charcoal-muted hover:border-gold-400 hover:text-gold-600'
            }`}
          >
            {s || 'All'}
          </a>
        ))}
      </div>

      {/* Orders table */}
      <div className="bg-white border border-gray-100 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {['Order', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Date', 'Actions'].map((h) => (
                <th key={h} className="px-4 py-3 text-left font-sans text-2xs tracking-[0.15em] uppercase text-charcoal-muted whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {orders.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-12 font-sans text-sm text-charcoal-muted">
                  No orders found
                </td>
              </tr>
            )}
            {orders.map((order: any) => {
              const transitions = STATUS_TRANSITIONS[order.status as OrderStatus] ?? [];
              return (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-sans text-sm font-medium text-charcoal">{order.order_number}</p>
                    {order.tracking_id && (
                      <p className="font-sans text-2xs text-charcoal-muted mt-0.5">
                        Track: {order.tracking_id}
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-sans text-sm text-charcoal">{order.customer_name}</p>
                    <p className="font-sans text-xs text-charcoal-muted">{order.customer_email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-sans text-sm text-charcoal-muted">—</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-sans text-sm font-medium text-charcoal">{formatPrice(order.total)}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 text-2xs font-sans border rounded-full ${
                      order.payment_status === 'paid'
                        ? 'bg-green-100 text-green-700 border-green-200'
                        : order.payment_status === 'failed'
                        ? 'bg-red-100 text-red-600 border-red-200'
                        : 'bg-yellow-100 text-yellow-700 border-yellow-200'
                    }`}>
                      {order.payment_status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 text-2xs font-sans border rounded-full capitalize ${
                      STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-500'
                    }`}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-sans text-xs text-charcoal-muted whitespace-nowrap">
                      {formatDateTime(order.created_at)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {transitions.length > 0 && (
                      <form action={async (fd) => {
                        'use server';
                        const status = fd.get('status') as OrderStatus;
                        if (status) await updateOrderStatus(order.id, status);
                      }}>
                        <select name="status" className="input-luxury text-xs py-1 pr-6 max-w-[140px]"
                          defaultValue="">
                          <option value="" disabled>Update status…</option>
                          {transitions.map((s) => (
                            <option key={s} value={s} className="capitalize">{s.replace(/_/g,' ')}</option>
                          ))}
                        </select>
                        <button type="submit" className="sr-only">Update</button>
                      </form>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
