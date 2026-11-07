import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Menu, Phone, X } from "lucide-react";

import { company } from "@/data/company";
import { navigation } from "@/lib/navigation";
import Logo from "@/components/ui/Logo";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header() {
  const { t } = useTranslation();
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 28);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!menuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const menuFocusables = () =>
      Array.from(
        menuRef.current?.querySelectorAll<HTMLElement>("a[href], button:not([disabled])") ?? [],
      );
    // The close button lives in the header, so the trap includes the trigger.
    const trapFocusables = () => {
      const inMenu = menuFocusables();
      return menuButtonRef.current ? [menuButtonRef.current, ...inMenu] : inMenu;
    };

    const focusTimer = window.setTimeout(() => menuFocusables()[0]?.focus(), 40);

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
        return;
      }
      if (event.key !== "Tab") return;

      const items = trapFocusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const solid = scrolled || menuOpen;

  const headerTone = solid
    ? "border-b border-line bg-cream/95 text-ink backdrop-blur-md"
    : "border-b border-transparent bg-transparent text-cream";

  return (
    <>
      <header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${headerTone}`}>
        <div className="container-x flex h-[4.5rem] items-center gap-4 sm:h-20">
          <Link
            to="/"
            className="flex shrink-0 items-center"
            aria-label={`${t("common.brand")} – ${t("nav.home")}`}
          >
            <span
              className={`inline-flex items-center rounded-lg px-2 py-1.5 transition-colors duration-500 ${
                solid ? "bg-transparent" : ""
              }`}
            >
              <Logo className="h-8 sm:h-10" />
            </span>
          </Link>

          <nav aria-label={t("nav.menu")} className="ml-auto hidden items-center gap-7 lg:flex">
            {navigation.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={({ isActive }) =>
                  `relative py-1 text-sm transition-colors duration-200 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-300 hover:after:scale-x-100 ${
                    isActive ? "after:scale-x-100" : ""
                  } ${solid ? "text-ink-soft hover:text-ink" : "text-cream/80 hover:text-cream"}`
                }
              >
                {t(`nav.${item.key}`)}
              </NavLink>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 lg:ml-4">
            <LanguageSwitcher tone={solid ? "light" : "dark"} />
            <Link
              to="/kontakt"
              className={`hidden min-h-10 items-center gap-1.5 rounded-full px-4 text-sm font-medium transition-colors duration-200 sm:inline-flex ${
                solid
                  ? "bg-forest text-cream hover:bg-leaf-deep"
                  : "bg-cream text-ink hover:bg-white"
              }`}
            >
              {t("nav.contact")}
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" strokeWidth={1.7} />
            </Link>
            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => {
                if (menuOpen) {
                  setMenuOpen(false);
                  menuButtonRef.current?.focus();
                } else {
                  setMenuOpen(true);
                }
              }}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? t("nav.closeMenu") : t("nav.openMenu")}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-full border transition-colors duration-200 lg:hidden ${
                solid
                  ? "border-line text-ink hover:border-line-strong"
                  : "border-white/35 text-cream hover:border-white/70"
              }`}
            >
              {menuOpen ? (
                <X aria-hidden="true" className="h-5 w-5" strokeWidth={1.6} />
              ) : (
                <Menu aria-hidden="true" className="h-5 w-5" strokeWidth={1.6} />
              )}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            ref={menuRef}
            id="mobile-menu"
            key="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label={t("nav.menu")}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-forest pt-24 pb-10 text-cream lg:hidden"
          >
            <div className="container-x flex flex-1 flex-col">
              <nav aria-label={t("nav.menu")} className="flex flex-col">
                {navigation.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={reduceMotion ? undefined : { opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: reduceMotion ? 0 : 0.05 + index * 0.045,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="border-b border-white/15"
                  >
                    <NavLink
                      to={item.path}
                      end={item.path === "/"}
                      className={({ isActive }) =>
                        `flex items-baseline justify-between gap-4 py-4 font-display text-[1.75rem] leading-tight transition-colors duration-200 ${
                          isActive ? "text-marigold" : "text-cream hover:text-marigold"
                        }`
                      }
                    >
                      {t(`nav.${item.key}`)}
                      <span className="font-sans text-[0.625rem] tracking-[0.2em] text-cream/45">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </NavLink>
                  </motion.div>
                ))}
              </nav>

              <div className="mt-10 flex flex-col gap-6">
                <LanguageSwitcher variant="block" tone="dark" />
                <div className="flex flex-col gap-1 text-sm text-cream/70">
                  <a
                    href={`tel:${company.phoneHref}`}
                    className="inline-flex items-center gap-2 py-1 hover:text-cream"
                  >
                    <Phone aria-hidden="true" className="h-4 w-4" strokeWidth={1.6} />
                    {company.phone}
                  </a>
                  <p>
                    {company.street}, {company.postalCode} {company.city}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
