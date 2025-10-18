/** @type {import('next').NextConfig} */
const nextConfig = {
  // Saída otimizada para deploy com Docker (Next.js 15+)
  output: 'standalone',

  // Ignorar erros de ESLint e TypeScript no build (evita travar em produção)
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },

  // Hot reload funcional no Docker (somente em modo dev)
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        poll: 1000,
        aggregateTimeout: 300,
        ignored: /node_modules/,
      };
    }
    return config;
  },

  // Configurações de otimização
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  outputFileTracingRoot: process.cwd(),

  // Otimizações de imagem (adicione se usar next/image)
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    // Se usar imagens externas, adicione aqui:
    // remotePatterns: [
    //   {
    //     protocol: 'https',
    //     hostname: 'exemplo.com',
    //   },
    // ],
  },

  // Headers de segurança
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
        ],
      },
    ];
  },

  // Experimental (Next.js 15+)
  experimental: {
    optimizePackageImports: ['lucide-react', 'date-fns'], // ajuste conforme suas libs
  },
};

export default nextConfig;