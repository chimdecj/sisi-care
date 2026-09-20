'use client';
import { useEffect, useRef, useState } from 'react';
import type { Content, ImageKey } from '@/lib/cms/schema';

type Section = keyof Content['copy'];
const sections: [Section, string, string][] = [
  ['common', 'Shared text', '/'],
  ['home', 'Home', '/'],
  ['care', 'In-Home Care', '/in-home-care/'],
  ['about', 'About', '/about/'],
  ['careers', 'Careers', '/careers/'],
  ['contact', 'Contact', '/contact/'],
];
const photoGroups: Record<Section, [ImageKey, string][]> = {
  common: [['hero-home', 'Shared hero — Home, In-Home Care, About and Contact']],
  home: [['home-hands', 'Why families choose us']],
  care: [
    ['memory-care', 'Memory care'],
    ['care-hands', 'Care options'],
  ],
  about: [
    ['founder', 'Founder'],
    ['caregiver-team', 'Caregiver team'],
  ],
  careers: [
    ['hero-careers', 'Careers hero'],
    ['career-connection', 'Team: connection'],
    ['career-independence', 'Team: independence'],
    ['career-joy', 'Team: joy'],
    ['caregiver-portrait', 'Caregiver voice'],
  ],
  contact: [['contact-careers', 'Careers invitation']],
};
function label(key: string) {
  return key
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/^cta /i, 'Call to action ')
    .replace(/^./, (c) => c.toUpperCase());
}
type TextTree = string | TextTree[] | { [key: string]: TextTree };
function Fields({
  value,
  path,
  onChange,
  disabled,
}: {
  value: TextTree;
  path: (string | number)[];
  onChange: (path: (string | number)[], value: string) => void;
  disabled: boolean;
}) {
  if (typeof value === 'string') {
    const name = String(path.at(-1));
    const fieldLabel = /^\d+$/.test(name) ? `Text ${Number(name) + 1}` : label(name);
    return (
      <label className="admin-field">
        {fieldLabel}
        <textarea
          aria-label={path.map(String).join(' / ')}
          rows={value.length > 100 ? 4 : 2}
          value={value}
          maxLength={6000}
          disabled={disabled}
          onChange={(e) => onChange(path, e.target.value)}
        />
      </label>
    );
  }
  return (
    <div className="admin-fields">
      {Object.entries(value).map(([key, child]) => {
        const nextPath = [...path, Array.isArray(value) ? Number(key) : key];
        return typeof child === 'string' ? (
          <Fields key={key} value={child} path={nextPath} onChange={onChange} disabled={disabled} />
        ) : (
          <details className="admin-group" key={key} open={Array.isArray(value) ? undefined : true}>
            <summary>{Array.isArray(value) ? `Item ${Number(key) + 1}` : label(key)}</summary>
            <Fields value={child} path={nextPath} onChange={onChange} disabled={disabled} />
          </details>
        );
      })}
    </div>
  );
}
export function AdminEditor({ initial }: { initial: Content }) {
  const [draft, setDraft] = useState(initial);
  const [saved, setSaved] = useState(initial);
  const [section, setSection] = useState<Section>('home');
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [expired, setExpired] = useState(false);
  const operation = useRef(false);
  const dirty = JSON.stringify(draft) !== JSON.stringify(saved);
  useEffect(() => {
    const leave = (event: BeforeUnloadEvent) => {
      if (dirty) {
        event.preventDefault();
        event.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', leave);
    return () => window.removeEventListener('beforeunload', leave);
  }, [dirty]);
  function update(path: (string | number)[], text: string) {
    setDraft((current) => {
      const next = structuredClone(current);
      let node: any = next;
      for (const key of path.slice(0, -1)) node = node[key];
      node[path.at(-1)!] = text;
      return next;
    });
    setNotice('');
  }
  async function request(url: string, options: RequestInit) {
    const response = await fetch(url, options);
    const result = await response.json();
    if (!response.ok) {
      if (response.status === 401) setExpired(true);
      throw new Error(result.error || 'Unable to complete this operation.');
    }
    return result;
  }
  async function run(action: () => Promise<void>) {
    if (operation.current) return;
    operation.current = true;
    setBusy(true);
    setError('');
    setNotice('');
    try {
      await action();
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : 'Unable to complete this operation. Your edits remain here.',
      );
    } finally {
      operation.current = false;
      setBusy(false);
    }
  }
  return (
    <section>
      <div className="admin-heading">
        <div>
          <span className="admin-kicker">SISI CARE · WEBSITE MANAGEMENT</span>
          <h1>Content editor</h1>
          <p>Edit your pages, then publish when ready.</p>
        </div>
        <a href={sections.find((s) => s[0] === section)![2]} target="_blank" rel="noreferrer">
          View live page ↗
        </a>
      </div>
      <div className="admin-toolbar">
        <span>{dirty ? 'Unpublished changes' : 'All changes published'}</span>
        <div>
          <button
            disabled={busy || !dirty}
            onClick={() => {
              if (window.confirm('Discard all unpublished changes?')) {
                setDraft(structuredClone(saved));
                setNotice('Changes discarded.');
                setError('');
              }
            }}
          >
            Discard changes
          </button>
          <button
            className="admin-primary"
            disabled={busy || !dirty}
            onClick={() =>
              run(async () => {
                const published: Content = await request('/api/admin/content/', {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(draft),
                });
                setDraft(published);
                setSaved(published);
                setNotice('Published. Your website now shows these changes.');
              })
            }
          >
            {busy ? 'Please wait…' : 'Publish changes'}
          </button>
          <button
            disabled={busy}
            onClick={() => {
              if (dirty && !window.confirm('Sign out and discard unpublished changes?')) return;
              run(async () => {
                await request('/api/admin/logout/', { method: 'POST' });
                window.location.reload();
              });
            }}
          >
            Sign out
          </button>
        </div>
      </div>
      {notice && (
        <p role="status" className="admin-success">
          {notice}
        </p>
      )}
      {error && (
        <p role="alert" className="admin-error">
          {error}
        </p>
      )}
      {expired && (
        <p>
          Your edits are still here.{' '}
          <a href="/admin/" target="_blank" rel="noreferrer">
            Sign in in a new tab
          </a>
          , then return and publish again.
        </p>
      )}
      <nav className="admin-tabs" aria-label="Choose page">
        {sections.map(([key, title]) => (
          <button key={key} aria-pressed={section === key} onClick={() => setSection(key)}>
            {title}
          </button>
        ))}
      </nav>
      <div className="admin-panel">
        <h2>{sections.find((s) => s[0] === section)![1]}</h2>
        <p className="admin-help">
          Text is published as plain text. Existing sections and item counts stay in place to
          preserve the layout. Changes in any tab are published together.
        </p>
        <Fields
          value={draft.copy[section]}
          path={['copy', section]}
          onChange={update}
          disabled={busy}
        />
        {section === 'care' && (
          <details className="admin-group" open>
            <summary>Detailed care services</summary>
            <Fields
              value={draft.careDetails}
              path={['careDetails']}
              onChange={update}
              disabled={busy}
            />
          </details>
        )}
        <h2 className="admin-photo-heading">Photos</h2>
        <p className="admin-help">
          JPEG, PNG or WebP, up to 10 MB. Upload a replacement, then publish to make it live.
        </p>
        <div className="admin-photos">
          {photoGroups[section].map(([key, title]) => (
            <article key={key}>
              <h3>{title}</h3>
              <img src={draft.images[key].src} alt={title} />
              <label className="admin-field">
                Replace photo
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  disabled={busy}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    e.target.value = '';
                    if (!file) return;
                    if (file.size > 10 * 1024 * 1024) {
                      setError('Choose a photo smaller than 10 MB.');
                      return;
                    }
                    run(async () => {
                      const image: Content['images'][ImageKey] = await request(
                        '/api/admin/upload/',
                        { method: 'POST', headers: { 'Content-Type': file.type }, body: file },
                      );
                      setDraft((current) => ({
                        ...current,
                        images: { ...current.images, [key]: image },
                      }));
                      setNotice('Photo uploaded. Publish changes to show it on the website.');
                    });
                  }}
                />
              </label>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
