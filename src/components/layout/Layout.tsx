import { useEffect, type MouseEvent } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Header from "./Header";
import Footer from "./Footer";

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);

  return null;
}

export default function Layout() {
  const { t } = useTranslation();

  // Anchor jumps do not always move focus in every browser; move it explicitly.
  const focusMain = (event: MouseEvent<HTMLAnchorElement>) => {
    const main = document.getElementById("main");
    if (!main) return;
    event.preventDefault();
    main.focus();
    main.scrollIntoView({ block: "start" });
  };

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <a
        href="#main"
        onClick={focusMain}
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:rounded-full focus:bg-forest focus:px-5 focus:py-3 focus:text-sm focus:text-cream"
      >
        {t("common.skipToContent")}
      </a>
      <ScrollToTop />
      <Header />
      <main id="main" tabIndex={-1} className="flex-1 outline-none">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
