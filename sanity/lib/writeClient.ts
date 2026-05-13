import "server-only";
import { createClient } from "next-sanity";
import { env } from "@/lib/env";

export const writeClient = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "",
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: env.NEXT_PUBLIC_SANITY_API_VERSION,
  token: env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});
