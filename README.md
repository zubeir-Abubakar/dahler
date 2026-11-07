# Dähler Früchte — website redesign

A modern, multilingual redesign of the Dähler Früchte / Brasil Frucht Export AG website
(fruit trading and importing, Raperswilen, Switzerland, since 1978).

Built with React 19, Vite, TypeScript, Tailwind CSS 4, React Router 7, i18next and Motion.
All company information, product names and copy come from the original site
(daehler-fruechte.ch); no company facts, customers, certifications or statistics were invented.

> This is an **independent website concept**, not the company's official website. The
> deployment at <https://dahler-orcin.vercel.app/> is a demonstration; it is not presented
> as, and should not be treated as, the official domain of Dähler Früchte.

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build into dist/
npm run preview    # preview the production build
npm run typecheck  # tsc --noEmit
npm run test:e2e   # build, then run the Playwright suite against vite preview
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
survives navigation and refresh. Titles, descriptions, canonical URLs, social metadata and
`<html lang>` follow the active language via `src/lib/seo.ts`.

## Structure

```
public/robots.txt         Crawler rules for the demonstration deployment
public/sitemap.xml        Sitemap for the public routes
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
tests/e2e/                Playwright end-to-end tests
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

## Contact form (temporary Formspree setup)

The form is a **temporary demonstration** and is not connected to Dähler's own inbox.
It posts asynchronously to the public Formspree endpoint
`https://formspree.io/f/xeaeylry` (see `src/components/contact/ContactForm.tsx`).

- All fields are preserved: name, company, email, phone, subject and message.
- Client-side validation covers required fields, email format and length limits.
- A loading state disables the submit button, and a ref guard drops duplicate submits.
- Success is shown **only** after Formspree answers with a 2xx response.
- Failures (HTTP errors or network problems) show a translated error message.
- A hidden `_gotcha` honeypot is submitted for Formspree's own spam filtering.
- No API key or private credential is involved: a Formspree form ID is public by design.

The previous Vercel `/api/contact` function and its Resend configuration were removed
because Formspree replaces them completely. No server runtime or secret is required now.

When the demonstration ends, either replace `FORMSPREE_ENDPOINT` with the company's own
form endpoint or reinstate a server-side delivery function with its own credentials.

## SEO

`src/lib/seo.ts` keeps the following in sync with the active route and language: title,
meta description, canonical URL, `robots`, Open Graph (`og:*`), Twitter card, share image
and `<html lang>`. `index.html` ships German defaults plus favicon and `theme-color`, and
`public/robots.txt` + `public/sitemap.xml` describe the public demonstration routes.

The canonical origin defaults to the preview deployment and can be overridden with
`VITE_SITE_URL` (see `.env.example`). The 404 page is `noindex` and has no canonical.
Because the site is a client-rendered SPA, crawlers that do not run JavaScript only see the
German defaults in `index.html`; prerendering or SSR would be needed for full coverage.

No structured data (JSON-LD) is added, because none of the business claims are formally
verified for publication.

## Testing and quality assurance

```bash
npm run typecheck   # TypeScript, no emit
npm run build       # typecheck + production build
npx playwright install chromium   # once, if no browser is cached
npm run test:e2e    # build + Playwright against the production preview
```

`tests/e2e/` covers the homepage, every route, all five languages, desktop navigation and
the mobile menu (including focus trap/restore), product search and filtering, the gallery
lightbox, contact validation, mocked Formspree success, mocked error and network failure,
duplicate-submit prevention and responsive overflow. **Formspree is mocked in every test**
(`page.route`), so no automated run sends a real message to the demonstration inbox.

`scripts/smoke.mjs` remains available for a quick production-build smoke check
(`node scripts/smoke.mjs` with `npm run preview` running).

## Deploying to Vercel

`vercel.json` configures the build (`dist`), the SPA rewrite and long-lived caching for
images and hashed assets. Import the repository and deploy — no environment variables are
required. If the public origin changes, set `VITE_SITE_URL` and update
`public/robots.txt` / `public/sitemap.xml` to match.

## Accessibility and performance

Skip link (focus moves to `#main`), semantic landmarks, visible focus rings,
`aria-expanded`/`aria-pressed` states, labelled form fields with `aria-invalid`,
`aria-describedby` and `role="alert"` errors, a keyboard-navigable gallery with focus
containment and Escape handling, a mobile menu that traps focus, locks scrolling and returns
focus to its trigger, and a language listbox with arrow/Home/End/Escape support. All
overlays respect `prefers-reduced-motion`. Images are lazy-loaded except the hero, carry
dimensions where layout depends on them, and all raster assets are sized to 1400 px and
compressed.

## Company data that still requires confirmation from Dähler

These values are reproduced from the original public site but have **not** been verified
with the company for this concept. Do not treat them as officially confirmed:

- Legal name `Brasil Frucht Export AG` versus the brand `Dähler Früchte` (registered form).
- VAT number `CHE-100.483.107`.
- Phone `+41 (0)44 448 22 50` and fax `+41 (0)43 888 42 62`.
- Address `Eichhof, 8558 Raperswilen, Schweiz`.
- Founding year 1978 and the "independent family business" description.
- Team names and roles: Marius Dähler, Markus Dähler jun., Marius Dähler jun.
- Service claims (Global G.A.P., ripening, cold storage, logistics) and product availability.
- No public email address is published, because none was available for verification. The
  Formspree inbox is a demonstration channel, not a company address.

## Notes and limitations

- The founder story is a faithful retelling in all five languages based on the original
  article by Christine Hinnen (credited on the page), condensed to keep translation quality
  high rather than machine-translated at length. Link to the original for the full text.
- The privacy page describes exactly what this implementation does; it is not legal advice
  and should be reviewed before launch.
- Google Maps is embedded on the contact page, so that provider receives request data when
  the map loads.
- No analytics, no tracking cookies, no invented testimonials or statistics.
