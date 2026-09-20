# Sisi Care

A responsive introduction website built with Next.js App Router, TypeScript, and Tailwind CSS v4.

## Local development

```sh
npm install
npm run dev
```

Use Node.js 22 or 24. Open http://127.0.0.1:3000. Run `npm test` for the contact-form and search metadata checks, `npm run typecheck` to check types, and `npm run build` for a production build. Run `npm start` to serve that build through `server.js`. The contact form needs a running server; uploading `out/` to a static-only host will not support email delivery.

## Namecheap Stellar deployment

The project follows the Steppe website's cPanel Node.js deployment approach, with a `server.js` startup file and lower-memory production builds. Run `npm run deploy:package` to create `dist/sisi-care-namecheap.tar.gz`. Follow [DEPLOYMENT.md](DEPLOYMENT.md) for upload, cPanel settings, environment variables, build commands, and live checks. Hosting credentials are configured in cPanel and are not included in the archive.

## Formatting

Run `npm run format` to format the project, or `npm run format:check` to check formatting without changing files. Prettier uses the shared settings in `.prettierrc.json`; `.prettierignore` excludes generated files, dependencies, and supplied reference materials.

## Pages

- Home: overview, services, founder story, customer letters, getting started, service area
- In-Home Care: services, memory support, 24-hour care, flexible care options
- About Us: founder, story, values, caregiver qualifications
- Careers: caregiving information and an email inquiry link
- Contact: office information, directions, and a consultation form that sends inquiries through Gmail

The contact form posts to `/api/contact/`. The server validates the fields, requires JSON requests from the configured site origin, caps the request body, checks a hidden spam field and Google reCAPTCHA v2, and sends a plain-text inquiry through Gmail SMTP over TLS. Success is shown only after SMTP accepts the message. Messages go to `CONTACT_TO`, defaulting to `contact.email` in `lib/content.ts` (currently `info@sisicarewa.com`); the visitor’s address is used only for Reply-To. Careers inquiries still open an email draft.

## Gmail setup

This follows the Steppe website’s SMTP environment settings and reCAPTCHA approach, adapted to the care-request fields. No credentials are copied from the reference project.

1. Use a Gmail account with [2-Step Verification and an App Password](https://support.google.com/accounts/answer/185833). Some accounts restrict App Passwords.
2. Copy `.env.example` to `.env.local`. Set `SMTP_USER` to the full Gmail sender address, `SMTP_PASSWORD` to its App Password, and `SMTP_FROM` to that same address (or leave it blank to use `SMTP_USER`). Never use the normal sign-in password or commit credentials.
3. Keep `CONTACT_TO=info@sisicarewa.com` and set `SITE_ORIGIN` to the exact production HTTPS origin without a trailing slash. Localhost and 127.0.0.1 are also allowed automatically during development.
4. Register a [Google reCAPTCHA v2 checkbox](https://www.google.com/recaptcha/admin/create) for the Sisi Care domain and `localhost`. Set `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` and its matching `RECAPTCHA_SECRET_KEY`. The public site key is embedded at build time, so rebuild after changing it. Use v2 siteverify-compatible keys, not v3 or Enterprise API keys.
5. Add these environment settings to the Node.js host, build, and restart. Run `npm start` for production. The server must permit outbound TLS SMTP on port 465 and HTTPS to Google for CAPTCHA verification.
6. Submit a test inquiry and check `info@sisicarewa.com`, including its spam folder. Local automated tests mock Google and SMTP and do not send real email. SMTP acceptance does not guarantee inbox delivery.

The default transport uses [Gmail SMTP via Nodemailer](https://nodemailer.com/usage/using-gmail/) at `smtp.gmail.com:465`. `SMTP_HOST`, `SMTP_PORT`, and `SMTP_SECURE` use the same names as Steppe; port 587 with `SMTP_SECURE=false` requires STARTTLS. Keep `SMTP_FROM` to the Gmail account or an authorized sending alias. The visitor’s address is only Reply-To.

Server credentials are read at request time, so builds need only the public CAPTCHA site key. Missing settings make the form unavailable and offer phone/email alternatives. Google [verifies the token and its hostname](https://developers.google.com/recaptcha/docs/verify) before SMTP is called. The widget resets after every attempt. Entered form details remain after a failure, and requests are not automatically retried because a lost SMTP response can leave delivery uncertain.

Basic throttling allows three attempts per sender and 30 total attempts per ten-minute window per server process. It keeps only temporary hashed sender keys and counters. These counters reset after a restart and are not shared between serverless instances; configure hosting-level rate limits for production abuse protection. The application does not store submissions or log message contents/credentials. Gmail and the receiving mailbox retain sent mail according to their settings.

## Content and assets

Page wording is transcribed from the five supplied images in `pages/` and stored in `lib/prepared-content.json`. Headings, paragraphs, lists, testimonials, button labels, and form choices follow each page’s reference. The homepage’s five-star displays come from the supplied home reference; they are not calculated ratings. The customer-letter gallery preserves the supplied letters and their transcribed excerpts. Current website photos are in `public/images/enhanced/`, with active image paths and dimensions in `sources.json`. The shared `ReferenceImage` component uses that manifest. Header and footer logos use `public/images/sisi-care-logo-hd.webp`; the favicon uses `public/images/sisi-care-logo.png`. Handwritten notes use the locally hosted Caveat font, interface icons use Lucide, and Contact uses an interactive Google Maps embed. Retired web images have been removed; historical crop metadata is in `docs/assets/reference-crops.json`, and the cleanup inventory is in `docs/assets/asset-cleanup.md`.

Editable shared content: `lib/content.ts`. Contact details: `lib/business.ts` (re-exported from `lib/content.ts`). Shared styles: `app/globals.css`. Pages and components are in `app/` and `components/`.

Original supplied materials remain in place. At the user’s request, the homepage testimonials now include a gallery of the customer letter photos. The 14 source files contain 10 unique images; byte-for-byte duplicates appear once. Full-resolution copies and lightweight previews are in `public/images/customer-letters/`, with gallery entries in `lib/customer-letters.ts`. The gallery is enabled only on the homepage and opens from “View All Testimonials,” preserving the prepared homepage layout. Compact cards pair the original previews with transcribed excerpts and author attribution. Visitors can expand the gallery, read each original in a keyboard-accessible dialog, and open the full-size image. These selected letter images are part of the website output; publishing remains subject to the owner’s approval.

## Reference design

The website uses the prepared bright pink, navy, burgundy, pale pink, and pale blue palette, with bold serif headings and sans-serif body copy. All five pages follow their supplied section arrangements. Headings, paragraphs, menus, cards, and the consultation form remain native HTML. Home and In-Home Care retain separate hero components, service grids, and content layouts; In-Home Care now shares the About page’s hero photograph. Every page ends with the shared `SiteFooter`: a Bellevue-inspired sunset panorama, consistent logo, navigation, contact information, typography, and colors. The desktop/mobile panorama images and section styling live in `components/service-area.tsx` and `app/globals.css`; the source prompt is recorded in `docs/assets/bellevue-eastside-panorama.md`. Page-specific consultation and application messages sit above the shared footer. Social marks remain decorative until actual profile URLs are supplied.

## Search setup

Search metadata uses the confirmed public domain `https://sisicarewa.com`. Each existing page has its own title, description and canonical URL. The site includes business and service structured data, a sitemap, robots instructions and a branded sharing image. These improvements preserve the original visible page design and navigation. See [SEO-LAUNCH.md](SEO-LAUNCH.md) for deployment, verification and indexing steps, including staging settings and how Google selects sitelinks.
