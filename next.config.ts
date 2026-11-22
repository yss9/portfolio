import type { NextConfig } from "next";

const config: NextConfig = {
  trailingSlash: true,
  devIndicators: false,
  ...(process.env.AWS_STATIC_EXPORT === "1" && {
    output: "export",
    images: { unoptimized: true },
  }),
};
export default config;
