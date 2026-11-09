import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Mail, MapPin, Phone } from "lucide-react";

import { company } from "@/data/company";
import { navigation } from "@/lib/navigation";
import Logo from "@/components/ui/Logo";

export default function Footer() {
  const { t } = useTranslation();
  const year = new Date().getFullYear();

  return (
    <footer className="bg-forest text-cream">
      <div className="container-x py-12 sm:py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr] lg:gap-12">
          <div className="max-w-sm sm:col-span-2 lg:col-span-1">
            <Link to="/" className="inline-flex items-center" aria-label={t("common.brand")}>
              <Logo className="h-9" />
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-cream/70">{t("footer.intro")}</p>
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
            </ul>
          </nav>

          <div>
            <h2 className="font-sans text-[0.6875rem] font-medium tracking-[0.18em] text-cream/50 uppercase">
              {t("footer.contact")}
            </h2>
            <address className="mt-4 flex flex-col gap-3 text-sm not-italic text-cream/75">
              <p className="flex items-start gap-2.5 leading-relaxed">
                <MapPin
                  aria-hidden="true"
                  className="mt-0.5 h-4 w-4 shrink-0 text-cream/45"
                  strokeWidth={1.6}
                />
                <span>
                  {company.street}
                  <br />
                  {company.postalCode} {company.city}
                  <br />
                  {company.country}
                </span>
              </p>
              <a
                href={`tel:${company.phoneHref}`}
                className="inline-flex w-fit items-center gap-2.5 py-0.5 transition-colors duration-200 hover:text-marigold"
              >
                <Phone aria-hidden="true" className="h-4 w-4 shrink-0 text-cream/45" strokeWidth={1.6} />
                {company.phone}
              </a>
              <a
                href={`mailto:${company.email}`}
                className="inline-flex w-fit items-center gap-2.5 py-0.5 break-all transition-colors duration-200 hover:text-marigold"
              >
                <Mail aria-hidden="true" className="h-4 w-4 shrink-0 text-cream/45" strokeWidth={1.6} />
                {company.email}
              </a>
            </address>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/15 pt-6 text-xs text-cream/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {company.brand}. {t("footer.rights")}
          </p>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-5">
            <Link
              to="/datenschutz"
              className="w-fit transition-colors duration-200 hover:text-cream"
            >
              {t("footer.privacy")}
            </Link>
            <p className="max-w-md sm:text-right">{t("footer.note")}</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
