
/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: '/',
          destination: '/movement/index.html',
        },
        {
          source: '/movement',
          destination: '/movement/index.html',
        },
      ],
      afterFiles: [],
      fallback: [],
    }
  },
}

export default nextConfig
