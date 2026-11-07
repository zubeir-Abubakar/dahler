# Dähler Früchte — website redesign

A modern, multilingual redesign of the Dähler Früchte / Brasil Frucht Export AG website
(fruit trading and importing, Raperswilen, Switzerland, since 1978).

Built with React 19, Vite, TypeScript, Tailwind CSS 4, React Router 7, i18next and Motion.
All company information, product names and copy come from the original site
(daehler-fruechte.ch); no company facts, customers, certifications or statistics were invented.

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build into dist/
npm run preview    # preview the production build
npm run typecheck  # tsc --noEmit
```

## Routes

| Path | Page |
| --- | --- |
| `/` | Home — hero, introduction, product highlights, services, philosophy, brand statement, story preview, gallery, CTA |
| `/produkte` | Full catalogue with search, category filters, industrial products and quality sections |
| `/dienstleistungen` | The nine services, visual sections and the passion statement |
| `/ueber-uns` | Philosophy and the five guiding principles |
| `/daehler-story` | Founder story in eight chapters, with lightbox gallery |
| `/kontakt` | Contact details, team, validated form, Google Maps |
| `/datenschutz` | Privacy information (linked from the footer) |

The original German paths are preserved so legacy links keep working.

## Languages

German (default), French, Italian, Portuguese (Brazilian) and English.
Content lives in `src/i18n/locales/*.json` with an identical key structure; the selected
language is stored in `localStorage` under `daehler-language`, switches without a reload and
survives navigation and refresh. Titles, descriptions, Open Graph tags and `<html lang>` follow
the active language via `src/lib/seo.ts`.

## Structure

```
api/contact.ts            Vercel serverless function (email delivery)
public/images/            Photography, organised by use, plus CREDITS.md
scripts/fetch-images.mjs  Image download + credit generation
scripts/fetch-missing.mjs Focused retry for rate-limited images
src/components/layout/    Header, mobile menu, language switcher, footer, shell
src/components/ui/        Reveal, PageHero, Lightbox
src/components/products/  ProductCard
src/components/contact/   ContactForm
src/data/                 Product catalogue, company data, gallery
src/i18n/                 i18next setup and the five locales
src/lib/                  Navigation, SEO hook
src/pages/                One component per route
src/styles/globals.css    Brand tokens, editorial typography, UI primitives
```

## Brand

Colours were taken from the original site's stylesheet and logo: crimson `#C60B31`,
marigold `#FFEF29`, leafy greens `#188408` / `#12720D`. Those are mapped into a token set in
`src/styles/globals.css` (`--color-forest`, `--color-crimson`, `--color-marigold`, cream
backgrounds, charcoal ink). Fraunces carries display type, Inter carries UI and body copy.

## Photography

The photographs on the original site were **not** downloaded or reused — no reuse
authorisation was available. Every image is a free-licensed substitute from Wikimedia
Commons, recorded per file in `public/images/credits.json` and `public/images/CREDITS.md`.

To swap in authorised originals, replace the file at the same path (`public/images/...`);
no code changes are needed. Team members are represented by initials rather than stock
portraits, because attaching a stranger's face to a real person would be misleading.

## Contact form and email

The form validates on the client, includes a honeypot, a timing check and a per-instance
throttle, and posts to `/api/contact`.

Delivery uses [Resend](https://resend.com) via a plain HTTP call — no extra SDK. Create a
`.env.local` (see `.env.example`):

```
RESEND_API_KEY=re_...
CONTACT_TO_EMAIL=info@daehler-fruechte.ch
CONTACT_FROM_EMAIL=Daehler Fruchte Website <website@daehler-fruechte.ch>
```

The from-address must be on a domain verified in Resend. Without the variables the endpoint
returns `503 { code: "not_configured" }` and the form shows the phone number — it never shows a
fake success. `vite dev` serves the same honest 503 through a small middleware so the error
path can be tested locally; run `vercel dev` (or deploy) to exercise real sending.

## Deploying to Vercel

`vercel.json` configures the build (`dist`), SPA rewrites that leave `/api/*` alone, and
long-lived caching for images and hashed assets. Import the repository, set the three
environment variables, deploy. Any static host works for the site itself, but the contact form
needs the serverless function.

## Accessibility and performance

Skip link, semantic landmarks, visible focus rings, `aria-expanded`/`aria-pressed` states,
labelled form fields with `aria-invalid` and `role="alert"` errors, a keyboard-navigable
lightbox with focus containment and Escape handling, scroll locking for overlays, and full
`prefers-reduced-motion` support. Images are lazy-loaded except the hero, and all raster
assets are sized to 1400 px and compressed.

## Notes and limitations

- The site is a client-rendered SPA. Titles and descriptions update per route and language,
  but for maximum search visibility the same components should be prerendered (e.g. vite-ssg)
  or moved to a framework with SSR. Copy `index.html` defaults are German.
- The founder story is a faithful retelling in all five languages based on the original
  article by Christine Hinnen (credited on the page), condensed to keep translation quality
  high rather than machine-translated at length. Link to the original for the full text.
- The privacy page describes exactly what this implementation does; it is not legal advice
  and should be reviewed before launch.
- No analytics, no tracking cookies, no invented testimonials or statistics.
