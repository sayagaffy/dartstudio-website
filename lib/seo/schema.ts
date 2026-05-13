import type {
  Article,
  BreadcrumbList,
  FAQPage,
  Organization,
  Person,
  Product,
  WebSite,
  WithContext,
} from "schema-dts";
import { env } from "@/lib/env";

const siteUrl = env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");

/**
 * Organization schema — included on every page via the root layout.
 */
export function buildOrganizationSchema(): WithContext<Organization> {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: "Dartstudio",
    url: siteUrl,
    logo: `${siteUrl}/brand/logo-horizontal-black.png`,
    description:
      "Studio kecil berisi veteran teknologi. Kami bangun produk sendiri, dan sesekali jadi technology partner, architecture consultant, atau strategic investor untuk rekan yang serius.",
    foundingLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressCountry: "ID",
      },
    },
    email: "hello@dartstudio.id",
  };
}

/**
 * Website schema — sitelinks search box and identification.
 */
export function buildWebsiteSchema(): WithContext<WebSite> {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: siteUrl,
    name: "Dartstudio",
    publisher: { "@id": `${siteUrl}/#organization` },
    inLanguage: ["id-ID", "en-US"],
  };
}

/**
 * BreadcrumbList — for every L2+ page.
 */
export function buildBreadcrumbSchema(
  items: Array<{ label: string; href?: string }>,
): WithContext<BreadcrumbList> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.label,
      ...(item.href ? { item: `${siteUrl}${item.href}` } : {}),
    })),
  };
}

/**
 * Article schema — for Journal posts.
 * GEO/AEO impact: heavy. Article schema with proper author, dates, and citations
 * is the single biggest signal for both Google and LLM-driven search.
 */
export function buildArticleSchema(post: {
  title: string;
  description: string;
  slug: string;
  publishedAt: string;
  updatedAt?: string | null;
  author: { name: string; url?: string };
  category?: string;
  image?: string;
  locale: "id" | "en";
}): WithContext<Article> {
  const url = `${siteUrl}${post.locale === "id" ? "" : "/en"}/journal/${post.slug}`;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${url}#article`,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    headline: post.title,
    description: post.description,
    url,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt ?? post.publishedAt,
    inLanguage: post.locale === "id" ? "id-ID" : "en-US",
    author: {
      "@type": "Person",
      name: post.author.name,
      ...(post.author.url ? { url: post.author.url } : {}),
    },
    publisher: { "@id": `${siteUrl}/#organization` },
    ...(post.category ? { articleSection: post.category } : {}),
    ...(post.image
      ? {
          image: {
            "@type": "ImageObject",
            url: post.image,
            width: "1200",
            height: "630",
          },
        }
      : {}),
  };
}

/**
 * Product schema — for product detail pages.
 */
export function buildProductSchema(product: {
  name: string;
  description: string;
  slug: string;
  status: "live" | "beta" | "coming-soon" | "sunset";
  image?: string;
  locale: "id" | "en";
}): WithContext<Product> {
  const url = `${siteUrl}${product.locale === "id" ? "" : "/en"}/products/${product.slug}`;

  type ItemAvailability =
    | "https://schema.org/InStock"
    | "https://schema.org/LimitedAvailability"
    | "https://schema.org/PreOrder"
    | "https://schema.org/Discontinued";

  const availability: Record<typeof product.status, ItemAvailability> = {
    live: "https://schema.org/InStock",
    beta: "https://schema.org/LimitedAvailability",
    "coming-soon": "https://schema.org/PreOrder",
    sunset: "https://schema.org/Discontinued",
  };

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${url}#product`,
    name: product.name,
    description: product.description,
    url,
    brand: { "@id": `${siteUrl}/#organization` },
    ...(product.image ? { image: product.image } : {}),
    offers: {
      "@type": "Offer",
      url,
      availability: availability[product.status],
      priceCurrency: "USD",
      price: "0",
    },
  };
}

/**
 * Person schema — for the People page and author bylines.
 */
export function buildPersonSchema(person: {
  name: string;
  slug: string;
  role: string;
  bio?: string;
  image?: string;
  locale: "id" | "en";
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    github?: string;
  };
}): WithContext<Person> {
  const url = `${siteUrl}${person.locale === "id" ? "" : "/en"}/studio/people/${person.slug}`;
  const sameAs = [
    person.socialLinks?.twitter,
    person.socialLinks?.linkedin,
    person.socialLinks?.github,
  ].filter((v): v is string => typeof v === "string" && v.length > 0);

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": `${url}#person`,
    name: person.name,
    jobTitle: person.role,
    url,
    ...(person.bio ? { description: person.bio } : {}),
    ...(person.image ? { image: person.image } : {}),
    worksFor: { "@id": `${siteUrl}/#organization` },
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}

/**
 * FAQPage schema — major lever for both classic SEO (rich snippets in SERPs)
 * AND AEO (voice assistants pull from FAQPage schema directly).
 *
 * Critical: answers should be 1-2 sentences, max 50 words. Concise = picked up.
 */
export function buildFAQPageSchema(
  faqs: Array<{ question: string; answer: string }>,
): WithContext<FAQPage> {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}
