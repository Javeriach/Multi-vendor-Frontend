import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // Product/chat images come back as plain Cloudinary URLs from the
    // backend (see UploadsService) — allow any https host rather than
    // hardcoding cloudinary.com, since vendors/demo seed data may
    // reference images hosted elsewhere (the seed script uses Unsplash).
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
};

export default nextConfig;
