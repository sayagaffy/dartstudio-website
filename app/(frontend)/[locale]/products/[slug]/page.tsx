import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { Image as SanityImage } from "sanity";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { BehindTheBuild } from "@/components/sections/BehindTheBuild";
import { FAQ, type FAQItem } from "@/components/sections/FAQ";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { ProductCapabilities } from "@/components/sections/ProductCapabilities";
import { ProductProblemApproach } from "@/components/sections/ProductProblemApproach";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { type LocalizedField, localize } from "@/lib/i18n/localize";
import type { Locale } from "@/lib/i18n/routing";
import { buildMetadata } from "@/lib/seo/metadata";
import { sanityFetch } from "@/sanity/lib/fetch";
import { urlForImage } from "@/sanity/lib/image";
import { PRODUCT_QUERY, PRODUCTS_QUERY } from "@/sanity/lib/queries";

type Props = { params: Promise<{ locale: Locale; slug: string }> };

type Product = {
  _id: string;
  name: string;
  slug: { current: string };
  tagline: LocalizedField | null;
  status: "live" | "beta" | "coming-soon" | "sunset";
  heroImage: SanityImage | null;
  problemHeading: LocalizedField | null;
  problemBody: { id: unknown; en: unknown } | null;
  approachHeading: LocalizedField | null;
  approachBody: { id: unknown; en: unknown } | null;
  capabilities: Array<{
    heading: LocalizedField;
    body: { id: unknown; en: unknown };
    image?: SanityImage | null;
  }> | null;
  relatedJournalPosts: Array<{
    _id: string;
    title: LocalizedField;
    slug: { current: string };
    slugEn: { current: string } | null;
    excerpt: LocalizedField;
    publishedAt: string;
  }> | null;
  faqs: FAQItem[] | null;
  ctaHeading: LocalizedField | null;
  ctaBody: LocalizedField | null;
  ctaButtons: Array<{
    label: LocalizedField;
    href: string;
    variant?: "primary" | "secondary";
  }> | null;
  seo: { title: LocalizedField | null; description: LocalizedField | null } | null;
} | null;

const statusColor: Record<string, string> = {
  live: "var(--color-status-live)",
  beta: "var(--color-status-beta)",
  "coming-soon": "var(--color-status-soon)",
  sunset: "var(--color-status-sunset)",
};

const statusLabel: Record<string, string> = {
  live: "Live",
  beta: "Beta",
  "coming-soon": "Coming Soon",
  sunset: "Sunset",
};

export async function generateStaticParams() {
  const products = await sanityFetch<Array<{ slug: { current: string } }>>({
    query: PRODUCTS_QUERY,
    tags: ["product"],
  });
  return products.map((p) => ({ slug: p.slug.current }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const product = await sanityFetch<Product>({
    query: PRODUCT_QUERY,
    params: { slug },
    tags: ["product", `product:${slug}`],
  });

  if (!product)
    return buildMetadata({
      title: "Not Found — Dartstudio",
      description: "",
      path: `/products/${slug}`,
      locale,
      noIndex: true,
    });

  return buildMetadata({
    title: localize(product.seo?.title, locale) ?? `${product.name} — Dartstudio`,
    description:
      localize(product.seo?.description, locale) ?? localize(product.tagline, locale) ?? "",
    path: `/products/${slug}`,
    locale,
  });
}

export default async function ProductDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const product = await sanityFetch<Product>({
    query: PRODUCT_QUERY,
    params: { slug },
    tags: ["product", `product:${slug}`],
  });
  if (!product) notFound();

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Products", href: "/products" },
          { label: product.name },
        ]}
      />

      <Section spacing="lg">
        <Container size="page">
          <p
            className="font-mono text-xs uppercase tracking-wider"
            style={{ color: statusColor[product.status] ?? "var(--color-accent)" }}
          >
            {statusLabel[product.status] ?? product.status}
          </p>
          <Heading level={1} size="display-xl" className="mt-6">
            {product.name}
          </Heading>
          {product.tagline && (
            <p className="mt-6 max-w-3xl font-serif text-xl leading-relaxed text-[var(--color-fg-muted)]">
              {localize(product.tagline, locale)}
            </p>
          )}
          {product.ctaButtons && product.ctaButtons.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-4">
              {product.ctaButtons.map((cta) => (
                <Button key={cta.href} href={cta.href} variant={cta.variant ?? "primary"} size="lg">
                  {localize(cta.label, locale)}
                </Button>
              ))}
            </div>
          )}
        </Container>
      </Section>

      {product.heroImage?.asset && (
        <Section spacing="sm">
          <Container size="page">
            <div className="aspect-[16/9] overflow-hidden bg-[var(--color-bg-raised)]">
              <Image
                src={urlForImage(product.heroImage).width(1600).height(900).url()}
                alt={product.name}
                width={1600}
                height={900}
                className="h-full w-full object-cover"
                priority
              />
            </div>
          </Container>
        </Section>
      )}

      {product.problemBody && (
        <ProductProblemApproach
          eyebrow="The Problem"
          heading={localize(product.problemHeading, locale) ?? ""}
          body={locale === "en" ? product.problemBody.en : product.problemBody.id}
        />
      )}

      {product.approachBody && (
        <ProductProblemApproach
          eyebrow="The Approach"
          heading={localize(product.approachHeading, locale) ?? ""}
          body={locale === "en" ? product.approachBody.en : product.approachBody.id}
          variant="subtle"
        />
      )}

      {product.capabilities && product.capabilities.length > 0 && (
        <ProductCapabilities
          heading={locale === "en" ? "What it does." : "Yang produk ini lakukan."}
          intro={
            locale === "en"
              ? "Outcome-focused capabilities, not feature lists."
              : "Kapabilitas yang berorientasi hasil, bukan daftar fitur."
          }
          capabilities={product.capabilities}
          locale={locale}
        />
      )}

      {product.relatedJournalPosts && product.relatedJournalPosts.length > 0 && (
        <BehindTheBuild
          heading={
            locale === "en" ? "The story behind this product." : "Cerita di balik produk ini."
          }
          intro={
            locale === "en"
              ? "Decisions we made while building this, written up in the Journal."
              : "Keputusan yang kami ambil saat membangun ini, ditulis di Journal."
          }
          posts={product.relatedJournalPosts}
          locale={locale}
        />
      )}

      <FAQ
        heading={locale === "en" ? "Common questions." : "Pertanyaan umum."}
        items={product.faqs ?? []}
        locale={locale}
      />

      <FinalCTA
        heading={
          localize(product.ctaHeading, locale) ??
          (locale === "en" ? "Ready to try it?" : "Siap mencobanya?")
        }
        body={localize(product.ctaBody, locale) ?? ""}
        ctaLabel={locale === "en" ? "Start a Conversation" : "Mulai Percakapan"}
        ctaHref="/contact"
      />
    </>
  );
}
