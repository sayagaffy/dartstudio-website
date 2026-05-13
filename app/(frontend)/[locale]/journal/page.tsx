import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { JournalCard } from "@/components/content/JournalCard";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { type LocalizedField, localize } from "@/lib/i18n/localize";
import type { Locale } from "@/lib/i18n/routing";
import { Link } from "@/lib/i18n/routing";
import { buildMetadata } from "@/lib/seo/metadata";
import { sanityFetch } from "@/sanity/lib/fetch";
import { JOURNAL_CATEGORIES_QUERY, JOURNAL_POSTS_QUERY, PAGE_QUERY } from "@/sanity/lib/queries";

type Props = { params: Promise<{ locale: Locale }> };
type Post = Parameters<typeof JournalCard>[0]["post"];
type Category = {
  _id: string;
  title: LocalizedField;
  slug: { current: string };
  postCount: number;
};
type PageData = {
  heroHeading: LocalizedField | null;
  heroSubheading: LocalizedField | null;
  seo: { title: LocalizedField | null; description: LocalizedField | null } | null;
} | null;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const data = await sanityFetch<PageData>({
    query: PAGE_QUERY,
    params: { pageKey: "journal" },
    tags: ["page", "page:journal"],
  });

  return buildMetadata({
    title: localize(data?.seo?.title, locale) ?? "Journal — Dartstudio",
    description:
      localize(data?.seo?.description, locale) ??
      (locale === "en"
        ? "Notes on systems that last, and systems that don't."
        : "Catatan tentang sistem yang bertahan, dan yang tidak."),
    path: "/journal",
    locale,
  });
}

export default async function JournalPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const [pageData, posts, categories] = await Promise.all([
    sanityFetch<PageData>({
      query: PAGE_QUERY,
      params: { pageKey: "journal" },
      tags: ["page", "page:journal"],
    }),
    sanityFetch<Post[]>({ query: JOURNAL_POSTS_QUERY, tags: ["journalPost"] }),
    sanityFetch<Category[]>({ query: JOURNAL_CATEGORIES_QUERY, tags: ["journalCategory"] }),
  ]);

  const featuredPost = posts[0] ?? null;
  const otherPosts = posts.slice(1);

  return (
    <>
      <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "Journal" }]} />

      <Section spacing="lg">
        <Container size="page">
          <p className="label-mono mb-6">Journal</p>
          <Heading level={1} size="display-xl">
            {localize(pageData?.heroHeading, locale) ??
              (locale === "en" ? "Notes from the studio." : "Catatan dari studio.")}
          </Heading>
          {pageData?.heroSubheading && (
            <p className="mt-6 max-w-2xl font-serif text-xl leading-relaxed text-[var(--color-fg-muted)]">
              {localize(pageData.heroSubheading, locale)}
            </p>
          )}
        </Container>
      </Section>

      {categories.length > 0 && (
        <Section spacing="sm" className="border-y border-[var(--color-border)]">
          <Container size="page">
            <div className="flex flex-wrap items-center gap-6">
              <p className="label-mono">Categories</p>
              {categories.map((cat) => (
                <Link
                  key={cat._id}
                  href={`/journal/category/${cat.slug.current}`}
                  className="font-mono text-sm text-[var(--color-fg-muted)] hover:text-[var(--color-accent)] transition-colors"
                >
                  {localize(cat.title, locale)}
                  <span className="ml-1 text-xs text-[var(--color-fg-subtle)]">
                    ({cat.postCount})
                  </span>
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      )}

      <Section spacing="md">
        <Container size="default">
          {posts.length === 0 ? (
            <p className="text-lg text-[var(--color-fg-muted)]">
              {locale === "en"
                ? "No posts yet. The first one is being written."
                : "Belum ada catatan. Yang pertama sedang ditulis."}
            </p>
          ) : (
            <>
              {featuredPost && <JournalCard post={featuredPost} locale={locale} featured />}
              {otherPosts.map((post) => (
                <JournalCard key={post._id} post={post} locale={locale} />
              ))}
            </>
          )}
        </Container>
      </Section>
    </>
  );
}
