import { getTranslations, setRequestLocale } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function HomePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("home");
  const tCommon = await getTranslations("common");

  return (
    <main className="min-h-screen p-8">
      <div className="mx-auto max-w-3xl">
        <p className="font-mono text-sm uppercase tracking-wider text-[var(--color-ink-400)]">
          {locale}
        </p>
        <h1 className="mt-4 text-5xl font-bold text-[var(--color-ink-900)]">
          {tCommon("siteName")}
        </h1>
        <p className="mt-4 text-2xl text-[var(--color-ink-700)]">{tCommon("tagline")}</p>
        <p className="mt-12 text-base text-[var(--color-ink-500)]">{t("placeholder")}</p>
      </div>
    </main>
  );
}
