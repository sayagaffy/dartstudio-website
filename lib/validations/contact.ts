import { z } from "zod";

export const COLLABORATION_MODELS = [
  "technology-partner",
  "architecture-consultant",
  "strategic-investor",
  "not-sure",
  "open-discussion",
  "other",
] as const;

export const BUDGET_RANGES = [
  "under-100m",
  "100m-300m",
  "300m-1b",
  "1b-plus",
  "not-sure",
  "equity-based",
] as const;

export const START_TIMELINES = ["asap", "1-3-months", "3-6-months", "exploration"] as const;

export const contactFormSchema = z.object({
  name: z.string().min(2, "Name too short").max(120),
  email: z.string().email("Invalid email"),
  company: z.string().max(160).optional().nullable(),
  collaborationModel: z.enum(COLLABORATION_MODELS),
  message: z.string().min(50, "Please give us a bit more context (min 50 characters)").max(4000),
  budgetRange: z.enum(BUDGET_RANGES).optional().nullable(),
  startTimeline: z.enum(START_TIMELINES).optional().nullable(),
  website: z.string().max(0, "Spam detected").optional(), // honeypot
  locale: z.enum(["id", "en"]),
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;
