import type { Thing, WithContext } from "schema-dts";

type Props<T extends Thing> = {
  data: WithContext<T> | WithContext<T>[];
};

/**
 * Renders one or more JSON-LD blocks as <script type="application/ld+json">.
 * Each block must include "@context" and "@type" fields (the WithContext type enforces this).
 */
export function Schema<T extends Thing>({ data }: Props<T>) {
  const items = Array.isArray(data) ? data : [data];
  return (
    <>
      {items.map((item) => {
        const type = (item as { "@type"?: string })["@type"] ?? "unknown";
        const id = (item as { "@id"?: string })["@id"] ?? JSON.stringify(item).slice(0, 32);
        return (
          <script
            // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD is the standard pattern for structured data
            dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
            key={`schema-${type}-${id}`}
            type="application/ld+json"
          />
        );
      })}
    </>
  );
}
