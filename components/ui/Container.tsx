import type { JSX } from "react";
import { cn } from "@/lib/utils";

type Size = "read" | "page" | "wide" | "default";

const sizeMap: Record<Size, string> = {
  read: "max-w-[var(--container-read)]",
  page: "max-w-[var(--container-page)]",
  wide: "max-w-[var(--container-page)]",
  default: "max-w-[64rem]",
};

type Props = {
  children: React.ReactNode;
  size?: Size;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
};

export function Container({ children, size = "page", className, as: As = "div" }: Props) {
  const Tag = As as React.ElementType;
  return (
    <Tag className={cn("mx-auto w-full px-6 md:px-8", sizeMap[size], className)}>{children}</Tag>
  );
}
