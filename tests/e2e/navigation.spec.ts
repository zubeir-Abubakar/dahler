import { expect, test } from "@playwright/test";

test("desktop navigation reaches every main page", async ({ page }) => {
  await page.goto("/");

  const destinations = [
    { label: "Produkte", path: "/produkte", heading: "Unsere Produkte" },
    { label: "Services", path: "/dienstleistungen", heading: "Unsere Services" },
    { label: "Über uns", path: "/ueber-uns", heading: "Unsere Philosophie" },
    { label: "Story & Bilder", path: "/daehler-story", heading: "Dähler Story" },
    { label: "Kontakt", path: "/kontakt", heading: "Sprechen wir über Ihre nächste Lieferung." },
  ];

  for (const destination of destinations) {
    await page.locator(`header nav a[href="${destination.path}"]`).click();
    await expect(page).toHaveURL(new RegExp(`${destination.path}$`));
    await expect(page.locator("h1").first()).toHaveText(destination.heading);
  }
});

test("the skip link moves focus to the main landmark", async ({ page }) => {
  await page.goto("/");
  // Wait for the suspended route to mount so the skip link is in the tab order.
  await expect(page.locator("h1").first()).toBeVisible();
  await page.keyboard.press("Tab");

  const skipLink = page.locator('a[href="#main"]');
  await expect(skipLink).toBeFocused();
  await expect(skipLink).toBeVisible();

  await page.keyboard.press("Enter");
  await expect(page.locator("#main")).toBeFocused();
});

test("mobile menu traps focus, locks scrolling, closes with Escape and navigates", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");

  const toggle = page.getByRole("button", { name: "Menü öffnen" });
  await toggle.click();

  const menu = page.locator("#mobile-menu");
  await expect(menu).toBeVisible();
  await expect(menu).toHaveAttribute("aria-modal", "true");
  await expect(page.evaluate(() => getComputedStyle(document.body).overflow)).resolves.toBe(
    "hidden",
  );

  const firstMenuLink = menu.locator("nav a").first();
  await expect(firstMenuLink).toBeFocused();

  // Focus must stay inside the dialog or on its trigger while tabbing.
  await page.keyboard.press("Shift+Tab");
  await expect(
    page.evaluate(() => {
      const menu = document.querySelector("#mobile-menu");
      const active = document.activeElement;
      return (
        Boolean(menu?.contains(active)) || active?.getAttribute("aria-controls") === "mobile-menu"
      );
    }),
  ).resolves.toBe(true);

  await page.keyboard.press("Escape");
  await expect(menu).toBeHidden();
  await expect(page.getByRole("button", { name: "Menü öffnen" })).toBeFocused();

  await page.getByRole("button", { name: "Menü öffnen" }).click();
  await menu.locator('a[href="/kontakt"]').click();
  await expect(page).toHaveURL(/\/kontakt$/);
  await expect(menu).toBeHidden();
});

test("desktop layout hides the mobile trigger", async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  await expect(page.getByRole("button", { name: "Menü öffnen" })).toBeHidden();
  await expect(page.locator('header nav a[href="/produkte"]')).toBeVisible();
});
