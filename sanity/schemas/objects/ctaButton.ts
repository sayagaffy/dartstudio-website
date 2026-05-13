import { defineField, defineType } from "sanity";

export const ctaButton = defineType({
  name: "ctaButton",
  title: "CTA Button",
  type: "object",
  fields: [
    defineField({ name: "label", type: "localizedString", title: "Label" }),
    defineField({ name: "href", type: "string", title: "URL or path" }),
    defineField({
      name: "variant",
      type: "string",
      title: "Variant",
      options: { list: ["primary", "secondary", "ghost"] },
      initialValue: "primary",
    }),
  ],
});
