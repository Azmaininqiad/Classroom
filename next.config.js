/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { 
    unoptimized: true 
  },
  // Removed output: 'export' to enable dynamic pages
  experimental: {
    esmExternals: false,
  },
  typescript: {
    ignoreBuildErrors: true, // ⚠️ This disables TS errors during build
  },
};

module.exports = nextConfig;