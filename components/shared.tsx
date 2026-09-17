import Link from 'next/link';
import {
  ArrowRight,
  Phone,
  Heart,
  ShieldCheck,
  Users,
  CalendarDays,
  Check,
  Quote,
  type LucideIcon,
} from 'lucide-react';
import { contact } from '@/lib/content';
import copy from '@/lib/prepared-content.json';
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}
export function CareLink({
  children = copy.common.consultation,
  href = '/contact/#consultation',
  secondary = false,
}: {
  children?: React.ReactNode;
  href?: string;
  secondary?: boolean;
}) {
  return (
    <Link href={href} className={`button ${secondary ? 'button-secondary' : 'button-primary'}`}>
      {children}
      <ArrowRight size={17} aria-hidden="true" />
    </Link>
  );
}
export function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="check-list">
      {items.map((item) => (
        <li key={item}>
          <Check aria-hidden="true" />
          {item}
        </li>
      ))}
    </ul>
  );
}
export function ReferenceQuote({ quote, author }: { quote: string; author?: string }) {
  return (
    <blockquote className="reference-quote">
      <Quote size={26} fill="currentColor" aria-hidden="true" />
      <p>“{quote}”</p>
      {author && <cite>— {author}</cite>}
    </blockquote>
  );
}
export function TrustStrip({
  items = copy.home.trust,
  icons = [CalendarDays, Heart, Users, ShieldCheck],
}: {
  items?: string[][];
  icons?: LucideIcon[];
}) {
  return (
    <div className="trust-strip">
      <div className={`container trust-grid trust-grid-${items.length}`}>
        {items.map(([title, description], i) => {
          const Icon = icons[i % icons.length];
          return (
            <div key={title}>
              <Icon aria-hidden="true" />
              <span>
                <strong>{title}</strong>
                <small>{description}</small>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
export function CareCTA({ variant = 'home' }: { variant?: 'home' | 'about' }) {
  const page = copy[variant];
  return (
    <>
      <section className="care-cta">
        <div className="container cta-layout">
          <div>
            <h2>{page.ctaTitle}</h2>
            <p>{page.ctaDescription}</p>
          </div>
          <div className="cta-actions">
            <a href={`tel:${contact.tel}`} className="cta-phone">
              <Phone size={23} aria-hidden="true" />
              {contact.phone}
            </a>
            <CareLink />
          </div>
        </div>
      </section>
    </>
  );
}
export function PageIntro({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="page-intro">
      <div className="container">
        <Eyebrow>{eyebrow}</Eyebrow>
        <h1>{title}</h1>
        <p>{description}</p>
        {children}
      </div>
    </section>
  );
}
