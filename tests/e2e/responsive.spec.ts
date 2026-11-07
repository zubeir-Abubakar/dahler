import { expect, test } from "@playwright/test";

const viewports = [
  { width: 390, height: 844, label: "mobile" },
  { width: 768, height: 1024, label: "tablet" },
  { width: 1440, height: 900, label: "desktop" },
];

const routes = ["/", "/produkte", "/daehler-story", "/kontakt"];

for (const viewport of viewports) {
  test(`${viewport.label} layout has no horizontal overflow`, async ({ page }) => {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });

    for (const route of routes) {
      await page.goto(route);
      await expect(page.locator("h1").first()).toBeVisible();

      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > window.innerWidth + 1,
      );
      expect(overflow, `horizontal overflow at ${viewport.width}px on ${route}`).toBe(false);
    }
  });
}

test("the mobile menu trigger replaces desktop navigation below the breakpoint", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  await expect(page.getByRole("button", { name: "Menü öffnen" })).toBeVisible();
  await expect(page.locator('header nav a[href="/produkte"]')).toBeHidden();

  await page.setViewportSize({ width: 1440, height: 900 });
  await expect(page.getByRole("button", { name: "Menü öffnen" })).toBeHidden();
  await expect(page.locator('header nav a[href="/produkte"]')).toBeVisible();
});

test("hero imagery loads on the homepage", async ({ page }) => {
  await page.goto("/");
  const hero = page.locator('img[src="/images/hero/hero-market.jpg"]').first();
  await expect(hero).toBeVisible();
  await expect
    .poll(() => hero.evaluate((image: HTMLImageElement) => image.naturalWidth))
    .toBeGreaterThan(0);
});
