import type { NextConfig } from "next";

const allowedDevOrigins = process.env.ALLOWED_DEV_ORIGINS
  ? process.env.ALLOWED_DEV_ORIGINS.split(",").map((origin) => origin.trim())
  : [
      "192.168.1.5",
      "192.168.1.*",
      "192.168.*.*",
      "10.*.*.*",
      "172.*.*.*",
      "*.local",
      "*.ngrok-free.app",
      "*.ngrok-free.dev",
      "*.trycloudflare.com",
    ];

const nextConfig: NextConfig = {
  allowedDevOrigins,
};

export default nextConfig;
