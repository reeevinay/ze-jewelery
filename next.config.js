/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Use Next.js built-in image optimization for all images.
    // Cloudinary URLs are served directly via remotePatterns.
    // For Cloudinary-specific optimization, use the getImageUrl() helper
    // in src/lib/cloudinary.ts when building <img> src strings manually.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
    ],
    // Serve modern formats automatically
    formats: ['image/avif', 'image/webp'],
    // Cache optimized images for 7 days
    minimumCacheTTL: 604800,
  },
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000'],
    },
  },
};

module.exports = nextConfig;
