import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Diagnostic: the only way to see WHICH source line a prerender crash
  // actually comes from — without this, Next reports a minified position
  // like ".next/server/app/page.js:2:10094" that maps to nothing readable.
  experimental: {
    serverSourceMaps: true,
  },
  images: {
    // Product/chat images come back as plain Cloudinary URLs from the
    // backend (see UploadsService) — allow any https host rather than
    // hardcoding cloudinary.com, since vendors/demo seed data may
    // reference images hosted elsewhere (the seed script uses Unsplash).
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
};

export default nextConfig;
