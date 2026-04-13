import type { Metadata } from 'next';
import sql from '@/lib/db';
import { formatDate } from '@/lib/utils';

export const metadata: Metadata = { title: 'Customers | Aurelius Admin' };
export const dynamic = 'force-dynamic';

interface Props {
  searchParams: { search?: string; page?: string };
}

export default async function AdminCustomersPage({ searchParams }: Props) {
  const page = parseInt(searchParams.page ?? '1');
  const limit = 25;
  const offset = (page - 1) * limit;
  const search = searchParams.search ?? '';

  const customers = search
    ? await sql`
        SELECT c.*, COUNT(o.id) as order_count, COALESCE(SUM(o.total), 0) as total_spent
        FROM customers c
        LEFT JOIN orders o ON o.customer_id = c.id AND o.payment_status = 'paid'
        WHERE c.name ILIKE ${'%' + search + '%'} OR c.email ILIKE ${'%' + search + '%'}
        GROUP BY c.id
        ORDER BY c.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `
    : await sql`
        SELECT c.*, COUNT(o.id) as order_count, COALESCE(SUM(o.total), 0) as total_spent
        FROM customers c
        LEFT JOIN orders o ON o.customer_id = c.id AND o.payment_status = 'paid'
        GROUP BY c.id
        ORDER BY c.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `;

  const [{ count }] = await sql`SELECT COUNT(*) as count FROM customers`;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-2xl font-light text-charcoal">Customers</h1>
          <p className="font-sans text-sm text-charcoal-muted mt-1">{count} customers total</p>
        </div>
      </div>

      {/* Search */}
      <form method="GET" className="flex gap-3 mb-6">
        <input
          name="search"
          defaultValue={search}
          placeholder="Search by name or email…"
          className="input-luxury max-w-sm text-sm py-2"
        />
        <button type="submit" className="btn-gold text-xs py-2 px-5">Search</button>
        {search && (
          <a href="/admin/customers" className="btn-outline-gold text-xs py-2 px-4">Clear</a>
        )}
      </form>

      {/* Table */}
      <div className="bg-white border border-gray-100 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {['Customer', 'Phone', 'Orders', 'Total Spent', 'Joined'].map((h) => (
                <th key={h} className="px-4 py-3 text-left font-sans text-2xs tracking-[0.15em] uppercase text-charcoal-muted">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {customers.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-12 font-sans text-sm text-charcoal-muted">
                  No customers found
                </td>
              </tr>
            )}
            {customers.map((c: any) => (
              <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <p className="font-sans text-sm font-medium text-charcoal">{c.name}</p>
                  <p className="font-sans text-xs text-charcoal-muted">{c.email}</p>
                </td>
                <td className="px-4 py-3">
                  <span className="font-sans text-sm text-charcoal-muted">{c.phone ?? '—'}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="font-sans text-sm text-charcoal">{c.order_count}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="font-sans text-sm font-medium text-charcoal">
                    {c.total_spent > 0
                      ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 }).format(c.total_spent / 100)
                      : '₹0'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="font-sans text-xs text-charcoal-muted">{formatDate(c.created_at)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
