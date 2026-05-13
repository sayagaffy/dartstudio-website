import { cn } from "@/lib/utils";

type Props = {
  htmlFor?: string;
  children: React.ReactNode;
  required?: boolean;
  className?: string;
};

export function Label({ htmlFor, children, required, className }: Props) {
  return (
    <label htmlFor={htmlFor} className={cn("label-mono block mb-2", className)}>
      {children}
      {required && (
        <span className="ml-1 text-[var(--color-accent)]" aria-hidden="true">
          *
        </span>
      )}
    </label>
  );
}
