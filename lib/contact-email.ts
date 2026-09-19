import 'server-only';
import nodemailer from 'nodemailer';
import { contact } from './content';
import { contactMessage, isEmail, type ContactSubmission } from './contact-submission';

export async function sendContactEmail(
  submission: ContactSubmission,
): Promise<'sent' | 'unconfigured'> {
  const user = process.env.SMTP_USER?.trim();
  const password = process.env.SMTP_PASSWORD?.replace(/\s/g, '');
  const from = process.env.SMTP_FROM?.trim() || user;
  const to = process.env.CONTACT_TO?.trim() || contact.email;
  const port = Number(process.env.SMTP_PORT || 465);
  const secure = process.env.SMTP_SECURE !== 'false';
  if (
    !user ||
    !isEmail(user) ||
    !password ||
    !from ||
    !isEmail(from) ||
    !isEmail(to) ||
    !Number.isInteger(port) ||
    port < 1 ||
    port > 65535
  )
    return 'unconfigured';

  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST?.trim() || 'smtp.gmail.com',
    port,
    secure,
    requireTLS: !secure,
    auth: { user, pass: password },
    connectionTimeout: 10_000,
    greetingTimeout: 5_000,
    socketTimeout: 15_000,
    dnsTimeout: 5_000,
    disableFileAccess: true,
    disableUrlAccess: true,
  });

  try {
    const info = await transport.sendMail({
      from: { name: 'Sisi Care website', address: from },
      to: { name: 'Sisi Care', address: to },
      replyTo: { name: submission.name, address: submission.email },
      subject: 'Free care consultation request',
      text: contactMessage(submission),
      disableFileAccess: true,
      disableUrlAccess: true,
      xMailer: false,
    });
    if (!info.accepted.length || info.rejected.length) {
      throw new Error('Contact email was not accepted.');
    }
    return 'sent';
  } finally {
    transport.close();
  }
}
