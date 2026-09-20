import Link from 'next/link';
import {
  ArrowRight,
  Phone,
  CalendarDays,
  Heart,
  Users,
  Sprout,
  type LucideIcon,
} from 'lucide-react';
import { ReferenceImage } from './reference-image';
import { CareLink } from './shared';
import { contact } from '@/lib/content';
import { getContent } from '@/lib/cms/content';
type PageName = 'about' | 'careers' | 'contact';
const icons: Record<PageName, LucideIcon[]> = {
  about: [],
  careers: [Users, Heart, Sprout],
  contact: [],
};
export async function ReferenceHero({ variant }: { variant: PageName }) {
  const { copy } = await getContent();
  const page = copy[variant];
  const proof = variant === 'careers' ? copy.careers.trust : [];
  const title =
    variant === 'about'
      ? page.title.replace(' Experience, ', '|Experience, ').replace(' and Heart', '|and Heart')
      : variant === 'careers'
        ? page.title.replace(' Difference ', '|Difference ')
        : page.title.replace(' Your ', '|Your ');
  return (
    <section className={`reference-hero reference-hero-${variant}`}>
      <div className="reference-hero-photo">
        <ReferenceImage
          name={variant === 'careers' ? 'hero-careers' : 'hero-home'}
          alt={
            variant === 'careers'
              ? 'Three smiling caregivers wearing navy Sisi Care uniforms'
              : 'A caregiver supporting an older woman at home, from the prepared page design'
          }
          priority
          sizes="(max-width: 700px) 100vw, 53vw"
        />
      </div>
      <div className="container reference-hero-inner">
        <div className="reference-hero-copy">
          <p className="eyebrow">{page.eyebrow}</p>
          <h1>
            {title.split('|').map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h1>
          <p className="hero-description">{page.description}</p>
          <div className="hero-actions">
            {variant === 'careers' ? (
              <>
                <Link href="#apply" className="button button-primary">
                  {copy.careers.apply}
                  <ArrowRight size={17} aria-hidden="true" />
                </Link>
                <Link href="#open-positions" className="button button-secondary">
                  {copy.careers.positions}
                </Link>
              </>
            ) : variant === 'contact' ? (
              <>
                <a href={`tel:${contact.tel}`} className="button button-primary phone-button">
                  <Phone size={24} aria-hidden="true" />
                  <span>
                    {copy.contact.call}
                    <strong>{contact.phone}</strong>
                  </span>
                </a>
                <CareLink href="#consultation" secondary>
                  <CalendarDays size={26} aria-hidden="true" />
                  {copy.contact.request}
                </CareLink>
              </>
            ) : (
              <CareLink />
            )}
          </div>
        </div>
        {proof.length > 0 && (
          <div className="hero-proof">
            {proof.map(([title, text], i) => {
              const Icon = icons[variant][i];
              return (
                <div key={title}>
                  <Icon size={32} strokeWidth={2.1} aria-hidden="true" />
                  <span>
                    <strong>{title}</strong>
                    <small>{text}</small>
                  </span>
                </div>
              );
            })}
          </div>
        )}
        <span className="sr-only">
          {copy.common.careMotto}{' '}
          {variant === 'careers'
            ? copy.common.communityMotto
            : variant !== 'contact'
              ? copy.common.connectionMotto
              : ''}
        </span>
      </div>
    </section>
  );
}
