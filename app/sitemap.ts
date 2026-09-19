import type { MetadataRoute } from 'next';
import { absoluteUrl, isIndexable, publicPages } from '@/lib/seo';
export default function sitemap(): MetadataRoute.Sitemap {
  return isIndexable ? publicPages.map(({ path }) => ({ url: absoluteUrl(path) })) : [];
}
