/**
 * Gmail SMTP Client — sends from Nathan's actual Google account.
 *
 * Emails appear in Sent folder, replies come to inbox.
 * Uses App Password (not OAuth) for simplicity.
 *
 * Env vars:
 *   GMAIL_ADDRESS=nathan@gofal.wales
 *   GMAIL_APP_PASSWORD=xxxx xxxx xxxx xxxx
 */

import nodemailer from "nodemailer";

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (!process.env.GMAIL_ADDRESS || !process.env.GMAIL_APP_PASSWORD) {
    throw new Error("GMAIL_ADDRESS and GMAIL_APP_PASSWORD must be set");
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_ADDRESS,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });
  }

  return transporter;
}

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    const transport = getTransporter();

    const result = await transport.sendMail({
      from: `"Nathan — gofal.wales" <${process.env.GMAIL_ADDRESS}>`,
      to: options.to,
      subject: options.subject,
      html: options.html,
      replyTo: options.replyTo || process.env.GMAIL_ADDRESS,
    });

    return { success: true, messageId: result.messageId };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: message };
  }
}
