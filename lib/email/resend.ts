import "server-only";
import { Resend } from "resend";
import { env } from "@/lib/env";

export const resend = new Resend(env.RESEND_API_KEY ?? "");

export const EMAIL_FROM = env.CONTACT_FROM_EMAIL;
export const EMAIL_TO = env.CONTACT_TO_EMAIL;
