import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@elevenlabs/convai-widget-embed"],
  images: {
    localPatterns: [
      {
        pathname: "/logo_icon.png",
      },
      {
        pathname: "/news/**",
      },
    ],
  },
};

export default nextConfig;
