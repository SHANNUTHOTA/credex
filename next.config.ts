import type { NextConfig } from "next";

const isGitHubActions = process.env.GITHUB_ACTIONS === "true";
const repo = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "credex";
const basePath = isGitHubActions ? `/${repo}` : "";
const assetPrefix = isGitHubActions ? `/${repo}/` : undefined;

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  assetPrefix,
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
