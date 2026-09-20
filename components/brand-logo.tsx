import Image from 'next/image';

// One approved wordmark for every header, footer, and call-to-action banner.
export function BrandLogo({
  tagline = 'In-Home Care • A Brighter Tomorrow at Home',
  className = '',
  priority = false,
}: {
  tagline?: string;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/images/sisi-care-logo-hd.png"
      width={1152}
      height={296}
      alt={`Sisi Care — ${tagline}`}
      className={`brand-logo ${className}`}
      preload={priority}
      sizes="(max-width: 600px) 248px, 280px"
    />
  );
}
