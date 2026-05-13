import { z } from "zod";

export const waitlistFormSchema = z.object({
  email: z.string().email("Invalid email"),
  name: z.string().max(120).optional().nullable(),
  productSlug: z.string().min(1).max(96),
  locale: z.enum(["id", "en"]),
  website: z.string().max(0).optional(), // honeypot
});

export type WaitlistFormInput = z.infer<typeof waitlistFormSchema>;
