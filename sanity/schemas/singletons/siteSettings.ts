import { defineField, defineType } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "siteName",
      title: "Site Name",
      type: "string",
      initialValue: "Dartstudio",
    }),
    defineField({
      name: "siteTagline",
      title: "Site Tagline",
      type: "localizedString",
    }),
    defineField({
      name: "siteDescription",
      title: "Site Description",
      type: "localizedText",
      description: "Default meta description if a page doesn't override.",
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: false },
    }),
    defineField({
      name: "logoLight",
      title: "Logo (light mode variant)",
      type: "image",
      description: "For dark backgrounds.",
    }),
    defineField({
      name: "principles",
      title: "Principles",
      type: "array",
      of: [{ type: "principle" }],
      description: "Used on /studio/principles and homepage preview.",
    }),
    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "socialLinks",
    }),
    defineField({
      name: "contactEmail",
      title: "Contact Email",
      type: "string",
      initialValue: "hello@dartstudio.id",
    }),
    defineField({
      name: "defaultSeo",
      title: "Default SEO",
      type: "seoMetadata",
    }),
    defineField({
      name: "navigationLabels",
      title: "Navigation Labels",
      type: "object",
      fields: [
        { name: "studio", type: "localizedString", title: "Studio label" },
        { name: "collaborate", type: "localizedString", title: "Collaborate label" },
        { name: "products", type: "localizedString", title: "Products label" },
        { name: "journal", type: "localizedString", title: "Journal label" },
        { name: "contactCta", type: "localizedString", title: "Contact CTA" },
      ],
    }),
    defineField({
      name: "footerColumns",
      title: "Footer Columns",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            { name: "heading", type: "localizedString", title: "Heading" },
            {
              name: "links",
              type: "array",
              of: [
                {
                  type: "object",
                  fields: [
                    { name: "label", type: "localizedString", title: "Label" },
                    { name: "href", type: "string", title: "URL or path" },
                  ],
                },
              ],
            },
          ],
        },
      ],
    }),
  ],
  preview: {
    prepare() {
      return { title: "Site Settings" };
    },
  },
});
