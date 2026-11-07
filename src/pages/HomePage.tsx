import { useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { ArrowRight, ArrowUpRight, Phone } from "lucide-react";

import { company } from "@/data/company";
import { featuredProducts } from "@/data/products";
import { galleryImages } from "@/data/gallery";
import { useSeo } from "@/lib/seo";
import Reveal from "@/components/ui/Reveal";
import ProductCard from "@/components/products/ProductCard";

export default function HomePage() {
  useSeo("home");
  const { t } = useTranslation();
  const reduceMotion = useReducedMotion();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "14%"]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.85]);

  const facts = t("home.intro.facts", { returnObjects: true }) as Array<{
    label: string;
    value: string;
  }>;
  const principles = t("home.philosophy.items", { returnObjects: true }) as string[];
  const services = t("home.services.items", { returnObjects: true }) as Array<{
    title: string;
    text: string;
  }>;
  const tickerItems = t("products.items", { returnObjects: true }) as Record<string, string>;

  const rise = (delay: number) =>
    reduceMotion
      ? {}
      : {
          initial: { opacity: 0, y: 26 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] as const },
        };

  return (
    <>
      {/* ---------------------------------------------------------------- hero */}
      <section ref={heroRef} className="relative isolate flex min-h-[88svh] flex-col justify-end overflow-hidden bg-forest-deep sm:min-h-[92svh]">
        <motion.div
          style={reduceMotion ? undefined : { y: imageY }}
          className="absolute inset-0 -z-10 h-[112%]"
        >
          <img
            src="/images/hero/hero-market.jpg"
            alt={t("home.hero.imageAlt")}
            className="h-full w-full object-cover"
            fetchPriority="high"
          />
        </motion.div>
        <motion.div
          aria-hidden="true"
          style={reduceMotion ? undefined : { opacity: overlayOpacity }}
          className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(9,55,12,0.55)_0%,rgba(9,55,12,0.42)_38%,rgba(9,55,12,0.88)_100%)]"
        />

        <div className="container-x relative pt-24 pb-8 text-cream sm:pt-32 sm:pb-14">
          <motion.p {...rise(0.05)} className="eyebrow !text-cream/75">
            {t("home.hero.eyebrow")}
          </motion.p>
          <motion.h1 {...rise(0.12)} className="type-display-xl mt-5 max-w-[18ch] text-cream">
            {t("home.hero.title")}
          </motion.h1>
          <motion.p {...rise(0.2)} className="mt-6 max-w-xl text-base leading-relaxed text-cream/80 sm:text-lg">
            {t("home.hero.text")}
          </motion.p>
          <motion.div {...rise(0.28)} className="mt-7 flex flex-wrap gap-3 sm:mt-9">
            <Link to="/produkte" className="btn btn-light">
              {t("home.hero.primary")}
              <ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={1.7} />
            </Link>
            <Link to="/ueber-uns" className="btn btn-ghost-light">
              {t("home.hero.secondary")}
            </Link>
          </motion.div>
        </div>

        <div className="container-x relative">
          <dl className="grid border-t border-white/20 sm:grid-cols-3">
            {facts.map((fact, index) => (
              <div
                key={fact.label}
                className={`flex flex-col gap-1 py-3.5 text-cream sm:py-6 ${
                  index > 0 ? "border-t border-white/15 sm:border-t-0 sm:border-l sm:border-white/20 sm:pl-6" : ""
                }`}
              >
                <dt className="text-[0.625rem] tracking-[0.18em] text-cream/55 uppercase">
                  {fact.label}
                </dt>
                <dd className="font-display text-base leading-tight text-cream sm:text-xl">
                  {fact.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* --------------------------------------------------------------- intro */}
      <section className="section-y">
        <div className="container-x grid items-start gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-20">
          <Reveal>
            <p className="eyebrow">{t("home.intro.eyebrow")}</p>
            <h2 className="type-display mt-5 max-w-[14ch]">{t("home.intro.title")}</h2>
            <div className="prose-editorial mt-7">
              {(t("home.intro.body", { returnObjects: true }) as string[]).map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>
            <Link to="/daehler-story" className="link-underline mt-8 text-forest">
              {t("home.intro.cta")}
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" strokeWidth={1.7} />
            </Link>
          </Reveal>

          <Reveal delay={0.12} className="lg:pt-4">
            <div className="media media-grade aspect-[4/5] w-full">
              <img
                src="/images/hero/hero-fruit.jpg"
                alt={t("home.gallery.title")}
                loading="lazy"
                width={1000}
                height={1250}
                className="h-full w-full object-cover"
              />
            </div>
            <p className="mt-3 text-xs text-stone">{t("common.fallbackNote")}</p>
          </Reveal>
        </div>
      </section>

      {/* -------------------------------------------------------------- ticker */}
      <div className="ticker overflow-hidden border-y border-line bg-cream-deep py-4">
        <div className="ticker-track" aria-hidden="true">
          {[0, 1].map((group) => (
            <div key={group} className="flex shrink-0 items-center">
              {Object.entries(tickerItems).map(([id, name]) => (
                <span
                  key={`${group}-${id}`}
                  className="flex items-center gap-8 px-8 font-display text-lg whitespace-nowrap text-ink-soft sm:text-xl"
                >
                  {name}
                  <span className="text-sm text-crimson">✳</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------------------ products */}
      <section className="section-y">
        <div className="container-x">
          <div className="flex flex-col gap-6 border-b border-line pb-8 md:flex-row md:items-end md:justify-between">
            <Reveal>
              <p className="eyebrow">{t("home.products.eyebrow")}</p>
              <h2 className="type-display mt-4 max-w-[16ch]">{t("home.products.title")}</h2>
            </Reveal>
            <Reveal delay={0.08} className="md:max-w-sm">
              <p className="lede">{t("home.products.text")}</p>
              <Link to="/produkte" className="link-underline mt-5 text-forest">
                {t("home.products.cta")}
                <ArrowUpRight aria-hidden="true" className="h-4 w-4" strokeWidth={1.7} />
              </Link>
            </Reveal>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 sm:gap-x-6 lg:grid-cols-3">
            {featuredProducts.map((product, index) => (
              <Reveal key={product.id} delay={index * 0.05}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ services */}
      <section className="bg-forest py-20 text-cream sm:py-28">
        <div className="container-x">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
            <Reveal>
              <p className="eyebrow !text-cream/60">{t("home.services.eyebrow")}</p>
              <h2 className="type-display mt-5 max-w-[14ch] text-cream">{t("home.services.title")}</h2>
              <p className="mt-6 max-w-md text-base leading-relaxed text-cream/70">
                {t("home.services.text")}
              </p>
              <Link to="/dienstleistungen" className="btn btn-ghost-light mt-8">
                {t("home.services.cta")}
                <ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={1.7} />
              </Link>
            </Reveal>

            <Reveal delay={0.1}>
              <ul className="border-t border-white/20">
                {services.map((service, index) => (
                  <li key={service.title} className="border-b border-white/15">
                    <Link
                      to="/dienstleistungen"
                      className="group flex items-start gap-5 py-6 transition-colors duration-300 hover:text-marigold sm:gap-8"
                    >
                      <span className="mt-1 font-display text-sm text-cream/40">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="flex-1">
                        <span className="font-display text-xl leading-snug sm:text-2xl">
                          {service.title}
                        </span>
                        <span className="mt-1.5 block max-w-md text-sm leading-relaxed text-cream/65">
                          {service.text}
                        </span>
                      </span>
                      <ArrowUpRight
                        aria-hidden="true"
                        className="mt-1.5 h-5 w-5 shrink-0 text-cream/30 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-marigold"
                        strokeWidth={1.5}
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- philosophy */}
      <section className="section-y">
        <div className="container-x">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">{t("home.philosophy.eyebrow")}</p>
            <h2 className="type-display mt-5">{t("home.philosophy.title")}</h2>
            <p className="lede mt-5">{t("home.philosophy.text")}</p>
          </Reveal>

          <ul className="mt-14 grid gap-px border-t border-line sm:grid-cols-2 lg:grid-cols-5">
            {principles.map((principle, index) => (
              <li
                key={principle}
                className="flex flex-col justify-between gap-8 border-b border-line py-6 sm:border-r sm:last:border-r-0 sm:pr-4"
              >
                <span className="text-[0.625rem] tracking-[0.18em] text-stone">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="font-display text-2xl leading-tight">{principle}</span>
              </li>
            ))}
          </ul>

          <div className="mt-10">
            <Link to="/ueber-uns" className="link-underline text-forest">
              {t("home.philosophy.cta")}
              <ArrowUpRight aria-hidden="true" className="h-4 w-4" strokeWidth={1.7} />
            </Link>
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------- quote */}
      <section className="relative overflow-hidden bg-forest-deep py-20 text-cream sm:py-28">
        <div className="container-x">
          <Reveal className="mx-auto max-w-4xl text-center">
            <span aria-hidden="true" className="block text-5xl leading-none text-crimson">“</span>
            <blockquote className="type-quote mt-6 text-cream">
              {t("home.quote.text")}
            </blockquote>
            <div className="mx-auto mt-9 h-px w-16 bg-marigold" aria-hidden="true" />
            <footer className="mt-6 text-sm text-cream/70">
              <cite className="not-italic">{t("home.quote.author")}</cite>
              <span className="mx-2 text-cream/35">·</span>
              {t("home.quote.role")}
            </footer>
          </Reveal>
        </div>
      </section>

      {/* --------------------------------------------------------------- story */}
      <section className="section-y">
        <div className="container-x grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          <Reveal className="order-2 lg:order-1">
            <div className="media media-grade aspect-[3/2]">
              <img
                src="/images/logistics/service-sourcing.jpg"
                alt={t("home.story.eyebrow")}
                loading="lazy"
                width={1200}
                height={800}
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>
          <Reveal delay={0.08} className="order-1 lg:order-2">
            <p className="eyebrow">{t("home.story.eyebrow")}</p>
            <h2 className="type-display mt-4 max-w-[15ch]">{t("home.story.title")}</h2>
            <p className="lede mt-6">{t("home.story.text")}</p>
            <Link to="/daehler-story" className="btn btn-primary mt-8">
              {t("home.story.cta")}
              <ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={1.7} />
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------------- gallery */}
      <section className="section-y-sm border-t border-line">
        <div className="container-x">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <Reveal>
              <p className="eyebrow">{t("home.gallery.eyebrow")}</p>
              <h2 className="type-h2 mt-4">{t("home.gallery.title")}</h2>
            </Reveal>
            <Reveal delay={0.06}>
              <Link to="/daehler-story" className="link-underline text-forest">
                {t("home.gallery.cta")}
                <ArrowUpRight aria-hidden="true" className="h-4 w-4" strokeWidth={1.7} />
              </Link>
            </Reveal>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {galleryImages.slice(0, 4).map((image, index) => (
              <Reveal key={image.id} delay={index * 0.05}>
                <div className="media media-zoom media-grade aspect-[4/5]">
                  <img
                    src={image.src}
                    alt={image.productKey ? t(`products.items.${image.productKey}`) : t("home.gallery.title")}
                    loading="lazy"
                    width={700}
                    height={875}
                    className="h-full w-full object-cover"
                  />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------- cta */}
      <section className="pb-20 sm:pb-28">
        <div className="container-x">
          <Reveal className="relative overflow-hidden rounded-2xl bg-cream-deep p-8 sm:p-14">
            <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr] lg:items-end">
              <div>
                <p className="eyebrow">{t("contact.eyebrow")}</p>
                <h2 className="type-display mt-4 max-w-[16ch]">{t("contact.title")}</h2>
                <p className="lede mt-5">{t("contact.intro")}</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col lg:items-start">
                <Link to="/kontakt" className="btn btn-primary">
                  {t("nav.contact")}
                  <ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={1.7} />
                </Link>
                <a href={`tel:${company.phoneHref}`} className="btn btn-outline">
                  <Phone aria-hidden="true" className="h-4 w-4" strokeWidth={1.7} />
                  {company.phone}
                </a>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
