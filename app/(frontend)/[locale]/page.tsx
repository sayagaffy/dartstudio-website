import { getTranslations, setRequestLocale } from "next-intl/server";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

type Props = { params: Promise<{ locale: string }> };

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("home");
  const tCommon = await getTranslations("common");

  return (
    <Section spacing="lg">
      <Container size="page">
        <p className="label-mono text-[var(--color-accent)]">— {tCommon("siteName")}</p>
        <Heading level={1} size="display" className="mt-6 max-w-3xl">
          {tCommon("tagline")}
        </Heading>
        <p className="mt-6 text-[length:var(--text-lead)] text-[var(--color-fg-muted)] font-serif max-w-2xl leading-[1.55]">
          {t("placeholder")}
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Button href="/collaborate" variant="primary">
            {locale === "id" ? "Mulai Percakapan" : "Start a Conversation"}
          </Button>
          <Button href="/journal" variant="secondary">
            {locale === "id" ? "Baca Journal" : "Read the Journal"}
          </Button>
        </div>
      </Container>
    </Section>
  );
}
