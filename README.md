# Dähler Früchte — website

A multilingual website for **Dähler Früchte**, an independent family business that
imports and trades fruit and vegetables from around the world and delivers daily from
Raperswilen, Thurgau, across Switzerland. The business has traded fruit since 1978.

Built with React 19, Vite 8, TypeScript 7, Tailwind CSS 4, React Router 7, i18next and
Motion. Company facts, product names, representative names and contact details are taken
from the company's official website (`daehler-fruechte.ch`); nothing was invented.

> This is an **independent website concept**, not the company's official website. The
> deployment at <https://dahler-orcin.vercel.app/> is a demonstration and is not presented
> as the official domain of Dähler Früchte.

## Technology stack

| Area | Choice |
| --- | --- |
| UI | React 19, TypeScript |
| Build | Vite 8 (`tsc --noEmit && vite build`) |
| Styling | Tailwind CSS 4 with brand tokens in `src/styles/globals.css` |
| Routing | React Router 7 (SPA, German legacy paths) |
| Content | i18next / react-i18next with five locales |
| Motion | Motion, limited to restrained reveal effects; respects `prefers-reduced-motion` |
| Icons | lucide-react |
| Form delivery | Formspree (public form endpoint, no server runtime or secret) |
| Tests | Playwright against the production preview |

## Quick start

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # typecheck + production build into dist/
npm run preview    # preview the production build
npm run typecheck  # tsc --noEmit
npm run test:e2e   # build, then run the Playwright checks against vite preview
```

## Routes

| Path | Page |
| --- | --- |
| `/` | Home — hero with two CTAs, three company highlights, product selection, short company portrait, contact band |
| `/produkte` | Full catalogue with search, category filters, industrial products and quality sections |
| `/dienstleistungen` | The nine services, visual sections and the passion statement |
| `/ueber-uns` | Short company portrait, five guiding principles, quote and contact CTA |
| `/daehler-story` | Founder story in eight chapters, with lightbox gallery |
| `/kontakt` | Verified company details, three representative profiles, enquiry form, Google Maps |
| `/datenschutz` | Privacy information (linked from the footer and the form) |

The German paths are preserved so existing links keep working.

## Homepage

The homepage is deliberately short and direct:

1. **Hero** — one headline, one supporting sentence and exactly two buttons:
   *Explore the range* (`/produkte`) and *Discover Dähler Früchte* (`/ueber-uns`).
2. **Company highlights** — founded, location and delivery in three glass-style tiles.
   The three tiles stay in one horizontal row on mobile, with shortened values and the
   supporting detail hidden below the `sm` breakpoint.
3. **Selection** — six featured products and a link to the full catalogue.
4. **Company portrait** — a short verified summary and a telephone link.
5. **Contact band** — one enquiry CTA and the official email address.

## Brand

Colours come from the company logo and the original site's stylesheet. They are mapped to
tokens in `src/styles/globals.css`:

- Green `#0f4d12` / `#09370c` (forest) — primary actions, footer, headings.
- Red `#c60b31` (crimson) — small accents, eyebrows, form errors.
- Pineapple yellow `#ffef29` (marigold) — restrained highlights such as the delivery tile
  and focus details.
- Cream `#f7f3ea` / `#efe8d9` — page and supporting surfaces.

Fraunces carries display type and Inter carries UI and body copy. Photography is used at
consistent 4:5 and 4:3 crops; no decorative gradients or glowing effects were added.

## Product catalogue

`src/data/products.ts` lists the catalogue as published on the official product page,
including both Maracuja and Passionsfrüchte, the industrial products and the juice. Search
matches the translated product name and the stable slug; category filters cover all
products, fruit, vegetables and leaves, juices and industrial customers. No prices,
availability, origins or certifications were added.

Product cards use a consistent portrait crop, a category label above the name and a
restrained hover state. Images are lazy-loaded and carry dimensions.

## Representatives and contact details

`src/data/company.ts` contains the verified company data:

| Person | Role (German) | Email |
| --- | --- | --- |
| Marius Dähler | Inhaber / Geschäftsführer | `mariusdaehler@daehler-fruechte.ch` |
| Markus Dähler jun. | Geschäftsleitung | `markusdaehler@daehler-fruechte.ch` |
| Marius Dähler jun. | Geschäftsführer Stv. / Geschäftsleitung / Verwaltungsrat | `mariusdaehler.jun@daehler-fruechte.ch` |

The switchboard number `+41 (0)44 448 22 50` and the address `Eichhof, 8558 Raperswilen`
are published on the official contact page, as is `info@daehler-fruechte.ch`. No direct
extensions are published, so each profile links to the verified switchboard rather than a
fabricated direct line.

Portraits are the official `50×60` px images from the company's contact page, displayed at
avatar size. Larger originals are not published and were not upscaled or replaced with
stock or generated portraits.

## Contact form

The form is a **temporary demonstration** connected to the public Formspree endpoint
`https://formspree.io/f/xeaeylry` (see `src/components/contact/ContactForm.tsx`). It is not
connected to the company's inbox.

Fields:

- Full name (required), company (optional; required for a business partnership).
- Email (required), telephone (optional).
- Enquiry type (required): general enquiry, product enquiry, product availability,
  business partnership, supplier enquiry, logistics and delivery, other.
- Conditional fields: product interest for product/availability enquiries, an offer
  description for supplier enquiries and an optional delivery region for logistics.
- Message (required).
- Privacy consent (required), linking to `/datenschutz`.

Behaviour: client-side validation with focus moved to the first invalid field, a translated
loading state that blocks duplicate submits, success shown only after a 2xx Formspree
response, translated error handling for HTTP and network failures, a `_gotcha` honeypot and
a `locale` field. No API key is involved; a Formspree form ID is public by design.

Before launch, replace the endpoint with the company's own form endpoint or reinstate a
server-side delivery function with its own credentials.

## Languages

German is the default. French, Italian, Portuguese (Brazilian) and English are also
supported. Content lives in `src/i18n/locales/*.json` and all five files share the same
key structure.

- The selected language is stored under `daehler-language` in `localStorage`, so it survives
  navigation and refresh.
- The header indicator shows the full language name on desktop and the two-letter code on
  mobile; its accessible name always includes the current language.
- Page titles, descriptions, canonical URLs, social metadata and `<html lang>` follow the
  active language via `src/lib/seo.ts`.
- Navigation, buttons, product names, team roles, the form, validation messages, footer and
  privacy content are translated. No fallback-language content is intentionally mixed in.

## Structure

```
public/robots.txt         Crawler rules for the demonstration deployment
public/sitemap.xml        Sitemap for the public routes
public/images/            Photography by use, team portraits, logo, plus CREDITS.md
scripts/fetch-images.mjs  Image download + credit generation
scripts/smoke.mjs         Quick production-build smoke check
src/components/layout/    Header, mobile menu, language switcher, footer, shell
src/components/ui/        Reveal, PageHero, Lightbox, Logo
src/components/products/  ProductCard
src/components/contact/   ContactForm
src/data/                 Product catalogue, company data, gallery
src/i18n/                 i18next setup and the five locales
src/lib/                  Navigation, SEO hook
src/pages/                One component per route
src/styles/globals.css    Brand tokens, editorial typography, UI primitives
tests/e2e/                Playwright end-to-end checks
```

## Photography and credits

The photographs from the original site were not reused; the site uses free-licensed
substitutes from Wikimedia Commons, recorded per file in `public/images/credits.json` and
`public/images/CREDITS.md`. The official team portraits are the exception described above.
To swap in authorised originals, replace the file at the same path; no code changes are
needed.

## SEO

`src/lib/seo.ts` keeps title, meta description, canonical URL, `robots`, Open Graph,
Twitter card, share image and `<html lang>` in sync with the route and language.
`index.html` ships German defaults for crawlers that do not execute JavaScript.
`public/robots.txt` and `public/sitemap.xml` describe the public demonstration routes.

The canonical origin defaults to the preview deployment and can be overridden with
`VITE_SITE_URL` (see `.env.example`). The 404 page is `noindex` and has no canonical.
Because the site is a client-rendered SPA, crawlers that do not run JavaScript only see the
German defaults.

## Testing and quality assurance

```bash
npm run typecheck   # TypeScript, no emit
npm run build       # typecheck + production build
npx playwright install chromium   # once, if no browser is cached
npm run test:e2e    # build + Playwright against the production preview
```

The existing Playwright checks cover routes and metadata, every desktop destination, the
skip link, the mobile menu focus trap, all five languages and persistence, product search
and filters, the gallery lightbox, the contact form (validation, conditional fields, mocked
Formspree success, HTTP failure, network failure, duplicate-submit prevention) and
horizontal overflow at mobile, tablet and desktop widths. Formspree is mocked in every test,
so no automated run sends a real message.

`scripts/smoke.mjs` remains available for a quick smoke check with `npm run preview`
running.

## Deployment

`vercel.json` configures the build output (`dist`), the SPA rewrite and long-lived caching
for images and hashed assets. Import the repository and deploy; no environment variables
are required. If the public origin changes, set `VITE_SITE_URL` and update
`public/robots.txt` and `public/sitemap.xml` to match.

## Accessibility

Skip link with focus moved to `#main`, semantic landmarks, labelled form fields with
`aria-invalid`, `aria-describedby` and `role="alert"` errors, a required consent checkbox,
keyboard-navigable language listbox, mobile menu with focus containment and focus restore,
a gallery with focus containment and Escape handling, visible focus rings and reduced-motion
support for all overlays. Images are lazy-loaded except the hero and carry dimensions.

## Company information requiring confirmation

These values come from the official website but have not been re-confirmed with the company
for this concept:

- Founding year 1978 and the description as an independent family business.
- Address `Eichhof, 8558 Raperswilen`, telephone `+41 (0)44 448 22 50` and fax
  `+41 (0)43 888 42 62`.
- VAT number `CHE-100.483.107`.
- Email addresses `info@`, `mariusdaehler@`, `markusdaehler@` and `mariusdaehler.jun@`
  `daehler-fruechte.ch`.
- Names, roles and responsibilities of Marius Dähler, Markus Dähler jun. and
  Marius Dähler jun.
- Delivery coverage, product availability, service claims and certification references.
- Whether the official portrait thumbnails may be used at larger sizes; only the published
  `50×60` px files were used.
- No social media accounts are published on the official site, so none are linked.
- The Formspree inbox is a demonstration channel, not a company address.

## Notes and limitations

- The founder story is a faithful retelling based on the original article by Christine
  Hinnen (credited on the page), condensed for translation quality. Link to the original
  for the full text.
- The privacy page describes exactly what this implementation does; it is not legal advice
  and should be reviewed before launch.
- Google Maps is embedded on the contact page, so that provider receives request data when
  the map loads.
- No analytics, tracking cookies, testimonials or invented statistics.
