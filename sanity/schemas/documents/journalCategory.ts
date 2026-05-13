import { defineField, defineType } from "sanity";

export const journalCategory = defineType({
  name: "journalCategory",
  title: "Journal Category",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "localizedString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title.id",
        maxLength: 96,
        slugify: (input: string) => input.toLowerCase().replace(/\s+/g, "-").slice(0, 96),
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "localizedText",
    }),
  ],
});
