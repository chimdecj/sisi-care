import { pageMetadata, pageGraph } from '@/lib/seo';
import { StructuredData } from '@/components/structured-data';
import Link from 'next/link';
import { IconBadge } from '@/components/icon-badge';
import { HomeHero } from '@/components/home-hero';
import { CareCTA } from '@/components/shared';
import { HomeStory, GettingStarted } from '@/components/home-story';
import { Testimonials } from '@/components/testimonials';
import { services } from '@/lib/content';
import copy from '@/lib/prepared-content.json';
export const metadata = pageMetadata('/');
export default function Home() {
  return (
    <>
      <StructuredData data={pageGraph('/')} />
      <HomeHero />
      <section className="home-services">
        <div className="container">
          <div className="section-heading">
            <div>
              <h2>{copy.home.servicesTitle}</h2>
              <p>{copy.home.servicesDescription}</p>
            </div>
          </div>
          <div className="service-grid">
            {services.map(({ id, title, description, icon }) => (
              <Link href={`/in-home-care/#${id}`} className="service-card" key={id}>
                <IconBadge icon={icon} className="service-icon" />
                <h3>{title}</h3>
                <p>{description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <HomeStory />
      <Testimonials showLetters />
      <GettingStarted />
      <CareCTA />
    </>
  );
}
