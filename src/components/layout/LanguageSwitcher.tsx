import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
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
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const active = normalizeLanguage(i18n.resolvedLanguage ?? i18n.language);

  useEffect(() => {
    if (!open) return;

    const activeIndex = Math.max(
      languages.findIndex((language) => language.code === active),
      0,
    );
    // Wait for the listbox to mount, then focus the current language.
    const focusTimer = window.setTimeout(() => optionRefs.current[activeIndex]?.focus(), 0);

    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      window.clearTimeout(focusTimer);
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, active]);

  const choose = (code: LanguageCode) => {
    void i18n.changeLanguage(code);
    setOpen(false);
    triggerRef.current?.focus();
  };

  const onListKeyDown = (event: ReactKeyboardEvent<HTMLUListElement>) => {
    const options = optionRefs.current.filter(
      (option): option is HTMLButtonElement => option !== null,
    );
    if (options.length === 0) return;

    const currentIndex = options.findIndex((option) => option === document.activeElement);
    const focusAt = (index: number) => options[(index + options.length) % options.length]?.focus();

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        focusAt(currentIndex + 1);
        break;
      case "ArrowUp":
        event.preventDefault();
        focusAt(currentIndex - 1);
        break;
      case "Home":
        event.preventDefault();
        focusAt(0);
        break;
      case "End":
        event.preventDefault();
        focusAt(options.length - 1);
        break;
      case "Escape":
        event.preventDefault();
        setOpen(false);
        triggerRef.current?.focus();
        break;
      case "Tab":
        // Tabbing away closes the popup instead of leaving it orphaned.
        setOpen(false);
        break;
      default:
        break;
    }
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
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls="language-listbox"
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
          id="language-listbox"
          role="listbox"
          aria-label={t("nav.language")}
          onKeyDown={onListKeyDown}
          className="absolute right-0 z-50 mt-2 w-48 overflow-hidden rounded-xl border border-line bg-paper p-1.5 shadow-[0_18px_48px_-24px_rgba(9,55,12,0.45)]"
        >
          {languages.map((language, index) => {
            const isActive = language.code === active;
            return (
              <li key={language.code} role="none">
                <button
                  ref={(element) => {
                    optionRefs.current[index] = element;
                  }}
                  type="button"
                  role="option"
                  aria-selected={isActive}
                  tabIndex={-1}
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
