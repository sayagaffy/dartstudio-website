import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./sanity/schemas";
import { structure } from "./sanity/structure";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

if (!projectId) {
  throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID");
}

export default defineConfig({
  name: "default",
  title: "Dartstudio",
  projectId,
  dataset,
  basePath: "/admin",
  plugins: [structureTool({ structure }), visionTool({ defaultApiVersion: "2024-12-01" })],
  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter(({ schemaType }) => schemaType !== "siteSettings"),
  },
  document: {
    actions: (input, context) => {
      if (context.schemaType === "siteSettings") {
        return input.filter(
          ({ action }) => !["delete", "duplicate", "unpublish"].includes(action ?? ""),
        );
      }
      return input;
    },
  },
});
