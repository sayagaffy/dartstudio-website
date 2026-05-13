"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/Button";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { cn } from "@/lib/utils";
import {
  BUDGET_RANGES,
  COLLABORATION_MODELS,
  type ContactFormInput,
  contactFormSchema,
  START_TIMELINES,
} from "@/lib/validations/contact";

type SubmitState =
  | { state: "idle" }
  | { state: "submitting" }
  | { state: "success" }
  | { state: "error"; message: string }
  | { state: "rate_limited"; message: string };

export function ContactForm() {
  const t = useTranslations("contact.form");
  const locale = useLocale() as "id" | "en";
  const [submitState, setSubmitState] = useState<SubmitState>({ state: "idle" });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormInput>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      collaborationModel: "not-sure",
      message: "",
      budgetRange: undefined,
      startTimeline: undefined,
      website: "",
      locale,
    },
  });

  async function onSubmit(data: ContactFormInput) {
    setSubmitState({ state: "submitting" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, locale }),
      });

      if (res.status === 429) {
        setSubmitState({ state: "rate_limited", message: t("errors.rateLimited") });
        return;
      }

      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setSubmitState({ state: "error", message: t("errors.generic") });
        return;
      }

      setSubmitState({ state: "success" });
      reset();
    } catch {
      setSubmitState({ state: "error", message: t("errors.network") });
    }
  }

  if (submitState.state === "success") {
    return (
      <div className="border border-[var(--color-border)] bg-[var(--color-bg-raised)] p-8">
        <p className="label-mono mb-3 text-[var(--color-accent)]">{t("success.label")}</p>
        <h3 className="font-serif text-2xl text-[var(--color-fg)]">{t("success.heading")}</h3>
        <p className="mt-3 text-base leading-relaxed text-[var(--color-fg-muted)]">
          {t("success.body")}
        </p>
      </div>
    );
  }

  const isLoading = submitState.state === "submitting" || isSubmitting;

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
      {/* Honeypot — hidden from humans */}
      <input
        type="text"
        {...register("website")}
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px" }}
      />

      <FormField
        label={t("fields.name.label")}
        htmlFor="name"
        required
        error={errors.name?.message}
      >
        <Input
          id="name"
          type="text"
          autoComplete="name"
          invalid={!!errors.name}
          {...register("name")}
        />
      </FormField>

      <FormField
        label={t("fields.email.label")}
        htmlFor="email"
        required
        hint={t("fields.email.hint")}
        error={errors.email?.message}
      >
        <Input
          id="email"
          type="email"
          autoComplete="email"
          invalid={!!errors.email}
          {...register("email")}
        />
      </FormField>

      <FormField
        label={t("fields.company.label")}
        htmlFor="company"
        error={errors.company?.message}
      >
        <Input id="company" type="text" autoComplete="organization" {...register("company")} />
      </FormField>

      <FormField
        label={t("fields.collaborationModel.label")}
        htmlFor="collaborationModel"
        required
        error={errors.collaborationModel?.message}
      >
        <Select
          id="collaborationModel"
          invalid={!!errors.collaborationModel}
          {...register("collaborationModel")}
        >
          {COLLABORATION_MODELS.map((value) => (
            <option key={value} value={value}>
              {t(`fields.collaborationModel.options.${value}`)}
            </option>
          ))}
        </Select>
      </FormField>

      <FormField
        label={t("fields.message.label")}
        htmlFor="message"
        required
        hint={t("fields.message.hint")}
        error={errors.message?.message}
      >
        <Textarea id="message" rows={6} invalid={!!errors.message} {...register("message")} />
      </FormField>

      <FormField
        label={t("fields.budgetRange.label")}
        htmlFor="budgetRange"
        hint={t("fields.budgetRange.hint")}
        error={errors.budgetRange?.message}
      >
        <Select
          id="budgetRange"
          defaultValue=""
          invalid={!!errors.budgetRange}
          {...register("budgetRange")}
        >
          <option value="">{t("fields.budgetRange.placeholder")}</option>
          {BUDGET_RANGES.map((value) => (
            <option key={value} value={value}>
              {t(`fields.budgetRange.options.${value}`)}
            </option>
          ))}
        </Select>
      </FormField>

      <FormField
        label={t("fields.startTimeline.label")}
        htmlFor="startTimeline"
        error={errors.startTimeline?.message}
      >
        <Select
          id="startTimeline"
          defaultValue=""
          invalid={!!errors.startTimeline}
          {...register("startTimeline")}
        >
          <option value="">{t("fields.startTimeline.placeholder")}</option>
          {START_TIMELINES.map((value) => (
            <option key={value} value={value}>
              {t(`fields.startTimeline.options.${value}`)}
            </option>
          ))}
        </Select>
      </FormField>

      {(submitState.state === "error" || submitState.state === "rate_limited") && (
        <div
          role="alert"
          className={cn(
            "border-l-2 px-4 py-3 text-sm",
            submitState.state === "rate_limited"
              ? "border-[var(--color-accent)] bg-[var(--color-bg-raised)] text-[var(--color-fg-muted)]"
              : "border-[var(--color-status-error,#b3392a)] bg-[var(--color-bg-raised)] text-[var(--color-fg-muted)]",
          )}
        >
          {submitState.message}
        </div>
      )}

      <div className="mt-2">
        <Button type="submit" variant="primary" size="lg" disabled={isLoading}>
          {isLoading ? t("submit.loading") : t("submit.idle")}
        </Button>
      </div>
    </form>
  );
}
