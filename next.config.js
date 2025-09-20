/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    tsconfigPath: './tsconfig.json',
  },
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    domains: [],
  },
}

module.exports = nextConfig