'use server';

import sql from '@/lib/db';
import { slugify } from '@/lib/utils';
import { uploadImage, deleteImage } from '@/lib/cloudinary';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import type { Product, ProductFormData } from '@/types';

// ─── Validation Schema ─────────────────────────────────────────────────────

const ProductSchema = z.object({
  name: z.string().min(2).max(200),
  description: z.string().min(10),
  short_description: z.string().min(5).max(300),
  price: z.number().positive(),
  compare_price: z.number().positive().optional(),
  category: z.enum(['rings', 'necklaces', 'earrings', 'bracelets', 'bangles', 'pendants', 'sets']),
  subcategory: z.string().optional(),
  material: z.string().min(2),
  weight: z.string().optional(),
  dimensions: z.string().optional(),
  stock_qty: z.number().int().min(0),
  images: z.array(z.string()).min(1),
  featured: z.boolean(),
  is_active: z.boolean(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
});

// ─── Get Products ──────────────────────────────────────────────────────────

export async function getProducts(params?: {
  category?: string;
  featured?: boolean;
  search?: string;
  page?: number;
  limit?: number;
  isActive?: boolean;
}): Promise<{ products: Product[]; total: number }> {
  const page = params?.page ?? 1;
  const limit = params?.limit ?? 20;
  const offset = (page - 1) * limit;
  const isActive = params?.isActive ?? true;

  // Build individual filter fragments — postgres package composes these cleanly
  const activeFilter   = isActive                       ? sql`AND is_active = true`                               : sql``;
  const categoryFilter = params?.category               ? sql`AND category = ${params.category}`                  : sql``;
  const featuredFilter = params?.featured !== undefined ? sql`AND featured = ${params.featured}`                  : sql``;
  const searchFilter   = params?.search                 ? sql`AND (name ILIKE ${'%' + params.search + '%'} OR description ILIKE ${'%' + params.search + '%'})` : sql``;

  const [products, countResult] = await Promise.all([
    sql<Product[]>`
      SELECT * FROM products
      WHERE 1=1
        ${activeFilter}
        ${categoryFilter}
        ${featuredFilter}
        ${searchFilter}
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `,
    sql`
      SELECT COUNT(*) as count FROM products
      WHERE 1=1
        ${activeFilter}
        ${categoryFilter}
        ${featuredFilter}
        ${searchFilter}
    `,
  ]);

  return {
    products,
    total: parseInt(String(countResult[0]?.count ?? 0)),
  };
}

// ─── Get Product by Slug ───────────────────────────────────────────────────

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const result = await sql`
    SELECT * FROM products WHERE slug = ${slug} AND is_active = true LIMIT 1
  `;
  return (result[0] as Product) ?? null;
}

// ─── Get Product by ID ─────────────────────────────────────────────────────

export async function getProductById(id: string): Promise<Product | null> {
  const result = await sql`
    SELECT * FROM products WHERE id = ${id} LIMIT 1
  `;
  return (result[0] as Product) ?? null;
}

// ─── Create Product ────────────────────────────────────────────────────────

export async function createProduct(data: ProductFormData) {
  const validated = ProductSchema.parse(data);
  const slug = slugify(validated.name);

  // Check for slug uniqueness
  const existing = await sql`SELECT id FROM products WHERE slug = ${slug}`;
  const finalSlug = existing.length > 0 ? `${slug}-${Date.now()}` : slug;

  const [product] = await sql`
    INSERT INTO products (
      name, slug, description, short_description, price, compare_price,
      category, subcategory, material, weight, dimensions, stock_qty,
      images, featured, is_active, meta_title, meta_description
    ) VALUES (
      ${validated.name}, ${finalSlug}, ${validated.description},
      ${validated.short_description}, ${validated.price},
      ${validated.compare_price ?? null}, ${validated.category},
      ${validated.subcategory ?? null}, ${validated.material},
      ${validated.weight ?? null}, ${validated.dimensions ?? null},
      ${validated.stock_qty}, ${JSON.stringify(validated.images)},
      ${validated.featured}, ${validated.is_active},
      ${validated.meta_title ?? null}, ${validated.meta_description ?? null}
    ) RETURNING *
  `;

  revalidatePath('/shop');
  revalidatePath('/');
  revalidatePath('/admin/products');

  return product as Product;
}

// ─── Update Product ────────────────────────────────────────────────────────

export async function updateProduct(id: string, data: Partial<ProductFormData>) {
  const [product] = await sql`
    UPDATE products SET
      name = COALESCE(${data.name ?? null}, name),
      description = COALESCE(${data.description ?? null}, description),
      short_description = COALESCE(${data.short_description ?? null}, short_description),
      price = COALESCE(${data.price ?? null}, price),
      compare_price = COALESCE(${data.compare_price ?? null}, compare_price),
      category = COALESCE(${data.category ?? null}, category),
      material = COALESCE(${data.material ?? null}, material),
      stock_qty = COALESCE(${data.stock_qty ?? null}, stock_qty),
      images = COALESCE(${data.images ? JSON.stringify(data.images) : null}, images),
      featured = COALESCE(${data.featured ?? null}, featured),
      is_active = COALESCE(${data.is_active ?? null}, is_active),
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;

  revalidatePath('/shop');
  revalidatePath(`/product/${(product as Product).slug}`);
  revalidatePath('/admin/products');

  return product as Product;
}

// ─── Delete Product ────────────────────────────────────────────────────────

export async function deleteProduct(id: string) {
  const product = await getProductById(id);
  if (!product) throw new Error('Product not found');

  // Delete images from Cloudinary
  await Promise.allSettled(
    product.images.map((img: string) => deleteImage(img))
  );

  await sql`DELETE FROM products WHERE id = ${id}`;

  revalidatePath('/shop');
  revalidatePath('/admin/products');
}

// ─── Upload Product Image ──────────────────────────────────────────────────

export async function uploadProductImage(base64Data: string) {
  const result = await uploadImage(base64Data, 'aurelius/products');
  return result;
}

// ─── Get Featured Products ─────────────────────────────────────────────────

export async function getFeaturedProducts(): Promise<Product[]> {
  const result = await sql`
    SELECT * FROM products
    WHERE featured = true AND is_active = true
    ORDER BY created_at DESC
    LIMIT 8
  `;
  return result as Product[];
}

// ─── Get Related Products ──────────────────────────────────────────────────

export async function getRelatedProducts(productId: string, category: string): Promise<Product[]> {
  const result = await sql`
    SELECT * FROM products
    WHERE category = ${category}
    AND id != ${productId}
    AND is_active = true
    ORDER BY RANDOM()
    LIMIT 4
  `;
  return result as Product[];
}
