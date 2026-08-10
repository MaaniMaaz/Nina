import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standalone is for Docker/Railway self-hosting. Vercel uses its own runner.
  ...(!process.env.VERCEL ? { output: "standalone" as const } : {}),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
