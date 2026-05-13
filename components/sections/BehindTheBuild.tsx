import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { type LocalizedField, localize } from "@/lib/i18n/localize";
import type { Locale } from "@/lib/i18n/routing";
import { Link } from "@/lib/i18n/routing";
import { formatDate } from "@/lib/utils";

type RelatedPost = {
  _id: string;
  title: LocalizedField;
  slug: { current: string };
  slugEn: { current: string } | null;
  excerpt: LocalizedField;
  publishedAt: string;
};

type Props = { heading: string; intro: string; posts: RelatedPost[]; locale: Locale };

export function BehindTheBuild({ heading, intro, posts, locale }: Props) {
  if (posts.length === 0) return null;

  return (
    <Section spacing="lg" className="bg-[var(--color-bg-sunken)]">
      <Container size="page">
        <div className="max-w-2xl mb-12">
          <p className="label-mono mb-4">Behind the Build</p>
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
                className="group flex flex-col bg-[var(--color-bg)] p-8 transition-colors hover:bg-[var(--color-bg-raised)]"
              >
                <time
                  className="font-mono text-xs uppercase tracking-wider text-[var(--color-fg-muted)]"
                  dateTime={post.publishedAt}
                >
                  {formatDate(post.publishedAt, locale)}
                </time>
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
      </Container>
    </Section>
  );
}
