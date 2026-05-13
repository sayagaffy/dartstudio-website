import Image from "next/image";
import type { Image as SanityImage } from "sanity";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { type LocalizedField, localize } from "@/lib/i18n/localize";
import type { Locale } from "@/lib/i18n/routing";
import { urlForImage } from "@/sanity/lib/image";

type Person = {
  _id: string;
  name: string;
  slug: { current: string };
  role: LocalizedField;
  bio: LocalizedField | null;
  photo: SanityImage | null;
};

type Props = { heading: string; intro: string; people: Person[]; locale: Locale };

export function PeoplePreview({ heading, intro, people, locale }: Props) {
  if (people.length === 0) return null;

  return (
    <Section spacing="lg">
      <Container size="page">
        <div className="max-w-2xl mb-12">
          <p className="label-mono mb-4">People</p>
          <Heading level={2} size="display-md">
            {heading}
          </Heading>
          <p className="mt-4 text-lg text-[var(--color-fg-muted)]">{intro}</p>
        </div>
        <div className="grid gap-12 md:grid-cols-3">
          {people.map((person) => (
            <article key={person._id}>
              {person.photo?.asset && (
                <div className="aspect-square overflow-hidden bg-[var(--color-bg-raised)]">
                  <Image
                    src={urlForImage(person.photo).width(600).height(600).url()}
                    alt={person.name}
                    width={600}
                    height={600}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              <p className="mt-4 font-mono text-xs uppercase tracking-wider text-[var(--color-fg-muted)]">
                {localize(person.role, locale)}
              </p>
              <h3 className="mt-2 font-serif text-xl text-[var(--color-fg)]">{person.name}</h3>
              {person.bio && (
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-fg-muted)]">
                  {localize(person.bio, locale)}
                </p>
              )}
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
