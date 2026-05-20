import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/medicalcul",
  assetPrefix: "/medicalcul/",
  images: { unoptimized: true },
};

export default nextConfig;
