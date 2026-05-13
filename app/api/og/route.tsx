import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

// Load fonts at module top — fetched once per cold start, cached for warm.
const charterBoldFont = fetch(new URL("./fonts/CharterBold.otf", import.meta.url)).then((res) =>
  res.arrayBuffer(),
);

const interFont = fetch(new URL("./fonts/Inter-Regular.ttf", import.meta.url)).then((res) =>
  res.arrayBuffer(),
);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const title = (searchParams.get("title") ?? "Dartstudio").slice(0, 120);
  const subtitle = searchParams.get("subtitle")?.slice(0, 140);
  const category = searchParams.get("category")?.slice(0, 32);
  const locale = (searchParams.get("locale") ?? "id") as "id" | "en";

  const [charterBold, inter] = await Promise.all([charterBoldFont, interFont]);

  return new ImageResponse(
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: "#fafaf8",
        padding: "64px",
        fontFamily: "Charter, serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <span
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 16,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "#c8853d",
          }}
        >
          {category ?? "Dartstudio"}
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <h1
          style={{
            fontSize: title.length > 60 ? 60 : 72,
            fontWeight: 700,
            lineHeight: 1.05,
            margin: 0,
            color: "#0a0a09",
            letterSpacing: "-0.01em",
            maxWidth: "1000px",
          }}
        >
          {title}
        </h1>
        {subtitle && (
          <p
            style={{
              fontSize: 28,
              lineHeight: 1.4,
              color: "#5a5a53",
              fontStyle: "italic",
              margin: "24px 0 0",
              maxWidth: "900px",
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1px solid #d8d8d3",
          paddingTop: "24px",
        }}
      >
        <span
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 22,
            fontWeight: 600,
            color: "#0a0a09",
          }}
        >
          dartstudio.id
        </span>
        <span
          style={{
            fontFamily: "Inter, sans-serif",
            fontSize: 14,
            color: "#8a8a83",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
          }}
        >
          {locale === "en" ? "Studio Notes" : "Catatan Studio"}
        </span>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Charter", data: charterBold, weight: 700, style: "normal" },
        { name: "Inter", data: inter, weight: 400, style: "normal" },
      ],
      headers: {
        "cache-control": "public, max-age=31536000, immutable",
      },
    },
  );
}
