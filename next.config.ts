import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: [
    "http://192.168.1.6:3000",
    "http://192.168.1.6:3001",
    "http://192.168.1.6",
    "192.168.1.7",
  ],
};

export default nextConfig;
