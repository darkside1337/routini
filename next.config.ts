import type { NextConfig } from "next";

const allowedDevOrigins = process.env.ALLOWED_DEV_ORIGINS
  ? process.env.ALLOWED_DEV_ORIGINS.split(",").map((origin) => origin.trim())
  : [
      "http://192.168.1.6:3000",
      "http://192.168.1.6:3001",
      "http://192.168.1.6",
      "192.168.1.7",
    ];

const nextConfig: NextConfig = {
  allowedDevOrigins,
};

export default nextConfig;
