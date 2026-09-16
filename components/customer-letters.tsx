'use client';

import Image from 'next/image';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight, Expand, X } from 'lucide-react';
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
    return () => { document.body.style.overflow = previousOverflow; };
  }, [isOpen]);

  function navigate(direction: number) {
    setActiveIndex(index => index === null ? null : (index + direction + customerLetters.length) % customerLetters.length);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDialogElement>) {
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault();
      navigate(event.key === 'ArrowLeft' ? -1 : 1);
    }
  }

  return (
    <div className="customer-letters">
      <div className="customer-letters-heading">
        <h3>Letters from our families</h3>
        <span>{customerLetters.length} letters of appreciation</span>
      </div>
      <div className="customer-letter-grid" id="customer-letter-grid">
        {visibleLetters.map((letter, index) => (
          <button
            className="customer-letter-card"
            key={letter.id}
            type="button"
            aria-label={`Read ${letter.title.toLowerCase()}`}
            aria-haspopup="dialog"
            onClick={() => setActiveIndex(index)}
          >
            <span className="customer-letter-thumbnail">
              <Image src={letter.thumbnail} alt="" width={letter.width} height={letter.height} sizes="(max-width: 600px) 50vw, (max-width: 1000px) 33vw, 25vw" />
              <span className="customer-letter-expand" aria-hidden="true"><Expand size={18} /></span>
            </span>
            <span className="customer-letter-caption"><span>{letter.title}</span><ArrowUpRight size={17} aria-hidden="true" /></span>
          </button>
        ))}
      </div>
      <div className="customer-letters-actions">
        <button
          type="button"
          className="button button-secondary"
          aria-expanded={expanded}
          aria-controls="customer-letter-grid"
          onClick={() => setExpanded(value => !value)}
        >
          {expanded ? 'Show fewer letters' : `View all ${customerLetters.length} letters`}
        </button>
      </div>
      <dialog
        ref={dialogRef}
        className="customer-letter-dialog"
        aria-labelledby="customer-letter-title"
        onClose={() => setActiveIndex(null)}
        onKeyDown={handleKeyDown}
        onClick={event => { if (event.target === event.currentTarget) setActiveIndex(null); }}
      >
        {activeLetter && (
          <div className="customer-letter-viewer">
            <div className="customer-letter-toolbar">
              <div aria-live="polite">
                <h3 id="customer-letter-title">{activeLetter.title}</h3>
                <p>{(activeIndex ?? 0) + 1} of {customerLetters.length}</p>
              </div>
              <button type="button" className="letter-control" aria-label="Close letter" autoFocus onClick={() => setActiveIndex(null)}><X size={22} /></button>
            </div>
            <div className="customer-letter-document" ref={documentRef} tabIndex={0} role="region" aria-label="Letter image, scroll to read">
              <Image key={activeLetter.id} src={activeLetter.src} alt={`${activeLetter.title}: an original customer letter shared with Sisi Care`} width={activeLetter.width} height={activeLetter.height} sizes="(max-width: 760px) 90vw, 800px" loading="eager" />
            </div>
            <div className="customer-letter-navigation">
              <button type="button" className="letter-control" aria-label="Previous letter" onClick={() => navigate(-1)}><ChevronLeft size={22} /></button>
              <a href={activeLetter.src} target="_blank" rel="noreferrer">Open full size <ArrowUpRight size={16} /></a>
              <button type="button" className="letter-control" aria-label="Next letter" onClick={() => navigate(1)}><ChevronRight size={22} /></button>
            </div>
          </div>
        )}
      </dialog>
    </div>
  );
}
