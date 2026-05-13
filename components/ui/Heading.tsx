import { cn } from "@/lib/utils";

type Level = 1 | 2 | 3 | 4 | 5 | 6;
type Size =
  | "display"
  | "display-xl"
  | "display-lg"
  | "display-md"
  | "display-sm"
  | "h1"
  | "h2"
  | "h3"
  | "h4";

const sizeMap: Record<Size, string> = {
  display: "text-[length:var(--text-display)] leading-[1.04] tracking-[-0.02em] font-normal",
  "display-xl": "text-[length:var(--text-display)] leading-[1.04] tracking-[-0.02em] font-normal",
  "display-lg":
    "text-[length:var(--text-h1)] leading-[var(--leading-tight)] tracking-[-0.02em] font-normal",
  "display-md":
    "text-[length:var(--text-h2)] leading-[var(--leading-snug)] tracking-[-0.02em] font-normal",
  "display-sm":
    "text-[length:var(--text-h3)] leading-[var(--leading-snug)] tracking-[-0.02em] font-normal",
  h1: "text-[length:var(--text-h1)] leading-[var(--leading-tight)] tracking-[-0.02em] font-normal",
  h2: "text-[length:var(--text-h2)] leading-[var(--leading-snug)] tracking-[-0.02em] font-normal",
  h3: "text-[length:var(--text-h3)] leading-[var(--leading-snug)] tracking-[-0.02em] font-normal",
  h4: "text-[length:var(--text-h4)] leading-[var(--leading-snug)] font-normal",
};

type Props = {
  children: React.ReactNode;
  level?: Level;
  size?: Size;
  className?: string;
};

export function Heading({ children, level = 2, size = "h2", className }: Props) {
  const Tag = `h${level}` as React.ElementType;
  return (
    <Tag className={cn("font-serif text-[var(--color-fg)]", sizeMap[size], className)}>
      {children}
    </Tag>
  );
}
