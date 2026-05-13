import groq from "groq";

export const SITE_SETTINGS_QUERY = groq`
  *[_type == "siteSettings"][0] {
    siteName,
    siteTagline,
    siteDescription,
    logo,
    logoLight,
    principles[] { title, body },
    socialLinks,
    contactEmail,
    defaultSeo,
    navigationLabels,
    footerColumns[] {
      heading,
      links[] { label, href }
    }
  }
`;

export const COLLABORATE_MODELS_QUERY = groq`
  *[_type == "collaborateModel"] | order(displayOrder asc) {
    _id,
    modelKey,
    name,
    shortDescriptor,
    heroHeading,
    heroSubheading
  }
`;

export const COLLABORATE_MODEL_QUERY = groq`
  *[_type == "collaborateModel" && modelKey == $modelKey][0] {
    ...,
    "faqs": faqs[]-> { _id, question, answer, topic },
    ctaPrimary,
    ctaSecondary
  }
`;

export const FEATURED_PRODUCTS_QUERY = groq`
  *[_type == "product" && featured == true] | order(displayOrder asc) [0...3] {
    _id,
    name,
    slug,
    tagline,
    status,
    heroImage
  }
`;

export const PRODUCTS_QUERY = groq`
  *[_type == "product"] | order(displayOrder asc) {
    _id,
    name,
    slug,
    tagline,
    status,
    heroImage
  }
`;

export const PRODUCT_QUERY = groq`
  *[_type == "product" && slug.current == $slug][0] {
    ...,
    "relatedJournalPosts": relatedJournalPosts[]-> {
      _id, title, slug, slugEn, excerpt, publishedAt
    },
    "faqs": faqs[]-> { _id, question, answer, topic }
  }
`;

export const LATEST_JOURNAL_POSTS_QUERY = groq`
  *[_type == "journalPost" && defined(publishedAt) && publishedAt <= now()]
  | order(publishedAt desc) [0...3] {
    _id,
    title,
    subtitle,
    slug,
    slugEn,
    excerpt,
    publishedAt,
    "category": category-> { _id, title, slug },
    "author": author-> { _id, name, photo }
  }
`;

export const JOURNAL_POSTS_QUERY = groq`
  *[_type == "journalPost" && defined(publishedAt) && publishedAt <= now()]
  | order(publishedAt desc) {
    _id,
    title,
    subtitle,
    slug,
    slugEn,
    excerpt,
    publishedAt,
    "category": category-> { _id, title, slug },
    "author": author-> { _id, name, photo }
  }
`;

export const JOURNAL_POST_QUERY = groq`
  *[_type == "journalPost" && (slug.current == $slug || slugEn.current == $slug)][0] {
    ...,
    "category": category-> { _id, title, slug },
    "author": author-> { _id, name, role, photo, bio, slug },
    "relatedPosts": relatedPosts[]-> {
      _id, title, slug, slugEn, excerpt, publishedAt,
      "category": category-> { _id, title, slug }
    }
  }
`;

export const JOURNAL_POSTS_BY_CATEGORY_QUERY = groq`
  *[_type == "journalPost" && category->slug.current == $categorySlug
    && defined(publishedAt) && publishedAt <= now()]
  | order(publishedAt desc) {
    _id, title, subtitle, slug, slugEn, excerpt, publishedAt,
    "category": category-> { _id, title, slug },
    "author": author-> { _id, name, photo }
  }
`;

export const JOURNAL_CATEGORIES_QUERY = groq`
  *[_type == "journalCategory"] {
    _id, title, slug, description,
    "postCount": count(*[_type == "journalPost" && references(^._id) && defined(publishedAt) && publishedAt <= now()])
  }
`;

export const PEOPLE_QUERY = groq`
  *[_type == "person"] | order(displayOrder asc) {
    _id, name, slug, role, bio, photo, socialLinks
  }
`;

export const ALL_SLUGS_QUERY = groq`
  {
    "products": *[_type == "product"] { "slug": slug.current, _updatedAt },
    "journalPosts": *[_type == "journalPost" && defined(publishedAt) && publishedAt <= now()] {
      "slug": slug.current, "slugEn": slugEn.current, _updatedAt, publishedAt
    },
    "journalCategories": *[_type == "journalCategory"] { "slug": slug.current, _updatedAt },
    "people": *[_type == "person"] { "slug": slug.current, _updatedAt }
  }
`;

export const PAGE_QUERY = groq`
  *[_type == "page" && pageKey == $pageKey][0] {
    ...,
    ctaPrimary,
    ctaSecondary
  }
`;
