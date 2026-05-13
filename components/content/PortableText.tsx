import { PortableText as PortableTextBase, type PortableTextComponents } from "@portabletext/react";
import Link from "next/link";
import type { Image as SanityImage } from "sanity";
import { SanityImage as Img } from "@/components/ui/SanityImage";
import { urlForImage } from "@/sanity/lib/image";

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="font-serif text-[length:var(--text-h2)] tracking-tight mt-10 mb-4 text-[var(--color-fg)]">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-serif text-[length:var(--text-h3)] tracking-tight mt-8 mb-3 text-[var(--color-fg)]">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="font-serif text-[length:var(--text-h4)] tracking-tight mt-6 mb-2 text-[var(--color-fg)]">
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-6 pl-5 border-l-2 border-[var(--color-accent)] italic text-[var(--color-fg-muted)]">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => (
      <p className="mb-5 text-[length:var(--text-body)] leading-[var(--leading-reading)] text-[var(--color-fg)]">
        {children}
      </p>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="list-disc pl-6 my-4">{children}</ul>,
    number: ({ children }) => <ol className="list-decimal pl-6 my-4">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="my-1.5 text-[var(--color-fg)] leading-[var(--leading-reading)]">{children}</li>
    ),
    number: ({ children }) => (
      <li className="my-1.5 text-[var(--color-fg)] leading-[var(--leading-reading)]">{children}</li>
    ),
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-[var(--color-fg)]">{children}</strong>
    ),
    em: ({ children }) => <em className="italic">{children}</em>,
    code: ({ children }) => (
      <code className="font-mono text-sm bg-[var(--color-bg-sunken)] border border-[var(--color-border)] rounded-[var(--radius-2)] px-1.5 py-0.5">
        {children}
      </code>
    ),
    link: ({ value, children }) => {
      const href = (value?.href as string | undefined) ?? "#";
      const external = (value?.external as boolean | undefined) ?? false;
      const classes =
        "underline decoration-[var(--color-accent)] underline-offset-[3px] hover:text-[var(--color-accent-hover)] transition-colors";

      if (external) {
        return (
          <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
            {children}
          </a>
        );
      }
      return (
        <Link href={href} className={classes}>
          {children}
        </Link>
      );
    },
  },
  types: {
    image: ({
      value,
    }: {
      value: SanityImage & { alt?: string; caption?: { id: string; en: string } };
    }) => {
      if (!value?.asset) return null;
      const url = urlForImage(value).width(1200).url();
      return (
        <figure className="my-8">
          <Img
            src={url}
            alt={value.alt ?? ""}
            width={1200}
            height={675}
            className="w-full h-auto"
          />
          {value.caption && (
            <figcaption className="mt-2 text-sm italic text-[var(--color-fg-muted)] text-center">
              {value.caption.id}
            </figcaption>
          )}
        </figure>
      );
    },
    codeBlock: ({ value }: { value: { code?: string; language?: string } }) => (
      <pre className="bg-[var(--color-bg-sunken)] border border-[var(--color-border)] rounded-[var(--radius-3)] p-5 overflow-x-auto my-6">
        <code className="font-mono text-sm">{value?.code}</code>
      </pre>
    ),
  },
};

type Props = {
  value: unknown[];
};

export function PortableText({ value }: Props) {
  return <PortableTextBase value={value} components={components} />;
}
