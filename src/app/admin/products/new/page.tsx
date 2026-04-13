import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ProductForm from '@/components/admin/ProductForm';
import { createProduct } from '@/lib/actions/products';
import type { ProductFormData } from '@/types';

export const metadata: Metadata = { title: 'Add Product | Aurelius Admin' };

export default function NewProductPage() {
  async function handleCreate(data: ProductFormData) {
    'use server';
    await createProduct(data);
  }

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="text-charcoal-muted hover:text-charcoal transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="font-serif text-2xl font-light text-charcoal">Add Product</h1>
          <p className="font-sans text-sm text-charcoal-muted mt-0.5">Create a new product listing</p>
        </div>
      </div>
      <ProductForm onSubmit={handleCreate} />
    </div>
  );
}
