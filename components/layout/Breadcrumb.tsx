import { Container } from "@/components/ui/Container";
import { Link } from "@/lib/i18n/routing";

type Crumb = { label: string; href?: string };

type Props = { items: Crumb[] };

export function Breadcrumb({ items }: Props) {
  return (
    <Container size="page" as="nav">
      <ol
        aria-label="Breadcrumb"
        className="flex items-center gap-2 py-4 font-mono text-xs uppercase tracking-[0.08em] list-none m-0 p-0"
      >
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={item.label} className="flex items-center gap-2">
              {item.href && !isLast ? (
                <Link
                  href={item.href}
                  className="text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] transition-colors no-underline"
                >
                  {item.label}
                </Link>
              ) : (
                <span aria-current={isLast ? "page" : undefined} className="text-[var(--color-fg)]">
                  {item.label}
                </span>
              )}
              {!isLast && (
                <span className="text-[var(--color-fg-subtle)] opacity-50" aria-hidden="true">
                  /
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </Container>
  );
}
