import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import de from "./locales/de.json";
import en from "./locales/en.json";
import fr from "./locales/fr.json";
import it from "./locales/it.json";
import pt from "./locales/pt.json";

export const languages = [
  { code: "de", label: "Deutsch", short: "DE", htmlLang: "de-CH" },
  { code: "fr", label: "Français", short: "FR", htmlLang: "fr-CH" },
  { code: "it", label: "Italiano", short: "IT", htmlLang: "it-CH" },
  { code: "pt", label: "Português", short: "PT", htmlLang: "pt-BR" },
  { code: "en", label: "English", short: "EN", htmlLang: "en" },
] as const;

export type LanguageCode = (typeof languages)[number]["code"];

export const STORAGE_KEY = "daehler-language";

export function normalizeLanguage(value: string | undefined): LanguageCode {
  const base = (value ?? "").toLowerCase().split("-")[0];
  return languages.some((language) => language.code === base)
    ? (base as LanguageCode)
    : "de";
}

export function htmlLangFor(code: LanguageCode): string {
  return languages.find((language) => language.code === code)?.htmlLang ?? "de-CH";
}

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      de: { translation: de },
      fr: { translation: fr },
      it: { translation: it },
      pt: { translation: pt },
      en: { translation: en },
    },
    fallbackLng: "de",
    supportedLngs: languages.map((language) => language.code),
    load: "languageOnly",
    nonExplicitSupportedLngs: true,
    interpolation: { escapeValue: false },
    // German stays the default for every first visit; only a stored choice wins.
    initAsync: false,
    detection: {
      order: ["localStorage"],
      lookupLocalStorage: STORAGE_KEY,
      caches: ["localStorage"],
    },
    react: { useSuspense: false },
  });

function applyDocumentLanguage(language: string) {
  const code = normalizeLanguage(language);
  document.documentElement.lang = htmlLangFor(code);
  document.documentElement.setAttribute("data-language", code);
}

i18n.on("languageChanged", applyDocumentLanguage);

// The initial language is resolved during init, before the listener above exists.
applyDocumentLanguage(i18n.resolvedLanguage ?? i18n.language);

export default i18n;
