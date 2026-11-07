import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";

import { useSeo } from "@/lib/seo";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";

interface ServiceItem {
  id: string;
  title: string;
  paragraphs: string[];
}

const visualSections = [
  { id: "ripening", image: "/images/logistics/service-ripening.jpg" },
  { id: "packing", image: "/images/logistics/service-packing.jpg" },
  { id: "logistics", image: "/images/logistics/service-logistics.jpg" },
];

export default function ServicesPage() {
  useSeo("services");
  const { t } = useTranslation();
  const items = t("services.items", { returnObjects: true }) as ServiceItem[];
  const passionText = t("services.passion.text", { returnObjects: true }) as string[];

  return (
    <>
      <PageHero
        eyebrow={t("services.eyebrow")}
        title={t("services.title")}
        text={t("services.intro")}
        image="/images/logistics/service-sourcing.jpg"
        imageAlt={t("services.eyebrow")}
      />

      {/* -------------------------------------------------------------- overview */}
      <section className="section-y">
        <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
          <Reveal>
            <p className="eyebrow">{t("services.eyebrow")}</p>
            <h2 className="type-h2 mt-5 max-w-[15ch]">{t("services.items.0.title")}</h2>
            <p className="lede mt-5">{items[0]?.paragraphs[0]}</p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="media media-grade aspect-[16/10]">
              <img
                src="/images/logistics/service-import.jpg"
                alt={t("services.items.1.title")}
                loading="lazy"
                width={1200}
                height={750}
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>
        </div>

        <div className="container-x mt-16">
          <div className="grid gap-px border-t border-line sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item, index) => (
              <Reveal key={item.id} delay={Math.min(index, 6) * 0.04} distance={12}>
                <article className="flex h-full flex-col gap-3 border-b border-line py-7 sm:pr-6 lg:pr-8">
                  <span className="text-[0.625rem] tracking-[0.18em] text-stone">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="type-h3">{item.title}</h3>
                  <p className="text-sm leading-relaxed text-ink-soft">{item.paragraphs[0]}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------- visual bands */}
      <section className="border-t border-line bg-paper">
        <div className="container-x">
          {visualSections.map((section, index) => {
            const item = items.find((entry) => entry.id === section.id);
            if (!item) return null;
            const reversed = index % 2 === 1;

            return (
              <Reveal key={section.id}>
                <article
                  className={`grid items-center gap-8 border-b border-line py-12 lg:grid-cols-2 lg:gap-16 lg:py-16 ${
                    reversed ? "lg:[&>figure]:order-2" : ""
                  }`}
                >
                  <figure className="media media-grade aspect-[16/11]">
                    <img
                      src={section.image}
                      alt={item.title}
                      loading="lazy"
                      width={1100}
                      height={756}
                      className="h-full w-full object-cover"
                    />
                  </figure>
                  <div className={reversed ? "lg:pr-6" : "lg:pl-6"}>
                    <span className="text-[0.625rem] tracking-[0.18em] text-stone">
                      {String(items.findIndex((entry) => entry.id === section.id) + 1).padStart(2, "0")}
                    </span>
                    <h2 className="type-h2 mt-3">{item.title}</h2>
                    <div className="prose-editorial mt-4">
                      {item.paragraphs.map((paragraph) => (
                        <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                      ))}
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>
      </section>

      {/* --------------------------------------------------------------- passion */}
      <section className="relative isolate overflow-hidden bg-forest-deep text-cream">
        <img
          src="/images/logistics/service-quality.jpg"
          alt=""
          aria-hidden="true"
          loading="lazy"
          className="absolute inset-0 h-full w-full object-cover opacity-30"
        />
        <div className="container-x relative section-y">
          <Reveal className="max-w-3xl">
            <p className="eyebrow !text-cream/60">{t("services.passion.eyebrow")}</p>
            <h2 className="type-display mt-5 text-cream">{t("services.passion.title")}</h2>
            <div className="mt-8 flex flex-col gap-5 text-base leading-relaxed text-cream/75">
              {passionText.map((paragraph) => (
                <p key={paragraph.slice(0, 32)}>{paragraph}</p>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------------------------------------------- cta */}
      <section className="section-y">
        <div className="container-x">
          <Reveal className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr] lg:items-end">
            <div>
              <h2 className="type-display max-w-[16ch]">{t("services.cta.title")}</h2>
              <p className="lede mt-5">{t("services.cta.text")}</p>
            </div>
            <Link to="/kontakt" className="btn btn-primary w-fit">
              {t("services.cta.button")}
              <ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={1.7} />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
