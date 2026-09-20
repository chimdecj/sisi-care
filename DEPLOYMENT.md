# Namecheap Stellar deployment

This follows the Steppe website's cPanel/Passenger setup: a Node.js application,
`server.js` startup file, and a source archive built on the hosting server.
The contact API requires Node.js. Keep the default Next.js output; do not enable
static export or standalone output with this startup file.

## 1. Create the application

In cPanel, open **Setup Node.js App → Create Application**:

| Setting                  | Value                                                        |
| ------------------------ | ------------------------------------------------------------ |
| Node.js version          | 22 or 24, as available on your account                       |
| Application mode         | Production                                                   |
| Application root         | `sisi-care` (under your account home, outside `public_html`) |
| Application URL          | `https://sisicarewa.com`, at `/`                             |
| Application startup file | `server.js`                                                  |

Create a separate application for Sisi Care so the existing Steppe website keeps
its own root and settings. Add the Sisi Care domain to this hosting account if
needed. Keep cPanel's generated Passenger configuration and managed `node_modules`
link. Do not copy Steppe's `.htaccess`: its account paths and domain are different.

## 2. Upload the source package

On your computer, run:

```sh
npm run deploy:package
```

Upload `dist/sisi-care-namecheap.tar.gz` using cPanel File Manager and extract it
directly into the `sisi-care` application root. `package.json` and `server.js` must
sit directly in that root. The archive includes the blank `.env.example` template,
but excludes local credentials, Git history, dependencies, and the macOS build.

## 3. Set environment variables

Add these in the application's cPanel environment settings:

| Variable                         | Value                                             |
| -------------------------------- | ------------------------------------------------- |
| `NODE_ENV`                       | `production`                                      |
| `SITE_ORIGIN`                    | `https://sisicarewa.com` (no trailing slash)      |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | Sisi Care's reCAPTCHA v2 checkbox public site key |
| `RECAPTCHA_SECRET_KEY`           | Matching private secret                           |
| `SMTP_HOST`                      | `smtp.gmail.com`                                  |
| `SMTP_PORT`                      | `465`                                             |
| `SMTP_SECURE`                    | `true`                                            |
| `SMTP_USER`                      | Full sender Gmail address                         |
| `SMTP_PASSWORD`                  | That account's Google App Password                |
| `SMTP_FROM`                      | Same sender address, or an authorized alias       |
| `CONTACT_TO`                     | `info@sisicarewa.com`                             |
| `SITE_INDEXABLE`                 | `true` for the live site; `false` for staging     |
| `GOOGLE_SITE_VERIFICATION`       | Optional Search Console token                     |
| `BING_SITE_VERIFICATION`         | Optional Bing verification token                  |

Use Sisi Care's credentials; none are copied from Steppe. Register `sisicarewa.com`
in Google's reCAPTCHA domain settings. Configure HTTPS and redirect the `www`
domain to `https://sisicarewa.com` so it matches the form origin and canonical URLs.

## 4. Install and build

Open cPanel Terminal/SSH. Activate the Node.js environment before running any
`node` or `npm` commands. For the current `sisimjby` account, `sisi-care`
application, and Node.js 24 environment, run:

```sh
ls -R "$HOME/nodevenv"
```

```sh
source /home/sisimjby/nodevenv/sisi-care/24/bin/activate
cd /home/sisimjby/sisi-care
node -v
npm install --include=dev
```

`node -v` should show `v24...`. Repeat the activation and `cd` commands each time
you open a new Terminal/SSH session. If you see `node: command not found` or
`npm: command not found`, activate the environment first, then retry.

If the account, application root, or Node.js version changes, use the updated
activation command displayed in **Setup Node.js App**. To inspect the available
environment folders, run `ls -R "$HOME/nodevenv"`.

Install development dependencies too, because TypeScript and Tailwind are needed
for the build.

Use this command or cPanel's **Run NPM Install** with development dependencies
enabled. Preserve the managed `node_modules` link; avoid `npm ci` on this cPanel
application because it removes the existing dependency directory before installing.

The public CAPTCHA key and search settings must also be present in the build
shell. cPanel's runtime environment settings may not be inherited by Terminal.
Replace the example public key before running:

```sh
export NEXT_PUBLIC_RECAPTCHA_SITE_KEY='6LfZgsMtAAAAAKKIGRinlWjwTrq51vWhMPj5L66e'
export SITE_INDEXABLE=true
npm run build
```

Also export the optional verification tokens before building if configured.
Keep SMTP credentials and the private CAPTCHA secret in cPanel settings.
The build uses Webpack, one build worker, and Next.js memory optimizations, matching
Steppe's approach. If the account still runs out of memory, build in a compatible
Linux environment with the same Node.js version, lockfile, and build variables.
Transfer that `.next` build alongside matching source and install dependencies on
the host. Never upload macOS `node_modules` to the Linux host.

After a successful build, use cPanel's **Restart** button. Passenger starts
`server.js`. Do not leave `npm run dev` or a second background server running.
`npm start` uses the same entry point for local production checks.

## 5. Verify the live site

Open `/`, `/in-home-care/`, `/about/`, `/careers/`, and `/contact/` directly over
HTTPS and refresh each page. Check images, `/sitemap.xml`, `/robots.txt`, and
`/opengraph-image`. Complete the CAPTCHA and submit a real consultation request;
confirm delivery to the receiving inbox and the visitor address in Reply-To.
The host must allow outbound SMTP TLS on port 465 and HTTPS to Google.

Check cPanel application logs if startup fails. For `INVALID_ORIGIN`, compare the
browser's actual origin with `SITE_ORIGIN`. Missing email/CAPTCHA settings make the
form unavailable. Public CAPTCHA key, search settings, or code changes require a
rebuild and restart; private credential changes require a restart.

Local checks cannot confirm the account's Passenger integration, DNS, HTTPS, or
actual email delivery. Those must be verified after uploading.

Official guide: [Namecheap Setup Node.js App](https://www.namecheap.com/support/knowledgebase/article.aspx/10047/2182/how-to-work-with-nodejs-app/).

## Content editor

The `/admin/` page lets your administrator edit all five pages' text and page
photos. Follow [CONTENT-EDITOR.md](CONTENT-EDITOR.md) to generate login credentials
and configure `CONTENT_DIR=/home/sisimjby/sisi-care-data`. Keep this private folder
outside `sisi-care` and `public_html`, and preserve it across deployments.
Build and restart once after installing the editor. Later publishing requires
neither a rebuild nor a restart. Production login requires the supplied `server.js`.
