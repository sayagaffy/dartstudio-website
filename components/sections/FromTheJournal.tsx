import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { type LocalizedField, localize } from "@/lib/i18n/localize";
import type { Locale } from "@/lib/i18n/routing";
import { Link } from "@/lib/i18n/routing";
import { formatDate } from "@/lib/utils";

export type JournalCard = {
  _id: string;
  title: LocalizedField;
  slug: { current: string };
  slugEn: { current: string } | null;
  excerpt: LocalizedField;
  publishedAt: string;
  category: { _id: string; title: LocalizedField; slug: { current: string } } | null;
  author: { _id: string; name: string } | null;
};

type Props = {
  heading: string;
  intro: string;
  posts: JournalCard[];
  viewAllLabel: string;
  locale: Locale;
};

export function FromTheJournal({ heading, intro, posts, viewAllLabel, locale }: Props) {
  if (posts.length === 0) return null;

  return (
    <Section spacing="lg">
      <Container size="page">
        <div className="max-w-2xl mb-12">
          <p className="label-mono mb-4">Journal</p>
          <Heading level={2} size="display-md">
            {heading}
          </Heading>
          <p className="mt-4 text-lg text-[var(--color-fg-muted)]">{intro}</p>
        </div>
        <div className="grid gap-px bg-[var(--color-border)] md:grid-cols-3">
          {posts.map((post) => {
            const slug =
              locale === "en" && post.slugEn?.current ? post.slugEn.current : post.slug.current;
            return (
              <Link
                key={post._id}
                href={`/journal/${slug}`}
                className="group flex flex-col bg-[var(--color-bg)] p-8 transition-colors hover:bg-[var(--color-bg-sunken)]"
              >
                <div className="flex flex-wrap items-center gap-2 font-mono text-xs uppercase tracking-wider text-[var(--color-fg-muted)]">
                  {post.category && <span>{localize(post.category.title, locale)}</span>}
                  <span>·</span>
                  <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, locale)}</time>
                </div>
                <h3 className="mt-4 font-serif text-xl leading-tight text-[var(--color-fg)]">
                  {localize(post.title, locale)}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-fg-muted)]">
                  {localize(post.excerpt, locale)}
                </p>
                <p className="mt-auto pt-6 font-mono text-xs uppercase tracking-wider text-[var(--color-fg-muted)] group-hover:text-[var(--color-accent)] transition-colors">
                  Read →
                </p>
              </Link>
            );
          })}
        </div>
        <div className="mt-12">
          <Link
            href="/journal"
            className="font-mono text-sm uppercase tracking-wider text-[var(--color-fg)] underline underline-offset-4 hover:text-[var(--color-accent)] transition-colors"
          >
            {viewAllLabel} →
          </Link>
        </div>
      </Container>
    </Section>
  );
}
