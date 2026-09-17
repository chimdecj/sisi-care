import localFont from 'next/font/local';
import { Heart } from 'lucide-react';

const caveat = localFont({
  src: '../public/fonts/caveat/caveat-latin.woff2',
  weight: '400 700',
  display: 'swap',
  fallback: ['Segoe Print', 'Bradley Hand', 'cursive'],
});

const lineLengths = {
  story: [6, 4],
  caregivers: [1, 1, 1, 1],
  voices: [1, 1, 1, 1],
  together: [1, 1, 1],
  contact: [2, 2],
} as const;

type NoteVariant = keyof typeof lineLengths;

export function HandwrittenNote({
  text,
  variant,
  className = '',
}: {
  text: string;
  variant: NoteVariant;
  className?: string;
}) {
  const words = text.split(/\s+/);
  let start = 0;
  const lines = lineLengths[variant].map((length, index, lengths) => {
    const end = index === lengths.length - 1 ? words.length : start + length;
    const line = words.slice(start, end).join(' ');
    start = end;
    return line;
  });

  return (
    <div
      className={`handwritten-note handwritten-note-${variant} ${caveat.className} ${className}`}
    >
      <div className="handwritten-note-canvas">
        <p className="handwritten-note-text">
          {lines.map((line, index) => (
            <span className="handwritten-note-line" key={index}>
              {line}
              {index < lines.length - 1 ? ' ' : ''}
            </span>
          ))}
        </p>
        <Heart
          className="handwritten-note-heart"
          size={24}
          strokeWidth={2.3}
          fill="none"
          aria-hidden="true"
          focusable="false"
        />
      </div>
    </div>
  );
}
