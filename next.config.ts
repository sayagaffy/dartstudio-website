import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./lib/i18n/request.ts");

/**
 * Content-Security-Policy
 *
 * Allowlists everything we need:
 * - Sanity (CDN + Studio runtime)
 * - Cloudflare R2 (public bucket)
 * - Supabase (client-side use)
 * - Vercel Analytics
 * - Cloudflare Web Analytics
 *
 * Notes:
 * - 'unsafe-inline' for style-src is required by Sanity Studio
 * - 'unsafe-eval' for script-src is needed by Sanity Studio dev mode
 */
const cspDirectives = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com https://*.sanity.io https://static.cloudflareinsights.com",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob: https://cdn.sanity.io https://*.r2.dev https://*.r2.cloudflarestorage.com https://lh3.googleusercontent.com",
  "font-src 'self' data:",
  "connect-src 'self' https://*.sanity.io https://*.supabase.co wss://*.supabase.co https://*.upstash.io https://api.resend.com https://va.vercel-scripts.com https://vitals.vercel-insights.com https://*.r2.dev",
  "frame-src 'self' https://*.sanity.io",
  "media-src 'self' https://cdn.sanity.io https://*.r2.dev",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: cspDirectives },
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "cdn.sanity.io" },
      { protocol: "https", hostname: "*.r2.dev" },
      { protocol: "https", hostname: "*.r2.cloudflarestorage.com" },
    ],
  },
  async headers() {
    return [
      {
        // All frontend routes — strict CSP
        source: "/((?!admin).*)",
        headers: securityHeaders,
      },
      {
        // Admin (Sanity Studio) — looser, no CSP
        source: "/admin/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
