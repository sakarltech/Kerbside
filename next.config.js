/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    serverActions: true,
  },
  images: {
    domains: [],
  },
};

module.exports = nextConfig;
