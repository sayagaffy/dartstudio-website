/**
 * Drop-in wrapper for next/image — routes all images through /_next/image
 * so the browser only ever talks to dartstudio.id, avoiding cross-origin
 * SSL/CORS issues with R2 public URLs in Firefox and Brave.
 *
 * remotePatterns in next.config.ts already allowlists *.r2.dev so
 * Next.js fetches from R2 server-side and caches on Vercel CDN.
 */
import NextImage, { type ImageProps } from "next/image";

export function SanityImage(props: ImageProps) {
  return <NextImage {...props} />;
}
