import { defineField, defineType } from "sanity";

export const localizedString = defineType({
  name: "localizedString",
  title: "Localized String",
  type: "object",
  fields: [
    defineField({
      name: "id",
      title: "Bahasa Indonesia",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "en",
      title: "English",
      type: "string",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { id: "id", en: "en" },
    prepare({ id, en }: { id?: string; en?: string }) {
      return { title: id ?? en ?? "(empty)", subtitle: en };
    },
  },
});
