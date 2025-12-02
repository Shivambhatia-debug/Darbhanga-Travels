/** @type {import('next').NextConfig} */
const nextConfig = {
  // Only use static export for production builds
  // API routes will work in development mode
  ...(process.env.NODE_ENV === 'production' && process.env.STATIC_EXPORT === 'true' ? { output: 'export' } : {}),
  trailingSlash: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default nextConfig
