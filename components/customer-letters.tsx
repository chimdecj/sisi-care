'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import {
  ArrowUpRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Expand,
  Mail,
  X,
} from 'lucide-react';
import { customerLetters } from '@/lib/customer-letters';

export function CustomerLetters() {
  const [expanded, setExpanded] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const documentRef = useRef<HTMLDivElement>(null);
  const isOpen = activeIndex !== null;
  const activeLetter = activeIndex === null ? null : customerLetters[activeIndex];
  const visibleLetters = expanded ? customerLetters : customerLetters.slice(0, 4);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (documentRef.current) documentRef.current.scrollTop = 0;
    if (activeIndex !== null && !dialog.open) dialog.showModal();
    if (activeIndex === null && dialog.open) dialog.close();
  }, [activeIndex]);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  function navigate(direction: number) {
    setActiveIndex((index) =>
      index === null ? null : (index + direction + customerLetters.length) % customerLetters.length,
    );
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      navigate(event.key === 'ArrowLeft' ? -1 : 1);
    }
  }

  return (
    <div className="customer-letters" id="customer-letters">
      <a className="letters-close" href="#family-stories">
        Close letters <X size={18} aria-hidden="true" />
      </a>
      <div className="customer-letters-heading">
        <h3>Letters from our families</h3>
        <span className="customer-letters-count">
          <Mail size={16} aria-hidden="true" /> {customerLetters.length} heartfelt letters
        </span>
      </div>
      <div className="customer-letter-grid" id="customer-letter-grid">
        {visibleLetters.map((letter, index) => (
          <article className="customer-letter-card" key={letter.id}>
            <button
              className="customer-letter-thumbnail"
              type="button"
              aria-label={`Open original letter from ${letter.author}`}
              aria-haspopup="dialog"
              onClick={() => setActiveIndex(index)}
            >
              <Image
                src={letter.thumbnail}
                alt=""
                width={letter.width}
                height={letter.height}
                sizes="(max-width: 560px) 88px, 180px"
              />
              <span className="customer-letter-expand" aria-hidden="true">
                <Expand size={16} />
              </span>
            </button>
            <div className="customer-letter-content">
              <span className="customer-letter-kind">{letter.kind}</span>
              <figure>
                <blockquote>
                  <p>“{letter.excerpt}”</p>
                </blockquote>
                <figcaption>{letter.author}</figcaption>
              </figure>
              <button
                className="customer-letter-read"
                type="button"
                aria-label={`Read full letter from ${letter.author}`}
                aria-haspopup="dialog"
                onClick={() => setActiveIndex(index)}
              >
                Read full letter <ArrowUpRight size={16} aria-hidden="true" />
              </button>
            </div>
          </article>
        ))}
      </div>
      <div className="customer-letters-actions">
        <p aria-live="polite">
          Showing {visibleLetters.length} of {customerLetters.length} letters
        </p>
        <button
          type="button"
          className="button button-secondary"
          aria-expanded={expanded}
          aria-controls="customer-letter-grid"
          onClick={() => setExpanded((value) => !value)}
        >
          {expanded ? 'Show fewer letters' : `View all ${customerLetters.length} letters`}
          <ChevronDown
            size={18}
            className={expanded ? 'letters-chevron letters-chevron-up' : 'letters-chevron'}
            aria-hidden="true"
          />
        </button>
      </div>
      <dialog
        ref={dialogRef}
        className="customer-letter-dialog"
        aria-labelledby="customer-letter-title"
        onClose={() => setActiveIndex(null)}
        onKeyDown={handleKeyDown}
        onClick={(event) => {
          if (event.target === event.currentTarget) setActiveIndex(null);
        }}
      >
        {activeLetter && (
          <div className="customer-letter-viewer">
            <div className="customer-letter-toolbar">
              <div aria-live="polite">
                <h3 id="customer-letter-title">{activeLetter.title}</h3>
                <p>
                  {activeLetter.kind} · {(activeIndex ?? 0) + 1} of {customerLetters.length}
                </p>
              </div>
              <button
                type="button"
                className="letter-control"
                aria-label="Close letter"
                autoFocus
                onClick={() => setActiveIndex(null)}
              >
                <X size={22} />
              </button>
            </div>
            <div
              className="customer-letter-document"
              ref={documentRef}
              tabIndex={0}
              role="region"
              aria-label="Letter image, scroll to read"
            >
              <blockquote className="customer-letter-viewer-excerpt">
                “{activeLetter.excerpt}”
              </blockquote>
              <Image
                key={activeLetter.id}
                src={activeLetter.src}
                alt={`${activeLetter.title}: an original customer letter shared with Sisi Care`}
                width={activeLetter.width}
                height={activeLetter.height}
                sizes="(max-width: 760px) 90vw, 800px"
                loading="eager"
              />
            </div>
            <div className="customer-letter-navigation">
              <button
                type="button"
                className="letter-control"
                aria-label="Previous letter"
                onClick={() => navigate(-1)}
              >
                <ChevronLeft size={22} />
              </button>
              <a href={activeLetter.src} target="_blank" rel="noreferrer">
                Open full size <ArrowUpRight size={16} />
              </a>
              <button
                type="button"
                className="letter-control"
                aria-label="Next letter"
                onClick={() => navigate(1)}
              >
                <ChevronRight size={22} />
              </button>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
