import { createProduct } from './src/lib/actions/products';

async function test() {
  try {
    const p = await createProduct({
      name: 'Test Product 2',
      description: 'Test description goes here',
      short_description: 'Test short description',
      price: 1000,
      category: 'rings',
      material: 'Gold',
      stock_qty: 10,
      images: ['test_image'],
      featured: false,
      is_active: true,
    } as any);
    console.log('Success:', p);
  } catch (err) {
    console.error('Error:', err);
  }
}
test();
