import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Hero } from "@/components/sections/Hero";
import { TheProblem } from "@/components/sections/TheProblem";
import { ThreeWaysToCollaborate } from "@/components/sections/ThreeWaysToCollaborate";
import { type LocalizedField, localize } from "@/lib/i18n/localize";
import type { Locale } from "@/lib/i18n/routing";
import { buildMetadata } from "@/lib/seo/metadata";
import { sanityFetch } from "@/sanity/lib/fetch";
import { COLLABORATE_MODELS_QUERY, PAGE_QUERY } from "@/sanity/lib/queries";

type Props = { params: Promise<{ locale: Locale }> };

type CollaborateModelCard = {
  _id: string;
  modelKey: string;
  name: LocalizedField;
  shortDescriptor: LocalizedField | null;
};
type PageData = {
  heroHeading: LocalizedField | null;
  heroSubheading: LocalizedField | null;
  sections: Array<{ sectionType: string; heading: LocalizedField | null; body: unknown }> | null;
  seo: { title: LocalizedField | null; description: LocalizedField | null } | null;
} | null;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const data = await sanityFetch<PageData>({
    query: PAGE_QUERY,
    params: { pageKey: "collaborate" },
    tags: ["page", "page:collaborate"],
  });

  return buildMetadata({
    title: localize(data?.seo?.title, locale) ?? "Collaborate — Dartstudio",
    description:
      localize(data?.seo?.description, locale) ??
      "Tiga model kolaborasi: Technology Partner, Architecture Consultant, Strategic Investor.",
    path: "/collaborate",
    locale,
  });
}

export default async function CollaboratePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [pageData, models] = await Promise.all([
    sanityFetch<PageData>({
      query: PAGE_QUERY,
      params: { pageKey: "collaborate" },
      tags: ["page", "page:collaborate"],
    }),
    sanityFetch<CollaborateModelCard[]>({
      query: COLLABORATE_MODELS_QUERY,
      tags: ["collaborateModel"],
    }),
  ]);

  const sectionByType = (type: string) => pageData?.sections?.find((s) => s.sectionType === type);
  const theProblemSection = sectionByType("the-problem");
  const finalCtaSection = sectionByType("final-cta");

  return (
    <>
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Collaborate" }]} />

      <Hero
        heading={
          localize(pageData?.heroHeading, locale) ??
          (locale === "en"
            ? "Three ways to work with us. If the vision fits."
            : "Tiga cara bekerja dengan kami. Kalau visinya cocok.")
        }
        subheading={localize(pageData?.heroSubheading, locale) ?? undefined}
      />

      {theProblemSection && (
        <TheProblem
          heading={
            localize(theProblemSection.heading, locale) ??
            (locale === "en"
              ? "The real cost of unmaintainable code."
              : "Biaya sebenarnya dari kode yang tidak terpelihara.")
          }
          body={localize(theProblemSection.body as LocalizedField<unknown[]>, locale) ?? []}
        />
      )}

      <ThreeWaysToCollaborate
        heading={
          locale === "en"
            ? "Which is closest to your situation?"
            : "Mana yang paling mendekati situasi Anda?"
        }
        intro={
          locale === "en"
            ? "Each model is designed for a specific business situation. Pick what resonates."
            : "Setiap model di bawah dirancang untuk situasi bisnis yang spesifik. Pilih yang paling resonate."
        }
        models={models}
        learnMoreLabel={locale === "en" ? "Learn more" : "Pelajari"}
        locale={locale}
      />

      <FinalCTA
        heading={
          localize(finalCtaSection?.heading, locale) ??
          (locale === "en" ? "Already know what you need?" : "Sudah tahu yang Anda butuhkan?")
        }
        body={
          localize(finalCtaSection?.body as LocalizedField<unknown[]>, locale) ??
          (locale === "en"
            ? "Or if you prefer to talk directly, we're open to a 30-minute discovery call — free, no commitment."
            : "Atau, kalau Anda lebih suka langsung bicara, kami terbuka untuk diskusi awal 30 menit — gratis, tanpa kewajiban.")
        }
        ctaLabel={locale === "en" ? "Start a Conversation" : "Mulai Percakapan"}
        ctaHref="/contact"
      />
    </>
  );
}
