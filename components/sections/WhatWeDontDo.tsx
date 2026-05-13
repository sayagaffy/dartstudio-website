import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { type LocalizedField, localize } from "@/lib/i18n/localize";
import type { Locale } from "@/lib/i18n/routing";

type Item = { heading: LocalizedField; body: LocalizedField };

type Props = { heading: string; intro: string; items: Item[]; locale: Locale };

export function WhatWeDontDo({ heading, intro, items, locale }: Props) {
  return (
    <Section spacing="lg" className="bg-[var(--color-bg-sunken)]">
      <Container size="page">
        <div className="max-w-2xl mb-12">
          <p className="label-mono mb-4">Filter</p>
          <Heading level={2} size="display-md">
            {heading}
          </Heading>
          <p className="mt-4 text-lg text-[var(--color-fg-muted)]">{intro}</p>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          {items.map((item, idx) => (
            <div
              key={localize(item.heading, locale) ?? `item-${idx}`}
              className="border-l-2 border-[var(--color-accent)] pl-6"
            >
              <h3 className="font-serif text-xl text-[var(--color-fg)]">
                {localize(item.heading, locale)}
              </h3>
              <p className="mt-2 text-base leading-relaxed text-[var(--color-fg-muted)]">
                {localize(item.body, locale)}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </Section>
  );
}
