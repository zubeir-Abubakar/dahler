export type ProductCategory = "fruit" | "vegetables" | "juice" | "industrial";

export interface Product {
  /** Slug used for both the image file and the i18n name key. */
  id: string;
  category: ProductCategory;
  image: string;
  featured?: boolean;
}

/**
 * The catalogue as published on daehler-fruechte.ch/produkte.
 * Nothing is added or removed; availability and prices are intentionally absent.
 */
export const products: Product[] = [
  { id: "ananas", category: "fruit", image: "/images/products/ananas.jpg", featured: true },
  { id: "baby-ananas", category: "fruit", image: "/images/products/baby-ananas.jpg" },
  { id: "avocados", category: "fruit", image: "/images/products/avocados.jpg", featured: true },
  { id: "bananenblaetter", category: "vegetables", image: "/images/products/bananenblaetter.jpg" },
  { id: "chilischoten", category: "vegetables", image: "/images/products/chilischoten.jpg" },
  { id: "granataepfel", category: "fruit", image: "/images/products/granataepfel.jpg" },
  { id: "granadillas", category: "fruit", image: "/images/products/granadillas.jpg" },
  { id: "guaven", category: "fruit", image: "/images/products/guaven.jpg" },
  { id: "ingwer", category: "vegetables", image: "/images/products/ingwer.jpg" },
  { id: "kaki", category: "fruit", image: "/images/products/kaki.jpg" },
  { id: "kaktusfeigen", category: "fruit", image: "/images/products/kaktusfeigen.jpg" },
  { id: "karambolen", category: "fruit", image: "/images/products/karambolen.jpg" },
  { id: "kiwi-gruen", category: "fruit", image: "/images/products/kiwi-gruen.jpg" },
  { id: "kiwi-gold", category: "fruit", image: "/images/products/kiwi-gold.jpg" },
  { id: "kokosnuesse", category: "fruit", image: "/images/products/kokosnuesse.jpg" },
  { id: "limesblaetter", category: "vegetables", image: "/images/products/limesblaetter.jpg" },
  { id: "litschis", category: "fruit", image: "/images/products/litschis.jpg", featured: true },
  { id: "mango", category: "fruit", image: "/images/products/mango.jpg", featured: true },
  { id: "mangostan", category: "fruit", image: "/images/products/mangostan.jpg" },
  { id: "maracuja", category: "fruit", image: "/images/products/maracuja.jpg", featured: true },
  { id: "mini-mais", category: "vegetables", image: "/images/products/mini-mais.jpg" },
  { id: "okra", category: "vegetables", image: "/images/products/okra.jpg" },
  { id: "passionsfruechte", category: "fruit", image: "/images/products/passionsfruechte.jpg" },
  { id: "physalis", category: "fruit", image: "/images/products/physalis.jpg" },
  { id: "pitahaya", category: "fruit", image: "/images/products/pitahaya.jpg", featured: true },
  { id: "papayas", category: "fruit", image: "/images/products/papayas.jpg" },
  { id: "formosa", category: "fruit", image: "/images/products/formosa.jpg" },
  { id: "rambutan", category: "fruit", image: "/images/products/rambutan.jpg" },
  { id: "suesskartoffel", category: "vegetables", image: "/images/products/suesskartoffel.jpg" },
  { id: "tamarillos", category: "fruit", image: "/images/products/tamarillos.jpg" },
  { id: "tamarinden", category: "fruit", image: "/images/products/tamarinden.jpg" },
  { id: "zitronen", category: "fruit", image: "/images/products/zitronen.jpg" },
  { id: "zitronengras", category: "vegetables", image: "/images/products/zitronengras.jpg" },
  { id: "orangensaft", category: "juice", image: "/images/products/orangensaft.jpg" },
  { id: "orangen-tafel", category: "fruit", image: "/images/products/orangen-tafel.jpg" },
  { id: "trauben", category: "fruit", image: "/images/products/trauben.jpg" },
  { id: "melonen-galia", category: "fruit", image: "/images/products/melonen-galia.jpg" },
  { id: "honigmelonen", category: "fruit", image: "/images/products/honigmelonen.jpg" },
  { id: "wassermelonen", category: "fruit", image: "/images/products/wassermelonen.jpg" },
  {
    id: "ananas-crownless",
    category: "industrial",
    image: "/images/products/ananas-crownless.jpg",
  },
  { id: "mango-xl", category: "industrial", image: "/images/products/mango-xl.jpg" },
  { id: "melonen-xl", category: "industrial", image: "/images/products/melonen-xl.jpg" },
];

export const categories: Array<"all" | ProductCategory> = [
  "all",
  "fruit",
  "vegetables",
  "juice",
  "industrial",
];

export const featuredProducts = products.filter((product) => product.featured);
