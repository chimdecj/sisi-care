# Unused asset cleanup

Removed 59 unused images (3,491,840 bytes, about 3.33 MiB) from the public image directory. 39 active images remain.

The cleanup covers replaced screenshot crops, raster icons replaced by Lucide, handwritten graphics replaced by HTML text, old logo and hero variants, the former static map, and unused source-photo copies.

The shared ReferenceImage component now reads only the active image manifest in `public/images/enhanced/sources.json`. The old screenshot fallback and unused manifest entries are removed. `reference-crops.json` keeps the historical crop coordinates outside the public directory. Obsolete background rules for the unused `.area-section` layouts were also removed.

Customer-letter originals and thumbnails, the favicon, header/footer logo, desktop/mobile panoramas, the decorative lotus, and the locally hosted Caveat font with its license are retained. Supplied source materials in `pages/`, `customer/`, and outside the Next.js project are unchanged.

The other asset notes and editing prompt logs are historical records. References to retired images below document their origin; they are not application dependencies.

## Removed image files

- `public/images/care-at-home.webp`
- `public/images/enhanced/about-handwriting.webp`
- `public/images/enhanced/career-handwriting.webp`
- `public/images/enhanced/career-together.webp`
- `public/images/enhanced/career-voice-handwriting.webp`
- `public/images/enhanced/contact-handwriting.webp`
- `public/images/enhanced/hero-careers.webp`
- `public/images/founder.jpeg`
- `public/images/in-home-care-hero-clean.webp`
- `public/images/reference/about-cta-banner.webp`
- `public/images/reference/about-handwriting.webp`
- `public/images/reference/bellevue-landscape.webp`
- `public/images/reference/benefit-1.webp`
- `public/images/reference/benefit-2.webp`
- `public/images/reference/benefit-3.webp`
- `public/images/reference/benefit-4.webp`
- `public/images/reference/benefit-5.webp`
- `public/images/reference/care-area-banner.webp`
- `public/images/reference/care-hands.webp`
- `public/images/reference/care-service-1.webp`
- `public/images/reference/care-service-2.webp`
- `public/images/reference/care-service-3.webp`
- `public/images/reference/care-service-4.webp`
- `public/images/reference/career-connection.webp`
- `public/images/reference/career-handwriting.webp`
- `public/images/reference/career-independence.webp`
- `public/images/reference/career-joy.webp`
- `public/images/reference/career-together.webp`
- `public/images/reference/career-voice-handwriting.webp`
- `public/images/reference/careers-cta-banner.webp`
- `public/images/reference/caregiver-portrait.webp`
- `public/images/reference/caregiver-team.webp`
- `public/images/reference/contact-careers.webp`
- `public/images/reference/contact-handwriting.webp`
- `public/images/reference/contact-map.webp`
- `public/images/reference/founder.webp`
- `public/images/reference/hero-about.webp`
- `public/images/reference/hero-care.webp`
- `public/images/reference/hero-careers.webp`
- `public/images/reference/hero-contact.webp`
- `public/images/reference/hero-home.webp`
- `public/images/reference/home-area-banner.webp`
- `public/images/reference/home-hands.webp`
- `public/images/reference/home-service-1.webp`
- `public/images/reference/home-service-2.webp`
- `public/images/reference/home-service-3.webp`
- `public/images/reference/home-service-4.webp`
- `public/images/reference/home-service-5.webp`
- `public/images/reference/home-service-6.webp`
- `public/images/reference/logo-careers.webp`
- `public/images/reference/logo-contact.webp`
- `public/images/reference/logo-navy.webp`
- `public/images/reference/logo-wine.webp`
- `public/images/reference/logo.webp`
- `public/images/reference/memory-care.webp`
- `public/images/reference/value-1.webp`
- `public/images/reference/value-2.webp`
- `public/images/reference/value-3.webp`
- `public/images/reference/value-4.webp`

## Verification

Verified all five pages at mobile and desktop widths: visible text, section geometry, image sources and dimensions, and background images match the pre-cleanup baseline. All 39 retained image URLs returned HTTP 200. Prettier and the production build (including TypeScript) passed. All 59 removed images and the retired public crop manifest are absent from the rebuilt static export.
