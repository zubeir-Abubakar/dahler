import { useState } from "react";
import { useTranslation } from "react-i18next";

import { galleryImages, ratioClasses } from "@/data/gallery";
import { useSeo } from "@/lib/seo";
import PageHero from "@/components/ui/PageHero";
import Reveal from "@/components/ui/Reveal";
import Lightbox, { type LightboxImage } from "@/components/ui/Lightbox";

interface Chapter {
  title: string;
  paragraphs: string[];
}

export default function StoryPage() {
  useSeo("story");
  const { t } = useTranslation();
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const chapters = t("story.chapters", { returnObjects: true }) as Chapter[];
  const credit = t("story.credit");

  const images: LightboxImage[] = galleryImages.map((image) => ({
    src: image.src,
    alt: image.productKey
      ? t(`products.items.${image.productKey}`)
      : t("story.gallery.title"),
  }));

  return (
    <>
      <PageHero
        eyebrow={t("story.eyebrow")}
        title={t("story.title")}
        text={t("story.intro")}
        image="/images/gallery/gallery-07.jpg"
        imageAlt={t("story.gallery.title")}
      />

      {/* ------------------------------------------------------------- chapters */}
      <section className="section-y">
        <div className="container-x">
          <div className="flex flex-col">
            {chapters.map((chapter, index) => (
              <Reveal key={chapter.title} distance={14}>
                <article className="grid gap-6 border-t border-line py-10 first:border-t-0 first:pt-0 lg:grid-cols-[minmax(0,16rem)_minmax(0,1fr)] lg:gap-16 lg:py-14">
                  <header className="lg:sticky lg:top-28 lg:self-start">
                    <span className="text-[0.625rem] tracking-[0.18em] text-crimson">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h2 className="type-h2 mt-3">{chapter.title}</h2>
                  </header>
                  <div className="prose-editorial max-w-[64ch]">
                    {chapter.paragraphs.map((paragraph) => (
                      <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                    ))}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <p className="mt-10 border-t border-line pt-5 text-xs tracking-wide text-stone">
            {credit}
          </p>
        </div>
      </section>

      {/* -------------------------------------------------------------- gallery */}
      <section id="galerie" className="section-y-sm bg-paper">
        <div className="container-x">
          <div className="flex flex-col gap-4 border-b border-line pb-8 sm:flex-row sm:items-end sm:justify-between">
            <Reveal>
              <p className="eyebrow">{t("story.gallery.eyebrow")}</p>
              <h2 className="type-h2 mt-4">{t("story.gallery.title")}</h2>
            </Reveal>
            <Reveal delay={0.06} className="sm:max-w-sm">
              <p className="text-sm leading-relaxed text-ink-soft">{t("story.gallery.text")}</p>
            </Reveal>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {galleryImages.map((image, index) => (
              <Reveal key={image.id} delay={Math.min(index, 6) * 0.04} distance={12}>
                <button
                  type="button"
                  onClick={() => setLightboxIndex(index)}
                  className={`media media-zoom media-grade group relative block w-full ${ratioClasses[image.ratio]}`}
                  aria-label={`${t("story.gallery.open")}: ${
                    image.productKey ? t(`products.items.${image.productKey}`) : t("story.gallery.title")
                  }`}
                >
                  <img
                    src={image.src}
                    alt={images[index]?.alt ?? ""}
                    loading="lazy"
                    decoding="async"
                    width={1000}
                    height={750}
                    className="h-full w-full object-cover"
                  />
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 bg-forest-deep/0 transition-colors duration-300 group-hover:bg-forest-deep/15"
                  />
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Lightbox
        images={images}
        index={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onNavigate={setLightboxIndex}
      />
    </>
  );
}
