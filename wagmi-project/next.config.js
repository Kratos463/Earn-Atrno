// next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    async rewrites() {
      return [
        {
          source: '/api/v1/:path*', // This is the route on your Next.js app
          destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/:path*`, // This uses an environment variable
        },
      ];
    },
  };
  
  module.exports = nextConfig;
  