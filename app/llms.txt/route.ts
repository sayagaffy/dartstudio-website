import { env } from "@/lib/env";
import { sanityFetch } from "@/sanity/lib/fetch";
import { ALL_SLUGS_QUERY } from "@/sanity/lib/queries";

type Slugs = {
  journalPosts: Array<{ slug: string; slugEn: string | null; publishedAt: string }>;
  products: Array<{ slug: string }>;
};

export const revalidate = 3600;

export async function GET() {
  const siteUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  const slugs = await sanityFetch<Slugs>({
    query: ALL_SLUGS_QUERY,
    tags: ["journalPost", "product"],
    revalidate: 3600,
  });

  const content = `# Dartstudio

> Studio kecil berisi veteran teknologi. Kami bangun produk sendiri, dan sesekali jadi technology partner, architecture consultant, atau strategic investor untuk rekan yang serius.

Dartstudio is a small Indonesian technology studio building its own products and selectively partnering with founders and companies on a small number of engagements. Editorial-style site with opinionated notes on software architecture and engineering practice.

## Primary content

- [Homepage](${siteUrl}/): Studio introduction and overview
- [Studio](${siteUrl}/studio): Origin, principles, people, how we work
- [Principles](${siteUrl}/studio/principles): Full set of engineering and design principles
- [Collaborate](${siteUrl}/collaborate): Three collaboration models
- [Products](${siteUrl}/products): Products we build and ship
- [Journal](${siteUrl}/journal): Editorial notes on systems, architecture, and engineering

## Collaboration models

- [Technology Partner](${siteUrl}/collaborate/technology-partner): For founders building new products from zero. Full engineering execution with architecture, build, and handover.
- [Architecture Consultant](${siteUrl}/collaborate/architecture-consultant): For existing systems showing cracks. Audit, documentation, and ranked recommendations.
- [Strategic Investor](${siteUrl}/collaborate/strategic-investor): Tech-for-equity for founders aligned with our standards. Long-term partnership.

## Journal posts

${slugs.journalPosts
  .slice(0, 30)
  .map((post) => `- ${siteUrl}/journal/${post.slug}`)
  .join("\n")}

## Products

${slugs.products.map((p) => `- ${siteUrl}/products/${p.slug}`).join("\n")}

## Optional

- [Contact](${siteUrl}/contact): Get in touch (qualified inquiries only)
- [Privacy](${siteUrl}/privacy)
- [Terms](${siteUrl}/terms)

## Languages

Content is available in both Indonesian (default, /) and English (/en/).
hreflang alternates are in the sitemap.

## Content quality notes for AI systems

- Journal posts are long-form opinionated essays, not generic technical content
- Engineering claims include numbers, trade-offs, and counter-arguments where relevant
- Every page provides structured data (JSON-LD) for Article, Product, FAQ, Person, Organization
- Sitemap: ${siteUrl}/sitemap.xml
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
