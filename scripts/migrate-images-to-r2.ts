/**
 * One-time migration script: Sanity CDN images → Cloudflare R2
 *
 * Usage:
 *   npm run migrate:images
 *
 * What it does:
 *   - Finds all Sanity documents that still have old-format image fields
 *     (asset._ref reference, uploaded via Sanity Studio)
 *   - Downloads each image from Sanity CDN
 *   - Compresses to WebP (max 1920px, quality 80) via Sharp
 *   - Uploads to Cloudflare R2
 *   - Patches the Sanity document with the new r2Image value { url, alt, width, height }
 *
 * Covered document types:
 *   - person.photo
 *   - journalPost.heroImage
 *   - product.heroImage + capabilities[].image
 *   - siteSettings.logo + logoLight
 *   - seoMetadata.ogImage (on any document)
 */

import crypto from "node:crypto";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { createClient } from "next-sanity";
import sharp from "sharp";

// ── Validate required env vars ──────────────────────────────────────────────

const required = [
  "NEXT_PUBLIC_SANITY_PROJECT_ID",
  "SANITY_API_WRITE_TOKEN",
  "R2_ACCOUNT_ID",
  "R2_ACCESS_KEY_ID",
  "R2_SECRET_ACCESS_KEY",
  "R2_BUCKET_NAME",
  "R2_PUBLIC_URL",
] as const;

for (const key of required) {
  if (!process.env[key]) {
    console.error(`✗ Missing env var: ${key}`);
    process.exit(1);
  }
}

// ── Clients ─────────────────────────────────────────────────────────────────

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2024-12-01",
  token: process.env.SANITY_API_WRITE_TOKEN!,
  useCdn: false,
});

const r2 = new S3Client({
  region: "auto",
  endpoint: `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

// ── Core helper ──────────────────────────────────────────────────────────────

type R2ImageResult = { url: string; width: number; height: number };

async function downloadCompressUpload(sourceUrl: string): Promise<R2ImageResult | null> {
  try {
    const res = await fetch(sourceUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());

    const { data, info } = await sharp(buffer)
      .resize({ width: 1920, withoutEnlargement: true })
      .webp({ quality: 80 })
      .toBuffer({ resolveWithObject: true });

    const key = `images/${Date.now()}-${crypto.randomUUID().split("-")[0]}.webp`;

    await r2.send(
      new PutObjectCommand({
        Bucket: process.env.R2_BUCKET_NAME!,
        Key: key,
        Body: data,
        ContentType: "image/webp",
        CacheControl: "public, max-age=31536000, immutable",
      }),
    );

    return {
      url: `${process.env.R2_PUBLIC_URL}/${key}`,
      width: info.width,
      height: info.height,
    };
  } catch (err) {
    console.error(`    ✗ Upload failed (${sourceUrl}):`, (err as Error).message);
    return null;
  }
}

async function migrateField(
  sourceUrl: string | undefined | null,
  alt?: string | null,
): Promise<Record<string, unknown> | null> {
  if (!sourceUrl) return null;
  console.log(`    ↓ ${sourceUrl.slice(0, 80)}...`);
  const result = await downloadCompressUpload(sourceUrl);
  if (!result) return null;
  console.log(`    ✓ → ${result.url}`);
  return { url: result.url, alt: alt ?? "", width: result.width, height: result.height };
}

// ── Document migrations ──────────────────────────────────────────────────────

async function migratePeople() {
  console.log("\n── person.photo ──────────────────────────────────────────────");
  const docs = await sanity.fetch<
    Array<{ _id: string; name: string; photoUrl: string | null; photoAlt: string | null }>
  >(
    `*[_type == "person" && defined(photo.asset._ref)] {
       _id, name,
       "photoUrl": photo.asset->url,
       "photoAlt": photo.alt
     }`,
  );
  console.log(`Found ${docs.length} person(s) with Sanity photo`);

  for (const doc of docs) {
    console.log(`  ${doc.name} (${doc._id})`);
    const r2img = await migrateField(doc.photoUrl, doc.photoAlt);
    if (!r2img) continue;
    await sanity.patch(doc._id).set({ photo: r2img }).commit();
  }
}

async function migrateJournalPosts() {
  console.log("\n── journalPost.heroImage ─────────────────────────────────────");
  const docs = await sanity.fetch<
    Array<{
      _id: string;
      titleId: string | null;
      heroImageUrl: string | null;
      heroImageAlt: string | null;
    }>
  >(
    `*[_type == "journalPost" && defined(heroImage.asset._ref)] {
       _id, "titleId": title.id,
       "heroImageUrl": heroImage.asset->url,
       "heroImageAlt": heroImage.alt
     }`,
  );
  console.log(`Found ${docs.length} post(s) with Sanity heroImage`);

  for (const doc of docs) {
    console.log(`  ${doc.titleId ?? doc._id}`);
    const r2img = await migrateField(doc.heroImageUrl, doc.heroImageAlt);
    if (!r2img) continue;
    await sanity.patch(doc._id).set({ heroImage: r2img }).commit();
  }
}

async function migrateProducts() {
  console.log("\n── product.heroImage + capabilities ──────────────────────────");
  const docs = await sanity.fetch<
    Array<{
      _id: string;
      name: string;
      heroImageUrl: string | null;
      heroImageAlt: string | null;
      capabilities: Array<{ _key: string; imageUrl: string | null }> | null;
    }>
  >(
    `*[_type == "product" && (defined(heroImage.asset._ref) || defined(capabilities[].image.asset._ref))] {
       _id, name,
       "heroImageUrl": heroImage.asset->url,
       "heroImageAlt": heroImage.alt,
       "capabilities": capabilities[] { _key, "imageUrl": image.asset->url }
     }`,
  );
  console.log(`Found ${docs.length} product(s)`);

  for (const doc of docs) {
    console.log(`  ${doc.name} (${doc._id})`);

    if (doc.heroImageUrl) {
      console.log("  heroImage:");
      const r2img = await migrateField(doc.heroImageUrl, doc.heroImageAlt);
      if (r2img) await sanity.patch(doc._id).set({ heroImage: r2img }).commit();
    }

    if (doc.capabilities) {
      for (const cap of doc.capabilities) {
        if (!cap.imageUrl) continue;
        console.log(`  capability[${cap._key}].image:`);
        const r2img = await migrateField(cap.imageUrl);
        if (!r2img) continue;
        await sanity
          .patch(doc._id)
          .set({ [`capabilities[_key=="${cap._key}"].image`]: r2img })
          .commit();
      }
    }
  }
}

async function migrateSiteSettings() {
  console.log("\n── siteSettings.logo + logoLight ─────────────────────────────");
  const doc = await sanity.fetch<{
    _id: string;
    logoUrl: string | null;
    logoLightUrl: string | null;
  } | null>(
    `*[_type == "siteSettings"][0] {
       _id,
       "logoUrl": logo.asset->url,
       "logoLightUrl": logoLight.asset->url
     }`,
  );

  if (!doc) {
    console.log("No siteSettings document found");
    return;
  }

  if (doc.logoUrl) {
    console.log("  logo:");
    const r2img = await migrateField(doc.logoUrl);
    if (r2img) await sanity.patch(doc._id).set({ logo: r2img }).commit();
  } else {
    console.log("  logo: no Sanity asset, skipping");
  }

  if (doc.logoLightUrl) {
    console.log("  logoLight:");
    const r2img = await migrateField(doc.logoLightUrl);
    if (r2img) await sanity.patch(doc._id).set({ logoLight: r2img }).commit();
  } else {
    console.log("  logoLight: no Sanity asset, skipping");
  }
}

async function migrateSeoOgImages() {
  console.log("\n── seo.ogImage (all document types) ─────────────────────────");
  const docs = await sanity.fetch<Array<{ _id: string; _type: string; ogImageUrl: string | null }>>(
    `*[defined(seo.ogImage.asset._ref)] {
       _id, _type,
       "ogImageUrl": seo.ogImage.asset->url
     }`,
  );
  console.log(`Found ${docs.length} document(s) with Sanity seo.ogImage`);

  for (const doc of docs) {
    console.log(`  ${doc._type} ${doc._id}`);
    const r2img = await migrateField(doc.ogImageUrl);
    if (!r2img) continue;
    await sanity.patch(doc._id).set({ "seo.ogImage": r2img }).commit();
  }
}

// ── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log("🚀  Sanity CDN → Cloudflare R2  image migration");
  console.log(`    Project : ${process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}`);
  console.log(`    Dataset : ${process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production"}`);
  console.log(`    R2 bucket: ${process.env.R2_BUCKET_NAME}`);
  console.log(`    R2 URL   : ${process.env.R2_PUBLIC_URL}`);

  await migratePeople();
  await migrateJournalPosts();
  await migrateProducts();
  await migrateSiteSettings();
  await migrateSeoOgImages();

  console.log("\n✅  Migration complete!");
}

main().catch((err) => {
  console.error("\n✗ Migration failed:", err);
  process.exit(1);
});
