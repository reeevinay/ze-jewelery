'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'sonner';
import { Upload, X, GripVertical, Loader2 } from 'lucide-react';
import type { Product, ProductFormData } from '@/types';

const CATEGORIES = ['rings','necklaces','earrings','bracelets','bangles','pendants','sets'];

interface ProductFormProps {
  product?: Product;
  onSubmit: (data: ProductFormData) => Promise<void>;
}

type FieldProps = {
  id: string;
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
};

function Field({ id, label, error, required, children }: FieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block font-sans text-2xs tracking-[0.1em] uppercase text-charcoal-muted mb-1.5">
        {label}{required && ' *'}
      </label>
      {children}
      {error && <p className="mt-1 font-sans text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default function ProductForm({ product, onSubmit }: ProductFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<ProductFormData>({
    name: product?.name ?? '',
    description: product?.description ?? '',
    short_description: product?.short_description ?? '',
    price: product ? product.price / 100 : 0,
    compare_price: product?.compare_price ? product.compare_price / 100 : undefined,
    category: product?.category ?? 'rings',
    subcategory: product?.subcategory ?? '',
    material: product?.material ?? '',
    weight: product?.weight ?? '',
    dimensions: product?.dimensions ?? '',
    stock_qty: product?.stock_qty ?? 0,
    images: product?.images ?? [],
    featured: product?.featured ?? false,
    is_active: product?.is_active ?? true,
    meta_title: product?.meta_title ?? '',
    meta_description: product?.meta_description ?? '',
  });

  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (key: keyof ProductFormData, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => { const e = {...prev}; delete e[key]; return e; });
  };

  async function handleImageUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);

    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) { toast.error(`${file.name} is not an image`); continue; }
      if (file.size > 10 * 1024 * 1024) { toast.error(`${file.name} exceeds 10MB`); continue; }

      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const base64 = e.target?.result as string;
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ base64, folder: 'aurelius/products' }),
          });
          const data = await res.json();
          if (data.success) {
            set('images', [...form.images, data.data.public_id]);
            toast.success('Image uploaded');
          } else {
            toast.error(data.error ?? 'Upload failed');
          }
        } catch {
          toast.error('Upload failed');
        }
      };
      reader.readAsDataURL(file);
    }
    setUploading(false);
  }

  function removeImage(index: number) {
    set('images', form.images.filter((_, i) => i !== index));
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.description.trim()) e.description = 'Description is required';
    if (!form.short_description.trim()) e.short_description = 'Short description is required';
    if (form.price <= 0) e.price = 'Price must be greater than 0';
    if (!form.material.trim()) e.material = 'Material is required';
    if (form.stock_qty < 0) e.stock_qty = 'Stock cannot be negative';
    if (form.images.length === 0) e.images = 'At least one image is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) { toast.error('Please fix the errors'); return; }
    setSubmitting(true);
    try {
      await onSubmit({
        ...form,
        price: Math.round(form.price * 100),
        compare_price: form.compare_price ? Math.round(form.compare_price * 100) : undefined,
      });
      toast.success(product ? 'Product updated' : 'Product created');
      router.push('/admin/products');
    } catch (err: any) {
      toast.error(err.message ?? 'Failed to save product');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left column - main details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="bg-white border border-gray-100 p-6 space-y-5">
            <h2 className="font-sans text-xs tracking-[0.15em] uppercase text-charcoal-muted">Basic Information</h2>
            <Field id="name" label="Product Name" error={errors.name} required>
              <input id="name" className="input-luxury" value={form.name} onChange={(e) => set('name', e.target.value)} />
            </Field>
            <Field id="short_description" label="Short Description" error={errors.short_description} required>
              <textarea id="short_description" rows={2} className="input-luxury resize-none"
                value={form.short_description} onChange={(e) => set('short_description', e.target.value)} />
            </Field>
            <Field id="description" label="Full Description" error={errors.description} required>
              <textarea id="description" rows={6} className="input-luxury resize-none"
                value={form.description} onChange={(e) => set('description', e.target.value)} />
            </Field>
          </div>

          {/* Images */}
          <div className="bg-white border border-gray-100 p-6 space-y-4">
            <h2 className="font-sans text-xs tracking-[0.15em] uppercase text-charcoal-muted">Product Images</h2>
            {errors.images && <p className="font-sans text-xs text-red-500">{errors.images}</p>}

            <div
              className="border-2 border-dashed border-gray-200 hover:border-gold-300 transition-colors cursor-pointer p-8 text-center"
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); handleImageUpload(e.dataTransfer.files); }}
            >
              {uploading ? (
                <Loader2 size={24} className="mx-auto text-gold-500 animate-spin mb-2" />
              ) : (
                <Upload size={24} className="mx-auto text-gray-300 mb-2" />
              )}
              <p className="font-sans text-sm text-charcoal-muted">
                {uploading ? 'Uploading…' : 'Click or drag images to upload'}
              </p>
              <p className="font-sans text-xs text-gray-400 mt-1">PNG, JPG, WebP · Max 10MB each</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleImageUpload(e.target.files)}
            />

            {form.images.length > 0 && (
              <div className="grid grid-cols-4 gap-3 mt-4">
                {form.images.map((img, i) => (
                  <div key={img} className="relative aspect-square group">
                    <div className="w-full h-full bg-ivory overflow-hidden">
                      <img
                        src={`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/w_200,h_200,c_fill,f_auto/${img}`}
                        alt={`Product image ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={10} />
                    </button>
                    {i === 0 && (
                      <span className="absolute bottom-1 left-1 bg-gold-500 text-white text-2xs px-1 font-sans">
                        Primary
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* SEO */}
          <div className="bg-white border border-gray-100 p-6 space-y-4">
            <h2 className="font-sans text-xs tracking-[0.15em] uppercase text-charcoal-muted">SEO (Optional)</h2>
            <Field id="meta_title" label="Meta Title">
              <input id="meta_title" className="input-luxury" value={form.meta_title ?? ''} onChange={(e) => set('meta_title', e.target.value)} />
            </Field>
            <Field id="meta_description" label="Meta Description">
              <textarea id="meta_description" rows={3} className="input-luxury resize-none" value={form.meta_description ?? ''} onChange={(e) => set('meta_description', e.target.value)} />
            </Field>
          </div>
        </div>

        {/* Right column - settings */}
        <div className="space-y-6">
          {/* Pricing */}
          <div className="bg-white border border-gray-100 p-6 space-y-4">
            <h2 className="font-sans text-xs tracking-[0.15em] uppercase text-charcoal-muted">Pricing (₹)</h2>
            <Field id="price" label="Selling Price" error={errors.price} required>
              <input id="price" type="number" min="0" step="0.01" className="input-luxury"
                value={form.price || ''} onChange={(e) => set('price', parseFloat(e.target.value) || 0)} />
            </Field>
            <Field id="compare_price" label="Compare Price (MRP)">
              <input id="compare_price" type="number" min="0" step="0.01" className="input-luxury"
                value={form.compare_price || ''} onChange={(e) => set('compare_price', e.target.value ? parseFloat(e.target.value) : undefined)} />
            </Field>
          </div>

          {/* Organization */}
          <div className="bg-white border border-gray-100 p-6 space-y-4">
            <h2 className="font-sans text-xs tracking-[0.15em] uppercase text-charcoal-muted">Organization</h2>
            <Field id="category" label="Category" required>
              <select id="category" className="input-luxury" value={form.category} onChange={(e) => set('category', e.target.value)}>
                {CATEGORIES.map((c) => <option key={c} value={c} className="capitalize">{c}</option>)}
              </select>
            </Field>
            <Field id="material" label="Material" error={errors.material} required>
              <input id="material" className="input-luxury" placeholder="e.g. 18K Yellow Gold"
                value={form.material} onChange={(e) => set('material', e.target.value)} />
            </Field>
            <Field id="weight" label="Weight">
              <input id="weight" className="input-luxury" placeholder="e.g. 5.2g"
                value={form.weight ?? ''} onChange={(e) => set('weight', e.target.value)} />
            </Field>
            <Field id="dimensions" label="Dimensions">
              <input id="dimensions" className="input-luxury" placeholder="e.g. 15mm × 8mm"
                value={form.dimensions ?? ''} onChange={(e) => set('dimensions', e.target.value)} />
            </Field>
          </div>

          {/* Inventory */}
          <div className="bg-white border border-gray-100 p-6 space-y-4">
            <h2 className="font-sans text-xs tracking-[0.15em] uppercase text-charcoal-muted">Inventory</h2>
            <Field id="stock_qty" label="Stock Quantity" error={errors.stock_qty} required>
              <input id="stock_qty" type="number" min="0" step="1" className="input-luxury"
                value={form.stock_qty} onChange={(e) => set('stock_qty', parseInt(e.target.value) || 0)} />
            </Field>
          </div>

          {/* Visibility */}
          <div className="bg-white border border-gray-100 p-6 space-y-4">
            <h2 className="font-sans text-xs tracking-[0.15em] uppercase text-charcoal-muted">Visibility</h2>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.is_active} onChange={(e) => set('is_active', e.target.checked)}
                className="w-4 h-4 accent-gold-500" />
              <span className="font-sans text-sm text-charcoal">Active (visible to customers)</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" checked={form.featured} onChange={(e) => set('featured', e.target.checked)}
                className="w-4 h-4 accent-gold-500" />
              <span className="font-sans text-sm text-charcoal">Featured on homepage</span>
            </label>
          </div>
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
        <button
          type="submit"
          disabled={submitting}
          className="btn-gold flex items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {submitting && <Loader2 size={14} className="animate-spin" />}
          {submitting ? 'Saving…' : product ? 'Update Product' : 'Create Product'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/products')}
          className="btn-outline-gold"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
