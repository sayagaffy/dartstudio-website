import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import type { Image as SanityImage } from "sanity";
import { PortableText } from "@/components/content/PortableText";
import { Breadcrumb } from "@/components/layout/Breadcrumb";
import { Schema } from "@/components/seo/Schema";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";
import { SanityImage as Img } from "@/components/ui/SanityImage";
import { Section } from "@/components/ui/Section";
import type { LocalizedField } from "@/lib/i18n/localize";
import { localize } from "@/lib/i18n/localize";
import type { Locale } from "@/lib/i18n/routing";
import { Link } from "@/lib/i18n/routing";
import { buildMetadata } from "@/lib/seo/metadata";
import { buildBreadcrumbSchema, buildPersonSchema } from "@/lib/seo/schema";
import { sanityFetch } from "@/sanity/lib/fetch";
import { urlForImage } from "@/sanity/lib/image";
import { ALL_SLUGS_QUERY, PERSON_QUERY } from "@/sanity/lib/queries";

type Props = { params: Promise<{ locale: Locale; slug: string }> };

type SocialLinks = {
  twitter?: string;
  linkedin?: string;
  github?: string;
  email?: string;
};

type PersonDetail = {
  _id: string;
  name: string;
  slug: { current: string };
  role: LocalizedField;
  bio: LocalizedField | null;
  trajectory: unknown;
  photo: SanityImage | null;
  socialLinks: SocialLinks | null;
  memberGroup?: "protagonist" | "circle";
  seo: { title: LocalizedField | null; description: LocalizedField | null } | null;
} | null;

export async function generateStaticParams() {
  const data = await sanityFetch<{ people: Array<{ slug: string }> }>({
    query: ALL_SLUGS_QUERY,
    tags: ["person"],
    revalidate: false,
  });
  return (data?.people ?? []).map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const person = await sanityFetch<PersonDetail>({
    query: PERSON_QUERY,
    params: { slug },
    tags: [`person:${slug}`],
  });

  if (!person) return {};

  return buildMetadata({
    title: localize(person.seo?.title, locale) ?? `${person.name} — Dartstudio`,
    description:
      localize(person.seo?.description, locale) ??
      localize(person.bio, locale) ??
      `${person.name} di Dartstudio`,
    path: `/studio/people/${slug}`,
    locale,
    ogImage: person.photo ? urlForImage(person.photo).width(1200).height(630).url() : undefined,
  });
}

export default async function PersonPage({ params }: Props) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const person = await sanityFetch<PersonDetail>({
    query: PERSON_QUERY,
    params: { slug },
    tags: [`person:${slug}`],
  });

  if (!person) notFound();

  const role = localize(person.role, locale) ?? "";
  const groupLabel =
    person.memberGroup === "circle"
      ? locale === "en"
        ? "Circle"
        : "Anggota Perkumpulan"
      : locale === "en"
        ? "Protagonist"
        : "Pegiat";

  const breadcrumbSchema = buildBreadcrumbSchema([
    { label: "Home", href: "/" },
    { label: "Studio", href: "/studio" },
    { label: locale === "en" ? "Our Team" : "Tim Kami", href: "/studio/people" },
    { label: person.name },
  ]);

  const personSchema = buildPersonSchema({
    name: person.name,
    slug,
    role,
    bio: localize(person.bio, locale) ?? undefined,
    image: person.photo ? urlForImage(person.photo).width(800).height(800).url() : undefined,
    locale,
    socialLinks: {
      twitter: person.socialLinks?.twitter,
      linkedin: person.socialLinks?.linkedin,
      github: person.socialLinks?.github,
    },
  });

  return (
    <>
      <Schema data={[breadcrumbSchema, personSchema]} />

      <Breadcrumb
        items={[
          { label: "Home", href: "/" },
          { label: "Studio", href: "/studio" },
          {
            label: locale === "en" ? "Our Team" : "Tim Kami",
            href: "/studio/people",
          },
          { label: person.name },
        ]}
      />

      {/* Hero */}
      <Section spacing="lg">
        <Container size="page">
          <div className="grid gap-12 md:grid-cols-[1fr_2fr] md:gap-20 items-start">
            {/* Photo */}
            <div className="aspect-square overflow-hidden bg-[var(--color-bg-raised)] max-w-sm">
              {person.photo?.asset ? (
                <Img
                  src={urlForImage(person.photo).width(800).height(800).url()}
                  alt={person.name}
                  width={800}
                  height={800}
                  className="h-full w-full object-cover"
                  priority
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center">
                  <span className="font-mono text-6xl text-[var(--color-fg-muted)] select-none">
                    {person.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              <p className="label-mono mb-3 text-[var(--color-accent)]">{groupLabel}</p>
              <Heading level={1} size="display-lg">
                {person.name}
              </Heading>
              {role && (
                <p className="mt-3 font-mono text-sm uppercase tracking-wider text-[var(--color-fg-muted)]">
                  {role}
                </p>
              )}
              {person.bio && (
                <p className="mt-6 max-w-prose font-serif text-xl leading-relaxed text-[var(--color-fg-muted)]">
                  {localize(person.bio, locale)}
                </p>
              )}

              {/* Social links */}
              {person.socialLinks && (
                <div className="mt-8 flex flex-wrap gap-4">
                  {person.socialLinks.linkedin && (
                    <a
                      href={person.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="label-mono hover:text-[var(--color-accent)] transition-colors"
                    >
                      LinkedIn ↗
                    </a>
                  )}
                  {person.socialLinks.twitter && (
                    <a
                      href={person.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="label-mono hover:text-[var(--color-accent)] transition-colors"
                    >
                      X ↗
                    </a>
                  )}
                  {person.socialLinks.github && (
                    <a
                      href={person.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="label-mono hover:text-[var(--color-accent)] transition-colors"
                    >
                      GitHub ↗
                    </a>
                  )}
                  {person.socialLinks.email && (
                    <a
                      href={`mailto:${person.socialLinks.email}`}
                      className="label-mono hover:text-[var(--color-accent)] transition-colors"
                    >
                      {person.socialLinks.email}
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </Container>
      </Section>

      {/* Trajectory (long bio) */}
      {person.trajectory && (
        <Section spacing="lg">
          <Container size="default">
            <div className="max-w-prose">
              <p className="label-mono mb-8">{locale === "en" ? "Background" : "Jejak Kerja"}</p>
              <div className="prose-dartstudio">
                <PortableText value={person.trajectory as unknown[]} />
              </div>
            </div>
          </Container>
        </Section>
      )}

      {/* Back link */}
      <Section spacing="md">
        <Container size="page">
          <Link
            href="/studio/people"
            className="label-mono text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] transition-colors no-underline"
          >
            ← {locale === "en" ? "Back to Team" : "Kembali ke Tim"}
          </Link>
        </Container>
      </Section>
    </>
  );
}
