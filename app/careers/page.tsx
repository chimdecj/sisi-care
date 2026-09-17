import { HandwrittenNote } from '@/components/handwritten-note';
import type { Metadata } from 'next';
import {
  HeartHandshake,
  Users,
  CalendarDays,
  TrendingUp,
  House,
  ArrowRight,
  Phone,
  Mail,
  Heart,
  UserRound,
  CookingPot,
  Accessibility,
  Pill,
  Brain,
  Clock3,
} from 'lucide-react';
import { IconBadge } from '@/components/icon-badge';
import { ReferenceHero } from '@/components/reference-hero';
import { ReferenceImage, type ReferenceAsset } from '@/components/reference-image';
import { CheckList, ReferenceQuote } from '@/components/shared';
import { contact } from '@/lib/content';
import copy from '@/lib/prepared-content.json';
export const metadata: Metadata = { title: 'Careers', description: copy.careers.description };
export default function Careers() {
  const page = copy.careers;
  const duties = [UserRound, Heart, CookingPot, House, Accessibility, Pill, Brain, Clock3];
  const benefits = [HeartHandshake, Users, CalendarDays, TrendingUp, House];
  const photos: ReferenceAsset[] = ['career-connection', 'career-independence', 'career-joy'];
  const applicationHref = `mailto:${contact.email}?subject=${encodeURIComponent('Caregiving opportunities at Sisi Care')}&body=${encodeURIComponent('Hello Sisi Care,\n\nI am interested in caregiving opportunities.\n\nMy name:\nPhone number:\nCaregiving experience:\nCredentials:\nAvailability:\n\nThank you!')}`;
  return (
    <>
      <ReferenceHero variant="careers" />
      <section className="benefits-section">
        <div className="container benefits-grid">
          {page.benefits.map(([title, text], i) => {
            return (
              <article key={title}>
                <IconBadge icon={benefits[i]} className="benefit-icon" />
                <h2>{title}</h2>
                <p>{text}</p>
              </article>
            );
          })}
        </div>
      </section>
      <section className="careers-details" id="open-positions">
        <div className="container two-column">
          <article>
            <h2>{page.requirementsTitle}</h2>
            <p className="section-description">{page.requirementsSubtitle}</p>
            <p className="body-copy">{page.requirementsDescription}</p>
            <div className="requirements-wrap">
              <CheckList items={page.requirements} />
              <HandwrittenNote
                text={page.caregiverMotto}
                variant="caregivers"
                className="career-handwriting"
              />
            </div>
          </article>
          <article>
            <h2>{page.dutiesTitle}</h2>
            <p className="section-description">{page.dutiesDescription}</p>
            <div className="caregiver-duties">
              {page.duties.map(([title, text], i) => {
                const Icon = duties[i];
                return (
                  <article key={title}>
                    <Icon size={33} strokeWidth={2} fill="none" aria-hidden="true" />
                    <div>
                      <h3>{title}</h3>
                      <p>{text}</p>
                    </div>
                  </article>
                );
              })}
            </div>
            <p className="duties-note">{page.dutiesNote}</p>
          </article>
        </div>
      </section>
      <section className="careers-team">
        <div className="container">
          <article>
            <h2>{page.teamTitle}</h2>
            <p className="section-description">{page.teamDescription}</p>
            <div className="team-photos">
              {page.teamCaptions.map((caption, i) => (
                <figure key={caption}>
                  <ReferenceImage name={photos[i]} alt={caption} />
                  <figcaption>{caption}</figcaption>
                </figure>
              ))}
            </div>
          </article>
          <article>
            <h2>{page.voicesTitle}</h2>
            <div className="caregiver-voice-layout">
              <ReferenceQuote quote={page.quote} author={page.quoteAuthor} />
              <ReferenceImage
                name="caregiver-portrait"
                alt="A smiling Sisi Care caregiver from the prepared Careers page"
              />
              <HandwrittenNote
                text={page.voiceMotto}
                variant="voices"
                className="career-voice-handwriting"
              />
            </div>
          </article>
        </div>
      </section>
      <div id="apply">
        <section className="career-cta">
          <div className="container career-cta-grid">
            <div>
              <h2>{page.ctaTitle}</h2>
              <p>{page.ctaDescription}</p>
              <a href={applicationHref} className="button button-primary">
                {page.apply}
                <ArrowRight size={17} aria-hidden="true" />
              </a>
            </div>
            <HandwrittenNote
              text={copy.common.togetherMotto}
              variant="together"
              className="career-together"
            />
            <aside className="career-questions">
              <h3>{page.questionsTitle}</h3>
              <p>{page.questionsDescription}</p>
              <a href={`tel:${contact.tel}`}>
                <Phone size={28} aria-hidden="true" />
                {contact.phone}
              </a>
              <a href={`mailto:${contact.email}`}>
                <Mail size={28} aria-hidden="true" />
                {contact.email}
              </a>
            </aside>
          </div>
        </section>
      </div>
    </>
  );
}
