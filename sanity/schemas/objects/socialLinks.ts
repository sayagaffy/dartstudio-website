import { defineField, defineType } from "sanity";

export const socialLinks = defineType({
  name: "socialLinks",
  title: "Social Links",
  type: "object",
  fields: [
    defineField({ name: "twitter", type: "url", title: "X / Twitter" }),
    defineField({ name: "linkedin", type: "url", title: "LinkedIn" }),
    defineField({ name: "github", type: "url", title: "GitHub" }),
    defineField({ name: "email", type: "string", title: "Public email" }),
  ],
});
