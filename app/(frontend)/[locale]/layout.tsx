import { Analytics } from "@vercel/analytics/react";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { Schema } from "@/components/seo/Schema";
import { routing } from "@/lib/i18n/routing";
import { buildOrganizationSchema, buildWebsiteSchema } from "@/lib/seo/schema";
import "@/app/globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <html lang={locale}>
      <head>
        {/* Favicon — black for light mode, white for dark mode */}
        <link rel="icon" href="/ds-black.ico" media="(prefers-color-scheme: light)" />
        <link rel="icon" href="/ds-white.ico" media="(prefers-color-scheme: dark)" />
        <link
          rel="preload"
          href="/fonts/charter/Charter-Bold.otf"
          as="font"
          type="font/otf"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/inter/Inter-Variable.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <Schema data={[buildOrganizationSchema(), buildWebsiteSchema()]} />
        <NextIntlClientProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}
