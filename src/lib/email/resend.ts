/**
 * Resend Email Client — sends transactional and personal email via Resend.
 *
 * Env vars:
 *   RESEND_API_KEY          — Resend API key
 *   RESEND_FROM_NATHAN      — personal from (default: "Nathan Bowen <nathan@gofal.wales>")
 *   RESEND_FROM_HELLO       — transactional from (default: "gofal.wales <hello@gofal.wales>")
 *   RESEND_REPLY_TO         — default reply-to (default: "nathan@gofal.wales")
 */

import { Resend } from "resend";

let resendClient: Resend | null = null;

function getClient(): Resend {
  if (!process.env.RESEND_API_KEY) {
    throw new Error("RESEND_API_KEY must be set");
  }

  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY);
  }

  return resendClient;
}

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  from?: string;
  replyTo?: string;
}

interface EmailResult {
  success: boolean;
  id?: string;
  error?: string;
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
  from,
  replyTo,
}: SendEmailOptions): Promise<EmailResult> {
  try {
    const client = getClient();

    const { data, error } = await client.emails.send({
      from:
        from ||
        process.env.RESEND_FROM_NATHAN ||
        "Nathan Bowen <nathan@gofal.wales>",
      to,
      subject,
      html,
      ...(text ? { text } : {}),
      replyTo:
        replyTo || process.env.RESEND_REPLY_TO || "nathan@gofal.wales",
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: message };
  }
}

interface TransactionalEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendTransactionalEmail({
  to,
  subject,
  html,
  text,
}: TransactionalEmailOptions): Promise<EmailResult> {
  try {
    const client = getClient();

    const { data, error } = await client.emails.send({
      from:
        process.env.RESEND_FROM_HELLO || "gofal.wales <hello@gofal.wales>",
      to,
      subject,
      html,
      ...(text ? { text } : {}),
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: message };
  }
}
