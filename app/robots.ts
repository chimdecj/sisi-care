import type { MetadataRoute } from 'next';
import { absoluteUrl, isIndexable } from '@/lib/seo';
export default function robots(): MetadataRoute.Robots {
  return isIndexable
    ? {
        rules: { userAgent: '*', allow: '/', disallow: '/api/' },
        sitemap: absoluteUrl('/sitemap.xml'),
      }
    : { rules: { userAgent: '*', allow: '/', disallow: '/api/' } };
  // Staging stays crawlable so crawlers can see the noindex metadata.
}
