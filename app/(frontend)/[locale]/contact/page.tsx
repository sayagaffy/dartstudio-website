import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ContactForm } from "@/components/forms/ContactForm";
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
    title:
      locale === "en"
        ? "Contact — Start a Conversation | Dartstudio"
        : "Kontak — Mulai Percakapan dengan Dartstudio",
    description:
      locale === "en"
        ? "Contact form with pre-qualification. We respond to qualified inquiries in 2-3 business days, with honest answers — including 'not a fit' when relevant."
        : 'Form kontak Dartstudio dengan pre-qualification. Kami merespon inquiry qualified dalam 2-3 hari kerja, dengan jawaban jujur — termasuk "tidak fit" kalau memang bukan partner yang tepat.',
    path: "/contact",
    locale,
  });
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("contact.page");

  return (
    <>
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Contact" }]} />

      <Section spacing="lg">
        <Container size="page">
          <p className="label-mono mb-6">Contact</p>
          <Heading level={1} size="display-xl">
            {t("title")}
          </Heading>
          <p className="mt-6 max-w-2xl font-serif text-xl leading-relaxed text-[var(--color-fg-muted)]">
            {t("subtitle")}
          </p>
        </Container>
      </Section>

      <Section spacing="md" className="bg-[var(--color-bg-raised)]">
        <Container size="default">
          <p className="label-mono mb-4">{t("preQualification.heading")}</p>
          <p className="mb-6 text-base text-[var(--color-fg-muted)]">
            {t("preQualification.intro")}
          </p>
          <ul className="space-y-4">
            {(t.raw("preQualification.items") as string[]).map((item) => (
              <li
                key={item.slice(0, 40)}
                className="border-l-2 border-[var(--color-accent)] pl-4 text-base leading-relaxed text-[var(--color-fg-muted)]"
              >
                {item}
              </li>
            ))}
          </ul>
        </Container>
      </Section>

      <Section spacing="md">
        <Container size="read">
          <ContactForm />
        </Container>
      </Section>

      <Section spacing="md" className="border-y border-[var(--color-border)]">
        <Container size="default">
          <div className="grid gap-12 md:grid-cols-2">
            <div>
              <p className="label-mono mb-3">{t("alternative.heading")}</p>
              <p className="text-base leading-relaxed text-[var(--color-fg-muted)]">
                {t("alternative.body")}
              </p>
            </div>
            <div>
              <p className="label-mono mb-3">{t("responseTime.heading")}</p>
              <dl className="space-y-4">
                {(t.raw("responseTime.items") as { label: string; body: string }[]).map((item) => (
                  <div key={item.label}>
                    <dt className="font-mono text-xs uppercase tracking-wider text-[var(--color-fg-subtle)]">
                      {item.label}
                    </dt>
                    <dd className="mt-1 text-sm text-[var(--color-fg-muted)]">{item.body}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
