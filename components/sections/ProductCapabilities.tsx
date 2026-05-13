import { PortableText } from "@/components/content/PortableText";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { SanityImage as Img } from "@/components/ui/SanityImage";
import { Section } from "@/components/ui/Section";
import { type LocalizedField, localize } from "@/lib/i18n/localize";
import type { Locale } from "@/lib/i18n/routing";
import type { R2Image } from "@/lib/types/r2Image";

type Capability = {
  heading: LocalizedField;
  body: { id: unknown; en: unknown };
  image?: R2Image;
};

type Props = {
  heading: string;
  intro: string;
  capabilities: Capability[];
  locale: Locale;
};

export function ProductCapabilities({ heading, intro, capabilities, locale }: Props) {
  if (capabilities.length === 0) return null;

  return (
    <Section spacing="lg">
      <Container size="page">
        <div className="max-w-2xl mb-12">
          <p className="label-mono mb-4">Capabilities</p>
          <Heading level={2} size="display-md">
            {heading}
          </Heading>
          <p className="mt-4 text-lg text-[var(--color-fg-muted)]">{intro}</p>
        </div>
        <div className="space-y-20">
          {capabilities.map((capability, index) => {
            const capHeading = localize(capability.heading, locale);
            const capBody = locale === "en" ? capability.body.en : capability.body.id;
            const reverse = index % 2 === 1;
            return (
              <div
                key={capHeading ?? `cap-${index}`}
                className={`grid gap-8 md:grid-cols-2 md:items-center ${reverse ? "md:[&>*:first-child]:order-2" : ""}`}
              >
                <div>
                  <p className="font-mono text-xs uppercase tracking-wider text-[var(--color-accent)]">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-3 font-serif text-2xl text-[var(--color-fg)]">{capHeading}</h3>
                  <div className="mt-4 text-[var(--color-fg-muted)]">
                    <PortableText value={(capBody as unknown[]) ?? []} />
                  </div>
                </div>
                {capability.image?.url && (
                  <div className="aspect-[4/3] overflow-hidden bg-[var(--color-bg-raised)]">
                    <Img
                      src={capability.image.url}
                      alt={capHeading ?? ""}
                      width={800}
                      height={600}
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
