import { type NextRequest, NextResponse } from "next/server";
import { env } from "@/lib/env";

/**
 * POST /api/indexnow
 *
 * Notifies Bing (and IndexNow-compatible engines) about new/updated URLs.
 * Call this from Sanity webhooks after content is published.
 *
 * Body: { urls: string[] }
 */
export async function POST(req: NextRequest) {
  if (!env.INDEXNOW_KEY) {
    return NextResponse.json({ error: "IndexNow not configured" }, { status: 503 });
  }

  let urls: string[];
  try {
    const body = (await req.json()) as { urls?: unknown };
    if (!Array.isArray(body.urls) || body.urls.length === 0) {
      return NextResponse.json({ error: "urls array required" }, { status: 400 });
    }
    urls = body.urls as string[];
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const siteUrl = env.NEXT_PUBLIC_SITE_URL;
  const host = new URL(siteUrl).hostname;

  const payload = {
    host,
    key: env.INDEXNOW_KEY,
    keyLocation: `${siteUrl}/${env.INDEXNOW_KEY}.txt`,
    urlList: urls,
  };

  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "IndexNow submission failed", status: res.status },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, submitted: urls.length });
}
