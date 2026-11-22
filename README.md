# ClassOne Consulting — website

Marketing site for **ClassOne Consulting** (HR Consulting | Financial Advisory, Chennai).
Built with Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 3 and Framer Motion.
The hero is a pre-rendered image sequence scrubbed by scroll on a `<canvas>`.

**Requires Node.js 20.9 or newer** (Next 16 and sharp 0.35 do not run on Node 18).

```bash
npm install
cp .env.example .env.local   # fill in the values, see below
npm run dev                  # http://localhost:3000
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Development server |
| `npm run build` / `npm start` | Production build / serve (Vercel or any Node host) |
| `npm run build:pages` | Static export for GitHub Pages into `out/` |
| `npm run preview:pages` | Serve `out/` locally (build without `BASE_PATH` to preview at `/`) |
| `npm run lint` / `npm run typecheck` | ESLint / TypeScript |
| `npm run prepare-frames` | Converts the hero frame sequence (see below) |
| `npm run brand-assets` | Regenerates logo PNGs, favicon and Open Graph image |

---

## Pages

| Route | Contents |
| --- | --- |
| `/` | Scroll-scrubbed hero, about teaser, services, why ClassOne, numbers, testimonials, CTA |
| `/about` | Story, why ClassOne, numbers, industries, testimonials |
| `/services` | All eight services (each row links to its page) and industries |
| `/services/[slug]` | One page per service: overview, what's included, outcomes, related services. Content comes from `lib/content.ts` (**draft copy: review before launch**). |
| `/process` | Five-step process and FAQ (pricing answer is a placeholder) |
| `/contact` | Consultation form and contact details |
| 404 | Custom not-found page |

Shared chrome (nav with active state, footer, WhatsApp button, JSON-LD) lives in `app/layout.tsx`.
Internal links use `next/link`, so navigation is client-side and the base path is handled
automatically.

---

## Hero frame sequence

Frame 1 is the assembled ClassOne building; the last frame is the exploded view with the eight
service platforms. Scroll position maps directly to the frame index (with cross-fading between
neighbouring frames), so scrolling down opens the building and scrolling up closes it.

### Preparing frames

1. Put the frames in `public/frames/` — JPG, PNG or WebP, any file names.
   They are sorted in natural numeric order (`2` comes before `10`).
2. Run:

   ```bash
   npm run prepare-frames
   ```

   This:
   - converts every frame to `public/frames/frame_0001.webp …` (1920px wide, WebP q80);
   - removes the originals **only after every frame converted successfully**;
   - writes 960px copies to `public/frames-mobile/` with the same names;
   - samples the background colour of frame 1 and writes it, with the frame count, to
     `lib/frames-manifest.json`. The hero, the Tailwind `ink` colour, the page background and the
     browser theme colour all read from this file, so the sequence has no visible edges.

   Running it again on an already-prepared folder does not re-encode the desktop frames, so
   quality is not lost; it only refreshes the mobile set and the manifest.

3. Optionally run `npm run brand-assets` to rebuild the social preview image from the new frame 1.

The current set is 240 frames (about 49 MB desktop, 18 MB mobile), with background `#090e10`.

### How the hero loads and plays

- Frame 1 is preloaded in `<head>` and drawn as soon as it arrives. The remaining frames load
  once the page has finished loading, coarse to fine (every 16th, then 8th, 4th…), so the full
  scroll range works early and gains detail as more frames arrive.
- Frames are decoded off the main thread with `createImageBitmap`, at the size they are
  displayed. Only a window of decoded frames around the playhead is kept in memory, because 240
  decoded 1080p frames would need about 2 GB. The renderer always draws the nearest frames that
  are ready, so scrubbing never waits on a decode.
- The canvas is scaled for `devicePixelRatio` (capped at 2) and draws with object-fit: cover into a
  "stage" rectangle (see `components/hero/stage.ts`). The building fills almost the whole source
  frame, so the stage leaves a dark band for the narrative text (below the building on desktop,
  stacked under it on mobile). The stage grows into that band for the final, label-filled frames.
- With **Save-Data** turned on, only every 4th frame is loaded.
- With **prefers-reduced-motion**, the pin is removed and a static frame 1 is shown (pure CSS, so
  there is no layout jump), and other motion becomes simple fades.

---

## Content and configuration

| File | Contents |
| --- | --- |
| `lib/site-config.ts` | Name, city, address, phone, email, **WhatsApp number and message**, social links, hours. Used by the nav, footer, contact section, WhatsApp button, metadata and JSON-LD. |
| `lib/content.ts` | Services, "Why ClassOne", stats, process steps, industries, testimonials. |
| `components/sections/About.tsx` | Founding story (placeholder). |

### ⚠️ Replace before launch

Search the code for `PLACEHOLDER`:

- **Founding story** — `components/sections/About.tsx`
- **Service page copy** (overview, what's included, outcomes) — `lib/content.ts` (draft)
- **FAQ answers**, especially pricing — `app/process/page.tsx`
- **Stats** (clients, placements, years, industries) — `stats` in `lib/content.ts`
- **Testimonials** — `testimonials` in `lib/content.ts`. These are not real reviews.
- **Phone, email, street address, PIN, social URLs, domain** — `lib/site-config.ts`
- **Industries list** — `industries` in `lib/content.ts` (edit freely)

Already set: city (Chennai, Tamil Nadu) and WhatsApp (+91 90254 12330).

### Brand assets

`brand/logo-source.jpg` is the logo artwork supplied by the client. `npm run brand-assets` cuts out
`public/logo.png` (full lockup, transparent), `public/logo-mark.png`, `app/icon.png`,
`app/apple-icon.png` and `public/og-image.jpg` (social preview). If you later receive an official
vector or transparent PNG logo, replace `public/logo.png` with it (keep the 827×242 aspect ratio, or
update `components/ui/Logo.tsx`).

Brand red `#CD171F` was sampled from the logo. Small red text uses a lighter tint (`#F5453C`)
so it meets WCAG AA contrast.

---

## Environment variables

Copy `.env.example` to `.env.local` for local development:

| Variable | Required | Purpose |
| --- | --- | --- |
| `RESEND_API_KEY` | yes | API key from [resend.com](https://resend.com/api-keys) |
| `CONTACT_TO_EMAIL` | yes | Inbox that receives enquiries. Comma-separate multiple addresses. |
| `CONTACT_FROM_EMAIL` | recommended | Sender, e.g. `ClassOne Website <website@yourdomain.in>`. Must be on a domain verified in Resend. Falls back to `onboarding@resend.dev`, which can only deliver to your own Resend account email. |
| `NEXT_PUBLIC_SITE_URL` | recommended | Production URL used for canonical, Open Graph, sitemap and JSON-LD. |
| `NEXT_PUBLIC_WEB3FORMS_KEY` | GitHub Pages only | Contact form delivery for the static export (see below). |

If `RESEND_API_KEY` or `CONTACT_TO_EMAIL` is missing, the form shows a friendly
"temporarily unavailable, please call or WhatsApp us" message, and nothing the visitor typed is lost.

### Contact form

- Validated on the client (react-hook-form + zod) and again on the server with the **same schema**
  (`lib/contact-schema.ts`). Indian mobile numbers are accepted with or without `+91`, `91` or `0`
  and normalised to `+91XXXXXXXXXX`.
- Spam protection: a hidden honeypot field (bots get a fake success) and rate limiting of 5 requests
  per IP per 10 minutes (`lib/rate-limit.ts`). The limiter is in memory, so on Vercel it applies
  per server instance. For strict limits, swap in Upstash Redis (`@upstash/ratelimit`).
- The email's `reply-to` is set to the visitor, so you can reply directly from your inbox.

---

## Deploying to GitHub Pages

GitHub Pages only serves static files, so `npm run build:pages` (`GITHUB_PAGES=true`) produces a
**static export** in `out/`:

- every route is pre-rendered to HTML, including all eight service pages and `404.html`;
- the `/api/contact` route is left out of this build (it lives in `route.server.ts`, which only the
  server build picks up);
- the contact form sends enquiries through [Web3Forms](https://web3forms.com) (free, emails the
  owner) instead. Client-side validation and the honeypot still apply. Web3Forms does its own spam
  filtering, but there is no server-side rate limit of ours on this target;
- `BASE_PATH` (e.g. `/classone`) is applied to routes and to every asset URL, including the hero
  frames (`lib/base-path.ts`);
- image optimisation is turned off (no server); the frames and logo are already optimised.

### One-time setup

1. Create a GitHub repository and push this project to the `main` branch:

   ```bash
   git init && git add -A && git commit -m "ClassOne website"
   git branch -M main
   git remote add origin https://github.com/<you>/<repo>.git
   git push -u origin main
   ```

   The converted frames in `public/` (~67 MB in total, all files small) are committed;
   `classone_hero_frames/` is ignored.
2. In the repo: **Settings → Pages → Build and deployment → Source: GitHub Actions**.
3. Get a free access key at web3forms.com using the owner's email address, then add it under
   **Settings → Secrets and variables → Actions → New repository secret** as
   `WEB3FORMS_ACCESS_KEY`.
4. Push to `main` (or run the workflow manually). `.github/workflows/deploy-pages.yml` builds with
   the correct base path and site URL and publishes `out/`. The site appears at
   `https://<you>.github.io/<repo>/`.

**Custom domain:** add it under Settings → Pages. The workflow then builds with an empty base path
automatically.

**Caching:** GitHub Pages sets its own short cache headers (about 10 minutes); the long-lived
`Cache-Control` for frames in `next.config.ts` only applies on Vercel/Node hosting.

---

## Deploying to Vercel

1. Push the project to a Git repository. `classone_hero_frames/` (the original 110 MB source
   frames) is git- and Vercel-ignored; the converted frames in `public/` are what ships.
2. In Vercel, **Add New → Project** and import the repo. The framework preset is detected as Next.js.
3. Under **Settings → General → Node.js Version**, choose 20.x or newer.
4. Under **Settings → Environment Variables**, add `RESEND_API_KEY`, `CONTACT_TO_EMAIL`,
   `CONTACT_FROM_EMAIL` and `NEXT_PUBLIC_SITE_URL` (Production and Preview).
5. Deploy, then add your domain under **Settings → Domains**.
6. In Resend, verify the sending domain (DNS records) so mail is delivered from your own address.

Frame files are served with `Cache-Control: public, max-age=2592000, stale-while-revalidate=86400`
(see `next.config.ts`). If you replace the frames, either rename them or redeploy and accept up to
30 days of cached old frames for returning visitors. Lower `max-age` first if you expect changes.

---

## Project structure

```
app/
  layout.tsx            fonts, metadata, nav/footer/WhatsApp/JSON-LD, MotionConfig
  page.tsx              home
  about/, services/, services/[slug]/, process/, contact/   inner pages
  not-found.tsx         404
  api/contact/route.server.ts  Resend email, server validation, honeypot, rate limit
                               (server builds only)
  sitemap.ts, robots.ts, icon.png, apple-icon.png
.github/workflows/deploy-pages.yml   GitHub Pages deployment
components/
  hero/      Hero (pin + reduced-motion fallback), HeroCanvas (renderer),
             frame-sequence.ts (loader/cache), stage.ts (layout), HeroOverlays,
             MobileServicesList
  sections/  About, Services, WhyClassOne, Numbers, Process, Industries,
             Testimonials, Contact, ContactForm, CtaBand, Footer
  ui/        Nav, Button, Logo, Reveal, SectionHeader, PageHeader, Hexagon,
             Icons, WhatsAppButton, JsonLd
lib/
  site-config.ts, content.ts, contact-schema.ts, submit-contact.ts,
  base-path.ts, rate-limit.ts, motion.ts,
  frames-manifest.json (generated)
scripts/
  prepare-frames.mjs, brand-assets.mjs
```
