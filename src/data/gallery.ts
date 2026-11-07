export interface GalleryImage {
  id: string;
  src: string;
  /** Optional catalogue key used to build a translated, descriptive alt text. */
  productKey?: string;
  /** Aspect ratio class, so the masonry grid keeps an editorial rhythm. */
  ratio: "portrait" | "landscape" | "square";
}

export const galleryImages: GalleryImage[] = [
  { id: "gallery-01", src: "/images/gallery/gallery-01.jpg", productKey: "passionsfruechte", ratio: "portrait" },
  { id: "gallery-02", src: "/images/gallery/gallery-02.jpg", productKey: "mango", ratio: "landscape" },
  { id: "gallery-03", src: "/images/gallery/gallery-03.jpg", ratio: "portrait" },
  { id: "gallery-04", src: "/images/gallery/gallery-04.jpg", ratio: "square" },
  { id: "gallery-05", src: "/images/gallery/gallery-05.jpg", productKey: "avocados", ratio: "portrait" },
  { id: "gallery-06", src: "/images/gallery/gallery-06.jpg", productKey: "zitronen", ratio: "landscape" },
  { id: "gallery-07", src: "/images/gallery/gallery-07.jpg", productKey: "papayas", ratio: "portrait" },
  { id: "gallery-08", src: "/images/gallery/gallery-08.jpg", ratio: "square" },
];

export const ratioClasses: Record<GalleryImage["ratio"], string> = {
  portrait: "aspect-[4/5]",
  landscape: "aspect-[3/2]",
  square: "aspect-square",
};
