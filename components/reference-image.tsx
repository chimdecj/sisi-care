import Image from 'next/image';
import sources from '@/public/images/reference/sources.json';
import enhancedSources from '@/public/images/enhanced/sources.json';

export type ReferenceAsset = keyof typeof sources;
type EnhancedAsset = keyof typeof enhancedSources;

export function ReferenceImage({
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
  // Restored files keep the reference aspect ratio, so existing layouts stay stable.
  const enhanced = Object.hasOwn(enhancedSources, name)
    ? enhancedSources[name as EnhancedAsset]
    : undefined;
  const source = enhanced ?? sources[name];

  return (
    <Image
      src={enhanced?.src ?? `/images/reference/${name}.webp`}
      alt={alt}
      width={source.width}
      height={source.height}
      className={className}
      priority={priority}
      sizes={sizes}
    />
  );
}
