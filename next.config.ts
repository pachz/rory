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
  },
};

export default nextConfig;
