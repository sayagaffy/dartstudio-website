import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { type LocalizedField, localize } from "@/lib/i18n/localize";
import type { Locale } from "@/lib/i18n/routing";
import { Link } from "@/lib/i18n/routing";

type Model = {
  _id: string;
  modelKey: string;
  name: LocalizedField;
  shortDescriptor: LocalizedField | null;
};

type Props = {
  heading: string;
  intro: string;
  models: Model[];
  learnMoreLabel: string;
  locale: Locale;
};

export function ThreeWaysToCollaborate({ heading, intro, models, learnMoreLabel, locale }: Props) {
  return (
    <Section spacing="lg" className="bg-[var(--color-bg-sunken)]">
      <Container size="page">
        <div className="max-w-2xl mb-12">
          <p className="label-mono mb-4">Collaborate</p>
          <Heading level={2} size="display-md">
            {heading}
          </Heading>
          <p className="mt-4 text-lg text-[var(--color-fg-muted)]">{intro}</p>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {models.map((model) => (
            <Link
              key={model._id}
              href={`/collaborate/${model.modelKey}`}
              className="group block border border-[var(--color-border)] bg-[var(--color-bg)] p-8 transition-colors hover:border-[var(--color-fg)]"
            >
              <p className="font-mono text-xs uppercase tracking-wider text-[var(--color-fg-muted)]">
                {model.modelKey.replace(/-/g, " ")}
              </p>
              <h3 className="mt-4 font-serif text-2xl text-[var(--color-fg)]">
                {localize(model.name, locale)}
              </h3>
              {model.shortDescriptor && (
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-fg-muted)]">
                  {localize(model.shortDescriptor, locale)}
                </p>
              )}
              <p className="mt-8 font-mono text-xs uppercase tracking-wider text-[var(--color-fg-muted)] group-hover:text-[var(--color-accent)] transition-colors">
                {learnMoreLabel} →
              </p>
            </Link>
          ))}
        </div>
      </Container>
    </Section>
  );
}
