import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com", pathname: "/**" },
      { protocol: "https", hostname: "images.unsplash.com", pathname: "/**" },
      // Vercel deployments (previews + prod may use *.vercel.app when src is an absolute URL)
      { protocol: "https", hostname: "**.vercel.app", pathname: "/**" },
    ],
  },
};

export default nextConfig;
