import { PortableText } from "@/components/content/PortableText";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { type LocalizedField, localize } from "@/lib/i18n/localize";
import type { Locale } from "@/lib/i18n/routing";

export type FAQItem = {
  _id: string;
  question: LocalizedField;
  answer: { id: unknown; en: unknown };
  topic: string | null;
};

type Props = { heading: string; items: FAQItem[]; locale: Locale };

export function FAQ({ heading, items, locale }: Props) {
  if (items.length === 0) return null;

  return (
    <Section spacing="lg">
      <Container size="default">
        <p className="label-mono mb-4">FAQ</p>
        <Heading level={2} size="display-md">
          {heading}
        </Heading>
        <div className="mt-12 divide-y divide-[var(--color-border)]">
          {items.map((item) => {
            const answerBlocks = locale === "en" ? item.answer.en : item.answer.id;
            return (
              <details key={item._id} className="group py-6">
                <summary className="flex cursor-pointer items-start justify-between gap-4 font-serif text-xl text-[var(--color-fg)] list-none [&::-webkit-details-marker]:hidden">
                  <span>{localize(item.question, locale)}</span>
                  <span
                    aria-hidden
                    className="mt-1 font-mono text-sm text-[var(--color-fg-muted)] transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <div className="mt-4 max-w-prose text-[var(--color-fg-muted)]">
                  <PortableText value={(answerBlocks as unknown[]) ?? []} />
                </div>
              </details>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
