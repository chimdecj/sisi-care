import type { Metadata } from 'next';
import { areas, contact, postalAddress } from './business';
import { services } from './content';

// Confirmed public domain. Keep separate from the contact form's allowed origin.
export const siteUrl = 'https://sisicarewa.com';
export const siteName = 'Sisi Care';
export const isIndexable = process.env.SITE_INDEXABLE !== 'false';
export const businessId = `${siteUrl}/#organization`;
export const websiteId = `${siteUrl}/#website`;
export const publicPages = [
  {
    path: '/',
    title: 'In-Home Care in Bellevue & the Eastside',
    description:
      'Sisi Care provides non-medical home care in Bellevue, Kirkland, Redmond, Sammamish and Issaquah. Contact us for a free care consultation.',
  },
  {
    path: '/in-home-care/',
    title: 'In-Home Care Services in Bellevue & the Eastside',
    description:
      'Explore Sisi Care’s personal care, companionship, memory support, respite, 24-hour care and home help in Bellevue and Eastside communities.',
  },
  {
    path: '/about/',
    title: 'About Us | Compassionate Care Since 2014',
    description:
      'Meet Sisi Care, a Kirkland-based home care agency founded in 2014. Learn about our founder, caregivers and approach to non-medical care on the Eastside.',
  },
  {
    path: '/careers/',
    title: 'Caregiver Careers in Bellevue & the Eastside',
    description:
      'Explore caregiving opportunities with Sisi Care in Bellevue and the Eastside. Learn about our team, caregiver responsibilities and how to apply.',
  },
  {
    path: '/contact/',
    title: 'Contact Us | Free Home Care Consultation',
    description:
      'Contact Sisi Care at (206) 334-3505 or info@sisicarewa.com for a free home care consultation. Serving Bellevue and the Eastside from Kirkland, WA.',
  },
];

export function absoluteUrl(path: string) {
  if (!path.startsWith('/') || path.startsWith('//')) throw new Error('Expected a local site path');
  const url = new URL(path, siteUrl);
  if (url.origin !== siteUrl) throw new Error('Expected a local site path');
  return url.toString();
}
export function pageMetadata(path: string): Metadata {
  const page = publicPages.find((item) => item.path === path);
  if (!page) throw new Error(`Missing metadata for ${path}`);
  const title = `${page.title} | ${siteName}`;
  const image = {
    url: absoluteUrl('/opengraph-image'),
    width: 1200,
    height: 630,
    alt: 'Sisi Care — compassionate in-home care in Bellevue and the Eastside',
  };
  return {
    title: { absolute: title },
    description: page.description,
    alternates: { canonical: absoluteUrl(path) },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      siteName,
      title,
      description: page.description,
      url: absoluteUrl(path),
      images: [image],
    },
    twitter: { card: 'summary_large_image', title, description: page.description, images: [image] },
  };
}
export function areaServed() {
  return areas.map((name) => ({ '@type': 'City', name: `${name}, WA` }));
}
export function organizationGraph() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': websiteId,
        url: absoluteUrl('/'),
        name: siteName,
        inLanguage: 'en-US',
        publisher: { '@id': businessId },
      },
      {
        '@type': 'LocalBusiness',
        '@id': businessId,
        name: siteName,
        url: absoluteUrl('/'),
        description: 'Non-medical home care in Bellevue and the Eastside of Washington.',
        telephone: contact.tel,
        email: contact.email,
        address: postalAddress,
        areaServed: areaServed(),
        foundingDate: '2014',
        logo: absoluteUrl('/images/sisi-care-logo-hd.png'),
        image: absoluteUrl('/images/enhenced-new/hero.jpg'),
        hasMap: contact.maps,
        openingHoursSpecification: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '09:00',
          closes: '17:00',
          description: 'Office hours',
        },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'In-Home Care Services',
          itemListElement: services.map(({ id, title, description }) => ({
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: title,
              description,
              url: absoluteUrl(`/in-home-care/#${id}`),
              provider: { '@id': businessId },
            },
          })),
        },
      },
    ],
  };
}
export function pageGraph(path: string) {
  const page = publicPages.find((item) => item.path === path);
  if (!page) throw new Error(`Missing page data for ${path}`);
  const url = absoluteUrl(path);
  return {
    '@context': 'https://schema.org',
    '@type': path === '/about/' ? 'AboutPage' : path === '/contact/' ? 'ContactPage' : 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: page.title,
    description: page.description,
    inLanguage: 'en-US',
    isPartOf: { '@id': websiteId },
    about: { '@id': businessId },
  };
}
export function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}
