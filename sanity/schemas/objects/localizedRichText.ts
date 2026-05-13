import { defineField, defineType } from "sanity";

const portableTextBlocks = [
  {
    type: "block",
    styles: [
      { title: "Normal", value: "normal" },
      { title: "H2", value: "h2" },
      { title: "H3", value: "h3" },
      { title: "H4", value: "h4" },
      { title: "Quote", value: "blockquote" },
    ],
    marks: {
      decorators: [
        { title: "Strong", value: "strong" },
        { title: "Emphasis", value: "em" },
        { title: "Code", value: "code" },
      ],
      annotations: [
        {
          name: "link",
          type: "object",
          title: "Link",
          fields: [
            { name: "href", type: "url", title: "URL" },
            { name: "external", type: "boolean", title: "External" },
          ],
        },
      ],
    },
    lists: [
      { title: "Bullet", value: "bullet" },
      { title: "Numbered", value: "number" },
    ],
  },
  {
    type: "r2Image",
  },
  {
    type: "object",
    name: "codeBlock",
    title: "Code Block",
    fields: [
      { name: "language", type: "string", title: "Language" },
      { name: "code", type: "text", title: "Code", rows: 10 },
    ],
  },
];

export const localizedRichText = defineType({
  name: "localizedRichText",
  title: "Localized Rich Text",
  type: "object",
  fields: [
    defineField({
      name: "id",
      title: "Bahasa Indonesia",
      type: "array",
      of: portableTextBlocks,
    }),
    defineField({
      name: "en",
      title: "English",
      type: "array",
      of: portableTextBlocks,
    }),
  ],
});
