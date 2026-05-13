import { defineField, defineType } from "sanity";

export const seoMetadata = defineType({
  name: "seoMetadata",
  title: "SEO Metadata",
  type: "object",
  options: { collapsible: true, collapsed: true },
  fields: [
    defineField({
      name: "title",
      title: "Meta Title",
      type: "localizedString",
      description: "Overrides default page title. Recommended 50-60 chars.",
    }),
    defineField({
      name: "description",
      title: "Meta Description",
      type: "localizedText",
      description: "Recommended 150-160 chars.",
    }),
    defineField({
      name: "keywords",
      title: "Keywords",
      type: "array",
      of: [{ type: "string" }],
      description: "Lowercase. Used for GEO/AEO context.",
    }),
    defineField({
      name: "ogImage",
      title: "OG Image Override",
      type: "r2Image",
      description: "If empty, dynamic OG image generated from title.",
    }),
    defineField({
      name: "noIndex",
      title: "No Index",
      type: "boolean",
      initialValue: false,
    }),
  ],
});
