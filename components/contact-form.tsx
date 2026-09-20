'use client';
import { useEffect, useState, useRef, type FormEvent } from 'react';
import { ArrowRight, LockKeyhole, Check } from 'lucide-react';
import ReCAPTCHA from 'react-google-recaptcha';
import { contact } from '@/lib/content';
import type { Content } from '@/lib/cms/schema';

export function ContactForm({ page }: { page: Content['copy']['contact'] }) {
  const captcha = useRef<ReCAPTCHA>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');
  const sendingRef = useRef(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const pending = status === 'sending';

  useEffect(() => {
    if (status === 'sent' || status === 'error') resultRef.current?.focus();
  }, [status]);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sendingRef.current || status === 'sent') return;
    if (!captchaToken) {
      setError('Please complete the verification before sending.');
      setStatus('error');
      return;
    }
    const form = e.currentTarget;
    const data = new FormData(form);
    sendingRef.current = true;
    setStatus('sending');
    setError('');
    const uncertain =
      'We couldn’t confirm that your request was sent. Please call or email us before submitting again.';
    try {
      const response = await fetch('/api/contact/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: data.get('name'),
          phone: data.get('phone'),
          email: data.get('email'),
          who: data.get('who'),
          support: data.getAll('support'),
          when: data.get('when'),
          message: data.get('message'),
          website: data.get('website'),
          captchaToken,
        }),
      });
      const result = await response.json();
      if (!response.ok || result.ok !== true) {
        const message =
          result.code === 'INVALID_REQUEST' || result.code === 'REQUEST_TOO_LARGE'
            ? 'Please check your name, phone number, email, and message, then try again.'
            : result.code === 'RATE_LIMITED'
              ? 'You’ve submitted several requests recently. Please wait a few minutes or call us.'
              : result.code === 'INVALID_CAPTCHA'
                ? 'Verification expired or failed. Please complete it again.'
                : ['MAIL_UNAVAILABLE', 'FORM_UNAVAILABLE', 'CAPTCHA_UNAVAILABLE'].includes(
                      result.code,
                    )
                  ? 'Online requests are temporarily unavailable. Please call or email us.'
                  : uncertain;
        setError(message);
        setStatus('error');
        return;
      }
      form.reset();
      setStatus('sent');
    } catch {
      setError(uncertain);
      setStatus('error');
    } finally {
      sendingRef.current = false;
      captcha.current?.reset();
      setCaptchaToken(null);
    }
  }
  return (
    <form
      className="contact-form"
      onSubmit={submit}
      aria-busy={pending}
      onChange={() => {
        if (status === 'sent' || status === 'error') setStatus('idle');
      }}
    >
      <h2>{page.formTitle}</h2>
      <p className="form-intro">{page.formDescription}</p>
      <div className="form-honeypot" aria-hidden="true">
        <label htmlFor="contact-website">Leave this field empty</label>
        <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="field">
        <label htmlFor="name">
          {page.name} <span>*</span>
        </label>
        <input
          id="name"
          disabled={pending}
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
            disabled={pending}
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
            disabled={pending}
            name="email"
            type="email"
            autoComplete="email"
            placeholder={page.emailPlaceholder}
            required
            maxLength={150}
          />
        </div>
      </div>
      <fieldset disabled={pending}>
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
      <fieldset disabled={pending}>
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
      <fieldset disabled={pending}>
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
          disabled={pending}
          name="message"
          rows={4}
          maxLength={1500}
          placeholder={page.messagePlaceholder}
        />
      </div>
      <div className="form-captcha">
        {siteKey ? (
          <ReCAPTCHA
            ref={captcha}
            sitekey={siteKey}
            size="normal"
            onChange={(token) => {
              setCaptchaToken(token);
              if (status === 'error') setStatus('idle');
            }}
            onExpired={() => setCaptchaToken(null)}
            onErrored={() => {
              setCaptchaToken(null);
              setError(
                'Verification couldn’t load. Please refresh the page or contact us directly.',
              );
              setStatus('error');
            }}
          />
        ) : (
          <p>
            Online requests are temporarily unavailable. Please{' '}
            <a href={`mailto:${contact.email}`}>email us</a> or{' '}
            <a href={`tel:${contact.tel}`}>call {contact.phone}</a>.
          </p>
        )}
      </div>
      <button
        type="submit"
        className="button button-primary form-submit"
        disabled={pending || status === 'sent' || !captchaToken}
      >
        {pending ? 'Sending request…' : page.request}
        <ArrowRight size={18} aria-hidden="true" />
      </button>
      <p className="form-footnote">
        <LockKeyhole size={14} aria-hidden="true" />
        {page.privacy}
      </p>
      {(status === 'sent' || status === 'error') && (
        <div
          className="form-result"
          ref={resultRef}
          tabIndex={-1}
          role={status === 'error' ? 'alert' : 'status'}
        >
          {status === 'sent' ? (
            <>
              <span className="round-icon">
                <Check size={25} aria-hidden="true" />
              </span>
              <h3>Thank you. Your request has been sent.</h3>
              <p>We’ll contact you soon to discuss your care needs.</p>
            </>
          ) : (
            <>
              <h3>Please contact us directly</h3>
              <p>{error}</p>
              <p>
                <a href={`tel:${contact.tel}`}>{contact.phone}</a> or{' '}
                <a href={`mailto:${contact.email}`}>{contact.email}</a>
              </p>
            </>
          )}
        </div>
      )}
    </form>
  );
}
