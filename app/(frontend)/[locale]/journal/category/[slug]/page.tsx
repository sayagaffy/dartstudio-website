import groq from "groq";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { JournalCard } from "@/components/content/JournalCard";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { type LocalizedField, localize } from "@/lib/i18n/localize";
import type { Locale } from "@/lib/i18n/routing";
import { buildMetadata } from "@/lib/seo/metadata";
import { sanityFetch } from "@/sanity/lib/fetch";
import { JOURNAL_CATEGORIES_QUERY, JOURNAL_POSTS_BY_CATEGORY_QUERY } from "@/sanity/lib/queries";

type Props = { params: Promise<{ locale: Locale; slug: string }> };

const CATEGORY_QUERY = groq`*[_type == "journalCategory" && slug.current == $slug][0] { _id, title, slug, description }`;

type Category = {
  _id: string;
  title: LocalizedField;
  slug: { current: string };
  description: LocalizedField | null;
} | null;
type Post = Parameters<typeof JournalCard>[0]["post"];

export async function generateStaticParams() {
  const categories = await sanityFetch<Array<{ slug: { current: string } }>>({
    query: JOURNAL_CATEGORIES_QUERY,
    tags: ["journalCategory"],
  });
  return categories.map((c) => ({ slug: c.slug.current }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const category = await sanityFetch<Category>({
    query: CATEGORY_QUERY,
    params: { slug },
    tags: ["journalCategory", `journalCategory:${slug}`],
  });

  if (!category)
    return buildMetadata({
      title: "Not Found — Dartstudio",
      description: "",
      path: `/journal/category/${slug}`,
      locale,
      noIndex: true,
    });

  return buildMetadata({
    title: `${localize(category.title, locale)} — Journal — Dartstudio`,
    description:
      localize(category.description, locale) ??
      `${localize(category.title, locale)} posts on Dartstudio Journal.`,
    path: `/journal/category/${slug}`,
    locale,
  });
}

export default async function JournalCategoryPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const [category, posts] = await Promise.all([
    sanityFetch<Category>({
      query: CATEGORY_QUERY,
      params: { slug },
      tags: ["journalCategory", `journalCategory:${slug}`],
    }),
    sanityFetch<Post[]>({
      query: JOURNAL_POSTS_BY_CATEGORY_QUERY,
      params: { categorySlug: slug },
      tags: ["journalPost", `journalCategory:${slug}`],
    }),
  ]);

  if (!category) notFound();

  return (
    <>
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Journal", href: "/journal" },
          { label: localize(category.title, locale) ?? "" },
        ]}
      />

      <Section spacing="lg">
        <Container size="page">
          <p className="label-mono mb-6">Category</p>
          <Heading level={1} size="display-xl">
            {localize(category.title, locale)}
          </Heading>
          {category.description && (
            <p className="mt-6 max-w-2xl font-serif text-xl leading-relaxed text-[var(--color-fg-muted)]">
              {localize(category.description, locale)}
            </p>
          )}
          <p className="mt-6 font-mono text-sm uppercase tracking-wider text-[var(--color-fg-muted)]">
            {posts.length} {locale === "en" ? "posts" : "catatan"}
          </p>
        </Container>
      </Section>

      <Section spacing="md">
        <Container size="default">
          {posts.length === 0 ? (
            <p className="text-lg text-[var(--color-fg-muted)]">
              {locale === "en"
                ? "No posts in this category yet."
                : "Belum ada catatan di kategori ini."}
            </p>
          ) : (
            posts.map((post) => <JournalCard key={post._id} post={post} locale={locale} />)
          )}
        </Container>
      </Section>
    </>
  );
}
