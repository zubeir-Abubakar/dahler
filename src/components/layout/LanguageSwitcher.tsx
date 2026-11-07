import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, ChevronDown, Globe } from "lucide-react";

import { languages, normalizeLanguage, type LanguageCode } from "@/i18n";

interface LanguageSwitcherProps {
  /** "dark" is used over the photograph hero, "light" on solid backgrounds. */
  tone?: "dark" | "light";
  variant?: "dropdown" | "block";
}

export default function LanguageSwitcher({
  tone = "light",
  variant = "dropdown",
}: LanguageSwitcherProps) {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const active = normalizeLanguage(i18n.resolvedLanguage ?? i18n.language);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const choose = (code: LanguageCode) => {
    void i18n.changeLanguage(code);
    setOpen(false);
  };

  if (variant === "block") {
    return (
      <ul className="flex flex-wrap gap-2" aria-label={t("nav.language")}>
        {languages.map((language) => {
          const isActive = language.code === active;
          return (
            <li key={language.code}>
              <button
                type="button"
                onClick={() => choose(language.code)}
                aria-current={isActive ? "true" : undefined}
                className={`inline-flex min-h-9 items-center gap-1.5 rounded-full border px-3 text-xs transition-colors duration-200 ${
                  isActive
                    ? "border-cream/70 bg-cream/15 text-cream"
                    : "border-cream/25 text-cream/70 hover:border-cream/50 hover:text-cream"
                }`}
              >
                <span className="font-medium tracking-wide">{language.short}</span>
                <span className="sr-only">{language.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    );
  }

  const triggerTone =
    tone === "dark"
      ? "text-white/85 hover:text-white border-white/25 hover:border-white/50"
      : "text-ink-soft hover:text-ink border-line hover:border-line-strong";

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`${t("nav.language")}: ${languages.find((l) => l.code === active)?.label ?? ""}`}
        className={`inline-flex min-h-9 items-center gap-1.5 rounded-full border px-2.5 text-xs font-medium tracking-wide transition-colors duration-200 ${triggerTone}`}
      >
        <Globe aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={1.6} />
        {languages.find((language) => language.code === active)?.short ?? "DE"}
        <ChevronDown
          aria-hidden="true"
          className={`h-3 w-3 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          strokeWidth={1.8}
        />
      </button>

      {open ? (
        <ul
          role="listbox"
          aria-label={t("nav.language")}
          className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-xl border border-line bg-paper p-1.5 shadow-[0_18px_48px_-24px_rgba(9,55,12,0.45)]"
        >
          {languages.map((language) => {
            const isActive = language.code === active;
            return (
              <li key={language.code} role="option" aria-selected={isActive}>
                <button
                  type="button"
                  onClick={() => choose(language.code)}
                  className={`flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-2 text-left text-sm transition-colors duration-150 ${
                    isActive
                      ? "bg-cream-deep text-forest"
                      : "text-ink-soft hover:bg-cream hover:text-ink"
                  }`}
                >
                  <span>{language.label}</span>
                  {isActive ? (
                    <Check aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2} />
                  ) : (
                    <span className="text-[0.6875rem] tracking-widest text-stone">
                      {language.short}
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
