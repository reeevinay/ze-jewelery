import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ProductForm from '@/components/admin/ProductForm';
import { getProductById, updateProduct } from '@/lib/actions/products';
import type { ProductFormData } from '@/types';

export const metadata: Metadata = { title: 'Edit Product | Aurelius Admin' };

interface Props { params: { id: string } }

export default async function EditProductPage({ params }: Props) {
  const product = await getProductById(params.id);
  if (!product) notFound();

  async function handleUpdate(data: ProductFormData) {
    'use server';
    await updateProduct(params.id, data);
  }

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="text-charcoal-muted hover:text-charcoal transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="font-serif text-2xl font-light text-charcoal">Edit Product</h1>
          <p className="font-sans text-sm text-charcoal-muted mt-0.5 truncate max-w-md">{product.name}</p>
        </div>
      </div>
      <ProductForm product={product} onSubmit={handleUpdate} />
    </div>
  );
}
