# Sisi Care

A responsive introduction website built with Next.js App Router, TypeScript, and Tailwind CSS v4.

## Local development

```sh
npm install
npm run dev
```

Open http://127.0.0.1:3000. Run `npm run typecheck` to check types and `npm run build` for the production static export in `out/`. Deploy that directory to a static web host. `next start` is not used with static exports.

## Formatting

Run `npm run format` to format the project, or `npm run format:check` to check formatting without changing files. Prettier uses the shared settings in `.prettierrc.json`; `.prettierignore` excludes generated files, dependencies, and supplied reference materials.

## Pages

- Home: overview, services, founder story, customer letters, getting started, service area
- In-Home Care: services, memory support, 24-hour care, flexible care options
- About Us: founder, story, values, caregiver qualifications
- Careers: caregiving information and an email inquiry link
- Contact: office information, directions, and a consultation email composer

The contact form validates input and prepares a message for the visitor to review and send in their own email application. It does not submit, store, or claim to deliver inquiries. Visitors can also copy their message. Connect a suitable email/form service if direct delivery is required. Careers inquiries likewise open an email draft.

## Content and assets

Page wording is transcribed from the five supplied images in `pages/` and stored in `lib/prepared-content.json`. Headings, paragraphs, lists, testimonials, button labels, and form choices follow each page’s reference. The homepage’s five-star displays come from the supplied home reference; they are not calculated ratings. The customer-letter gallery preserves the supplied letters and their transcribed excerpts. Current website photos are in `public/images/enhanced/`, with active image paths and dimensions in `sources.json`. The shared `ReferenceImage` component uses that manifest. Header and footer logos use `public/images/sisi-care-logo-hd.webp`; the favicon uses `public/images/sisi-care-logo.png`. Handwritten notes use the locally hosted Caveat font, interface icons use Lucide, and Contact uses an interactive Google Maps embed. Retired web images have been removed; historical crop metadata is in `docs/assets/reference-crops.json`, and the cleanup inventory is in `docs/assets/asset-cleanup.md`.

Editable shared content and contact details: `lib/content.ts`. Shared styles: `app/globals.css`. Pages and components are in `app/` and `components/`.

Original supplied materials remain in place. At the user’s request, the homepage testimonials now include a gallery of the customer letter photos. The 14 source files contain 10 unique images; byte-for-byte duplicates appear once. Full-resolution copies and lightweight previews are in `public/images/customer-letters/`, with gallery entries in `lib/customer-letters.ts`. The gallery is enabled only on the homepage and opens from “View All Testimonials,” preserving the prepared homepage layout. Compact cards pair the original previews with transcribed excerpts and author attribution. Visitors can expand the gallery, read each original in a keyboard-accessible dialog, and open the full-size image. These selected letter images are part of the website output; publishing remains subject to the owner’s approval.

## Reference design

The website uses the prepared bright pink, navy, burgundy, pale pink, and pale blue palette, with bold serif headings and sans-serif body copy. All five pages follow their supplied section arrangements. Headings, paragraphs, menus, cards, and the consultation form remain native HTML. Home and In-Home Care retain separate hero components, service grids, and content layouts; In-Home Care now shares the About page’s hero photograph. Every page ends with the shared `SiteFooter`: a Bellevue-inspired sunset panorama, consistent logo, navigation, contact information, typography, and colors. The desktop/mobile panorama images and section styling live in `components/service-area.tsx` and `app/globals.css`; the source prompt is recorded in `docs/assets/bellevue-eastside-panorama.md`. Page-specific consultation and application messages sit above the shared footer. Social marks remain decorative until actual profile URLs are supplied.
