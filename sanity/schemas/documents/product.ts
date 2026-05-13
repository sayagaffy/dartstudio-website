import { defineField, defineType } from "sanity";

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Product Name",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "tagline",
      title: "Tagline",
      type: "localizedString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Live", value: "live" },
          { title: "Beta", value: "beta" },
          { title: "Coming Soon", value: "coming-soon" },
          { title: "Sunset", value: "sunset" },
        ],
      },
      validation: (rule) => rule.required(),
      initialValue: "coming-soon",
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image / Screenshot",
      type: "r2Image",
    }),
    defineField({
      name: "problemHeading",
      title: "Problem Heading",
      type: "localizedString",
    }),
    defineField({
      name: "problemBody",
      title: "Problem Body",
      type: "localizedRichText",
    }),
    defineField({
      name: "approachHeading",
      title: "Approach Heading",
      type: "localizedString",
    }),
    defineField({
      name: "approachBody",
      title: "Approach Body",
      type: "localizedRichText",
    }),
    defineField({
      name: "capabilities",
      title: "Key Capabilities",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "heading", type: "localizedString", title: "Heading" },
            { name: "body", type: "localizedRichText", title: "Body" },
            {
              name: "image",
              type: "r2Image",
              title: "Image",
            },
          ],
        },
      ],
      validation: (rule) => rule.max(6),
    }),
    defineField({
      name: "relatedJournalPosts",
      title: "Behind the Build (Journal Posts)",
      type: "array",
      of: [{ type: "reference", to: [{ type: "journalPost" }] }],
      validation: (rule) => rule.max(4),
    }),
    defineField({
      name: "faqs",
      title: "FAQs",
      type: "array",
      of: [{ type: "reference", to: [{ type: "faq" }] }],
    }),
    defineField({
      name: "ctaHeading",
      title: "Final CTA Heading",
      type: "localizedString",
    }),
    defineField({
      name: "ctaBody",
      title: "Final CTA Body",
      type: "localizedText",
    }),
    defineField({
      name: "ctaButtons",
      title: "CTA Buttons",
      type: "array",
      of: [{ type: "ctaButton" }],
      validation: (rule) => rule.max(2),
    }),
    defineField({
      name: "displayOrder",
      title: "Display Order",
      type: "number",
      initialValue: 0,
    }),
    defineField({
      name: "featured",
      title: "Featured on Homepage",
      type: "boolean",
      initialValue: false,
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seoMetadata",
    }),
  ],
  preview: {
    select: { title: "name", status: "status", media: "heroImage" },
    prepare({ title, status, media }) {
      return { title, subtitle: `Status: ${status as string | undefined}`, media };
    },
  },
});
