import { JournalCard } from "@/components/content/JournalCard";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import type { Locale } from "@/lib/i18n/routing";

type Props = {
  heading: string;
  posts: Parameters<typeof JournalCard>[0]["post"][];
  locale: Locale;
};

export function RelatedPosts({ heading, posts, locale }: Props) {
  if (posts.length === 0) return null;

  return (
    <Section spacing="lg" className="bg-[var(--color-bg-sunken)]">
      <Container size="default">
        <p className="label-mono mb-4">Related</p>
        <Heading level={2} size="display-sm">
          {heading}
        </Heading>
        <div className="mt-8">
          {posts.map((post) => (
            <JournalCard key={post._id} post={post} locale={locale} />
          ))}
        </div>
      </Container>
    </Section>
  );
}
