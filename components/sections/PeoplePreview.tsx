import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import type { LocalizedField } from "@/lib/i18n/localize";
import type { Locale } from "@/lib/i18n/routing";
import { type TeamPerson, TeamTabs } from "./TeamTabs";

type Person = TeamPerson & {
  memberGroup?: "protagonist" | "circle";
  role: LocalizedField;
  bio: LocalizedField | null;
};

type Props = {
  heading: string;
  intro: string;
  people: Person[];
  locale: Locale;
  protagonistLabel: string;
  circleLabel: string;
};

export function PeoplePreview({
  heading,
  intro,
  people,
  locale,
  protagonistLabel,
  circleLabel,
}: Props) {
  if (people.length === 0) return null;

  // Default to "protagonist" for any person without a group set
  const protagonists = people.filter((p) => !p.memberGroup || p.memberGroup === "protagonist");
  const circle = people.filter((p) => p.memberGroup === "circle");

  return (
    <Section spacing="lg">
      <Container size="page">
        <div className="max-w-2xl mb-10">
          <p className="label-mono mb-4">People</p>
          <Heading level={2} size="display-md">
            {heading}
          </Heading>
          <p className="mt-4 text-lg text-[var(--color-fg-muted)]">{intro}</p>
        </div>

        <TeamTabs
          protagonistLabel={protagonistLabel}
          circleLabel={circleLabel}
          protagonists={protagonists}
          circle={circle}
          locale={locale}
        />
      </Container>
    </Section>
  );
}
