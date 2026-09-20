# Sisi Care content editor

Open `https://sisicarewa.com/admin/`. One administrator can edit page text and
replace photos, then publish updates without rebuilding or restarting the site.
The editor uses private JSON files, matching the Steppe project, with no database.

## First-time Namecheap setup

Upload the new deployment package and extract it into the existing `sisi-care`
application. Activate Node.js in cPanel Terminal:

```sh
source /home/sisimjby/nodevenv/sisi-care/24/bin/activate
cd /home/sisimjby/sisi-care
npm install --include=dev
npm run admin:password
```

Enter a new admin password of 12–256 characters. Input is hidden. The command
prints a password hash and a random session secret; it does not save them. Save
the password in your password manager and enter these variables in cPanel:

| Variable               | Value                                                  |
| ---------------------- | ------------------------------------------------------ |
| `ADMIN_USERNAME`       | Your chosen admin username                             |
| `ADMIN_PASSWORD_HASH`  | The complete `scrypt:...` value printed by the command |
| `ADMIN_SESSION_SECRET` | The generated session secret (at least 32 characters)  |
| `CONTENT_DIR`          | `/home/sisimjby/sisi-care-data`                        |
| `SITE_ORIGIN`          | `https://sisicarewa.com` — no trailing slash           |

Keep these settings private; never prefix them with `NEXT_PUBLIC_`. The storage
folder must be outside the application root and `public_html`. The application
creates it with private permissions if its account has permission to do so.
Existing SMTP and CAPTCHA variables remain required for the consultation form.

Set the public CAPTCHA key in the build shell as described in DEPLOYMENT.md, run
`npm run build`, and restart the application in cPanel. Use `server.js` as the
startup file. Open `/admin/` over HTTPS and sign in.

Local development uses `.env.local` and `.local-content/` by default. Production
requires the explicit private `CONTENT_DIR`. Public pages retain the current seed
content until the first publish. Missing admin credentials disable sign-in.

## Editing

Choose Shared text, Home, In-Home Care, About, Careers, or Contact. Edit text fields
and expand numbered items to edit cards, lists, testimonials, and form options.
The existing number of sections/items is preserved so icons and layouts stay
aligned. Contact options must be unique and no longer than 60 characters.
Detailed In-Home Care service descriptions are editable in their own section.

Photos accept JPEG, PNG, and WebP, up to 10 MB and 40 megapixels. They are decoded,
resized to fit 2,000 × 2,000 pixels, and saved as WebP. Shared text contains the hero
photo currently shared by Home, In-Home Care, About, and Contact. Careers has its
own hero photo. Other page photos appear under the corresponding page tab.

Uploads are stored immediately, but the public image changes only when published.
**Publish changes** saves all tabs together. **View live page** opens a separate
tab; refresh it after publishing. **Discard changes** restores the last saved
content. Navigating away warns about unpublished changes.

This editor covers the prepared page copy, detailed care services, and page
photos. Business contact details in `lib/business.ts`, navigation, search metadata,
logo, footer panorama, customer-letter originals, and visual layout remain managed
in the project. Editing contact-form labels does not change SMTP destinations.

## Sessions, conflicts, and recovery

Sessions last eight hours and use an HTTP-only, Secure production cookie. There
is one active administrator session: signing in again replaces the previous one.
Sign-out invalidates that session. Changing the password hash, username, or
session secret also invalidates existing sessions after the server restarts.

If a session expires, edits stay in the editor. Sign in in another tab, then return
and publish. If another tab has published newer content, publishing is rejected:
copy your unsaved edits somewhere safe, reload, and reapply them.

Each publish atomically saves `content.json` and keeps the previously published
version in `content.previous.json`. Back up both files and `uploads/` together.
Keep the entire private folder across source updates, rebuilds, and restarts.
Do not extract the deployment package into this folder. Old uploaded photos are
retained so backups keep working; remove unused photos only after checking both
saved versions and taking a backup.

To restore the previous version, stop the application, back up the entire data
folder, copy `content.previous.json` over `content.json`, and restart. A failed or
corrupt stored file is not silently replaced by defaults. Check the application
logs and restore a known-good backup if reading fails.

Filesystem locks coordinate publishing and login limits across Passenger workers.
If a crashed process leaves `content.lock`, `login.lock`, or `upload.lock`, stop
all application processes before removing that stale lock directory and restarting.

## Login protection on Namecheap

Ten login attempts per network are allowed within 15 minutes. Limits are stored
on disk and survive restarts. Production login must run through `server.js`, which
replaces incoming client-identity headers and signs the socket address. Do not use
`next start` directly for this editor.

If the hosting proxy hides client addresses, multiple visitors may share a login
limit. Only set `ADMIN_TRUSTED_PROXIES` to exact, verified proxy IP addresses supplied
by the host, after confirming that the proxy safely appends/replaces
`X-Forwarded-For`. Never guess proxy addresses. Restart after changing this setting.

## Live checks

Sign in, change one heading, publish, and verify it in a separate public browser.
Restore it through the editor. Upload one image, publish, and check it after a
restart. Confirm a signed-out visitor cannot read or modify admin API content.
Test an actual consultation after changing form choices. Local checks cannot
verify your cPanel permissions, proxy behavior, SMTP delivery, or HTTPS setup.
