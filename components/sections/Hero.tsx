import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";

type CTA = { label: string; href: string; variant?: "primary" | "secondary" };

type Props = {
  eyebrow?: string;
  heading: string;
  subheading?: string;
  ctaPrimary?: CTA | null;
  ctaSecondary?: CTA | null;
  size?: "default" | "compact";
};

export function Hero({
  eyebrow,
  heading,
  subheading,
  ctaPrimary,
  ctaSecondary,
  size = "default",
}: Props) {
  return (
    <Section spacing={size === "compact" ? "md" : "lg"}>
      <Container size="page">
        <div className="max-w-4xl">
          {eyebrow && <p className="label-mono mb-6">{eyebrow}</p>}
          <Heading level={1} size={size === "compact" ? "display-lg" : "display-xl"}>
            {heading}
          </Heading>
          {subheading && (
            <p className="mt-6 max-w-2xl font-serif text-xl leading-relaxed text-[var(--color-fg-muted)]">
              {subheading}
            </p>
          )}
          {(ctaPrimary || ctaSecondary) && (
            <div className="mt-10 flex flex-wrap gap-4">
              {ctaPrimary && (
                <Button href={ctaPrimary.href} variant={ctaPrimary.variant ?? "primary"} size="lg">
                  {ctaPrimary.label}
                </Button>
              )}
              {ctaSecondary && (
                <Button
                  href={ctaSecondary.href}
                  variant={ctaSecondary.variant ?? "secondary"}
                  size="lg"
                >
                  {ctaSecondary.label}
                </Button>
              )}
            </div>
          )}
        </div>
      </Container>
    </Section>
  );
}
