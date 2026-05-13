import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Hero } from "@/components/sections/Hero";
import { HowWeWork } from "@/components/sections/HowWeWork";
import { OriginStory } from "@/components/sections/OriginStory";
import { PeoplePreview } from "@/components/sections/PeoplePreview";
import { PrinciplesPreview } from "@/components/sections/PrinciplesPreview";
import { type LocalizedField, localize } from "@/lib/i18n/localize";
import type { Locale } from "@/lib/i18n/routing";
import { buildMetadata } from "@/lib/seo/metadata";
import type { R2Image } from "@/lib/types/r2Image";
import { sanityFetch } from "@/sanity/lib/fetch";
import { PAGE_QUERY, PEOPLE_QUERY, SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";

type Props = { params: Promise<{ locale: Locale }> };

type StudioPageData = {
  heroHeading: LocalizedField | null;
  heroSubheading: LocalizedField | null;
  sections: Array<{ sectionType: string; heading: LocalizedField | null; body: unknown }> | null;
  seo: { title: LocalizedField | null; description: LocalizedField | null } | null;
} | null;

type SiteSettings = {
  principles: Array<{ title: LocalizedField; body: LocalizedField }> | null;
} | null;

type Person = {
  _id: string;
  name: string;
  slug: { current: string };
  role: LocalizedField;
  bio: LocalizedField | null;
  photo: R2Image;
  memberGroup?: "protagonist" | "circle";
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const data = await sanityFetch<StudioPageData>({
    query: PAGE_QUERY,
    params: { pageKey: "studio" },
    tags: ["page", "page:studio"],
  });

  return buildMetadata({
    title: localize(data?.seo?.title, locale) ?? "Studio — Dartstudio",
    description:
      localize(data?.seo?.description, locale) ??
      "Dartstudio adalah studio kecil berisi veteran teknologi.",
    path: "/studio",
    locale,
  });
}

export default async function StudioPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [pageData, settings, people] = await Promise.all([
    sanityFetch<StudioPageData>({
      query: PAGE_QUERY,
      params: { pageKey: "studio" },
      tags: ["page", "page:studio"],
    }),
    sanityFetch<SiteSettings>({ query: SITE_SETTINGS_QUERY, tags: ["siteSettings"] }),
    sanityFetch<Person[]>({ query: PEOPLE_QUERY, tags: ["person"] }),
  ]);

  const sectionByType = (type: string) => pageData?.sections?.find((s) => s.sectionType === type);
  const originSection = sectionByType("origin");
  const whatWeBelieveSection = sectionByType("what-we-believe");
  const howWeWorkSection = sectionByType("how-we-work");

  return (
    <>
      <Hero
        heading={
          localize(pageData?.heroHeading, locale) ??
          (locale === "en"
            ? "Small studio. Standards that aren't."
            : "Studio kecil. Standar yang tidak.")
        }
        subheading={localize(pageData?.heroSubheading, locale) ?? undefined}
      />

      {originSection && (
        <OriginStory
          heading={
            localize(originSection.heading, locale) ??
            (locale === "en" ? "How Dartstudio came to be." : "Bagaimana Dartstudio terbentuk.")
          }
          body={localize(originSection.body as LocalizedField<unknown[]>, locale) ?? []}
        />
      )}

      <PrinciplesPreview
        heading={
          localize(whatWeBelieveSection?.heading, locale) ??
          (locale === "en" ? "What we hold." : "Yang kami pegang.")
        }
        intro={
          locale === "en"
            ? "A few convictions we hold as standards."
            : "Ada beberapa keyakinan yang kami pegang sebagai standar."
        }
        principles={settings?.principles ?? []}
        readAllLabel={locale === "en" ? "Read all our principles" : "Baca semua prinsip kami"}
        locale={locale}
      />

      <PeoplePreview
        heading={locale === "en" ? "The people behind Dartstudio." : "Yang nyusun Dartstudio."}
        intro={
          locale === "en"
            ? "Everyone at Dartstudio has their own page, with a publicly visible work history."
            : "Setiap orang di Dartstudio punya halaman sendiri, dengan jejak kerja yang bisa dilihat publik."
        }
        people={people}
        locale={locale}
        protagonistLabel={locale === "en" ? "Protagonist" : "Pegiat"}
        circleLabel={locale === "en" ? "Circle" : "Anggota Perkumpulan"}
      />

      {howWeWorkSection && (
        <HowWeWork
          heading={
            localize(howWeWorkSection.heading, locale) ??
            (locale === "en" ? "How we work." : "Cara kami bekerja.")
          }
          body={localize(howWeWorkSection.body as LocalizedField<unknown[]>, locale) ?? []}
        />
      )}

      <FinalCTA
        heading={
          locale === "en"
            ? "If this way of thinking sounds familiar—"
            : "Kalau cara kami berpikir ini terdengar familiar—"
        }
        body={
          locale === "en"
            ? "—you might be interested in how we collaborate with outside partners."
            : "—mungkin Anda akan tertarik melihat bagaimana kami berkolaborasi dengan rekan dari luar."
        }
        ctaLabel={
          locale === "en" ? "See three collaboration models" : "Lihat tiga model kolaborasi"
        }
        ctaHref="/collaborate"
      />
    </>
  );
}
