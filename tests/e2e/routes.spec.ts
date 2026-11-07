import { expect, test } from "@playwright/test";

const SITE_URL = "https://dahler-orcin.vercel.app";

const routes = [
  {
    path: "/",
    heading: "Frische Exoten, jeden Tag in der ganzen Schweiz.",
    title: "Dähler Früchte – Exoten, Früchte und Gemüse aus aller Welt",
  },
  { path: "/produkte", heading: "Unsere Produkte", title: "Produkte – Dähler Früchte" },
  { path: "/dienstleistungen", heading: "Unsere Services", title: "Services – Dähler Früchte" },
  { path: "/ueber-uns", heading: "Unsere Philosophie", title: "Über uns – Dähler Früchte" },
  { path: "/daehler-story", heading: "Dähler Story", title: "Dähler Story – Dähler Früchte" },
  {
    path: "/kontakt",
    heading: "Sprechen wir über Ihre nächste Lieferung.",
    title: "Kontakt – Dähler Früchte",
  },
  { path: "/datenschutz", heading: "Datenschutz", title: "Datenschutz – Dähler Früchte" },
];

test("homepage loads without runtime errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error" && !/fonts\.(googleapis|gstatic)\.com/.test(message.text())) {
      errors.push(message.text());
    }
  });

  await page.goto("/");
  await expect(page.locator("h1")).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Menü" }).first()).toBeVisible();
  await expect(page.locator('a[href="/produkte"]').first()).toBeVisible();
  await expect(page.locator("html")).toHaveAttribute("lang", "de-CH");
  expect(errors).toEqual([]);
});

for (const route of routes) {
  test(`${route.path} renders a unique title, canonical and social metadata`, async ({ page }) => {
    await page.goto(route.path);

    await expect(page.locator("h1").first()).toHaveText(route.heading);
    await expect(page).toHaveTitle(route.title);

    const canonical = await page.locator('link[rel="canonical"]').getAttribute("href");
    expect(canonical).toBe(`${SITE_URL}${route.path}`);

    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      "content",
      route.title,
    );
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute("content", canonical);
    await expect(page.locator('meta[name="twitter:card"]')).toHaveAttribute(
      "content",
      "summary_large_image",
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
      "content",
      /^https:\/\/dahler-orcin\.vercel\.app\/images\/.+\.jpg$/,
    );
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "index, follow");
  });
}

test("page titles and descriptions are unique across routes", async ({ page }) => {
  const titles = new Set<string>();
  const descriptions = new Set<string>();

  for (const route of routes) {
    await page.goto(route.path);
    // Wait for the SEO effect to run before reading the head.
    await expect(page).toHaveTitle(route.title);
    titles.add(await page.title());
    descriptions.add(
      (await page.locator('meta[name="description"]').getAttribute("content")) ?? "",
    );
  }

  expect(titles.size).toBe(routes.length);
  expect(descriptions.size).toBe(routes.length);
});

test("unknown routes render the 404 page with noindex and no canonical", async ({ page }) => {
  await page.goto("/diese-seite-gibt-es-nicht");

  await expect(page.locator("h1").first()).toHaveText("Seite nicht gefunden");
  await expect(page).toHaveTitle("Seite nicht gefunden – Dähler Früchte");
  await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, nofollow");
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
});

test("robots.txt and sitemap.xml are served", async ({ request }) => {
  const robots = await request.get("/robots.txt");
  expect(robots.ok()).toBeTruthy();
  expect(await robots.text()).toContain(`${SITE_URL}/sitemap.xml`);

  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.ok()).toBeTruthy();
  const xml = await sitemap.text();
  for (const route of routes) {
    expect(xml).toContain(`${SITE_URL}${route.path === "/" ? "/" : route.path}</loc>`);
  }
});
