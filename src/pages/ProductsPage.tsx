import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowRight, Search, X } from "lucide-react";

import { categories, products, type ProductCategory } from "@/data/products";
import { useSeo } from "@/lib/seo";
import PageHero from "@/components/ui/PageHero";
import ProductCard from "@/components/products/ProductCard";
import Reveal from "@/components/ui/Reveal";

const industrialImages = [
  "/images/products/ananas-crownless.jpg",
  "/images/products/mango-xl.jpg",
  "/images/products/melonen-xl.jpg",
];

export default function ProductsPage() {
  useSeo("products");
  const { t } = useTranslation();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<"all" | ProductCategory>("all");

  const industrial = t("products.industrial.items", { returnObjects: true }) as Array<{
    name: string;
    text: string;
  }>;
  const quality = t("products.quality.items", { returnObjects: true }) as Array<{
    title: string;
    paragraphs: string[];
  }>;

  const visible = useMemo(() => {
    const term = query.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory = category === "all" || product.category === category;
      if (!matchesCategory) return false;
      if (!term) return true;
      const name = t(`products.items.${product.id}`).toLowerCase();
      return name.includes(term) || product.id.includes(term);
    });
  }, [category, query, t]);

  const reset = () => {
    setQuery("");
    setCategory("all");
  };

  return (
    <>
      <PageHero
        eyebrow={t("products.eyebrow")}
        title={t("products.title")}
        text={t("products.intro")}
        image="/images/hero/hero-fruit.jpg"
        imageAlt={t("home.hero.imageAlt")}
      />

      {/* ------------------------------------------------------ search + filter */}
      <div className="sticky top-[4.5rem] z-30 border-b border-line bg-cream/95 backdrop-blur-md sm:top-20">
        <div className="container-x flex flex-col gap-3 py-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="relative w-full lg:max-w-xs">
            <label htmlFor="product-search" className="sr-only">
              {t("products.searchLabel")}
            </label>
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-stone"
              strokeWidth={1.7}
            />
            <input
              id="product-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t("products.searchPlaceholder")}
              className="field-input min-h-11 !rounded-full pl-9 pr-10 text-sm"
            />
            {query ? (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label={t("products.clearSearch")}
                className="absolute top-1/2 right-2 inline-flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-stone transition-colors duration-200 hover:bg-cream-deep hover:text-ink"
              >
                <X aria-hidden="true" className="h-4 w-4" strokeWidth={1.8} />
              </button>
            ) : null}
          </div>

          <div className="-mx-1 flex items-center gap-2 overflow-x-auto px-1 pb-1 lg:mx-0 lg:pb-0">
            <span className="sr-only">{t("products.filterLabel")}</span>
            {categories.map((item) => {
              const isActive = category === item;
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => setCategory(item)}
                  aria-pressed={isActive}
                  className={`inline-flex min-h-9 shrink-0 items-center rounded-full border px-3.5 text-xs font-medium whitespace-nowrap transition-colors duration-200 ${
                    isActive
                      ? "border-forest bg-forest text-cream"
                      : "border-line bg-transparent text-ink-soft hover:border-line-strong hover:text-ink"
                  }`}
                >
                  {t(`products.categories.${item}`)}
                </button>
              );
            })}
          </div>

          <p className="shrink-0 text-xs tracking-wide text-stone" aria-live="polite">
            {t("products.resultCount", { count: visible.length })}
          </p>
        </div>
      </div>

      {/* ------------------------------------------------------------- catalogue */}
      <section className="pb-20 sm:pb-24">
        <div className="container-x">
          {visible.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-5 gap-y-10 pt-10 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-4">
              {visible.map((product, index) => (
                <Reveal key={product.id} delay={Math.min(index, 8) * 0.03} distance={12}>
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-start gap-4 border-b border-line py-20">
              <h2 className="type-h2">{t("products.empty")}</h2>
              <p className="text-ink-soft">{t("products.emptyHint")}</p>
              <button type="button" onClick={reset} className="btn btn-outline mt-2">
                {t("products.reset")}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ------------------------------------------------------------ industrial */}
      <section className="bg-forest py-20 text-cream sm:py-28">
        <div className="container-x">
          <Reveal className="max-w-2xl">
            <p className="eyebrow !text-cream/60">{t("products.industrial.eyebrow")}</p>
            <h2 className="type-display mt-5 text-cream">{t("products.industrial.title")}</h2>
          </Reveal>

          <div className="mt-12 grid gap-6 sm:grid-cols-3">
            {industrial.map((item, index) => (
              <Reveal key={item.name} delay={index * 0.07}>
                <article className="flex h-full flex-col border-t border-white/25 pt-5">
                  <div className="media media-grade aspect-[4/3]">
                    <img
                      src={industrialImages[index] ?? industrialImages[0]}
                      alt={item.name}
                      loading="lazy"
                      width={800}
                      height={600}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <h3 className="type-h3 mt-5 text-cream">{item.name}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-cream/65">{item.text}</p>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* --------------------------------------------------------------- quality */}
      <section className="section-y">
        <div className="container-x grid gap-12 lg:grid-cols-[0.75fr_1.25fr] lg:gap-20">
          <Reveal>
            <p className="eyebrow">{t("products.quality.eyebrow")}</p>
            <h2 className="type-display mt-5 max-w-[12ch]">{t("products.quality.title")}</h2>
          </Reveal>

          <div className="flex flex-col">
            {quality.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.06}>
                <article className="border-t border-line py-8 first:pt-0 sm:py-10">
                  <div className="flex items-baseline gap-4">
                    <span className="text-[0.625rem] tracking-[0.18em] text-stone">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <h3 className="type-h3">{item.title}</h3>
                  </div>
                  <div className="prose-editorial mt-4 text-base">
                    {item.paragraphs.map((paragraph) => (
                      <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                    ))}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------------- cta */}
      <section className="pb-20 sm:pb-28">
        <div className="container-x">
          <Reveal className="grid gap-8 rounded-2xl bg-cream-deep p-8 sm:p-14 lg:grid-cols-[1.4fr_0.6fr] lg:items-end">
            <div>
              <h2 className="type-display max-w-[18ch]">{t("products.cta.title")}</h2>
              <p className="lede mt-5">{t("products.cta.text")}</p>
            </div>
            <Link to="/kontakt" className="btn btn-accent w-fit">
              {t("products.cta.button")}
              <ArrowRight aria-hidden="true" className="h-4 w-4" strokeWidth={1.7} />
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
