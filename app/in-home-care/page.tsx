import { pageMetadata, pageGraph } from '@/lib/seo';
import { StructuredData } from '@/components/structured-data';
import { Clock3, CalendarDays, Users, House } from 'lucide-react';
import { InHomeCareHero } from '@/components/in-home-care-hero';
import { IconBadge } from '@/components/icon-badge';
import { ReferenceImage } from '@/components/reference-image';
import { CareLink, CheckList, ReferenceQuote } from '@/components/shared';
import { inHomeCareServices } from '@/lib/content';
import copy from '@/lib/prepared-content.json';
export const metadata = pageMetadata('/in-home-care/');
export default function InHomeCare() {
  const page = copy.care;
  const icons = [CalendarDays, CalendarDays, Users, House];
  return (
    <>
      <StructuredData data={pageGraph('/in-home-care/')} />
      <InHomeCareHero />
      <section className="care-services" aria-labelledby="care-services-heading">
        <div className="container">
          <div className="care-services-heading">
            <h2 id="care-services-heading">{page.servicesTitle}</h2>
            <p>{page.servicesDescription}</p>
          </div>
          <div className="care-detail-grid">
            {inHomeCareServices.map(({ id, title, aliases, details, icon }) => (
              <article className="care-detail" id={id} key={id}>
                {aliases.map((alias) => (
                  <span className="care-anchor" id={alias} key={alias} aria-hidden="true" />
                ))}
                <IconBadge icon={icon} className="care-service-icon" />
                <h3>{title}</h3>
                <CheckList items={details} />
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="memory-section">
        <div className="wide-container memory-layout">
          <ReferenceImage name="memory-care" alt={page.memoryMotto} className="memory-photo" />
          <article>
            <h2>{page.memoryTitle}</h2>
            <p>{page.memoryDescription}</p>
            <CheckList items={page.memoryList} />
          </article>
          <article>
            <div className="continuous-heading">
              <Clock3 size={38} strokeWidth={2} aria-hidden="true" />
              <div>
                <h2>{page.continuousTitle}</h2>
                <h3>{page.continuousSubtitle}</h3>
              </div>
            </div>
            <p>{page.continuousDescription}</p>
            <CheckList items={page.continuousList} />
          </article>
        </div>
      </section>
      <section className="care-options-section">
        <div className="container care-options-layout">
          <div>
            <div className="section-heading">
              <div>
                <h2>{page.optionsTitle}</h2>
                <p>{page.optionsDescription}</p>
              </div>
            </div>
            <div className="options-grid">
              {page.options.map(([title, text], i) => {
                const Icon = icons[i];
                return (
                  <article key={title}>
                    <Icon size={40} strokeWidth={2.1} aria-hidden="true" />
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </article>
                );
              })}
            </div>
          </div>
          <aside className="care-help">
            <ReferenceImage
              name="care-hands"
              alt="A caregiver gently holding an older person’s hands"
            />
            <div>
              <h3>{page.helpTitle}</h3>
              <p>{page.helpDescription}</p>
              <CareLink>{page.helpButton}</CareLink>
            </div>
          </aside>
        </div>
      </section>
      <section className="family-fit">
        <div className="container family-fit-grid">
          <div>
            <h2>{page.familyTitle}</h2>
            <p>{page.familyDescription}</p>
            <CheckList items={page.familyList} />
            <p className="care-region-summary">{page.areaDescription}</p>
          </div>
          <ReferenceQuote quote={page.quote} author={page.quoteAuthor} />
        </div>
      </section>
    </>
  );
}
