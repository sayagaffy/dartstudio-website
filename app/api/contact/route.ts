import { type NextRequest, NextResponse } from "next/server";
import { EMAIL_FROM, EMAIL_TO, resend } from "@/lib/email/resend";
import { contactAutoReplyEmail, contactNotificationEmail } from "@/lib/email/templates";
import { checkRateLimit, getClientIp, getContactLimiter } from "@/lib/ratelimit";
import { supabaseAdmin } from "@/lib/supabase/server";
import { contactFormSchema } from "@/lib/validations/contact";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  // 1. Rate limit by IP
  const ip = getClientIp(req.headers);
  const rl = await checkRateLimit(getContactLimiter(), ip);
  if (!rl.success) {
    return NextResponse.json(
      {
        ok: false,
        error: "rate_limited",
        message: "Too many submissions. Please try again later.",
      },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil((rl.reset - Date.now()) / 1000)) },
      },
    );
  }

  // 2. Parse + validate
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = contactFormSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "validation_failed", issues: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  // 3. Honeypot — silently succeed for bots
  if (parsed.data.website && parsed.data.website.length > 0) {
    return NextResponse.json({ ok: true });
  }

  const data = parsed.data;
  const userAgent = req.headers.get("user-agent") ?? null;

  // 4. Insert into Supabase
  const { data: row, error: dbError } = await supabaseAdmin
    .from("contact_submissions")
    .insert({
      name: data.name,
      email: data.email,
      company: data.company ?? null,
      collaboration_model: data.collaborationModel,
      message: data.message,
      budget_range: data.budgetRange ?? null,
      start_timeline: data.startTimeline ?? null,
      locale: data.locale,
      ip_address: ip,
      user_agent: userAgent,
    })
    .select("id")
    .single();

  if (dbError) {
    console.error("[contact] supabase insert failed", dbError);
    return NextResponse.json({ ok: false, error: "server_error" }, { status: 500 });
  }

  // 5. Send notification email to team
  const notification = contactNotificationEmail({
    name: data.name,
    email: data.email,
    company: data.company,
    collaborationModel: data.collaborationModel,
    message: data.message,
    budgetRange: data.budgetRange,
    startTimeline: data.startTimeline,
    locale: data.locale,
  });

  const { data: notifyResult, error: notifyError } = await resend.emails.send({
    from: EMAIL_FROM,
    to: EMAIL_TO,
    subject: notification.subject,
    html: notification.html,
    text: notification.text,
    replyTo: data.email,
  });

  if (notifyError) {
    console.error("[contact] resend notify failed", notifyError);
  } else if (notifyResult?.id && row?.id) {
    await supabaseAdmin
      .from("contact_submissions")
      .update({ resend_message_id: notifyResult.id })
      .eq("id", row.id);
  }

  // 6. Auto-reply to submitter
  const autoReply = contactAutoReplyEmail({ name: data.name, locale: data.locale });
  await resend.emails.send({
    from: EMAIL_FROM,
    to: data.email,
    subject: autoReply.subject,
    html: autoReply.html,
    text: autoReply.text,
  });

  return NextResponse.json({ ok: true });
}
