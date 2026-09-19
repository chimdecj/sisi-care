import { createContactHandler } from '@/lib/contact-handler';

export const runtime = 'nodejs';
export const maxDuration = 60;

export const POST = createContactHandler();
