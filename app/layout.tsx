import { getContent } from '@/lib/cms/content';
import type { Metadata } from 'next';
import './globals.css';
import { isIndexable, organizationGraph, siteUrl } from '@/lib/seo';
import { StructuredData } from '@/components/structured-data';
import { Header } from '@/components/header';
import { SiteFooter } from '@/components/site-footer';
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Sisi Care | In-Home Care in Bellevue & the Eastside',
    template: '%s | Sisi Care',
  },
  applicationName: 'Sisi Care',
  robots: isIndexable
    ? {
        index: true,
        follow: true,
        googleBot: {
          index: true,
          follow: true,
          'max-image-preview': 'large',
          'max-snippet': -1,
          'max-video-preview': -1,
        },
      }
    : { index: false, follow: false },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.BING_SITE_VERIFICATION
      ? { 'msvalidate.01': process.env.BING_SITE_VERIFICATION }
      : undefined,
  },
  icons: { icon: '/images/sisi-care-logo.png', apple: '/images/sisi-care-logo.png' },
};
export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const { copy } = await getContent();
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <StructuredData data={organizationGraph(copy.home.services)} />
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Header tagline={copy.common.brandTagline} />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
