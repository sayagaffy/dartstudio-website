import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { type LocalizedField, localize } from "@/lib/i18n/localize";
import type { Locale } from "@/lib/i18n/routing";
import { Link } from "@/lib/i18n/routing";

type Principle = { title: LocalizedField; body: LocalizedField };

type Props = {
  heading: string;
  intro: string;
  principles: Principle[];
  readAllLabel: string;
  locale: Locale;
};

export function PrinciplesPreview({ heading, intro, principles, readAllLabel, locale }: Props) {
  const featured = principles.slice(0, 4);
  if (featured.length === 0) return null;

  return (
    <Section spacing="lg" className="bg-[var(--color-bg-sunken)]">
      <Container size="page">
        <div className="max-w-2xl mb-12">
          <p className="label-mono mb-4">Principles</p>
          <Heading level={2} size="display-md">
            {heading}
          </Heading>
          <p className="mt-4 text-lg text-[var(--color-fg-muted)]">{intro}</p>
        </div>
        <div className="grid gap-12 md:grid-cols-2">
          {featured.map((principle, index) => (
            <div key={localize(principle.title, locale) ?? `principle-${index}`}>
              <p className="font-mono text-xs uppercase tracking-wider text-[var(--color-fg-muted)]">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-3 font-serif text-2xl text-[var(--color-fg)]">
                {localize(principle.title, locale)}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-[var(--color-fg-muted)]">
                {localize(principle.body, locale)}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-12">
          <Link
            href="/studio/principles"
            className="font-mono text-sm uppercase tracking-wider text-[var(--color-fg)] underline underline-offset-4 hover:text-[var(--color-accent)] transition-colors"
          >
            {readAllLabel} →
          </Link>
        </div>
      </Container>
    </Section>
  );
}
