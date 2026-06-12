import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.menew.ir",
      },
      {
        protocol: "https",
        hostname: "public-cdn.menew.ir",
      },
    ],
    // Cache optimized logos/covers on Vercel's CDN (default is 4h).
    minimumCacheTTL: 86_400,
  },
};

export default nextConfig;
