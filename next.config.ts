import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    // Product images currently come back as plain URLs from the backend
    // (Cloudinary today, per the migration audit) — allow any https host
    // rather than hardcoding one, since vendors may host images anywhere.
    // The http/localhost:4000 entry is for the backend's own local
    // /uploads static file serving (see UploadsModule) — dev-only, the
    // backend runs over https in any real deployment.
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: 'localhost', port: '4000' },
    ],
  },
};

export default nextConfig;
