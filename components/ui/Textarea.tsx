"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  invalid?: boolean;
};

export const Textarea = forwardRef<HTMLTextAreaElement, Props>(function Textarea(
  { className, invalid, rows = 5, ...rest },
  ref,
) {
  return (
    <textarea
      ref={ref}
      rows={rows}
      aria-invalid={invalid || undefined}
      className={cn(
        "w-full px-4 py-2.5 bg-transparent text-[var(--color-fg)] font-sans text-[length:var(--text-ui)]",
        "border border-[var(--color-border)] rounded-[var(--radius-2)]",
        "focus:outline-none focus:border-[var(--color-fg)]",
        "aria-[invalid=true]:border-[var(--color-status-error)]",
        "placeholder:text-[var(--color-fg-subtle)] resize-y",
        "transition-colors duration-[var(--duration-fast)]",
        className,
      )}
      {...rest}
    />
  );
});
