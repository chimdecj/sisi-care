import type { Metadata } from 'next';
import './globals.css';
import copy from '@/lib/prepared-content.json';
import { Header } from '@/components/header';
import { SiteFooter } from '@/components/site-footer';
export const metadata: Metadata = {
  title: { default: 'Sisi Care | A Brighter Tomorrow at Home', template: '%s | Sisi Care' },
  description: copy.home.description,
  icons: { icon: '/images/sisi-care-logo.png', apple: '/images/sisi-care-logo.png' },
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Header />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
