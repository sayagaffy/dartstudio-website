import { SanityImage as Img } from "@/components/ui/SanityImage";
import { type LocalizedField, localize } from "@/lib/i18n/localize";
import type { Locale } from "@/lib/i18n/routing";
import type { R2Image } from "@/lib/types/r2Image";
import { formatDate, readingTime } from "@/lib/utils";

type Author = {
  _id: string;
  name: string;
  role: LocalizedField;
  photo?: R2Image;
};

type Props = { author: Author; publishedAt: string; bodyText?: string; locale: Locale };

export function AuthorByline({ author, publishedAt, bodyText, locale }: Props) {
  const minutes = bodyText ? readingTime(bodyText) : null;

  return (
    <div className="flex items-center gap-4">
      {author.photo?.url && (
        <Img
          src={author.photo.url}
          alt={author.name}
          width={48}
          height={48}
          className="h-12 w-12 rounded-full object-cover"
        />
      )}
      <div>
        <p className="font-mono text-sm text-[var(--color-fg)]">{author.name}</p>
        <p className="font-mono text-xs uppercase tracking-wider text-[var(--color-fg-muted)]">
          {localize(author.role, locale)}
        </p>
      </div>
      <div className="ml-auto text-right">
        <time
          className="font-mono text-xs uppercase tracking-wider text-[var(--color-fg-muted)] block"
          dateTime={publishedAt}
        >
          {formatDate(publishedAt, locale)}
        </time>
        {minutes && (
          <p className="font-mono text-xs uppercase tracking-wider text-[var(--color-fg-muted)] mt-1">
            {minutes} min read
          </p>
        )}
      </div>
    </div>
  );
}
