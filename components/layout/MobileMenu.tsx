"use client";

import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/ui/Button";
import { Link } from "@/lib/i18n/routing";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { ThemeToggle } from "./ThemeToggle";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("nav");

  // Portal requires document — only available after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const items = [
    { href: "/studio", label: t("studio") },
    { href: "/collaborate", label: t("collaborate") },
    { href: "/products", label: t("products") },
    { href: "/journal", label: t("journal") },
  ] as const;

  const overlay = open ? (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        backgroundColor: "var(--color-bg, #0f0f0f)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "1.5rem",
        }}
      >
        <ThemeToggle />
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
  ) : null;

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

      {/* Render overlay via portal directly in document.body —
          avoids stacking context issues from sticky/backdrop-filter header */}
      {mounted && createPortal(overlay, document.body)}
    </>
  );
}
