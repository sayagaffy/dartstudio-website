import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { Section } from "@/components/ui/Section";
import { type LocalizedField, localize } from "@/lib/i18n/localize";
import type { Locale } from "@/lib/i18n/routing";
import { Link } from "@/lib/i18n/routing";

type FeaturedProduct = {
  _id: string;
  name: string;
  slug: { current: string };
  tagline: LocalizedField | null;
  status: "live" | "beta" | "coming-soon" | "sunset";
};

type Props = {
  heading: string;
  intro: string;
  products: FeaturedProduct[];
  viewAllLabel: string;
  locale: Locale;
};

const statusLabel: Record<FeaturedProduct["status"], string> = {
  live: "Live",
  beta: "Beta",
  "coming-soon": "Coming Soon",
  sunset: "Sunset",
};

export function FeaturedProducts({ heading, intro, products, viewAllLabel, locale }: Props) {
  if (products.length === 0) return null;

  return (
    <Section spacing="lg">
      <Container size="page">
        <div className="max-w-2xl mb-12">
          <p className="label-mono mb-4">Products</p>
          <Heading level={2} size="display-md">
            {heading}
          </Heading>
          <p className="mt-4 text-lg text-[var(--color-fg-muted)]">{intro}</p>
        </div>
        <div className="grid gap-px bg-[var(--color-border)] md:grid-cols-3">
          {products.map((product) => (
            <Link
              key={product._id}
              href={`/products/${product.slug.current}`}
              className="group flex flex-col bg-[var(--color-bg)] p-8 transition-colors hover:bg-[var(--color-bg-sunken)]"
            >
              <p className="font-mono text-xs uppercase tracking-wider text-[var(--color-accent)]">
                {statusLabel[product.status]}
              </p>
              <h3 className="mt-4 font-serif text-2xl text-[var(--color-fg)]">{product.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--color-fg-muted)]">
                {localize(product.tagline, locale)}
              </p>
              <p className="mt-auto pt-6 font-mono text-xs uppercase tracking-wider text-[var(--color-fg-muted)] group-hover:text-[var(--color-accent)] transition-colors">
                Pelajari →
              </p>
            </Link>
          ))}
        </div>
        <div className="mt-12">
          <Link
            href="/products"
            className="font-mono text-sm uppercase tracking-wider text-[var(--color-fg)] underline underline-offset-4 hover:text-[var(--color-accent)] transition-colors"
          >
            {viewAllLabel} →
          </Link>
        </div>
      </Container>
    </Section>
  );
}
