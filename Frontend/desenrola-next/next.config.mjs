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

  // Outras configurações recomendadas
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  outputFileTracingRoot: process.cwd(),
};

export default nextConfig;
