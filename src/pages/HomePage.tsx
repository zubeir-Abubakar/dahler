import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  MapPin,
  Phone,
  Truck,
} from "lucide-react";

import { company } from "@/data/company";
import { featuredProducts } from "@/data/products";
import { useSeo } from "@/lib/seo";
import Reveal from "@/components/ui/Reveal";
import ProductCard from "@/components/products/ProductCard";

const highlights = [
  { key: "founded", icon: CalendarDays, tone: "bg-leaf/10 text-leaf-deep" },
  { key: "location", icon: MapPin, tone: "bg-crimson/10 text-crimson" },
  { key: "delivery", icon: Truck, tone: "bg-marigold/40 text-forest" },
] as const;

export default function HomePage() {
  useSeo("home");
  const { t } = useTranslation();

  return (
    <>
      {/* ---------------------------------------------------------------- hero */}
      <section className="relative isolate flex min-h-[84svh] flex-col justify-end overflow-hidden bg-forest-deep">
        <img
          src="/images/hero/hero-market.jpg"
          alt={t("home.hero.imageAlt")}
          className="absolute inset-0 h-full w-full object-cover object-[center_55%]"
          fetchPriority="high"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(9,55,12,0.58)_0%,rgba(9,55,12,0.36)_40%,rgba(9,55,12,0.88)_100%)]"
        />

        <div className="container-x relative pt-32 pb-24 text-cream sm:pb-28">
          <h1 className="type-display-xl max-w-[17ch] text-cream">
            {t("home.hero.title")}
          </h1>
          <p className="mt-6 max-w-[48ch] text-base leading-relaxed text-cream/85 sm:text-lg">
            {t("home.hero.text")}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/produkte" className="btn btn-light">
              {t("home.hero.primary")}
              <ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={1.7} />
            </Link>
            <Link to="/ueber-uns" className="btn btn-ghost-light">
              {t("home.hero.secondary")}
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- highlights */}
      <section aria-labelledby="company-highlights" className="relative z-10 -mt-14">
        <div className="container-x">
          <h2 id="company-highlights" className="sr-only">
            {t("home.highlights.title")}
          </h2>
          <dl className="grid grid-cols-3 gap-2 sm:gap-4">
            {highlights.map(({ key, icon: Icon, tone }) => (
              <div
                key={key}
                className="flex h-full flex-col gap-2.5 rounded-xl border border-white/70 bg-white/80 p-3 shadow-[0_18px_44px_-34px_rgba(9,55,12,0.6)] backdrop-blur-xl sm:flex-row sm:items-center sm:gap-4 sm:p-5"
              >
                <span
                  className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full sm:h-11 sm:w-11 ${tone}`}
                >
                  <Icon aria-hidden="true" className="h-4 w-4 sm:h-5 sm:w-5" strokeWidth={1.6} />
                </span>
                <div className="min-w-0">
                  <dt className="text-[0.55rem] font-medium tracking-[0.12em] text-stone uppercase sm:text-[0.625rem] sm:tracking-[0.16em]">
                    {t(`home.highlights.${key}.label`)}
                  </dt>
                  <dd className="mt-0.5 font-display text-[0.82rem] leading-tight text-ink sm:text-xl">
                    {t(`home.highlights.${key}.value`)}
                    <span className="mt-1 hidden text-xs leading-snug font-sans text-ink-soft sm:block">
                      {t(`home.highlights.${key}.detail`)}
                    </span>
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ------------------------------------------------------------- range */}
      <section className="section-y">
        <div className="container-x">
          <div className="flex flex-col gap-5 border-b border-line pb-8 md:flex-row md:items-end md:justify-between">
            <Reveal>
              <p className="eyebrow">{t("home.products.eyebrow")}</p>
              <h2 className="type-display mt-4 max-w-[16ch]">{t("home.products.title")}</h2>
            </Reveal>
            <Reveal delay={0.06} className="md:max-w-sm">
              <p className="text-sm leading-relaxed text-ink-soft sm:text-base">
                {t("home.products.text")}
              </p>
              <Link to="/produkte" className="link-underline mt-5 text-forest">
                {t("home.products.cta")}
                <ArrowUpRight aria-hidden="true" className="h-4 w-4" strokeWidth={1.7} />
              </Link>
            </Reveal>
          </div>

          <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-9 sm:gap-x-6 lg:grid-cols-3">
            {featuredProducts.slice(0, 6).map((product, index) => (
              <Reveal key={product.id} delay={index * 0.04} distance={12}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- about */}
      <section className="border-y border-line bg-paper">
        <div className="container-x grid items-center gap-10 py-14 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <Reveal>
            <p className="eyebrow">{t("home.about.eyebrow")}</p>
            <h2 className="type-display mt-4 max-w-[18ch]">{t("home.about.title")}</h2>
            <p className="lede mt-5">{t("home.about.text")}</p>
            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-3">
              <Link to="/ueber-uns" className="link-underline text-forest">
                {t("home.about.cta")}
                <ArrowUpRight aria-hidden="true" className="h-4 w-4" strokeWidth={1.7} />
              </Link>
              <a
                href={`tel:${company.phoneHref}`}
                className="inline-flex items-center gap-2 text-sm text-ink-soft transition-colors hover:text-forest"
              >
                <Phone aria-hidden="true" className="h-4 w-4" strokeWidth={1.7} />
                {company.phone}
              </a>
            </div>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="media media-grade aspect-[4/3] lg:aspect-[5/4]">
              <img
                src="/images/gallery/gallery-03.jpg"
                alt={t("home.about.imageAlt")}
                loading="lazy"
                width={1000}
                height={800}
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ----------------------------------------------------------- contact */}
      <section className="section-y-sm">
        <div className="container-x">
          <Reveal className="flex flex-col gap-6 rounded-2xl bg-forest px-6 py-8 text-cream sm:px-10 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="type-h2 text-cream">{t("home.contact.title")}</h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-cream/75">
                {t("home.contact.text")}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/kontakt" className="btn btn-light">
                {t("home.contact.cta")}
                <ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={1.7} />
              </Link>
              <a href={`mailto:${company.email}`} className="btn btn-ghost-light">
                {company.email}
              </a>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
