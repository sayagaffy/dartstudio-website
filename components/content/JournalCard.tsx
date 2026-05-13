import { SanityImage as Img } from "@/components/ui/SanityImage";
import { type LocalizedField, localize } from "@/lib/i18n/localize";
import type { Locale } from "@/lib/i18n/routing";
import { Link } from "@/lib/i18n/routing";
import type { R2Image } from "@/lib/types/r2Image";
import { formatDate } from "@/lib/utils";

type JournalCardData = {
  _id: string;
  title: LocalizedField;
  subtitle?: LocalizedField | null;
  slug: { current: string };
  slugEn: { current: string } | null;
  excerpt: LocalizedField;
  publishedAt: string;
  category: { _id: string; title: LocalizedField; slug: { current: string } } | null;
  author: { _id: string; name: string; photo?: R2Image } | null;
  heroImage?: R2Image;
};

type Props = { post: JournalCardData; locale: Locale; featured?: boolean };

export function JournalCard({ post, locale, featured = false }: Props) {
  const slug = locale === "en" && post.slugEn?.current ? post.slugEn.current : post.slug.current;

  return (
    <Link
      href={`/journal/${slug}`}
      className={`group flex flex-col border-b border-[var(--color-border)] py-8 transition-colors ${featured ? "md:py-12" : ""}`}
    >
      <div className="flex flex-wrap items-center gap-3 font-mono text-xs uppercase tracking-wider text-[var(--color-fg-muted)]">
        {post.category && <span>{localize(post.category.title, locale)}</span>}
        {post.category && <span>·</span>}
        <time dateTime={post.publishedAt}>{formatDate(post.publishedAt, locale)}</time>
        {post.author && (
          <>
            <span>·</span>
            <span>{post.author.name}</span>
          </>
        )}
      </div>
      <h2
        className={`mt-4 font-serif leading-tight text-[var(--color-fg)] group-hover:text-[var(--color-accent)] transition-colors ${featured ? "text-3xl md:text-4xl" : "text-2xl"}`}
      >
        {localize(post.title, locale)}
      </h2>
      {post.subtitle && (
        <p className="mt-2 font-serif italic text-lg text-[var(--color-fg-muted)]">
          {localize(post.subtitle, locale)}
        </p>
      )}
      {featured && post.heroImage?.url && (
        <div className="mt-6 aspect-[16/9] overflow-hidden bg-[var(--color-bg-raised)]">
          <Img
            src={post.heroImage.url}
            alt=""
            width={1200}
            height={675}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </div>
      )}
      <p className="mt-4 max-w-prose text-base leading-relaxed text-[var(--color-fg-muted)]">
        {localize(post.excerpt, locale)}
      </p>
      <p className="mt-4 font-mono text-xs uppercase tracking-wider text-[var(--color-fg-muted)] group-hover:text-[var(--color-accent)] transition-colors">
        {locale === "en" ? "Read →" : "Baca →"}
      </p>
    </Link>
  );
}
