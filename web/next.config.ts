import type { NextConfig } from "next";

const isGhPages = process.env.DEPLOY_TARGET === "gh-pages" || (process.env.GITHUB_ACTIONS === "true" && !process.env.VERCEL);

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: isGhPages ? "export" : undefined,
  basePath: isGhPages ? "/kinday" : "",
  trailingSlash: isGhPages,
  images: {
    unoptimized: true,
  },
  async rewrites() {
    if (isGhPages) return [];
    return [
      {
        source: "/api/v1/:path*",
        destination: process.env.NODE_ENV === "development"
          ? "http://127.0.0.1:8000/api/v1/:path*"
          : "/api/v1/:path*",
      },
    ];
  },
};

export default nextConfig;
