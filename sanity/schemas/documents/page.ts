import { defineField, defineType } from "sanity";

export const page = defineType({
  name: "page",
  title: "Page",
  type: "document",
  fields: [
    defineField({
      name: "pageKey",
      title: "Page Key",
      type: "string",
      options: {
        list: [
          { title: "Homepage", value: "home" },
          { title: "Studio", value: "studio" },
          { title: "Studio / Principles", value: "studio-principles" },
          { title: "Studio / People", value: "studio-people" },
          { title: "Collaborate (Hub)", value: "collaborate" },
          { title: "Products (Hub)", value: "products" },
          { title: "Journal (Hub)", value: "journal" },
          { title: "Contact", value: "contact" },
          { title: "Privacy", value: "privacy" },
          { title: "Terms", value: "terms" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "title",
      title: "Title (internal reference)",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroHeading",
      title: "Hero Heading",
      type: "localizedString",
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
          name: "pageSection",
          fields: [
            { name: "heading", type: "localizedString", title: "Heading" },
            { name: "body", type: "localizedRichText", title: "Body" },
            {
              name: "sectionType",
              type: "string",
              options: {
                list: [
                  "hero",
                  "credibility-bar",
                  "the-problem",
                  "three-ways",
                  "from-journal",
                  "final-cta",
                  "origin",
                  "what-we-believe",
                  "people-preview",
                  "how-we-work",
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
      name: "seo",
      title: "SEO",
      type: "seoMetadata",
    }),
  ],
  preview: {
    select: { title: "title", pageKey: "pageKey" },
    prepare({ title, pageKey }: { title?: string; pageKey?: string }) {
      return { title, subtitle: pageKey };
    },
  },
});
