import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Allow cross-origin requests from preview system
  allowedDevOrigins: [
    'preview-chat-58f672e2-f0aa-4ba4-abf3-b9cacc829382.space.z.ai',
    '.space.z.ai',
    'localhost',
  ],
};

export default nextConfig;
