import { useEffect } from "react";
import { useTranslation } from "react-i18next";

type PageKey = "home" | "products" | "services" | "about" | "story" | "contact" | "privacy";

function upsertMeta(attribute: "name" | "property", key: string, content: string) {
  let tag = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute(attribute, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
}

/**
 * Keeps title, description, Open Graph tags and the document language in sync
 * with the active language. Because the site is a client-rendered SPA, this runs
 * on the client; the build also ships sensible German defaults in index.html.
 */
export function useSeo(page: PageKey) {
  const { t, i18n } = useTranslation();
  const language = i18n.resolvedLanguage ?? i18n.language;

  useEffect(() => {
    const title = t(`seo.${page}.title`);
    const description = t(`seo.${page}.description`);

    document.title = title;
    upsertMeta("name", "description", description);
    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:type", "website");
    upsertMeta("property", "og:locale", language);

    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = window.location.origin + window.location.pathname;
  }, [language, page, t]);
}
