/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  swcMinify: false,
  images: { unoptimized: true },
  webpack(config) {
    if (config.optimization) {
      config.optimization.minimize = false;
    }
    return config;
  },
};

module.exports = nextConfig;
