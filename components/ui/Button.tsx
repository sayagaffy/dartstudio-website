import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center gap-1.5 font-sans font-medium transition-all border border-transparent " +
  "disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer";

const variants: Record<Variant, string> = {
  primary: "bg-[var(--color-fg)] text-[var(--color-fg-inverse)] hover:opacity-80",
  secondary:
    "bg-[var(--color-bg-raised)] text-[var(--color-fg)] border-[var(--color-border-strong)] hover:opacity-80",
  ghost:
    "bg-transparent text-[var(--color-fg)] underline decoration-[var(--color-accent)] underline-offset-[3px] decoration-[1.5px] hover:text-[var(--color-accent-hover)]",
};

const sizes: Record<Size, string> = {
  sm: "text-xs rounded-[var(--radius-2)] px-3 py-1.5",
  md: "text-sm rounded-[var(--radius-2)] px-4 py-2",
  lg: "text-base rounded-[var(--radius-2)] px-5 py-3",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: React.ReactNode;
};

type AsButton = CommonProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & { href?: never };
type AsLink = CommonProps & { href: string; target?: string; rel?: string };

type Props = AsButton | AsLink;

export function Button(props: Props) {
  const { variant = "primary", size = "md", className, children } = props;
  const classes = cn(base, variants[variant], sizes[size], className);

  if ("href" in props && props.href) {
    const { href, target, rel } = props as AsLink;
    const safeRel = target === "_blank" ? (rel ?? "noopener noreferrer") : rel;
    return (
      <Link href={href} className={classes} target={target} rel={safeRel}>
        {children}
      </Link>
    );
  }

  const { href: _href, ...rest } = props as AsButton & { href?: never };
  return (
    <button className={classes} {...rest}>
      {children}
    </button>
  );
}
