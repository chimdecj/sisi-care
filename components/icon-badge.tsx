import type { LucideIcon } from 'lucide-react';

export function IconBadge({ icon: Icon, className }: { icon: LucideIcon; className: string }) {
  return (
    <span className={`icon-badge ${className}`} aria-hidden="true">
      <Icon size={38} strokeWidth={2} />
    </span>
  );
}
