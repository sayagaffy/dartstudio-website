"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { type WaitlistFormInput, waitlistFormSchema } from "@/lib/validations/waitlist";

type Props = { productSlug: string };
type SubmitState =
  | { state: "idle" }
  | { state: "submitting" }
  | { state: "success" }
  | { state: "error" };

export function WaitlistForm({ productSlug }: Props) {
  const t = useTranslations("waitlist");
  const locale = useLocale() as "id" | "en";
  const [submitState, setSubmitState] = useState<SubmitState>({ state: "idle" });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<WaitlistFormInput>({
    resolver: zodResolver(waitlistFormSchema),
    defaultValues: { email: "", name: "", productSlug, locale, website: "" },
  });

  async function onSubmit(data: WaitlistFormInput) {
    setSubmitState({ state: "submitting" });
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, productSlug, locale }),
      });
      const json = (await res.json()) as { ok: boolean };
      if (!res.ok || !json.ok) {
        setSubmitState({ state: "error" });
        return;
      }
      setSubmitState({ state: "success" });
    } catch {
      setSubmitState({ state: "error" });
    }
  }

  if (submitState.state === "success") {
    return (
      <div className="border-l-2 border-[var(--color-accent)] bg-[var(--color-bg-raised)] p-4">
        <p className="label-mono mb-2 text-[var(--color-accent)]">{t("success.label")}</p>
        <p className="text-base text-[var(--color-fg-muted)]">{t("success.body")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3" noValidate>
      <input
        type="text"
        {...register("website")}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px" }}
      />
      <input type="hidden" {...register("productSlug")} value={productSlug} />
      <input type="hidden" {...register("locale")} value={locale} />

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <label htmlFor="waitlist-email" className="sr-only">
            {t("emailLabel")}
          </label>
          <Input
            id="waitlist-email"
            type="email"
            autoComplete="email"
            placeholder={t("emailPlaceholder")}
            invalid={!!errors.email}
            {...register("email")}
          />
        </div>
        <Button type="submit" variant="primary" disabled={isSubmitting}>
          {isSubmitting ? t("loading") : t("submit")}
        </Button>
      </div>
      {errors.email && (
        <p role="alert" className="text-xs text-[var(--color-status-error,#b3392a)]">
          {errors.email.message}
        </p>
      )}
      {submitState.state === "error" && (
        <p role="alert" className="text-xs text-[var(--color-status-error,#b3392a)]">
          {t("errors.generic")}
        </p>
      )}
    </form>
  );
}
