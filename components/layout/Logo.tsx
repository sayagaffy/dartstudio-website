import Image from "next/image";
import { Link } from "@/lib/i18n/routing";

type Props = {
  variant?: "dark" | "light";
  className?: string;
};

export function Logo({ variant = "dark", className }: Props) {
  const src =
    variant === "dark"
      ? "/brand/dartstudio-logo-horizontal-black.png"
      : "/brand/dartstudio-logo-horizontal-white.png";

  return (
    <Link href="/" aria-label="Dartstudio — kembali ke beranda" className={className}>
      <Image src={src} alt="Dartstudio" width={160} height={32} priority className="h-8 w-auto" />
    </Link>
  );
}
