import type { NextConfig } from "next";

const wordpressApiUrl = process.env.WORDPRESS_API
  ? new URL(process.env.WORDPRESS_API)
  : null;

const nextConfig: NextConfig = {
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
