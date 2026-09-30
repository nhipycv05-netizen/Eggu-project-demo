import nodemailer, { type Transporter } from 'nodemailer';

let transporter: Transporter | null = null;

/**
 * Gmail SMTP transporter (server-only). Credentials come from env:
 * GMAIL_USER + GMAIL_APP_PASSWORD (a Google App Password, not the account password).
 * Returns null if not configured so callers can skip sending gracefully.
 */
export function getMailer(): Transporter | null {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    return null;
  }

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: { user, pass },
    });
  }

  return transporter;
}
