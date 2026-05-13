"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type Props = React.SelectHTMLAttributes<HTMLSelectElement> & {
  invalid?: boolean;
};

export const Select = forwardRef<HTMLSelectElement, Props>(function Select(
  { className, invalid, children, ...rest },
  ref,
) {
  return (
    <select
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        "w-full px-4 py-2.5 bg-[var(--color-bg)] text-[var(--color-fg)] font-sans text-[length:var(--text-ui)]",
        "border border-[var(--color-border)] rounded-[var(--radius-2)]",
        "focus:outline-none focus:border-[var(--color-fg)]",
        "aria-[invalid=true]:border-[var(--color-status-error)]",
        "transition-colors duration-[var(--duration-fast)] cursor-pointer",
        className,
      )}
      {...rest}
    >
      {children}
    </select>
  );
});
