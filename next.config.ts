import type { NextConfig } from "next";
// import NextBundleAnalyzer from "@next/bundle-analyzer";
// import { initOpenNextCloudflareForDev } from "@opennextjs/cloudflare";

const nextConfig: NextConfig = {
  // webpack: (config) => {
  //     config.plugins.push(ReactComponentName({}));
  //     return config;
  // },
  images: {
    remotePatterns: [
      {
        hostname: "im.runware.ai",
      },
      {
        hostname: "api.runware.ai",
      },
      {
        hostname: "lh3.googleusercontent.com",
      },
      {
        hostname: "avatars.githubusercontent.com",
      },
      {
        hostname: "github.com",
      },
      {
        protocol: "https",
        hostname: "cdn.discordapp.com",
      },
    ],
  },
  experimental: {
    cpus: 12,
    reactCompiler: true,
    serverActions: {
      allowedOrigins: ["https://im.runware.ai", "https://api.runware.ai"],
    },
    optimizePackageImports: [
      "motion",
      "react-markdown",
      "better-auth",
      "shiki",
      "shikijs/transformers",
    ],
  },
};

export default nextConfig;

// const withBundleAnalyzer = NextBundleAnalyzer({
//   enabled: process.env.ANALYZE === "true",
// });

// module.exports = withBundleAnalyzer(nextConfig);

// initOpenNextCloudflareForDev();
