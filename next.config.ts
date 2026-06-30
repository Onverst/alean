import type { NextConfig } from "next";

const wordpressApiUrl = process.env.WORDPRESS_API
  ? new URL(process.env.WORDPRESS_API)
  : null;

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.0.197", "192.168.31.35"], // для локалки, если не работает сайт, добавь сюда свой ip
  async rewrites() {
    return [
      {
        source: "/__visual/:path*",
        destination: "/visual/:path*",
      },
    ];
  },
  images: {
    remotePatterns: wordpressApiUrl
      ? [
          {
            protocol: wordpressApiUrl.protocol.replace(":", "") as
              | "http"
              | "https",
            hostname: wordpressApiUrl.hostname,
          },
        ]
      : [],
  },
};

export default nextConfig;
