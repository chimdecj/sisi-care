import Link from 'next/link';
import { Facebook, Instagram, Linkedin, Mail, MapPin } from 'lucide-react';
import { BrandLogo } from './brand-logo';
import { ServiceArea } from './service-area';
import { contact } from '@/lib/content';
import { getContent } from '@/lib/cms/content';

const links = [
  ['/', 'Home'],
  ['/in-home-care/', 'In-Home Care'],
  ['/about/', 'About Us'],
  ['/careers/', 'Careers'],
  ['/contact/', 'Contact'],
];

export async function SiteFooter() {
  const { copy } = await getContent();
  return (
    <footer className="site-footer">
      <ServiceArea />
      <div className="footer">
        <div className="container footer-main">
          <Link href="/" className="footer-brand" aria-label="Sisi Care home">
            <BrandLogo tagline={copy.common.brandTagline} />
          </Link>
          <nav aria-label="Footer navigation">
            {links.map(([href, label]) => (
              <Link href={href} key={href}>
                {label}
              </Link>
            ))}
          </nav>
          <div className="footer-contact">
            <a href={contact.maps} target="_blank" rel="noreferrer" className="footer-address">
              <MapPin size={21} aria-hidden="true" />
              <span>
                {contact.address},<br />
                {contact.city}
              </span>
            </a>
            <a href={`mailto:${contact.email}`} className="footer-email">
              <Mail size={21} aria-hidden="true" />
              <span>{contact.email}</span>
            </a>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="container">
            <span>© {new Date().getFullYear()} Sisi Care. All rights reserved.</span>
            <span>{copy.common.communityMotto}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
