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
};

export default nextConfig;
