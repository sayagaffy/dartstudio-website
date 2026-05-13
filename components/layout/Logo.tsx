import Image from "next/image";
import { Link } from "@/lib/i18n/routing";

type Props = {
  className?: string;
};

export function Logo({ className }: Props) {
  return (
    <Link href="/" aria-label="Dartstudio — kembali ke beranda" className={className}>
      {/* Black logo — visible in light mode, hidden in dark */}
      <Image
        src="/brand/dartstudio-logo-horizontal-black.png"
        alt="Dartstudio"
        width={160}
        height={32}
        priority
        className="logo-on-light h-8 w-auto"
      />
      {/* White logo — hidden in light mode, visible in dark */}
      <Image
        src="/brand/dartstudio-logo-horizontal-white.png"
        alt=""
        width={160}
        height={32}
        priority
        className="logo-on-dark h-8 w-auto"
      />
    </Link>
  );
}
