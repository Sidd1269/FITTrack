/** @type {import('next').NextConfig} */
const nextConfig = {
  // App Router is now stable in Next.js 14, no experimental flag needed
  webpack: (config, { isServer }) => {
    // Fix for undici compatibility issues
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
        stream: false,
        http: false,
        https: false,
        zlib: false,
        path: false,
        os: false,
      };
    }
    
    // Handle undici module and private fields
    config.module.rules.push({
      test: /\.m?js$/,
      resolve: {
        fullySpecified: false,
      },
    });

    // Exclude undici from webpack processing
    config.externals = config.externals || [];
    config.externals.push({
      undici: 'undici',
    });
    
    return config;
  },
  experimental: {
    esmExternals: 'loose',
  },
  transpilePackages: ['firebase'],
}

module.exports = nextConfig
