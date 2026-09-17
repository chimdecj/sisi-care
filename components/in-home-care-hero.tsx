import { Heart, House, ShieldCheck, Users } from 'lucide-react';
import { ReferenceImage } from './reference-image';
import { CareLink } from './shared';
import copy from '@/lib/prepared-content.json';

export function InHomeCareHero() {
  const icons = [House, Heart, Users, ShieldCheck];
  return (
    <section className="in-home-care-hero" aria-labelledby="in-home-care-heading">
      <div className="page-hero-photo">
        <ReferenceImage
          name="hero-about"
          alt="A Sisi Care caregiver supporting an older woman in her home"
          priority
          sizes="(max-width: 760px) 100vw, 50vw"
        />
      </div>
      <div className="container page-hero-inner">
        <div className="page-hero-copy">
          <p className="eyebrow">{copy.care.eyebrow}</p>
          <h1 id="in-home-care-heading">
            Compassionate Care<span>Right at Home</span>
          </h1>
          <p className="page-hero-description">{copy.care.description}</p>
          <div className="page-hero-actions">
            <CareLink />
          </div>
        </div>
      </div>
      <div className="care-hero-proof-wrap">
        <div className="page-hero-proof care-hero-proof">
          {copy.care.trust.map(([title, description], i) => {
            const Icon = icons[i];
            return (
              <div key={title}>
                <Icon size={34} aria-hidden="true" />
                <span>
                  <strong>{title}</strong>
                  <small>{description}</small>
                </span>
              </div>
            );
          })}
        </div>
      </div>
      <span className="sr-only">
        {copy.common.careMotto} {copy.common.connectionMotto}
      </span>
    </section>
  );
}
