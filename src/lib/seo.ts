import { useEffect } from "react";
import { useTranslation } from "react-i18next";

import { htmlLangFor, normalizeLanguage } from "@/i18n";

export type PageKey =
  | "home"
  | "products"
  | "services"
  | "about"
  | "story"
  | "contact"
  | "privacy"
  | "notFound";

/**
 * The public demonstration deployment. This is deliberately not presented as
 * the company's own domain; override with VITE_SITE_URL when it changes.
 */
export const SITE_URL = (
  import.meta.env.VITE_SITE_URL ?? "https://dahler-orcin.vercel.app"
).replace(/\/$/, "");

export const SITE_NAME = "Dähler Früchte";

const pageImages: Record<PageKey, string> = {
  home: "/images/hero/hero-market.jpg",
  products: "/images/hero/hero-fruit.jpg",
  services: "/images/logistics/service-sourcing.jpg",
  about: "/images/gallery/gallery-03.jpg",
  story: "/images/gallery/gallery-07.jpg",
  contact: "/images/hero/hero-market.jpg",
  privacy: "/images/gallery/gallery-04.jpg",
  notFound: "/images/hero/hero-fruit.jpg",
};

function upsertMeta(attribute: "name" | "property", key: string, content: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attribute, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

function upsertCanonical(href: string | null) {
  let link = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!href) {
    link?.remove();
    return;
  }
  if (!link) {
    link = document.createElement("link");
    link.rel = "canonical";
    document.head.appendChild(link);
  }
  link.href = href;
}

/**
 * Keeps title, description, canonical URL, Open Graph, Twitter card, robots
 * directives and the document language in sync with the active route and
 * language. The site is a client-rendered SPA, so `index.html` also carries
 * German defaults for crawlers that do not execute JavaScript.
 */
export function useSeo(page: PageKey, options: { noindex?: boolean } = {}) {
  const { t, i18n } = useTranslation();
  const language = normalizeLanguage(i18n.resolvedLanguage ?? i18n.language);
  const noindex = options.noindex ?? false;

  useEffect(() => {
    const title = t(`seo.${page}.title`);
    const description = t(`seo.${page}.description`);
    const image = `${SITE_URL}${pageImages[page]}`;
    const path = `${window.location.pathname}${window.location.search}`;
    const canonical = noindex ? null : `${SITE_URL}${path}`;

    document.title = title;
    document.documentElement.lang = htmlLangFor(language);

    upsertMeta("name", "description", description);
    upsertMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow");
    upsertMeta("property", "og:site_name", SITE_NAME);
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:locale", htmlLangFor(language).replace("-", "_"));
    upsertMeta("property", "og:image", image);
    upsertMeta("property", "og:image:alt", t("home.hero.imageAlt"));
    upsertMeta("name", "twitter:card", "summary_large_image");
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", image);

    if (canonical) {
      upsertMeta("property", "og:url", canonical);
      upsertCanonical(canonical);
    } else {
      // A 404 must not advertise a canonical URL for a page that does not exist.
      document.head.querySelector('meta[property="og:url"]')?.remove();
      upsertCanonical(null);
    }
  }, [language, noindex, page, t]);
}
