import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowUpRight } from "lucide-react";

import { company } from "@/data/company";
import { navigation } from "@/lib/navigation";
import Logo from "@/components/ui/Logo";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-forest text-cream">
      <div className="container-x py-16 sm:py-20">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_0.8fr_1fr_0.9fr] lg:gap-10">
          <div className="max-w-sm">
            <Link to="/" className="inline-flex items-center" aria-label={t("common.brand")}>
              <span className="inline-flex items-center rounded-xl px-3 py-2">
                <Logo className="h-10 sm:h-11" />
              </span>
            </Link>
            <p className="mt-5 text-sm leading-relaxed text-cream/70">{t("footer.intro")}</p>
            <p className="mt-4 font-display text-lg text-cream/90">{company.legalName}</p>
          </div>

          <nav aria-label={t("footer.navigation")}>
            <h2 className="font-sans text-[0.6875rem] font-medium tracking-[0.18em] text-cream/50 uppercase">
              {t("footer.navigation")}
            </h2>
            <ul className="mt-4 flex flex-col gap-2.5 text-sm">
              {navigation.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="inline-block py-0.5 text-cream/75 transition-colors duration-200 hover:text-marigold"
                  >
                    {t(`nav.${item.key}`)}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/datenschutz"
                  className="inline-block py-0.5 text-cream/75 transition-colors duration-200 hover:text-marigold"
                >
                  {t("footer.privacy")}
                </Link>
              </li>
            </ul>
          </nav>

          <div>
            <h2 className="font-sans text-[0.6875rem] font-medium tracking-[0.18em] text-cream/50 uppercase">
              {t("footer.contact")}
            </h2>
            <address className="mt-4 flex flex-col gap-2.5 text-sm not-italic text-cream/75">
              <p>
                {company.legalName}
                <br />
                {company.street}
                <br />
                {company.postalCode} {company.city}
                <br />
                {company.country}
              </p>
              <a
                href={`tel:${company.phoneHref}`}
                className="inline-block w-fit py-0.5 transition-colors duration-200 hover:text-marigold"
              >
                {company.phone}
              </a>
              <p className="text-cream/55">
                {t("contact.details.fax")} {company.fax}
              </p>
              <p className="text-cream/55">
                {t("contact.details.vat")} {company.vat}
              </p>
            </address>
          </div>

          <div>
            <h2 className="font-sans text-[0.6875rem] font-medium tracking-[0.18em] text-cream/50 uppercase">
              {t("footer.language")}
            </h2>
            <div className="mt-4">
              <LanguageSwitcher variant="block" tone="dark" />
            </div>
            <Link
              to="/kontakt"
              className="mt-6 inline-flex items-center gap-1.5 border-b border-cream/30 pb-1 text-sm text-cream/80 transition-colors duration-200 hover:border-marigold hover:text-marigold"
            >
              {t("nav.contact")}
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" strokeWidth={1.7} />
            </Link>
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-3 border-t border-white/15 pt-6 text-xs text-cream/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {company.brand} · {company.legalName}. {t("footer.rights")}
          </p>
          <p className="max-w-md sm:text-right">{t("footer.note")}</p>
        </div>
      </div>
    </footer>
  );
}
