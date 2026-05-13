type ContactNotificationProps = {
  name: string;
  email: string;
  company?: string | null;
  collaborationModel: string;
  message: string;
  budgetRange?: string | null;
  startTimeline?: string | null;
  locale: "id" | "en";
};

const modelLabels: Record<string, string> = {
  "technology-partner": "Technology Partner",
  "architecture-consultant": "Architecture Consultant",
  "strategic-investor": "Strategic Investor",
  "not-sure": "Not Sure / Help Me Choose",
  "open-discussion": "Open Discussion",
  other: "Other",
};

export function contactNotificationEmail(props: ContactNotificationProps): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = `New inquiry: ${props.name}${props.company ? ` (${props.company})` : ""} — ${modelLabels[props.collaborationModel] ?? props.collaborationModel}`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><title>${esc(subject)}</title></head>
<body style="margin:0;padding:0;background:#fafaf8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#fafaf8;">
  <tr><td align="center" style="padding:40px 16px;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width:600px;background:#ffffff;border:1px solid #d8d8d3;">
      <tr><td style="padding:32px 32px 16px;border-bottom:1px solid #ededea;">
        <p style="margin:0;font-family:'SF Mono',monospace;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;color:#8a8a83;">New Inquiry</p>
        <h1 style="margin:8px 0 0;font-family:Georgia,serif;font-size:24px;color:#0a0a09;">${esc(props.name)}</h1>
      </td></tr>
      <tr><td style="padding:24px 32px;">
        ${row("Email", `<a href="mailto:${esc(props.email)}" style="color:#c8853d;">${esc(props.email)}</a>`)}
        ${props.company ? row("Company", esc(props.company)) : ""}
        ${row("Model", modelLabels[props.collaborationModel] ?? props.collaborationModel)}
        ${props.budgetRange ? row("Budget", esc(props.budgetRange)) : ""}
        ${props.startTimeline ? row("Timeline", esc(props.startTimeline)) : ""}
        ${row("Locale", props.locale.toUpperCase())}
      </td></tr>
      <tr><td style="padding:8px 32px 32px;">
        <p style="margin:0 0 8px;font-family:'SF Mono',monospace;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;color:#8a8a83;">Message</p>
        <p style="margin:0;font-size:15px;line-height:1.6;color:#2a2a25;white-space:pre-wrap;">${esc(props.message)}</p>
      </td></tr>
      <tr><td style="padding:24px 32px;border-top:1px solid #ededea;background:#f7f7f5;">
        <p style="margin:0;font-size:12px;color:#5a5a53;">Reply directly to this email to respond to ${esc(props.name)}.</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;

  const text = [
    `New inquiry from ${props.name}`,
    "",
    `Email: ${props.email}`,
    props.company ? `Company: ${props.company}` : "",
    `Model: ${modelLabels[props.collaborationModel] ?? props.collaborationModel}`,
    props.budgetRange ? `Budget: ${props.budgetRange}` : "",
    props.startTimeline ? `Timeline: ${props.startTimeline}` : "",
    `Locale: ${props.locale.toUpperCase()}`,
    "",
    "Message:",
    props.message,
    "",
    `Reply to ${props.email} directly.`,
  ]
    .filter(Boolean)
    .join("\n");

  return { subject, html, text };
}

export function contactAutoReplyEmail(props: { name: string; locale: "id" | "en" }): {
  subject: string;
  html: string;
  text: string;
} {
  const isEn = props.locale === "en";

  const subject = isEn
    ? "Got your message — Dartstudio"
    : "Pesan Anda sudah kami terima — Dartstudio";

  const greeting = isEn ? `Hi ${props.name},` : `Halo ${props.name},`;

  const body = isEn
    ? [
        "Thanks for reaching out. Your inquiry has landed in our inbox and a real person will read it within 2-3 working days.",
        "",
        "If there's a potential fit, we'll send a calendar link for a 30-60 minute discovery call. If we're not the right partner, we'll say so directly — and recommend someone better suited if we know one.",
        "",
        "No automated follow-ups. No pipeline nurture. Just one honest reply.",
        "",
        "— Dartstudio",
      ].join("\n")
    : [
        "Terima kasih sudah menghubungi. Inquiry Anda sudah masuk ke inbox kami dan akan dibaca oleh orang asli dalam 2-3 hari kerja.",
        "",
        "Kalau ada potensi fit, kami kirim calendar link untuk discovery call 30-60 menit. Kalau ternyata bukan partner yang tepat, kami akan bilang langsung — dan rekomendasikan partner lain yang lebih cocok kalau kami tahu.",
        "",
        "Tidak ada follow-up otomatis. Tidak ada pipeline nurture. Hanya satu balasan jujur.",
        "",
        "— Dartstudio",
      ].join("\n");

  const html = `<!DOCTYPE html>
<html lang="${props.locale}">
<head><meta charset="utf-8"><title>${esc(subject)}</title></head>
<body style="margin:0;padding:0;background:#fafaf8;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:#fafaf8;">
  <tr><td align="center" style="padding:40px 16px;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width:600px;background:#ffffff;">
      <tr><td style="padding:48px 32px 24px;">
        <p style="margin:0;font-family:'SF Mono',monospace;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;color:#c8853d;">Dartstudio</p>
      </td></tr>
      <tr><td style="padding:0 32px 32px;">
        <p style="margin:0 0 16px;font-size:16px;color:#0a0a09;">${esc(greeting)}</p>
        <p style="margin:0;font-size:15px;line-height:1.6;color:#2a2a25;white-space:pre-wrap;">${esc(body)}</p>
      </td></tr>
      <tr><td style="padding:24px 32px;border-top:1px solid #ededea;">
        <p style="margin:0;font-size:12px;color:#8a8a83;">
          ${isEn ? "This is an automated confirmation. Replies go to the team." : "Ini konfirmasi otomatis. Balasan diteruskan ke tim."}
        </p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;

  return { subject, html, text: `${greeting}\n\n${body}` };
}

export function waitlistConfirmationEmail(props: {
  productName: string;
  email: string;
  locale: "id" | "en";
}): { subject: string; html: string; text: string } {
  const isEn = props.locale === "en";

  const subject = isEn
    ? `You're on the waitlist for ${props.productName}`
    : `Anda terdaftar di waitlist ${props.productName}`;

  const body = isEn
    ? `Thanks for joining the waitlist for ${props.productName}.\n\nWe'll email you when there's news worth your inbox — open beta, public launch, or a significant scope change. Nothing else.`
    : `Terima kasih sudah daftar waitlist untuk ${props.productName}.\n\nKami akan email saat ada update yang layak masuk inbox Anda — open beta, public launch, atau perubahan scope yang signifikan. Tidak ada selain itu.`;

  const html = `<!DOCTYPE html>
<html lang="${props.locale}">
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#fafaf8;font-family:-apple-system,sans-serif;">
<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
  <tr><td align="center" style="padding:40px 16px;">
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width:600px;background:#ffffff;padding:32px;">
      <tr><td>
        <p style="margin:0;font-family:'SF Mono',monospace;font-size:12px;text-transform:uppercase;letter-spacing:0.08em;color:#c8853d;">Dartstudio · Waitlist</p>
        <p style="margin:16px 0 0;font-size:15px;line-height:1.6;color:#2a2a25;white-space:pre-wrap;">${esc(body)}</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body>
</html>`;

  return { subject, html, text: body };
}

function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function row(label: string, value: string): string {
  return `
    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom:12px;">
      <tr>
        <td width="120" style="vertical-align:top;padding-right:16px;">
          <p style="margin:0;font-family:'SF Mono',monospace;font-size:11px;text-transform:uppercase;letter-spacing:0.08em;color:#8a8a83;">${esc(label)}</p>
        </td>
        <td style="vertical-align:top;">
          <p style="margin:0;font-size:14px;color:#2a2a25;">${value}</p>
        </td>
      </tr>
    </table>`;
}
