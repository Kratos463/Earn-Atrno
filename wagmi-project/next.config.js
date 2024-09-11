// next.config.js

const isProduction = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: true,
    async rewrites() {
      return [
        {
          source: '/api/v1/:path*',
          destination: `${process.env.NEXT_PUBLIC_API_BASE_URL}/:path*`,
        },
      ];
    },
    env: {
      NEXT_PUBLIC_API_BASE_URL: isProduction
        ? 'https://api.example.com'
        : 'http://localhost:9000/api/v1',
        NEXT_PUBLIC_WC_PROJECT_ID: process.env.NEXT_PUBLIC_WC_PROJECT_ID || "002b8d71ece5792884cadf6dd885472b",
        NEXT_TELEMETRY_DISABLED: process.env.NEXT_TELEMETRY_DISABLED || 1,
        API_KEY: process.env.API_KEY || "0987yfgcevdgeyew908ogubeh",
        ACCESS_TOKEN: process.env.ACCESS_TOKEN || "45678uhjfr77uhjio543wssweerfghj"
    },
  };
  
  module.exports = nextConfig;
  