"use client";

import Image from "next/image";
import { useState } from "react";
import type { Image as SanityImage } from "sanity";
import type { LocalizedField } from "@/lib/i18n/localize";
import { localize } from "@/lib/i18n/localize";
import type { Locale } from "@/lib/i18n/routing";
import { Link } from "@/lib/i18n/routing";
import { urlForImage } from "@/sanity/lib/image";

export type TeamPerson = {
  _id: string;
  name: string;
  slug: { current: string };
  role: LocalizedField;
  bio: LocalizedField | null;
  photo: SanityImage | null;
};

type Props = {
  protagonistLabel: string;
  circleLabel: string;
  protagonists: TeamPerson[];
  circle: TeamPerson[];
  locale: Locale;
};

type Tab = "protagonist" | "circle";

function PersonCard({ person, locale }: { person: TeamPerson; locale: Locale }) {
  return (
    <article>
      <Link
        href={`/studio/people/${person.slug.current}` as never}
        className="group block no-underline"
      >
        <div className="aspect-square overflow-hidden bg-[var(--color-bg-raised)]">
          {person.photo?.asset ? (
            <Image
              src={urlForImage(person.photo).width(600).height(600).url()}
              alt={person.name}
              width={600}
              height={600}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <span className="font-mono text-4xl text-[var(--color-fg-muted)] select-none">
                {person.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        <p className="mt-4 font-mono text-xs uppercase tracking-wider text-[var(--color-fg-muted)]">
          {localize(person.role, locale)}
        </p>
        <h3 className="mt-2 font-serif text-xl text-[var(--color-fg)] group-hover:text-[var(--color-accent)] transition-colors">
          {person.name}
        </h3>
      </Link>

      {person.bio && (
        <p className="mt-3 text-sm leading-relaxed text-[var(--color-fg-muted)]">
          {localize(person.bio, locale)}
        </p>
      )}
    </article>
  );
}

export function TeamTabs({ protagonistLabel, circleLabel, protagonists, circle, locale }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>("protagonist");

  const activePeople = activeTab === "protagonist" ? protagonists : circle;

  return (
    <>
      {/* Tab nav */}
      <nav className="flex items-center gap-4 mb-10" aria-label="Team groups">
        <button
          type="button"
          onClick={() => setActiveTab("protagonist")}
          className={[
            "label-mono transition-colors",
            activeTab === "protagonist"
              ? "text-[var(--color-fg)]"
              : "text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]",
          ].join(" ")}
          aria-current={activeTab === "protagonist" ? "true" : undefined}
        >
          {protagonistLabel}
        </button>

        <span className="text-[var(--color-fg-muted)] select-none" aria-hidden="true">
          |
        </span>

        <button
          type="button"
          onClick={() => setActiveTab("circle")}
          className={[
            "label-mono transition-colors",
            activeTab === "circle"
              ? "text-[var(--color-fg)]"
              : "text-[var(--color-fg-muted)] hover:text-[var(--color-fg)]",
          ].join(" ")}
          aria-current={activeTab === "circle" ? "true" : undefined}
        >
          {circleLabel}
        </button>
      </nav>

      {/* People grid */}
      {activePeople.length > 0 ? (
        <div className="grid gap-12 md:grid-cols-3">
          {activePeople.map((person) => (
            <PersonCard key={person._id} person={person} locale={locale} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-[var(--color-fg-muted)]">—</p>
      )}
    </>
  );
}
