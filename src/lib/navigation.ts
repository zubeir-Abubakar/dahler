/** The six destinations of the original site, with their original German paths. */
export const navigation = [
  { path: "/", key: "home" },
  { path: "/produkte", key: "products" },
  { path: "/dienstleistungen", key: "services" },
  { path: "/ueber-uns", key: "about" },
  { path: "/daehler-story", key: "story" },
  { path: "/kontakt", key: "contact" },
] as const;

export type NavigationKey = (typeof navigation)[number]["key"];
