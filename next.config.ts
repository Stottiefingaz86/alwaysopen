import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@elevenlabs/convai-widget-embed"],
  images: {
    localPatterns: [
      {
        pathname: "/logo_icon.png",
      },
      {
        pathname: "/google-my-business-icon.svg",
      },
      {
        pathname: "/tripadvisor.png",
      },
      {
        pathname: "/trustpiliot.png",
      },
      {
        pathname: "/news/**",
      },
      {
        pathname: "/flags/**",
      },
      {
        pathname: "/integrations/**",
      },
      {
        pathname: "/client/**",
      },
    ],
  },
};

export default nextConfig;
