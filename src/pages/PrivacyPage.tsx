import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft } from "lucide-react";

import { useSeo } from "@/lib/seo";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";

interface Section {
  title: string;
  text: string;
}

export default function PrivacyPage() {
  useSeo("privacy");
  const { t } = useTranslation();
  const sections = t("privacy.sections", { returnObjects: true }) as Section[];

  return (
    <>
      <PageHero
        eyebrow={t("privacy.eyebrow")}
        title={t("privacy.title")}
        text={t("privacy.intro")}
        image="/images/gallery/gallery-04.jpg"
        imageAlt={t("privacy.title")}
      />

      <section className="section-y">
        <div className="container-x max-w-3xl">
          <div className="flex flex-col">
            {sections.map((section, index) => (
              <Reveal key={section.title} distance={12}>
                <article className="border-t border-line py-8 first:border-t-0 first:pt-0">
                  <div className="flex items-baseline gap-4">
                    <span className="text-[0.625rem] tracking-[0.18em] text-stone">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h2 className="type-h3">{section.title}</h2>
                  </div>
                  <p className="mt-3 max-w-[62ch] text-base leading-relaxed text-ink-soft">
                    {section.text}
                  </p>
                </article>
              </Reveal>
            ))}
          </div>

          <Link to="/" className="btn btn-outline mt-12">
            <ArrowLeft aria-hidden="true" className="h-4 w-4" strokeWidth={1.7} />
            {t("privacy.back")}
          </Link>
        </div>
      </section>
    </>
  );
}
