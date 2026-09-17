import Image from 'next/image';
import { HeartHandshake } from 'lucide-react';
import copy from '@/lib/prepared-content.json';

export function ServiceArea() {
  return (
    <section className="service-area" id="service-area" aria-labelledby="service-area-heading">
      <picture className="service-area-background">
        <source media="(max-width: 600px)" srcSet="/images/bellevue-eastside-mobile.webp" />
        <Image src="/images/bellevue-eastside-panorama.webp" alt="" fill sizes="100vw" />
      </picture>
      <div className="container service-area-layout">
        <div className="service-area-copy">
          <h2 id="service-area-heading">{copy.common.areaHeading}</h2>
          <p className="service-area-cities">
            {copy.common.areaNames}
            <br />
            {copy.common.surrounding}
          </p>
          <p className="service-area-motto">
            <HeartHandshake size={23} aria-hidden="true" />
            {copy.common.localMotto}
          </p>
        </div>
      </div>
    </section>
  );
}
