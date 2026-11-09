import type { NextConfig } from "next";

// Only the production deployment on the real domain may be indexed. While the
// site lives on *.vercel.app (before sellcalc.com is attached) it stays noindex.
const host = process.env.NEXT_PUBLIC_SITE_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || "";
const isProd = process.env.VERCEL_ENV === "production" && !host.includes("vercel.app");

const nextConfig: NextConfig = {
  trailingSlash: true,
  poweredByHeader: false,
  images: { unoptimized: true },
  async headers() {
    const security = [
      { key: "X-Content-Type-Options", value: "nosniff" },
      { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
      { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
    ];
    // Preview and development deployments must never be indexed.
    if (!isProd) security.push({ key: "X-Robots-Tag", value: "noindex, nofollow" });
    return [{ source: "/:path*", headers: security }];
  },
};

export default nextConfig;
