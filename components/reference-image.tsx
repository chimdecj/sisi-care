import Image from 'next/image';
import sources from '@/public/images/enhanced/sources.json';

export type ReferenceAsset = keyof typeof sources;

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
  const source = sources[name];

  return (
    <Image
      src={source.src}
      alt={alt}
      width={source.width}
      height={source.height}
      className={className}
      priority={priority}
      sizes={sizes}
    />
  );
}
