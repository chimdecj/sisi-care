import { Quote } from 'lucide-react';
import { testimonials } from '@/lib/content';
import { Eyebrow } from './shared';
import { CustomerLetters } from './customer-letters';
export function Testimonials({ showLetters = false }: { showLetters?: boolean }) {
  return <section className="section testimonials-section" id="family-stories"><div className="container"><div className="section-heading"><div><Eyebrow>WORDS THAT MEAN THE WORLD</Eyebrow><h2>From their family.<br /><em>To yours.</em></h2></div><p className="testimonial-intro">A few kind words from the people<br />we’ve had the privilege to care for.</p></div><div className="testimonial-grid">{testimonials.map(t => <figure className="testimonial" key={t.name}><Quote size={27} strokeWidth={1.3} aria-hidden="true" /><blockquote>“{t.quote}”</blockquote><figcaption><span className="initials">{t.initials}</span><span><strong>{t.name}</strong><small>{t.context}</small></span></figcaption></figure>)}</div><p className="testimonials-note">Excerpts from letters shared by Sisi Care families.</p>{showLetters && <CustomerLetters />}</div></section>;
}
