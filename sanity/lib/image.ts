import createImageUrlBuilder from "@sanity/image-url";
import type { Image } from "sanity";
import { env } from "@/lib/env";

const builder = createImageUrlBuilder({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "",
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
});

/**
 * Returns an @sanity/image-url builder pre-configured with:
 * - auto("format")  → Sanity CDN delivers WebP/AVIF to supporting browsers
 * - quality(80)     → ~80% quality keeps most images well under 100 KB
 * - fit("max")      → never upscales, crops only when width/height are both set
 *
 * Always add unoptimized to <Image> components using this URL — Sanity CDN
 * already handles optimization, so routing through /_next/image is redundant
 * and causes cache issues during client-side navigation.
 */
export function urlForImage(source: Image) {
  return builder.image(source).auto("format").quality(80).fit("max");
}
