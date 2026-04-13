'use client';

interface CloudinaryLoaderProps {
  src: string;
  width: number;
  quality?: number;
}

export default function cloudinaryLoader({ src, width, quality }: CloudinaryLoaderProps): string {
  // Handle external URLs (Unsplash, etc.)
  if (src.startsWith('http')) {
    return src;
  }

  // Handle Cloudinary public IDs
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  if (!cloudName) {
    console.warn('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set');
    return src;
  }

  const params = [
    'f_auto',
    'q_' + (quality || 'auto:good'),
    'w_' + width,
    'c_limit',
  ].join(',');

  return `https://res.cloudinary.com/${cloudName}/image/upload/${params}/${src}`;
}
