# Search launch notes for Sisi Care

The public address is **https://sisicarewa.com**. Search metadata uses that domain independently of the contact form's `SITE_ORIGIN` setting.

## What is included

- Five existing public pages with individual titles, descriptions, canonical URLs and social sharing metadata.
- Structured data for the existing pages, services, website and business, using the current visible content. Service links point to the original In-Home Care sections.
- Existing content and links remain available in the rendered HTML without JavaScript. The original page design, navigation and customer letters are preserved.
- `/sitemap.xml`, `/robots.txt`, a branded sharing image and responsive image optimization through the Node.js server.

## Publish and request indexing

1. Deploy the production build to the Node.js host with the custom domain connected. Run `npm run build` and `npm start`. Configure the host to redirect HTTP and `www.sisicarewa.com` to `https://sisicarewa.com`, preserving the path and query string. Avoid duplicate copies of the site at another indexable host address.
2. Use `SITE_INDEXABLE=true` for the public build. For staging, build with `SITE_INDEXABLE=false`; this emits noindex metadata and an empty sitemap. Rebuild after changing this value. Keep staging access restricted if it contains anything private: noindex is not access control.
3. In Google Search Console, verify the domain through DNS, or set `GOOGLE_SITE_VERIFICATION` to the HTML-tag verification token and rebuild. Submit `https://sisicarewa.com/sitemap.xml`. Inspect the homepage and the four other existing page URLs, then request indexing where appropriate.
4. In Bing Webmaster Tools, verify the site and submit the same sitemap. `BING_SITE_VERIFICATION` accepts the HTML-tag verification token if needed; rebuild after setting it.
5. Confirm the public business name, address, phone, email, office hours and service areas. Keep these consistent with the owner's verified Google Business Profile and other genuine business listings. Office hours are Monday–Friday, 9am–5pm; this is separate from the offered 24-hour care service.
6. After publishing, use Google's Rich Results Test and Search Console's live URL inspection. Check that pages and images load publicly, canonical URLs are correct, and the host does not add noindex or crawler restrictions. Watch indexing and search performance over time.

For contact form delivery, the production server still needs its Gmail and reCAPTCHA settings, and `SITE_ORIGIN=https://sisicarewa.com`. Search verification tokens and SMTP credentials serve different purposes. Keep credentials in the host's environment, outside Git.

## What Google controls

The expanded links in the reference screenshot are **sitelinks**. Google selects these automatically for particular searches. Clear service pages, descriptive headings and internal links support that discovery, but code cannot force a specific selection, layout or appearance date. [Google's sitelinks guidance](https://developers.google.com/search/docs/appearance/sitelinks).

For visibility in Google's AI features, the same crawlability, helpful content and accurate structured data used for ordinary search apply. There is no special AI schema or required AI text file, and inclusion is not guaranteed. [Google's AI features guidance](https://developers.google.com/search/docs/appearance/ai-features).

Structured data should continue to match the business information visitors see. Update `lib/business.ts` and the relevant visible content together when details change. [Google's local business guidance](https://developers.google.com/search/docs/appearance/structured-data/local-business).
