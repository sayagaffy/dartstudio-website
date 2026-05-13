import { PortableText } from "@/components/content/PortableText";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Prose } from "@/components/ui/Prose";
import { Section } from "@/components/ui/Section";

type Props = { heading: string; body: unknown };

export function HowWeWork({ heading, body }: Props) {
  return (
    <Section spacing="lg" id="how-we-work">
      <Container size="default">
        <p className="label-mono mb-6">How We Work</p>
        <Heading level={2} size="display-md">
          {heading}
        </Heading>
        <Prose className="mt-8">
          <PortableText value={(body as unknown[]) ?? []} />
        </Prose>
      </Container>
    </Section>
  );
}
