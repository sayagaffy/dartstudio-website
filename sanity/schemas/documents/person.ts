import { defineField, defineType } from "sanity";

export const person = defineType({
  name: "person",
  title: "Person",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
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
      name: "role",
      title: "Role",
      type: "localizedString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "bio",
      title: "Bio (short)",
      type: "localizedText",
      description: "1-2 sentences for cards and bylines.",
    }),
    defineField({
      name: "trajectory",
      title: "Trajectory (long)",
      type: "localizedRichText",
      description: "Full bio for individual partner page.",
    }),
    defineField({
      name: "photo",
      title: "Photo",
      type: "image",
      options: { hotspot: true },
      fields: [{ name: "alt", type: "string", title: "Alt text" }],
    }),
    defineField({
      name: "socialLinks",
      title: "Social Links",
      type: "socialLinks",
    }),
    defineField({
      name: "memberGroup",
      title: "Member Group",
      type: "string",
      description: "Kosongkan = otomatis masuk Pegiat (Protagonist).",
      options: {
        list: [
          { title: "Pegiat (Protagonist) — tim inti", value: "protagonist" },
          { title: "Anggota Perkumpulan (Circle) — komunitas luas", value: "circle" },
        ],
        layout: "radio",
      },
      initialValue: "protagonist",
    }),
    defineField({
      name: "displayOrder",
      title: "Display Order",
      type: "number",
      description: "Lower numbers appear first.",
      initialValue: 0,
    }),
    defineField({
      name: "seo",
      title: "SEO",
      type: "seoMetadata",
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "role.id", media: "photo" },
    prepare({ title, subtitle, media }) {
      return { title, subtitle, media };
    },
  },
});
