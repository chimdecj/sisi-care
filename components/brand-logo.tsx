import Image from 'next/image';
import copy from '@/lib/prepared-content.json';

// One approved wordmark for every header, footer, and call-to-action banner.
export function BrandLogo({
  className = '',
  priority = false,
}: {
  className?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/images/sisi-care-logo-hd.png"
      width={1152}
      height={296}
      alt={`Sisi Care — ${copy.common.brandTagline}`}
      className={`brand-logo ${className}`}
      preload={priority}
      sizes="(max-width: 600px) 248px, 280px"
    />
  );
}
