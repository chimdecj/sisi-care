'use client';
import { useState, useRef, type FormEvent } from 'react';
import { ArrowRight, LockKeyhole, Check, Copy } from 'lucide-react';
import { contact } from '@/lib/content';
import copy from '@/lib/prepared-content.json';

export function ContactForm() {
  const page = copy.contact;
  const [draft, setDraft] = useState<{ body: string; href: string } | null>(null);
  const [copyState, setCopyState] = useState('Copy message');
  const resultRef = useRef<HTMLDivElement>(null);
  function prepare(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const text = (key: string) => String(data.get(key) || '').trim();
    const body = `Hello Sisi Care,\n\nI would like to arrange a free care consultation.\n\nName: ${text('name')}\nPhone: ${text('phone')}\nEmail: ${text('email')}\nWho needs care: ${text('who')}\nSupport requested: ${data.getAll('support').join(', ') || 'Not sure yet'}\nTiming: ${text('when')}\n\n${text('message') ? 'Additional information: ' + text('message') + '\n\n' : ''}Thank you!`;
    setDraft({
      body,
      href: `mailto:${contact.email}?subject=${encodeURIComponent('Free care consultation request')}&body=${encodeURIComponent(body)}`,
    });
    setCopyState('Copy message');
    requestAnimationFrame(() => resultRef.current?.focus());
  }
  async function copyMessage() {
    if (!draft) return;
    try {
      await navigator.clipboard.writeText(draft.body);
      setCopyState('Message copied');
    } catch {
      setCopyState('Please select and copy the message below');
    }
  }
  return (
    <form
      className="contact-form"
      onSubmit={prepare}
      onChange={() => {
        if (draft) setDraft(null);
      }}
    >
      <h2>{page.formTitle}</h2>
      <p className="form-intro">{page.formDescription}</p>
      <div className="field">
        <label htmlFor="name">
          {page.name} <span>*</span>
        </label>
        <input
          id="name"
          name="name"
          autoComplete="name"
          placeholder={page.namePlaceholder}
          required
          maxLength={100}
        />
      </div>
      <div className="form-row">
        <div className="field">
          <label htmlFor="phone">
            {page.phone} <span>*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            placeholder={page.phonePlaceholder}
            required
            minLength={7}
            maxLength={30}
          />
        </div>
        <div className="field">
          <label htmlFor="email">
            {page.email} <span>*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder={page.emailPlaceholder}
            required
            maxLength={150}
          />
        </div>
      </div>
      <fieldset>
        <legend>{page.whoTitle}</legend>
        <div className="choice-row">
          {page.who.map((label, i) => (
            <label className="choice" key={label}>
              <input type="radio" name="who" value={label} defaultChecked={i === 1} />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend>{page.supportTitle}</legend>
        <div className="choice-grid">
          {page.support.map((label, i) => (
            <label className="choice" key={label}>
              <input type="checkbox" name="support" value={label} defaultChecked={i === 0} />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <fieldset>
        <legend>{page.whenTitle}</legend>
        <div className="choice-grid">
          {page.when.map((label, i) => (
            <label className="choice" key={label}>
              <input type="radio" name="when" value={label} defaultChecked={i === 0} />
              <span>{label}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="field">
        <label htmlFor="message">{page.message}</label>
        <textarea
          id="message"
          name="message"
          rows={4}
          maxLength={1500}
          placeholder={page.messagePlaceholder}
        />
      </div>
      <button type="submit" className="button button-primary form-submit">
        {page.request}
        <ArrowRight size={18} aria-hidden="true" />
      </button>
      <p className="form-footnote">
        <LockKeyhole size={14} aria-hidden="true" />
        {page.privacy}
      </p>
      {draft && (
        <div className="draft-result" ref={resultRef} tabIndex={-1} role="status">
          <span className="round-icon">
            <Check size={25} aria-hidden="true" />
          </span>
          <h3>Your email is ready.</h3>
          <p>
            Your request has <strong>not been sent yet</strong>. Open your email app to review and
            send it to <strong>{contact.email}</strong>.
          </p>
          <div className="draft-actions">
            <a href={draft.href} className="button button-primary">
              Open email & review <ArrowRight size={17} aria-hidden="true" />
            </a>
            <button className="button button-secondary" type="button" onClick={copyMessage}>
              <Copy size={16} aria-hidden="true" />
              {copyState}
            </button>
          </div>
          <details>
            <summary>View your message</summary>
            <pre>{draft.body}</pre>
          </details>
          <p>
            No email app? Copy your message into your preferred email service, or{' '}
            <a href={`tel:${contact.tel}`}>call {contact.phone}</a>.
          </p>
        </div>
      )}
    </form>
  );
}
