import type { Metadata } from 'next';
import '@fontsource/dm-sans/400.css';
import '@fontsource/dm-sans/500.css';
import '@fontsource/dm-sans/600.css';
import '@fontsource/dm-sans/700.css';
import '@fontsource/lora/400.css';
import '@fontsource/lora/500.css';
import '@fontsource/lora/400-italic.css';
import './globals.css';
import { Header } from '@/components/header';
import { Footer } from '@/components/shared';
export const metadata: Metadata = {
  title: { default: 'Sisi Care | A Brighter Tomorrow at Home', template: '%s | Sisi Care' },
  description: 'Compassionate, personalized non-medical in-home care for seniors and adults in Bellevue, Kirkland, Redmond and the Eastside. Call (206) 334-3505 for a free consultation.',
  icons: { icon: '/images/sisi-care-logo.png', apple: '/images/sisi-care-logo.png' },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body><a href="#main" className="skip-link">Skip to content</a><Header /><main id="main">{children}</main><Footer /></body></html>;
}
