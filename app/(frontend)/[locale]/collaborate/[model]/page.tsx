import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { PortableText } from "@/components/content/PortableText";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { FAQ, type FAQItem } from "@/components/sections/FAQ";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Hero } from "@/components/sections/Hero";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Prose } from "@/components/ui/Prose";
import { Section } from "@/components/ui/Section";
import { type LocalizedField, localize } from "@/lib/i18n/localize";
import type { Locale } from "@/lib/i18n/routing";
import { buildMetadata } from "@/lib/seo/metadata";
import { sanityFetch } from "@/sanity/lib/fetch";
import { COLLABORATE_MODEL_QUERY, COLLABORATE_MODELS_QUERY } from "@/sanity/lib/queries";

type Props = { params: Promise<{ locale: Locale; model: string }> };

type ContentSection = {
  heading: LocalizedField | null;
  intro: LocalizedField | null;
  body: { id: unknown; en: unknown } | null;
  sectionType: string;
};

type CollaborateModel = {
  modelKey: string;
  name: LocalizedField;
  heroHeading: LocalizedField;
  heroSubheading: LocalizedField | null;
  ctaPrimary: { label: LocalizedField; href: string } | null;
  ctaSecondary: { label: LocalizedField; href: string } | null;
  sections: ContentSection[] | null;
  faqs: FAQItem[] | null;
  finalCtaHeading: LocalizedField | null;
  finalCtaBody: LocalizedField | null;
  seo: { title: LocalizedField | null; description: LocalizedField | null } | null;
} | null;

export async function generateStaticParams() {
  const models = await sanityFetch<Array<{ modelKey: string }>>({
    query: COLLABORATE_MODELS_QUERY,
    tags: ["collaborateModel"],
  });
  return models.map((m) => ({ model: m.modelKey }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, model } = await params;
  const data = await sanityFetch<CollaborateModel>({
    query: COLLABORATE_MODEL_QUERY,
    params: { modelKey: model },
    tags: ["collaborateModel", `collaborateModel:${model}`],
  });

  if (!data)
    return buildMetadata({
      title: "Not Found — Dartstudio",
      description: "",
      path: `/collaborate/${model}`,
      locale,
      noIndex: true,
    });

  return buildMetadata({
    title: localize(data.seo?.title, locale) ?? `${localize(data.name, locale)} — Dartstudio`,
    description:
      localize(data.seo?.description, locale) ?? localize(data.heroSubheading, locale) ?? "",
    path: `/collaborate/${model}`,
    locale,
  });
}

export default async function CollaborateModelPage({ params }: Props) {
  const { locale, model } = await params;
  setRequestLocale(locale);

  const data = await sanityFetch<CollaborateModel>({
    query: COLLABORATE_MODEL_QUERY,
    params: { modelKey: model },
    tags: ["collaborateModel", `collaborateModel:${model}`],
  });

  if (!data) notFound();

  const ctaPrimary = data.ctaPrimary
    ? { label: localize(data.ctaPrimary.label, locale) ?? "", href: data.ctaPrimary.href }
    : null;
  const ctaSecondary = data.ctaSecondary
    ? { label: localize(data.ctaSecondary.label, locale) ?? "", href: data.ctaSecondary.href }
    : null;

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Collaborate", href: "/collaborate" },
          { label: localize(data.name, locale) ?? "" },
        ]}
      />

      <Hero
        heading={localize(data.heroHeading, locale) ?? ""}
        subheading={localize(data.heroSubheading, locale) ?? undefined}
        ctaPrimary={ctaPrimary}
        ctaSecondary={ctaSecondary}
      />

      {data.sections?.map((section, index) => {
        const heading = localize(section.heading, locale);
        const intro = localize(section.intro, locale);
        const body = locale === "en" ? section.body?.en : section.body?.id;
        return (
          <Section
            spacing="lg"
            key={heading ?? `section-${index}`}
            className={index % 2 === 1 ? "bg-[var(--color-bg-sunken)]" : ""}
          >
            <Container size="default">
              {heading && (
                <Heading level={2} size="display-md" className="mb-6">
                  {heading}
                </Heading>
              )}
              {intro && (
                <p className="mb-8 max-w-prose text-lg leading-relaxed text-[var(--color-fg-muted)]">
                  {intro}
                </p>
              )}
              {body != null && (
                <Prose>
                  <PortableText value={body as unknown[]} />
                </Prose>
              )}
            </Container>
          </Section>
        );
      })}

      <FAQ
        heading={
          locale === "en"
            ? "Questions before we start."
            : "Pertanyaan yang sering muncul sebelum kita mulai."
        }
        items={data.faqs ?? []}
        locale={locale}
      />

      <FinalCTA
        heading={
          localize(data.finalCtaHeading, locale) ??
          (locale === "en" ? "Ready to talk?" : "Siap untuk bicara?")
        }
        body={localize(data.finalCtaBody, locale) ?? ""}
        ctaLabel={locale === "en" ? "Start a Conversation" : "Mulai Percakapan"}
        ctaHref="/contact"
      />
    </>
  );
}
