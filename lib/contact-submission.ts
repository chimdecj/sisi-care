import copy from './prepared-content.json';

export type ContactSubmission = {
  name: string;
  phone: string;
  email: string;
  who: string;
  support: string[];
  when: string;
  message: string;
};

export function isEmail(value: string): boolean {
  return (
    value.length <= 150 &&
    !/[\u0000-\u0020\u007f]/.test(value) &&
    /^[^@<>,;:"\\]+@[^@<>,;:"\\]+\.[^@<>,;:"\\]+$/.test(value)
  );
}

export function parseContactSubmission(value: unknown): ContactSubmission | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const input = value as Record<string, unknown>;
  const field = (key: string, max: number, optional = false): string | null => {
    const raw = input[key] ?? (optional ? '' : null);
    if (typeof raw !== 'string' || raw.length > max) return null;
    const text = raw.trim();
    if ((!optional && !text) || /[\u0000-\u001f\u007f]/.test(text)) return null;
    return text;
  };

  // This field is hidden from visitors and should remain empty.
  if (input.website !== undefined && input.website !== '') return null;
  const name = field('name', 100);
  const phone = field('phone', 30);
  const email = field('email', 150);
  const who = field('who', 60);
  const when = field('when', 60);
  const message = input.message ?? '';
  const support = input.support;
  if (
    !name ||
    !phone ||
    !email ||
    !who ||
    !when ||
    !/^[+()\d .-]+$/.test(phone) ||
    phone.replace(/\D/g, '').length < 7 ||
    !isEmail(email) ||
    !copy.contact.who.includes(who) ||
    !copy.contact.when.includes(when) ||
    !Array.isArray(support) ||
    support.length > copy.contact.support.length ||
    !support.every((item) => typeof item === 'string' && copy.contact.support.includes(item)) ||
    new Set(support).size !== support.length ||
    typeof message !== 'string' ||
    message.length > 1500 ||
    /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(message)
  )
    return null;

  return { name, phone, email, who, support, when, message: message.trim() };
}

export function contactMessage(submission: ContactSubmission): string {
  return [
    'A visitor requested a free care consultation through the Sisi Care website.',
    '',
    `Name: ${submission.name}`,
    `Phone: ${submission.phone}`,
    `Email: ${submission.email}`,
    `Who needs care: ${submission.who}`,
    `Support requested: ${submission.support.join(', ') || 'Not sure yet'}`,
    `Timing: ${submission.when}`,
    '',
    'Additional information:',
    submission.message || 'None provided.',
  ].join('\n');
}
