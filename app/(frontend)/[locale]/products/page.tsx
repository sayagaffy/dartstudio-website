import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ProductCard } from "@/components/content/ProductCard";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { type LocalizedField, localize } from "@/lib/i18n/localize";
import type { Locale } from "@/lib/i18n/routing";
import { buildMetadata } from "@/lib/seo/metadata";
import type { R2Image } from "@/lib/types/r2Image";
import { sanityFetch } from "@/sanity/lib/fetch";
import { PAGE_QUERY, PRODUCTS_QUERY } from "@/sanity/lib/queries";

type Props = { params: Promise<{ locale: Locale }> };

type Product = {
  _id: string;
  name: string;
  slug: { current: string };
  tagline: LocalizedField | null;
  status: "live" | "beta" | "coming-soon" | "sunset";
  heroImage?: R2Image;
};

type PageData = {
  heroHeading: LocalizedField | null;
  heroSubheading: LocalizedField | null;
  seo: { title: LocalizedField | null; description: LocalizedField | null } | null;
} | null;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const data = await sanityFetch<PageData>({
    query: PAGE_QUERY,
    params: { pageKey: "products" },
    tags: ["page", "page:products"],
  });

  return buildMetadata({
    title: localize(data?.seo?.title, locale) ?? "Products — Dartstudio",
    description:
      localize(data?.seo?.description, locale) ??
      (locale === "en"
        ? "Products built by Dartstudio, starting with what we use ourselves."
        : "Produk yang dibangun Dartstudio, dimulai dari yang kami pakai sendiri."),
    path: "/products",
    locale,
  });
}

export default async function ProductsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [pageData, products] = await Promise.all([
    sanityFetch<PageData>({
      query: PAGE_QUERY,
      params: { pageKey: "products" },
      tags: ["page", "page:products"],
    }),
    sanityFetch<Product[]>({ query: PRODUCTS_QUERY, tags: ["product"] }),
  ]);

  const liveProducts = products.filter((p) => p.status === "live");
  const betaProducts = products.filter((p) => p.status === "beta");
  const comingSoonProducts = products.filter((p) => p.status === "coming-soon");

  return (
    <>
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Products" }]} />

      <Section spacing="lg">
        <Container size="page">
          <p className="label-mono mb-6">Products</p>
          <Heading level={1} size="display-xl">
            {localize(pageData?.heroHeading, locale) ??
              (locale === "en"
                ? "What we build, starting with what we use."
                : "Hal-hal yang kami bangun, dimulai dari yang kami pakai sendiri.")}
          </Heading>
          {pageData?.heroSubheading && (
            <p className="mt-6 max-w-2xl font-serif text-xl leading-relaxed text-[var(--color-fg-muted)]">
              {localize(pageData.heroSubheading, locale)}
            </p>
          )}
        </Container>
      </Section>

      {liveProducts.length > 0 && (
        <Section spacing="md">
          <Container size="page">
            <p className="label-mono mb-8">Live</p>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {liveProducts.map((p) => (
                <ProductCard key={p._id} product={p} locale={locale} />
              ))}
            </div>
          </Container>
        </Section>
      )}

      {betaProducts.length > 0 && (
        <Section spacing="md">
          <Container size="page">
            <p className="label-mono mb-8">Beta</p>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {betaProducts.map((p) => (
                <ProductCard key={p._id} product={p} locale={locale} />
              ))}
            </div>
          </Container>
        </Section>
      )}

      {comingSoonProducts.length > 0 && (
        <Section spacing="md">
          <Container size="page">
            <p className="label-mono mb-8">Coming Soon</p>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {comingSoonProducts.map((p) => (
                <ProductCard key={p._id} product={p} locale={locale} />
              ))}
            </div>
          </Container>
        </Section>
      )}

      <FinalCTA
        heading={
          locale === "en" ? "Have an idea you want built?" : "Punya ide yang ingin dibangun?"
        }
        body={
          locale === "en"
            ? "Tell us about it. We'll be honest if it's a fit."
            : "Ceritakan ke kami. Kami akan jujur kalau cocok."
        }
        ctaLabel={locale === "en" ? "Start a Conversation" : "Mulai Percakapan"}
        ctaHref="/contact"
      />
    </>
  );
}
