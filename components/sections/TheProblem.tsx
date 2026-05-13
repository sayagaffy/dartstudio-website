import { PortableText } from "@/components/content/PortableText";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Prose } from "@/components/ui/Prose";
import { Section } from "@/components/ui/Section";

type Props = { heading: string; body: unknown[] };

export function TheProblem({ heading, body }: Props) {
  return (
    <Section spacing="lg" className="bg-[var(--color-bg-sunken)]">
      <Container size="default">
        <p className="label-mono mb-6">The Problem</p>
        <Heading level={2} size="display-md">
          {heading}
        </Heading>
        <Prose className="mt-8">
          <PortableText value={body ?? []} />
        </Prose>
      </Container>
    </Section>
  );
}
