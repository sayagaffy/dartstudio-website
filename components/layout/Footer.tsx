import { getLocale } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { Link } from "@/lib/i18n/routing";
import { sanityFetch } from "@/sanity/lib/fetch";
import { SITE_SETTINGS_QUERY } from "@/sanity/lib/queries";

type LocalizedString = { id: string; en: string };
type FooterLink = { label: LocalizedString; href: string };
type FooterColumn = { heading: LocalizedString; links: FooterLink[] };
type SiteSettings = {
  siteName?: string;
  contactEmail?: string;
  footerColumns?: FooterColumn[];
};

function loc(field: LocalizedString, locale: string): string {
  return locale === "en" ? field.en : field.id;
}

export async function Footer() {
  const locale = await getLocale();
  const settings = await sanityFetch<SiteSettings>({
    query: SITE_SETTINGS_QUERY,
    tags: ["siteSettings"],
  });

  const columns = settings?.footerColumns ?? [];
  const year = new Date().getFullYear();

  return (
    <footer
      role="contentinfo"
      className="border-t border-[var(--color-border)] bg-[var(--color-bg-raised)] mt-20"
    >
      <Container size="page">
        <div className="py-12 md:py-16">
          {columns.length > 0 && (
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-12 mb-12">
              {columns.map((col) => (
                <div key={col.heading.id}>
                  <h3 className="label-mono mb-4">{loc(col.heading, locale)}</h3>
                  <ul className="flex flex-col gap-2 list-none m-0 p-0">
                    {col.links?.map((link) => (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="text-sm text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] transition-colors no-underline"
                        >
                          {loc(link.label, locale)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          <div className="pt-8 border-t border-[var(--color-border)] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="label-mono">{settings?.siteName ?? "Dartstudio"}</p>
            <p className="font-mono text-xs text-[var(--color-fg-muted)]">
              {settings?.contactEmail ?? "hello@dartstudio.id"}
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="/privacy"
                className="font-mono text-xs text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] transition-colors no-underline"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="font-mono text-xs text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] transition-colors no-underline"
              >
                Terms
              </Link>
              <p className="font-mono text-xs text-[var(--color-fg-muted)]">© {year}</p>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
