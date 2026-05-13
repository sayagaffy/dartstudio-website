import { defineField, defineType } from "sanity";

export const collaborateModel = defineType({
  name: "collaborateModel",
  title: "Collaborate Model",
  type: "document",
  fields: [
    defineField({
      name: "modelKey",
      title: "Model Key",
      type: "string",
      options: {
        list: [
          { title: "Technology Partner", value: "technology-partner" },
          { title: "Architecture Consultant", value: "architecture-consultant" },
          { title: "Strategic Investor", value: "strategic-investor" },
        ],
      },
      validation: (rule) => rule.required(),
      description: "Used in URL: /collaborate/{modelKey}",
    }),
    defineField({
      name: "name",
      title: "Display Name",
      type: "localizedString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "shortDescriptor",
      title: "Short Descriptor (for nav dropdown)",
      type: "localizedString",
      description: "1 sentence describing the model.",
    }),
    defineField({
      name: "heroHeading",
      title: "Hero Heading",
      type: "localizedString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroSubheading",
      title: "Hero Subheading",
      type: "localizedText",
    }),
    defineField({
      name: "ctaPrimary",
      title: "Primary CTA",
      type: "ctaButton",
    }),
    defineField({
      name: "ctaSecondary",
      title: "Secondary CTA",
      type: "ctaButton",
    }),
    defineField({
      name: "sections",
      title: "Page Sections",
      type: "array",
      of: [
        {
          type: "object",
          name: "contentSection",
          fields: [
            { name: "heading", type: "localizedString", title: "Heading" },
            { name: "intro", type: "localizedText", title: "Intro Paragraph" },
            { name: "body", type: "localizedRichText", title: "Body" },
            {
              name: "sectionType",
              type: "string",
              title: "Section Type",
              options: {
                list: [
                  "checklist",
                  "process-stages",
                  "outcomes",
                  "engagement-models",
                  "what-we-need",
                  "what-we-avoid",
                  "selection-process",
                  "generic",
                ],
              },
              initialValue: "generic",
            },
          ],
        },
      ],
    }),
    defineField({
      name: "faqs",
      title: "FAQs",
      type: "array",
      of: [{ type: "reference", to: [{ type: "faq" }] }],
    }),
    defineField({
      name: "finalCtaHeading",
      title: "Final CTA Heading",
      type: "localizedString",
    }),
    defineField({
      name: "finalCtaBody",
      title: "Final CTA Body",
      type: "localizedText",
    }),
    defineField({
      name: "displayOrder",
      title: "Display Order",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seoMetadata",
    }),
  ],
  preview: {
    select: { name: "name.id", modelKey: "modelKey" },
    prepare({ name, modelKey }: { name?: string; modelKey?: string }) {
      return { title: name, subtitle: modelKey };
    },
  },
});
