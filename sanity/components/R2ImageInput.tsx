import { useCallback, useState } from "react";
import type { ObjectInputProps } from "sanity";
import { set } from "sanity";

type R2ImageValue = {
  url?: string;
  alt?: string;
  width?: number;
  height?: number;
  caption?: unknown;
};

export function R2ImageInput(props: ObjectInputProps) {
  const { value, onChange } = props;
  const typedValue = value as R2ImageValue | undefined;

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setUploading(true);
      setError(null);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const secret = process.env.NEXT_PUBLIC_R2_UPLOAD_SECRET ?? "";
        const res = await fetch("/api/r2/upload", {
          method: "POST",
          headers: { "x-upload-secret": secret },
          body: formData,
        });

        if (!res.ok) {
          const body = (await res.json()) as { error?: string };
          throw new Error(body.error ?? `Upload failed: ${res.status}`);
        }

        const result = (await res.json()) as {
          url: string;
          width: number;
          height: number;
        };

        onChange(
          set({
            url: result.url,
            alt: typedValue?.alt ?? "",
            width: result.width,
            height: result.height,
          }),
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed");
      } finally {
        setUploading(false);
      }
    },
    [onChange, typedValue?.alt],
  );

  const handleAltChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange(
        set({
          ...typedValue,
          alt: e.target.value,
        }),
      );
    },
    [onChange, typedValue],
  );

  const handleRemove = useCallback(() => {
    onChange(
      set({
        url: undefined,
        alt: undefined,
        width: undefined,
        height: undefined,
      }),
    );
  }, [onChange]);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      {typedValue?.url ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ position: "relative", display: "inline-block", maxWidth: "400px" }}>
            {/* biome-ignore lint/performance/noImgElement: Sanity Studio component, no Next.js Image */}
            <img
              src={typedValue.url}
              alt={typedValue.alt ?? ""}
              style={{ width: "100%", height: "auto", display: "block", borderRadius: "4px" }}
            />
            <button
              type="button"
              onClick={handleRemove}
              style={{
                position: "absolute",
                top: "8px",
                right: "8px",
                background: "rgba(0,0,0,0.7)",
                color: "white",
                border: "none",
                borderRadius: "4px",
                padding: "4px 8px",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              Remove
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
            <label
              style={{ fontSize: "13px", fontWeight: 500, color: "#101112" }}
              htmlFor="r2-alt-input"
            >
              Alt text
            </label>
            <input
              id="r2-alt-input"
              type="text"
              value={typedValue.alt ?? ""}
              onChange={handleAltChange}
              placeholder="Describe the image for accessibility"
              style={{
                padding: "8px 12px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontSize: "14px",
                width: "100%",
              }}
            />
          </div>

          {typedValue.width && typedValue.height && (
            <p style={{ fontSize: "12px", color: "#666", margin: 0 }}>
              {typedValue.width} × {typedValue.height}px
            </p>
          )}
        </div>
      ) : (
        <div>
          <label
            style={{
              display: "inline-block",
              padding: "8px 16px",
              background: uploading ? "#ccc" : "#0069b4",
              color: "white",
              borderRadius: "4px",
              cursor: uploading ? "not-allowed" : "pointer",
              fontSize: "14px",
            }}
          >
            {uploading ? "Uploading…" : "Upload image"}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
              style={{ display: "none" }}
            />
          </label>
        </div>
      )}

      {error && <p style={{ color: "#d03", fontSize: "13px", margin: 0 }}>Error: {error}</p>}
    </div>
  );
}
