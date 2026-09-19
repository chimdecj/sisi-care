import { ArrowRight, Quote, Star } from 'lucide-react';
import { CustomerLetters } from './customer-letters';
import copy from '@/lib/prepared-content.json';
export function Testimonials({
  showLetters = false,
  variant = 'home',
}: {
  showLetters?: boolean;
  variant?: 'home' | 'about';
}) {
  const page = copy[variant];
  return (
    <section className={`testimonials-section testimonials-${variant}`} id="family-stories">
      <div className="container">
        <div className="section-heading">
          <div>
            <h2>{page.testimonialsTitle}</h2>
            {variant === 'home' && <p>{copy.home.testimonialsDescription}</p>}
          </div>
          <a href={showLetters ? '#customer-letters' : '/#customer-letters'} className="text-link">
            {page.testimonialsLink}
            <ArrowRight size={15} aria-hidden="true" />
          </a>
        </div>
        <div className={`testimonial-grid ${variant === 'home' ? 'testimonial-grid-home' : ''}`}>
          {page.testimonials.map((t) => (
            <figure className="testimonial" key={`${t.name}-${t.quote}`}>
              <Quote size={23} fill="currentColor" aria-hidden="true" />
              <blockquote>“{t.quote}”</blockquote>
              {variant === 'home' && (
                <div className="testimonial-stars" aria-label="5 stars">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} size={14} fill="currentColor" aria-hidden="true" />
                  ))}
                </div>
              )}
              <figcaption>
                <strong>— {t.name}</strong>
                {t.context && <small>{t.context}</small>}
              </figcaption>
            </figure>
          ))}
        </div>
        {showLetters && <CustomerLetters />}
      </div>
    </section>
  );
}
