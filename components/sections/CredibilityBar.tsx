import { PortableText } from "@/components/content/PortableText";
import { Container } from "@/components/ui/Container";
import { Prose } from "@/components/ui/Prose";
import { Section } from "@/components/ui/Section";

type Props = { heading: string; body: unknown[]; industries?: string[] };

export function CredibilityBar({ heading, body, industries }: Props) {
  return (
    <Section
      spacing="md"
      className="border-y border-[var(--color-border)] bg-[var(--color-bg-sunken)]"
    >
      <Container size="page">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <p className="label-mono mb-3">Context</p>
            <h2 className="font-serif text-2xl text-[var(--color-fg)]">{heading}</h2>
          </div>
          <div className="md:col-span-2">
            <Prose>
              <PortableText value={body ?? []} />
            </Prose>
            {industries && industries.length > 0 && (
              <p className="mt-4 font-mono text-xs uppercase tracking-wider text-[var(--color-fg-muted)]">
                {industries.join(" · ")}
              </p>
            )}
          </div>
        </div>
      </Container>
    </Section>
  );
}
