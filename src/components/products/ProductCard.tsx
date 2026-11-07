import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowUpRight } from "lucide-react";

import type { Product } from "@/data/products";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { t } = useTranslation();
  const name = t(`products.items.${product.id}`);

  return (
    <Link to="/produkte" className="group block focus-visible:outline-offset-8">
      <div className="media media-zoom media-grade aspect-[4/5]">
        <img
          src={product.image}
          alt={name}
          loading="lazy"
          decoding="async"
          width={800}
          height={1000}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="mt-3.5 flex items-baseline justify-between gap-3 border-b border-line pb-3 transition-colors duration-300 group-hover:border-ink">
        <h3 className="type-h3">{name}</h3>
        <ArrowUpRight
          aria-hidden="true"
          className="h-4 w-4 shrink-0 translate-y-0.5 text-stone opacity-0 transition-all duration-300 group-hover:opacity-100"
          strokeWidth={1.6}
        />
      </div>
      <p className="mt-2 text-[0.6875rem] tracking-[0.14em] text-stone uppercase">
        {t(`products.categories.${product.category}`)}
      </p>
    </Link>
  );
}
