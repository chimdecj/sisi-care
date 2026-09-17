import { HandwrittenNote } from '@/components/handwritten-note';
import type { Metadata } from 'next';
import {
  HeartHandshake,
  Heart,
  ShieldCheck,
  Users,
  GraduationCap,
  CalendarDays,
  House,
  MapPin,
  Star,
} from 'lucide-react';
import { ReferenceHero } from '@/components/reference-hero';
import { ReferenceImage } from '@/components/reference-image';
import { CareCTA, TrustStrip, CheckList, ReferenceQuote } from '@/components/shared';
import { Testimonials } from '@/components/testimonials';
import copy from '@/lib/prepared-content.json';
import { IconBadge } from '@/components/icon-badge';
export const metadata: Metadata = { title: 'About Us', description: copy.about.description };
export default function About() {
  const page = copy.about;
  const founderIcons = [Heart, GraduationCap, Users];
  const valueIcons = [HeartHandshake, Heart, ShieldCheck, Users];
  return (
    <>
      <ReferenceHero variant="about" />
      <section className="about-overview">
        <div className="container about-overview-grid">
          <article className="about-story">
            <h2>{page.storyTitle}</h2>
            {page.story.map((text) => (
              <p key={text}>{text}</p>
            ))}
            <HandwrittenNote text={page.storyMotto} variant="story" className="about-handwriting" />
          </article>
          <article className="founder-profile">
            <ReferenceImage
              name="founder"
              alt="Sisi, Founder & Owner of Sisi Care"
              className="founder-photo"
            />
            <h3>{page.founderName}</h3>
            <p className="founder-role">{page.founderRole}</p>
            <div className="founder-details">
              {page.founderDetails.map(([title, text], i) => {
                const Icon = founderIcons[i];
                return (
                  <div key={title}>
                    <Icon size={32} strokeWidth={2} aria-hidden="true" />
                    <div>
                      <strong>{title}</strong>
                      <p>{text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <ReferenceQuote quote={page.founderQuote} author={page.founderQuoteAuthor} />
          </article>
          <article className="about-values">
            <h2>{page.valuesTitle}</h2>
            <p>{page.valuesDescription}</p>
            <div className="values-list">
              {page.values.map(([title, text], i) => {
                return (
                  <article key={title}>
                    <IconBadge icon={valueIcons[i]} className="value-icon" />
                    <div>
                      <h3>{title}</h3>
                      <p>{text}</p>
                    </div>
                  </article>
                );
              })}
            </div>
            <ReferenceQuote quote={page.mission} />
          </article>
        </div>
      </section>
      <section className="about-team">
        <div className="wide-container about-team-layout">
          <ReferenceImage name="caregiver-team" alt={page.teamMotto} className="about-team-photo" />
          <div>
            <h2>{page.caregiversTitle}</h2>
            <p className="team-description">{page.caregiversDescription}</p>
            <CheckList items={page.caregiversList} />
          </div>
          <aside className="license-panel">
            <ShieldCheck size={45} strokeWidth={1.7} aria-hidden="true" />
            <h3>{page.licenseTitle}</h3>
            <p>{page.licenseDescription}</p>
          </aside>
        </div>
      </section>
      <TrustStrip items={page.trust} icons={[Star, CalendarDays, House, MapPin]} />
      <Testimonials variant="about" />
      <CareCTA variant="about" />
    </>
  );
}
