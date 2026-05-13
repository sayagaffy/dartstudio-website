// Objects (registered globally, used inline)

import { collaborateModel } from "./documents/collaborateModel";
// Documents
import { faq } from "./documents/faq";
import { journalCategory } from "./documents/journalCategory";
import { journalPost } from "./documents/journalPost";
import { page } from "./documents/page";
import { person } from "./documents/person";
import { product } from "./documents/product";
import { ctaButton } from "./objects/ctaButton";
import { localizedRichText } from "./objects/localizedRichText";
import { localizedString } from "./objects/localizedString";
import { localizedText } from "./objects/localizedText";
import { principle } from "./objects/principle";
import { seoMetadata } from "./objects/seoMetadata";
import { socialLinks } from "./objects/socialLinks";

// Singletons
import { siteSettings } from "./singletons/siteSettings";

export const schemaTypes = [
  localizedString,
  localizedText,
  localizedRichText,
  seoMetadata,
  ctaButton,
  principle,
  socialLinks,
  faq,
  journalCategory,
  person,
  journalPost,
  product,
  collaborateModel,
  page,
  siteSettings,
];
