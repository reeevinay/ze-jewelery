import { NextRequest, NextResponse } from 'next/server';
import { uploadImage } from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  // Admin only
  const adminToken = request.headers.get('x-admin-token');
  if (adminToken !== process.env.ADMIN_SECRET_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { base64, folder } = await request.json();

    if (!base64) {
      return NextResponse.json({ error: 'No image data provided' }, { status: 400 });
    }

    // Validate size (max 10MB base64 ≈ 7.5MB file)
    if (base64.length > 10 * 1024 * 1024 * 1.37) {
      return NextResponse.json({ error: 'File size exceeds 10MB limit' }, { status: 413 });
    }

    const result = await uploadImage(base64, folder ?? 'aurelius/products');

    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    console.error('Upload error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

export const config = {
  api: { bodyParser: { sizeLimit: '15mb' } },
};
