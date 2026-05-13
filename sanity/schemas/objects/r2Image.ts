import { defineField, defineType } from "sanity";
import { R2ImageInput } from "../../components/R2ImageInput";

export const r2Image = defineType({
  name: "r2Image",
  title: "Image (R2)",
  type: "object",
  fields: [
    defineField({ name: "url", title: "URL", type: "url" }),
    defineField({ name: "alt", title: "Alt text", type: "string" }),
    defineField({ name: "width", title: "Width", type: "number" }),
    defineField({ name: "height", title: "Height", type: "number" }),
    defineField({ name: "caption", title: "Caption", type: "localizedString" }),
  ],
  components: { input: R2ImageInput },
});
