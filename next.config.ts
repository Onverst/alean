import type { NextConfig } from "next";

const wordpressApiUrl = process.env.WORDPRESS_API
  ? new URL(process.env.WORDPRESS_API)
  : null;

const nextConfig: NextConfig = {
  allowedDevOrigins: ["172.20.10.2"],
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
