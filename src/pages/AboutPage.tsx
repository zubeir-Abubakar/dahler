import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";

import { useSeo } from "@/lib/seo";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";

interface Pillar {
  id: string;
  title: string;
  text: string;
}

export default function AboutPage() {
  useSeo("about");
  const { t } = useTranslation();
  const pillars = t("about.pillars", { returnObjects: true }) as Pillar[];
  const portrait = t("about.portrait.body", { returnObjects: true }) as string[];

  return (
    <>
      <PageHero
        eyebrow={t("about.eyebrow")}
        title={t("about.title")}
        text={t("about.intro")}
        image="/images/gallery/gallery-03.jpg"
        imageAlt=""
      />

      {/* ------------------------------------------------------------- portrait */}
      <section className="section-y">
        <div className="container-x grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <Reveal>
            <p className="eyebrow">{t("nav.about")}</p>
            <h2 className="type-display mt-4 max-w-[18ch]">{t("about.portrait.title")}</h2>
            <div className="prose-editorial mt-6">
              {portrait.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>
            <Link to="/daehler-story" className="link-underline mt-7 text-forest">
              {t("about.portrait.cta")}
              <ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={1.7} />
            </Link>
          </Reveal>

          <Reveal delay={0.08}>
            <div className="media media-grade aspect-[4/3]">
              <img
                src="/images/logistics/service-sourcing.jpg"
                alt={t("about.portrait.imageAlt")}
                loading="lazy"
                width={1200}
                height={900}
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* -------------------------------------------------------------- pillars */}
      <section className="border-t border-line bg-paper">
        <div className="container-x section-y-sm">
          <Reveal className="max-w-2xl">
            <p className="eyebrow">{t("about.principles.eyebrow")}</p>
            <h2 className="type-h2 mt-4">{t("about.principles.title")}</h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft sm:text-base">
              {t("about.principles.text")}
            </p>
          </Reveal>

          <div className="mt-9 grid gap-x-12 lg:grid-cols-2">
            {pillars.map((pillar, index) => (
              <Reveal key={pillar.id} delay={Math.min(index, 4) * 0.04} distance={12}>
                <article className="flex gap-4 border-t border-line py-6 sm:gap-6 sm:py-7">
                  <span className="mt-1 text-[0.625rem] tracking-[0.18em] text-crimson">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="type-h3">{pillar.title}</h3>
                    <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-soft">
                      {pillar.text}
                    </p>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- quote */}
      <section className="bg-forest py-16 text-cream sm:py-20">
        <div className="container-x">
          <Reveal className="mx-auto max-w-3xl text-center">
            <span aria-hidden="true" className="mx-auto block h-px w-12 bg-marigold" />
            <blockquote className="type-quote mt-7 text-cream">{t("about.quote.text")}</blockquote>
            <p className="mt-7 text-sm text-cream/70">
              {t("about.quote.author")}
              <span className="mx-2 text-cream/35">·</span>
              {t("about.quote.role")}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------------------ cta */}
      <section className="section-y-sm">
        <div className="container-x flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <p className="type-h3 max-w-xl">{t("about.quote.cta")}</p>
          <Link to="/kontakt" className="btn btn-primary w-fit">
            {t("nav.contact")}
            <ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={1.7} />
          </Link>
        </div>
      </section>
    </>
  );
}
