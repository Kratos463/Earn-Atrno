/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['atrnoarenaapi.aeternus.foundation'],
    },
    env: {
        API_URL: process.env.API_URL,
        API_KEY: process.env.API_KEY,
        ACCESS_TOKEN: process.env.ACCESS_TOKEN,
    },
};

export default nextConfig;
