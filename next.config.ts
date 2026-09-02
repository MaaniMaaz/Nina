import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone output for Hostinger / Docker / Railway. Vercel uses its own runner.
  ...(!process.env.VERCEL ? { output: "standalone" as const } : {}),
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  async redirects() {
    return [
      { source: "/book", destination: "/start", permanent: true },
      { source: "/booking", destination: "/start", permanent: true },
    ];
  },
};

export default nextConfig;
