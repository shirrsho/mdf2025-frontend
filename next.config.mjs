/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  poweredByHeader: false,
  productionBrowserSourceMaps: false,
  compiler: {
    removeConsole:
      process.env.NEXT_PUBLIC_ENVIRONMENT_CONFIG === 'prod' ? true : false,
  },
  async rewrites() {
    return [
      {
        source: '/admin',
        destination: '/admin/dashboard',
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'marketron.s3.us-east-005.backblazeb2.com',
      },
    ],
  },
};

export default nextConfig;
