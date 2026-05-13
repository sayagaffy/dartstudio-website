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
    title: locale === "en" ? "Privacy — Dartstudio" : "Privasi — Dartstudio",
    description:
      locale === "en"
        ? "How Dartstudio handles personal data."
        : "Bagaimana Dartstudio mengelola data pribadi.",
    path: "/privacy",
    locale,
  });
}

export default async function PrivacyPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Privacy" }]} />
      <Section spacing="lg">
        <Container size="default">
          <Heading level={1} size="display-lg">
            {locale === "en" ? "Privacy Policy" : "Kebijakan Privasi"}
          </Heading>
          <p className="mt-6 text-lg leading-relaxed text-[var(--color-fg-muted)]">
            {locale === "en"
              ? "Placeholder. Final privacy policy will be added before public launch."
              : "Placeholder. Kebijakan privasi final akan ditambahkan sebelum launch publik."}
          </p>
        </Container>
      </Section>
    </>
  );
}
