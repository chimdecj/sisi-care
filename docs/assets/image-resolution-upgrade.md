# Website image resolution upgrade

Thirteen screenshot-derived photos and five handwritten graphics have been restored with the built-in image editing tool and exported as optimized WebP files. Unused screenshot crops and superseded exports were removed during asset cleanup. Their crop coordinates are archived in `docs/assets/reference-crops.json`; `docs/assets/asset-cleanup.md` lists retired files.

The shared `ReferenceImage` component reads the active restored-image manifest directly; the old screenshot fallback has been removed. Restored assets preserve their original aspect ratios, page copy and alternative text. The Contact careers strip additionally uses the full-height image layout requested below.

| Asset                 | Original  | Restored web export |
| --------------------- | --------- | ------------------- |
| Home hero             | 502 × 342 | 1506 × 1026         |
| About hero            | 529 × 329 | 1587 × 987          |
| Careers hero          | 510 × 360 | 1530 × 1080         |
| Contact hero          | 537 × 317 | 1611 × 951          |
| Home hands photo      | 366 × 183 | 1464 × 732          |
| Memory care photo     | 381 × 208 | 1524 × 832          |
| Care help hands photo | 112 × 170 | 672 × 1020          |

The In-Home Care hero, shared wordmark and Bellevue panorama were already upgraded in preceding changes. The original customer-letter scans are retained: their content and signatures are not AI-edited.

## Careers photos and handwritten graphics

The Careers hero, three activity photos and caregiver portrait were restored, then all their visible uniform logos were corrected using `public/images/sisi-care-logo-hd.webp` as the reference. The shaded pink lotus and script wordmark replace the old outline flower and plain lettering. The wordmark uses white lettering for contrast on navy uniforms; the small header tagline is omitted from clothing.

| Asset                          | Original  | Restored web export |
| ------------------------------ | --------- | ------------------- |
| Meaningful connections photo   | 157 × 108 | 942 × 648           |
| Supporting independence photo  | 159 × 108 | 954 × 648           |
| Comfort and joy photo          | 159 × 108 | 954 × 648           |
| Caregiver portrait             | 132 × 154 | 792 × 924           |
| Good Caregivers Change Lives   | 128 × 126 | 768 × 756           |
| About family journey lettering | 298 × 93  | 1192 × 372          |
| Caregiver voices lettering     | 98 × 121  | 588 × 726           |
| Stronger Communities Together  | 165 × 95  | 990 × 570           |
| We're Here for You             | 143 × 94  | 858 × 564           |

Each image keeps the same aspect ratio and displayed dimensions. The handwritten phrases were checked against the prepared page copy, including punctuation. Photo exports use WebP quality 90 and text graphics quality 95. Generated transparency in the Good Caregivers graphic is preserved.

These are AI-assisted restorations, not higher-resolution source originals; fine photographic details are reconstructed. Source compositions, people, colors, and visible wording were used as editing constraints and reviewed before integration. Native output sizes are approximately 1500–1800 pixels wide for the landscape restorations, with exports adjusted slightly to exact original aspect ratios.

The Careers hero now uses `public/images/enhanced/hero-careers-brand.webp` (1530 × 1080). All three chest marks were corrected together using the header logo as reference. The earlier `hero-careers.webp` export was removed after its replacement was confirmed in use.

The five standalone handwritten raster graphics listed above have since been replaced by real Caveat text and Lucide outline hearts; see `docs/assets/handwritten-notes.md`. Their unused raster exports were removed during asset cleanup; the editing prompts remain in the historical record.

## Contact careers strip

The wooden-heart photograph now uses `public/images/enhanced/contact-careers.webp` at 1812 × 792, restored from the 302 × 132 screenshot crop. The lettering remains “Caring People. Brighter Days.” with a pink heart.

The photo fills the entire section height on desktop and tablet. Vertical space belongs to the text and button rather than above and below the photo. A dedicated media wrapper spans both text and button rows on tablet, and an adjusted crop keeps the lettering visible. On mobile the photo spans the full width at the top, followed by the original text and link.

## Founder portrait

The founder portrait now uses the newly supplied original photo, expanded and restored with the built-in image editing tool. The 1428 × 978 landscape export shows more shoulders and surroundings while preserving the existing page image ratio. See `docs/assets/founder-profile.md` for the source, editing prompt, and saved asset.

## About caregiver team photo

The team photograph now uses `public/images/enhanced/caregiver-team.webp` at 1620 × 824, restored from the 405 × 206 screenshot crop. Its composition, handwritten sign, and pink lotus / white script uniform logos are retained. The existing image ratio and page layout are unchanged. See `docs/assets/caregiver-team.md` for the source and both editing prompts.

## Remaining work

The earlier image-tool limit interrupted the initial full-site pass. The requested Careers photos and standalone handwritten graphics are now complete. These other assets still use their original files:

- Decorative lotus crop.

The Contact service-area map has been replaced with an interactive Google Maps embed.

No replacement people, unrelated stock photos, or simply enlarged screenshot crops were installed for these unfinished assets. The larger `founder.jpeg` and `care-at-home.webp` files depicted different photographs from the approved page designs and were removed as unused copies.

## Reproducibility

- Web assets and dimensions: `public/images/enhanced/sources.json`.
- Completed prompts, original generated-file locations, pending asset names and attempted prompts: `docs/assets/image-restoration-prompts.json`.
- Method: built-in image editing tool; no API or CLI image-generation fallback.
- Web exports: Sharp, WebP quality 88–95, smart chroma subsampling, exact original aspect ratios.
