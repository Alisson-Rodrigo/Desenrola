/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configurações para Docker (Next.js 15+)
  outputFileTracingRoot: process.cwd(),
  
  // Webpack config para hot reload em Docker
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Configurações para hot reload funcionar no Docker
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: /node_modules/,
      }
    }
    return config
  },

  // Outras configurações
  reactStrictMode: true,
}

export default nextConfig