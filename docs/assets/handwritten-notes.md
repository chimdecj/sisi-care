# Handwritten notes as real text

Five standalone screenshot graphics are now selectable HTML text rendered by `components/handwritten-note.tsx`:

- About: “It’s an honor to be part of your family’s journey.”
- Careers: “Good Caregivers Change Lives.”
- Careers: “Caring People. Brighter Tomorrows.”
- Careers: “Stronger Communities Together.”
- Contact: “We’re Here for You.”

The wording comes from `lib/prepared-content.json`. Line wrapping preserves the prepared compositions, and the original placement classes and aspect ratios preserve section geometry. Container-relative type sizes scale with each note. Decorative hearts use the existing Lucide outline icon and remain hidden from assistive technology.

The font is Caveat, a close handwriting match rather than an exact identification of the screenshot lettering. It is loaded locally through `next/font/local`, scoped only to these notes. Its Latin variable WOFF2 file and SIL Open Font License are in `public/fonts/caveat/`; visitors make no external Google Fonts requests. The page body fonts and lettering embedded inside photographs are unchanged. Earlier raster note assets have been removed because these pages now render the notes as text.

Font source: https://github.com/google/fonts/tree/main/ofl/caveat

Validation: exact wording and surrounding page copy, outline hearts, no raster note elements, unchanged section heights, and no horizontal overflow at 320, 390, 768, and 1440 pixels across About, Careers, and Contact. Production build passed.
