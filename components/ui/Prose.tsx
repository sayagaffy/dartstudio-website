import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
};

export function Prose({ children, className }: Props) {
  return (
    <div
      className={cn(
        "ds-prose",
        "[&_p]:mb-5",
        "[&_h2]:mt-8 [&_h2]:mb-3 [&_h2]:text-[length:var(--text-h2)]",
        "[&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:text-[length:var(--text-h3)]",
        "[&_h4]:mt-5 [&_h4]:mb-1 [&_h4]:text-[length:var(--text-h4)]",
        "[&_a]:underline [&_a]:decoration-[var(--color-accent)] [&_a]:underline-offset-[3px]",
        "[&_a:hover]:text-[var(--color-accent-hover)]",
        "[&_blockquote]:pl-5 [&_blockquote]:border-l-2 [&_blockquote]:border-[var(--color-accent)] [&_blockquote]:italic [&_blockquote]:text-[var(--color-fg-muted)] [&_blockquote]:my-6",
        "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-4",
        "[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-4",
        "[&_li]:my-1.5",
        className,
      )}
    >
      {children}
    </div>
  );
}
