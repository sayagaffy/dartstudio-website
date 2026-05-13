import { cn } from "@/lib/utils";

type Spacing = "sm" | "md" | "lg" | "xl";

const spacingMap: Record<Spacing, string> = {
  sm: "py-12",
  md: "py-16 md:py-20",
  lg: "py-20 md:py-28",
  xl: "py-28 md:py-36",
};

type Props = {
  children: React.ReactNode;
  spacing?: Spacing;
  className?: string;
  id?: string;
  as?: "section" | "article" | "div";
};

export function Section({ children, spacing = "md", className, id, as: As = "section" }: Props) {
  return (
    <As id={id} className={cn(spacingMap[spacing], className)}>
      {children}
    </As>
  );
}
