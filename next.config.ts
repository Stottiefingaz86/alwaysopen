import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@elevenlabs/convai-widget-embed"],
  images: {
    localPatterns: [
      {
        pathname: "/news/**",
      },
    ],
  },
};

export default nextConfig;
