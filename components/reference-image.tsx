import Image from 'next/image';
import { getContent } from '@/lib/cms/content';
import type { ImageKey } from '@/lib/cms/schema';
import careersHero from '@/public/images/enhenced-new/careers-hero-asia.jpg';

export type ReferenceAsset = ImageKey;

export async function ReferenceImage({
  name,
  alt,
  className,
  priority = false,
  sizes,
}: {
  name: ReferenceAsset;
  alt: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  const { images } = await getContent();
  const source = images[name];
  // Static imports include a content hash, so replacing this file refreshes its cache.
  // Keep published admin uploads authoritative over the bundled photo.
  const imageSource =
    name === 'hero-careers' && source.src === '/images/enhenced-new/careers-hero-asia.jpg'
      ? careersHero
      : source;

  return (
    <Image
      src={imageSource.src}
      alt={alt}
      width={imageSource.width}
      height={imageSource.height}
      className={className}
      preload={priority}
      sizes={sizes ?? '(max-width: 760px) 100vw, 50vw'}
    />
  );
}
