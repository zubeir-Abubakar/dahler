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

  return (
    <>
      <PageHero
        eyebrow={t("about.eyebrow")}
        title={t("about.title")}
        text={t("about.intro")}
        image="/images/gallery/gallery-03.jpg"
        imageAlt={t("home.story.eyebrow")}
      />

      {/* ------------------------------------------------------------- statement */}
      <section className="section-y">
        <div className="container-x grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <Reveal>
            <p className="eyebrow">{t("nav.about")}</p>
            <p className="type-display mt-6">{t("about.intro")}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="media media-grade aspect-[4/3]">
              <img
                src="/images/gallery/gallery-04.jpg"
                alt={t("about.eyebrow")}
                loading="lazy"
                width={1200}
                height={900}
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* --------------------------------------------------------------- pillars */}
      <section className="border-t border-line">
        <div className="container-x">
          <div className="grid gap-px lg:grid-cols-2">
            {pillars.map((pillar, index) => (
              <Reveal key={pillar.id} delay={Math.min(index, 4) * 0.05} distance={14}>
                <article
                  className={`flex h-full flex-col gap-4 border-b border-line py-10 lg:py-14 ${
                    index % 2 === 0 ? "lg:pr-12" : "lg:border-l lg:pl-12"
                  }`}
                >
                  <div className="flex items-baseline gap-4">
                    <span className="text-[0.625rem] tracking-[0.18em] text-crimson">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h2 className="type-h2">{pillar.title}</h2>
                  </div>
                  <p className="max-w-xl text-base leading-relaxed text-ink-soft">{pillar.text}</p>
                </article>
              </Reveal>
            ))}

            <Reveal delay={0.1} distance={14}>
              <article className="flex h-full flex-col justify-between gap-6 border-b border-line bg-cream-deep p-8 lg:border-l lg:py-14 lg:pr-0 lg:pl-12">
                <div>
                  <h2 className="type-h2 max-w-[16ch]">{t("about.closing.title")}</h2>
                  <p className="mt-4 max-w-md text-base leading-relaxed text-ink-soft">
                    {t("about.closing.text")}
                  </p>
                </div>
                <Link to="/kontakt" className="btn btn-primary w-fit">
                  {t("about.quote.cta")}
                  <ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={1.7} />
                </Link>
              </article>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------- quote */}
      <section className="bg-forest py-20 text-cream sm:py-28">
        <div className="container-x">
          <Reveal className="mx-auto max-w-4xl text-center">
            <span aria-hidden="true" className="mx-auto block h-px w-12 bg-marigold" />
            <blockquote className="type-quote mt-8 text-cream">{t("about.quote.text")}</blockquote>
            <p className="mt-8 text-sm text-cream/65">{t("home.quote.author")}</p>
            <p className="text-xs tracking-[0.12em] text-cream/45 uppercase">{t("home.quote.role")}</p>
          </Reveal>
        </div>
      </section>
    </>
  );
}
