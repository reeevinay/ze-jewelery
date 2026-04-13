import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;

// ─── Upload helper ─────────────────────────────────────────────────────────

export async function uploadImage(
  base64Data: string,
  folder: string = 'aurelius/products'
): Promise<{ public_id: string; secure_url: string; width: number; height: number }> {
  const result = await cloudinary.uploader.upload(base64Data, {
    folder,
    resource_type: 'image',
    transformation: [
      { quality: 'auto:best', fetch_format: 'auto' },
      { width: 1200, crop: 'limit' },
    ],
  });

  return {
    public_id: result.public_id,
    secure_url: result.secure_url,
    width: result.width,
    height: result.height,
  };
}

// ─── Delete helper ─────────────────────────────────────────────────────────

export async function deleteImage(publicId: string): Promise<void> {
  await cloudinary.uploader.destroy(publicId);
}

// ─── URL builder ──────────────────────────────────────────────────────────

export function getImageUrl(
  publicId: string,
  options: {
    width?: number;
    height?: number;
    quality?: string;
    format?: string;
    crop?: string;
  } = {}
): string {
  const {
    width,
    height,
    quality = 'auto:good',
    format = 'auto',
    crop = 'fill',
  } = options;

  return cloudinary.url(publicId, {
    width,
    height,
    quality,
    fetch_format: format,
    crop,
    secure: true,
  });
}

// ─── Placeholder image ────────────────────────────────────────────────────

export const PLACEHOLDER_IMAGE = 'aurelius/placeholder';
