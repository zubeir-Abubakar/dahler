/**
 * Company information reproduced from daehler-fruechte.ch (Kontakt).
 * Every value below is published on the company's official website. Direct
 * telephone extensions are not published, so profiles show the switchboard.
 */
export const company = {
  brand: "Dähler Früchte",
  founded: 1978,
  street: "Eichhof",
  postalCode: "8558",
  city: "Raperswilen",
  region: "Thurgau",
  country: "Schweiz",
  phone: "+41 (0)44 448 22 50",
  phoneHref: "+41444482250",
  fax: "+41 (0)43 888 42 62",
  vat: "CHE-100.483.107",
  email: "info@daehler-fruechte.ch",
  mapsQuery: "Dähler Früchte, Eichhof, 8558 Raperswilen, Switzerland",
  mapsEmbed:
    "https://www.google.com/maps?q=Eichhof,+8558+Raperswilen,+Switzerland&output=embed",
  mapsDirections:
    "https://www.google.com/maps/dir/?api=1&destination=Eichhof%2C+8558+Raperswilen%2C+Switzerland",
  team: [
    {
      id: "marius",
      name: "Marius Dähler",
      email: "mariusdaehler@daehler-fruechte.ch",
      image: "/images/team/mariusdaehler.jpg",
    },
    {
      id: "markus",
      name: "Markus Dähler jun.",
      email: "markusdaehler@daehler-fruechte.ch",
      image: "/images/team/markusdaehler.jpg",
    },
    {
      id: "marius-jun",
      name: "Marius Dähler jun.",
      email: "mariusdaehler.jun@daehler-fruechte.ch",
      image: "/images/team/mariusdaehlerjun.jpg",
    },
  ],
} as const;

export type TeamMember = (typeof company.team)[number];
