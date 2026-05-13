"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/lib/i18n/routing";
import { cn } from "@/lib/utils";

type Props = { className?: string };

export function LocaleSwitcher({ className }: Props) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function switchTo(target: "id" | "en") {
    router.replace(pathname, { locale: target });
  }

  return (
    <div className={cn("flex items-center gap-2 font-mono text-xs", className)}>
      <button
        type="button"
        onClick={() => switchTo("id")}
        aria-pressed={locale === "id"}
        className={cn(
          "uppercase tracking-[0.08em] transition-colors duration-[var(--duration-fast)]",
          locale === "id"
            ? "text-[var(--color-fg)]"
            : "text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]",
        )}
      >
        ID
      </button>
      <span className="text-[var(--color-border-strong)] opacity-30">/</span>
      <button
        type="button"
        onClick={() => switchTo("en")}
        aria-pressed={locale === "en"}
        className={cn(
          "uppercase tracking-[0.08em] transition-colors duration-[var(--duration-fast)]",
          locale === "en"
            ? "text-[var(--color-fg)]"
            : "text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]",
        )}
      >
        EN
      </button>
    </div>
  );
}
