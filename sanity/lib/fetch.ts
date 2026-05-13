import "server-only";
import type { QueryParams } from "next-sanity";
import { client } from "./client";

export async function sanityFetch<T = unknown>({
  query,
  params = {},
  tags = [],
  revalidate = 3600,
}: {
  query: string;
  params?: QueryParams;
  tags?: string[];
  revalidate?: number | false;
}): Promise<T> {
  return client.fetch<T>(query, params, {
    next: {
      revalidate: revalidate === false ? undefined : revalidate,
      tags,
    },
  });
}
