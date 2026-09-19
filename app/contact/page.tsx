import { pageMetadata, pageGraph } from '@/lib/seo';
import { StructuredData } from '@/components/structured-data';
import { HandwrittenNote } from '@/components/handwritten-note';
import Link from 'next/link';
import { Phone, Mail, MapPin, Clock3, ArrowRight, House, Users, Star } from 'lucide-react';
import { ReferenceHero } from '@/components/reference-hero';
import { ReferenceImage } from '@/components/reference-image';
import { TrustStrip } from '@/components/shared';
import { ContactForm } from '@/components/contact-form';
import { contact } from '@/lib/content';
import copy from '@/lib/prepared-content.json';
export const metadata = pageMetadata('/contact/');
export default function Contact() {
  const page = copy.contact;
  return (
    <>
      <StructuredData data={pageGraph('/contact/')} />
      <ReferenceHero variant="contact" />
      <section className="contact-section" id="consultation">
        <div className="container contact-layout">
          <ContactForm />
          <aside className="contact-aside">
            <div className="contact-card">
              <h2>{page.talkTitle}</h2>
              <div className="contact-call">
                <span className="contact-call-icon">
                  <Phone size={38} aria-hidden="true" />
                </span>
                <div>
                  <h3>{page.talkCall}</h3>
                  <a href={`tel:${contact.tel}`} className="contact-big-phone">
                    {contact.phone}
                  </a>
                  <p>{page.talkDescription}</p>
                </div>
              </div>
              <div className="contact-detail">
                <MapPin fill="currentColor" aria-hidden="true" />
                <div>
                  <strong>{page.addressTitle}</strong>
                  <a href={contact.maps} target="_blank" rel="noreferrer">
                    {contact.address}, {contact.city}
                  </a>
                </div>
              </div>
              <div className="contact-detail">
                <Mail aria-hidden="true" />
                <div>
                  <strong>{page.emailTitle}</strong>
                  <a href={`mailto:${contact.email}`}>{contact.email}</a>
                </div>
              </div>
              <div className="contact-detail contact-hours">
                <Clock3 aria-hidden="true" />
                <div>
                  <strong>{page.hoursTitle}</strong>
                  <p>
                    {page.hoursDays}
                    <br />
                    {page.hoursTimes}
                  </p>
                </div>
                <HandwrittenNote
                  text={page.talkMotto}
                  variant="contact"
                  className="contact-handwriting"
                />
              </div>
            </div>
            <div className="contact-area">
              <div className="contact-area-heading">
                <MapPin size={44} fill="currentColor" aria-hidden="true" />
                <div>
                  <h3>{page.areaTitle}</h3>
                  <p>{page.areaDescription}</p>
                  <p>
                    {copy.common.areaNames}
                    <br />
                    {copy.common.surrounding}
                  </p>
                </div>
              </div>
              <iframe
                title={`Google Maps: Sisi Care office at ${contact.address}, ${contact.city}`}
                src={`https://www.google.com/maps?q=${encodeURIComponent(`${contact.address}, ${contact.city}`)}&z=13&output=embed`}
                className="contact-map"
                width="600"
                height="340"
                loading="lazy"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
              <a
                href={contact.maps}
                target="_blank"
                rel="noopener noreferrer"
                className="text-link contact-map-link"
              >
                Open in Google Maps
                <ArrowRight size={16} aria-hidden="true" />
              </a>
            </div>
          </aside>
        </div>
      </section>
      <TrustStrip items={page.trust} icons={[Star, Users, House]} />
      <section className="contact-careers">
        <div className="wide-container contact-careers-layout">
          <div className="contact-careers-media">
            <ReferenceImage
              name="contact-careers"
              alt={copy.common.careMotto}
              className="contact-careers-photo"
              sizes="(max-width: 600px) 100vw, (max-width: 820px) 40vw, 420px"
            />
          </div>
          <div className="contact-careers-copy">
            <h2>{page.careersTitle}</h2>
            <p>{page.careersDescription}</p>
          </div>
          <Link href="/careers/" className="button button-secondary">
            {page.careersLink}
            <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </>
  );
}
