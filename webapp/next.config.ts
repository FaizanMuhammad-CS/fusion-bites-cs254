import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // When `npm run dev` / `npm run build` is executed from `webapp/`, cwd is this app (avoids parent package-lock ambiguity).
    root: process.cwd(),
  },
};

export default nextConfig;
