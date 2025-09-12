import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker optimization
  output: "standalone",

  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ["@phosphor-icons/react"],
  },

  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  // Image optimization
  images: {
    formats: ["image/webp", "image/avif"],
    minimumCacheTTL: 60,
  },

  // Headers for caching and security
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
        ],
      },
      {
        source: "/api/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=3600, s-maxage=3600",
          },
        ],
      },
      {
        source: "/:path*.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },

  // Bundle analyzer (only in development)
  ...(process.env.ANALYZE === "true" && {
    webpack: (config: any) => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { BundleAnalyzerPlugin } = require("@next/bundle-analyzer")({
        enabled: true,
      });
      config.plugins.push(new BundleAnalyzerPlugin());
      return config;
    },
  }),
};

export default nextConfig;
