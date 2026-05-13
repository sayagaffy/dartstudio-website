import { defineField, defineType } from "sanity";

export const journalPost = defineType({
  name: "journalPost",
  title: "Journal Post",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "localizedString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "localizedString",
    }),
    defineField({
      name: "slug",
      title: "Slug (ID)",
      type: "slug",
      options: { source: "title.id", maxLength: 96 },
      validation: (rule) => rule.required(),
      description: "URL slug for ID locale.",
    }),
    defineField({
      name: "slugEn",
      title: "Slug (EN)",
      type: "slug",
      options: { source: "title.en", maxLength: 96 },
      description: "If empty, falls back to ID slug for EN URL.",
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "reference",
      to: [{ type: "journalCategory" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "reference",
      to: [{ type: "person" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "localizedText",
      description: "Card preview text. 1-2 sentences.",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "localizedRichText",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "r2Image",
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      validation: (rule) => rule.required(),
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "updatedAt",
      title: "Updated At",
      type: "datetime",
    }),
    defineField({
      name: "relatedPosts",
      title: "Related Posts",
      type: "array",
      of: [{ type: "reference", to: [{ type: "journalPost" }] }],
      validation: (rule) => rule.max(3),
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      description: "Show on homepage 'From the Journal' section.",
      initialValue: false,
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seoMetadata",
    }),
  ],
  orderings: [
    {
      title: "Published date, newest first",
      name: "publishedDateDesc",
      by: [{ field: "publishedAt", direction: "desc" }],
    },
  ],
  preview: {
    select: {
      title: "title.id",
      author: "author.name",
      publishedAt: "publishedAt",
      media: "heroImage",
    },
    prepare({ title, author, publishedAt, media }) {
      const date =
        typeof publishedAt === "string"
          ? new Date(publishedAt).toLocaleDateString("id-ID")
          : "draft";
      return { title, subtitle: `${(author as string | undefined) ?? "?"} · ${date}`, media };
    },
  },
});
