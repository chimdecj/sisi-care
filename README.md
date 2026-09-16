# Sisi Care

A responsive introduction website built with Next.js App Router, TypeScript, and Tailwind CSS v4.

## Local development

```sh
npm install
npm run dev
```

Open http://127.0.0.1:3000. Run `npm run typecheck` to check types and `npm run build` for the production static export in `out/`. Deploy that directory to a static web host. `next start` is not used with static exports.

## Pages

- Home: overview, services, founder story, customer letters, getting started, service area
- In-Home Care: services, memory support, 24-hour care, flexible care options
- About Us: founder, story, values, caregiver qualifications
- Careers: caregiving information and an email inquiry link
- Contact: office information, directions, and a consultation email composer

The contact form validates input and prepares a message for the visitor to review and send in their own email application. It does not submit, store, or claim to deliver inquiries. Visitors can also copy their message. Connect a suitable email/form service if direct delivery is required. Careers inquiries likewise open an email draft.

## Content and assets

Business information is transcribed from the supplied page references. Testimonials are excerpts from supplied customer letters; star ratings were not inferred. The supplied logo and founder photo are used. The hero is an AI-generated illustrative image, not a photograph of Sisi Care employees or clients.

Editable shared content and contact details: `lib/content.ts`. Shared styles: `app/globals.css`. Pages and components are in `app/` and `components/`.

Original supplied materials remain in place. At the user’s request, the homepage testimonials now include a gallery of the customer letter photos. The 14 source files contain 10 unique images; byte-for-byte duplicates appear once. Full-resolution copies and lightweight previews are in `public/images/customer-letters/`, with gallery entries in `lib/customer-letters.ts`. The gallery is enabled only on the homepage. Visitors can expand the gallery, read each original in a keyboard-accessible dialog, and open the full-size image. These selected letter images are part of the website output; publishing remains subject to the owner’s approval.

Hero asset: `public/images/care-at-home.webp`, generated using the built-in image tool and optimized for the web. Prompt: “A warm candid interaction between a smiling mature East Asian female caregiver in navy scrubs and an elderly East Asian woman in a soft pink cardigan, seated in a bright residential living room, gently holding hands and sharing mutual eye contact. Polished natural editorial photography, vertical composition showing both faces and hands, soft daylight, warm white setting with subtle greenery. No text, logos, UI, borders, or watermarks.”
