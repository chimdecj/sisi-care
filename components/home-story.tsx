import { Phone, Users, FileText, House } from 'lucide-react';
import { CheckList, ReferenceQuote } from './shared';
import { ReferenceImage } from './reference-image';
import { getContent } from '@/lib/cms/content';
export async function HomeStory() {
  const { copy } = await getContent();
  return (
    <section className="home-why">
      <div className="wide-container why-grid">
        <ReferenceImage name="home-hands" alt={copy.home.storyMotto} className="why-photo" />
        <div>
          <h2>{copy.home.whyTitle}</h2>
          <CheckList items={copy.home.why} />
        </div>
        <ReferenceQuote quote={copy.home.mission} author={copy.home.missionAuthor} />
      </div>
    </section>
  );
}
export async function GettingStarted() {
  const { copy } = await getContent();
  const icons = [Phone, Users, FileText, House];
  return (
    <section className="process-section">
      <div className="container">
        <div className="center-heading">
          <h2>{copy.home.stepsTitle}</h2>
          <p>{copy.home.stepsDescription}</p>
        </div>
        <div className="steps-grid">
          {copy.home.steps.map(([title, body], i) => {
            const Icon = icons[i];
            return (
              <div className="step" key={title}>
                <div className="step-icon">
                  <span>{i + 1}</span>
                  <Icon size={39} strokeWidth={2.1} aria-hidden="true" />
                </div>
                <h3>{title}</h3>
                <p>{body}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
