import type { MetadataRoute } from "next";
import { env } from "@/lib/env";
import { sanityFetch } from "@/sanity/lib/fetch";
import { ALL_SLUGS_QUERY } from "@/sanity/lib/queries";

type Slugs = {
  products: Array<{ slug: string; _updatedAt: string }>;
  journalPosts: Array<{
    slug: string;
    slugEn: string | null;
    _updatedAt: string;
    publishedAt: string;
  }>;
  journalCategories: Array<{ slug: string; _updatedAt: string }>;
  collaborateModels: Array<{ modelKey: string; _updatedAt: string }>;
};

const siteUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");

/**
 * Build a sitemap entry with hreflang alternates.
 * Each public-facing route appears once but lists both ID and EN URLs as alternates.
 */
function buildEntry(opts: {
  path: string;
  lastModified?: string | Date;
  changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority?: number;
  /** Optional EN-specific path if different from ID slug */
  enPath?: string;
}): MetadataRoute.Sitemap[number] {
  const enPath = opts.enPath ?? opts.path;
  return {
    url: `${siteUrl}${opts.path === "/" ? "" : opts.path}`,
    lastModified: opts.lastModified ?? new Date(),
    changeFrequency: opts.changeFrequency ?? "monthly",
    priority: opts.priority ?? 0.5,
    alternates: {
      languages: {
        "id-ID": `${siteUrl}${opts.path === "/" ? "" : opts.path}`,
        "en-US": `${siteUrl}/en${enPath === "/" ? "" : enPath}`,
        "x-default": `${siteUrl}${opts.path === "/" ? "" : opts.path}`,
      },
    },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const slugs = await sanityFetch<Slugs>({
    query: ALL_SLUGS_QUERY,
    tags: ["product", "journalPost", "journalCategory", "collaborateModel"],
    revalidate: 3600,
  });

  const entries: MetadataRoute.Sitemap = [];

  // Static pages
  entries.push(
    buildEntry({ path: "/", changeFrequency: "weekly", priority: 1.0 }),
    buildEntry({ path: "/studio", changeFrequency: "monthly", priority: 0.8 }),
    buildEntry({ path: "/studio/principles", priority: 0.7 }),
    buildEntry({ path: "/collaborate", changeFrequency: "monthly", priority: 0.9 }),
    buildEntry({ path: "/products", changeFrequency: "weekly", priority: 0.8 }),
    buildEntry({ path: "/journal", changeFrequency: "weekly", priority: 0.9 }),
    buildEntry({ path: "/contact", priority: 0.8 }),
    buildEntry({ path: "/privacy", priority: 0.2, changeFrequency: "yearly" }),
    buildEntry({ path: "/terms", priority: 0.2, changeFrequency: "yearly" }),
  );

  // Collaborate models
  for (const model of slugs.collaborateModels) {
    entries.push(
      buildEntry({
        path: `/collaborate/${model.modelKey}`,
        lastModified: model._updatedAt,
        priority: 0.9,
      }),
    );
  }

  // Products
  for (const product of slugs.products) {
    entries.push(
      buildEntry({
        path: `/products/${product.slug}`,
        lastModified: product._updatedAt,
        priority: 0.7,
      }),
    );
  }

  // Journal posts (handle EN-specific slug)
  for (const post of slugs.journalPosts) {
    entries.push(
      buildEntry({
        path: `/journal/${post.slug}`,
        enPath: `/journal/${post.slugEn ?? post.slug}`,
        lastModified: post._updatedAt,
        changeFrequency: "monthly",
        priority: 0.6,
      }),
    );
  }

  // Journal categories
  for (const cat of slugs.journalCategories) {
    entries.push(
      buildEntry({
        path: `/journal/category/${cat.slug}`,
        lastModified: cat._updatedAt,
        priority: 0.4,
      }),
    );
  }

  return entries;
}
