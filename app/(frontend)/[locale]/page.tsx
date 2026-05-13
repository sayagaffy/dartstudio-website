import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CredibilityBar } from "@/components/sections/CredibilityBar";
import { FeaturedProducts } from "@/components/sections/FeaturedProducts";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { FromTheJournal, type JournalCard } from "@/components/sections/FromTheJournal";
import { Hero } from "@/components/sections/Hero";
import { ThreeWaysToCollaborate } from "@/components/sections/ThreeWaysToCollaborate";
import { type LocalizedField, localize } from "@/lib/i18n/localize";
import type { Locale } from "@/lib/i18n/routing";
import { buildMetadata } from "@/lib/seo/metadata";
import { sanityFetch } from "@/sanity/lib/fetch";
import {
  COLLABORATE_MODELS_QUERY,
  FEATURED_PRODUCTS_QUERY,
  LATEST_JOURNAL_POSTS_QUERY,
  PAGE_QUERY,
  SITE_SETTINGS_QUERY,
} from "@/sanity/lib/queries";

type Props = { params: Promise<{ locale: Locale }> };

type HomePageData = {
  heroHeading: LocalizedField | null;
  heroSubheading: LocalizedField | null;
  ctaPrimary: { label: LocalizedField; href: string } | null;
  ctaSecondary: { label: LocalizedField; href: string } | null;
  sections: Array<{ sectionType: string; heading: LocalizedField | null; body: unknown }> | null;
} | null;

type SiteSettings = {
  siteTagline: LocalizedField | null;
  siteDescription: LocalizedField | null;
} | null;

type FeaturedProduct = {
  _id: string;
  name: string;
  slug: { current: string };
  tagline: LocalizedField | null;
  status: "live" | "beta" | "coming-soon" | "sunset";
};

type CollaborateModelCard = {
  _id: string;
  modelKey: string;
  name: LocalizedField;
  shortDescriptor: LocalizedField | null;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const settings = await sanityFetch<SiteSettings>({
    query: SITE_SETTINGS_QUERY,
    tags: ["siteSettings"],
  });
  const tagline = localize(settings?.siteTagline, locale) ?? "";
  const description = localize(settings?.siteDescription, locale) ?? "";

  return buildMetadata({
    title: tagline ? `Dartstudio — ${tagline}` : "Dartstudio",
    description,
    path: "/",
    locale,
  });
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("home");

  const [homeData, featuredProducts, models, latestPosts] = await Promise.all([
    sanityFetch<HomePageData>({
      query: PAGE_QUERY,
      params: { pageKey: "home" },
      tags: ["page", "page:home"],
    }),
    sanityFetch<FeaturedProduct[]>({ query: FEATURED_PRODUCTS_QUERY, tags: ["product"] }),
    sanityFetch<CollaborateModelCard[]>({
      query: COLLABORATE_MODELS_QUERY,
      tags: ["collaborateModel"],
    }),
    sanityFetch<JournalCard[]>({ query: LATEST_JOURNAL_POSTS_QUERY, tags: ["journalPost"] }),
  ]);

  const sectionByType = (type: string) => homeData?.sections?.find((s) => s.sectionType === type);
  const credibilitySection = sectionByType("credibility-bar");
  const threeWaysSection = sectionByType("three-ways");
  const journalSection = sectionByType("from-journal");
  const finalCtaSection = sectionByType("final-cta");

  const ctaPrimary = homeData?.ctaPrimary
    ? { label: localize(homeData.ctaPrimary.label, locale) ?? "", href: homeData.ctaPrimary.href }
    : null;
  const ctaSecondary = homeData?.ctaSecondary
    ? {
        label: localize(homeData.ctaSecondary.label, locale) ?? "",
        href: homeData.ctaSecondary.href,
      }
    : null;

  return (
    <>
      <Hero
        heading={localize(homeData?.heroHeading, locale) ?? t("placeholder")}
        subheading={localize(homeData?.heroSubheading, locale) ?? undefined}
        ctaPrimary={ctaPrimary}
        ctaSecondary={ctaSecondary}
      />

      {credibilitySection && (
        <CredibilityBar
          heading={localize(credibilitySection.heading, locale) ?? ""}
          body={localize(credibilitySection.body as LocalizedField<unknown[]>, locale) ?? []}
        />
      )}

      <FeaturedProducts
        heading={
          locale === "en"
            ? "Things we build, starting with what we use."
            : "Hal-hal yang kami bangun, dimulai dari yang kami pakai sendiri."
        }
        intro={
          locale === "en"
            ? "Dartstudio's first priority is always our own products."
            : "Prioritas pertama Dartstudio selalu produk sendiri."
        }
        products={featuredProducts}
        viewAllLabel={t("productsViewAll")}
        locale={locale}
      />

      <ThreeWaysToCollaborate
        heading={
          localize(threeWaysSection?.heading, locale) ??
          (locale === "en"
            ? "Three ways to work together, if the vision fits."
            : "Tiga cara kerja, kalau visinya cocok.")
        }
        intro={
          locale === "en"
            ? "Since our main focus is our own products, we're selective about partners."
            : "Karena fokus utama kami produk sendiri, kami pilih-pilih rekan."
        }
        models={models}
        learnMoreLabel={t("collaborateLearnMore")}
        locale={locale}
      />

      <FromTheJournal
        heading={
          localize(journalSection?.heading, locale) ??
          (locale === "en" ? "Latest notes from the studio." : "Catatan terbaru dari studio.")
        }
        intro={
          locale === "en"
            ? "We write about systems that last, and systems that don't."
            : "Kami menulis soal sistem yang bertahan, dan yang tidak."
        }
        posts={latestPosts}
        viewAllLabel={t("journalViewAll")}
        locale={locale}
      />

      <FinalCTA
        heading={
          localize(finalCtaSection?.heading, locale) ??
          (locale === "en"
            ? "Small studio. Standards that aren't."
            : "Studio kecil. Standar yang tidak.")
        }
        body={
          localize(finalCtaSection?.body as LocalizedField<unknown[]>, locale) ??
          (locale === "en"
            ? "If you want precision in every line of code and every architecture decision, we might have a lot to talk about."
            : "Kalau Anda menginginkan presisi di setiap baris kode dan di setiap keputusan arsitektur, kita mungkin punya banyak hal untuk dibicarakan.")
        }
        ctaLabel={locale === "en" ? "Start a Conversation" : "Mulai Percakapan"}
        ctaHref="/contact"
      />
    </>
  );
}
