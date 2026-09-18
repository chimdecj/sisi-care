import Link from 'next/link';
import { Facebook, Instagram, Linkedin, Mail, MapPin } from 'lucide-react';
import { BrandLogo } from './brand-logo';
import { ServiceArea } from './service-area';
import { contact } from '@/lib/content';
import copy from '@/lib/prepared-content.json';

const links = [
  ['/', 'Home'],
  ['/in-home-care/', 'In-Home Care'],
  ['/about/', 'About Us'],
  ['/careers/', 'Careers'],
  ['/contact/', 'Contact'],
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <ServiceArea />
      <div className="footer">
        <div className="container footer-main">
          <Link href="/" className="footer-brand" aria-label="Sisi Care home">
            <BrandLogo />
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
          <div className="social-marks" aria-hidden="true">
            <Facebook size={22} fill="currentColor" />
            <Instagram size={22} />
            <Linkedin size={22} fill="currentColor" />
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
