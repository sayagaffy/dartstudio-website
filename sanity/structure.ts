import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site Settings")
        .id("siteSettings")
        .child(S.editor().id("siteSettings").schemaType("siteSettings").documentId("siteSettings")),
      S.divider(),
      S.listItem().title("Pages").child(S.documentTypeList("page").title("Pages")),
      S.listItem()
        .title("Collaborate Models")
        .child(S.documentTypeList("collaborateModel").title("Collaborate Models")),
      S.listItem().title("Products").child(S.documentTypeList("product").title("Products")),
      S.divider(),
      S.listItem()
        .title("Journal")
        .child(
          S.list()
            .title("Journal")
            .items([
              S.listItem()
                .title("All Posts")
                .child(S.documentTypeList("journalPost").title("Journal Posts")),
              S.listItem()
                .title("Categories")
                .child(S.documentTypeList("journalCategory").title("Categories")),
            ]),
        ),
      S.divider(),
      S.listItem().title("People").child(S.documentTypeList("person").title("People")),
      S.listItem().title("FAQs").child(S.documentTypeList("faq").title("FAQs")),
    ]);
