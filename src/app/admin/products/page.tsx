import type { Metadata } from 'next';
import Link from 'next/link';
import { getProducts } from '@/lib/actions/products';
import { formatPrice } from '@/lib/utils';
import { Plus, Pencil, Trash2, Package } from 'lucide-react';
import DeleteProductButton from './DeleteProductButton';

export const metadata: Metadata = { title: 'Products | Aurelius Admin' };
export const dynamic = 'force-dynamic';

interface Props {
  searchParams: { search?: string; page?: string; category?: string };
}

export default async function AdminProductsPage({ searchParams }: Props) {
  const page = parseInt(searchParams.page ?? '1');
  const { products, total } = await getProducts({
    search: searchParams.search,
    category: searchParams.category as any,
    page,
    limit: 20,
    isActive: undefined,
  });
  const totalPages = Math.ceil(total / 20);

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-2xl font-light text-charcoal">Products</h1>
          <p className="font-sans text-sm text-charcoal-muted mt-1">{total} products total</p>
        </div>
        <Link href="/admin/products/new" className="btn-gold flex items-center gap-2 text-xs py-3 px-5">
          <Plus size={14} /> Add Product
        </Link>
      </div>

      {/* Search + Filter */}
      <form method="GET" className="flex gap-3 mb-6">
        <input
          name="search"
          defaultValue={searchParams.search}
          placeholder="Search products…"
          className="input-luxury max-w-xs text-sm py-2"
        />
        <select name="category" defaultValue={searchParams.category} className="input-luxury max-w-[160px] text-sm py-2">
          <option value="">All Categories</option>
          {['rings','necklaces','earrings','bracelets','bangles','pendants','sets'].map((c) => (
            <option key={c} value={c} className="capitalize">{c}</option>
          ))}
        </select>
        <button type="submit" className="btn-gold text-xs py-2 px-5">Filter</button>
      </form>

      {/* Table */}
      <div className="bg-white border border-gray-100 overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              {['Product', 'Category', 'Price', 'Stock', 'Status', 'Actions'].map((h) => (
                <th key={h} className="px-4 py-3 text-left font-sans text-2xs tracking-[0.15em] uppercase text-charcoal-muted">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-12 font-sans text-sm text-charcoal-muted">
                  No products found
                </td>
              </tr>
            )}
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-ivory shrink-0 overflow-hidden">
                      {product.images[0] ? (
                        <img
                          src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_80,h_80,c_fill,f_auto/${product.images[0]}`}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package size={12} className="text-gray-300" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0">
                      <p className="font-sans text-sm text-charcoal truncate max-w-[200px]">{product.name}</p>
                      <p className="font-sans text-xs text-charcoal-muted truncate max-w-[200px]">{product.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className="font-sans text-xs capitalize text-charcoal-muted">{product.category}</span>
                </td>
                <td className="px-4 py-3">
                  <p className="font-sans text-sm text-charcoal">{formatPrice(product.price)}</p>
                  {product.compare_price && (
                    <p className="font-sans text-xs text-gray-400 line-through">{formatPrice(product.compare_price)}</p>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span className={`font-sans text-xs font-medium ${
                    product.stock_qty === 0 ? 'text-red-500' :
                    product.stock_qty <= 5 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {product.stock_qty === 0 ? 'Out of stock' : `${product.stock_qty} units`}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 font-sans text-2xs rounded-full ${
                    product.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {product.is_active ? 'Active' : 'Hidden'}
                  </span>
                  {product.featured && (
                    <span className="ml-1 px-2 py-1 font-sans text-2xs rounded-full bg-gold-100 text-gold-700">
                      Featured
                    </span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="p-1.5 text-charcoal-muted hover:text-gold-500 hover:bg-gold-50 transition-colors"
                      aria-label="Edit"
                    >
                      <Pencil size={13} />
                    </Link>
                    <DeleteProductButton productId={product.id} productName={product.name} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <a
              key={p}
              href={`/admin/products?page=${p}${searchParams.search ? `&search=${searchParams.search}` : ''}`}
              className={`w-8 h-8 flex items-center justify-center font-sans text-xs transition-colors border ${
                p === page ? 'bg-gold-500 border-gold-500 text-white' : 'border-gray-200 text-charcoal hover:border-gold-400'
              }`}
            >
              {p}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
