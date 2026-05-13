import { z } from "zod";

/**
 * Converts empty strings to undefined before Zod validation.
 * Prevents crashes when .env.local has KEY= (empty) instead of the line being absent.
 */
function opt<T extends z.ZodTypeAny>(schema: T) {
  return z.preprocess((v) => (v === "" ? undefined : v), schema.optional());
}

const envSchema = z.object({
  // Site
  NEXT_PUBLIC_SITE_URL: z.string().url().default("https://dartstudio.id"),
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),

  // Sanity (Phase 3)
  NEXT_PUBLIC_SANITY_PROJECT_ID: opt(z.string().min(1)),
  NEXT_PUBLIC_SANITY_DATASET: z.string().min(1).default("production"),
  NEXT_PUBLIC_SANITY_API_VERSION: z.string().default("2024-12-01"),
  SANITY_API_READ_TOKEN: opt(z.string().min(1)),
  SANITY_API_WRITE_TOKEN: opt(z.string().min(1)),
  SANITY_REVALIDATE_SECRET: opt(z.string().min(16)),

  // Supabase (Phase 7)
  NEXT_PUBLIC_SUPABASE_URL: opt(z.string().url()),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: opt(z.string().min(1)),
  SUPABASE_SERVICE_ROLE_KEY: opt(z.string().min(1)),

  // Cloudflare R2 (Phase 7)
  R2_ACCOUNT_ID: opt(z.string().min(1)),
  R2_ACCESS_KEY_ID: opt(z.string().min(1)),
  R2_SECRET_ACCESS_KEY: opt(z.string().min(1)),
  R2_BUCKET_NAME: opt(z.string().min(1)),
  R2_PUBLIC_URL: opt(z.string().url()),

  // Resend (Phase 7)
  RESEND_API_KEY: opt(z.string().min(1)),
  CONTACT_TO_EMAIL: z.string().email().default("dartstudio.team@gmail.com"),
  CONTACT_FROM_EMAIL: z.string().email().default("dartstudio.team@gmail.com"),

  // Upstash Redis — rate limiting (Phase 7)
  UPSTASH_REDIS_REST_URL: opt(z.string().url()),
  UPSTASH_REDIS_REST_TOKEN: opt(z.string().min(1)),

  // IndexNow — search engine pinging (Phase 10)
  INDEXNOW_KEY: opt(z.string().min(16)),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  // Log which fields failed to help diagnose quickly
  const issues = parsed.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`);
  throw new Error(`Invalid environment variables:\n${issues.join("\n")}`);
}

export const env = parsed.data;
export type Env = z.infer<typeof envSchema>;
