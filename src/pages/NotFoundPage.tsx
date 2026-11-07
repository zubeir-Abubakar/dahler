import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";

import { useSeo } from "@/lib/seo";

export default function NotFoundPage() {
  useSeo("notFound", { noindex: true });
  const { t } = useTranslation();

  return (
    <section className="relative isolate flex min-h-[80svh] items-center overflow-hidden bg-forest-deep text-cream">
      <img
        src="/images/hero/hero-fruit.jpg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover opacity-25"
      />
      <div className="container-x relative py-32">
        <p className="font-display text-[clamp(4rem,14vw,10rem)] leading-none text-cream/20">404</p>
        <h1 className="type-display mt-4 max-w-[14ch] text-cream">{t("notFound.title")}</h1>
        <p className="mt-5 max-w-md text-cream/70">{t("notFound.text")}</p>
        <Link to="/" className="btn btn-light mt-9">
          {t("notFound.cta")}
          <ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={1.7} />
        </Link>
      </div>
    </section>
  );
}
