import "server-only";
import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "@/lib/env";

export const r2Client = new S3Client({
  region: "auto",
  endpoint: `https://${env.R2_ACCOUNT_ID ?? ""}.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: env.R2_ACCESS_KEY_ID ?? "",
    secretAccessKey: env.R2_SECRET_ACCESS_KEY ?? "",
  },
});

export const R2_BUCKET = env.R2_BUCKET_NAME ?? "dartstudio-media";
export const R2_PUBLIC_URL = env.R2_PUBLIC_URL ?? "";

export async function uploadToR2(opts: {
  key: string;
  body: Buffer | Uint8Array | Blob;
  contentType: string;
  cacheControl?: string;
}): Promise<{ url: string; key: string }> {
  await r2Client.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: opts.key,
      Body: opts.body,
      ContentType: opts.contentType,
      CacheControl: opts.cacheControl ?? "public, max-age=31536000, immutable",
    }),
  );
  return { key: opts.key, url: r2PublicUrl(opts.key) };
}

export async function getPresignedUploadUrl(opts: {
  key: string;
  contentType: string;
  expiresInSeconds?: number;
}): Promise<string> {
  return getSignedUrl(
    r2Client,
    new PutObjectCommand({ Bucket: R2_BUCKET, Key: opts.key, ContentType: opts.contentType }),
    { expiresIn: opts.expiresInSeconds ?? 600 },
  );
}

export async function getPresignedReadUrl(opts: {
  key: string;
  expiresInSeconds?: number;
}): Promise<string> {
  return getSignedUrl(r2Client, new GetObjectCommand({ Bucket: R2_BUCKET, Key: opts.key }), {
    expiresIn: opts.expiresInSeconds ?? 3600,
  });
}

export function r2PublicUrl(key: string): string {
  return `${R2_PUBLIC_URL.replace(/\/$/, "")}/${key.replace(/^\//, "")}`;
}
