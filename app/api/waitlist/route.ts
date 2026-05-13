import groq from "groq";
import { type NextRequest, NextResponse } from "next/server";
import { EMAIL_FROM, resend } from "@/lib/email/resend";
import { waitlistConfirmationEmail } from "@/lib/email/templates";
import { checkRateLimit, getClientIp, getWaitlistLimiter } from "@/lib/ratelimit";
import { supabaseAdmin } from "@/lib/supabase/server";
import { waitlistFormSchema } from "@/lib/validations/waitlist";
import { sanityFetch } from "@/sanity/lib/fetch";

export const runtime = "nodejs";

const PRODUCT_NAME_QUERY = groq`*[_type == "product" && slug.current == $slug][0].name`;

export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers);
  const rl = await checkRateLimit(getWaitlistLimiter(), ip);
  if (!rl.success) {
    return NextResponse.json({ ok: false, error: "rate_limited" }, { status: 429 });
  }

  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = waitlistFormSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "validation_failed", issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  if (parsed.data.website && parsed.data.website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const data = parsed.data;

  const productName = await sanityFetch<string | null>({
    query: PRODUCT_NAME_QUERY,
    params: { slug: data.productSlug },
    tags: ["product", `product:${data.productSlug}`],
  });

  if (!productName) {
    return NextResponse.json({ ok: false, error: "product_not_found" }, { status: 404 });
  }

  const { error: dbError } = await supabaseAdmin.from("waitlist_signups").insert({
    product_slug: data.productSlug,
    email: data.email,
    name: data.name ?? null,
    locale: data.locale,
    ip_address: ip,
    user_agent: req.headers.get("user-agent") ?? null,
  });

  // Unique violation = already signed up — treat as success
  if (dbError && !dbError.message.includes("duplicate") && !dbError.code?.includes("23505")) {
    console.error("[waitlist] supabase insert failed", dbError);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }

  const tpl = waitlistConfirmationEmail({ productName, email: data.email, locale: data.locale });
  await resend.emails.send({
    from: EMAIL_FROM,
    to: data.email,
    subject: tpl.subject,
    html: tpl.html,
    text: tpl.text,
  });

  return NextResponse.json({ ok: true });
}
