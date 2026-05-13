import { defineField, defineType } from "sanity";

export const principle = defineType({
  name: "principle",
  title: "Principle",
  type: "object",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "localizedString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "body",
      title: "Body",
      type: "localizedText",
      validation: (rule) => rule.required(),
    }),
  ],
});
