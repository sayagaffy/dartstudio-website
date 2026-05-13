import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { Image as SanityImage } from "sanity";
import { AuthorByline } from "@/components/content/AuthorByline";
import { PortableText } from "@/components/content/PortableText";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { RelatedPosts } from "@/components/sections/RelatedPosts";
import { Schema } from "@/components/seo/Schema";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Prose } from "@/components/ui/Prose";
import { Section } from "@/components/ui/Section";
import { env } from "@/lib/env";
import { type LocalizedField, localize } from "@/lib/i18n/localize";
import type { Locale } from "@/lib/i18n/routing";
import { Link } from "@/lib/i18n/routing";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildArticleSchema, buildBreadcrumbSchema } from "@/lib/seo/schema";
import { sanityFetch } from "@/sanity/lib/fetch";
import { urlForImage } from "@/sanity/lib/image";
import { JOURNAL_POST_QUERY, JOURNAL_POSTS_QUERY } from "@/sanity/lib/queries";

type Props = { params: Promise<{ locale: Locale; slug: string }> };

type Post = {
  _id: string;
  title: LocalizedField;
  subtitle: LocalizedField | null;
  slug: { current: string };
  slugEn: { current: string } | null;
  excerpt: LocalizedField;
  body: { id: unknown; en: unknown };
  heroImage: SanityImage | null;
  publishedAt: string;
  updatedAt: string | null;
  category: { _id: string; title: LocalizedField; slug: { current: string } } | null;
  author: {
    _id: string;
    name: string;
    role: LocalizedField;
    photo?: SanityImage | null;
    bio?: LocalizedField | null;
    slug: { current: string };
  } | null;
  relatedPosts: Parameters<typeof RelatedPosts>[0]["posts"];
  seo: { title: LocalizedField | null; description: LocalizedField | null } | null;
} | null;

function extractText(blocks: unknown): string {
  if (!Array.isArray(blocks)) return "";
  return blocks
    .filter(
      (b) =>
        typeof b === "object" &&
        b !== null &&
        "_type" in b &&
        (b as { _type: string })._type === "block",
    )
    .map((b) => {
      const block = b as { children?: Array<{ text?: string }> };
      return (block.children ?? []).map((c) => c.text ?? "").join(" ");
    })
    .join(" ");
}

export async function generateStaticParams() {
  const posts = await sanityFetch<
    Array<{ slug: { current: string }; slugEn: { current: string } | null }>
  >({ query: JOURNAL_POSTS_QUERY, tags: ["journalPost"] });
  const params: { slug: string }[] = [];
  for (const post of posts) {
    if (post.slug?.current) params.push({ slug: post.slug.current });
    if (post.slugEn?.current && post.slugEn.current !== post.slug.current)
      params.push({ slug: post.slugEn.current });
  }
  return params;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await sanityFetch<Post>({
    query: JOURNAL_POST_QUERY,
    params: { slug },
    tags: ["journalPost", `journalPost:${slug}`],
  });

  if (!post)
    return buildMetadata({
      title: "Not Found — Dartstudio",
      description: "",
      path: `/journal/${slug}`,
      locale,
      noIndex: true,
    });

  return buildMetadata({
    title: localize(post.seo?.title, locale) ?? `${localize(post.title, locale)} — Dartstudio`,
    description: localize(post.seo?.description, locale) ?? localize(post.excerpt, locale) ?? "",
    path: `/journal/${slug}`,
    locale,
    type: "article",
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt ?? undefined,
  });
}

export default async function JournalPostPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = await sanityFetch<Post>({
    query: JOURNAL_POST_QUERY,
    params: { slug },
    tags: ["journalPost", `journalPost:${slug}`],
  });
  if (!post) notFound();

  const body = locale === "en" ? post.body.en : post.body.id;
  const bodyText = extractText(body);

  const articleSchema = buildArticleSchema({
    title: localize(post.title, locale) ?? "",
    description: localize(post.excerpt, locale) ?? "",
    slug,
    publishedAt: post.publishedAt,
    updatedAt: post.updatedAt,
    author: {
      name: post.author?.name ?? "Dartstudio",
      url: post.author?.slug?.current
        ? `${env.NEXT_PUBLIC_SITE_URL}${locale === "id" ? "" : "/en"}/studio/people/${post.author.slug.current}`
        : undefined,
    },
    category: post.category ? (localize(post.category.title, locale) ?? undefined) : undefined,
    image: post.heroImage?.asset
      ? urlForImage(post.heroImage).width(1200).height(630).url()
      : `${env.NEXT_PUBLIC_SITE_URL}/api/og?title=${encodeURIComponent(localize(post.title, locale) ?? "")}&locale=${locale}`,
    locale,
  });

  const breadcrumbSchema = buildBreadcrumbSchema([
    { label: "Home", href: "/" },
    { label: "Journal", href: "/journal" },
    { label: localize(post.title, locale) ?? "" },
  ]);

  return (
    <>
      <Schema data={[articleSchema, breadcrumbSchema]} />
      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Journal", href: "/journal" },
          { label: localize(post.title, locale) ?? "" },
        ]}
      />

      <Section spacing="md">
        <Container size="default">
          <article>
            <header>
              {post.category && (
                <Link
                  href={`/journal/category/${post.category.slug.current}`}
                  className="font-mono text-xs uppercase tracking-wider text-[var(--color-accent)] hover:underline"
                >
                  {localize(post.category.title, locale)}
                </Link>
              )}
              <Heading level={1} size="display-xl" className="mt-6">
                {localize(post.title, locale)}
              </Heading>
              {post.subtitle && (
                <p className="mt-4 font-serif italic text-2xl leading-relaxed text-[var(--color-fg-muted)]">
                  {localize(post.subtitle, locale)}
                </p>
              )}
              {post.author && (
                <div className="mt-10 pt-8 border-t border-[var(--color-border)]">
                  <AuthorByline
                    author={post.author}
                    publishedAt={post.publishedAt}
                    bodyText={bodyText}
                    locale={locale}
                  />
                </div>
              )}
            </header>

            {post.heroImage?.asset && (
              <div className="my-12 aspect-[16/9] overflow-hidden bg-[var(--color-bg-raised)]">
                <Image
                  src={urlForImage(post.heroImage).width(1600).height(900).url()}
                  alt=""
                  width={1600}
                  height={900}
                  className="h-full w-full object-cover"
                  priority
                />
              </div>
            )}

            <div className="mt-12">
              <Prose>
                <PortableText value={(body as unknown[]) ?? []} />
              </Prose>
            </div>

            {post.author && (
              <footer className="mt-16 pt-8 border-t border-[var(--color-border)]">
                <p className="label-mono mb-3">About the Author</p>
                <div className="flex items-start gap-4">
                  {post.author.photo?.asset && (
                    <Image
                      src={urlForImage(post.author.photo).width(120).height(120).url()}
                      alt={post.author.name}
                      width={60}
                      height={60}
                      className="rounded-full object-cover"
                    />
                  )}
                  <div>
                    <p className="font-serif text-lg text-[var(--color-fg)]">{post.author.name}</p>
                    {post.author.bio && (
                      <p className="text-sm text-[var(--color-fg-muted)] leading-relaxed">
                        {localize(post.author.bio, locale)}
                      </p>
                    )}
                  </div>
                </div>
              </footer>
            )}
          </article>
        </Container>
      </Section>

      {post.relatedPosts && post.relatedPosts.length > 0 && (
        <RelatedPosts
          heading={locale === "en" ? "Related notes." : "Catatan terkait."}
          posts={post.relatedPosts}
          locale={locale}
        />
      )}

      <Section spacing="md">
        <Container size="default">
          <p className="font-serif italic text-lg text-[var(--color-fg-muted)]">
            {locale === "en"
              ? "If this way of thinking sounds familiar, we might have a conversation worth having → "
              : "Cara berpikir ini terdengar familiar? Mungkin ada percakapan yang menarik untuk kita lakukan → "}
            <Link
              href="/collaborate"
              className="text-[var(--color-accent)] underline underline-offset-4 hover:text-[var(--color-fg)] transition-colors not-italic"
            >
              {locale === "en" ? "see how we work" : "lihat cara kerja kami"}
            </Link>
          </p>
        </Container>
      </Section>
    </>
  );
}
