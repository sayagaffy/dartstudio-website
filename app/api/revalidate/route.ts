import { revalidateTag } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { env } from "@/lib/env";

type WebhookPayload = {
  _type: string;
  slug?: { current?: string };
};

export async function POST(req: NextRequest) {
  if (!env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json(
      { message: "Server misconfigured: SANITY_REVALIDATE_SECRET not set" },
      { status: 500 },
    );
  }

  try {
    const { body, isValidSignature } = await parseBody<WebhookPayload>(
      req,
      env.SANITY_REVALIDATE_SECRET,
    );

    if (!isValidSignature) {
      return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
    }

    if (!body?._type) {
      return NextResponse.json({ message: "Bad payload" }, { status: 400 });
    }

    revalidateTag(body._type, { expire: 0 });

    if (body.slug?.current) {
      revalidateTag(`${body._type}:${body.slug.current}`, { expire: 0 });
    }

    return NextResponse.json({ revalidated: true, type: body._type });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ message }, { status: 500 });
  }
}
