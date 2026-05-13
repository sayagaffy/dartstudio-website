import { SanityImage as Img } from "@/components/ui/SanityImage";
import { type LocalizedField, localize } from "@/lib/i18n/localize";
import type { Locale } from "@/lib/i18n/routing";
import { Link } from "@/lib/i18n/routing";
import type { R2Image } from "@/lib/types/r2Image";

type ProductCardData = {
  _id: string;
  name: string;
  slug: { current: string };
  tagline: LocalizedField | null;
  status: "live" | "beta" | "coming-soon" | "sunset";
  heroImage?: R2Image;
};

type Props = { product: ProductCardData; locale: Locale; featured?: boolean };

const statusLabel: Record<ProductCardData["status"], string> = {
  live: "Live",
  beta: "Beta",
  "coming-soon": "Coming Soon",
  sunset: "Sunset",
};

const statusColor: Record<ProductCardData["status"], string> = {
  live: "var(--color-status-live)",
  beta: "var(--color-status-beta)",
  "coming-soon": "var(--color-status-soon)",
  sunset: "var(--color-status-sunset)",
};

export function ProductCard({ product, locale, featured = false }: Props) {
  return (
    <Link
      href={`/products/${product.slug.current}`}
      className={`group flex flex-col border border-[var(--color-border)] bg-[var(--color-bg)] p-8 transition-colors hover:border-[var(--color-fg)] ${featured ? "md:col-span-2 md:row-span-2" : ""}`}
    >
      {product.heroImage?.url && (
        <div className="mb-6 aspect-[16/9] overflow-hidden bg-[var(--color-bg-raised)]">
          <Img
            src={product.heroImage.url}
            alt={product.name}
            width={800}
            height={450}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        </div>
      )}
      <p
        className="font-mono text-xs uppercase tracking-wider"
        style={{ color: statusColor[product.status] }}
      >
        {statusLabel[product.status]}
      </p>
      <h3
        className={`mt-4 font-serif text-[var(--color-fg)] ${featured ? "text-3xl" : "text-2xl"}`}
      >
        {product.name}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-[var(--color-fg-muted)]">
        {localize(product.tagline, locale)}
      </p>
      <p className="mt-auto pt-6 font-mono text-xs uppercase tracking-wider text-[var(--color-fg-muted)] group-hover:text-[var(--color-accent)] transition-colors">
        {locale === "en" ? "Learn more →" : "Pelajari →"}
      </p>
    </Link>
  );
}
