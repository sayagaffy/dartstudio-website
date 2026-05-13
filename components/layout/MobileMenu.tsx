"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Link } from "@/lib/i18n/routing";
import { LocaleSwitcher } from "./LocaleSwitcher";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const t = useTranslations("nav");

  const items = [
    { href: "/studio", label: t("studio") },
    { href: "/collaborate", label: t("collaborate") },
    { href: "/products", label: t("products") },
    { href: "/journal", label: t("journal") },
  ] as const;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label={t("openMenu")}
        aria-expanded={open}
        className="md:hidden font-mono text-xs uppercase tracking-[0.08em] text-[var(--color-fg)]"
      >
        Menu
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 bg-[var(--color-bg)] md:hidden flex flex-col"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex justify-end p-6">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label={t("closeMenu")}
              className="font-mono text-xs uppercase tracking-[0.08em] text-[var(--color-fg)]"
            >
              Close
            </button>
          </div>

          <nav aria-label="Mobile primary" className="flex-1 px-6 py-8">
            <ul className="flex flex-col gap-8 list-none m-0 p-0">
              {items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="block font-serif text-[length:var(--text-h2)] text-[var(--color-fg)] no-underline leading-tight tracking-tight"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-12 flex flex-col gap-4">
              <Button href="/contact" variant="primary" size="lg">
                {t("contact")}
              </Button>
              <LocaleSwitcher />
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
