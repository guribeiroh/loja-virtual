/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com',
        port: '',
        pathname: '/**',
      },
    ],
    unoptimized: process.env.NODE_ENV === 'development',
  },
  // Configurações otimizadas para a Vercel
  swcMinify: true,
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  // Otimização para o Next.js 15
  experimental: {
    serverComponentsExternalPackages: [],
  },
};

export default nextConfig;
