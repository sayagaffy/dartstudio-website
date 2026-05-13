import { defineField, defineType } from "sanity";

export const faq = defineType({
  name: "faq",
  title: "FAQ",
  type: "document",
  fields: [
    defineField({
      name: "question",
      title: "Question",
      type: "localizedString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "answer",
      title: "Answer",
      type: "localizedRichText",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "topic",
      title: "Topic",
      type: "string",
      description: "Tag for grouping (e.g. 'pricing', 'process', 'team').",
    }),
  ],
  preview: {
    select: { question: "question.id", topic: "topic" },
    prepare({ question, topic }: { question?: string; topic?: string }) {
      return { title: question ?? "(no question)", subtitle: topic };
    },
  },
});
