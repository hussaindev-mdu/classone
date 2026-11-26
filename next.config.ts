import type { NextConfig } from "next";

/**
 * Two deploy targets:
 *  - default (Vercel / `next start`): full app incl. the /api/contact route (Resend).
 *  - GITHUB_PAGES=true: static export to /out for GitHub Pages. No server, so
 *    the API route is excluded and the contact form posts to Web3Forms instead.
 *    BASE_PATH is the repo sub-path (e.g. "/classone"), empty for user/org sites
 *    or custom domains.
 */
const isPages = process.env.GITHUB_PAGES === "true";
const basePath = isPages ? (process.env.BASE_PATH ?? "").replace(/\/$/, "") : "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  trailingSlash: isPages,
  basePath: basePath || undefined,
  output: isPages ? "export" : undefined,
  // `route.server.ts` files (the contact API) only exist in server builds.
  pageExtensions: isPages ? ["tsx", "ts"] : ["server.ts", "tsx", "ts"],
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
    NEXT_PUBLIC_STATIC_EXPORT: isPages ? "true" : "false",
  },
  images: {
    unoptimized: isPages,
    formats: ["image/avif", "image/webp"],
  },
  ...(isPages
    ? {}
    : {
        async headers() {
          return [
            {
              source: "/:path*",
              headers: [
                { key: "X-Content-Type-Options", value: "nosniff" },
                { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
                { key: "X-Frame-Options", value: "SAMEORIGIN" },
                { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
              ],
            },
          ];
        },
      }),
};

export default nextConfig;
