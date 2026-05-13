import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/Button";
import { Link } from "@/lib/i18n/routing";

export async function Navigation() {
  const t = await getTranslations("nav");

  const items = [
    { href: "/studio", label: t("studio") },
    { href: "/collaborate", label: t("collaborate") },
    { href: "/products", label: t("products") },
    { href: "/journal", label: t("journal") },
  ] as const;

  return (
    <nav aria-label="Primary" className="hidden md:flex items-center gap-8">
      <ul className="flex items-center gap-8 list-none m-0 p-0">
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="font-sans text-sm text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] transition-colors duration-[var(--duration-fast)] no-underline"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
      <Button href="/contact" variant="primary" size="sm">
        {t("contact")}
      </Button>
    </nav>
  );
}
