import "server-only";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { env } from "@/lib/env";

let redis: Redis | null = null;
let contactLimiter: Ratelimit | null = null;
let waitlistLimiter: Ratelimit | null = null;

function getRedis(): Redis | null {
  if (!env.UPSTASH_REDIS_REST_URL || !env.UPSTASH_REDIS_REST_TOKEN) return null;
  if (!redis) {
    redis = new Redis({
      url: env.UPSTASH_REDIS_REST_URL,
      token: env.UPSTASH_REDIS_REST_TOKEN,
    });
  }
  return redis;
}

export function getContactLimiter(): Ratelimit | null {
  const r = getRedis();
  if (!r) return null;
  if (!contactLimiter) {
    contactLimiter = new Ratelimit({
      redis: r,
      limiter: Ratelimit.slidingWindow(3, "10 m"),
      analytics: true,
      prefix: "rl:contact",
    });
  }
  return contactLimiter;
}

export function getWaitlistLimiter(): Ratelimit | null {
  const r = getRedis();
  if (!r) return null;
  if (!waitlistLimiter) {
    waitlistLimiter = new Ratelimit({
      redis: r,
      limiter: Ratelimit.slidingWindow(5, "1 h"),
      analytics: true,
      prefix: "rl:waitlist",
    });
  }
  return waitlistLimiter;
}

/**
 * Fail-open: if Upstash not configured, allow the request (safe in dev).
 */
export async function checkRateLimit(
  limiter: Ratelimit | null,
  identifier: string,
): Promise<{ success: boolean; remaining: number; reset: number }> {
  if (!limiter) return { success: true, remaining: -1, reset: 0 };
  const result = await limiter.limit(identifier);
  return { success: result.success, remaining: result.remaining, reset: result.reset };
}

export function getClientIp(headers: Headers): string {
  return (
    headers.get("cf-connecting-ip") ??
    headers.get("x-real-ip") ??
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    "unknown"
  );
}
