/**
 * Company information reproduced from daehler-fruechte.ch (Kontakt / Über uns).
 * Nothing here is inferred: no email address is published because none could be
 * verified. These values are not re-confirmed for this independent concept; see
 * "Company data that still requires confirmation from Dähler" in README.md.
 */
export const company = {
  brand: "Dähler Früchte",
  legalName: "Brasil Frucht Export AG",
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
  mapsQuery: "Brasil Frucht Export AG, Eichhof, 8558 Raperswilen, Switzerland",
  mapsEmbed:
    "https://www.google.com/maps?q=Brasil+Frucht+Export+AG,+Eichhof,+8558+Raperswilen,+Switzerland&output=embed",
  mapsDirections:
    "https://www.google.com/maps/dir/?api=1&destination=Eichhof%2C+8558+Raperswilen%2C+Switzerland",
  team: [
    { id: "marius", name: "Marius Dähler" },
    { id: "markus", name: "Markus Dähler jun." },
    { id: "marius-jun", name: "Marius Dähler jun." },
  ],
} as const;

export type TeamMember = (typeof company.team)[number];
