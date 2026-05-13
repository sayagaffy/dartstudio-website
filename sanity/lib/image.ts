import createImageUrlBuilder from "@sanity/image-url";
import type { Image } from "sanity";
import { env } from "@/lib/env";

const builder = createImageUrlBuilder({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "",
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
});

export function urlForImage(source: Image) {
  return builder.image(source).auto("format").fit("max");
}
