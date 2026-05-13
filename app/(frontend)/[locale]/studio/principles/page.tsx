import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { FinalCTA } from "@/components/sections/FinalCTA";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { type LocalizedField, localize } from "@/lib/i18n/localize";
import type { Locale } from "@/lib/i18n/routing";
import { buildMetadata } from "@/lib/seo/metadata";
import { sanityFetch } from "@/sanity/lib/fetch";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";

type Props = { params: Promise<{ locale: Locale }> };
type SiteSettings = {
  principles: Array<{ title: LocalizedField; body: LocalizedField }> | null;
} | null;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    title: locale === "en" ? "Principles — Dartstudio" : "Prinsip — Dartstudio",
    description:
      locale === "en"
        ? "The principles we hold as standards — not aspirations."
        : "Prinsip yang kami pegang sebagai standar — bukan aspirasi.",
    path: "/studio/principles",
    locale,
  });
}

export default async function PrinciplesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const settings = await sanityFetch<SiteSettings>({
    query: SITE_SETTINGS_QUERY,
    tags: ["siteSettings"],
  });
  const principles = settings?.principles ?? [];

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Studio", href: "/studio" },
          { label: locale === "en" ? "Principles" : "Prinsip" },
        ]}
      />

      <Section spacing="lg">
        <Container size="page">
          <p className="label-mono mb-6">Principles</p>
          <Heading level={1} size="display-xl">
            {locale === "en" ? "What we hold." : "Yang kami pegang."}
          </Heading>
          <p className="mt-6 max-w-2xl font-serif text-xl leading-relaxed text-[var(--color-fg-muted)]">
            {locale === "en"
              ? "Standards, not aspirations. Surfacing when code is written and when technical decisions are made."
              : "Bukan aspirasi, bukan jargon dinding. Yang muncul saat kode ditulis dan saat keputusan teknis diambil."}
          </p>
        </Container>
      </Section>

      <Section spacing="lg">
        <Container size="default">
          <div className="divide-y divide-[var(--color-border)]">
            {principles.map((principle, index) => (
              <article
                key={localize(principle.title, locale) ?? `p-${index}`}
                className="py-12 first:pt-0 last:pb-0"
              >
                <p className="font-mono text-xs uppercase tracking-wider text-[var(--color-accent)]">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h2 className="mt-3 font-serif text-3xl text-[var(--color-fg)]">
                  {localize(principle.title, locale)}
                </h2>
                <p className="mt-4 max-w-prose text-lg leading-relaxed text-[var(--color-fg-muted)]">
                  {localize(principle.body, locale)}
                </p>
              </article>
            ))}
          </div>
        </Container>
      </Section>

      <FinalCTA
        heading={locale === "en" ? "If these standards resonate—" : "Kalau standar ini resonate—"}
        body={
          locale === "en"
            ? "—you might want to see how we collaborate with partners outside the studio."
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
