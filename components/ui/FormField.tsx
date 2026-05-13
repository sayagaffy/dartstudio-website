import { cn } from "@/lib/utils";
import { Label } from "./Label";

type Props = {
  label: string;
  htmlFor: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
  className?: string;
};

export function FormField({ label, htmlFor, required, hint, error, children, className }: Props) {
  const hintId = hint ? `${htmlFor}-hint` : undefined;
  const errorId = error ? `${htmlFor}-error` : undefined;

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <Label htmlFor={htmlFor} required={required}>
        {label}
      </Label>
      <div aria-describedby={[hintId, errorId].filter(Boolean).join(" ") || undefined}>
        {children}
      </div>
      {hint && (
        <p id={hintId} className="text-xs italic text-[var(--color-fg-muted)]">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-xs text-[var(--color-status-error)]">
          {error}
        </p>
      )}
    </div>
  );
}
