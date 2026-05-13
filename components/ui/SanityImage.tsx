/**
 * Drop-in replacement for next/image when the src comes from Sanity CDN.
 *
 * Why unoptimized?
 * - Sanity CDN already delivers WebP/AVIF at q=80 via urlForImage()
 * - Routing through /_next/image (Next.js optimizer) causes the image to
 *   disappear after client-side navigation because the dev-mode LRU cache
 *   gets evicted between page transitions
 * - unoptimized=true makes the browser fetch directly from cdn.sanity.io,
 *   which has a proper global CDN with long-lived cache headers
 */
import NextImage, { type ImageProps } from "next/image";

type SanityImageProps = Omit<ImageProps, "unoptimized">;

export function SanityImage(props: SanityImageProps) {
  return <NextImage {...props} unoptimized />;
}
