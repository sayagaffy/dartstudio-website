import type { JSX } from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "raised" | "outlined" | "ghost";

const variants: Record<Variant, string> = {
  default: "bg-[var(--color-bg)] border border-[var(--color-border)]",
  raised: "bg-[var(--color-bg-raised)] shadow-[var(--shadow-1)]",
  outlined: "bg-transparent border border-[var(--color-border-strong)]",
  ghost: "bg-transparent",
};

type Props = {
  children: React.ReactNode;
  variant?: Variant;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
};

export function Card({ children, variant = "default", className, as: As = "div" }: Props) {
  const Tag = As as React.ElementType;
  return (
    <Tag className={cn("p-6 md:p-8 rounded-[var(--radius-3)]", variants[variant], className)}>
      {children}
    </Tag>
  );
}
