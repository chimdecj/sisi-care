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

Page wording is transcribed from the five supplied images in `pages/` and stored in `lib/prepared-content.json`. Headings, paragraphs, lists, testimonials, button labels, and form choices follow each page’s own reference. The homepage’s five-star displays are present in the supplied home reference; they are not calculated ratings. The separate customer-letter gallery preserves the original supplied letters and its transcribed excerpts. The current design uses the supplied page artwork: photos, the standard logo, map, handwriting, and panoramic scenery are extracted from the prepared page images without generative replacement. These assets are in `public/images/reference/`; `sources.json` records the source image and crop coordinates. The original prepared images remain unchanged. `components/brand-logo.tsx` uses the homepage’s horizontal pink-lotus logo (`public/images/reference/logo.webp`) for every header and footer.

Editable shared content and contact details: `lib/content.ts`. Shared styles: `app/globals.css`. Pages and components are in `app/` and `components/`.

Original supplied materials remain in place. At the user’s request, the homepage testimonials now include a gallery of the customer letter photos. The 14 source files contain 10 unique images; byte-for-byte duplicates appear once. Full-resolution copies and lightweight previews are in `public/images/customer-letters/`, with gallery entries in `lib/customer-letters.ts`. The gallery is enabled only on the homepage and opens from “View All Testimonials,” preserving the prepared homepage layout. Compact cards pair the original previews with transcribed excerpts and author attribution. Visitors can expand the gallery, read each original in a keyboard-accessible dialog, and open the full-size image. These selected letter images are part of the website output; publishing remains subject to the owner’s approval.

## Reference design

The website uses the prepared bright pink, navy, burgundy, pale pink, and pale blue palette, with bold serif headings and sans-serif body copy. All five pages follow their own supplied section arrangements. Headings, paragraphs, menus, cards, and the consultation form remain native HTML. Home and In-Home Care have separate hero components, service grids, and content layouts matching their individual references. All interface icons use Lucide React SVGs, including services, values, benefits, trust badges, and scenic banners. Every page ends with the same shared `SiteFooter` from the root layout: a higher-resolution generated Bellevue-inspired sunset panorama, a translucent contact card, and matching logo, navigation, typography, and colors. The responsive desktop/mobile images and glass-card styling live in `components/service-area.tsx` and `app/globals.css`. Its source prompt and asset details are recorded in `docs/assets/bellevue-eastside-panorama.md`. Page-specific consultation and application messages sit above the shared footer with consistent navy typography and blush backgrounds. Social marks are decorative until actual profile URLs are supplied.
