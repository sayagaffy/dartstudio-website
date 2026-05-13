import { PortableText } from "@/components/content/PortableText";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Prose } from "@/components/ui/Prose";
import { Section } from "@/components/ui/Section";

type Props = {
  heading: string;
  body: unknown;
  variant?: "default" | "subtle";
  eyebrow?: string;
};

export function ProductProblemApproach({ heading, body, variant = "default", eyebrow }: Props) {
  return (
    <Section spacing="lg" className={variant === "subtle" ? "bg-[var(--color-bg-sunken)]" : ""}>
      <Container size="default">
        {eyebrow && <p className="label-mono mb-6">{eyebrow}</p>}
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
