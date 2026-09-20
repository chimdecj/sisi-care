import { CalendarDays, Heart, Phone, Users } from 'lucide-react';
import { ReferenceImage } from './reference-image';
import { CareLink } from './shared';
import { contact } from '@/lib/content';
import { getContent } from '@/lib/cms/content';

export async function HomeHero() {
  const { copy } = await getContent();
  const icons = [CalendarDays, Heart, Users];
  return (
    <section className="home-hero" aria-labelledby="home-heading">
      <div className="page-hero-photo">
        <ReferenceImage
          name="hero-home"
          alt="A Sisi Care caregiver sharing a smile with an older woman at home"
          priority
          sizes="(max-width: 760px) 100vw, 50vw"
        />
      </div>
      <div className="container page-hero-inner">
        <div className="page-hero-copy">
          <p className="eyebrow">{copy.home.eyebrow}</p>
          <h1 id="home-heading">
            {copy.home.title
              .split(' for ')
              .map((line, i) => (i === 0 ? line : <span key={i}>for {line}</span>))}
          </h1>
          <p className="page-hero-description">{copy.home.description}</p>
          <div className="page-hero-actions">
            <CareLink />
            <a href={`tel:${contact.tel}`} className="button button-secondary phone-button">
              <Phone size={28} aria-hidden="true" />
              <span>
                {copy.home.call}
                <strong>{contact.phone}</strong>
              </span>
            </a>
          </div>
        </div>
        <div className="page-hero-proof home-hero-proof">
          {copy.home.trust.map(([title, description], i) => {
            const Icon = icons[i];
            return (
              <div key={title}>
                <Icon size={31} aria-hidden="true" />
                <span>
                  <strong>{title}</strong>
                  <small>{description}</small>
                </span>
              </div>
            );
          })}
        </div>
        <span className="sr-only">
          {copy.common.careMotto} {copy.home.imageCaption}
        </span>
      </div>
    </section>
  );
}
