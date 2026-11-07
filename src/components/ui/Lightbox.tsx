import { useCallback, useEffect, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useTranslation } from "react-i18next";

export interface LightboxImage {
  src: string;
  alt: string;
}

interface LightboxProps {
  images: LightboxImage[];
  index: number | null;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export default function Lightbox({ images, index, onClose, onNavigate }: LightboxProps) {
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);
  const isOpen = index !== null;

  const step = useCallback(
    (direction: 1 | -1) => {
      if (index === null) return;
      const next = (index + direction + images.length) % images.length;
      onNavigate(next);
    },
    [images.length, index, onNavigate],
  );

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowRight") step(1);
      if (event.key === "ArrowLeft") step(-1);
      if (event.key === "Tab") {
        const focusables = document
          .getElementById("lightbox")
          ?.querySelectorAll<HTMLElement>("button");
        if (!focusables || focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus();
    };
  }, [isOpen, onClose, step]);

  const current = index !== null ? images[index] : null;

  return (
    <AnimatePresence>
      {isOpen && current ? (
        <motion.div
          id="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={t("story.gallery.title")}
          className="fixed inset-0 z-[70] flex flex-col bg-forest-deep/97 text-cream backdrop-blur-sm"
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0.001 : 0.25 }}
        >
          <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-8">
            <p className="text-xs tracking-[0.16em] text-cream/60 uppercase">
              {t("story.gallery.counter", {
                current: (index ?? 0) + 1,
                total: images.length,
              })}
            </p>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label={t("story.gallery.close")}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 text-cream transition-colors duration-200 hover:border-white/60 hover:bg-white/10"
            >
              <X aria-hidden="true" className="h-5 w-5" strokeWidth={1.6} />
            </button>
          </div>

          <div className="relative flex flex-1 items-center justify-center px-4 pb-6 sm:px-16">
            <motion.img
              key={current.src}
              src={current.src}
              alt={current.alt}
              initial={reduceMotion ? undefined : { opacity: 0, scale: 0.985 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="max-h-[76vh] w-auto max-w-full object-contain"
            />

            {images.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={() => step(-1)}
                  aria-label={t("common.previous")}
                  className="absolute left-2 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-forest-deep/40 text-cream transition-colors duration-200 hover:border-white/60 hover:bg-white/10 sm:left-6"
                >
                  <ChevronLeft aria-hidden="true" className="h-5 w-5" strokeWidth={1.6} />
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  aria-label={t("common.next")}
                  className="absolute right-2 inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-forest-deep/40 text-cream transition-colors duration-200 hover:border-white/60 hover:bg-white/10 sm:right-6"
                >
                  <ChevronRight aria-hidden="true" className="h-5 w-5" strokeWidth={1.6} />
                </button>
              </>
            ) : null}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
