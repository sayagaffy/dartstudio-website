import { PortableText } from "@/components/content/PortableText";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Prose } from "@/components/ui/Prose";
import { Section } from "@/components/ui/Section";

type Props = { heading: string; body: string | unknown[]; ctaLabel: string; ctaHref: string };

export function FinalCTA({ heading, body, ctaLabel, ctaHref }: Props) {
  return (
    <Section spacing="xl" className="bg-[var(--color-fg)] text-[var(--color-fg-inverse)]">
      <Container size="default">
        <div className="text-center">
          <Heading level={2} size="display-lg" className="!text-[var(--color-fg-inverse)]">
            {heading}
          </Heading>
          <div
            className="mt-6 max-w-2xl mx-auto text-xl leading-relaxed"
            style={{ color: "rgba(250,250,247,0.7)" }}
          >
            {Array.isArray(body) ? (
              <Prose>
                <PortableText value={body} />
              </Prose>
            ) : (
              <p>{body}</p>
            )}
          </div>
          <div className="mt-10">
            <Button href={ctaHref} size="lg" variant="secondary">
              {ctaLabel}
            </Button>
          </div>
        </div>
      </Container>
    </Section>
  );
}
