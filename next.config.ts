import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  sassOptions: {
    includePaths: [path.join(__dirname, "src/styles")],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.api.pikakasino.com',
      },
    ],
  },
};

export default nextConfig;
