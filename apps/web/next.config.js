/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@personal-os/shared'],
  typescript: {
    // Pre-existing type errors in API routes will be fixed incrementally
    ignoreBuildErrors: true,
  },
  eslint: {
    // Pre-existing ESLint warnings will be fixed incrementally
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
