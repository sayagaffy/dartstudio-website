import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import type { Locale } from "@/lib/i18n/routing";
import { buildMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ locale: Locale }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildMetadata({
    title: locale === "en" ? "Terms — Dartstudio" : "Ketentuan — Dartstudio",
    description:
      locale === "en" ? "Terms of service for Dartstudio." : "Ketentuan layanan Dartstudio.",
    path: "/terms",
    locale,
  });
}

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Terms" }]} />
      <Section spacing="lg">
        <Container size="default">
          <Heading level={1} size="display-lg">
            {locale === "en" ? "Terms of Service" : "Ketentuan Layanan"}
          </Heading>
          <p className="mt-6 text-lg leading-relaxed text-[var(--color-fg-muted)]">
            {locale === "en"
              ? "Placeholder. Final terms will be added before public launch."
              : "Placeholder. Ketentuan final akan ditambahkan sebelum launch publik."}
          </p>
        </Container>
      </Section>
    </>
  );
}
