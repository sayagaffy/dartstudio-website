import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Image as SanityImage } from "sanity";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { TeamTabs } from "@/components/sections/TeamTabs";
import { Schema } from "@/components/seo/Schema";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import type { LocalizedField } from "@/lib/i18n/localize";
import type { Locale } from "@/lib/i18n/routing";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbSchema } from "@/lib/seo/schema";
import { sanityFetch } from "@/sanity/lib/fetch";
import { PEOPLE_QUERY } from "@/sanity/lib/queries";

type Props = { params: Promise<{ locale: Locale }> };

type Person = {
  _id: string;
  name: string;
  slug: { current: string };
  role: LocalizedField;
  bio: LocalizedField | null;
  photo: SanityImage | null;
  memberGroup?: "protagonist" | "circle";
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    title: locale === "en" ? "Our Team — Dartstudio" : "Tim Kami — Dartstudio",
    description:
      locale === "en"
        ? "Meet the people behind Dartstudio — protagonists and circle members."
        : "Kenali orang-orang di balik Dartstudio — pegiat dan anggota perkumpulan.",
    path: "/studio/people",
    locale,
  });
}

export default async function PeoplePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const people = await sanityFetch<Person[]>({
    query: PEOPLE_QUERY,
    tags: ["person"],
  });

  const protagonists = (people ?? []).filter(
    (p) => !p.memberGroup || p.memberGroup === "protagonist",
  );
  const circle = (people ?? []).filter((p) => p.memberGroup === "circle");

  const breadcrumbSchema = buildBreadcrumbSchema([
    { label: "Home", href: "/" },
    { label: "Studio", href: "/studio" },
    { label: locale === "en" ? "Our Team" : "Tim Kami" },
  ]);

  return (
    <>
      <Schema data={breadcrumbSchema} />

      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Studio", href: "/studio" },
          { label: locale === "en" ? "Our Team" : "Tim Kami" },
        ]}
      />

      <Section spacing="lg">
        <Container size="page">
          <p className="label-mono mb-6">People</p>
          <Heading level={1} size="display-xl">
            {locale === "en" ? "The people behind Dartstudio." : "Yang nyusun Dartstudio."}
          </Heading>
          <p className="mt-6 max-w-2xl font-serif text-xl leading-relaxed text-[var(--color-fg-muted)]">
            {locale === "en"
              ? "Everyone at Dartstudio has their own page, with a publicly visible work history."
              : "Setiap orang di Dartstudio punya halaman sendiri, dengan jejak kerja yang bisa dilihat publik."}
          </p>
        </Container>
      </Section>

      <Section spacing="lg">
        <Container size="page">
          <TeamTabs
            protagonistLabel={locale === "en" ? "Protagonist" : "Pegiat"}
            circleLabel={locale === "en" ? "Circle" : "Anggota Perkumpulan"}
            protagonists={protagonists}
            circle={circle}
            locale={locale}
          />
        </Container>
      </Section>

      <FinalCTA
        heading={
          locale === "en"
            ? "If this way of working sounds familiar—"
            : "Kalau cara kami bekerja ini terdengar familiar—"
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
