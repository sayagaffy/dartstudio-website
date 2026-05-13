import type { Metadata } from "next";
import { env } from "@/lib/env";
import type { Locale } from "@/lib/i18n/routing";

type PageMeta = {
  title: string;
  description: string;
  path: string;
  locale: Locale;
  ogImage?: string;
  noIndex?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  type?: "website" | "article";
};

const siteBase = env.NEXT_PUBLIC_SITE_URL;

export function buildMetadata({
  title,
  description,
  path,
  locale,
  ogImage,
  noIndex,
  publishedTime,
  modifiedTime,
  type = "website",
}: PageMeta): Metadata {
  const idUrl = `${siteBase}${path}`;
  const enUrl = `${siteBase}/en${path === "/" ? "" : path}`;
  const currentUrl = locale === "id" ? idUrl : enUrl;
  const ogImageUrl =
    ogImage ?? `${siteBase}/api/og?title=${encodeURIComponent(title)}&locale=${locale}`;

  return {
    title,
    description,
    metadataBase: new URL(siteBase),
    alternates: {
      canonical: currentUrl,
      languages: {
        "id-ID": idUrl,
        "en-US": enUrl,
        "x-default": idUrl,
      },
    },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: currentUrl,
      siteName: "Dartstudio",
      type,
      locale: locale === "id" ? "id_ID" : "en_US",
      alternateLocale: locale === "id" ? "en_US" : "id_ID",
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: title }],
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}
